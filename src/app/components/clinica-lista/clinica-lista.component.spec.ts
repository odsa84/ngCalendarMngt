import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicaListaComponent } from './clinica-lista.component';

describe('ClinicaListaComponent', () => {
  let component: ClinicaListaComponent;
  let fixture: ComponentFixture<ClinicaListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicaListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
