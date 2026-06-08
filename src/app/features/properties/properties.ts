import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { PropertiesService } from '../../core/services/properties.service';
import { Property } from '../../core/models/property.model';
import { PropertyFormComponent } from './property-form/property-form';
import { PropertyImagesComponent } from './property-images/property-images';

@Component({
  selector: 'app-properties',
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
    MatTooltipModule
  ],
  template: `
    <div class="properties-container">
      <!-- Header -->
      <div class="flex-between mb-3">
        <div>
          <h1 class="page-title">🏠 Propriedades</h1>
          <p class="page-subtitle">Gerencie seus imóveis</p>
        </div>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nova Propriedade
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="spinner-container">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <!-- Cards de Propriedades -->
      <div *ngIf="!loading" class="properties-grid">
        <mat-card *ngFor="let property of properties" class="property-card">
          <!-- Imagem principal -->
          <div class="property-image-container">
            <img 
              *ngIf="property.mainImage" 
              [src]="getImageUrl(property.mainImage)" 
              [alt]="property.name"
              class="property-image">
            <div *ngIf="!property.mainImage" class="property-image-placeholder">
              <mat-icon>home</mat-icon>
            </div>
            <div class="property-status">
              <mat-chip *ngIf="property.availableForRent" color="primary" selected small>Aluguel</mat-chip>
              <mat-chip *ngIf="property.availableForSale" color="accent" selected small>Venda</mat-chip>
            </div>
          </div>

          <mat-card-content class="property-content">
            <h3 class="property-name">{{ property.name }}</h3>
            
            <div class="property-info">
              <span class="property-type">
                <mat-icon>category</mat-icon>
                {{ getCategoryLabel(property.category) }}
              </span>
              <span class="property-location" *ngIf="property.city">
                <mat-icon>location_on</mat-icon>
                {{ property.city }}/{{ property.state }}
              </span>
            </div>

            <div class="property-values">
              <div class="value-item" *ngIf="property.rentValue">
                <span class="value-label">Aluguel</span>
                <span class="value-amount rent">{{ property.rentValue | currency:'BRL' }}</span>
              </div>
              <div class="value-item" *ngIf="property.salesValue">
                <span class="value-label">Venda</span>
                <span class="value-amount sale">{{ property.salesValue | currency:'BRL' }}</span>
              </div>
              <div class="value-item" *ngIf="property.roi">
                <span class="value-label">ROI</span>
                <span class="value-amount roi">{{ property.roi | number:'1.1-1' }}%</span>
              </div>
            </div>

            <div class="property-features">
              <span *ngIf="property.bedrooms">
                <mat-icon>bed</mat-icon> {{ property.bedrooms }}
              </span>
              <span *ngIf="property.bathrooms">
                <mat-icon>bathtub</mat-icon> {{ property.bathrooms }}
              </span>
              <span *ngIf="property.parkingSpots">
                <mat-icon>directions_car</mat-icon> {{ property.parkingSpots }}
              </span>
              <span *ngIf="property.totalArea">
                <mat-icon>square_foot</mat-icon> {{ property.totalArea }}m²
              </span>
            </div>
          </mat-card-content>

          <mat-card-actions class="property-actions">
            <button mat-icon-button color="primary" (click)="openEditDialog(property)" matTooltip="Editar">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="accent" (click)="openImagesDialog(property)" matTooltip="Imagens">
              <mat-icon>photo_library</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteProperty(property)" matTooltip="Excluir">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Sem dados -->
      <div *ngIf="!loading && properties.length === 0" class="no-data">
        <mat-icon>home_work</mat-icon>
        <p>Nenhuma propriedade cadastrada</p>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          Cadastrar Primeira Propriedade
        </button>
      </div>

      <!-- Paginação -->
      <mat-paginator
        *ngIf="totalCount > pageSize"
        [length]="totalCount"
        [pageSize]="pageSize"
        [pageSizeOptions]="[6, 12, 24, 48]"
        (page)="onPageChange($event)"
        showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styles: [`
    .properties-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .properties-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 20px;
    }

    .property-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
      }
    }

    .property-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .property-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .property-image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #e0e0e0, #f5f5f5);

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #ccc;
      }
    }

    .property-status {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      gap: 4px;
    }

    .property-content {
      padding: 16px;
    }

    .property-name {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #333;
    }

    .property-info {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 13px;
      color: #777;

      span {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    .property-values {
      display: flex;
      gap: 16px;
      padding: 12px 0;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      margin-bottom: 12px;
    }

    .value-item {
      text-align: center;
      flex: 1;
    }

    .value-label {
      display: block;
      font-size: 11px;
      color: #999;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .value-amount {
      font-weight: 700;
      font-size: 16px;

      &.rent { color: #1976d2; }
      &.sale { color: #388e3c; }
      &.roi { color: #f57c00; }
    }

    .property-features {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      font-size: 13px;
      color: #666;

      span {
        display: flex;
        align-items: center;
        gap: 2px;
        background: #f5f5f5;
        padding: 4px 8px;
        border-radius: 6px;
      }

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    .property-actions {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
      padding: 8px 16px;
      border-top: 1px solid #eee;
    }

    .no-data {
      text-align: center;
      padding: 64px 24px;
      color: #999;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 24px;
      }
    }

    @media (max-width: 768px) {
      .properties-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PropertiesComponent implements OnInit {
  properties: any[] = [];
  loading = true;
  totalCount = 0;
  pageSize = 6;
  currentPage = 1;

  constructor(
    private propertiesService: PropertiesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.propertiesService.getAll({ page: this.currentPage, pageSize: this.pageSize }).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.properties = data;
          this.totalCount = data.length;
        } else {
          this.properties = data.items || [];
          this.totalCount = data.totalCount || 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar propriedades:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProperties();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PropertyFormComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadProperties();
    });
  }

  openEditDialog(property: Property): void {
    const dialogRef = this.dialog.open(PropertyFormComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: property
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadProperties();
    });
  }

  openImagesDialog(property: Property): void {
    const dialogRef = this.dialog.open(PropertyImagesComponent, {
      width: '700px',
      data: property
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadProperties();
    });
  }

  deleteProperty(property: Property): void {
    if (confirm(`Deseja realmente excluir "${property.name}"?`)) {
      this.propertiesService.delete(property.id).subscribe({
        next: () => {
          this.snackBar.open('Propriedade excluída!', 'OK', { duration: 3000 });
          this.loadProperties();
        },
        error: () => {
          this.snackBar.open('Erro ao excluir', 'OK', { duration: 3000 });
        }
      });
    }
  }

  getImageUrl(image: any): string {
    if (image?.url) {
      return image.url.startsWith('http') 
        ? image.url 
        : `${environment.apiUrl}${image.url}`;
    }
    return '';
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'House': 'Casa',
      'Apartment': 'Apartamento',
      'CommercialRoom': 'Sala Comercial',
      'Land': 'Terreno',
      'Warehouse': 'Galpão',
      'Store': 'Loja',
      'Farm': 'Chácara/Fazenda',
      'Other': 'Outro'
    };
    return labels[category] || category;
  }
}