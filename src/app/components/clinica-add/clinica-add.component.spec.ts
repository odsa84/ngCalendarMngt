import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicaAddComponent } from './clinica-add.component';

describe('ClinicaAddComponent', () => {
  let component: ClinicaAddComponent;
  let fixture: ComponentFixture<ClinicaAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicaAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
