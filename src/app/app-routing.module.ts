import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '', // Ruta raíz
    component: HomeComponent, // Usa HomeComponent como contenedor
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige a login si la URL está vacía
    ],
  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }, // Dashboard independiente
  { path: '**', redirectTo: '' } // Redirige a la ruta raíz si no se encuentra la ruta
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
