import { Routes } from '@angular/router';
import { ExtratoComponent } from './components/extrato/extrato.component';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { PagamentoRapidoComponent } from './components/pagamento-rapido/pagamento-rapido.component';
import { TransferenciasComponent } from './components/transferencias/transferencias.component';



export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
          { 
            path: 'extrato', 
            component: ExtratoComponent 
          },     
          { 
            path: 'pagamento-rapido', 
            component: PagamentoRapidoComponent 
          },     
          { 
            path: 'transferir', 
            component: TransferenciasComponent 
          },    
          { 
              path: '', 
              redirectTo: 'extrato', 
              pathMatch: 'full' 
          },
        ]
      },
];
