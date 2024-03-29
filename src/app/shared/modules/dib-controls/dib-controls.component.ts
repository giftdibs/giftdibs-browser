import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SessionService } from '@giftdibs/session';
import {
  AlertService,
  ConfirmAnswer,
  ConfirmService,
  DropdownMenuItem,
  ModalClosedEventArgs,
  ModalService,
  ModalSize,
} from '@giftdibs/ux';

import { finalize } from 'rxjs/operators';

import { Dib, DibService } from '../dib';
import { DibEditComponent, DibEditContext } from '../dib-edit';
import { Gift } from '../gift';

@Component({
  selector: 'gd-dib-controls',
  templateUrl: './dib-controls.component.html',
  styleUrls: ['./dib-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DibControlsComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public gift: Gift;

  @Output()
  public change = new EventEmitter<void>();

  public sessionUserDib: Dib;
  public isSessionUser = false;
  public isLoading = false;
  public isVisible = false;

  public menuItems: DropdownMenuItem[] = [
    {
      label: 'Edit dib',
      action: () => {
        this.openDibModal();
      },
    },
    {
      label: 'Remove dib...',
      action: () => {
        this.removeDib();
      },
    },
  ];

  constructor(
    private alertService: AlertService,
    private changeDetector: ChangeDetectorRef,
    private confirmService: ConfirmService,
    private dibService: DibService,
    private modalService: ModalService,
    private sessionService: SessionService
  ) {}

  public ngOnInit(): void {
    this.isSessionUser = this.sessionService.isSessionUser(this.gift.user.id);
    this.refreshDib();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.gift = changes.gift.currentValue;
    this.refreshDib();
    this.changeDetector.markForCheck();
  }

  public ngOnDestroy(): void {
    this.change.complete();
  }

  public markAsDelivered(): void {
    this.isLoading = true;
    this.changeDetector.markForCheck();

    this.confirmService.confirm(
      {
        message: 'Are you sure? This action cannot be undone.',
      },
      (answer: ConfirmAnswer) => {
        if (answer.type === 'okay') {
          this.dibService
            .markAsDelivered(this.sessionUserDib.id)
            .pipe(
              finalize(() => {
                this.isLoading = false;
                this.changeDetector.detectChanges();
              })
            )
            .subscribe(
              () => {
                this.refreshDib();
                this.change.emit();
              },
              (err: any) => {
                this.alertService.error(err.error.message);
              }
            );
        } else {
          this.isLoading = false;
          this.changeDetector.detectChanges();
        }
      }
    );
  }

  protected openDibModal(): void {
    this.isLoading = true;
    this.changeDetector.markForCheck();

    const context = new DibEditContext(this.sessionUserDib, this.gift);

    const modalInstance = this.modalService.open(DibEditComponent, {
      providers: [
        {
          provide: DibEditContext,
          useValue: context,
        },
      ],
      size: ModalSize.Small,
    });

    modalInstance.closed.subscribe((args: ModalClosedEventArgs) => {
      if (args.reason === 'save') {
        this.change.emit();
      }

      this.isLoading = false;
      this.changeDetector.markForCheck();
    });
  }

  private refreshDib(): void {
    if (this.gift.dibs) {
      this.sessionUserDib = this.gift.dibs.find((dib) => {
        return dib.user.id === this.sessionService.user.id;
      });
    } else {
      this.sessionUserDib = undefined;
    }

    // Show the dib controls only if the gift quantity is more than the number of dibs.
    let numDibbed = 0;
    if (this.gift.dibs && this.gift.dibs.length) {
      this.gift.dibs.forEach((dib) => {
        numDibbed += dib.quantity;
      });
    }

    this.isVisible = !this.sessionUserDib && numDibbed < this.gift.quantity;
    this.changeDetector.markForCheck();
  }

  private removeDib(): void {
    this.isLoading = true;
    this.changeDetector.markForCheck();

    this.confirmService.confirm(
      {
        message: 'Are you sure you want to remove this dib?',
      },
      (answer: ConfirmAnswer) => {
        if (answer.type === 'okay') {
          this.dibService
            .remove(this.sessionUserDib.id)
            .pipe(
              finalize(() => {
                this.isLoading = false;
                this.changeDetector.markForCheck();
              })
            )
            .subscribe(
              () => {
                this.refreshDib();
                this.change.emit();
              },
              (err: any) => {
                this.alertService.error(err.error.message);
              }
            );
        } else {
          this.isLoading = false;
          this.changeDetector.detectChanges();
        }
      }
    );
  }
}
