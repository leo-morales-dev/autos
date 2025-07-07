import { Routes } from '@angular/router';
import { ListarAutosComponent } from './pages/listar-autos/listar-autos';
import { AgregarAutosComponent } from './pages/agregar-autos/agregar-autos';
import { EditarAutosComponent } from './pages/editar-autos/editar-autos';

export const routes: Routes = [
  { path: '', redirectTo: 'listar-autos', pathMatch: 'full' },
  { path: 'listar-autos', component: ListarAutosComponent },
  { path: 'agregar-autos', component: AgregarAutosComponent },
  { path: 'editar-autos/:id', component: EditarAutosComponent },
  { path: '**', redirectTo: 'listar-autos' }
];