import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Añade estilos si es necesario
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    // Inicializar el formulario con los campos necesarios
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      mail: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  
  onSubmit() {
    if (this.registerForm.valid) {
      const password = this.registerForm.get('password')?.value;
      const confirmPassword = this.registerForm.get('confirmPassword')?.value;

      // Verificar si las contraseñas coinciden
      if (password !== confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        this.registerForm.get('password')?.reset(); 
        this.registerForm.get('confirmPassword')?.reset();
      } else {
        // Si las contraseñas coinciden, continuar con la solicitud al backend
        this.http.post('http://localhost:8080/auth/register', this.registerForm.value).subscribe({
          next: (response) => {
            // Mostrar mensaje de éxito
            this.successMessage = 'Registro exitoso. Redirigiendo al inicio de sesión...';
            this.errorMessage = '';

            // Redirigir al formulario de inicio de sesión después de 2 segundos
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (err) => {
            // Manejar el error de registro
            console.error(err);
            this.errorMessage = err.error.message || 'Error al registrar el usuario';
            this.successMessage = '';
          }
        });
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/login']); // Redirige al login
  }
}
