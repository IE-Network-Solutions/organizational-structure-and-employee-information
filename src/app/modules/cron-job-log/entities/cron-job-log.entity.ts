import { BaseModel } from "@root/src/database/base.model";
import { Column, Entity } from "typeorm";
import { ExecutionStatus } from "../enum/execution-status.enum";

@Entity()
export class CronJobLog extends BaseModel {
   
    @Column({ type: 'timestamp' })
    executionDate: Date;
  
    @Column({ type: 'uuid' })
    tenantId: string;
  
    @Column({ type: 'enum', enum: ExecutionStatus })
    status: ExecutionStatus;
  
    @Column({ type: 'text', nullable: true })
    message?: string;
}
