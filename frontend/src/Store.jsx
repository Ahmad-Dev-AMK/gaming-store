import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';

const translations = {
  ar: {
    welcome: "مرحبا",
    search: "ابحث عن منتج...",
    cart: "سلة المشتريات",
    total: "المجموع",
    checkout: "إتمام الدفع",
    close: "إغلاق",
    clear_cart: "إفراغ السلة",
    clear_wishlist: "إفراغ المفضلة",
    all: "الكل",
    admin: "الإدارة",
    logout: "خروج",
    login: "دخول",
    sort_default: "ترتيب حسب الافتراضي",
    sort_low: "السعر: من الأرخص للأغلى",
    sort_high: "السعر: من الأغلى للأرخص",
    loading: "جاري تحميل المنتجات... ⏳",
    back: "🔙 العودة",
    stock: "المخزون المتوفر",
    add_to_cart: "أضف إلى السلة 🛒",
    popular: "🔥 الأكثر شعبية",
    empty_cart: "سلتك فارغة حالياً.",
    empty_wishlist: "لا يوجد منتجات في المفضلة حالياً.",
    no_results: "لا توجد منتجات مطابقة.",
    lang: "اللغة:",
    currency: "العملة:",
    footer: "جميع الحقوق محفوظة ل ahmad (AMK) 2026 | للتواصل مع المطور تيلجرام @AMK114",
    add_toast: "✅ تمت الإضافة إلى السلة",
    remove_toast: "🗑️ تمت إزالة المنتج من السلة",
    wish_add_toast: "❤️ تمت الإضافة للمفضلة",
    wish_remove_toast: "💔 تمت الإزالة من المفضلة",
    limit_toast: "⚠️ لا يمكن إضافة المزيد! المخزون محدود.",
    order_success: "🎉 تم تأكيد الطلب بنجاح!",
    login_required: "⚠️ يرجى تسجيل الدخول أولاً لإتمام الطلب!",
    order_error: "⚠️ حدث خطأ أثناء إتمام الطلب!",
  },
  en: {
    welcome: "Welcome",
    search: "Search for a product...",
    cart: "Shopping Cart",
    total: "Total",
    checkout: "Checkout",
    close: "Close",
    clear_cart: "Clear Cart",
    clear_wishlist: "Clear Wishlist",
    all: "All",
    admin: "Admin",
    logout: "Logout",
    login: "Login",
    sort_default: "Default Sort",
    sort_low: "Price: Low to High",
    sort_high: "Price: High to Low",
    loading: "Loading products... ⏳",
    back: "🔙 Back",
    stock: "Available Stock",
    add_to_cart: "Add to Cart 🛒",
    popular: "🔥 Most Popular",
    empty_cart: "Your cart is currently empty.",
    empty_wishlist: "No products in your wishlist.",
    no_results: "No matching products.",
    lang: "Language:",
    currency: "Currency:",
    footer: "All rights reserved to ahmad (AMK) 2026 | Contact developer on Telegram @AMK114",
    add_toast: "✅ Added to cart",
    remove_toast: "🗑️ Removed from cart",
    wish_add_toast: "❤️ Added to wishlist",
    wish_remove_toast: "💔 Removed from wishlist",
    limit_toast: "⚠️ Cannot add more! Stock is limited.",
    order_success: "🎉 Order confirmed successfully!",
    login_required: "⚠️ Please login first to checkout!",
    order_error: "⚠️ Error occurred during checkout!",
  },
  tr: {
    welcome: "Merhaba",
    search: "Ürün ara...",
    cart: "Alışveriş Sepeti",
    total: "Toplam",
    checkout: "Ödeme Yap",
    close: "Kapat",
    clear_cart: "Sepeti Boşalt",
    clear_wishlist: "Favorileri Temizle",
    all: "Tümü",
    admin: "Yönetici",
    logout: "Çıkış",
    login: "Giriş",
    sort_default: "Varsayılan Sıralama",
    sort_low: "Fiyat: Düşükten Yükseğe",
    sort_high: "Fiyat: Yüksekten Düşüğe",
    loading: "Ürünler yükleniyor... ⏳",
    back: "🔙 Geri",
    stock: "Mevcut Stok",
    add_to_cart: "Sepete Ekle 🛒",
    popular: "🔥 En Popüler",
    empty_cart: "Sepetiniz şu anda boş.",
    empty_wishlist: "Favorilerinizde ürün yok.",
    no_results: "Eşleşen ürün yok.",
    lang: "Dil:",
    currency: "Para Birimi:",
    footer: "Tüm hakları ahmad'a (AMK) aittir 2026 | Geliştirici ile iletişime geçin Telegram @AMK114",
    add_toast: "✅ Sepete eklendi",
    remove_toast: "🗑️ Sepetten çıkarıldı",
    wish_add_toast: "❤️ Favorilere eklendi",
    wish_remove_toast: "💔 Favorilerden çıkarıldı",
    limit_toast: "⚠️ Daha fazla eklenemez! Stok sınırlı.",
    order_success: "🎉 Sipariş başarıyla onaylandı!",
    login_required: "⚠️ Ödeme yapmak için lütfen önce giriş yapın!",
    order_error: "⚠️ Ödeme sırasında hata oluştu!",
  }
};

export default function Store() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // i18n & Currency State
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'ar');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const [rates, setRates] = useState({ USD: 1 });

  const t = translations[lang] || translations.ar;

  const navigate = useNavigate();
  const isStaff = localStorage.getItem('is_staff') === 'true';
  const isLoggedIn = !!localStorage.getItem('access_token');

  let username = '';
  if (isLoggedIn) {
    try {
      const decoded = jwtDecode(localStorage.getItem('access_token'));
      username = decoded.username || 'User';
    } catch (e) { }
  }

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products/')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => console.error(err));

    // Fetch Exchange Rates
    axios.get('https://rate-api.com/api/713c21b6cf5429cbd70f56bfbd6a14a9/latest?base=USD')
      .then(res => {
        if (res.data && res.data.rates) {
          setRates(res.data.rates);
        }
      }).catch(err => console.error("Rate API Error:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const getPrice = (usdPrice) => {
    const rate = rates[currency] || 1;
    return (usdPrice * rate).toFixed(2);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        showToast(t.limit_toast);
        return;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      if (product.stock > 0) {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    }
    showToast(t.add_toast);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    showToast(t.remove_toast);
  };

  const updateCartQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0 && newQuantity <= item.stock) {
          return { ...item, quantity: newQuantity };
        } else if (newQuantity > item.stock) {
          showToast(t.limit_toast);
        }
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (e, product) => {
    e.stopPropagation();
    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      showToast(t.wish_remove_toast);
    } else {
      setWishlist([...wishlist, product]);
      showToast(t.wish_add_toast);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    setShowWishlistOnly(false);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast(t.empty_cart);
      return;
    }

    const payload = {
      total_price: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
      items: cart.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    axios.post('http://127.0.0.1:8000/api/orders/', payload, {
      headers: isLoggedIn ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` } : {}
    })
      .then(() => {
        showToast(t.order_success);
        setCart([]);
        localStorage.removeItem('cart');
        setIsCartOpen(false);
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          showToast(t.login_required);
          navigate('/login');
        } else {
          showToast(t.order_error);
        }
      });
  };

  const getMockRating = (id) => (4 + (id % 10) / 10).toFixed(1);

  let filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (categoryFilter !== 'All') {
    filteredProducts = filteredProducts.filter(p => String(p.category_fk) === String(categoryFilter));
  }

  if (showWishlistOnly) {
    filteredProducts = filteredProducts.filter(p => wishlist.some(w => w.id === p.id));
  }

  if (sortOrder === 'low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const maxSales = Math.max(...products.map(p => p.sales_count || 0), 0);

  return (
    <div className="app-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="header" style={{ flexWrap: 'wrap', gap: '15px' }}>
        <div className="logo" onClick={() => {
          setSelectedProduct(null);
          setShowWishlistOnly(false);
        }} style={{ cursor: 'pointer' }}>
          Gaming Store
        </div>

        {isLoggedIn && username && (
          <div className="welcome-msg" style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>
            {t.welcome}, {username}!
          </div>
        )}

        <div className="controls" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={lang} onChange={e => setLang(e.target.value)} className="wishlist-toggle-btn" style={{ padding: '5px', borderRadius: '5px' }}>
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>

          <select value={currency} onChange={e => setCurrency(e.target.value)} className="wishlist-toggle-btn" style={{ padding: '5px', borderRadius: '5px' }}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="TRY">TRY</option>
            <option value="SAR">SAR</option>
            <option value="AED">AED</option>
            <option value="SYP">SYP</option>
          </select>

          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedProduct(null);
            }}
            className="search-bar"
          />

          {isLoggedIn ? (
            <>
              {isStaff && (
                <button className="wishlist-toggle-btn" onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255, 0, 170, 0.2)', borderColor: 'var(--neon-magenta)' }}>
                  ⚙️ {t.admin}
                </button>
              )}
              <button className="wishlist-toggle-btn" onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('is_staff');
                window.location.reload();
              }}>
                🚪 {t.logout}
              </button>
            </>
          ) : (
            <button className="wishlist-toggle-btn" onClick={() => navigate('/login')}>
              🔑 {t.login}
            </button>
          )}

          <button
            className={`wishlist-toggle-btn ${showWishlistOnly ? 'active' : ''}`}
            onClick={() => {
              setShowWishlistOnly(!showWishlistOnly);
              setSelectedProduct(null);
            }}
          >
            {showWishlistOnly ? `🔙 ${t.all}` : `❤️ (${wishlist.length})`}
          </button>

          <button className="cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
            🛒 ({cart.reduce((acc, item) => acc + item.quantity, 0)})
          </button>
        </div>
      </header>

      {!selectedProduct && (
        <div className="filters-bar">
          <div className="categories">
            <button
              className={`cat-btn ${categoryFilter === 'All' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('All')}
            >
              {t.all}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`cat-btn ${categoryFilter === cat.id ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-dropdown">
            <option value="default">{t.sort_default}</option>
            <option value="low">{t.sort_low}</option>
            <option value="high">{t.sort_high}</option>
          </select>
        </div>
      )}

      {showWishlistOnly && wishlist.length > 0 && !selectedProduct && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button className="delete-btn" onClick={clearWishlist}>{t.clear_wishlist}</button>
        </div>
      )}

      <main className="main-content" style={{ minHeight: '70vh' }}>
        {loading ? (
          <div className="loading">{t.loading}</div>
        ) : selectedProduct ? (
          <div className="product-details-view">
            <button className="back-btn" onClick={() => { setSelectedProduct(null); setActiveImage(null); }}>
              {t.back}
            </button>
            <div className="details-content">
              <div style={{ flex: 1 }}>
                <img src={activeImage || selectedProduct.image || selectedProduct.image_url || `https://loremflickr.com/400/300/computer,gaming?lock=${selectedProduct.id}`} alt={selectedProduct.name} style={{ width: '100%', borderRadius: '10px' }} />

                {selectedProduct.additional_images && selectedProduct.additional_images.length > 0 && (
                  <div className="product-gallery">
                    <img
                      src={selectedProduct.image || selectedProduct.image_url || `https://loremflickr.com/400/300/computer,gaming?lock=${selectedProduct.id}`}
                      className={`gallery-img ${!activeImage || activeImage === (selectedProduct.image || selectedProduct.image_url) ? 'active' : ''}`}
                      onClick={() => setActiveImage(selectedProduct.image || selectedProduct.image_url)}
                      alt="Main"
                    />
                    {selectedProduct.additional_images.map(imgObj => (
                      <img
                        key={imgObj.id}
                        src={imgObj.image}
                        className={`gallery-img ${activeImage === imgObj.image ? 'active' : ''}`}
                        onClick={() => setActiveImage(imgObj.image)}
                        alt="Gallery"
                      />
                    ))}
                  </div>
                )}

                {selectedProduct.video && (
                  <video src={selectedProduct.video} controls className="product-video" />
                )}
              </div>
              <div className="details-info">
                <div className="title-row">
                  <h2>{selectedProduct.name}</h2>
                  <button
                    className={`wishlist-icon ${wishlist.some(w => w.id === selectedProduct.id) ? 'active' : ''}`}
                    onClick={(e) => toggleWishlist(e, selectedProduct)}
                  >
                    {wishlist.some(w => w.id === selectedProduct.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="star-rating">
                  {'⭐'.repeat(Math.round(getMockRating(selectedProduct.id)))} ({getMockRating(selectedProduct.id)} / 5)
                </div>
                <p className="price">{getPrice(selectedProduct.price)} {currency}</p>
                <p className="stock">{t.stock}: {selectedProduct.stock}</p>
                <p className="description" style={{ whiteSpace: 'pre-line' }}>
                  {selectedProduct.description || "هذا المنتج من أفضل القطع المتوفرة في السوق حالياً."}
                </p>
                <button onClick={() => addToCart(selectedProduct)} className="add-btn large-btn">
                  {t.add_to_cart}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => {
              const isPopular = product.sales_count > 0 && product.sales_count === maxSales;
              return (
                <div key={product.id} className="product-card" onClick={() => {
                  setSelectedProduct(product);
                  axios.get(`http://127.0.0.1:8000/api/products/${product.id}/`).catch(console.error);
                }}>
                  {isPopular && <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--neon-magenta)', color: '#fff', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', zIndex: 2, boxShadow: '0 0 10px var(--neon-magenta)' }}>{t.popular}</div>}
                  <img src={product.image || product.image_url || `https://loremflickr.com/400/300/computer,gaming?lock=${product.id}`} alt={product.name} />
                  <div className="product-info">
                    <div className="title-row">
                      <h3>{product.name}</h3>
                      <button
                        className={`wishlist-icon ${wishlist.some(w => w.id === product.id) ? 'active' : ''}`}
                        onClick={(e) => toggleWishlist(e, product)}
                      >
                        {wishlist.some(w => w.id === product.id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                    <div className="star-rating">
                      {'⭐'.repeat(Math.round(getMockRating(product.id)))} ({getMockRating(product.id)})
                    </div>
                    <p className="price">{getPrice(product.price)} {currency}</p>
                    <p className="stock">{t.stock}: {product.stock}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="add-btn"
                    >
                      {t.add_to_cart}
                    </button>
                  </div>
                </div>
              )
            })}
            {filteredProducts.length === 0 && (
              <p className="no-results">
                {showWishlistOnly ? t.empty_wishlist : t.no_results}
              </p>
            )}
          </div>
        )}
      </main>

      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-content">
            <h2>{t.cart}</h2>
            {cart.length === 0 ? <p>{t.empty_cart}</p> : (
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <img src={item.image || item.image_url || `https://loremflickr.com/400/300/computer,gaming?lock=${item.id}`} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{item.name}</span>
                        <span style={{ color: 'var(--neon-cyan)' }}>{getPrice(item.price * item.quantity)} {currency}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id)} style={{ marginInlineEnd: 'auto' }}>🗑️</button>
                        <button className="qty-btn" onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                        <span>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="cart-footer">
              <h3>{t.total}: {getPrice(cartTotal)} {currency}</h3>
              <div className="cart-actions">
                <button className="close-btn" onClick={() => setIsCartOpen(false)}>{t.close}</button>
                {cart.length > 0 && <button className="delete-btn" onClick={clearCart}>{t.clear_cart}</button>}
                <button className="checkout-btn" onClick={handleCheckout}>{t.checkout}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      <footer style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid var(--glass-border)', marginTop: '20px', color: 'var(--text-secondary)' }}>
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}
