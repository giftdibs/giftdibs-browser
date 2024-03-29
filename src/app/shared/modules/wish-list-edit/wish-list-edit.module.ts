import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ConfirmModule,
  FormFieldModule,
  ModalModule,
  NoticeModule,
  WaitModule,
} from '@giftdibs/ux';

import { PrivacySelectorModule } from '../privacy-selector';

import { WishListEditComponent } from './wish-list-edit.component';

@NgModule({
  imports: [
    CommonModule,
    ConfirmModule,
    FormFieldModule,
    FormsModule,
    ModalModule,
    NoticeModule,
    PrivacySelectorModule,
    ReactiveFormsModule,
    WaitModule,
  ],
  declarations: [WishListEditComponent],
})
export class WishListEditModule {}
