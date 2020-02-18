import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClinicaRespuesta } from '../entities/clinicaRespuesta';
import { Error } from '../entities/error';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {

  private baseUrl = "http://localhost:57171/api/Clinica";
  constructor(private http: HttpClient) { }

  clinicaAdd(idUsuario: string, nombre: string, razonSocial: string, 
    infoGeneral: string, estado: number) {
    return this.http.post<any>(`${this.baseUrl}/InsertarClinica`, {
      "idUsuario": idUsuario, 
      "nombre": nombre,
      "razonSocial": razonSocial,
      "infoGeneral": infoGeneral,
      "estado": estado}).pipe(map(res => {
        return res;
      }));
  }

  clinicaListar(idUsuario: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${idUsuario}`).pipe(
      map((res: ClinicaRespuesta) => res.clinicas));
  }
}
