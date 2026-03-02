import React, { useState, useRef } from 'react';
// Import Icons
import { 
  LayoutDashboard, FileText, Database, Users, BarChart2, Settings, LogOut, 
  User, Bell, Search, Plus, MoreHorizontal, Paperclip, MessageSquare, 
  Filter, Calendar as CalendarIcon, Clock, ChevronRight, Upload, 
  CheckCircle, Lock, Mail, Activity, MoreVertical 
} from 'lucide-react';
// Import Recharts
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
// Import DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Import XLSX (สำหรับอ่านไฟล์ Excel และ CSV)
import * as XLSX from 'xlsx';

// --- Main Application Component ---
const DepressionPredictionApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePage('dashboard');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'screening': return <ScreeningDataPage />;
      case 'datainput': return <DataInputPage />;
      case 'riskgroups': return <RiskGroupsPage />;
      case 'trends': return <TrendsStatisticsPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-sans text-gray-700 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl flex flex-col z-20 shrink-0 transition-all">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Activity className="text-white" size={24} />
          </div>
          <h1 className="text-lg font-bold text-gray-800 leading-tight">Depression<br/>Prediction System</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4 mt-2">Main Menu</p>
          <MenuItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
          <MenuItem icon={<FileText size={20} />} label="Screening Data" active={activePage === 'screening'} onClick={() => setActivePage('screening')} />
          <MenuItem icon={<Database size={20} />} label="Data Input" active={activePage === 'datainput'} onClick={() => setActivePage('datainput')} />
          <MenuItem icon={<Users size={20} />} label="Risk Groups" active={activePage === 'riskgroups'} onClick={() => setActivePage('riskgroups')} />
          <MenuItem icon={<BarChart2 size={20} />} label="Trends & Statistics" active={activePage === 'trends'} onClick={() => setActivePage('trends')} />
          <MenuItem icon={<Settings size={20} />} label="Settings" active={activePage === 'settings'} onClick={() => setActivePage('settings')} />
        </nav>
        
        <div className="p-4 border-t border-gray-100">
            <div className="bg-indigo-50 rounded-xl p-3 flex items-center gap-3 mb-2">
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
            <input type="text" placeholder="Search patient data / reports..." className="w-full bg-[#F4F7FE] border-none rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all" />
          </div>
          
          <div className="flex items-center gap-6 ml-auto">
             <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={22} className="text-gray-500" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
             </div>
             
             <div className="h-8 w-[1px] bg-gray-200"></div>

            <div className="flex items-center gap-3 cursor-pointer group relative">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Public Health Officer</p>
              </div>
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="Admin" className="w-11 h-11 rounded-full border-4 border-indigo-50 shadow-sm" />
              
              <div className="absolute top-full right-0 mt-4 w-48 bg-white rounded-2xl shadow-xl py-2 hidden group-hover:block z-50 border border-gray-100 ring-1 ring-black ring-opacity-5">
                 <div onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 cursor-pointer transition-colors text-sm font-medium">
                    <LogOut size={18} />
                    <span>Sign Out</span>
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

// --- 1. Dashboard Page ---
const DashboardPage = () => {
  const pieData = [
    { name: 'Low Risk', value: 50, color: '#4F46E5' }, 
    { name: 'Moderate Risk', value: 18, color: '#F59E0B' }, 
    { name: 'High Risk', value: 32, color: '#EF4444' }, 
  ];
  const donutData = [
    { name: 'PHQ-9', value: 40, color: '#EF4444' },
    { name: 'Clinical Interview', value: 35, color: '#F59E0B' },
    { name: 'Self-report', value: 25, color: '#3B82F6' },
  ];
  const lineData = [
    { name: 'Sep', high: 4, low: 2 }, { name: 'Oct', high: 6, low: 4 }, { name: 'Nov', high: 5, low: 3 },
    { name: 'Dec', high: 8, low: 5 }, { name: 'Jan', high: 7, low: 4 }, { name: 'Feb', high: 6, low: 3 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
       <div className="flex justify-between items-center mb-2">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            <p className="text-gray-500 text-sm">Summary of depression prediction results</p>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50"><MoreHorizontal className="text-gray-400" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel 1 */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Overview Stats</h3>
              <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1"><Paperclip size={12}/> Report</span>
           </div>
           <div className="w-full h-72 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl flex items-center justify-center text-indigo-300 flex-col gap-3 relative border border-indigo-100 border-dashed">
              <Activity size={64} className="opacity-50" />
              <span className="font-semibold">Interactive Infographic Area</span>
           </div>
        </div>

        {/* Panel 2 */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative hover:shadow-md transition-shadow">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Depression Risk Levels</h3>
               <Dropdown label="This Week" />
           </div>
           <div className="h-72 flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={0} outerRadius={100} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" formatter={(value) => <span className="text-gray-600 font-medium ml-2">{value}</span>} />
              </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Panel 3 */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Screening Methods</h3>
              <Dropdown label="Monthly" />
           </div>
           <div className="h-72 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={70} outerRadius={105} dataKey="value" paddingAngle={5} cornerRadius={5}>
                  {donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" formatter={(value) => <span className="text-gray-600 font-medium ml-2">{value}</span>} />
              </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Panel 4 */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Risk Trend Analysis</h3>
               <Dropdown label="6 Months" />
           </div>
           <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                <Line type="monotone" dataKey="high" stroke="#EF4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="low" stroke="#4F46E5" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. Screening Data Page ---
const ScreeningDataPage = () => {
  const riskColumns = [
    { title: 'Low Risk', color: 'indigo', items: [1, 2, 3] },
    { title: 'Moderate Risk', color: 'amber', items: [4, 5] },
    { title: 'High Risk', color: 'red', items: [6, 7, 8] },
  ];

  return (
    <div className="h-full flex flex-col">
       <div className="mb-6 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Screening Kanban</h2>
            <p className="text-gray-500 mt-1 text-sm">Patient status management board</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50"><Filter size={16}/> Filter</button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200"><Plus size={16}/> Add New</button>
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
                    <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
                </div>
                
                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                    <button className={`w-full py-3 border-2 border-dashed border-${col.color}-200 rounded-2xl text-${col.color}-400 font-bold hover:bg-${col.color}-50 transition-colors flex items-center justify-center gap-2`}>
                        <Plus size={20} /> Add Patient
                    </button>

                    {col.items.map((item) => (
                        <div key={item} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`bg-${col.color}-50 text-${col.color}-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider`}>{col.title}</span>
                                <MoreHorizontal size={16} className="text-gray-300 group-hover:text-gray-500" />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-1">Patient ID: DPS-00{item}</h4>
                            <p className="text-xs text-gray-400 mb-3 flex items-center gap-1"><Clock size={12}/> Updated 2 hours ago</p>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                Patient shows signs consistent with {col.title.toLowerCase()} levels. Recommended follow-up in 2 weeks.
                            </p>
                            
                            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                <div className="flex -space-x-2">
                                    <img src={`https://ui-avatars.com/api/?name=User+${item}&background=random`} className="w-7 h-7 rounded-full border-2 border-white" alt="" />
                                    <img src={`https://ui-avatars.com/api/?name=Doc+${item}&background=random`} className="w-7 h-7 rounded-full border-2 border-white" alt="" />
                                </div>
                                <div className="flex gap-3 text-gray-400 text-xs font-medium">
                                    <span className="flex items-center gap-1 hover:text-indigo-500"><Paperclip size={14}/> 2</span>
                                    <span className="flex items-center gap-1 hover:text-indigo-500"><MessageSquare size={14}/> 4</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// --- 3. Data Input Page (WITH EXCEL & CSV UPLOAD LOGIC) ---
const DataInputPage = () => {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
  
    // ฟังก์ชันเมื่อมีการเลือกไฟล์ (อ่านไฟล์ Excel หรือ CSV)
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFileName(file.name);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = event.target.result;
          
          // ใช้ XLSX อ่านข้อมูล
          const workbook = XLSX.read(data, { type: 'binary' });
          
          // ดึง Sheet แรกสุดมาใช้งาน
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // แปลงข้อมูลใน Sheet เป็น JSON Array
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length > 0) {
            setTableHeaders(Object.keys(jsonData[0])); // เอา key มาทำหัวตาราง
            setTableData(jsonData.slice(0, 10)); // โชว์พรีวิวแค่ 10 แถวแรก
          } else {
            setTableData([]);
            setTableHeaders([]);
          }
        };
        
        // เริ่มอ่านไฟล์
        reader.readAsBinaryString(file);
      }
    };
  
    const handleBrowseClick = () => {
      fileInputRef.current.click();
    };
  
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Data Import</h2>
          <p className="text-gray-500 mt-1">Import Dataset for prediction</p>
        </div>
  
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Left Form */}
             <div className="space-y-6">
               <InputField label="Dataset Name" placeholder="e.g. Q1_2025_Screening" defaultValue={fileName ? fileName.split('.')[0] : "New Dataset"} />
               
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Import Source</label>
                  <div className="flex gap-4">
                     <div className="flex-1 flex items-center gap-3 p-4 border-2 border-indigo-600 bg-indigo-50 rounded-xl transition-all relative">
                        <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center"><div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div></div>
                        <span className="font-bold text-indigo-900">File Upload</span>
                     </div>
                     <div className="flex-1 flex items-center gap-3 p-4 border border-gray-200 rounded-xl opacity-50 cursor-not-allowed">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                        <span className="font-bold text-gray-600">API Connect</span>
                     </div>
                  </div>
               </div>
  
               <div>
                   <label className="block text-sm font-bold text-gray-700 mb-3">Description</label>
                   <textarea className="w-full border-none bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 text-sm h-32 resize-none placeholder-gray-400" placeholder="Optional notes regarding this dataset..."></textarea>
               </div>
             </div>
             
             {/* Right Upload Area */}
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-3">Upload File (Excel & CSV)</label>
               {/* รองรับทั้ง .csv, .xlsx, .xls */}
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".csv, .xlsx, .xls" 
                  className="hidden" 
               />
               
               <div 
                  onClick={handleBrowseClick}
                  className={`border-2 border-dashed rounded-3xl h-full min-h-[300px] flex flex-col items-center justify-center text-center cursor-pointer transition-colors group relative overflow-hidden ${fileName ? 'border-green-400 bg-green-50' : 'border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50'}`}
               >
                  {fileName ? (
                      <>
                          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                              <CheckCircle size={32} className="text-green-500" />
                          </div>
                          <p className="text-lg font-bold text-gray-800">{fileName}</p>
                          <p className="text-green-600 text-sm mt-1 font-bold">File Selected</p>
                          <button className="mt-6 text-sm text-gray-400 hover:text-red-500 underline" onClick={(e) => { e.stopPropagation(); setFileName(null); setTableData([]); }}>Change File</button>
                      </>
                  ) : (
                      <>
                          <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                              <Upload size={32} className="text-indigo-500" />
                          </div>
                          <p className="text-lg font-bold text-gray-800">Click to Upload Excel / CSV</p>
                          <p className="text-gray-500 text-sm mt-1 mb-6">Supported formats: .xlsx, .xls, .csv</p>
                          <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Browse Files</button>
                      </>
                  )}
               </div>
             </div>
          </div>
  
          {/* Preview Table (Dynamic) */}
          {tableData.length > 0 && (
              <div className="mt-10 animate-fade-in">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold text-gray-800">Data Preview <span className="text-sm font-normal text-gray-500">(First 10 rows)</span></h3>
                 </div>
                 
                 <div className="overflow-x-auto rounded-2xl border border-gray-100 max-w-[100%]">
                    <table className="w-full text-left whitespace-nowrap min-w-max">
                       <thead className="bg-gray-50/80 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0">
                          <tr>
                             {tableHeaders.map((header, index) => (
                                 <th key={index} className="p-4">{header}</th>
                             ))}
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50 bg-white">
                          {tableData.map((row, rowIndex) => (
                             <tr key={rowIndex} className="hover:bg-indigo-50/30 transition-colors">
                                {tableHeaders.map((header, colIndex) => (
                                    <td key={colIndex} className="p-4 text-gray-600 text-sm">
                                        {/* ใช้ toString() ป้องกัน error กรณีข้อมูลเป็น object หรือ null */}
                                        {row[header] !== undefined && row[header] !== null ? row[header].toString() : "-"}
                                    </td>
                                ))}
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 
                 <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                     <button onClick={() => {setFileName(null); setTableData([]);}} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Clear</button>
                     <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg">Confirm Import</button>
                 </div>
              </div>
          )}
        </div>
      </div>
    );
  };

// --- 4. Risk Groups Page ---
const RiskGroupsPage = () => {
  const patients = [
    { id: '001', score: 18, risk: 'High', date: '5/10/2024', follow: '25/10/2024', status: 'Pending' },
    { id: '002', score: 22, risk: 'High', date: '15/10/2024', follow: '30/10/2024', status: 'Completed' },
    { id: '003', score: 13, risk: 'Moderate', date: '01/11/2024', follow: '15/11/2024', status: 'Pending' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
       <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
         <div>
             <div className="flex items-center gap-2 mb-2">
                 <span className="text-gray-400 text-sm font-bold">Risk Groups</span>
                 <ChevronRight size={14} className="text-gray-300" />
                 <span className="text-indigo-600 text-sm font-bold">High Risk</span>
             </div>
             <h2 className="text-3xl font-bold text-gray-800">High Risk Patients</h2>
         </div>
         
         <div className="flex gap-4">
             <div className="bg-white px-5 py-3 rounded-2xl flex items-center gap-3 border border-gray-100 shadow-sm">
                <div className="bg-green-100 p-2 rounded-lg text-green-600"><Clock size={18}/></div>
                <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase">Monitoring</span>
                    <span className="font-bold text-gray-800">2M : 1W</span>
                </div>
             </div>
             <div className="bg-white px-5 py-3 rounded-2xl flex items-center gap-3 border border-gray-100 shadow-sm">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><CalendarIcon size={18}/></div>
                 <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase">Next Assessment</span>
                    <span className="font-bold text-gray-800">12 Days</span>
                </div>
             </div>
         </div>
       </div>

       <div className="space-y-4">
          {patients.map((p, idx) => (
             <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 hidden group-hover:block"></div>
                
                <div className="flex items-center gap-6 w-full md:w-auto">
                   <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                       {p.risk === 'High' ? <Activity size={24}/> : <User size={24}/>}
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-800 text-lg">Patient ID: DPS-{p.id}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.risk === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>{p.risk} Risk</span>
                          <span>• PHQ-9 Score: {p.score}</span>
                      </div>
                   </div>
                </div>

                <div className="flex flex-wrap items-center gap-8 md:gap-16 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                   <div className="flex flex-col gap-1">
                       <span className="text-xs font-bold text-gray-400 uppercase">Screened</span>
                       <span className="font-bold text-gray-700 flex items-center gap-2"><CalendarIcon size={14} className="text-gray-400"/> {p.date}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                       <span className="text-xs font-bold text-gray-400 uppercase">Follow-up</span>
                       <span className="font-bold text-gray-700 flex items-center gap-2"><CalendarIcon size={14} className="text-gray-400"/> {p.follow}</span>
                   </div>
                   
                   <div className="flex items-center gap-4">
                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold text-sm border border-green-100 flex items-center gap-2">
                            <Clock size={16} /> 00:30:00
                        </div>
                        <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600"><MoreVertical size={20}/></button>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

// --- 5. Trends & Statistics Page ---
const TrendsStatisticsPage = () => {
  const lineData = [
    { name: 'Sep', high: 3, low: 2 }, { name: 'Oct', high: 5, low: 3 }, { name: 'Nov', high: 4, low: 4 },
    { name: 'Dec', high: 7, low: 5 }, { name: 'Jan', high: 6, low: 4 }, { name: 'Feb', high: 8, low: 6 },
  ];
  const donutData = [{ name: 'A', value: 40, color: '#EF4444' }, { name: 'B', value: 35, color: '#F59E0B' }, { name: 'C', value: 25, color: '#3B82F6' }];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Advanced Analytics</h2>
        <p className="text-gray-500">Deep dive into screening patterns and model accuracy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-800">Monthly Depression Trends</h3>
                <div className="bg-gray-50 p-1 rounded-lg flex gap-1">
                    <button className="px-3 py-1 bg-white shadow-sm rounded-md text-xs font-bold text-gray-800">Year</button>
                    <button className="px-3 py-1 rounded-md text-xs font-bold text-gray-400 hover:bg-white hover:shadow-sm">Month</button>
                </div>
            </div>
            <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                    <Line type="monotone" dataKey="high" stroke="#EF4444" strokeWidth={4} dot={{r:4, strokeWidth:0}} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="low" stroke="#4F46E5" strokeWidth={4} dot={{r:4, strokeWidth:0}} activeDot={{ r: 8 }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Screening Methods</h3>
                <p className="text-gray-400 text-sm">Distribution by type</p>
            </div>
            <div className="h-64 flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={5} cornerRadius={6}>
                      {donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none"/>)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- 6. Settings Page ---
const SettingsPage = () => {
    const [startDate, setStartDate] = useState(new Date());

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4">Profile Settings</h3>
                <div className="flex items-center gap-6 mb-8">
                    <img src="https://ui-avatars.com/api/?name=Dr+Thidamas&size=128&background=6366f1&color=fff" className="w-24 h-24 rounded-full border-4 border-indigo-50"/>
                    <button className="text-indigo-600 font-bold text-sm hover:underline">Change Picture</button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <InputField label="Full Name" defaultValue="Dr. Thidamas" />
                    <InputField label="Hospital / Clinic" defaultValue="Bangkok Hospital" />
                    <InputField label="Email Address" defaultValue="dr.thidamas@hospital.com" />
                    <div>
                         <label className="block text-sm font-bold text-gray-700 mb-3">Date Added</label>
                         <div className="w-full relative">
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-gray-700" />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 7. Login Page ---
const LoginPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 text-center">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
           <Activity className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8 text-sm">Please sign in to access the system</p>
        
        <form onSubmit={onLogin} className="space-y-4 text-left">
           <div>
             <label className="block text-xs font-bold text-gray-700 uppercase mb-2 ml-1">Email</label>
             <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={18}/>
                <input type="email" required placeholder="doctor@hospital.com" className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium" />
             </div>
           </div>
           <div>
             <label className="block text-xs font-bold text-gray-700 uppercase mb-2 ml-1">Password</label>
             <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18}/>
                <input type="password" required placeholder="••••••••" className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium" />
             </div>
           </div>
           
           <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-4">Sign In</button>
        </form>
        <p className="text-xs text-gray-400 mt-6">Demo Version 1.0.0</p>
      </div>
    </div>
  );
};

// --- Helper Components ---

const MenuItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-white hover:shadow-sm hover:text-indigo-600'}`}>
    <div className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`}>{icon}</div>
    <span className={`font-bold text-sm ${active ? '' : 'font-medium'}`}>{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
  </div>
);

const InputField = ({ label, type = "text", placeholder, defaultValue }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-3">{label}</label>
    <input 
      type={type} 
      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-gray-700 placeholder-gray-400 transition-all" 
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  </div>
);

const Dropdown = ({ label }) => (
    <button className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
       {label} <ChevronRight className="rotate-90" size={12}/>
    </button>
);

export default DepressionPredictionApp;