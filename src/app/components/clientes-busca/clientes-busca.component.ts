import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-clientes-busca',
  standalone: true,
  templateUrl: './clientes-busca.component.html',
  styleUrls: ['./clientes-busca.component.scss'],
  imports: [FormsModule, CommonModule, RouterModule],
  providers: [ClientesService]
})
export class ClientesBuscaComponent implements OnInit {
  clientes: any[] = [];
  searchQuery: string = '';
  searchBy: string = 'razaoSocial';
  page: number = 0;
  totalPages: number = 0;

  constructor(private clientesService: ClientesService, private router: Router) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clientesService.getClientesBusca(this.page).subscribe({
      next: (data) => {
        this.clientes = data.content;
        this.totalPages = data.totalPages;
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
      }
    });
  }

  searchClientes(): void {
    this.page = 0;

    if (!this.searchQuery) {
      this.loadClientes();
      return;
    }

    if (this.searchBy === 'id') {
      this.clientesService.getClienteByIdBusca(this.searchQuery).subscribe({
        next: (data) => {
          this.clientes = data ? [data] : [];
          this.totalPages = 1;
        },
        error: (err) => {
          console.error('Erro ao buscar cliente por ID:', err);
          this.clientes = [];
        }
      });
    } else if (this.searchBy === 'razaoSocial') {
      this.clientesService.getClientesByRazaoSocialBusca(this.searchQuery, this.page).subscribe({
        next: (data) => {
          this.clientes = data.content;
          this.totalPages = data.totalPages;
        },
        error: (err) => {
          console.error('Erro ao buscar clientes por Razão Social:', err);
          this.clientes = [];
        }
      });
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.searchClientes();
    }
  }

  viewCliente(id: string): void {
    this.router.navigate(['/clientes', id]);
  }

  navigateToHome(): void {
    this.router.navigate(['/gerencial-home']);
  }

  createNovoCliente(): void {
    this.router.navigate(['/clientes/novo']);
  }
}
