import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi } from '../services/demoApi'
import type { DemoSession } from '../types'

const SESSION_KEY = 'broker-demo-session'

function readSession(): DemoSession | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as DemoSession
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref<DemoSession | null>(readSession())

  const isAuthenticated = computed(() => Boolean(session.value?.token))
  const username = computed(() => session.value?.username || '')
  const displayName = computed(() => session.value?.displayName || '')
  const role = computed(() => session.value?.role || 'broker')
  const isAdmin = computed(() => role.value === 'admin')

  async function login(username: string, password: string) {
    const nextSession = await loginApi(username, password)
    session.value = nextSession
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
  }

  function logout() {
    session.value = null
    localStorage.removeItem(SESSION_KEY)
  }

  return {
    session,
    username,
    displayName,
    role,
    isAdmin,
    isAuthenticated,
    login,
    logout,
  }
})
