<script setup lang="ts">
import { ref } from 'vue'
import { useInputStore } from '../../stores/input'
import { Frequency } from '../../types'

const store = useInputStore()
const frequencies = Object.values(Frequency)

const commonIncomeFields = [
  { key: 'base', label: 'Base Salary' },
  { key: 'overtime', label: 'Overtime' },
  { key: 'commission_bonus', label: 'Commission / Bonus' },
  { key: 'rental', label: 'Rental Income' },
  { key: 'self_employed', label: 'Self-Employed Income' },
  { key: 'government_family', label: 'Govt / Family Payments' },
  { key: 'casual_second_job', label: 'Casual / Second Job' },
] as const

const expandedIncomeFields = [
  { key: 'dividend', label: 'Dividend' },
  { key: 'interest', label: 'Interest' },
  { key: 'trust_deed', label: 'Trust Deed' },
  { key: 'managed_fund', label: 'Managed Fund' },
  { key: 'foreign', label: 'Foreign Income' },
  { key: 'maintenance', label: 'Maintenance / Child Support' },
  { key: 'investment_other', label: 'Other Investment Income' },
  { key: 'other_taxable', label: 'Other Taxable Income' },
] as const

const selectedApplicant = ref(0)
const showMoreIncome = ref(false)
</script>

<template>
  <div class="tab-section">
    <div class="section-header">
      <h3>Income</h3>
      <div class="app-selector">
        <button
          v-for="(app, i) in store.applicants" :key="i"
          :class="['tab-pill', { active: selectedApplicant === i }]"
          @click="selectedApplicant = i as number"
        >{{ app.name }}</button>
      </div>
    </div>

    <div v-if="store.income[selectedApplicant]" class="income-grid">
      <div class="grid-header">
        <span>Income Type</span>
        <span>Amount ($)</span>
        <span>Frequency</span>
      </div>

      <!-- Common income fields (always visible) -->
      <div v-for="field in commonIncomeFields" :key="field.key" class="grid-row">
        <label>{{ field.label }}</label>
        <input
          v-model.number="(store.income[selectedApplicant] as any)[field.key].amount"
          type="number" min="0" step="100"
        />
        <select v-model="(store.income[selectedApplicant] as any)[field.key].frequency">
          <option v-for="f in frequencies" :key="f" :value="f">{{ f }}</option>
        </select>
      </div>

      <!-- Expand toggle -->
      <div class="expand-row">
        <button class="toggle-more" @click="showMoreIncome = !showMoreIncome">
          {{ showMoreIncome ? '&#9660; Hide' : '&#9654; More Income Types' }}
          <span class="toggle-hint">({{ expandedIncomeFields.length }} additional types)</span>
        </button>
      </div>

      <!-- Expanded income fields -->
      <template v-if="showMoreIncome">
        <div v-for="field in expandedIncomeFields" :key="field.key" class="grid-row expanded">
          <label>{{ field.label }}</label>
          <input
            v-model.number="(store.income[selectedApplicant] as any)[field.key].amount"
            type="number" min="0" step="100"
          />
          <select v-model="(store.income[selectedApplicant] as any)[field.key].frequency">
            <option v-for="f in frequencies" :key="f" :value="f">{{ f }}</option>
          </select>
        </div>
      </template>

      <div class="divider"></div>

      <div class="grid-row">
        <label>Non-Taxable Other (annual)</label>
        <input v-model.number="store.income[selectedApplicant].non_taxable_other" type="number" min="0" />
        <span></span>
      </div>

      <div class="checkbox-row">
        <label>
          <input type="checkbox" v-model="store.income[selectedApplicant].medicare_levy_surcharge_applicable" />
          Medicare Levy Surcharge Applicable (no private health insurance)
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-section h3 { margin: 0; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.app-selector { display: flex; gap: 4px; }
.tab-pill {
  padding: 0.3rem 0.75rem; border: 1px solid #cbd5e1; background: white;
  border-radius: 20px; font-size: 0.8rem; cursor: pointer; color: #475569;
}
.tab-pill.active { background: #2563eb; color: white; border-color: #2563eb; }

.income-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
.grid-header {
  display: grid; grid-template-columns: 180px 1fr 140px; gap: 0.5rem;
  font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase;
  padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0;
}
.grid-row {
  display: grid; grid-template-columns: 180px 1fr 140px; gap: 0.5rem;
  align-items: center; padding: 0.35rem 0;
}
.grid-row.expanded { background: #f8fafc; padding: 0.35rem 0.5rem; border-radius: 4px; margin: 1px 0; }
.grid-row label { font-size: 0.8rem; color: #334155; }
.grid-row input, .grid-row select {
  padding: 0.35rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;
  font-size: 0.85rem; box-sizing: border-box;
}
.grid-row input:focus, .grid-row select:focus { outline: none; border-color: #2563eb; }

.expand-row { padding: 0.5rem 0; }
.toggle-more {
  border: none; background: none; color: #2563eb; cursor: pointer;
  font-size: 0.85rem; font-weight: 500; padding: 0.25rem 0;
}
.toggle-more:hover { color: #1d4ed8; }
.toggle-hint { font-weight: 400; color: #94a3b8; font-size: 0.75rem; margin-left: 0.25rem; }

.divider { border-top: 1px solid #e2e8f0; margin: 0.5rem 0; }
.checkbox-row { padding: 0.5rem 0; }
.checkbox-row label { font-size: 0.85rem; color: #334155; display: flex; align-items: center; gap: 0.5rem; }
</style>
