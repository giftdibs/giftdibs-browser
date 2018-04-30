import {
  Injectable
} from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { environment } from '../environments/environment';

import {
  SessionService
} from './modules/session';

@Injectable()
export class AppStartupService {
  private resourceUrl = environment.apiUrl + '/auth';

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) { }

  public load(): Promise<any> {
    const token = this.sessionService.token;
    const headers = new HttpHeaders({ 'Authorization': `JWT ${token}` });

    return this.http
      .post(`${this.resourceUrl}/refresh-token`, {}, { headers })
      .toPromise()
      .then((data: any) => {
        this.sessionService.user = data.authResponse.user;
        this.sessionService.token = data.authResponse.token;
      })
      .catch((err: any) => {
        // Unauthenticated.
        if (err.status === 401) {
          this.sessionService.clearAll();
          return Promise.resolve();
        }

        throw err;
      });
  }
}