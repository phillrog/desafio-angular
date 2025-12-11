import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { ExtratoComponent } from './extrato/extrato.component';


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
              path: '', 
              redirectTo: 'extrato', 
              pathMatch: 'full' 
          },
        ]
      },
];
