import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionUser } from '@giftdibs/session';

import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private resourceUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  public getAll(): Observable<User[]> {
    return this.http.get(this.resourceUrl).pipe(
      map((result: any) => result.data.users),
      share()
    );
  }

  public getById(id: string): Observable<User> {
    return this.http.get(`${this.resourceUrl}/${id}`).pipe(
      map((result: any) => result.data.user),
      share()
    );
  }

  public update(id: string, formData: SessionUser): Observable<any> {
    return this.http.patch(`${this.resourceUrl}/${id}`, formData);
  }
}
