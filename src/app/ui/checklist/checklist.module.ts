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
} from '../checkbox';

import {
  HideUntilModule
} from '../hide-until';

import { ChecklistComponent } from './checklist.component';

@NgModule({
  imports: [
    CheckboxModule,
    CommonModule,
    FormsModule,
    HideUntilModule,
    ReactiveFormsModule
  ],
  declarations: [
    ChecklistComponent
  ],
  exports: [
    ChecklistComponent
  ]
})
export class ChecklistModule { }