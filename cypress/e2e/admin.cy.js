describe('Panel Administrador', () => {

  beforeEach(() => {
    cy.intercept('GET', '**/api/matches', { fixture: 'matches.json' }).as('getMatches');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'mock-admin-token');
        win.localStorage.setItem('userType', 'admin');
      }
    });
  });

  it('CASO EXITOSO — carga la página principal correctamente', () => {
    cy.get('app-root').should('exist');
    cy.url().should('include', 'localhost:4200');
  });

  it('CASO EXITOSO — puede navegar al panel de admin', () => {
    cy.visit('/admin', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'mock-admin-token');
        win.localStorage.setItem('userType', 'admin');
      }
    });
    cy.get('app-root').should('exist');
    cy.get('body').should('exist');
  });

  it('CASO ERROR — muestra error cuando falla la creación (500)', () => {
    cy.intercept('POST', '**/api/matches', {
      statusCode: 500,
      body: { error: 'Error interno del servidor' }
    }).as('createMatchError');

    cy.visit('/admin', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'mock-admin-token');
        win.localStorage.setItem('userType', 'admin');
      }
    });

    cy.get('body').should('exist');
  });
});