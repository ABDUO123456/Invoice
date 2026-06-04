import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { 
  Printer, Plus, Trash2, Truck, Save, List, FileText, 
  ChevronRight, ArrowRight, CheckCircle2, Globe, ShieldCheck, 
  Zap, Menu, X, Phone, Mail, MapPin
} from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' or 'app'
  const [view, setView] = useState('editor'); // 'editor' or 'history'
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [invoiceData, setInvoiceData] = useState({
    id: Date.now(),
    number: '0001',
    date: new Date().toLocaleDateString('fr-FR'),
    client: {
      name: '',
      phone: ''
    },
    items: [
      { designation: '', qte: 1, pu: 0 }
    ],
    company: {
      name: 'اسم شركتك هنا',
      title: 'المنصب',
      phone: '+213 000 000 000',
      rc: '00/00-0000000A 00',
      activity: 'نشاط الشركة التجاري',
      address: 'عنوان الشركة بالتفصيل - المدينة'
    }
  });

  // Load data from localStorage
  useEffect(() => {
    const history = localStorage.getItem('invoice_history');
    if (history) {
      setSavedInvoices(JSON.parse(history));
    }
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const calculateTotal = (items = invoiceData.items) => {
    return items.reduce((acc, item) => acc + (item.qte * item.pu), 0);
  };

  const saveInvoice = () => {
    const newHistory = [invoiceData, ...savedInvoices.filter(inv => inv.id !== invoiceData.id)];
    setSavedInvoices(newHistory);
    localStorage.setItem('invoice_history', JSON.stringify(newHistory));
    alert('تم حفظ الفاتورة بنجاح');
  };

  const createNewInvoice = () => {
    setInvoiceData({
      ...invoiceData,
      id: Date.now(),
      number: (savedInvoices.length + 1).toString().padStart(4, '0'),
      date: new Date().toLocaleDateString('fr-FR'),
      items: [{ designation: '', qte: 1, pu: 0 }]
    });
    setView('editor');
  };

  const loadInvoice = (inv) => {
    setInvoiceData(inv);
    setView('editor');
  };

  const deleteInvoice = (id) => {
    const newHistory = savedInvoices.filter(inv => inv.id !== id);
    setSavedInvoices(newHistory);
    localStorage.setItem('invoice_history', JSON.stringify(newHistory));
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { designation: '', qte: 1, pu: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  // --- Components ---

  const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentPage('landing'); setIsOpen(false); }}>
              <div className="bg-[#bc2c24] p-1.5 rounded-lg text-white">
                <Truck size={24} />
              </div>
              <span className="text-xl font-bold text-slate-900">فاتورتي</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <button onClick={() => setCurrentPage('landing')} className="hover:text-[#bc2c24] transition">الرئيسية</button>
              <a href="#features" className="hover:text-[#bc2c24] transition">المميزات</a>
              <a href="#contact" className="hover:text-[#bc2c24] transition">اتصل بنا</a>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                {currentPage === 'landing' ? (
                  <button 
                    onClick={() => setCurrentPage('app')}
                    className="bg-[#bc2c24] text-white px-5 py-2 rounded-full font-bold hover:bg-[#a1251e] transition flex items-center gap-2"
                  >
                    ابدأ الآن <ArrowRight size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => setCurrentPage('landing')}
                    className="text-slate-600 font-medium hover:text-slate-900 transition"
                  >
                    العودة للموقع
                  </button>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4">
            <button 
              onClick={() => { setCurrentPage('landing'); setIsOpen(false); }}
              className="block w-full text-right p-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
            >
              الرئيسية
            </button>
            <a 
              href="#features" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-right p-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
            >
              المميزات
            </a>
            <a 
              href="#contact" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-right p-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
            >
              اتصل بنا
            </a>
            <div className="pt-2 border-t border-slate-100">
              {currentPage === 'landing' ? (
                <button 
                  onClick={() => { setCurrentPage('app'); setIsOpen(false); }}
                  className="w-full bg-[#bc2c24] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  ابدأ الآن <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  onClick={() => { setCurrentPage('landing'); setIsOpen(false); }}
                  className="w-full text-center py-3 text-slate-600 font-medium"
                >
                  العودة للموقع
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  };

  const LandingPage = () => (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-right">
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                أسهل طريقة لإنشاء <span className="text-[#bc2c24]">فواتير احترافية</span> لنشاطك التجاري
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                وفر وقتك وجهدك مع منصة "فاتورتي". قم بإنشاء وتسيير وطباعة فواتيرك في ثوانٍ معدودة وبكل احترافية.
              </p>
              <div className="flex flex-wrap gap-4 justify-end">
                <button 
                  onClick={() => setCurrentPage('app')}
                  className="bg-[#bc2c24] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#a1251e] shadow-lg shadow-[#bc2c24]/20 transition flex items-center gap-3"
                >
                  ابدأ الاستخدام مجاناً <ArrowRight size={22} />
                </button>
                <a 
                  href="#features"
                  className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition"
                >
                  اكتشف المميزات
                </a>
              </div>
              <div className="mt-10 flex items-center gap-6 justify-end text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={18} /> بدون اشتراك</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={18} /> سهل الاستخدام</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={18} /> طباعة فورية</div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#bc2c24]/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1000" 
                alt="Invoice App" 
                className="rounded-2xl shadow-2xl relative z-10 border border-slate-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">لماذا تختار منصة فاتورتي؟</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              لقد صممنا هذه المنصة لتكون الحل الأمثل لأصحاب المشاريع الصغيرة والمتوسطة في الجزائر.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap size={32} className="text-[#bc2c24]" />,
                title: "سرعة فائقة",
                desc: "أنشئ فاتورة كاملة في أقل من دقيقة واحدة مع إمكانية الحفظ والطباعة الفورية."
              },
              {
                icon: <ShieldCheck size={32} className="text-blue-600" />,
                title: "أمان وخصوصية",
                desc: "يتم حفظ بياناتك محلياً على متصفحك، مما يضمن خصوصية تامة لبياناتك وبيانات زبائنك."
              },
              {
                icon: <Globe size={32} className="text-green-600" />,
                title: "دعم اللغة العربية",
                desc: "واجهة مستخدم عربية بالكامل مصممة لتناسب احتياجات السوق المحلي والوطني."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:border-[#bc2c24]/30 hover:shadow-xl transition group">
                <div className="mb-6 bg-white w-16 h-16 flex items-center justify-center rounded-2xl shadow-sm group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#bc2c24] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black mb-2">+1000</div>
              <div className="text-sm opacity-80 uppercase tracking-wider">فاتورة يومية</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">+500</div>
              <div className="text-sm opacity-80 uppercase tracking-wider">زبون سعيد</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">100%</div>
              <div className="text-sm opacity-80 uppercase tracking-wider">مجاني تماماً</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">24/7</div>
              <div className="text-sm opacity-80 uppercase tracking-wider">دعم متواصل</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#bc2c24]/20 rounded-full blur-[100px]"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black mb-6 leading-tight">هل لديك أي استفسار أو اقتراح؟</h2>
                <p className="text-slate-400 text-lg mb-10">
                  نحن هنا لمساعدتك في تطوير نشاطك التجاري. تواصل معنا عبر أي من الوسائل التالية.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-800 p-3 rounded-lg"><Phone size={24} className="text-[#bc2c24]" /></div>
                    <div>
                      <p className="text-sm text-slate-500">اتصل بنا</p>
                      <p className="text-lg font-bold">+213 776 263 109</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-800 p-3 rounded-lg"><Mail size={24} className="text-[#bc2c24]" /></div>
                    <div>
                      <p className="text-sm text-slate-500">البريد الإلكتروني</p>
                      <p className="text-lg font-bold">contact@facturati.dz</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-800 p-3 rounded-lg"><MapPin size={24} className="text-[#bc2c24]" /></div>
                    <div>
                      <p className="text-sm text-slate-500">الموقع</p>
                      <p className="text-lg font-bold">الشلف، الجزائر</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl text-slate-900 shadow-2xl">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">الاسم الكامل</label>
                    <input type="text" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-[#bc2c24]/20 outline-none" placeholder="أدخل اسمك هنا" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">البريد الإلكتروني</label>
                    <input type="email" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-[#bc2c24]/20 outline-none" placeholder="example@mail.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">الرسالة</label>
                    <textarea className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-[#bc2c24]/20 outline-none h-32" placeholder="كيف يمكننا مساعدتك؟"></textarea>
                  </div>
                  <button className="w-full bg-[#bc2c24] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a1251e] transition shadow-lg shadow-[#bc2c24]/20">إرسال الرسالة</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-[#bc2c24] p-1.5 rounded-lg text-white">
              <Truck size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900">فاتورتي</span>
          </div>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            الحل الجزائري الأمثل لتسيير فواتير نشاطك التجاري بكل سهولة واحترافية.
          </p>
          <div className="flex justify-center gap-6 mb-8 text-slate-400">
            <Globe className="hover:text-[#bc2c24] cursor-pointer transition" />
            <Mail className="hover:text-[#bc2c24] cursor-pointer transition" />
            <Phone className="hover:text-[#bc2c24] cursor-pointer transition" />
          </div>
          <div className="text-sm text-slate-400">
            © 2026 فاتورتي. جميع الحقوق محفوظة. صُنع بكل حب في الجزائر 🇩🇿
          </div>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      <Navbar />
      
      {currentPage === 'landing' ? (
        <LandingPage />
      ) : (
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-slate-900 text-white p-6 no-print flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#bc2c24] p-2 rounded-lg">
                <Truck size={24} />
              </div>
              <h1 className="text-xl font-bold">لوحة التحكم</h1>
            </div>

            <nav className="flex flex-col gap-2">
              <button 
                onClick={() => setView('editor')}
                className={`flex items-center gap-3 p-3 rounded-lg transition ${view === 'editor' ? 'bg-[#bc2c24] text-white' : 'hover:bg-slate-800'}`}
              >
                <FileText size={20} /> إنشاء فاتورة
              </button>
              <button 
                onClick={() => setView('history')}
                className={`flex items-center gap-3 p-3 rounded-lg transition ${view === 'history' ? 'bg-[#bc2c24] text-white' : 'hover:bg-slate-800'}`}
              >
                <List size={20} /> سجل الفواتير
              </button>
            </nav>

            <div className="mt-auto">
              <div className="bg-slate-800 p-4 rounded-lg text-xs text-slate-400">
                النسخة 1.0.0 <br/>
                نظام تسيير محلي
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 h-screen overflow-y-auto p-4 md:p-8">
            
            {view === 'history' ? (
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-800">سجل الفواتير المسجلة</h2>
                  <button onClick={createNewInvoice} className="bg-[#bc2c24] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus size={20} /> فاتورة جديدة
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-4">رقم الفاتورة</th>
                        <th className="p-4">الزبون</th>
                        <th className="p-4">التاريخ</th>
                        <th className="p-4">المجموع الإجمالي</th>
                        <th className="p-4">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedInvoices.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-slate-400 italic">لا توجد فواتير مسجلة بعد</td>
                        </tr>
                      ) : (
                        savedInvoices.map((inv) => (
                          <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                            <td className="p-4 font-bold text-[#bc2c24]">#{inv.number}</td>
                            <td className="p-4">{inv.client.name}</td>
                            <td className="p-4">{inv.date}</td>
                            <td className="p-4 font-bold text-slate-900">{calculateTotal(inv.items).toLocaleString('fr-FR')} DZD</td>
                            <td className="p-4 flex gap-2 justify-end">
                              <button onClick={() => loadInvoice(inv)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <ChevronRight size={20} />
                              </button>
                              <button onClick={() => deleteInvoice(inv.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 size={20} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 pb-20">
                {/* Editor Side */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 no-print">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">تعديل البيانات</h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={saveInvoice}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        <Save size={18} /> حفظ
                      </button>
                      <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        <Printer size={18} /> طباعة
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">رقم الفاتورة</label>
                      <input 
                        type="text" 
                        value={invoiceData.number} 
                        onChange={(e) => setInvoiceData({...invoiceData, number: e.target.value})}
                        className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-[#bc2c24]/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">التاريخ</label>
                      <input 
                        type="text" 
                        value={invoiceData.date} 
                        onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                        className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-[#bc2c24]/20 outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 border-b pb-2">معلومات الزبون</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <input 
                        type="text" 
                        placeholder="اسم الزبون"
                        value={invoiceData.client.name} 
                        onChange={(e) => setInvoiceData({...invoiceData, client: {...invoiceData.client, name: e.target.value}})}
                        className="w-full border border-slate-200 rounded-lg p-2"
                      />
                      <input 
                        type="text" 
                        placeholder="رقم الهاتف"
                        value={invoiceData.client.phone} 
                        onChange={(e) => setInvoiceData({...invoiceData, client: {...invoiceData.client, phone: e.target.value}})}
                        className="w-full border border-slate-200 rounded-lg p-2"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-bold text-slate-400 uppercase border-b pb-2 flex-1">السلع / الخدمات</h3>
                      <button 
                        onClick={addItem}
                        className="flex items-center gap-1 text-green-600 font-bold text-xs hover:bg-green-50 px-2 py-1 rounded transition"
                      >
                        <Plus size={14} /> إضافة سطر
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {invoiceData.items.map((item, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                          <div className="flex justify-between items-center mb-3">
                            <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold">المنتج #{index + 1}</span>
                            <button 
                              onClick={() => removeItem(index)}
                              className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-md transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-1 font-bold">الكمية (Qté)</label>
                              <input 
                                type="number" 
                                value={item.qte} 
                                onChange={(e) => updateItem(index, 'qte', parseFloat(e.target.value) || 0)}
                                className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#bc2c24]/20 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-1 font-bold">السعر الوحدوي (P.U DZD)</label>
                              <input 
                                type="number" 
                                value={item.pu} 
                                onChange={(e) => updateItem(index, 'pu', parseFloat(e.target.value) || 0)}
                                className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#bc2c24]/20 outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 mb-1 font-bold">الوصف (Désignation)</label>
                            <textarea 
                              rows="2"
                              value={item.designation} 
                              onChange={(e) => updateItem(index, 'designation', e.target.value)}
                              className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#bc2c24]/20 outline-none resize-none"
                              placeholder="اكتب وصف المنتج هنا..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview Side (The actual template) */}
                <div className="invoice-container lg:w-[210mm] lg:h-[297mm] bg-white shadow-2xl overflow-hidden flex flex-col shrink-0 relative" ref={componentRef} style={{ direction: 'ltr' }}>
                  
                  {/* Header: Red background */}
                  <div className="bg-[#bc2c24] text-white p-8 flex justify-between items-center" style={{ WebkitPrintColorAdjust: 'exact' }}>
                    <div className="bg-white p-3 rounded-sm shadow-sm">
                      <Truck size={50} className="text-[#bc2c24]" />
                    </div>
                    <div className="text-right">
                      <h1 className="text-[32px] font-bold tracking-tight uppercase leading-none">{invoiceData.company.name}</h1>
                      <p className="text-[12px] mt-2 opacity-95 font-medium">{invoiceData.company.title} | {invoiceData.company.phone}</p>
                    </div>
                  </div>

                  {/* Company Meta: Light Gray bar */}
                  <div className="bg-[#f0f0f0] p-2 px-8 text-[10px] text-gray-700 flex flex-col items-end gap-0.5 border-b border-gray-200" style={{ WebkitPrintColorAdjust: 'exact' }}>
                    <div className="flex gap-2">
                      <span className="font-bold">N° Registre de Commerce :</span>
                      <span>{invoiceData.company.rc}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold">Activité :</span>
                      <span>{invoiceData.company.activity}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold">Adresse :</span>
                      <span>{invoiceData.company.address}</span>
                    </div>
                  </div>

                  {/* Client & Invoice Box */}
                  <div className="p-8 pt-10 flex justify-between items-start gap-10">
                    <div className="flex-1 border-l-[4px] border-[#bc2c24] bg-white p-4 shadow-sm min-h-[80px] flex flex-col justify-center">
                      <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">CLIENT :</p>
                      <h2 className="text-[18px] font-black text-gray-800 uppercase leading-tight">{invoiceData.client.name}</h2>
                      <p className="text-[12px] text-gray-600 mt-1 font-medium">Tél: {invoiceData.client.phone}</p>
                    </div>

                    <div className="flex-1 bg-[#bc2c24] text-white p-5 rounded-[12px] text-center shadow-md" style={{ WebkitPrintColorAdjust: 'exact' }}>
                      <h3 className="text-[16px] font-black uppercase tracking-wider">FACTURE N° {invoiceData.number}</h3>
                      <p className="text-[12px] opacity-90 mt-1 font-medium">Date : {invoiceData.date}</p>
                    </div>
                  </div>

                  {/* Detail label */}
                  <div className="px-8 mb-2">
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">DETAIL DE LA FACTURE</p>
                  </div>

                  {/* Table */}
                  <div className="px-8 flex-grow overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#bc2c24] text-white text-[10px] font-bold uppercase" style={{ WebkitPrintColorAdjust: 'exact' }}>
                          <th className="py-2 px-4 text-left border border-gray-300">DÉSIGNATION</th>
                          <th className="py-2 px-4 text-center border border-gray-300 w-16">QTÉ</th>
                          <th className="py-2 px-4 text-right border border-gray-300 w-32">P.U (DZD)</th>
                          <th className="py-2 px-4 text-right border border-gray-300 w-32">TOTAL (DZD)</th>
                        </tr>
                      </thead>
                      <tbody className="text-[12px]">
                        {invoiceData.items.map((item, index) => (
                          <tr key={index} className="text-gray-800 font-bold">
                            <td className="py-3 px-4 border border-gray-300">{item.designation}</td>
                            <td className="py-3 px-4 border border-gray-300 text-center font-black">{item.qte}</td>
                            <td className="py-3 px-4 border border-gray-300 text-right">{item.pu.toLocaleString('fr-FR', { minimumFractionDigits: 2 }).replace(',', '.')}</td>
                            <td className="py-3 px-4 border border-gray-300 text-right">{(item.qte * item.pu).toLocaleString('fr-FR', { minimumFractionDigits: 2 }).replace(',', '.')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Total Section */}
                    <div className="mt-2 flex justify-end">
                      <div className="flex items-stretch bg-[#bc2c24] text-white rounded-md overflow-hidden h-9 border border-[#bc2c24]" style={{ WebkitPrintColorAdjust: 'exact' }}>
                        <div className="px-4 flex items-center justify-center border-r border-white/20 min-w-[130px]">
                          <span className="font-bold uppercase text-[11px] tracking-tight">TOTAL GÉNÉRAL :</span>
                        </div>
                        <div className="px-6 bg-white flex items-center justify-end min-w-[180px]">
                          <span className="text-[#bc2c24] font-black text-[16px]">
                            {calculateTotal().toLocaleString('fr-FR', { minimumFractionDigits: 2 }).replace(/\s/g, ' ').replace(',', '.')} DZD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Signature and Stamp - Moved up closer to total */}
                    <div className="mt-10 grid grid-cols-2 gap-16 items-start">
                      <div className="border border-gray-100 rounded-sm p-3 h-28 flex flex-col justify-end">
                        <p className="text-[9px] text-gray-400 text-center italic font-bold uppercase">Signature du client</p>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-48 h-20 bg-gray-200 border border-dashed border-gray-300 rounded-sm flex items-center justify-center">
                          <span className="text-[10px] text-gray-400 uppercase font-bold">Cachet & Signature</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Bar stays at the bottom */}
                  <div className="mt-auto">
                    <div className="bg-[#bc2c24] text-white py-3 px-8 text-[8px] text-center font-bold uppercase tracking-tight" style={{ WebkitPrintColorAdjust: 'exact' }}>
                      {invoiceData.company.name} — {invoiceData.company.address} — Tél : {invoiceData.company.phone} | RC : {invoiceData.company.rc}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
