import api from './client'
import type { CalculatorInfo, UnifiedInput, MultiCalculationResponse, WorkspaceListItem, Workspace } from '../types'

export async function listCalculators(): Promise<CalculatorInfo[]> {
  const { data } = await api.get('/calculators')
  return data
}

export async function calculate(input: UnifiedInput): Promise<MultiCalculationResponse> {
  const { data } = await api.post('/calculate', input)
  return data
}

// Workspaces
export async function listWorkspaces(): Promise<WorkspaceListItem[]> {
  const { data } = await api.get('/workspaces')
  return data
}

export async function getWorkspace(id: number): Promise<Workspace> {
  const { data } = await api.get(`/workspaces/${id}`)
  return data
}

export async function createWorkspace(name: string, inputData: UnifiedInput): Promise<WorkspaceListItem> {
  const { data } = await api.post('/workspaces', { name, data: inputData })
  return data
}

export async function deleteWorkspace(id: number): Promise<void> {
  await api.delete(`/workspaces/${id}`)
}
