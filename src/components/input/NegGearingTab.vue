<script setup lang="ts">
import { useInputStore } from '../../stores/input'

const store = useInputStore()
const purposes = ['Owner Occupied', 'Investment']
</script>

<template>
  <div class="tab-section">
    <div class="section-header">
      <h3>Negative Gearing Loans</h3>
      <button class="btn-sm btn-add" @click="store.addNegativeGearingLoan()">+ Add Loan</button>
    </div>

    <div v-if="!store.negativeGearingLoans.length" class="empty">
      No negative gearing loans. Click "Add Loan" if applicable.
    </div>

    <div v-for="(loan, idx) in store.negativeGearingLoans" :key="idx" class="loan-card">
      <div class="card-header">
        <strong>Loan {{ idx + 1 }}</strong>
        <button class="btn-sm btn-danger" @click="store.removeNegativeGearingLoan(idx)">Remove</button>
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Outstanding Balance ($)</label>
          <input v-model.number="loan.outstanding_balance" type="number" min="0" />
        </div>
        <div class="field">
          <label>Loan Purpose</label>
          <select v-model="loan.purpose">
            <option v-for="p in purposes" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
        <div class="field">
          <label>Interest Rate (%)</label>
          <input v-model.number="loan.interest_rate" type="number" min="0" step="0.01" />
        </div>
      </div>

      <h4>Ownership %</h4>
      <div class="alloc-grid">
        <div v-for="(app, i) in store.applicants" :key="i" class="field">
          <label>{{ app.name }}</label>
          <input v-model.number="loan.ownership_pct[i]" type="number" min="0" max="1" step="0.01" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-section h3 { margin: 0; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.loan-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
h4 { font-size: 0.875rem; color: #334155; margin: 1rem 0 0.5rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }
.alloc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
.field label { display: block; font-size: 0.8rem; color: #475569; margin-bottom: 0.2rem; font-weight: 500; }
.field input, .field select {
  width: 100%; padding: 0.4rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;
  font-size: 0.875rem; box-sizing: border-box;
}
.empty { color: #94a3b8; padding: 1rem 0; font-size: 0.875rem; }
.btn-sm { padding: 0.25rem 0.625rem; font-size: 0.75rem; border-radius: 4px; cursor: pointer; border: none; }
.btn-add { background: #dbeafe; color: #1e40af; }
.btn-danger { background: #fee2e2; color: #dc2626; }
</style>
