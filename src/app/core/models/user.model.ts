export interface User {
  _id?: string;
  username: string;
  password: string;
  email: string;
  type: 'admin' | 'normal' | 'capitan' | 'arbitro';
  teamId?: string;
  createdAt?: Date;
}

export interface Match {
  _id?: string;
  sport: string;
  teamA: string;
  teamB: string;
  date: Date;
  location: string;
  referee: string;
  scoreA?: number;
  scoreB?: number;
  status: 'pending' | 'finished' | 'review';
}

export interface Team {
  _id?: string;
  name: string;
  sport: string;
  captain: string;
  players: string[];
  wins: number;
  draws: number;
  losses: number;
  points: number;
}