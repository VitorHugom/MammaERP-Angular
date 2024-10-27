import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PeriodosEntregaService } from '../../services/periodos-entrega.service'; // Serviço de períodos de entrega
import { Router } from '@angular/router';

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

  searchPeriodosEntrega(keepPage: boolean = false): void {
    if (!keepPage) this.page = 0; // Redefine a página apenas quando keepPage for falso
  
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

  viewPeriodo(id: number): void {
    this.router.navigate([`/periodos-entrega`, id]);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.searchPeriodosEntrega(true); // Evita redefinir para 0
    }
  }  

  navigateToHome(): void {
    this.router.navigate(['/gerencial-home']);
  }

  createNovoPeriodo(): void {
    this.router.navigate(['/periodos-entrega/novo']);
  }
}
