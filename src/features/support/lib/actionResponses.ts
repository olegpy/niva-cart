import type { ActionError, ActionSuccess } from '@/features/support/types';

export function actionError(error: string): ActionError {
  return { ok: false, error };
}
export function actionSuccess<T>(data: T): ActionSuccess<T> {
  return { ok: true, data };
}