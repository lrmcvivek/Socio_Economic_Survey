"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/services/api";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { HouseholdSurvey } from "@/types/householdSurvey";

interface HouseholdSurveyForm {
  householdId: string;
  surveyStatus?: string;
  // Section I - General Information
  slumName?: string;
  ward?: string;
  houseDoorNo?: string;

  // Section II - Household Level General Information
  headName?: string;
  fatherName?: string;
  sex?: string;
  caste?: string;
  religion?: string;
  minorityStatus?: string;
  femaleHeadStatus?: string;

  // Number of family members
  familyMembersMale?: number;
  familyMembersFemale?: number;
  familyMembersTotal?: number;

  // Number of illiterate adult members
  illiterateAdultMale?: number;
  illiterateAdultFemale?: number;
  illiterateAdultTotal?: number;

  // Number of children aged 6-14 not attending school
  childrenNotAttendingMale?: number;
  childrenNotAttendingFemale?: number;
  childrenNotAttendingTotal?: number;

  // Number of handicapped persons
  handicappedPhysically?: number;
  handicappedMentally?: number;
  handicappedTotal?: number;

  femaleEarningStatus?: string;
  belowPovertyLine?: string;
  bplCard?: string;

  // Section III - Detailed Information
  landTenureStatus?: string;
  houseStructure?: string;
  roofType?: string;
  flooringType?: string;
  houseLighting?: string;
  cookingFuel?: string;

  // Water source
  waterSource?: string;
  waterSupplyDuration?: string;
  waterSourceDistance?: string;

  toiletFacility?: string;
  bathroomFacility?: string;
  roadFrontType?: string;
  preschoolType?: string;
  primarySchoolType?: string;
  highSchoolType?: string;
  healthFacilityType?: string;
  welfareBenefits?: string[];
  consumerDurables?: string[];
  livestock?: string[];

  // Section IV - Migration Details
  yearsInTown?: string;
  migrated?: string;
  migratedFrom?: string;
  migrationType?: string;
  migrationReasons?: string[];

  // Section V - Income-Expenditure Details
  earningAdultMale?: number;
  earningAdultFemale?: number;
  earningAdultTotal?: number;
  earningNonAdultMale?: number;
  earningNonAdultFemale?: number;
  earningNonAdultTotal?: number;
  monthlyIncome?: number;
  monthlyExpenditure?: number;
  debtOutstanding?: number;

  // Additional notes
  notes?: string;
}

export default function HHQCEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<HouseholdSurveyForm>({
    householdId: "",
    houseDoorNo: "",
    headName: "",
    fatherName: "",
    sex: "",
    caste: "",
    religion: "",
    minorityStatus: "",
    femaleHeadStatus: "",
    familyMembersMale: undefined,
    familyMembersFemale: undefined,
    familyMembersTotal: undefined,
    illiterateAdultMale: undefined,
    illiterateAdultFemale: undefined,
    illiterateAdultTotal: undefined,
    childrenNotAttendingMale: undefined,
    childrenNotAttendingFemale: undefined,
    childrenNotAttendingTotal: undefined,
    handicappedPhysically: undefined,
    handicappedMentally: undefined,
    handicappedTotal: undefined,
    femaleEarningStatus: "",
    belowPovertyLine: "",
    bplCard: "",
    landTenureStatus: "",
    houseStructure: "",
    roofType: "",
    flooringType: "",
    houseLighting: "",
    cookingFuel: "",
    waterSource: "",
    waterSupplyDuration: "",
    waterSourceDistance: "",
    toiletFacility: "",
    bathroomFacility: "",
    roadFrontType: "",
    preschoolType: "",
    primarySchoolType: "",
    highSchoolType: "",
    healthFacilityType: "",
    welfareBenefits: [],
    consumerDurables: [],
    livestock: [],
    yearsInTown: "",
    migrated: "",
    migratedFrom: "",
    migrationType: "",
    migrationReasons: [],
    earningAdultMale: undefined,
    earningAdultFemale: undefined,
    earningAdultTotal: undefined,
    earningNonAdultMale: undefined,
    earningNonAdultFemale: undefined,
    earningNonAdultTotal: undefined,
    monthlyIncome: undefined,
    monthlyExpenditure: undefined,
    debtOutstanding: undefined,
    notes: "",
  });
  const [errors, setErrors] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<HouseholdSurvey | null>(null);

  // Load existing household survey data
  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/household-surveys/${params.id}`);
        
        if (response.success && response.data) {
          const surveyData = response.data;
          setOriginalData(surveyData);
          
          // Populate form data
          setFormData({
            householdId: surveyData.householdId || "",
            houseDoorNo: surveyData.houseDoorNo || "",
            headName: surveyData.headName || "",
            fatherName: surveyData.fatherName || "",
            sex: surveyData.sex || "",
            caste: surveyData.caste || "",
            religion: surveyData.religion || "",
            minorityStatus: surveyData.minorityStatus || "",
            femaleHeadStatus: surveyData.femaleHeadStatus || "",
            familyMembersMale: surveyData.familyMembersMale,
            familyMembersFemale: surveyData.familyMembersFemale,
            familyMembersTotal: surveyData.familyMembersTotal,
            illiterateAdultMale: surveyData.illiterateAdultMale,
            illiterateAdultFemale: surveyData.illiterateAdultFemale,
            illiterateAdultTotal: surveyData.illiterateAdultTotal,
            childrenNotAttendingMale: surveyData.childrenNotAttendingMale,
            childrenNotAttendingFemale: surveyData.childrenNotAttendingFemale,
            childrenNotAttendingTotal: surveyData.childrenNotAttendingTotal,
            handicappedPhysically: surveyData.handicappedPhysically,
            handicappedMentally: surveyData.handicappedMentally,
            handicappedTotal: surveyData.handicappedTotal,
            femaleEarningStatus: surveyData.femaleEarningStatus || "",
            belowPovertyLine: surveyData.belowPovertyLine || "",
            bplCard: surveyData.bplCard || "",
            landTenureStatus: surveyData.landTenureStatus || "",
            houseStructure: surveyData.houseStructure || "",
            roofType: surveyData.roofType || "",
            flooringType: surveyData.flooringType || "",
            houseLighting: surveyData.houseLighting || "",
            cookingFuel: surveyData.cookingFuel || "",
            waterSource: surveyData.waterSource || "",
            waterSupplyDuration: surveyData.waterSupplyDuration || "",
            waterSourceDistance: surveyData.waterSourceDistance || "",
            toiletFacility: surveyData.toiletFacility || "",
            bathroomFacility: surveyData.bathroomFacility || "",
            roadFrontType: surveyData.roadFrontType || "",
            preschoolType: surveyData.preschoolType || "",
            primarySchoolType: surveyData.primarySchoolType || "",
            highSchoolType: surveyData.highSchoolType || "",
            healthFacilityType: surveyData.healthFacilityType || "",
            welfareBenefits: surveyData.welfareBenefits || [],
            consumerDurables: surveyData.consumerDurables || [],
            livestock: surveyData.livestock || [],
            yearsInTown: surveyData.yearsInTown || "",
            migrated: surveyData.migrated || "",
            migratedFrom: surveyData.migratedFrom || "",
            migrationType: surveyData.migrationType || "",
            migrationReasons: surveyData.migrationReasons || [],
            earningAdultMale: surveyData.earningAdultMale,
            earningAdultFemale: surveyData.earningAdultFemale,
            earningAdultTotal: surveyData.earningAdultTotal,
            earningNonAdultMale: surveyData.earningNonAdultMale,
            earningNonAdultFemale: surveyData.earningNonAdultFemale,
            earningNonAdultTotal: surveyData.earningNonAdultTotal,
            monthlyIncome: surveyData.monthlyIncome,
            monthlyExpenditure: surveyData.monthlyExpenditure,
            debtOutstanding: surveyData.debtOutstanding,
            notes: surveyData.notes || "",
          });
        }
      } catch (error) {
        console.error("Error fetching survey data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [params.id]);

  const handleInputChange = useCallback(
    (field: string, value: string | number | undefined) => {
      setFormData((prev) => {
        // Auto-calculate totals
        let updatedData = { ...prev, [field]: value };
        
        if (field === "familyMembersMale" || field === "familyMembersFemale") {
          const male = field === "familyMembersMale" ? value : prev.familyMembersMale;
          const female = field === "familyMembersFemale" ? value : prev.familyMembersFemale;
          updatedData.familyMembersTotal = (Number(male) || 0) + (Number(female) || 0);
        }
        
        if (field === "illiterateAdultMale" || field === "illiterateAdultFemale") {
          const male = field === "illiterateAdultMale" ? value : prev.illiterateAdultMale;
          const female = field === "illiterateAdultFemale" ? value : prev.illiterateAdultFemale;
          updatedData.illiterateAdultTotal = (Number(male) || 0) + (Number(female) || 0);
        }
        
        if (field === "childrenNotAttendingMale" || field === "childrenNotAttendingFemale") {
          const male = field === "childrenNotAttendingMale" ? value : prev.childrenNotAttendingMale;
          const female = field === "childrenNotAttendingFemale" ? value : prev.childrenNotAttendingFemale;
          updatedData.childrenNotAttendingTotal = (Number(male) || 0) + (Number(female) || 0);
        }
        
        if (field === "handicappedPhysically" || field === "handicappedMentally") {
          const physical = field === "handicappedPhysically" ? value : prev.handicappedPhysically;
          const mental = field === "handicappedMentally" ? value : prev.handicappedMentally;
          updatedData.handicappedTotal = (Number(physical) || 0) + (Number(mental) || 0);
        }
        
        return updatedData;
      });
    },
    []
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await apiService.put(`/household-surveys/${params.id}`, {
        ...formData,
        lastModifiedBy: "supervisor" // Indicate this was modified by supervisor
      });
      
      if (response.success) {
        alert("Record updated successfully!");
        router.push("/supervisor/hhqc");
      } else {
        alert("Failed to update record: " + (response.message || "Unknown error"));
      }
    } catch (error: any) {
      console.error("Error updating survey:", error);
      alert("Failed to update record: " + (error.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push("/supervisor/hhqc");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={handleBack}>
            ← Back to HHQC Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-white">HHQC - Edit Household Record</h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleBack}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Household ID"
            value={formData.householdId}
            disabled
          />
          <Input
            label="House/Door No."
            value={formData.houseDoorNo || ""}
            onChange={(e) => handleInputChange("houseDoorNo", e.target.value)}
          />
          <Input
            label="Head of Household Name"
            value={formData.headName || ""}
            onChange={(e) => handleInputChange("headName", e.target.value)}
          />
          <Input
            label="Father/Husband/Guardian Name"
            value={formData.fatherName || ""}
            onChange={(e) => handleInputChange("fatherName", e.target.value)}
          />
          <Select
            label="Sex"
            value={formData.sex || ""}
            onChange={(e) => handleInputChange("sex", e.target.value)}
            options={[
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
            ]}
          />
          <Select
            label="Caste"
            value={formData.caste || ""}
            onChange={(e) => handleInputChange("caste", e.target.value)}
            options={[
              { value: "GENERAL", label: "General" },
              { value: "SC", label: "SC" },
              { value: "ST", label: "ST" },
              { value: "OBC", label: "OBC" },
            ]}
          />
          <Select
            label="Religion"
            value={formData.religion || ""}
            onChange={(e) => handleInputChange("religion", e.target.value)}
            options={[
              { value: "HINDU", label: "Hindu" },
              { value: "MUSLIM", label: "Muslim" },
              { value: "CHRISTIAN", label: "Christian" },
              { value: "SIKH", label: "Sikh" },
              { value: "JAINISM", label: "Jainism" },
              { value: "BUDDHISM", label: "Buddhism" },
              { value: "ZOROASTRIANISM", label: "Zoroastrianism" },
              { value: "OTHERS", label: "Others" },
            ]}
          />
          <Select
            label="Minority Status"
            value={formData.minorityStatus || ""}
            onChange={(e) => handleInputChange("minorityStatus", e.target.value)}
            options={[
              { value: "NON_MINORITY", label: "Non-minority" },
              { value: "MINORITY", label: "Minority" },
            ]}
          />
          <Select
            label="Female Head Status (if applicable)"
            value={formData.femaleHeadStatus || ""}
            onChange={(e) => handleInputChange("femaleHeadStatus", e.target.value)}
            options={[
              { value: "", label: "Not Applicable" },
              { value: "MARRIED", label: "Married" },
              { value: "WIDOWED", label: "Widowed" },
              { value: "ABANDONED_SINGLE", label: "Abandoned/Single" },
              { value: "DIVORCED", label: "Divorced" },
              { value: "UNWED_MOTHER", label: "Unwed mother" },
              { value: "OTHER", label: "Other" },
            ]}
          />
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Family Composition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Family Members (Male)"
              type="number"
              value={formData.familyMembersMale ?? ""}
              onChange={(e) => handleInputChange("familyMembersMale", e.target.value ? parseInt(e.target.value) : undefined)}
            />
            <Input
              label="Family Members (Female)"
              type="number"
              value={formData.familyMembersFemale ?? ""}
              onChange={(e) => handleInputChange("familyMembersFemale", e.target.value ? parseInt(e.target.value) : undefined)}
            />
            <Input
              label="Family Members (Total)"
              type="number"
              value={formData.familyMembersTotal ?? ""}
              disabled
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Below Poverty Line"
              value={formData.belowPovertyLine || ""}
              onChange={(e) => handleInputChange("belowPovertyLine", e.target.value)}
              options={[
                { value: "YES", label: "Yes" },
                { value: "NO", label: "No" },
                { value: "DONT_KNOW", label: "Don't Know" },
              ]}
            />
            <Select
              label="BPL Card"
              value={formData.bplCard || ""}
              onChange={(e) => handleInputChange("bplCard", e.target.value)}
              options={[
                { value: "YES", label: "Yes" },
                { value: "NO", label: "No" },
              ]}
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Notes</h2>
          <textarea
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Add any additional notes about this household..."
            value={formData.notes || ""}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
        </div>
      </Card>
    </div>
  );
}