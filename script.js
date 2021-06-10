const cardHolderName = document.querySelector('.card-holder-name');
const cardNumber = document.querySelectorAll('.card-number input'); 
const form = document.querySelector('form');
const expiryDate = document.querySelector('.date')
const cvv = document.querySelector('.cvv')
const savedCard = document.querySelector('.saved-card-details');

function handleInput(e) {
  const input = e.target;
  if(input.nextElementSibling && input.value){
    if(e.target.value.length>=4){
      input.nextElementSibling.focus();
    }
  }
}


let data = []
let value = ''
function handlePaste(e) {
  const paste = e.clipboardData.getData('text');
  
  for (let i=0; i<4;i++){
    value += paste[i]
  }
  data.push(value)
  value = ''
  for (let i=4; i<8;i++){
    value += paste[i]
  }
  data.push(value)
  value = ''
  for (let i=8; i<12;i++){
    value += paste[i]
  }
  data.push(value)
  value = ''
  for (let i=12; i<16;i++){
    value +=paste[i]
  }
  data.push(value)
  console.log(data)
  cardNumber.forEach((number,index) => {
      number.value = data[index]
      if(number.nextElementSibling!==null){
        number.nextElementSibling.focus()
      }
  })
}

cardNumber[3].addEventListener('input', (e) => {
  if(data.length>0){
    e.target.value = data[3]
  }
  console.log(e.target.value)
})

cardNumber[0].addEventListener('paste', handlePaste)


form.addEventListener('input', handleInput)


let cardDetails;
form.addEventListener('submit', (e) => {
  e.preventDefault();
  cardDetails =  getCardDetails()
  cardDetails.push({
     cardHolderName: cardHolderName.value,
     cardNumber: `${data[0] || cardNumber[0].value}-${data[1] || cardNumber[1].value}-${data[2] || cardNumber[2].value}-${data[3] || cardNumber[3].value}`,
     expiryDate: expiryDate.value,
     cvv:cvv.value,
     id: Math.random()
  })
  // Adding cardDetails to Local Storage
  localStorage.setItem('cardDetails', JSON.stringify(cardDetails))

  // Showing list of saved card
  form.reset();
  getSaveCard();
})

function getCardDetails(){
  if(localStorage.getItem('cardDetails') === null) {
    cardDetails = []
  }
   else {
    cardDetails = JSON.parse(localStorage.getItem('cardDetails'))
   }
   return cardDetails
}


// Removing the Save Card:
function getSaveCard(){
cardDetails = JSON.parse(localStorage.getItem('cardDetails'));
savedCard.style.display= 'flex'
const cardTemplate = cardDetails && cardDetails.map(details => {
  return `<tr class='card-row' id=${details.id}><td>${details.cardHolderName}</td><td>${details.cardNumber}</td><td class='remove'>X</span></tr>`
})
console.log(cardTemplate)

savedCard.innerHTML = `<table border='1'>
  <caption>Saved Credit Cards</caption>
      <tr style='text-decoration:none'>
        <th>Holder Name</th>
        <th>Card Number</th>
      </tr>
      ${cardTemplate}
    </table>`
}

// Remove the Saved Card Details
  savedCard.addEventListener('click', (e) => {
    const card = e.target.parentNode;
    filterCard(card)
    e.target.parentNode.remove();
    savedCard.style.display = 'none';
  })


function filterCard(card){
  cardDetails = getCardDetails();

  const filteredCard = cardDetails.filter(cardDetail => cardDetail.id != card.id); 
  localStorage.setItem('cardDetails', JSON.stringify(filteredCard));
}
