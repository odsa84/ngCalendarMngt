import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../../services/cliente.service';
import { CalendarService } from '../../../services/calendar.service';

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
  submitted = false;
  loading = false;
  selectedMoment: any;
  formatedSelectedMoment: string;

  dateTimeI: any;
  dateTimeF: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ClienteContactModalComponent>,
    private toastr: ToastrService,
    private clienteSrv: ClienteService,
    private calendarSrv: CalendarService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
    this.contactForm = this.formBuilder.group({
      searchContact: [''],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],      
      cedula: ['', Validators.required],
      telefono: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(7), 
          Validators.maxLength(15)]],
      email: ['', Validators.email],
    });

    this.theClinica = data.clinica;
    this.theHorario =  data.cita;
    this.selectedMoment = data.selectedDate;
    console.log(this.selectedMoment)
    this.formatSelectedDate(this.selectedMoment);
    this.createDateTime();
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
          this.addCalendario();
        } else {
          this.addCliente();          
        }
      })      
    }  else if (this.theCliente == 'empty'){ //Buscó primero pero no existe el cliente en la base
        this.addCliente();
    } else {
      this.addCalendario();
    }     
  }

  addCalendario() {
    this.calendarSrv.calendarioAdd(this.calendarSrv.crearEntradaInsertar(
      moment(this.dateTimeI).format('YYYY-MM-DDTHH:mm:ss'),
      moment(this.dateTimeF).format('YYYY-MM-DDTHH:mm:ss'),
      0, this.theCliente.id, this.theClinica.id,
      "", "", ""
    )).subscribe(res => {
      this.loading = false;
      this.submitted = false;
      if(res.error.codigo === '00') {
        this.toastr.success("Correcto!!!", "Sistema!");
        this.closeModal(res);
      } else{
        this.toastr.error("Error!!!", "Sistema!");
      }
    });
  }

  addCliente() {
    this.clienteSrv.clienteAdd(this.clienteSrv.crearEntradaInsertar(
      this.f.nombres.value, this.f.apellidos.value, 
      this.f.cedula.value, this.f.email.value, this.f.telefono.value))    
    .subscribe(res => {
      this.loading = false;
      this.submitted = false;
      if(res.error.codigo === '00') {
        this.theCliente = res.clientes[0];
        this.addCalendario();
      } else{
        this.toastr.error("Error!!!", "Sistema!");
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

  closeModal(cita: any) {
    this.dialogRef.close({event:'close', data: cita});
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
