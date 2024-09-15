import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = 'http://localhost:8080/auth/login'; // URL do endpoint de login

  constructor(private http: HttpClient) {}

  login(credentials: { nomeUsuario: string; senha: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials);
  }
}
