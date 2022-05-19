import { Tokens } from 'app-request';
import { AuthFailureError, InternalError } from '../core/ApiError';
import JWT, { JwtPayload } from '../core/JWT';
import { Types } from 'mongoose';
import User from '../database/model/User';
import { tokenInfo } from '../config';

export const getAccessToken = (authorization?: string) => {
  if (!authorization) throw new AuthFailureError('Invalid Authorization');
  if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Authorization');
  return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
  if (!payload) throw new AuthFailureError('Invalid Access Token!! - PL');
  if (!payload.iss) throw new AuthFailureError('Invalid Access Token!! - ISS');
  if (!payload.sub) throw new AuthFailureError('Invalid Access Token!! - SUB');
  if (!payload.aud) throw new AuthFailureError('Invalid Access Token!! - AUD');
  if (!payload.prm) throw new AuthFailureError('Invalid Access Token!! - PRM');
  if (payload.iss !== tokenInfo.issuer) throw new AuthFailureError('Invalid Access Token!! - !ISS');
  if (payload.aud !== tokenInfo.audience)
    throw new AuthFailureError('Invalid Access Token!! - !AUD');
  if (!Types.ObjectId.isValid(payload.sub))
    throw new AuthFailureError('Invalid Access Token!! - !SUB');
  return true;
};

export const createTokens = async (
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<Tokens> => {
  const accessToken = await JWT.encode(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      accessTokenKey,
      tokenInfo.accessTokenValidityDays,
    ),
  );

  if (!accessToken) throw new InternalError();

  const refreshToken = await JWT.encode(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      refreshTokenKey,
      tokenInfo.refreshTokenValidityDays,
    ),
  );

  if (!refreshToken) throw new InternalError();

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  } as Tokens;
};
