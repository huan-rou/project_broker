export enum Frequency {
  WEEKLY = 'Weekly',
  FORTNIGHTLY = 'Fortnightly',
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  HALF_YEARLY = 'Half-Yearly',
  ANNUALLY = 'Annually',
}

export enum MaritalStatus {
  SINGLE = 'Single',
  COUPLE = 'Couple',
  DE_FACTO = 'De Facto',
}

export enum LoanPurpose {
  OWNER_OCCUPIED = 'Owner occupied',
  INVESTMENT = 'Investment',
}

export enum LoanType {
  STANDARD = 'Standard Loan',
  CONSTRUCTION = 'Construction Loan',
  VACANT_LAND = 'Vacant Land',
  ALT_REFINANCE = 'Alternative Refinance',
}

export enum ResidentialStatus {
  OWNER = 'Owner (no mortgage)',
  OWNER_WITH_MORTGAGE = 'Owner with mortgage',
  RENTING = 'Renting',
  BOARDING = 'Boarding',
  LIVING_WITH_PARENTS = 'Living with parents',
}

export enum EntityType {
  SOLE_TRADER = 'Sole Trader',
  PARTNERSHIP = 'Partnership',
  COMPANY = 'Company',
}

export enum CommitmentType {
  EXISTING_MORTGAGE = 'Existing Mortgage',
  PERSONAL_LOAN = 'Personal Loan',
  OVERDRAFT = 'Line of Credit and Overdraft',
  CREDIT_CARD = 'Credit Card',
  TAX_OBLIGATIONS = 'Tax Obligations',
  HOME_EQUITY_LOAN = 'Home Equity Loan',
  COMMERCIAL_LOAN = 'Commercial Loan',
  HECS_HIRE_PURCHASE = 'HECS / Hire Purchase',
  OTHER = 'Other Commitments',
}

export type UserRole = 'broker' | 'admin'
export type CaseStatus = 'active' | 'submitted' | 'archived'
export type DocumentStatus = 'uploaded' | 'ocr_processing' | 'classified' | 'extracted' | 'validated' | 'error'
export type DocumentCategory =
  | 'passport'
  | 'drivers_license'
  | 'bank_statement'
  | 'payslip'
  | 'tax_return'
  | 'employment_letter'
  | 'other'
export type SourceType = 'manual' | 'ocr' | 'interview'
export type ProviderDestination = 'ollama' | 'deepseek' | 'openai' | 'anthropic' | 'mineru' | 'paddle' | 'rustfs'

export interface IncomeEntry {
  amount: number
  frequency: Frequency
}

export interface ApplicantInfo {
  name: string
  ccas_id: string
  status: MaritalStatus | null
  married_to: string
  dependents: number
  postcode: string
  location: string
}

export interface LoanDetails {
  amount: number
  term_years: number
  io_term_years: number
  product_rate: number
  security_value: number
  purpose: LoanPurpose
  residential_status: ResidentialStatus
  loan_type: LoanType
}

export interface ApplicantIncome {
  base: IncomeEntry
  overtime: IncomeEntry
  commission_bonus: IncomeEntry
  rental: IncomeEntry
  self_employed: IncomeEntry
  government_family: IncomeEntry
  casual_second_job: IncomeEntry
  dividend: IncomeEntry
  interest: IncomeEntry
  trust_deed: IncomeEntry
  managed_fund: IncomeEntry
  foreign: IncomeEntry
  maintenance: IncomeEntry
  investment_other: IncomeEntry
  other_taxable: IncomeEntry
  non_taxable_other: number
  medicare_levy_surcharge_applicable: boolean
}

export interface SelfEmployedEntity {
  entity_type: EntityType
  year1_npbt: number
  year2_npbt: number
  year1_non_recurring: number
  year2_non_recurring: number
  total_addbacks_yr1: number
  total_addbacks_yr2: number
  addback_director_salary: [number, number]
  addback_interest: [number, number]
  addback_super: [number, number]
  addback_depreciation: [number, number]
  addback_other_non_cash: [number, number]
  addback_other: [number, number]
  use_detailed_addbacks: boolean
  business_debt_limit: number
  business_debt_term_years: number
  business_debt_rate: number
  business_debt_declared_repayment: number
  allocation_pct: number[]
}

export interface RentalProperty {
  address: string
  postcode: string
  state: string
  high_density: boolean | null
  declared_rent: number
  frequency: Frequency
  ownership_pct: number[]
}

export interface NegativeGearingLoan {
  outstanding_balance: number
  purpose: string
  interest_rate: number
  ownership_pct: number[]
}

export interface ExpenseCategories {
  use_hem: boolean
  child_care: number
  clothing: number
  communications: number
  public_school: number
  general_education: number
  groceries: number
  primary_dwelling: number
  personal_insurance: number
  general_insurance: number
  health_medical: number
  recreation: number
  transport: number
  other_basic: number
  pet_care: number
  strata_body_corp: number
  alimony: number
  private_school: number
  higher_education: number
  second_dwelling: number
  investment_property: number
  rent_expense: number
  board: number
  other_non_hem: number
  hecs_applicable: boolean
  hem_apportioning: number
}

export interface CreditCommitment {
  product_type: CommitmentType
  limit: number
  remaining_term_years: number
  interest_rate: number
  declared_repayment: number
  repayment_frequency: Frequency
}

export interface AdvancedOptions {
  essential_services: boolean
  simple_refinance: boolean
}

export interface UnifiedInput {
  applicants: ApplicantInfo[]
  loan: LoanDetails
  income: ApplicantIncome[]
  self_employed_entities: SelfEmployedEntity[]
  rental_properties: RentalProperty[]
  negative_gearing_loans: NegativeGearingLoan[]
  expenses: ExpenseCategories[]
  commitments: CreditCommitment[]
  advanced: AdvancedOptions
  calculator_ids: string[]
}

export interface DerivedFieldsPerCalculator {
  calculator_id: string
  calculator_name: string
  location_label: string
  assessment_rate: number
  income_haircuts: Record<string, { original: number; rate: number; after: number }>
  hem_monthly: number
  tax_per_applicant: { taxable: number; tax: number; medicare: number; mls: number; net: number }[]
  entity_code?: string
}

export interface PreviewResponse {
  derived: DerivedFieldsPerCalculator[]
}

export interface CalculationResult {
  calculator_id: string
  calculator_name: string
  calculator_version: string
  nis: number
  nis_without_proposed: number
  pass_fail: string
  max_loan_amount: number
  dti: number
  lti: number
  lvr: number
  total_monthly_net_income: number
  total_monthly_expenses: number
  total_monthly_commitments: number
  income_breakdown: Record<string, unknown>
  tax_breakdown: Record<string, unknown>
  expense_breakdown: Record<string, unknown>
  commitment_breakdown: Record<string, unknown>
  warnings: string[]
  errors: string[]
}

export interface MultiCalculationResponse {
  results: CalculationResult[]
}

export interface CalculatorInfo {
  id: string
  name: string
  version: string
  supported_calculations: string[]
  description?: string
}

export interface WorkspaceListItem {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: number
  name: string
  data: UnifiedInput
  created_at: string
  updated_at: string
}

export interface DemoUser {
  id: number
  username: string
  password: string
  role: UserRole
  displayName: string
  status: 'active' | 'invited' | 'disabled'
  teamName: string
  createdAt: string
  lastLoginAt: string
}

export interface DemoSession {
  token: string
  userId: number
  username: string
  role: UserRole
  displayName: string
  lastLoginAt: string
}

export interface CasePerson {
  id: number
  caseId: number
  role: 'applicant_1' | 'applicant_2' | 'guarantor'
  displayName: string
  sortOrder: number
}

export interface CaseMetricSummary {
  maxBorrowing: number
  documentCompletion: number
  factFindCompletion: number
  flaggedItems: number
}

export interface DemoCase {
  id: number
  name: string
  status: CaseStatus
  loanPurpose: 'Purchase' | 'Refinance' | 'Investment'
  createdBy: string
  teamName: string
  notes: string
  stageLabel: string
  targetLender: string
  updatedAt: string
  createdAt: string
  people: CasePerson[]
  metrics: CaseMetricSummary
  tags: string[]
}

export interface DocumentTimelineEvent {
  id: string
  status: DocumentStatus
  label: string
  message: string
  at: string
}

export interface DocumentExtractionItem {
  label: string
  value: string
  confidence: number
}

export interface DemoDocument {
  id: number
  caseId: number
  personId?: number
  originalFilename: string
  autoRenamedFilename: string
  mimeType: string
  status: DocumentStatus
  documentCategory: DocumentCategory
  classificationConfidence: number
  ocrProvider: string
  humanReviewRequired: boolean
  humanReviewCompleted: boolean
  wasMasked: boolean
  flagged: boolean
  destination?: ProviderDestination
  createdAt: string
  updatedAt: string
  extractedHighlights: DocumentExtractionItem[]
  validationMessages: string[]
  timeline: DocumentTimelineEvent[]
}

export interface OrganizedDocumentGroup {
  lender: string
  folders: Array<{
    path: string
    files: string[]
  }>
  generatedAt: string
}

export interface FactFindFieldSource {
  sourceType: SourceType
  sourceRef: string
  confidence: number
}

export interface FactFindField {
  id: string
  label: string
  value: string
  placeholder?: string
  source: FactFindFieldSource
}

export interface FactFindSectionState {
  id: string
  title: string
  subtitle: string
  completion: number
  fields: FactFindField[]
}

export interface FactFindSnapshot {
  caseId: number
  version: number
  updatedAt: string
  sections: FactFindSectionState[]
}

export interface PrefillPreviewChange {
  id: string
  sectionId: string
  fieldId: string
  label: string
  currentValue: string
  proposedValue: string
  source: FactFindFieldSource
  selected: boolean
}

export interface CalculatorScenarioResult {
  caseId: number
  lastRunAt: string
  results: CalculationResult[]
}

export interface AdminAuditEvent {
  id: number
  createdAt: string
  actor: string
  action: string
  resourceType: string
  resourceId: string
  ipAddress: string
  severity: 'info' | 'warning' | 'critical'
  details: string
}

export interface LeakageAlert {
  id: number
  createdAt: string
  documentName: string
  destination: ProviderDestination
  wasMasked: boolean
  flagged: boolean
  actor: string
  caseName: string
}

export interface ProviderOption {
  key: string
  label: string
  enabled: boolean
}

export interface ProviderConfigState {
  maskingEnabled: boolean
  maskingStrategy: 'auto' | 'aggressive' | 'minimal'
  llmProvider: string
  ocrMode: 'fallback' | 'parallel'
  jwtExpiryMinutes: number
  llmProviders: ProviderOption[]
  ocrProviders: ProviderOption[]
}
