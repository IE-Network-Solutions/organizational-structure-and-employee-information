import { BaseModel } from '@root/src/database/base.model';
import { AfterSoftRemove, Column, Entity, OneToMany } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { CreateWorkScheduleDetailDto } from '../dto/create-work-schedule-detail.dto';

@Entity()
export class WorkSchedule extends BaseModel {
  @Column({ length: 255, type: 'varchar' })
  name: string;
  @Column({ type: 'json' })
  detail: CreateWorkScheduleDetailDto[];
  @Column({ type: 'int' })
  standardHours: number;

  @Column({ type: 'uuid' })
  tenantId: string;
  @OneToMany(() => Organization, (org) => org.workSchedule)
  organizations: Organization[];
}
