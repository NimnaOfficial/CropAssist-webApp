"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard, Sprout, User, Search, Sun, Moon, Bell, LogOut,
  Wheat, ArrowUpRight, ArrowDownRight, Leaf, MapPin, Calendar, 
  ChevronRight, MoreHorizontal, Plus, Edit, Trash2, Droplets, Users, BarChart3, Bug,
  MessageSquare, Send, X, Check, PanelLeftClose, PanelLeftOpen, Download, Settings, RefreshCw, FileText, Share2, HelpCircle
} from "lucide-react";
import { useTheme } from "next-themes";
import DashboardBackground from "../../components/DashboardBackground";

/* ═══════ MOCK DATA ═══════ */
const stats = [
  { label: "Total Yield", value: "12,840 kg", change: "+8.2%", up: true, icon: Wheat },
  { label: "Active Fields", value: "14", change: "+2", up: true, icon: MapPin },
];

const initialCrops = [
  { id: 1, name: "Rice (Samba)", field: "Field A-01", status: "Growing", health: 92, planted: "2026-03-15", harvest: "2026-08-20", area: "2.5 ha" },
  { id: 2, name: "Tea (Ceylon)", field: "Field B-03", status: "Harvesting", health: 88, planted: "2026-01-10", harvest: "2026-07-01", area: "1.8 ha" },
  { id: 3, name: "Vegetables (Mixed)", field: "Field C-02", status: "Seedling", health: 95, planted: "2026-06-01", harvest: "2026-09-15", area: "0.6 ha" },
];

const initialNotifications = [
  { id: 1, text: "Field A-01 soil moisture low", time: "Just now", icon: Droplets },
  { id: 2, text: "Harvest schedule updated", time: "2 hours ago", icon: Calendar },
  { id: 3, text: "Weekly yield report ready", time: "Yesterday", icon: BarChart3 },
];

const yieldData = [35, 42, 38, 55, 48, 62, 58, 71, 65, 78, 82, 88];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ═══════ SIDEBAR NAV ═══════ */
const sidebarNavMain = [
  { label: "Overview", icon: LayoutDashboard, id: "overview" },
  { label: "Manage Crops", icon: Sprout, id: "crops" },
  { label: "Profile", icon: User, id: "profile" },
];

/* ═══════ MINI CHART SVG ═══════ */
function MiniChart({ data, color = "#22c55e" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 200;
  const h = 60;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#chartGrad)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════ DONUT CHART SVG ═══════ */
function DonutChart() {
  const segments = [
    { label: "Rice", value: 42, color: "#22c55e" },
    { label: "Tea", value: 28, color: "#eab308" },
    { label: "Vegetables", value: 18, color: "#3b82f6" },
    { label: "Other", value: 12, color: "#a855f7" },
  ];
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cum = 0;
  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-8">
      <div className="relative w-36 h-36 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => {
            const offset = (cum / total) * c;
            const len = (seg.value / total) * c;
            cum += seg.value;
            return (
              <circle
                key={i}
                cx="50" cy="50" r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="12"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl text-zinc-900 dark:text-white font-normal font-gelasio">{total}%</span>
          <span className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest">Allocation</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2 h-2" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-zinc-600 dark:text-white/60 font-light">{seg.label}</span>
            <span className="text-xs text-zinc-800 dark:text-white/80 ml-auto">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("overview");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const dragControls = useDragControls();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [activeCrops, setActiveCrops] = useState(initialCrops);
  const [activeNotifications, setActiveNotifications] = useState(initialNotifications);
  
  const [cropSearchTerm, setCropSearchTerm] = useState("");
  const [cropSortField, setCropSortField] = useState<"name" | "status" | "health">("name");
  const [cropSortDir, setCropSortDir] = useState<"asc" | "desc">("asc");
  
  const filteredSortedCrops = activeCrops
    .filter(c => c.name.toLowerCase().includes(cropSearchTerm.toLowerCase()) || c.field.toLowerCase().includes(cropSearchTerm.toLowerCase()))
    .sort((a, b) => {
      let cmp = 0;
      if (cropSortField === "name") cmp = a.name.localeCompare(b.name);
      else if (cropSortField === "status") cmp = a.status.localeCompare(b.status);
      else if (cropSortField === "health") cmp = a.health - b.health;
      return cropSortDir === "asc" ? cmp : -cmp;
    });

  const [isCropModalOpen, setCropModalOpen] = useState(false);
  const [editingCropId, setEditingCropId] = useState<number | null>(null);
  
  const defaultCrop = { name: "", field: "", status: "Growing", health: 100, area: "", planted: "", harvest: "" };
  const [cropForm, setCropForm] = useState(defaultCrop);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "John Farmer", email: "john@farmhub.com", phone: "+94 77 123 4567",
    nic: "200012345678", address: "123 Green Valley, Kandy", type: "Rice, Tea, Vegetables",
    teamSize: "12 Members", memberSince: "March 2026"
  });

  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState("Today");
  const [donutKey, setDonutKey] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "Manager", text: "Hello John, any updates on Field A-01? Let me know if you need assistance.", time: "09:00 AM" }
  ]);
  const [newMsg, setNewMsg] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  
  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatOpen]);

  const openAddCrop = () => {
    setEditingCropId(null);
    setCropForm(defaultCrop);
    setCropModalOpen(true);
  };

  const openEditCrop = (crop: any) => {
    setEditingCropId(crop.id);
    setCropForm({
      name: crop.name, field: crop.field, status: crop.status,
      health: crop.health, area: crop.area, planted: crop.planted, harvest: crop.harvest
    });
    setCropModalOpen(true);
  };

  const handleSaveCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCropId) {
      setActiveCrops(activeCrops.map(c => c.id === editingCropId ? { ...cropForm, id: editingCropId } : c));
    } else {
      setActiveCrops([...activeCrops, { ...cropForm, id: Date.now() }]);
    }
    setCropModalOpen(false);
    setCropForm(defaultCrop);
  };

  const deleteCrop = (id: number) => {
    setActiveCrops(activeCrops.filter(c => c.id !== id));
  };

  const dismissNotification = (id: number) => {
    setActiveNotifications(activeNotifications.filter(n => n.id !== id));
  };

  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: "You", text: newMsg, time: "Just now" }]);
    setNewMsg("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now(), sender: "Manager", text: "Received! I will check on this and get back to you.", time: "Just now" }]);
    }, 1500);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    })
  };

  return (
    <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans font-light transition-colors duration-500 relative overflow-x-hidden">
      
      {/* ═══════════════════ THREE.JS BACKGROUND ═══════════════════ */}
      <DashboardBackground />

      {/* ═══════════════════ LEFT SIDEBAR ═══════════════════ */}
      <AnimatePresence initial={false}>
        <motion.aside 
          initial={false}
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
          animate={{ width: isSidebarOpen ? 256 : 80 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-col h-screen sticky top-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border-r border-zinc-200 dark:border-white/10 p-4 justify-between flex-shrink-0 transition-colors duration-500 relative z-20 overflow-hidden whitespace-nowrap shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)]"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-10 h-10 px-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center text-sm text-white shadow-lg flex-shrink-0">
                JF
              </div>
              {isSidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{profileData.fullName}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-white/40 truncate w-32">{profileData.email}</p>
                </motion.div>
              )}
            </div>

            <nav className="flex flex-col gap-2 mb-8 flex-1">
              {sidebarNavMain.map((item) => {
                const Icon = item.icon;
                const active = activeNav === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveNav(item.id)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-all duration-300 text-left w-full ${
                      active
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                        : "text-zinc-500 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white/80 hover:bg-zinc-100 dark:hover:bg-white/5 border border-transparent"
                    }`}
                    title={!isSidebarOpen ? item.label : ""}
                  >
                    <Icon size={20} strokeWidth={1.5} className="flex-shrink-0" />
                    {isSidebarOpen && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {item.label}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                className="flex items-center gap-3 px-3 py-3 rounded-md text-sm text-red-500 dark:text-red-400/60 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all duration-300 border border-transparent hover:border-red-200 dark:hover:border-red-500/10"
                title={!isSidebarOpen ? "Logout" : ""}
              >
                <LogOut size={20} strokeWidth={1.5} className="flex-shrink-0" />
                {isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Logout</motion.span>}
              </Link>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <div className="flex-1 relative z-10 flex flex-col w-full max-w-full">
        <header className="sticky top-0 z-40 bg-zinc-50/60 dark:bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 px-8 py-4 flex items-center justify-between transition-colors duration-500">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-white/40">
            <Sprout size={14} className="text-green-500" strokeWidth={1.5} />
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span className="text-zinc-900 dark:text-white/70 capitalize">{activeNav}</span>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setChatOpen(!chatOpen)}
              className="w-9 h-9 flex items-center justify-center border border-zinc-200 dark:border-white/10 hover:border-green-500/30 text-zinc-500 dark:text-white transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-md"
            >
              <MessageSquare size={16} strokeWidth={1.5} />
            </motion.button>
            {mounted && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="w-9 h-9 flex items-center justify-center border border-zinc-200 dark:border-white/10 hover:border-green-500/30 text-zinc-500 dark:text-white transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-md"
              >
                {resolvedTheme === "dark" ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
              </motion.button>
            )}

            
            <div className="relative">
              <button onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')} className="w-9 h-9 bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center text-xs text-white shadow-md rounded-full hover:scale-105 transition-transform">
                JF
              </button>
              <AnimatePresence>
                {activeDropdown === 'profile' && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-2 w-56 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl shadow-2xl py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-zinc-200 dark:border-white/10 mb-2">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{profileData.fullName}</p>
                      <p className="text-[10px] text-zinc-500 dark:text-white/50 truncate">{profileData.email}</p>
                    </div>
                    <button onClick={() => {setActiveDropdown(null); setActiveNav('profile');}} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-3 text-zinc-600 dark:text-white/70 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-500 transition-colors"><User size={14}/> View Profile</button>
                    <button onClick={() => {setActiveDropdown(null); setActiveNav('profile'); setIsEditingProfile(true);}} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-3 text-zinc-600 dark:text-white/70 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-500 transition-colors"><Settings size={14}/> Edit Profile</button>
                    <button onClick={() => {setActiveDropdown(null); setChatOpen(true);}} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-3 text-zinc-600 dark:text-white/70 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-500 transition-colors"><MessageSquare size={14}/> Open Chat</button>
                    <Link href="/login" className="w-full text-left px-4 py-2.5 mt-2 text-xs flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border-t border-zinc-200 dark:border-white/10"><LogOut size={14}/> Log Out</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="p-8 flex gap-8 min-h-max">
          <div className="flex-1 flex flex-col gap-8 pb-24">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-normal font-gelasio tracking-wide capitalize text-zinc-900 dark:text-white">{activeNav}</h1>
              <div className="relative z-20">
                <button onClick={() => setActiveDropdown(activeDropdown === 'date' ? null : 'date')} className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors group cursor-pointer border border-transparent hover:border-zinc-300 dark:hover:border-white/20">
                  <span className="text-xs text-zinc-500 dark:text-white/40 uppercase tracking-widest group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{selectedDateFilter}</span>
                  <Calendar size={14} className="text-zinc-500 dark:text-white/40 group-hover:text-green-500 transition-colors" strokeWidth={1.5} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'date' && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-2 w-48 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                      {["Today", "Yesterday", "Last 7 Days", "This Month", "This Year"].map(t => (
                        <button key={t} onClick={() => {setSelectedDateFilter(t); setActiveDropdown(null);}} className={`w-full text-left px-4 py-2.5 text-xs ${selectedDateFilter === t ? 'text-green-500 bg-zinc-100 dark:bg-white/5' : 'text-zinc-600 dark:text-white/70'} hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-500 transition-colors`}>{t}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* ════════ OVERVIEW TAB ════════ */}
              {activeNav === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-[#0c0c0e]/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-6 rounded-3xl hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all duration-500 group shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs text-zinc-500 dark:text-white/40 uppercase tracking-widest">{stat.label}</span>
                            <Icon size={16} className="text-zinc-400 dark:text-white/20 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors" strokeWidth={1.5} />
                          </div>
                          <p className="text-2xl text-zinc-900 dark:text-white font-normal font-gelasio mb-2">{stat.value}</p>
                          <div className={`flex items-center gap-1 text-xs ${stat.up ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                            {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {stat.change}
                            <span className="text-zinc-400 dark:text-white/30 ml-1">vs last month</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <motion.div custom={2} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-[#0c0c0e]/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.1)] transition-shadow duration-500">
                      <div className="flex items-center justify-between mb-8 relative z-20">
                        <h3 className="text-lg font-gelasio text-zinc-900 dark:text-white">Crop Distribution</h3>
                        <div className="relative">
                          <button onClick={() => setActiveDropdown(activeDropdown === 'cropDist' ? null : 'cropDist')} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors text-zinc-400 dark:text-white/20 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                            <MoreHorizontal size={16} strokeWidth={1.5} />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === 'cropDist' && (
                              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-2 w-48 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                                <button onClick={() => { setActiveDropdown(null); setDonutKey(k => k + 1); }} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-3 text-zinc-600 dark:text-white/70 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-500 transition-colors"><RefreshCw size={14}/> Refresh Chart Data</button>
                                <button onClick={() => { setActiveDropdown(null); setActiveNav('crops'); }} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-3 text-zinc-600 dark:text-white/70 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-500 transition-colors"><Sprout size={14}/> View Crop Details</button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <DonutChart key={donutKey} />
                    </motion.div>

                    <motion.div custom={3} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-[#0c0c0e]/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.1)] transition-shadow duration-500">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-gelasio text-zinc-900 dark:text-white">Total Yield</h3>
                          <p className="text-xs text-zinc-500 dark:text-white/40 mt-1">January — December 2026</p>
                        </div>
                        <p className="text-2xl font-gelasio text-green-600 dark:text-green-400">12,840 <span className="text-xs text-zinc-500 dark:text-white/40">kg</span></p>
                      </div>
                      <div className="h-20">
                        <MiniChart data={yieldData} />
                      </div>
                      <div className="flex justify-between mt-3">
                        {months.map((m, i) => (
                          <span key={i} className="text-[9px] text-zinc-400 dark:text-white/20">{m}</span>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-[#0c0c0e]/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:shadow-green-500/10 hover:border-green-500/30 transition-all duration-500">
                    <div className="flex items-center justify-between mb-6 relative z-20">
                      <h3 className="text-lg font-gelasio text-zinc-900 dark:text-white">Active Crops Overview</h3>
                      <div className="relative">
                        <button onClick={() => setActiveDropdown(activeDropdown === 'activeCrops' ? null : 'activeCrops')} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors text-zinc-400 dark:text-white/20 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                          <MoreHorizontal size={16} strokeWidth={1.5} />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === 'activeCrops' && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-2 w-56 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                              <button onClick={() => {setActiveDropdown(null); openAddCrop();}} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-3 text-zinc-600 dark:text-white/70 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-500 transition-colors"><Plus size={14}/> Add New Crop</button>
                              <button onClick={() => {setActiveDropdown(null); setActiveNav('crops');}} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-3 text-zinc-600 dark:text-white/70 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-500 transition-colors"><Edit size={14}/> Manage All Crops</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-zinc-200 dark:border-white/5">
                            <th className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest pb-4 font-normal">Crop</th>
                            <th className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest pb-4 font-normal">Field</th>
                            <th className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest pb-4 font-normal">Status</th>
                            <th className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest pb-4 font-normal">Health</th>
                            <th className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest pb-4 font-normal">Area</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeCrops.slice(0, 5).map((crop) => (
                            <tr key={crop.id} className="border-b border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                              <td className="py-4 text-sm font-gelasio text-zinc-900 dark:text-white/90">{crop.name}</td>
                              <td className="py-4 text-sm text-zinc-500 dark:text-white/50">{crop.field}</td>
                              <td className="py-4">
                                <span className={`text-xs px-3 py-1 border ${
                                  crop.status === "Growing" ? "text-green-600 dark:text-green-400 border-green-500/20 bg-green-500/10 dark:bg-green-500/5" :
                                  crop.status === "Harvesting" ? "text-yellow-600 dark:text-yellow-400 border-yellow-500/20 bg-yellow-500/10 dark:bg-yellow-500/5" :
                                  crop.status === "Seedling" ? "text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/10 dark:bg-blue-500/5" :
                                  "text-purple-600 dark:text-purple-400 border-purple-500/20 bg-purple-500/10 dark:bg-purple-500/5"
                                }`}>{crop.status}</span>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-16 h-1.5 bg-zinc-200 dark:bg-white/5 overflow-hidden">
                                    <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${crop.health}%` }} />
                                  </div>
                                  <span className="text-xs text-zinc-500 dark:text-white/50">{crop.health}%</span>
                                </div>
                              </td>
                              <td className="py-4 text-sm text-zinc-500 dark:text-white/50">{crop.area}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* ════════ CROPS TAB ════════ */}
              {activeNav === "crops" && (
                <motion.div key="crops" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-500 dark:text-white/40">Manage your active crops, plan harvests, and track growth.</p>
                    <motion.button onClick={openAddCrop} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-4 py-2 text-xs uppercase tracking-widest hover:bg-green-500/20 transition-colors">
                      <Plus size={14} strokeWidth={1.5} /> Add Crop
                    </motion.button>
                  </div>

                  <div className="flex flex-col gap-4 mb-2 mt-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex-1 min-w-[200px] max-w-md flex items-center bg-white/70 dark:bg-white/5 backdrop-blur-md border border-zinc-200 dark:border-white/10 px-4 py-2.5 gap-3">
                        <Search size={14} className="text-zinc-500 dark:text-white/40" />
                        <input type="text" value={cropSearchTerm} onChange={e => setCropSearchTerm(e.target.value)} placeholder="Search crops or fields..." className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-white/30" />
                      </div>
                      <div className="flex items-center gap-2">
                        <select value={cropSortField} onChange={e => setCropSortField(e.target.value as any)} className="bg-white/70 dark:bg-white/5 text-xs text-zinc-700 dark:text-white outline-none border border-zinc-200 dark:border-white/10 px-3 py-2.5">
                          <option value="name" className="bg-white text-black">Sort by Name</option>
                          <option value="status" className="bg-white text-black">Sort by Status</option>
                          <option value="health" className="bg-white text-black">Sort by Health</option>
                        </select>
                        <button onClick={() => setCropSortDir(d => d === "asc" ? "desc" : "asc")} className="bg-white/70 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-3 py-2.5 text-zinc-700 dark:text-white flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">
                          {cropSortDir === "asc" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredSortedCrops.map((crop, i) => (
                      <motion.div key={crop.id} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 p-6 hover:border-green-500/30 transition-all duration-300 group shadow-sm dark:shadow-none">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Leaf size={16} className="text-green-500 dark:text-green-400" strokeWidth={1.5} />
                            <h4 className="text-sm text-zinc-900 dark:text-white font-gelasio">{crop.name}</h4>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditCrop(crop)} className="text-zinc-400 dark:text-white/30 hover:text-green-600 dark:hover:text-white transition-colors"><Edit size={14} strokeWidth={1.5} /></button>
                            <button onClick={() => deleteCrop(crop.id)} className="text-zinc-400 dark:text-white/30 hover:text-red-500 dark:hover:text-red-400 transition-colors"><Trash2 size={14} strokeWidth={1.5} /></button>
                          </div>
                        </div>
                        <div className="space-y-3 text-xs text-zinc-500 dark:text-white/50">
                          <div className="flex justify-between"><span>Field</span><span className="text-zinc-800 dark:text-white/70">{crop.field}</span></div>
                          <div className="flex justify-between">
                            <span>Status</span>
                            <span className={
                              crop.status === "Growing" ? "text-green-600 dark:text-green-400" :
                              crop.status === "Harvesting" ? "text-yellow-600 dark:text-yellow-400" :
                              crop.status === "Seedling" ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400"
                            }>{crop.status}</span>
                          </div>
                          <div className="flex justify-between"><span>Planted</span><span className="text-zinc-800 dark:text-white/70">{crop.planted}</span></div>
                          <div className="flex justify-between"><span>Harvest</span><span className="text-zinc-800 dark:text-white/70">{crop.harvest}</span></div>
                          <div className="flex justify-between"><span>Area</span><span className="text-zinc-800 dark:text-white/70">{crop.area}</span></div>
                          <div className="flex justify-between items-center">
                            <span>Health</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-zinc-200 dark:bg-white/5 overflow-hidden"><div className="h-full bg-green-500 transition-all" style={{ width: `${crop.health}%` }} /></div>
                              <span className="text-zinc-800 dark:text-white/70">{crop.health}%</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ════════ PROFILE TAB ════════ */}
              {activeNav === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
                  <div className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 p-8 shadow-sm dark:shadow-none">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center text-2xl text-white font-gelasio shadow-lg">JF</div>
                        <div>
                          <h3 className="text-xl font-gelasio text-zinc-900 dark:text-white">{profileData.fullName}</h3>
                          <p className="text-xs text-zinc-500 dark:text-white/40 uppercase tracking-widest mt-1">Enterprise Account</p>
                        </div>
                      </div>
                      <motion.button 
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${isEditingProfile ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-white/50 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20'}`}
                      >
                        {isEditingProfile ? <><Check size={14} /> Save Profile</> : <><Edit size={14} /> Edit Profile</>}
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: "fullName", label: "Full Name", value: profileData.fullName },
                        { key: "email", label: "Email", value: profileData.email },
                        { key: "phone", label: "Phone", value: profileData.phone },
                        { key: "nic", label: "NIC", value: profileData.nic },
                        { key: "address", label: "Farm Address", value: profileData.address },
                        { key: "type", label: "Farming Type", value: profileData.type },
                        { key: "teamSize", label: "Team Size", value: profileData.teamSize },
                        { key: "memberSince", label: "Member Since", value: profileData.memberSince, readOnly: true },
                      ].map((field) => (
                        <div key={field.key} className="border-b border-zinc-200 dark:border-white/5 pb-4">
                          <p className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest mb-2">{field.label}</p>
                          {isEditingProfile && !field.readOnly ? (
                            <input 
                              type="text"
                              value={field.value}
                              onChange={(e) => setProfileData({...profileData, [field.key]: e.target.value})}
                              className="w-full bg-transparent border-b border-green-500/50 pb-1 outline-none text-sm text-zinc-900 dark:text-white font-gelasio"
                            />
                          ) : (
                            <p className="text-sm text-zinc-900 dark:text-white/80 font-gelasio">{field.value}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ═══════════════════ RIGHT PANEL ═══════════════════ */}
          <aside className="hidden xl:flex flex-col w-72 gap-8 flex-shrink-0 relative z-10">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 p-6 shadow-sm dark:shadow-none">
              <h3 className="text-sm font-gelasio mb-6 flex items-center justify-between text-zinc-900 dark:text-white">
                Notifications
                <span className="text-[10px] text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5">{activeNotifications.length}</span>
              </h3>
              <div className="flex flex-col gap-4">
                {activeNotifications.length === 0 && (
                  <p className="text-xs text-zinc-500 dark:text-white/40">You're all caught up!</p>
                )}
                {activeNotifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} onClick={() => dismissNotification(n.id)} className="flex items-start gap-3 group cursor-pointer">
                      <div className="w-8 h-8 bg-zinc-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/10 transition-colors shadow-sm dark:shadow-none">
                        <Icon size={14} className="text-zinc-400 dark:text-white/40 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-700 dark:text-white/70 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{n.text}</p>
                        <p className="text-[10px] text-zinc-400 dark:text-white/30 mt-1">{n.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </aside>
        </main>

        <footer className="border-t border-zinc-200 dark:border-white/5 px-8 py-6 flex items-center justify-between text-[10px] text-zinc-500 dark:text-white/20 uppercase tracking-widest relative z-10 bg-white/50 dark:bg-zinc-950/60 backdrop-blur-xl mt-auto">
          <span>© 2026 Crop Mgr Assist. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white/50 transition-colors">Terms</Link>
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-white/50 transition-colors">Home</Link>
          </div>
        </footer>
      </div>

      {/* ════════ MANAGER P2P CHAT ════════ */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 bg-white/70 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden rounded-xl"
            style={{ height: '400px' }}
          >
            <div onPointerDown={(e) => dragControls.start(e)} className="bg-zinc-100/50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/10 p-4 flex items-center justify-between cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 flex items-center justify-center rounded-full text-green-600 dark:text-green-400"><User size={14} /></div>
                <div>
                  <h4 className="text-sm font-gelasio text-zinc-900 dark:text-white">Manager Chat</h4>
                  <p className="text-[10px] text-green-500 uppercase tracking-widest">Online</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-zinc-50/50 dark:bg-transparent">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                  <span className="text-[9px] text-zinc-400 dark:text-white/30 mb-1">{msg.sender} • {msg.time}</span>
                  <div className={`px-4 py-2 text-xs max-w-[85%] leading-relaxed ${
                    msg.sender === "You" ? "bg-green-500 text-white rounded-l-xl rounded-tr-xl" : "bg-zinc-200/50 dark:bg-white/10 text-zinc-900 dark:text-white rounded-r-xl rounded-tl-xl"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMsg} className="p-3 border-t border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/20 flex gap-2">
              <input 
                type="text" 
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none focus:border-green-500/50 rounded-md"
              />
              <button type="submit" className="bg-green-500 text-white w-9 h-9 flex items-center justify-center hover:bg-green-600 transition-colors rounded-md">
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════ ADD/EDIT CROP MODAL ════════ */}
      <AnimatePresence>
        {isCropModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white/70 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-8 w-full max-w-md rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-gelasio mb-6 text-zinc-900 dark:text-white">{editingCropId ? "Edit Crop" : "Add New Crop"}</h3>
              <form onSubmit={handleSaveCrop} className="flex flex-col gap-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1 block">Crop Name</label>
                    <input required value={cropForm.name} onChange={(e) => setCropForm({...cropForm, name: e.target.value})} type="text" className="w-full bg-white/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-green-500/50 outline-none transition-colors" placeholder="e.g. Rice (Samba)" />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1 block">Field</label>
                    <input required value={cropForm.field} onChange={(e) => setCropForm({...cropForm, field: e.target.value})} type="text" className="w-full bg-white/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-green-500/50 outline-none transition-colors" placeholder="e.g. Field A-01" />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1 block">Area (ha)</label>
                    <input required value={cropForm.area} onChange={(e) => setCropForm({...cropForm, area: e.target.value})} type="text" className="w-full bg-white/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-green-500/50 outline-none transition-colors" placeholder="e.g. 2.5 ha" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1 block">Status</label>
                    <select required value={cropForm.status} onChange={(e) => setCropForm({...cropForm, status: e.target.value})} className="w-full bg-white/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-green-500/50 outline-none transition-colors">
                      <option value="Seedling" className="bg-white text-black">Seedling</option>
                      <option value="Growing" className="bg-white text-black">Growing</option>
                      <option value="Mature" className="bg-white text-black">Mature</option>
                      <option value="Harvesting" className="bg-white text-black">Harvesting</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1 block">Health (%)</label>
                    <input required min="0" max="100" value={cropForm.health} onChange={(e) => setCropForm({...cropForm, health: Number(e.target.value)})} type="number" className="w-full bg-white/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-green-500/50 outline-none transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1 block">Planted Date</label>
                    <input required value={cropForm.planted} onChange={(e) => setCropForm({...cropForm, planted: e.target.value})} type="date" className="w-full bg-white/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2 text-sm text-zinc-900 dark:text-white focus:border-green-500/50 outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1 block">Expected Harvest</label>
                    <input required value={cropForm.harvest} onChange={(e) => setCropForm({...cropForm, harvest: e.target.value})} type="date" className="w-full bg-white/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2 text-sm text-zinc-900 dark:text-white focus:border-green-500/50 outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]" />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setCropModalOpen(false)} className="flex-1 py-2.5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-white/50 text-xs uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 text-green-600 dark:text-green-400 text-xs uppercase tracking-widest hover:bg-green-500/20 dark:hover:bg-green-500/30 transition-colors">
                    {editingCropId ? "Update Crop" : "Save Crop"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════ SEARCH MODAL ════════ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-32"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSearchOpen(false);
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: -20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="bg-white/70 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center px-4 py-3 border-b border-zinc-200 dark:border-white/5">
                <Search size={18} className="text-zinc-400 dark:text-white/40 mr-3" strokeWidth={1.5} />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-white/30" 
                  placeholder="Search crops, fields, notifications..." 
                />
                <button onClick={() => setSearchOpen(false)} className="text-[10px] text-zinc-500 dark:text-white/30 border border-zinc-200 dark:border-white/10 px-2 py-1 hover:text-zinc-900 dark:hover:text-white transition-colors">ESC</button>
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                {searchQuery ? (
                  activeCrops.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.field.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                    activeCrops.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.field.toLowerCase().includes(searchQuery.toLowerCase())).map(crop => (
                      <div key={crop.id} className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between" onClick={() => { setActiveNav("crops"); setSearchOpen(false); }}>
                        <div className="flex items-center gap-3">
                          <Sprout size={14} className="text-green-500 dark:text-green-400" />
                          <span className="text-sm font-gelasio text-zinc-900 dark:text-white">{crop.name}</span>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-white/40">{crop.field}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-xs text-zinc-500 dark:text-white/40">No results found for "{searchQuery}"</div>
                  )
                ) : (
                  <div className="px-4 py-8 text-center text-xs text-zinc-500 dark:text-white/40">Type to start searching...</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════ MOBILE BOTTOM NAV ═══════════════════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-white/10 px-6 py-3 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] safe-area-pb">
        {sidebarNavMain.map((item) => {
          const Icon = item.icon;
          const active = activeNav === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveNav(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors duration-300 ${
                active ? "text-green-600 dark:text-green-400" : "text-zinc-500 dark:text-white/40 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <div className={`p-1.5 rounded-full transition-colors ${active ? "bg-green-500/10" : "bg-transparent"}`}>
                <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              </div>
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
