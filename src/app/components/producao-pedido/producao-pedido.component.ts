import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from '../../services/pedidos.service';
import { ProdutosService } from '../../services/produtos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-producao-pedido',
  templateUrl: './producao-pedido.component.html',
  styleUrls: ['./producao-pedido.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule]
})
export class ProducaoPedidoComponent implements OnInit {
  pedido: any;  // Objeto que armazenará os dados do pedido
  pedidoId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private pedidosService: PedidosService,
    private produtosService: ProdutosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pedidoId = this.route.snapshot.paramMap.get('id');

    if (this.pedidoId) {
      this.loadPedido(this.pedidoId);
    }
  }

  loadPedido(id: string): void {
    this.pedidosService.getPedidoById(id).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        this.loadItensDoPedido(this.pedido.id);
      },
      error: (err) => {
        console.error('Erro ao carregar pedido:', err);
      }
    });
  }

  loadItensDoPedido(idPedido: string): void {
    this.pedidosService.getItensPedido(idPedido).subscribe({
      next: (itens) => {
        this.pedido.itens = itens;
        this.pedido.itens.forEach((item: any) => {
          this.produtosService.getProdutoById(item.idProduto).subscribe({
            next: (produto) => {
              item.produto = produto;
            },
            error: (err) => {
              console.error('Erro ao carregar produto:', err);
            }
          });
        });
      },
      error: (err) => {
        console.error('Erro ao carregar itens do pedido:', err);
      }
    });
  }

  finalizarPedido(): void {
    if (this.pedidoId) {
      this.pedidosService.atualizarStatusPedido(this.pedidoId, 'entregue').subscribe({
        next: () => {
          console.log('Pedido finalizado com sucesso!');
          this.router.navigate(['/cozinha-home']);
        },
        error: (err) => {
          console.error('Erro ao finalizar pedido:', err);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/cozinha-home']);
  }
}
