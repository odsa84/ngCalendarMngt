import { Component, OnInit, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ClinicaService } from '../../../services/clinica.service';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from '../../../services/doctor.service';
import { ShareDataService } from '../../../services/share-data.service';
import { Router } from '@angular/router';
import { CiudadService } from '../../../services/ciudad.service';
import { ProvinciaService } from '../../../services/provincia.service';
import { EspecialidadService } from '../../../services/especialidad.service';

import * as moment from 'moment';
import '../../../../assets/js/smtp.js';

import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { DOCUMENT } from '@angular/common';
import { PageScrollService } from 'ngx-page-scroll-core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ClienteContactModalComponent } from '../../modals/cliente-contact-modal/cliente-contact-modal.component';
import { CalendarService } from '../../../services/calendar.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ClienteService } from '../../../services/cliente.service';
import { utilClass } from '../../../utils/utilClass';
import { HorasLaboralesService } from '../../../services/horas-laborales.service';

declare let Email: any;

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit {

  term: string;
  clinicas: any = [];
  theClinica: any;
  theHorario: any;
  theDoctor: any;
  paginationConfig: any;
  ciudad: any;
  submitted = false;
  submittedReg = false;
  loading = false;
  loadingReg = false;
  showSpinner = false;
  showSpinnerReg = false;
  showRegisterForm = false;
  currentUser: any = null;
  error = '';
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
  loginForm: FormGroup;
  regClienteForm: FormGroup;
  nombreCliente: string;
  doctores: any = [];
  showDoctores: boolean = false;
  showParamsBusqueda: boolean = true;
  showFiltrarHorarios: boolean = false;
  showMensajeNoTrabaja: boolean = false;

  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;

  constructor(
    private clinicaSrv: ClinicaService,
    private doctorSrv: DoctorService,
    private clienteSrv: ClienteService,
    private shareDataSrv: ShareDataService,
    private router: Router,
    private ciudadSrv: CiudadService,
    private provinciaSrv: ProvinciaService,
    private espSrv: EspecialidadService,
    private toastr: ToastrService,
    private pageScrollSrv: PageScrollService,  
    private matDialog: MatDialog,  
    private calendarSrv: CalendarService,
    private authSrv: AuthenticationService,
    private formBuilder: FormBuilder,
    private utilClass: utilClass,
    private horasLaboralesSrv: HorasLaboralesService,
    private cd: ChangeDetectorRef,
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

      this.currentUser = this.authSrv.currentUserValue;
      if(this.currentUser !== null && this.currentUser.tipo === 'client') {
        this.nombreCliente = this.currentUser.cliente.nombres + ' ' + this.currentUser.cliente.apellidos;
      }
    }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
			password: ['', Validators.required]
    });

    this.regClienteForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],      
      cedula: ['', Validators.required],
      emailReg: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      passwordReg: ['', Validators.required],
      confirmPass: ['', Validators.required],
      telefono: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(7), 
      Validators.maxLength(15)]]
    }, {
      validator: this.MustMatch('passwordReg', 'confirmPass')
    });        
  }

  onSubmitLogin() {
		this.submitted = true;	
		if (this.loginForm.invalid) {
			this.submitted = false;
			return;
		}

		this.showSpinner = true;
		this.authSrv.loginCliente(this.f.email.value, this.f.password.value)
			.subscribe(res => {                    
          this.loading = false;
          this.submitted = false;
          this.showSpinner = false;
          this.currentUser = this.authSrv.currentUserValue;
          this.toastr.success('Bienvenido a Portal Clinicas.', 'Sistema!');
          this.router.navigate(['/portal']);
          this.limpiarLoginForm();
          this.nombreCliente = res.cliente.nombres + ' ' + res.cliente.apellidos;          
				},
				error => {
					this.error = error;
					this.showSpinner = false;
					this.submitted = false;
          this.toastr.error('Usuario y/o contraseña incorrectos', 'Sistema!');
          this.limpiarLoginForm();
				});
  }
  
  onSubmitRegister() {
		this.submittedReg = true;
    if(!this.regClienteForm.valid) {      
      return false;
    }
    this.loadingReg = true;
    this.clienteSrv.clienteAdd(this.clienteSrv.crearEntradaInsertar(
      this.g.nombres.value, this.g.apellidos.value, 
      this.g.cedula.value, this.g.emailReg.value, this.g.passwordReg.value, this.g.telefono.value))    
    .subscribe(res => {
      this.loadingReg = false;
      this.submittedReg = false;
      if(res.error.codigo === '00') {
        this.toastr.success("Gracias por registrarse al portal.", "Sistema!");
        this.showRegisterForm = false;
      } else if(res.error.codigo === '02'){
        this.toastr.error("Email proporcionado ya existe.", "Sistema!");
      } else {
        this.toastr.error("Error!!!", "Sistema!");
      }
    });
	}

  filtrarClinicas() {    
    if(this.selectedCiu != null && this.selectedEsp != null) {
      this.clinicaSrv.filtrarPorCiudadEspecialidad(this.selectedCiu, this.selectedEsp).subscribe(res => {
        if(res.error.codigo === '00') {
          this.clinicas = [];
          res.clinicas.forEach(elem => {      
            this.clinicas = [...this.clinicas, elem];
          });
          this.toastr.success('Filtro: ' + res.clinicas.length + ' resultados encontrados', 'Sistema!')
        } else {
          this.toastr.warning('No se encontraron datos para filtrar!', 'Sistema!')
        }
      })
    } else if(this.selectedCiu != null) {
      this.clinicaSrv.filtrarPorCiudad(this.selectedCiu).subscribe(res => {
        if(res.error.codigo === '00') {
          this.clinicas = [];
          res.clinicas.forEach(elem => {      
            this.clinicas = [...this.clinicas, elem];
          });
          this.toastr.success('Filtro: ' + res.clinicas.length + ' resultados encontrados', 'Sistema!')
        } else {
          this.toastr.warning('No se encontraron datos para filtrar!', 'Sistema!')
        }
      })
    } else if(this.selectedEsp != null) {      
      this.clinicaSrv.filtrarPorEspecialidad(this.selectedEsp).subscribe(res => {
        if(res.error.codigo === '00') {
          this.clinicas = [];
          res.clinicas.forEach(elem => {      
            this.clinicas = [...this.clinicas, elem];
          });
          this.toastr.success('Filtro: ' + res.clinicas.length + ' resultados encontrados', 'Sistema!')
        } else {
            this.toastr.warning('No se encontraron datos para filtrar!', 'Sistema!')
        }
      })
    } else {
      this.getClinicas();
    }
  }

  limpiarClinicas() {
    this.selectedProv = null;
    this.selectedCiu = null;
    this.selectedEsp = null;
    this.getClinicas();
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

  mostrarDoctores(id: number) {
    let cli = {
      clinica: id
    };
    this.shareDataSrv.setObj(id);
    this.router.navigate(['/doctor-lista'], {
      queryParams: cli,
    })
  } 
  
  consultarPorCiudadClinicaEspecialidad() {
    this.doctores = [];
    this.doctorSrv.consultarPorCiudadClinicaEspecialidad(this.selectedCiu, this.theClinica.id, this.selectedEsp)
    .subscribe(res => {
      if(res.error.codigo === '01') {
        this.toastr.error(res.error.mensaje, 'Sistema!');
      } else if(res.error.codigo === '00') {
        this.doctores = res.doctores;
        this.showDoctores = true;
        this.term = ""; //vaciar string de busqueda por nombre
      } else {
        this.toastr.error('Error del sistema, contacte a un administrador.', 'Sistema!');
      }
    });
  }

  selectClinica(clinica: any) {
    if(this.currentUser === null) {
      this.toastr.error("Por favor, inicie sesión en la aplicación", "Sistema!")
    } else {
      this.theClinica = clinica;
      this.hideDatosCliente = true;
      this.consultarPorCiudadClinicaEspecialidad();
      /*this.calendarSrv.calendariosPorClinicaAgendadas(clinica.id).subscribe(res => {      
        this.citasAgendadas = res;
        this.fillHorarios();
      })
      this.pageScrollSrv.scroll({      
        document: this.document,
        scrollTarget: '.horarioScroll',
      });*/
    }
  }

  selectHorariosDoctor(doctor: any) {
    this.theDoctor = doctor;
    this.hideHorarios = false;
    this.hideDatosCliente = true;
    this.showDoctores = false;
    this.showParamsBusqueda = false;
    this.showFiltrarHorarios = false;
    this.showMensajeNoTrabaja = false;
    this.filtrarHorarios(null);
  }

  selectHorario(horario: any) {
    console.log(horario);
    this.theHorario = horario;
    this.formatSelectedDate();
    this.hideDatosCliente = false;

    this.horasLaboralesSrv.consultarActualizarDisponibilidad(horario.id, this.theDoctor.idDoctor, 
      this.theClinica.id, false).subscribe(res => {
        if(res.error.codigo === '00') {
          this.openClienteContactModal(horario);
        } else if(res.error.codigo === '01') {
          this.toastr.error('Otro paciente seleccionó este horario. Seleccione otro por favor.', 'Sistema!');
        } else if(res.error.codigo === '02') {
          this.toastr.error('Hubo un error al procesar su colicitud, intentelo más tarde.', 'Sistema!');
        }
      });    
  }

  openClienteContactModal(horario: any) {
    const modalDialog = this.matDialog.open(ClienteContactModalComponent, {
      disableClose: true,
      id: "cliente-contact-modal-component",
      height: "550px",      
      width: "80%",
      data: { 
        cita: horario,
        clinica: this.theClinica,
        cliente: this.currentUser,
        doctor: this.theDoctor,
        selectedEsp: this.selectedEsp,
        selectedDate: this.selectedMoment
      }
    });
    modalDialog.afterClosed().subscribe(result => {
      if(result.data.cita != undefined) {
        this.hideHorarios = true;
        this.theClinica = null;
        this.theHorario = null;
        this.theDoctor = null;
        this.selectedMoment = new Date();
        this.formatedSelectedMoment = null;
        this.showDoctores = false;
        this.showParamsBusqueda = true;
        this.showFiltrarHorarios = false;
        this.showMensajeNoTrabaja = false;
      }
    });
  }

  formatSelectedDate() {
    this.formatedSelectedMoment = moment(this.selectedMoment).locale('es').format('dddd, D MMMM YYYY')
  }

  exitCalendario() {
    this.hideHorarios = true;
    this.showDoctores = true;
    this.showParamsBusqueda = true;
    this.showMensajeNoTrabaja = false;
  }

  exitDoctoresList() {
    this.showDoctores = false;
  }

  exitContact() {
    this.hideDatosCliente = true;
  }

  filtrarHorarios(event: any) { 
    this.horarios = [];    
    let fecha = moment(this.selectedMoment).format('YYYY-MM-DD')
    this.horasLaboralesSrv.consultarPorDoctorClinicaFecha(this.theDoctor.idDoctor, 
      this.theClinica.id, fecha)
    .subscribe(res => {      
      if(res.error.codigo === '00') {            
        res.horasLaborales.forEach( elem => {
          this.horarios = [...this.horarios, {
            id: elem.id,
            horaI: elem.horaInicio,
            horaF: elem.horaFin,
            fecha: elem.fecha,
            estado: 'Disponible'
          }]          
        });
        this.showFiltrarHorarios = true;
      } else {        
        this.showMensajeNoTrabaja = true;
        this.toastr.error(res.error.mensaje, 'Sistema!');
      }
    })

    this.calendarSrv.calendariosPorDoctorAgendadas(this.theDoctor.idDoctor).subscribe(res => {        
      if(res.error.codigo === '00') {
        this.citasAgendadas = res;
        this.horarios.forEach(elemH => {
          this.citasAgendadas.calendarios.forEach(elemC => {        
            if(moment(elemC.inicioFechaHora).format('YYYY-MM-DD') 
              === moment(this.selectedMoment).format('YYYY-MM-DD')) {
              if(moment(elemC.inicioFechaHora).format('HH:mm') === elemH.horaI) {
                elemH.estado = 'No Disponible';
              }
            }
          });
        });
        this.showFiltrarHorarios = true;
        this.showMensajeNoTrabaja = false;
      };
      this.horarios.forEach(elemH => {
        if(moment(this.selectedMoment).format('YYYY-MM-DD HH:mm:ss') < moment().format('YYYY-MM-DD HH:mm:ss')
          && elemH.horaF < moment().format('HH:mm')) {
          elemH.estado = 'No Disponible';
        }
      });
    });   
  }
  
  sendEmail(email: string, pass: string) {
    //let body = '<i>This is sent as a feedback from my resume page.</i> <br/> <b>Name: </b>${this.model.name} <br /> <b>Email: </b>${this.model.email}<br /> <b>Subject: </b>${this.model.subject}<br /> <b>Message:</b> <br /> ${this.model.message} <br><br> <b>~End of Message.~</b>';  
    let body = "Esta es su nueva contraseña " + pass;
    this.authSrv.sendEmail(email, body).subscribe(res => {
      if(res.codigo === '00') {
        this.toastr.success('Se le ha enviado un correo con su nueva contraseña', 'Sistema!')
      }
    }, error => (this.toastr.error('Hubo un inconveniente al enviar el correo', 'Sistema!')))

    /*Email.send({
      Host : 'smtp.elasticemail.com',
      Username : 'odsa84@gmail.com',
      Password : '6D1E3FA54E8A35A76E0DB79FDD0690138F98',
      To : 'odsa84@gmail.com',
      From : 'odsa84@gmail.com',
      Subject : 'Cita Agendada',
      Body : 
      '<i>This is sent as a feedback from my resume page.</i> <br/> <b>Name: </b>${this.model.name} <br /> <b>Email: </b>${this.model.email}<br /> <b>Subject: </b>${this.model.subject}<br /> <b>Message:</b> <br /> ${this.model.message} <br><br> <b>~End of Message.~</b> '
      }).then( message => { alert(message); });*/
  }

  showRegister() {
    this.limpiarLoginForm();
    this.showRegisterForm = true;
  }

  hideRegister() {
    this.showRegisterForm = false;
  }

MustMatch(passwor1: string, passwor2: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[passwor1];
      const matchingControl = formGroup.controls[passwor2];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}

recuperarPass() {
  if(this.f.email.value === null || this.f.email.value === '') {
    this.toastr.warning("Por favor, ingrese su correo en el campo Email y luego hago click en 'Olvidé mi contraseña'", 'Sistema!');
  } else { 
    let generatedPass = this.utilClass.randomString();
    this.authSrv.changePasswordSistema(this.f.email.value, generatedPass).subscribe(res => {
      if(res.error.codigo === '00') {
        this.sendEmail(this.f.email.value, generatedPass);
      } else if(res.error.codigo == '02') {
        this.toastr.error(res.error.mensaje, 'Sistema!');
      } else {
        this.toastr.error('Se produjo un error, inténtelo más tarde.', 'Sistema!');
      }
    })    
  }
}

logout() {
  this.limpiarLoginForm();
  this.authSrv.logout();
  this.currentUser = null;
  this.hideHorarios = true;
  this.router.navigate(['/portal']);
}

limpiarLoginForm() {
  this.f.email.setValue("");
  this.f.password.setValue("");
}

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  get g() { return this.regClienteForm.controls; }
}
