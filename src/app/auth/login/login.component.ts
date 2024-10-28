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
  loginForm: FormGroup; // Formulario de inicio de sesión
  errorMessage: string = ''; // Mensaje de error en caso de fallos en el inicio de sesión
  successMessage: string = ''; // Mensaje de éxito en caso de inicio de sesión exitoso

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Inicializa el formulario con los campos de correo y contraseña
    this.loginForm = this.fb.group({
      mail: ['', Validators.required], // Campo de correo requerido
      password: ['', Validators.required] // Campo de contraseña requerido
    });
  }

  // Método de inicio de sesión
  login() {
    // Verifica si el formulario es válido
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value; // Obtiene las credenciales del formulario
      console.log('Credenciales enviadas:', credentials);

      // Llama al servicio de autenticación para iniciar sesión
      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          console.log(`Login exitoso para el usuario: ${response.user.firstname}`);
          this.successMessage = 'Inicio de sesión exitoso. Redirigiendo al dashboard...';

          // Almacena el token en el servicio de autenticación
          this.authService.setToken(response.token);

          // Llama al servicio para obtener la información del usuario
          this.authService.getUserInfo().subscribe({
            next: (userInfo) => {
              this.authService.setUserInfo(userInfo); // Almacena los datos del usuario
              console.log('Datos del usuario obtenidos:', userInfo);

              // Redirige al usuario al dashboard después de iniciar sesión
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              console.error('Error al obtener la información del usuario:', error);
              this.errorMessage = 'Error al cargar los datos del usuario.';
            }
          });
        },
        error: (err) => {
          // Manejo de error en el inicio de sesión, mostrando mensaje específico si existe
          console.error('Error en el inicio de sesión', err);
          this.errorMessage = err.error || 'Error en el inicio de sesión. Verifica tus credenciales.';
          this.successMessage = '';
        }
      });
    }
  }

  // Redirige a la página de registro
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
