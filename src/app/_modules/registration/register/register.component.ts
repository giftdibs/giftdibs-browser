import {
  Component
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { RegistrationService } from '../registration.service';

@Component({
  selector: 'gd-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  public registerForm: FormGroup;
  public errors: any[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService
  ) {
    this.createForm();
  }

  public submit(): void {
    if (this.registerForm.disabled) {
      return;
    }

    this.registerForm.disable();
    this.registrationService
      .register(this.registerForm.value)
      .subscribe(
        (result: any) => {
          alert(result.message);
          this.router.navigate(['/login']);
          this.registerForm.enable();
        },
        (err: any) => {
          const error = err.error;

          if (error.code === 108) {
            this.router.navigate(['/page-not-found']);
            return;
          }

          alert(error.message);
          this.errors = error.errors;
          this.registerForm.enable();
        }
      );
  }

  private createForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: new FormControl(null, [
        Validators.required
      ]),
      lastName: new FormControl(null, [
        Validators.required
      ]),
      gdNickname: null,
      emailAddress: new FormControl(null, [
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required
      ])
    });
  }
}
