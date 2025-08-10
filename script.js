const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const typeToggle = document.getElementById('type');
const typeLabel = document.getElementById('type-label');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

typeToggle.addEventListener('change', () => {
    typeLabel.textContent = typeToggle.checked ? 'Expense' : 'Income';
});

function updateValues() {
    const amounts = transactions.map(t => t.amount);

    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(i => i > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = (amounts.filter(i => i < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `+$${income}`;
    money_minus.innerText = `-$${expense}`;
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
    ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

    list.appendChild(item);
}

function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add text and amount');
        return;
    }

    const amt = typeToggle.checked ? -Math.abs(+amount.value) : Math.abs(+amount.value);

    const transaction = {
        id: Math.floor(Math.random() * 1000000),
        text: text.value,
        amount: amt
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
}

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener('submit', addTransaction);
