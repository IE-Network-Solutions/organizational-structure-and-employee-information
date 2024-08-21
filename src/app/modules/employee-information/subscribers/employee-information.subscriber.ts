import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
} from 'typeorm';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { EmployeeInformation } from '../entities/employee-information.entity';
import { EmployeeDocument } from '../../employee-documents/entities/employee-documents.entity';

@EventSubscriber()
@Injectable()
export class EmployeeInformationSubscriber implements EntitySubscriberInterface<EmployeeInformation> {
  listenTo() {
    return EmployeeInformation;
  }
  async afterEmployeeInformationSoftRemoveFromEmployeeDocument(event: SoftRemoveEvent<EmployeeInformation>) {
    const employeeInformationRepository: Repository<EmployeeDocument> =
      event.connection.getRepository(EmployeeDocument);
    if (event.entity.deletedAt) {
      await employeeInformationRepository.update(
        { employeeInformationId: event.entity.id },
        { userId: null },
      );
    }
  }
}