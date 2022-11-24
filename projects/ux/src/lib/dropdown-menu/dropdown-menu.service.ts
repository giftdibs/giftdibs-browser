import { Injectable } from '@angular/core';

import { OverlayService } from '../overlay/overlay.service';

import { DropdownMenuConfig } from './dropdown-menu-config';
import { DropdownMenuContext } from './dropdown-menu-context';
import { DropdownMenuInstance } from './dropdown-menu-instance';
import { DropdownMenuComponent } from './dropdown-menu.component';

@Injectable({
  providedIn: 'root',
})
export class DropdownMenuService {
  constructor(private overlayService: OverlayService) {}

  public open(config: DropdownMenuConfig): DropdownMenuInstance {
    const defaults = {
      horizontalAlignment: 'right',
      verticalAlignment: 'bottom',
    };

    const settings = Object.assign({}, defaults, config);
    const context: DropdownMenuContext = {
      config: settings,
    };

    const overlayInstance = this.overlayService.attach(DropdownMenuComponent, {
      providers: [
        {
          provide: DropdownMenuContext,
          useValue: context,
        },
      ],
      preventBodyScroll: false,
      showBackdrop: true,
    });

    const dropdownInstance = new DropdownMenuInstance(overlayInstance);

    dropdownInstance.componentInstance.closed.subscribe(() => {
      overlayInstance.destroy();
    });

    return dropdownInstance;
  }
}
