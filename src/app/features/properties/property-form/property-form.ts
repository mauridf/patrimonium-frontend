import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PropertiesService } from '../../../core/services/properties.service';
import { Property, CreatePropertyRequest } from '../../../core/models/property.model';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditing ? 'Editar Propriedade' : 'Nova Propriedade' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="propertyForm">
        <mat-tab-group>
          
          <!-- Aba: Informações Básicas -->
          <mat-tab label="Básico">
            <div class="tab-content">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nome da Propriedade</mat-label>
                <input matInput formControlName="name" placeholder="Ex: Apto 101 - Centro">
                <mat-error *ngIf="propertyForm.get('name')?.hasError('required')">Nome é obrigatório</mat-error>
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Tipo</mat-label>
                  <mat-select formControlName="type">
                    <mat-option value="Residential">Residencial</mat-option>
                    <mat-option value="Commercial">Comercial</mat-option>
                    <mat-option value="Vacation">Temporada</mat-option>
                    <mat-option value="Industrial">Industrial</mat-option>
                    <mat-option value="Rural">Rural</mat-option>
                    <mat-option value="Other">Outro</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Finalidade</mat-label>
                  <mat-select formControlName="purpose">
                    <mat-option value="Rent">Locação</mat-option>
                    <mat-option value="Sale">Venda</mat-option>
                    <mat-option value="Both">Ambos</mat-option>
                    <mat-option value="Other">Outro</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Categoria</mat-label>
                <mat-select formControlName="category">
                  <mat-option value="House">Casa</mat-option>
                  <mat-option value="Apartment">Apartamento</mat-option>
                  <mat-option value="CommercialRoom">Sala Comercial</mat-option>
                  <mat-option value="Land">Terreno</mat-option>
                  <mat-option value="Warehouse">Galpão</mat-option>
                  <mat-option value="Store">Loja</mat-option>
                  <mat-option value="Farm">Chácara/Fazenda</mat-option>
                  <mat-option value="Other">Outro</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descrição</mat-label>
                <textarea matInput formControlName="description" rows="3" placeholder="Descreva a propriedade..."></textarea>
              </mat-form-field>
            </div>
          </mat-tab>

          <!-- Aba: Localização -->
          <mat-tab label="Localização">
            <div class="tab-content">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Endereço</mat-label>
                <input matInput formControlName="address" placeholder="Rua/Avenida">
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Número</mat-label>
                  <input matInput formControlName="number" placeholder="123">
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Complemento</mat-label>
                  <input matInput formControlName="complement" placeholder="Apto 101">
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Cidade</mat-label>
                  <input matInput formControlName="city" placeholder="São Paulo">
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Estado (UF)</mat-label>
                  <input matInput formControlName="state" placeholder="SP" maxlength="2">
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>CEP</mat-label>
                <input matInput formControlName="zipCode" placeholder="12345678" maxlength="8">
              </mat-form-field>
            </div>
          </mat-tab>

          <!-- Aba: Características -->
          <mat-tab label="Características">
            <div class="tab-content">
              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Quartos</mat-label>
                  <input matInput type="number" formControlName="bedrooms" min="0">
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Banheiros</mat-label>
                  <input matInput type="number" formControlName="bathrooms" min="0">
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Suítes</mat-label>
                  <input matInput type="number" formControlName="suites" min="0">
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Vagas de Garagem</mat-label>
                  <input matInput type="number" formControlName="parkingSpots" min="0">
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Área Total (m²)</mat-label>
                  <input matInput type="number" formControlName="totalArea" min="0">
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Área Construída (m²)</mat-label>
                  <input matInput type="number" formControlName="builtArea" min="0">
                </mat-form-field>
              </div>

              <mat-checkbox formControlName="furnished" color="primary">Mobiliado</mat-checkbox>
            </div>
          </mat-tab>

          <!-- Aba: Valores -->
          <mat-tab label="Valores">
            <div class="tab-content">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Valor Estimado</mat-label>
                <input matInput type="number" formControlName="estimatedValue" min="0">
                <mat-error *ngIf="propertyForm.get('estimatedValue')?.hasError('required')">Valor estimado é obrigatório</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Valor Inicial</mat-label>
                <input matInput type="number" formControlName="initialValue" min="0">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Valor de Aluguel</mat-label>
                <input matInput type="number" formControlName="rentValue" min="0">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Valor de Venda</mat-label>
                <input matInput type="number" formControlName="salesValue" min="0">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Condomínio (mensal)</mat-label>
                <input matInput type="number" formControlName="condoFee" min="0">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>IPTU (anual)</mat-label>
                <input matInput type="number" formControlName="iptu" min="0">
              </mat-form-field>

              <div class="form-row">
                <mat-checkbox formControlName="availableForRent" color="primary">Disponível para Locação</mat-checkbox>
                <mat-checkbox formControlName="availableForSale" color="accent">Disponível para Venda</mat-checkbox>
              </div>
            </div>
          </mat-tab>

        </mat-tab-group>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="propertyForm.invalid || loading">
        {{ loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar') }}
      </button>
    </mat-dialog-actions>

    <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
  `,
  styles: [`
    .tab-content {
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .half-width {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    mat-dialog-content {
      min-width: 500px;
      max-height: 60vh;
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: auto;
      }
      
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class PropertyFormComponent {
  propertyForm: FormGroup;
  loading = false;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private propertiesService: PropertiesService,
    private dialogRef: MatDialogRef<PropertyFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Property | null
  ) {
    this.isEditing = !!data;

    this.propertyForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      type: [data?.type || 'Residential', Validators.required],
      purpose: [data?.purpose || 'Rent', Validators.required],
      category: [data?.category || 'Apartment', Validators.required],
      description: [data?.description || ''],
      address: [data?.address || ''],
      number: [data?.number || ''],
      complement: [data?.complement || ''],
      city: [data?.city || ''],
      state: [data?.state || ''],
      zipCode: [data?.zipCode || ''],
      bedrooms: [data?.bedrooms || 0],
      bathrooms: [data?.bathrooms || 0],
      suites: [data?.suites || 0],
      parkingSpots: [data?.parkingSpots || 0],
      totalArea: [data?.totalArea || 0],
      builtArea: [data?.builtArea || 0],
      furnished: [data?.furnished || false],
      estimatedValue: [data?.estimatedValue || 0, [Validators.required, Validators.min(0)]],
      initialValue: [data?.initialValue || 0],
      rentValue: [data?.rentValue || null],
      salesValue: [data?.salesValue || null],
      condoFee: [data?.condoFee || null],
      iptu: [data?.iptu || null],
      availableForRent: [data?.availableForRent || false],
      availableForSale: [data?.availableForSale || false]
    });
  }

  onSubmit(): void {
    if (this.propertyForm.invalid) return;

    this.loading = true;
    const formData = this.propertyForm.value;

    const propertyData: CreatePropertyRequest = {
      name: formData.name,
      type: formData.type,
      purpose: formData.purpose,
      category: formData.category,
      description: formData.description || undefined,
      address: formData.address || undefined,
      number: formData.number || undefined,
      complement: formData.complement || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      zipCode: formData.zipCode || undefined,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      suites: formData.suites,
      parkingSpots: formData.parkingSpots,
      totalArea: formData.totalArea,
      builtArea: formData.builtArea,
      furnished: formData.furnished,
      estimatedValue: formData.estimatedValue,
      initialValue: formData.initialValue,
      rentValue: formData.rentValue || undefined,
      salesValue: formData.salesValue || undefined,
      condoFee: formData.condoFee || undefined,
      iptu: formData.iptu || undefined,
      availableForRent: formData.availableForRent,
      availableForSale: formData.availableForSale
    };

    const request = this.isEditing && this.data
      ? this.propertiesService.update(this.data.id, propertyData)
      : this.propertiesService.create(propertyData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Propriedade salva com sucesso!', 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro ao salvar propriedade:', error);
        this.snackBar.open('Erro ao salvar propriedade', 'OK', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}