import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PedidosService } from '../../services/pedidos.service';
import { ClientesService } from '../../services/clientes.service';
import { TiposCobrancaService } from '../../services/tipos-cobranca.service';
import { VendedoresService } from '../../services/vendedores.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-finalizar-pedido-modal',
  templateUrl: './finalizar-pedido-modal.component.html',
  styleUrls: ['./finalizar-pedido-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, CurrencyPipe]
})
export class FinalizarPedidoModalComponent implements OnInit {
  clienteInput: string = '';
  tipoCobranca: any;
  dataEntrega: string = '';  // Data de Entrega
  periodoEntrega: any;  // Período de Entrega
  total: number;
  clientes: any[] = [];
  tiposCobranca: any[] = [];
  periodosEntrega: any[] = [];  // Listar os períodos de entrega
  showClientesList = false;
  loadingClientes = false;
  currentPageClientes = 0;
  pageSize = 10;

  constructor(
    public dialogRef: MatDialogRef<FinalizarPedidoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pedidosService: PedidosService,
    private clientesService: ClientesService,
    private tiposCobrancaService: TiposCobrancaService,
    private vendedoresService: VendedoresService
  ) {
    this.total = data.total;  // Recebendo o total dos itens passados para o modal
    this.periodosEntrega = data.periodosEntrega; // Passar os períodos de entrega do componente pai
  }

  ngOnInit(): void {
    this.loadTiposCobranca(); // Carrega os tipos de cobrança
  
    // Carrega os períodos de entrega, caso não sejam passados pelo data
    if (!this.data.periodosEntrega) {
      this.loadPeriodosEntrega();
    } else {
      this.periodosEntrega = this.data.periodosEntrega;
    }
  }
  
  // Função para carregar os períodos de entrega, se necessário
  loadPeriodosEntrega(): void {
    this.pedidosService.getPeriodosEntrega().subscribe({
      next: (data) => {
        this.periodosEntrega = data;
      },
      error: (err) => {
        console.error('Erro ao carregar períodos de entrega:', err);
      }
    });
  }
  

  // Carregar tipos de cobrança
  loadTiposCobranca(): void {
    this.tiposCobrancaService.getTiposCobranca().subscribe({
      next: (data) => {
        this.tiposCobranca = data;
      },
      error: (err) => {
        console.error('Erro ao carregar tipos de cobrança:', err);
      }
    });
  }

  // Busca lazy de clientes
  onSearchClientes(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue.length >= 2) {
      this.clienteInput = inputValue;
      this.currentPageClientes = 0;
      this.searchClientesLazy();
    } else {
      this.clientes = [];
      this.showClientesList = false;
    }
  }

  searchClientesLazy(): void {
    this.loadingClientes = true;
    this.clientesService.searchClientes(this.clienteInput, this.currentPageClientes, this.pageSize).subscribe({
      next: (response) => {
        this.clientes = this.currentPageClientes === 0 ? response : [...this.clientes, ...response];
        this.showClientesList = true;
        this.loadingClientes = false;
      },
      error: (err) => {
        this.loadingClientes = false;
        console.error('Erro ao buscar clientes:', err);
      }
    });
  }

  onSelectCliente(cliente: any): void {
    this.data.cliente = cliente;  // Armazena o cliente selecionado no data.cliente
    this.clienteInput = cliente.razaoSocial || cliente.nomeFantasia;
    this.showClientesList = false;
  }

  onFinalizar(): void {
    // Verificação de campos obrigatórios
    if (!this.data.cliente || !this.tipoCobranca || !this.dataEntrega || !this.periodoEntrega) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    // Obter o userId da sessionStorage
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert('Erro ao obter o ID do usuário. Por favor, tente novamente.');
      return;
    }

    // Buscar o vendedor pelo userId
    this.vendedoresService.getVendedorByUserId(+userId).subscribe({
      next: (vendedor) => {
        if (vendedor) {
          const pedidoPayload = {
            idCliente: this.data.cliente.id,
            idVendedor: vendedor.id,
            dataEmissao: '',
            dataEntrega: this.dataEntrega,
            idPeriodoEntrega: this.periodoEntrega.id,
            valorTotal: this.total,
            status: 'aguardando',
            idTipoCobranca: this.tipoCobranca.id
          };

          // Definir a data de emissão para pedidos novos
          const now = new Date();
          now.setHours(now.getHours() - now.getTimezoneOffset() / 60); // Ajusta para GMT-3
          pedidoPayload.dataEmissao = now.toISOString();

          // Criar o pedido
          this.pedidosService.createPedido(pedidoPayload).subscribe({
            next: (response) => {
              console.log('Pedido criado com sucesso:', response);

              // Salvar os itens do pedido
              this.salvarItensDoPedido(response.id);
              this.dialogRef.close(response);
            },
            error: (err) => {
              console.error('Erro ao criar o pedido:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Erro ao buscar vendedor:', err);
      }
    });
  }

  salvarItensDoPedido(idPedido: number): void {
    if (!this.data.itens || this.data.itens.length === 0) {
      console.warn('Nenhum item para salvar.');
      return;
    }

    this.data.itens.forEach((item: any) => {
      const itemPayload = {
        idPedido: idPedido,
        idProduto: item.produto.id,
        preco: item.produto.precoVenda,
        quantidade: item.quantidade
      };

      this.pedidosService.addItemPedido(idPedido.toString(), itemPayload).subscribe({
        next: () => {
          console.log(`Item ${item.produto.descricao} adicionado.`);
        },
        error: (err) => {
          console.error('Erro ao adicionar item:', err);
        }
      });
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
