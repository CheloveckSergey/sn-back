import { PostUserLike } from "src/likes/likes.model"

export interface CreatePostUserDto {
  description: string | undefined,
}

export type Author = {
  name: string,
  avatar: string,
}

export type PostResDto = {
  author: Author,
  id: number,
  description: string | undefined,
  image: string | undefined,
  likes: PostUserLike[],
}