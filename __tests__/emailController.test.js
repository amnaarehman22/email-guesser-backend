const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { handleDeriveEmail } = require('../controllers/emailController');

const app = express();
app.use(bodyParser.json());
app.post('/api/derive-email', handleDeriveEmail);

describe('POST /api/derive-email', () => {
  it('should return emails for valid input', async () => {
    const response = await request(app)
      .post('/api/derive-email')
      .send({ fullName: 'Jane Doe', domain: 'babbel.com' });

    expect(response.status).toBe(200);
    expect(response.body.emails).toEqual(expect.arrayContaining(['janedoe@babbel.com', 'jdoe@babbel.com']));
  });

  it('should handle missing domain', async () => {
    const response = await request(app)
      .post('/api/derive-email')
      .send({ fullName: 'Jane Doe' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Both full name and company domain are required.');
  });

  it('should handle missing full name', async () => {
    const response = await request(app)
      .post('/api/derive-email')
      .send({ domain: 'babbel.com' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Both full name and company domain are required.');
  });

  it('should handle company domain not found', async () => {
    const response = await request(app)
      .post('/api/derive-email')
      .send({ fullName: 'Jane Doe', domain: 'unknown.com' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Company domain not found in our data.');
  });
});
