import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppMainComponent } from './components/app-main/app-main.component';
import { AuthGuard } from './modules/app-auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ClinicaListaComponent } from './components/clinica-lista/clinica-lista.component';
import { ClinicaAddComponent } from './components/clinica-add/clinica-add.component';
import { DoctorAddComponent } from './components/doctor-add/doctor-add.component';
import { DoctorListaComponent } from './components/doctor-lista/doctor-lista.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { PortalComponent } from './components/clientPortal/portal/portal.component';
import { DoctorLoginComponent } from './components/login/doctor-login/doctor-login.component';
import { RecuperarComponent } from './components/clientPortal/recuperar-contrasenia/recuperar/recuperar.component';
import { PerfilPacienteComponent } from './components/clientPortal/perfil-paciente/perfil-paciente.component';
import { HorasLaboralesComponent } from './components/horas-laborales/horas-laborales.component';

const routes: Routes = [
  {
    path: '',
    component: AppMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'clinica-lista',
        component: ClinicaListaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'clinica-add',
        component: ClinicaAddComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'doctor-lista',
        component: DoctorListaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'doctor-add',
        component: DoctorAddComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'calendario',
        component: CalendarComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'portal/perfil-paciente',
        component: PerfilPacienteComponent
      },
      {
        path: 'horas-laborales',
        component: HorasLaboralesComponent
      },
    ]
  },
  {
    path: 'portal',
    component: PortalComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'doctor-login',
    component: DoctorLoginComponent
  },
  {
    path: 'portal/cambiar-contrasenia',
    component: RecuperarComponent
  },
  {
    path: 'perfil-paciente',
    component: PerfilPacienteComponent
  },
  
  // otherwise redirect to home
  { path: '**', redirectTo: '' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
