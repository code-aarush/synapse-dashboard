import state from '../../core/state/appState.js';
import { save } from '../../core/storage/localStorage.js';

export function addExpense(expense) {
  state.finance.push(expense);
  save('finance', state.finance);
}
