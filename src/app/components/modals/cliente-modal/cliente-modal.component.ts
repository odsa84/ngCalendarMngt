import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { utilClass } from '../../../utils/utilClass';

@Component({
  selector: 'app-cliente-modal',
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.css']
})
export class ClienteModalComponent implements OnInit {

  addClienteForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  
  constructor(
    private dialogRef: MatDialogRef<ClienteModalComponent>,
    private formBuilder: FormBuilder,
    private clienteSrv: ClienteService,
    private toastr: ToastrService,
    private util: utilClass
    ) { 
      this.addClienteForm = this.formBuilder.group({
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],      
        cedula: ['', Validators.required],
        email: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
        telefono: [''],
        sintomas: [''],
        diagnostico: [''],
        indicaciones: ['']
      })

  }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    if(!this.addClienteForm.valid) {      
      return false;
    }
    this.loading = true;
    this.clienteSrv.clienteAdd(this.clienteSrv.crearEntradaInsertar(
      this.f.nombres.value, this.f.apellidos.value, 
      this.f.cedula.value, this.f.email.value, this.util.randomString(), this.f.telefono.value))    
    .subscribe(res => {
      this.loading = false;
      this.submitted = false;
      if(res.error.codigo === '00') {
        this.toastr.success("Ha ingresado correctamente al paciente.", "Sistema!");
        this.closeModal(res.clientes[0]);
      } else if(res.error.codigo === '02'){
        this.toastr.error("Email proporcionado ya existe.", "Sistema!");
      } else {
        this.toastr.error("Error, consulte al administrador.", "Sistema!");
      }
    });
  }

  actionFunction() {

  }

  closeModal(cliente: any) {
    this.dialogRef.close({event:'close',data: cliente});
  }

  limpiarFormulario() {

  }

  get f() { return this.addClienteForm.controls; }

}
