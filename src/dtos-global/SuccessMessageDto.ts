import { ApiProperty } from '@nestjs/swagger';

export class SuccessMessageDto {
  @ApiProperty({ description: 'message about success response', type: String })
  message = 'success' as const;
}
