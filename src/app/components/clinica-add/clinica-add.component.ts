import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClinicaService } from '../../services/clinica.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs';
import { ClinicaRespuesta } from '../../entities/clinicaRespuesta';
import { Error } from '../../entities/error';
import { tap } from 'rxjs/operators';
import { AlertService } from '../../services/alert.service';
import { ToastrService } from 'ngx-toastr';
import { ProvinciaService } from '../../services/provincia.service';
import { CiudadService } from '../../services/ciudad.service';

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

  provincias: any = [];    
  ciudades: any = [];
  selectedProv;
  selectedCiu;

  numberPattern = "^((\\+91-?)|0)?[0-9]{10}$";

  constructor(
    private formBuilder: FormBuilder,
    private clinicaSrv: ClinicaService,
    private authSrv: AuthenticationService,
    private alertSrv: AlertService,
    private toastr: ToastrService,
    private provinciaSrv: ProvinciaService,
    private ciudadSrv: CiudadService
    ) {
      this.addClinicaForm = this.formBuilder.group({
        nombreCli: ['', Validators.required],
        telefonoCli: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(7), 
          Validators.maxLength(15)]],
        emailCli: ['', Validators.email],
        infoGeneralCli: [''],
        estadoCli: [1, Validators.required],
        direccionCli: ['', Validators.required],
        referenciaCli: ['', Validators.required],
        provinciaSelect: [0, Validators.required],        
        ciudadSelect: [0, Validators.required]
      });

      this.getProvincias();
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
    this.clinicaSrv.clinicaAdd(this.clinicaSrv.crearEntradaInsertarClinica(currentUser.usuario.id, this.f.nombreCli.value, 
      this.f.telefonoCli.value, this.f.emailCli.value, "", this.f.infoGeneralCli.value, this.f.direccionCli.value, 
      this.f.referenciaCli.value, this.f.provinciaSelect.value, this.f.ciudadSelect.value, true))    
    .subscribe(res => {
      this.loading = false;
      this.submitted = false;
      if(res.error.codigo === '00') {
        this.limpiarFormulario();
        //this.alertSrv.success("Correcto!!!");
        this.toastr.success("Correcto!!!", "Sistema!")
      } else{
        this.toastr.error("Error!!!! Vuelva a intentarlo.", "Sistema!");
      }
    });  
    
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
    this.ciudadSrv.ciudadPorProvincia(this.f.provinciaSelect.value).subscribe(res => {
      res.ciudades.forEach(elem => {
        this.ciudades = [...this.ciudades, {
          nombre: elem.nombre,
          id: elem.id
        }];
      })
    })
  }

  limpiarFormulario() {
    this.f.nombreCli.setValue("");
    this.f.telefonoCli.setValue("");
    this.f.emailCli.setValue("");
    this.f.infoGeneralCli.setValue("");
    this.f.direccionCli.setValue("");
    this.f.referenciaCli.setValue("");
    this.f.provinciaSelect.setValue(0);
    this.f.ciudadSelect.setValue(0);
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // convenience getter for easy access to form fields
	get f() { return this.addClinicaForm.controls; }

}
