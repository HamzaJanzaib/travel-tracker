import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { basename, join } from 'path';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadAvatar(
    userId: number,
    file: { filename: string },
    host: string,
    protocol: string,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, avatarUrl: true },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (existingUser.avatarUrl) {
      this.deleteLocalAvatar(existingUser.avatarUrl);
    }

    const avatarUrl = `${protocol}://${host}/uploads/avatars/${file.filename}`;
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: { id: true, email: true, name: true, avatarUrl: true },
    });

    return {
      message: 'Avatar uploaded successfully',
      user,
    };
  }

  async getAvatar(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, avatarUrl: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { avatarUrl: user.avatarUrl };
  }

  async removeAvatar(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, avatarUrl: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.avatarUrl) {
      this.deleteLocalAvatar(user.avatarUrl);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
    });

    return { message: 'Avatar removed successfully' };
  }

  private deleteLocalAvatar(avatarUrl: string) {
    const marker = '/uploads/avatars/';
    const markerIndex = avatarUrl.indexOf(marker);
    if (markerIndex === -1) {
      return;
    }

    const fileName = basename(avatarUrl.slice(markerIndex + marker.length));
    const filePath = join(process.cwd(), 'uploads', 'avatars', fileName);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}
