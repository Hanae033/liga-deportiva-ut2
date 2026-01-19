import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { MatchService } from '../../core/services/match';
import { MatchesComponent } from '../../shared/matches/matches';

@Component({
  selector: 'app-captain',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, MatchesComponent],
  templateUrl: './captain.html',
  styleUrl: './captain.css'
})
export class CaptainComponent implements OnInit {
  teamMatches: any[] = [];
  teamName = 'CD Tormeta IES'; 
  selectedMatch: any = null;
  scoreA = 0;
  scoreB = 0;
  successMessage = '';
  errorMessage = '';

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.loadTeamMatches();
  }

  loadTeamMatches(): void {
    this.matchService.getMatches().subscribe({
      next: (data) => {
        this.teamMatches = data.filter(match => 
          match.teamA === this.teamName || match.teamB === this.teamName
        );
      },
      error: (error) => {
        console.error('Error al cargar partidos:', error);
      }
    });
  }

  selectMatch(match: any): void {
    this.selectedMatch = match;
    this.scoreA = match.scoreA || 0;
    this.scoreB = match.scoreB || 0;
  }

  submitScore(): void {
    if (!this.selectedMatch) return;

    this.errorMessage = '';
    this.successMessage = '';

    const scoreData = {
      scoreA: this.scoreA,
      scoreB: this.scoreB,
      submittedBy: 'captain'
    };

    this.matchService.updateScore(this.selectedMatch._id, scoreData).subscribe({
      next: (response) => {
        this.successMessage = 'Resultado enviado correctamente';
        this.loadTeamMatches();
        this.selectedMatch = null;
      },
      error: (error) => {
        this.errorMessage = 'Error al enviar el resultado';
        console.error('Error:', error);
      }
    });
  }
}