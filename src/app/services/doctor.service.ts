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

  constructor(private http: HttpClient) { }

  doctorAdd(nombres: string, apellidos: string, infoGeneral: string, estado: number, 
    clinicaDoctor: any, doctorEspecialidad: any, doctorTitulo: any) {
    return this.http.post<any>(`${this.baseUrl}/InsertarDoctor`, {
      "nombres": nombres,
      "apellidos": apellidos,
      "infoGeneral": infoGeneral,
      "estado": estado,
      "clinicaDoctor": clinicaDoctor,
      "doctorEspecialidad": doctorEspecialidad,
      "doctorTitulo": doctorTitulo
    }).pipe(map(res => {
        return res;
      }));
  }

  doctorListar(idClinica: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${idClinica}`).pipe(
      map((res: DoctorRespuesta) => res.doctores));
  }
}
