import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'documentMask',
  standalone: true
})
export class DocumentMaskPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Remove caracteres não numéricos
    const numbers = value.replace(/\D/g, '');

    // CPF (11 dígitos)
    if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // CNPJ (14 dígitos)
    if (numbers.length === 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    // Retorna sem máscara se não for CPF nem CNPJ
    return value;
  }
}