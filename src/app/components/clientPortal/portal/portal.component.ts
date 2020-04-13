import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ClinicaService } from '../../../services/clinica.service';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from '../../../services/doctor.service';
import { ShareDataService } from '../../../services/share-data.service';
import { Router } from '@angular/router';
import { CiudadService } from '../../../services/ciudad.service';
import { ProvinciaService } from '../../../services/provincia.service';
import { EspecialidadService } from '../../../services/especialidad.service';

import * as moment from 'moment';

import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { DOCUMENT } from '@angular/common';
import { PageScrollService } from 'ngx-page-scroll-core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ClienteContactModalComponent } from '../../modals/cliente-contact-modal/cliente-contact-modal.component';
import { CalendarService } from '../../../services/calendar.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit {

  term: string
  clinicas: any = [];
  theClinica: any;
  theHorario: any;
  paginationConfig: any;
  ciudad: any;
  submitted = false;
  loading = false;

  provincias: any = [];    
  ciudades: any = [];
  especialidades: any = [];
  horarios: any = [];
  citasAgendadas: any = [];
  selectedProv;
  selectedCiu;
  selectedEsp;
  hideHorarios: boolean = true;
  hideDatosCliente: boolean = true;
  selectedMoment = new Date();
  formatedSelectedMoment: string;
  minDateTime: any;
  contactForm: FormGroup;

  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;

  constructor(
    private clinicaSrv: ClinicaService,
    private doctorSrv: DoctorService,
    private shareDataSrv: ShareDataService,
    private router: Router,
    private ciudadSrv: CiudadService,
    private provinciaSrv: ProvinciaService,
    private espSrv: EspecialidadService,
    private toastr: ToastrService,
    private pageScrollSrv: PageScrollService,  
    private matDialog: MatDialog,  
    private calendarSrv: CalendarService,
    @Inject(DOCUMENT) private document: any
    ) {       
      this.getProvincias();
      this.getEspecialidad();
      this.getClinicas();

      this.minDateTime = moment().format('YYYY-MM-DD');
    
      this.paginationConfig = {
        itemsPerPage: 5,
        currentPage: 1
      };
    }

  ngOnInit() {
  }

  onSubmit() {

  }

  getClinicas() {
    this.clinicas = [];
    this.clinicaSrv.clinicas().subscribe(res => {      
      res.clinicas.forEach(elem => {      
        this.clinicas = [...this.clinicas, elem];
      });     
    })    
  }

  getProvincias() {
    this.provinciaSrv.provincias().subscribe(res => {
      res.provincias.forEach(elem => {
        this.provincias = [...this.provincias, {
          nombre: elem.nombre,
          id: elem.id
        }];
      })
    })
  }

  getCiudad() {
    this.ciudades = [];
    this.ciudadSrv.ciudadPorProvincia(this.selectedProv).subscribe(res => {
      res.ciudades.forEach(elem => {
        this.ciudades = [...this.ciudades, {
          nombre: elem.nombre,
          id: elem.id
        }];
      })
    })
  }

  getEspecialidad() {
    this.especialidades = [];
    this.espSrv.especialidades().subscribe(res => {
      res.especialidades.forEach(elem => {
        this.especialidades = [...this.especialidades, elem];
      })
    })
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
  }  

  selectClinica(clinica: any) {
    this.theClinica = clinica;
    this.hideHorarios = false;
    this.hideDatosCliente = true;    
    this.horarios = [];
    this.calendarSrv.calendariosPorClinicaAgendadas(clinica.id).subscribe(res => {      
      this.citasAgendadas = res;
      this.fillHorarios();
    })
    this.pageScrollSrv.scroll({      
      document: this.document,
      scrollTarget: '.horarioScroll',
    });
  }

  selectHorario(horario: any) {
    this.theHorario = horario;
    this.formatSelectedDate();
    this.hideDatosCliente = false;

    const modalDialog = this.matDialog.open(ClienteContactModalComponent, {
      disableClose: true,
      id: "cliente-contact-modal-component",
      height: "550px",      
      width: "80%",
      data: { 
        cita: horario,
        clinica: this.theClinica,
        selectedDate: this.selectedMoment
      }
    });
    modalDialog.afterClosed().subscribe(result => {
      console.log(result.data)
      if(result.data != undefined) {
        this.hideHorarios = true;
        this.theClinica = null;
        this.theHorario = null;
        this.selectedMoment = new Date();
        this.formatedSelectedMoment = null;
      }
    });
  }

  formatSelectedDate() {
    this.formatedSelectedMoment = moment(this.selectedMoment).locale('es').format('dddd, D MMMM YYYY')
  }

  exitCalendario() {
    this.hideHorarios = true;
  }

  exitContact() {
    this.hideDatosCliente = true;
  }

  filtrarHorarios(event) {
    this.horarios = [];
    this.fillHorarios();
  }

  fillHorarios() {    
    this.horarios = [
      {
        id: '1',
        horaI: '07:00',
        horaF: '08:00',
        estado: 'Disponible'
      },
      {
        id: '2',
        horaI: '08:00',
        horaF: '09:00',
        estado: 'Disponible',        
      },
      {
        id: '3',
        horaI: '09:00',
        horaF: '10:00',
        estado: 'Disponible',        
      },
      {
        id: '4',
        horaI: '10:00',
        horaF: '11:00',
        estado: 'Disponible',        
      },
      {
        id: '5',
        horaI: '11:00',
        horaF: '12:00',
        estado: 'Disponible',        
      },
      {
        id: '6',
        horaI: '12:00',
        horaF: '13:00',
        estado: 'No Disponible',        
      },
      {
        id: '7',
        horaI: '13:00',
        horaF: '14:00',
        estado: 'No Disponible',        
      },
      {
        id: '8',
        horaI: '14:00',
        horaF: '15:00',
        estado: 'Disponible',        
      },
      {
        id: '9',
        horaI: '15:00',
        horaF: '16:00',
        estado: 'Disponible',        
      },
      {
        id: '10',
        horaI: '16:00',
        horaF: '17:00',
        estado: 'Disponible',        
      },
      {
        id: '11',
        horaI: '17:00',
        horaF: '18:00',
        estado: 'Disponible',        
      },
      {
        id: '12',
        horaI: '18:00',
        horaF: '19:00',
        estado: 'Disponible',        
      },
      {
        id: '13',
        horaI: '19:00',
        horaF: '20:00',
        estado: 'Disponible',        
      },
      {
        id: '14',
        horaI: '20:00',
        horaF: '21:00',
        estado: 'Disponible',        
      }
    ];
    this.horarios.forEach(elemH => {
      if(moment(this.selectedMoment).format('YYYY-MM-DD HH:mm:ss') < moment().format('YYYY-MM-DD HH:mm:ss')
        && elemH.horaF < moment().format('HH:mm')) {
        elemH.estado = 'No Disponible';
      }
      this.citasAgendadas.calendarios.forEach(elemC => {        
        if(moment(elemC.inicioFechaHora).format('YYYY-MM-DD') 
          === moment(this.selectedMoment).format('YYYY-MM-DD')) {
          if(moment(elemC.inicioFechaHora).format('HH:mm') === elemH.horaI) {
            elemH.estado = 'No Disponible';
          }
        }
      })
    })
    
    
  }  
}
