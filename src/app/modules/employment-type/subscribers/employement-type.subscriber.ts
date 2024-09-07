import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
} from 'typeorm';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { EmployementType } from '../entities/employement-type.entity';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';

@EventSubscriber()
@Injectable()
export class EmployeeTypeSubscriber
  implements EntitySubscriberInterface<EmployementType> {
  listenTo() {
    return EmployementType;
  }
  async afterEmployementTypeSoftRemoveFromEmployeeJobInformation(
    event: SoftRemoveEvent<EmployementType>,
  ) {
    const employeeJobInformationRepository: Repository<EmployeeJobInformation> =
      event.connection.getRepository(EmployeeJobInformation);
    if (event.entity.deletedAt) {
      await employeeJobInformationRepository.update(
        { employementTypeId: event.entity.id },
        { employementTypeId: null },
      );
    }
  }
}
