import React, { useState, useRef, useMemo } from 'react';
// Import Icons
import { 
  LayoutDashboard, FileText, Database, Users, BarChart2, Settings, LogOut, 
  User, Bell, Search, Plus, MoreHorizontal, Paperclip, Calendar as CalendarIcon, 
  Upload, CheckCircle, Lock, Mail, Activity, X, MapPin, Save, Shield, Target, PieChart, Layers
} from 'lucide-react';
// Import Recharts
import { 
  PieChart as RechartsPie, Pie, Cell, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Label
} from 'recharts';
// Import DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Import XLSX
import * as XLSX from 'xlsx';

// รายชื่ออำเภอในนครศรีธรรมราช
const nakhonDistricts = ['Mueang', 'Thung Song', 'Tha Sala', 'Pak Phanang', 'Sichon', 'Ron Phibun', 'Cha-uat', 'Lan Saka'];

// =========================================
// 1. GLOBAL MOCK DATABASE (ข้อมูล 20 คน)
// =========================================
const initialPatients = [
  { id: "PT-0001", name: "สมชาย รักดี", age: 22, gender: "ชาย", score: 18, risk: "High", district: "Mueang", monthStr: "Oct", date: "10/10/2024", follow: "24/10/2024" },
  { id: "PT-0002", name: "สมศรี มีสุข", age: 16, gender: "หญิง", score: 12, risk: "Moderate", district: "Lan Saka", monthStr: "Apr", date: "15/04/2024", follow: "29/04/2024" },
  { id: "PT-0003", name: "มาลี สว่าง", age: 18, gender: "หญิง", score: 5, risk: "Low", district: "Cha-uat", monthStr: "Jul", date: "23/07/2024", follow: "06/08/2024" },
  { id: "PT-0004", name: "อนงค์ ทองแท้", age: 28, gender: "หญิง", score: 16, risk: "High", district: "Mueang", monthStr: "Jan", date: "08/01/2024", follow: "22/01/2024" },
  { id: "PT-0005", name: "วันดี ศรีเมือง", age: 17, gender: "หญิง", score: 8, risk: "Low", district: "Pak Phanang", monthStr: "Oct", date: "15/10/2024", follow: "29/10/2024" },
  { id: "PT-0006", name: "กาญจนา ใจบุญ", age: 16, gender: "หญิง", score: 11, risk: "Moderate", district: "Tha Sala", monthStr: "Jun", date: "28/06/2024", follow: "12/07/2024" },
  { id: "PT-0007", name: "วีระ ศักดิ์สิทธิ์", age: 20, gender: "ชาย", score: 4, risk: "Low", district: "Sichon", monthStr: "Nov", date: "23/11/2024", follow: "07/12/2024" },
  { id: "PT-0008", name: "ประเสริฐ เจริญ", age: 58, gender: "ชาย", score: 15, risk: "High", district: "Thung Song", monthStr: "Oct", date: "20/10/2024", follow: "03/11/2024" },
  { id: "PT-0009", name: "ยุพิน ถิ่นใต้", age: 60, gender: "หญิง", score: 7, risk: "Low", district: "Lan Saka", monthStr: "Jan", date: "22/01/2024", follow: "05/02/2024" },
  { id: "PT-0010", name: "นภา พาสุข", age: 17, gender: "หญิง", score: 20, risk: "High", district: "Cha-uat", monthStr: "May", date: "19/05/2024", follow: "02/06/2024" },
  { id: "PT-0011", name: "วิไลลักษณ์ ภักดี", age: 14, gender: "หญิง", score: 14, risk: "Moderate", district: "Ron Phibun", monthStr: "Dec", date: "19/12/2024", follow: "02/01/2025" },
  { id: "PT-0012", name: "ธนพล คนดี", age: 30, gender: "ชาย", score: 6, risk: "Low", district: "Sichon", monthStr: "Aug", date: "01/08/2024", follow: "15/08/2024" },
  { id: "PT-0013", name: "รัตนา พาพร", age: 43, gender: "หญิง", score: 19, risk: "High", district: "Ron Phibun", monthStr: "Nov", date: "10/11/2024", follow: "24/11/2024" },
  { id: "PT-0014", name: "สุจิตรา นารี", age: 29, gender: "หญิง", score: 10, risk: "Moderate", district: "Pak Phanang", monthStr: "May", date: "05/05/2024", follow: "19/05/2024" },
  { id: "PT-0015", name: "บุญธรรม นำชัย", age: 68, gender: "ชาย", score: 13, risk: "Moderate", district: "Sichon", monthStr: "Dec", date: "07/12/2024", follow: "21/12/2024" },
  { id: "PT-0016", name: "สมศักดิ์ มั่นคง", age: 31, gender: "ชาย", score: 3, risk: "Low", district: "Lan Saka", monthStr: "Jul", date: "14/07/2024", follow: "28/07/2024" },
  { id: "PT-0017", name: "พรทิพย์ สุวรรณ", age: 34, gender: "หญิง", score: 17, risk: "High", district: "Tha Sala", monthStr: "Oct", date: "14/10/2024", follow: "28/10/2024" },
  { id: "PT-0018", name: "ด.ช. ก้องเกียรติ", age: 13, gender: "ชาย", score: 9, risk: "Low", district: "Thung Song", monthStr: "Jun", date: "07/06/2024", follow: "21/06/2024" },
  { id: "PT-0019", name: "จุฑามาศ สุขใส", age: 35, gender: "หญิง", score: 15, risk: "High", district: "Pak Phanang", monthStr: "Dec", date: "21/12/2024", follow: "04/01/2025" },
  { id: "PT-0020", name: "นิกร วงศ์งาม", age: 45, gender: "ชาย", score: 11, risk: "Moderate", district: "Mueang", monthStr: "Mar", date: "10/03/2024", follow: "24/03/2024" }
];

// =========================================
// 2. MAIN APPLICATION COMPONENT
// =========================================
const DepressionPredictionApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [patients, setPatients] = useState(initialPatients);

  const showToast = (message) => {
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 3500);
  };

  const handleImportData = async (importedData) => {
    // โค้ด Import ข้อมูล (ทำงานเหมือนเดิม)
    showToast("กำลังประมวลผลและสร้างข้อมูลสมมุติ...");
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const parsedData = importedData.map((row) => {
      const normalizedRow = {};
      Object.keys(row).forEach(key => { normalizedRow[key.toLowerCase().trim()] = row[key]; });
      
      const scoreVal = parseInt(normalizedRow['score'] || normalizedRow['คะแนน'] || normalizedRow['phq9'] || normalizedRow['life_stress_score']) || Math.floor(Math.random() * 28);
      const rawGender = normalizedRow['gender'] || normalizedRow['เพศ'] || normalizedRow['sex'];
      let genderVal = (rawGender && (String(rawGender).includes('ชาย') || String(rawGender).toLowerCase() === 'm')) ? 'ชาย' : 'หญิง';
      const ageVal = parseInt(normalizedRow['age'] || normalizedRow['อายุ']) || Math.floor(Math.random() * 51) + 15;
      
      return { original: normalizedRow, score: scoreVal, age: ageVal, gender: genderVal };
    });

    const newPatients = parsedData.map((d, index) => {
      const nameVal = d.original['name'] || d.original['ชื่อ'] || `ผู้ป่วยนำเข้า #${index + 1}`;
      let districtVal = nakhonDistricts[Math.floor(Math.random() * nakhonDistricts.length)];
      const risk = d.score >= 15 ? 'High' : d.score >= 9 ? 'Moderate' : 'Low';

      return {
        id: `EX-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        name: nameVal,
        age: d.age, 
        gender: d.gender, 
        score: d.score,
        risk: risk,
        district: districtVal,
        monthStr: 'Jan',
        date: new Date().toLocaleDateString(),
        follow: risk === 'High' ? '7 วัน (ด่วน)' : '3 เดือน'
      };
    });

    setPatients(prev => [...prev, ...newPatients]);
    showToast(`โหลดข้อมูลสำเร็จ ${newPatients.length} รายการ`);
    setActivePage('dashboard');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage patients={patients} showToast={showToast} setPatients={setPatients} />;
      case 'screening': return <ScreeningDataPage patients={patients} showToast={showToast} searchTerm={searchTerm} />;
      case 'datainput': return <DataInputPage onImport={handleImportData} showToast={showToast} />;
      case 'riskgroups': return <RiskGroupsPage patients={patients} showToast={showToast} searchTerm={searchTerm} />;
      case 'model_performance': return <ModelPerformancePage showToast={showToast} />;
      case 'settings': return <SettingsPage showToast={showToast} />;
      default: return <DashboardPage patients={patients} showToast={showToast} setPatients={setPatients} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={(e) => { e.preventDefault(); setIsLoggedIn(true); showToast("เข้าสู่ระบบสำเร็จ!"); }} />;
  }

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-sans text-gray-700 overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[999] animate-bounce">
           <CheckCircle size={24} className="text-green-400" />
           <span className="font-bold text-sm tracking-wide">{toastMessage}</span>
           <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-2"><X size={20}/></button>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl flex flex-col z-20 shrink-0 transition-all">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 cursor-pointer">
            <Activity className="text-white" size={24} />
          </div>
          <h1 className="text-lg font-bold text-gray-800 leading-tight">Depression<br/>Prediction System</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4 mt-2">Main Menu</p>
          <MenuItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
          <MenuItem icon={<FileText size={20} />} label="Screening Data" active={activePage === 'screening'} onClick={() => setActivePage('screening')} />
          <MenuItem icon={<Database size={20} />} label="Data Input" active={activePage === 'datainput'} onClick={() => setActivePage('datainput')} />
          <MenuItem icon={<Users size={20} />} label="Risk Groups" active={activePage === 'riskgroups'} onClick={() => setActivePage('riskgroups')} />
          
          <div className="my-2 border-t border-gray-100"></div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4 mt-4">AI & System</p>
          <MenuItem icon={<Target size={20} />} label="Model Performance" active={activePage === 'model_performance'} onClick={() => setActivePage('model_performance')} />
          <MenuItem icon={<Settings size={20} />} label="Settings" active={activePage === 'settings'} onClick={() => setActivePage('settings')} />
        </nav>
        
        <div className="p-4 border-t border-gray-100">
            <div className="bg-indigo-50 rounded-xl p-3 flex items-center gap-3 mb-2 cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => setActivePage('settings')}>
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white">Dr</div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">Dr. Thidamas</p>
                    <p className="text-xs text-indigo-600">Psychiatrist</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white/80 backdrop-blur-md shadow-sm h-20 flex justify-between items-center px-8 z-10 shrink-0 sticky top-0">
          <div className="relative w-96 hidden md:block">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><Search size={20} /></div>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อผู้ป่วย, รหัส, อำเภอ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F4F7FE] border-none rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all shadow-inner" 
            />
          </div>
          
          <div className="flex items-center gap-6 ml-auto">
             <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"><Bell size={22} className="text-gray-500" /></div>
             <div className="h-8 w-[1px] bg-gray-200"></div>
            <div className="flex items-center gap-3 cursor-pointer group relative">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Public Health</p>
              </div>
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="Admin" className="w-11 h-11 rounded-full border-4 border-indigo-50 shadow-sm" />
              <div className="absolute top-full right-0 mt-4 w-48 bg-white rounded-2xl shadow-xl py-2 hidden group-hover:block z-50 border border-gray-100 ring-1 ring-black ring-opacity-5">
                 <div onClick={() => setIsLoggedIn(false)} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 cursor-pointer transition-colors text-sm font-medium">
                    <LogOut size={18} /><span>Sign Out</span>
                  </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth bg-[#F4F7FE]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// =========================================
// PAGE COMPONENTS
// =========================================

// --- 5. Model Performance Page 📊 (เพิ่มโมเดลครบทุกตัว) ---
const ModelPerformancePage = ({ showToast }) => {
    // 💡 คุณสามารถแก้ตัวเลขด้านล่างนี้ ให้ตรงกับในรูปภาพของคุณได้เลยครับ! 💡
    const performanceData = {
        'Voting Ensemble': {
            accuracy: '0.8695', precision: '0.87', recall: '0.87', f1: '0.87',
            cvScores: { acc: '0.8202', prec: '0.8277', rec: '0.8202', f1: '0.8188' },
            cm: [[18, 0, 0], [2, 22, 3], [0, 4, 16]],
            report: [
                { class: '0 (Low)', p: '0.90', r: '1.00', f1: '0.95', support: 18 },
                { class: '1 (Moderate)', p: '0.85', r: '0.81', f1: '0.83', support: 27 },
                { class: '2 (High)', p: '0.84', r: '0.80', f1: '0.82', support: 20 }
            ]
        },
        'Random Forest': {
            accuracy: '0.8385', precision: '0.84', recall: '0.84', f1: '0.84',
            cm: [[17, 0, 0], [4, 19, 4], [0, 5, 15]],
            report: [
                { class: '0 (Low)', p: '0.81', r: '1.00', f1: '0.89', support: 17 },
                { class: '1 (Moderate)', p: '0.79', r: '0.70', f1: '0.75', support: 27 },
                { class: '2 (High)', p: '0.79', r: '0.75', f1: '0.77', support: 20 }
            ]
        },
        'XGBoost': {
            accuracy: '0.8500', precision: '0.85', recall: '0.85', f1: '0.85',
            cm: [[18, 0, 0], [3, 20, 4], [0, 4, 16]],
            report: [
                { class: '0 (Low)', p: '0.86', r: '1.00', f1: '0.92', support: 18 },
                { class: '1 (Moderate)', p: '0.83', r: '0.74', f1: '0.78', support: 27 },
                { class: '2 (High)', p: '0.80', r: '0.80', f1: '0.80', support: 20 }
            ]
        },
        'Logistic Regression': {
            accuracy: '0.7800', precision: '0.78', recall: '0.78', f1: '0.78',
            cm: [[15, 2, 0], [5, 16, 6], [0, 5, 15]],
            report: [
                { class: '0 (Low)', p: '0.75', r: '0.88', f1: '0.81', support: 17 },
                { class: '1 (Moderate)', p: '0.70', r: '0.59', f1: '0.64', support: 27 },
                { class: '2 (High)', p: '0.71', r: '0.75', f1: '0.73', support: 20 }
            ]
        },
        'SVM (Support Vector Machine)': {
            accuracy: '0.8100', precision: '0.81', recall: '0.81', f1: '0.81',
            cm: [[16, 1, 0], [4, 18, 5], [0, 4, 16]],
            report: [
                { class: '0 (Low)', p: '0.80', r: '0.94', f1: '0.86', support: 17 },
                { class: '1 (Moderate)', p: '0.78', r: '0.67', f1: '0.72', support: 27 },
                { class: '2 (High)', p: '0.76', r: '0.80', f1: '0.78', support: 20 }
            ]
        },
        'KNN (K-Nearest Neighbors)': {
            accuracy: '0.7600', precision: '0.76', recall: '0.76', f1: '0.76',
            cm: [[14, 3, 0], [6, 15, 6], [1, 5, 14]],
            report: [
                { class: '0 (Low)', p: '0.67', r: '0.82', f1: '0.74', support: 17 },
                { class: '1 (Moderate)', p: '0.65', r: '0.56', f1: '0.60', support: 27 },
                { class: '2 (High)', p: '0.70', r: '0.70', f1: '0.70', support: 20 }
            ]
        },
        'MLP Neural Network': {
            accuracy: '0.8250', precision: '0.83', recall: '0.82', f1: '0.82',
            cm: [[17, 0, 0], [4, 18, 5], [0, 4, 16]],
            report: [
                { class: '0 (Low)', p: '0.81', r: '1.00', f1: '0.89', support: 17 },
                { class: '1 (Moderate)', p: '0.82', r: '0.67', f1: '0.73', support: 27 },
                { class: '2 (High)', p: '0.76', r: '0.80', f1: '0.78', support: 20 }
            ]
        }
    };

    const [selectedModel, setSelectedModel] = useState(Object.keys(performanceData)[0]);
    const data = performanceData[selectedModel];
  
    const getCellBgColor = (val, maxVal = 25) => {
        if (val === 0) return 'bg-gray-50 text-gray-400 border border-gray-100';
        const intensity = val / maxVal;
        if (intensity > 0.8) return 'bg-indigo-600 text-white font-bold shadow-md';
        if (intensity > 0.5) return 'bg-indigo-400 text-white font-bold shadow-sm';
        if (intensity > 0.2) return 'bg-indigo-200 text-indigo-900 font-bold';
        return 'bg-indigo-50 text-indigo-800 font-semibold';
    };
  
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Model Evaluation</h2>
            <p className="text-gray-500 mt-1">ผลการทดสอบประสิทธิภาพของ Machine Learning Models</p>
          </div>
          <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
             <Layers className="text-indigo-500 ml-2" size={20}/>
             <select 
                value={selectedModel} 
                onChange={(e) => { setSelectedModel(e.target.value); showToast(`แสดงผลโมเดล ${e.target.value}`); }}
                className="bg-transparent border-none text-gray-700 font-bold focus:ring-0 outline-none pr-8 py-1 cursor-pointer"
             >
                {/* ดึงรายชื่อโมเดลทั้งหมดมาแสดงใน Dropdown อัตโนมัติ */}
                {Object.keys(performanceData).map(modelName => (
                   <option key={modelName} value={modelName}>{modelName}</option>
                ))}
             </select>
          </div>
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Accuracy Score" value={(data.accuracy * 100).toFixed(2) + '%'} subtitle={`Score: ${data.accuracy}`} color="indigo" />
            <StatCard title="Macro Precision" value={(data.precision * 100).toFixed(1) + '%'} subtitle="Average precision" color="blue" />
            <StatCard title="Macro Recall" value={(data.recall * 100).toFixed(1) + '%'} subtitle="Average recall" color="emerald" />
            <StatCard title="F1-Score" value={(data.f1 * 100).toFixed(1) + '%'} subtitle="Harmonic mean" color="violet" />
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                   <Target className="text-indigo-500" size={20}/> Confusion Matrix Heatmap
                </h3>
                <div className="flex-1 flex items-center justify-center">
                    <div className="relative mt-4 ml-6">
                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-bold text-gray-500 tracking-widest">TRUE LABEL</div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-500 tracking-widest">PREDICTED LABEL</div>
                        
                        <div className="grid grid-cols-4 gap-1 text-center">
                            <div className="w-16 h-10"></div>
                            <div className="w-16 h-10 flex items-center justify-center text-xs font-bold text-gray-500">0 (Low)</div>
                            <div className="w-16 h-10 flex items-center justify-center text-xs font-bold text-gray-500">1 (Mod)</div>
                            <div className="w-16 h-10 flex items-center justify-center text-xs font-bold text-gray-500">2 (High)</div>
  
                            {data.cm.map((row, rowIndex) => (
                                <React.Fragment key={rowIndex}>
                                    <div className="w-16 h-16 flex items-center justify-end pr-4 text-xs font-bold text-gray-500">
                                        {rowIndex} {rowIndex===0 ? '(Low)' : rowIndex===1 ? '(Mod)' : '(High)'}
                                    </div>
                                    {row.map((val, colIndex) => (
                                        <div key={colIndex} className={`w-16 h-16 flex items-center justify-center rounded-xl text-lg transition-all hover:scale-105 ${getCellBgColor(val)}`}>
                                            {val}
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
  
            <div className="space-y-6">
                {data.cvScores && (
                   <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-sm text-white relative overflow-hidden">
                      <div className="absolute right-0 top-0 opacity-10"><PieChart size={150} /></div>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                          <Activity size={20}/> Cross-Validation Scores (5-Fold)
                      </h3>
                      <div className="grid grid-cols-2 gap-4 relative z-10">
                         <div><p className="text-indigo-200 text-xs font-bold uppercase">Accuracy</p><p className="text-xl font-bold">{data.cvScores.acc}</p></div>
                         <div><p className="text-indigo-200 text-xs font-bold uppercase">Precision</p><p className="text-xl font-bold">{data.cvScores.prec}</p></div>
                         <div><p className="text-indigo-200 text-xs font-bold uppercase">Recall</p><p className="text-xl font-bold">{data.cvScores.rec}</p></div>
                         <div><p className="text-indigo-200 text-xs font-bold uppercase">F1-Score</p><p className="text-xl font-bold">{data.cvScores.f1}</p></div>
                      </div>
                   </div>
                )}
  
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Classification Report</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-xl font-bold">Class</th>
                                    <th className="px-4 py-3 font-bold">Precision</th>
                                    <th className="px-4 py-3 font-bold">Recall</th>
                                    <th className="px-4 py-3 font-bold">F1-Score</th>
                                    <th className="px-4 py-3 rounded-tr-xl font-bold">Support</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.report.map((r, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-gray-700">{r.class}</td>
                                        <td className="px-4 py-3 text-gray-600">{r.p}</td>
                                        <td className="px-4 py-3 text-gray-600">{r.r}</td>
                                        <td className="px-4 py-3 text-indigo-600 font-bold">{r.f1}</td>
                                        <td className="px-4 py-3 text-gray-500">{r.support}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
};

// --- 1. Dashboard Page ---
const DashboardPage = ({ patients, showToast, setPatients }) => {
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedModel, setSelectedModel] = useState('Random Forest');
  const [districtModalOpen, setDistrictModalOpen] = useState(null); 
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleApplyPredict = async () => {
    showToast(`กำลังวิเคราะห์ข้อมูลด้วยโมเดล ${selectedModel}...`);
  };

  const pieData = useMemo(() => {
    const high = patients.filter(p => p.risk === 'High').length;
    const mod = patients.filter(p => p.risk === 'Moderate').length;
    const low = patients.filter(p => p.risk === 'Low').length;
    return [
      { name: 'Low Risk', value: low, color: '#4F46E5' }, 
      { name: 'Moderate Risk', value: mod, color: '#F59E0B' }, 
      { name: 'High Risk', value: high, color: '#EF4444' }, 
    ];
  }, [patients]);

  const barData = useMemo(() => {
    const ageGroups = [{l:'15-25', m:15, x:25}, {l:'26-35', m:26, x:35}, {l:'36-45', m:36, x:45}, {l:'46-55', m:46, x:55}, {l:'56+', m:56, x:200}];
    return ageGroups.map(g => {
       const pts = patients.filter(p => p.age >= g.m && p.age <= g.x);
       return {
           group: g.l,
           high: pts.filter(p => p.risk === 'High').length,
           mod: pts.filter(p => p.risk === 'Moderate').length,
           low: pts.filter(p => p.risk === 'Low').length,
       }
    });
  }, [patients]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
    if (value === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontWeight="bold" fontSize={18}>
        {value}
      </text>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-6">
              <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Select Month</label>
                  <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-indigo-500 p-2.5 font-bold outline-none cursor-pointer" value={selectedMonth} onChange={(e) => {setSelectedMonth(e.target.value); showToast(`ดึงข้อมูลประจำเดือน ${e.target.value} สำเร็จ`);}}>
                      <option value="All">All Months (Overview)</option>
                      <option value="Jan">January</option>
                      <option value="Feb">February</option>
                  </select>
              </div>
              <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Prediction Model</label>
                  <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-indigo-500 p-2.5 font-bold outline-none cursor-pointer" value={selectedModel} onChange={(e) => {setSelectedModel(e.target.value); showToast(`เลือกโมเดลทำนายเป็น ${e.target.value}`);}}>
                      <option value="Random Forest">Random Forest</option>
                      <option value="XGBoost">XGBoost</option>
                      <option value="MLP Neural Net">MLP Neural Net</option>
                      <option value="Voting Ensemble">Voting Ensemble</option>
                  </select>
              </div>
          </div>
          <button onClick={handleApplyPredict} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
              <BarChart2 size={18} /> Apply & Predict
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><MapPin size={20} className="text-indigo-500"/> Risk Map Heatmap</h3>
              <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full cursor-pointer hover:bg-indigo-100">Nakhon Si Thammarat</span>
           </div>
           <DistrictTileMap onDistrictClick={(district) => setDistrictModalOpen(district)} patients={patients} />
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative hover:shadow-md transition-shadow">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Depression Risk Levels (Total: {patients.length})</h3>
              <button className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-gray-100" onClick={() => showToast("ดาวน์โหลดข้อมูล Risk Levels")}>Export <Upload size={12}/></button>
           </div>
           <div className="h-72 flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie 
                    data={pieData} 
                    cx="50%" cy="50%" innerRadius={0} outerRadius={100} 
                    dataKey="value" stroke="none" 
                    labelLine={false} 
                    label={renderCustomizedLabel} 
                >
                   {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" formatter={(value) => <span className="text-gray-600 font-medium ml-2">{value}</span>} />
               </RechartsPie>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow md:col-span-2">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Demographic Risk Distribution (แบ่งตามอายุ)</h3>
           </div>
           <div className="h-80 pb-4">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                 <XAxis dataKey="group" axisLine={true} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }}>
                    <Label value="ช่วงอายุ (ปี)" offset={-15} position="insideBottom" style={{ fill: '#4B5563', fontWeight: 'bold', fontSize: 13 }} />
                 </XAxis>
                 <YAxis axisLine={true} tickLine={false} tick={{ fill: '#6B7280' }}>
                    <Label value="จำนวนผู้ป่วย (คน)" angle={-90} position="insideLeft" style={{ fill: '#4B5563', fontWeight: 'bold', fontSize: 13 }} />
                 </YAxis>
                 <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} cursor={{fill: '#F3F4F6'}}/>
                 <Legend wrapperStyle={{ bottom: -10 }}/>
                 <Bar dataKey="high" name="High Risk" fill="#EF4444" radius={[4, 4, 0, 0]} />
                 <Bar dataKey="mod" name="Moderate Risk" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                 <Bar dataKey="low" name="Low Risk" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {districtModalOpen && !selectedPatient && (
         <DistrictPatientsModal district={districtModalOpen} patients={patients} onClose={() => setDistrictModalOpen(null)} onSelectPatient={setSelectedPatient} />
      )}
      {selectedPatient && (
         <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} showToast={showToast} />
      )}
    </div>
  );
};

// --- แผนที่จำลอง ---
const DistrictTileMap = ({ onDistrictClick, patients }) => {
    return (
        <div className="grid grid-cols-3 gap-2 h-72">
            {nakhonDistricts.map(dist => {
                const count = patients.filter(p => p.district === dist).length;
                let colorClass = "bg-indigo-400";
                if (count >= 5) colorClass = "bg-red-500";
                else if (count >= 2) colorClass = "bg-yellow-500";

                return (
                    <div key={dist} onClick={() => onDistrictClick(dist)} className={`${colorClass} ${dist === 'Mueang' || dist === 'Cha-uat' ? 'col-span-2' : 'col-span-1'} text-white rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-all shadow-sm transform hover:scale-[1.02] border-2 border-white relative overflow-hidden`}>
                        <div className="absolute top-2 right-2 text-white/50"><MapPin size={14}/></div>
                        <span className="font-bold text-sm text-center px-1">อ.{dist}</span>
                        <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full mt-1 font-semibold">{count} คน</span>
                    </div>
                );
            })}
        </div>
    )
};

// --- 2. Screening Data Page ---
const ScreeningDataPage = ({ patients, showToast, searchTerm }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const searchedPatients = patients.filter(p => 
    searchTerm === '' || 
    `DPS-${p.id}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.risk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.includes(searchTerm) ||
    p.district.includes(searchTerm)
  );

  const riskColumns = [
    { title: 'Low Risk', color: 'indigo', items: searchedPatients.filter(p => p.risk === 'Low') },
    { title: 'Moderate Risk', color: 'amber', items: searchedPatients.filter(p => p.risk === 'Moderate') },
    { title: 'High Risk', color: 'red', items: searchedPatients.filter(p => p.risk === 'High') },
  ];

  return (
    <div className="h-full flex flex-col relative">
       <div className="mb-6 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Screening Kanban</h2>
            <p className="text-gray-500 mt-1 text-sm">Patient status management board</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-6 h-full min-w-[1000px]">
            {riskColumns.map((col, idx) => (
            <div key={idx} className="flex-1 bg-white/50 rounded-[2rem] p-4 flex flex-col h-full border border-white shadow-sm backdrop-blur-sm">
                <div className={`flex justify-between items-center mb-4 px-2 py-1`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-${col.color}-500`}></div>
                        <h3 className="font-bold text-gray-700 text-lg">{col.title}</h3>
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">{col.items.length}</span>
                    </div>
                </div>
                
                <div className="space-y-4 overflow-y-auto pr-2 flex-1 pb-4" style={{scrollbarWidth: 'none'}}>
                    {col.items.map((p) => (
                        <div key={p.id} onClick={() => setSelectedPatient(p)} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
                            <h4 className="font-bold text-gray-800 mb-1">{p.name}</h4>
                            <p className="text-xs text-gray-500 mb-3 font-medium flex items-center gap-1"><User size={12}/> {p.id} • อ.{p.district}</p>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">มีคะแนน <b>{p.score} คะแนน</b></p>
                        </div>
                    ))}
                </div>
            </div>
            ))}
        </div>
      </div>
      {selectedPatient && (
         <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} showToast={showToast} />
      )}
    </div>
  );
};

// --- 3. Data Input Page ---
const DataInputPage = ({ showToast, onImport }) => {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState(null);
    const [rawJsonData, setRawJsonData] = useState([]);
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFileName(file.name);
        showToast(`กำลังโหลดและวิเคราะห์ไฟล์: ${file.name}`);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            
            if (jsonData && jsonData.length > 0) {
              setRawJsonData(jsonData);
              const colCount = Object.keys(jsonData[0]).length;
              showToast(`โหลดข้อมูลสำเร็จ! พบ ${jsonData.length} แถว ${colCount} คอลัมน์`);
            } else {
              showToast("ไม่พบข้อมูลในไฟล์ หรือไฟล์ว่างเปล่า");
            }
          } catch (error) {
            console.error("Error reading file:", error);
            showToast("เกิดข้อผิดพลาดในการอ่านไฟล์ กรุณาตรวจสอบฟอร์แมต");
          }
        };
        reader.readAsArrayBuffer(file);
      }
    };

    const rowCount = rawJsonData.length;
    const colCount = rowCount > 0 ? Object.keys(rawJsonData[0]).length : 0;
  
    return (
      <div className="max-w-7xl mx-auto pb-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Data Import & Preview</h2>
          <p className="text-gray-500 mt-1">อัปโหลดไฟล์ CSV/Excel ที่มีข้อมูลผู้ป่วย ระบบจะจัดเตรียมข้อมูลให้</p>
        </div>
  
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-1">
               <label className="block text-sm font-bold text-gray-700 mb-3">Upload File</label>
               <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv, .xlsx, .xls" className="hidden" />
               <div onClick={() => fileInputRef.current.click()} className={`border-2 border-dashed rounded-3xl h-[250px] flex flex-col items-center justify-center text-center cursor-pointer transition-colors group relative overflow-hidden ${fileName ? 'border-green-400 bg-green-50' : 'border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50'}`}>
                  {fileName ? (
                      <>
                          <div className="bg-white p-4 rounded-full shadow-sm mb-4"><CheckCircle size={32} className="text-green-500" /></div>
                          <p className="text-lg font-bold text-gray-800 px-4 truncate w-full">{fileName}</p>
                          {rowCount > 0 && (
                            <p className="text-green-700 text-sm mt-3 font-bold bg-green-200/50 px-4 py-1.5 rounded-full border border-green-300">
                               ข้อมูล {rowCount} แถว | {colCount} คอลัมน์
                            </p>
                          )}
                      </>
                  ) : (
                      <>
                          <div className="bg-white p-4 rounded-full shadow-sm mb-4"><Upload size={32} className="text-indigo-500" /></div>
                          <p className="text-lg font-bold text-gray-800">Click to Upload</p>
                          <p className="text-gray-500 text-sm mt-1 mb-6">Supported formats: .xlsx, .csv</p>
                      </>
                  )}
               </div>
             </div>

             <div className="lg:col-span-2">
                 {rowCount > 0 ? (
                     <div className="h-full flex flex-col">
                         <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                             <Database size={20} className="text-indigo-500"/> 
                             Data Preview 
                             <span className="text-sm font-bold text-gray-500 ml-2 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
                               แสดง 5 จาก {rowCount} แถว
                             </span>
                         </h3>
                         
                         <div className="flex-1 overflow-auto border border-gray-200 rounded-2xl bg-white shadow-inner max-h-[350px]">
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm border-b border-gray-200">
                                    <tr>
                                        {Object.keys(rawJsonData[0]).map((colName, idx) => (
                                            <th key={idx} className="px-4 py-3 border-r border-gray-100 font-bold tracking-wider">{colName}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rawJsonData.slice(0, 5).map((row, rowIndex) => (
                                        <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                            {Object.values(row).map((val, colIndex) => (
                                                <td key={colIndex} className="px-4 py-3 text-gray-600 border-r border-gray-50">
                                                    {val !== null && val !== undefined ? String(val) : '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>

                         <button onClick={() => onImport(rawJsonData)} className="mt-6 bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg w-full flex justify-center items-center gap-2 text-lg">
                            <Activity size={24}/> ประมวลผลและซิงค์ข้อมูล {rowCount} รายการ เข้าระบบ
                         </button>
                     </div>
                 ) : (
                     <div className="h-full border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                         <Database size={48} className="mb-4 text-gray-300" />
                         <p className="font-medium">พรีวิวข้อมูลตารางจะแสดงที่นี่</p>
                     </div>
                 )}
             </div>
          </div>
        </div>
      </div>
    );
};

// --- 4. Risk Groups Page ---
const RiskGroupsPage = ({ patients, showToast, searchTerm }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const filteredPatients = patients.filter(p => 
      searchTerm === '' || p.name.includes(searchTerm) || p.district.includes(searchTerm)
  );

  return (
    <div className="max-w-6xl mx-auto relative">
       <div className="mb-8">
           <h2 className="text-3xl font-bold text-gray-800">Risk Group Monitor</h2>
           <p className="text-gray-500 mt-1">แสดงรายชื่อผู้ป่วยทั้งหมด {filteredPatients.length} รายการ</p>
       </div>
       <div className="space-y-4">
          {filteredPatients.map((p, idx) => (
             <div key={idx} onClick={() => setSelectedPatient(p)} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between cursor-pointer">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 font-bold border border-gray-200"><User size={24}/></div>
                   <div>
                      <div className="flex items-center gap-3">
                          <h4 className="font-bold text-gray-800 text-lg">{p.name}</h4>
                          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">ID: {p.id}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm mt-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${p.risk === 'High' ? 'bg-red-100 text-red-600' : p.risk === 'Moderate' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>{p.risk} Risk</span>
                          <span className="text-indigo-600 font-bold flex items-center gap-1"><MapPin size={12}/>อ.{p.district}</span>
                      </div>
                   </div>
                </div>
             </div>
          ))}
       </div>
       {selectedPatient && <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} showToast={showToast} />}
    </div>
  );
};

// --- 6. Settings Page ---
const SettingsPage = ({ showToast }) => {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
          <p className="text-gray-500 mt-1 text-sm">จัดการการตั้งค่าระบบ บัญชีผู้ใช้งาน และการเชื่อมต่อ API</p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-2">
             <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2">
                <button className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold transition-colors">
                   <User size={18}/> Profile Details
                </button>
                <button onClick={() => showToast("เปิดหน้าตั้งค่า API")} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                   <Database size={18}/> API & Models
                </button>
                <button onClick={() => showToast("เปิดหน้าตั้งค่าความปลอดภัย")} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                   <Shield size={18}/> Security
                </button>
             </div>
          </div>
  
          <div className="md:col-span-2 space-y-6">
             <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                      <input type="text" defaultValue="Dr. Thidamas" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-800 transition-all" />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Role / Position</label>
                      <input type="text" defaultValue="Psychiatrist" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-800 transition-all" />
                   </div>
                </div>
             </div>
  
             <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">API Configuration</h3>
                <div className="space-y-5">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Backend Endpoint URL</label>
                      <input type="text" defaultValue="http://localhost:8000/api/" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-800 transition-all" />
                   </div>
                </div>
             </div>
  
             <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => showToast("ยกเลิกการเปลี่ยนแปลง")} className="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                <button onClick={() => showToast("บันทึกการตั้งค่าระบบเรียบร้อยแล้ว!")} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-[1.02]">
                   <Save size={20} /> Save Changes
                </button>
             </div>
          </div>
        </div>
      </div>
    );
};

// =========================================
// HELPER MODALS & COMPONENTS
// =========================================

const StatCard = ({ title, value, subtitle, color }) => (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">{title}</p>
        <p className={`text-3xl font-extrabold text-${color}-600 mb-1`}>{value}</p>
        <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
    </div>
);

const DistrictPatientsModal = ({ district, patients, onClose, onSelectPatient }) => {
  const districtPatients = patients.filter(p => p.district === district);
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 shrink-0">
          <div className="flex items-center gap-3">
             <MapPin className="text-indigo-500" size={24}/>
             <h2 className="text-xl font-bold text-gray-800">รายชื่อผู้ป่วยในพื้นที่: อำเภอ{district}</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500"><X size={20}/></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
           {districtPatients.map(p => (
               <div key={p.id} onClick={() => onSelectPatient(p)} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm cursor-pointer flex justify-between items-center">
                   <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold"><User size={20}/></div>
                       <div>
                           <p className="font-bold text-gray-800">{p.name}</p>
                           <p className="text-xs text-gray-500">อายุ {p.age} ปี</p>
                       </div>
                   </div>
               </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const PatientDetailModal = ({ patient, onClose, showToast }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold"><User size={28}/></div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
              <p className="text-sm text-gray-500 font-medium">รหัสอ้างอิง: {patient.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500"><X size={20}/></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Risk Level</p>
                <p className="font-extrabold text-2xl">{patient.risk}</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">PHQ-9 Score</p>
                <p className="font-extrabold text-2xl text-gray-800">{patient.score}</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">อายุ / เพศ</p>
                <p className="font-extrabold text-lg text-gray-800">{patient.age} ปี <span className="font-medium text-gray-500">({patient.gender})</span></p>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">พื้นที่</p>
                <p className="font-extrabold text-lg text-indigo-600">อ.{patient.district}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white hover:text-indigo-600'}`}>
    <div className={`${active ? 'text-white' : 'text-gray-400'}`}>{icon}</div>
    <span className={`font-bold text-sm ${active ? '' : 'font-medium'}`}>{label}</span>
  </div>
);

// --- Login Page ---
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4 relative">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 border border-gray-100">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-indigo-200">
          <Activity className="text-white" size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Welcome Back</h2>
        
        <form onSubmit={onLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Mail size={20} /></div>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700"
                placeholder="admin@hospital.com" required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Lock size={20} /></div>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700"
                placeholder="••••••••" required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex justify-center items-center gap-2">
            Sign In 
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepressionPredictionApp;