import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PeriodosEntregaService } from '../../services/periodos-entrega.service';

@Component({
  selector: 'app-periodos-entrega-busca',
  standalone: true,
  templateUrl: './periodos-entrega-busca.component.html',
  styleUrls: ['./periodos-entrega-busca.component.scss'],
  imports: [FormsModule, CommonModule, RouterModule],
  providers: [PeriodosEntregaService]
})
export class PeriodosEntregaBuscaComponent implements OnInit {
  periodos: any[] = [];
  filteredPeriodos: any[] = [];
  searchQuery: string = '';
  searchBy: string = 'descricao';
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  lastSearchQuery: string = '';
  lastSearchBy: string = '';

  constructor(private periodosEntregaService: PeriodosEntregaService, private router: Router) {}

  ngOnInit(): void {
    this.loadPeriodos();
  }

  loadPeriodos(): void {
    this.periodosEntregaService.getPeriodosEntregaBusca(this.page).subscribe({
      next: (data) => {
        this.periodos = data.content;
        this.filteredPeriodos = this.periodos;
        this.totalPages = data.totalPages;
      },
      error: (err) => console.error('Erro ao carregar períodos:', err)
    });
  }

  searchPeriodosEntrega(): void {
    this.page = 0;
    this.lastSearchQuery = this.searchQuery;
    this.lastSearchBy = this.searchBy;

    if (this.searchQuery === '') {
      this.loadPeriodos();
      return;
    }

    if (this.searchBy === 'id') {
      const id = Number(this.searchQuery);
      if (!isNaN(id)) {
        this.periodosEntregaService.getPeriodoEntregaById(id).subscribe({
          next: (data) => this.filteredPeriodos = [data],
          error: (err) => { console.error('Erro ao buscar por ID:', err); this.filteredPeriodos = []; }
        });
      } else {
        this.filteredPeriodos = [];
      }
    } else {
      this.periodosEntregaService.buscarPeriodosEntregaPorDescricao(this.searchQuery, this.page).subscribe({
        next: (data) => {
          this.filteredPeriodos = data.content;
          this.totalPages = data.totalPages;
        },
        error: (err) => { console.error('Erro ao buscar por descricao:', err); this.filteredPeriodos = []; }
      });
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;

      if (this.lastSearchQuery) {
        this.searchQuery = this.lastSearchQuery;
        this.searchBy = this.lastSearchBy;
        this.searchPeriodosEntrega();
      } else {
        this.loadPeriodos();
      }
    }
  }

  viewPeriodo(id: number): void {
    this.router.navigate([`/periodos-entrega`, id]);
  }

  navigateToHome(): void {
    this.router.navigate(['/gerencial-home']);
  }

  createNovoPeriodo(): void {
    this.router.navigate(['/periodos-entrega/novo']);
  }
}
