import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../../services/cliente.service';
import { CalendarService } from '../../../services/calendar.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { utilClass } from '../../../utils/utilClass';

@Component({
  selector: 'app-cliente-contact-modal',
  templateUrl: './cliente-contact-modal.component.html',
  styleUrls: ['./cliente-contact-modal.component.css']
})
export class ClienteContactModalComponent implements OnInit {

  contactForm: FormGroup;
  theClinica: any;
  theHorario: any;
  theCliente: any = null;
  theClient: any = null;
  theDoctor: any = null;
  submitted = false;
  loading = false;
  selectedMoment: any;
  formatedSelectedMoment: string;
  especialidades: any = [];
  selectedEsp: any;

  dateTimeI: any;
  dateTimeF: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ClienteContactModalComponent>,
    private toastr: ToastrService,
    private clienteSrv: ClienteService,
    private calendarSrv: CalendarService,
    private authSrv: AuthenticationService,
    private util: utilClass,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
    this.theClinica = data.clinica;
    this.theHorario =  data.cita;
    this.selectedMoment = data.selectedDate;
    this.theClient = data.cliente;
    this.theDoctor = data.doctor;
    this.selectedEsp = data.selectedEsp;
    this.formatSelectedDate(this.selectedMoment);
    this.createDateTime();
    this.theDoctor.idDoctorNavigation.doctorEspecialidad.forEach(elem => {
      this.especialidades = [...this.especialidades, elem.idEspecialidadNavigation];
    })

    this.contactForm = this.formBuilder.group({
      searchContact: [''],
      nombres: [this.theClient.cliente.nombres, Validators.required],
      apellidos: [this.theClient.cliente.apellidos, Validators.required],      
      cedula: [this.theClient.cliente.cedula, Validators.required],
      telefono: [this.theClient.cliente.telefono, [Validators.pattern("^[0-9]*$"), Validators.minLength(7), 
          Validators.maxLength(15)]],
      email: [this.theClient.cliente.email, Validators.email],
      especialidad: [this.selectedEsp, Validators.required]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    if(!this.contactForm.valid) {      
      return false;
    }
    this.loading = true;
    this.createDateTime();

    if(this.theCliente == null) { //Va directo a llenar campos, chequear si ya existe en la base
      this.clienteSrv.clientePorCedula(this.f.cedula.value).subscribe(res => {
        if(res.error.codigo === '00') {
          this.theCliente = res.clientes[0];
          //this.addCalendario();
          this.sendEmail(this.theCliente.email);
        } else {
          this.addCliente();          
        }
      })      
    }  else if (this.theCliente == 'empty'){ //Busco primero pero no existe el cliente en la base
        this.addCliente();
    } else {
      //this.addCalendario();
      this.sendEmail(this.theCliente.email);
    }     
  }

  addCalendario() {
    this.calendarSrv.calendarioAdd(this.calendarSrv.crearEntradaInsertar(
      moment(this.dateTimeI).format('YYYY-MM-DDTHH:mm:ss'),
      moment(this.dateTimeF).format('YYYY-MM-DDTHH:mm:ss'),
      this.theDoctor.idDoctor, this.theCliente.id, this.theClinica.id,
      "", "", ""
    )).subscribe(res => {
      this.loading = false;
      this.submitted = false;
      if(res.error.codigo === '00') {
        this.toastr.success("Su cita médica ha sido agendada. Se le envió un correo con el detalle", "Sistema!");
        this.closeModal(res);
      } else{
        this.toastr.error("Error del sistema.", "Sistema!");
      }
    });
  }

  addCliente() {
    this.clienteSrv.clienteAdd(this.clienteSrv.crearEntradaInsertar(
      this.f.nombres.value, this.f.apellidos.value, 
      this.f.cedula.value, this.f.email.value, this.util.randomString(), this.f.telefono.value))    
    .subscribe(res => {
      this.loading = false;
      this.submitted = false;
      if(res.error.codigo === '00') {
        this.theCliente = res.clientes[0];
        //this.addCalendario();
        this.sendEmail(res.clientes[0].email);
      } else if(res.error.codigo === '02'){
        this.toastr.error("Email proporcionado ya existe.", "Sistema!");
      } else {
        this.toastr.error("Error, consulte al administrador.", "Sistema!");
      }
    });
  }

  buscarCliente() {
    this.clienteSrv.clientePorCedula(this.f.searchContact.value).subscribe(res => {
      if(res.error.codigo === '00') {
        this.theCliente = res.clientes[0];
        this.f.nombres.setValue(res.clientes[0].nombres)
        this.f.apellidos.setValue(res.clientes[0].apellidos)
        this.f.cedula.setValue(res.clientes[0].cedula)
        this.f.email.setValue(res.clientes[0].email)
        this.f.telefono.setValue(res.clientes[0].telefono)
      } else{
        this.theCliente = 'empty';
        this.toastr.error("No existen datos", "Sistema!");
      }
    })
  }

  createDateTime() {
    const aux = moment(this.selectedMoment, 'YYYY-MM-DD')

    this.dateTimeI = moment(aux).set({"hour": this.theHorario.horaI.substr(0, 2), "minute": 0, "second": 0});
    this.dateTimeF = moment(aux).set({"hour": this.theHorario.horaF.substr(0, 2), "minute": 0, "second": 0});

  }

  formatSelectedDate(selectedDate: any) {
    this.formatedSelectedMoment = moment(selectedDate).locale('es').format('dddd, D MMMM YYYY')
  }

  exitContact() {

  }

  sendEmail(email: string) {
    //let body = '<i>This is sent as a feedback from my resume page.</i> <br/> <b>Name: </b>${this.model.name} <br /> <b>Email: </b>${this.model.email}<br /> <b>Subject: </b>${this.model.subject}<br /> <b>Message:</b> <br /> ${this.model.message} <br><br> <b>~End of Message.~</b>';        
    let nombreClinica = "Su cita médica está agendada en la clinica: " + this.theClinica.nombre + ", "
    let fechInicio = "el día " + this.formatedSelectedMoment + ", ";
    let horaI = "a las " + this.theHorario.horaI + " horas";
    let body = nombreClinica + fechInicio + horaI;
    this.authSrv.sendEmail(email, body).subscribe(res => {
      if(res.codigo === '00') {
        this.addCalendario();
      }
    }, error => {
      this.closeModal(undefined);
      this.toastr.error('Error de sistema! Por favor inténtelo mas tarde', 'Sistema!')
    })
  }

  closeModal(cita: any) {
    let aux = {
      cita: cita,
      cliente: this.theCliente
    }
    this.dialogRef.close({event:'close', data: aux});
    this.theCliente = null;
    //this.theClinica = null;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  get f() { return this.contactForm.controls; }

}
