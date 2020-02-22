import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gestion de Calendario';
  toggled = false;
  collapsed = false;

  constructor(private readonly auth: AuthenticationService, private readonly router: Router) { }

  logout(): void {
		this.auth.logout();
		this.router.navigate(['/login']);
  }

  onToggle(){
    this.toggled = !this.toggled;
  }
}
