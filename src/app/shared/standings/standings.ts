import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './standings.html',
  styleUrl: './standings.css'
})
export class StandingsComponent implements OnInit {
  standings: any[] = [
    { position: 1, team: 'Hoop Stars', played: 10, won: 8, drawn: 1, lost: 1, points: 25 },
    { position: 2, team: 'CD Tormeta IES', played: 10, won: 7, drawn: 1, lost: 2, points: 22 },
    { position: 3, team: 'Dunkers', played: 10, won: 5, drawn: 2, lost: 3, points: 17 }
  ];

  selectedSport = 'futbol';

  ngOnInit(): void {
    // Cargar clasificaciones según el deporte
  }

  changeSport(): void {
    console.log('Cambiado a:', this.selectedSport);
    // Aquí se cargarían las clasificaciones del deporte seleccionado
  }
}
