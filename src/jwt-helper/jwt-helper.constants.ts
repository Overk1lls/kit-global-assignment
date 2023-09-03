import { JwtBearerScope } from './jwt-helper.enum';

export const JwtBearerScopeDescriptions: Readonly<Record<JwtBearerScope, string>> = {
  [JwtBearerScope.ExercisesCreate]: 'For Access Token. Scope to create exercises',
  [JwtBearerScope.ExercisesRead]: 'For Access Token. Scope to read exercises',
  [JwtBearerScope.ExercisesUpdate]: 'For Access Token. Scope to update exercises',
  [JwtBearerScope.ExercisesDelete]: 'For Access Token. Scope to delete exercises',
  [JwtBearerScope.ProjectsCreate]: 'For Access Token. Scope to create projects',
  [JwtBearerScope.ProjectsRead]: 'For Access Token. Scope to read projects',
  [JwtBearerScope.ProjectsUpdate]: 'For Access Token. Scope to update projects',
  [JwtBearerScope.ProjectsDelete]: 'For Access Token. Scope to delete projects',
  [JwtBearerScope.TokenRefresh]: 'For Refresh Token. Scope to refresh token.',
};

export const jwtScopeStrings = Object.values(JwtBearerScope);
export const fullAccessScopes = Object.values(JwtBearerScope).filter((s) => s !== JwtBearerScope.TokenRefresh);
export const exerciseScopes = Object.values(JwtBearerScope).filter((s) => s.startsWith('exercises'));
export const projectScopes = Object.values(JwtBearerScope).filter((s) => s.startsWith('projects'));

export const jwtAudience = 'users';
export const jwtAlgorithm = 'HS512';
export const jwtIssuer = 'Kit Global';
export const jwtAccessTokenTTL = '24h';
export const jwtRefreshTokenTTL = '180d';
