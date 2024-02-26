import { Injectable } from "@nestjs/common";
import * as uuid from 'uuid';
import * as path from 'path';
import { writeFile } from 'fs/promises';

export class MyMusic {
  file: Express.Multer.File;
  name: string;

  constructor(file: Express.Multer.File) {
    this.file = file;
    this.name = uuid.v4() + '.mp3';
  }

  async save() {
    await writeFile(path.resolve('src', 'static', 'music', this.name), this.file.buffer);
  }
}

@Injectable()
export class MusicService {
  
  constructor() {}

  createMyImage(file: Express.Multer.File): MyMusic {
    const image = new MyMusic(file);
    return image;
  }
}