import { Injectable } from "@nestjs/common";
import * as uuid from 'uuid';
import * as path from 'path';
import { writeFile } from 'fs/promises';

export class MyImage {
  file: Express.Multer.File;
  name: string;

  constructor(file: Express.Multer.File) {
    this.file = file;
    this.name = uuid.v4() + '.jpg';
  }

  async save() {
    await writeFile(path.resolve('src', 'static', this.name), this.file.buffer);
  }
}

@Injectable()
export class ImageService {
  
  constructor() {}

  createMyImage(file: Express.Multer.File): MyImage {
    const image = new MyImage(file);
    return image;
  }
}