import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService {
  private baseUrl = 'http://localhost:8080/forma-pagamento';

  constructor(private http: HttpClient) {}

  getFormasPagamento(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getFormaPagamentoById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createFormaPagamento(formaPagamento: any): Observable<any> {
    return this.http.post(this.baseUrl, formaPagamento);
  }

  updateFormaPagamento(id: number, formaPagamento: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, formaPagamento);
  }

  deleteFormaPagamento(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  buscarFormasPagamentoPorDescricao(nome: string, page: number = 0): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('nome', nome);
    return this.http.get(`${this.baseUrl}/busca-por-descricao`, { params });
  }

  getFormasPagamentoBusca(page: number = 0): Observable<any> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get(`${this.baseUrl}/busca`, { params });
  }
}
