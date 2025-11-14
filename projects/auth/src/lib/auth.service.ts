import { Injectable, inject } from '@angular/core';
import { AuthAPI } from './base/AuthAPI';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthEndPoint } from './enums/authEndPoint';
import { AuthAPIAdaptorService } from './adaptor/auth-api.adaptor';

@Injectable({
  providedIn: 'root',
})

export class AuthService implements AuthAPI {

  _httpClient = inject(HttpClient);
  _authAPIAdaptorService = inject(AuthAPIAdaptorService);
  
  login(data: any): Observable<any> {
    return this._httpClient.post(AuthEndPoint.LOGIN, data)
      .pipe(map((response: any) => this._authAPIAdaptorService.adapt(response)),
      catchError(err => of(err))); // Another way to handle error is to use catchError((error: any) => throwError(() => new Error(error.message))));
  }
  
}
