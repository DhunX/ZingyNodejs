import { addHeaders } from '../../../../auth/authentication/mock';

import { mockPostFindByUrl, mockFindInfoWithTextById, POST_ID, POST_URL } from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';

describe('PostDetail by URL route', () => {
  beforeEach(() => {
    mockPostFindByUrl.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/post/url';

  it('Should send error when endpoint query is not passed', async () => {
    const response = await addHeaders(request.get(endpoint));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/endpoint/);
    expect(response.body.message).toMatch(/required/);
    expect(mockPostFindByUrl).not.toBeCalled();
  });

  it('Should send error when url endpoint is more that 200 chars', async () => {
    const param = new Array(201).fill('a').join('');
    const response = await addHeaders(request.get(endpoint).query({ endpoint: param }));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/length must/);
    expect(response.body.message).toMatch(/200/);
    expect(mockPostFindByUrl).not.toBeCalled();
  });

  it('Should send error when post do not exists for url', async () => {
    const response = await addHeaders(request.get(endpoint).query({ endpoint: 'xyz' }));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/do not exists/);
    expect(mockPostFindByUrl).toBeCalledTimes(1);
    expect(mockPostFindByUrl).toBeCalledWith('xyz');
  });

  it('Should send data when post exists for url', async () => {
    const response = await addHeaders(request.get(endpoint).query({ endpoint: POST_URL }));
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('_id');
    expect(mockPostFindByUrl).toBeCalledTimes(1);
    expect(mockPostFindByUrl).toBeCalledWith(POST_URL);
  });
});

describe('PostDetail by id route', () => {
  beforeEach(() => {
    mockFindInfoWithTextById.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/post/id/';

  it('Should send error when invalid id is passed', async () => {
    const response = await addHeaders(request.get(endpoint + 'abc'));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/invalid/);
    expect(mockFindInfoWithTextById).not.toBeCalled();
  });

  it('Should send error when post do not exists for id', async () => {
    const response = await addHeaders(request.get(endpoint + new Types.ObjectId().toHexString()));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/do not exists/);
    expect(mockFindInfoWithTextById).toBeCalledTimes(1);
  });

  it('Should send data when post exists for id', async () => {
    const response = await addHeaders(request.get(endpoint + POST_ID.toHexString()));
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('_id');
    expect(mockFindInfoWithTextById).toBeCalledTimes(1);
  });
});
