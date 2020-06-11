import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../utils/constantes';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  private baseUrl = Constantes.SERVER_URI + "api/Ciudad";

  constructor(private http: HttpClient) { }

  ciudadPorProvincia(idProvincia: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/PorProvincia`, {"id": idProvincia})
    .pipe(
      map(res => {
        return res;
      }));
  }
}
