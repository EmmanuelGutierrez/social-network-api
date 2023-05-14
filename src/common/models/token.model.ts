import { roles } from '../constants/roles.enum';

export interface tokenI extends jwtData {
  role: roles;
  email: string;
  id: string;
}

export interface jwtData {
  iat: number;
  exp: number;
}
