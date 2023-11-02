import { formatNumber } from './lib/helpers.js';
import { createCartLine, showCartContent } from './lib/ui.js';

const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];

/** Bæta vöru í körfu */
function addProductToCart(product, quantity) {
  // Hér þarf að finna `<tbody>` í töflu og setja `cartLine` inn í það
  const cartFylki = document.querySelectorAll('.table');
  const cart = cartFylki[1];

  if (!cart) {
    console.warn('fann ekki .cart');
    return;
  }
  
  // TODO hér þarf að athuga hvort lína fyrir vöruna sé þegar til
  function findCartLineByProductID(cart, productId) {
    const cartItems = cart.querySelectorAll('rt[data-cart-prduct-id]');
    for(const cartItem of cartItems) {
      const itemProductId = parseInt(cartItem.getAttribute('data-cart-product-id'));
      if (itemProductId === productId){
        return cartItem;
      }
    }
    return null;
  }

  const matchingCartItem =findCartLineByProductID(cart, product.id);

  if(matchingCartItem){
    const quantityCell = matchingCartItem.querySelector('.qunatity');
    if(quantityCell){
      const currentQuantity = parseInt(quantityCell.textContent);
      quantityCell.textContent = (currentQuantity + quantity);
      updateCartLineTotal(matchingCartItem);
    }
  }else {
    const cartLine = createCartLine(product, quantity);
    cart.appendChild(cartLine);
  }

  function updateCartLineTotal(cartItem) {
    const priceCell = cartItem.querySelector('.price span');
    const quantityCell = cartItem.querySelector('.quantity');
    const totalCell = cartItem.querySelector('.total span');

    if(priceCell && quantityCell && totalCell) {
      const priceValue = parseFloat(priceCell.textContent.trim().replace('ISK', '').replace(/[,\s.]/g, ''));
      const itemQuantity = parseFloat(quantityCell.textContent);
      const updatedTotal = priceValue * itemQuantity;
      totalCell.textContent = formatNumber(updatedTotal);
    }

    updateCartLineTotal();

    
    showCartContent(true);
  }
 

  // Sýna efni körfu
  showCartContent(true);

  // TODO sýna/uppfæra samtölu körfu
}

function submitHandler(event) {
  // Komum í veg fyrir að form submiti
  event.preventDefault();
  
  // Finnum næsta element sem er `<tr>`
  const parent = event.target.closest('tr')

  // Það er með attribute sem tiltekur auðkenni vöru, t.d. `data-product-id="1"`
  const productId = Number.parseInt(parent.dataset.productId);

  // Finnum vöru með þessu productId
  const product = products.find((i) => i.id === productId);

  // TODO hér þarf að finna fjölda sem á að bæta við körfu með því að athuga
  // á input
  const quantityInput = parent.querySelector('input[type="number"]');
  const quantity = Number.parseInt(quantityInput.value);
  console.log(quantity);

  // Bætum vöru í körfu (hér væri gott að bæta við athugun á því að varan sé til)
  addProductToCart(product, quantity);
}

// Finna öll form með class="add"
const addToCartForms = document.querySelectorAll('.add')

// Ítra í gegnum þau sem fylki (`querySelectorAll` skilar NodeList)
for (const form of Array.from(addToCartForms)) {
  // Bæta submit event listener við hvert
  form.addEventListener('submit', submitHandler);
}


// TODO bæta við event handler á form sem submittar pöntun

const formfylki = document.querySelectorAll('form');
const form = formfylki[3];
const gangaFraKaupumButton = form.querySelector('button');

gangaFraKaupumButton?.addEventListener('click', gangaFraKaupum)

function gangaFraKaupum(event){
  event.preventDefault();
  const kvittun = document.querySelector('.receipt');
  kvittun?.classList.remove('hidden');
}



