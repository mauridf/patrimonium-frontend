import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary, OverdueReport, ROIReport } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <h1 class="page-title">📊 Dashboard Financeiro</h1>
      <p class="page-subtitle">Visão geral do seu patrimônio</p>

      <!-- Loading -->
      <div *ngIf="loading" class="spinner-container">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <!-- Conteúdo -->
      <div *ngIf="!loading">
        
        <!-- Cards de Resumo -->
        <div class="summary-cards">
          <mat-card class="summary-card">
            <mat-card-content>
              <div class="card-header">
                <mat-icon class="card-icon properties-icon">home</mat-icon>
                <div>
                  <span class="card-label">Total de Propriedades</span>
                  <span class="card-value">{{ summary?.totalProperties || 0 }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card">
            <mat-card-content>
              <div class="card-header">
                <mat-icon class="card-icon contracts-icon">description</mat-icon>
                <div>
                  <span class="card-label">Contratos Ativos</span>
                  <span class="card-value">{{ summary?.activeContracts || 0 }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card">
            <mat-card-content>
              <div class="card-header">
                <mat-icon class="card-icon revenue-icon">trending_up</mat-icon>
                <div>
                  <span class="card-label">Receita Mensal</span>
                  <span class="card-value">{{ summary?.monthlyRentRevenue | currency:'BRL' }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card">
            <mat-card-content>
              <div class="card-header">
                <mat-icon class="card-icon expense-icon">trending_down</mat-icon>
                <div>
                  <span class="card-label">Despesas Mensais</span>
                  <span class="card-value">{{ summary?.monthlyExpenses | currency:'BRL' }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card overdue-highlight">
            <mat-card-content>
              <div class="card-header">
                <mat-icon class="card-icon overdue-icon">warning</mat-icon>
                <div>
                  <span class="card-label">Inadimplência Total</span>
                  <span class="card-value overdue-value">{{ summary?.overdueAmount | currency:'BRL' }}</span>
                  <span class="card-subtext">{{ summary?.overdueCount || 0 }} transações em atraso</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card">
            <mat-card-content>
              <div class="card-header">
                <mat-icon class="card-icon roi-icon">show_chart</mat-icon>
                <div>
                  <span class="card-label">ROI Médio</span>
                  <span class="card-value">{{ summary?.averageROI | number:'1.1-1' }}%</span>
                  <span class="card-subtext">Yield: {{ summary?.averageYield | number:'1.1-1' }}%</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Seção de Inadimplência -->
        <div class="section" *ngIf="overdueList.length > 0">
          <h2 class="section-title">
            <mat-icon class="section-icon">warning</mat-icon>
            Inadimplência
          </h2>
          <mat-card>
            <table mat-table [dataSource]="overdueList" class="mat-elevation-z0">
              
              <!-- Coluna: Propriedade -->
              <ng-container matColumnDef="property">
                <th mat-header-cell *matHeaderCellDef>Propriedade</th>
                <td mat-cell *matCellDef="let item">{{ item.propertyName }}</td>
              </ng-container>

              <!-- Coluna: Valor -->
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Valor</th>
                <td mat-cell *matCellDef="let item">{{ item.amount | currency:'BRL' }}</td>
              </ng-container>

              <!-- Coluna: Vencimento -->
              <ng-container matColumnDef="dueDate">
                <th mat-header-cell *matHeaderCellDef>Vencimento</th>
                <td mat-cell *matCellDef="let item">{{ item.dueDate | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <!-- Coluna: Dias em Atraso -->
              <ng-container matColumnDef="daysOverdue">
                <th mat-header-cell *matHeaderCellDef>Dias em Atraso</th>
                <td mat-cell *matCellDef="let item">
                  <mat-chip [color]="'warn'" highlighted>{{ item.daysOverdue }} dias</mat-chip>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="overdueColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: overdueColumns;"></tr>
            </table>
          </mat-card>
        </div>

        <!-- Seção de ROI -->
        <div class="section" *ngIf="roiList.length > 0">
          <h2 class="section-title">
            <mat-icon class="section-icon">show_chart</mat-icon>
            Rentabilidade (ROI)
          </h2>
          <mat-card>
            <table mat-table [dataSource]="roiList" class="mat-elevation-z0">
              
              <!-- Coluna: Propriedade -->
              <ng-container matColumnDef="property">
                <th mat-header-cell *matHeaderCellDef>Propriedade</th>
                <td mat-cell *matCellDef="let item">{{ item.propertyName }}</td>
              </ng-container>

              <!-- Coluna: Valor Estimado -->
              <ng-container matColumnDef="estimatedValue">
                <th mat-header-cell *matHeaderCellDef>Valor Estimado</th>
                <td mat-cell *matCellDef="let item">{{ item.estimatedValue | currency:'BRL' }}</td>
              </ng-container>

              <!-- Coluna: ROI -->
              <ng-container matColumnDef="roi">
                <th mat-header-cell *matHeaderCellDef>ROI</th>
                <td mat-cell *matCellDef="let item">
                  <mat-chip [color]="'primary'" highlighted>{{ item.roi | number:'1.1-1' }}%</mat-chip>
                </td>
              </ng-container>

              <!-- Coluna: Yield -->
              <ng-container matColumnDef="yield">
                <th mat-header-cell *matHeaderCellDef>Yield</th>
                <td mat-cell *matCellDef="let item">
                  <mat-chip [color]="'accent'" highlighted>{{ item.yield | number:'1.1-1' }}%</mat-chip>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="roiColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: roiColumns;"></tr>
            </table>
          </mat-card>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: #1a237e;
      margin-bottom: 4px;
    }

    .page-subtitle {
      color: #666;
      margin-bottom: 32px;
      font-size: 16px;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .summary-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .card-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      padding: 12px;
      border-radius: 12px;
      background: #f5f5f5;
    }

    .properties-icon { color: #1976d2; background: #e3f2fd; }
    .contracts-icon { color: #388e3c; background: #e8f5e9; }
    .revenue-icon { color: #f57c00; background: #fff3e0; }
    .expense-icon { color: #d32f2f; background: #ffebee; }
    .overdue-icon { color: #f44336; background: #ffebee; }
    .roi-icon { color: #7b1fa2; background: #f3e5f5; }

    .card-label {
      display: block;
      font-size: 13px;
      color: #999;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #333;
    }

    .card-subtext {
      display: block;
      font-size: 12px;
      color: #999;
      margin-top: 4px;
    }

    .overdue-highlight {
      border-left: 4px solid #f44336;
    }

    .overdue-value {
      color: #f44336 !important;
    }

    .section {
      margin-bottom: 40px;
    }

    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-icon {
      color: #f44336;
    }

    table {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
    }

    th {
      background: #f5f5f5;
      font-weight: 600;
      color: #555;
      font-size: 14px;
    }

    td {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .summary-cards {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 24px;
      }

      .card-value {
        font-size: 20px;
      }

      table {
        display: block;
        overflow-x: auto;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  overdueList: OverdueReport[] = [];
  roiList: ROIReport[] = [];
  loading = true;

  overdueColumns: string[] = ['property', 'amount', 'dueDate', 'daysOverdue'];
  roiColumns: string[] = ['property', 'estimatedValue', 'roi', 'yield'];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    // Carregar resumo
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (error) => {
        console.error('Erro ao carregar resumo:', error);
        this.summary = null;
      }
    });

    // Carregar inadimplência
    this.dashboardService.getOverdue().subscribe({
      next: (data) => {
        this.overdueList = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar inadimplência:', error);
        this.overdueList = [];
        this.loading = false;
      }
    });

    // Carregar ROI
    this.dashboardService.getROI().subscribe({
      next: (data) => {
        this.roiList = data;
      },
      error: (error) => {
        console.error('Erro ao carregar ROI:', error);
        this.roiList = [];
      }
    });
  }
}