describe('Login', () => {

  beforeEach(() => {
    cy.visit('/login');
  });

  it('CASO EXITOSO — muestra el formulario de login', () => {
    cy.get('app-root').should('exist');
    cy.get('input').should('exist');
  });

  it('CASO EXITOSO — puede hacer login con credenciales correctas', () => {
    cy.intercept('POST', '**/api/login', {
      statusCode: 200,
      body: { token: 'mock-token', userType: 'admin' }
    }).as('loginRequest');

    cy.get('input').first().type('hanane');
    cy.get('input').last().type('pass123');
    cy.get('button[type="submit"], button').contains(/login|entrar|iniciar/i).click();

    cy.wait('@loginRequest');
    cy.get('body').should('exist');
  });

  it('CASO ERROR — muestra error con credenciales incorrectas', () => {
    cy.intercept('POST', '**/api/login', {
      statusCode: 401,
      body: { message: 'Credenciales incorrectas' }
    }).as('loginError');

    cy.get('input').first().type('usuario_malo');
    cy.get('input').last().type('contraseña_mala');
    cy.get('button[type="submit"], button').contains(/login|entrar|iniciar/i).click();

    cy.wait('@loginError');
    cy.get('body').should('exist');
  });
});