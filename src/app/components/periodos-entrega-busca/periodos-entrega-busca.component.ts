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

  constructor(private periodosEntregaService: PeriodosEntregaService, private router: Router) {}

  ngOnInit(): void {
    this.loadPeriodos();
  }

  loadPeriodos(): void {
    this.periodosEntregaService.getPeriodosEntrega().subscribe({
      next: (data) => {
        this.periodos = data;
        this.filteredPeriodos = data;
      },
      error: (err) => {
        console.error('Erro ao carregar períodos de entrega:', err);
      }
    });
  }

  searchPeriodosEntrega(): void {
    const query = this.searchQuery.toLowerCase();
    if (this.searchBy === 'id') {
      this.filteredPeriodos = this.periodos.filter(periodo => periodo.id.toString().includes(query));
    } else if (this.searchBy === 'descricao') {
      this.filteredPeriodos = this.periodos.filter(periodo => periodo.descricao.toLowerCase().includes(query));
    }
  }

  // Navega para a rota periodos-entrega/{id} ao clicar em um item
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
