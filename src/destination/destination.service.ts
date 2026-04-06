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

  findAll() {
    return `This action returns all destination`;
  }

  findOne(id: number) {
    return `This action returns a #${id} destination`;
  }

  update(id: number, updateDestinationDto: UpdateDestinationDto) {
    return `This action updates a #${id} destination`;
  }

  remove(id: number) {
    return `This action removes a #${id} destination`;
  }
}
