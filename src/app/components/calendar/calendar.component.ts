import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { ClinicaService } from '../../services/clinica.service';
import { DoctorService } from '../../services/doctor.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs';
import { Clinica } from 'src/app/entities/clinica';
import { Doctor } from '../../entities/doctor';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { THIS_EXPR, ConditionalExpr } from '@angular/compiler/src/output/output_ast';
import { CalendarService } from '../../services/calendar.service';
import { ClienteService } from '../../services/cliente.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ClienteModalComponent } from '../modals/cliente-modal/cliente-modal.component';
import { NavigationEnd, Router } from '@angular/router';
import { CitaModalComponent } from '../modals/cita-modal/cita-modal.component';

declare var $: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

@Injectable()
export class CalendarComponent implements OnInit {

  calendarForm: FormGroup;
  selectedMoment = new Date();
  clientes: any = [];
  cliente: any;
  clinicas: any = [];
  lstDoctores: any = [];
  selectedCli: any;
  selectedClie: any;
  selectedDoc: any;
  loading = false; 
  dialogValue: any; 
  minDateTime: any;
  currentUser: any;

  constructor(
    private formBuilder: FormBuilder,
    private clinicaSrv: ClinicaService,
    private doctorSrv: DoctorService,
    private authSrv: AuthenticationService,
    private calendarSrv: CalendarService,
    private clienteSrv: ClienteService,
    private toastr: ToastrService,
    private matDialog: MatDialog,
    )
     { 
      this.minDateTime = moment().format('YYYY-MM-DD');
     }

  @ViewChild('calendar', {static: false}) calendarComponent: FullCalendarComponent; // the #calendar in the template

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: any = [];

  toggleVisible() {
    this.selectedDoc = null;
    this.selectedCli = null;
    this.selectedClie = null;
    this.getCalendarios();
  }

  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  eventClick(event) {
    const modalDialog = this.matDialog.open(CitaModalComponent, {
      disableClose: false,
      id: "modal-component",
      height: "570px",      
      width: "50%",
      data: { 
        cita: event.event,
        cliente: this.cliente
      }
    });
    modalDialog.afterClosed().subscribe(result => {
      if(this.selectedDoc != undefined) {
        this.getCalendarioPorDoctor();
      } else if(this.selectedCli != undefined){
          this.getCalendarioPorClinica();
      } else {
        this.getCalendarios();
      }
    });
  }

  ngOnInit() {
      this.calendarForm = this.formBuilder.group({
        citaDT: new FormControl(new Date()),
        clinicaSelect: [0, Validators.required],
        doctorSelect: [0, Validators.required]
      });      

      this.currentUser = this.authSrv.currentUserValue;
      if(this.currentUser.tipo === 'owner') { 
        this.getCalendarios();   
        this.clinicaSrv.clinicaListar(this.currentUser.usuario.id).subscribe(res => {
          res.clinicas.forEach(elem => {
            this.clinicas = [...this.clinicas, elem];
          });
        });
      } else if(this.currentUser.tipo === 'doctor') {
        this.clinicaSrv.clinicaListarDoctor(this.currentUser.doctor.id).subscribe(res => {
          res.clinicas.forEach(elem => {
            this.clinicas = [...this.clinicas, elem];
          });
        });

        this.calendarSrv.calendariosPorDoctor(this.currentUser.doctor.id).subscribe(res => {
          if(res.error.codigo == "01") {
            this.toastr.warning('No hay citas calendarizadas', 'Sistema!');
          } 
          this.fillCalendar(res);
        });

        this.selectedDoc = this.currentUser.doctor.id;
      }

      this.getClientes();
  }

  onSubmit() {
    this.loading = true;
    let doctorId = this.selectedDoc;
    if(this.currentUser.tipo === 'doctor') {
      doctorId = this.currentUser.doctor.id;
    }
    this.calendarSrv.calendarioAdd(this.calendarSrv.crearEntradaInsertar(
      moment(this.selectedMoment).format('YYYY-MM-DDTHH:mm:ss'), 
      moment(this.selectedMoment).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ss'), 
      doctorId, this.selectedClie, this.selectedCli,
      "", "", "")).subscribe(res => {
        this.loading = false;
        if(res.error.codigo === '00') {
          this.currentUser.tipo === 'owner' ? this.getCalendarios() : this.getCalendarioPorClinica();
          this.toastr.success('Correcto!!!', 'Sistema!');
        } else{
          this.toastr.error('Error!!!', 'Sistema!');
        }
      })
  }

  fillCalendar(res: any) {
    console.log(res)
    this.calendarEvents = [];
    let color = '#B52D30'; //red
    res.calendarios.forEach(elem => {
      let today = moment();
      if( (moment(elem.finFechaHora).isAfter(today)) && (elem.idEstado === 1) ) {
        color = '#66CC44'; //green
      }
      this.calendarEvents = [...this.calendarEvents,
        { 
          title: 'Cita', 
          start: elem.inicioFechaHora,
          end: elem.finFechaHora,
          color: color,
          backgroundColor: '#eeeef0',//'#eeeef0',
          extendedProps: {
            id: elem.id,
            idCliente: elem.idClienteNavigation,
            idClinica: elem.idClinicaNavigation,
            idDoctor: this.currentUser.tipo === 'doctor' ? this.currentUser.doctor : elem.idDoctorNavigation,
            idEstado: elem.idEstadoNavigation,
            sintomas: elem.sintomas,
            diagnostico: elem.diagnostico,
            indicaciones: elem.indicaciones,
            usuario: this.currentUser.tipo === 'owner' ? 'owner' : 'doctor'
          }             
        }
      ];
    })
  }

  getCalendarios() {
    this.calendarSrv.calendarios().subscribe(res => {
      if(res.error.codigo == "01") {
        this.toastr.warning('No hay citas calendarizadas', 'Sistema!');
      }
      this.fillCalendar(res);
    })
  }

  getCalendarioPorClinica() {
    this.calendarSrv.calendariosPorClinica(this.selectedCli).subscribe(res => {
      if(res.error.codigo == "01") {
        this.toastr.warning('No hay citas calendarizadas en esta clinica', 'Sistema!');
      } 
      this.fillCalendar(res);
    })
  }

  getCalendarioPorDoctor() {
    this.calendarSrv.calendariosPorDoctor(this.selectedDoc).subscribe(res => {
      if(res.error.codigo == "01") {
        this.toastr.warning('No hay citas calendarizadas para el doctor', 'Sistema!');
      } 
      this.fillCalendar(res);
    })
  }

  getValueClinica() {
    this.getDoctores(this.selectedCli);
    this.getCalendarioPorClinica();
  }

  getValueDoctor() {
    this.getCalendarioPorDoctor();
  }

  openClienteModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "500px";
    dialogConfig.width = "50%";
    const modalDialog = this.matDialog.open(ClienteModalComponent, dialogConfig);

    modalDialog.afterClosed().subscribe(result => {
      if(result.data != null) {
        this.getClientes();
        this.selectedClie = result.data.id
      }
    });

  }

  addCliente() {
    //this.clienteSrv.clienteAdd(this.clienteSrv.crearEntradaInsertar())
  }  

  getClientes() {
    this.clienteSrv.clientes().subscribe(res => {
      res.clientes.forEach(elem => {
        this.clientes = [...this.clientes, {
          nombres: elem.nombres + ' ' + elem.apellidos,
          id: elem.id
        }];
      })
    })
  }

  getDoctores(id: number) {
    this.lstDoctores = [];
    this.selectedDoc = null;
    this.doctorSrv.consultarPorClinica(id).subscribe(res => {
      res.doctores.forEach(elem => {
        this.lstDoctores = [...this.lstDoctores, {
          nombres: elem.idDoctorNavigation.nombres + ' ' + elem.idDoctorNavigation.apellidos,
          id: elem.idDoctorNavigation.id
        }];
      });
    });
  }
}
