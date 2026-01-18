import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.setUserData(response.token, response.userType);
        
        // Redirigir según el tipo de usuario
        switch (response.userType) {
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          case 'capitan':
            this.router.navigate(['/captain']);
            break;
          case 'arbitro':
            this.router.navigate(['/referee']);
            break;
          default:
            this.router.navigate(['/user']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        console.error('Error de login:', error);
      }
    });
  }
}