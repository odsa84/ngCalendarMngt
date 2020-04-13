import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private baseUrl = "http://localhost:57171/api/Especialidad";
  constructor(private http: HttpClient) { }

  espAdd(especialidad1: string, descripcion: string, estado: number) {
    return this.http.post<any>(`${this.baseUrl}/InsertarTitulo`, {
      "especialidad1": especialidad1,
      "descripcion": descripcion,
      "estado": estado}).pipe(map(res => {
        return res;
      }));
  }

  especialidades(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ConsultarEspecialidad`, {}).pipe(
      map(res => {
        return res;
      }));
  }
}
