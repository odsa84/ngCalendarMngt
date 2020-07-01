import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { FullCalendarComponent } from '@fullcalendar/angular';
import * as moment from 'moment';
import { ClinicaService } from '../../services/clinica.service';
import { DoctorService } from '../../services/doctor.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { HorasLaboralesService } from '../../services/horas-laborales.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-horas-laborales',
  templateUrl: './horas-laborales.component.html',
  styleUrls: ['./horas-laborales.component.css']
})
export class HorasLaboralesComponent implements OnInit {

  horas: any = [];
  mostrarSi = false;
  clinicas: any = [];
  currentUser: any;
  selectedCli: any = null;
  loading = false;
  toDeleteEvent: any = [];

  constructor(
    private clinicaSrv: ClinicaService,
    private doctorSrv: DoctorService,
    private authSrv: AuthenticationService,
    private toastr: ToastrService,
    private horasLaboralesSrv: HorasLaboralesService,
    private actRoute: ActivatedRoute,
  ) { 
    this.currentUser = this.authSrv.currentUserValue;    

    if(this.currentUser.tipo !== null && this.currentUser.tipo === 'doctor') {
      this.consultarHorariosPorDoctor(this.currentUser.doctor.id);
      this.consultarClinicasPorDoctor(this.currentUser.doctor.id);
    } else {
      this.actRoute.queryParams.subscribe((res)=> { 
        if(res.doctor != undefined && res.clinica != undefined) {
          this.consultarHorarioPorDoctorClinica(res.doctor, res.clinica)
          this.consultarClinicasPorDoctor(res.doctor);
          this.selectedCli = Number(res.clinica);
        }
      }); 
    }
  }

  @ViewChild('calendar', {static: false}) calendarComponent: FullCalendarComponent; // the #calendar in the template

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: any = [];

  ngOnInit() {
  }

  consultarClinicasPorDoctor(idDoctor: number) {
    this.clinicaSrv.clinicaListarDoctor(idDoctor).subscribe(res => {
      res.clinicas.forEach(elem => {
        this.clinicas = [...this.clinicas, elem];
      });      
    })
  }

  consultarHorariosPorDoctor(idDoctor: number) {
      this.horasLaboralesSrv.consultarPorDoctor(idDoctor)
      .subscribe(res => {        
        if(res.error.codigo === '00') {  
          this.calendarEvents = [];        
          res.horasLaborales.forEach(elem => {
            this.calendarEvents = [...this.calendarEvents, {
              start: moment(elem.fecha + " " + elem.horaInicio).format('YYYY-MM-DD HH:mm:ss'),
              end: moment(elem.fecha + " " + elem.horaFin).format('YYYY-MM-DD HH:mm:ss'),
              color: '#66CC44',
              backgroundColor: '#66CC44',
              extendedProps: {
                id: elem.id,
                enBase: 1
              }
            }]
          })  
        } else if(res.error.codigo === '01') {
          this.toastr.error(res.error.mensaje, 'Sistema!');
        } else {
          this.toastr.error('Error de sistema, consulte al administrador.', 'Sistema!');
        }
      });
  }

  consultarHorarioPorDoctorClinica(idDoctor: number, idClinica: number) {
    this.horasLaboralesSrv.consultarPorDoctorClinica(idDoctor, idClinica)
      .subscribe(res => {
        if(res.error.codigo === '00') { 
          this.calendarEvents = [];         
          res.horasLaborales.forEach(elem => {
            this.calendarEvents = [...this.calendarEvents, {
              start: moment(elem.fecha + " " + elem.horaInicio).format('YYYY-MM-DD HH:mm:ss'),
              end: moment(elem.fecha + " " + elem.horaFin).format('YYYY-MM-DD HH:mm:ss'),
              color: '#66CC44',
              backgroundColor: '#66CC44',
              extendedProps: {
                id: elem.id,
                enBase: 1
              }
            }]
          })  
        } else if(res.error.codigo === '01') {
          this.toastr.error(res.error.mensaje, 'Sistema!');
        } else {
          this.toastr.error('Error de sistema, consulte al administrador.', 'Sistema!');
        }
      })
  }

  eventClick(event) {
    let auxArray = [];
    this.calendarEvents.forEach(elem => { 
      if(elem.extendedProps.id !== event.event.extendedProps.id) {
        auxArray = [...auxArray, elem];
      } else if(event.event.extendedProps.enBase === 1){
        this.toDeleteEvent = [...this.toDeleteEvent, {
          id: elem.extendedProps.id
        }];
      }      
    });
    this.calendarEvents = auxArray;
    
    auxArray = [];
    if(this.horas.length > 0) {
      this.horas.forEach(elem => {
        if(elem.id !== event.event.extendedProps.id) {
          auxArray = [...auxArray, elem];
        }
      });
      this.horas = auxArray;
    }
  }

  dateClick(event) {
    let startDateHour = moment(event.date).format('YYYY-MM-DD HH:mm:ss');
    let endDateHour = moment(event.date).add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
    let startHour = moment(event.date).format('HH:mm');
    let endHour = moment(event.date).add(1, 'hours').format('HH:mm');
    let justDate = moment(event.date).format('YYYY-MM-DD');
    let id = this.selectedCli + moment(event.date).format('HHmmss') + moment(event.date).add(1, 'hours').format('HHmmss') + moment(event.date).format('YYYYMMDD');

    this.horas = [...this.horas, {
      id: id,
      horaInicio: startHour,
      horaFin: endHour,
      fecha: justDate
    }];    

    this.calendarEvents = [...this.calendarEvents,
    { 
      start: startDateHour,
      end: endDateHour,
      color: '#66CC44',
      backgroundColor: '#66CC44',
      extendedProps: {
        id: id,
        enBase: 0
      }         
    }];
  }

  onSubmit() {
    if(this.selectedCli === null) {
      this.toastr.error('Debe seleccionar una clinica.', 'Sistema!');
    } else {
      this.loading = true;
      if(this.currentUser.tipo !== null && this.currentUser.tipo === 'doctor') {
        this.sendToSave(this.currentUser.doctor.id);
      } else {
        this.actRoute.queryParams.subscribe((res)=> { 
          if(res.doctor != undefined) {
            this.sendToSave(res.doctor);
          }
        }); 
      }
    }
  }

  getHorarios() {    
    if(this.currentUser.tipo !== null && this.currentUser.tipo === 'doctor') {
      this.consultarHorarioPorDoctorClinica(this.currentUser.doctor.id, this.selectedCli)
    } else {
      this.actRoute.queryParams.subscribe((res)=> { 
        if(res.doctor != undefined) {
          this.consultarHorarioPorDoctorClinica(res.doctor, this.selectedCli)
        }
      }); 
    }
  }

  sendToSave(idDoctor: number) {
    this.horasLaboralesSrv.horasLaboralesAdd(this.toDeleteEvent, this.horas, idDoctor,
      this.selectedCli).subscribe(res => {
     this.loading = false;
     this.toastr.success('Hemos guardado los datos correctamente', 'Sistema!');
     this.horas = [];
     this.toDeleteEvent = [];        
     if(this.currentUser.tipo !== null && this.currentUser.tipo === 'doctor') {
       this.consultarHorariosPorDoctor(this.currentUser.doctor.id);
     } else {
       this.actRoute.queryParams.subscribe((res)=> { 
         if(res.doctor != undefined) {
           this.consultarHorariosPorDoctor(res.doctor);
         }
       }); 
     }
   }, error => {
     this.loading = false;
     this.toastr.error('Error de sistema, contacte al administrador.', 'Sistema!');
     this.horas = [];
     this.toDeleteEvent = [];
   })
  }

  noLaborable(hor: any) {
    this.mostrarSi = true;
  }

  laborable(hor: any) {
    this.mostrarSi = false;
  }

}
