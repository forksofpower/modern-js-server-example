process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');
const passport = require('koa-passport');

const server = require('../../src/server/index');
const knex = require('../../src/server/db/connection');
const queries = require('../../src/server/db/queries/users');
const helpers = require('../../src/server/routes/_helpers');
const store = require('../../src/server/session');

describe('routes : auth - stubbed', () => {
  beforeEach(() => {
    this.ensureAuthenticated = sinon.stub(
      helpers, 'ensureAuthenticated'
    ).returns(() => {});
    this.ensureAdmin = sinon.stub(helpers, 'ensureAdmin');
    this.store = sinon.stub(store, 'set');
    this.authenticate = sinon.stub(passport, 'authenticate').returns(() => {});
    this.serialize = sinon.stub(passport, 'serializeUser').returns(() => {});
    this.deserialize = sinon.stub(passport, 'deserializeUser').returns(() => {});
  });

  afterEach(() => {
    this.authenticate.restore();
    this.serialize.restore();
    this.deserialize.restore();
    this.store.restore();
    this.ensureAuthenticated.restore();
    this.ensureAdmin.restore();
  });


  describe('GET /auth/register', () => {
    it('should render the register view', (done) => {
      chai.request(server)
        .get('/auth/register')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.type.should.eql('text/html');
          res.text.should.contain('<h1>Register</h1>');
          res.text.should.contain(
            '<p><button type="submit">Register</button></p>');
          done();
        });
    });
  });

  describe('POST /auth/register', () => {
    beforeEach(() => {
      const user = [
        {
          id: 1,
          username: 'patrick',
          password: 'something'
        }
      ];
      this.query = sinon.stub(queries, 'addUser').resolves(user);
      this.authenticate.yields(null, { id: 1 });
    });

    afterEach(() => {
      this.query.restore();
    });

    it('should register a new user', (done) => {
      chai.request(server)
        .post('/auth/register')
        .send({
          username: 'patrick',
          password: 'something'
        })
        .end((err, res) => {
          res.redirects[0].should.contain('/auth/status');
          done();
        });
    });
  });

  describe('GET /auth/login', () => {
    beforeEach(() => {
      this.ensureAuthenticated.returns(false);
    });
    it('should render the login view if a user is not logged in', (done) => {
      chai.request(server)
        .get('/auth/login')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.type.should.eql('text/html');
          res.text.should.contain('<h1>Login</h1>');
          res.text.should.contain('<p><button type="submit">Log In</button></p>');
          done();
        })
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(() => {
      this.authenticate.yields(null, {id: 1});
      this.serialize.yields(null, {id: 1});
      this.deserialize.yields(null, {id: 1});
    });

    it('should login a user', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'patrick',
          password: 'something'
        })
        .end((err, res) => {
          res.redirects[0].should.contain('/auth/status');
          done();
        });
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(() => {
      this.authenticate.yields(null, false);
    });
    it('should not login a user if password is incorrect', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'patrick',
          password: 'wrongpass'
        })
        .end((err, res) => {
          // should.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(400);
          res.type.should.eql('application/json');
          res.body.status.should.eql('error');
          done();
        });
    });
  });

  describe('GET /auth/login', () => {
    beforeEach(() => {
      this.ensureAuthenticated.returns(true);
    });
    it('should render the status view if the user is logged in', (done) => {
      chai.request(server)
        .get('/auth/login')
        .end((err, res) => {
          should.not.exist(err);
          // console.log('redirects', res.redirects);
          // res.redirects.length.should.eql(0);
          res.redirects[0].should.contain('/auth/status');
          res.status.should.eql(200);
          res.type.should.eql('text/html');
          res.text.should.contain('<p>You are authenticated.</p>');
          done();
        });
    });
  });

  describe('GET /auth/status', () => {
    beforeEach(() => {
      this.ensureAuthenticated.returns(true);
    });
    afterEach(() => {
      this.ensureAuthenticated.restore();
    });
    it('should render the status view', (done) => {
      chai.request(server)
        .get('/auth/status')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.type.should.eql('text/html');
          res.text.should.contain('<p>You are authenticated.</p>');
          done();
        });
    });
  });

  describe('GET /auth/admin', () => {
    beforeEach(() => {
      this.ensureAdmin.resolves(true);
    });
    it('should render the admin view if an admin user is logged in', (done) => {
      chai.request(server)
        .get('/auth/admin')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.type.should.eql('text/html');
          res.text.should.contain('<p>You are an admin!</p>');
          done();
        });
    });
  });

  describe('GET /auth/admin', () => {
    beforeEach(() => {
      this.ensureAdmin.resolves(false);
      this.ensureAuthenticated.returns(false);
    });
    it('should redirect to /auth/login if a user is not logged in', (done) => {
      chai.request(server)
        .get('/auth/admin')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects[0].should.contain('/auth/login');
          res.status.should.eql(200);
          res.type.should.eql('text/html');
          res.text.should.contain('<h1>Login</h1>');
          res.text.should.contain('<p><button type="submit">Log In</button></p>');
          done();
        });
    });
  });

  describe('GET /auth/admin', () => {
    beforeEach(() => {
      this.ensureAdmin.resolves(false);
      this.ensureAuthenticated.returns(true);
    });
    it('should redirect to /auth/status if a user is logged in but not an admin', (done) => {
      chai.request(server)
        .get('/auth/admin')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(2);
          res.redirects[0].should.contain('/auth/login');
          res.redirects[1].should.contain('/auth/status');
          res.status.should.eql(200);
          res.type.should.eql('text/html');
          res.text.should.contain('<p>You are authenticated.</p>');
          done();
        });
    });
  });
});