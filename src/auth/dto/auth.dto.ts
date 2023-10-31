import { Author } from "src/author/author.model";
import { Roles } from "src/roles/roles.model";

export interface AuthDto {
  id: number,
  login: string,
  tokens: Tokens,
  avatar: string | undefined | null,
  author: Author,
}

export interface Tokens {
  accessToken: string,
  refreshToken: string,
}

export interface RefreshDto {
  id: number,
  login: string,
  refreshToken: string,
}

export type Payload = {
  id: number,
  login: string,
  roles: Roles[],
}