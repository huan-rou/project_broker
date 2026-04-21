import api from './client'
import type { UnifiedInput, PreviewResponse } from '../types'

export async function previewDerivedFields(input: UnifiedInput): Promise<PreviewResponse> {
  const { data } = await api.post('/preview', input)
  return data
}
