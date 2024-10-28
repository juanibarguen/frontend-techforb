import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidebar-responsive',
  templateUrl: './sidebar-responsive.component.html',
  styleUrls: ['./sidebar-responsive.component.css']
})

export class SidebarResponsiveComponent {
  // Propiedades que controlan la apertura de los menús
  isLeftMenuOpen: boolean = false; // Estado del menú izquierdo
  isRightMenuOpen: boolean = false; // Estado del menú derecho

  // Inyección de dependencias para el servicio de autenticación y el router
  constructor(private authService: AuthService, private router: Router) {}

  // Método que se llama al cerrar sesión
  onLogout() {
      this.authService.logout(); // Llama al servicio de autenticación para cerrar sesión
      this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

  // Método para alternar el estado del menú izquierdo
  toggleLeftMenu() {
    this.isLeftMenuOpen = !this.isLeftMenuOpen; // Cambia el estado del menú izquierdo
    if (this.isRightMenuOpen) { // Si el menú derecho está abierto, ciérralo
      this.closeRightMenu();
    }
  }

  // Método para alternar el estado del menú derecho
  toggleRightMenu() {
    this.isRightMenuOpen = !this.isRightMenuOpen; // Cambia el estado del menú derecho
    if (this.isLeftMenuOpen) { // Si el menú izquierdo está abierto, ciérralo
      this.closeLeftMenu();
    }
  }

  // Método para cerrar el menú izquierdo
  closeLeftMenu() {
    this.isLeftMenuOpen = false; // Establece el estado del menú izquierdo en cerrado
  }

  // Método para cerrar el menú derecho
  closeRightMenu() {
    this.isRightMenuOpen = false; // Establece el estado del menú derecho en cerrado
  }
}
