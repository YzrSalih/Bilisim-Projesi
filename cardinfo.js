// --- ÖDEME SAYFASI (odeme.html) için JS ---
document.addEventListener('DOMContentLoaded', () => {
	if (document.getElementById('paymentTotal')) {
		// LocalStorage'dan sepeti al
		const cart = JSON.parse(localStorage.getItem('myCS2Cart')) || [];
		let total = 0;
		cart.forEach(item => {
			total += item.price * item.quantity;
		});
		if (total === 0) {
			alert("Sepetiniz boş, ana sayfaya yönlendiriliyorsunuz.");
			window.location.href = 'index.html';
		}
		document.getElementById('paymentTotal').innerText = '₺ ' + total.toLocaleString('tr-TR');
	}
	const paymentForm = document.getElementById('paymentForm');
	if (paymentForm) {
		paymentForm.addEventListener('submit', function(e) {
			e.preventDefault();
			alert("Ödemeniz başarıyla alındı! Siparişiniz hazırlanıyor. 🎉");
			localStorage.removeItem('myCS2Cart');
			window.location.href = 'index.html';
		});
	}
});

function simulatePayment(methodName) {
	alert(methodName + " ile güvenli ödeme sayfasına yönlendiriliyorsunuz...");
	setTimeout(() => {
		if (methodName === 'PayPal') {
			window.location.href = "https://www.paypal.com/paypalme/steammarketdemo/100";
		} else {
			alert("Ödeme " + methodName + " ile başarıyla alındı!");
			localStorage.removeItem('myCS2Cart');
			window.location.href = 'index.html';
		}
	}, 1500);
}
document.addEventListener("DOMContentLoaded", function() {
	const navLinks = document.querySelectorAll("#main-nav .nav-link");
	const contentSections = document.querySelectorAll(".content-section");
	navLinks.forEach(link => {
		link.addEventListener("click", function(event) {
			event.preventDefault();
			const targetId = this.getAttribute("data-target");
			contentSections.forEach(section => {
				section.classList.remove("active");
			});
			navLinks.forEach(navLink => {
				navLink.classList.remove("active");
			});
			document.getElementById(targetId).classList.add("active");
			this.classList.add("active");
		});
	});
	const cartButton = document.querySelector('.cart-btn'); 
	const sidebar = document.getElementById('shoppingCartSidebar');
	const overlay = document.getElementById('cartOverlay');
	const closeBtn = document.querySelector('.close-cart-btn');
	function openCart() {
		sidebar.classList.add('active');
		overlay.classList.add('active');
	}
	function closeCart() {
		sidebar.classList.remove('active');
		overlay.classList.remove('active');
	}
	cartButton.addEventListener('click', function(e) {
		e.preventDefault();
		openCart();
	});
	closeBtn.addEventListener('click', closeCart);
	overlay.addEventListener('click', closeCart);
	let cart = JSON.parse(localStorage.getItem('myCS2Cart')) || [];
	const cartItemsWrapper = document.querySelector('.cart-items-container');
	const cartTotalElement = document.querySelector('.cart-total span:last-child');
	updateCartHTML();
	const addToCartButtons = document.querySelectorAll('.add-to-cart');
	addToCartButtons.forEach(button => {
		button.addEventListener('click', function() {
			const product = {
				id: this.getAttribute('data-id'),
				name: this.getAttribute('data-name'),
				price: parseFloat(this.getAttribute('data-price')),
				img: this.getAttribute('data-img'),
				quantity: 1
			};
			addToCart(product);
		});
	});
	function addToCart(product) {
		cart.push(product);
		saveCart();
		updateCartHTML();
	}
	function removeFromCart(productId) {
		const itemIndex = cart.findIndex(item => item.id === productId);
		const item = cart[itemIndex];
		if (item.quantity > 1) {
			item.quantity -= 1;
		} else {
			cart.splice(itemIndex, 1);
		}
		saveCart();
		updateCartHTML();
	}
	function saveCart() {
		localStorage.setItem('myCS2Cart', JSON.stringify(cart));
	}
	function updateCartHTML() {
		cartItemsWrapper.innerHTML = '';
		let totalPrice = 0;
		let totalCount = 0;
		if (cart.length === 0) {
			cartItemsWrapper.innerHTML = '<div style="text-align:center; color:#777; margin-top:20px;">Sepetiniz boş.</div>';
		}
		cart.forEach(item => {
			totalPrice += item.price * item.quantity;
			totalCount += item.quantity;
			const cartItem = document.createElement('div');
			cartItem.classList.add('cart-item');
			cartItem.innerHTML = `
				<div style="display:flex; align-items:center; margin-bottom:15px; border-bottom:1px solid #444; padding-bottom:10px;">
					<img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:5px; margin-right:10px;">
					<div style="flex-grow:1;">
						<h4 style="font-size:14px; color:white; margin:0;">
							<span style="color:#00ff96;">${item.quantity}x</span> ${item.name}
						</h4>
						<span style="color:#ccc; font-size:12px;">Birim: ₺ ${item.price.toLocaleString('tr-TR')}</span>
					</div>
					<button onclick="removeFromCart('${item.id}')" style="background:none; border:none; color:#ff4444; cursor:pointer; font-size:18px; padding:0 10px;">
						<i class="fas fa-minus-circle"></i>
					</button>
				</div>
			`;
			cartItemsWrapper.appendChild(cartItem);
		});
		cartTotalElement.innerText = '₺ ' + totalPrice.toLocaleString('tr-TR');
		const checkoutBtn = document.querySelector('.checkout-btn');
		if (checkoutBtn) {
			checkoutBtn.addEventListener('click', function() {
				if (!cart || cart.length === 0) {
					alert("Sepetiniz boş! Önce ürün ekleyin.");
					return;
				}
				window.location.href = 'odeme.html'; 
			});
		} else {
			console.error("HATA: 'Ödemeye Geç' butonu bulunamadı! HTML'deki class ismini kontrol edin.");
		}
		const navCartBtn = document.querySelector('.cart-btn');
		const navCartPriceSpan = document.querySelector('.nav-cart-price');
		if (navCartBtn && navCartPriceSpan) {
			if (totalPrice > 0) {
				navCartBtn.classList.add('has-items');
				navCartPriceSpan.innerText = '₺ ' + totalPrice.toLocaleString('tr-TR');
			} else {
				navCartBtn.classList.remove('has-items');
				navCartPriceSpan.innerText = '';
			}
		}
	}

// --- SEPETİ BOŞALT BUTONU (Onaysız - Direkt Siler) ---
const clearCartBtn = document.getElementById('clearCartBtn');

if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
        
        // 1. Sepet zaten boşsa hiçbir şey yapma
        if (cart.length === 0) {
            return; 
        }

        // 2. HİÇBİR ŞEY SORMADAN DİREKT SİL
        cart = []; // Sepet dizisini boşalt
        saveCart(); // LocalStorage'daki veriyi sil
        updateCartHTML(); // Ekranı güncelle (temizle)
        
    });
}
	const modal = document.getElementById('productModal');
	const modalOverlay = document.getElementById('productModalOverlay');
	const closeModalBtn = document.querySelector('.close-modal-btn');
	const productCards = document.querySelectorAll('.open-modal-trigger');
	productCards.forEach(card => {
		card.addEventListener('click', function(e) {
			if (e.target.closest('.add-to-cart')) {
				return; 
			}
			const img = this.getAttribute('data-img');
			const name = this.getAttribute('data-name');
			const price = this.getAttribute('data-price');
			const float = this.getAttribute('data-float') || 'Belirtilmemiş';
			const rarity = this.getAttribute('data-rarity') || 'Bilinmiyor';
			const pattern = this.getAttribute('data-pattern') || '-';
			document.getElementById('modalImage').src = img;
			document.getElementById('modalTitle').innerText = name;
			document.getElementById('modalPrice').innerText = '₺ ' + parseFloat(price).toLocaleString('tr-TR');
			document.getElementById('modalFloat').innerText = float;
			document.getElementById('modalRarity').innerText = rarity;
			document.getElementById('modalPattern').innerText = pattern;
			const modalBtn = document.getElementById('modalAddToCartBtn');
			modalBtn.onclick = function() {
				addToCart({
					id: card.getAttribute('data-id'),
					name: name,
					price: parseFloat(price),
					img: img,
					quantity: 1
				});
			};
			modal.classList.add('active');
			modalOverlay.classList.add('active');
		});
	});
	function closeProductModal() {
		modal.classList.remove('active');
		modalOverlay.classList.remove('active');
	}
	closeModalBtn.addEventListener('click', closeProductModal);
	modalOverlay.addEventListener('click', closeProductModal);
});
