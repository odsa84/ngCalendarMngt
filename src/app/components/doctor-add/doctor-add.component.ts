import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs';
import { DoctorRespuesta } from '../../entities/doctorRespuesta';
import { Error } from '../../entities/error';
import { tap } from 'rxjs/operators';
import { AlertService } from '../../services/alert.service';
import { DoctorService } from '../../services/doctor.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-doctor-add',
  templateUrl: './doctor-add.component.html',
  styleUrls: ['./doctor-add.component.css']
})
export class DoctorAddComponent implements OnInit {

  addDoctorForm: FormGroup;
  submitted: false;
  loading: false;
  result: Observable<Error>;

  selectedItemsT = [];
  selectedItemsE = [];
  selectedItemsC = [];
  dropdownSettings = {};
  dropdownSettings1 = {};
  doctorTitulos: any = [];
  doctorClinicas: any = [];
  doctorEspecialidades: any = [];
  
  docSelectedTitulos: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private doctorSrv: DoctorService,
    private alertSrv: AlertService,
    private authSrv: AuthenticationService
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

    this.doctorTitulos = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];

    this.doctorClinicas = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];

    this.doctorEspecialidades = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onItemSelectT(item: any) {
    let id = item.item_id
    this.docSelectedTitulos.push({idClinica: id});
    console.log(this.docSelectedTitulos);
  }

  onSelectAllT(items: any) {
    this.docSelectedTitulos = [];
    items.forEach(element => {
      this.docSelectedTitulos = [...this.docSelectedTitulos, {idClinica: element.item_id}];
    });
    console.log(this.docSelectedTitulos);
  }

  deSelectAllT(items: any) {
    this.docSelectedTitulos = [];
  }

  deSelectT(item: any ) {
    this.removeItems(this.docSelectedTitulos, item.item_id);
    console.log(item.item_id);
  }

  removeItems(arr: any[], id: number): void {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].idClinica === id) {
        arr.splice(i--, 1);
      }
    }
    console.log(arr);
  }

}
