import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, OneToMany } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { CreateClosedDatesDto } from '../dto/create-closed-dates.dto';
import { Session } from '../../session/entities/session.entity';

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
  @Column({ length: 500, type: 'varchar', nullable: true })
  description: string;
  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @OneToMany(() => Organization, (cal) => cal.calendar)
  organizations: Organization[];
  @OneToMany(() => Session, (cal) => cal.calendar)
  sessions: Session[];
}
