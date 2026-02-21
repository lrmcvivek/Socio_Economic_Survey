# HHQC (Household Quality Control) Implementation Guide

## Overview

HHQC (Household Quality Control) is a supervisor-level feature that allows supervisors to review, edit, and quality-check household survey records submitted by surveyors. This ensures data accuracy and maintains high-quality standards for the socio-economic survey system.

## Feature Description

The HHQC module provides supervisors with the ability to:
- View all household survey records across all slums
- Edit existing household survey data
- Quality control and validate survey responses
- Maintain data integrity and accuracy
- Track modifications made to survey records

## Architecture

### Frontend Components

#### 1. HHQC Dashboard (`/supervisor/hhqc/page.tsx`)
- **Purpose**: Main dashboard for HHQC operations
- **Features**:
  - Slum selection dropdown with infinite scroll
  - Household survey listing table
  - Record status indicators (SUBMITTED, COMPLETED, IN PROGRESS)
  - Edit action buttons for each record
  - Real-time data loading and filtering

#### 2. HHQC Edit Page (`/supervisor/hhqc/[id]/page.tsx`)
- **Purpose**: Detailed editing interface for individual household records
- **Features**:
  - Complete household survey form with all sections
  - Data loading from existing survey records
  - Form validation and error handling
  - Save functionality with supervisor attribution
  - Back navigation to HHQC dashboard

### Backend Components

#### 1. HHQC Controller (Planned)
- **Purpose**: Handle HHQC-specific operations
- **Endpoints**:
  - `GET /api/hhqc/records` - List all household survey records
  - `GET /api/hhqc/records/:id` - Get specific record details
  - `PUT /api/hhqc/records/:id` - Update record with quality control
  - `GET /api/hhqc/slums` - Get slums for HHQC filtering

#### 2. Data Model Extensions
- **HouseholdSurvey** model includes:
  - `lastModifiedBy` field to track supervisor edits
  - `qualityControlStatus` field for tracking QC status
  - `qcNotes` field for supervisor comments
  - `qcTimestamp` field for tracking when QC was performed

## Implementation Details

### Frontend Implementation

#### HHQC Dashboard Features
```typescript
// Key features implemented
- Infinite scroll slum selection
- Household survey data fetching by slum
- Record status visualization
- Edit navigation functionality
- Loading states and error handling
```

#### HHQC Edit Page Features
```typescript
// Key features implemented
- Complete form data loading from existing survey
- Select dropdown components for economic status fields
- Form field validation and error handling
- Supervisor-specific save functionality
- Data persistence with modification tracking
```

### Data Flow

1. **Supervisor Access**: Supervisor navigates to HHQC dashboard
2. **Slum Selection**: Select slum from dropdown to filter records
3. **Record Listing**: View all household surveys for selected slum
4. **Record Selection**: Click "Edit Record" for specific household
5. **Data Loading**: Fetch existing survey data for editing
6. **Editing**: Modify survey fields as needed
7. **Quality Control**: Save changes with supervisor attribution
8. **Audit Trail**: System tracks all modifications

## User Workflow

### Supervisor HHQC Workflow

1. **Access HHQC Dashboard**
   - Navigate to `/supervisor/hhqc`
   - View HHQC dashboard with slum selection

2. **Select Slum**
   - Choose slum from dropdown list
   - System loads all household surveys for that slum

3. **Review Records**
   - View table of household surveys
   - Check submission dates and statuses
   - Identify records requiring quality control

4. **Edit Record**
   - Click "Edit Record" button for specific survey
   - Navigate to edit page with pre-loaded data
   - Review and modify survey fields as needed

5. **Save Changes**
   - Make necessary corrections
   - Click "Save Changes" button
   - System saves with supervisor attribution
   - Return to HHQC dashboard

## Technical Specifications

### Form Fields Implementation

The HHQC edit page includes all standard household survey fields:

#### Economic Status Fields (Updated Implementation)
- **Female Earning Status**: Select dropdown with options
  - MARRIED, WIDOWED, ABANDONED_SINGLE, DIVORCED, UNWED_MOTHER, OTHER
- **Below Poverty Line**: Select dropdown with options
  - YES, NO, DONT_KNOW
- **BPL Card**: Select dropdown with options
  - YES, NO

#### Other Key Sections
- Household Information (Basic details)
- Family Composition (Demographics)
- Education Status
- Housing Details
- Infrastructure
- Welfare Benefits
- Consumer Durables
- Livestock Information
- Migration Information

### Component Consistency

The HHQC implementation follows the same pattern as the surveyor household survey page:
- Uses identical Select component implementations
- Maintains consistent field naming and structure
- Implements same validation patterns
- Follows identical UI/UX design principles

## Security & Access Control

### Role-Based Access
- **HHQC Dashboard**: Supervisor role only
- **HHQC Edit Page**: Supervisor role only
- **Data Modification**: Tracked with supervisor attribution
- **Audit Logging**: All changes recorded with timestamps

### Data Integrity
- **Read-Only Fields**: Certain fields may be restricted from editing
- **Validation**: Form validation ensures data quality
- **Audit Trail**: Complete history of all modifications
- **Conflict Resolution**: Prevents concurrent editing conflicts

## API Integration

### Current Implementation
The HHQC feature currently uses existing household survey endpoints:
- `GET /api/surveys/household-surveys/slum/:slumId` - Fetch surveys by slum
- `GET /api/surveys/household-surveys/:id` - Get specific survey
- `PUT /api/surveys/household-surveys/:id` - Update survey with supervisor attribution

### Planned Enhancements
Future HHQC-specific endpoints:
- `GET /api/hhqc/records` - Dedicated HHQC record listing
- `GET /api/hhqc/dashboard/stats` - HHQC dashboard statistics
- `POST /api/hhqc/bulk-operations` - Bulk quality control operations

## Error Handling

### Frontend Error States
- **Data Loading Errors**: Display user-friendly error messages
- **Form Validation Errors**: Field-specific error indicators
- **Save Operation Errors**: Clear feedback on save failures
- **Network Errors**: Graceful handling of connectivity issues

### Backend Error Handling
- **Authentication Errors**: Proper 401/403 responses
- **Data Validation Errors**: Detailed error messages
- **Database Errors**: Graceful degradation
- **Rate Limiting**: Prevent abuse of HHQC functionality

## Performance Considerations

### Data Loading Optimization
- **Pagination**: Large dataset handling for household surveys
- **Caching**: Efficient data caching strategies
- **Lazy Loading**: Components loaded on demand
- **Debouncing**: Search and filter operations optimized

### User Experience
- **Loading States**: Clear visual feedback during operations
- **Progress Indicators**: Save operation progress tracking
- **Responsive Design**: Mobile and desktop optimization
- **Keyboard Navigation**: Accessible interface design

## Testing

### Unit Tests
- Form component validation
- Data loading and error handling
- Save operation functionality
- Navigation and routing

### Integration Tests
- End-to-end HHQC workflow
- Data persistence and retrieval
- Supervisor access control
- Audit trail verification

### User Acceptance Testing
- Supervisor workflow validation
- Data quality improvement verification
- Performance under load testing
- Cross-browser compatibility

## Future Enhancements

### Planned Features
1. **Advanced Filtering**: Enhanced search and filter capabilities
2. **Bulk Operations**: Mass quality control operations
3. **Reporting**: HHQC statistics and reports
4. **Notification System**: Alerts for records requiring QC
5. **Version History**: Complete audit trail with version comparison
6. **Collaboration Features**: Multi-supervisor QC workflows

### Technical Improvements
1. **Dedicated HHQC API**: Specialized endpoints for HHQC operations
2. **Real-time Updates**: WebSocket integration for live data updates
3. **Advanced Analytics**: Quality metrics and trend analysis
4. **Mobile Optimization**: Enhanced mobile HHQC experience
5. **Offline Capability**: Local storage for offline QC operations

## Troubleshooting

### Common Issues

#### Data Not Loading
- **Check**: API connectivity and authentication
- **Verify**: Slum selection and survey existence
- **Solution**: Refresh page and check network console

#### Save Operation Fails
- **Check**: Form validation errors
- **Verify**: Required fields completion
- **Solution**: Review error messages and correct issues

#### Access Denied
- **Check**: User role and permissions
- **Verify**: Supervisor account access
- **Solution**: Contact administrator for role verification

## Best Practices

### For Supervisors
- Review records systematically
- Document quality control notes
- Follow established data quality standards
- Maintain consistent editing practices
- Regular audit trail review

### For Developers
- Maintain component consistency
- Implement comprehensive error handling
- Follow security best practices
- Document code changes thoroughly
- Test across different scenarios

## Support

For issues or questions regarding HHQC implementation:
1. Check this documentation first
2. Review console logs for error details
3. Verify API responses in network tab
4. Contact system administrator for access issues
5. Submit bug reports with detailed reproduction steps