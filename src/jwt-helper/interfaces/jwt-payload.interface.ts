import { JwtBearerScope } from '../jwt-helper.enum';

export interface JwtPayload {
  sub: string;
  scopes: JwtBearerScope[];
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  jti: string;
}
