import { Component, OnInit, ViewEncapsulation, AfterViewInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnInit {

  navbarOpen = false;
  public clicked = false;
  _el: any;
  

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick(event): void {
    event.preventDefault();
    event.stopPropagation();
    this.clicked = true;
  }

  @HostListener('document:click', ['event'])
  private clickedOutside(event): void {
    if (this.clicked) {
      this._el.nativeElement.querySelector('.dropdown-menu').classList.toggle('show');
    }
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

}
