import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
  InsertEvent,
} from 'typeorm';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { EmployeeInformation } from '../entities/employee-information.entity';
import { EmployeeDocument } from '../../employee-documents/entities/employee-documents.entity';

@EventSubscriber()
@Injectable()
export class EmployeeInformationSubscriber
  implements EntitySubscriberInterface<EmployeeInformation>
{
  listenTo() {
    return EmployeeInformation;
  }
  async afterEmployeeInformationSoftRemoveFromEmployeeDocument(
    event: SoftRemoveEvent<EmployeeInformation>,
  ) {
    const employeeInformationRepository: Repository<EmployeeDocument> =
      event.connection.getRepository(EmployeeDocument);
    if (event.entity.deletedAt) {
      await employeeInformationRepository.update(
        { employeeInformationId: event.entity.id },
        { employeeInformationId: null },
      );
    }
  }

  async beforeInsert(event: InsertEvent<EmployeeInformation>) {
    const userRepository: Repository<EmployeeInformation> =
      event.connection.getRepository(EmployeeInformation);
    if (!event.entity.employeeAttendanceId) {
      const tenantId = event.entity.tenantId;
      const maxUser = await userRepository
        .createQueryBuilder('employeeInformation')
        .select('MAX(employeeInformation.employeeAttendanceId)', 'max')
        .where('employeeInformation.tenantId = :tenantId', { tenantId })
        .getRawOne();
      event.entity.employeeAttendanceId = maxUser.max ? maxUser.max + 1 : 1;
    }
  }
}
