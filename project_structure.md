# 📁 Socio_Economic_Survey - Project Structure

*Generated on: 2/21/2026, 3:54:06 PM*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 148 |
| 📁 Total Folders | 57 |
| 🌳 Max Depth | 5 levels |
| 🛠️ Tech Stack | React, Next.js, TypeScript, CSS, Tailwind CSS, Node.js |

## ⭐ Important Files

- 🟡 🚫 **.gitignore** - Git ignore rules
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🔴 📖 **README.md** - Project documentation
- 🟡 🚫 **.gitignore** - Git ignore rules
- 🔵 🔍 **eslint.config.mjs** - ESLint config
- 🟡 ▲ **next.config.ts** - Next.js config
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🔴 📖 **README.md** - Project documentation
- 🟡 🎨 **tailwind.config.js** - Tailwind config
- 🟡 🔷 **tsconfig.json** - TypeScript config
- 🔵 ▲ **vercel.json** - Vercel config
- 🔴 📖 **README.md** - Project documentation

## 📊 File Statistics

### By File Type

- ⚛️ **.tsx** (React TypeScript files): 50 files (33.8%)
- 📜 **.js** (JavaScript files): 39 files (26.4%)
- 📖 **.md** (Markdown files): 28 files (18.9%)
- 🔷 **.ts** (TypeScript files): 9 files (6.1%)
- ⚙️ **.json** (JSON files): 7 files (4.7%)
- 🎨 **.svg** (SVG images): 5 files (3.4%)
- 🚫 **.gitignore** (Git ignore): 2 files (1.4%)
- 🖼️ **.png** (PNG images): 2 files (1.4%)
- 🎨 **.css** (Stylesheets): 1 files (0.7%)
- 📄 **.mjs** (Other files): 1 files (0.7%)
- 🖼️ **.ico** (Icon files): 1 files (0.7%)
- 🌐 **.html** (HTML files): 1 files (0.7%)
- 📄 **.tsbuildinfo** (Other files): 1 files (0.7%)
- 📄 **.txt** (Text files): 1 files (0.7%)

### By Category

- **React**: 50 files (33.8%)
- **JavaScript**: 39 files (26.4%)
- **Docs**: 29 files (19.6%)
- **TypeScript**: 9 files (6.1%)
- **Assets**: 8 files (5.4%)
- **Config**: 7 files (4.7%)
- **DevOps**: 2 files (1.4%)
- **Other**: 2 files (1.4%)
- **Styles**: 1 files (0.7%)
- **Web**: 1 files (0.7%)

### 📁 Largest Directories

- **root**: 148 files
- **frontend**: 82 files
- **backend**: 35 files
- **frontend\components**: 27 files
- **backend\src**: 24 files

## 🌳 Directory Structure

```
Socio_Economic_Survey/
├── 📂 .github/
│   └── 📂 appmod/
│   │   └── 📂 appcat/
├── 🟡 🚫 **.gitignore**
├── 📂 .qoder/
│   ├── 📂 agents/
│   └── 📂 skills/
├── 📂 .qodo/
│   ├── 📂 agents/
│   └── 📂 workflows/
├── 📂 APIS/
│   ├── 📂 Slum's_HH_Data/
│   │   └── 📜 Slum_69.js
│   ├── 📜 SLUMS.js
│   └── 📜 WARDS.js
├── 📂 backend/
│   ├── 🟡 🔒 **package-lock.json**
│   ├── 🔴 📦 **package.json**
│   ├── 🔴 📖 **README.md**
│   ├── 📂 scripts/
│   │   ├── 📜 check-assignments.js
│   │   ├── 📜 check-ganj-demographics.js
│   │   ├── 📜 seed-slums.js
│   │   ├── 📜 seed-states-districts.js
│   │   ├── 📜 seed-users.js
│   │   ├── 📜 seed-wards.js
│   │   ├── 📜 test-women-headed-hh.js
│   │   └── 📜 validate-demographic-data.js
│   └── 📁 src/
│   │   ├── 📜 app.js
│   │   ├── 📂 controllers/
│   │   │   ├── 📜 authController.js
│   │   │   ├── 📜 locationController.js
│   │   │   ├── 📜 slumController.js
│   │   │   ├── 📂 survey/
│   │   │   │   ├── 📜 assignmentController.js
│   │   │   │   ├── 📜 householdSurveyController.js
│   │   │   │   ├── 📜 slumController.js
│   │   │   │   └── 📜 slumSurveyController.js
│   │   │   └── 📜 userController.js
│   │   ├── 📂 middlewares/
│   │   │   └── 📜 auth.js
│   │   ├── 📂 models/
│   │   │   ├── 📜 Assignment.js
│   │   │   ├── 📜 District.js
│   │   │   ├── 📜 HouseholdSurvey.js
│   │   │   ├── 📜 Slum.js
│   │   │   ├── 📜 SlumSurvey.js
│   │   │   ├── 📜 State.js
│   │   │   ├── 📜 User.js
│   │   │   └── 📜 Ward.js
│   │   ├── 📂 routes/
│   │   │   ├── 📜 adminRoutes.js
│   │   │   ├── 📜 authRoutes.js
│   │   │   ├── 📜 exportRoutes.js
│   │   │   └── 📂 survey/
│   │   │   │   └── 📜 surveyRoutes.js
│   │   └── 🔧 utils/
│   │   │   ├── 📂 helpers/
│   │   │   │   └── 📜 responseHelper.js
│   │   │   └── 📜 statusSyncHelper.js
├── 📖 context.md
├── 📖 DOCS/
│   ├── 📖 API_ENDPOINTS.md
│   ├── 📖 COMPLETE_IMPLEMENTATION_GUIDE.md
│   ├── 📖 COMPONENT_API_REFERENCE.md
│   ├── 📖 field_mapping_analysis.md
│   ├── 📖 FRONTEND_REDESIGN_SUMMARY.md
│   ├── 📖 HHQC_IMPLEMENTATION.md
│   ├── 📖 HHQC_USER_GUIDE.md
│   ├── 📖 Household Survey From.md
│   ├── 📖 HOUSEHOLD_SURVEY_MODEL_UPDATE.md
│   ├── 📖 IMPLEMENTATION_COMPREHENSIVE_DOCUMENTATION.md
│   ├── 📖 INTEGRATION_STATUS_REPORT.md
│   ├── 📖 LAYOUT_CODE_EXAMPLES.md
│   ├── 📖 LAYOUT_STRUCTURE_GUIDE.md
│   ├── 📖 PRD.md
│   ├── 📖 PWA_IMPLEMENTATION_GUIDE.md
│   ├── 📖 QUICK_START_GUIDE.md
│   ├── 📖 RUNNING.md
│   ├── 📖 Slum survey form.md
│   ├── 📖 SLUM_ASSIGNMENT_RESTRICTION.md
│   ├── 📖 SLUM_FILTER_FEATURE.md
│   ├── 📖 SLUM_MANAGEMENT_CRUD_GUIDE.md
│   ├── 📖 SLUM_MANAGEMENT_README.md
│   ├── 📖 SURVEY_WORKFLOW_IMPLEMENTATION.md
│   └── 📖 UI_Specification.md
├── 📂 frontend/
│   ├── 🟡 🚫 **.gitignore**
│   ├── 🚀 app/
│   │   ├── 📂 admin/
│   │   │   ├── 📂 assignments/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   ├── 📂 dashboard/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   ├── 📂 slums/
│   │   │   │   ├── 📂 [id]/
│   │   │   │   │   └── ⚛️ page.tsx
│   │   │   │   └── ⚛️ page.tsx
│   │   │   └── 📂 users/
│   │   │   │   └── ⚛️ page.tsx
│   │   ├── 🎨 globals.css
│   │   ├── ⚛️ layout.tsx
│   │   ├── ⚛️ loading.tsx
│   │   ├── 📂 login/
│   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ page.tsx
│   │   ├── 📂 supervisor/
│   │   │   ├── 📂 assignments/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   ├── 📂 dashboard/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   ├── 📂 hhqc/
│   │   │   │   ├── 📂 [id]/
│   │   │   │   │   └── ⚛️ page.tsx
│   │   │   │   └── ⚛️ page.tsx
│   │   │   ├── 📂 reports/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   └── 📂 slums/
│   │   │   │   ├── 📂 [id]/
│   │   │   │   │   └── ⚛️ page.tsx
│   │   │   │   └── ⚛️ page.tsx
│   │   └── 📂 surveyor/
│   │   │   ├── 📂 dashboard/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   ├── 📂 household-survey/
│   │   │   │   └── 📂 [id]/
│   │   │   │   │   └── ⚛️ page.tsx
│   │   │   ├── 📂 slum-survey/
│   │   │   │   └── 📂 [id]/
│   │   │   │   │   └── ⚛️ page.tsx
│   │   │   └── 📂 slums/
│   │   │   │   ├── 📂 [id]/
│   │   │   │   │   └── ⚛️ page.tsx
│   │   │   │   └── ⚛️ page.tsx
│   ├── 🧩 components/
│   │   ├── ⚛️ Accordion.tsx
│   │   ├── ⚛️ BackNavigationDialog.tsx
│   │   ├── ⚛️ Button.tsx
│   │   ├── ⚛️ Card.tsx
│   │   ├── ⚛️ Checkbox.tsx
│   │   ├── ⚛️ DashboardLayout.tsx
│   │   ├── ⚛️ DashboardStats.tsx
│   │   ├── ⚛️ DeleteConfirmationDialog.tsx
│   │   ├── ⚛️ EditConfirmationDialog.tsx
│   │   ├── ⚛️ HHSCompletionWarningModal.tsx
│   │   ├── ⚛️ HouseholdSurveyModal.tsx
│   │   ├── ⚛️ InfiniteScrollSelect.tsx
│   │   ├── ⚛️ Input.tsx
│   │   ├── ⚛️ InstallPrompt.tsx
│   │   ├── ⚛️ LayoutSkeleton.tsx
│   │   ├── ⚛️ LoadingSpinner.tsx
│   │   ├── ⚛️ LogoutConfirmationDialog.tsx
│   │   ├── ⚛️ ModernTable.tsx
│   │   ├── ⚛️ PWAStatusIndicator.tsx
│   │   ├── ⚛️ Select.tsx
│   │   ├── ⚛️ Sidebar.tsx
│   │   ├── ⚛️ SlumForm.tsx
│   │   ├── ⚛️ Stepper.tsx
│   │   ├── ⚛️ SupervisorAdminLayout.tsx
│   │   ├── ⚛️ SurveyConfirmationDialog.tsx
│   │   ├── ⚛️ SurveyorLayout.tsx
│   │   └── ⚛️ Toast.tsx
│   ├── 📂 contexts/
│   │   ├── ⚛️ PWAContext.tsx
│   │   └── ⚛️ SidebarContext.tsx
│   ├── 🔵 🔍 **eslint.config.mjs**
│   ├── 📚 lib/
│   │   └── 🔷 utils.ts
│   ├── 🔷 next-env.d.ts
│   ├── 🟡 ▲ **next.config.ts**
│   ├── 🟡 🔒 **package-lock.json**
│   ├── 🔴 📦 **package.json**
│   ├── 📜 postcss.config.js
│   ├── 🌐 public/
│   │   ├── 🖼️ apple-touch-icon.png
│   │   ├── 🖼️ favicon.ico
│   │   ├── 🎨 file.svg
│   │   ├── 🎨 globe.svg
│   │   ├── ⚙️ manifest.json
│   │   ├── 🎨 next.svg
│   │   ├── 🌐 offline.html
│   │   ├── 🖼️ SES_logo.png
│   │   ├── 📜 sw.js
│   │   ├── 🎨 vercel.svg
│   │   └── 🎨 window.svg
│   ├── 🔴 📖 **README.md**
│   ├── 📂 scripts/
│   │   └── 📜 create-pwa-assets.js
│   ├── 📂 services/
│   │   └── 🔷 api.ts
│   ├── 🟡 🎨 **tailwind.config.js**
│   ├── 🟡 🔷 **tsconfig.json**
│   ├── 📄 tsconfig.tsbuildinfo
│   ├── 📂 types/
│   │   ├── 🔷 global.d.ts
│   │   └── 🔷 householdSurvey.ts
│   ├── 🔧 utils/
│   │   ├── 🔷 colors.ts
│   │   ├── 🔷 constants.ts
│   │   └── 🔷 navigationConfig.ts
│   └── 🔵 ▲ **vercel.json**
├── 📂 Miscellaneous/
│   └── 📄 Risk Free PR Workflow.txt
└── 🔴 📖 **README.md**
```

## 📖 Legend

### File Types
- 🚫 DevOps: Git ignore
- 📜 JavaScript: JavaScript files
- ⚙️ Config: JSON files
- 📖 Docs: Markdown files
- ⚛️ React: React TypeScript files
- 🎨 Styles: Stylesheets
- 📄 Other: Other files
- 🔷 TypeScript: TypeScript files
- 🖼️ Assets: PNG images
- 🖼️ Assets: Icon files
- 🎨 Assets: SVG images
- 🌐 Web: HTML files
- 📄 Docs: Text files

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
