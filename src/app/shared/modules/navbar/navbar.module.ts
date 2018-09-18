import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterModule
} from '@angular/router';


import {
  BadgeModule,
  DropdownMenuModule,
  IconModule,
  MediaModule,
  SearchModule,
  ThumbnailModule
} from '@app/ui';

import {
  NotificationsModule
} from '../notifications';

import {
  NavbarComponent
} from './navbar.component';

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
    ThumbnailModule
  ],
  exports: [
    NavbarComponent
  ],
  declarations: [
    NavbarComponent
  ]
})
export class NavbarModule { }