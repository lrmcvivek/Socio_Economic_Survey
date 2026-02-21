# HHQC User Guide for Supervisors

## Introduction

The HHQC (Household Quality Control) module is designed for supervisors to review, edit, and ensure the quality of household survey data collected by surveyors. This guide provides step-by-step instructions for using all HHQC features effectively.

## Accessing HHQC

### Navigation
1. Log in to the system with supervisor credentials
2. From the dashboard, click on "HHQC" in the main navigation menu
3. You will be directed to the HHQC Dashboard

### HHQC Dashboard Overview
The HHQC dashboard displays:
- **Slum Selection**: Dropdown to filter household records by slum
- **Household Records Table**: List of all household surveys for selected slum
- **Record Information**: Household ID, Door No, Family Members, Submission Date, Status
- **Action Buttons**: "Edit Record" button for each survey

## Workflow Steps

### Step 1: Select a Slum
1. Click the "Select Slum" dropdown
2. Browse or search for the desired slum
3. Select the slum to load its household survey records
4. The system will automatically populate the records table

### Step 2: Review Household Records
The records table displays:
- **Household ID**: Unique identifier for the survey
- **Door No**: Physical house/door number
- **Family Members**: Total members with male/female breakdown
- **Submission Date**: When the survey was originally submitted
- **Status**: Current status of the survey (SUBMITTED, COMPLETED, IN PROGRESS)
- **Actions**: Edit button for quality control

### Step 3: Edit a Record
1. Locate the record you want to review
2. Click the "Edit Record" button in the Actions column
3. You will be navigated to the HHQC Edit page

### Step 4: Review and Edit Survey Data
The HHQC Edit page contains all household survey sections:

#### Household Information
- House/Door No.
- Head of Household Name
- Father/Husband/Guardian Name
- Sex (Male/Female)
- Caste (General/SC/ST/OBC)
- Religion
- Minority Status
- Female Head Status (if applicable)

#### Family Composition
- Family Members (Male/Female/Total)
- Illiterate Adults (Male/Female/Total)
- Children Not Attending (Male/Female/Total)
- Handicapped Persons (Physically/Mentally/Total)

#### Economic Status (Updated Implementation)
- **If Major Earning Member is Female, Status**: 
  - Select from: Married, Widowed, Abandoned/Single, Divorced, Unwed mother, Other
- **Is Family Below Poverty Line?**:
  - Select from: Yes, No, Don't Know
- **BPL card**:
  - Select from: Yes, No

#### Education Status
- Literate Members (Male/Female/Total)
- Currently Enrolled Students (Male/Female/Total)
- School Dropout Children (Male/Female/Total)

#### Housing Details
- House Structure/Type
- Roof Type
- Flooring Type
- Ownership Status

#### Infrastructure
- Water Source
- Cooking Fuel
- Lighting Type
- Sanitation Facilities

#### Welfare Benefits
- Old Age Pension
- Widow Pension
- Disabled Pension
- Health Insurance
- General Insurance
- Other benefits

#### Consumer Durables
- Electric Fan
- Refrigerator
- Cooler
- Residential Telephone
- Mobile Phone
- Television (B/W, Color, LCD)
- Computer/Laptop
- Internet Connection

#### Livestock Information
- Cattle
- Buffalo
- Goat/Sheep
- Pig
- Poultry
- Other animals

#### Migration Information
- Members Working Abroad
- Members Migrated Within India
- Migration Duration
- Primary Reason for Migration

#### Income and Expenditure
- Monthly Family Income
- Major Source of Income
- Monthly Expenditure on Food
- Monthly Expenditure on Education
- Monthly Expenditure on Health
- Other Monthly Expenditure

### Step 5: Save Changes
1. Make necessary corrections to any fields
2. Review all sections for accuracy
3. Click the "Save Changes" button at the top of the page
4. Confirm the save operation when prompted
5. You will be redirected back to the HHQC Dashboard

## Quality Control Best Practices

### Data Validation Checklist
Before saving changes, verify:
- [ ] All required fields are completed
- [ ] Numerical values are reasonable (e.g., family members > 0)
- [ ] Date formats are correct
- [ ] Select dropdowns have appropriate values
- [ ] Text fields contain meaningful data
- [ ] Consistency between related fields (e.g., totals match individual counts)

### Common Issues to Look For
- **Inconsistent Data**: Mismatched totals vs individual counts
- **Unrealistic Values**: Extremely high or low numbers
- **Missing Information**: Required fields left blank
- **Formatting Issues**: Incorrect date formats or special characters
- **Logical Errors**: Impossible combinations (e.g., 0 family members but children listed)

### Quality Standards
- **Accuracy**: Ensure all data matches the original survey intent
- **Completeness**: All relevant fields should be filled appropriately
- **Consistency**: Related data points should be logically consistent
- **Clarity**: Text responses should be clear and meaningful

## Status Management

### Understanding Record Statuses
- **SUBMITTED**: Survey has been submitted by surveyor but not yet reviewed
- **REVIEWED**: Supervisor has performed quality control but not yet approved
- **COMPLETED**: Survey has been fully reviewed and approved
- **IN PROGRESS**: Survey is currently being edited

### Status Progression
The typical workflow follows:
```
SUBMITTED → REVIEWED → COMPLETED
```

## Error Handling

### Common Error Messages
- **"Failed to load data"**: Check internet connection and try refreshing
- **"Save failed"**: Review form for validation errors
- **"Access denied"**: Verify you have supervisor permissions
- **"Record not found"**: The survey may have been deleted or moved

### Troubleshooting Steps
1. **Refresh the page** to reload data
2. **Check your connection** to ensure stable internet
3. **Verify permissions** with system administrator
4. **Clear browser cache** if issues persist
5. **Contact support** with detailed error information

## Advanced Features

### Filtering and Searching
- Use the slum dropdown to quickly filter records
- Sort table columns by clicking on headers
- Look for specific records using browser search (Ctrl+F)

### Bulk Operations (Future Feature)
Planned enhancements include:
- Select multiple records for batch editing
- Apply common changes to multiple surveys
- Export filtered records for offline review
- Bulk status updates

### Audit Trail
All changes made through HHQC are tracked:
- **Who**: Supervisor who made the changes
- **When**: Timestamp of the modification
- **What**: Specific fields that were changed
- **Why**: Optional quality control notes

## Performance Tips

### Efficient Review Process
1. **Prioritize by Status**: Review SUBMITTED records first
2. **Batch Similar Issues**: Group similar correction types
3. **Use Keyboard Navigation**: Tab through fields efficiently
4. **Save Frequently**: Don't lose work on lengthy reviews
5. **Take Breaks**: Maintain quality during long review sessions

### Browser Recommendations
- Use modern browsers (Chrome, Firefox, Edge)
- Keep browser updated to latest version
- Enable JavaScript for full functionality
- Use bookmarks for quick navigation

## Reporting and Analytics

### Supervisor Dashboard Integration
- View HHQC statistics on main supervisor dashboard
- Track review completion rates
- Monitor data quality metrics
- See pending review counts

### Future Reporting Features
Planned reporting capabilities:
- Quality control statistics
- Review time tracking
- Error pattern analysis
- Supervisor performance metrics

## Security and Compliance

### Data Protection
- All HHQC activities are logged for audit purposes
- Supervisor access is role-based and controlled
- Data modifications require authentication
- Secure transmission of all data changes

### Compliance Guidelines
- Follow organizational data quality standards
- Document significant changes in quality control notes
- Maintain confidentiality of household information
- Report any data protection concerns immediately

## Getting Help

### Support Resources
- **System Documentation**: Refer to HHQC_IMPLEMENTATION.md
- **Technical Support**: Contact IT department for technical issues
- **Training Materials**: Request additional training sessions
- **User Feedback**: Submit suggestions for improvements

### Contact Information
For HHQC-related issues:
- Email: hhqc-support@organization.com
- Phone: Extension 1234
- Internal Ticket System: Category "HHQC Support"

## Quick Reference

### Keyboard Shortcuts
- **Ctrl+S**: Save changes (when on edit page)
- **Ctrl+R**: Refresh current page
- **Esc**: Close dialogs or return to previous view
- **Tab**: Navigate between form fields

### Bookmarks to Create
- HHQC Dashboard: `/supervisor/hhqc`
- HHQC Edit Page Template: `/supervisor/hhqc/[id]`
- Supervisor Dashboard: `/supervisor/dashboard`

### Emergency Procedures
If you encounter critical issues:
1. Document the error message and steps taken
2. Take a screenshot if possible
3. Contact support immediately
4. Do not attempt to force changes
5. Wait for technical assistance

---

*This guide is maintained by the System Administration team. Last updated: [Current Date]*