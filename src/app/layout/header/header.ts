import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  isAuthenticated = false;
  userType: string | null = null;

  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userType = this.authService.getUserType();
  }

  logout(): void {
    this.authService.logout();
  }
}

