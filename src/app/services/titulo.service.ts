import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TituloService {

  private baseUrl = "http://localhost:57171/api/Titulo";
  constructor(private http: HttpClient) { }

  tituloAdd(titulo1: string, estado: number) {
    return this.http.post<any>(`${this.baseUrl}/InsertarTitulo`, {
      "titulo1": titulo1,
      "estado": estado}).pipe(map(res => {
        return res;
      }));
  }

  titulosAll(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ConsultarTitulo`, {}).pipe(
      map(res => {
        return res;
      }));
  }
}
