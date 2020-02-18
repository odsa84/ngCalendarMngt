import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClinicaService } from '../../services/clinica.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs';
import { ClinicaRespuesta } from '../../entities/clinicaRespuesta';
import { Error } from '../../entities/error';
import { tap } from 'rxjs/operators';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-clinica-add',
  templateUrl: './clinica-add.component.html',
  styleUrls: ['./clinica-add.component.css']
})
export class ClinicaAddComponent implements OnInit {

  addClinicaForm: FormGroup;
  submitted = false;
  loading = false;
  result: Observable<Error>;

  constructor(
    private formBuilder: FormBuilder,
    private clinicaSrv: ClinicaService,
    private authSrv: AuthenticationService,
    private alertSrv: AlertService
    ) {
    this.addClinicaForm = this.formBuilder.group({
      nombreCli: ['', Validators.required],
      razonSocialCli: ['', Validators.required],
      infoGeneralCli: ['', Validators.required],
      estadoCli: [1, Validators.required]
    })
   }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;

    this.alertSrv.clear();

    if(!this.addClinicaForm.valid) {      
      return false;
    }
    this.loading = true;
    const currentUser = this.authSrv.currentUserValue;
    this.clinicaSrv.clinicaAdd(currentUser.usuario.id, this.f.nombreCli.value, 
      this.f.razonSocialCli.value, this.f.infoGeneralCli.value, Number.parseInt(this.f.estadoCli.value))    
    .subscribe(res => {
      this.loading = false;
      this.submitted = false;
      if(res.error.codigo === '00') {
        this.limpiarFormulario();
        this.alertSrv.success("Su clinica se creo satisfactoriamente");
      } else{
        this.alertSrv.error("Hubo un problema al crear la clinica, vuelva a intentarlo.");
        console.log("Error...");
      }
    });  
    
  }

  limpiarFormulario() {
    this.f.nombreCli.setValue("");
    this.f.razonSocialCli.setValue("");
    this.f.infoGeneralCli.setValue("");
    this.f.estadoCli.setValue("");
  }

  // convenience getter for easy access to form fields
	get f() { return this.addClinicaForm.controls; }

}
