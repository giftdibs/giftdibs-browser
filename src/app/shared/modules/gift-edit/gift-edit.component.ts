// #region imports
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertService } from '@giftdibs/ux';
import {
  ModalClosedEventArgs,
  ModalInstance,
  ModalService,
  ModalSize,
  TypeaheadSearchFunction,
  TypeaheadSearchResultAction,
  dataUrlToFile,
  toDataUrl,
} from '@giftdibs/ux';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AssetsService } from 'src/app/shared/modules/assets';
import { Gift, GiftService } from 'src/app/shared/modules/gift';
import { GiftExternalUrl } from 'src/app/shared/modules/gift/gift-external-url';
import { ProductService } from 'src/app/shared/modules/product';
import {
  UrlImagesLoaderComponent,
  UrlImagesLoaderContext,
  UrlScraperResult,
  UrlScraperService,
} from 'src/app/shared/modules/url-scraper';

import { GiftEditContext } from './gift-edit-context';

// #endregion

@Component({
  selector: 'gd-gift-edit',
  templateUrl: './gift-edit.component.html',
  styleUrls: ['./gift-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UrlScraperService],
})
export class GiftEditComponent implements OnInit {
  public get externalUrls(): FormArray {
    return this.giftForm.get('externalUrls') as FormArray;
  }

  public errors: any[];
  public gift: Gift;
  public giftForm: FormGroup;
  public isLoading = false;

  private newImageFile: undefined | any;
  private wishListId: string;

  constructor(
    private alertService: AlertService,
    private assetsService: AssetsService,
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private context: GiftEditContext,
    private giftService: GiftService,
    private modal: ModalInstance<any>,
    private modalService: ModalService,
    private productService: ProductService
  ) {}

  public ngOnInit(): void {
    this.gift = this.context.gift;
    this.wishListId = this.context.wishListId;

    this.createForm();
  }

  public onSelectFile(args: any): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.giftForm.get('imageUrl').setValue(e.target.result);
    };

    reader.readAsDataURL(args.file);
    this.newImageFile = args.file;
  }

  public onRemoveFile(): void {
    if (!this.gift) {
      this.giftForm.get('imageUrl').reset();
      return;
    }

    this.disableForm();

    this.assetsService
      .removeGiftThumbnail(this.gift.id)
      .pipe(
        finalize(() => {
          this.enableForm();
        })
      )
      .subscribe(
        () => {
          this.giftForm.get('imageUrl').reset();
        },
        (err: any) => {
          this.alertService.error(err.error.message);
        }
      );
  }

  public submit(): void {
    if (this.giftForm.disabled) {
      return;
    }

    this.disableForm();
    this.removeEmptyExternalUrls();

    const formData = structuredClone(this.giftForm.value);
    const priority = formData.priority + '';

    formData.priority = parseInt(priority, 10);

    // Remove the image from the form data since it will be handled
    // with a different request.
    delete formData.imageUrl;

    let obs: any;
    if (this.gift) {
      obs = this.giftService.update(this.gift.id, formData);
    } else {
      obs = this.giftService.create(this.wishListId, formData);
    }

    obs.subscribe(
      (result: any) => {
        const giftId = this.gift ? this.gift.id : result.data.giftId;

        if (this.newImageFile) {
          this.uploadImage(this.newImageFile, giftId).subscribe(
            () => {
              this.enableForm();
              this.modal.close('save');
            },
            (err: any) => {
              this.giftService.getById(giftId).subscribe((gift: Gift) => {
                this.gift = gift;
                this.resetForm(this.gift);
                this.enableForm();

                this.alertService.error(err.error.message);
              });
            }
          );
          return;
        }

        this.modal.close('save');
      },
      (err: any) => {
        const error = err.error;
        this.alertService.error(error.message);
        this.errors = error.errors;
        this.enableForm();
      }
    );
  }

  public onCancelClicked(): void {
    this.modal.close('cancel');
  }

  public addExternalUrlField(values?: GiftExternalUrl): void {
    this.externalUrls.push(
      this.formBuilder.group(
        Object.assign(
          {
            price: undefined,
            url: undefined,
          },
          values
        )
      )
    );
  }

  public removeUrl(index: number): void {
    this.externalUrls.removeAt(index);

    // Always make sure there's at least one blank external URL.
    if (!this.externalUrls.length) {
      this.addExternalUrlField({
        url: '',
      });
    }
  }

  public findImageFromUrl(index: number): void {
    const url = this.externalUrls.at(index).value.url;
    this.openUrlImagesLoaderModal(url);
  }

  public findProductInfoFromUrl(url: string): void {
    if (!url) {
      return;
    }

    this.isLoading = true;
    this.changeDetector.markForCheck();

    const context = new UrlImagesLoaderContext();
    context.url = url;
    context.allowUrlEdit = false;

    const modalInstance = this.modalService.open(UrlImagesLoaderComponent, {
      providers: [
        {
          provide: UrlImagesLoaderContext,
          useValue: context,
        },
      ],
      size: ModalSize.Small,
    });

    modalInstance.closed.subscribe((args: ModalClosedEventArgs) => {
      if (args.reason === 'save') {
        this.gift = undefined;

        this.createForm();

        const productDetails: UrlScraperResult = args.data.result;
        const imageDataUrl = args.data.image?.dataUrl;

        if (imageDataUrl) {
          this.giftForm.get('imageUrl').setValue(imageDataUrl);
          this.newImageFile = dataUrlToFile(imageDataUrl);
        }

        this.updateIfEmpty('name', productDetails.name);
        this.updateIfEmpty('budget', productDetails.price);
        this.addExternalUrlIfNew({
          url: productDetails.url,
        });
      }

      this.isLoading = false;
      this.changeDetector.markForCheck();
    });
  }

  public findProductFunction: TypeaheadSearchFunction<any> = (
    searchText: string
  ) => {
    return this.productService.searchByKeyword(searchText);
  };

  public searchResultAction: TypeaheadSearchResultAction = (result: any) => {
    if (!this.giftForm.get('imageUrl').value) {
      toDataUrl(result.imageUrl).then((imageDataUrl: any) => {
        this.giftForm.get('imageUrl').setValue(imageDataUrl);
        this.newImageFile = dataUrlToFile(imageDataUrl);
      });
    }

    this.removeEmptyExternalUrls();

    this.addExternalUrlIfNew({
      url: result.url,
    });

    this.giftForm.get('name').setValue(result.name);
    this.updateIfEmpty('budget', result.price);

    return result.name;
  };

  private createForm(): void {
    this.giftForm = this.formBuilder.group({
      budget: undefined,
      externalUrls: this.formBuilder.array([]) as any,
      imageUrl: new FormControl(),
      name: new FormControl(null, [Validators.required]),
      notes: undefined,
      priority: 3,
      quantity: 1,
    });

    if (this.gift) {
      this.resetForm(this.gift);
    }

    if (!this.externalUrls.length) {
      this.addExternalUrlField({
        url: '',
      });
    }

    this.giftForm.get('imageUrl').valueChanges.subscribe((value) => {
      this.newImageFile = value ? dataUrlToFile(value) : '';
    });
  }

  private uploadImage(file: any, giftId: string): Observable<any> {
    return this.assetsService.uploadGiftThumbnail(file, giftId);
  }

  private resetForm(gift: Gift): void {
    this.giftForm.reset(gift);

    this.giftForm.setControl('externalUrls', this.formBuilder.array([]));

    const control = this.externalUrls;
    gift.externalUrls.forEach((externalUrl: any) => {
      control.push(
        this.formBuilder.group(
          Object.assign(
            {
              url: undefined,
              price: undefined,
            },
            externalUrl
          )
        )
      );
    });
  }

  private openUrlImagesLoaderModal(url: string): void {
    const context = new UrlImagesLoaderContext();
    context.url = url;

    this.giftForm.disable();

    const modalInstance = this.modalService.open(UrlImagesLoaderComponent, {
      providers: [
        {
          provide: UrlImagesLoaderContext,
          useValue: context,
        },
      ],
      size: ModalSize.Small,
    });

    modalInstance.closed.subscribe((args: ModalClosedEventArgs) => {
      if (args.reason === 'save') {
        const productDetails: UrlScraperResult = args.data.result;

        const imageDataUrl = args.data.image.dataUrl;
        this.giftForm.get('imageUrl').setValue(imageDataUrl);
        this.newImageFile = dataUrlToFile(imageDataUrl);

        this.updateIfEmpty('name', productDetails.name);
        this.updateIfEmpty('budget', productDetails.price);
      }

      this.enableForm();
    });
  }

  private enableForm(): void {
    this.isLoading = false;
    this.giftForm.enable();
    this.changeDetector.markForCheck();
  }

  private disableForm(): void {
    this.giftForm.disable({ emitEvent: false });
    this.errors = [];
    this.isLoading = true;
    this.changeDetector.markForCheck();
  }

  private updateIfEmpty(controlName: string, value: any): void {
    const control = this.giftForm.get(controlName);
    if (value !== undefined && !control.value) {
      control.setValue(value);
    }
  }

  private addExternalUrlIfNew(externalUrl: GiftExternalUrl): void {
    const found = this.externalUrls.controls.find((control) => {
      return control.get('url').value === externalUrl.url;
    });

    if (!found) {
      this.addExternalUrlField({
        url: externalUrl.url,
      });

      this.removeEmptyExternalUrls();
    }
  }

  private removeEmptyExternalUrls(): void {
    for (let i = 0, len = this.externalUrls.length; i < len; i++) {
      const control = this.externalUrls.controls[i];
      if (!control || !control.get('url').value) {
        this.externalUrls.removeAt(i);
      }
    }
  }
}
