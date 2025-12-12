import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TransferenciasService } from '../../services/transferencias.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialModule, ModalConfirmacaoComponent } from '../../shared/material-module';
import { Transferir } from '../../models/tranferir.model';
import { ContaCorrenteService } from '../../services/conta-corrente.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css'],
  imports: [MaterialModule, ReactiveFormsModule]
})
export class TransferenciasComponent implements OnInit {
  transferForm!: FormGroup;
  isSubmitting: boolean = false;
  formSubmitted: boolean = false;

  private mensagem(mensagem: string, classe: any) {
    this.snackBar.open(
      mensagem,
      'Fechar',
      {
        duration: 5000, 
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: classe
      }
    );
  }

  constructor(
    private fb: FormBuilder,
    private transferenciasService: TransferenciasService,
    private contaCorrenteService: ContaCorrenteService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog ,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      contaDestino: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^[0-9]+$/)
      ]],
      valor: ['', [
        this.valorMinimoValidator(0.01)
      ]]
    });
  }

  
  valorMinimoValidator(minimo: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valorString = control.value;
      
      const valorNumerico = parseFloat(this.unmaskValor(valorString));
            
      if (isNaN(valorNumerico) || valorNumerico <= 0) {    
        return { 'valorMinimo': true };
      }
      
      return null; 
    };
  }

  unmaskValor(maskedValue: string): string {
    if (!maskedValue) return '0';    
    return String(maskedValue).replace(/[R$ ]/g, '').replace(/\./g, '').replace(',', '.');
  }

  solicitarTransferencia(): void {
    this.formSubmitted = true;
    if (this.transferForm.invalid) {
      this.mensagem('⚠️ Por favor, preencha todos os campos obrigatórios corretamente.', ['warning-snackbar']);
      this.transferForm.markAllAsTouched();
      return;
    }

    const formValue = this.transferForm.value;
    const valorNumerico = parseFloat(this.unmaskValor(formValue.valor));

    const payload: Transferir = {
      numneroContaCorrenteDestino: formValue.contaDestino,
      valor: valorNumerico
    };

    this.abrirModalConfirmacao(payload);
  }

  abrirModalConfirmacao(payload: Transferir): void {
    const htmlBody = `
        <div>
          <h4>Dados Transferidos:</h4>
          <ul>
              <li><strong>Conta Destino:</strong> ${payload.numneroContaCorrenteDestino}</li>
              <li><strong>Valor:</strong> ${payload.valor.toFixed(2).replace('.', ',')}</li>
          </ul>
      </div>

      <h3>O que acontece após confirmar?</h3>
      <p>Ao clicar em **'Confirmar'**, o valor será imediatamente debitado de sua conta e a transação será enviada para o destino informado. Você receberá uma notificação de sucesso e seu saldo será atualizado.</p>

      <h3>Segurança</h3>
      <p>Todas as transações são criptografadas e processadas através de servidores seguros. Verifique sempre os dados do destinatário antes de confirmar qualquer transferência.</p>
    `;
    const dialogRef = this.dialog.open(ModalConfirmacaoComponent, {
      width: '550px', 
      maxWidth: '90vw',
      data: { 
        titulo: 'Confirmação de Transferência',
        mensagem: `Confirma a transferência de R$ ${payload.valor.toFixed(2).replace('.', ',')} para a conta ${payload.numneroContaCorrenteDestino}?`,
        payload: payload,
        cancelText: 'Cancelar',
        confirmText: 'Confirmar',
        body: htmlBody
      }
    });

    setTimeout(() => {
      dialogRef.afterClosed().subscribe(resultado => {
            if (resultado === true) {
                this.executarTransferencia(payload);
            }
            this.cd.detectChanges();
        });
  }, 0);
  }

  executarTransferencia(payload: Transferir): void {
    this.isSubmitting = true;

    this.transferenciasService.postTransferir(payload).pipe(
      tap(response => {
        if (response && response.success === true) {
          this.atualizarSaldoNoService();
          this.cd.markForCheck();
        }
      }),
      finalize(() => {
        this.isSubmitting = false;
        this.cd.markForCheck();
      }),
      catchError(error => {
        this.isSubmitting = false;
        this.cd.markForCheck();
        console.error('Erro ao realizar transferência:', error);
        return of(error.error || [{ message: 'Erro desconhecido.' }]);
      })
    ).subscribe((response: any) => {
      this.isSubmitting = false;
      this.cd.markForCheck();

      if (response && response.success === true) {
        this.mensagem('✅ Transferência realizada com sucesso!', ['success-snackbar']);
        this.resetFormulario();
      } else {
        this.mensagem(`🛑 Erro: ${(response || 'Falha na operação de transferência.')}`, ['error-snackbar']);
      }
    });
  }
  
  resetFormulario(): void {
    this.transferForm.reset();
    this.formSubmitted = false;
    this.transferForm.get('valor')?.setValue('');
    this.transferForm.get('contaDestino')?.setValue('');
  }

  atualizarSaldoNoService() {
    this.contaCorrenteService.getSaldo().subscribe(saldoAtual => {
        console.log("Saldo Atualizado:", saldoAtual);
        this.cd.markForCheck();
    }, error => {
        console.error("Erro ao carregar saldo após pagamento:", error);
    });
  }
}