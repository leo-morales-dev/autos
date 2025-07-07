import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AutosService, Auto, Marca, Modelo } from '../../service/autos-service';

@Component({
  selector: 'app-editar-autos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-autos.html',
  styleUrls: ['./editar-autos.css']
})
export class EditarAutosComponent implements OnInit {
  autoForm!: FormGroup;
  enviado = false;
  currentYear = new Date().getFullYear();

  marca!: Marca;
  modelos: Modelo[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actRoute: ActivatedRoute,
    private autosService: AutosService
  ) {}

  ngOnInit(): void {
    const id = this.actRoute.snapshot.paramMap.get('id')!;
    this.autoForm = this.fb.group({
      modelo: ['', Validators.required],
      newModelo: [''],
      anio: [null, [Validators.required, Validators.min(1980), Validators.max(this.currentYear)]],
      precio: [null, [Validators.required, Validators.min(0)]]
    });

    this.autosService.getAuto(id).subscribe({
      next: (auto: Auto) => {
        this.marca = auto.marca;
        this.autosService.getModelos(auto.marca._id).subscribe({
          next: mods => {
            this.modelos = mods;
            this.autoForm.patchValue({
              modelo: auto.modelo._id,
              anio: auto.anio,
              precio: auto.precio
            });
          },
          error: (e: any) => console.error('Error cargando modelos', e)
        });
      },
      error: (e: any) => console.error('Error cargando auto', e)
    });
  }

  get f() { return this.autoForm.controls; }

  onSubmit(): void {
    this.enviado = true;
    if (this.autoForm.invalid) return;

    const autoId = this.actRoute.snapshot.paramMap.get('id')!;
    const modeloId = this.f['modelo'].value;
    const newName = this.f['newModelo'].value.trim();

    const saveAuto = (mid: string) => {
      this.autosService
        .actualizarAuto(autoId, { modelo: mid, anio: this.f['anio'].value, precio: this.f['precio'].value })
        .subscribe(() => this.router.navigateByUrl('/listar-autos'));
    };

    if (newName) {
      this.autosService.updateModelo(modeloId, newName).subscribe({
        next: upd => saveAuto(upd._id!),
        error: (e: any) => console.error('Error renombrando modelo', e)
      });
    } else {
      saveAuto(modeloId);
    }
  }
}
