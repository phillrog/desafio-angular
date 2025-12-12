// ARQUIVO: modal-confirmacao.component.ts

import { Component, Inject, SecurityContext } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog'; 
import { CommonModule } from '@angular/common';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

// Nota: Assumimos que ele é standalone: true e você já fez as importações necessárias
@Component({
  selector: 'app-modal-confirmacao',
  standalone: true, 
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
        <h2 mat-dialog-title>
        <mat-icon color="primary" style="vertical-align: middle; margin-right: 8px;">check_circle_outline</mat-icon>
        {{ data.titulo }}
    </h2>
    
        <mat-dialog-content class="mat-typography">
      <h3>Detalhes da Transação</h3>
      
      <p style="font-weight: 500; font-size: 16px;">
          {{ data.mensagem }}
      </p>

      <hr>

      <div [innerHTML]="sanitizedBody"></div>
    </mat-dialog-content>

        <div mat-dialog-actions align="end">
            <button 
        mat-button 
        (click)="onNoClick()"
      >
        {{ data.cancelText || 'Cancelar' }}
      </button>

            <button 
        mat-raised-button 
        color="primary" 
        [mat-dialog-close]="true" 
        cdkFocusInitial
      >
        {{ data.confirmText || 'Confirmar' }}
      </button>
    </div>
  `,
})
export class ModalConfirmacaoComponent {
  sanitizedBody: SafeHtml;

  constructor(
    public dialogRef: MatDialogRef<ModalConfirmacaoComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    private sanitizer: DomSanitizer
  ) {
    this.sanitizedBody = this.sanitizer.sanitize(SecurityContext.HTML, data.body) || '';
  }

  onNoClick(): void {
    this.dialogRef.close(false); // Fecha e retorna FALSE
  }
}