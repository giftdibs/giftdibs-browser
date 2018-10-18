import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    TabsComponent,
    TabComponent
  ],
  declarations: [
    TabsComponent,
    TabComponent
  ]
})
export class TabsModule { }
