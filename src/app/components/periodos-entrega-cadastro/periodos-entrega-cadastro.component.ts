import { Component, OnInit } from '@angular/core';
import { PeriodosEntregaService } from '../../services/periodos-entrega.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-periodo-entrega-cadastro',
  standalone: true,
  templateUrl: './periodos-entrega-cadastro.component.html',
  styleUrls: ['./periodos-entrega-cadastro.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class PeriodoEntregaCadastroComponent implements OnInit {
  isNew = true;
  periodoEntrega: any = {
    id: null,
    descricao: '',
    horarioInicio: '',
    horarioFim: ''
  };

  message: string | null = null;
  isSuccess: boolean = true;

  constructor(
    private periodosEntregaService: PeriodosEntregaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'novo') {
      this.isNew = false;
      this.periodosEntregaService.getPeriodoEntregaById(+id).subscribe({
        next: (data) => {
          this.periodoEntrega = data;
        },
        error: (err) => {
          console.error('Erro ao carregar período de entrega:', err);
          this.exibirMensagem('Erro ao carregar período de entrega.', false);
        }
      });
    } else {
      this.isNew = true;
    }
  }

  onSave(): void {
    if (!this.periodoEntrega.descricao || !this.periodoEntrega.horarioInicio || !this.periodoEntrega.horarioFim) {
      this.exibirMensagem('Todos os campos são obrigatórios.', false);
      return;
    }

    if (this.isNew) {
      this.periodosEntregaService.createPeriodoEntrega(this.periodoEntrega).subscribe({
        next: (response) => {
          this.periodoEntrega = response;
          this.isNew = false;
          this.exibirMensagem('Período de entrega cadastrado com sucesso!', true);
        },
        error: (err) => {
          this.exibirMensagem('Erro ao cadastrar período de entrega. Tente novamente.', false);
          console.error('Erro ao cadastrar período de entrega:', err);
        }
      });
    } else {
      this.periodosEntregaService.updatePeriodoEntrega(this.periodoEntrega.id, this.periodoEntrega).subscribe({
        next: () => {
          this.exibirMensagem('Período de entrega atualizado com sucesso!', true);
        },
        error: (err) => {
          this.exibirMensagem('Erro ao atualizar período de entrega. Tente novamente.', false);
          console.error('Erro ao atualizar período de entrega:', err);
        }
      });
    }
  }

  onDelete(): void {
    if (this.periodoEntrega.id) {
      const confirmacao = confirm('Tem certeza que deseja deletar este período de entrega?');
      if (confirmacao) {
        this.periodosEntregaService.deletePeriodoEntrega(this.periodoEntrega.id).subscribe({
          next: () => {
            this.exibirMensagem('Período de entrega deletado com sucesso!', true);
            this.router.navigate(['/periodos-entrega-busca']);
          },
          error: (err) => {
            this.exibirMensagem('Erro ao deletar período de entrega. Tente novamente.', false);
            console.error('Erro ao deletar período de entrega:', err);
          }
        });
      }
    }
  }

  onNew(): void {
    this.isNew = true;
    this.periodoEntrega = {
      id: null,
      descricao: '',
      horarioInicio: '',
      horarioFim: ''
    };
  }

  onConsultar(): void {
    this.router.navigate(['/periodos-entrega-busca']);
  }

  exibirMensagem(msg: string, sucesso: boolean): void {
    this.message = msg;
    this.isSuccess = sucesso;
    setTimeout(() => {
      this.message = null;
    }, 3000);
  }
}
