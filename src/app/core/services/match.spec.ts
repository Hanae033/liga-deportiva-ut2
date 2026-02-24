import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatchService } from './match';

const MOCK_MATCHES = [
  { _id: '1', sport: 'futbol', teamA: 'CD Tormeta IES', teamB: 'Hoop Stars',
    date: '2025-03-10', location: 'Ciudad Real', scoreA: 2, scoreB: 1 },
  { _id: '2', sport: 'baloncesto', teamA: 'Dunkers', teamB: 'CD Tormeta IES',
    date: '2025-03-12', location: 'Almagro' }
];

describe('MatchService', () => {
  let service: MatchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MatchService]
    });
    service  = TestBed.inject(MatchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('getMatches() debe devolver lista de partidos via GET', () => {
    service.getMatches().subscribe(matches => {
      expect(matches.length).toBe(2);
      expect(matches[0].teamA).toBe('CD Tormeta IES');
    });

    const req = httpMock.expectOne(r => r.url.includes('/matches'));
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_MATCHES);
  });

  it('createMatch() debe hacer POST y devolver el partido creado', () => {
    const nuevo = {
      sport: 'tenis', teamA: 'A', teamB: 'B',
      date: '2025-04-01', location: 'Daimiel'
    };

    service.createMatch(nuevo).subscribe(res => {
      expect(res._id).toBeTruthy();
    });

    const req = httpMock.expectOne(r => r.url.includes('/matches'));
    expect(req.request.method).toBe('POST');
    req.flush({ ...nuevo, _id: 'new123' });
  });

  it('updateMatch() debe hacer PUT', () => {
    service.updateMatch('1', { scoreA: 3, scoreB: 2 }).subscribe(res => {
      expect(res.scoreA).toBe(3);
    });

    const req = httpMock.expectOne(r => r.url.includes('/matches/1'));
    expect(req.request.method).toBe('PUT');
    req.flush({ _id: '1', scoreA: 3, scoreB: 2 });
  });

  it('deleteMatch() debe hacer DELETE', () => {
    service.deleteMatch('1').subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(r => r.url.includes('/matches/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'deleted' });
  });

  it('debe manejar error 500 en getMatches()', () => {
    service.getMatches().subscribe({
      next: () => fail('Debía fallar'),
      error: err => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne(r => r.url.includes('/matches'));
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});