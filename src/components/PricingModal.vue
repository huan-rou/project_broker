<script setup lang="ts">
const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const plans = [
  {
    name: 'Free',
    subtitle: 'For solo brokers, researchers and teams who want a standalone demo deployment.',
    points: [
      'Full-featured single-office workflow demo',
      'Community support and documentation access',
      'Local mock data and no platform fee',
    ],
    primaryAction: 'Get Started',
    secondaryAction: '',
    featured: false,
  },
  {
    name: 'Enterprise Lite',
    subtitle: 'For small broker teams who need hosted access, shared collaboration and guided onboarding.',
    points: [
      'Multi-user hosted workspace with team-ready demo storytelling',
      'Security diagnostics, usage visibility and branded deployment options',
      'Optional onboarding support with fast response SLA',
    ],
    primaryAction: 'Request Pricing',
    secondaryAction: 'Start Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    subtitle: 'For larger brokerages that want premium support, scale and a polished online showcase.',
    points: [
      'Full-featured scalable online deployment for broker networks',
      'Advanced governance, audit visibility and custom branding',
      'Priority direct-to-engineer support and enterprise onboarding',
    ],
    primaryAction: 'Request Pricing',
    secondaryAction: 'Start Trial',
    featured: false,
  },
]
</script>

<template>
  <div v-if="props.visible" class="pricing-overlay" @click.self="emit('close')">
    <div class="pricing-shell">
      <div class="pricing-head">
        <div>
          <p class="eyebrow">Pricing</p>
          <h2>Choose the right online package for your broker workflow rollout.</h2>
        </div>
        <button class="close-btn" @click="emit('close')">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="pricing-grid">
        <article v-for="plan in plans" :key="plan.name" class="plan-card" :class="{ featured: plan.featured }">
          <p class="plan-brand">HARBOURLINE</p>
          <h3>{{ plan.name }}</h3>
          <p class="plan-copy">{{ plan.subtitle }}</p>

          <ul class="plan-points">
            <li v-for="point in plan.points" :key="point">
              <span class="check"><i class="pi pi-check"></i></span>
              <span>{{ point }}</span>
            </li>
          </ul>

          <div class="plan-actions">
            <button class="plan-primary" :class="{ featured: plan.featured }">{{ plan.primaryAction }}</button>
            <button v-if="plan.secondaryAction" class="plan-secondary">{{ plan.secondaryAction }}</button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pricing-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  padding: 1.25rem;
  background: rgba(14, 25, 33, 0.48);
  backdrop-filter: blur(12px);
  overflow-y: auto;
}

.pricing-shell {
  max-width: 1240px;
  margin: 0 auto;
  padding: 1.4rem;
  border-radius: 2rem;
  background: linear-gradient(180deg, rgba(255, 253, 249, 0.98), rgba(250, 245, 239, 0.98));
  box-shadow: 0 36px 80px rgba(20, 41, 35, 0.2);
}

.pricing-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.pricing-head h2 {
  margin: 0.25rem 0 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  letter-spacing: -0.04em;
  color: var(--ink-strong);
  max-width: 760px;
}

.close-btn {
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 999px;
  border: 1px solid rgba(20, 41, 35, 0.12);
  background: white;
  color: var(--ink-strong);
}

.pricing-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.plan-card {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.8rem;
  border-radius: 1.8rem;
  background: white;
  border: 1px solid rgba(20, 41, 35, 0.08);
  box-shadow: 0 18px 30px rgba(20, 41, 35, 0.06);
}

.plan-card.featured {
  border-color: rgba(207, 29, 72, 0.14);
  box-shadow: 0 18px 36px rgba(207, 29, 72, 0.12);
}

.plan-brand {
  margin: 0;
  font-size: 0.86rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--ink-strong);
}

.plan-card h3 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 3rem);
  letter-spacing: -0.05em;
  line-height: 1.02;
  color: #101f36;
}

.plan-copy {
  margin: 0;
  color: #243b59;
  font-size: 1rem;
  line-height: 1.6;
}

.plan-points {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.9rem;
}

.plan-points li {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  color: #243b59;
  line-height: 1.6;
}

.check {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 999px;
  background: rgba(226, 190, 245, 0.32);
  color: #b14ad7;
  flex-shrink: 0;
  margin-top: 0.2rem;
  font-size: 0.72rem;
}

.plan-actions {
  margin-top: auto;
  display: grid;
  gap: 0.8rem;
}

.plan-primary,
.plan-secondary {
  width: 100%;
  padding: 0.98rem 1.1rem;
  border-radius: 999px;
  font-weight: 700;
}

.plan-primary {
  border: none;
  background: #d51746;
  color: white;
}

.plan-primary.featured {
  box-shadow: 0 18px 30px rgba(213, 23, 70, 0.2);
}

.plan-secondary {
  border: 1px solid rgba(20, 41, 35, 0.12);
  background: white;
  color: #374b61;
}

@media (max-width: 980px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}
</style>
