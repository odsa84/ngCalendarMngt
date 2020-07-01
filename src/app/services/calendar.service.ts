import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../utils/constantes';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  
  private baseUrl = Constantes.SERVER_URI + "api/Calendario";
  
  constructor(private http: HttpClient) { }

  calendarioAdd(datosEntrada: any) {
    return this.http.post<any>(`${this.baseUrl}/InsertarCalendario`, datosEntrada)
    .pipe(
      map(res => {
        return res;
      }));
  }

  calendarioUpdate(datosEntrada: any) {
    return this.http.post<any>(`${this.baseUrl}/UpdateCalendario`, datosEntrada)
    .pipe(
      map(res => {
        return res;
      }));
  }

  calendarios(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ConsultarCalendario`, {})
    .pipe(
      map(res => {
        return res;
      }));
  }

  calendariosPorClinica(idClinica: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/PorClinica`, {"id": idClinica})
    .pipe(
      map(res => {
        return res;
      }));
  }

  calendariosPorClinicaAgendadas(idClinica: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/PorClinicaAgendadas`, {"id": idClinica})
    .pipe(
      map(res => {
        return res;
      }));
  }

  calendariosPorDoctor(idDoctor: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/PorDoctor`, {"id": idDoctor})
    .pipe(
      map(res => {
        return res;
      }));
  }

  calendariosPorCliente(idCliente: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/PorCliente`, {"id": idCliente})
    .pipe(
      map(res => {
        return res;
      }));
  }

  citasAgendadas(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/CitasAgendadas`, {})
    .pipe(
      map(res => {
        return res;
      }));
  }

  calendarClientes(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ConsultarClientes`, {})
    .pipe(
      map(res => {
        return res;
      }));
  }

  crearEntradaInsertar(fechaInicio: string, fechaFin: string, idDoctor: number, 
    idCliente: number, idClinica: number, sintomas: string, diagnostico: string,
    indicaciones: string): any {
    return {
      "inicioFechaHora": fechaInicio,
      "finFechaHora": fechaFin,
      "idDoctor": idDoctor,
      "idEstado": 1,
      "idClinica": idClinica,
      "idCliente": idCliente,
      "sintomas": sintomas,
      "diagnostico": diagnostico,
      "indicaciones": indicaciones,
    }
  }

  crearEntradaUpdate(id: number, fechaInicio: string, fechaFin: string, idDoctor: number, 
    idEstado: number, idCliente: number, idClinica: number, sintomas: string, diagnostico: string,
    indicaciones: string): any {
    return {
      "id": id,
      "inicioFechaHora": fechaInicio,
      "finFechaHora": fechaFin,
      "idDoctor": idDoctor,
      "idEstado": idEstado,
      "idClinica": idClinica,
      "idCliente": idCliente,
      "sintomas": sintomas,
      "diagnostico": diagnostico,
      "indicaciones": indicaciones,
    }
  }
}

