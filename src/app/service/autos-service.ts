import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Auto {
  _id?: string;
  marca: { _id: string; name: string };
  modelo: { _id: string; name: string };
  anio: number;
  precio: number;
  disponible: boolean;
}

export interface Marca {
  _id?: string;
  name: string;
}

export interface Modelo {
  _id?: string;
  name: string;
  marca: string;
}

@Injectable({ providedIn: 'root' })
export class AutosService {
  private baseUrl = 'https://autos-backend-p2st.onrender.com/api';
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient) {}

  /** AUTOS CRUD */
  getAutos(): Observable<Auto[]> {
    return this.http.get<Auto[]>(`${this.baseUrl}/autos`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  getAuto(id: string): Observable<Auto> {
    return this.http.get<Auto>(`${this.baseUrl}/auto/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  agregarAuto(data: any): Observable<Auto> {
    return this.http.post<Auto>(`${this.baseUrl}/agregar`, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  actualizarAuto(id: string, data: any): Observable<Auto> {
    return this.http.put<Auto>(`${this.baseUrl}/actualizar/${id}`, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  toggleDisponible(id: string, disponible: boolean): Observable<Auto> {
    return this.http.patch<Auto>(
      `${this.baseUrl}/disponible/${id}`,
      { disponible },
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }
  eliminarAuto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /** MARCAS CRUD */
  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.baseUrl}/marcas`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  addMarca(name: string): Observable<Marca> {
    return this.http.post<Marca>(`${this.baseUrl}/marcas`, { name }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  deleteMarca(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/marcas/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /** MODELOS CRUD */
  getModelos(marcaId?: string): Observable<Modelo[]> {
    let params = new HttpParams();
    if (marcaId) params = params.set('marca', marcaId);
    return this.http.get<Modelo[]>(`${this.baseUrl}/modelos`, { ...this.httpOptions, params })
      .pipe(catchError(this.handleError));
  }
  addModelo(name: string, marca: string): Observable<Modelo> {
    return this.http.post<Modelo>(`${this.baseUrl}/modelos`, { name, marca }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  deleteModelo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/modelos/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  updateModelo(id: string, name: string): Observable<Modelo> {
    return this.http.put<Modelo>(`${this.baseUrl}/modelos/${id}`, { name }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('AutosService error:', error);
    return throwError(() => error.error?.message || error.message || error);
  }
}
