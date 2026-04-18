import { handleAddExpense } from './modules/finance/financeController.js';
import { subscribe } from './core/events/eventBus.js';

const amountInput = document.getElementById('amountInput');
const categoryInput = document.getElementById('categoryInput');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const expenseList = document.getElementById('expenseList');

addExpenseBtn.addEventListener('click', () => {
  const amount = amountInput.value;
  const category = categoryInput.value;
  handleAddExpense(amount, category);
});

subscribe('expense_added', (expense) => {
  console.log('Expense added:', expense);
  const item = document.createElement('div');

  const amountDiv = document.createElement('div');
  amountDiv.textContent = `Amount: ${expense.amount}`;

  const categoryDiv = document.createElement('div');
  categoryDiv.textContent = `Category: ${expense.category}`;

  item.appendChild(amountDiv);
  item.appendChild(categoryDiv);

  expenseList.appendChild(item);
});
