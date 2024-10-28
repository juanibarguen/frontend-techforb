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
  registerForm: FormGroup; // Formulario de registro
  errorMessage: string = ''; // Mensaje de error en caso de fallos en el registro
  successMessage: string = ''; // Mensaje de éxito en caso de registro exitoso

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    // Inicializa el formulario con los campos requeridos y sus validaciones
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]], // nombre con validación requerida
      lastName: ['', [Validators.required]], // apellido con validación requerida
      mail: ['', [Validators.required, Validators.email]], // email con validación de formato y requerido
      username: ['', [Validators.required]], // nombre de usuario requerido
      password: ['', [Validators.required, Validators.minLength(8)]], // Contraseña requerida con mínimo de 8 caracteres
      confirmPassword: ['', [Validators.required]] // Confirmación de contraseña requerida
    });
  }

  // Método de envío de formulario
  onSubmit() {
    // Verifica si el formulario es válido
    if (this.registerForm.valid) {
      const password = this.registerForm.get('password')?.value;
      const confirmPassword = this.registerForm.get('confirmPassword')?.value;

      // Comprueba si las contraseñas coinciden
      if (password !== confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        this.registerForm.get('password')?.reset();
        this.registerForm.get('confirmPassword')?.reset();
      } else {
        // Prepara los datos a enviar al backend para el registro
        const payload = {
          username: this.registerForm.get('username')?.value,
          password: this.registerForm.get('password')?.value,
          mail: this.registerForm.get('mail')?.value,
          firstName: this.registerForm.get('firstName')?.value,
          lastName: this.registerForm.get('lastName')?.value
        };

        //console.log('Registro solicitado:', payload); // Muestra en consola los datos enviados

        // Realiza la solicitud de registro al backend
        this.http.post('https://api-techforbu-production.up.railway.app/auth/register', payload).subscribe({
          next: (response) => {
            this.successMessage = 'Registro exitoso. Redirigiendo al inicio de sesión...';
            this.errorMessage = '';

            // Redirige al usuario al login después de 2 segundos
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (err) => {
            // Manejo de errores: muestra mensaje específico si el servidor devuelve un error 400
            if (err.status === 400 && typeof err.error === 'string') {
              this.errorMessage = err.error; 
            } else {
              this.errorMessage = 'Error al registrar el usuario';
            }
            this.successMessage = '';
          }
        });
      }
    }
  }

  // Redirige a la página de login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}

