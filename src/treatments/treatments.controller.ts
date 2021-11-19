import { BadRequestException, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Treatment } from './treatment.entity';
import { TreatmentsService } from './treatments.service';

@ApiTags('treatments')
@Crud({
  model: {
    type: Treatment,
  },
})
@Controller('treatments')
export class TreatmentsController implements CrudController<Treatment> {
  constructor(public service: TreatmentsService) {}

  get base(): CrudController<Treatment> {
    return this;
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Treatment,
  ) {
    return await this.base.createOneBase(req, dto).catch((err) => {
      throw new BadRequestException(err.message);
    });
  }
}
