import { Injectable } from "@nestjs/common";
import * as uuid from 'uuid';
import { writeFile } from "fs/promises";
import * as path from "path";

@Injectable()
export class FileService {

  constructor() {}

  async filterFile(file: Express.Multer.File) {
    const fileName = uuid.v4() + '.jpg';
    await writeFile(path.resolve('src', 'static', fileName), file.buffer);
    return {message: 'Ну вроде нормал'};
  }
}