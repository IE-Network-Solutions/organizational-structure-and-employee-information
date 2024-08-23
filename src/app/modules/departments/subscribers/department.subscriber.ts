import { Injectable } from "@nestjs/common";
import { EntitySubscriberInterface, EventSubscriber, Repository, SoftRemoveEvent } from "typeorm";
import { Department } from "../entities/department.entity";
import { EmployeeJobInformation } from "../../employee-job-information/entities/employee-job-information.entity";

@EventSubscriber()
@Injectable()
export class DeparmentSubscriber implements EntitySubscriberInterface<Department> {
  listenTo() {
    return Department;
  }
  async afterDepartmentSoftRemoveFromEmployeeJobInformation(event: SoftRemoveEvent<Department>) {
    const employeeJobInformationRepository: Repository<EmployeeJobInformation> =
      event.connection.getRepository(EmployeeJobInformation);
    if (event.entity.deletedAt) {
      await employeeJobInformationRepository.update(
        { departmentId: event.entity.id },
        { departmentId: null },
      );
    }
  }
}
