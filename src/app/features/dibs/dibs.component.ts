import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { finalize } from 'rxjs/operators';
import { DibService } from 'src/app/shared/modules/dib';

@Component({
  selector: 'gd-dibs',
  templateUrl: './dibs.component.html',
  styleUrls: ['./dibs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DibsComponent implements OnInit {
  public recipients: any;
  public isLoading = true;
  public isDeliveredViewActive = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dibService: DibService
  ) {}

  public ngOnInit(): void {
    this.fetchRecipients();
  }

  public onDibChange(): void {
    this.fetchRecipients();
  }

  public showActive(): void {
    this.fetchRecipients(false);
  }

  public showDelivered(): void {
    this.fetchRecipients(true);
  }

  private fetchRecipients(isDelivered = false): void {
    this.isLoading = true;
    this.isDeliveredViewActive = isDelivered;
    this.changeDetector.markForCheck();

    this.dibService
      .getAllRecipients(isDelivered)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetector.markForCheck();
        })
      )
      .subscribe((data: any) => {
        this.recipients = data.recipients;
        this.changeDetector.markForCheck();
      });
  }
}
