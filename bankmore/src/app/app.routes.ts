import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';


export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
        //   { path: 'home', component: HomeComponent },
        //   { path: 'contas', component: ContasComponent },
        //   { path: 'transferencias', component: TransferenciasComponent },
        //   // Redireciona a raiz para 'home'
        //   { path: '', redirectTo: 'home', pathMatch: 'full' }, 
        ]
      },
];
