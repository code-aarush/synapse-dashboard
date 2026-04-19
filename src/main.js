import { handleAddExpense } from './modules/finance/financeController.js';
import { subscribe } from './core/events/eventBus.js';
import state from './core/state/appState.js';
import { save, load } from './core/storage/localStorage.js';

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

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.style.marginTop = '5px';
    editBtn.style.padding = '5px 10px';
    editBtn.style.marginRight = '5px';

    const saveEditBtn = document.createElement('button');
    saveEditBtn.textContent = 'Save';
    saveEditBtn.style.marginTop = '5px';
    saveEditBtn.style.padding = '5px 10px';
    saveEditBtn.style.marginRight = '5px';

    let isEditing = false;
    let editAmountInput = null;
    let editCategoryInput = null;

    editBtn.addEventListener('click', () => {
      if (isEditing) return;
      isEditing = true;

      editAmountInput = document.createElement('input');
      editAmountInput.type = 'number';
      editAmountInput.value = expense.amount;

      editCategoryInput = document.createElement('input');
      editCategoryInput.type = 'text';
      editCategoryInput.value = expense.category;

      amountDiv.textContent = 'Amount: ';
      amountDiv.appendChild(editAmountInput);

      categoryDiv.textContent = 'Category: ';
      categoryDiv.appendChild(editCategoryInput);

      item.replaceChild(saveEditBtn, editBtn);
    });

    saveEditBtn.addEventListener('click', () => {
      if (!isEditing || !editAmountInput || !editCategoryInput) return;

      const newAmount = Number(editAmountInput.value);
      const newCategory = editCategoryInput.value.trim();

      if (newAmount > 0 && newCategory !== '') {
        const index = state.finance.findIndex(item => item.id === expense.id);
        if (index !== -1) {
          state.finance[index].amount = newAmount;
          state.finance[index].category = newCategory;
          save('finance', state.finance);
          renderAll();
        }
      }
    });

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
    item.appendChild(editBtn);
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

// Load saved data on init
const savedData = load('finance');
state.finance = Array.isArray(savedData) ? savedData : [];

// Trigger initial render on load
renderAll();

// Initialize clock
const clock = document.getElementById('clock');

function updateClock() {
  if (!clock) return;
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clock.textContent = `${hours}:${minutes}:${seconds}`;
}

updateClock();
setInterval(updateClock, 1000);

// Initialize greeting
const greeting = document.getElementById('greeting');

function updateGreeting() {
  if (!greeting) return;
  const hour = new Date().getHours();
  let timeOfDay = 'Evening';
  if (hour < 12) {
    timeOfDay = 'Morning';
  } else if (hour < 18) {
    timeOfDay = 'Afternoon';
  }
  greeting.textContent = `Good ${timeOfDay}, Aarush`;
}

updateGreeting();
setInterval(updateGreeting, 60000);

// Initialize quote
const quoteEl = document.getElementById('quote');
const quotes = [
  "Discipline beats motivation.",
  "Small steps every day.",
  "Focus on progress, not perfection.",
  "You are what you do daily.",
  "Consistency creates success."
];

function updateQuote() {
  if (!quoteEl) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteEl.textContent = `"${quotes[randomIndex]}"`;
}

updateQuote();
setInterval(updateQuote, 10000);

// Initialize scrolling effects
const heroSection = document.getElementById("heroSection");

window.addEventListener("scroll", () => {
  if (!heroSection) return;
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  const progress = Math.min(scrollY / windowHeight, 1);

  // Move hero up smoothly
  heroSection.style.transform = `translateY(-${progress * 80}px) scale(${1 - progress * 0.05})`;

  // VERY subtle fade (almost none)
  heroSection.style.opacity = 1 - progress * 0.2;
});
