import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, ManyToOne } from 'typeorm';
import { WorkSchedule } from '../../work-schedules/entities/work-schedule.entity';
import { Calendar } from '../../calendars/entities/calendar.entity';
import { OrganizationFile } from '../../organization-files/entities/organization-file.entity';

@Entity()
export class Organization extends BaseModel {
  @Column({ type: 'uuid', nullable: true })
  workScheduleId: string;
  @Column({ type: 'uuid', nullable: true })
  calendarId: string;
  @Column({ type: 'uuid' })
  tenantId: string;
  @ManyToOne(() => WorkSchedule, (schedule) => schedule.organizations, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  workSchedule: WorkSchedule;
  @ManyToOne(() => Calendar, (cal) => cal.organizations, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  calendar: Calendar;

  @ManyToOne(() => OrganizationFile, (file) => file.organizations, {})
  organizationFile: OrganizationFile;
}
