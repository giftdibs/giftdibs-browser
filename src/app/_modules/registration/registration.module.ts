import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RegistrationRoutingModule } from './registration-routing.module';
import { RegisterComponent } from './register/register.component';
import { RegistrationService } from './registration.service';
import { FormFieldModule } from '../form-field/form-field.module';
import { PasswordViewerModule } from '../password-viewer/password-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RegistrationRoutingModule,
    FormFieldModule,
    PasswordViewerModule
  ],
  declarations: [
    RegisterComponent
  ],
  providers: [
    RegistrationService
  ],
  exports: [
    RegisterComponent
  ]
})
export class RegistrationModule { }
