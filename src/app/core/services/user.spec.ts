import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user';

const MOCK_USERS = [
  { _id: '1', username: 'hanane', userType: 'admin' },
  { _id: '2', username: 'pepe',   userType: 'normal' }
];

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service  = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('getUsers() debe devolver lista de usuarios via GET', () => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users[0].username).toBe('hanane');
    });

    const req = httpMock.expectOne(r => r.url.includes('/users'));
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_USERS);
  });

  it('getUserById() debe hacer GET por id', () => {
    service.getUserById('1').subscribe(user => {
      expect(user.username).toBe('hanane');
    });

    const req = httpMock.expectOne(r => r.url.includes('/users/1'));
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_USERS[0]);
  });

  it('updateUser() debe hacer PUT', () => {
    service.updateUser('1', { username: 'hanane2' }).subscribe(res => {
      expect(res.username).toBe('hanane2');
    });

    const req = httpMock.expectOne(r => r.url.includes('/users/1'));
    expect(req.request.method).toBe('PUT');
    req.flush({ _id: '1', username: 'hanane2' });
  });

  it('deleteUser() debe hacer DELETE', () => {
    service.deleteUser('1').subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(r => r.url.includes('/users/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'deleted' });
  });
});
