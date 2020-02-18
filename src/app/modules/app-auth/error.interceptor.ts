import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private authSrv: AuthenticationService,
        private router: Router
        ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authSrv.logout();
                //location.reload(true);
            } /*else if(err.status === 403) {
                this.router.navigate(['/home']);
            }*/

            const error = err.error.message || err.statusText;
            let msg = "";
            if(error === "Bad credentials") {
                msg = "Email o Contraseña Incorrectos!!!";
            }
            return throwError(msg);
        }))
    }
}

export const errorInterceptorProvider = {
	provide: HTTP_INTERCEPTORS,
	useClass: ErrorInterceptor,
	multi: true
};