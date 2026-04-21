<script setup lang="ts">
import { computed, ref } from 'vue'
import ApplicantsTab from '../input/ApplicantsTab.vue'
import LoanTab from '../input/LoanTab.vue'
import IncomeTab from '../input/IncomeTab.vue'
import SelfEmployedTab from '../input/SelfEmployedTab.vue'
import RentalTab from '../input/RentalTab.vue'
import NegGearingTab from '../input/NegGearingTab.vue'
import ExpensesTab from '../input/ExpensesTab.vue'
import CommitmentsTab from '../input/CommitmentsTab.vue'
import AdvancedTab from '../input/AdvancedTab.vue'
import { autoPopulateCalculator, saveCalculatorInput } from '../../services/demoApi'
import { useInputStore } from '../../stores/input'
import { useResultsStore } from '../../stores/results'

const props = defineProps<{
  caseId: number
}>()

const inputStore = useInputStore()
const resultsStore = useResultsStore()
const activeTab = ref(0)
const calcMode = ref<'simple' | 'full'>('full')
const saving = ref(false)
const syncing = ref(false)

const tabs = [
  { label: 'Applicants', icon: 'pi pi-users' },
  { label: 'Loan', icon: 'pi pi-building-columns' },
  { label: 'Income', icon: 'pi pi-wallet' },
  { label: 'Self-Employed', icon: 'pi pi-briefcase' },
  { label: 'Rental', icon: 'pi pi-home' },
  { label: 'Neg. Gearing', icon: 'pi pi-chart-line' },
  { label: 'Expenses', icon: 'pi pi-shopping-bag' },
  { label: 'Commitments', icon: 'pi pi-credit-card' },
  { label: 'Advanced', icon: 'pi pi-cog' },
]

const summary = computed(() => ({
  applicants: inputStore.applicants.length,
  calculators: inputStore.selectedCalculators.length,
  loanAmount: inputStore.loan.amount,
}))

async function syncFromFactFind() {
  syncing.value = true
  try {
    const payload = await autoPopulateCalculator(props.caseId)
    inputStore.loadFromWorkspace(payload)
  } finally {
    syncing.value = false
  }
}

async function saveDraft() {
  saving.value = true
  try {
    await saveCalculatorInput(props.caseId, inputStore.buildPayload())
  } finally {
    saving.value = false
  }
}

async function runScenario() {
  await resultsStore.run(props.caseId, inputStore.buildPayload())
}
</script>

<template>
  <div class="calc-grid">
    <section class="calc-hero page-card">
      <div>
        <p class="eyebrow">Calculator Workspace</p>
        <h3 class="section-title">Keep Sherlock's familiar tabs, but drive them from the case narrative.</h3>
        <p class="section-copy">
          Switch between simple and full storytelling modes, sync values from Fact Find,
          then run a lender spread that feels responsive in demos.
        </p>
      </div>

      <div class="calc-actions">
        <div class="mode-switch">
          <button class="btn-secondary" :class="{ active: calcMode === 'simple' }" @click="calcMode = 'simple'">Simple</button>
          <button class="btn-secondary" :class="{ active: calcMode === 'full' }" @click="calcMode = 'full'">Full</button>
        </div>
        <div class="summary-grid">
          <div>
            <span class="field-label">Applicants</span>
            <strong>{{ summary.applicants }}</strong>
          </div>
          <div>
            <span class="field-label">Selected Lenders</span>
            <strong>{{ summary.calculators }}</strong>
          </div>
          <div>
            <span class="field-label">Loan Amount</span>
            <strong>${{ summary.loanAmount.toLocaleString() }}</strong>
          </div>
        </div>
        <div class="button-row">
          <button class="btn-secondary" :disabled="syncing" @click="syncFromFactFind">
            {{ syncing ? 'Syncing...' : 'Auto-populate From Fact Find' }}
          </button>
          <button class="btn-ghost" :disabled="saving" @click="saveDraft">
            {{ saving ? 'Saving...' : 'Save Draft' }}
          </button>
          <button class="btn-primary" :disabled="resultsStore.loading" @click="runScenario">
            {{ resultsStore.loading ? 'Running...' : 'Run Lender Comparison' }}
          </button>
        </div>
      </div>
    </section>

    <section class="selector-card page-card">
      <div>
        <span class="field-label">Included calculators</span>
        <div class="calculator-pills">
          <label v-for="calculator in resultsStore.calculators" :key="calculator.id" class="selector-pill">
            <input v-model="inputStore.selectedCalculators" :value="calculator.id" type="checkbox" />
            <span>{{ calculator.name }}</span>
          </label>
        </div>
      </div>
    </section>

    <section class="tab-shell page-card">
      <div class="tab-bar">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.label"
          class="tab-btn"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <div class="tab-panel">
        <ApplicantsTab v-if="activeTab === 0" />
        <LoanTab v-else-if="activeTab === 1" />
        <IncomeTab v-else-if="activeTab === 2" />
        <SelfEmployedTab v-else-if="activeTab === 3" />
        <RentalTab v-else-if="activeTab === 4" />
        <NegGearingTab v-else-if="activeTab === 5" />
        <ExpensesTab v-else-if="activeTab === 6" />
        <CommitmentsTab v-else-if="activeTab === 7" />
        <AdvancedTab v-else />
      </div>
    </section>
  </div>
</template>

<style scoped>
.calc-grid {
  display: grid;
  gap: 1rem;
}

.calc-hero,
.selector-card,
.tab-shell {
  padding: 1.25rem;
}

.calc-hero {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.8fr);
}

.calc-actions {
  display: grid;
  gap: 0.9rem;
}

.mode-switch,
.button-row,
.calculator-pills {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.mode-switch .active {
  background: var(--accent-strong);
  color: white;
}

.summary-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-grid strong {
  font-size: 1.3rem;
}

.selector-pill {
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  padding: 0.65rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--line);
}

.tab-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-bottom: 1rem;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.72rem 0.95rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.75);
  color: var(--ink-soft);
}

.tab-btn.active {
  background: var(--accent-strong);
  color: white;
}

.tab-panel {
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid var(--line);
  border-radius: 1.3rem;
  padding: 1rem;
}

@media (max-width: 920px) {
  .calc-hero,
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
