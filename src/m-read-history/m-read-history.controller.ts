import { Controller, Get, Param } from '@nestjs/common';
import { MReadHistoryService } from './m-read-history.service';

@Controller('m-read-history')
export class MReadHistoryController {

  constructor(private mReadHistoryService: MReadHistoryService) {}

}
