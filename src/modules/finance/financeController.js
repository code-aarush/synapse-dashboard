import { createExpense } from './financeModel.js';
import { addExpense } from './financeService.js';
import { emit } from '../../core/events/eventBus.js';

export function handleAddExpense(amount, category) {
  const expense = createExpense(amount, category);
  addExpense(expense);
  emit('expense_added', expense);
}
