// ================================
// GALERIA DE PRODUTOS (Miniaturas)
// ================================
const thumbnails = document.querySelectorAll('.thumb-item img');
const productItems = document.querySelectorAll('.product-item');


thumbnails.forEach((thumb, index) => {
  thumb.addEventListener('click', () => {
    productItems.forEach(item => item.classList.remove('active'));
    productItems[index].classList.add('active');
  });
});

productItems[0].classList.add('active');

// ================================
// LIGHTBOX - AMPLIAR IMAGEM
// ================================
const productImages = document.querySelectorAll('.product-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-img');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const closeBtn = document.querySelector('.close');
const thumbnailImages = document.querySelectorAll('.thumb'); 

let currentIndex = 0;

function openLightbox(event) {
  event.stopPropagation();
  const clickedImage = event.target;
  currentIndex = Array.from(productImages).indexOf(clickedImage);
  updateLightboxImage();
  lightbox.style.display = 'flex';
}

function updateLightboxImage() {
  lightboxImage.src = productImages[currentIndex].src;
  thumbnailImages.forEach(thumb => thumb.classList.remove('active'));
  if (thumbnailImages[currentIndex]) {
    thumbnailImages[currentIndex].classList.add('active');
  }
}

function closeLightbox(event) {
  if (event.target === lightbox || event.target === closeBtn) {
    lightbox.style.display = 'none';
  }
}

function nextImage(event) {
  event.stopPropagation();
  currentIndex = (currentIndex + 1) % productImages.length;
  updateLightboxImage();
}

function prevImage(event) {
  event.stopPropagation();
  currentIndex = (currentIndex - 1 + productImages.length) % productImages.length;
  updateLightboxImage();
}

productImages.forEach(image => {
  image.addEventListener('click', openLightbox);
});

lightbox.addEventListener('click', closeLightbox);
if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
if (nextBtn) nextBtn.addEventListener('click', nextImage);
if (prevBtn) prevBtn.addEventListener('click', prevImage);

thumbnailImages.forEach((thumb, index) => {
  thumb.addEventListener('click', () => {
    currentIndex = index;
    updateLightboxImage();
  });
});

// ================================
// CARRINHO DE COMPRAS
// ================================
document.addEventListener("DOMContentLoaded", function () {
  const cartIcon = document.querySelector(".cart");
  const cartOverlay = document.querySelector(".cart-overlay");
  const closeCart = document.querySelector(".close-cart");
  const addToCartBtn = document.querySelector(".add-to-cart button");
  const quantityInput = document.getElementById("quantity");
  const cartItemsContainer = document.querySelector(".cart-items");
  const totalPriceElement = document.querySelector(".total-price");
  const cartCountElement = document.querySelector(".cart-count");
  const decreaseBtn = document.getElementById("decrease");
  const increaseBtn = document.getElementById("increase");
  const emptyCartMessage = document.querySelector(".empty-cart-message");
  const checkoutBtn = document.querySelector(".checkout-btn");
  const cartFooter = document.querySelector(".cart-footer");

  let cart = [];

  if (!addToCartBtn) {
    console.error("Erro: O botão de adicionar ao carrinho não foi encontrado no DOM.");
    return;
  }

  cartIcon?.addEventListener("click", function (event) {
    event.preventDefault();
    cartOverlay?.classList.toggle("active");
  });

  closeCart?.addEventListener("click", function () {
    cartOverlay?.classList.remove("active");
  });

  addToCartBtn.addEventListener("click", function () {
    const productNameElem = document.querySelector(".product-name");
    const productPriceElem = document.querySelector(".current-price");
    const productImageElem = document.querySelector(".product-images .product-item img");

    if (!productNameElem || !productPriceElem || !productImageElem) {
      console.error("Erro: Elementos do produto não encontrados!");
      return;
    }

    const productName = productNameElem.innerText;
    const productPrice = parseFloat(productPriceElem.innerText.replace("$", ""));
    const productImage = productImageElem.src;
    const quantity = parseInt(quantityInput.value);

    if (quantity < 1) {
      console.warn("Quantidade inválida!");
      return;
    }

    const existingProductIndex = cart.findIndex(item => item.name === productName);
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: quantity
      });
    }

    updateCart();
    updateCartCount();
  });

  function updateCart() {
    cartItemsContainer.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

      emptyCartMessage.style.display = "block";
      cartFooter.style.display = "none";
    } else {

      emptyCartMessage.style.display = "none";
      cartFooter.style.display = "block";

      cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <p>${item.name}</p>
            <p>$${item.price} x ${item.quantity} = <strong>$${(item.price * item.quantity).toFixed(2)}</strong></p>
          </div>
          <button class="remove-item" data-index="${index}"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64">
<path d="M 28 7 C 25.243 7 23 9.243 23 12 L 23 15 L 13 15 C 11.896 15 11 15.896 11 17 C 11 18.104 11.896 19 13 19 L 15.109375 19 L 16.792969 49.332031 C 16.970969 52.510031 19.600203 55 22.783203 55 L 41.216797 55 C 44.398797 55 47.029031 52.510031 47.207031 49.332031 L 48.890625 19 L 51 19 C 52.104 19 53 18.104 53 17 C 53 15.896 52.104 15 51 15 L 41 15 L 41 12 C 41 9.243 38.757 7 36 7 L 28 7 z M 28 11 L 36 11 C 36.552 11 37 11.449 37 12 L 37 15 L 27 15 L 27 12 C 27 11.449 27.448 11 28 11 z M 32 23.25 C 32.967 23.25 33.75 24.034 33.75 25 L 33.75 45 C 33.75 45.966 32.967 46.75 32 46.75 C 31.033 46.75 30.25 45.966 30.25 45 L 30.25 25 C 30.25 24.034 31.033 23.25 32 23.25 z M 40.007812 23.25 C 40.972813 23.284 41.728313 24.094547 41.695312 25.060547 L 40.998047 45.146484 C 40.965047 46.092484 40.190953 46.836937 39.251953 46.835938 C 39.230953 46.835938 39.210453 46.833984 39.189453 46.833984 C 38.224453 46.799984 37.468953 45.989438 37.501953 45.023438 L 38.197266 24.9375 C 38.231266 23.9725 39.039813 23.223 40.007812 23.25 z M 23.990234 23.251953 C 24.954234 23.228953 25.766781 23.973453 25.800781 24.939453 L 26.498047 45.025391 C 26.532047 45.991391 25.776547 46.801938 24.810547 46.835938 C 24.790547 46.835937 24.769047 46.835938 24.748047 46.835938 C 23.810047 46.835938 23.033 46.091484 23 45.146484 L 22.302734 25.060547 C 22.268734 24.094547 23.024234 23.285953 23.990234 23.251953 z"></path>
</svg>
        </button>
        `;

        cartItemsContainer.appendChild(cartItem);
      });

      totalPriceElement.innerText = `$${total.toFixed(2)}`;

      document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function () {
          const index = parseInt(this.getAttribute("data-index"));
          cart.splice(index, 1);
          updateCart();
          updateCartCount();
        });
      });
    }
  }

  function updateCartCount() {
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.innerText = totalItems;
    cartCountElement.style.visibility = totalItems > 0 ? "visible" : "hidden";
  }

  decreaseBtn?.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  increaseBtn?.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });


  updateCart();
});

// ================================
// MENU MOBILE
// ================================
const bntMenu = document.getElementById('bnt-menu');
const menu = document.getElementById('menu-mobile');
const overlay = document.getElementById('overlay-menu');


bntMenu.addEventListener('click', () => {
  menu.classList.add('Open');
});

menu.addEventListener('click', () => {
  menu.classList.remove('Open');
});
overlay.addEventListener('click', () => {
  menu.classList.remove('Open');
});

// ================================
// NAVEGAÇÃO ENTRE IMAGENS NO MOBILE
// ================================
document.addEventListener("DOMContentLoaded", function () {
  const productImg = Array.from(document.querySelectorAll('.product-item'));
  const nextMobile = document.getElementById('next-mobile');
  const prevMobile = document.getElementById('prev-mobile');

  let imageIndex = 0;

  function updateImageDisplay() {
    productImg.forEach((img, index) => {
      img.classList.remove('active');
    });
    productImg[imageIndex].classList.add('active');
  }

  function nextImage(event) {
    event.stopPropagation();
    imageIndex = (imageIndex + 1) % productImg.length;
    updateImageDisplay();
  }

  function prevImage(event) {
    event.stopPropagation();
    imageIndex = (imageIndex - 1 + productImg.length) % productImg.length;
    updateImageDisplay();
  }

  function checkScreenSize() {
    if (window.innerWidth <= 768) {
      if (nextMobile) nextMobile.addEventListener('click', nextImage);
      if (prevMobile) prevMobile.addEventListener('click', prevImage);
      if (productImg.length > 0) {
        productImg[0].classList.add('active');
      }
    }
  }

  checkScreenSize(); 
  window.addEventListener('resize', checkScreenSize);
});


