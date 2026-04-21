import {
  auditEvents as initialAuditEvents,
  calculators,
  calculatorInputsByCase,
  caseResults as initialCaseResults,
  demoCases as initialCases,
  demoUsers as initialUsers,
  documentsByCase as initialDocumentsByCase,
  factFindByCase as initialFactFindByCase,
  leakageAlerts as initialLeakageAlerts,
  organizedByCase,
  providerConfig as initialProviderConfig,
} from '../mock/demoData'
import type {
  AdminAuditEvent,
  CalculatorInfo,
  CalculatorScenarioResult,
  CalculationResult,
  DemoCase,
  DemoDocument,
  DemoSession,
  DemoUser,
  FactFindSnapshot,
  OrganizedDocumentGroup,
  PrefillPreviewChange,
  ProviderConfigState,
  UnifiedInput,
} from '../types'

const documentsWorkflow: DemoDocument['status'][] = ['uploaded', 'ocr_processing', 'classified', 'extracted', 'validated']

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(clone(value)), ms))
}

function makeToken(user: DemoUser) {
  return `demo-${user.role}-${user.id}-${Date.now()}`
}

function sumIncome(input: UnifiedInput) {
  return input.income.reduce((total, item) => {
    return total + item.base.amount + item.overtime.amount * 0.6 + item.commission_bonus.amount * 0.8 + item.self_employed.amount * 0.75 + item.rental.amount * 0.8 + item.government_family.amount
  }, 0)
}

function sumExpenses(input: UnifiedInput) {
  return input.expenses.reduce((total, item) => {
    return total + item.child_care + item.clothing + item.communications + item.general_education + item.groceries + item.primary_dwelling + item.personal_insurance + item.general_insurance + item.health_medical + item.recreation + item.transport + item.other_basic + item.private_school + item.investment_property + item.other_non_hem
  }, 0)
}

function sumCommitments(input: UnifiedInput) {
  return input.commitments.reduce((total, item) => total + item.declared_repayment, 0)
}

const db = {
  users: clone(initialUsers),
  cases: clone(initialCases),
  documentsByCase: clone(initialDocumentsByCase),
  factFindByCase: clone(initialFactFindByCase),
  calculatorInputsByCase: clone(calculatorInputsByCase),
  caseResults: clone(initialCaseResults),
  auditEvents: clone(initialAuditEvents),
  leakageAlerts: clone(initialLeakageAlerts),
  providerConfig: clone(initialProviderConfig),
}

function getCaseOrThrow(caseId: number) {
  const found = db.cases.find((item) => item.id === caseId)
  if (!found) throw new Error('Case not found')
  return found
}

function getDocumentsOrThrow(caseId: number) {
  if (!db.documentsByCase[caseId]) db.documentsByCase[caseId] = []
  return db.documentsByCase[caseId]
}

function getFactFindOrThrow(caseId: number) {
  const found = db.factFindByCase[caseId]
  if (!found) throw new Error('Fact Find not found')
  return found
}

function getCalculatorInputOrThrow(caseId: number) {
  const found = db.calculatorInputsByCase[caseId]
  if (!found) throw new Error('Calculator scenario not found')
  return found
}

function pushAudit(action: string, resourceType: string, resourceId: string, actor: string, details: string, severity: AdminAuditEvent['severity'] = 'info') {
  db.auditEvents.unshift({
    id: Date.now(),
    createdAt: new Date().toISOString(),
    actor,
    action,
    resourceType,
    resourceId,
    ipAddress: actor === 'System' ? '127.0.0.1' : '203.12.91.14',
    severity,
    details,
  })
}

function buildCalculationResults(caseId: number, input: UnifiedInput): CalculatorScenarioResult {
  const totalAnnualIncome = sumIncome(input)
  const totalMonthlyNetIncome = totalAnnualIncome / 12 * 0.68
  const totalMonthlyExpenses = sumExpenses(input)
  const totalMonthlyCommitments = sumCommitments(input) + input.loan.amount * 0.0058
  const baseCapacity = totalAnnualIncome * 5.9 - totalMonthlyExpenses * 16 - totalMonthlyCommitments * 18
  const configs = [
    { id: 'bocal', name: 'BOCAL', version: '2.1.0', multiplier: 1.02, rateBuffer: 1.5, colorBias: 0.98 },
    { id: 'brighten', name: 'Brighten', version: '1.9.3', multiplier: 1.08, rateBuffer: 1.2, colorBias: 1.05 },
    { id: 'resimac', name: 'Resimac', version: '1.4.2', multiplier: 0.96, rateBuffer: 1.1, colorBias: 0.94 },
  ].filter((item) => input.calculator_ids.includes(item.id))

  const results: CalculationResult[] = configs.map((config) => {
    const maxLoanAmount = Math.max(350000, Math.round(baseCapacity * config.multiplier / 1000) * 1000)
    const nis = totalMonthlyNetIncome - totalMonthlyExpenses - totalMonthlyCommitments * config.colorBias
    const lvr = input.loan.security_value > 0 ? input.loan.amount / input.loan.security_value : 0
    const dti = totalAnnualIncome > 0 ? input.loan.amount / totalAnnualIncome : 0
    const lti = totalAnnualIncome > 0 ? maxLoanAmount / totalAnnualIncome : 0
    return {
      calculator_id: config.id,
      calculator_name: config.name,
      calculator_version: config.version,
      nis: Math.round(nis),
      nis_without_proposed: Math.round(nis + input.loan.amount * 0.0016),
      pass_fail: maxLoanAmount >= input.loan.amount ? 'Pass' : 'Refer',
      max_loan_amount: maxLoanAmount,
      dti: Number(dti.toFixed(2)),
      lti: Number(lti.toFixed(2)),
      lvr: Number(lvr.toFixed(3)),
      total_monthly_net_income: Math.round(totalMonthlyNetIncome),
      total_monthly_expenses: Math.round(totalMonthlyExpenses),
      total_monthly_commitments: Math.round(totalMonthlyCommitments),
      income_breakdown: {
        total_annual_gross: Math.round(totalAnnualIncome),
        total_annual_net: Math.round(totalAnnualIncome * 0.81),
        total_monthly_net: Math.round(totalMonthlyNetIncome),
      },
      tax_breakdown: {
        estimated_rate: 0.19,
        buffer: config.rateBuffer,
      },
      expense_breakdown: {
        total_monthly: Math.round(totalMonthlyExpenses),
        source: input.expenses.some((item) => !item.use_hem) ? 'Declared' : 'HEM',
      },
      commitment_breakdown: {
        new_loan_repayment: Math.round(input.loan.amount * 0.0058),
        total_monthly: Math.round(totalMonthlyCommitments),
      },
      warnings: nis < 1500 ? ['Net income surplus is narrow. Consider reducing unsecured limits.'] : ['Strong servicing buffer under current assumptions.'],
      errors: [],
    }
  }).sort((a, b) => b.max_loan_amount - a.max_loan_amount)

  const scenario = {
    caseId,
    lastRunAt: new Date().toISOString(),
    results,
  }
  db.caseResults[caseId] = scenario
  return scenario
}

export async function login(username: string, password: string): Promise<DemoSession> {
  const user = db.users.find((item) => item.username === username && item.password === password)
  if (!user) throw new Error('Invalid demo credentials')
  user.lastLoginAt = new Date().toISOString()
  pushAudit('login', 'user', `user:${user.id}`, user.displayName, `Demo ${user.role} session started.`)
  return delay({
    token: makeToken(user),
    userId: user.id,
    username: user.username,
    role: user.role,
    displayName: user.displayName,
    lastLoginAt: user.lastLoginAt,
  }, 320)
}

export async function listCases(): Promise<DemoCase[]> {
  return delay(db.cases)
}

export async function createCase(name: string): Promise<DemoCase> {
  const id = Date.now()
  const newCase: DemoCase = {
    id,
    name,
    status: 'active',
    loanPurpose: 'Purchase',
    createdBy: 'Alex Chen',
    teamName: 'Sydney Central',
    notes: 'New demo case created from dashboard quick action.',
    stageLabel: 'Intake Started',
    targetLender: 'CBA Standard',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    people: [{ id: id + 1, caseId: id, role: 'applicant_1', displayName: 'New Applicant', sortOrder: 1 }],
    metrics: {
      maxBorrowing: 0,
      documentCompletion: 0,
      factFindCompletion: 0,
      flaggedItems: 0,
    },
    tags: ['New'],
  }
  db.cases.unshift(newCase)
  db.documentsByCase[id] = []
  db.factFindByCase[id] = {
    caseId: id,
    version: 1,
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'borrowers',
        title: 'Borrowers',
        subtitle: 'Start by confirming the applicant profile',
        completion: 0,
        fields: [
          { id: 'primary-name', label: 'Primary applicant', value: '', source: { sourceType: 'manual', sourceRef: 'New case', confidence: 1 } },
        ],
      },
    ],
  }
  db.calculatorInputsByCase[id] = clone(db.calculatorInputsByCase[101])
  db.calculatorInputsByCase[id].applicants[0].name = 'New Applicant'
  pushAudit('case_create', 'case', `case:${id}`, 'Alex Chen', `Created demo case "${name}".`)
  return delay(newCase, 260)
}

export async function getCaseDetails(caseId: number) {
  const found = getCaseOrThrow(caseId)
  return delay(found)
}

export async function listCalculators(): Promise<CalculatorInfo[]> {
  return delay(calculators, 120)
}

export async function getCaseDocuments(caseId: number): Promise<DemoDocument[]> {
  return delay(getDocumentsOrThrow(caseId))
}

export async function uploadCaseDocuments(caseId: number, filenames: string[]): Promise<DemoDocument[]> {
  const documents = getDocumentsOrThrow(caseId)
  const newDocs = filenames.map((filename, index) => {
    const createdAt = new Date(Date.now() + index * 1000).toISOString()
    const doc: DemoDocument = {
      id: Date.now() + index,
      caseId,
      originalFilename: filename,
      autoRenamedFilename: filename.toLowerCase().replace(/\s+/g, '_'),
      mimeType: 'application/pdf',
      status: 'uploaded',
      documentCategory: 'other',
      classificationConfidence: 0.5,
      ocrProvider: 'pending',
      humanReviewRequired: false,
      humanReviewCompleted: false,
      wasMasked: true,
      flagged: false,
      destination: 'rustfs',
      createdAt,
      updatedAt: createdAt,
      extractedHighlights: [],
      validationMessages: ['Awaiting OCR workflow.'],
      timeline: [
        {
          id: `upload-${Date.now()}-${index}`,
          status: 'uploaded',
          label: 'Uploaded',
          message: 'File uploaded into demo intake queue.',
          at: createdAt,
        },
      ],
    }
    return doc
  })
  db.documentsByCase[caseId] = [...newDocs, ...documents]
  pushAudit('document_upload', 'case', `case:${caseId}`, 'Alex Chen', `Uploaded ${newDocs.length} demo document(s).`)
  return delay(newDocs, 280)
}

export async function advanceDocumentWorkflow(caseId: number, documentId: number): Promise<DemoDocument> {
  const documents = getDocumentsOrThrow(caseId)
  const doc = documents.find((item) => item.id === documentId)
  if (!doc) throw new Error('Document not found')

  const currentIndex = documentsWorkflow.indexOf(doc.status)
  const nextStatus = documentsWorkflow[Math.min(currentIndex + 1, documentsWorkflow.length - 1)]
  if (currentIndex === -1 || currentIndex === documentsWorkflow.length - 1) {
    return delay(doc)
  }

  doc.status = nextStatus
  doc.updatedAt = new Date().toISOString()
  if (nextStatus === 'ocr_processing') {
    doc.ocrProvider = 'parallel judge'
  }
  if (nextStatus === 'classified') {
    doc.documentCategory = doc.originalFilename.toLowerCase().includes('payslip')
      ? 'payslip'
      : doc.originalFilename.toLowerCase().includes('bank')
        ? 'bank_statement'
        : doc.originalFilename.toLowerCase().includes('passport')
          ? 'passport'
          : 'other'
    doc.classificationConfidence = 0.92
  }
  if (nextStatus === 'extracted') {
    doc.extractedHighlights = [
      { label: 'Auto summary', value: 'Demo extraction complete', confidence: 0.84 },
      { label: 'Review cue', value: 'Ready for Fact Find preview', confidence: 0.8 },
    ]
  }
  if (nextStatus === 'validated') {
    doc.validationMessages = ['Validation checks passed in demo flow.']
  }
  doc.timeline.push({
    id: `timeline-${documentId}-${doc.timeline.length + 1}`,
    status: nextStatus,
    label: nextStatus.replace('_', ' '),
    message: `Demo workflow advanced to ${nextStatus.replace('_', ' ')}.`,
    at: doc.updatedAt,
  })

  return delay(doc, 180)
}

export async function organizeCaseDocuments(caseId: number): Promise<OrganizedDocumentGroup> {
  const result = organizedByCase[caseId] || {
    lender: 'CBA Standard',
    generatedAt: new Date().toISOString(),
    folders: [],
  }
  pushAudit('document_organize', 'case', `case:${caseId}`, 'Alex Chen', `Generated folder preview for ${result.lender}.`)
  return delay(result, 320)
}

export async function getFactFind(caseId: number): Promise<FactFindSnapshot> {
  return delay(getFactFindOrThrow(caseId), 180)
}

export async function updateFactFindField(caseId: number, sectionId: string, fieldId: string, value: string): Promise<FactFindSnapshot> {
  const snapshot = getFactFindOrThrow(caseId)
  const section = snapshot.sections.find((item) => item.id === sectionId)
  const field = section?.fields.find((item) => item.id === fieldId)
  if (!section || !field) throw new Error('Fact Find field not found')
  field.value = value
  field.source = { sourceType: 'manual', sourceRef: 'Broker edit', confidence: 1 }
  snapshot.updatedAt = new Date().toISOString()
  snapshot.version += 1
  pushAudit('fact_find_update', 'case', `case:${caseId}`, 'Alex Chen', `Updated ${field.label}.`)
  return delay(snapshot, 160)
}

export async function previewFactFindPrefill(caseId: number): Promise<PrefillPreviewChange[]> {
  const snapshot = getFactFindOrThrow(caseId)
  const incomeSection = snapshot.sections.find((item) => item.id === 'income')
  const borrowerSection = snapshot.sections.find((item) => item.id === 'borrowers')
  const preview: PrefillPreviewChange[] = []

  if (incomeSection?.fields[0]) {
    preview.push({
      id: `prefill-${caseId}-income`,
      sectionId: incomeSection.id,
      fieldId: incomeSection.fields[0].id,
      label: incomeSection.fields[0].label,
      currentValue: incomeSection.fields[0].value,
      proposedValue: String(Number(incomeSection.fields[0].value || '0') + 6000),
      source: { sourceType: 'ocr', sourceRef: 'Latest payslip import', confidence: 0.91 },
      selected: true,
    })
  }

  if (borrowerSection?.fields[0]) {
    preview.push({
      id: `prefill-${caseId}-borrower`,
      sectionId: borrowerSection.id,
      fieldId: borrowerSection.fields[0].id,
      label: borrowerSection.fields[0].label,
      currentValue: borrowerSection.fields[0].value,
      proposedValue: borrowerSection.fields[0].value,
      source: { sourceType: 'interview', sourceRef: 'Structured interview note', confidence: 0.84 },
      selected: true,
    })
  }

  return delay(preview, 280)
}

export async function applyFactFindPrefill(caseId: number, changes: PrefillPreviewChange[]): Promise<FactFindSnapshot> {
  const snapshot = getFactFindOrThrow(caseId)
  changes.filter((item) => item.selected).forEach((change) => {
    const section = snapshot.sections.find((sectionItem) => sectionItem.id === change.sectionId)
    const field = section?.fields.find((fieldItem) => fieldItem.id === change.fieldId)
    if (field) {
      field.value = change.proposedValue
      field.source = change.source
    }
  })
  snapshot.updatedAt = new Date().toISOString()
  snapshot.version += 1
  pushAudit('prefill_apply', 'fact_find', `case:${caseId}`, 'Alex Chen', `Applied ${changes.filter((item) => item.selected).length} preview changes.`)
  return delay(snapshot, 240)
}

export async function importInterviewSummary(caseId: number): Promise<FactFindSnapshot> {
  const snapshot = getFactFindOrThrow(caseId)
  const section = snapshot.sections.find((item) => item.id === 'expenses')
  if (section) {
    section.fields.push({
      id: `interview-${Date.now()}`,
      label: 'Broker note summary',
      value: 'Client plans to reduce discretionary spend after settlement.',
      source: { sourceType: 'interview', sourceRef: 'Interview import template', confidence: 0.88 },
    })
    section.completion = Math.min(100, section.completion + 10)
  }
  snapshot.updatedAt = new Date().toISOString()
  snapshot.version += 1
  pushAudit('interview_import', 'fact_find', `case:${caseId}`, 'Alex Chen', 'Imported interview summary into Fact Find.')
  return delay(snapshot, 300)
}

export async function getCalculatorInput(caseId: number): Promise<UnifiedInput> {
  return delay(getCalculatorInputOrThrow(caseId))
}

export async function saveCalculatorInput(caseId: number, input: UnifiedInput): Promise<UnifiedInput> {
  db.calculatorInputsByCase[caseId] = clone(input)
  getCaseOrThrow(caseId).updatedAt = new Date().toISOString()
  return delay(input, 120)
}

export async function autoPopulateCalculator(caseId: number): Promise<UnifiedInput> {
  const snapshot = getFactFindOrThrow(caseId)
  const input = getCalculatorInputOrThrow(caseId)
  const borrower = snapshot.sections.find((item) => item.id === 'borrowers')
  const income = snapshot.sections.find((item) => item.id === 'income')
  const expenses = snapshot.sections.find((item) => item.id === 'expenses')

  if (borrower?.fields[0]) input.applicants[0].name = borrower.fields[0].value || input.applicants[0].name
  if (income?.fields[0]) input.income[0].base.amount = Number(income.fields[0].value || input.income[0].base.amount)
  if (expenses?.fields[0]) input.expenses[0].primary_dwelling = Number(expenses.fields[0].value || input.expenses[0].primary_dwelling)

  db.calculatorInputsByCase[caseId] = clone(input)
  pushAudit('calculator_autopopulate', 'case', `case:${caseId}`, 'Alex Chen', 'Synced calculator payload from Fact Find.')
  return delay(input, 260)
}

export async function calculateCase(caseId: number, input: UnifiedInput): Promise<CalculatorScenarioResult> {
  db.calculatorInputsByCase[caseId] = clone(input)
  const result = buildCalculationResults(caseId, input)
  getCaseOrThrow(caseId).metrics.maxBorrowing = result.results[0]?.max_loan_amount || 0
  getCaseOrThrow(caseId).updatedAt = result.lastRunAt
  pushAudit('calculate', 'case', `case:${caseId}`, 'Alex Chen', `Ran ${result.results.length} calculator scenario(s).`)
  return delay(result, 360)
}

export async function getCaseResults(caseId: number): Promise<CalculatorScenarioResult> {
  const input = getCalculatorInputOrThrow(caseId)
  const existing = db.caseResults[caseId]
  if (!existing.results.length) {
    return calculateCase(caseId, input)
  }
  return delay(existing, 180)
}

export async function listUsers(): Promise<DemoUser[]> {
  return delay(db.users)
}

export async function toggleUserStatus(userId: number): Promise<DemoUser> {
  const user = db.users.find((item) => item.id === userId)
  if (!user) throw new Error('User not found')
  user.status = user.status === 'disabled' ? 'active' : 'disabled'
  pushAudit('user_update', 'user', `user:${user.id}`, 'Morgan Li', `User status changed to ${user.status}.`, 'warning')
  return delay(user, 200)
}

export async function listAuditEvents(): Promise<AdminAuditEvent[]> {
  return delay(db.auditEvents)
}

export async function listLeakageAlerts() {
  return delay(db.leakageAlerts)
}

export async function getProviderConfig(): Promise<ProviderConfigState> {
  return delay(db.providerConfig)
}

export async function updateProviderConfig(next: ProviderConfigState): Promise<ProviderConfigState> {
  db.providerConfig = clone(next)
  pushAudit('config_update', 'provider_config', 'cfg:1', 'Morgan Li', 'Updated demo configuration toggles.', 'warning')
  return delay(db.providerConfig, 240)
}
