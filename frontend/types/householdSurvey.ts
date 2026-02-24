export interface HouseholdSurvey {
  _id?: string;
  householdId?: string;
  slum?: any;
  houseDoorNo?: string;
  // New parcel-based fields
  parcelId?: string;
  propertyNo?: number;
  source?: 'CREATED' | 'IMPORTED';
  surveyor?: any;
  surveyStatus?: string;
  submittedAt?: string;

  // SECTION I: General Information
  slumName?: string;
  ward?: string;

  // SECTION II: Household Level General Information
  headName?: string;
  fatherName?: string;
  sex?: string;
  caste?: string;
  religion?: string;
  minorityStatus?: string;
  femaleHeadStatus?: string;

  // Family Members Count
  familyMembersMale?: number;
  familyMembersFemale?: number;
  familyMembersTotal?: number;

  // Illiterate Adult Members
  illiterateAdultMale?: number;
  illiterateAdultFemale?: number;
  illiterateAdultTotal?: number;

  // Children Not Attending School (6-14 years)
  childrenNotAttendingMale?: number;
  childrenNotAttendingFemale?: number;
  childrenNotAttendingTotal?: number;

  // Handicapped Persons
  handicappedPhysically?: number;
  handicappedMentally?: number;
  handicappedTotal?: number;

  // Economic Status
  femaleEarningStatus?: string;
  belowPovertyLine?: string;
  bplCard?: string;

  // SECTION III: Housing & Infrastructure
  landTenureStatus?: string;
  houseStructure?: string;
  roofType?: string;
  flooringType?: string;
  houseLighting?: string;
  cookingFuel?: string;

  // Water & Sanitation
  waterSource?: string;
  waterSupplyDuration?: string;
  waterSourceDistance?: string;
  toiletFacility?: string;
  bathroomFacility?: string;
  roadFrontType?: string;

  // SECTION IV: Education & Health Facilities
  preschoolType?: string;
  primarySchoolType?: string;
  highSchoolType?: string;
  healthFacilityType?: string;
  welfareBenefits?: string[];
  consumerDurables?: string[];
  livestock?: string[];

  // SECTION V: Migration Details
  yearsInTown?: string;
  migrated?: string;
  migratedFrom?: string;
  migrationType?: string;
  migrationReasons?: string[];

  // SECTION VI: Income & Expenditure
  earningAdultMale?: number;
  earningAdultFemale?: number;
  earningAdultTotal?: number;
  earningNonAdultMale?: number;
  earningNonAdultFemale?: number;
  earningNonAdultTotal?: number;
  monthlyIncome?: number;
  monthlyExpenditure?: number;
  debtOutstanding?: number;

  // Additional Information
  notes?: string;

  // Survey Metadata
  submittedBy?: any;
  lastModifiedBy?: any;
  lastModifiedAt?: string;

  [key: string]: any; // Allow additional properties
}