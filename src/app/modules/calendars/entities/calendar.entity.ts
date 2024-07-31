import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, OneToMany } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { CreateClosedDatesDto } from '../dto/create-closed-dates.dto';

@Entity()
export class Calendar extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;
  @Column({ type: 'date' })
  startDate: Date;
  @Column({ type: 'date' })
  endDate: Date;
  @Column({ type: 'json', nullable: true })
  closedDates: [CreateClosedDatesDto];
  @Column({ length: 500, type: 'varchar' })
  description: string;
  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @OneToMany(() => Organization, (cal) => cal.calendar)
  organizations: Organization[];
}
