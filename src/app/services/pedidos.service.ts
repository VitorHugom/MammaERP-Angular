import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private baseUrl = environment.apiUrl + '/pedidos';

  private periodosUrl = environment.apiUrl + '/periodos_entrega';

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getPedidoById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  getSimplePedidoById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/busca/${id}`);
  }

  createPedido(pedido: any): Observable<any> {
    return this.http.post(this.baseUrl, pedido);
  }
  
  updatePedido(id: string, pedido: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, pedido);
  }
  
  deletePedido(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  addItemPedido(idPedido: string, item: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${idPedido}/itens`, item);  // Chama o endpoint /pedidos/{id}/itens
  }
  
  getItensPedido(idPedido: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${idPedido}/itens`);  // Chama o endpoint /pedidos/{id}/itens
  }

  updateItemPedido(idPedido: number, idItem: number, itemPayload: any): Observable<any> {
    const url = `${this.baseUrl}/itens/${idItem}`; // Endpoint de atualização
    return this.http.put(url, itemPayload); // Faz a requisição PUT
  }

  deleteItemPedido(idItensPedido: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/itens/${idItensPedido}`);
  }


  getPeriodosEntrega() {
    return this.http.get<any[]>(`${this.periodosUrl}`);
  }

  // Busca todos os pedidos aguardando
  getPedidosAguardando(): Observable<any> {
    return this.http.get(`${this.baseUrl}/aguardando`);
  }

  getPedidosPorMes(ano: number, mes: number, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/agenda/${ano}/${mes}?page=${page}&size=${size}`);
  }

  // Função para alterar o status do pedido
  atualizarStatusPedido(id: string, status: string): Observable<any> {
    const url = `${this.baseUrl}/${id}/status`;  // Endpoint que altera o status do pedido
    const payload = { status };                  // Payload dinâmico para atualizar o status
    return this.http.put(url, payload);          // Fazendo o PUT para atualizar o status
  }

  getPedidosEmProducao(): Observable<any> {
    return this.http.get(`${this.baseUrl}/em-producao`);
  }

  // Novo método para consumir o endpoint de busca com paginação e ordenação
  getPedidosBusca(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get(`${this.baseUrl}/busca`, { params });
  }

  buscarPedidosPorRazaoSocial(razaoSocial: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('razaoSocial', razaoSocial)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get(`${this.baseUrl}/busca-por-razao-social`, { params });
  }
}
