import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { jwtInterceptorProvider } from './modules/app-auth/jwt.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { errorInterceptorProvider } from './modules/app-auth/error.interceptor';
import { ClinicaListaComponent } from './components/clinica-lista/clinica-lista.component';
import { ClinicaAddComponent } from './components/clinica-add/clinica-add.component';
import { AlertModule } from './alerts/alert/alert.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DoctorAddComponent } from './components/doctor-add/doctor-add.component';
import { DoctorListaComponent } from './components/doctor-lista/doctor-lista.component';
import { NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { NgReduxModule } from '@angular-redux/store';
import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { rootReducer, ArchitectUIState } from './ThemeOptions/store';
import { ConfigActions } from './ThemeOptions/store/config.actions';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FooterComponent } from './components/app-main/footer/footer.component';
import { HeaderComponent } from './components/app-main/header/header.component';
import { MenuSidebarComponent } from './components/app-main/menu-sidebar/menu-sidebar.component';
import { NotificationsDropdownMenuComponent } from './components/app-main/header/notifications-dropdown-menu/notifications-dropdown-menu.component';
import { AppMainComponent } from './components/app-main/app-main.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgSelectModule } from '@ng-select/ng-select';

import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ClienteModalComponent } from './components/modals/cliente-modal/cliente-modal.component';
import { CitaModalComponent } from './components/modals/cita-modal/cita-modal.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { ClienteContactModalComponent } from './components/modals/cliente-contact-modal/cliente-contact-modal.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { SearchPipe } from './components/clinica-lista/search.pipe';
import { SearchPipeDoctor } from './components/doctor-lista/search.pipe';
import { SearchPipePortal } from './components/clientPortal/portal/search.pipe';

import { NgHttpLoaderModule } from 'ng-http-loader';
import { PortalComponent } from './components/clientPortal/portal/portal.component';
import { DoctorLoginComponent } from './components/login/doctor-login/doctor-login.component';
import { RecuperarComponent } from './components/clientPortal/recuperar-contrasenia/recuperar/recuperar.component';
import { PerfilPacienteComponent } from './components/clientPortal/perfil-paciente/perfil-paciente.component';
import { HorasLaboralesComponent } from './components/horas-laborales/horas-laborales.component';
import { SearchPipeDoctorPortal } from './components/clientPortal/portal/searchDoctor.pipe';

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    AppMainComponent,
    LoginComponent,
    ClinicaListaComponent,
    ClinicaAddComponent,
    DoctorAddComponent,
    DoctorListaComponent,
    SidebarComponent,
    NavBarComponent,
    FooterComponent,
    HeaderComponent,
    MenuSidebarComponent,
    NotificationsDropdownMenuComponent,
    CalendarComponent,
    ClienteModalComponent,
    CitaModalComponent,
    ClienteContactModalComponent,
    AccordionComponent,
    SearchPipe,
    SearchPipeDoctor,
    SearchPipePortal,
    SearchPipeDoctorPortal,
    PortalComponent,
    ClienteContactModalComponent,
    DoctorLoginComponent,
    RecuperarComponent,
    PerfilPacienteComponent,
    HorasLaboralesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AlertModule,
    NgxPaginationModule,
    NgReduxModule,
    NgbModule,
    PerfectScrollbarModule,
    //NgxLimitToPipeModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    FullCalendarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    NgSelectModule,
    MatButtonModule,
    MatDialogModule,
    Ng2SearchPipeModule,
    PerfectScrollbarModule,
    NgxPageScrollCoreModule,
    NgHttpLoaderModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    })
  ],
  providers: [
    errorInterceptorProvider,
    jwtInterceptorProvider,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'es-EC' },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ClienteModalComponent, CitaModalComponent, ClienteContactModalComponent, AccordionComponent]
})
export class AppModule {
  constructor(private ngRedux: NgRedux<ArchitectUIState>,
              private devTool: DevToolsExtension) {

    this.ngRedux.configureStore(
      rootReducer,
      {} as ArchitectUIState,
      [],
      [devTool.isEnabled() ? devTool.enhancer() : f => f]
    );
  }
 }
