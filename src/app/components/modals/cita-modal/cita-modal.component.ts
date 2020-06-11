import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClienteService } from '../../../services/cliente.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CalendarService } from '../../../services/calendar.service';
import { DoctorService } from '../../../services/doctor.service';
import { EstadosCitaService } from '../../../services/estados-cita.service';

@Component({
  selector: 'app-cita-modal',
  templateUrl: './cita-modal.component.html',
  styleUrls: ['./cita-modal.component.css']
})
export class CitaModalComponent implements OnInit {

  citaModalForm: FormGroup;
  cita: any;
  cliente: any;
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  sintomas: string;
  diagnostico: string;
  indicaciones: string;
  startDate;
  endDate;
  submitted: boolean = false;
  loading: boolean = false;
  lstDoctores: any = [];
  selectedDoc: any;
  lstEstados: any = [];
  selectedEst: any;
  nombreClinica: string;

  constructor(
    private formBuilder: FormBuilder,
    private clienteSrv: ClienteService,
    private toastr: ToastrService,
    private calendarSrv: CalendarService,
    private doctorSrv: DoctorService,
    private estadoSrv: EstadosCitaService,
    private dialogRef: MatDialogRef<CitaModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    if(data.cita.extendedProps.usuario === 'owner') {
      this.getDoctores(data.cita.extendedProps.idClinica.id);
    } else {
      //this.lstDoctores = data.cita.extendedProps.idDoctor;
      this.lstDoctores = [...this.lstDoctores, {
        nombres: data.cita.extendedProps.idDoctor.nombres + ' ' + data.cita.extendedProps.idDoctor.apellidos,
        id: data.cita.extendedProps.idDoctor.id
      }];
    }
    this.cita = data.cita;
    this.nombreClinica = data.cita.extendedProps.idClinica.nombre
    this.startDate = moment(data.cita.start).format('YYYY-MM-DD HH:mm:ss');
    this.endDate = moment(data.cita.end).format('YYYY-MM-DD HH:mm:ss');
    this.sintomas = data.cita.extendedProps.sintomas;
    this.indicaciones = data.cita.extendedProps.indicaciones;
    this.diagnostico = data.cita.extendedProps.diagnostico;
    this.getClientes();
    this.getEstados();

    let idDoctor = data.cita.extendedProps.idDoctor.id;
    this.selectedDoc = idDoctor === 0 ? null : idDoctor;
    this.selectedEst = data.cita.extendedProps.idEstado.id;


   }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if(this.selectedDoc != null && this.selectedEst != null) {
      this.calendarSrv.calendarioUpdate(this.calendarSrv.crearEntradaUpdate(
        this.cita.extendedProps.id, this.startDate, this.endDate, this.selectedDoc, this.selectedEst, 
        this.cita.extendedProps.idCliente.id, this.cita.extendedProps.idClinica.id, 
        this.sintomas, this.diagnostico, this.indicaciones))
        .subscribe(res => {
        this.loading = false;
        this.submitted = false;
        if(res.error.codigo === '00') {
          this.toastr.success("Correcto!!!", "Sistema!");
          this.closeModal();
        } else{
          this.toastr.error("Error!!!", "Sistema!");
        }
      });
    } else {
      this.toastr.error("Campos incorrectos!!!", "Sistema!");
    }
  }

  getClientes() {
    this.clienteSrv.clientePorId(this.cita.extendedProps.idCliente.id).subscribe(res => {
      this.cliente = res.clientes[0];

      this.nombre = res.clientes[0].nombres + ' ' + res.clientes[0].apellidos;
      this.cedula = res.clientes[0].cedula;
      this.email = res.clientes[0].email;
      this.telefono = res.clientes[0].telefono;
    });
  }

  getDoctores(id: number) {
    this.lstDoctores = [];
    this.selectedDoc = []
    this.doctorSrv.consultarPorClinica(id).subscribe(res => {
      res.doctores.forEach(elem => {
        this.lstDoctores = [...this.lstDoctores, {
          nombres: elem.idDoctorNavigation.nombres + ' ' + elem.idDoctorNavigation.apellidos,
          id: elem.idDoctorNavigation.id
        }];
      });
    });
  }

  getEstados() {
    this.lstEstados = [];
    this.selectedEst = [];
    this.estadoSrv.estados().subscribe(res => {
      console.log(res)
      res.estados.forEach(elem => {
        this.lstEstados = [...this.lstEstados, {
          nombres: elem.estado1,
          id: elem.id
        }]
      }) 
    })
  }

  closeModal() {
    this.dialogRef.close();
  }

  get f() { return this.citaModalForm.controls; }

}
