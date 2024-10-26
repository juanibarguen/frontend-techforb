import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service'; // Asegúrate de que esta ruta es correcta
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyección del servicio
  const router = inject(Router); // Inyección del router

  if (authService.isLoggedIn()) {
    return true; // El usuario está autenticado, se permite el acceso
  } else {
    router.navigate(['/login']); // Redirige al login si no está autenticado
    return false; // No se permite el acceso
  }
};
