import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAutos } from './listar-autos';

describe('ListarAutos', () => {
  let component: ListarAutos;
  let fixture: ComponentFixture<ListarAutos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAutos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarAutos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
