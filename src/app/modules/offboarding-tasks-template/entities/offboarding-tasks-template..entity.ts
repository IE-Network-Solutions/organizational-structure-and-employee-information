import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseModel } from '@root/src/database/base.model';

@Entity()
export class OffboardingTasksTemplate extends BaseModel {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  approverId: string;

  @OneToMany(() => User, (user) => user.offboardingTasksTemplate)
  approver: User;

  @Column({ type: 'uuid', nullable: true })
  tenantId: string | null;
}
