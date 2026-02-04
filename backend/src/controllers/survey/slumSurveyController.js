const SlumSurvey = require('../../models/SlumSurvey');
const Slum = require('../../models/Slum');
const Ward = require('../../models/Ward');
const District = require('../../models/District');
const State = require('../../models/State');
const { sendSuccess, sendError } = require('../../utils/helpers/responseHelper');

/**
 * Create or initialize a slum survey
 */
exports.createOrGetSlumSurvey = async (req, res) => {
    try {
        const { slumId } = req.params;
        const userId = req.user.id || req.user._id;

        // Check if slum exists and populate ward information
        const slum = await Slum.findById(slumId).populate('ward', 'district');
        if (!slum) {
            return sendError(res, 'Slum not found', 404);
        }

        // If ward is populated but doesn't have district info, fetch it separately
        let wardData = slum.ward;
        if (wardData && typeof wardData === 'object' && !wardData.district) {
            // Re-fetch the ward with district populated
            const fullWard = await Ward.findById(slum.ward._id).populate('district', 'state');
            wardData = fullWard;
        } else if (wardData && typeof wardData === 'object' && wardData.district && typeof wardData.district === 'string') {
            // If district is just an ID, populate it
            const fullDistrict = await District.findById(wardData.district).populate('state');
            wardData = {
                _id: wardData._id,
                district: fullDistrict
            };
        }

        // Check if survey already exists
        let survey = await SlumSurvey.findOne({ slum: slumId, surveyor: userId });

        if (!survey) {
            // Validate that slum has required ward reference
            if (!wardData) {
                return sendError(res, 'Slum is missing ward information. Please contact administrator.', 400);
            }

            // Attempt to populate ward data if not already populated
            let finalWardData = wardData;
            if (typeof wardData === 'string' || !wardData.district) {
                // If ward is just an ID or doesn't have district info, fetch the full ward document
                const fullWard = await Ward.findById(wardData);
                if (!fullWard) {
                    return sendError(res, 'Ward information not found. Please contact administrator.', 400);
                }
                
                // Fetch the district for this ward
                if (!fullWard.district) {
                    return sendError(res, 'Ward is missing district information. Please contact administrator.', 400);
                }
                
                finalWardData = fullWard;
            }

            if (!finalWardData.district) {
                return sendError(res, 'Ward is missing district information. Please contact administrator.', 400);
            }

            // Try to get the district document to access the state
            let districtData = finalWardData.district;
            if (typeof finalWardData.district === 'string') {
                // If district is just an ID, fetch the full district document
                districtData = await District.findById(finalWardData.district);
                if (!districtData) {
                    return sendError(res, 'District information not found. Please contact administrator.', 400);
                }
            }

            if (!districtData.state) {
                // Try to find the state using the slum's stateCode as a fallback
                console.log(`[DEBUG] District ${districtData._id} is missing state information. Attempting to find state using slum's stateCode: ${slum.stateCode}`);
                
                // First, try to find state by code
                const stateByCode = await State.findOne({ code: slum.stateCode });
                if (stateByCode) {
                    console.log(`[DEBUG] Found state by code: ${stateByCode._id}`);
                    
                    // Update the district with the state reference
                    districtData.state = stateByCode._id;
                    await District.findByIdAndUpdate(districtData._id, { state: stateByCode._id });
                } else {
                    // If we still can't find the state, try to find it by matching the district
                    const stateForDistrict = await State.findOne({ districts: districtData._id });
                    if (stateForDistrict) {
                        console.log(`[DEBUG] Found state by district reference: ${stateForDistrict._id}`);
                        
                        // Update the district with the state reference
                        districtData.state = stateForDistrict._id;
                        await District.findByIdAndUpdate(districtData._id, { state: stateForDistrict._id });
                    } else {
                        return sendError(res, 'Unable to determine state for district. Please contact administrator to fix data integrity.', 400);
                    }
                }
            }

            // Create new survey with default values and populate required references
            survey = new SlumSurvey({
                slum: slumId,
                surveyor: userId,
                ward: finalWardData._id,
                district: districtData._id,
                state: districtData.state,
                surveyStatus: 'DRAFT',
            });
            await survey.save();
            console.log(`Created new slum survey for slum ${slumId}`);
        }
         
        await survey.populate([
            { path: 'slum', select: 'slumName location population' },
            { path: 'surveyor', select: 'name email' },
        ]);
         
        sendSuccess(res, survey, 'Slum survey retrieved/created successfully');
    } catch (error) {
        console.error('Error in createOrGetSlumSurvey:', error.message);
        sendError(res, error.message || 'Failed to create/get slum survey', 500);
    }
};

/**
 * Get slum survey by ID
 */
exports.getSlumSurvey = async (req, res) => {
    try {
        const { surveyId } = req.params;

        const survey = await SlumSurvey.findById(surveyId).populate([
            { path: 'slum', select: 'slumName location population' },
            { path: 'surveyor', select: 'name email' },
        ]);

        if (!survey) {
            return sendError(res, 'Survey not found', 404);
        }

        sendSuccess(res, survey, 'Survey retrieved successfully');
    } catch (error) {
        console.error('Error in getSlumSurvey:', error.message);
        sendError(res, error.message || 'Failed to get survey', 500);
    }
};

/**
 * Update slum survey (partial update for form sections)
 */
exports.updateSlumSurvey = async (req, res) => {
    try {
        const { surveyId } = req.params;
        const updateData = req.body;
        const userId = req.user.id || req.user._id;

        // Find survey
        const survey = await SlumSurvey.findById(surveyId);
        if (!survey) {
            return sendError(res, 'Survey not found', 404);
        }

        // Check authorization
        if (survey.surveyor.toString() !== userId.toString() && req.user.role !== 'ADMIN') {
            return sendError(res, 'Not authorized to update this survey', 403);
        }

        // Update survey fields
        Object.assign(survey, updateData);
        survey.lastModifiedBy = userId;
        survey.lastModifiedAt = new Date();
        survey.surveyStatus = updateData.surveyStatus || survey.surveyStatus;

        await survey.save();
        await survey.populate([
            { path: 'slum', select: 'slumName location population' },
            { path: 'surveyor', select: 'name email' },
        ]);

        console.log(`Updated slum survey ${surveyId}`);
        sendSuccess(res, survey, 'Survey updated successfully');
    } catch (error) {
        console.error('Error in updateSlumSurvey:', error.message);
        sendError(res, error.message || 'Failed to update survey', 500);
    }
};

/**
 * Submit slum survey (mark as SUBMITTED)
 */
exports.submitSlumSurvey = async (req, res) => {
    try {
        const { surveyId } = req.params;
        const userId = req.user.id || req.user._id;

        const survey = await SlumSurvey.findById(surveyId);
        if (!survey) {
            return sendError(res, 'Survey not found', 404);
        }

        // Check authorization
        if (survey.surveyor.toString() !== userId.toString() && req.user.role !== 'ADMIN') {
            return sendError(res, 'Not authorized to submit this survey', 403);
        }

        // Mark all sections as completed when submitting
        const allSections = [
            'generalInformation',
            'cityTownSlumProfile',
            'surveyOperation',
            'basicInformation',
            'landStatus',
            'demographicProfile',
            'housingStatus',
            'economicStatus',
            'employmentAndOccupation',
            'physicalInfrastructure',
            'educationFacilities',
            'healthFacilities',
            'socialDevelopment',
            'additionalInfrastructure'
        ];
        
        // Add all sections to completed sections if they have meaningful data
        allSections.forEach(section => {
            if (!survey.completedSections.includes(section)) {
                const sectionData = survey[section];
                let hasMeaningfulData = false;
                
                if (sectionData && typeof sectionData === 'object' && sectionData !== null) {
                    for (let key in sectionData) {
                        if (sectionData[key] !== null && sectionData[key] !== undefined && sectionData[key] !== '') {
                            hasMeaningfulData = true;
                            break;
                        }
                    }
                } else if (sectionData !== null && sectionData !== undefined && sectionData !== '') {
                    hasMeaningfulData = true;
                }
                
                if (hasMeaningfulData) {
                    survey.completedSections.push(section);
                    console.log(`Section ${section} marked as completed during submission`);
                }
            }
        });
        
        // Calculate final completion percentage
        survey.completionPercentage = Math.min(100, Math.round((survey.completedSections.length / 14) * 100));
        
        survey.surveyStatus = 'SUBMITTED';
        survey.submittedBy = userId;
        survey.submittedAt = new Date();
        survey.lastModifiedBy = userId;
        survey.lastModifiedAt = new Date();

        await survey.save();
        
        console.log(`Final completion after submission: ${survey.completedSections.length}/16 = ${survey.completionPercentage}%`);
        await survey.populate([
            { path: 'slum', select: 'slumName location population' },
            { path: 'surveyor', select: 'name email' },
        ]);

        console.log(`Submitted slum survey ${surveyId}`);
        sendSuccess(res, survey, 'Survey submitted successfully', 200);
    } catch (error) {
        console.error('Error in submitSlumSurvey:', error.message);
        sendError(res, error.message || 'Failed to submit survey', 500);
    }
};

/**
 * Get survey by slum ID (for a specific surveyor)
 */
exports.getSlumSurveyBySlumId = async (req, res) => {
    try {
        const { slumId } = req.params;
        const userId = req.user.id || req.user._id;

        const survey = await SlumSurvey.findOne({
            slum: slumId,
            surveyor: userId,
        }).populate([
            { path: 'slum', select: 'slumName location population' },
            { path: 'surveyor', select: 'name email' },
        ]);

        if (!survey) {
            return sendError(res, 'Survey not found for this slum', 404);
        }

        sendSuccess(res, survey, 'Survey retrieved successfully');
    } catch (error) {
        console.error('Error in getSlumSurveyBySlumId:', error.message);
        sendError(res, error.message || 'Failed to get survey', 500);
    }
};

/**
 * Delete slum survey (only for DRAFT status)
 */
exports.deleteSlumSurvey = async (req, res) => {
    try {
        const { surveyId } = req.params;
        const userId = req.user.id || req.user._id;

        const survey = await SlumSurvey.findById(surveyId);
        if (!survey) {
            return sendError(res, 'Survey not found', 404);
        }

        // Only allow deletion of DRAFT surveys
        if (survey.surveyStatus !== 'DRAFT') {
            return sendError(res, 'Can only delete DRAFT surveys', 400);
        }

        // Check authorization
        if (survey.surveyor.toString() !== userId.toString() && req.user.role !== 'ADMIN') {
            return sendError(res, 'Not authorized to delete this survey', 403);
        }

        await SlumSurvey.findByIdAndDelete(surveyId);
        console.log(`Deleted slum survey ${surveyId}`);
        sendSuccess(res, null, 'Survey deleted successfully');
    } catch (error) {
        console.error('Error in deleteSlumSurvey:', error.message);
        sendError(res, error.message || 'Failed to delete survey', 500);
    }
};

/**
 * Update specific survey section (for incremental saves)
 */
exports.updateSurveySection = async (req, res) => {
    try {
        const { surveyId } = req.params;
        const { section, data } = req.body;
        const userId = req.user.id || req.user._id;

        if (!section || !data) {
            return sendError(res, 'Section and data are required', 400);
        }

        const survey = await SlumSurvey.findById(surveyId);
        if (!survey) {
            return sendError(res, 'Survey not found', 404);
        }

        // Check authorization
        if (survey.surveyor.toString() !== userId.toString() && req.user.role !== 'ADMIN') {
            return sendError(res, 'Not authorized to update this survey', 403);
        }

        // Define all survey sections
        const surveySections = [
            'generalInformation',
            'cityTownSlumProfile',
            'surveyOperation',
            'basicInformation',
            'landStatus',
            'demographicProfile',
            'housingStatus',
            'economicStatus',
            'employmentAndOccupation',
            'physicalInfrastructure',
            'educationFacilities',
            'healthFacilities',
            'socialDevelopment',
            'additionalInfrastructure'
        ];

        // Update the specific section
        survey[section] = data;
        
        // Track completion explicitly
        // Add current section to completed sections if it has meaningful data
        if (!survey.completedSections.includes(section)) {
            // Check if the section has meaningful data before marking as completed
            const sectionData = survey[section];
            let hasMeaningfulData = false;
            
            if (sectionData && typeof sectionData === 'object' && sectionData !== null) {
                // Check if object has at least one non-empty value
                for (let key in sectionData) {
                    if (sectionData[key] !== null && sectionData[key] !== undefined && sectionData[key] !== '') {
                        hasMeaningfulData = true;
                        break;
                    }
                }
            } else if (sectionData !== null && sectionData !== undefined && sectionData !== '') {
                hasMeaningfulData = true;
            }
            
            if (hasMeaningfulData) {
                survey.completedSections.push(section);
                console.log(`Section ${section} marked as completed. Total completed: ${survey.completedSections.length}`);
                console.log(`Completed sections:`, survey.completedSections);
            } else {
                console.log(`Section ${section} has no meaningful data, not marking as completed`);
            }
        } else {
            console.log(`Section ${section} already marked as completed`);
        }
        
        // Calculate completion percentage based on explicitly tracked completed sections
        // Each of the 14 sections contributes ~7.14% to the total completion (100/14)
        const completionPercentage = Math.min(100, Math.round((survey.completedSections.length / 14) * 100));
        console.log(`Completion calculation: ${survey.completedSections.length}/14 sections = ${completionPercentage}%`);
        survey.completionPercentage = completionPercentage;
        
        // Update survey status based on completion
        // Only set to COMPLETED after explicit submission, not just filling all sections
        if (completionPercentage === 0) {
            survey.surveyStatus = 'DRAFT';
        } else if (completionPercentage > 0 && completionPercentage < 100) {
            survey.surveyStatus = 'IN_PROGRESS';
        } else if (completionPercentage === 100 && survey.surveyStatus !== 'SUBMITTED' && survey.surveyStatus !== 'COMPLETED') {
            // When 100% complete but not yet submitted, keep as IN_PROGRESS
            survey.surveyStatus = 'IN_PROGRESS';
        }
        // If already SUBMITTED or COMPLETED, don't change the status
        
        survey.lastModifiedBy = userId;
        survey.lastModifiedAt = new Date();

        await survey.save();
        await survey.populate([
            { path: 'slum', select: 'slumName' },
            { path: 'surveyor', select: 'name email' },
        ]);

        console.log(`Updated survey section: ${section} for survey ${surveyId}. Completion: ${completionPercentage}%`);
        sendSuccess(res, {...survey.toObject(), completionPercentage}, `${section} updated successfully. Overall completion: ${completionPercentage}%`);
    } catch (error) {
        console.error('Error in updateSurveySection:', error.message);
        sendError(res, error.message || 'Failed to update survey section', 500);
    }
};
