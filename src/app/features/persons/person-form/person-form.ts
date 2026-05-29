import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxMaskDirective } from 'ngx-mask';
import { PersonsService } from '../../../core/services/persons.service';
import { Person, CreatePersonRequest } from '../../../core/models/person.model';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    NgxMaskDirective
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditing ? 'Editar Pessoa' : 'Nova Pessoa' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="personForm" class="person-form">
        
        <!-- Nome -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome completo</mat-label>
          <input matInput formControlName="fullName" placeholder="Nome da pessoa">
          <mat-error *ngIf="personForm.get('fullName')?.hasError('required')">
            Nome é obrigatório
          </mat-error>
        </mat-form-field>

        <!-- Documento -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>CPF/CNPJ</mat-label>
          <input matInput formControlName="document" mask="000.000.000-00||00.000.000/0000-00" placeholder="CPF ou CNPJ">
          <mat-error *ngIf="personForm.get('document')?.hasError('required')">
            Documento é obrigatório
          </mat-error>
        </mat-form-field>

        <!-- Tipo -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo</mat-label>
          <mat-select formControlName="type">
            <mat-option value="Owner">Proprietário</mat-option>
            <mat-option value="Broker">Corretor</mat-option>
            <mat-option value="Tenant">Locatário</mat-option>
            <mat-option value="Guarantor">Fiador</mat-option>
            <mat-option value="Buyer">Comprador</mat-option>
            <mat-option value="Other">Outro</mat-option>
          </mat-select>
          <mat-error *ngIf="personForm.get('type')?.hasError('required')">
            Tipo é obrigatório
          </mat-error>
        </mat-form-field>

        <!-- Email -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="email@exemplo.com">
          <mat-error *ngIf="personForm.get('email')?.hasError('email')">
            Email inválido
          </mat-error>
        </mat-form-field>

        <!-- Telefone -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Telefone</mat-label>
          <input matInput formControlName="phone" mask="(00) 00000-0000||(00) 0000-0000" placeholder="(XX) XXXXX-XXXX">
        </mat-form-field>

        <!-- Data de Nascimento -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Data de Nascimento</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="birthDate" placeholder="DD/MM/AAAA">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="personForm.invalid || loading">
        {{ loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar') }}
      </button>
    </mat-dialog-actions>

    <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
  `,
  styles: [`
    .person-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 16px;
      min-width: 400px;
    }

    mat-form-field {
      width: 100%;
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }

    @media (max-width: 600px) {
      .person-form {
        min-width: auto;
      }
    }
  `]
})
export class PersonFormComponent {
  personForm: FormGroup;
  loading = false;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private personsService: PersonsService,
    private dialogRef: MatDialogRef<PersonFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Person | null
  ) {
    this.isEditing = !!data;
    
    this.personForm = this.fb.group({
      fullName: [data?.fullName || '', [Validators.required, Validators.minLength(3)]],
      document: [data?.document || '', Validators.required],
      type: [data?.type || 'Tenant', Validators.required],
      email: [data?.email || '', Validators.email],
      phone: [data?.phone || ''],
      birthDate: [data?.birthDate ? new Date(data.birthDate) : null]
    });
  }

  onSubmit(): void {
    if (this.personForm.invalid) return;

    this.loading = true;
    const formData = this.personForm.value;
    
    // Formatar dados
    const personData: CreatePersonRequest = {
      fullName: formData.fullName,
      document: formData.document.replace(/\D/g, ''), // Remove máscara
      type: formData.type,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      birthDate: formData.birthDate ? this.formatDate(formData.birthDate) : undefined
    };

    const request = this.isEditing && this.data
      ? this.personsService.update(this.data.id, personData)
      : this.personsService.create(personData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro ao salvar pessoa:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}