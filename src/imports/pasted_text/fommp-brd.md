FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
BUSINESS REQUIREMENTS 
DOCUMENT 
Farmer Organizations Management and Monitoring 
Platform 
(FOMMP) 
Prepared for: Food and Agriculture Organization (FAO) / PEARL Project 
Prepared by: Thilina Gunathilaka ( Control Union Sri Lanka) . 
Version: 1.1  |  Date: March 2026 
Classification: Confidential 
CONFIDENTIAL – FOMMP BRD v1.0     
Page 1 of 25 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 2 of 25 
Document Control  
 
Document Title Business Requirements Document – FOMMP 
Document ID CU-FOMMP-BRD-001 
Version 1.1 
Date February 2026 
Prepared By Control Union Inspections (Pvt) Ltd  
Project Manager Thilina Gunathilaka ( Senior Project Manager ) 
Reviewed By FAO / PEARL Project Team 
Approved By TBD – FAO/DACP/GDA Representative 
Status Draft for Review 
Classification Confidential 
 
1.1  Revision History 
Version Date Author Description of Changes Approved By 
1.0 Feb 2026 Thilina Gunathilaka Initial Draft – full BRD  Pending 
1.1 March 2026 Thilina Gunathilaka Initial Draft – full BRD  Pending 
     
 
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
  
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 3 of 25 
Table of Contents 
 
Document Control .................................................................................................................................. 2 
1.1  Revision History .......................................................................................................................... 2 
1.2  Distribution List ............................................................................................................................ 2 
Table of Contents .................................................................................................................................. 3 
1. Executive Summary ........................................................................................................................... 5 
2. Project Overview ................................................................................................................................ 6 
2.1 Project Background ...................................................................................................................... 6 
2.2 Problem Statement ....................................................................................................................... 6 
2.3 Solution Overview ........................................................................................................................ 6 
2.4 Project Objectives ........................................................................................................................ 6 
3. Stakeholders ...................................................................................................................................... 7 
3.1 Primary Stakeholders ................................................................................................................... 7 
3.2 Secondary Stakeholders .............................................................................................................. 7 
4. Business Objectives and Goals ......................................................................................................... 8 
5. Scope of the System .......................................................................................................................... 9 
5.1 In Scope ....................................................................................................................................... 9 
5.2 Out of Scope ................................................................................................................................ 9 
6. Functional Requirements ................................................................................................................. 10 
6.1 Dashboard Module ..................................................................................................................... 10 
6.1.1 AC Dashboard (Cooperative Level) ..................................................................................... 10 
6.1.2 National Dashboard (MAFF / FAO / Internal Users) ............................................................. 10 
6.2 AC Profile Management Module ................................................................................................. 11 
6.3 Business Plan Management Module .......................................................................................... 11 
6.4 Asset Management Module ........................................................................................................ 12 
6.5 Knowledge Management Module ............................................................................................... 13 
6.6 User Management and Role Based Access Control ................................................................... 13 
6.7 Reporting and Analytics .............................................................................................................. 14 
6.8 Offline Functionality and Mobile Support .................................................................................... 14 
7. Non Functional Requirements .......................................................................................................... 15 
8. System Architecture and Technical Specifications ........................................................................... 16 
8.1 Technology Stack ....................................................................................................................... 16 
8.2 Architecture Principles ................................................................................................................ 16 
8.3 Deployment Environments ......................................................................................................... 16 
9. Integration Requirements ................................................................................................................. 17 
10. User Roles and Permissions Matrix ............................................................................................... 18 
11. Data Requirements ........................................................................................................................ 19 
11.1 Key Data Entities ...................................................................................................................... 19 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 4 of 25 
11.2 Data Migration .......................................................................................................................... 19 
12. Implementation Plan and Phased Approach .................................................................................. 20 
12.1 Project Phases ......................................................................................................................... 20 
12.2 Pilot Phase Details ................................................................................................................... 20 
12.3 Training Plan ............................................................................................................................ 21 
13. Assumptions and Constraints ........................................................................................................ 22 
13.1 Assumptions ............................................................................................................................. 22 
13.2 Constraints ............................................................................................................................... 22 
14. Risks and Mitigation Strategies ...................................................................................................... 23 
15. Glossary ........................................................................................................................................ 24 
16. Appendix ........................................................................................................................................ 25 
16.1 Source Documents ................................................................................................................... 25 
16.2 Key Contacts ............................................................................................................................ 25 
16.3 Approval Signatures ................................................................................................................. 25 
 
  
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
1. Executive Summary 
The Farmer Organizations Management and Monitoring Platform (FOMMP) is a comprehensive, web 
based digital solution commissioned by the Food and Agriculture Organization (FAO) under the PEARL 
project, implemented in partnership with Cambodia's Ministry of Agriculture, Forestry and Fisheries 
(MAFF) and Ministry of Environment (MoE). 
This Business Requirements Document (BRD) defines the complete set of business needs, functional 
requirements, non functional requirements, and implementation expectations for the FOMMP system. 
The platform will be developed by Control Union Inspections Pvt Ltd, leveraging their existing TerRaX 
agricultural management platform as a technical foundation, customised to meet the specific operational 
and governance requirements of the PEARL project. 
FOMMP is designed to replace the current Excel based, manual cooperative management system used 
by the Department of Agricultural Cooperative Promotion (DACP) of the General Directorate of 
Agriculture (GDA). It will serve 1,430+ registered Agricultural Cooperatives (ACs) and 9 Modern 
Agriculture Communities (MACs) nationwide, initially piloted with 124 PEARL supported farmer 
organizations across four provinces. 
The platform will deliver the following core capabilities: 
• Centralized digital management of farmer organization profiles, membership, committee 
structures and assets. 
• Standardized business planning workflows with multi level approval processes 
• Asset registration and lifecycle tracking 
• Knowledge dissemination from Ministry down to cooperative members 
• Real time dashboards and analytics for cooperative oversight at national, provincial, and 
cooperative levels 
• Role based access control for multiple stakeholder types 
• Offline first mobile functionality for field use in remote areas 
• Bilingual interface (Khmer and English) 
The system is designed with scalability to support future expansion nationwide and integration with 
financial institutions, insurance platforms, and online marketplaces. 
CONFIDENTIAL – FOMMP BRD v1.0     
Page 5 of 25 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
2. Project Overview 
2.1 Project Background 
Cambodia's agricultural cooperatives sector has experienced significant growth, with over 1,430 
registered Agricultural Cooperatives (ACs) and 9 Modern Agriculture Communities (MACs) operating 
nationwide. These cooperatives are critical to supporting smallholder farmers by improving market 
access, pooling resources, and promoting sustainable and climate resilient agricultural practices. 
The PEARL project is a six year initiative funded by the Green Climate Fund (GCF), targeting the Northern 
Tonle Sap Basin. PEARL supports 124 farmer organizations across four provinces and requires a robust 
digital monitoring and management system to track cooperative development, business planning, and 
climate resilient agricultural practices. 
DACP/GDA currently manages cooperatives using Excel spreadsheets and manual data collection 
methods, which severely limits real time oversight, data quality, inter agency coordination, and evidence 
based decision making. The FOMMP will address these deficiencies by providing a modern, integrated 
digital platform. 
2.2 Problem Statement 
The existing cooperative management approach presents the following critical challenges: 
• DACP/GDA cannot maintain up to date cooperative information or generate comprehensive 
reports for policy making 
• Development partners duplicate data collection efforts due to lack of a centralized database 
• Cooperatives face unnecessary administrative burden by providing the same information to 
multiple stakeholders 
• Business planning processes are unstandardized and inconsistent across cooperatives 
• Real time monitoring of development milestones is not possible 
• Limited ability to track cooperative graduation status across Startup, Developing, Expanding and 
Advanced stages 
• Asset management is fragmented and unreliable 
2.3 Solution Overview 
FOMMP is a domain driven digital solution built on Control Union's proven TerRaX platform. It will be 
fully customized to meet PEARL/MAFF operational requirements and deployed as a web application 
with offline mobile capabilities for field use. 
2.4 Project Objectives 
• Digitize and centralize farmer organization profile management 
• Standardize and streamline business planning and approval workflows 
• Enable real time data driven decision making for DACP/GDA, FAO, and development partners 
• Track cooperative development graduation stages 
• Manage cooperative assets and knowledge dissemination 
• Establish the foundational digital solution for a nationwide cooperative management system 
CONFIDENTIAL – FOMMP BRD v1.0     
Page 6 of 25 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
3. Stakeholders 
3.1 Primary Stakeholders 
Stakeholder 
Organization 
Role in System 
Primary Needs 
AC Committee 
Members 
Agricultural 
Cooperatives 
Primary Data Entry 
Users 
Commune 
Agricultural Officers 
Manage profiles, submit business 
plans, register assets 
MAFF / Provincial Dept. 
Field Verifiers 
Validate AC data, verify assets, 
disseminate knowledge 
Business Plan 
Support Team 
PEARL / GDA 
Plan Reviewers 
Review and guide for business 
plan preparation 
Ministry Committee 
MAFF / GDA / DACP 
National Approvers & 
Monitors 
FAO / PEARL Project 
Team 
FAO 
Approve plans, monitor KPIs, 
upload knowledge materials 
System 
Commissioners & 
Overseers 
DACP/GDA 
Administrators 
Monitor project impact, ensure 
system alignment with PEARL 
goals 
MAFF 
System Owners 
Manage users, configure system, 
oversee platform 
IT Vendor 
Control Union 
Inspections Pvt Ltd 
System Developer 
Develop a solution to manage 
ACs 
3.2 Secondary Stakeholders 
• Ministry of Environment (MoE) – Environmental compliance monitoring 
• Provincial Departments of Agriculture, Forestry, and Fisheries (PDAFF) – Provincial level 
oversight 
• Development Partners (ASPIRE AT, GIZ, CAPRED, FAO PCRL) – Potential future platform 
funders and users 
• Farmer Members of ACs – End beneficiaries of cooperative services 
CONFIDENTIAL – FOMMP BRD v1.0     
Page 7 of 25 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
4. Business Objectives and Goals 
ID 
Business Objective 
Success Metric 
BO-01 Centralize cooperative data 
management 
Priority 
100% of PEARL's 124 FOs registered in system 
within 6 months 
High 
BO-02 
Eliminate manual Excel based 
reporting 
High 
Zero Excel based reporting for DACP within 12 
months of full deployment 
BO-03 Standardize business planning 
All submitted business plans use standardized digital 
templates 
High 
BO-04 
Enable real time monitoring 
Dashboard updated with live data within 24 hours of 
field entry 
High 
BO-05 Track cooperative graduation 
stages 
Graduation status tracked for 100% of supported ACs Medium 
BO-06 
Reduce data duplication among 
DPs 
Medium 
Single source of truth accessible to all authorized 
DPs 
BO-07 Support knowledge 
dissemination 
Knowledge materials reach 100% of active ACs via 
system 
Medium 
BO-08 
Enable scalability to national 
level 
High 
Architecture supports 1,430+ ACs without re 
engineering 
CONFIDENTIAL – FOMMP BRD v1.0     
Page 8 of 25 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
5. Scope of the System 
5.1 In Scope 
• Development, customization of all core FOMMP modules 
• Business analysis and requirements finalization 
• UI/UX design (Figma based wireframes and prototypes) 
• Full bilingual support (Khmer and English) across all interfaces 
• Role based access control for all defined user types 
• Offline first mobile application 
• Testing and quality assurance (unit, integration, system, UAT) 
• Training materials, user manuals, and capacity building 
• Post launch maintenance and support (12 months minimum) 
• API based data export/import with Excel and external systems 
• Kobo Toolbox Connector 
• FAO MEAL Dashboard Export Engine  
5.2 Out of Scope 
• Third party system integrations not explicitly specified (e.g., financial institution APIs, insurance 
platforms – future phase) 
• System data entry on behalf of cooperatives 
• Procurement of server hardware (hardware to be provisioned separately) 
• Integration with online marketplaces (future phase) 
• AI/ML predictive analytics (future phase) 
• Agrometeorology data integration (future phase) 
CONFIDENTIAL – FOMMP BRD v1.0     
Page 9 of 25 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 10 of 25 
6. Functional Requirements 
The following sections detail the functional requirements for each system module. Requirements are 
categorized by module and assigned a unique identifier, priority level, and description. 
6.1 Dashboard Module 
6.1.1 AC Dashboard (Cooperative Level) 
The AC Dashboard provides AC Committee Members with real time visibility into the operational health, 
membership status, and progress of their cooperative. 
 
Req. ID Requirement Description Priority User Role 
DASH-AC-01 Display total active members, new members this year, and 
dropout rate 
High AC Committee 
DASH-AC-02 Show member demographics: gender distribution, age groups, 
crop/livestock categories 
High AC Committee 
DASH-AC-03 Display business plan status including submission/approval 
status, current progress %, upcoming milestones, and delay 
alerts 
High AC Committee 
DASH-AC-04 Show asset overview: number of active assets, condition 
breakdown, and assets requiring maintenance 
High AC Committee 
DASH-AC-05 Display training and knowledge adoption metrics: materials 
received, activity completion, participation statistics 
Medium AC Committee 
DASH-AC-06 Show notifications and alerts for missing documents, pending 
updates, and tasks requiring committee action 
High AC Committee 
DASH-AC-07 Dashboard data must refresh automatically and reflect latest 
field entries 
High AC Committee 
DASH-AC-08 Dashboards will include key GESI indicators (e.g., % women 
in leadership, % women members, % youth under 35), with all 
modules supporting gender- and age-disaggregated reporting. 
High AC Committee 
 
6.1.2 National Dashboard (MAFF / FAO / Internal Users) 
The National Dashboard provides ministry level and FAO users with nationwide consolidated analytics 
for oversight, policy planning, and resource allocation. 
 
Req. ID Requirement Description Priority User Role 
DASH-NAT-01 Display total ACs (active/inactive), newly registered ACs, and 
AC distribution by province and district 
High Ministry / FAO 
DASH-NAT-02 Show national membership statistics: total enrolled farmers, 
regional member trends, and demographic distribution 
High Ministry / FAO 
DASH-NAT-03 Display business plan analytics: number submitted, approval 
rate, rejected plans with reasons, provincial performance 
High Ministry / FAO 
DASH-NAT-04 Show asset management metrics: total reported assets, asset 
value distribution, maintenance compliance rate 
Medium Ministry / FAO 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 11 of 25 
Req. ID Requirement Description Priority User Role 
DASH-NAT-05 Display knowledge dissemination metrics: materials uploaded, 
ACs accessing materials, provincial adoption rates 
Medium Ministry / FAO 
DASH-NAT-06 Show governance alerts: overdue business plan reviews, 
missing verifications, irregular asset entries, inactive ACs 
High Ministry / FAO 
DASH-NAT-07 Support filtering by province, district, cooperative type, and 
date range 
High Ministry / FAO 
DASH-NAT-08 Enable export of dashboard data and reports to PDF and Excel 
formats 
High Ministry / FAO 
 
6.2 AC Profile Management Module 
This module manages all core information required to identify, categorize, and evaluate an Agricultural 
Cooperative, including its official profile, committee structure, and registered member details. 
 
Req. ID Requirement Description Priority User Role 
PROF-01 Maintain a versioned history of committee structure changes 
(Chairman, Vice Chairman, Treasurer, Secretary, and other 
roles) 
High AC Committee 
PROF-02 Enable member (farmer) registration with fields including: name, 
gender, age, national ID, contact number, land area, crop types, 
livestock, and membership start date 
High AC Committee 
PROF-03 Support Graduation Tracking: allow categorization of ACs into 
Startup, Developing, Expanding, and Advanced stages with date 
stamped progression records 
High AC Committee / 
Ministry 
PROF-04 Implement a verification workflow: Commune Officer reviews or 
approves AC profile before it becomes active in the system 
High Commune Officer 
PROF-05 Maintain AC status history: Active, Withdrawn, Suspended, and 
other statuses with reason codes and dates 
High Ministry / Admin 
PROF-06 Support bulk import of existing AC data from Excel/CSV format 
for initial data migration 
High Admin 
PROF-07 Enable document attachment for official registration certificates, 
meeting minutes, and supporting documents 
Medium AC Committee 
PROF-08 Display a complete, auditable history of all profile changes with 
timestamps and user attribution 
Medium Ministry / Admin 
 
6.3 Business Plan Management Module 
This module provides a structured digital workflow for creating, submitting, reviewing, approving, and 
monitoring business plans for each AC, supporting both annual and multi year plans through a multi 
layer approval pipeline. 
 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 12 of 25 
Req. 
ID 
Requirement Description Priority User Role 
BP-01 Provide a standardized digital business plan template form with main 
Modules for Cooperative Profile and Business Project modules. 
High AC Committee 
BP-02 Allow document attachments within business plans: financial plans, 
feasibility assessments, production schedules, etc. 
High AC Committee 
BP-03 Implement a multi layer approval workflow: Ex. AC Committee submits 
→ Business Plan Support Team reviews → Ministry Committee gives 
final approval 
High All roles 
BP-04 Send automated notifications to relevant stakeholders at each approval 
stage 
High System 
BP-05 Allow Business Plan Support Team to annotate, comment on, and 
request revisions before ministry submission 
High Support Team 
BP-06 Enable FAO / Ministry Committee to approve or reject plans with 
mandatory reason codes for rejections 
High Ministry 
Committee 
BP-07 Allow ACs to submit monthly/quarterly progress updates against 
approved business plan milestones 
High AC Committee 
BP-08 Enable Commune Officers to verify and validate AC reported progress 
in the field 
High Commune 
Officer 
BP-09 Ministry dashboard displays KPIs and tracks implementation progress 
across all approved business plans 
High Ministry / FAO 
BP-10 Support version management for business plans (draft, submitted, 
approved, revision requested, rejected) 
Medium All roles 
BP-11 Allow search, filter, and comparison of business plans by province, AC 
type, stage, and date 
Medium Ministry / FAO 
BP-12 Enable export of individual or aggregated business plan data to PDF 
and Excel 
High Ministry / FAO 
 
6.4 Asset Management Module 
This module provides a complete digital inventory of all assets owned by, donated to, or used by an 
AC, managing the full asset lifecycle from registration through disposal. 
 
Req. ID Requirement Description Priority User Role 
ASSET-01 Allow AC Committee to register new assets with details: asset 
type, description, serial number, acquisition date, source 
(purchased/donated/grant), value, and location 
High AC Committee 
ASSET-02 Support asset condition updates with defined condition 
categories (Good, Fair, Poor, Out of Service) and maintenance 
history logs 
High AC Committee 
ASSET-03 Allow documentation of asset usage logs for shared/communal 
equipment 
Medium AC Committee 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 13 of 25 
Req. ID Requirement Description Priority User Role 
ASSET-04 Allow Commune Officer or responsible person to verify newly 
registered assets and approve or reject disposal/replacement 
requests 
High Commune Officer 
ASSET-05 Generate asset inventory reports by AC, province, asset type, 
and condition 
High Ministry / FAO 
ASSET-06 Track donor/program attribution for project funded assets (e.g., 
PEARL funded equipment) 
High Ministry / FAO 
ASSET-07 Support asset photo uploads for visual documentation Medium AC Committee 
ASSET-08 Eligibility checks linked to graduation level and business plan 
approval 
High AC Committee 
 
6.5 Knowledge Management Module 
This module serves as a centralized digital library and communication portal for sharing agricultural 
knowledge, guidelines, training materials, and official information from Ministry to cooperatives. 
 
Req. 
ID 
Requirement Description Priority User Role 
KM-01 Allow Ministry users to upload knowledge content in multiple 
formats: PDF, video, images, and Word documents 
High Ministry / Admin 
KM-02 Support categorization of content by type: user manuals, agricultural 
techniques, market price updates, government program 
announcements, pest/disease alerts, training videos, fertilizer/seed 
guidelines 
High Ministry / Admin 
KM-03 Provide a searchable library for Commune Officers and AC 
Committees to access materials relevant to their crops, location, or 
topic along with keyword search across titles and descriptions. 
High Commune Officer 
/ AC Committee 
KM-04 Provide an option to filter by crop type, cooperative graduation stage 
and document type  
High Commune Officer 
/ AC Committee 
KM-05 Track material access metrics: how many ACs/officers have viewed 
or downloaded each material 
Medium Ministry / Admin 
KM-06 Support version management for updated materials (e.g., updated 
pest alert replaces older version) 
Medium Ministry / Admin 
 
6.6 User Management and Role Based Access Control 
The system must implement a secure, hierarchical user management system with clearly defined roles 
and permissions to ensure appropriate data access and operational security. 
 
Req. 
ID 
Requirement Description Priority User 
Role 
UM-01 Support secure user registration, login, and session management with 
password encryption 
High All 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 14 of 25 
Req. 
ID 
Requirement Description Priority User 
Role 
UM-02 Implement role based access control (RBAC) with at minimum the following 
roles: AC Committee Member, Commune Agricultural Officer, Business Plan 
Support Team, Ministry Committee, FAO/PEARL Project Officer, System 
Administrator 
High Admin 
UM-03 Allow System Administrator to create, edit, deactivate, and assign roles to 
user accounts 
High Admin 
UM-04 Restrict data visibility: AC users see only their own cooperative's data; 
Commune Officers see ACs within their commune; Ministry/FAO see all data 
High System 
UM-05 Log all user actions with timestamps for audit trail purposes High System 
UM-06 Allow users to manage their own profile (name, contact, password reset) Medium All 
UM-07 Support account lockout after defined number of failed login attempts High System 
 
6.7 Reporting and Analytics 
Req. ID Requirement Description Priority User Role 
RPT-01 Generate standard reports: AC registration summary, business plan 
status, asset inventory, member demographics, graduation progress 
High Ministry / FAO 
RPT-02 Support ad hoc report generation with user defined filters (province, 
district, AC type, date range, status) 
High Ministry / FAO 
RPT-03 Export all reports to PDF (for print)  High Ministry / FAO 
RPT-04 Quarterly platform usage and system performance reports generated 
automatically for PEARL/DACP review 
Medium System / Admin 
RPT-05 Visualization components: bar charts, pie charts, line graphs, 
geographic heat maps using Apex Charts or equivalent 
High Ministry / FAO 
RPT-06 Reports must render correctly in both English and Khmer High Ministry / FAO 
 
6.8 Offline Functionality and Mobile Support 
Req. ID Requirement Description Priority User Role 
OFF-01 Mobile application must function fully offline, allowing data entry 
without internet connectivity 
High AC Committee / 
Commune Officer 
OFF-02 System must automatically synchronize offline captured data with 
the central server when connectivity is restored 
High System 
OFF-03 Conflict resolution logic must handle cases where the same record 
is modified both offline and online during the disconnected period 
High System 
OFF-04 Offline mobile app must be available for Android devices (minimum 
Android 8.0) and ISO 
High AC Committee / 
Commune Officer 
 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 15 of 25 
 
7. Non Functional Requirements 
Category Req. ID Requirement Target 
Performance NFR-01 Page load time for web application < 5 seconds on standard broadband 
Performance NFR-02 System must support concurrent users Minimum 500 concurrent users 
Availability NFR-03 System uptime >= 99.5% excluding planned 
maintenance 
Scalability NFR-04 Scale from 124 pilot FOs to 1,430+ ACs No re architecture required 
Security NFR-05 Data transmission encryption SSL/TLS on all data in transit 
Security NFR-06 Data at rest encryption AES 256 encryption for stored data 
Security NFR-07 Data privacy compliance GDPR aligned data governance 
Security NFR-08 Penetration testing Prior to each major deployment 
Usability NFR-09 Bilingual interface Full Khmer and English language 
support 
Usability NFR-10 Accessibility Usable on low bandwidth (2G/3G) 
connections 
Maintainability NFR-11 Open source technology stack No vendor lock in; government code 
ownership 
Backup NFR-12 Automated data backup Daily backups; tested monthly 
recovery 
Recovery NFR-13 Disaster recovery Encrypted offsite backup; RTO < 24 
hours 
Compliance NFR-14 Audit logs retained Minimum 5 years 
  
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
8. System Architecture and Technical Specifications 
8.1 Technology Stack 
Layer 
Technology 
Version / Notes 
Frontend 
Angular 
Angular 20 
Frontend Libraries 
Apex Charts, Bootstrap, 
Jasper 
For charts, UI components, and reporting 
UI/UX Design 
Figma 
Wireframes and design assets 
Backend Language 
Java 
Java 18 
Backend Framework 
Spring Boot 
Spring Boot 3.2 
API 
RESTful API 
JSON based REST endpoints 
Database 
MySQL 
MySQL 8 
File Storage 
Blob storage  
For documents, images, videos 
Authentication 
Spring Security 
Spring Security 6 
Mobile 
Android Application 
Offline first mobile app 
Deployment 
Docker, Kubernetes 
Container based deployment 
Infrastructure 
Local Servers 
Hosted on government/local infrastructure 
Monitoring 
Application Logging & 
Infrastructure Monitoring 
Real time uptime and usage logs 
Testing Tools 
JUnit, Jasmine, Karma 
Unit and integration testing 
8.2 Architecture Principles 
• Open Source Stack: Ensures government ownership, future customization, and avoidance of 
vendor lock in 
• Modular Architecture: Each module (Profiles, Business Plans, Assets, Knowledge, Dashboards) 
is independently deployable and maintainable 
• Layered Architecture: Clear separation of presentation, business logic, and data layers 
• Offline First Design: Native mobile applications with asynchronous synchronization to central 
servers 
• Agile / Scrum Development Methodology: Iterative sprints with regular stakeholder review 
cycles 
• CI/CD Pipeline: Continuous Integration and Continuous Delivery for reliable deployment 
8.3 Deployment Environments 
Environment 
Purpose 
Notes 
Development 
Active development and unit testing 
Staging / UAT 
Developer local and shared dev server 
User acceptance testing and stakeholder 
review 
Mirror of production environment 
Production 
Live system for all end users 
High availability, secured server 
CONFIDENTIAL – FOMMP BRD v1.0     
Page 16 of 25 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
9. Integration Requirements 
Integration 
Type 
Description 
Priority 
Excel / CSV Import 
Export 
File based 
Import existing AC data from Excel; 
export reports and data to Excel/CSV 
for offline analysis 
Kobo Assessment Tool 
integration 
API 
High 
Assessment data needs to flow into 
FOMMP and feed the graduation 
scoring module. 
FAO MEAL Dashboard 
Export Engine  
API 
Structured data export aligned with 
High 
High 
FAO’s M&E framework. 
API Layer  
API 
RESTful API for future integration  
High 
CONFIDENTIAL – FOMMP BRD v1.0     
Page 17 of 25 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 18 of 25 
10. User Roles and Permissions Matrix 
Module / Action AC 
Committee 
Commune 
Officer 
Support 
Team 
Ministry 
Committee 
FAO / 
PEARL 
Officer 
System 
Admin 
Create AC Profile No No No Yes Yes Yes 
Edit AC Profile Yes No No No No Yes 
Verify / Approve AC 
Profile 
No Yes No Yes Yes No 
Register Members Yes No No No No No 
View AC Profile (Own) Yes Yes Yes Yes Yes Yes 
View All ACs No Own 
Commune 
Yes Yes Yes Yes 
Submit Business Plan Yes No No No No No 
Review / Annotate Plan No No Yes No No No 
Approve Business Plan No No No Yes Yes No 
Submit Progress Update Yes No No No No No 
Verify Progress No Yes Yes Yes Yes No 
Register Assets Yes No No No No No 
Verify / Approve Assets No Yes No Yes Yes No 
Upload Knowledge 
Materials 
No No No Yes Yes Yes 
Access Knowledge 
Library 
Yes Yes Yes Yes Yes Yes 
View National Dashboard No No No Yes No Yes 
Export Reports Own data Own 
commune 
Yes Yes Yes Yes 
Manage Users No No No No No Yes 
  
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 19 of 25 
11. Data Requirements 
11.1 Key Data Entities 
Data Entity Key Attributes Module 
Agricultural Cooperative 
(AC) 
AC ID, Name, Registration Number, Type, Province, 
District, Commune, Village, GPS, Status, Establishment 
Date 
AC Profile 
Committee Member Role, Name, National ID, Gender, Contact, Term Start/End AC Profile 
Farmer Member Farmer ID, Name, Gender, Age, National ID, Land Area 
(ha), Crops, Livestock, Membership Date 
AC Profile 
Graduation Status Stage (Starter/Developing/Expanding/Advanced), 
Assessment Date, Assessed By, Evidence 
AC Profile 
Certification Type (CamGAP/GI/SRP/Organic), Status, Issue Date, 
Expiry Date, Certifying Body 
AC Profile 
Business Plan Plan ID, AC ID, Year, Objectives, Targets, Financial 
Projections, Status, Approval History 
Business Plan 
BP Progress Update Update ID, Plan ID, Period, Activities Completed, % 
Progress, Issues, Supporting Docs 
Business Plan 
Asset Asset ID, Type, Description, Value, Acquisition Date, 
Source, Condition, Location 
Asset Management 
Knowledge Material Material ID, Title, Type, Category, Upload Date, Uploaded 
By, File URL 
Knowledge Mgmt 
User Account User ID, Name, Role, Organization, Province, Login 
Credentials, Status 
User Management 
 
11.2 Data Migration 
An initial data migration from existing Excel based records to the FOMMP database will be required. 
The following approach is specified: 
• Provide a standardized Excel import template that maps to FOMMP data fields 
• Validate imported data against defined business rules before committing to the database 
• Generate a data migration report showing successfully imported, skipped, and error records 
• Allow incremental imports as additional data becomes available during the pilot phase 
• Maintain audit trail of all data imported during migration 
  
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 20 of 25 
12. Implementation Plan and Phased Approach 
12.1 Project Phases 
Phase Name Duration Key Activities Deliverables 
Phase 1 Planning & 
Requirements 
Finalization 
Month 1 Project kickoff; stakeholder 
mapping; detailed requirement 
workshops; finalize workflows 
and indicators 
BRD, SRS, Work Plan, 
Stakeholder Map 
Phase 2 System Design & 
Prototyping 
Months 2
3 
Architecture design; database 
schema; UI/UX mockups 
(Figma); prototype 
development and review 
Architecture Docs, DB 
Schema, UI/UX Mockups, 
MVP Prototype 
Phase 3 Full Platform 
Development 
Months 3
6 
Module coding; Khmer/English 
localization; API development; 
integration configuration; UAT 
environment setup 
Fully Coded Platform with All 
Modules 
Phase 4 Testing, Pilot & 
Training 
Months 4
8 
Functional testing; security 
testing; pilot deployment with 
20 selected ACs; training 
workshops; iterative feedback 
and fixes 
Test Reports, Pilot Lessons 
Learned, Training Materials, 
User Manuals 
Phase 5 Full Scale Rollout Months 6
12 
Phased deployment across all 
124 PEARL supported FOs; 
concurrent training; technical 
support 
System Live for All 124 FOs 
Phase 6 Handover & 
Ongoing Support 
Month 12 
onwards 
System monitoring; bug fixes; 
feature requests; capacity 
building for DACP/GDA; formal 
handover 
Final Report, Handover 
Documentation, Support SLA 
 
12.2 Pilot Phase Details 
The pilot phase will engage 20 ACs across PEARL's four target provinces (5 ACs per province), 
selected to represent diverse operational scales and capacities. Pilot activities include: 
• Live data entry and testing of all core modules 
• Regular structured feedback sessions (bi weekly) 
• Iterative platform refinement based on user feedback 
• Validation of Khmer language translations and terminology with local users 
• Assessment of offline functionality in areas with limited connectivity 
 
Expansion Plan 
• Following the successful completion of the pilot phase, the platform will be scaled progressively 
to cover all 124 PEARL FOs. The expansion will be carried out in structured phases to ensure 
stability, user readiness, and system performance. 
Phase 1: Pilot Completion and Evaluation (20 ACs) 
Duration: 3 months  
Key Criteria: 
• Successful completion of pilot testing activities 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
• Resolution of critical system issues 
• Positive user feedback and adoption levels 
• Validation of core functionalities including offline capabilities 
Phase 2: Initial Scale-Up (Additional 40–50 FOs) 
Duration: 1 month 
Activities: 
• Onboarding of additional FOs in selected provinces 
• User training and support 
• Continued monitoring and minor system enhancements 
Key Criteria: 
• System stability under increased user load 
• Effective user adoption and data consistency 
• Minimal critical issues reported 
Phase 3: Full Rollout (All Remaining FOs up to 124) 
Duration: 2 months 
Activities: 
• Nationwide deployment across all remaining FOs 
• Ongoing technical support and performance monitoring 
• Final optimization and documentation 
Key Criteria: 
• Stable system performance at full scale 
• High user adoption rates 
• Completion of all required functionalities and reporting needs 
12.3 Training Plan 
User Group 
Training Content 
Format 
Timing 
AC Committee 
Members 
Platform navigation, profile 
management, business plan 
submission, asset registration, 
knowledge library 
In person 
workshop + 
printed Khmer 
manual 
Commune Officers 
Phase 4 and Phase 5 
Profile verification, asset verification, 
progress validation, knowledge 
dissemination workflow 
In person 
workshop 
Phase 4 and Phase 5 
Business Plan 
Support Team 
Business plan review workflow, 
annotation, dashboard usage 
Online/in person 
workshop 
Ministry / FAO 
Users 
Phase 3 
National dashboard, report generation, 
knowledge upload, user management 
Phase 3 
System 
Administrators 
Full system administration, user 
management, backup/recovery, 
configuration 
In person 
workshop 
Technical training 
session 
Phase 2–3 
CONFIDENTIAL – FOMMP BRD v1.0     
Page 21 of 25 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
13. Assumptions and Constraints 
13.1 Assumptions 
• FAO/PEARL will make key stakeholders available for requirement workshops and user 
acceptance testing 
• Server hardware and internet infrastructure for hosting will be provisioned by the client or 
agreed hosting provider 
• Existing AC data in Excel format will be made available to Control Union for data migration 
within Month 1 
• All end users (AC Committee, Commune Officers, Ministry staff) have access to a computer for 
system access 
• Khmer language translations and agricultural terminology will be validated by DACP/GDA during 
pilot phase 
• Internet connectivity at provincial/district government offices is sufficient for web platform use 
• Future platform enhancements (Certification management, financial integrations, marketplace, 
AI features) will be funded separately 
13.2 Constraints 
• Development must use open source technologies to ensure government ownership and no 
vendor lock in 
• Platform must operate on existing local server infrastructure without requiring cloud-hosted 
servers for the production environment (unless agreed) 
• Project timeline is 12 months from contract signing; delays in stakeholder engagement may 
impact schedule 
CONFIDENTIAL – FOMMP BRD v1.0     
Page 22 of 25 
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 23 of 25 
14. Risks and Mitigation Strategies 
Risk ID Risk Description Probability Impact Mitigation Strategy 
RSK 01 Low user adoption by AC 
Committee members due to 
unfamiliarity with digital tools 
High High User centered design, Khmer language 
interface, comprehensive in person 
training, ongoing helpdesk support 
RSK-02 Poor data quality in initial 
migration from existing 
Excel records 
Medium High Data audit prior to migration; validation 
rules during import; joint data cleaning 
workshop with DACP 
RSK-03 Scope creep leading to 
budget overrun or timeline 
delays 
Medium High Strict change control process; any 
additional requirements require formal 
change request and approval 
RSK-04 Resistance from 
government stakeholders to 
adopt new platform 
Medium High Early and continuous stakeholder 
engagement; live demonstrations; iterative 
feedback incorporation 
RSK-05 Technical integration 
challenges with existing 
systems 
Medium Medium Phased integration approach; robust API 
design and testing prior to integration 
RSK-06 Data security breach or 
unauthorized access 
Low High SSL/TLS encryption, RBAC, penetration 
testing, vulnerability assessments, audit 
logging 
RSK-07 Loss of data due to server 
failure or corruption 
Low High Daily automated backups; encrypted 
offsite storage; tested disaster recovery 
procedures 
RSK-08 Key personnel unavailability 
during critical project phases 
Low Medium Maintain team knowledge documentation; 
cross train team members; identify backup 
resources 
  
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
CONFIDENTIAL – FOMMP BRD v1.0     Page 24 of 25 
15. Glossary 
Term / Abbreviation Definition 
AC Agricultural Cooperative – a farmer owned cooperative entity registered with 
MAFF/DACP 
API Application Programming Interface – a mechanism enabling software 
systems to communicate 
BRD Business Requirements Document – this document 
CamGAP Cambodia Good Agricultural Practices – national agricultural certification 
standard 
DACP Department of Agricultural Cooperative Promotion, under GDA/MAFF 
FOMMP Farmer Organizations Management and Monitoring Platform – the software 
system defined in this BRD 
FO Farmer Organization – encompasses MACs, ACs, and Producer Groups 
(PGs) 
GCF Green Climate Fund – the international funder of the PEARL project 
GDA General Directorate of Agriculture, under MAFF 
GI Geographical Indication – a certification marking for products with geographic 
origin 
MAC Modern Agriculture Community – a higher level form of farmer organization in 
Cambodia 
MAFF Ministry of Agriculture, Forestry and Fisheries of Cambodia 
MEAL Monitoring, Evaluation, Accountability, and Learning – FAO's reporting 
framework 
MoE Ministry of Environment of Cambodia 
MIS Management Information System – dashboards and reports module 
PEARL Public Social Private Partnerships for Ecologically Sound Agriculture and 
Resilient Livelihood in Northern Tonle Sap Basin – the GCF funded project 
PG Producer Group – a basic level farmer organization below AC level 
RBAC Role Based Access Control – security model controlling access based on 
user roles 
SRP Sustainable Rice Platform – international certification standard for 
sustainable rice production 
TerRaX Control Union's existing open source agricultural management platform 
serving as the FOMMP foundation 
UAT User Acceptance Testing – final testing phase conducted with end users 
UI/UX User Interface / User Experience – the design and usability of the platform 
  
FOMMP – Business Requirements Document    |    Control Union Inspections (Pvt) Ltd for FAO / PEARL Project 
16. Appendix 
16.1 Source Documents 
• FOMMP Concept Note – Draft for FO Platform (PEARL Project) 
• Technical Proposal: Provision of Services to Develop FOMMP – Control Union Pvt Ltd for FAO 
16.2 Key Contacts 
Name 
Organization 
Role 
Contact 
Thilina Gunathilaka 
Control Union Sri 
Lanka 
Senior Project 
Manager / Enterprise 
Architect 
Dilum Wijenayaka 
Control Union 
Cambodia 
General Manager 
tgunathilaka@controlunion.com 
dwijenayaka@controlunion.com 
Pramuka 
Gunawardhane 
Control Union Sri 
Lanka 
Business Analyst 
pgunawardhane@onepeterson.com 
TBD 
FAO / PEARL 
FAO Project Officer 
TBD 
TBD 
DACP / GDA / MAFF 
Government Focal 
Point 
16.3 Approval Signatures 
Role 
TBD 
Name 
Signature 
BRD Author (Control Union) 
Date 
Thilina Gunathilaka   
FAO / PEARL Reviewer 
DACP/GDA Approver    
PEARL Project Manager 
— End of FOMMP Business Requirements Document v1.0 — 
Control Union Inspections (Pvt) Ltd |  Prepared for FAO / PEARL Project  |  February 2026 
CONFIDENTIAL – FOMMP BRD v1.0     
Page 25 of 25 