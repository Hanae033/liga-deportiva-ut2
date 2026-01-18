import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { MatchService } from '../../core/services/match';
import { MatchesComponent } from '../../shared/matches/matches';
import { StandingsComponent } from '../../shared/standings/standings';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, MatchesComponent, StandingsComponent],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class UserComponent implements OnInit {
  userMatches: any[] = [];
  userTeam = 'CD Tormeta IES'; // Esto debería venir de la sesión del usuario

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.loadUserMatches();
  }

  loadUserMatches(): void {
    this.matchService.getMatches().subscribe({
      next: (data) => {
        // Filtrar solo los partidos del equipo del usuario
        this.userMatches = data.filter(match => 
          match.teamA === this.userTeam || match.teamB === this.userTeam
        );
      },
      error: (error) => {
        console.error('Error al cargar partidos:', error);
      }
    });
  }
}