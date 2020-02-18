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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClinicaListaComponent,
    ClinicaAddComponent,
    DoctorAddComponent,
    DoctorListaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AlertModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    errorInterceptorProvider,
    jwtInterceptorProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
