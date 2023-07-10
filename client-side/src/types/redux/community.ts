// Define state action
// interface FileMetadata {
//   name: string;
//   size: number;
//   type: string;
// }

export interface User {
  id: number;
  username: string;
  email: string;
}

interface CommunitySate {
  userProfile: File | null;
  userCommunity: number;
  communityName: string;
  inCommunityId: number;
  searchTerm: string;
  communityDescription: string;
  isCreateCommunityOpen: boolean;
  userData: User[];
  invitedUsers: User[];
}

const UpdateCommunityAction = "Community";

export default CommunitySate;
export { UpdateCommunityAction };
