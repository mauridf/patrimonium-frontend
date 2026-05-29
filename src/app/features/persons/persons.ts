import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PersonsService } from '../../core/services/persons.service';
import { Person } from '../../core/models/person.model';
import { PersonFormComponent } from './person-form/person-form';
import { DocumentMaskPipe } from "../../shared/pipes/document-mask.pipe";

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    DocumentMaskPipe
],
  template: `
    <div class="persons-container">
      <!-- Header -->
      <div class="flex-between mb-3">
        <div>
          <h1 class="page-title">👥 Pessoas</h1>
          <p class="page-subtitle">Gerencie proprietários, locatários, compradores e mais</p>
        </div>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nova Pessoa
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="spinner-container">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <!-- Tabela -->
      <mat-card *ngIf="!loading">
        <table mat-table [dataSource]="persons" class="mat-elevation-z0 full-width-table">
          
          <!-- Nome -->
          <ng-container matColumnDef="fullName">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let person">
              <strong>{{ person.fullName }}</strong>
            </td>
          </ng-container>

          <!-- Documento -->
          <ng-container matColumnDef="document">
            <th mat-header-cell *matHeaderCellDef>CPF/CNPJ</th>
            <td mat-cell *matCellDef="let person">
              {{ person.document | documentMask }}
            </td>
          </ng-container>

          <!-- Tipo -->
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let person">
              <mat-chip [color]="getTypeColor(person.type)" selected>
                {{ getTypeLabel(person.type) }}
              </mat-chip>
            </td>
          </ng-container>

          <!-- Email -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let person">{{ person.email || '-' }}</td>
          </ng-container>

          <!-- Telefone -->
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Telefone</th>
            <td mat-cell *matCellDef="let person">{{ person.phone || '-' }}</td>
          </ng-container>

          <!-- Ações -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let person">
              <button mat-icon-button color="primary" (click)="openEditDialog(person)" matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deletePerson(person)" matTooltip="Excluir">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          
          <!-- Linha de "sem dados" -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayedColumns.length">
              <div class="no-data">
                <mat-icon>people_outline</mat-icon>
                <p>Nenhuma pessoa cadastrada</p>
              </div>
            </td>
          </tr>
        </table>

        <!-- Paginação -->
        <mat-paginator
          [length]="totalCount"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 25, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .persons-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .full-width-table {
      width: 100%;
    }

    th {
      background: #f5f5f5;
      font-weight: 600;
      color: #555;
      font-size: 14px;
      white-space: nowrap;
    }

    td {
      font-size: 14px;
    }

    .no-data {
      text-align: center;
      padding: 48px 24px;
      color: #999;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }

      p {
        font-size: 16px;
        margin: 0;
      }
    }

    @media (max-width: 768px) {
      .persons-container {
        padding: 0;
      }

      table {
        display: block;
        overflow-x: auto;
      }
    }
  `]
})
export class PersonsComponent implements OnInit {
  persons: Person[] = [];
  loading = true;
  totalCount = 0;
  pageSize = 10;
  currentPage = 1;

  displayedColumns: string[] = ['fullName', 'document', 'type', 'email', 'phone', 'actions'];

  constructor(
    private personsService: PersonsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.loading = true;
    this.personsService.getAll({ page: this.currentPage, pageSize: this.pageSize }).subscribe({
      next: (data) => {
        // Se a API retorna array direto (sem paginação)
        if (Array.isArray(data)) {
          this.persons = data;
          this.totalCount = data.length;
        } else {
          // Se retorna objeto paginado
          const paginated = data as any;
          this.persons = paginated.items || paginated;
          this.totalCount = paginated.totalCount || this.persons.length;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar pessoas:', error);
        this.loading = false;
        this.snackBar.open('Erro ao carregar pessoas', 'OK', { duration: 3000 });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPersons();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PersonFormComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPersons();
      }
    });
  }

  openEditDialog(person: Person): void {
    const dialogRef = this.dialog.open(PersonFormComponent, {
      width: '600px',
      data: person
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPersons();
      }
    });
  }

  deletePerson(person: Person): void {
    if (confirm(`Deseja realmente excluir ${person.fullName}?`)) {
      this.personsService.delete(person.id).subscribe({
        next: () => {
          this.snackBar.open('Pessoa excluída com sucesso!', 'OK', { duration: 3000 });
          this.loadPersons();
        },
        error: () => {
          this.snackBar.open('Erro ao excluir pessoa', 'OK', { duration: 3000 });
        }
      });
    }
  }

  getTypeColor(type: string): 'primary' | 'accent' | 'warn' {
    switch (type) {
      case 'Owner': return 'primary';
      case 'Tenant': return 'accent';
      case 'Buyer': return 'warn';
      default: return 'primary';
    }
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'Owner': 'Proprietário',
      'Broker': 'Corretor',
      'Tenant': 'Locatário',
      'Guarantor': 'Fiador',
      'Buyer': 'Comprador',
      'Other': 'Outro'
    };
    return labels[type] || type;
  }
}