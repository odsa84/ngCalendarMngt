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

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClinicaListaComponent,
    ClinicaAddComponent,
    DoctorAddComponent,
    DoctorListaComponent,
    SidebarComponent
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
    NgMultiSelectDropDownModule.forRoot(),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    })
  ],
  providers: [
    errorInterceptorProvider,
    jwtInterceptorProvider,
    ConfigActions,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
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
