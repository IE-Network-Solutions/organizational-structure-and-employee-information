import { Organization } from "../../organizations/entities/organization.entity";

// Mock data for OrganizationFile entity
export const mockOrganizationFileCreateData = {
    files: ['file1.pdf', 'file2.docx'], // Example file names
    tenantId: 'd5b88156-1d93-4c99-b6c5-a6e15c3b6f36', // Mock UUID
  };
  
  export const mockOrganizationFileUpdateData = {
    files: ['file1.pdf', 'file3.xlsx'], // Updated file list
  };
  
  export const mockOrganizationFile = {
    id: 'a8e5c4ad-bf9b-41f6-8dc1-2b0ec7326fc7', // Mocked ID
    createdAt: new Date('2024-01-01T00:00:00Z'), // Mocked timestamp
    updatedAt: new Date('2024-01-02T00:00:00Z'), // Mocked timestamp
    files: ['file1.pdf', 'file2.docx'], // Initial file list
    tenantId: 'd5b88156-1d93-4c99-b6c5-a6e15c3b6f36', // Mock tenant ID
    organizations: [] as Organization[],
  };
  