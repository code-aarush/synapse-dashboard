export function createExpense(amount, category) {
  return {
    id: Date.now(),
    amount: Number(amount),
    category,
    date: new Date()
  };
}
