import { addAuthHeaders } from '../../../../auth/authentication/mock';

// this import should be below authentication/mock to override for role validation to work
import { WRITER_ACCESS_TOKEN } from '../../../../auth/authorization/mock';

import {
  POST_ID,
  POST_URL,
  POST_ID_2,
  mockPostCreate,
  mockPostFindUrlIfExists,
  mockFindPostAllDataById,
  mockPostUpdate,
} from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';

describe('Writer post create routes', () => {
  beforeEach(() => {
    mockPostCreate.mockClear();
    mockPostFindUrlIfExists.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/writer/post';

  it('Should send error if the user do have writer role', async () => {
    const response = await addAuthHeaders(request.post(endpoint));
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/permission denied/i);
    expect(mockPostFindUrlIfExists).not.toBeCalled();
    expect(mockPostCreate).not.toBeCalled();
  });

  it('Should send error if post title not sent', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        description: 'description',
        text: 'text',
        postUrl: 'postUrl',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/title/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockPostFindUrlIfExists).not.toBeCalled();
    expect(mockPostCreate).not.toBeCalled();
  });

  it('Should send error if post description not sent', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        text: 'text',
        postUrl: 'postUrl',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/description/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockPostFindUrlIfExists).not.toBeCalled();
    expect(mockPostCreate).not.toBeCalled();
  });

  it('Should send error if post text not sent', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        postUrl: 'postUrl',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/text/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockPostFindUrlIfExists).not.toBeCalled();
    expect(mockPostCreate).not.toBeCalled();
  });

  it('Should send error if post postUrl not sent', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/postUrl/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockPostFindUrlIfExists).not.toBeCalled();
    expect(mockPostCreate).not.toBeCalled();
  });

  it('Should send error if post postUrl is not in accepted format', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
        postUrl: 'https://abc.com/xyz',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/postUrl/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockPostFindUrlIfExists).not.toBeCalled();
    expect(mockPostCreate).not.toBeCalled();
  });

  it('Should send error if post imgUrl is not an url', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
        postUrl: 'postUrl',
        imgUrl: 'abc',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/imgUrl/i);
    expect(response.body.message).toMatch(/valid uri/i);
    expect(mockPostFindUrlIfExists).not.toBeCalled();
    expect(mockPostCreate).not.toBeCalled();
  });

  it('Should send error if post score is invalid', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
        postUrl: 'postUrl',
        score: 'abc',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/must be a number/i);
    expect(mockPostFindUrlIfExists).not.toBeCalled();
    expect(mockPostCreate).not.toBeCalled();
  });

  it('Should send error if post tags is invalid', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
        postUrl: 'postUrl',
        tags: 'abc',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/must be/i);
    expect(response.body.message).toMatch(/array/i);
    expect(mockPostFindUrlIfExists).not.toBeCalled();
    expect(mockPostCreate).not.toBeCalled();
  });

  it('Should send error if post already exists for postUrl', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
        postUrl: POST_URL,
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/already exists/i);
    expect(mockPostFindUrlIfExists).toBeCalledTimes(1);
    expect(mockPostCreate).not.toBeCalled();
  });

  it('Should send success if post data is correct', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
        postUrl: 'postUrl',
        imgUrl: 'https://abc.com/xyz',
        score: 0.01,
        tags: ['ABC'],
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/created success/i);
    expect(mockPostFindUrlIfExists).toBeCalledTimes(1);
    expect(mockPostCreate).toBeCalledTimes(1);
    expect(response.body.data).toMatchObject({ _id: POST_ID.toHexString() });
  });
});

describe('Writer post submit routes', () => {
  beforeEach(() => {
    mockFindPostAllDataById.mockClear();
    mockPostUpdate.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/writer/post/submit/';

  it('Should send error if submit post id is not valid', async () => {
    const response = await addAuthHeaders(request.put(endpoint + 'abc'), WRITER_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockFindPostAllDataById).not.toBeCalled();
    expect(mockPostUpdate).not.toBeCalled();
  });

  it('Should send error if submit post do not exist for id', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + new Types.ObjectId().toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exists/i);
    expect(mockFindPostAllDataById).toBeCalledTimes(1);
    expect(mockPostUpdate).not.toBeCalled();
  });

  it('Should send success if submit post for id exists', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + POST_ID.toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/submitted success/i);
    expect(mockFindPostAllDataById).toBeCalledTimes(1);
    expect(mockPostUpdate).toBeCalledTimes(1);
  });
});

describe('Writer post withdraw routes', () => {
  beforeEach(() => {
    mockFindPostAllDataById.mockClear();
    mockPostUpdate.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/writer/post/withdraw/';

  it('Should send error if withdraw post id is not valid', async () => {
    const response = await addAuthHeaders(request.put(endpoint + 'abc'), WRITER_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockFindPostAllDataById).not.toBeCalled();
    expect(mockPostUpdate).not.toBeCalled();
  });

  it('Should send error if withdraw post do not exist for id', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + new Types.ObjectId().toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exists/i);
    expect(mockFindPostAllDataById).toBeCalledTimes(1);
    expect(mockPostUpdate).not.toBeCalled();
  });

  it('Should send success if withdraw post for id exists', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + POST_ID.toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/withdrawn success/i);
    expect(mockFindPostAllDataById).toBeCalledTimes(1);
    expect(mockPostUpdate).toBeCalledTimes(1);
  });
});

describe('Writer post delete routes', () => {
  beforeEach(() => {
    mockFindPostAllDataById.mockClear();
    mockPostUpdate.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/writer/post/id/';

  it('Should send error if deleting post id is not valid', async () => {
    const response = await addAuthHeaders(request.delete(endpoint + 'abc'), WRITER_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockFindPostAllDataById).not.toBeCalled();
    expect(mockPostUpdate).not.toBeCalled();
  });

  it('Should send error if deleting post do not exist for id', async () => {
    const response = await addAuthHeaders(
      request.delete(endpoint + new Types.ObjectId().toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exists/i);
    expect(mockFindPostAllDataById).toBeCalledTimes(1);
    expect(mockPostUpdate).not.toBeCalled();
  });

  it('Should send success if deleting post for id exists', async () => {
    const response = await addAuthHeaders(
      request.delete(endpoint + POST_ID.toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/deleted success/i);
    expect(mockFindPostAllDataById).toBeCalledTimes(1);
    expect(mockPostUpdate).toBeCalledTimes(1);
  });
});

describe('Writer post get by id routes', () => {
  beforeEach(() => {
    mockFindPostAllDataById.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/writer/post/id/';

  it('Should send error if fetching post id is not valid', async () => {
    const response = await addAuthHeaders(request.get(endpoint + 'abc'), WRITER_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockFindPostAllDataById).not.toBeCalled();
  });

  it('Should send error if fetching post do not exist for id', async () => {
    const response = await addAuthHeaders(
      request.get(endpoint + new Types.ObjectId().toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exists/i);
    expect(mockFindPostAllDataById).toBeCalledTimes(1);
  });

  it('Should send error if author is different', async () => {
    const response = await addAuthHeaders(
      request.get(endpoint + POST_ID_2.toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/don't have/i);
    expect(response.body.message).toMatch(/permission/i);
    expect(mockFindPostAllDataById).toBeCalledTimes(1);
  });

  it('Should send success if fetching post for id exists', async () => {
    const response = await addAuthHeaders(
      request.get(endpoint + POST_ID.toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/i);
    expect(mockFindPostAllDataById).toBeCalledTimes(1);
    expect(response.body.data).toMatchObject({ _id: POST_ID.toHexString() });
  });
});
