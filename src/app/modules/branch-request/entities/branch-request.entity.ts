import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class BranchRequest extends BaseModel {
  //   @ManyToOne(() => User, (user) => user.branchRequests, { nullable: false })
  //   user: User;
  @Column({ length: 500, type: 'varchar' })
  userId: string;

  @Column({ length: 500, type: 'varchar' })
  currentBranchId: string;

  @Column({ length: 500, type: 'varchar' })
  requestBranchId: string;

  @Column({ type: 'varchar', nullable: true })
  approvalType: string;

  @Column({ type: 'varchar', nullable: true })
  approvalWorkflowId: string;

  @Column({ type: 'uuid', nullable: true })
  tenantId: string;
}
