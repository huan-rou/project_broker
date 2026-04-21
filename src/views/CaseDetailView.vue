<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrokerCalculatorPanel from '../components/broker/BrokerCalculatorPanel.vue'
import BrokerResultsPanel from '../components/broker/BrokerResultsPanel.vue'
import DocumentsPanel from '../components/broker/DocumentsPanel.vue'
import FactFindPanel from '../components/broker/FactFindPanel.vue'
import { useCasesStore } from '../stores/cases'
import { useDocumentsStore } from '../stores/documents'
import { useFactFindStore } from '../stores/factfind'
import { useInputStore } from '../stores/input'
import { useResultsStore } from '../stores/results'
import { getCalculatorInput } from '../services/demoApi'

const route = useRoute()
const router = useRouter()
const casesStore = useCasesStore()
const documentsStore = useDocumentsStore()
const factFindStore = useFactFindStore()
const inputStore = useInputStore()
const resultsStore = useResultsStore()

const caseId = computed(() => Number(route.params.caseId))
const activeTab = computed(() => {
  const tab = String(route.params.tab || 'documents')
  return ['documents', 'fact-find', 'calculator', 'results'].includes(tab) ? tab : 'documents'
})

const tabs = [
  { key: 'documents', label: 'Documents', icon: 'pi pi-folder-open' },
  { key: 'fact-find', label: 'Fact Find', icon: 'pi pi-file-edit' },
  { key: 'calculator', label: 'Calculator', icon: 'pi pi-calculator' },
  { key: 'results', label: 'Results', icon: 'pi pi-chart-line' },
]

async function loadCaseWorkspace() {
  if (!caseId.value) return
  await Promise.all([
    casesStore.loadCase(caseId.value),
    documentsStore.load(caseId.value),
    factFindStore.load(caseId.value),
    resultsStore.loadCalculators(),
    resultsStore.loadCaseResults(caseId.value),
  ])
  inputStore.loadFromWorkspace(await getCalculatorInput(caseId.value))
}

function switchTab(tab: string) {
  router.push(`/cases/${caseId.value}/${tab}`)
}

onMounted(() => {
  void loadCaseWorkspace()
})

watch(caseId, () => {
  documentsStore.clearTimers(caseId.value)
  void loadCaseWorkspace()
})
</script>

<template>
  <div v-if="casesStore.currentCase" class="case-shell">
    <section class="case-banner page-card">
      <div>
        <p class="eyebrow">{{ casesStore.currentCase.stageLabel }}</p>
        <h2 class="section-title">{{ casesStore.currentCase.name }}</h2>
        <p class="section-copy">{{ casesStore.currentCase.notes }}</p>
      </div>
      <div class="banner-meta">
        <div>
          <span class="field-label">Applicants</span>
          <strong>{{ casesStore.currentCase.people.map((person) => person.displayName).join(' + ') }}</strong>
        </div>
        <div>
          <span class="field-label">Target Lender</span>
          <strong>{{ casesStore.currentCase.targetLender }}</strong>
        </div>
        <div>
          <span class="field-label">Updated</span>
          <strong>{{ new Date(casesStore.currentCase.updatedAt).toLocaleString() }}</strong>
        </div>
      </div>
    </section>

    <nav class="tab-strip page-card">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
      </button>
    </nav>

    <DocumentsPanel v-if="activeTab === 'documents'" :case-id="caseId" />
    <FactFindPanel v-else-if="activeTab === 'fact-find'" :case-id="caseId" />
    <BrokerCalculatorPanel v-else-if="activeTab === 'calculator'" :case-id="caseId" />
    <BrokerResultsPanel v-else :case-id="caseId" />
  </div>
</template>

<style scoped>
.case-shell {
  display: grid;
  gap: 1rem;
}

.case-banner {
  padding: 1.35rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1.5fr) minmax(250px, 0.8fr);
}

.banner-meta {
  display: grid;
  gap: 0.8rem;
  align-content: start;
}

.tab-strip {
  padding: 0.55rem;
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  background: transparent;
  color: var(--ink-soft);
  font-weight: 700;
}

.tab-btn.active {
  background: var(--accent-strong);
  color: white;
}

@media (max-width: 860px) {
  .case-banner {
    grid-template-columns: 1fr;
  }
}
</style>
