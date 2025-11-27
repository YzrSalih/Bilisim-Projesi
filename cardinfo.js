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
	const navLinks = document.querySelectorAll(".category-nav .nav-link");
	const contentSections = document.querySelectorAll(".content-section");
	
	// Sayfa yüklendiğinde bıçak sayfasını varsayılan olarak aktif yap
	function setDefaultActiveSection() {
		// Tüm section'ları pasif yap
		contentSections.forEach(section => {
			section.classList.remove("active");
		});
		navLinks.forEach(navLink => {
			navLink.classList.remove("active");
		});
		
		// Bıçak sayfasını aktif yap
		const knivesSection = document.getElementById("knives-content");
		const knivesNavLink = document.querySelector('.nav-link[data-target="knives-content"]');
		
		if (knivesSection && knivesNavLink) {
			knivesSection.classList.add("active");
			knivesNavLink.classList.add("active");
		}
	}
	
	// Sayfa yüklendiğinde varsayılan section'ı aktif yap
	setDefaultActiveSection();
	
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
	// Global event listener for add-to-cart buttons (includes dynamically added ones)
	document.addEventListener('click', function(e) {
		if (e.target.closest('.add-to-cart') || e.target.closest('.eklemebtn')) {
			e.preventDefault();
			const button = e.target.closest('.add-to-cart') || e.target.closest('.eklemebtn');
			
			const product = {
				id: button.getAttribute('data-id'),
				name: button.getAttribute('data-name'),
				price: parseFloat(button.getAttribute('data-price')),
				img: button.getAttribute('data-img'),
				quantity: 1
			};
			
			// Validation
			if (!product.id || !product.name || !product.price || !product.img) {
				console.error('Ürün bilgileri eksik:', product);
				return;
			}
			
			addToCart(product);
		}
	});

    // Global event listener for Product Cards (Modal + Animation)
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.item-card');
        if (card && !e.target.closest('.add-to-cart')) {
            // 1. Grow Animation
            card.classList.add('click-grow');
            setTimeout(() => {
                card.classList.remove('click-grow');
            }, 200);

            // 2. Open Modal
            const img = card.getAttribute('data-img');
            const name = card.getAttribute('data-name');
            const price = card.getAttribute('data-price');
            const float = card.getAttribute('data-float') || 'Belirtilmemiş';
            const rarity = card.getAttribute('data-rarity') || 'Bilinmiyor';
            const pattern = card.getAttribute('data-pattern') || '-';

            const modal = document.getElementById('productModal');
            const modalOverlay = document.getElementById('productModalOverlay');
            
            if (modal && modalOverlay) {
                document.getElementById('modalImage').src = img;
                document.getElementById('modalTitle').innerText = name;
                document.getElementById('modalPrice').innerText = '₺ ' + parseFloat(price).toLocaleString('tr-TR');
                document.getElementById('modalFloat').innerText = float;
                document.getElementById('modalRarity').innerText = rarity;
                document.getElementById('modalPattern').innerText = pattern;
                
                const modalBtn = document.getElementById('modalAddToCartBtn');
                if (modalBtn) {
                    modalBtn.onclick = function() {
                        addToCart({
                            id: card.getAttribute('data-id'),
                            name: name,
                            price: parseFloat(price),
                            img: img,
                            quantity: 1
                        });
                    };
                }

                modal.classList.add('active');
                modalOverlay.classList.add('active');
            }
        }
    });
	function addToCart(product) {
		// Aynı ürün sepette var mı kontrol et
		const existingItemIndex = cart.findIndex(item => item.id === product.id);
		
		if (existingItemIndex !== -1) {
			// Ürün zaten sepette varsa miktarını artır
			cart[existingItemIndex].quantity += 1;
		} else {
			// Ürün sepette yoksa yeni olarak ekle
			cart.push(product);
		}
		
		saveCart();
		updateCartHTML();
		
		// Görsel geri bildirim - butonun yanında kısa süre "✓" göster
		showAddToCartFeedback(product.name);
		
		// Başarı mesajı (isteğe bağlı)
		console.log('Ürün sepete eklendi:', product.name);
	}
	
	function showAddToCartFeedback(productName) {
		// Kısa bir bildirim göster
		const notification = document.createElement('div');
		notification.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: linear-gradient(135deg, #00ff96, #00cc7a);
			color: #000;
			padding: 12px 20px;
			border-radius: 8px;
			font-weight: bold;
			font-size: 14px;
			z-index: 10000;
			box-shadow: 0 4px 15px rgba(0, 255, 150, 0.3);
			animation: slideIn 0.3s ease-out;
		`;
		notification.innerHTML = `<i class="fas fa-check-circle"></i> ${productName} sepete eklendi!`;
		
		document.body.appendChild(notification);
		
		// 2 saniye sonra kaldır
		setTimeout(() => {
			notification.style.animation = 'slideOut 0.3s ease-out';
			setTimeout(() => {
				if (notification.parentNode) {
					notification.parentNode.removeChild(notification);
				}
			}, 300);
		}, 2000);
	}
	function removeFromCart(productId) {
		const itemIndex = cart.findIndex(item => item.id === productId);
		
		// Ürün bulunamazsa işlemi durdur
		if (itemIndex === -1) {
			console.warn('Ürün sepette bulunamadı:', productId);
			return;
		}
		
		const item = cart[itemIndex];
		
		// Eğer ürünün miktarı 1'den fazlaysa, miktarını azalt
		if (item.quantity > 1) {
			item.quantity -= 1;
		} else {
			// Eğer miktar 1 ise, ürünü sepetten tamamen çıkar
			cart.splice(itemIndex, 1);
		}
		
		// Değişiklikleri kaydet ve ekranı güncelle
		saveCart();
		updateCartHTML();
		
		// Başarı mesajı (isteğe bağlı)
		console.log('Ürün sepetten çıkarıldı/azaltıldı:', productId);
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
			
			// HTML içeriği
			cartItem.innerHTML = `
				<div style="display:flex; align-items:center; gap:10px; padding:12px; border-radius:8px; background-color:rgba(255,255,255,0.05); margin-bottom:10px;">
					<img src="${item.img}" style="width:55px; height:55px; object-fit:cover; border-radius:8px; border: 2px solid #333;">
					<div style="flex-grow:1;">
						<h4 style="font-size:13px; color:white; margin:0 0 4px 0; font-weight:600;">
							${item.name}
						</h4>
						<div style="display:flex; justify-content:space-between; align-items:center;">
							<span style="color:#00ff96; font-weight:bold; font-size:12px;">
								${item.quantity}x ₺${item.price.toLocaleString('tr-TR')}
							</span>
							<span style="color:#fff; font-weight:bold; font-size:13px;">
								₺${(item.price * item.quantity).toLocaleString('tr-TR')}
							</span>
						</div>
					</div>
					<div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
						<button class="add-item-btn" data-item-id="${item.id}" style="background:#00ff96; border:none; color:#000; cursor:pointer; font-size:12px; padding:4px 8px; border-radius:4px; font-weight:bold;" title="Ürün Ekle">
							<i class="fas fa-plus"></i>
						</button>
						<button class="remove-item-btn" data-item-id="${item.id}" title="Ürün Çıkar">
							<i class="fas fa-minus"></i>
						</button>
					</div>
				</div>
			`;
			
			// Eksi butonuna event listener ekle
			const removeBtn = cartItem.querySelector('.remove-item-btn');
			removeBtn.addEventListener('click', function() {
				const itemId = this.getAttribute('data-item-id');
				removeFromCart(itemId);
			});
			
			// Artı butonuna event listener ekle
			const addBtn = cartItem.querySelector('.add-item-btn');
			addBtn.addEventListener('click', function() {
				const itemId = this.getAttribute('data-item-id');
				// Mevcut ürünü bulup bir adet daha ekle
				const existingItem = cart.find(cartItem => cartItem.id === itemId);
				if (existingItem) {
					addToCart({
						id: existingItem.id,
						name: existingItem.name,
						price: existingItem.price,
						img: existingItem.img,
						quantity: 1
					});
				}
			});
			
			// Hover efektleri
			removeBtn.addEventListener('mouseenter', function() {
				this.style.backgroundColor = 'rgba(255, 68, 68, 0.2)';
				this.style.transform = 'scale(1.1)';
			});
			
			removeBtn.addEventListener('mouseleave', function() {
				this.style.backgroundColor = 'rgba(255, 68, 68, 0.1)';
				this.style.transform = 'scale(1)';
			});
			
			addBtn.addEventListener('mouseenter', function() {
				this.style.backgroundColor = '#00cc7a';
				this.style.transform = 'scale(1.1)';
			});
			
			addBtn.addEventListener('mouseleave', function() {
				this.style.backgroundColor = '#00ff96';
				this.style.transform = 'scale(1)';
			});
			
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
	// Modal opening logic moved to global delegation
	function closeProductModal() {
		modal.classList.remove('active');
		modalOverlay.classList.remove('active');
	}
	closeModalBtn.addEventListener('click', closeProductModal);
	modalOverlay.addEventListener('click', closeProductModal);
});

// --- HIZLI SAT ÖZELLİĞİ ---
document.addEventListener('DOMContentLoaded', () => {
	// Hızlı Sat butonuna event listener ekle
	const fastSellBtn = document.querySelector('.fastsell-btn');
	if (fastSellBtn) {
		fastSellBtn.addEventListener('click', function(e) {
			e.preventDefault();
			
			// Steam inventory simulation
			const userSkins = [
				{ name: "AK-47 | Redline", condition: "Field-Tested", price: 2450.00 },
				{ name: "M4A4 | Asiimov", condition: "Battle-Scarred", price: 1850.00 },
				{ name: "AWP | Lightning Strike", condition: "Factory New", price: 3200.00 },
				{ name: "Glock-18 | Water Elemental", condition: "Minimal Wear", price: 890.00 },
				{ name: "USP-S | Kill Confirmed", condition: "Field-Tested", price: 2100.00 }
			];
			
			// Random skin selection for demo
			const randomSkin = userSkins[Math.floor(Math.random() * userSkins.length)];
			
			// Show fast sell modal
			showFastSellModal(randomSkin);
		});
	}
});

function showFastSellModal(skin) {
	// Modal HTML'i oluştur
	const modalHTML = `
		<div id="fastSellModal" class="fast-sell-modal">
			<div class="fast-sell-overlay"></div>
			<div class="fast-sell-content">
				<div class="fast-sell-header">
					<h2><i class="fas fa-bolt"></i> Hızlı Sat</h2>
					<button class="close-fast-sell">&times;</button>
				</div>
				<div class="fast-sell-body">
					<div class="skin-preview">
						<div class="skin-info">
							<h3>${skin.name}</h3>
							<p class="condition">Durum: ${skin.condition}</p>
							<div class="price-section">
								<div class="market-price">
									<span>Market Fiyatı: ₺${skin.price.toLocaleString('tr-TR')}</span>
								</div>
								<div class="instant-price">
									<span>Anında Sat: ₺${(skin.price * 0.85).toLocaleString('tr-TR')}</span>
									<small>(Market fiyatının %85'i)</small>
								</div>
							</div>
						</div>
					</div>
					<div class="sell-actions">
						<button class="instant-sell-btn">
							<i class="fas fa-lightning-bolt"></i>
							Anında Sat (₺${(skin.price * 0.85).toLocaleString('tr-TR')})
						</button>
						<button class="market-sell-btn">
							<i class="fas fa-store"></i>
							Market'e Koy (₺${skin.price.toLocaleString('tr-TR')})
						</button>
					</div>
					<div class="fast-sell-info">
						<p><i class="fas fa-info-circle"></i> Hızlı satışta para anında cüzdanınıza yatar.</p>
						<p><i class="fas fa-clock"></i> Market satışı daha yüksek fiyat ama daha uzun sürer.</p>
					</div>
				</div>
			</div>
		</div>
	`;
	
	// Modal'ı body'e ekle
	document.body.insertAdjacentHTML('beforeend', modalHTML);
	
	// Modal event listeners
	const modal = document.getElementById('fastSellModal');
	const closeBtn = document.querySelector('.close-fast-sell');
	const overlay = document.querySelector('.fast-sell-overlay');
	const instantSellBtn = document.querySelector('.instant-sell-btn');
	const marketSellBtn = document.querySelector('.market-sell-btn');
	
	// Close modal functions
	const closeFastSellModal = () => {
		modal.remove();
	};
	
	closeBtn.addEventListener('click', closeFastSellModal);
	overlay.addEventListener('click', closeFastSellModal);
	
	// Sell actions
	instantSellBtn.addEventListener('click', () => {
		alert(`✅ ${skin.name} başarıyla ₺${(skin.price * 0.85).toLocaleString('tr-TR')} karşılığında satıldı!\n💰 Para cüzdanınıza yatırıldı.`);
		closeFastSellModal();
	});
	
	marketSellBtn.addEventListener('click', () => {
		alert(`📈 ${skin.name} market'e ₺${skin.price.toLocaleString('tr-TR')} fiyatıyla listelendi!\n⏰ Alıcı bulunduğunda bilgilendirileceksiniz.`);
		closeFastSellModal();
	});
}

// Global variable to store fetched products
let allProductsData = {};

// Render Products Function
async function fetchAndRenderProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        allProductsData = await response.json();
        renderGrid(allProductsData);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderGrid(productsToRender) {
    // Clear all grids first
    document.querySelectorAll('.item-grid').forEach(grid => grid.innerHTML = '');

    for (const [sectionId, items] of Object.entries(productsToRender)) {
        const gridId = sectionId.split('-')[0] + '-grid';
        const grid = document.getElementById(gridId);
        if (!grid) continue;

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card open-modal-trigger';
            card.setAttribute('data-id', item.id);
            card.setAttribute('data-name', item.name);
            card.setAttribute('data-price', item.price);
            card.setAttribute('data-img', item.img);
            card.setAttribute('data-float', item.float);
            card.setAttribute('data-rarity', item.rarity);
            card.setAttribute('data-pattern', item.pattern);
            // Add category for filtering if needed
            card.setAttribute('data-category', item.category); 

            card.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="item-card-info">
                    <h3>${item.name}</h3>
                    <p>₺ ${item.price.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <button class="eklemebtn add-to-cart" 
                            data-id="${item.id}" 
                            data-name="${item.name}" 
                            data-price="${item.price}" 
                            data-img="${item.img}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// Filter Logic
document.addEventListener('DOMContentLoaded', () => {
    const filterBtn = document.querySelector('.filter-apply-button');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            applyFilters();
        });
    }
});

function applyFilters() {
    if (Object.keys(allProductsData).length === 0) return;

    // 1. Get Filter Values
    const minPriceInput = document.querySelectorAll('.fiyat-kapsayici input')[0];
    const maxPriceInput = document.querySelectorAll('.fiyat-kapsayici input')[1];
    
    // Parse price inputs (remove currency symbol and dots, replace comma with dot)
    const parsePrice = (str) => {
        if (!str) return 0;
        return parseFloat(str.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    };

    const minPrice = parsePrice(minPriceInput.value);
    const maxPrice = parsePrice(maxPriceInput.value);

    // Get selected categories (checkboxes)
    // Map the labels to condition names
    const categoryCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]:checked');
    const selectedConditions = Array.from(categoryCheckboxes).map(cb => cb.parentNode.textContent.trim());

    // Get sort order
    const sortSelect = document.querySelector('select[name="siralama"]');
    const sortValue = sortSelect ? sortSelect.value : 'fiyat-dusuk';

    // Helper to get condition from float
    const getCondition = (floatVal) => {
        const f = parseFloat(floatVal);
        if (f >= 0.00 && f <= 0.07) return 'Factory New';
        if (f > 0.07 && f <= 0.15) return 'Minimal Wear';
        if (f > 0.15 && f <= 0.38) return 'Field Testing'; // Matches HTML label
        if (f > 0.38 && f <= 0.45) return 'Well Worn';
        if (f > 0.45 && f <= 1.00) return 'Battle Scared'; // Matches HTML label
        return 'Unknown';
    };

    // 2. Filter Data
    let filteredData = {};

    for (const [sectionId, items] of Object.entries(allProductsData)) {
        let filteredItems = items.filter(item => {
            // Price Filter
            if (maxPrice > 0) {
                if (item.price < minPrice || item.price > maxPrice) return false;
            } else if (minPrice > 0) {
                 if (item.price < minPrice) return false;
            }

            // Category/Condition Filter
            if (selectedConditions.length > 0) {
                const itemCondition = getCondition(item.float);
                // Check if the calculated condition matches any selected checkbox label
                // Also check rarity/name just in case user meant that
                const matchesCondition = selectedConditions.includes(itemCondition);
                
                if (!matchesCondition) return false;
            }

            return true;
        });

        // 3. Sort Data
        filteredItems.sort((a, b) => {
            if (sortValue === 'fiyat-dusuk') {
                return a.price - b.price;
            } else if (sortValue === 'fiyat-yuksek') {
                return b.price - a.price;
            }
            return 0;
        });

        if (filteredItems.length > 0) {
            filteredData[sectionId] = filteredItems;
        }
    }

    // 4. Render Filtered Data
    renderGrid(filteredData);
    console.log('Filters applied', { minPrice, maxPrice, selectedCategories, sortValue });
}

// Call fetchAndRenderProducts on load
document.addEventListener("DOMContentLoaded", function() {
    fetchAndRenderProducts();
    console.log('Fetching products from API...');
});



// Fallback: Eğer hiçbir section aktif değilse, bıçak sayfasını aktif yap
document.addEventListener('DOMContentLoaded', () => {
	setTimeout(() => {
		const activeSection = document.querySelector('.content-section.active');
		if (!activeSection) {
			console.log('Hiçbir section aktif değil, bıçak sayfasını varsayılan olarak açıyorum...');
			const knivesSection = document.getElementById("knives-content");
			const knivesNavLink = document.querySelector('.nav-link[data-target="knives-content"]');
			
			if (knivesSection && knivesNavLink) {
				knivesSection.classList.add("active");
				knivesNavLink.classList.add("active");
			}
		}
	}, 500);
});
