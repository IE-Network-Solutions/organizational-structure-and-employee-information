import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
} from 'typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Organization } from '../../organizations/entities/organization.entity';
import { Injectable } from '@nestjs/common';
import { Branch } from '../entities/branch.entity';
import { Department } from '../../departments/entities/department.entity';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';

@EventSubscriber()
@Injectable()
export class BranchSubscriber implements EntitySubscriberInterface<Branch> {
  listenTo() {
    return Branch;
  }
  async afterSoftRemove(event: SoftRemoveEvent<Branch>) {
    const departmentRepository: Repository<Department> =
      event.connection.getRepository(Department);
    if (event.entity.deletedAt) {
      await departmentRepository.update(
        { branchId: event.entity.id },
        { branchId: null },
      );
    }
  }

  async afterBranchSoftRemoveFromEmployeeJobInformation(
    event: SoftRemoveEvent<Branch>,
  ) {
    const employeeJobInformationRepository: Repository<EmployeeJobInformation> =
      event.connection.getRepository(EmployeeJobInformation);
    if (event.entity.deletedAt) {
      await employeeJobInformationRepository.update(
        { branchId: event.entity.id },
        { branchId: null },
      );
    }
  }
}
