'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const timestampOf1Day= new Date(1970,1,2)-new Date(1970,1,1);
console.log(timestampOf1Day);
const yesterday=(new Date())-timestampOf1Day;
console.log(yesterday);
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    yesterday,
    new Date(),
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
    '2022-08-07T18:49:59.371Z',
    yesterday,
  ],
  currency: 'USD',
  locale: 'en-US',
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

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMain = document.querySelector('.main');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.submit-btn ');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.username');
const inputLoginPin = document.querySelector('.user-pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

const LogoutTimer=function(){
  let time=30;
  let timer=setInterval(function(){
    const min=String(Math.trunc(time/60)).padStart(2,0);
    const sec=String(time%60).padStart(2,0);
    labelTimer.textContent=`${min}:${sec}`;

    if(time===0){
      clearInterval(timer);
      containerMain.style.opacity = 0;
    }

    time--;

  },1000);

  return timer;
}
//////////////////

const formatDaysPassed=function(date){
  const calcdaysPassed=function(date2, date1){
    return Math.round((date2-date1)/ (1000*60*60*24));
  
  }

  // const now =new Date();
  const daysPassed=calcdaysPassed((new Date()),date);
  // const daysPassed=calcdaysPassed((new Date),currentAccount.movements.movementsDates);
  console.log(daysPassed);
  if(daysPassed===0){
    return 'Today';
  }
    
  else if(daysPassed===1){
    return 'Yesterday';
  } 
    
  else if(daysPassed<=2){
    return `${daysPassed} Ago`;
  } 
    
  else{
    let day = (date.getDate() + "").padStart(2, 0) ;
    let month = (date.getMonth() + 1 + "").padStart(2, 0);
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


}


const displayMovements = function (acc, sort = false) {

  containerMovements.innerHTML = '';
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const date = new Date(acc.movementsDates[i]);
    const displayDate=formatDaysPassed(date);

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov}\$</div>
      </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  })
}

// displayMovements(account1.movements);

const computeBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0)
  labelBalance.textContent = `${acc.balance}\$`
}
computeBalance(account1);
/////////////////////////

const calculateSummary = function (movements) {

  const deposits = movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${deposits}\$`

  const withdrawals = movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = `${Math.abs(withdrawals)}\$`

  const interest = movements.filter(mov => mov > 0)
    .map(deposit => deposit * 1.2 / 100)
    .filter(interest => interest > 1)
    .reduce((acc, cur) => acc + cur);

  labelSumInterest.textContent = `${interest}\$`;
}

////////////////////////////////////////////


// console.log(` ${date}/${month}/${year}`);
// console.log(labelDate);
////////////////////////
const createUserName = function (acc) {
  acc.forEach(function (account) {
    account.userName = account.owner.toLowerCase().split(' ').map((names) => names[0]).join('');
  })

}
createUserName(accounts);
console.log(accounts);


///////////////////////

const showUI = function (acc) {
  //Movements
  displayMovements(acc);
  //Compute Balance
  computeBalance(acc);
  //Showing UI
  containerMain.style.opacity = 100;
  //Summary

  let now = new Date();
// let day=now.getDay();
let date = (now.getDate() + "").padStart(2, 0);
let month = (now.getMonth() + 1 + "").padStart(2, 0);
let year = now.getFullYear();
labelDate.innerHTML = `  ${date}/${month}/${year}`;

  calculateSummary(acc.movements);
}
///// ///////

let currentAccount ,timer;
////Fake Logged In
// currentAccount = account1;
// showUI(currentAccount);
// containerMain.style.opacity = 100;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  
  currentAccount = accounts.find((acc) => {
    return acc.userName == inputLoginUsername.value;
    // console.log(acc);
  })
  if (currentAccount?.pin == Number(inputLoginPin.value)) {

    showUI(currentAccount);
    // LogoutTimer();
    if(timer){
      clearInterval(timer);
    }
    timer=LogoutTimer();
  }
})
//////////////

// btnTransfer.addEventListener('click',function(){
//   transferAccount=accounts.find(acc=>acc.userName===inputTransferTo.value);
//   transferAccount.movements.push(inputTransferAmount);
//   displayResults();
// })

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferAccount = accounts.find(acc => acc.userName === inputTransferTo.value);
  // console.log(transferAccount);

  inputTransferAmount.value = inputTransferTo.value = "";
  if (amount > 0 && amount <= currentAccount.balance && transferAccount && transferAccount?.userName !== currentAccount.userName) {

    console.log('VALID');
    transferAccount.movements.push(amount);
    currentAccount.movements.push(-(amount));
    currentAccount.movementsDates.push(new Date().toISOString());
    transferAccount.movements.push(new Date().toISOString());
    showUI(currentAccount);
  }

});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    
    currentAccount.movementsDates.push(new Date().toISOString());
    showUI(currentAccount);

  };
  inputLoanAmount.value = '';
})

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (currentAccount.userName === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(acc => acc.userName == currentAccount.userName);
    console.log(index);
    accounts.splice(index, 1);
    containerMain.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";

  }
  // const user = accounts.find((acc) => {
  //   return acc.userName == inputCloseUsername.value;
  // })
  // if (user?.pin == Number(inputClosePin.value)){
  //   console.log(user);
  // }
})

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})



//////////////
