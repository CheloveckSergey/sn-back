type CreateAuthorReq = {
  name: string,
  avatar?: string | undefined,
  authorType: 'group' | 'user',
  authorId: number,
}