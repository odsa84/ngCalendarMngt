import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { utilClass } from '../../../../utils/utilClass';
import { AuthenticationService } from '../../../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {

  recuperarForm: any;
  submitted = false;
  loading = false;
  showSpinner = false;
  currentUser: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private util: utilClass,
    private authSrv: AuthenticationService,
    private toastr: ToastrService,
    private route: Router
    ) { 
    this.recuperarForm = this.formBuilder.group({
      passwordAnt: ['', Validators.required],
      passwordNew: ['', Validators.required],
			confirmPass: ['', Validators.required]
    }, {
      validator: this.util.MustMatch('passwordNew', 'confirmPass')
    });
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

  get f() { return this.recuperarForm.controls; }
}

