"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SurveyorLayout from "@/components/SurveyorLayout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Checkbox from '@/components/Checkbox';
import Stepper from '@/components/Stepper';
import BackNavigationDialog from '@/components/BackNavigationDialog';
import EditConfirmationDialog from '@/components/EditConfirmationDialog';
import apiService from '@/services/api';
import { useToast } from '@/components/Toast';

interface SlumSurveyForm {
  slumId: string;
  surveyed: boolean;
  completionPercentage?: number;
  
  // PART-A: I. GENERAL INFORMATION -CITY/TOWN
  stateCode?: string; // 1(a)
  stateName?: string; // 1(b)
  districtCode?: string; // 2(a)
  districtName?: string; // 2(b)
  cityTownCode?: string; // 3(a)
  cityTownName?: string; // 3(b)
  cityTown?: string; // 4(a)
  cityTownNoHouseholds?: number; // 4(b)
  
  // PART-B: II. CITY/TOWN SLUM PROFILE
  slumType?: string; // 5 - Notified / Non-Notified / New Identified
  slumIdField?: string; // 6 - Slum ID
  slumName?: string; // 7 - Slum Name
  ownershipLand?: string; // 8 - Local Body -01, State Government - 02, Central Government – 03, Private -04, Other - 05
  areaSqMtrs?: number; // 9 - Area in sq Mtrs
  slumPopulation?: number; // 10 - Slum population
  noSlumHouseholds?: number; // 11 - No. of slum House Holds
  bplPopulation?: number; // 12 - BPL(Below Poverty Line) population
  noBplHouseholdsCityTown?: number; // 13 - No. of BPL House Holds
  
  // PART-C: III. PARTICULARS OF SURVEY OPERATION
  surveyorName?: string; // 7 - Name
  surveyDate?: string; // 8(a) - Date(s) of Survey
  receiptQuestionnaireDate?: string; // 8(b) - Date(s) of Receipt of Questionnaire
  scrutinyDate?: string; // 8(c) - Date(s) of Scrutiny
  receiptByNodalCellDate?: string; // 8(d) - Date(s) of Receipt by Nodal Cell in Urban Local Body
  remarksInvestigator?: string; // 10 - Remarks by Investigator/Surveyor
  commentsSupervisor?: string; // 11 - Comments by the Supervisor
  
  // PART-D: I. BASIC INFORMATION ON SLUM
  slumNameBasicInfo?: string; // 1 - Name of Slum
  slumCode?: string; // 1a - Slum Code
  locationWard?: string; // 2 - Location - Ward No/Name
  ageSlumYears?: number; // 3 - Age of Slum in Years
  areaSlumSqMtrs?: number; // 4 - Area of Slum (Sq. metres)
  locationCoreOrFringe?: string; // 5 - Whether located in Core City/Town or Fringe area (Core City/Town - 01, Fringe Area -02)
  typeAreaSurrounding?: string; // 6 - Type of Area surrounding Slum (Residential - 01, Industrial - 02, Commercial - 03, Institutional-04, Other-49)
  physicalLocationSlum?: string; // 7 - Physical Location of Slum (Along Nallah -01, Along Other Drains - 02, etc.)
  isSlumNotified?: string; // 8 - Is the Slum Notified/Declared? (Yes-01, No-02)
  yearOfNotification?: number; // 9 - If Yes (01) in 8, state Year of Notification
  
  // PART-E: II. LAND STATUS
  ownershipLandDetail?: string; // 10 - Ownership of Land where Slum is located (Public: Local Body -01, State Government - 02, etc.)
  ownershipLandSpecify?: string; // 11 - Please specify Ownership of Land (To whom land belongs)
  
  // PART-F: III. DEMOGRAPHIC PROFILE
  // 12. Population & Health: 
  totalPopulationSlum?: number;
  totalPopulationSlumSC?: number;
  totalPopulationSlumST?: number;
  totalPopulationSlumOBC?: number;
  totalPopulationSlumOthers?: number;
  totalPopulationSlumTotal?: number;
  totalPopulationSlumMinorities?: number;
  
  bplPopulationSlum?: number;
  bplPopulationSlumSC?: number;
  bplPopulationSlumST?: number;
  bplPopulationSlumOBC?: number;
  bplPopulationSlumOthers?: number;
  bplPopulationSlumTotal?: number;
  bplPopulationSlumMinorities?: number;
  
  noHouseholdsSlum?: number;
  noHouseholdsSlumSC?: number;
  noHouseholdsSlumST?: number;
  noHouseholdsSlumOBC?: number;
  noHouseholdsSlumOthers?: number;
  noHouseholdsSlumTotal?: number;
  noHouseholdsSlumMinorities?: number;
  
  noBplHouseholdsSlum?: number;
  noBplHouseholdsSC?: number;
  noBplHouseholdsST?: number;
  noBplHouseholdsOBC?: number;
  noBplHouseholdsOthers?: number;
  noBplHouseholdsTotal?: number;
  noBplHouseholdsMinorities?: number;
  
  noWomenHeadedHouseholds?: number;
  noWomenHeadedHouseholdsSC?: number;
  noWomenHeadedHouseholdsST?: number;
  noWomenHeadedHouseholdsOBC?: number;
  noWomenHeadedHouseholdsOthers?: number;
  noWomenHeadedHouseholdsTotal?: number;
  noWomenHeadedHouseholdsMinorities?: number;
  
  noPersonsOlder65?: number;
  noPersonsOlder65SC?: number;
  noPersonsOlder65ST?: number;
  noPersonsOlder65OBC?: number;
  noPersonsOlder65Others?: number;
  noPersonsOlder65Total?: number;
  noPersonsOlder65Minorities?: number;
  
  noChildLabourers?: number;
  noChildLabourersSC?: number;
  noChildLabourersST?: number;
  noChildLabourersOBC?: number;
  noChildLabourersOthers?: number;
  noChildLabourersTotal?: number;
  noChildLabourersMinorities?: number;
  
  noPhysicallyChallenged?: number;
  noPhysicallyChallengedSC?: number;
  noPhysicallyChallengedST?: number;
  noPhysicallyChallengedOBC?: number;
  noPhysicallyChallengedOthers?: number;
  noPhysicallyChallengedTotal?: number;
  noPhysicallyChallengedMinorities?: number;
  
  noMentallyChallenged?: number;
  noMentallyChallengedSC?: number;
  noMentallyChallengedST?: number;
  noMentallyChallengedOBC?: number;
  noMentallyChallengedOthers?: number;
  noMentallyChallengedTotal?: number;
  noMentallyChallengedMinorities?: number;
  
  noPersonsHivaids?: number;
  noPersonsHivaidsSC?: number;
  noPersonsHivaidsST?: number;
  noPersonsHivaidsOBC?: number;
  noPersonsHivaidsOthers?: number;
  noPersonsHivaidsTotal?: number;
  noPersonsHivaidsMinorities?: number;
  
  noPersonsTuberculosis?: number;
  noPersonsTuberculosisSC?: number;
  noPersonsTuberculosisST?: number;
  noPersonsTuberculosisOBC?: number;
  noPersonsTuberculosisOthers?: number;
  noPersonsTuberculosisTotal?: number;
  noPersonsTuberculosisMinorities?: number;
  
  noPersonsRespiratory?: number;
  noPersonsRespiratorySC?: number;
  noPersonsRespiratoryST?: number;
  noPersonsRespiratoryOBC?: number;
  noPersonsRespiratoryOthers?: number;
  noPersonsRespiratoryTotal?: number;
  noPersonsRespiratoryMinorities?: number;
  
  noPersonsOtherChronic?: number;
  noPersonsOtherChronicSC?: number;
  noPersonsOtherChronicST?: number;
  noPersonsOtherChronicOBC?: number;
  noPersonsOtherChronicOthers?: number;
  noPersonsOtherChronicTotal?: number;
  noPersonsOtherChronicMinorities?: number;
  
  // 13. Literacy - Education
  totalIlliteratePersons?: number;
  totalIlliteratePersonsSC?: number;
  totalIlliteratePersonsST?: number;
  totalIlliteratePersonsOBC?: number;
  totalIlliteratePersonsOthers?: number;
  totalIlliteratePersonsTotal?: number;
  totalIlliteratePersonsMinorities?: number;
  
  noMaleIlliterate?: number;
  noMaleIlliterateSC?: number;
  noMaleIlliterateST?: number;
  noMaleIlliterateOBC?: number;
  noMaleIlliterateOthers?: number;
  noMaleIlliterateTotal?: number;
  noMaleIlliterateMinorities?: number;
  
  noFemaleIlliterate?: number;
  noFemaleIlliterateSC?: number;
  noFemaleIlliterateST?: number;
  noFemaleIlliterateOBC?: number;
  noFemaleIlliterateOthers?: number;
  noFemaleIlliterateTotal?: number;
  noFemaleIlliterateMinorities?: number;
  
  noBplIlliteratePersons?: number;
  noBplIlliteratePersonsSC?: number;
  noBplIlliteratePersonsST?: number;
  noBplIlliteratePersonsOBC?: number;
  noBplIlliteratePersonsOthers?: number;
  noBplIlliteratePersonsTotal?: number;
  noBplIlliteratePersonsMinorities?: number;
  
  noMaleBplIlliterate?: number;
  noMaleBplIlliterateSC?: number;
  noMaleBplIlliterateST?: number;
  noMaleBplIlliterateOBC?: number;
  noMaleBplIlliterateOthers?: number;
  noMaleBplIlliterateTotal?: number;
  noMaleBplIlliterateMinorities?: number;
  
  noFemaleBplIlliterate?: number;
  noFemaleBplIlliterateSC?: number;
  noFemaleBplIlliterateST?: number;
  noFemaleBplIlliterateOBC?: number;
  noFemaleBplIlliterateOthers?: number;
  noFemaleBplIlliterateTotal?: number;
  noFemaleBplIlliterateMinorities?: number;
  
  schoolDropoutsMale?: number;
  schoolDropoutsMaleSC?: number;
  schoolDropoutsMaleST?: number;
  schoolDropoutsMaleOBC?: number;
  schoolDropoutsMaleOthers?: number;
  schoolDropoutsMaleTotal?: number;
  schoolDropoutsMaleMinorities?: number;
  
  schoolDropoutsFemale?: number;
  schoolDropoutsFemaleSC?: number;
  schoolDropoutsFemaleST?: number;
  schoolDropoutsFemaleOBC?: number;
  schoolDropoutsFemaleOthers?: number;
  schoolDropoutsFemaleTotal?: number;
  schoolDropoutsFemaleMinorities?: number;
  
  // PART-G: IV. HOUSING STATUS
  // 14. Dwelling Units Structure
  dwellingUnitsPucca?: number;
  dwellingUnitsSemiPucca?: number;
  dwellingUnitsKatcha?: number;
  dwellingUnitsTotal?: number;
  
  dwellingUnitsWithElectricityPucca?: number;
  dwellingUnitsWithElectricitySemiPucca?: number;
  dwellingUnitsWithElectricityKatcha?: number;
  dwellingUnitsWithElectricityTotal?: number;
  
  // 15. Land Tenure Status (Dwelling Unit Nos)
  landTenureWithPatta?: number;
  landTenurePossessionCertificate?: number;
  landTenureEncroachedPrivate?: number;
  landTenureEncroachedPublic?: number;
  landTenureOnRent?: number;
  landTenureOther?: number;
  landTenureTotal?: number;
  
  // PART-H: V. ECONOMIC STATUS OF HOUSEHOLDS
  // 16. Economic Status (Monthly income of HHs)
  economicStatus?: {
    lessThan500?: number;
    rs500to1000?: number;
    rs1000to1500?: number;
    rs1500to2000?: number;
    rs2000to3000?: number;
    moreThan3000?: number;
  };
  
  // PART-I: VI. OCCUPATION STATUS OF HOUSEHOLDS
  // 17. Occupational Status
  occupationalStatus?: {
    selfEmployed?: number;
    salaried?: number;
    regularWage?: number;
    casualLabour?: number;
    others?: number;
  };
  
  // PART-J: VII. ACCESS TO PHYSICAL INFRASTRUCTURE
  // 18a. Source of Drinking Water (No. of HHs covered)
  sourceDrinkingWater?: {
    individualTap?: number;
    tubewellBorewellHandpump?: number;
    publicTap?: number;
    openwell?: number;
    tankPond?: number;
    riverCanalLakeSpring?: number;
    waterTanker?: number;
    others?: number;
  };
  
  // 18b. Connectivity to City-wide Water Supply System
  connectivityCityWaterSupply?: string; // Fully connected 01, Partially connected 02, Not connected 03
  
  // 19a. Drainage & Sewerage Facility
  drainageSewerageFacility?: string; // YES/NO
  
  // 19b. Connectivity to City-wide Storm-water Drainage System
  connectivityStormWaterDrainage?: string; // Fully connected 01, Partially connected 02, Not connected 03
  
  // 19c. Connectivity to City-wide Sewerage System
  connectivitySewerageSystem?: string; // Fully connected 01, Partially connected 02, Not connected 03
  
  // 19d. Whether the Slum is prone to flooding due to rains
  proneToFlooding?: string; // Not prone - 01, Upto 15 days - 02, 15-30 Days - 03, More than a Month - 04
  
  // 20. Latrine facility used by Households
  latrineFacility?: string; // Public Latrine/ Shared latrine/ own latrine
  
  // 21. Solid Waste Management
  // 21a. Frequency of Garbage Disposal
  frequencyOfGarbageDisposal?: string; // Daily -01, Once in 2 days - 02, Once in a week - 03, Once in 15 days - 04, No collection- 99
  
  // 21b. Arrangement for Garbage Disposal
  arrangementForGarbageDisposal?: string; // Municipal staff - 01, Municipal Contractor - 02, Residents themselves - 03, Others - 04,No arrangement - 99
  
  // 21c. Frequency of Clearance of Open Drains
  frequencyOfClearanceOfOpenDrains?: string; // Daily-01, Once in 2 days - 02, Once in a week - 03, Once in 15 days - 04, No clearance-99
  
  // 22. Approach Road/Lane/Constructed Path to the Slum
  approachRoadType?: string; // Motorable pucca -01, Motorable katcha -02, Non-motorable pucca -03, Non-motorable kaccha-04
  
  // 23. Distance from the nearest Motorable Road
  distanceToNearestMotorableRoad?: string; // Less than 0.5 kms -01, 0.5 to 1.0 km .- 02, 1.0 km to 2.0 km. -03, 2.0 km to 5.0 km. - 04,more than 5.0 km-05
  
  // 24. Internal Road
  internalRoadType?: string; // Motorable pucca-01, Motorable kutcha-02, Non-motorable pucca-03, Non-motorable katcha-04
  
  // 25. Whether Street light facility is available in the Slum
  streetLightAvailable?: string; // Yes-01, No-02
  
  // 26. Pre-primary School
  anganwadiUnderIcds?: number; // 26a. Anganwadi under ICDS
  municipalPreschool?: number; // 26b. Municipal pre-school
  privatePreschool?: number; // 26c. Private pre-school
  
  // 27. Primary School
  municipalPrimarySchool?: number; // 27a. Municipal
  stateGovtPrimarySchool?: number; // 27b. State Government
  privatePrimarySchool?: number; // 27c. Private
  
  // 28. High School
  municipalHighSchool?: number; // 28a. Municipal
  stateGovtHighSchool?: number; // 28b. State Government
  privateHighSchool?: number; // 28c. Private
  
  // 29. Adult Education Centre
  adultEducationCentre?: number; // If 01, then number
  
  // 30. Non-formal Education Centre
  nonFormalEducationCentre?: number; // If 01, then number
  
  // PART-K: IX. Health Facilities
  // 31. Existence of Health Facilities
  urbanHealthPost?: string;
  primaryHealthCentre?: string;
  governmentHospital?: string;
  maternityCentre?: string;
  privateClinic?: string;
  rmp?: string; // Registered Medical Practitioner (RMP)
  ayurvedicDoctor?: string; // Ayurvedic Doctor/Vaidya
  
  // PART-L: X. Social Development/Welfare
  // 32. Availability of Facilities within Slum
  communityHall?: number; // Community Hall
  livelihoodProductionCentre?: number; // Livelihood/Production Centre
  vocationalTrainingCentre?: number; // Vocational training/Training-cum-production Centre
  streetChildrenRehabilitationCentre?: number; // Street Children Rehabilitation Centre
  nightShelter?: number; // Night Shelter
  oldAgeHome?: number; // Old Age Home
  
  // 33a. Old Age Pensions (No. of Holders)
  oldAgePensionsHolders?: number;
  // 33b. Widow Pensions (No. of Holders)
  widowPensionsHolders?: number;
  // 33c. Disabled Pensions (No. of Holders)
  disabledPensionsHolders?: number;
  // 33d. General Insurance (No. covered)
  generalInsuranceCovered?: number;
  // 33e. Health Insurance (No. covered)
  healthInsuranceCovered?: number;
  
  // 34. Self Help Groups/DWCUA Groups in Slum
  selfHelpGroups?: number; // Specify Number: 0, 01, 02, 03 ....
  
  // 35. Thrift and Credit Societies in Slum
  thriftCreditSocieties?: number; // Specify Number: 0, 01, 02, 03 ....
  
  // 36a. Slum-dwellers Association
  slumDwellersAssociation?: string; // [Yes- 01, No- 02]
  // 36b. Youth Associations
  youthAssociations?: number; // Specify Number: 0, 01,02,03
  // 36c. Women's Associations/ Mahila Samithis
  womensAssociations?: number; // Specify Number: 0, 01,02,03
  
  // Additional fields that may be used
  waterSupplyDuration?: string;
  distanceToWaterSource?: string;
  typeOfToilet?: string;
  toiletAccessibility?: string;
  bathingFacility?: string;
  wastewaterDisposal?: string;
  drainageSystem?: string;
  
};

const SANITATION_OPTIONS = [
  { id: "PUBLIC_TOILETS", label: "Public Toilets" },
  { id: "PRIVATE_TOILETS", label: "Private Toilets" },
  { id: "COMMUNITY_TOILETS", label: "Community Toilets" },
  { id: "OPEN_DEFECATION", label: "Open Defecation" },
  { id: "SEPTIC_TANKS", label: "Septic Tanks" },
];

export default function SlumSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  const { showToast } = useToast();

  const [slum, setSlum] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [slumSurvey, setSlumSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState<any>(null);

  // Validation state
  interface FieldError {
    field: string;
    message: string;
  }
  const [errors, setErrors] = useState<FieldError[]>([]);

  const [formData, setFormData] = useState<SlumSurveyForm>({
    slumId: "",
    surveyed: false,
    slumType: "",
    ownershipLand: "",
    locationCoreOrFringe: "",
    typeAreaSurrounding: "",
    physicalLocationSlum: "",
    isSlumNotified: "",
    connectivityCityWaterSupply: "",
    drainageSewerageFacility: "",
    connectivityStormWaterDrainage: "",
    connectivitySewerageSystem: "",
    proneToFlooding: "",
    latrineFacility: "",
    frequencyOfGarbageDisposal: "",
    arrangementForGarbageDisposal: "",
    frequencyOfClearanceOfOpenDrains: "",
    approachRoadType: "",
    distanceToNearestMotorableRoad: "",
    internalRoadType: "",
    streetLightAvailable: "",
    urbanHealthPost: "",
    primaryHealthCentre: "",
    governmentHospital: "",
    maternityCentre: "",
    privateClinic: "",
    rmp: "",
    ayurvedicDoctor: "",
    slumDwellersAssociation: "",
  });

  const steps = [
    { title: "Basic Information", id: "basicInformation" },
    { title: "Land Status", id: "landStatus" },
    { title: "Population & Health", id: "populationAndHealth" },
    { title: "Literacy & Education", id: "literacyAndEducation" },
    { title: "Employment & Occupation", id: "employmentAndOccupation" },
    { title: "Water & Sanitation", id: "waterAndSanitation" },
    { title: "Housing Conditions", id: "housingConditions" },
    { title: "Utilities", id: "utilities" },
    { title: "Social Infrastructure", id: "socialInfrastructure" },
    { title: "Transportation", id: "transportationAndAccessibility" },
    { title: "Environmental Conditions", id: "environmentalConditions" },
    { title: "Social Issues", id: "socialIssuesAndVulnerableGroups" },
    { title: "Slum Improvement", id: "slumImprovementAndDevelopment" },
  ];

  useEffect(() => {
    // Load user data
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
    }

    const loadData = async () => {
      try {
        setLoading(true);
        // First, fetch the assignment to get the slum ID
        const assignmentResponse = await apiService.getAssignment(assignmentId);
        if (assignmentResponse.success && assignmentResponse.data) {
          setAssignment(assignmentResponse.data);
          const slumId = assignmentResponse.data.slum._id;

          // Update form data with the actual slum ID
          setFormData((prev) => ({
            ...prev,
            slumId: slumId,
          }));

          // Now fetch the slum details
          const slumResponse = await apiService.getSlum(slumId);
          if (slumResponse.success) {
            const slumData = slumResponse.data;
            setSlum(slumData);
            
            // Auto-fill slum details
            setFormData((prev) => ({
              ...prev,
              slumName: slumData.name || "",
              stateName: slumData.state?.name || "",
              stateCode: slumData.state?.code || "",
              districtName: slumData.district?.name || "",
              districtCode: slumData.district?.code || "",
              locationWard: slumData.ward || "",
              slumType: slumData.slumType || "",
              ownershipLand: slumData.landOwnership || "",
              noSlumHouseholds: slumData.totalHouseholds || 0,
            }));
          } else {
            showToast("Failed to load slum details", "error");
          }

          // Create or get the slum survey
          const surveyResponse = await apiService.createOrGetSlumSurvey(slumId);
          if (surveyResponse.success) {
            const surveyData = surveyResponse.data;
            setSlumSurvey(surveyData);
            
            // Set completion percentage from existing survey data
            if (surveyData.completionPercentage !== undefined) {
              setFormData(prev => ({
                ...prev,
                completionPercentage: surveyData.completionPercentage
              }));
            }
            
            // Navigate to the correct section based on completion percentage
            if (surveyData.completionPercentage !== undefined) {
              // Calculate section based on completion percentage
              // Each section represents ~7.69% (100/13), so we divide by 7.69 and round down
              // If completion is 100%, we should be on the last section (index 12)
              let sectionIndex = Math.floor(surveyData.completionPercentage / (100 / 13));
              // Cap at 12 (the last section index) but if it's 100%, we should be at the review section
              // If completion is 100%, we're at the end (last section)
              if (surveyData.completionPercentage >= 100) {
                sectionIndex = 12; // Last section
              } else if (surveyData.completionPercentage === 0) {
                sectionIndex = 0; // First section
              } else {
                // For intermediate percentages, use the calculated value but cap at 12
                sectionIndex = Math.min(12, sectionIndex);
              }
              setCurrentStep(sectionIndex);
            }
            
            // Skip permission check here since it should be handled at the assignment level
            
            // If survey has existing data, populate the form
            if (surveyData.basicInformation) {
              setFormData(prev => ({
                ...prev,
                slumCode: surveyData.basicInformation.slumCode || "",
                locationWard: surveyData.basicInformation.locationWardNo || "",
                ageSlumYears: surveyData.basicInformation.ageOfSlumYears || undefined,
                areaSlumSqMtrs: surveyData.basicInformation.areaOfSlumSqMeters ? parseFloat(surveyData.basicInformation.areaOfSlumSqMeters) : undefined,
                locationCoreOrFringe: surveyData.basicInformation.locatedInCoreCityOrFringe || "",
                typeAreaSurrounding: surveyData.basicInformation.typeOfAreaSurrounding || "",
                physicalLocationSlum: surveyData.basicInformation.physicalLocationOfSlum || "",
                isSlumNotified: surveyData.basicInformation.isSlumNotified || "",
                yearOfNotification: surveyData.basicInformation.yearOfNotificationIfYes ? parseInt(surveyData.basicInformation.yearOfNotificationIfYes) : undefined,
              }));
            }
            
            if (surveyData.landStatus) {
              setFormData(prev => ({
                ...prev,
                ownershipLandDetail: surveyData.landStatus.ownershipOfLand || "",
                ownershipLandSpecify: surveyData.landStatus.specifyOwnership || "",
              }));
            }
            
            // Handle infrastructure data
            if (surveyData.waterAndSanitation) {
              setFormData(prev => ({
                ...prev,
                connectivityCityWaterSupply: surveyData.waterAndSanitation.connectivityToCityWaterSupply || "",
                drainageSewerageFacility: surveyData.waterAndSanitation.drainageSewerageFacility || "",
                connectivityStormWaterDrainage: surveyData.waterAndSanitation.connectivityToStormWaterDrainage || "",
                connectivitySewerageSystem: surveyData.waterAndSanitation.connectivityToSewerageSystem || "",
                proneToFlooding: surveyData.waterAndSanitation.proneToFlooding || "",
                latrineFacility: surveyData.waterAndSanitation.latrineFacility || [],
                solidWasteManagement: surveyData.waterAndSanitation.solidWasteManagement || "",
                frequencyGarbageDisposal: surveyData.waterAndSanitation.frequencyGarbageDisposal || "",
                arrangementGarbageDisposal: surveyData.waterAndSanitation.arrangementGarbageDisposal || "",
                frequencyClearanceOpenDrains: surveyData.waterAndSanitation.frequencyClearanceOpenDrains || "",
                streetLightAvailable: surveyData.waterAndSanitation.streetLightAvailable || "",
              }));
            }
            
            // Handle health facilities data
            if (surveyData.socialInfrastructure && surveyData.socialInfrastructure.healthFacilities) {
              setFormData(prev => ({
                ...prev,
                urbanHealthPost: surveyData.socialInfrastructure.healthFacilities?.healthCenters ? (surveyData.socialInfrastructure.healthFacilities.healthCenters > 0 ? "YES" : "NO") : "",
                primaryHealthCentre: surveyData.socialInfrastructure.healthFacilities?.primaryHealthCenters ? (surveyData.socialInfrastructure.healthFacilities.primaryHealthCenters > 0 ? "YES" : "NO") : "",
                governmentHospital: surveyData.socialInfrastructure.healthFacilities?.hospitals ? (surveyData.socialInfrastructure.healthFacilities.hospitals > 0 ? "YES" : "NO") : "",
              }));
            }
            
            // Handle other health facility fields that might be stored separately
            if (surveyData.maternityCentre !== undefined) {
              setFormData(prev => ({
                ...prev,
                maternityCentre: surveyData.maternityCentre || "",
                privateClinic: surveyData.privateClinic || "",
                rmp: surveyData.rmp || "",
                ayurvedicDoctor: surveyData.ayurvedicDoctor || "",
              }));
            }
            
            if (surveyData.socialIssuesAndVulnerableGroups) {
              setFormData(prev => ({
                ...prev,
                slumDwellersAssociation: surveyData.socialIssuesAndVulnerableGroups.slumDwellersAssociation || "",
              }));
            }
          } else {
            showToast("Failed to load/create slum survey", "error");
          }
        } else {
          showToast("Failed to load assignment details", "error");
          router.push("/surveyor/dashboard");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        showToast("Failed to load data", "error");
        router.push("/surveyor/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) loadData();
  }, [assignmentId, router, showToast]);



  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parentField: string, childField: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField as keyof SlumSurveyForm] as any || {}),
        [childField]: value,
      },
    }));
  };

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev) => {
      const current = prev[field as keyof SlumSurveyForm] as string[];
      if (current?.includes(value)) {
        return {
          ...prev,
          [field]: current.filter((v) => v !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...(current || []), value],
        };
      }
    });
  };

  // Validation functions
  const validateForm = (): FieldError[] => {
    const newErrors: FieldError[] = [];
    
    // Part A - General Information - City/Town
    if (!formData.cityTownCode?.trim()) {
      newErrors.push({ field: 'cityTownCode', message: 'City/Town Code is required' });
    }
    if (!formData.cityTownName?.trim()) {
      newErrors.push({ field: 'cityTownName', message: 'City/Town Name is required' });
    }
    if (formData.cityTownNoHouseholds === undefined || formData.cityTownNoHouseholds === null || isNaN(formData.cityTownNoHouseholds) || formData.cityTownNoHouseholds < 0) {
      newErrors.push({ field: 'cityTownNoHouseholds', message: 'City/Town No. of Households is required' });
    }
    
    // Part B - City/Town Slum Profile
    if (!formData.slumType) {
      newErrors.push({ field: 'slumType', message: 'Slum Type is required' });
    }
    if (!formData.slumIdField?.trim()) {
      newErrors.push({ field: 'slumIdField', message: 'Slum ID is required' });
    }
    if (!formData.ownershipLand) {
      newErrors.push({ field: 'ownershipLand', message: 'Ownership of Land is required' });
    }
    if (formData.areaSqMtrs === undefined || formData.areaSqMtrs === null || isNaN(formData.areaSqMtrs) || formData.areaSqMtrs < 0) {
      newErrors.push({ field: 'areaSqMtrs', message: 'Area (sq Mtrs) is required' });
    }
    if (formData.slumPopulation === undefined || formData.slumPopulation === null || isNaN(formData.slumPopulation) || formData.slumPopulation < 0) {
      newErrors.push({ field: 'slumPopulation', message: 'Slum Population is required' });
    }
    if (formData.noSlumHouseholds === undefined || formData.noSlumHouseholds === null || isNaN(formData.noSlumHouseholds) || formData.noSlumHouseholds < 0) {
      newErrors.push({ field: 'noSlumHouseholds', message: 'No. of Slum Households is required' });
    }
    if (formData.bplPopulation === undefined || formData.bplPopulation === null || isNaN(formData.bplPopulation) || formData.bplPopulation < 0) {
      newErrors.push({ field: 'bplPopulation', message: 'BPL Population is required' });
    }
    if (formData.noBplHouseholdsSlum === undefined || formData.noBplHouseholdsSlum === null || isNaN(formData.noBplHouseholdsSlum) || formData.noBplHouseholdsSlum < 0) {
      newErrors.push({ field: 'noBplHouseholdsSlum', message: 'No. of BPL Households is required' });
    }
    
    // Part C - Particulars of Survey Operation
    if (!formData.surveyorName?.trim()) {
      newErrors.push({ field: 'surveyorName', message: 'Surveyor Name is required' });
    }
    if (!formData.surveyDate) {
      newErrors.push({ field: 'surveyDate', message: 'Survey Date is required' });
    }
    if (!formData.receiptQuestionnaireDate) {
      newErrors.push({ field: 'receiptQuestionnaireDate', message: 'Receipt of Questionnaire Date is required' });
    }
    if (!formData.scrutinyDate) {
      newErrors.push({ field: 'scrutinyDate', message: 'Scrutiny Date is required' });
    }
    if (!formData.receiptByNodalCellDate) {
      newErrors.push({ field: 'receiptByNodalCellDate', message: 'Receipt by Nodal Cell Date is required' });
    }
    
    // Part D - Basic Information on Slum
    if (!formData.slumCode?.trim()) {
      newErrors.push({ field: 'slumCode', message: 'Slum Code is required' });
    }
    if (!formData.locationWard?.trim()) {
      newErrors.push({ field: 'locationWard', message: 'Location Ward is required' });
    }
    if (formData.ageSlumYears === undefined || formData.ageSlumYears === null || isNaN(formData.ageSlumYears) || formData.ageSlumYears < 0) {
      newErrors.push({ field: 'ageSlumYears', message: 'Age of Slum (Years) is required' });
    }
    if (formData.areaSlumSqMtrs === undefined || formData.areaSlumSqMtrs === null || isNaN(formData.areaSlumSqMtrs) || formData.areaSlumSqMtrs < 0) {
      newErrors.push({ field: 'areaSlumSqMtrs', message: 'Area of Slum (sq Mtrs) is required' });
    }
    if (!formData.locationCoreOrFringe) {
      newErrors.push({ field: 'locationCoreOrFringe', message: 'Location - Core City/Town or Fringe Area is required' });
    }
    if (!formData.typeAreaSurrounding) {
      newErrors.push({ field: 'typeAreaSurrounding', message: 'Type of Area Surrounding is required' });
    }
    if (!formData.physicalLocationSlum) {
      newErrors.push({ field: 'physicalLocationSlum', message: 'Physical Location of Slum is required' });
    }
    if (!formData.isSlumNotified) {
      newErrors.push({ field: 'isSlumNotified', message: 'Is Slum Notified? is required' });
    }
    if (formData.isSlumNotified === 'YES' && (formData.yearOfNotification === undefined || formData.yearOfNotification === null || isNaN(formData.yearOfNotification) || formData.yearOfNotification < 0)) {
      newErrors.push({ field: 'yearOfNotification', message: 'Year of Notification is required when Slum is Notified' });
    }
    
    // Part E - Land Status
    if (!formData.ownershipLandDetail) {
      newErrors.push({ field: 'ownershipLandDetail', message: 'Ownership of Land is required' });
    }
    if (!formData.ownershipLandSpecify?.trim()) {
      newErrors.push({ field: 'ownershipLandSpecify', message: 'Specify Ownership (if Other) is required' });
    }
    
    // Part H - Housing Status
    if (formData.dwellingUnitsPucca === undefined || formData.dwellingUnitsPucca === null || isNaN(formData.dwellingUnitsPucca) || formData.dwellingUnitsPucca < 0) {
      newErrors.push({ field: 'dwellingUnitsPucca', message: 'Dwelling Units - Pucca is required' });
    }
    if (formData.dwellingUnitsSemiPucca === undefined || formData.dwellingUnitsSemiPucca === null || isNaN(formData.dwellingUnitsSemiPucca) || formData.dwellingUnitsSemiPucca < 0) {
      newErrors.push({ field: 'dwellingUnitsSemiPucca', message: 'Dwelling Units - Semi-Pucca is required' });
    }
    if (formData.dwellingUnitsKatcha === undefined || formData.dwellingUnitsKatcha === null || isNaN(formData.dwellingUnitsKatcha) || formData.dwellingUnitsKatcha < 0) {
      newErrors.push({ field: 'dwellingUnitsKatcha', message: 'Dwelling Units - Katcha is required' });
    }
    if (formData.dwellingUnitsTotal === undefined || formData.dwellingUnitsTotal === null || isNaN(formData.dwellingUnitsTotal) || formData.dwellingUnitsTotal < 0) {
      newErrors.push({ field: 'dwellingUnitsTotal', message: 'Dwelling Units - Total is required' });
    }
    if (formData.landTenureWithPatta === undefined || formData.landTenureWithPatta === null || isNaN(formData.landTenureWithPatta) || formData.landTenureWithPatta < 0) {
      newErrors.push({ field: 'landTenureWithPatta', message: 'Land Tenure With Patta is required' });
    }
    
    return newErrors;
  };
  
  const getFieldError = (fieldName: string): string | undefined => {
    const error = errors.find(err => err.field === fieldName);
    return error ? error.message : undefined;
  };
  
  const scrollToFirstError = () => {
    if (errors.length > 0) {
      const firstErrorField = errors[0].field;
      // Wait for the DOM to update before scrolling
      setTimeout(() => {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (element as HTMLElement).focus();
        }
      }, 100);
    }
  };

  const handleSubmit = async () => {
    // Validate the form
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (validationErrors.length > 0) {
      // Scroll to first error
      scrollToFirstError();
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (!slumSurvey?._id) {
        showToast("Survey not initialized properly", "error");
        return;
      }
      
      // Transform form data to match backend model structure
      const surveyData = {
        // PART-A: I. GENERAL INFORMATION -CITY/TOWN
        generalInformation: {
          stateCode: formData.stateCode || "",
          stateName: formData.stateName || "",
          districtCode: formData.districtCode || "",
          districtName: formData.districtName || "",
          cityTownCode: formData.cityTownCode || "",
          cityTownName: formData.cityTownName || "",
          cityTown: formData.cityTown || "",
          cityTownNoHouseholds: formData.cityTownNoHouseholds || 0
        },
        
        // PART-B: II. CITY/TOWN SLUM PROFILE
        cityTownSlumProfile: {
          slumType: formData.slumType || "",
          slumIdField: formData.slumIdField || "",
          slumName: formData.slumName || "",
          ownershipLand: formData.ownershipLand || "",
          areaSqMtrs: formData.areaSqMtrs || 0,
          slumPopulation: formData.slumPopulation || 0,
          noSlumHouseholds: formData.noSlumHouseholds || 0,
          bplPopulation: formData.bplPopulation || 0,
          noBplHouseholdsCityTown: formData.noBplHouseholdsCityTown || 0
        },
        
        // PART-C: III. PARTICULARS OF SURVEY OPERATION
        surveyOperation: {
          surveyorName: formData.surveyorName || "",
          surveyDate: formData.surveyDate || "",
          receiptQuestionnaireDate: formData.receiptQuestionnaireDate || "",
          scrutinyDate: formData.scrutinyDate || "",
          receiptByNodalCellDate: formData.receiptByNodalCellDate || "",
          remarksInvestigator: formData.remarksInvestigator || "",
          commentsSupervisor: formData.commentsSupervisor || ""
        },
        
        // PART-D: I. BASIC INFORMATION ON SLUM
        basicInformation: {
          slumNameBasicInfo: formData.slumNameBasicInfo || "",
          slumCode: formData.slumCode || "",
          locationWard: formData.locationWard || "",
          ageSlumYears: formData.ageSlumYears || 0,
          areaSlumSqMtrs: formData.areaSlumSqMtrs || 0,
          locationCoreOrFringe: formData.locationCoreOrFringe || "",
          typeAreaSurrounding: formData.typeAreaSurrounding || "",
          physicalLocationSlum: formData.physicalLocationSlum || "",
          isSlumNotified: formData.isSlumNotified || "",
          yearOfNotification: formData.yearOfNotification || 0
        },
        
        // PART-E: II. LAND STATUS
        landStatus: {
          ownershipLandDetail: formData.ownershipLandDetail || "",
          ownershipLandSpecify: formData.ownershipLandSpecify || ""
        },
        populationAndHealth: {
          totalPopulation: {
            SC: formData.totalPopulationSlumSC || 0,
            ST: formData.totalPopulationSlumST || 0,
            OBC: formData.totalPopulationSlumOBC || 0,
            Others: formData.totalPopulationSlumOthers || 0,
            Total: formData.totalPopulationSlum || 0,
            Minorities: formData.totalPopulationSlumMinorities || 0
          },
          bplPopulation: {
            SC: formData.bplPopulationSlumSC || 0,
            ST: formData.bplPopulationSlumST || 0,
            OBC: formData.bplPopulationSlumOBC || 0,
            Others: formData.bplPopulationSlumOthers || 0,
            Total: formData.bplPopulationSlum || 0,
            Minorities: formData.bplPopulationSlumMinorities || 0
          },
          numberOfHouseholds: {
            SC: formData.noHouseholdsSlumSC || 0,
            ST: formData.noHouseholdsSlumST || 0,
            OBC: formData.noHouseholdsSlumOBC || 0,
            Others: formData.noHouseholdsSlumOthers || 0,
            Total: formData.noHouseholdsSlum || 0,
            Minorities: formData.noHouseholdsSlumMinorities || 0
          },
          numberOfBplHouseholds: {
            SC: formData.noBplHouseholdsSC || 0,
            ST: formData.noBplHouseholdsST || 0,
            OBC: formData.noBplHouseholdsOBC || 0,
            Others: formData.noBplHouseholdsOthers || 0,
            Total: formData.noBplHouseholdsTotal || 0,
            Minorities: formData.noBplHouseholdsMinorities || 0
          },
          womenHeadedHouseholds: {
            SC: formData.noWomenHeadedHouseholdsSC || 0,
            ST: formData.noWomenHeadedHouseholdsST || 0,
            OBC: formData.noWomenHeadedHouseholdsOBC || 0,
            Others: formData.noWomenHeadedHouseholdsOthers || 0,
            Total: formData.noWomenHeadedHouseholdsTotal || 0,
            Minorities: formData.noWomenHeadedHouseholdsMinorities || 0
          },
          personsOlderThan65Years: {
            SC: formData.noPersonsOlder65SC || 0,
            ST: formData.noPersonsOlder65ST || 0,
            OBC: formData.noPersonsOlder65OBC || 0,
            Others: formData.noPersonsOlder65Others || 0,
            Total: formData.noPersonsOlder65Total || 0,
            Minorities: formData.noPersonsOlder65Minorities || 0
          },
          childLabourers: {
            SC: formData.noChildLabourersSC || 0,
            ST: formData.noChildLabourersST || 0,
            OBC: formData.noChildLabourersOBC || 0,
            Others: formData.noChildLabourersOthers || 0,
            Total: formData.noChildLabourersTotal || 0,
            Minorities: formData.noChildLabourersMinorities || 0
          },
          physicallyChallengedPersons: {
            SC: formData.noPhysicallyChallengedSC || 0,
            ST: formData.noPhysicallyChallengedST || 0,
            OBC: formData.noPhysicallyChallengedOBC || 0,
            Others: formData.noPhysicallyChallengedOthers || 0,
            Total: formData.noPhysicallyChallengedTotal || 0,
            Minorities: formData.noPhysicallyChallengedMinorities || 0
          },
          mentallyChallengedPersons: {
            SC: formData.noMentallyChallengedSC || 0,
            ST: formData.noMentallyChallengedST || 0,
            OBC: formData.noMentallyChallengedOBC || 0,
            Others: formData.noMentallyChallengedOthers || 0,
            Total: formData.noMentallyChallengedTotal || 0,
            Minorities: formData.noMentallyChallengedMinorities || 0
          },
          personsWithHivAids: {
            SC: formData.noPersonsHivaidsSC || 0,
            ST: formData.noPersonsHivaidsST || 0,
            OBC: formData.noPersonsHivaidsOBC || 0,
            Others: formData.noPersonsHivaidsOthers || 0,
            Total: formData.noPersonsHivaidsTotal || 0,
            Minorities: formData.noPersonsHivaidsMinorities || 0
          },
          personsWithTuberculosis: {
            SC: formData.noPersonsTuberculosisSC || 0,
            ST: formData.noPersonsTuberculosisST || 0,
            OBC: formData.noPersonsTuberculosisOBC || 0,
            Others: formData.noPersonsTuberculosisOthers || 0,
            Total: formData.noPersonsTuberculosisTotal || 0,
            Minorities: formData.noPersonsTuberculosisMinorities || 0
          },
          personsWithRespiratoryDiseases: {
            SC: formData.noPersonsRespiratorySC || 0,
            ST: formData.noPersonsRespiratoryST || 0,
            OBC: formData.noPersonsRespiratoryOBC || 0,
            Others: formData.noPersonsRespiratoryOthers || 0,
            Total: formData.noPersonsRespiratoryTotal || 0,
            Minorities: formData.noPersonsRespiratoryMinorities || 0
          },
          personsWithOtherChronicDiseases: {
            SC: formData.noPersonsOtherChronicSC || 0,
            ST: formData.noPersonsOtherChronicST || 0,
            OBC: formData.noPersonsOtherChronicOBC || 0,
            Others: formData.noPersonsOtherChronicOthers || 0,
            Total: formData.noPersonsOtherChronicTotal || 0,
            Minorities: formData.noPersonsOtherChronicMinorities || 0
          }
        },
        literacyAndEducation: {
          totalIlliteratePerson: {
            SC: formData.totalIlliteratePersonsSC || 0,
            ST: formData.totalIlliteratePersonsST || 0,
            OBC: formData.totalIlliteratePersonsOBC || 0,
            Others: formData.totalIlliteratePersonsOthers || 0,
            Total: formData.totalIlliteratePersonsTotal || 0,
            Minorities: formData.totalIlliteratePersonsMinorities || 0
          },
          maleIlliterate: {
            SC: formData.noMaleIlliterateSC || 0,
            ST: formData.noMaleIlliterateST || 0,
            OBC: formData.noMaleIlliterateOBC || 0,
            Others: formData.noMaleIlliterateOthers || 0,
            Total: formData.noMaleIlliterateTotal || 0,
            Minorities: formData.noMaleIlliterateMinorities || 0
          },
          femaleIlliterate: {
            SC: formData.noFemaleIlliterateSC || 0,
            ST: formData.noFemaleIlliterateST || 0,
            OBC: formData.noFemaleIlliterateOBC || 0,
            Others: formData.noFemaleIlliterateOthers || 0,
            Total: formData.noFemaleIlliterateTotal || 0,
            Minorities: formData.noFemaleIlliterateMinorities || 0
          },
          bplIlliteratePerson: {
            SC: formData.noBplIlliteratePersonsSC || 0,
            ST: formData.noBplIlliteratePersonsST || 0,
            OBC: formData.noBplIlliteratePersonsOBC || 0,
            Others: formData.noBplIlliteratePersonsOthers || 0,
            Total: formData.noBplIlliteratePersonsTotal || 0,
            Minorities: formData.noBplIlliteratePersonsMinorities || 0
          },
          maleBplIlliterate: {
            SC: formData.noMaleBplIlliterateSC || 0,
            ST: formData.noMaleBplIlliterateST || 0,
            OBC: formData.noMaleBplIlliterateOBC || 0,
            Others: formData.noMaleBplIlliterateOthers || 0,
            Total: formData.noMaleBplIlliterateTotal || 0,
            Minorities: formData.noMaleBplIlliterateMinorities || 0
          },
          femaleBplIlliterate: {
            SC: formData.noFemaleBplIlliterateSC || 0,
            ST: formData.noFemaleBplIlliterateST || 0,
            OBC: formData.noFemaleBplIlliterateOBC || 0,
            Others: formData.noFemaleBplIlliterateOthers || 0,
            Total: formData.noFemaleBplIlliterateTotal || 0,
            Minorities: formData.noFemaleBplIlliterateMinorities || 0
          },
          schoolDropoutsMale: {
            SC: formData.schoolDropoutsMaleSC || 0,
            ST: formData.schoolDropoutsMaleST || 0,
            OBC: formData.schoolDropoutsMaleOBC || 0,
            Others: formData.schoolDropoutsMaleOthers || 0,
            Total: formData.schoolDropoutsMaleTotal || 0,
            Minorities: formData.schoolDropoutsMaleMinorities || 0
          },
          schoolDropoutsFemale: {
            SC: formData.schoolDropoutsFemaleSC || 0,
            ST: formData.schoolDropoutsFemaleST || 0,
            OBC: formData.schoolDropoutsFemaleOBC || 0,
            Others: formData.schoolDropoutsFemaleOthers || 0,
            Total: formData.schoolDropoutsFemaleTotal || 0,
            Minorities: formData.schoolDropoutsFemaleMinorities || 0
          }
        },
        // PART-I: V. ECONOMIC STATUS OF HOUSEHOLDS
        economicStatus: {
          economicStatusData: {
            lessThan500: formData.economicStatus?.lessThan500 || 0,
            rs500to1000: formData.economicStatus?.rs500to1000 || 0,
            rs1000to1500: formData.economicStatus?.rs1000to1500 || 0,
            rs1500to2000: formData.economicStatus?.rs1500to2000 || 0,
            rs2000to3000: formData.economicStatus?.rs2000to3000 || 0,
            moreThan3000: formData.economicStatus?.moreThan3000 || 0
          }
        },
        
        // PART-J: VI. OCCUPATION STATUS OF HOUSEHOLDS
        occupationStatus: {
          occupationalStatusData: {
            selfEmployed: formData.occupationalStatus?.selfEmployed || 0,
            salaried: formData.occupationalStatus?.salaried || 0,
            regularWage: formData.occupationalStatus?.regularWage || 0,
            casualLabour: formData.occupationalStatus?.casualLabour || 0,
            others: formData.occupationalStatus?.others || 0
          }
        },
        
        // PART-K: VII. ACCESS TO PHYSICAL INFRASTRUCTURE
        physicalInfrastructure: {
          sourceDrinkingWater: {
            individualTap: formData.sourceDrinkingWater?.individualTap || 0,
            tubewellBorewellHandpump: formData.sourceDrinkingWater?.tubewellBorewellHandpump || 0,
            publicTap: formData.sourceDrinkingWater?.publicTap || 0,
            openwell: formData.sourceDrinkingWater?.openwell || 0,
            tankPond: formData.sourceDrinkingWater?.tankPond || 0,
            riverCanalLakeSpring: formData.sourceDrinkingWater?.riverCanalLakeSpring || 0,
            waterTanker: formData.sourceDrinkingWater?.waterTanker || 0,
            others: formData.sourceDrinkingWater?.others || 0
          },
          connectivityCityWaterSupply: formData.connectivityCityWaterSupply || "",
          drainageSewerageFacility: formData.drainageSewerageFacility || "",
          connectivityStormWaterDrainage: formData.connectivityStormWaterDrainage || "",
          connectivitySewerageSystem: formData.connectivitySewerageSystem || "",
          proneToFlooding: formData.proneToFlooding || "",
          latrineFacility: formData.latrineFacility || "",
          solidWasteManagement: {
            frequencyOfGarbageDisposal: formData.frequencyOfGarbageDisposal || "",
            arrangementForGarbageDisposal: formData.arrangementForGarbageDisposal || "",
            frequencyOfClearanceOfOpenDrains: formData.frequencyOfClearanceOfOpenDrains || ""
          },
          approachRoadType: formData.approachRoadType || "",
          distanceToNearestMotorableRoad: formData.distanceToNearestMotorableRoad || "",
          internalRoadType: formData.internalRoadType || "",
          streetLightAvailable: formData.streetLightAvailable || ""
        },
        
        // PART-H: IV. HOUSING STATUS
        housingStatus: {
          dwellingUnitsPucca: formData.dwellingUnitsPucca || 0,
          dwellingUnitsSemiPucca: formData.dwellingUnitsSemiPucca || 0,
          dwellingUnitsKatcha: formData.dwellingUnitsKatcha || 0,
          dwellingUnitsTotal: formData.dwellingUnitsTotal || 0,
          dwellingUnitsWithElectricityPucca: formData.dwellingUnitsWithElectricityPucca || 0,
          dwellingUnitsWithElectricitySemiPucca: formData.dwellingUnitsWithElectricitySemiPucca || 0,
          dwellingUnitsWithElectricityKatcha: formData.dwellingUnitsWithElectricityKatcha || 0,
          dwellingUnitsWithElectricityTotal: formData.dwellingUnitsWithElectricityTotal || 0,
          landTenureWithPatta: formData.landTenureWithPatta || 0,
          landTenurePossessionCertificate: formData.landTenurePossessionCertificate || 0,
          landTenureEncroachedPrivate: formData.landTenureEncroachedPrivate || 0,
          landTenureEncroachedPublic: formData.landTenureEncroachedPublic || 0,
          landTenureOnRent: formData.landTenureOnRent || 0,
          landTenureOther: formData.landTenureOther || 0,
          landTenureTotal: formData.landTenureTotal || 0
        },
        
        // PART-L: VIII. Education Facilities
        educationFacilities: {
          anganwadiUnderIcds: formData.anganwadiUnderIcds || 0,
          municipalPreschool: formData.municipalPreschool || 0,
          privatePreschool: formData.privatePreschool || 0,
          municipalPrimarySchool: formData.municipalPrimarySchool || 0,
          stateGovtPrimarySchool: formData.stateGovtPrimarySchool || 0,
          privatePrimarySchool: formData.privatePrimarySchool || 0,
          municipalHighSchool: formData.municipalHighSchool || 0,
          stateGovtHighSchool: formData.stateGovtHighSchool || 0,
          privateHighSchool: formData.privateHighSchool || 0,
          adultEducationCentre: formData.adultEducationCentre || 0,
          nonFormalEducationCentre: formData.nonFormalEducationCentre || 0
        },
        
        // PART-M: IX. Health Facilities
        healthFacilities: {
          urbanHealthPost: formData.urbanHealthPost || "",
          primaryHealthCentre: formData.primaryHealthCentre || "",
          governmentHospital: formData.governmentHospital || "",
          maternityCentre: formData.maternityCentre || "",
          privateClinic: formData.privateClinic || "",
          rmp: formData.rmp || "",
          ayurvedicDoctor: formData.ayurvedicDoctor || ""
        },
        
        // PART-N: X. Social Development/Welfare
        socialDevelopment: {
          communityHall: formData.communityHall || 0,
          livelihoodProductionCentre: formData.livelihoodProductionCentre || 0,
          vocationalTrainingCentre: formData.vocationalTrainingCentre || 0,
          streetChildrenRehabilitationCentre: formData.streetChildrenRehabilitationCentre || 0,
          nightShelter: formData.nightShelter || 0,
          oldAgeHome: formData.oldAgeHome || 0,
          oldAgePensionsHolders: formData.oldAgePensionsHolders || 0,
          widowPensionsHolders: formData.widowPensionsHolders || 0,
          disabledPensionsHolders: formData.disabledPensionsHolders || 0,
          generalInsuranceCovered: formData.generalInsuranceCovered || 0,
          healthInsuranceCovered: formData.healthInsuranceCovered || 0,
          selfHelpGroups: formData.selfHelpGroups || 0,
          thriftCreditSocieties: formData.thriftCreditSocieties || 0,
          slumDwellersAssociation: formData.slumDwellersAssociation || "",
          youthAssociations: formData.youthAssociations || 0,
          womensAssociations: formData.womensAssociations || 0
        }
      };

      // First, save the current section to ensure completion percentage is accurate
      await saveSection();
      
      const response = await apiService.submitSlumSurvey(slumSurvey._id, surveyData);

      if (response.success) {
        showToast("Slum survey submitted successfully", "success");
        // Redirect to dashboard after successful submission
        router.push('/surveyor/dashboard');
      } else {
        showToast(response.message || "Failed to submit survey", "error");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      showToast("Failed to submit survey", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevious = () => {
    // Validation for back navigation - check if current section is saved
    if (currentStep > 0) {
      setCurrentStep((prev) => Math.max(0, prev - 1));
    }
  };

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const handleBackToDashboard = () => {
    // Show confirmation dialog before navigating back to dashboard
    setShowLeaveConfirm(true);
  };

  const confirmLeave = () => {
    setShowLeaveConfirm(false);
    router.back();
  };

  const cancelLeave = () => {
    setShowLeaveConfirm(false);
  };

  const saveSection = async () => {
    try {
      setSaving(true);
      
      // Map current step to section name (13 sections total)
      const sectionMap: Record<number, string> = {
        0: 'basicInformation',
        1: 'landStatus',
        2: 'populationAndHealth',
        3: 'literacyAndEducation',
        4: 'employmentAndOccupation',
        5: 'waterAndSanitation',
        6: 'housingConditions',
        7: 'utilities',
        8: 'socialInfrastructure',
        9: 'transportationAndAccessibility',
        10: 'environmentalConditions',
        11: 'socialIssuesAndVulnerableGroups',
        12: 'slumImprovementAndDevelopment'
      };
      
      // Extract data for current section
      const sectionName = sectionMap[currentStep];
      if (!sectionName) {
        showToast("Invalid section", "error");
        return;
      }
      
      // Extract data for current section based on the step
      // This is a simplified mapping - in reality, you'd need to map
      // form fields to the appropriate section structure
      const extractSectionData = () => {
        const data: any = {};
        // Add logic to extract only the fields relevant to the current section
        // For now, we'll send all form data but in a real implementation,
        // you would filter based on the current step
        Object.keys(formData).forEach(key => {
          if (formData[key as keyof SlumSurveyForm] !== undefined && 
              formData[key as keyof SlumSurveyForm] !== null && 
              formData[key as keyof SlumSurveyForm] !== '') {
            data[key] = formData[key as keyof SlumSurveyForm];
          }
        });
        return data;
      };
      
      const sectionData = extractSectionData();
      
      const response = await apiService.updateSurveySection(
        slumSurvey._id,
        sectionName,
        sectionData
      );
      
      if (response.success) {
        showToast(`Section saved successfully! (${response.data?.completionPercentage || 0}% complete)`, "success");
        // Update local state with new completion percentage
        if (response.data?.completionPercentage !== undefined) {
          setFormData(prev => ({
            ...prev,
            completionPercentage: response.data.completionPercentage
          }));
        }
        // Move to next step
        setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
      } else {
        showToast(response.error || "Failed to save section", "error");
      }
    } catch (error) {
      console.error("Save section error:", error);
      showToast("Failed to save section", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SurveyorLayout username={user?.name || user?.username} fullScreen>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SurveyorLayout>
    );
  }

  if (!slum) {
    return (
      <SurveyorLayout username={user?.name || user?.username} fullScreen>
        <Card className="text-center py-8">
          <p className="text-error">Slum not found</p>
        </Card>
      </SurveyorLayout>
    );
  }

  return (
    <SurveyorLayout username={user?.name || user?.username} fullScreen>
      <div className="max-w-3xl mx-auto w-full pb-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
           <div>
              <button
                onClick={handleBackToDashboard}
                className="mb-2 text-sm text-slate-400 hover:text-white flex items-center transition-colors"
               >
                <span className="mr-1">←</span> Back to Dashboard
              </button>
              
              {/* Back Navigation Dialog for Leaving Survey */}
              <BackNavigationDialog
                isOpen={showLeaveConfirm}
                title="Leave Survey?"
                message="Are you sure you want to leave the survey? Your progress will be saved."
                onConfirm={confirmLeave}
                onCancel={cancelLeave}
              />
              

              <h1 className="text-3xl font-bold text-white tracking-tight">Slum Survey</h1>
              <p className="text-slate-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {slum.name}
              </p>
           </div>
        </div>

        {/* Stepper */}
        <Stepper 
            steps={steps.map(s => s.title)} 
            currentStep={currentStep} 
            completionPercentage={formData.completionPercentage || 0}
        />

        {/* Form Container */}
        <Card className="animate-slide-up">
            {currentStep === 0 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part A: General Information - City/Town
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                    label="State Code"
                    value={formData.stateCode || ""}
                    readOnly
                    className="bg-slate-800/50 cursor-not-allowed opacity-75"
                    />
                    <Input
                    label="State Name"
                    value={formData.stateName || ""}
                    readOnly
                    className="bg-slate-800/50 cursor-not-allowed opacity-75"
                    />
                    <Input
                    label="District Code"
                    value={formData.districtCode || ""}
                    readOnly
                    className="bg-slate-800/50 cursor-not-allowed opacity-75"
                    />
                    <Input
                    label="District Name"
                    value={formData.districtName || ""}
                    readOnly
                    className="bg-slate-800/50 cursor-not-allowed opacity-75"
                    />
                    <Input
                    label="City/Town Code"
                    value={formData.cityTownCode || ""}
                    onChange={(e) => handleInputChange("cityTownCode", e.target.value)}
                    required
                    name="cityTownCode"
                    error={getFieldError('cityTownCode')}
                    />
                    <Input
                    label="City/Town Name"
                    value={formData.cityTownName || ""}
                    onChange={(e) => handleInputChange("cityTownName", e.target.value)}
                    required
                    name="cityTownName"
                    error={getFieldError('cityTownName')}
                    />
                    <div className="md:col-span-2">
                        <Input
                        label="City/Town No. of Households (2011 Census)"
                        type="number"
                        value={formData.cityTownNoHouseholds || ""}
                        onChange={(e) => handleInputChange("cityTownNoHouseholds", parseInt(e.target.value) || 0)}
                        required
                        name="cityTownNoHouseholds"
                        error={getFieldError('cityTownNoHouseholds')}
                        />
                    </div>
                </div>
            </div>
            )}

            {currentStep === 1 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part B: City/Town Slum Profile
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                    label="Slum Type"
                    value={formData.slumType || ""}
                    onChange={(e) => handleInputChange("slumType", e.target.value)}
                    required
                    name="slumType"
                    error={getFieldError('slumType')}
                    options={[
                        { value: "NOTIFIED", label: "Notified" },
                        { value: "NON_NOTIFIED", label: "Non-Notified" },
                        { value: "NEW_IDENTIFIED", label: "New Identified" },
                    ]}
                    />
                    <Input
                    label="Slum ID"
                    value={formData.slumIdField || ""}
                    onChange={(e) => handleInputChange("slumIdField", e.target.value)}
                    required
                    name="slumIdField"
                    error={getFieldError('slumIdField')}
                    />
                    <div className="md:col-span-2">
                        <Input
                        label="Slum Name"
                        value={formData.slumName || ""}
                        readOnly
                        className="bg-slate-800/50 cursor-not-allowed opacity-75"
                        />
                    </div>
                    <Select
                    label="Ownership of Land"
                    value={formData.ownershipLand || ""}
                    onChange={(e) => handleInputChange("ownershipLand", e.target.value)}
                    required
                    name="ownershipLand"
                    error={getFieldError('ownershipLand')}
                    options={[
                        { value: "LOCAL_BODY", label: "Local Body" },
                        { value: "STATE_GOVERNMENT", label: "State Government" },
                        { value: "CENTRAL_GOVERNMENT", label: "Central Government" },
                        { value: "PRIVATE", label: "Private" },
                        { value: "OTHER", label: "Other" },
                    ]}
                    />
                    <Input
                    label="Area (sq Mtrs)"
                    type="number"
                    value={formData.areaSqMtrs || ""}
                    onChange={(e) => handleInputChange("areaSqMtrs", parseFloat(e.target.value) || 0)}
                    required
                    name="areaSqMtrs"
                    error={getFieldError('areaSqMtrs')}
                    />
                    <Input
                    label="Slum Population"
                    type="number"
                    value={formData.slumPopulation || ""}
                    onChange={(e) => handleInputChange("slumPopulation", parseInt(e.target.value) || 0)}
                    required
                    name="slumPopulation"
                    error={getFieldError('slumPopulation')}
                    />
                    <Input
                    label="No. of Slum Households"
                    type="number"
                    value={formData.noSlumHouseholds || ""}
                    onChange={(e) => handleInputChange("noSlumHouseholds", parseInt(e.target.value) || 0)}
                    required
                    name="noSlumHouseholds"
                    error={getFieldError('noSlumHouseholds')}
                    />
                    <Input
                    label="BPL Population"
                    type="number"
                    value={formData.bplPopulation || ""}
                    onChange={(e) => handleInputChange("bplPopulation", parseInt(e.target.value) || 0)}
                    required
                    name="bplPopulation"
                    error={getFieldError('bplPopulation')}
                    />
                    <Input
                    label="No. of BPL Households"
                    type="number"
                    value={formData.noBplHouseholdsSlum || ""}
                    onChange={(e) => handleInputChange("noBplHouseholdsSlum", parseInt(e.target.value) || 0)}
                    required
                    name="noBplHouseholdsSlum"
                    error={getFieldError('noBplHouseholdsSlum')}
                    />
                </div>
            </div>
            )}
            
            {currentStep === 2 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part C: Particulars of Survey Operation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                    label="Surveyor Name"
                    value={formData.surveyorName || user?.name || ""}
                    onChange={(e) => handleInputChange("surveyorName", e.target.value)}
                    required
                    />
                    <Input
                    label="Survey Date"
                    type="date"
                    value={formData.surveyDate || ""}
                    onChange={(e) => handleInputChange("surveyDate", e.target.value)}
                    required
                    name="surveyDate"
                    error={getFieldError('surveyDate')}
                    />
                    <Input
                    label="Receipt of Questionnaire Date"
                    type="date"
                    value={formData.receiptQuestionnaireDate || ""}
                    onChange={(e) => handleInputChange("receiptQuestionnaireDate", e.target.value)}
                    required
                    name="receiptQuestionnaireDate"
                    error={getFieldError('receiptQuestionnaireDate')}
                    />
                    <Input
                    label="Scrutiny Date"
                    type="date"
                    value={formData.scrutinyDate || ""}
                    onChange={(e) => handleInputChange("scrutinyDate", e.target.value)}
                    required
                    name="scrutinyDate"
                    error={getFieldError('scrutinyDate')}
                    />
                    <Input
                    label="Receipt by Nodal Cell Date"
                    type="date"
                    value={formData.receiptByNodalCellDate || ""}
                    onChange={(e) => handleInputChange("receiptByNodalCellDate", e.target.value)}
                    required
                    name="receiptByNodalCellDate"
                    error={getFieldError('receiptByNodalCellDate')}
                    />
                    <div className="md:col-span-2">
                        <Input
                        label="Remarks by Investigator"
                        value={formData.remarksInvestigator || ""}
                        onChange={(e) => handleInputChange("remarksInvestigator", e.target.value)}
                        placeholder="Enter remarks by investigator..."
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Input
                        label="Comments by Supervisor"
                        value={formData.commentsSupervisor || ""}
                        onChange={(e) => handleInputChange("commentsSupervisor", e.target.value)}
                        placeholder="Enter comments by supervisor..."
                        />
                    </div>
                </div>
            </div>
            )}

            {currentStep === 3 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part D: Basic Information on Slum
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                    label="Slum Code"
                    value={formData.slumCode || ""}
                    onChange={(e) => handleInputChange("slumCode", e.target.value)}
                    required
                    name="slumCode"
                    error={getFieldError('slumCode')}
                    />
                    <Input
                    label="Location Ward"
                    value={formData.locationWard || ""}
                    onChange={(e) => handleInputChange("locationWard", e.target.value)}
                    required
                    name="locationWard"
                    error={getFieldError('locationWard')}
                    />
                    <Input
                    label="Age of Slum (Years)"
                    type="number"
                    value={formData.ageSlumYears || ""}
                    onChange={(e) => handleInputChange("ageSlumYears", parseInt(e.target.value) || 0)}
                    required
                    name="ageSlumYears"
                    error={getFieldError('ageSlumYears')}
                    />
                    <Input
                    label="Area of Slum (sq Mtrs)"
                    type="number"
                    value={formData.areaSlumSqMtrs || ""}
                    onChange={(e) => handleInputChange("areaSlumSqMtrs", parseFloat(e.target.value) || 0)}
                    required
                    name="areaSlumSqMtrs"
                    error={getFieldError('areaSlumSqMtrs')}
                    />
                    <Select
                    label="Location - Core City/Town or Fringe Area"
                    value={formData.locationCoreOrFringe || ""}
                    onChange={(e) => handleInputChange("locationCoreOrFringe", e.target.value)}
                    required
                    name="locationCoreOrFringe"
                    error={getFieldError('locationCoreOrFringe')}
                    options={[
                        { value: "CORE_CITY", label: "Core City/Town" },
                        { value: "FRINGE_AREA", label: "Fringe Area" },
                    ]}
                    />
                    <Select
                    label="Type of Area Surrounding"
                    value={formData.typeAreaSurrounding || ""}
                    onChange={(e) => handleInputChange("typeAreaSurrounding", e.target.value)}
                    required
                    name="typeAreaSurrounding"
                    error={getFieldError('typeAreaSurrounding')}
                    options={[
                        { value: "RESIDENTIAL", label: "Residential" },
                        { value: "INDUSTRIAL", label: "Industrial" },
                        { value: "COMMERCIAL", label: "Commercial" },
                        { value: "INSTITUTIONAL", label: "Institutional" },
                        { value: "OTHER", label: "Other" },
                    ]}
                    />
                    <Select
                    label="Physical Location of Slum"
                    value={formData.physicalLocationSlum || ""}
                    onChange={(e) => handleInputChange("physicalLocationSlum", e.target.value)}
                    required
                    name="physicalLocationSlum"
                    error={getFieldError('physicalLocationSlum')}
                    options={[
                        { value: "ALONG_NALLAH", label: "Along Nallah (Major Stormwater Drain) -01" },
                        { value: "ALONG_OTHER_DRAINS", label: "Along Other Drains - 02" },
                        { value: "ALONG_RAILWAY_LINE", label: "Along Railway Line - 03" },
                        { value: "ALONG_MAJOR_TRANSPORT", label: "Along Major Transport Alignment -04" },
                        { value: "ALONG_RIVER_BANK", label: "Along River / Water Body Bank -05" },
                        { value: "ON_RIVER_BED", label: "On River/ Water Body Bed -06" },
                        { value: "OTHERS_HAZARDOUS", label: "Others (Hazardous or Objectionable) - 07" },
                        { value: "OTHERS_NON_HAZARDOUS", label: "Others (Non-Hazardous/Non-objectionable) - 08" },
                    ]}
                    />
                    <Select
                    label="Is Slum Notified?"
                    value={formData.isSlumNotified || ""}
                    onChange={(e) => handleInputChange("isSlumNotified", e.target.value)}
                    required
                    name="isSlumNotified"
                    error={getFieldError('isSlumNotified')}
                    options={[
                        { value: "YES", label: "Yes" },
                        { value: "NO", label: "No" },
                    ]}
                    />
                    {formData.isSlumNotified === "YES" && (
                    <Input
                        label="Year of Notification"
                        type="number"
                        value={formData.yearOfNotification || ""}
                        onChange={(e) => handleInputChange("yearOfNotification", parseInt(e.target.value) || 0)}
                        required
                        name="yearOfNotification"
                        error={getFieldError('yearOfNotification')}
                    />
                    )}
                </div>
            </div>
            )}

            {currentStep === 4 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part E: Land Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                    label="Ownership of Land"
                    value={formData.ownershipLandDetail || ""}
                    onChange={(e) => handleInputChange("ownershipLandDetail", e.target.value)}
                    required
                    name="ownershipLandDetail"
                    error={getFieldError('ownershipLandDetail')}
                    options={[
                        { value: "LOCAL_BODY", label: "Public: Local Body" },
                        { value: "STATE_GOVERNMENT", label: "Public: State Government" },
                        { value: "CENTRAL_GOVERNMENT", label: "Public: Central Government" },
                        { value: "PRIVATE", label: "Private" },
                        { value: "OTHER", label: "Other" },
                    ]}
                    />
                    <div className="md:col-span-2">
                        <Input
                        label="Specify Ownership (if Other)"
                        value={formData.ownershipLandSpecify || ""}
                        onChange={(e) => handleInputChange("ownershipLandSpecify", e.target.value)}
                        placeholder="Specify ownership details..."
                        required
                        name="ownershipLandSpecify"
                        error={getFieldError('ownershipLandSpecify')}
                        />
                    </div>
                </div>
            </div>
            )}

            {currentStep === 5 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part F: Demographic Profile
                </h2>
                <div className="space-y-6">
                    {/* Question 12 - Population & Health */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. Total Population in Slum</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.totalPopulationSlumSC || ""}
                            onChange={(e) => handleInputChange("totalPopulationSlumSC", parseInt(e.target.value) || 0)}
                            required
                            name="totalPopulationSlumSC"
                            error={getFieldError('totalPopulationSlumSC')}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.totalPopulationSlumST || ""}
                            onChange={(e) => handleInputChange("totalPopulationSlumST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.totalPopulationSlumOBC || ""}
                            onChange={(e) => handleInputChange("totalPopulationSlumOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.totalPopulationSlumOthers || ""}
                            onChange={(e) => handleInputChange("totalPopulationSlumOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.totalPopulationSlumMinorities || ""}
                            onChange={(e) => handleInputChange("totalPopulationSlumMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.totalPopulationSlum || ""}
                            onChange={(e) => handleInputChange("totalPopulationSlum", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 12 - BPL Population in Slum */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. BPL Population in Slum</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.bplPopulationSlumSC || ""}
                            onChange={(e) => handleInputChange("bplPopulationSlumSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.bplPopulationSlumST || ""}
                            onChange={(e) => handleInputChange("bplPopulationSlumST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.bplPopulationSlumOBC || ""}
                            onChange={(e) => handleInputChange("bplPopulationSlumOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.bplPopulationSlumOthers || ""}
                            onChange={(e) => handleInputChange("bplPopulationSlumOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.bplPopulationSlumMinorities || ""}
                            onChange={(e) => handleInputChange("bplPopulationSlumMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.bplPopulationSlum || ""}
                            onChange={(e) => handleInputChange("bplPopulationSlum", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 12 - No. of Households in Slum */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. No. of Households in Slum</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noHouseholdsSlumSC || ""}
                            onChange={(e) => handleInputChange("noHouseholdsSlumSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noHouseholdsSlumST || ""}
                            onChange={(e) => handleInputChange("noHouseholdsSlumST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noHouseholdsSlumOBC || ""}
                            onChange={(e) => handleInputChange("noHouseholdsSlumOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noHouseholdsSlumOthers || ""}
                            onChange={(e) => handleInputChange("noHouseholdsSlumOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noHouseholdsSlumMinorities || ""}
                            onChange={(e) => handleInputChange("noHouseholdsSlumMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noHouseholdsSlum || ""}
                            onChange={(e) => handleInputChange("noHouseholdsSlum", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 12 - No. of BPL Households */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. No. of BPL Households</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noBplHouseholdsSC || ""}
                            onChange={(e) => handleInputChange("noBplHouseholdsSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noBplHouseholdsST || ""}
                            onChange={(e) => handleInputChange("noBplHouseholdsST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noBplHouseholdsOBC || ""}
                            onChange={(e) => handleInputChange("noBplHouseholdsOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noBplHouseholdsOthers || ""}
                            onChange={(e) => handleInputChange("noBplHouseholdsOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noBplHouseholdsMinorities || ""}
                            onChange={(e) => handleInputChange("noBplHouseholdsMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noBplHouseholdsTotal || ""}
                            onChange={(e) => handleInputChange("noBplHouseholdsTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 12 - No. of Women-headed Households */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. No. of Women-headed Households</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noWomenHeadedHouseholdsSC || ""}
                            onChange={(e) => handleInputChange("noWomenHeadedHouseholdsSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noWomenHeadedHouseholdsST || ""}
                            onChange={(e) => handleInputChange("noWomenHeadedHouseholdsST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noWomenHeadedHouseholdsOBC || ""}
                            onChange={(e) => handleInputChange("noWomenHeadedHouseholdsOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noWomenHeadedHouseholdsOthers || ""}
                            onChange={(e) => handleInputChange("noWomenHeadedHouseholdsOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noWomenHeadedHouseholdsMinorities || ""}
                            onChange={(e) => handleInputChange("noWomenHeadedHouseholdsMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noWomenHeadedHouseholdsTotal || ""}
                            onChange={(e) => handleInputChange("noWomenHeadedHouseholdsTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 12 - No of Persons older than 65 Years */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. No of Persons older than 65 Years</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noPersonsOlder65SC || ""}
                            onChange={(e) => handleInputChange("noPersonsOlder65SC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noPersonsOlder65ST || ""}
                            onChange={(e) => handleInputChange("noPersonsOlder65ST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noPersonsOlder65OBC || ""}
                            onChange={(e) => handleInputChange("noPersonsOlder65OBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noPersonsOlder65Others || ""}
                            onChange={(e) => handleInputChange("noPersonsOlder65Others", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noPersonsOlder65Minorities || ""}
                            onChange={(e) => handleInputChange("noPersonsOlder65Minorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noPersonsOlder65Total || ""}
                            onChange={(e) => handleInputChange("noPersonsOlder65Total", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 12 - No of Child Labourers */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. No of Child Labourers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noChildLabourersSC || ""}
                            onChange={(e) => handleInputChange("noChildLabourersSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noChildLabourersST || ""}
                            onChange={(e) => handleInputChange("noChildLabourersST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noChildLabourersOBC || ""}
                            onChange={(e) => handleInputChange("noChildLabourersOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noChildLabourersOthers || ""}
                            onChange={(e) => handleInputChange("noChildLabourersOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noChildLabourersMinorities || ""}
                            onChange={(e) => handleInputChange("noChildLabourersMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noChildLabourersTotal || ""}
                            onChange={(e) => handleInputChange("noChildLabourersTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 12 - No. of Physically Challenged Persons */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. No. of Physically Challenged Persons</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noPhysicallyChallengedSC || ""}
                            onChange={(e) => handleInputChange("noPhysicallyChallengedSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noPhysicallyChallengedST || ""}
                            onChange={(e) => handleInputChange("noPhysicallyChallengedST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noPhysicallyChallengedOBC || ""}
                            onChange={(e) => handleInputChange("noPhysicallyChallengedOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noPhysicallyChallengedOthers || ""}
                            onChange={(e) => handleInputChange("noPhysicallyChallengedOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noPhysicallyChallengedMinorities || ""}
                            onChange={(e) => handleInputChange("noPhysicallyChallengedMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noPhysicallyChallengedTotal || ""}
                            onChange={(e) => handleInputChange("noPhysicallyChallengedTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 12 - No. of Mentally Challenged Persons */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. No. of Mentally Challenged Persons</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noMentallyChallengedSC || ""}
                            onChange={(e) => handleInputChange("noMentallyChallengedSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noMentallyChallengedST || ""}
                            onChange={(e) => handleInputChange("noMentallyChallengedST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noMentallyChallengedOBC || ""}
                            onChange={(e) => handleInputChange("noMentallyChallengedOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noMentallyChallengedOthers || ""}
                            onChange={(e) => handleInputChange("noMentallyChallengedOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noMentallyChallengedMinorities || ""}
                            onChange={(e) => handleInputChange("noMentallyChallengedMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noMentallyChallengedTotal || ""}
                            onChange={(e) => handleInputChange("noMentallyChallengedTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 12 - No.of Persons with HIV-AIDs */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. No.of Persons with HIV-AIDs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noPersonsHivaidsSC || ""}
                            onChange={(e) => handleInputChange("noPersonsHivaidsSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noPersonsHivaidsST || ""}
                            onChange={(e) => handleInputChange("noPersonsHivaidsST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noPersonsHivaidsOBC || ""}
                            onChange={(e) => handleInputChange("noPersonsHivaidsOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noPersonsHivaidsOthers || ""}
                            onChange={(e) => handleInputChange("noPersonsHivaidsOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noPersonsHivaidsMinorities || ""}
                            onChange={(e) => handleInputChange("noPersonsHivaidsMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noPersonsHivaidsTotal || ""}
                            onChange={(e) => handleInputChange("noPersonsHivaidsTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 12 - No. of Persons with Tuberculosis */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. No. of Persons with Tuberculosis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noPersonsTuberculosisSC || ""}
                            onChange={(e) => handleInputChange("noPersonsTuberculosisSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noPersonsTuberculosisST || ""}
                            onChange={(e) => handleInputChange("noPersonsTuberculosisST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noPersonsTuberculosisOBC || ""}
                            onChange={(e) => handleInputChange("noPersonsTuberculosisOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noPersonsTuberculosisOthers || ""}
                            onChange={(e) => handleInputChange("noPersonsTuberculosisOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noPersonsTuberculosisMinorities || ""}
                            onChange={(e) => handleInputChange("noPersonsTuberculosisMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noPersonsTuberculosisTotal || ""}
                            onChange={(e) => handleInputChange("noPersonsTuberculosisTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 12 - No. of Persons with Respiratory Diseases including Asthma */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. No. of Persons with Respiratory Diseases including Asthma</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noPersonsRespiratorySC || ""}
                            onChange={(e) => handleInputChange("noPersonsRespiratorySC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noPersonsRespiratoryST || ""}
                            onChange={(e) => handleInputChange("noPersonsRespiratoryST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noPersonsRespiratoryOBC || ""}
                            onChange={(e) => handleInputChange("noPersonsRespiratoryOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noPersonsRespiratoryOthers || ""}
                            onChange={(e) => handleInputChange("noPersonsRespiratoryOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noPersonsRespiratoryMinorities || ""}
                            onChange={(e) => handleInputChange("noPersonsRespiratoryMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noPersonsRespiratoryTotal || ""}
                            onChange={(e) => handleInputChange("noPersonsRespiratoryTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 12 - No. of Persons with Other Chronic Diseases */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">12. No. of Persons with Other Chronic Diseases</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noPersonsOtherChronicSC || ""}
                            onChange={(e) => handleInputChange("noPersonsOtherChronicSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noPersonsOtherChronicST || ""}
                            onChange={(e) => handleInputChange("noPersonsOtherChronicST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noPersonsOtherChronicOBC || ""}
                            onChange={(e) => handleInputChange("noPersonsOtherChronicOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noPersonsOtherChronicOthers || ""}
                            onChange={(e) => handleInputChange("noPersonsOtherChronicOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noPersonsOtherChronicMinorities || ""}
                            onChange={(e) => handleInputChange("noPersonsOtherChronicMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noPersonsOtherChronicTotal || ""}
                            onChange={(e) => handleInputChange("noPersonsOtherChronicTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 13 - Literacy - Education (section header) */}
                    <div className="border-t border-slate-700 pt-6 mt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">13. Literacy - Education</h3>
                        <p className="text-slate-300 text-sm">Proceeding to literacy and education questions...</p>
                    </div>
                </div>
            </div>
            )}

            {currentStep === 6 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part G: Literacy & Education
                </h2>
                <div className="space-y-6">
                    {/* Question 13 - Total No of Illiterate Persons */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">13. Total No of Illiterate Persons</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.totalIlliteratePersonsSC || ""}
                            onChange={(e) => handleInputChange("totalIlliteratePersonsSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.totalIlliteratePersonsST || ""}
                            onChange={(e) => handleInputChange("totalIlliteratePersonsST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.totalIlliteratePersonsOBC || ""}
                            onChange={(e) => handleInputChange("totalIlliteratePersonsOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.totalIlliteratePersonsOthers || ""}
                            onChange={(e) => handleInputChange("totalIlliteratePersonsOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.totalIlliteratePersonsMinorities || ""}
                            onChange={(e) => handleInputChange("totalIlliteratePersonsMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.totalIlliteratePersonsTotal || ""}
                            onChange={(e) => handleInputChange("totalIlliteratePersonsTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 13 - No. of Male Illiterate */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">13. No. of Male Illiterate</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noMaleIlliterateSC || ""}
                            onChange={(e) => handleInputChange("noMaleIlliterateSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noMaleIlliterateST || ""}
                            onChange={(e) => handleInputChange("noMaleIlliterateST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noMaleIlliterateOBC || ""}
                            onChange={(e) => handleInputChange("noMaleIlliterateOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noMaleIlliterateOthers || ""}
                            onChange={(e) => handleInputChange("noMaleIlliterateOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noMaleIlliterateMinorities || ""}
                            onChange={(e) => handleInputChange("noMaleIlliterateMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noMaleIlliterateTotal || ""}
                            onChange={(e) => handleInputChange("noMaleIlliterateTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 13 - No. of Female Illiterate */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">13. No. of Female Illiterate</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noFemaleIlliterateSC || ""}
                            onChange={(e) => handleInputChange("noFemaleIlliterateSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noFemaleIlliterateST || ""}
                            onChange={(e) => handleInputChange("noFemaleIlliterateST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noFemaleIlliterateOBC || ""}
                            onChange={(e) => handleInputChange("noFemaleIlliterateOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noFemaleIlliterateOthers || ""}
                            onChange={(e) => handleInputChange("noFemaleIlliterateOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noFemaleIlliterateMinorities || ""}
                            onChange={(e) => handleInputChange("noFemaleIlliterateMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noFemaleIlliterateTotal || ""}
                            onChange={(e) => handleInputChange("noFemaleIlliterateTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 13 - No. of BPL Illiterate Persons */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">13. No. of BPL Illiterate Persons</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noBplIlliteratePersonsSC || ""}
                            onChange={(e) => handleInputChange("noBplIlliteratePersonsSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noBplIlliteratePersonsST || ""}
                            onChange={(e) => handleInputChange("noBplIlliteratePersonsST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noBplIlliteratePersonsOBC || ""}
                            onChange={(e) => handleInputChange("noBplIlliteratePersonsOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noBplIlliteratePersonsOthers || ""}
                            onChange={(e) => handleInputChange("noBplIlliteratePersonsOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noBplIlliteratePersonsMinorities || ""}
                            onChange={(e) => handleInputChange("noBplIlliteratePersonsMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noBplIlliteratePersonsTotal || ""}
                            onChange={(e) => handleInputChange("noBplIlliteratePersonsTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 13 - No. of Male BPL Illiterate */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">13. No. of Male BPL Illiterate</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noMaleBplIlliterateSC || ""}
                            onChange={(e) => handleInputChange("noMaleBplIlliterateSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noMaleBplIlliterateST || ""}
                            onChange={(e) => handleInputChange("noMaleBplIlliterateST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noMaleBplIlliterateOBC || ""}
                            onChange={(e) => handleInputChange("noMaleBplIlliterateOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noMaleBplIlliterateOthers || ""}
                            onChange={(e) => handleInputChange("noMaleBplIlliterateOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noMaleBplIlliterateMinorities || ""}
                            onChange={(e) => handleInputChange("noMaleBplIlliterateMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noMaleBplIlliterateTotal || ""}
                            onChange={(e) => handleInputChange("noMaleBplIlliterateTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 13 - No. of Female BPL Illiterate */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">13. No. of Female BPL Illiterate</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.noFemaleBplIlliterateSC || ""}
                            onChange={(e) => handleInputChange("noFemaleBplIlliterateSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.noFemaleBplIlliterateST || ""}
                            onChange={(e) => handleInputChange("noFemaleBplIlliterateST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.noFemaleBplIlliterateOBC || ""}
                            onChange={(e) => handleInputChange("noFemaleBplIlliterateOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.noFemaleBplIlliterateOthers || ""}
                            onChange={(e) => handleInputChange("noFemaleBplIlliterateOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.noFemaleBplIlliterateMinorities || ""}
                            onChange={(e) => handleInputChange("noFemaleBplIlliterateMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.noFemaleBplIlliterateTotal || ""}
                            onChange={(e) => handleInputChange("noFemaleBplIlliterateTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 13 - School Dropouts – Male */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">13. School Dropouts – Male</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.schoolDropoutsMaleSC || ""}
                            onChange={(e) => handleInputChange("schoolDropoutsMaleSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.schoolDropoutsMaleST || ""}
                            onChange={(e) => handleInputChange("schoolDropoutsMaleST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.schoolDropoutsMaleOBC || ""}
                            onChange={(e) => handleInputChange("schoolDropoutsMaleOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.schoolDropoutsMaleOthers || ""}
                            onChange={(e) => handleInputChange("schoolDropoutsMaleOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.schoolDropoutsMaleMinorities || ""}
                            onChange={(e) => handleInputChange("schoolDropoutsMaleMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.schoolDropoutsMaleTotal || ""}
                            onChange={(e) => handleInputChange("schoolDropoutsMaleTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {/* Question 13 - School Dropouts – Female */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">13. School Dropouts – Female</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="SC"
                            type="number"
                            value={formData.schoolDropoutsFemaleSC || ""}
                            onChange={(e) => handleInputChange("schoolDropoutsFemaleSC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="ST"
                            type="number"
                            value={formData.schoolDropoutsFemaleST || ""}
                            onChange={(e) => handleInputChange("schoolDropoutsFemaleST", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="OBC"
                            type="number"
                            value={formData.schoolDropoutsFemaleOBC || ""}
                            onChange={(e) => handleInputChange("schoolDropoutsFemaleOBC", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.schoolDropoutsFemaleOthers || ""}
                            onChange={(e) => handleInputChange("schoolDropoutsFemaleOthers", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Minorities"
                            type="number"
                            value={formData.schoolDropoutsFemaleMinorities || ""}
                            onChange={(e) => handleInputChange("schoolDropoutsFemaleMinorities", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.schoolDropoutsFemaleTotal || ""}
                            onChange={(e) => handleInputChange("schoolDropoutsFemaleTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            )}

            {currentStep === 7 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part H: Housing Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                    label="Dwelling Units - Pucca"
                    type="number"
                    value={formData.dwellingUnitsPucca || ""}
                    onChange={(e) => handleInputChange("dwellingUnitsPucca", parseInt(e.target.value) || 0)}
                    required
                    name="dwellingUnitsPucca"
                    error={getFieldError('dwellingUnitsPucca')}
                    />
                    <Input
                    label="Dwelling Units - Semi-Pucca"
                    type="number"
                    value={formData.dwellingUnitsSemiPucca || ""}
                    onChange={(e) => handleInputChange("dwellingUnitsSemiPucca", parseInt(e.target.value) || 0)}
                    required
                    name="dwellingUnitsSemiPucca"
                    error={getFieldError('dwellingUnitsSemiPucca')}
                    />
                    <Input
                    label="Dwelling Units - Katcha"
                    type="number"
                    value={formData.dwellingUnitsKatcha || ""}
                    onChange={(e) => handleInputChange("dwellingUnitsKatcha", parseInt(e.target.value) || 0)}
                    required
                    name="dwellingUnitsKatcha"
                    error={getFieldError('dwellingUnitsKatcha')}
                    />
                    <Input
                    label="Dwelling Units - Total"
                    type="number"
                    value={formData.dwellingUnitsTotal || ""}
                    onChange={(e) => handleInputChange("dwellingUnitsTotal", parseInt(e.target.value) || 0)}
                    required
                    name="dwellingUnitsTotal"
                    error={getFieldError('dwellingUnitsTotal')}
                    />
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-white mb-4">Land Tenure</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="With Patta"
                            type="number"
                            value={formData.landTenureWithPatta || ""}
                            onChange={(e) => handleInputChange("landTenureWithPatta", parseInt(e.target.value) || 0)}
                            required
                            name="landTenureWithPatta"
                            error={getFieldError('landTenureWithPatta')}
                            />
                            <Input
                            label="Possession Certificate"
                            type="number"
                            value={formData.landTenurePossessionCertificate || ""}
                            onChange={(e) => handleInputChange("landTenurePossessionCertificate", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Encroached Private"
                            type="number"
                            value={formData.landTenureEncroachedPrivate || ""}
                            onChange={(e) => handleInputChange("landTenureEncroachedPrivate", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Encroached Public"
                            type="number"
                            value={formData.landTenureEncroachedPublic || ""}
                            onChange={(e) => handleInputChange("landTenureEncroachedPublic", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="On Rent"
                            type="number"
                            value={formData.landTenureOnRent || ""}
                            onChange={(e) => handleInputChange("landTenureOnRent", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Other"
                            type="number"
                            value={formData.landTenureOther || ""}
                            onChange={(e) => handleInputChange("landTenureOther", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Total"
                            type="number"
                            value={formData.landTenureTotal || ""}
                            onChange={(e) => handleInputChange("landTenureTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            )}

            {currentStep === 8 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part I: Economic Status of Households
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                    label="Less than ₹500"
                    type="number"
                    value={formData.economicStatus?.lessThan500 || ""}
                    onChange={(e) => handleNestedInputChange("economicStatus", "lessThan500", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="₹500 to ₹1000"
                    type="number"
                    value={formData.economicStatus?.rs500to1000 || ""}
                    onChange={(e) => handleNestedInputChange("economicStatus", "rs500to1000", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="₹1000 to ₹1500"
                    type="number"
                    value={formData.economicStatus?.rs1000to1500 || ""}
                    onChange={(e) => handleNestedInputChange("economicStatus", "rs1000to1500", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="₹1500 to ₹2000"
                    type="number"
                    value={formData.economicStatus?.rs1500to2000 || ""}
                    onChange={(e) => handleNestedInputChange("economicStatus", "rs1500to2000", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="₹2000 to ₹3000"
                    type="number"
                    value={formData.economicStatus?.rs2000to3000 || ""}
                    onChange={(e) => handleNestedInputChange("economicStatus", "rs2000to3000", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="More than ₹3000"
                    type="number"
                    value={formData.economicStatus?.moreThan3000 || ""}
                    onChange={(e) => handleNestedInputChange("economicStatus", "moreThan3000", parseInt(e.target.value) || 0)}
                    />
                </div>
            </div>
            )}

            {currentStep === 9 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part J: Occupation Status of Households
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                    label="Self Employed"
                    type="number"
                    value={formData.occupationalStatus?.selfEmployed || ""}
                    onChange={(e) => handleNestedInputChange("occupationalStatus", "selfEmployed", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="Salaried"
                    type="number"
                    value={formData.occupationalStatus?.salaried || ""}
                    onChange={(e) => handleNestedInputChange("occupationalStatus", "salaried", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="Regular Wage"
                    type="number"
                    value={formData.occupationalStatus?.regularWage || ""}
                    onChange={(e) => handleNestedInputChange("occupationalStatus", "regularWage", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="Casual Labour"
                    type="number"
                    value={formData.occupationalStatus?.casualLabour || ""}
                    onChange={(e) => handleNestedInputChange("occupationalStatus", "casualLabour", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="Others"
                    type="number"
                    value={formData.occupationalStatus?.others || ""}
                    onChange={(e) => handleNestedInputChange("occupationalStatus", "others", parseInt(e.target.value) || 0)}
                    />
                </div>
            </div>
            )}

            {currentStep === 10 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part K: Access to Physical Infrastructure
                </h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Source of Drinking Water</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="Individual Tap"
                            type="number"
                            value={formData.sourceDrinkingWater?.individualTap || ""}
                            onChange={(e) => handleNestedInputChange("sourceDrinkingWater", "individualTap", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Tube-well/Borewell/Handpump"
                            type="number"
                            value={formData.sourceDrinkingWater?.tubewellBorewellHandpump || ""}
                            onChange={(e) => handleNestedInputChange("sourceDrinkingWater", "tubewellBorewellHandpump", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Public Tap"
                            type="number"
                            value={formData.sourceDrinkingWater?.publicTap || ""}
                            onChange={(e) => handleNestedInputChange("sourceDrinkingWater", "publicTap", parseInt(e.target.value) || 0)}
                            />  
                            <Input
                            label="Open-well"
                            type="number"
                            value={formData.sourceDrinkingWater?.openwell || ""}
                            onChange={(e) => handleNestedInputChange("sourceDrinkingWater", "openwell", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Tank/Pond"
                            type="number"
                            value={formData.sourceDrinkingWater?.tankPond || ""}
                            onChange={(e) => handleNestedInputChange("sourceDrinkingWater", "tankPond", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="River/Canal/Lake/Spring"
                            type="number"
                            value={formData.sourceDrinkingWater?.riverCanalLakeSpring || ""}
                            onChange={(e) => handleNestedInputChange("sourceDrinkingWater", "riverCanalLakeSpring", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Water Tanker"
                            type="number"
                            value={formData.sourceDrinkingWater?.waterTanker || ""}
                            onChange={(e) => handleNestedInputChange("sourceDrinkingWater", "waterTanker", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Others"
                            type="number"
                            value={formData.sourceDrinkingWater?.others || ""}
                            onChange={(e) => handleNestedInputChange("sourceDrinkingWater", "others", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                        label="Connectivity to City Water Supply"
                        value={formData.connectivityCityWaterSupply || ""}
                        onChange={(e) => handleInputChange("connectivityCityWaterSupply", e.target.value)}
                        options={[
                            { value: "FULLY_CONNECTED", label: "Fully Connected" },
                            { value: "PARTIALLY_CONNECTED", label: "Partially Connected" },
                            { value: "NOT_CONNECTED", label: "Not Connected" },
                        ]}
                        />
                        <Select
                        label="Drainage/Sewerage Facility"
                        value={formData.drainageSewerageFacility || ""}
                        onChange={(e) => handleInputChange("drainageSewerageFacility", e.target.value)}
                        options={[
                            { value: "YES", label: "Yes" },
                            { value: "NO", label: "No" },
                        ]}
                        />
                        <Select
                        label="Connectivity to Storm Water Drainage"
                        value={formData.connectivityStormWaterDrainage || ""}
                        onChange={(e) => handleInputChange("connectivityStormWaterDrainage", e.target.value)}
                        options={[
                            { value: "FULLY_CONNECTED", label: "Fully Connected" },
                            { value: "PARTIALLY_CONNECTED", label: "Partially Connected" },
                            { value: "NOT_CONNECTED", label: "Not Connected" },
                        ]}
                        />
                        <Select
                        label="Connectivity to Sewerage System"
                        value={formData.connectivitySewerageSystem || ""}
                        onChange={(e) => handleInputChange("connectivitySewerageSystem", e.target.value)}
                        options={[
                            { value: "FULLY_CONNECTED", label: "Fully Connected" },
                            { value: "PARTIALLY_CONNECTED", label: "Partially Connected" },
                            { value: "NOT_CONNECTED", label: "Not Connected" },
                        ]}
                        />
                        <Select
                        label="Prone to Flooding"
                        value={formData.proneToFlooding || ""}
                        onChange={(e) => handleInputChange("proneToFlooding", e.target.value)}
                        options={[
                            { value: "NOT_PRONE", label: "Not Prone" },
                            { value: "UPTO_15_DAYS", label: "Up to 15 Days" },
                            { value: "DAYS_15_TO_30", label: "15-30 Days" },
                            { value: "MORE_THAN_MONTH", label: "More than a Month" },
                        ]}
                        />
                    </div>
                    
                    {/* Question 20 - Latrine facility used by Households */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">20. Latrine facility used by Households</h3>
                        <Select
                        label="Latrine Facility"
                        value={formData.latrineFacility || ""}
                        onChange={(e) => handleInputChange("latrineFacility", e.target.value)}
                        options={[
                            { value: "PUBLIC_LATRINE", label: "Public Latrine" },
                            { value: "SHARED_LATRINE", label: "Shared Latrine" },
                            { value: "OWN_LATRINE", label: "Own Latrine" },
                        ]}
                        />
                    </div>
                    
                    {/* Solid Waste Management Section (Questions 21a-21c) */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Solid Waste Management</h3>
                        
                        {/* Question 21a - Frequency of Garbage Disposal */}
                        <div className="mb-6">
                            <h4 className="text-md font-medium text-white mb-2">21a. Frequency of Garbage Disposal</h4>
                            <Select
                            label="Frequency"
                            value={formData.frequencyOfGarbageDisposal || ""}
                            onChange={(e) => handleInputChange("frequencyOfGarbageDisposal", e.target.value)}
                            options={[
                                { value: "DAILY", label: "Daily" },
                                { value: "ONCE_IN_2_DAYS", label: "Once in 2 days" },
                                { value: "ONCE_IN_WEEK", label: "Once in a week" },
                                { value: "ONCE_IN_15_DAYS", label: "Once in 15 days" },
                                { value: "NO_COLLECTION", label: "No collection" },
                            ]}
                            />
                        </div>
                        
                        {/* Question 21b - Arrangement for Garbage Disposal */}
                        <div className="mb-6">
                            <h4 className="text-md font-medium text-white mb-2">21b. Arrangement for Garbage Disposal</h4>
                            <Select
                            label="Arrangement"
                            value={formData.arrangementForGarbageDisposal || ""}
                            onChange={(e) => handleInputChange("arrangementForGarbageDisposal", e.target.value)}
                            options={[
                                { value: "MUNICIPAL_STAFF", label: "Municipal staff" },
                                { value: "MUNICIPAL_CONTRACTOR", label: "Municipal Contractor" },
                                { value: "RESIDENTS_THEMSELVES", label: "Residents themselves" },
                                { value: "OTHERS", label: "Others" },
                                { value: "NO_ARRANGEMENT", label: "No arrangement" },
                            ]}
                            />
                        </div>
                        
                        {/* Question 21c - Frequency of Clearance of Open Drains */}
                        <div>
                            <h4 className="text-md font-medium text-white mb-2">21c. Frequency of Clearance of Open Drains</h4>
                            <Select
                            label="Frequency"
                            value={formData.frequencyOfClearanceOfOpenDrains || ""}
                            onChange={(e) => handleInputChange("frequencyOfClearanceOfOpenDrains", e.target.value)}
                            options={[
                                { value: "DAILY", label: "Daily" },
                                { value: "ONCE_IN_2_DAYS", label: "Once in 2 days" },
                                { value: "ONCE_IN_WEEK", label: "Once in a week" },
                                { value: "ONCE_IN_15_DAYS", label: "Once in 15 days" },
                                { value: "NO_CLEARANCE", label: "No clearance" },
                            ]}
                            />
                        </div>
                    </div>
                    
                    {/* Additional Physical Infrastructure (Questions 22-25) */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Additional Physical Infrastructure</h3>
                        
                        {/* Question 22 - Approach Road/Lane/Constructed Path */}
                        <div className="mb-4">
                            <h4 className="text-md font-medium text-white mb-2">22. Approach Road/Lane/Constructed Path to the Slum</h4>
                            <Select
                            label="Road Type"
                            value={formData.approachRoadType || ""}
                            onChange={(e) => handleInputChange("approachRoadType", e.target.value)}
                            options={[
                                { value: "MOTORABLE_PUCCA", label: "Motorable pucca" },
                                { value: "MOTORABLE_KATCHA", label: "Motorable katcha" },
                                { value: "NON_MOTORABLE_PUCCA", label: "Non-motorable pucca" },
                                { value: "NON_MOTORABLE_KATCHA", label: "Non-motorable katcha" },
                            ]}
                            />
                        </div>
                        
                        {/* Question 23 - Distance from the nearest Motorable Road */}
                        <div className="mb-4">
                            <h4 className="text-md font-medium text-white mb-2">23. Distance from the nearest Motorable Road</h4>
                            <Select
                            label="Distance"
                            value={formData.distanceToNearestMotorableRoad || ""}
                            onChange={(e) => handleInputChange("distanceToNearestMotorableRoad", e.target.value)}
                            options={[
                                { value: "LESS_THAN_0_5_KMS", label: "Less than 0.5 kms" },
                                { value: "0_5_TO_1_0_KM", label: "0.5 to 1.0 km" },
                                { value: "1_0_TO_2_0_KM", label: "1.0 km to 2.0 km" },
                                { value: "2_0_TO_5_0_KM", label: "2.0 km to 5.0 km" },
                                { value: "MORE_THAN_5_0_KM", label: "More than 5.0 km" },
                            ]}
                            />
                        </div>
                        
                        {/* Question 24 - Internal Road */}
                        <div className="mb-4">
                            <h4 className="text-md font-medium text-white mb-2">24. Internal Road</h4>
                            <Select
                            label="Road Type"
                            value={formData.internalRoadType || ""}
                            onChange={(e) => handleInputChange("internalRoadType", e.target.value)}
                            options={[
                                { value: "MOTORABLE_PUCCA", label: "Motorable pucca" },
                                { value: "MOTORABLE_KATCHA", label: "Motorable kutcha" },
                                { value: "NON_MOTORABLE_PUCCA", label: "Non-motorable pucca" },
                                { value: "NON_MOTORABLE_KATCHA", label: "Non-motorable katcha" },
                            ]}
                            />
                        </div>
                        
                        {/* Question 25 - Street light facility */}
                        <div>
                            <h4 className="text-md font-medium text-white mb-2">25. Whether Street light facility is available in the Slum</h4>
                            <Select
                            label="Street Light Available"
                            value={formData.streetLightAvailable || ""}
                            onChange={(e) => handleInputChange("streetLightAvailable", e.target.value)}
                            options={[
                                { value: "YES", label: "Yes" },
                                { value: "NO", label: "No" },
                            ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
            )}

            {currentStep === 11 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part L: Education Facilities (Questions 26-30)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                    label="26a. Anganwadi under ICDS"
                    type="number"
                    value={formData.anganwadiUnderIcds || ""}
                    onChange={(e) => handleInputChange("anganwadiUnderIcds", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="26b. Municipal pre-school"
                    type="number"
                    value={formData.municipalPreschool || ""}
                    onChange={(e) => handleInputChange("municipalPreschool", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="26c. Private pre-school"
                    type="number"
                    value={formData.privatePreschool || ""}
                    onChange={(e) => handleInputChange("privatePreschool", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="27a. Municipal"
                    type="number"
                    value={formData.municipalPrimarySchool || ""}
                    onChange={(e) => handleInputChange("municipalPrimarySchool", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="27b. State Government"
                    type="number"
                    value={formData.stateGovtPrimarySchool || ""}
                    onChange={(e) => handleInputChange("stateGovtPrimarySchool", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="27c. Private"
                    type="number"
                    value={formData.privatePrimarySchool || ""}
                    onChange={(e) => handleInputChange("privatePrimarySchool", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="28a. Municipal"
                    type="number"
                    value={formData.municipalHighSchool || ""}
                    onChange={(e) => handleInputChange("municipalHighSchool", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="28b. State Government"
                    type="number"
                    value={formData.stateGovtHighSchool || ""}
                    onChange={(e) => handleInputChange("stateGovtHighSchool", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="28c. Private"
                    type="number"
                    value={formData.privateHighSchool || ""}
                    onChange={(e) => handleInputChange("privateHighSchool", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="29. Adult Education Centre"
                    type="number"
                    value={formData.adultEducationCentre || ""}
                    onChange={(e) => handleInputChange("adultEducationCentre", parseInt(e.target.value) || 0)}
                    />
                    <Input
                    label="30. Non-formal Education Centre"
                    type="number"
                    value={formData.nonFormalEducationCentre || ""}
                    onChange={(e) => handleInputChange("nonFormalEducationCentre", parseInt(e.target.value) || 0)}
                    />
                </div>
            </div>
            )}

            {currentStep === 12 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part M: Health Facilities (Question 31)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                    label="31. Urban Health Post"
                    value={formData.urbanHealthPost || ""}
                    onChange={(e) => handleInputChange("urbanHealthPost", e.target.value)}
                    options={[
                        { value: "YES", label: "Yes" },
                        { value: "NO", label: "No" },
                    ]}
                    />
                    <Select
                    label="31. Primary Health Centre"
                    value={formData.primaryHealthCentre || ""}
                    onChange={(e) => handleInputChange("primaryHealthCentre", e.target.value)}
                    options={[
                        { value: "YES", label: "Yes" },
                        { value: "NO", label: "No" },
                    ]}
                    />
                    <Select
                    label="31. Government Hospital"
                    value={formData.governmentHospital || ""}
                    onChange={(e) => handleInputChange("governmentHospital", e.target.value)}
                    options={[
                        { value: "YES", label: "Yes" },
                        { value: "NO", label: "No" },
                    ]}
                    />
                    <Select
                    label="31. Maternity Centre"
                    value={formData.maternityCentre || ""}
                    onChange={(e) => handleInputChange("maternityCentre", e.target.value)}
                    options={[
                        { value: "YES", label: "Yes" },
                        { value: "NO", label: "No" },
                    ]}
                    />
                    <Select
                    label="31. Private Clinic"
                    value={formData.privateClinic || ""}
                    onChange={(e) => handleInputChange("privateClinic", e.target.value)}
                    options={[
                        { value: "YES", label: "Yes" },
                        { value: "NO", label: "No" },
                    ]}
                    />
                    <Select
                    label="31. Registered Medical Practitioner (RMP)"
                    value={formData.rmp || ""}
                    onChange={(e) => handleInputChange("rmp", e.target.value)}
                    options={[
                        { value: "YES", label: "Yes" },
                        { value: "NO", label: "No" },
                    ]}
                    />
                    <Select
                    label="31. Ayurvedic Doctor/Vaidya"
                    value={formData.ayurvedicDoctor || ""}
                    onChange={(e) => handleInputChange("ayurvedicDoctor", e.target.value)}
                    options={[
                        { value: "YES", label: "Yes" },
                        { value: "NO", label: "No" },
                    ]}
                    />
                </div>
            </div>
            )}

            {currentStep === 13 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Part N: Social Development/Welfare (Questions 32-36c)
                </h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">32. Availability of Facilities within Slum:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="32. Community Hall"
                            type="number"
                            value={formData.communityHall || ""}
                            onChange={(e) => handleInputChange("communityHall", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="32. Livelihood/Production Centre"
                            type="number"
                            value={formData.livelihoodProductionCentre || ""}
                            onChange={(e) => handleInputChange("livelihoodProductionCentre", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="32. Vocational training/Training-cum-production Centre"
                            type="number"
                            value={formData.vocationalTrainingCentre || ""}
                            onChange={(e) => handleInputChange("vocationalTrainingCentre", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="32. Street Children Rehabilitation Centre"
                            type="number"
                            value={formData.streetChildrenRehabilitationCentre || ""}
                            onChange={(e) => handleInputChange("streetChildrenRehabilitationCentre", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Night Shelter"
                            type="number"
                            value={formData.nightShelter || ""}
                            onChange={(e) => handleInputChange("nightShelter", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Old Age Home"
                            type="number"
                            value={formData.oldAgeHome || ""}
                            onChange={(e) => handleInputChange("oldAgeHome", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Social Security Schemes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="Old Age Pension Holders"
                            type="number"
                            value={formData.oldAgePensionsHolders || ""}
                            onChange={(e) => handleInputChange("oldAgePensionsHolders", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Widow Pension Holders"
                            type="number"
                            value={formData.widowPensionsHolders || ""}
                            onChange={(e) => handleInputChange("widowPensionsHolders", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Disabled Pension Holders"
                            type="number"
                            value={formData.disabledPensionsHolders || ""}
                            onChange={(e) => handleInputChange("disabledPensionsHolders", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="General Insurance Covered"
                            type="number"
                            value={formData.generalInsuranceCovered || ""}
                            onChange={(e) => handleInputChange("generalInsuranceCovered", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Health Insurance Covered"
                            type="number"
                            value={formData.healthInsuranceCovered || ""}
                            onChange={(e) => handleInputChange("healthInsuranceCovered", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Community Organizations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                            label="Self Help Groups"
                            type="number"
                            value={formData.selfHelpGroups || ""}
                            onChange={(e) => handleInputChange("selfHelpGroups", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Thrift & Credit Societies"
                            type="number"
                            value={formData.thriftCreditSocieties || ""}
                            onChange={(e) => handleInputChange("thriftCreditSocieties", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Youth Associations"
                            type="number"
                            value={formData.youthAssociations || ""}
                            onChange={(e) => handleInputChange("youthAssociations", parseInt(e.target.value) || 0)}
                            />
                            <Input
                            label="Women's Associations"
                            type="number"
                            value={formData.womensAssociations || ""}
                            onChange={(e) => handleInputChange("womensAssociations", parseInt(e.target.value) || 0)}
                            />
                            <Select
                            label="Slum Dwellers Association"
                            value={formData.slumDwellersAssociation || ""}
                            onChange={(e) => handleInputChange("slumDwellersAssociation", e.target.value)}
                            options={[
                                { value: "YES", label: "Yes" },
                                { value: "NO", label: "No" },
                            ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
            )}

            {currentStep === 14 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Review & Submit
                </h2>
                <div className="space-y-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <h3 className="text-lg font-semibold text-white mb-3">Survey Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-300"><span className="font-medium">Slum:</span> {formData.slumName}</p>
                                <p className="text-slate-300"><span className="font-medium">Surveyor:</span> {formData.surveyorName || user?.name}</p>
                                <p className="text-slate-300"><span className="font-medium">Survey Date:</span> {formData.surveyDate || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-slate-300"><span className="font-medium">Slum Type:</span> {formData.slumType || 'Not specified'}</p>
                                <p className="text-slate-300"><span className="font-medium">Households:</span> {formData.noSlumHouseholds || 0}</p>
                                <p className="text-slate-300"><span className="font-medium">Population:</span> {formData.slumPopulation || 0}</p>
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="bg-slate-800/50 border-slate-700">
                        <h3 className="text-lg font-semibold text-white mb-3">Important Notes</h3>
                        <ul className="text-sm text-slate-300 space-y-2">
                            <li>• Ensure all required fields are filled before submission</li>
                            <li>• Data cannot be modified after submission</li>
                            <li>• Review all entries carefully</li>
                            <li>• Contact supervisor if you need assistance</li>
                        </ul>
                    </Card>
                </div>
            </div>
            )}
             
             {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-800">
                <Button
                    variant="secondary"
                    onClick={handlePrevious}
                    disabled={currentStep === 0 || submitting || saving}
                >
                    Previous
                </Button>
                
                <div className="flex gap-3">
                    {currentStep < steps.length - 1 ? (
                        <Button
                            variant="secondary"
                            onClick={saveSection}
                            disabled={saving || submitting}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save & Next"}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting || saving}
                            className="bg-green-600 hover:bg-green-500"
                        >
                            {submitting ? "Submitting..." : "Submit Survey"}
                        </Button>
                    )}
                </div>
            </div>
        </Card>
      </div>
    </SurveyorLayout>
  );
}
