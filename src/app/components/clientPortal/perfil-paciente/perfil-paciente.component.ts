import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { utilClass } from '../../../utils/utilClass';
import { ToastrService } from 'ngx-toastr';
import { CalendarService } from '../../../services/calendar.service';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.component.html',
  styleUrls: ['./perfil-paciente.component.css']
})
export class PerfilPacienteComponent implements OnInit {

  nombreCliente: string;
  currentUser: any = null;
  recuperarForm: any;
  submitted = false;
  loading = false;
  showSpinner = false;
  showPassChange = false;
  citas: any;

  constructor(
    private formBuilder: FormBuilder,
    private util: utilClass,
    private authSrv: AuthenticationService,
    private toastr: ToastrService,
    private route: Router,
    private calendarSrv: CalendarService
    ) { 
      this.recuperarForm = this.formBuilder.group({
        passwordAnt: ['', Validators.required],
        passwordNew: ['', Validators.required],
        confirmPass: ['', Validators.required]
      }, {
        validator: this.util.MustMatch('passwordNew', 'confirmPass')
      });

      this.currentUser = this.authSrv.currentUserValue;
      if(this.currentUser !== null && this.currentUser.tipo === 'client') {
        this.nombreCliente = this.currentUser.cliente.nombres + ' ' + this.currentUser.cliente.apellidos;
      } else {
        this.route.navigate(['/portal']);
      }
    }

  ngOnInit() {
  }

  onSubmit() {
    console.log("Llegas aqui??")
    this.submitted = true;	
		if (this.recuperarForm.invalid) {
			this.submitted = false;
			return;
		}

    this.showSpinner = true;
    this.loading = true;
    this.currentUser = this.authSrv.currentUserValue;
    if(this.currentUser !== null) {
      this.authSrv.changePasswordPaciente(this.currentUser.cliente.email, this.f.passwordAnt.value, this.f.passwordNew.value)
      .subscribe(res => {
        this.showSpinner = false;
        this.loading = false;    
        if(res.error.codigo === '00') {
          this.toastr.success("Se ha cambiado la contraseña.", "Sistema!");
          this.route.navigate(['/portal']);
        } else {
          this.toastr.error("Hubo un error al ejecutar el cambio de contraseña.", "Sistema!");
        }
      })
    } else {
      this.toastr.error("Deberia estar logueado para ejecutar esta acción.", "Sistema!");
    }
  }

  showPassChangeForm() {
    this.showPassChange = true;
  }

  logout() {
    this.authSrv.logout();
    this.currentUser = null;
    this.route.navigate(['/portal']);
  }

  get f() { return this.recuperarForm.controls; }
}
