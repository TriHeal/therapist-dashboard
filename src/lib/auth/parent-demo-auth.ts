export const PARENT_DEMO_PROFILE_KEY = "triheal_parent_demo_profile";

export type ParentDemoProfile = {
  parentId: string;
  patient: {
    id: string;
    displayName: string;
    age: number;
    avatarUrl: string | null;
  };
};
