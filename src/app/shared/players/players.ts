import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players.html',
  styleUrl: './players.css'
})
export class PlayersComponent implements OnInit {
  players: any[] = [
    { id: 'p1', name: 'Juan Pérez', position: 'Delantero', team: 'CD Tormeta IES', age: 17 },
    { id: 'p2', name: 'Marta Gómez', position: 'Base', team: 'Hoop Stars', age: 16 },
    { id: 'p3', name: 'Raúl López', position: 'Individual', team: 'Racket Club', age: 18 }
  ];

  filteredPlayers: any[] = [];
  searchTerm = '';

  ngOnInit(): void {
    this.filteredPlayers = this.players;
  }

  filterPlayers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPlayers = this.players.filter(player =>
      player.name.toLowerCase().includes(term) ||
      player.team.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterPlayers();
  }
}
