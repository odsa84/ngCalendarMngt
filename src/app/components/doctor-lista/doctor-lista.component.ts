import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../../entities/doctor';
import { DoctorService } from '../../services/doctor.service';
import { ShareDataService } from '../../services/share-data.service';
import { ActivatedRoute } from '@angular/router';
import { parse } from 'querystring';

@Component({
  selector: 'app-doctor-lista',
  templateUrl: './doctor-lista.component.html',
  styleUrls: ['./doctor-lista.component.css']
})
export class DoctorListaComponent implements OnInit {

  doctores: any = [];
  term: string;
  paginationConfig: any;
  id: any;
  submitted = false;
  loading = false;

  constructor(
    private doctorSrv: DoctorService,
    private shareDataSrv: ShareDataService,
    private actRoute: ActivatedRoute
  ) { 
            
  }

  ngOnInit() {
    this.actRoute.queryParams.subscribe((res)=> { 
      if(res.clinica != undefined) {
        this.getDoctoresPorClinica(res.clinica)
      } else {
        this.getDoctores();
      }
    });  

    this.paginationConfig = {
      itemsPerPage: 5,
      currentPage: 1
    };
  }

  getDoctores() {
    this.doctores = [];
    this.doctorSrv.doctores().subscribe(res => {
      res.doctores.forEach(elem => {      
        this.doctores = [...this.doctores, {
          docs: elem.idDoctorNavigation,
          titulos: elem.idDoctorNavigation.doctorTitulo,
          especialidades: elem.idDoctorNavigation.doctorEspecialidad,
          clinicas: elem.idDoctorNavigation.clinicaDoctor
        }];      
      });
    });
  }

  getDoctoresPorClinica(clinica: any) {
    this.doctores = [];
    this.doctorSrv.doctorListar(clinica).subscribe(res => {      
      res.forEach(elem => {      
        this.doctores = [...this.doctores, {
          docs: elem.idDoctorNavigation,
          titulos: elem.idDoctorNavigation.doctorTitulo,
          especialidades: elem.idDoctorNavigation.doctorEspecialidad,
          clinicas: elem.idDoctorNavigation.clinicaDoctor
        }];      
      });
    })    
  }

  onPageChange(event) {
    this.paginationConfig.currentPage = event;
  }

  mostrarDetalles(di: number) {

  }

  eliminar(doc: any) {

  }

}
