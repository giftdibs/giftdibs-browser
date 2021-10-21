import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DibService } from '@app/shared/modules/dib';
import { DibEditComponent, DibEditModule } from '@app/shared/modules/dib-edit';
import {
  ConfirmModule,
  DropdownMenuModule,
  IconModule,
  NoticeModule,
} from '@giftdibs/ux';

import { DibControlsComponent } from './dib-controls.component';

@NgModule({
  imports: [
    CommonModule,
    ConfirmModule,
    DibEditModule,
    DropdownMenuModule,
    IconModule,
    NoticeModule,
    RouterModule,
  ],
  declarations: [DibControlsComponent],
  exports: [DibControlsComponent],
  providers: [DibService],
  entryComponents: [DibEditComponent],
})
export class DibControlsModule {}
