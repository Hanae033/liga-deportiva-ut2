import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { MatchService } from '../../core/services/match';
import { TeamsComponent } from '../../shared/teams/teams';
import { MatchesComponent } from '../../shared/matches/matches';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, TeamsComponent, MatchesComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  newMatch = {
    sport: 'futbol',
    teamA: '',
    teamB: '',
    date: '',
    location: '',
    referee: ''
  };

  matches: any[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.matchService.getMatches().subscribe({
      next: (data) => {
        this.matches = data;
      },
      error: (error) => {
        console.error('Error al cargar partidos:', error);
      }
    });
  }

  createMatch(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.matchService.createMatch(this.newMatch).subscribe({
      next: (response) => {
        this.successMessage = 'Partido creado correctamente';
        this.loadMatches();
        this.resetForm();
      },
      error: (error) => {
        this.errorMessage = 'Error al crear el partido';
        console.error('Error:', error);
      }
    });
  }

  resetForm(): void {
    this.newMatch = {
      sport: 'futbol',
      teamA: '',
      teamB: '',
      date: '',
      location: '',
      referee: ''
    };
  }

  deleteMatch(id: string): void {
    if (confirm('¿Estás seguro de eliminar este partido?')) {
      this.matchService.deleteMatch(id).subscribe({
        next: () => {
          this.successMessage = 'Partido eliminado';
          this.loadMatches();
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar';
          console.error('Error:', error);
        }
      });
    }
  }
}