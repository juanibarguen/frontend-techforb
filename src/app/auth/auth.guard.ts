import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service'; 
import { Router } from '@angular/router';
import { inject } from '@angular/core';

// Definición de un Guard de ruta que se asegura de que el usuario esté autenticado
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta el servicio de autenticación
  const router = inject(Router); // Inyecta el servicio de navegación del router

  // Verifica si el usuario ha iniciado sesión
  if (authService.isLoggedIn()) {
    return true; // Permite el acceso a la ruta si el usuario está autenticado
  } else {
    router.navigate(['/login']); // Redirige a la página de login si el usuario no está autenticado
    return false; // Bloquea el acceso a la ruta si el usuario no está autenticado
  }
};
