import { Controller, Get, Header, Res, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { IsPublic } from '@/_core/decorators/isPulic.decorator';

@Controller('v1/file')
export class FileController {
  @Get()
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  @IsPublic()
  getFile(@Res() res: Response) {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    file.pipe(res);

    return new StreamableFile(file);
  }
}
