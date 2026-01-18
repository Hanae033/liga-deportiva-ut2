import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matches.html',
  styleUrl: './matches.css'
})
export class MatchesComponent {
  @Input() matches: any[] = [];
  @Input() isAdmin = false;
  @Output() deleteMatch = new EventEmitter<string>();

  onDelete(matchId: string): void {
    this.deleteMatch.emit(matchId);
  }
}

