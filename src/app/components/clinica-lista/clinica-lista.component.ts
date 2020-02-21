import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Clinica } from '../../entities/clinica';
import { ClinicaService } from '../../services/clinica.service';
import { AuthenticationService } from '../../services/authentication.service';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../entities/doctor';

@Component({
  selector: 'app-clinica-lista',
  templateUrl: './clinica-lista.component.html',
  styleUrls: ['./clinica-lista.component.css']
})
export class ClinicaListaComponent implements OnInit {

  clinicas: Observable<Clinica[]>;
  doctores: Observable<Doctor[]>;

  paginationConfig: any;

  constructor(
    private clinicaSrv: ClinicaService, 
    private authSrv: AuthenticationService,
    private doctorSrv: DoctorService
    ) { 

    const currentUser = this.authSrv.currentUserValue;    
    this.clinicas = this.clinicaSrv.clinicaListar(currentUser.usuario.id);
    
    this.paginationConfig = {
      itemsPerPage: 5,
      currentPage: 1
    };
        
  }

  ngOnInit() {
  }

  onPageChange(event) {
    this.paginationConfig.currentPage = event;
  }

  mostrarDetalles(id: number) {

  }

  mostrarDoctores(id: number) {
    this.doctores = this.doctorSrv.consultarPorClinica(id);
    this.doctores.subscribe(res => console.log(res))
  }
}
