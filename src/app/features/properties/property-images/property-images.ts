import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PropertiesService } from '../../../core/services/properties.service';
import { Property, PropertyImage } from '../../../core/models/property.model';
import { environment } from '@env/environment.production';

@Component({
  selector: 'app-property-images',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Imagens - {{ property.name }}</h2>
    
    <mat-dialog-content>
      <!-- Upload -->
      <div class="upload-area">
        <input type="file" #fileInput hidden accept="image/*" (change)="onFileSelected($event)">
        <button mat-raised-button color="primary" (click)="fileInput.click()" [disabled]="uploading">
          <mat-icon>cloud_upload</mat-icon>
          Selecionar Imagem
        </button>
        <span class="upload-hint">JPEG, PNG, WebP - Máx 10MB</span>
      </div>

      <mat-progress-bar *ngIf="uploading" mode="indeterminate"></mat-progress-bar>

      <!-- Galeria -->
      <div *ngIf="loading" class="spinner-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading" class="images-grid">
        <div *ngFor="let image of images" class="image-card">
          <img [src]="getImageUrl(image)" [alt]="image.fileName">
          <div class="image-info">
            <span class="image-name">{{ image.fileName }}</span>
            <span class="image-size">{{ (image.fileSize / 1024).toFixed(1) }} KB</span>
          </div>
          <button mat-icon-button color="warn" class="delete-btn" (click)="deleteImage(image)" matTooltip="Excluir">
            <mat-icon>delete</mat-icon>
          </button>
        </div>

        <div *ngIf="images.length === 0" class="no-images">
          <mat-icon>photo_library</mat-icon>
          <p>Nenhuma imagem cadastrada</p>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .upload-area {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .upload-hint {
      font-size: 12px;
      color: #999;
    }

    .images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    }

    .image-card {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e0e0e0;

      img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        display: block;
      }

      .image-info {
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .image-name {
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .image-size {
        font-size: 11px;
        color: #999;
      }

      .delete-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(255,255,255,0.9);
      }
    }

    .no-images {
      text-align: center;
      padding: 48px;
      color: #999;
      grid-column: 1 / -1;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }
    }
  `]
})
export class PropertyImagesComponent implements OnInit {
  property: Property;
  images: PropertyImage[] = [];
  loading = true;
  uploading = false;

  constructor(
    private propertiesService: PropertiesService,
    private dialogRef: MatDialogRef<PropertyImagesComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Property
  ) {
    this.property = data;
  }

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.loading = true;
    this.propertiesService.getImages(this.property.id).subscribe({
      next: (images) => {
        this.images = images;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (file.size > 10 * 1024 * 1024) {
        this.snackBar.open('Arquivo muito grande. Máximo 10MB.', 'OK', { duration: 3000 });
        return;
      }

      this.uploading = true;
      this.propertiesService.uploadImage(this.property.id, file).subscribe({
        next: () => {
          this.uploading = false;
          this.snackBar.open('Imagem enviada com sucesso!', 'OK', { duration: 3000 });
          this.loadImages();
          input.value = '';
        },
        error: () => {
          this.uploading = false;
          this.snackBar.open('Erro ao enviar imagem', 'OK', { duration: 3000 });
        }
      });
    }
  }

  deleteImage(image: PropertyImage): void {
    if (confirm('Deseja excluir esta imagem?')) {
      this.propertiesService.deleteImage(this.property.id, image.id).subscribe({
        next: () => {
          this.snackBar.open('Imagem excluída!', 'OK', { duration: 3000 });
          this.loadImages();
        },
        error: () => {
          this.snackBar.open('Erro ao excluir imagem', 'OK', { duration: 3000 });
        }
      });
    }
  }

  getImageUrl(image: PropertyImage): string {
    if (image.url) {
      return image.url.startsWith('http') ? image.url : `${environment.apiUrl}${image.url}`;
    }
    return '';
  }

  close(): void {
    this.dialogRef.close(false);
  }
}