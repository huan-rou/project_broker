<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useResultsStore } from '../../stores/results'

const props = defineProps<{
  caseId: number
}>()

const resultsStore = useResultsStore()

const topResult = computed(() => resultsStore.results[0])

function fmtCurrency(value: number | undefined) {
  if (value === undefined) return '-'
  return `$${Math.round(value).toLocaleString()}`
}

function fmtPercent(value: number | undefined) {
  if (value === undefined) return '-'
  return `${(value * 100).toFixed(1)}%`
}

onMounted(() => {
  void resultsStore.loadCaseResults(props.caseId)
})
</script>

<template>
  <div class="results-grid">
    <section class="results-hero page-card">
      <div>
        <p class="eyebrow">Lender Comparison</p>
        <h3 class="section-title">A summary table for the walkthrough, with enough detail to feel credible.</h3>
        <p class="section-copy">
          Results are sorted by maximum borrowing capacity and keep the drill-down language brokers expect
          when narrating why one lender is ahead of another.
        </p>
      </div>
      <div class="hero-highlight" v-if="topResult">
        <span class="field-label">Best Current Match</span>
        <strong>{{ topResult.calculator_name }}</strong>
        <p>{{ fmtCurrency(topResult.max_loan_amount) }} max borrowing</p>
      </div>
    </section>

    <section class="table-card page-card">
      <table class="result-table">
        <thead>
          <tr>
            <th>Lender</th>
            <th>Outcome</th>
            <th>Max Borrowing</th>
            <th>NIS</th>
            <th>LVR</th>
            <th>DTI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in resultsStore.results" :key="result.calculator_id">
            <td>{{ result.calculator_name }}</td>
            <td>
              <span class="pill" :class="result.pass_fail === 'Pass' ? 'success' : 'warning'">{{ result.pass_fail }}</span>
            </td>
            <td>{{ fmtCurrency(result.max_loan_amount) }}</td>
            <td>{{ fmtCurrency(result.nis) }}</td>
            <td>{{ fmtPercent(result.lvr) }}</td>
            <td>{{ result.dti.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="detail-grid">
      <article v-for="result in resultsStore.results" :key="result.calculator_id" class="detail-card page-card">
        <div class="detail-head">
          <div>
            <p class="eyebrow">v{{ result.calculator_version }}</p>
            <h4>{{ result.calculator_name }}</h4>
          </div>
          <span class="pill" :class="result.pass_fail === 'Pass' ? 'success' : 'warning'">{{ result.pass_fail }}</span>
        </div>

        <div class="detail-stats">
          <div>
            <span class="field-label">Net Income Surplus</span>
            <strong>{{ fmtCurrency(result.nis) }}</strong>
          </div>
          <div>
            <span class="field-label">Commitments</span>
            <strong>{{ fmtCurrency(result.total_monthly_commitments) }}</strong>
          </div>
          <div>
            <span class="field-label">Monthly Expenses</span>
            <strong>{{ fmtCurrency(result.total_monthly_expenses) }}</strong>
          </div>
        </div>

        <div class="warnings">
          <p v-for="warning in result.warnings" :key="warning">{{ warning }}</p>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.results-grid,
.detail-grid {
  display: grid;
  gap: 1rem;
}

.results-hero,
.table-card,
.detail-card {
  padding: 1.25rem;
}

.results-hero {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1.35fr) minmax(240px, 0.65fr);
}

.hero-highlight {
  padding: 1rem;
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid var(--line);
}

.hero-highlight strong {
  font-size: 1.5rem;
}

.result-table {
  width: 100%;
  border-collapse: collapse;
}

.result-table th,
.result-table td {
  padding: 0.9rem 0.8rem;
  text-align: left;
  border-bottom: 1px solid var(--line);
}

.detail-grid {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.detail-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.detail-head h4 {
  margin: 0.15rem 0 0;
  font-size: 1.2rem;
}

.detail-stats {
  display: grid;
  gap: 0.8rem;
  margin: 1rem 0;
}

.detail-stats strong {
  font-size: 1.25rem;
}

.warnings {
  color: var(--ink-soft);
}

@media (max-width: 900px) {
  .results-hero {
    grid-template-columns: 1fr;
  }

  .table-card {
    overflow-x: auto;
  }
}
</style>
