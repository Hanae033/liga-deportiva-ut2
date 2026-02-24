import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service  = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('login() debe hacer POST y guardar token', () => {
    service.login('hanane', 'pass123').subscribe(res => {
      expect(res.token).toBe('mock-token');
    });

    const req = httpMock.expectOne(r => r.url.includes('/login'));
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'mock-token', userType: 'admin' });
  });

  it('login() falla con credenciales incorrectas (401)', () => {
    service.login('mal', 'usuario').subscribe({
      next: () => fail('Debía fallar'),
      error: err => expect(err.status).toBe(401)
    });

    const req = httpMock.expectOne(r => r.url.includes('/login'));
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('isAuthenticated() devuelve false si no hay token', () => {
    localStorage.removeItem('token');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('isAuthenticated() devuelve true si hay token', () => {
    localStorage.setItem('token', 'test-token');
    expect(service.isAuthenticated()).toBeTrue();
    localStorage.removeItem('token');
  });

  it('getUserType() devuelve el tipo de usuario guardado', () => {
    localStorage.setItem('userType', 'admin');
    expect(service.getUserType()).toBe('admin');
    localStorage.removeItem('userType');
  });
});