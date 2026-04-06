/// <reference types="multer" />
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  UnprocessableEntityException,
  ParseFilePipeBuilder,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import { mkdirSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import type { Request } from 'express';

const avatarUploadPath = join(process.cwd(), 'uploads', 'avatars');

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('avatar')
  @ApiOperation({ summary: 'Upload or replace current user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiOkResponse({ description: 'Avatar uploaded successfully' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          mkdirSync(avatarUploadPath, { recursive: true });
          callback(null, avatarUploadPath);
        },
        filename: (_req, file, callback) => {
          const fileExt = extname(file.originalname);
          callback(null, `${Date.now()}-${randomUUID()}${fileExt}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadAvatar(
    @Req() req: Request & { user: { userId: number } },
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new UnprocessableEntityException(
        'Only JPEG, PNG, WEBP, and GIF images are allowed',
      );
    }

    return this.uploadService.uploadAvatar(
      req.user.userId,
      file,
      req.get('host') ?? 'localhost:3000',
      req.protocol,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('avatar')
  @ApiOperation({ summary: 'Get current user avatar URL' })
  @ApiOkResponse({ description: 'Current avatar URL returned' })
  getAvatar(@Req() req: Request & { user: { userId: number } }) {
    return this.uploadService.getAvatar(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete('avatar')
  @ApiOperation({ summary: 'Remove current user avatar' })
  @ApiOkResponse({ description: 'Avatar removed successfully' })
  removeAvatar(@Req() req: Request & { user: { userId: number } }) {
    return this.uploadService.removeAvatar(req.user.userId);
  }
}
