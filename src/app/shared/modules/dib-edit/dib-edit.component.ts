import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { AlertService } from '@giftdibs/ux';
import { ModalInstance } from '@giftdibs/ux';

import { Dib, DibService } from '../dib';
import { Gift } from '../gift';

import { DibEditContext } from './dib-edit-context';

@Component({
  selector: 'gd-dib-edit',
  templateUrl: './dib-edit.component.html',
  styleUrls: ['./dib-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DibEditComponent implements OnInit {
  public dib: Dib;
  public errors: any[];
  public gift: Gift;
  public dibForm: UntypedFormGroup;
  public isLoading = false;

  constructor(
    private alertService: AlertService,
    private changeDetector: ChangeDetectorRef,
    private context: DibEditContext,
    private dibService: DibService,
    private formBuilder: UntypedFormBuilder,
    private modal: ModalInstance<any>
  ) {}

  public ngOnInit(): void {
    this.gift = this.context.gift;
    this.dib = this.context.dib;
    this.createForm();

    if (this.dib) {
      this.dibForm.reset(this.dib);
    }
  }

  public onCancelClicked(): void {
    this.modal.close('cancel');
  }

  public submit(): void {
    if (this.dibForm.disabled) {
      return;
    }

    this.dibForm.disable();
    this.isLoading = true;
    this.errors = [];
    this.changeDetector.markForCheck();

    const formData: Dib = this.dibForm.value;

    let obs: any;
    if (this.dib) {
      obs = this.dibService.update(this.dib.id, formData);
    } else {
      obs = this.dibService.create(this.gift.id, formData);
    }

    obs.subscribe(
      (result: any) => {
        this.modal.close('save', {
          dibId: result.data.dibId,
        });
      },
      (err: any) => {
        const error = err.error;
        this.alertService.error(error.message);
        this.errors = error.errors;
        this.dibForm.enable();
        this.isLoading = false;
        this.changeDetector.markForCheck();
      }
    );
  }

  private createForm(): void {
    this.dibForm = this.formBuilder.group({
      giftId: new UntypedFormControl(this.gift.id),
      isAnonymous: false,
      notes: undefined,
      pricePaid: undefined,
      quantity: 1,
    });
  }
}
