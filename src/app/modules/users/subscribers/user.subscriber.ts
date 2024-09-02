import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
} from 'typeorm';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { EmployeeInformation } from '../../employee-information/entities/employee-information.entity';
import { EmployeeDocument } from '../../employee-documents/entities/employee-documents.entity';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';

@EventSubscriber()
@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }
  async afterUserSoftRemoveFromEmployeeInformation(
    event: SoftRemoveEvent<User>,
  ) {
    const employeeInformationRepository: Repository<EmployeeInformation> =
      event.connection.getRepository(EmployeeInformation);
    if (event.entity.deletedAt) {
      await employeeInformationRepository.softRemove(
        { userId: event.entity.id },

      );
    }
  }

  async afterUserSoftRemoveFromEmployeeDocument(event: SoftRemoveEvent<User>) {
    const employeeDocumentRepository: Repository<EmployeeDocument> =
      event.connection.getRepository(EmployeeDocument);
    if (event.entity.deletedAt) {
      await employeeDocumentRepository.softRemove(
        { userId: event.entity.id },
      );
    }
  }

  async afterUserSoftRemoveFromEmployeeJobInformation(
    event: SoftRemoveEvent<User>,
  ) {
    const employeeJobInformationRepository: Repository<EmployeeJobInformation> =
      event.connection.getRepository(EmployeeJobInformation);
    if (event.entity.deletedAt) {
      await employeeJobInformationRepository.softRemove(
        { userId: event.entity.id },
      );
      await employeeJobInformationRepository.update(
        { userId: event.entity.id },
        { isPositionActive: false }
      );
    }
  }
}
