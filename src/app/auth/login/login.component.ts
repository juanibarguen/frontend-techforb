import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Inicializar el formulario
    this.loginForm = this.fb.group({
      mail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      console.log('Credenciales enviadas:', credentials);
  
      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          console.log(`Login exitoso para el usuario: ${response.user.firstname}`);
          this.successMessage = 'Inicio de sesión exitoso. Redirigiendo al dashboard...';
  
          this.authService.setToken(response.token);
  
          this.authService.getUserInfo().subscribe({
            next: (userInfo) => {
              this.authService.setUserInfo(userInfo); 
              console.log('Datos del usuario obtenidos:', userInfo);
              
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              console.error('Error al obtener la información del usuario:', error);
              this.errorMessage = 'Error al cargar los datos del usuario.';
            }
          });
        },
        error: (err) => {
          console.error('Error en el inicio de sesión', err);
          // Utiliza el mensaje de error específico del backend
          this.errorMessage = err.error || 'Error en el inicio de sesión. Verifica tus credenciales.';
          this.successMessage = '';
        }
      });
    }
  }
  


    goToRegister() {
      this.router.navigate(['/register']); 
    }
}
