import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodosEntregaService {
  private baseUrl = 'http://localhost:8080/periodos_entrega'; // Endpoint para períodos de entrega

  constructor(private http: HttpClient) {}

  // Busca todos os períodos de entrega
  getPeriodosEntrega(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // Busca período de entrega por ID
  getPeriodoEntregaById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Cria um novo período de entrega
  createPeriodoEntrega(periodoEntrega: any): Observable<any> {
    return this.http.post(this.baseUrl, periodoEntrega);
  }

  // Atualiza um período de entrega existente
  updatePeriodoEntrega(id: number, periodoEntrega: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, periodoEntrega);
  }

  // Deleta um período de entrega pelo ID
  deletePeriodoEntrega(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  buscarPeriodosEntregaPorDescricao(nome: string, page: number = 0): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('nome', nome);
    return this.http.get(`${this.baseUrl}/busca-por-descricao`, { params });
  }

  getPeriodosEntregaBusca(page: number = 0): Observable<any> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get(`${this.baseUrl}/busca`, { params });
  }
}
