import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContractsService } from '../../core/services/contracts.service';
import { RentContract, SaleContract } from '../../core/models/contract.model';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="contracts-container">
      <h1 class="page-title">📄 Contratos</h1>
      <p class="page-subtitle">Gerencie contratos de locação e venda</p>

      <mat-tab-group>
        <!-- Aba: Aluguel -->
        <mat-tab label="🏠 Locação">
          <div class="tab-content">
            <div *ngIf="loadingRent" class="spinner-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>

            <div *ngIf="!loadingRent && rentContracts.length === 0" class="no-data">
              <mat-icon>description</mat-icon>
              <p>Nenhum contrato de locação</p>
            </div>

            <div *ngIf="!loadingRent && rentContracts.length > 0" class="contracts-list">
              <mat-card *ngFor="let contract of rentContracts" class="contract-card">
                <mat-card-content>
                  <div class="contract-header">
                    <h3>{{ contract.propertyName }}</h3>
                    <mat-chip [color]="getStatusColor(contract.status)" selected>
                      {{ getStatusLabel(contract.status) }}
                    </mat-chip>
                  </div>
                  
                  <div class="contract-details">
                    <p><strong>Locatário:</strong> {{ contract.tenantName }}</p>
                    <p><strong>Aluguel:</strong> {{ contract.rentAmount | currency:'BRL' }}</p>
                    <p><strong>Vencimento:</strong> Dia {{ contract.dueDay }}</p>
                    <p><strong>Início:</strong> {{ contract.startDate | date:'dd/MM/yyyy' }}</p>
                    <p *ngIf="contract.endDate"><strong>Fim:</strong> {{ contract.endDate | date:'dd/MM/yyyy' }}</p>
                  </div>
                </mat-card-content>
                
                <mat-card-actions *ngIf="contract.status === 'Active'">
                  <button mat-button color="warn" (click)="terminateRent(contract)">
                    <mat-icon>cancel</mat-icon> Encerrar
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Aba: Venda -->
        <mat-tab label="💰 Venda">
          <div class="tab-content">
            <div *ngIf="loadingSale" class="spinner-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>

            <div *ngIf="!loadingSale && saleContracts.length === 0" class="no-data">
              <mat-icon>description</mat-icon>
              <p>Nenhum contrato de venda</p>
            </div>

            <div *ngIf="!loadingSale && saleContracts.length > 0" class="contracts-list">
              <mat-card *ngFor="let contract of saleContracts" class="contract-card">
                <mat-card-content>
                  <div class="contract-header">
                    <h3>{{ contract.propertyName }}</h3>
                    <mat-chip [color]="getStatusColor(contract.status)" selected>
                      {{ getStatusLabel(contract.status) }}
                    </mat-chip>
                  </div>
                  
                  <div class="contract-details">
                    <p><strong>Comprador:</strong> {{ contract.buyerName }}</p>
                    <p><strong>Valor:</strong> {{ contract.saleAmount | currency:'BRL' }}</p>
                    <p *ngIf="contract.installments"><strong>Parcelas:</strong> {{ contract.installments }}x</p>
                    <p><strong>Início:</strong> {{ contract.startDate | date:'dd/MM/yyyy' }}</p>
                  </div>
                </mat-card-content>
                
                <mat-card-actions *ngIf="contract.status === 'Active'">
                  <button mat-button color="primary" (click)="completeSale(contract)">
                    <mat-icon>check_circle</mat-icon> Concluir
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .contracts-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .tab-content {
      padding: 20px 0;
    }

    .contracts-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 16px;
    }

    .contract-card {
      transition: transform 0.2s;
      &:hover { transform: translateY(-2px); }
    }

    .contract-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
    }

    .contract-details {
      p {
        margin: 6px 0;
        font-size: 14px;
        color: #555;
      }
    }

    .no-data {
      text-align: center;
      padding: 48px;
      color: #999;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }
    }

    @media (max-width: 768px) {
      .contracts-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContractsComponent implements OnInit {
  rentContracts: RentContract[] = [];
  saleContracts: SaleContract[] = [];
  loadingRent = true;
  loadingSale = true;

  constructor(
    private contractsService: ContractsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRentContracts();
    this.loadSaleContracts();
  }

  loadRentContracts(): void {
    this.loadingRent = true;
    this.contractsService.getRentContracts().subscribe({
      next: (data) => {
        this.rentContracts = Array.isArray(data) ? data : (data.items || []);
        this.loadingRent = false;
      },
      error: () => this.loadingRent = false
    });
  }

  loadSaleContracts(): void {
    this.loadingSale = true;
    this.contractsService.getSaleContracts().subscribe({
      next: (data) => {
        this.saleContracts = Array.isArray(data) ? data : (data.items || []);
        this.loadingSale = false;
      },
      error: () => this.loadingSale = false
    });
  }

  terminateRent(contract: RentContract): void {
    if (confirm(`Encerrar contrato de ${contract.propertyName}?`)) {
      this.contractsService.terminateRentContract(contract.id).subscribe({
        next: () => {
          this.snackBar.open('Contrato encerrado!', 'OK', { duration: 3000 });
          this.loadRentContracts();
        },
        error: () => this.snackBar.open('Erro ao encerrar', 'OK', { duration: 3000 })
      });
    }
  }

  completeSale(contract: SaleContract): void {
    if (confirm(`Concluir venda de ${contract.propertyName}?`)) {
      this.contractsService.completeSaleContract(contract.id).subscribe({
        next: () => {
          this.snackBar.open('Venda concluída!', 'OK', { duration: 3000 });
          this.loadSaleContracts();
        },
        error: () => this.snackBar.open('Erro ao concluir', 'OK', { duration: 3000 })
      });
    }
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'Active': return 'primary';
      case 'Completed': return 'accent';
      case 'Cancelled': return 'warn';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'Active': 'Ativo',
      'Paused': 'Pausado',
      'Completed': 'Concluído',
      'Cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }
}