import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgendaPedidosComponent } from '../agenda-pedidos/agenda-pedidos.component';

@Component({
  selector: 'app-cozinha-home',
  standalone: true,
  templateUrl: './cozinha-home.component.html',
  styleUrls: ['./cozinha-home.component.scss'],
  imports: [CommonModule],
})
export class CozinhaHomeComponent {

  constructor(private router: Router) { }

  sair(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  abrirAgenda(): void {
    this.router.navigate(['/agenda-pedido']);
  }

  abrirReceitas(): void {
    this.router.navigate(['/receitas']);
  }

  abrirPedidos(): void {
    this.router.navigate(['/pedidos-busca']);
  }

  abrirPedidosEmProducao(): void {
    this.router.navigate(['/busca-pedido-producao']);
  }
}
