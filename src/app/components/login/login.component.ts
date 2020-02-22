import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	showSpinner = false;
	submitted = false;
	returnUrl: string;
 	error = '';
  
  	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private alertSrv: AlertService
	) { }

	ngOnInit() {  
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});

		// reset login status
		this.authenticationService.logout();

		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	onSubmit() {
		this.submitted = true;	
		
		this.alertSrv.clear();

		// stop here if form is invalid
		if (this.loginForm.invalid) {
			this.submitted = false;
			return;
		}

		this.showSpinner = true;
		this.authenticationService.login(this.f.username.value, this.f.password.value)
			.pipe(first())
			.subscribe(
				data => {
					this.router.navigate([this.returnUrl]);
				},
				error => {
					this.error = error;
					this.showSpinner = false;
					this.submitted = false;
					this.alertSrv.error("Usuario y/o contraseña incorrectos");
				});
	}

	// convenience getter for easy access to form fields
	get f() { return this.loginForm.controls; }

}
