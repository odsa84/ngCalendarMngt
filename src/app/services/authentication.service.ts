import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplicationUser } from '../interfaces/ApplicationUser';
import { Constantes } from '../utils/constantes';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private baseUrl = Constantes.SERVER_URI + "api/Auth";


  private currentUserSubject: BehaviorSubject<ApplicationUser>;
  public currentUser: Observable<ApplicationUser>;

  constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<ApplicationUser>(
        JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
   }

   public get currentUserValue(): ApplicationUser {
     return this.currentUserSubject.value;
   }

   login(username: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return user;
      }));
  }

  loginDoctor(username: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/loginDoctor`, { username, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return user;
      }));
  }

  loginCliente(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/loginCliente`, { username, password })
      .pipe(
        map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return user;
      }));
  }

  changePasswordSistema(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/changePasswordSistema`, { username, password })
      .pipe(
        map(res => {
         return res;
        }));
  }

  changePasswordPaciente(email: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/changePasswordPaciente`, { email, oldPassword, newPassword })
      .pipe(
        map(res => {
         return res;
        }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  sendEmail(toEmail: string, bodyEmail: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sendEmail`, { toEmail, bodyEmail })
    .pipe(
      map(res => {
        return res;
      }));
  }
}
