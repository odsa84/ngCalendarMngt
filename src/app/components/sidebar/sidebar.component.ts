import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  toggled = false;
  collapsed = false;

  constructor(private actRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  onToggle(){
    this.toggled = !this.toggled;
  }

}
