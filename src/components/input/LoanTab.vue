<script setup lang="ts">
import { ref } from 'vue'
import { useInputStore } from '../../stores/input'
import { LoanPurpose, LoanType, ResidentialStatus } from '../../types'

const store = useInputStore()
const purposes = Object.values(LoanPurpose)
const loanTypes = Object.values(LoanType)
const residentialStatuses = Object.values(ResidentialStatus)

const showAdvanced = ref(false)
</script>

<template>
  <div class="tab-section">
    <h3>Loan Details</h3>
    <div class="form-grid">
      <div class="field">
        <label>Loan Amount ($)</label>
        <input v-model.number="store.loan.amount" type="number" min="0" step="1000" />
      </div>
      <div class="field">
        <label>Term (Years)</label>
        <input v-model.number="store.loan.term_years" type="number" min="1" max="40" />
      </div>
      <div class="field">
        <label>Product Rate (%)</label>
        <input v-model.number="store.loan.product_rate" type="number" min="0" step="0.01" />
      </div>
      <div class="field">
        <label>Loan Purpose</label>
        <select v-model="store.loan.purpose">
          <option v-for="p in purposes" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
      <div class="field">
        <label>Residential Status</label>
        <select v-model="store.loan.residential_status">
          <option v-for="s in residentialStatuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>

    <button class="toggle-advanced" @click="showAdvanced = !showAdvanced">
      {{ showAdvanced ? '&#9660;' : '&#9654;' }} Advanced Options
    </button>

    <div v-if="showAdvanced" class="advanced-section">
      <div class="form-grid">
        <div class="field">
          <label>Interest Only Term (Years)</label>
          <input v-model.number="store.loan.io_term_years" type="number" min="0" />
        </div>
        <div class="field">
          <label>Security Value ($)</label>
          <input v-model.number="store.loan.security_value" type="number" min="0" step="1000" />
        </div>
        <div class="field">
          <label>Loan Type</label>
          <select v-model="store.loan.loan_type">
            <option v-for="t in loanTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>
    </div>

    <p class="hint">
      Assessment Rate = MAX(Product Rate + 3% buffer, 5.3% floor)
    </p>
  </div>
</template>

<style scoped>
.tab-section h3 { margin: 0 0 1rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }
.field label { display: block; font-size: 0.8rem; color: #475569; margin-bottom: 0.2rem; font-weight: 500; }
.field input, .field select {
  width: 100%; padding: 0.4rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;
  font-size: 0.875rem; box-sizing: border-box;
}
.field input:focus, .field select:focus { outline: none; border-color: #2563eb; }
.toggle-advanced {
  margin-top: 1rem; padding: 0.4rem 0; border: none; background: none;
  color: #2563eb; cursor: pointer; font-size: 0.85rem; font-weight: 500;
}
.toggle-advanced:hover { color: #1d4ed8; }
.advanced-section {
  margin-top: 0.75rem; padding: 1rem;
  background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;
}
.hint { font-size: 0.8rem; color: #94a3b8; margin-top: 1rem; }
</style>
