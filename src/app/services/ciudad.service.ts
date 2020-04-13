import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  private baseUrl = "http://localhost:57171/api/Ciudad";
  constructor(private http: HttpClient) { }

  ciudadPorProvincia(idProvincia: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/PorProvincia`, {"id": idProvincia})
    .pipe(
      map(res => {
        return res;
      }));
  }
}
