import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
} from 'typeorm';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { Nationality } from '../entities/nationality.entity';
import { EmployeeInformation } from '../../employee-information/entities/employee-information.entity';

@EventSubscriber()
@Injectable()
export class NationalitySubscriber
  implements EntitySubscriberInterface<Nationality>
{
  listenTo() {
    return Nationality;
  }
  async afterSoftRemove(event: SoftRemoveEvent<Nationality>) {
    const employeeInformationRepository: Repository<EmployeeInformation> =
      event.connection.getRepository(EmployeeInformation);
    if (event.entity.deletedAt) {
      await employeeInformationRepository.update(
        { nationalityId: event.entity.id },
        { nationalityId: null },
      );
    }
  }
}
