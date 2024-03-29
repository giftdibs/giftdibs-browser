import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Dib } from './dib';

@Injectable({ providedIn: 'root' })
export class DibService {
  private resourceUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public create(giftId: string, formData: Dib): Observable<any> {
    return this.http.post(`${this.resourceUrl}/gifts/${giftId}/dibs`, formData);
  }

  public getAllRecipients(isDelivered = false): Observable<any> {
    const status = isDelivered ? '?status=delivered' : '';
    return this.http.get(`${this.resourceUrl}/dibs/recipients${status}`).pipe(
      map((result: any) => result.data),
      share()
    );
  }

  public markAsDelivered(dibId: string): Observable<any> {
    return this.http.post(`${this.resourceUrl}/dibs/${dibId}/delivered`, {});
  }

  // public getAllByGiftId(giftId: string): Observable<Dib[]> {
  //   return this.http.get(`${this.resourceUrl}?giftId=${giftId}`)
  //     .pipe(
  //       map((result: any) => result.data.dibs),
  //       share()
  //     );
  // }

  // public getAllByWishListId(wishListId: string): Observable<Dib[]> {
  //   return this.http.get(`${this.resourceUrl}?wishListId=${wishListId}`)
  //     .pipe(
  //       map((result: any) => result.data.dibs),
  //       share()
  //     );
  // }

  // public getById(giftId: string): Observable<Dib> {
  //   return this.http.get(`${this.resourceUrl}/${giftId}`)
  //     .pipe(
  //       map((result: any) => result.data.gift),
  //       share()
  //     );
  // }

  public remove(dibId: string): Observable<any> {
    return this.http.delete(`${this.resourceUrl}/dibs/${dibId}`);
  }

  public update(dibId: string, formData: Dib): Observable<any> {
    return this.http.patch(`${this.resourceUrl}/dibs/${dibId}`, formData);
  }
}
