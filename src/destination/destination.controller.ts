import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Destination')
@Controller('destination')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a destination' })
  @ApiBody({ type: CreateDestinationDto })
  @ApiOkResponse({ description: 'Destination created successfully' })
  create(@Request() req, @Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationService.create(createDestinationDto , req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all destinations for current user' })
  @ApiOkResponse({ description: 'Destinations fetched successfully' })
  findAll(@Request() req) {
    return this.destinationService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a destination by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Destination fetched successfully' })
  findOne(@Param('id') id: string , @Request() req) {
    return this.destinationService.findOne(+id , req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a destination by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateDestinationDto })
  @ApiOkResponse({ description: 'Destination updated successfully' })
  update(@Param('id') id: string, @Body() updateDestinationDto: UpdateDestinationDto) {
    return this.destinationService.update(+id, updateDestinationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a destination by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Destination removed successfully' })
  remove(@Param('id') id: string) {
    return this.destinationService.remove(+id);
  }
  
}
