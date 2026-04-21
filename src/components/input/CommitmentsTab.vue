<script setup lang="ts">
import { useInputStore } from '../../stores/input'
import { CommitmentType, Frequency } from '../../types'

const store = useInputStore()
const productTypes = Object.values(CommitmentType)
const frequencies = Object.values(Frequency)

function needsTerm(type: CommitmentType): boolean {
  return type !== CommitmentType.CREDIT_CARD && type !== CommitmentType.OVERDRAFT
}
</script>

<template>
  <div class="tab-section">
    <div class="section-header">
      <h3>Credit Commitments</h3>
      <button class="btn-sm btn-add" @click="store.addCommitment()">+ Add Commitment</button>
    </div>

    <div v-if="!store.commitments.length" class="empty">
      No existing credit commitments.
    </div>

    <table v-else class="commit-table">
      <thead>
        <tr>
          <th>Product Type</th>
          <th>Limit ($)</th>
          <th>Term (Yrs)</th>
          <th>Rate (%)</th>
          <th>Declared Repay ($)</th>
          <th>Frequency</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(c, idx) in store.commitments" :key="idx">
          <td>
            <select v-model="c.product_type">
              <option v-for="t in productTypes" :key="t" :value="t">{{ t }}</option>
            </select>
          </td>
          <td><input v-model.number="c.limit" type="number" min="0" /></td>
          <td>
            <input
              v-if="needsTerm(c.product_type)"
              v-model.number="c.remaining_term_years" type="number" min="0"
            />
            <span v-else class="na">N/A</span>
          </td>
          <td>
            <input
              v-if="needsTerm(c.product_type)"
              v-model.number="c.interest_rate" type="number" min="0" step="0.001"
            />
            <span v-else class="na">N/A</span>
          </td>
          <td>
            <input
              v-if="needsTerm(c.product_type)"
              v-model.number="c.declared_repayment" type="number" min="0"
            />
            <span v-else class="na">N/A</span>
          </td>
          <td>
            <select
              v-if="needsTerm(c.product_type)"
              v-model="c.repayment_frequency"
            >
              <option v-for="f in frequencies" :key="f" :value="f">{{ f }}</option>
            </select>
            <span v-else class="na">N/A</span>
          </td>
          <td>
            <button class="btn-sm btn-danger" @click="store.removeCommitment(idx)">X</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="hint">
      Credit Card / Overdraft: repayment = limit x 3.8% (annual rate from parameters)<br/>
      Other products: repayment = MAX(declared, PMT at assessment rate)
    </p>
  </div>
</template>

<style scoped>
.tab-section h3 { margin: 0; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.commit-table { width: 100%; border-collapse: collapse; }
.commit-table th {
  text-align: left; padding: 0.5rem; font-size: 0.75rem; color: #64748b;
  text-transform: uppercase; border-bottom: 1px solid #e2e8f0;
}
.commit-table td { padding: 0.35rem 0.5rem; border-bottom: 1px solid #f1f5f9; }
.commit-table input, .commit-table select {
  width: 100%; padding: 0.35rem 0.4rem; border: 1px solid #cbd5e1; border-radius: 4px;
  font-size: 0.85rem; box-sizing: border-box;
}
.na { color: #94a3b8; font-size: 0.8rem; }
.hint { font-size: 0.75rem; color: #94a3b8; margin-top: 0.75rem; }
.empty { color: #94a3b8; padding: 1rem 0; font-size: 0.875rem; }
.btn-sm { padding: 0.25rem 0.625rem; font-size: 0.75rem; border-radius: 4px; cursor: pointer; border: none; }
.btn-add { background: #dbeafe; color: #1e40af; }
.btn-danger { background: #fee2e2; color: #dc2626; }
</style>
