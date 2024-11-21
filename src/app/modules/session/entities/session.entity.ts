import { BaseModel } from "@root/src/database/base.model";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Calendar } from "../../calendars/entities/calendar.entity";
import { Month } from "../../month/entities/month.entity";

@Entity()
export class Session extends BaseModel {
    @Column({ type: 'varchar', length: 255 })
    name: string;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @Column({ type: 'uuid' })
    calendarId: string;
  
    @ManyToOne(() => Calendar, { onDelete: 'CASCADE' })
    calendar: Calendar;
  
    @Column({ type: 'timestamp' })
    startDate: Date;
  
    @Column({ type: 'timestamp' })
    endDate: Date;
  
    @Column({ type: 'boolean', default: true })
    active: boolean;
  
    @Column({ type: 'uuid' })
    tenantId: string;
    @OneToMany(() => Month, (month) => month.session)
    months: Month[];
}
