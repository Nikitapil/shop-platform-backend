import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/RegisterDto';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  @ApiOperation({ summary: 'Register user' })
  // TODO add api response DTO
  // @ApiResponse({ status: 201, type: ReturnGeneratedQuizDto })
  @Post('/register')
  register(@Body() dto: RegisterDto) {
    return dto;
  }
}
