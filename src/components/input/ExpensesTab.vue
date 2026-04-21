<script setup lang="ts">
import { ref } from 'vue'
import { useInputStore } from '../../stores/input'

const store = useInputStore()

const hemBasicFields = [
  { key: 'child_care', label: 'Child Care' },
  { key: 'clothing', label: 'Clothing / Personal Care' },
  { key: 'communications', label: 'Communications' },
  { key: 'public_school', label: 'Public/Govt School Costs' },
  { key: 'general_education', label: 'General Education' },
  { key: 'groceries', label: 'Groceries' },
  { key: 'primary_dwelling', label: 'Primary Dwelling Costs' },
  { key: 'personal_insurance', label: 'Personal Insurance' },
  { key: 'general_insurance', label: 'General Insurance' },
  { key: 'health_medical', label: 'Health & Medical' },
  { key: 'recreation', label: 'Recreation & Entertainment' },
  { key: 'transport', label: 'Transport' },
  { key: 'other_basic', label: 'Other Basic' },
  { key: 'pet_care', label: 'Pet Care' },
  { key: 'strata_body_corp', label: 'Strata / Body Corporate' },
] as const

const nonHemFields = [
  { key: 'alimony', label: 'Alimony / Maintenance' },
  { key: 'private_school', label: 'Private School Fees' },
  { key: 'higher_education', label: 'Higher Education' },
  { key: 'second_dwelling', label: 'Second Dwelling Costs' },
  { key: 'investment_property', label: 'Investment Property' },
  { key: 'rent_expense', label: 'Rent' },
  { key: 'board', label: 'Board' },
  { key: 'other_non_hem', label: 'Other Non-HEM Expense' },
] as const

const selectedApplicant = ref(0)
</script>

<template>
  <div class="tab-section">
    <div class="section-header">
      <h3>Expenses (Monthly)</h3>
      <div class="app-selector">
        <button
          v-for="(app, i) in store.applicants" :key="i"
          :class="['tab-pill', { active: selectedApplicant === i }]"
          @click="selectedApplicant = i as number"
        >{{ app.name }}</button>
      </div>
    </div>

    <div v-if="store.expenses[selectedApplicant]">
      <!-- HEM Toggle -->
      <div class="hem-toggle">
        <label class="toggle-option">
          <input
            type="radio"
            :checked="store.expenses[selectedApplicant].use_hem"
            @change="store.expenses[selectedApplicant].use_hem = true"
          />
          <span class="toggle-label">
            <strong>Use HEM benchmark</strong>
            <span class="toggle-hint">Recommended. Basic expenses default to HEM lookup values. Only non-basic expenses need to be entered.</span>
          </span>
        </label>
        <label class="toggle-option">
          <input
            type="radio"
            :checked="!store.expenses[selectedApplicant].use_hem"
            @change="store.expenses[selectedApplicant].use_hem = false"
          />
          <span class="toggle-label">
            <strong>Enter declared expenses</strong>
            <span class="toggle-hint">Manually enter all expense categories. Calculator uses MAX(declared, HEM).</span>
          </span>
        </label>
      </div>

      <!-- Basic expenses (only show when declared mode) -->
      <div v-if="!store.expenses[selectedApplicant].use_hem">
        <h4>Basic Expenses (compared to HEM)</h4>
        <div class="expense-grid">
          <div v-for="f in hemBasicFields" :key="f.key" class="expense-row">
            <label>{{ f.label }}</label>
            <div class="input-wrap">
              <span class="prefix">$</span>
              <input v-model.number="(store.expenses[selectedApplicant] as any)[f.key]" type="number" min="0" />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="hem-info">
        Basic expenses will use HEM benchmark values based on applicant location, status, dependents, and income band.
      </div>

      <h4>Non-Basic Expenses (added on top of HEM)</h4>
      <div class="expense-grid">
        <div v-for="f in nonHemFields" :key="f.key" class="expense-row">
          <label>{{ f.label }}</label>
          <div class="input-wrap">
            <span class="prefix">$</span>
            <input v-model.number="(store.expenses[selectedApplicant] as any)[f.key]" type="number" min="0" />
          </div>
        </div>
      </div>

      <h4>Other Settings</h4>
      <div class="settings-grid">
        <div class="checkbox-row">
          <label>
            <input type="checkbox" v-model="store.expenses[selectedApplicant].hecs_applicable" />
            HECS-HELP Debt Applicable
          </label>
        </div>
        <div class="field">
          <label>HEM Apportioning</label>
          <input v-model.number="store.expenses[selectedApplicant].hem_apportioning" type="number" min="0" max="1" step="0.01" />
          <span class="hint">1.0 = full HEM, 0.5 = half for couple split</span>
        </div>
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

.hem-toggle {
  display: flex; flex-direction: column; gap: 0.5rem;
  margin-bottom: 1.25rem; padding: 1rem;
  background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;
}
.toggle-option {
  display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer;
}
.toggle-option input[type="radio"] { margin-top: 0.2rem; }
.toggle-label { display: flex; flex-direction: column; }
.toggle-label strong { font-size: 0.875rem; color: #1e293b; }
.toggle-hint { font-size: 0.75rem; color: #94a3b8; margin-top: 0.1rem; }

.hem-info {
  padding: 0.75rem 1rem; background: #eff6ff; border: 1px solid #bfdbfe;
  border-radius: 6px; font-size: 0.85rem; color: #1e40af; margin-bottom: 0.75rem;
}

h4 { font-size: 0.875rem; color: #334155; margin: 1.25rem 0 0.5rem; }
h4:first-of-type { margin-top: 0; }
.expense-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem 1.5rem; }
.expense-row { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
.expense-row label { font-size: 0.8rem; color: #334155; white-space: nowrap; }
.input-wrap {
  display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 4px;
  overflow: hidden; width: 140px; flex-shrink: 0;
}
.input-wrap .prefix { padding: 0 0.4rem; color: #94a3b8; font-size: 0.85rem; background: #f8fafc; }
.input-wrap input {
  border: none; padding: 0.35rem 0.4rem; font-size: 0.85rem; width: 100%;
  box-sizing: border-box; outline: none;
}
.settings-grid { margin-top: 0.5rem; }
.checkbox-row label { font-size: 0.85rem; color: #334155; display: flex; align-items: center; gap: 0.5rem; }
.field { margin-top: 0.5rem; }
.field label { display: block; font-size: 0.8rem; color: #475569; margin-bottom: 0.2rem; font-weight: 500; }
.field input {
  padding: 0.35rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;
  font-size: 0.85rem; width: 120px;
}
.hint { font-size: 0.75rem; color: #94a3b8; margin-left: 0.5rem; }
</style>
