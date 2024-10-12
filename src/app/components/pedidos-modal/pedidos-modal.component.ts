import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PedidosService } from '../../services/pedidos.service';
import { ProdutosService } from '../../services/produtos.service';

@Component({
  selector: 'app-pedidos-modal',
  templateUrl: './pedidos-modal.component.html',
  styleUrls: ['./pedidos-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatDialogContent, MatDialogActions],
})
export class PedidosModalComponent {
  selectedPedido: any | null = null;  // Armazena o pedido selecionado

  constructor(
    public dialogRef: MatDialogRef<PedidosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pedidosService: PedidosService,
    private produtosService: ProdutosService,
    private router: Router
  ) {}

  // Função chamada ao selecionar um pedido
  selectPedido(pedido: any): void {
    this.selectedPedido = pedido;
    this.loadItensDoPedido(pedido.id); // Chamar método para carregar os itens
  }

  // Função chamada para limpar o pedido selecionado e voltar à lista
  clearSelectedPedido(): void {
    this.selectedPedido = null;
  }

  // Função chamada ao clicar no botão de "Produzir Pedido"
  produzirPedido(): void {
    if (this.selectedPedido) {
      
      this.router.navigate(['/producao-pedido', this.selectedPedido.id]);
      
      // Fechar o modal
      this.dialogRef.close();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  loadItensDoPedido(idPedido: string): void {
    this.pedidosService.getItensPedido(idPedido).subscribe({
      next: (itens) => {
        // Inicialmente carrega os itens sem os detalhes do produto
        this.selectedPedido.itens = itens;
  
        // Para cada item, buscamos os detalhes do produto usando o idProduto
        this.selectedPedido.itens.forEach((item: any) => {
          this.produtosService.getProdutoById(item.idProduto).subscribe({
            next: (produto) => {
              // Atualiza o item com os detalhes do produto
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
  
  getOrderedPeriods(pedidos: any): any[] {
    const periods = Object.keys(pedidos).map((periodKey) => {
      return { 
        periodKey, 
        pedidos: pedidos[periodKey],
        horarioInicio: pedidos[periodKey][0]?.periodoEntrega?.horarioInicio || "00:00:00" // Obtém o horário de início do primeiro pedido
      };
    });
  
    // Ordena os períodos pelo horário de início
    return periods.sort((a, b) => {
      return a.horarioInicio.localeCompare(b.horarioInicio);
    });
  }
  
}
