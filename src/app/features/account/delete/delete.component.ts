import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '@giftdibs/session';
import { AlertService } from '@giftdibs/ux';

import { AccountService } from '../account.service';

@Component({
  selector: 'gd-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteComponent {
  public isLoading = false;
  public deleteAccountForm: UntypedFormGroup;
  public errors: any[] = [];

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private changeDetector: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sessionService: SessionService
  ) {
    this.createForm();
  }

  public submit(): void {
    if (this.deleteAccountForm.disabled) {
      return;
    }

    this.isLoading = true;
    this.deleteAccountForm.disable();
    this.errors = [];
    this.changeDetector.markForCheck();

    const formData = this.deleteAccountForm.value;
    this.accountService
      .destroyWithPassword(this.sessionService.user.id, formData.password)
      .subscribe(
        (result: any) => {
          this.sessionService.clearAll();
          this.alertService.success(result.message, true);
          this.router.navigate(['/account', 'login']);
        },
        (err: any) => {
          this.errors = err.error.errors;
          this.alertService.error(err.error.message);
          this.deleteAccountForm.enable();
          this.isLoading = false;
          this.changeDetector.markForCheck();
        }
      );
  }

  private createForm(): void {
    this.deleteAccountForm = this.formBuilder.group({
      password: new UntypedFormControl(null, [Validators.required]),
    });
  }
}
