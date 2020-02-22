import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Clinica } from '../../entities/clinica';
import { ClinicaService } from '../../services/clinica.service';
import { AuthenticationService } from '../../services/authentication.service';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../entities/doctor';
import { ShareDataService } from '../../services/share-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clinica-lista',
  templateUrl: './clinica-lista.component.html',
  styleUrls: ['./clinica-lista.component.css']
})
export class ClinicaListaComponent implements OnInit {

  clinicas: Observable<Clinica[]>;
  paginationConfig: any;

  constructor(
    private clinicaSrv: ClinicaService, 
    private authSrv: AuthenticationService,
    private shareDataSrv: ShareDataService,
    private router: Router
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
    let cli = {
      clinica: id
    };
    this.shareDataSrv.setObj(id);
    this.router.navigate(['/doctor-lista'], {
      queryParams: cli,
    })
    //this.router.navigateByUrl('/doctor-lista')
  }
}
