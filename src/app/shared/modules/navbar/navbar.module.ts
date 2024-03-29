import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  BadgeModule,
  DropdownMenuModule,
  MediaModule,
  ThumbnailModule,
} from '@giftdibs/ux';
import { IconModule } from '@giftdibs/ux';

import { SearchModule } from 'src/app/shared/modules/search';

import { NotificationsModule } from '../notifications';

import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [
    BadgeModule,
    CommonModule,
    DropdownMenuModule,
    IconModule,
    MediaModule,
    RouterModule,
    NotificationsModule,
    SearchModule,
    ThumbnailModule,
  ],
  exports: [NavbarComponent],
  declarations: [NavbarComponent],
})
export class NavbarModule {}
