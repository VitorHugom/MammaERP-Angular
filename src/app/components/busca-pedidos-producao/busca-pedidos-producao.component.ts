import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-busca-pedidos',
  templateUrl: './busca-pedidos-producao.component.html',
  styleUrls: ['./busca-pedidos-producao.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class BuscaPedidosProducaoComponent implements OnInit {
  pedidos: any[] = [];
  filteredPedidos: any[] = [];
  searchQuery: string = '';
  searchBy: string = 'cliente';

  constructor(private pedidosService: PedidosService, private router: Router) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.pedidosService.getPedidosEmProducao().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.filteredPedidos = data;
      },
      error: (err) => {
        console.error('Erro ao carregar pedidos:', err);
      }
    });
  }

  searchPedidos(): void {
    const query = this.searchQuery.toLowerCase();
    if (this.searchBy === 'id') {
      this.filteredPedidos = this.pedidos.filter(pedido => pedido.id.toString().includes(query));
    } else if (this.searchBy === 'cliente') {
      this.filteredPedidos = this.pedidos.filter(pedido =>
        (pedido.cliente.razaoSocial?.toLowerCase().includes(query) || pedido.cliente.nomeFantasia?.toLowerCase().includes(query))
      );
    }
  }

  viewPedido(id: string): void {
    this.router.navigate(['/producao-pedido', id]);
  }

  navigateToHome(): void {
    this.router.navigate(['/cozinha-home']);
  }
}
