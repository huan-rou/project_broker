import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  ApplicantInfo, LoanDetails, ApplicantIncome, SelfEmployedEntity,
  RentalProperty, NegativeGearingLoan, ExpenseCategories,
  CreditCommitment, AdvancedOptions, UnifiedInput
} from '../types'
import {
  Frequency, LoanPurpose, LoanType,
  ResidentialStatus, EntityType, CommitmentType
} from '../types'

function defaultIncomeEntry() {
  return { amount: 0, frequency: Frequency.ANNUALLY }
}

function defaultApplicantIncome(): ApplicantIncome {
  return {
    // Common (always visible)
    base: defaultIncomeEntry(),
    overtime: defaultIncomeEntry(),
    commission_bonus: defaultIncomeEntry(),
    rental: defaultIncomeEntry(),
    self_employed: defaultIncomeEntry(),
    government_family: defaultIncomeEntry(),
    casual_second_job: defaultIncomeEntry(),

    // Expanded ("More Income Types")
    dividend: defaultIncomeEntry(),
    interest: defaultIncomeEntry(),
    trust_deed: defaultIncomeEntry(),
    managed_fund: defaultIncomeEntry(),
    foreign: defaultIncomeEntry(),
    maintenance: defaultIncomeEntry(),
    investment_other: defaultIncomeEntry(),
    other_taxable: defaultIncomeEntry(),

    // Non-monetary
    non_taxable_other: 0,
    medicare_levy_surcharge_applicable: false,
  }
}

function defaultExpenses(): ExpenseCategories {
  return {
    use_hem: true,

    // HEM-basic categories (monthly)
    child_care: 0,
    clothing: 0,
    communications: 0,
    public_school: 0,
    general_education: 0,
    groceries: 0,
    primary_dwelling: 0,
    personal_insurance: 0,
    general_insurance: 0,
    health_medical: 0,
    recreation: 0,
    transport: 0,
    other_basic: 0,
    pet_care: 0,
    strata_body_corp: 0,

    // Non-HEM categories (monthly)
    alimony: 0,
    private_school: 0,
    higher_education: 0,
    second_dwelling: 0,
    investment_property: 0,
    rent_expense: 0,
    board: 0,
    other_non_hem: 0,

    // Flags
    hecs_applicable: false,
    hem_apportioning: 1,
  }
}

function defaultApplicant(index: number): ApplicantInfo {
  return {
    name: `Applicant ${index + 1}`,
    ccas_id: '',
    status: null,
    married_to: '',
    dependents: 0,
    postcode: '',
    location: '',
  }
}

function defaultAdvancedOptions(): AdvancedOptions {
  return {
    essential_services: false,
    simple_refinance: false,
  }
}

export const useInputStore = defineStore('input', () => {
  const applicants = ref<ApplicantInfo[]>([defaultApplicant(0)])
  const loan = ref<LoanDetails>({
    amount: 0,
    term_years: 30,
    io_term_years: 0,
    product_rate: 0,
    security_value: 0,
    purpose: LoanPurpose.OWNER_OCCUPIED,
    residential_status: ResidentialStatus.OWNER_WITH_MORTGAGE,
    loan_type: LoanType.STANDARD,
  })
  const income = ref<ApplicantIncome[]>([defaultApplicantIncome()])
  const selfEmployedEntities = ref<SelfEmployedEntity[]>([])
  const rentalProperties = ref<RentalProperty[]>([])
  const negativeGearingLoans = ref<NegativeGearingLoan[]>([])
  const expenses = ref<ExpenseCategories[]>([defaultExpenses()])
  const commitments = ref<CreditCommitment[]>([])
  const advanced = ref<AdvancedOptions>(defaultAdvancedOptions())
  const selectedCalculators = ref<string[]>(['bocal'])

  function addApplicant() {
    const idx = applicants.value.length
    applicants.value.push(defaultApplicant(idx))
    income.value.push(defaultApplicantIncome())
    expenses.value.push(defaultExpenses())
  }

  function removeApplicant(index: number) {
    if (applicants.value.length <= 1) return
    applicants.value.splice(index, 1)
    income.value.splice(index, 1)
    expenses.value.splice(index, 1)
  }

  function addSelfEmployedEntity() {
    const numApp = applicants.value.length
    selfEmployedEntities.value.push({
      entity_type: EntityType.SOLE_TRADER,
      year1_npbt: 0, year2_npbt: 0,
      year1_non_recurring: 0, year2_non_recurring: 0,
      total_addbacks_yr1: 0,
      total_addbacks_yr2: 0,
      addback_director_salary: [0, 0],
      addback_interest: [0, 0],
      addback_super: [0, 0],
      addback_depreciation: [0, 0],
      addback_other_non_cash: [0, 0],
      addback_other: [0, 0],
      use_detailed_addbacks: false,
      business_debt_limit: 0,
      business_debt_term_years: 0,
      business_debt_rate: 0,
      business_debt_declared_repayment: 0,
      allocation_pct: Array(numApp).fill(0),
    })
  }

  function removeSelfEmployedEntity(index: number) {
    selfEmployedEntities.value.splice(index, 1)
  }

  function addRentalProperty() {
    const numApp = applicants.value.length
    rentalProperties.value.push({
      address: '', postcode: '', state: '',
      high_density: null,
      declared_rent: 0, frequency: Frequency.WEEKLY,
      ownership_pct: Array(numApp).fill(0),
    })
  }

  function removeRentalProperty(index: number) {
    rentalProperties.value.splice(index, 1)
  }

  function addNegativeGearingLoan() {
    const numApp = applicants.value.length
    negativeGearingLoans.value.push({
      outstanding_balance: 0, purpose: '', interest_rate: 0,
      ownership_pct: Array(numApp).fill(0),
    })
  }

  function removeNegativeGearingLoan(index: number) {
    negativeGearingLoans.value.splice(index, 1)
  }

  function addCommitment() {
    commitments.value.push({
      product_type: CommitmentType.CREDIT_CARD,
      limit: 0, remaining_term_years: 0,
      interest_rate: 0, declared_repayment: 0,
      repayment_frequency: Frequency.MONTHLY,
    })
  }

  function removeCommitment(index: number) {
    commitments.value.splice(index, 1)
  }

  function buildPayload(): UnifiedInput {
    return {
      applicants: applicants.value,
      loan: loan.value,
      income: income.value,
      self_employed_entities: selfEmployedEntities.value,
      rental_properties: rentalProperties.value,
      negative_gearing_loans: negativeGearingLoans.value,
      expenses: expenses.value,
      commitments: commitments.value,
      advanced: advanced.value,
      calculator_ids: selectedCalculators.value,
    }
  }

  function loadFromWorkspace(data: UnifiedInput) {
    applicants.value = data.applicants
    loan.value = data.loan
    income.value = data.income
    selfEmployedEntities.value = data.self_employed_entities
    rentalProperties.value = data.rental_properties
    negativeGearingLoans.value = data.negative_gearing_loans
    expenses.value = data.expenses
    commitments.value = data.commitments
    advanced.value = data.advanced ?? defaultAdvancedOptions()
    selectedCalculators.value = data.calculator_ids
  }

  function reset() {
    applicants.value = [defaultApplicant(0)]
    loan.value = {
      amount: 0, term_years: 30, io_term_years: 0,
      product_rate: 0, security_value: 0,
      purpose: LoanPurpose.OWNER_OCCUPIED,
      residential_status: ResidentialStatus.OWNER_WITH_MORTGAGE,
      loan_type: LoanType.STANDARD,
    }
    income.value = [defaultApplicantIncome()]
    selfEmployedEntities.value = []
    rentalProperties.value = []
    negativeGearingLoans.value = []
    expenses.value = [defaultExpenses()]
    commitments.value = []
    advanced.value = defaultAdvancedOptions()
    selectedCalculators.value = ['bocal']
  }

  return {
    applicants, loan, income, selfEmployedEntities, rentalProperties,
    negativeGearingLoans, expenses, commitments, advanced, selectedCalculators,
    addApplicant, removeApplicant,
    addSelfEmployedEntity, removeSelfEmployedEntity,
    addRentalProperty, removeRentalProperty,
    addNegativeGearingLoan, removeNegativeGearingLoan,
    addCommitment, removeCommitment,
    buildPayload, loadFromWorkspace, reset,
  }
})
