import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, OneToMany } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { CreateWorkScheduleDetailDto } from '../dto/create-work-schedule-detail.dto';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';

@Entity()
export class WorkSchedule extends BaseModel {
  @Column({ length: 255, type: 'varchar' })
  name: string;
  @Column({ type: 'json', nullable: true })
  detail: CreateWorkScheduleDetailDto[];

  @Column({ type: 'uuid', nullable: true })
  tenantId: string;
  @OneToMany(() => Organization, (org) => org.workSchedule)
  organizations: Organization[];

  @OneToMany(
    () => EmployeeJobInformation,
    (employeeJobInformation) => employeeJobInformation.branch,
  )
  employeeJobInformation: EmployeeJobInformation;
}
