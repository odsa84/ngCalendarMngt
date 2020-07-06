import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../utils/constantes';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HorasLaboralesService {

  private baseUrl = Constantes.SERVER_URI + "api/HorasLaborales";
  
  constructor(private http: HttpClient) { }

  horasLaboralesAdd(toDeleteEvent: any, horas: any, idDoctor: number, idClinica: number) {
    return this.http.post<any>(this.baseUrl + '/InsertarHorasLaborales', {toDeleteEvent, horas, idClinica, idDoctor})
    .pipe(
      map(res => {
        return res;
      }));
  }

  consultarPorDoctor(idDoctor: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/ConsultarPorDoctor', { "id": idDoctor })
    .pipe(
      map(res => {
        return res;
      }));
  }

  consultarPorDoctorClinica(idDoctor: number, idClinica: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/ConsultarPorDoctorClinica', 
      { "idDoctor": idDoctor, "idClinica": idClinica })
    .pipe(
      map(res => {
        return res;
      }));
  }

  consultarPorDoctorFecha(idDoctor: number, fecha: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/ConsultarPorDoctorFecha', 
      { "idDoctor": idDoctor, "fecha": fecha })
    .pipe(
      map(res => {
        return res;
      }));
  }

}
