import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Notification } from './notification';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private resourceUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getAll(): Observable<Notification[]> {
    return this.http.get(`${this.resourceUrl}/notifications`).pipe(
      map((result: any) => result.data.notifications),
      share()
    );
  }

  public remove(notificationId: string): Observable<any> {
    return this.http.delete(
      `${this.resourceUrl}/notifications/${notificationId}`
    );
  }
}
