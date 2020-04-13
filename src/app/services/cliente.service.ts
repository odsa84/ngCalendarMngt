import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseUrl = "http://localhost:57171/api/Cliente";

  constructor(private http: HttpClient) { }

  clienteAdd(datosEntrada): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/InsertarCliente`, datosEntrada)
    .pipe(
      map(res => {
        return res;
      }));
  }

  clienteActualizar(datosEntrada): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/UpdateCliente`, datosEntrada)
    .pipe(
      map(res => {
        return res;
      }));
  }

  clinicaListar(idUsuario: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${idUsuario}`)
    .pipe(
      map(res => {
        return res;
      }));
  }

  clientes(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ConsultarCliente`, {})
    .pipe(
      map(res => {
        return res;
      }));
  }

  clientePorId(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/PorId`, { "id": id })
    .pipe(
      map(res => {
        return res;
      }));
  }

  clientePorCedula(cedula: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/PorCedula`, { "cedula": cedula })
    .pipe(
      map(res => {
        return res;
      }));
  }

  crearEntradaInsertar(nombres: string, apellidos: string, cedula: string, 
    email: string, telefono: string): any {
    return {
      "nombres": nombres,
      "apellidos": apellidos,
      "cedula": cedula,
      "email": email,
      "telefono": telefono,
      "estado": true
    }
  }

  crearEntradaActualizar(id: number, nombres: string, apellidos: string, cedula: string, 
    email: string, telefono: string, sintomas: string, diagnostico: string, 
    indicaciones: string): any {
    return {
      "id": id,
      "nombres": nombres,
      "apellidos": apellidos,
      "cedula": cedula,
      "email": email,
      "telefono": telefono,
      "sintomas": sintomas,
      "diagnostico": diagnostico,
      "indicaciones": indicaciones,
      "estado": true
    }
  }

  convertirEstado(estado: number): boolean {
    if(estado == 1) {
      return true;
    }
    return false;
  }
}
