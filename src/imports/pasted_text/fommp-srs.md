FOMMP  –  Software Requirements Specification (SRS) 
Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
SOFTWARE REQUIREMENTS 
SPECIFICATION 
Farmer Organizations Management and 
Monitoring Platform  (FOMMP) 
Prepared for: Food and Agriculture Organization (FAO) / PEARL Project 
Prepared by: Thilina Gunathilaka (Control Union Sri Lanka). 
Version: 1.1  |  Date: March 2026 
Classification: Confidential 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 
Page 1 of 26 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 2 of 26 
Table of Contents 
 
1.  Document Control ............................................................................................................................. 4 
1.1  Revision History .......................................................................................................................... 4 
1.2  Distribution List ............................................................................................................................ 4 
2.  Introduction ....................................................................................................................................... 5 
2.1  Purpose of This Document .......................................................................................................... 5 
2.2  Scope .......................................................................................................................................... 5 
2.3  Definitions, Acronyms, and Abbreviations.................................................................................... 5 
2.4  References .................................................................................................................................. 6 
3.  Overall System Description ............................................................................................................... 7 
3.1  Product Perspective .................................................................................................................... 7 
3.2  System Context Diagram ............................................................................................................. 7 
3.3  Product Functions Summary ....................................................................................................... 7 
3.4  User Classes and Characteristics ................................................................................................ 7 
3.4.1  AC Committee Members ....................................................................................................... 7 
3.4.2  Commune Agricultural Officers ............................................................................................. 8 
3.4.3  Business Plan Support Team ................................................................................................ 8 
3.4.4  Ministry Committee (MAFF/DACP/GDA) ............................................................................... 8 
3.4.5  FAO / PEARL Project Officers............................................................................................... 8 
3.4.6  System Administrators .......................................................................................................... 8 
3.5  Operating Environment ................................................................................................................ 8 
3.6  Design and Implementation Constraints ...................................................................................... 9 
3.7  Assumptions and Dependencies ................................................................................................. 9 
4.  System Features and Functional Requirements .............................................................................. 10 
4.1  Dashboard Module .................................................................................................................... 10 
4.1.1  AC Dashboard – Cooperative Level .................................................................................... 10 
4.1.2  National Dashboard – Ministry / FAO Level ......................................................................... 10 
4.2  AC Profile Management Module ................................................................................................ 11 
4.2.1  Cooperative Profile ............................................................................................................. 11 
4.2.2  Committee Structure Management ..................................................................................... 12 
4.2.3  Farmer Member Registration .............................................................................................. 12 
4.2.4  Commune Officer Verification Workflow .............................................................................. 13 
4.3  Business Plan Management Module ......................................................................................... 13 
4.3.1  Business Plan Creation ....................................................................................................... 13 
4.3.2  Submission and Approval Workflow .................................................................................... 14 
4.3.3  Progress Reporting and Monitoring ..................................................................................... 14 
4.4  Asset Management Module ....................................................................................................... 15 
4.5  Knowledge Management Module .............................................................................................. 15 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 3 of 26 
4.6  User Management and Role Based Access Control Module...................................................... 16 
4.7  Reporting and Analytics Module ................................................................................................ 17 
4.8  Offline Mobile Module ................................................................................................................ 17 
4.9  Localization and Language Support .......................................................................................... 18 
5.  External Interface Requirements ..................................................................................................... 19 
5.1  User Interface Requirements ..................................................................................................... 19 
5.2  Hardware Interfaces .................................................................................................................. 19 
6.  Non Functional Requirements ......................................................................................................... 20 
6.1  Performance Requirements ....................................................................................................... 20 
6.2  Security Requirements .............................................................................................................. 20 
6.3  Scalability Requirements ........................................................................................................... 21 
6.4  Maintainability Requirements..................................................................................................... 21 
7.  System Architecture and Technical Specifications .......................................................................... 22 
7.1  Architectural Overview ............................................................................................................... 22 
7.2  Technology Stack ...................................................................................................................... 22 
8.  Data Requirements ......................................................................................................................... 23 
8.1  Core Data Entities ..................................................................................................................... 23 
9.  Integration Requirements ................................................................................................................ 24 
9.1  Excel / CSV Integration (Phase 1) ............................................................................................. 24 
9.2  API Design Standards ............................................................................................................... 24 
10.  Appendix ....................................................................................................................................... 25 
10.1  Requirements Traceability Matrix (Summary) .......................................................................... 25 
10.2  Change Control Process ......................................................................................................... 25 
10.3  Approval Sign Off .................................................................................................................... 26 
 
  
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 4 of 26 
1.  Document Control  
 
Document Title Software Requirements Specification – FOMMP 
Document ID CU-FOMMP-SRS-001 
Version 1.1 
Date March 2026 
Prepared By Control Union Inspections (Pvt) Ltd  
Project Manager Thilina Gunathilaka ( Senior Project Manager ) 
Reviewed By FAO / PEARL Project Team 
Approved By TBD – FAO/DACP/GDA Representative 
Status Draft for Review 
Classification Confidential 
 
1.1  Revision History 
Version Date Author Description of Changes Approved By 
1.0 Feb 2026 Thilina Gunathilaka Initial Draft – full  Pending 
1.1 March 2026 Thilina Gunathilaka Initial Draft – full  Pending 
     
 
1.2  Distribution List 
Name / Role Organization Copy Type 
FAO / PEARL Project Officer FAO Cambodia Review & Approval 
DACP/GDA Director Ministry of Agriculture, Forestry and 
Fisheries (MAFF) 
Review & Approval 
PEARL Technical Working 
Group 
PEARL Project Information 
Control Union Project Team Control Union (Cambodia & Sri Lanka)  Working Document 
  
FOMMP  –  Software Requirements Specification (SRS) 
Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
2.  Introduction 
2.1  Purpose of This Document 
This Software Requirements Specification (SRS) defines the complete technical and functional 
requirements for the Farmer Organizations Management and Monitoring Platform (FOMMP). It serves as 
the authoritative reference document for all design, development, testing, deployment, and validation 
activities carried out by Control Union Inspections (Pvt) Ltd. on behalf of the Food and Agriculture 
Organization (FAO) under the PEARL project. 
This document is intended to be used by: 
• Software architects and developers for system design and implementation 
• Project managers for scope management, milestone tracking, and change control 
• FAO / PEARL project officers and DACP/GDA representatives for review, validation, and 
acceptance 
• Future maintenance teams for ongoing support and enhancement 
2.2  Scope 
FOMMP is a comprehensive, bilingual (Khmer/English), web based digital platform with offline mobile 
capabilities, designed to serve as the primary management and monitoring system for Agricultural 
Cooperatives (ACs), Modern Agriculture Communities (MACs), and Producer Groups (PGs) in 
Cambodia. The platform will initially support the 124 farmer organizations participating in the PEARL 
project across four provinces, while being architected for scalability to serve all 1,430+ registered ACs 
nationwide. 
The platform encompasses the following core modules: 
• Dashboard Module (AC level and National level analytics) 
• AC Profile Management Module 
• Business Plan Management Module 
• Asset Management Module 
• Knowledge Management Module 
• User Management and Role Based Access Control (RBAC) Module 
• Reporting and Analytics Module 
• Offline Mobile Module 
2.3  Definitions, Acronyms, and Abbreviations 
Term / Acronym 
Definition 
AC 
Agricultural Cooperative – a legally registered farmer cooperative under 
MAFF/DACP oversight 
API 
Application Programming Interface 
DACP 
Department of Agricultural Cooperative Promotion (under GDA/MAFF) 
DAFF 
Department of Agriculture, Forestry and Fisheries (provincial level) 
FO 
Farmer Organization – umbrella term for MACs, ACs, and PGs 
FOMMP 
Farmer Organizations Management and Monitoring Platform 
GDA 
General Directorate of Agriculture (under MAFF) 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 
Page 5 of 26 
FOMMP  –  Software Requirements Specification (SRS) 
Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
Term / Acronym 
Definition 
GCF 
Green Climate Fund 
ICS 
Internal Control System – offline first mobile data collection module 
KPI 
Key Performance Indicator 
MAC 
Modern Agriculture Community – higher tier farmer organization 
MAFF 
Ministry of Agriculture, Forestry and Fisheries of Cambodia 
MEAL 
Monitoring, Evaluation, Accountability and Learning (FAO framework) 
MFA 
Multi Factor Authentication 
MoE 
Ministry of Environment of Cambodia 
PEARL 
Public Social Private Partnerships for Ecologically Sound Agriculture and Resilient 
Livelihood in Northern Tonle Sap Basin 
PDAFF 
Provincial Department of Agriculture, Forestry and Fisheries 
PG 
Producer Group – basic tier farmer organization 
RBAC 
Role Based Access Control 
REST 
Representational State Transfer (API architectural style) 
SRS 
Software Requirements Specification – this document 
SSL/TLS 
Secure Sockets Layer / Transport Layer Security 
UAT 
User Acceptance Testing 
UC 
Use Case 
2.4  References 
• FOMMP Concept Note – Draft for FO Platform (PEARL Project) 
• Technical Proposal: Provision of Services to Develop FOMMP – Control Union Inspection Pvt 
Ltd. for FAO, 2025 
• PEARL Project Documentation – FAO Cambodia 
• ISO/IEC/IEEE 29148:2018 – Systems and software engineering – Requirements engineering 
• GDPR Guidelines – General Data Protection Regulation (applied as data governance baseline) 
• OWASP Application Security Verification Standard (ASVS) v4.0 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 
Page 6 of 26 
FOMMP  –  Software Requirements Specification (SRS) 
Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
3.  Overall System Description 
3.1  Product Perspective 
FOMMP is a purpose built, standalone digital platform commissioned by FAO under the PEARL project 
and implemented by Control Union (Cambodia) Co. Ltd. It is derived from and extends Control Union's 
existing TerRaX agricultural management platform, which is an open source, field tested system 
deployed across multiple regions for farmer group management, traceability, and certification monitoring. 
FOMMP is not a general purpose ERP system but a domain specific cooperative management platform 
tailored to Cambodia's agricultural cooperative governance structure. It will operate as the central data 
repository and workflow management system connecting Agricultural Cooperatives, Commune 
Agricultural Officers, the Business Plan Support Team, MAFF/DACP Ministry authorities, and 
FAO/PEARL project officers. 
3.2  System Context Diagram 
System Context: FOMMP sits at the center of a multi stakeholder ecosystem. AC Committees enter data via 
web browser → Commune Officers verify via web → Ministry/FAO monitor via national dashboards → Data 
flows bidirectionally with Excel/CSV for import export. 
3.3  Product Functions Summary 
Module 
Primary Function 
Key Outputs 
Dashboard 
Real time analytics at cooperative and 
national levels 
KPI dashboards, heatmaps, alerts 
AC Profile Management 
Register, verify, and maintain cooperative 
digital identity 
Business Plan 
Management 
Create, submit, review, approve, and 
monitor cooperative business plans 
Verified cooperative database 
Approved plans, progress reports 
Asset Management 
Track cooperative assets from registration to 
disposal 
Knowledge 
Management 
Disseminate agricultural knowledge from 
Ministry to cooperatives 
Asset inventory, Asset status 
Knowledge library, dissemination 
logs 
User Management / 
RBAC 
Secure user accounts with role based data 
access 
User accounts, audit logs 
Reporting & Analytics 
Generate standard and ad hoc reports 
Offline Mobile 
PDF/Excel reports, data exports 
Enable data capture in areas without 
internet connectivity 
3.4  User Classes and Characteristics 
3.4.1  AC Committee Members 
Synchronized field data 
AC Committee Members are the primary data entry users. They include the Chairman, Vice Chairman, 
Treasurer, Secretary, and other elected or appointed committee roles within each Agricultural 
Cooperative. These users may have varying levels of digital literacy, and many operate in areas with 
limited or intermittent internet connectivity. The system must accommodate users with basic tablet or web 
browser skills, with a heavily localized Khmer language interface as the primary mode of interaction. 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 
Page 7 of 26 
FOMMP  –  Software Requirements Specification (SRS) 
Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
Approximately 2–10 committee members per AC, totaling potentially 1,000+ users across all supported 
ACs. 
3.4.2  Commune Agricultural Officers 
Commune Agricultural Officers (CAOs) are government extension workers responsible for one or more 
communes. They serve as field verifiers and data validators between cooperatives and the Ministry. 
CAOs access the system primarily via web browsers on shared or personal computers at commune 
offices. They are expected to have moderate digital literacy and are the primary conduit for knowledge 
material dissemination to cooperatives. Approximately 50–250 CAOs will use the system across the four 
PEARL provinces. 
3.4.3  Business Plan Support Team 
The Business Plan Support Team consists of technical officers within GDA/DACP or PEARL who review, 
annotate, and guide cooperative business plans before FAO/ministry approval. These users have high 
digital literacy and will primarily use dashboard and workflow management features. Approximately 5–50 
users. 
3.4.4  Ministry Committee (MAFF/DACP/GDA) 
Ministry level users are senior officials within MAFF, DACP, or GDA who oversee national cooperative 
performance. They require access to high level analytics, KPI dashboards, and report generation tools. 
Approximately 10–30 users. 
3.4.5  FAO / PEARL Project Officers 
FAO and PEARL project officers use the system for project monitoring, evaluation, and reporting to GCF 
and other stakeholders. They require read only or limited edit access to national dashboards, business 
plan status, and knowledge dissemination metrics. Approximately 5–10 users. 
3.4.6  System Administrators 
System Administrators are Control Union technical staff or designated DACP IT officers responsible for 
user management, system configuration, data backup, and platform maintenance. They have full system 
access including administrative functions not available to other user classes. Approximately 2–5 users. 
3.5  Operating Environment 
Component 
Specification 
Web Application 
Modern web browsers (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+) on 
desktop, laptop, and tablet devices 
Mobile Application 
Android 8.0 (API level 26) and above or IOS; minimum 2GB RAM; 4G/3G/2G 
or offline capable 
Server Infrastructure 
Local on premises servers  
Internet Connectivity 
Web platform requires minimum 3G connection; mobile app operates fully 
offline 
Display Resolution 
Minimum 1280x768 for web; responsive design for mobile screens 5 inch 
and above 
Storage (Mobile) 
Minimum 500MB free storage for offline data cache on Mobile devices 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 
Page 8 of 26 
FOMMP  –  Software Requirements Specification (SRS) 
Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
3.6  Design and Implementation Constraints 
• The system must be built exclusively on open source technologies to ensure government 
ownership and prevent vendor lock in 
• All source code, documentation, and deployment scripts must be transferred to DACP/GDA 
upon project completion 
• The mobile application is scoped to Android, and iOS 
• The platform must operate on local government server infrastructure without mandatory 
dependency on cloud hosting 
• The 12 month project timeline must be adhered to; phased rollout is required within this period 
• All UI text, labels, error messages, reports, and notifications must be available in both Khmer 
and English 
• Data privacy must align with GDPR principles as the baseline governance framework 
3.7  Assumptions and Dependencies 
ID 
Type 
Statement 
ASM-01 Assumption FAO/PEARL will make key stakeholders available for requirements workshops, 
prototype reviews, and UAT sessions within the defined project timeline 
ASM-02 
Assumption 
Existing AC data in Excel/CSV format will be provided to the development team for 
data migration planning 
ASM-03 Assumption Server hardware and hosting infrastructure will be provisioned and operational 
before Phase 5 full deployment 
ASM-04 
Assumption 
All end users (AC Committee Members) have access to at minimum a basic Android 
smartphone capable of running the mobile application 
ASM-05 Assumption Khmer language translations and agricultural terminology used in the platform will be 
validated by FAO subject matter experts during the pilot phase 
ASM-06 
Assumption 
FAO/DACP/GDA will designate at least two IT capable staff for system administrator 
training before platform handover 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 
Page 9 of 26 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 10 of 26 
4.  System Features and Functional Requirements 
This section specifies all functional requirements for the FOMMP system, organized by module. Each 
requirement is identified with a unique ID, a priority level (Critical / High / Medium / Low), and its source 
document. Requirements marked Critical are mandatory for system acceptance; High requirements must 
be delivered in Phase 1; Medium in Phase 2; Low are designated for future phases. 
Priority Legend: Critical = blocking for launch | High = Phase 1 mandatory | Medium = Phase 2 | Low = Future 
phase 
4.1  Dashboard Module 
The Dashboard Module provides role specific, real time analytical views for all user types. Dashboards 
are automatically populated from data entered across all other modules and must refresh to reflect the 
latest data within 24 hours of field entry. 
4.1.1  AC Dashboard – Cooperative Level 
Accessible by AC Committee Members to monitor the internal health, membership, assets, and business 
plan progress of their own cooperative. 
Req. ID Title Description Priority 
DASH
AC-01 
Total Membership 
Display 
Display total active members, new members enrolled in the 
current calendar year, and member dropout rate as a percentage 
Critical 
DASH
AC-02 
Member 
Demographics 
Visualization 
Display member demographics including gender distribution 
(M/F/Other), age group bands, and distribution by crop type and 
livestock category using chart components 
High 
DASH
AC-03 
Business Plan 
Status Widget 
Display the cooperative's current business plan status: Submitted 
/ Under Review / Approved / Rejected; current implementation 
progress as a percentage; list of upcoming milestones with due 
dates; and red/amber alerts for activities that are overdue 
Critical 
DASH
AC-04 
Asset Overview 
Widget 
Display count of active assets, breakdown by condition 
(Good/Fair/Poor/Out of Service), and a list of assets overdue for 
maintenance 
High 
DASH
AC-05 
Knowledge & 
Training Metrics 
Show number of knowledge materials received, activity 
completion indicator, and member participation statistics for 
training sessions 
Medium 
DASH
AC-06 
Auto Refresh Dashboard data must refresh automatically or via a manual 
refresh button and must always reflect data as of the last 
successful sync 
High 
DASH
AC-07 
Graduation Status 
Indicator 
Display the cooperative's current graduation stage (Starter / 
Developing / Expanding/ Advanced) and date of last assessment 
High 
 
4.1.2  National Dashboard – Ministry / FAO Level 
Accessible by Ministry Committee, FAO/PEARL Officers, and System Administrators. Provides 
nationwide consolidated analytics for oversight, policy planning, and resource allocation. 
Req. ID Title Description Priority 
DASH
NAT-01 
National AC 
Overview 
Display total number of ACs by status 
(Active/Inactive/Suspended/Withdrawn), newly registered ACs in 
Critical 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 11 of 26 
Req. ID Title Description Priority 
the current year, and geographic distribution by province and 
district on an interactive map or heatmap 
DASH
NAT-02 
National 
Membership 
Statistics 
Display total enrolled farmers nationwide, member trend line over 
time (monthly/quarterly), and demographic breakdown by gender, 
age, and crop type at national and provincial level 
Critical 
DASH
NAT-03 
Business Plan 
Analytics 
Display number of business plans submitted, approved, rejected 
(with top rejection reasons), and in progress; approval rate as a 
KPI; provincial comparison of business plan performance 
Critical 
DASH
NAT-04 
Asset Management 
Metrics 
Display total reported assets across all ACs, estimated total asset 
value, percentage of assets in each condition category, and 
maintenance compliance rate 
High 
DASH
NAT-05 
Performance 
Heatmap 
Render a provincial/district level heatmap identifying high 
performing ACs, underperforming ACs, and regions requiring 
intervention based on composite scoring of graduation stage, 
business plan compliance, and membership activity 
High 
DASH
NAT-06 
Knowledge 
Dissemination 
Metrics 
Display total knowledge materials uploaded to the system, 
percentage of ACs that have accessed/downloaded materials, and 
dissemination adoption rates by province 
High 
DASH
NAT-07 
Filter and Drill Down Support filtering of all national dashboard elements by: province, 
district, cooperative type (AC/MAC/PG), graduation stage, date 
range, and business plan status 
High 
DASH
NAT-08 
Provincial 
Dashboard 
Provide an intermediate provincial level dashboard view 
accessible by PDAFF officers, showing the same metrics as the 
national dashboard but scoped to their assigned province 
Medium 
DASH
NAT-09 
Disaggregated 
Reporting 
Dashboard 
Provides age and gender-disaggregated insights across profiles, 
business plans, assets, and training modules to support inclusive 
monitoring, youth tracking, and GESI-focused decision-making. 
High 
4.2  AC Profile Management Module 
The AC Profile Management Module is the foundational data layer of FOMMP, establishing the verified 
digital identity of each Agricultural Cooperative. All other modules reference the AC profile as the master 
record. 
4.2.1  Cooperative Profile 
Req. ID Title Description Priority 
PROF-01 AC Profile Creation Allow public users to apply a new cooperative registration 
application capturing: cooperative name (Khmer and English), 
province, district, commune, village, GPS coordinates 
(latitude/longitude), establishment date, legal status, primary 
contact name, contact phone number, and email address 
Critical 
PROF-02 AC Profile Update Allow AC Committee Members to update any editable field of the 
cooperative profile; all changes must be timestamped and 
attributed to the editing user; edited profiles requiring re verification 
must re enter the Commune Officer verification workflow 
Critical 
PROF-03 AC Status 
Management 
Enable Ministry/Admin users to set and update AC status with 
mandatory selection from: Active, Withdrawn, Suspended, 
Critical 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 12 of 26 
Req. ID Title Description Priority 
Dissolved, or Under Review; status changes require mandatory 
reason text and are permanently recorded with date and user 
PROF-04 AC Document 
Attachment 
Allow AC Committee to attach digital copies of official documents 
to the cooperative profile: registration certificate, committee 
appointment minutes, cooperative constitution/bylaws, and audit 
reports; support PDF, Word, and image file formats 
High 
PROF-05 Bulk Data Import Support bulk import of existing AC profile data from a standardized 
Excel/CSV template; the system must validate imported data 
against defined business rules and generate an import report 
showing: successful records, validation errors, and skipped 
duplicates 
High 
PROF-06 AC Search and 
Filter 
Allow all authorized users to search for ACs by: registration 
number, name (partial match), province, district, commune, type, 
graduation stage, status, and certification type; results must be 
paginated (25 records per page default) 
Critical 
 
4.2.2  Committee Structure Management 
Req. ID Title Description Priority 
PROF-07 Committee Role 
Setup 
Allow AC Committee Chairman to define the committee structure 
by assigning system defined roles: Chairman, Vice Chairman, 
Treasurer, Secretary, plus up to 5 custom committee roles defined 
by the cooperative 
Critical 
PROF-08 Committee Version 
Tracking 
Maintain a versioned history of committee structure changes; each 
committee version is dated with start and end dates; the current 
active committee is always clearly indicated 
High 
PROF-09 Committee 
Member Profile 
Each committee member record must capture: full name, national 
ID number, gender, date of birth, phone number, role title, 
appointment date, and term end date (if defined) 
High 
4.2.3  Farmer Member Registration 
Req. ID Title Description Priority 
PROF-10 Member 
Registration Form 
Allow AC Committee to register individual farmer members with: 
full name, national ID, gender, date of birth, village, phone number, 
total cultivated land area (hectares), primary crops (multi select), 
secondary crops, livestock types and counts, and membership 
start date 
Critical 
PROF-11 Member Status 
Tracking 
Track each member's status as: Active, Inactive, or Withdrawn; 
status changes are recorded with date and reason 
High 
PROF-12 Member Search Allow search of members within an AC by name, national ID, 
gender, or crop type; results must display key member 
information at a glance 
High 
PROF-13 Member 
Demographics 
Summary 
Auto calculate and display membership totals and demographic 
breakdowns for each AC including gender ratio, average land 
area, and crop distribution 
High 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 13 of 26 
Req. ID Title Description Priority 
PROF-14 Member Data 
Export 
Allow export of the full member list for a given AC to Excel format Medium 
4.2.4  Commune Officer Verification Workflow 
Req. ID Title Description Priority 
PROF-19 Verification Queue Commune Officers must have a dedicated verification queue 
showing all AC profiles in their commune that are pending initial 
verification or reverification after update 
Critical 
PROF-20 Profile Review 
Interface 
Provide Commune Officers with a read only view of all submitted 
AC profile data with the ability to add verification notes per section 
Critical 
PROF-21 Approve / Return 
Action 
Commune Officers can either: Approve the profile (making it Active 
in the system) or Return it to the AC Committee with mandatory 
written comments explaining required corrections 
Critical 
PROF-22 Verification 
Notification 
System must notify the AC Committee via an in app notification 
when their profile has been approved or returned with comments 
High 
PROF-23 Verification Audit 
Trail 
All verification actions (approve/return) are permanently logged 
with timestamp and officer identity and are viewable by 
Ministry/Admin users 
High 
4.3  Business Plan Management Module 
This module manages the complete lifecycle of cooperative business plans: from creation and 
submission through multi level review, approval, and ongoing progress monitoring. It enforces a 
standardized planning framework while supporting cooperative specific data. 
4.3.1  Business Plan Creation 
Req. ID Title Description Priority 
BP-01 Standardized Plan 
Template 
Provide a standardized digital business plan template form with 
main Modules for; 1. Cooperative Profile 2. Business Project 
modules 
Critical 
BP-02 Document 
Attachment 
Allow attachment of supporting documents within a business plan: 
market studies, feasibility assessments, production schedules, 
financial statements, and partnership agreements; support PDF, 
Excel, Word, and image formats 
High 
BP-03 Auto Population Auto populate the business plan form with data already held in 
the cooperative's profile (name, type, location, membership count, 
crop types, current certifications) 
High 
BP-04 Draft Save Allow AC Committee to save a business plan as a draft and return 
to edit it at any time before submission; drafts are not visible to 
reviewers 
Critical 
BP-05 Plan Duplication Allow duplication of a previously approved plan as a starting point 
for a new plan year, reducing data re entry effort 
Medium 
 
 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 14 of 26 
 
4.3.2  Submission and Approval Workflow 
Req. ID Title Description Priority 
BP-06 Submission Action AC Committee Chairman can formally submit a completed draft 
business plan, changing its status from Draft to Submitted; 
submission triggers automatic notification to the Business Plan 
Support Team 
Critical 
BP-07 Support Team 
Review Interface 
Business Plan Support Team members can view submitted plans 
in a dedicated review queue; they can annotate individual sections 
with comments, request specific revisions, and mark sections as 
Reviewed 
Critical 
BP-08 Revision Request Support Team can send a plan back to the AC Committee with 
Revision Requested status and mandatory written comments; the 
AC Committee receives a notification and can edit and resubmit 
Critical 
BP-09 Forward to Ministry When the Support Team is satisfied, they forward the plan to the 
Ministry / FAO Committee for final decision, changing status to 
Pending Ministry / FAO  Approval 
Critical 
BP-10 Ministry/FAO 
Approval / 
Rejection 
Ministry / FAO  Committee members can Approve or Reject the 
forwarded plan; rejection requires mandatory selection of rejection 
reason from a predefined list plus free text explanation; both 
actions trigger notifications to the AC Committee and Support 
Team 
Critical 
BP-11 Approval History Full approval workflow history (every status change, who 
performed it, when, and any comments) must be permanently 
stored and viewable by Ministry/Admin users 
High 
BP-12 Automated 
Notifications 
System must send in app notifications at every workflow stage 
transition; notification content must identify the plan, the new 
status, and any action required 
High 
4.3.3  Progress Reporting and Monitoring 
Req. ID Title Description Priority 
BP-13 Progress Update 
Submission 
Allow AC Committee to submit periodic progress updates (monthly 
or quarterly as configured by Ministry) against each milestone in an 
approved business plan; each update captures: activities 
completed, percentage complete, resources utilized, challenges 
encountered, and supporting photos/documents 
Critical 
BP-14 Milestone Tracking System automatically calculates overall plan progress percentage 
based on milestone completion data and displays it on both the AC 
Dashboard and National Dashboard 
High 
BP-15 Overdue Alerts System generates automatic alerts when: a progress update is 
overdue (not submitted within the configured reporting period), or 
when a milestone deadline passes with less than 50% completion 
reported 
High 
BP-16 Business Plan 
Comparison 
Ministry/FAO users can view side by side comparison of target 
versus actual progress across multiple cooperatives filtered by 
province, plan year, or cooperative type 
Medium 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 15 of 26 
 
4.4  Asset Management Module 
This module provides a complete digital lifecycle management system for all assets owned by, donated 
to, or used by an AC. It ensures transparency, accountability, and proper stewardship of cooperative 
resources. 
Req. ID Title Description Priority 
ASSET
01 
Asset 
Registration 
Allow AC Committee to register a new asset capturing: asset type 
(Equipment/Vehicle/Building/Infrastructure/Other), asset name, 
description, serial/identification number, acquisition date, acquisition 
method (Purchased/Donated by PEARL/Donated by Other 
Program/Government Grant/Own Funds), acquisition cost or 
estimated value, current location, and responsible custodian name 
Critical 
ASSET
02 
Asset Photo 
Upload 
Allow attachment per asset for visual documentation of the asset at 
registration and after maintenance 
High 
ASSET
03 
Asset Condition 
Update 
Allow AC Committee to update an asset's condition at any time with 
selection from: Good, Fair, Poor, or Out of Service; each update 
captures: condition rating, date assessed, notes, and optional photos 
Critical 
ASSET
04 
Usage Log Allow AC Committee to record usage events for shared/communal 
assets including: date of use, user (member name or group), duration, 
and purpose 
Medium 
ASSET
05 
Disposal 
Request 
Allow AC Committee to submit an asset disposal request with: 
justification for disposal, proposed disposal method 
(Sell/Scrap/Transfer/Write Off), and any available valuation document 
High 
ASSET
06 
Commune 
Officer Asset 
Verification 
Newly registered assets must go through a Commune Officer 
verification step before being marked as Verified in the system; 
Commune Officers can Approve or Reject with comments; disposal 
requests also require Commune Officer approval 
Critical 
ASSET
07 
Asset Inventory 
Report 
Generate asset inventory reports filterable by: AC, province, asset 
type, condition, acquisition source, and date range; exportable to PDF 
and Excel 
High 
ASSET
08 
PEARL Asset 
Tracking 
Tag and filter assets specifically funded or donated by the PEARL 
project for separate reporting to FAO/GCF 
Critical 
ASSET
09 
Asset Value 
Tracking 
National dashboard displays total estimated value of assets across all 
cooperatives broken down by province and asset category 
Medium 
4.5  Knowledge Management Module 
The Knowledge Management Module is the centralized digital library and communication portal for 
sharing agricultural knowledge, guidelines, training materials, and official information from Ministry level 
down to cooperative members. 
Req. ID Title Description Priority 
KM-01 Content Upload Allow Ministry/Admin users to upload knowledge materials in 
formats: PDF, MP4 video (max 500MB), JPEG/PNG image, Word 
document (.docx), Excel (.xlsx), and PowerPoint (.pptx); stored on 
Amazon S3 
Critical 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 16 of 26 
Req. ID Title Description Priority 
KM-02 Content 
Categorization 
Each uploaded material must be categorized by: content type 
(User Manual / Agricultural Technique / Market Price Update / 
Government Announcement / Pest/Disease Alert / Training Video / 
Fertilizer Guide / Seed Guide / Other), target crop type (multi 
select), target province/district (or All), and language (Khmer / 
English / Both) 
High 
KM-03 Content Metadata Each material record captures: title (Khmer and English), 
description, upload date, uploaded by (user name and role), 
version number, and status (Active/Archived) 
High 
KM-04 Searchable 
Knowledge Library 
All users can search the knowledge library by: keyword, content 
type, crop type, language, and upload date range; results displayed 
with title, category, upload date, and file size 
Critical 
4.6  User Management and Role Based Access Control Module 
This module manages all user accounts and enforces a strict hierarchical permission model ensuring 
each user sees and can act only upon data appropriate to their role and geographic scope. 
Req. ID Title Description Priority 
UM-01 User Account 
Creation 
System Administrators can create new user accounts by 
providing: full name, role (from defined list), 
organization/cooperative affiliation, assigned 
province/district/commune (where applicable), email address, and 
phone number; system auto generates a temporary password and 
sends it securely to the new user through email 
Critical 
UM-02 Defined System 
Roles 
System must support the following predefined roles with distinct 
permission sets: (1) AC Committee Member, (2) Commune 
Agricultural Officer, (3) Business Plan Support Team, (4) Ministry 
Committee Member, (5) FAO/PEARL Project Officer, (6) 
Provincial PDAFF Officer, (7) System Administrator 
Critical 
UM-03 Role Based Data 
Scoping 
Data visibility is automatically scoped by role: AC Committee 
Members see only their cooperative's data; Commune Officers 
see all ACs within their assigned commune(s); PDAFF Officers 
see all ACs within their province; Ministry/FAO/Admin see all data 
nationwide 
Critical 
UM-04 User Account 
Deactivation 
System Administrators can deactivate user accounts; deactivated 
users cannot log in but their historical actions and data entries 
remain intact for audit purposes 
High 
UM-05 User Self Service Authenticated users can update their own: display name, phone 
number, and password; changes to role or geographic scope 
require System Administrator action 
High 
UM-06 Audit Log All user actions are logged immutably with: user ID, action type, 
module, record affected, timestamp, and IP address; audit logs 
are accessible only to System Administrators and retained for 5 
years minimum 
Critical 
UM-07 Account Lockout After 5 consecutive failed login attempts, an account must be 
automatically locked; an Administrator or the user themselves (via 
email verification) must unlock the account 
Critical 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 17 of 26 
Req. ID Title Description Priority 
UM-08 Session 
Management 
Authenticated sessions must expire after 60 minutes of inactivity; 
users are warned 5 minutes before expiry and given the option to 
extend their session 
High 
UM-09 Password Policy Passwords must meet minimum requirements: 8 characters, 1 
uppercase, 1 lowercase, 1 numeric, 1 special character; 
passwords expire every 90 days for Administrator accounts 
High 
UM-10 User Activity 
Report 
System Administrators can generate user activity reports 
showing: last login date, number of records created/updated, and 
login frequency per user 
Medium 
4.7  Reporting and Analytics Module 
This module provides standard pre built reports and ad hoc reporting capabilities. All reports must be 
available in both Khmer and English. 
Req. ID Title Description Priority 
RPT-01 Standard Report: 
AC Registration 
Summary 
Generate a paginated report listing all registered ACs with: 
registration number, name, type, province/district/commune, 
graduation stage, status, registration date, and total membership; 
filterable by province, type, status 
Critical 
RPT-02 Standard Report: 
Business Plan 
Status 
Generate a report showing all business plans with: AC name, 
plan year, plan type, current status, submission date, approval 
date, and latest progress percentage; filterable by province, 
status, and year 
Critical 
RPT-03 Standard Report: 
Asset Inventory 
Generate a complete asset inventory report listing all assets by 
AC with condition, acquisition source, estimated value, and last 
maintenance date; filterable by province, asset type, condition 
High 
RPT-04 Standard Report: 
Member 
Demographics 
Generate a demographic breakdown report at national, provincial, 
or cooperative level showing gender, age group, crop type, and 
land area statistics 
High 
RPT-05 Standard Report: 
Knowledge 
Dissemination 
Generate a report showing all uploaded knowledge materials, 
number of ACs reached, delivery rates by Commune Officer, and 
provincial adoption rates 
High 
RPT-06 Standard Report: 
PEARL Project FO 
Summary 
Generate a PEARL specific report consolidating data for all 124 
PEARL supported FOs including profiles, business plan status, 
asset inventory, and graduation tracking for GCF/FAO reporting 
Critical 
4.8  Offline Mobile Module 
The mobile module is an Android / IOS application enabling AC Committee Members and Commune 
Officers to collect and enter data in field conditions without internet connectivity. 
Req. ID Title Description Priority 
OFF-01 Full Offline 
Functionality 
The mobile application must enable users to perform some data 
entry operations (member / farmer details and asset details / 
assessment scoring / progress updates, and GPS/photo capture. 
Critical 
OFF-02 Local Data Storage All data entered offline must be stored in an encrypted local 
database on the mobile device until synchronization is performed 
Critical 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 18 of 26 
Req. ID Title Description Priority 
OFF-03 Manual Sync 
Trigger 
Users must also have the ability to manually trigger 
synchronization at any time when connected 
High 
OFF-04 Conflict Detection 
and Resolution 
When the same record has been modified both offline and on the 
web platform since the last sync, the system must detect the 
conflict and apply a defined resolution policy: latest write wins with 
a conflict notification to the user 
High 
OFF-05 Sync Status 
Indicator 
The mobile app must display a clear sync status indicator showing: 
last successful sync timestamp, number of records pending sync, 
and any sync errors 
High 
OFF-06 GPS Capture The mobile app must support GPS coordinate capture for farm 
mapping, asset location recording, and cooperative location 
verification; GPS must function offline 
High 
OFF-07 Photo Capture Allow in app photo capture using the device camera for asset 
registration photos, farm conditions; photos are queued for upload 
during synchronization 
High 
4.9  Localization and Language Support 
Req. ID Title Description Priority 
LOC-01 Bilingual Interface Every screen, form label, button, menu item, error message, 
notification, and tooltip in the web application must be available in 
both Khmer and English; user can switch language at any time 
without data loss 
Critical 
LOC-02 Language 
Preference 
User language preference is saved to their account and applied 
automatically on login 
High 
LOC-03 Khmer Font 
Support 
The system must use a standard, legible Khmer Unicode font 
(e.g., Khmer OS Siemreap or equivalent) that renders correctly 
across all supported browsers and in exported PDFs 
Critical 
LOC-04 Date/Number 
Format 
Date formats must follow the Cambodian standard 
(DD/MM/YYYY); number formats use dot as decimal separator; 
currency displays in Cambodian Riel (KHR)  
High 
  
FOMMP  –  Software Requirements Specification (SRS) 
Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
5.  External Interface Requirements 
5.1  User Interface Requirements 
• All UI components must conform to a consistent design system defined in Figma during the 
design phase 
• Primary UI framework: Angular 20 with Bootstrap for grid and responsive layout 
• Forms must include real time input validation with clear, contextual error messages in the user's 
selected language 
• All data tables must support: column sorting, pagination (configurable page size: 10/25/50/100), 
and CSV/Excel export 
• Navigation must use a persistent sidebar menu with clearly organized module sections and 
breadcrumb trails for sub navigation 
• Loading states and progress indicators must be shown for all operations taking more than 1 
second 
• Confirmation dialogs must be shown before any irreversible action (deletion, status change, 
approval) 
5.2  Hardware Interfaces 
Component 
Specification 
Server (Production) 
Linux based server; minimum 8 core CPU; 32GB RAM; 2TB SSD storage; 1Gbps 
network interface; RAID configuration for data redundancy 
Server 
(Development/Staging) 
Linux based server or VM; minimum 4core CPU; 16GB RAM; 500GB SSD 
Client Devices (Web) 
Standard PC, laptop, or tablet with a supported web browser; minimum 4GB RAM 
recommended 
GPS 
Android / IOS device built in GPS module used for coordinate capture; no additional 
hardware required 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 
Page 19 of 26 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 20 of 26 
6.  Non Functional Requirements 
6.1  Performance Requirements 
Req. ID Requirement Target / Threshold Measurement Method 
NFR-PERF
01 
Web page load time 
(standard broadband) 
< 5 seconds for all 
standard views 
Lighthouse / browser performance 
testing 
NFR-PERF
02 
Web page load time (2G/3G 
connection) 
< 10 seconds for 
standard views 
Network throttling tests 
NFR-PERF
03 
API response time (95th 
percentile) 
< 500ms for CRUD 
operations 
JMeter load testing 
NFR-PERF
04 
Dashboard rendering time 
(national) 
< 8 seconds with 
1,000+ AC records 
JMeter / browser performance 
testing 
NFR-PERF
05 
Concurrent user support Minimum 500 
simultaneous 
authenticated users 
without degradation 
JMeter load testing 
NFR-PERF
06 
File upload throughput Support upload of files 
up to 100MB (video 
content) with progress 
indicator 
Manual testing 
NFR-PERF
07 
Report generation time Standard reports 
generated in < 10 
seconds; complex 
adhoc in < 30 seconds 
Manual + automated testing 
6.2  Security Requirements 
Req. ID Requirement Target / Standard Priority 
NFR-SEC
01 
Transport encryption All data in transit encrypted with TLS 1.2 
minimum; TLS 1.3 preferred 
Critical 
NFR-SEC
02 
Data at rest encryption Database and file storage encrypted with AES256 Critical 
NFR-SEC
03 
Mobile device data 
encryption 
Local SQLite database on Android device 
encrypted with AES 256 (SQLCipher or 
equivalent) 
Critical 
NFR-SEC
04 
Authentication Secure password hashing using bcrypt (work 
factor >= 12); JWT tokens for session 
management 
Critical 
NFR-SEC
05 
RBAC enforcement All API endpoints must enforce RBAC at the 
server side; client side hiding is insufficient 
Critical 
NFR-SEC
06 
SQL injection prevention All database queries must use parameterized 
statements; ORM enforced where possible 
Critical 
NFR-SEC
07 
Penetration testing Penetration test conducted before each major 
deployment (Phase 3, Phase 5) 
High 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 21 of 26 
Req. ID Requirement Target / Standard Priority 
NFR-SEC
08 
Vulnerability scanning Automated dependency vulnerability scanning 
integrated into CI/CD pipeline (OWASP 
Dependency Check or equivalent) 
High 
NFR-SEC
09 
Security headers All HTTP responses must include: Content 
Security Policy, X Frame Options, X Content Type 
Options, Strict Transport Security 
High 
NFR-SEC
10 
Data privacy Personal data handling aligned with GDPR 
principles: purpose limitation, data minimization, 
user data rights 
High 
NFR-SEC
11 
Audit logging All authenticated user actions logged immutably; 
logs tamper evident; retained minimum 5 years 
Critical 
 
6.3  Scalability Requirements 
Req. ID Requirement Target 
NFR-SCAL
01 
Initial scale Support 124 FOs, 2,500 members, and 500 concurrent users in Phase 1 
NFR-SCAL
02 
National scale Architecture must support expansion to 1,430+ ACs, 150,000+ members, 
and 5,000+ users without re architecture or code re engineering 
NFR-SCAL
03 
Horizontal scaling Application tier must support horizontal scaling (adding server instances) 
via Docker/Kubernetes orchestration 
NFR-SCAL
04 
Database scaling Database must support read replicas for reporting workloads without 
impacting transactional performance 
6.4  Maintainability Requirements 
• All source code must follow defined coding standards (Java: Google Java Style Guide; Angular: 
Angular Style Guide) and include inline documentation 
• Unit test coverage must be maintained at minimum 80% for backend service and business logic 
classes 
• All API endpoints must have integration tests 
• The system must use a CI/CD pipeline (GitHub Actions or equivalent) for automated build, test, 
and deployment; pipeline configuration documented 
• Configuration (database credentials, API keys, environment variables) must be externalized 
from code using environment variables or a secrets management system 
• Database schema changes must be managed via migration scripts (Flyway or Liquibase) 
enabling reproducible, version controlled schema evolution 
 
 
 
  
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 22 of 26 
7.  System Architecture and Technical Specifications 
7.1  Architectural Overview 
FOMMP follows a layered, modular architecture based on standard enterprise application patterns. The 
system is divided into three primary tiers: Presentation, Application (Business Logic), and Data. This 
separation ensures maintainability, testability, and independent scalability of each tier. 
7.2  Technology Stack 
Layer Technology Version Purpose 
Frontend Framework Angular Latest Single page application framework; 
component based UI 
UI Components Bootstrap 5.x Responsive grid, layout components, utility 
classes 
Charts & Visualization Apex Charts Latest Dashboard charts: bar, pie, line, area, 
heatmap, geographic 
Report Rendering Jasper Reports Latest 
compatible 
Server side PDF and Excel report 
generation 
UI/UX Design Tool Figma – Wireframes, prototypes, design system 
Backend Language Java 18 (LTS) Server side business logic and API 
development 
Backend Framework Spring Boot 3.2 Application framework; REST API, 
security, ORM integration 
API Security Spring Security 6 Authentication, authorization, CSRF 
protection 
Database MySQL 8.0 Primary relational database for all 
application data 
Containerization Docker Latest Application containerization for consistent 
deployment 
Orchestration Kubernetes Latest Container orchestration, scaling, and 
health management 
CI/CD GitHub Actions (or 
Jenkins) – Automated build, test, and deployment 
pipeline 
Monitoring Custom logging + 
Infrastructure 
Monitoring – Application logs, uptime monitoring, usage 
metrics 
Testing – Backend JUnit 5, Mockito – Unit and integration testing for Java 
services 
Testing – Frontend Jasmine, Karma – Unit testing for Angular components 
 
 
  
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 23 of 26 
8.  Data Requirements 
8.1  Core Data Entities 
Entity Key Attributes Module Notes 
Cooperative 
(AC/MAC/PG) 
CoopID, RegNo, Name(KH/EN), Type, 
Province, District, Commune, Village, 
GPS, Status, EstDate 
Profile Master entity; all 
modules reference this 
Committee CommitteeID, CoopID, Version, StartDate, 
EndDate, IsActive 
Profile Versioned committee 
structure 
CommitteeMember MemberID, CommitteeID, Role, Name, 
NationalID, Gender, DOB, Phone 
Profile Per committee role 
FarmerMember FarmerID, CoopID, Name, NationalID, 
Gender, DOB, Village, Phone, LandArea, 
Status 
Profile Individual cooperative 
members 
FarmerCrop FarmerCropID, FarmerID, CropType, 
IsPrimary, Area 
Profile Multi crop support per 
farmer 
BusinessPlan PlanID, CoopID, Year, PlanType, Status, 
SubmitDate, ApprovalDate, ApprovedBy 
Business 
Plan 
Master plan record 
BPMilestone MilestoneID, PlanID, Title, DueDate, 
TargetValue, Unit, Status 
Business 
Plan 
Plan milestones 
BPProgressUpdate ProgressID, PlanID, Period, SubmitDate, 
SubmitterID, ActivitiesNotes, ProgressPct, 
Challenges 
Business 
Plan 
Periodic updates 
Asset AssetID, CoopID, Type, Name, 
Description, SerialNo, AcquisitionDate, 
Source, Value, Location, CustodianName 
Asset Master asset record 
AssetConditionLog CondLogID, AssetID, Condition, 
AssessDate, Notes 
Asset Condition history 
KnowledgeMaterial MaterialID, Title(KH/EN), ContentType, 
Category, Language, FileURL, 
UploadDate, UploadedBy, Version, Status 
Knowledge Master material record 
User UserID, FullName, Role, OrgAffiliation, 
Province, District, Commune, Email, 
Phone, Status, LastLogin 
User Mgmt System user accounts 
 
 
 
FOMMP  –  Software Requirements Specification (SRS) 
Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
9.  Integration Requirements 
9.1  Excel / CSV Integration (Phase 1) 
Excel and CSV integration is the primary interoperability mechanism for Phase 1, enabling initial data 
migration and ongoing data exchange with external stakeholders who do not have direct system 
access. 
Direction 
Data Type 
AC Profile data 
Format 
Notes 
Import (into 
FOMMP) 
Excel (.xlsx) – 
standardized 
template 
Import (into 
FOMMP) 
Farmer Member data 
Used for initial data migration from DACP 
Excel records 
Excel (.xlsx) – 
standardized 
template 
Bulk member import per cooperative 
Export (from 
FOMMP) 
Business plan data 
Excel (.xlsx) 
For external review and ministry record 
keeping 
Export (from 
FOMMP) 
Asset inventory 
Excel (.xlsx) 
For audit purposes 
9.2  API Design Standards 
• RESTful API design following OpenAPI 3.0 specification; API documentation auto generated 
and hosted at /api/docs 
• API versioning via URL path: /api/v1/, /api/v2/ 
• Authentication: Bearer token (JWT) in Authorization header for all authenticated endpoints 
• HTTP methods: GET (read), POST (create), PUT (full update), PATCH (partial update), 
DELETE (soft delete) 
• Response format: JSON with consistent envelope: { status, data, message, errors, pagination } 
• Error codes: standard HTTP status codes (200, 201, 400, 401, 403, 404, 422, 500) with 
structured error body 
9.3 Kobo Assessment Tool  
• Assessment data needs to flow into FOMMP and feed the graduation scoring module.  
• Build a connector that imports Kobo assessment submissions and maps them to FO profiles. 
• Auto-trigger graduation level recalculation when new assessment data arrives. 
9.4 FAO MEAL Dashboard Export  
• Structured data export aligned with FAO’s M&E framework. 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 
Page 24 of 26 
FOMMP  –  Software Requirements Specification (SRS) Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 Page 25 of 26 
10.  Appendix 
10.1  Requirements Traceability Matrix (Summary) 
The following table provides a high level traceability of requirements to their source documents and test 
phases. Full RTM is maintained in the project management tool. 
Req. ID Range Module Test Phase Priority 
DASH-AC-01 to 08 AC Dashboard Phase 3 System Test, Phase 4 UAT Critical/High 
DASH-NAT-01 to 10 National Dashboard Phase 3 System Test, Phase 4 UAT Critical/High 
PROF-01 to 10 AC Profile – 
Cooperative 
Phase 3 System Test, Phase 4 Pilot Critical/High 
PROF-11 to 15 AC Profile – Members Phase 3 System Test, Phase 4 Pilot Critical/High 
PROF-20 to 22 Certification 
Management 
Phase 3 System Test High/Medium 
PROF-23 to 27 Profile Verification 
Workflow 
Phase 3 System Test, Phase 4 UAT Critical 
BP-01 to 06 Business Plan 
Creation 
Phase 3 System Test Critical/High 
BP-07 to 13 BP Approval 
Workflow 
Phase 3 System Test, Phase 4 UAT Critical 
BP-14 to 18 BP Progress 
Monitoring 
Phase 3 System Test, Phase 4 Pilot Critical/High 
ASSET-01 to 11 DASH-AC-07 
Management 
Phase 3 System Test, Phase 4 Pilot Critical/High 
KM-01 to 09 Knowledge 
Management 
Phase 3 System Test, Phase 4 UAT Critical/High 
UM-01 to 11 User Management / 
RBAC 
Phase 3 System Test Critical/High 
RPT-01 to 11 Reporting & Analytics Phase 3 System Test Critical/High 
LOC-01 to 06 Localization Phase 3 Localization Test, Phase 4 
UAT 
Critical/High 
NFR-PERF-01 to 09 Performance Phase 3 Load Test, Phase 5 Pre launch High/Medium 
NFR-SEC-01 to 14 Security Phase 3 Security Test, Phase 5 Pen 
Test 
Critical/High 
10.2  Change Control Process 
Any change to the requirements defined in this SRS must follow the formal change control process: 
1. Change Request (CR) submitted in writing by the requestor using the Change Request Form 
2. Control Union Project Manager performs impact assessment: scope, budget, and timeline 
impact 
3. Impact assessment shared with FAO/PEARL and DACP/GDA stakeholders 
4. Change approved or rejected by the project steering committee (FAO/PEARL representative + 
DACP/GDA representative + Control Union PM) 
FOMMP  –  Software Requirements Specification (SRS) 
Control Union Inspections (Pvt) Ltd |  FAO / PEARL Project 
5. If approved: SRS updated with new version number; development plan adjusted; 
budget/timeline implications documented 
6. If rejected: Change Request archived with rejection reason 
No development work on out of scope features may begin without a formally approved Change Request. 
10.3  Approval Sign Off 
Role 
Name 
Signature 
SRS Author (Control Union) 
Date 
Thilina Gunathilaka   
FAO / PEARL Reviewer 
DACP/GDA Approver    
PEARL Project Manager 
— End of FOMMP Software Requirements Specification v1.0 — 
Control Union Inspections (Pvt) Ltd |  Prepared for FAO / PEARL Project  |  February 2026 
CONFIDENTIAL  –  FOMMP SRS v1.0  |  February 2026 
Page 26 of 26 