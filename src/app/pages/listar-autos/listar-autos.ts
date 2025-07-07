// src/app/pages/listar-autos/listar-autos.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AutosService, Auto } from '../../service/autos-service';

@Component({
  selector: 'app-listar-autos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-autos.html',
  styleUrls: ['./listar-autos.css']
})
export class ListarAutosComponent implements OnInit {
  autos: Auto[] = [];

  constructor(private autosService: AutosService) {}

  ngOnInit(): void {
    this.autosService.getAutos().subscribe({
      next: data => this.autos = data,
      error: err => console.error('Error al cargar autos', err)
    });
  }

  toggleEstado(auto: Auto, i: number): void {
    this.autosService.toggleDisponible(auto._id!, !auto.disponible)
      .subscribe({
        next: updated => this.autos[i].disponible = updated.disponible,
        error: err => console.error('Error al cambiar estado', err)
      });
  }

  eliminar(auto: Auto, i: number): void {
    if (!confirm('¿Eliminar?')) return;
    this.autosService.eliminarAuto(auto._id!)
      .subscribe({
        next: () => this.autos.splice(i, 1),
        error: err => console.error('Error al eliminar auto', err)
      });
  }
}
