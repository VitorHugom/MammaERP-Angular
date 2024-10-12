import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { MatDialog } from '@angular/material/dialog';
import { PedidosModalComponent } from '../pedidos-modal/pedidos-modal.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agenda-pedidos',
  templateUrl: './agenda-pedidos.component.html',
  styleUrls: ['./agenda-pedidos.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AgendaPedidosComponent implements OnInit {
  pedidosOrganizados: any = {};
  selectedDate: string | null = null;
  currentYear: number;
  currentMonth: number;
  periods: string[] = ['Manhã', 'Tarde', 'Noite'];

  constructor(private pedidosService: PedidosService, private dialog: MatDialog, private router: Router) {
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth() + 1;
  }

  ngOnInit(): void {
    this.loadPedidos(this.currentYear, this.currentMonth);
  }

  loadPedidos(ano: number, mes: number): void {
    this.pedidosService.getPedidosPorMes(ano, mes).subscribe({
      next: (data) => {
        this.pedidosOrganizados = data;
      },
      error: (err) => {
        console.error('Erro ao carregar pedidos:', err);
      }
    });
  }

  nextMonth(): void {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadPedidos(this.currentYear, this.currentMonth);
  }

  previousMonth(): void {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadPedidos(this.currentYear, this.currentMonth);
  }

  openModal(date: string): void {
    this.selectedDate = date;
    const pedidos = this.pedidosOrganizados[date];

    this.dialog.open(PedidosModalComponent, {
      width: '600px',
      data: { pedidos, date }
    });
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }
  
  getColorForDay(day: string): string {
    const pedidosCount = this.pedidosOrganizados[day] ? Object.values(this.pedidosOrganizados[day]).flat().length : 0;
    const intensity = Math.min(pedidosCount * 20, 255);
    return `rgb(255, ${255 - intensity}, ${255 - intensity})`;
  }

  getMonthName(month: number): string {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[month - 1];
  }

  // Função para formatar a data para o formato dd/mm/aaaa
  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  goToHome(): void {
    this.router.navigate(['/cozinha-home']);
  }
}
