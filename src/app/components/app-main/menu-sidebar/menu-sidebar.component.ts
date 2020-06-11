import { Component, OnInit, AfterViewInit, Renderer2, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ClinicaService } from '../../../services/clinica.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { DoctorService } from '../../../services/doctor.service';
import { Observable } from 'rxjs';
import { CalendarService } from '../../../services/calendar.service';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.css']
})
export class MenuSidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('mainSidebar', { static: false }) mainSidebar;
  @Output() mainSidebarHeight: EventEmitter<any> = new EventEmitter<any>();

  clinicasCount: number = 0;
  docsCount: number = 0;
  citasCount: number = 0;
  currentUser: any;

  constructor(
    private clinicaSrv: ClinicaService,
    private authSrv: AuthenticationService,
    private doctorSrv: DoctorService,
    private calendarSrv: CalendarService
    ) { }

  ngOnInit() {
    this.currentUser = this.authSrv.currentUserValue;
    if(this.currentUser.tipo === 'owner') {
      this.clinicaSrv.clinicaListar(this.currentUser.usuario.id).subscribe(res => {
        this.clinicasCount = res.clinicas.length;
      });  
      
      this.calendarSrv.citasAgendadas().subscribe(res => {
        this.citasCount = res.calendarios.length;
      });

      this.doctorSrv.doctores().subscribe(res => {
        this.docsCount = res.doctores.length;
      });
    } else if(this.currentUser.tipo === 'doctor') {
      this.clinicaSrv.clinicaListarDoctor(this.currentUser.doctor.id).subscribe(res => {
        this.clinicasCount = res.clinicas.length;
      });
    }    

  }

  ngAfterViewInit() {
    this.mainSidebarHeight.emit(this.mainSidebar.nativeElement.offsetHeight);
  }

}
