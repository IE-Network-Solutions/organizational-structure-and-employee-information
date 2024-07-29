// import { Pagination } from 'nestjs-typeorm-paginate';
// import { CreateUserDto } from '../dto/create-user.dto';

// export const userData = () => {
//   return {
//     id: '1',
//     name: 'Product 1',
//     email: 's@s.com',
//     contactInformation: JSON.stringify({
//       phone: '123-456-7890',
//       address: {
//         street: '123 Main St',
//         city: 'Anytown',
//         postalCode: '12345',
//       },
//     }),
//     createdAt: new Date('2022-10-22 07:11:42'),
//     updatedAt: new Date('2022-10-22 07:11:42'),
//   };
// };
// export const userDataSave = () => {
//   return {
//     id: '1',
//     name: 'Product 1',
//     email: 's@s.com',
//     roleId: '1',
//     contactInformation: JSON.stringify({
//       phone: '123-456-7890',
//       address: {
//         street: '123 Main St',
//         city: 'Anytown',
//         postalCode: '12345',
//       },
//     }),
//     createdAt: new Date('2022-10-22 07:11:42'),
//     updatedAt: new Date('2022-10-22 07:11:42'),
//     role: null,
//     userPermissions: [],
//   };
// };
// export const userDataOnFindOne = () => {
//   return {
//     id: '1',
//     name: 'Product 1',
//     email: 's@s.com',
//     roleId: '1',
//     contactInformation: JSON.stringify({
//       phone: '123-456-7890',
//       address: {
//         street: '123 Main St',
//         city: 'Anytown',
//         postalCode: '12345',
//       },
//     }),
//     createdAt: new Date('2022-10-22 07:11:42'),
//     updatedAt: new Date('2022-10-22 07:11:42'),
//     role: null,
//     userPermissions: [],
//     permissions: [],
//   };
// };

// export const createUserData = (): CreateUserDto => {
//   return {
//     name: 'Product 1',
//     email: 's@s.com',
//     roleId: '1',
//     contactInformation: JSON.stringify({
//       phone: '123-456-7890',
//       address: {
//         street: '123 Main St',
//         city: 'Anytown',
//         postalCode: '12345',
//       },
//     }),
//   };
// };

// export const deleteuserData = () => {
//   return {
//     raw: '',
//     affected: 1,
//     generatedMaps: [],
//   };
// };

// export const paginationResultUserData = (): Pagination<CreateUserDto> => {
//   return {
//     items: [userData()],
//     meta: {
//       totalItems: 1,
//       itemCount: 1,
//       itemsPerPage: 10,
//       totalPages: 1,
//       currentPage: 1,
//     },
//   };
// };

// export const updateUserData = () => {
//   return {
//     raw: [],
//     generatedMaps: [],
//     affected: 1,
//   };
// };

// export const deleteUserData = () => {
//   return {
//     raw: [],
//     affected: 1,
//     generatedMaps: [],
//   };
// };
