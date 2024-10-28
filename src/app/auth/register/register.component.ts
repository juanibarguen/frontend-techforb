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

        
        if (password !== confirmPassword) {
            this.errorMessage = 'Las contraseñas no coinciden';
            this.registerForm.get('password')?.reset();
            this.registerForm.get('confirmPassword')?.reset();
        } else {
            
            const payload = {
                username: this.registerForm.get('username')?.value,
                password: this.registerForm.get('password')?.value,
                mail: this.registerForm.get('mail')?.value,
                firstName: this.registerForm.get('firstName')?.value,
                lastName: this.registerForm.get('lastName')?.value
            };

            console.log('Registro solicitado:', payload); 
            this.http.post('https://api-techforbu-production.up.railway.app/auth/register', payload).subscribe({
                next: (response) => {
                    this.successMessage = 'Registro exitoso. Redirigiendo al inicio de sesión...';
                    this.errorMessage = '';

                    
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 2000);
                },
                error: (err) => {
                    
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


  goToLogin() {
    this.router.navigate(['/login']);
  }
}
