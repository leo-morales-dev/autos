// src/app/pages/agregar-autos/agregar-autos.ts

import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AutosService,
  Marca,
  Modelo
} from '../../service/autos-service';

@Component({
  selector: 'app-agregar-autos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agregar-autos.html',
  styleUrls: ['./agregar-autos.css']
})
export class AgregarAutosComponent implements OnInit {
  autoForm: FormGroup;
  enviado = false;

  marcas: Marca[] = [];
  modelos: Modelo[] = [];
  newMarca = '';
  newModelo = '';
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private autosService: AutosService
  ) {
    this.autoForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: [
        null,
        [
          Validators.required,
          Validators.min(1980),
          Validators.max(this.currentYear)
        ]
      ],
      precio: [
        null,
        [
          Validators.required,
          Validators.min(50000),
          Validators.max(10000000)
        ]
      ]
    });
  }

  ngOnInit(): void {
    this.autosService.getMarcas().subscribe({
      next: data => (this.marcas = data),
      error: err => console.error('Error al cargar marcas', err)
    });
  }

  onMarcaChange(event: Event): void {
    const marcaId = (event.target as HTMLSelectElement).value;
    this.autoForm.patchValue({ marca: marcaId, modelo: '' });
    this.modelos = [];
    if (marcaId) {
      this.autosService.getModelos(marcaId).subscribe({
        next: data => (this.modelos = data),
        error: err => console.error('Error al cargar modelos', err)
      });
    }
  }

  addMarca(): void {
    const name = this.newMarca.trim();
    if (!name) return;
    this.autosService.addMarca(name).subscribe({
      next: marca => {
        this.marcas.push(marca);
        this.autoForm.patchValue({ marca: marca._id });
        this.newMarca = '';
        this.modelos = [];
      },
      error: err => console.error('Error al agregar marca', err)
    });
  }

  removeMarca(id: string, idx: number): void {
    this.autosService.deleteMarca(id).subscribe({
      next: () => {
        this.marcas.splice(idx, 1);
        if (this.autoForm.value.marca === id) {
          this.autoForm.patchValue({ marca: '', modelo: '' });
          this.modelos = [];
        }
      },
      error: err => console.error('Error al eliminar marca', err)
    });
  }

  addModelo(): void {
    const name = this.newModelo.trim();
    const marcaId = this.autoForm.value.marca;
    if (!name || !marcaId) return;
    this.autosService.addModelo(name, marcaId).subscribe({
      next: modelo => {
        this.modelos.push(modelo);
        this.autoForm.patchValue({ modelo: modelo._id });
        this.newModelo = '';
      },
      error: err => console.error('Error al agregar modelo', err)
    });
  }

  removeModelo(id: string, idx: number): void {
    this.autosService.deleteModelo(id).subscribe({
      next: () => {
        this.modelos.splice(idx, 1);
        if (this.autoForm.value.modelo === id) {
          this.autoForm.patchValue({ modelo: '' });
        }
      },
      error: err => console.error('Error al eliminar modelo', err)
    });
  }

  get f() {
    return this.autoForm.controls;
  }

  onSubmit(): void {
    this.enviado = true;
    if (this.autoForm.invalid) return;
    this.autosService
      .agregarAuto(this.autoForm.value)
      .subscribe({
        next: auto => console.log('Auto agregado:', auto),
        complete: () =>
          this.ngZone.run(() => this.router.navigateByUrl('/listar-autos')),
        error: err => console.error('Error al agregar auto', err)
      });
  }
}
