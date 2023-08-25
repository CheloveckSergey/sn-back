export interface AuthDto {
  id: number,
  login: string,
  tokens: Tokens,
  avatar: string | undefined | null,
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