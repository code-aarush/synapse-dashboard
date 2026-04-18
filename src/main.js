import { handleAddExpense } from './modules/finance/financeController.js';
import { subscribe } from './core/events/eventBus.js';
import state from './core/state/appState.js';
import { save } from './core/storage/localStorage.js';

const amountInput = document.getElementById('amountInput');
const categoryInput = document.getElementById('categoryInput');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const expenseList = document.getElementById('expenseList');
const totalAmount = document.getElementById('totalAmount');
const categoryBreakdown = document.getElementById('categoryBreakdown');

addExpenseBtn.addEventListener('click', () => {
  const amount = amountInput.value;
  const category = categoryInput.value;
  handleAddExpense(amount, category);
});

function renderAll() {
  expenseList.innerHTML = '';

  state.finance.forEach(expense => {
    const item = document.createElement('div');

    const amountDiv = document.createElement('div');
    amountDiv.textContent = `Amount: ${expense.amount}`;

    const categoryDiv = document.createElement('div');
    categoryDiv.textContent = `Category: ${expense.category}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginTop = '5px';
    deleteBtn.style.padding = '5px 10px';

    deleteBtn.addEventListener('click', () => {
      // remove from state
      state.finance = state.finance.filter(item => item.id !== expense.id);

      // update storage
      save('finance', state.finance);

      // re-render the whole list
      renderAll();
    });

    item.appendChild(amountDiv);
    item.appendChild(categoryDiv);
    item.appendChild(deleteBtn);

    expenseList.appendChild(item);
  });

  // update total
  const total = state.finance.reduce((sum, exp) => sum + exp.amount, 0);
  totalAmount.textContent = `Total: ₹ ${total}`;

  // update category breakdown
  const categoryTotals = {};
  state.finance.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  categoryBreakdown.innerHTML = '<h4>Category Breakdown</h4>';

  for (const [category, amount] of Object.entries(categoryTotals)) {
    const div = document.createElement('div');
    div.textContent = `${category}: ₹ ${amount}`;
    categoryBreakdown.appendChild(div);
  }
}

// Just trigger renderAll whenever an expense is added
subscribe('expense_added', renderAll);

// Trigger initial render on load
renderAll();
