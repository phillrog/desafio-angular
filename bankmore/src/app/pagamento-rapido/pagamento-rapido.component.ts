import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../shared/material-module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContaCorrenteService } from '../services/conta-corrente.service';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-pagamento-rapido',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './pagamento-rapido.component.html',
  styleUrl: './pagamento-rapido.component.css',
})
export class PagamentoRapidoComponent {
  pagamentoForm!: FormGroup;
  formSubmitted: boolean = false;
  isSubmitting: boolean = false;

  contasPredefinidas = [
    { id: 'agua', nome: 'Conta de Água', icone: 'opacity' },
    { id: 'luz', nome: 'Conta de Luz', icone: 'lightbulb' },
    { id: 'internet', nome: 'Internet / TV', icone: 'wifi' },
    { id: 'clube', nome: 'Mensalidade Clube', icone: 'sports_soccer' },
    { id: 'padaria', nome: 'Padaria', icone: 'bakery_dining' },
    { id: 'outros', nome: 'Outros (informe a descrição)', icone: 'category' }
  ];

  constructor(private fb: FormBuilder, 
    private snackBar: MatSnackBar,
    private contaCorrenteService: ContaCorrenteService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.pagamentoForm = this.fb.group({
      contaSelecionada: ['', Validators.required],
      descricao: ['', [Validators.maxLength(170)]],
      valor: ['', [Validators.required, Validators.min(0.01)]]
    });

    this.pagamentoForm.get('contaSelecionada')?.valueChanges.subscribe(value => {
      const descricaoControl = this.pagamentoForm.get('descricao');

      if (value === 'outros') {
        // Se 'Outros' for selecionado, a Descrição se torna OBRIGATÓRIA.
        descricaoControl?.setValidators([
          Validators.required, 
          Validators.maxLength(170)
        ]);
      } else {
        // Se for uma opção predefinida, a Descrição é opcional (ou ignorada).
        descricaoControl?.clearValidators();
      }
      // Revalida o controle para aplicar a nova regra.
      descricaoControl?.updateValueAndValidity();
    });
  }

  fazerPagamento() {
    this.formSubmitted = true;
    if (this.pagamentoForm.invalid) {
      this.mensagem('⚠️ Por favor, preencha todos os campos obrigatórios corretamente.', ['warning-snackbar']);
      this.pagamentoForm.markAllAsTouched();
      return; 
    }
    this.isSubmitting = true;

    const formValue = this.pagamentoForm.value;
      
    const valorComPonto = String(formValue.valor).replace(',', '.');
    const valorNumerico = parseFloat(valorComPonto);

    let descricaoFinal: string;
    if (formValue.contaSelecionada === 'outros') {
      descricaoFinal = formValue.descricao;
    } else {
      const conta = this.contasPredefinidas.find(c => c.id === formValue.contaSelecionada);
      descricaoFinal = conta ? conta.nome : 'Pagamento Rápido';
    }
    
    const payload = {
      valor: valorNumerico,
      descricao: descricaoFinal
    };

    this.contaCorrenteService.postDebito(payload).pipe(
      tap(response => {
        if (response && response.success === true) {
          this.atualizarSaldoNoService();
        }
      }),
      finalize(() => {
        this.isSubmitting = false; 
        this.cd.markForCheck();
      }),
      catchError(error => {
        this.isSubmitting = false; 
        this.cd.markForCheck();
        console.error('Erro ao debitar pagamento:', error);
        
        return of(error.error?.errors); 
      })
    ).subscribe(response => {
      this.isSubmitting = false; 
      this.cd.markForCheck();
      if (response && response.success === true) { 
        this.mensagem('✅ Pagamento realizado com sucesso!', ['success-snackbar']);
        this.pagamentoForm.reset(); 
        this.formSubmitted = false;
        this.pagamentoForm.get('valor')?.setValue('');
        this.pagamentoForm.get('descricao')?.setValue('');
      } else {
        const errorMessage = response ? response.join('; ') : 'Falha na operação de pagamento.';
        this.mensagem(`🛑 Erro: ${errorMessage}`, ['error-snackbar']);
      }
    });
  }

  atualizarSaldoNoService() {
    this.contaCorrenteService.getSaldo().subscribe(saldoAtual => {
        console.log("Saldo Atualizado:", saldoAtual);
    }, error => {
        console.error("Erro ao carregar saldo após pagamento:", error);
    });
  }
  
  get isOutrosSelected(): boolean {
    return this.pagamentoForm.get('contaSelecionada')?.value === 'outros';
  }

  private mensagem(mensagem: string, classe: any): void{
    this.snackBar.open(
      mensagem,
      'Fechar',
      {
        duration: 5000, 
        horizontalPosition: 'right', // Posição
        verticalPosition: 'top', // Posição
        panelClass: classe
      }
    );
  }
}
