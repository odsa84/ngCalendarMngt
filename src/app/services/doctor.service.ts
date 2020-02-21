import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DoctorRespuesta } from '../entities/doctorRespuesta';
import { Error } from '../entities/error';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private baseUrl = "http://localhost:57171/api/Doctor";

  constructor(
    private http: HttpClient
    ) { }

  doctorAdd(datosEntrada: any) {
    console.log(datosEntrada)
    return this.http.post<any>(`${this.baseUrl}/InsertarDoctor`, datosEntrada)
    .pipe(map(res => {
        return res;
      }));
  }

  doctorListar(idClinica: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${idClinica}`).pipe(
      map((res: DoctorRespuesta) => res.doctores));
  }

  crearEntradaInsertarDoctor(nombres: string, apellidos: string, infoGeneral: string, estado: number, 
    clinicaDoctor: any, doctorEspecialidad: any, doctorTitulo: any): any {
    return {
      "nombres": nombres,
      "apellidos": apellidos,
      "infoGeneral": infoGeneral,
      "estado": this.convertirEstado(estado),
      "calendario": null,
      "clinicaDoctor": clinicaDoctor,
      "doctorEspecialidad": doctorEspecialidad,
      "doctorTitulo": doctorTitulo
    }
  }

  consultarPorClinica(idClinica: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Clinica/${idClinica}`)
    .pipe(map(res => {
      return res;
    }));
  }

  convertirEstado(estado: number): boolean {
    if(estado == 1) {
      return true;
    }
    return false;
  }
}
