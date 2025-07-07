import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAutos } from './editar-autos';

describe('EditarAutos', () => {
  let component: EditarAutos;
  let fixture: ComponentFixture<EditarAutos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarAutos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarAutos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
