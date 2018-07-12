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
  CheckboxModule,
  FormFieldModule,
  GridModule,
  IconModule,
  ModalModule
} from '../../../modules';

import {
  GiftEditComponent
} from './gift-edit.component';

@NgModule({
  imports: [
    CheckboxModule,
    CommonModule,
    FormFieldModule,
    FormsModule,
    GridModule,
    IconModule,
    ModalModule,
    ReactiveFormsModule
  ],
  declarations: [
    GiftEditComponent
  ],
  exports: [
    GiftEditComponent
  ]
})
export class GiftEditModule { }