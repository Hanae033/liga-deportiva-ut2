import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teams.html',
  styleUrl: './teams.css'
})
export class TeamsComponent implements OnInit {
  @Input() isAdmin = false;
  
  teams: any[] = [
    { name: 'CD Tormeta IES', captain: 'Juan Pérez', players: 16, position: 2, sport: 'futbol' },
    { name: 'Hoop Stars', captain: 'Marta Gómez', players: 10, position: 1, sport: 'baloncesto' },
    { name: 'Racket Club', captain: 'Raúl López', players: 8, position: '-', sport: 'tenis' }
  ];

  filteredTeams: any[] = [];
  selectedSport = 'all';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.filteredTeams = this.teams;
  }

  filterBySport(sport: string): void {
    this.selectedSport = sport;
    if (sport === 'all') {
      this.filteredTeams = this.teams;
    } else {
      this.filteredTeams = this.teams.filter(team => team.sport === sport);
    }
  }
}