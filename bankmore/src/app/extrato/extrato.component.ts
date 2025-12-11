import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, catchError, of, map, delay, finalize } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Extrato } from '../models/extrato.model';
import { Response } from '../models/response.model';
import { ContaCorrenteService } from '../services/conta-corrente.service';
import { MaterialModule } from '../shared/material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule]
})
export class ExtratoComponent implements OnInit {
  
  displayedColumns: string[] = ['data', 'descricao', 'tipo', 'valor', 'contraparte', 'contas'];
  
  dataSource = new MatTableDataSource<Extrato>([]);
  
  isLoadingResults = true;
  
  error: string | null = null;

  constructor(private contaService: ContaCorrenteService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isLoadingResults = true;
        
    this.contaService.getExtrato().pipe(
      finalize(()=>{
        this.isLoadingResults = false;
        this.cd.markForCheck();
      }),
      map((response: Response<Extrato>) => {
        this.isLoadingResults = false;
        this.cd.markForCheck();
        if (response.success && response.data) {
          return response.data;
        } else {          
          this.error = response.errors ? response.errors.join('; ') : 'Não foi possível carregar o extrato.';
          return [];
        }
      }),
      catchError(err => {
        this.isLoadingResults = false;
        this.cd.markForCheck();
        this.error = 'Erro de conexão: Não foi possível acessar o serviço de extrato.';
        console.error('Erro HTTP/Rede:', err);
        return of([]);
      })
    ).subscribe((data: any) => {
      this.dataSource.data = data;
    });
  }

  // Helper para determinar a cor do valor
  getTipoClasse(tipo: string): string {
    return tipo === 'CRÉDITO' ? 'credit-amount' : 'debit-amount';
  }
}