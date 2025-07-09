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
  enviado     = false;
  marcas      : Marca[]  = [];
  modelos     : Modelo[] = [];
  newMarca    = '';
  newModelo   = '';
  currentYear = new Date().getFullYear();

  // Props para alertas
  alertMessage: string | null = null;
  alertType   : 'danger' | 'success' = 'danger';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private autosService: AutosService
  ) {
    this.autoForm = this.fb.group({
      marca:   ['',   Validators.required],
      modelo:  ['',   Validators.required],
      anio:    [null, [Validators.required, Validators.min(1980), Validators.max(this.currentYear)]],
      precio:  [null, [Validators.required, Validators.min(50000), Validators.max(10000000)]],
    });
  }

  ngOnInit(): void {
    this.autosService.getMarcas().subscribe({
      next: data => this.marcas = data,
      error: ()   => this.showAlert('danger', 'Error cargando marcas.')
    });
  }

  onMarcaChange(event: Event): void {
    const marcaId = (event.target as HTMLSelectElement).value;
    this.autoForm.patchValue({ marca: marcaId, modelo: '' });
    this.modelos = [];
    if (!marcaId) return;
    this.autosService.getModelos(marcaId).subscribe({
      next: data => this.modelos = data,
      error: ()   => this.showAlert('danger', 'Error cargando modelos.')
    });
  }

  addMarca(): void {
    const name = this.newMarca.trim();
    if (!name) {
      this.showAlert('danger', 'Debes ingresar el nombre de la nueva marca.');
      return;
    }
    this.autosService.addMarca(name).subscribe({
      next: marca => {
        this.marcas.push(marca);
        this.autoForm.patchValue({ marca: marca._id });
        this.newMarca = '';
        this.modelos  = [];
        // no mostramos alerta de éxito para marca
        this.clearAlert();
      },
      error: () => this.showAlert('danger', 'No se pudo agregar la marca.')
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
        // no mostramos alerta de éxito
        this.clearAlert();
      },
      error: () => this.showAlert(
        'danger',
        'No se puede eliminar esta marca porque hay autos registrados con ella.'
      )
    });
  }

  addModelo(): void {
    const name    = this.newModelo.trim();
    const marcaId = this.autoForm.value.marca;
    if (!name) {
      this.showAlert('danger', 'Debes ingresar el nombre del nuevo modelo.');
      return;
    }
    if (!marcaId) {
      this.showAlert('danger', 'Selecciona primero una marca antes de agregar un modelo.');
      return;
    }
    this.autosService.addModelo(name, marcaId).subscribe({
      next: modelo => {
        this.modelos.push(modelo);
        this.autoForm.patchValue({ modelo: modelo._id });
        this.newModelo = '';
        // no mostramos alerta de éxito para modelo
        this.clearAlert();
      },
      error: () => this.showAlert('danger', 'No se pudo agregar el modelo.')
    });
  }

  removeModelo(id: string, idx: number): void {
    this.autosService.deleteModelo(id).subscribe({
      next: () => {
        this.modelos.splice(idx, 1);
        if (this.autoForm.value.modelo === id) {
          this.autoForm.patchValue({ modelo: '' });
        }
        this.clearAlert();
      },
      error: () => this.showAlert(
        'danger',
        'No se puede eliminar este modelo porque hay autos registrados con él.'
      )
    });
  }

  get f() {
    return this.autoForm.controls;
  }

  onSubmit(): void {
    this.enviado = true;
    if (this.autoForm.invalid) {
      this.showAlert('danger', 'Completa correctamente todos los campos antes de enviar.');
      return;
    }
    this.clearAlert();
    this.autosService.agregarAuto(this.autoForm.value).subscribe({
      next: ()   => this.showAlert('success', 'Auto agregado correctamente.'),
      complete: () => this.ngZone.run(() => this.router.navigateByUrl('/listar-autos')),
      error: ()  => this.showAlert('danger', 'Ocurrió un error al agregar el auto.')
    });
  }

  private showAlert(type: 'danger' | 'success', msg: string) {
    this.alertType    = type;
    this.alertMessage = msg;
    setTimeout(() => this.clearAlert(), 5000);
  }

  private clearAlert() {
    this.alertMessage = null;
  }
}
