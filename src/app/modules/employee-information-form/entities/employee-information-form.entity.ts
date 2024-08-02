// employee-information-form.entity.ts

import { BaseModel } from '../../../../database/base.model';
import { Entity, Column } from 'typeorm';

@Entity()
export class EmployeeInformationForm extends BaseModel {
  @Column({ length: 500, type: 'varchar', nullable: true })
  formTitle: string;

  @Column('json', { nullable: true })
  form: Array<{ id: string; fieldName: string; fieldType: string; isActive: boolean }>;

  @Column({ nullable: true })
  tenantId: string;

  //   @ManyToOne(() => Tenant, tenant => tenant.employeeInformationForm)
  //   tenant: Tenant;
}

