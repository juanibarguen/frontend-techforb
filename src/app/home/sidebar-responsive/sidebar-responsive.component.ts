import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidebar-responsive',
  templateUrl: './sidebar-responsive.component.html',
  styleUrls: ['./sidebar-responsive.component.css']
})
export class SidebarResponsiveComponent {


  constructor(private authService: AuthService, private router: Router) {}

  onLogout() {
      this.authService.logout(); 
      this.router.navigate(['/login']);
  }


  isLeftMenuOpen: boolean = false;
  isRightMenuOpen: boolean = false;

  toggleLeftMenu() {
    this.isLeftMenuOpen = !this.isLeftMenuOpen;
    if (this.isRightMenuOpen) {
      this.closeRightMenu();
    }
  }

  toggleRightMenu() {
    this.isRightMenuOpen = !this.isRightMenuOpen;
    if (this.isLeftMenuOpen) {
      this.closeLeftMenu();
    }
  }

  closeLeftMenu() {
    this.isLeftMenuOpen = false;
  }

  closeRightMenu() {
    this.isRightMenuOpen = false;
  }
}