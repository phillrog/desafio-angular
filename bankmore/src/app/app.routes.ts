import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { ExtratoComponent } from './extrato/extrato.component';
import { PagamentoRapidoComponent } from './pagamento-rapido/pagamento-rapido.component';


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
              path: '', 
              redirectTo: 'extrato', 
              pathMatch: 'full' 
          },
        ]
      },
];
