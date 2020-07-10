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

  actualizarDisponibilidad(id: number, idDoctor: number, idClinica: number, disp: boolean) {
    return this.http.post<any>(this.baseUrl + '/ActualizarDisponibilidad', {"id": id, "horaInicio": "",
    "horaFin": "", "fecha": "", "idDoctor": idDoctor, "idClinica": idClinica,  "disponible": disp})
    .pipe(
      map(res => {
        return res;
      }))
  }

  consultarActualizarDisponibilidad(id: number, idDoctor: number, idClinica: number, disp: boolean) {
    return this.http.post<any>(this.baseUrl + '/ConsultarActualizarDisponibilidad', {"id": id, "horaInicio": "",
    "horaFin": "", "fecha": "", "idDoctor": idDoctor, "idClinica": idClinica,  "disponibilidad": disp})
    .pipe(
      map(res => {
        return res;
      }))
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

  consultarPorDoctorClinicaFecha(idDoctor: number, idClinica: number, fecha: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/ConsultarPorDoctorClinicaFecha', 
      { "idDoctor": idDoctor, "idClinica": idClinica, "fecha": fecha })
    .pipe(
      map(res => {
        return res;
      }));
  }

}
