import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { User } from '../../users/entities/user.entity';
import { BranchRequestStatus } from '../enum/Branch-request-status.enum';
import { Branch } from '../../branchs/entities/branch.entity';

@Entity()
export class BranchRequest extends BaseModel {
  //   @ManyToOne(() => User, (user) => user.branchRequests, { nullable: false })
  //   user: User;
  @Column({ length: 500, type: 'varchar' })
  userId: string;

  @ManyToOne(() => Branch, (branch) => branch.currentRequests)
  @JoinColumn({ name: 'currentBranchId' })
  currentBranch: Branch;

  @ManyToOne(() => Branch, (branch) => branch.requestedRequests)
  @JoinColumn({ name: 'requestBranchId' })
  requestBranch: Branch;

  @Column()
  currentBranchId: string;

  @Column()
  requestBranchId: string;

  @Column({ type: 'varchar', nullable: true })
  approvalType: string;

  @Column({
    type: 'enum',
    enum: BranchRequestStatus,
    default: BranchRequestStatus.PENDING,
  })
  status: BranchRequestStatus;

  @Column({ type: 'varchar', nullable: true })
  approvalWorkflowId: string;

  @Column({ type: 'uuid', nullable: true })
  tenantId: string;
}
