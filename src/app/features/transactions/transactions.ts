import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TransactionsService } from '../../core/services/transactions.service';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
    <div class="transactions-container">
      <h1 class="page-title">💰 Transações Financeiras</h1>
      <p class="page-subtitle">Controle de aluguéis, despesas, multas e pagamentos</p>

      <!-- Filtros -->
      <mat-card class="filters-card mb-3">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Status</mat-label>
          <mat-select [(value)]="statusFilter" (selectionChange)="loadTransactions()">
            <mat-option value="">Todos</mat-option>
            <mat-option value="Pending">Pendente</mat-option>
            <mat-option value="Paid">Pago</mat-option>
            <mat-option value="Overdue">Vencido</mat-option>
            <mat-option value="Cancelled">Cancelado</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-card>

      <!-- Loading -->
      <div *ngIf="loading" class="spinner-container">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <!-- Tabela -->
      <mat-card *ngIf="!loading">
        <table mat-table [dataSource]="transactions" class="full-width-table">
          
          <ng-container matColumnDef="propertyName">
            <th mat-header-cell *matHeaderCellDef>Propriedade</th>
            <td mat-cell *matCellDef="let t">{{ t.propertyName }}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let t">
              <mat-chip [color]="getTypeColor(t.type)" selected small>
                {{ getTypeLabel(t.type) }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Valor</th>
            <td mat-cell *matCellDef="let t" [class.amount-negative]="t.type === 'Expense'">
              {{ t.amount | currency:'BRL' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let t">
              <mat-chip [color]="getStatusChipColor(t.status)" selected small>
                {{ getStatusLabel(t.status) }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="dueDate">
            <th mat-header-cell *matHeaderCellDef>Vencimento</th>
            <td mat-cell *matCellDef="let t">{{ t.dueDate | date:'dd/MM/yyyy' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let t">
              <button *ngIf="t.status === 'Pending' || t.status === 'Overdue'"
                      mat-icon-button color="primary" (click)="payTransaction(t)" matTooltip="Registrar Pagamento">
                <mat-icon>payments</mat-icon>
              </button>
              <button *ngIf="t.status === 'Pending'"
                      mat-icon-button color="warn" (click)="cancelTransaction(t)" matTooltip="Cancelar">
                <mat-icon>cancel</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <tr *matNoDataRow>
            <td [attr.colspan]="displayedColumns.length">
              <div class="no-data">
                <mat-icon>attach_money</mat-icon>
                <p>Nenhuma transação encontrada</p>
              </div>
            </td>
          </tr>
        </table>

        <mat-paginator
          [length]="totalCount"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .transactions-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .filters-card {
      padding: 16px;
    }

    .filter-field {
      width: 200px;
    }

    .full-width-table {
      width: 100%;
    }

    th {
      background: #f5f5f5;
      font-weight: 600;
      font-size: 14px;
    }

    td {
      font-size: 14px;
    }

    .amount-negative {
      color: #d32f2f;
      font-weight: 500;
    }

    .no-data {
      text-align: center;
      padding: 48px;
      color: #999;

      mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; }
    }

    @media (max-width: 768px) {
      table { display: block; overflow-x: auto; }
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = true;
  totalCount = 0;
  pageSize = 10;
  currentPage = 1;
  statusFilter = '';

  displayedColumns = ['propertyName', 'type', 'amount', 'status', 'dueDate', 'actions'];

  constructor(
    private transactionsService: TransactionsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    const params: any = { page: this.currentPage, pageSize: this.pageSize };
    if (this.statusFilter) params.status = this.statusFilter;

    this.transactionsService.getAll(params).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.transactions = data;
          this.totalCount = data.length;
        } else {
          this.transactions = data.items || [];
          this.totalCount = data.totalCount || 0;
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadTransactions();
  }

  payTransaction(transaction: Transaction): void {
    if (confirm(`Registrar pagamento de ${transaction.amount | currency:'BRL'}?`)) {
      this.transactionsService.pay(transaction.id).subscribe({
        next: () => {
          this.snackBar.open('Pagamento registrado!', 'OK', { duration: 3000 });
          this.loadTransactions();
        },
        error: () => this.snackBar.open('Erro ao registrar pagamento', 'OK', { duration: 3000 })
      });
    }
  }

  cancelTransaction(transaction: Transaction): void {
    if (confirm(`Cancelar transação de ${transaction.amount | currency:'BRL'}?`)) {
      this.transactionsService.cancel(transaction.id).subscribe({
        next: () => {
          this.snackBar.open('Transação cancelada!', 'OK', { duration: 3000 });
          this.loadTransactions();
        },
        error: () => this.snackBar.open('Erro ao cancelar', 'OK', { duration: 3000 })
      });
    }
  }

  getTypeColor(type: string): 'primary' | 'accent' | 'warn' {
    switch (type) {
      case 'Rent': return 'primary';
      case 'Sale': return 'accent';
      case 'Penalty': return 'warn';
      case 'Interest': return 'warn';
      case 'Expense': return 'warn';
      default: return 'primary';
    }
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'Rent': 'Aluguel',
      'Penalty': 'Multa',
      'Interest': 'Juros',
      'Expense': 'Despesa',
      'Sale': 'Venda'
    };
    return labels[type] || type;
  }

  getStatusChipColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'Paid': return 'primary';
      case 'Pending': return 'accent';
      case 'Overdue': return 'warn';
      case 'Cancelled': return 'warn';
      default: return 'accent';
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'Pending': 'Pendente',
      'Paid': 'Pago',
      'Overdue': 'Vencido',
      'Cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }
}