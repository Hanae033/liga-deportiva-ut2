import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from '../../layout/footer/footer';
import { MatchService } from '../../core/services/match';
import { FilterPipe } from '../../shared/pipes/filter-pipe';

@Component({
  selector: 'app-referee',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent,FilterPipe],
  templateUrl: './referee.html',
  styleUrl: './referee.css'
})
export class RefereeComponent implements OnInit {
  refereeMatches: any[] = [];
  refereeName = 'Carmelo Ruiz'; 

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.loadRefereeMatches();
  }

  loadRefereeMatches(): void {
    this.matchService.getMatches().subscribe({
      next: (data) => {
        // Filtrar solo los partidos asignados a este árbitro
        this.refereeMatches = data.filter(match => 
          match.referee === this.refereeName
        );
      },
      error: (error) => {
        console.error('Error al cargar partidos:', error);
      }
    });
  }
}