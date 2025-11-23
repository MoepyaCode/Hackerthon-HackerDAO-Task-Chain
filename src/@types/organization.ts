export interface Organization {
  id: string;
  name: string;
  githubOrgId: string;
  githubOrgName: string;
  adminUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Repository {
  id: string;
  organizationId: string;
  githubRepoId: string;
  githubRepoName: string;
  isActive: boolean;
  createdAt: Date;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: MemberRole;
  joinedAt: Date;
}

export enum MemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}
