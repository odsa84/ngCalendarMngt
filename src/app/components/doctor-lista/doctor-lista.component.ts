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

  doctores: Observable<Doctor[]>;

  paginationConfig: any;
  id: any;

  constructor(
    private doctorSrv: DoctorService,
    private shareDataSrv: ShareDataService,
    private actRoute: ActivatedRoute
  ) { 
    this.actRoute.queryParams.subscribe((res)=> {  
      this.doctores = this.doctorSrv.doctorListar(res.clinica)
    });  

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

  mostrarDetalles(di: number) {

  }

}
