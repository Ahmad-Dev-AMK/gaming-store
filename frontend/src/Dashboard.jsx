import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const translations = {
  ar: {
    loading: "جاري تحميل البيانات... ⏳",
    back_to_store: "⬅️ العودة للمتجر",
    admin_dashboard: "لوحة تحكم الإدارة",
    analytics: "الإحصائيات",
    products: "المنتجات",
    categories: "الأقسام",
    orders: "الطلبات",
    most_visited: "👁️ أكثر منتج زيارة",
    visits: "زيارة",
    none: "لا يوجد",
    most_sold: "🛒 أكثر منتج مبيعاً",
    orders_count: "طلب",
    login_history: "سجل دخول المستخدمين التفصيلي",
    user: "المستخدم",
    browser: "المتصفح",
    device: "الجهاز",
    country: "الدولة",
    city: "المدينة",
    login_time: "وقت الدخول",
    unknown: "غير معروف",
    not_logged_in: "لم يقم بتسجيل الدخول بعد",
    manage_products: "إدارة المنتجات",
    add_product: "➕ إضافة منتج",
    product_name: "اسم المنتج",
    price: "السعر",
    stock: "المخزون",
    product_details: "تفاصيل المنتج",
    img_url_optional: "رابط الصورة (اختياري)",
    main_img: "صورة رئيسية",
    extra_imgs: "صور إضافية",
    product_video: "فيديو المنتج",
    choose_category: "اختر القسم",
    save: "حفظ",
    cancel: "إلغاء",
    image: "صورة",
    name: "الاسم",
    actions: "إجراءات",
    edit: "✏️ تعديل",
    delete: "❌ حذف",
    manage_categories: "إدارة الأقسام",
    add_category: "➕ إضافة قسم",
    category_name: "اسم القسم",
    incoming_orders: "الطلبات الواردة",
    order_id: "رقم الطلب",
    order_date: "تاريخ الطلب",
    total_amount: "المبلغ الإجمالي",
    products_list: "المنتجات",
    error_fill_fields: "تأكد من إدخال جميع الحقول بشكل صحيح",
    error_save_category: "خطأ في حفظ القسم",
    confirm_delete_product: "متأكد من الحذف؟",
    confirm_delete_category: "هل أنت متأكد من حذف هذا القسم؟ سيؤدي هذا إلى حذف جميع المنتجات المرتبطة به نهائياً.",
    error_delete_category: "حدث خطأ أثناء حذف القسم."
  },
  en: {
    loading: "Loading data... ⏳",
    back_to_store: "⬅️ Back to Store",
    admin_dashboard: "Admin Dashboard",
    analytics: "Analytics",
    products: "Products",
    categories: "Categories",
    orders: "Orders",
    most_visited: "👁️ Most Visited Product",
    visits: "visits",
    none: "None",
    most_sold: "🛒 Best Selling Product",
    orders_count: "orders",
    login_history: "Detailed User Login History",
    user: "User",
    browser: "Browser",
    device: "Device",
    country: "Country",
    city: "City",
    login_time: "Login Time",
    unknown: "Unknown",
    not_logged_in: "Has not logged in yet",
    manage_products: "Manage Products",
    add_product: "➕ Add Product",
    product_name: "Product Name",
    price: "Price",
    stock: "Stock",
    product_details: "Product Details",
    img_url_optional: "Image URL (Optional)",
    main_img: "Main Image",
    extra_imgs: "Additional Images",
    product_video: "Product Video",
    choose_category: "Choose Category",
    save: "Save",
    cancel: "Cancel",
    image: "Image",
    name: "Name",
    actions: "Actions",
    edit: "✏️ Edit",
    delete: "❌ Delete",
    manage_categories: "Manage Categories",
    add_category: "➕ Add Category",
    category_name: "Category Name",
    incoming_orders: "Incoming Orders",
    order_id: "Order ID",
    order_date: "Order Date",
    total_amount: "Total Amount",
    products_list: "Products",
    error_fill_fields: "Ensure all fields are correctly filled",
    error_save_category: "Error saving category",
    confirm_delete_product: "Are you sure you want to delete?",
    confirm_delete_category: "Are you sure you want to delete this category? This will permanently delete all associated products.",
    error_delete_category: "Error deleting category."
  },
  tr: {
    loading: "Veriler yükleniyor... ⏳",
    back_to_store: "⬅️ Mağazaya Dön",
    admin_dashboard: "Yönetici Paneli",
    analytics: "Analitik",
    products: "Ürünler",
    categories: "Kategoriler",
    orders: "Siparişler",
    most_visited: "👁️ En Çok Ziyaret Edilen Ürün",
    visits: "ziyaret",
    none: "Yok",
    most_sold: "🛒 En Çok Satan Ürün",
    orders_count: "sipariş",
    login_history: "Detaylı Kullanıcı Giriş Geçmişi",
    user: "Kullanıcı",
    browser: "Tarayıcı",
    device: "Cihaz",
    country: "Ülke",
    city: "Şehir",
    login_time: "Giriş Zamanı",
    unknown: "Bilinmeyen",
    not_logged_in: "Henüz giriş yapmadı",
    manage_products: "Ürünleri Yönet",
    add_product: "➕ Ürün Ekle",
    product_name: "Ürün Adı",
    price: "Fiyat",
    stock: "Stok",
    product_details: "Ürün Detayları",
    img_url_optional: "Resim URL (İsteğe Bağlı)",
    main_img: "Ana Resim",
    extra_imgs: "Ek Resimler",
    product_video: "Ürün Videosu",
    choose_category: "Kategori Seç",
    save: "Kaydet",
    cancel: "İptal",
    image: "Resim",
    name: "Ad",
    actions: "İşlemler",
    edit: "✏️ Düzenle",
    delete: "❌ Sil",
    manage_categories: "Kategorileri Yönet",
    add_category: "➕ Kategori Ekle",
    category_name: "Kategori Adı",
    incoming_orders: "Gelen Siparişler",
    order_id: "Sipariş ID",
    order_date: "Sipariş Tarihi",
    total_amount: "Toplam Tutar",
    products_list: "Ürünler",
    error_fill_fields: "Tüm alanların doğru doldurulduğundan emin olun",
    error_save_category: "Kategori kaydedilirken hata oluştu",
    confirm_delete_product: "Silmek istediğinize emin misiniz?",
    confirm_delete_category: "Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem bağlantılı tüm ürünleri kalıcı olarak silecektir.",
    error_delete_category: "Kategori silinirken hata oluştu."
  }
};

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const navigate = useNavigate();

  const [lang, setLang] = useState(localStorage.getItem('lang') || 'ar');
  const t = translations[lang] || translations.ar;

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const fetchData = async () => {
    try {
      const [uRes, pRes, cRes, oRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/admin/analytics/'),
        axios.get('http://127.0.0.1:8000/api/products/'),
        axios.get('http://127.0.0.1:8000/api/categories/'),
        axios.get('http://127.0.0.1:8000/api/orders/')
      ]);
      setUsers(uRes.data);
      setProducts(pRes.data);
      setCategories(cRes.data);
      setOrders(oRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isStaff = localStorage.getItem('is_staff') === 'true';
    if (!isStaff) {
      navigate('/');
      return;
    }
    fetchData();
  }, [navigate]);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editingProduct.name);
      formData.append('price', editingProduct.price);
      formData.append('stock', editingProduct.stock);
      formData.append('category_fk', editingProduct.category_fk);
      if (editingProduct.description) formData.append('description', editingProduct.description);
      if (editingProduct.image_url) formData.append('image_url', editingProduct.image_url);
      if (editingProduct.image_file) formData.append('image', editingProduct.image_file);
      if (editingProduct.video_file) formData.append('video', editingProduct.video_file);
      if (editingProduct.additional_images) {
        for (let i = 0; i < editingProduct.additional_images.length; i++) {
          formData.append('additional_images', editingProduct.additional_images[i]);
        }
      }
      
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editingProduct.id) {
        await axios.put(`http://127.0.0.1:8000/api/products/${editingProduct.id}/`, formData, config);
      } else {
        await axios.post('http://127.0.0.1:8000/api/products/', formData, config);
      }
      setEditingProduct(null);
      fetchData();
    } catch(err) { console.error(err); alert(t.error_fill_fields); }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory.id) {
        await axios.put(`http://127.0.0.1:8000/api/categories/${editingCategory.id}/`, editingCategory);
      } else {
        await axios.post('http://127.0.0.1:8000/api/categories/', editingCategory);
      }
      setEditingCategory(null);
      fetchData();
    } catch(err) { console.error(err); alert(t.error_save_category); }
  };

  const deleteProduct = async (id) => {
    if(window.confirm(t.confirm_delete_product)) {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`);
      fetchData();
    }
  };

  const deleteCategory = async (id) => {
    if(window.confirm(t.confirm_delete_category)) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/categories/${id}/`);
        fetchData();
      } catch (err) {
        console.error(err);
        alert(t.error_delete_category);
      }
    }
  };

  if (loading) return <div className="loading">{t.loading}</div>;

  const mostViewedProduct = [...products].sort((a,b) => (b.views_count||0) - (a.views_count||0))[0];
  const mostOrderedProduct = [...products].sort((a,b) => (b.sales_count||0) - (a.sales_count||0))[0];

  return (
    <div className="app-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: '18px' }}>
            {t.back_to_store}
          </div>
          <h2 style={{ color: 'var(--neon-magenta)', textShadow: '0 0 10px rgba(255, 0, 170, 0.5)' }}>{t.admin_dashboard}</h2>
          <select value={lang} onChange={e => setLang(e.target.value)} className="wishlist-toggle-btn" style={{padding: '5px', borderRadius: '5px'}}>
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', width: '100%', overflowX: 'auto' }}>
          <button className={`cat-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>{t.analytics}</button>
          <button className={`cat-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>{t.products}</button>
          <button className={`cat-btn ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>{t.categories}</button>
          <button className={`cat-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>{t.orders}</button>
        </div>
      </header>
      
      <main className="main-content product-details-view" style={{ overflowX: 'auto', minHeight: '60vh' }}>
        {activeTab === 'analytics' && (
          <div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px', padding: '20px', background: 'rgba(0,0,0,0.5)', borderRadius: '15px', border: '1px solid var(--neon-cyan)' }}>
                <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '10px' }}>{t.most_visited}</h4>
                {mostViewedProduct && mostViewedProduct.views_count > 0 ? (
                  <p>{mostViewedProduct.name} - ({mostViewedProduct.views_count} {t.visits})</p>
                ) : <p>{t.none}</p>}
              </div>
              <div style={{ flex: 1, minWidth: '250px', padding: '20px', background: 'rgba(0,0,0,0.5)', borderRadius: '15px', border: '1px solid var(--neon-magenta)' }}>
                <h4 style={{ color: 'var(--neon-magenta)', marginBottom: '10px' }}>{t.most_sold}</h4>
                {mostOrderedProduct && mostOrderedProduct.sales_count > 0 ? (
                  <p>{mostOrderedProduct.name} - ({mostOrderedProduct.sales_count} {t.orders_count})</p>
                ) : <p>{t.none}</p>}
              </div>
            </div>

            <h3 style={{ color: 'var(--neon-cyan)', marginBottom: '20px' }}>{t.login_history}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0, 243, 255, 0.3)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '15px' }}>{t.user}</th>
                  <th style={{ padding: '15px' }}>IP</th>
                  <th style={{ padding: '15px' }}>{t.browser}</th>
                  <th style={{ padding: '15px' }}>{t.device}</th>
                  <th style={{ padding: '15px' }}>{t.country}</th>
                  <th style={{ padding: '15px' }}>{t.city}</th>
                  <th style={{ padding: '15px' }}>{t.login_time}</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  user.login_history.length > 0 ? user.login_history.map((history, idx) => (
                    <tr key={`${user.id}-${history.id}`} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.3s' }}>
                      <td style={{ padding: '15px', color: 'var(--text-main)' }}>{idx === 0 ? user.username : ''}</td>
                      <td style={{ padding: '15px', color: 'var(--neon-cyan)' }}>{history.ip_address}</td>
                      <td style={{ padding: '15px' }}>{history.browser || t.unknown}</td>
                      <td style={{ padding: '15px' }}>{history.device || 'Desktop'}</td>
                      <td style={{ padding: '15px', color: 'var(--neon-magenta)' }}>{history.country || t.unknown}</td>
                      <td style={{ padding: '15px' }}>{history.city || '-'}</td>
                      <td style={{ padding: '15px' }}>{new Date(history.login_timestamp).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</td>
                    </tr>
                  )) : (
                    <tr key={`empty-${user.id}`} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '15px', color: 'var(--text-main)' }}>{user.username}</td>
                      <td style={{ padding: '15px', color: 'var(--text-muted)' }} colSpan="6">{t.not_logged_in}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--neon-cyan)' }}>{t.manage_products}</h3>
              <button className="add-btn" onClick={() => setEditingProduct({ name: '', price: '', stock: '', description: '', image_url: '', image_file: null, video_file: null, additional_images: [], category_fk: categories[0]?.id || '' })}>
                {t.add_product}
              </button>
            </div>
            
            {editingProduct && (
              <form onSubmit={handleSaveProduct} style={{ background: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                <input required className="search-bar" placeholder={t.product_name} value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                <input required className="search-bar" type="number" step="0.01" placeholder={t.price} value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} />
                <input required className="search-bar" type="number" placeholder={t.stock} value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: e.target.value})} />
                <textarea className="search-bar" placeholder={t.product_details} value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} />
                <input className="search-bar" placeholder={t.img_url_optional} value={editingProduct.image_url || ''} onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})} style={{ width: '48%' }} />
                <div style={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.main_img}</label>
                  <input type="file" className="search-bar" accept="image/*" onChange={e => setEditingProduct({...editingProduct, image_file: e.target.files[0]})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)' }} />
                </div>
                <div style={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.extra_imgs}</label>
                  <input type="file" multiple className="search-bar" accept="image/*" onChange={e => setEditingProduct({...editingProduct, additional_images: e.target.files})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)' }} />
                </div>
                <div style={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.product_video}</label>
                  <input type="file" className="search-bar" accept="video/*" onChange={e => setEditingProduct({...editingProduct, video_file: e.target.files[0]})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)' }} />
                </div>
                <select required className="sort-dropdown" value={editingProduct.category_fk} onChange={e => setEditingProduct({...editingProduct, category_fk: e.target.value})}>
                  <option value="" disabled>{t.choose_category}</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
                  <button type="submit" className="add-btn">{t.save}</button>
                  <button type="button" className="close-btn" onClick={() => setEditingProduct(null)}>{t.cancel}</button>
                </div>
              </form>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0, 243, 255, 0.3)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '15px' }}>{t.image}</th>
                  <th style={{ padding: '15px' }}>{t.name}</th>
                  <th style={{ padding: '15px' }}>{t.price}</th>
                  <th style={{ padding: '15px' }}>{t.stock}</th>
                  <th style={{ padding: '15px' }}>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '15px' }}><img src={p.image || p.image_url} alt="img" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}/></td>
                    <td style={{ padding: '15px', color: 'var(--text-main)' }}>{p.name}</td>
                    <td style={{ padding: '15px', color: 'var(--neon-cyan)' }}>${p.price}</td>
                    <td style={{ padding: '15px' }}>{p.stock}</td>
                    <td style={{ padding: '15px' }}>
                      <button onClick={() => setEditingProduct(p)} style={{ background: 'transparent', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', margin: '0 10px' }}>{t.edit}</button>
                      <button onClick={() => deleteProduct(p.id)} style={{ background: 'transparent', border: 'none', color: 'var(--neon-magenta)', cursor: 'pointer' }}>{t.delete}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--neon-cyan)' }}>{t.manage_categories}</h3>
              <button className="add-btn" onClick={() => setEditingCategory({ name: '' })}>
                {t.add_category}
              </button>
            </div>
            
            {editingCategory && (
              <form onSubmit={handleSaveCategory} style={{ background: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '15px' }}>
                <input required className="search-bar" placeholder={t.category_name} value={editingCategory.name} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} style={{ flex: 1 }} />
                <button type="submit" className="add-btn">{t.save}</button>
                <button type="button" className="close-btn" onClick={() => setEditingCategory(null)}>{t.cancel}</button>
              </form>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0, 243, 255, 0.3)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '15px' }}>ID</th>
                  <th style={{ padding: '15px' }}>{t.name}</th>
                  <th style={{ padding: '15px' }}>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '15px', color: 'var(--neon-cyan)' }}>{c.id}</td>
                    <td style={{ padding: '15px', color: 'var(--text-main)' }}>{c.name}</td>
                    <td style={{ padding: '15px' }}>
                      <button onClick={() => setEditingCategory(c)} style={{ background: 'transparent', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', margin: '0 10px' }}>{t.edit}</button>
                      <button onClick={() => deleteCategory(c.id)} style={{ background: 'transparent', border: 'none', color: 'var(--neon-magenta)', cursor: 'pointer' }}>{t.delete}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h3 style={{ color: 'var(--neon-cyan)', marginBottom: '20px' }}>{t.incoming_orders}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0, 243, 255, 0.3)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '15px' }}>{t.order_id}</th>
                  <th style={{ padding: '15px' }}>{t.order_date}</th>
                  <th style={{ padding: '15px' }}>{t.total_amount}</th>
                  <th style={{ padding: '15px' }}>{t.products_list}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '15px', color: 'var(--neon-cyan)' }}>#{o.id}</td>
                    <td style={{ padding: '15px' }}>{new Date(o.created_at).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</td>
                    <td style={{ padding: '15px', color: 'var(--neon-magenta)' }}>${o.total_price}</td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {o.items.map(item => {
                          const p = products.find(prod => prod.id === item.product);
                          return (
                            <li key={item.id} style={{ color: 'var(--text-muted)' }}>
                              {p ? p.name : `Product ${item.product}`} (x{item.quantity}) - ${item.price}
                            </li>
                          );
                        })}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
