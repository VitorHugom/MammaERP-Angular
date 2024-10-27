import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProdutosService } from '../../services/produtos.service';

@Component({
  selector: 'app-produtos-busca',
  standalone: true,
  templateUrl: './produtos-busca.component.html',
  styleUrls: ['./produtos-busca.component.scss'],
  imports: [FormsModule, CommonModule, RouterModule],
  providers: [ProdutosService]
})
export class ProdutosBuscaComponent implements OnInit {
  produtos: any[] = [];
  searchQuery: string = '';
  searchBy: string = 'descricao';
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  lastSearchQuery: string = '';
  lastSearchBy: string = '';

  constructor(private produtosService: ProdutosService, private router: Router) {}

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.produtosService.getProdutosBusca(this.page).subscribe({
      next: (data) => {
        this.produtos = data.content;
        this.totalPages = data.totalPages;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }

  searchProdutos(): void {
    this.page = 0;
    this.lastSearchQuery = this.searchQuery;
    this.lastSearchBy = this.searchBy;

    if (!this.searchQuery) {
      this.loadProdutos();
      return;
    }

    if (this.searchBy === 'id') {
      this.produtosService.getProdutoById(this.searchQuery).subscribe({
        next: (data) => {
          this.produtos = data ? [data] : [];
          this.totalPages = 1;
        },
        error: (err) => {
          console.error('Erro ao buscar produto por ID:', err);
          this.produtos = [];
        }
      });
    } else if (this.searchBy === 'descricao') {
      this.produtosService.buscarProdutosPorNome(this.searchQuery, this.page).subscribe({
        next: (data) => {
          this.produtos = data.content;
          this.totalPages = data.totalPages;
        },
        error: (err) => {
          console.error('Erro ao buscar produtos por descrição:', err);
          this.produtos = [];
        }
      });
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;

      if (this.lastSearchQuery) {
        this.searchProdutos();
      } else {
        this.loadProdutos();
      }
    }
  }

  viewProduto(id: string): void {
    this.router.navigate(['/produtos', id]);
  }

  navigateToHome(): void {
    this.router.navigate(['/gerencial-home']);
  }

  createNovoProduto(): void {
    this.router.navigate(['/produtos/novo']);
  }
}
