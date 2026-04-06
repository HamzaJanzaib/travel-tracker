import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';


@Controller('destination')
@UseGuards(JwtAuthGuard) 
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) {}

  @Post()
  create(@Request() req, @Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationService.create(createDestinationDto , req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.destinationService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string , @Request() req) {
    return this.destinationService.findOne(+id , req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDestinationDto: UpdateDestinationDto) {
    return this.destinationService.update(+id, updateDestinationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.destinationService.remove(+id);
  }
  
}
