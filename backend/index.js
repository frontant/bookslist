import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import jsonServer from 'json-server';

const port = process.env.REACT_APP_BACKEND_PORT;
const secret = 'topSecret';
const user = 'test';
const password = 'test';
const dataJson = 'data.json';

if(!port) {
  throw new Error('REACT_APP_BACKEND_PORT is undefined');
}

const server = express();

server.use(express.json());
server.use(cors());

server.post('/login', (req, res, next) => {
  if(req.body.user === user && req.body.password === password) {
    res.send(
      jwt.sign(
        { user: req.body.user },
        secret,
        { expiresIn: '1800s' }
      )
    );
  }
});

server.use('/', (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, secret);
    next();
  } catch(error) {
    res.sendStatus(403);
  }
});

server.use('/', jsonServer.router(dataJson));

server.listen(port, () => {
  console.log(`Server is listening to http://localhost:${port}`);
});
