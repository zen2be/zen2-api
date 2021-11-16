import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
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
}
