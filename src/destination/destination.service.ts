import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DestinationService {
  constructor(private prisma: PrismaService,
  ) { }

  async create(createDestinationDto: CreateDestinationDto, userId: number) {
    const { name, travelDate, notes, location } = createDestinationDto;
    const parsedTravelDate = this.parseTravelDate(travelDate);

    const destination = await this.prisma.destination.create({
      data: {
        name,
        travelDate: parsedTravelDate,
        notes,
        location,
        userId,
      },
    });

    return destination;
  }

  private parseTravelDate(travelDate: string): Date {
    const normalizedDate = travelDate.includes('T')
      ? travelDate
      : `${travelDate}T00:00:00.000Z`;

    const parsedDate = new Date(normalizedDate);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        'travelDate must be a valid ISO-8601 date or datetime',
      );
    }

    return parsedDate;
  }

  async findAll(userId: number) {
    return this.prisma.destination.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: number , userId: number) {
    const destination = await this.prisma.destination.findUnique({
      where: {
        id,
        userId,
      },
    });
    if (!destination) {
      throw new BadRequestException('Destination not found');
    }
    return destination;
  }

  async update(id: number, updateDestinationDto: UpdateDestinationDto) {
    const destination = await this.prisma.destination.findUnique({
      where: {
        id,
      },
    });

    if (!destination) {
      throw new BadRequestException('Destination not found');
    }

    const { travelDate, ...rest } = updateDestinationDto;
    const data = {
      ...rest,
      ...(travelDate ? { travelDate: this.parseTravelDate(travelDate) } : {}),
    };

    return this.prisma.destination.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: number) {
    const destination = await this.prisma.destination.findUnique({
      where: {
        id,
      },
    });

    if (!destination) {
      throw new BadRequestException('Destination not found');
    }

    return this.prisma.destination.delete({
      where: {
        id,
      },
    });
  }
}
