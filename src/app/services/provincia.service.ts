import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../utils/constantes';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  private baseUrl = Constantes.SERVER_URI + "api/Provincia";

  constructor(private http: HttpClient) { }

  provincias(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ConsultarProvincia`, {})
    .pipe(
      map(res => {
        return res;
      }));
  }
}
