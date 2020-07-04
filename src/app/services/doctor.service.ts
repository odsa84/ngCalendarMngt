import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../utils/constantes';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DoctorRespuesta } from '../entities/doctorRespuesta';
import { Error } from '../entities/error';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private baseUrl = Constantes.SERVER_URI + "api/Doctor";

  constructor(
    private http: HttpClient
    ) { }

  doctorAdd(datosEntrada: any) {
    return this.http.post<any>(`${this.baseUrl}/InsertarDoctor`, datosEntrada)
    .pipe(map(res => {
        return res;
      }));
  }

  doctorListar(idClinica: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Clinica/${idClinica}`).pipe(
      map((res: DoctorRespuesta) => res.doctores));
  }

  doctores(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ConsultarDoctor`, {}).pipe(map(res => {
      return res;
    }));
  }

  crearEntradaInsertarDoctor(nombres: string, apellidos: string, telefono: string, email: string,
    pass: string, infoGeneral: string, clinicaDoctor: any, 
    doctorEspecialidad: any, doctorTitulo: any): any {
    return {
      "nombres": nombres,
      "apellidos": apellidos,
      "telefono": telefono,
      "email": email,
      "password": pass,
      "infoGeneral": infoGeneral,
      "estado": true,
      "calendario": null,
      "clinicaDoctor": clinicaDoctor,
      "doctorEspecialidad": doctorEspecialidad,
      "doctorTitulo": doctorTitulo
    }
  }

  /*consultarPorClinica(idClinica: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Clinica/${idClinica}`);
  }*/

  consultarPorClinica(idClinica: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Clinica/${idClinica}`)
    .pipe(map(res => {
      return res;
    }));
  }

  consultarPorCiudadClinicaEspecialidad(idCiudad: number, idClinica: number, idEsp: number): Observable<any> {
    if(idCiudad === null) {
      idCiudad = 0;
    }
    if(idEsp === null) {
      idEsp = 0;
    }
    return this.http.post<any>(this.baseUrl + '/PorCiudadClinicaEsp', {"idCiudad": idCiudad, "idClinica": idClinica, "idEspecialidad": idEsp})
    .pipe(map(res => {
      return res;
    }));
  }
}
