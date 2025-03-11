import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Delegation extends BaseModel {
  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  delegatorId: string;

  @Column({ type: 'uuid' })
  leaveRequestId: string;

  @Column({ type: 'uuid' })
  delegateeId: string;

  @Column({ type: 'uuid' })
  leaveTypeId: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => User, { eager: true })
  delegator: User;

  @ManyToOne(() => User, { eager: true })
  delegatee: User;
}
