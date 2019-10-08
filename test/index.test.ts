import app from '../src/index';
import request from 'supertest';

describe('Happy path', async () => {

  const agent = request.agent(app);
  let cookie: string;
  let token: string;

  it("Attempt to clean database", async () => {
    agent
      .delete('/dev/AllUsers')
      .expect(200)
  });

  it('should POST register', async () => {
    agent
      .post('/auth/register')
      .send({
        email: "JaneDoe@hotmail.com",
        password: "password"
      });
  });

  it('should POST login', async () => {
    agent
      .post('/auth/login').send({
        email: "JaneDoe@hotmail.com",
        password: "password"
      })
      .expect('set-cookie', /connect.sid/)
      .expect(200)
      .end((err, res) => {
        cookie = res.header['set-cookie'];
        token = res.body.info.token;
        if (err) return err;
      });
  });

  it('should GET user', async () => {
    let call = agent.get('/auth/user');
    call.set('Cookie', cookie);
    call.set('Authorization', token)
      .expect(200)
  });

  it('should log the user out', async () => {
    let call = agent.post('/auth/logout');
    call.set('Cookie', cookie);
    call.set('Authorization', token)
      .expect(200)
  });

});