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
import { AlertService } from '@giftdibs/ux';

import { AccountService } from '../account.service';

@Component({
  selector: 'gd-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  public registerForm: UntypedFormGroup;
  public errors: any[] = [];
  public isLoading = false;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private changeDetector: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  public submit(): void {
    if (this.registerForm.disabled) {
      return;
    }

    this.isLoading = true;
    this.registerForm.disable();
    this.errors = [];
    this.changeDetector.markForCheck();

    this.accountService.register(this.registerForm.value).subscribe(
      (result: any) => {
        this.router.navigate(['/users', result.data.userId]);
      },
      (err: any) => {
        const error = err.error;

        // Spam control
        if (error.code === 108) {
          this.router.navigate(['/page-not-found']);
          return;
        }

        this.alertService.error(error.message);
        this.errors = error.errors;
        this.registerForm.enable();
        this.isLoading = false;
        this.changeDetector.markForCheck();
      }
    );
  }

  private createForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: new UntypedFormControl(null, [Validators.required]),
      lastName: new UntypedFormControl(null, [Validators.required]),
      gdNickname: null,
      emailAddress: new UntypedFormControl(null, [Validators.required]),
      password: new UntypedFormControl(null, [Validators.required]),
    });
  }
}
