import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstadosCitaService {

  private baseUrl = "http://localhost:57171/api/Estado";
  constructor(private http: HttpClient) { }

  estados(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ConsultarEstado`, {}).pipe(
      map(res => {
        return res;
      }));
  }
}
