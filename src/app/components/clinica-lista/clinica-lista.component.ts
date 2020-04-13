import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Clinica } from '../../entities/clinica';
import { ClinicaService } from '../../services/clinica.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ShareDataService } from '../../services/share-data.service';
import { Router } from '@angular/router';
import { CiudadService } from '../../services/ciudad.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clinica-lista',
  templateUrl: './clinica-lista.component.html',
  styleUrls: ['./clinica-lista.component.css']
})
export class ClinicaListaComponent implements OnInit {

  //clinicas: Observable<Clinica[]>;
  term: string
  clinicas: any = [];
  paginationConfig: any;
  ciudad: any;
  submitted = false;
  loading = false;

  constructor(
    private clinicaSrv: ClinicaService, 
    private authSrv: AuthenticationService,
    private shareDataSrv: ShareDataService,
    private router: Router,
    private ciudadSrv: CiudadService,
    private toastr: ToastrService
    ) {         
    this.getClinicas();
    
    this.paginationConfig = {
      itemsPerPage: 5,
      currentPage: 1
    };
        
  }

  ngOnInit() {
  }

  getClinicas() {
    this.clinicas = [];
    const currentUser = this.authSrv.currentUserValue;
    this.clinicaSrv.clinicaListar(currentUser.usuario.id).subscribe(res => {
      res.clinicas.forEach(elem => {      
        this.clinicas = [...this.clinicas, elem];
      });
    })    
  }

  getCiudad(idProv: any) {
    this.ciudadSrv.ciudadPorProvincia(idProv)
  }

  onPageChange(event) {
    this.paginationConfig.currentPage = event;
  }

  mostrarDetalles(id: number) {

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

  eliminar(cli: any) {
    this.submitted = true;
    this.loading = true;
    const currentUser = this.authSrv.currentUserValue;
    this.clinicaSrv.eliminar(this.clinicaSrv.crearEntradaActualizarClinica(cli.id, currentUser.usuario.id, cli.nombre, 
      cli.telefono, cli.email, cli.razonSocial, cli.infoGeneral, cli.direccion, cli.referencia, 
      cli.idProvincia, cli.idCiudad, false)).subscribe(res => {
        this.loading = false;
        this.submitted = false;
        if(res.error.codigo === '00') {
          this.getClinicas();
          this.toastr.success("Correcto!!!", "Sistema!")
        } else{
          this.toastr.error("Error!!!! Vuelva a intentarlo.", "Sistema!");
        }
      })
  }
}
