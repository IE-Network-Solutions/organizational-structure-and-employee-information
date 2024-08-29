// import {
//   EventSubscriber,
//   EntitySubscriberInterface,
//   SoftRemoveEvent,
// } from 'typeorm';
// import { Repository } from 'typeorm';
// import { Injectable } from '@nestjs/common';
// import { User } from '../../users/entities/user.entity';
// import { OffboardingTasksTemplate } from '../entities/offboarding-tasks-template..entity';

// @EventSubscriber()
// @Injectable()
// export class OffboardingTasksTemplateSubscriber
//   implements EntitySubscriberInterface<OffboardingTasksTemplate> {

//   listenTo() {
//     return OffboardingTasksTemplate;
//   }

//   async afterSoftRemove(event: SoftRemoveEvent<OffboardingTasksTemplate>) {
//     const userRepository: Repository<User> =
//       event.connection.getRepository(User);
//     if (event.entity.deletedAt) {
//       await userRepository.update(
//         { id: event.entity.approverId },
//         { roleId: null },
//       );
//     }
//   }
// }
