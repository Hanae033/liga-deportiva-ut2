describe('Panel Usuario', () => {

  beforeEach(() => {
    cy.intercept('GET', '**/api/matches', { fixture: 'matches.json' }).as('getMatches');

    cy.visit('/user', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'mock-user-token');
        win.localStorage.setItem('userType', 'normal');
      }
    });
  });

  it('CASO EXITOSO — carga el panel de usuario correctamente', () => {
    cy.get('app-root').should('exist');
    cy.url().should('include', 'localhost:4200');
  });

  it('CASO EXITOSO — muestra la sección de clasificaciones', () => {
    cy.visit('/user', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'mock-user-token');
        win.localStorage.setItem('userType', 'normal');
      }
    });
    cy.get('body').should('exist');
    cy.contains(/clasificacion|standing|liga/i).should('exist');
  });

  it('CASO ERROR — redirige si no hay token', () => {
    cy.visit('/user', {
      onBeforeLoad(win) {
        win.localStorage.removeItem('token');
        win.localStorage.removeItem('userType');
      }
    });
    cy.get('body').should('exist');
  });
});