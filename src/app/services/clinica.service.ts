import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constantes } from '../utils/constantes';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmailValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {

  private baseUrl = Constantes.SERVER_URI + "api/Clinica";
  constructor(
    private http: HttpClient
    ) { }

  clinicaAdd(datosEntrada) {
    return this.http.post<any>(`${this.baseUrl}/InsertarClinica`, datosEntrada).pipe(map(res => {
        return res;
      }));
  }

  /*clinicaListar(idUsuario: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${idUsuario}`).pipe(
      map((res: ClinicaRespuesta) => res.clinicas));
  }*/

  clinicaListar(idUsuario: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${idUsuario}`).pipe(
      map(res => {
        return res;
      }));
  }

  clinicaListarDoctor(idDoctor: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/doctor/${idDoctor}`).pipe(
      map(res => {
        return res;
      }));
  }

  clinicas(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ConsultarClinica`, {}).pipe(
      map(res => {
        return res;
      }));
  }

  clinicaPorId(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ClinicaPorId`, {"id": id}).pipe(
      map(res => {
        return res;
      }));
  }

  filtrarPorCiudadEspecialidad(idCiudad: number, idEsp: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/PorCiudadEsp`, {"idCiudad": idCiudad, "idEspecialidad": idEsp}).pipe(
      map(res => {
        return res;
      }));
  }

  filtrarPorCiudad(idCiudad: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/PorCiudad`, {"idCiudad": idCiudad}).pipe(
      map(res => {
        return res;
      }));
  }

  filtrarPorEspecialidad(idEsp: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/PorEspecialidad`, {"idEspecialidad": idEsp}).pipe(
      map(res => {
        return res;
      }));
  }

  eliminar(datosEntrada): Observable<any> {
    console.log(datosEntrada);
    return this.http.post<any>(`${this.baseUrl}/ActualizarClinica`, datosEntrada).pipe(
      map(res => {
        return res;
      }));
  }

  crearEntradaInsertarClinica(idUsuario: string, nombre: string, telefono: string, email: string,
    razonSocial:  string, infoGeneral: string, direccion: string, referencia: string, idProvincia: number, 
    idCiudad: number, estado: boolean): any {
    return {
      "idUsuario": idUsuario, 
      "nombre": nombre,
      "telefono": telefono,
      "email": email,
      "razonSocial": razonSocial,
      "infoGeneral": infoGeneral,
      "direccion": direccion,
      "referencia": referencia,
      "idCiudad": idCiudad,
      "idProvincia": idProvincia,
      "estado": estado
    }
  }

  crearEntradaActualizarClinica(id: number, idUsuario: string, nombre: string, telefono: string, email: string,
    razonSocial:  string, infoGeneral: string, direccion: string, referencia: string, idProvincia: number, 
    idCiudad: number, estado: boolean): any {
    return {
      "id": id,
      "idUsuario": idUsuario, 
      "nombre": nombre,
      "telefono": telefono,
      "email": email,
      "razonSocial": razonSocial,
      "infoGeneral": infoGeneral,
      "direccion": direccion,
      "referencia": referencia,
      "idCiudad": idCiudad,
      "idProvincia": idProvincia,
      "estado": estado
    }
  }
}
