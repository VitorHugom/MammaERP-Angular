import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private baseUrl = 'http://localhost:8080/clientes';

  private viacepUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getClienteById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createCliente(cliente: any): Observable<any> {
    return this.http.post(this.baseUrl, cliente);
  }

  updateCliente(id: string, cliente: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, cliente);
  }

  deleteCliente(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getEnderecoByCep(cep: string): Observable<any> {
    return this.http.get(`${this.viacepUrl}/${cep}/json`);
  }
  
  getCidadeByCodigoIbge(codigoIbge: string): Observable<any> {
    return this.http.get(`http://localhost:8080/cidades/codigoIbge/${codigoIbge}`);
  }

  searchClientes(nome: string, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('nome', nome)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}/search`, { params });
  }
}
