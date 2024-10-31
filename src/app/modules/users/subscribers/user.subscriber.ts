import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
  InsertEvent,
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
  async afterSoftRemove(event: SoftRemoveEvent<User>) {
    const employeeJobInformationRepository: Repository<EmployeeJobInformation> =
      event.connection.getRepository(EmployeeJobInformation);

    if (event.entity.deletedAt) {
      const jobInfo = await employeeJobInformationRepository.find({
        where: { userId: event.entity.id },
      });
      for (const job of jobInfo) {
        await employeeJobInformationRepository.softRemove(job);
      }
      await employeeJobInformationRepository.update(
        { userId: event.entity.id },
        { isPositionActive: false },
      );

      const employeeDocumentRepository: Repository<EmployeeDocument> =
        event.connection.getRepository(EmployeeDocument);
      const employeeDocument = await employeeDocumentRepository.find({
        where: { userId: event.entity.id },
      });
      for (const document of employeeDocument) {
        await employeeDocumentRepository.softRemove(document);
      }

      const employeeInformationRepository: Repository<EmployeeInformation> =
        event.connection.getRepository(EmployeeInformation);
      const employeeInformation = await employeeInformationRepository.find({
        where: { userId: event.entity.id },
      });
      for (const information of employeeInformation) {
        await employeeInformationRepository.softRemove(information);
      }
    }
  }

 
}