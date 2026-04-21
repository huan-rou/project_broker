<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCasesStore } from '../stores/cases'

const router = useRouter()
const casesStore = useCasesStore()
const search = ref('')
const status = ref<'all' | 'active' | 'submitted' | 'archived'>('all')
const newCaseName = ref('Walker Family Intake')

const filteredCases = computed(() =>
  casesStore.items.filter((item) => {
    const statusMatch = status.value === 'all' || item.status === status.value
    const searchMatch =
      !search.value ||
      item.name.toLowerCase().includes(search.value.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(search.value.toLowerCase()))
    return statusMatch && searchMatch
  }),
)

const headlineMetrics = computed(() => {
  const cases = casesStore.items
  return {
    total: cases.length,
    active: cases.filter((item) => item.status === 'active').length,
    borrowing: Math.max(...cases.map((item) => item.metrics.maxBorrowing)),
    flagged: cases.reduce((total, item) => total + item.metrics.flaggedItems, 0),
  }
})

onMounted(() => {
  void casesStore.loadCases()
})

async function createCase() {
  const created = await casesStore.quickCreateCase(newCaseName.value)
  router.push(`/cases/${created.id}/documents`)
}

function openCase(caseId: number, tab = 'documents') {
  router.push(`/cases/${caseId}/${tab}`)
}
</script>

<template>
  <div class="dashboard-grid">
    <section class="hero-card page-card">
      <div class="hero-copy">
        <p class="eyebrow">Broker Storyline</p>
        <h2 class="section-title">Move from raw files to lender-ready guidance with one unified case workspace.</h2>
        <p class="section-copy">
          This demo is tuned for walkthroughs: every case shows intake health, Fact Find readiness,
          calculator prep and final lender spread without needing a backend.
        </p>
      </div>
      <div class="hero-actions">
        <label class="quick-field">
          <span class="field-label">Create a fresh demo case</span>
          <input v-model="newCaseName" class="field-input" />
        </label>
        <button class="btn-primary" @click="createCase">Create Case</button>
      </div>
    </section>

    <section class="metric-row">
      <article class="metric-card page-card">
        <span>Total Cases</span>
        <strong>{{ headlineMetrics.total }}</strong>
      </article>
      <article class="metric-card page-card">
        <span>Active Pipeline</span>
        <strong>{{ headlineMetrics.active }}</strong>
      </article>
      <article class="metric-card page-card">
        <span>Top Borrowing</span>
        <strong>${{ headlineMetrics.borrowing.toLocaleString() }}</strong>
      </article>
      <article class="metric-card page-card warning">
        <span>Flagged Events</span>
        <strong>{{ headlineMetrics.flagged }}</strong>
      </article>
    </section>

    <section class="toolbar page-card">
      <label>
        <span class="field-label">Search Cases</span>
        <input v-model="search" class="field-input" placeholder="Search by client or tag" />
      </label>
      <label>
        <span class="field-label">Status</span>
        <select v-model="status" class="field-select">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="submitted">Submitted</option>
          <option value="archived">Archived</option>
        </select>
      </label>
    </section>

    <section class="case-list">
      <article v-for="item in filteredCases" :key="item.id" class="case-card page-card">
        <div class="case-topline">
          <div>
            <p class="eyebrow">{{ item.loanPurpose }}</p>
            <h3>{{ item.name }}</h3>
          </div>
          <span class="pill" :class="item.status === 'active' ? 'success' : item.status === 'submitted' ? 'info' : 'warning'">
            {{ item.status }}
          </span>
        </div>
        <p class="case-notes">{{ item.notes }}</p>
        <div class="tag-row">
          <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="metric-strip">
          <div>
            <span>Documents</span>
            <strong>{{ item.metrics.documentCompletion }}%</strong>
          </div>
          <div>
            <span>Fact Find</span>
            <strong>{{ item.metrics.factFindCompletion }}%</strong>
          </div>
          <div>
            <span>Max Borrowing</span>
            <strong>${{ item.metrics.maxBorrowing.toLocaleString() }}</strong>
          </div>
        </div>
        <div class="case-footer">
          <div>
            <span class="field-label">Target Lender</span>
            <strong>{{ item.targetLender }}</strong>
          </div>
          <div class="action-row">
            <button class="btn-secondary" @click="openCase(item.id, 'documents')">Open Case</button>
            <button class="btn-ghost" @click="openCase(item.id, 'results')">See Results</button>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
  gap: 1rem;
}

.hero-card,
.toolbar {
  padding: 1.4rem;
}

.hero-card {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
}

.hero-actions {
  display: grid;
  gap: 0.8rem;
  align-content: center;
}

.metric-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric-card {
  padding: 1.2rem;
  display: grid;
  gap: 0.35rem;
}

.metric-card span {
  color: var(--ink-soft);
}

.metric-card strong {
  font-size: 1.7rem;
  letter-spacing: -0.04em;
}

.metric-card.warning strong {
  color: var(--danger);
}

.toolbar {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1.4fr) minmax(220px, 0.6fr);
}

.case-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.case-card {
  padding: 1.3rem;
  display: grid;
  gap: 0.9rem;
}

.case-topline {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.case-topline h3 {
  margin: 0.2rem 0 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.5rem;
}

.case-notes {
  margin: 0;
  color: var(--ink-soft);
}

.tag-row {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: rgba(53, 111, 98, 0.08);
  color: var(--accent-strong);
  font-size: 0.8rem;
  font-weight: 700;
}

.metric-strip {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 0.9rem 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.metric-strip span,
.case-footer strong {
  display: block;
}

.metric-strip span {
  color: var(--ink-soft);
  font-size: 0.82rem;
}

.case-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.action-row {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

@media (max-width: 980px) {
  .hero-card,
  .metric-row,
  .toolbar {
    grid-template-columns: 1fr;
  }

  .case-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
