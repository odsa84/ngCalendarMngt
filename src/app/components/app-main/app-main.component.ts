import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './app-main.component.html',
  styleUrls: ['./app-main.component.css']
})
export class AppMainComponent implements OnInit {
  public sidebarMenuOpened = true;
  @ViewChild('contentWrapper', { static: false }) contentWrapper;

  constructor(
    private auth: AuthenticationService, 
    private router: Router,
    private renderer: Renderer2
    ) { }

  ngOnInit() {
  }

  mainSidebarHeight(height) {
    // this.renderer.setStyle(
    //   this.contentWrapper.nativeElement,
    //   'min-height',
    //   height - 114 + 'px'
    // );
  }

  toggleMenuSidebar() {
    console.log('sidebarMenuCollapsed', this.sidebarMenuOpened);
    if (this.sidebarMenuOpened) {
      this.renderer.removeClass(document.body, 'sidebar-open');
      this.renderer.addClass(document.body, 'sidebar-collapse');
      this.sidebarMenuOpened = false;
    } else {
      this.renderer.removeClass(document.body, 'sidebar-collapse');
      this.renderer.addClass(document.body, 'sidebar-open');
      this.sidebarMenuOpened = true;
    }
  }
}
