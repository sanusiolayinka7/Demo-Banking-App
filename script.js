'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2024-08-21T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2024-08-22T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Eniola Uthman Sanusi',
  movements: [
    200, -100, 500, 200, -500, 9000, 1_000_000, 500000, 500000, 1000000,
  ],
  interestRate: 2,
  pin: 5555,

  movementsDates: [
    '2024-02-01T13:15:33.03',
    '2024-02-02T13:15:33.03',
    '2024-02-03T13:15:33.03',
    '2024-02-04T13:15:33.03',
    '2024-02-05T13:15:33.03',
    '2024-02-06T13:15:33.03',
    '2024-08-23T13:15:33.03',
    '2024-08-26T13:15:33.03',
    '2024-08-27T13:15:33.03',
    '2024-08-28T13:15:33.03',
  ],
  currency: 'NGN',
  locale: navigator.language,
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
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

/////////////////////////////////////////////////
// Functions

// Formatting number

const formattedNum = num => {
  const options = {
    style: 'currency',
    locale: currentAccount.locale,
    currency: currentAccount.currency,
  };
  return new Intl.NumberFormat(options.locale, options).format(num);
};

// Formatting Date

const formatDate = function (date) {
  const dateOperation = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const now = new Date();
  const daysPassed = dateOperation(now, date);
  // Experimetning API
  const locale = navigator.language;

  if (daysPassed === 0) {
    return 'Today';
  } else if (daysPassed === 1) {
    return 'Yesterday';
  } else if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  } else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(account.movementsDates[i]);
    const displayDate = formatDate(date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedNum(mov)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formattedNum(acc.balance)}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formattedNum(incomes)}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formattedNum(Math.abs(out))}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formattedNum(interest)}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
// Dates
// Experimetning API

const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
};
const dateInterval = function () {
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(new Date());
};
// LOGOUT FUNCTION
const startLogout = function () {
  // Set time to 5 mins
  let time = 300;

  // Call the timer every seconds
  const timer = setInterval(() => {
    // Decrease the timer
    time--;

    // Timer
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const secs = String(time % 60).padStart(2, 0);

    // Print the remaining time to the UI
    labelTimer.textContent = `${min}:${secs}`;
    // Logout the user when the time is 0;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login to get started`;
      containerApp.style.opacity = 0;
      currentAccount = undefined;
      updateUI(currentAccount);
    }
  }, 1000);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

// Always logged in

/*
currentAccount = account2;
updateUI(currentAccount);
containerApp.style.opacity = 100;
dateInterval();
*/

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  dateInterval();
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const locale = navigator.language;
    // console.log(currentAccount.locale);

    // Internationalizing Dates

    setInterval(() => {
      labelDate.textContent = new Intl.DateTimeFormat(
        currentAccount.locale,
        options
      ).format(new Date());
    }, 60000);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Logou User
    startLogout();

    // Update UI
    updateUI(currentAccount);
  }
});

// Transfer Event Handler
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  let conversionRate;
  if (currentAccount.currency === 'EUR' && receiverAcc.currency === 'USD')
    conversionRate = 1.12;
  if (currentAccount.currency === receiverAcc.currency) conversionRate = 1.0;
  if (currentAccount.currency === 'USD' && receiverAcc.currency === 'EUR')
    conversionRate = 1 / 1.12;
  if (currentAccount.currency === 'EUR' && receiverAcc.currency === 'NGN')
    conversionRate = 1.12 * 1630;
  if (currentAccount.currency === 'NGN' && receiverAcc.currency === 'EUR')
    conversionRate = 1 / (1.12 * 1630);
  if (currentAccount.currency === 'NGN' && receiverAcc.currency === 'USD')
    conversionRate = 1 / 1630;
  if (currentAccount.currency === 'USD' && receiverAcc.currency === 'NGN')
    conversionRate = 1630;
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount * conversionRate);

    // Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

// Loan Event Handler
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(() => currentAccount.movements.push(amount), 10000);

    // Loan Date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    setTimeout(() => updateUI(currentAccount), 10000);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});
// Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// DATES AND TIMES
// const now = new Date();
// const day = `${now.getDate()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = now.getFullYear();
// const hour = now.getHours();
// const min = `${now.getMinutes()}`.padStart(2, 0);

// DISPLAY MOVEMENTS TIME

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*

// Check if a number is NaN
console.log(+'23');
// console.group(Number.parseInt('30px', 10));
console.log(Number.parseInt('2.5rem'));
console.log(Number.isNaN(20));

// Checking if value is a number.
console.log(Number.isFinite(20));

// Math operators
console.log(25 ** (1 / 2) === Math.sqrt(25));

console.log(Math.max(2, 4, 5, 6, 7, 8, 5, 3, 2));

console.log(Math.min(0, 5, 6, 7, 3, 3, 6, 6, 6, 7, 6, 7));

console.log(Math.floor(Math.random() * 7));

// Number between two maxims
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20));

// Rounding Integars
console.log(Math.floor(23));

// Rounding Decimals
console.log((2.7).toFixed(3));

// Reminder Operator
console.log(5 % 2);

//Even or Odd operator
const evenOrOdd = num => num % 2 === 0;
console.log(evenOrOdd(9));

//
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i % 2 === 0) row.style.backgroundColor = 'grey';
  });
});

*/

//Seperators
const diameter = 245_800_000;

// Create a date
/*
const now = new Date();
console.log(now);
console.log(new Date('December 24, 2015'));
console.log(account1.movementsDates[0]);
console.log(new Date(2024, 6, 27, 15, 13, 5));
console.log(new Date(0));
*/

// working with Dates
const future = new Date(2024, 6, 27);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDay());
// console.log(future.getTime());

//Mutating values
future.setFullYear(2040);

// Dates Operation
// console.log(Number(future));

// const num = 234567564543245.89;
// console.log(new Intl.NumberFormat(currentAccount.locale).format(num));
// console.log(new Intl.DateTimeFormat(navigator.language).format(future));

// TIMERS
// setInterval(() => console.log(`Here's yiur pizza`), 10000);

// To Pause TimeOut;
// clearTimeout || clearInterval
// setInterval(() => console.log(`${new Date()}`, 1000));

// setInterval(
//   () =>
//     console.log(
//       new Intl.DateTimeFormat(navigator.language, dax).format(new Date())
//     ),
//   1000
// );
