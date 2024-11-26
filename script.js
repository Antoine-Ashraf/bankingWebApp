'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

//// Application Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

//// Elements Selection
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//// Aplication Code Implementation
function createUsername(accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(function (element) {
        return element[0];
      })
      .join('');
  });
}

function displayMovements(movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function calcBalance(account) {
  const balance = account.movements.reduce(
    (acc, element) => (acc += element),
    0
  );
  labelBalance.textContent = `${balance}€`;
  return balance;
}

function calcSummary(account) {
  const income = account.movements
    .filter(element => element > 0)
    .reduce((acc, element) => (acc += element), 0);
  const outcome = account.movements
    .filter(element => element < 0)
    .reduce((acc, element) => (acc += Math.abs(element)), 0);
  const interest = account.movements
    .filter(element => element > 0)
    .map(element => (element * account.interestRate) / 100)
    .reduce((acc, element) => (acc += element));
  labelSumIn.textContent = `${income}€`;
  labelSumOut.textContent = `${outcome}€`;
  labelSumInterest.textContent = `${interest}€`;
}

function updateUI(account) {
  displayMovements(account.movements);
  calcBalance(account);
  calcSummary(account);
}

//// Event Handlers
let currentUser;

// Login feature
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentUser = accounts.find(
    element => element.username === inputLoginUsername.value
  );
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    displayMovements(currentUser.movements);
    currentUser.balance = calcBalance(currentUser);
    calcSummary(currentUser);
  } else {
    alert('Incorrect credentials');
  }
});

// Money transfer feature
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const receiver = accounts.find(
    element => element.owner === inputTransferTo.value
  );
  if (
    transferAmount > 0 &&
    currentUser.balance >= transferAmount &&
    receiver &&
    receiver.username !== currentUser.username
  ) {
    currentUser.movements.push(-transferAmount);
    receiver.movements.push(transferAmount);
    updateUI(currentUser);
  } else {
    console.log(`transfer not valid`);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

// Close account feature
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const accountIndex = accounts.findIndex(
      element => element.username === currentUser.username
    );
    accounts.splice(accountIndex, 1);
    console.log('Account closed successfuly');
    containerApp.style.opacity = 0;
    console.log(accounts);
  } else {
    alert('Incorrect Credentials');
  }
});

//// Application Structure
createUsername(accounts);
