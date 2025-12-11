import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../shared/material-module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pagamento-rapido',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './pagamento-rapido.component.html',
  styleUrl: './pagamento-rapido.component.css',
})
export class PagamentoRapidoComponent {
  pagamentoForm!: FormGroup;
  formSubmitted: boolean = false;
  
  contasPredefinidas = [
    { id: 'agua', nome: 'Conta de Água', icone: 'opacity' },
    { id: 'luz', nome: 'Conta de Luz', icone: 'lightbulb' },
    { id: 'internet', nome: 'Internet / TV', icone: 'wifi' },
    { id: 'clube', nome: 'Mensalidade Clube', icone: 'sports_soccer' },
    { id: 'padaria', nome: 'Padaria', icone: 'bakery_dining' },
    { id: 'outros', nome: 'Outros (informe a descrição)', icone: 'category' }
  ];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.pagamentoForm = this.fb.group({
      contaSelecionada: ['', Validators.required],
      descricao: ['', [Validators.maxLength(170)]],
      valor: [0, [Validators.required, Validators.min(0.01)]]
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
    if (this.pagamentoForm.valid) {
      console.log('Dados do Pagamento:', this.pagamentoForm.value);
      
      this.mensagem('✅ Pagamento realizado com sucesso!');
    } else {
      this.mensagem('⚠️ Por favor, preencha todos os campos obrigatórios corretamente.!');
      this.pagamentoForm.markAllAsTouched();
    }
  }

  
  get isOutrosSelected(): boolean {
    return this.pagamentoForm.get('contaSelecionada')?.value === 'outros';
  }

  private mensagem(mensagem: string): void{
    this.snackBar.open(
      mensagem,
      'Fechar',
      {
        duration: 5000, 
        horizontalPosition: 'right', // Posição
        verticalPosition: 'top', // Posição
        panelClass: ['warning-snackbar'] 
      }
    );
  }
}
