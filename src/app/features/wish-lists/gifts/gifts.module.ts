import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  CheckboxModule
} from '../../../modules/checkbox';

import {
  FormFieldModule
} from '../../../modules/form-field';

import {
  ModalModule
} from '../../../modules/modal';

import {
  GiftEditComponent
} from './edit';

import {
  GiftService
} from './gift.service';

@NgModule({
  declarations: [
    GiftEditComponent
  ],
  entryComponents: [
    GiftEditComponent
  ],
  imports: [
    CheckboxModule,
    CommonModule,
    FormFieldModule,
    FormsModule,
    ModalModule,
    ReactiveFormsModule
  ],
  providers: [
    GiftService
  ]
})
export class GiftsModule { }
