import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component'; // Asegúrate de que el path sea correcto
import { RegisterComponent } from './auth/register/register.component'; // Asegúrate de que el path sea correcto
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { SidebarResponsiveComponent } from './home/sidebar-responsive/sidebar-responsive.component';

// Función para obtener el token
export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,  // Asegúrate de incluir el LoginComponent
    RegisterComponent, DashboardComponent, HomeComponent, SidebarComponent, SidebarResponsiveComponent, // Asegúrate de incluir el RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['https://api-techforbu-production.up.railway.app'], // Cambia esto si tu API está en otro dominio
        disallowedRoutes: [
          'https://api-techforbu-production.up.railway.app/auth/login', 
          'https://api-techforbu-production.up.railway.app/auth/register'
        ]
      }
    }),
    AppRoutingModule // Asegúrate de tener el módulo de enrutamiento
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
