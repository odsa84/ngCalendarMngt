import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs';
import { DoctorRespuesta } from '../../entities/doctorRespuesta';
import { Error } from '../../entities/error';
import { tap } from 'rxjs/operators';
import { AlertService } from '../../services/alert.service';
import { DoctorService } from '../../services/doctor.service';
import { ClinicaService } from '../../services/clinica.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Clinica } from '../../entities/clinica';
import { TituloService } from '../../services/titulo.service';
import { EspecialidadService } from '../../services/especialidad.service';

@Component({
  selector: 'app-doctor-add',
  templateUrl: './doctor-add.component.html',
  styleUrls: ['./doctor-add.component.css']
})
export class DoctorAddComponent implements OnInit {

  addDoctorForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  result: Observable<Error>;

  selectedItemsT = [];
  selectedItemsE = [];
  selectedItemsC = [];

  dropdownSettings = {};

  doctorTitulos: any = [];
  doctorClinicas: any = [];
  doctorEspecialidades: any = [];
  
  docSelectedTitulos: any = [];
  docSelectedClinicas: any = [];
  docSelectedEspecialidades: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private doctorSrv: DoctorService,
    private alertSrv: AlertService,
    private authSrv: AuthenticationService,
    private clinicaSrv: ClinicaService,
    private tituloSrv: TituloService,
    private espSrv: EspecialidadService
  ) { 
      this.addDoctorForm = this.formBuilder.group({
      nombresDoc: ['', Validators.required],
      apellidosDoc: ['', Validators.required],      
      estadoDoc: [1, Validators.required],
      titulosDoc: [0, Validators.required],
      especialidadesDoc: [0],
      clinicasDoc: [0, Validators.required],
      infoGeneralDoc: ['', Validators.required],
    })
  }

  ngOnInit() {

    this.clinicaSrv.clinicas().subscribe(response => {
      response.clinicas.forEach(element => {
        this.doctorClinicas = [...this.doctorClinicas, {
          item_id: element.id, 
          item_text: element.nombre
        }];
      });
    },
    err => {
      // this.mostrarError(CONSTANTE_ULTIL.ERROR_SITEMA.MENSAJE);
      // this.flagCargando = false;
    })

    this.tituloSrv.titulosAll().subscribe(response => {
      response.titulos.forEach(element => {
        this.doctorTitulos = [...this.doctorTitulos, {
          item_id: element.id,
          item_text: element.titulo1
        }];
      });
    },
    err => {
    })

    this.espSrv.espAll().subscribe(response => {
      response.especialidades.forEach(element => {
        this.doctorEspecialidades = [...this.doctorEspecialidades, {
          item_id: element.id,
          item_text: element.especialidad1
        }];
      });
    },
    err => {
    })

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onSubmit() {
    this.submitted = true;
    this.alertSrv.clear();
    if(!this.addDoctorForm.valid) {      
      return false;
    }
    this.loading = true;
    this.doctorSrv.doctorAdd(this.doctorSrv.crearEntradaInsertarDoctor(this.f.nombresDoc.value, this.f.apellidosDoc.value, 
      this.f.infoGeneralDoc.value, Number.parseInt(this.f.estadoDoc.value), this.docSelectedClinicas,        
       this.docSelectedEspecialidades, this.docSelectedTitulos))    
    .subscribe(res => {
      this.loading = false;
      this.submitted = false;
      if(res.error.codigo === '00') {
        this.limpiarFormulario();
        this.alertSrv.success("Se ingreso el doctor satisfactoriamente");
      } else{
        this.alertSrv.error("Hubo un problema al ingresar el doctor, vuelva a intentarlo.");
        console.log("Error...");
      }
    });  
    
  }

  limpiarFormulario() {
    this.f.nombresDoc.setValue("");
    this.f.apellidosDoc.setValue("");
    this.f.estadoDoc.setValue(1);
    this.f.infoGeneralDoc.setValue("");
    this.docSelectedTitulos = [];
    this.docSelectedEspecialidades = [];
    this.docSelectedClinicas = [];
  }

  onItemSelectT(item: any) {
    let id = item.item_id
    this.docSelectedTitulos.push({idTitulo: id});
  }

  onItemSelectC(item: any) {
    let id = item.item_id
    this.docSelectedClinicas.push({idClinica: id});
  }

  onItemSelectE(item: any) {
    let id = item.item_id
    this.docSelectedEspecialidades.push({idEspecialidad: id});
  }

  onSelectAllT(items: any) {
    this.docSelectedTitulos = [];
    items.forEach(element => {
      this.docSelectedTitulos = [...this.docSelectedTitulos, {idTitulo: element.item_id}];
    });
  }

  onSelectAllC(items: any) {
    this.docSelectedClinicas = [];
    items.forEach(element => {
      this.docSelectedClinicas = [...this.docSelectedClinicas, {idClinica: element.item_id}];
    });
  }

  onSelectAllE(items: any) {
    this.docSelectedEspecialidades = [];
    items.forEach(element => {
      this.docSelectedEspecialidades = [...this.docSelectedEspecialidades, {idEspecialidad: element.item_id}];
    });
  }

  deSelectAllT(items: any) {
    this.docSelectedTitulos = [];
  }

  deSelectAllC(items: any) {
    this.docSelectedClinicas = [];
  }

  deSelectAllE(items: any) {
    this.docSelectedEspecialidades = [];
  }

  deSelectT(item: any ) {
    this.removeItems(this.docSelectedTitulos, item.item_id);
  }

  deSelectC(item: any ) {
    this.removeItems(this.docSelectedClinicas, item.item_id);
  }

  deSelectE(item: any ) {
    this.removeItems(this.docSelectedEspecialidades, item.item_id);
  }

  removeItems(arr: any[], id: number): void {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].idClinica === id) {
        arr.splice(i--, 1);
      }
    }
  }

  get f() { return this.addDoctorForm.controls; }

}
