import {
  Injectable
} from '@angular/core';

import {
  CanLoad
} from '@angular/router';

import { SessionService } from './session.service';

@Injectable()
export class IsLoggedInGuard implements CanLoad {
  constructor(
    private sessionService: SessionService
  ) { }

  public canLoad(): boolean  {
    return (this.sessionService.isLoggedIn);
  }
}
