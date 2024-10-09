import { MigrationInterface, QueryRunner } from "typeorm";

export class PepMigration1728471158349 implements MigrationInterface {
    name = 'PepMigration1728471158349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nationality" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "name" character varying(500), "tenantId" character varying, CONSTRAINT "PK_ec4111a2e9f11d6b69312e4a77f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "name" character varying NOT NULL, "description" character varying NOT NULL, "tenantId" character varying, CONSTRAINT "PK_b1372c1e0a14c1b45ab7cce7857" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "userId" uuid, "permissionId" uuid, "tenantId" character varying, "deligationId" character varying, CONSTRAINT "PK_a7326749e773c740a7104634a77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, "permissionGroupId" uuid, CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name"), CONSTRAINT "UQ_3379e3b123dac5ec10734b8cc86" UNIQUE ("slug"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "roleId" uuid, "permissionId" uuid, "tenantId" character varying, CONSTRAINT "PK_96c8f1fd25538d3692024115b47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, "tenantId" character varying, CONSTRAINT "UQ_1ce4dbd84e964f37be2aaa27a23" UNIQUE ("slug", "tenantId"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "name" character varying(500) NOT NULL, "description" character varying(500), "branchId" uuid, "tenantId" uuid NOT NULL, "level" integer NOT NULL, "parentId" uuid, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "branch" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "name" character varying(500) NOT NULL, "description" character varying(500) NOT NULL, "location" character varying(500) NOT NULL, "contactNumber" character varying, "contactEmail" character varying, "tenantId" uuid, CONSTRAINT "PK_2e39f426e2faefdaa93c5961976" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "calendar" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "name" character varying(500) NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "closedDates" json, "description" character varying(500), "tenantId" uuid NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_2492fb846a48ea16d53864e3267" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "workScheduleId" uuid, "calendarId" uuid, "tenantId" uuid NOT NULL, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "name" character varying(255) NOT NULL, "detail" json NOT NULL, "tenantId" uuid, CONSTRAINT "PK_ef53f40c47a666ad8cf8c988003" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employement_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "name" character varying(500), "tenantId" character varying, CONSTRAINT "PK_11841edbea5e2fb2baf105173c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "offboarding_employee_task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "title" character varying(255) NOT NULL, "description" text, "isCompleted" boolean NOT NULL DEFAULT false, "completedDate" TIMESTAMP, "tenantId" character varying, "employeTerminationId" uuid, "approverId" uuid, CONSTRAINT "PK_3838d95b3eae976472e508c3f70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_termination" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "reason" character varying NOT NULL, "type" character varying(500) NOT NULL, "eligibleForRehire" character varying(500) NOT NULL, "comment" character varying, "jobInformationId" uuid, "userId" uuid NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "effectiveDate" TIMESTAMP, "tenantId" uuid, CONSTRAINT "REL_dd64c3e0b8e7a0d6e29e3088a8" UNIQUE ("jobInformationId"), CONSTRAINT "PK_2bd96cd8fe323a6817522ced4f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_job_information" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "jobTitle" character varying, "userId" uuid, "branchId" uuid, "isPositionActive" boolean NOT NULL DEFAULT true, "effectiveStartDate" TIMESTAMP, "effectiveEndDate" TIMESTAMP, "employementTypeId" uuid, "departmentId" uuid, "departmentLeadOrNot" boolean, "workScheduleId" uuid, "tenantId" character varying, CONSTRAINT "PK_021b89481176e5c67f5eb4c7980" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "offboarding_tasks_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "title" character varying(255) NOT NULL, "description" text, "approverId" uuid, "tenantId" uuid, CONSTRAINT "PK_c7d50756f93e17e3f3e4090bc3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "firstName" character varying(500) NOT NULL, "middleName" character varying(500), "lastName" character varying(500) NOT NULL, "profileImage" character varying, "profileImageDownload" character varying, "email" character varying(50) NOT NULL, "roleId" uuid, "tenantId" character varying, "firebaseId" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_information" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "userId" uuid, "gender" character varying, "maritalStatus" character varying, "dateOfBirth" TIMESTAMP, "joinedDate" TIMESTAMP, "nationalityId" uuid, "addresses" json, "emergencyContact" json, "bankInformation" json, "additionalInformation" json, "tenantId" character varying, CONSTRAINT "REL_7f16fe09544a6f0d42d5d756ca" UNIQUE ("userId"), CONSTRAINT "PK_d105d2dd8699c55e00a0df5ab7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_document" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "userId" uuid, "documentName" character varying, "documentLink" character varying, "employeeInformationId" uuid, CONSTRAINT "PK_3d42008c12e986e37ee3bdebbd2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_information_form" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "formTitle" character varying(500), "form" json, "tenantId" character varying, CONSTRAINT "PK_90c2239768f5222ae8f6a7814b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_f74940bae8b56b4a236d4cd744e" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1064ab8229f1b6209dbd90eaed" ON "department_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_ccad6720dcf2b6705ca99a00d5" ON "department_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "user_permission" ADD CONSTRAINT "FK_deb59c09715314aed1866e18a81" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_permission" ADD CONSTRAINT "FK_a592f2df24c9d464afd71401ff6" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permission" ADD CONSTRAINT "FK_29b093b202d3ae3e37438ce158c" FOREIGN KEY ("permissionGroupId") REFERENCES "permission_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3130a39c1e4a740d044e685730" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_72e80be86cab0e93e67ed1a7a9a" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_c50480cad914f9afa0c5213c76c" FOREIGN KEY ("parentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_a44bcea55f11d1502fc11e39fe7" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_7a1151a4a84426360d98ca7299c" FOREIGN KEY ("workScheduleId") REFERENCES "work_schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_d5a6a12465d7e7de964e897d43b" FOREIGN KEY ("calendarId") REFERENCES "calendar"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "offboarding_employee_task" ADD CONSTRAINT "FK_cd999eb7d5f89a8300b5846ac99" FOREIGN KEY ("employeTerminationId") REFERENCES "employee_termination"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offboarding_employee_task" ADD CONSTRAINT "FK_5cec0a3846c5f6b7de910379873" FOREIGN KEY ("approverId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_termination" ADD CONSTRAINT "FK_dd64c3e0b8e7a0d6e29e3088a89" FOREIGN KEY ("jobInformationId") REFERENCES "employee_job_information"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_termination" ADD CONSTRAINT "FK_a53c15cbd6824b03fd675dee328" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_job_information" ADD CONSTRAINT "FK_c4d0438bb1c9f8805489ff5ce0a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_job_information" ADD CONSTRAINT "FK_1dcad9ca84b4c6a1c76fd9c130f" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_job_information" ADD CONSTRAINT "FK_ceb96cfae6d5ae44a0c34cdb0a8" FOREIGN KEY ("employementTypeId") REFERENCES "employement_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_job_information" ADD CONSTRAINT "FK_b8c7caf04c03261f1640bcd52e9" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_job_information" ADD CONSTRAINT "FK_dde40bf5e45132b44760a00a444" FOREIGN KEY ("workScheduleId") REFERENCES "work_schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offboarding_tasks_template" ADD CONSTRAINT "FK_5eb5c60a3a1a01fdbf9a8a82569" FOREIGN KEY ("approverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_information" ADD CONSTRAINT "FK_e82fffa686f23de6d5733f15c66" FOREIGN KEY ("nationalityId") REFERENCES "nationality"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_information" ADD CONSTRAINT "FK_7f16fe09544a6f0d42d5d756ca0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_document" ADD CONSTRAINT "FK_49981a00c43f6546b24168ea3b6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_document" ADD CONSTRAINT "FK_b10c5652d5fc6fb3ac75976e2e6" FOREIGN KEY ("employeeInformationId") REFERENCES "employee_information"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department_closure" ADD CONSTRAINT "FK_1064ab8229f1b6209dbd90eaed3" FOREIGN KEY ("id_ancestor") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department_closure" ADD CONSTRAINT "FK_ccad6720dcf2b6705ca99a00d5f" FOREIGN KEY ("id_descendant") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "department_closure" DROP CONSTRAINT "FK_ccad6720dcf2b6705ca99a00d5f"`);
        await queryRunner.query(`ALTER TABLE "department_closure" DROP CONSTRAINT "FK_1064ab8229f1b6209dbd90eaed3"`);
        await queryRunner.query(`ALTER TABLE "employee_document" DROP CONSTRAINT "FK_b10c5652d5fc6fb3ac75976e2e6"`);
        await queryRunner.query(`ALTER TABLE "employee_document" DROP CONSTRAINT "FK_49981a00c43f6546b24168ea3b6"`);
        await queryRunner.query(`ALTER TABLE "employee_information" DROP CONSTRAINT "FK_7f16fe09544a6f0d42d5d756ca0"`);
        await queryRunner.query(`ALTER TABLE "employee_information" DROP CONSTRAINT "FK_e82fffa686f23de6d5733f15c66"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "offboarding_tasks_template" DROP CONSTRAINT "FK_5eb5c60a3a1a01fdbf9a8a82569"`);
        await queryRunner.query(`ALTER TABLE "employee_job_information" DROP CONSTRAINT "FK_dde40bf5e45132b44760a00a444"`);
        await queryRunner.query(`ALTER TABLE "employee_job_information" DROP CONSTRAINT "FK_b8c7caf04c03261f1640bcd52e9"`);
        await queryRunner.query(`ALTER TABLE "employee_job_information" DROP CONSTRAINT "FK_ceb96cfae6d5ae44a0c34cdb0a8"`);
        await queryRunner.query(`ALTER TABLE "employee_job_information" DROP CONSTRAINT "FK_1dcad9ca84b4c6a1c76fd9c130f"`);
        await queryRunner.query(`ALTER TABLE "employee_job_information" DROP CONSTRAINT "FK_c4d0438bb1c9f8805489ff5ce0a"`);
        await queryRunner.query(`ALTER TABLE "employee_termination" DROP CONSTRAINT "FK_a53c15cbd6824b03fd675dee328"`);
        await queryRunner.query(`ALTER TABLE "employee_termination" DROP CONSTRAINT "FK_dd64c3e0b8e7a0d6e29e3088a89"`);
        await queryRunner.query(`ALTER TABLE "offboarding_employee_task" DROP CONSTRAINT "FK_5cec0a3846c5f6b7de910379873"`);
        await queryRunner.query(`ALTER TABLE "offboarding_employee_task" DROP CONSTRAINT "FK_cd999eb7d5f89a8300b5846ac99"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_d5a6a12465d7e7de964e897d43b"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_7a1151a4a84426360d98ca7299c"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_a44bcea55f11d1502fc11e39fe7"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_c50480cad914f9afa0c5213c76c"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_72e80be86cab0e93e67ed1a7a9a"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3130a39c1e4a740d044e685730"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP CONSTRAINT "FK_29b093b202d3ae3e37438ce158c"`);
        await queryRunner.query(`ALTER TABLE "user_permission" DROP CONSTRAINT "FK_a592f2df24c9d464afd71401ff6"`);
        await queryRunner.query(`ALTER TABLE "user_permission" DROP CONSTRAINT "FK_deb59c09715314aed1866e18a81"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ccad6720dcf2b6705ca99a00d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1064ab8229f1b6209dbd90eaed"`);
        await queryRunner.query(`DROP TABLE "department_closure"`);
        await queryRunner.query(`DROP TABLE "employee_information_form"`);
        await queryRunner.query(`DROP TABLE "employee_document"`);
        await queryRunner.query(`DROP TABLE "employee_information"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "offboarding_tasks_template"`);
        await queryRunner.query(`DROP TABLE "employee_job_information"`);
        await queryRunner.query(`DROP TABLE "employee_termination"`);
        await queryRunner.query(`DROP TABLE "offboarding_employee_task"`);
        await queryRunner.query(`DROP TABLE "employement_type"`);
        await queryRunner.query(`DROP TABLE "work_schedule"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "calendar"`);
        await queryRunner.query(`DROP TABLE "branch"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "role_permission"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "user_permission"`);
        await queryRunner.query(`DROP TABLE "permission_group"`);
        await queryRunner.query(`DROP TABLE "nationality"`);
    }

}
