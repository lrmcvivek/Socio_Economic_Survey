export interface HouseholdSurvey {
  _id?: string;
  householdId?: string;
  slum?: any;
  houseDoorNo?: string;
  surveyor?: any;
  surveyStatus?: string;
  familyMembersMale?: number;
  familyMembersFemale?: number;
  familyMembersTotal?: number;
  submittedAt?: string;
  [key: string]: any; // Allow additional properties
}