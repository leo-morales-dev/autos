import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAutos } from './agregar-autos';

describe('AgregarAutos', () => {
  let component: AgregarAutos;
  let fixture: ComponentFixture<AgregarAutos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarAutos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarAutos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
