"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sun, Moon, LogOut, Search, Bell, Users, Sprout,
  ArrowUpRight, ArrowDownRight, User, Leaf, MapPin, Calendar,
  MessageSquare, Send, X, Filter, SortAsc, SortDesc, Eye,
  Mail, BarChart3, Shield, Check, Plus, Trash2, Tag, CheckCircle, ChevronLeft, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen, Settings
} from "lucide-react";
import { useTheme } from "next-themes";
import DashboardBackground from "../../components/DashboardBackground";

/* ═══════ TYPES ═══════ */
interface FarmerUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  nic: string;
  address: string;
  crops: CropDetail[];
  memberSince: string;
  status: "active" | "inactive" | "pending" | "suspended";
  teamSize: number;
}

interface CropDetail {
  id: number;
  name: string;
  field: string;
  status: string;
  health: number;
  planted: string;
  harvest: string;
  area: string;
  tags?: string[];
}

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  time: string;
  farmerId: number;
}

/* ═══════ NO MOCK FARMERS ═══════ */

/* ═══════ NAV TABS ═══════ */
type TabId = "overview" | "users" | "crops" | "messages";

const navTabs: { label: string; id: TabId; icon: any }[] = [
  { label: "Overview", id: "overview", icon: BarChart3 },
  { label: "Manage Users", id: "users", icon: Users },
  { label: "Crop Details", id: "crops", icon: Sprout },
  { label: "Messages", id: "messages", icon: MessageSquare },
];

export default function ManagerDashboard() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [isNavOpen, setIsNavOpen] = useState(true);
  
  // Users state
  const [farmers, setFarmers] = useState<FarmerUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | "status" | "teamSize" | "crops">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "pending" | "suspended">("all");
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerUser | null>(null);
  
  // Add User State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", nic: "", address: "" });
  
  // Crops state
  const [cropSearch, setCropSearch] = useState("");
  const [cropUserFilter, setCropUserFilter] = useState<number | "all">("all");
  const [newTagInputs, setNewTagInputs] = useState<Record<number, string>>({});
  
  // Messages state
  const [chatFarmer, setChatFarmer] = useState<FarmerUser | null>(null);
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "John Farmer", text: "Field A-01 moisture is dropping. Please advise.", time: "09:15 AM", farmerId: 1 },
    { id: 2, sender: "Manager", text: "Increase irrigation cycle to 2x daily.", time: "09:20 AM", farmerId: 1 },
    { id: 3, sender: "Nimali Perera", text: "Cinnamon harvest ready. Need transport.", time: "10:00 AM", farmerId: 2 },
    { id: 4, sender: "Kamal Silva", text: "Pest detected in coconut field E-04.", time: "11:30 AM", farmerId: 3 },
  ]);
  const [newMsg, setNewMsg] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    setMounted(true);
    
    // Check if the user is logged in and has the MANAGER role
    const savedUserStr = localStorage.getItem("cropAssistUser");
    if (savedUserStr) {
      try {
        const user = JSON.parse(savedUserStr);
        if (user.role !== "MANAGER") {
          router.push("/dashboard"); // Redirect FARMERS to their dashboard
          return;
        }
      } catch (err) {
        router.push("/login"); // Corrupted session, go to login
        return;
      }
    } else {
      router.push("/login"); // No session, go to login
      return;
    }
    
    // Fetch users from backend (as this is the Manager page, we need all users)
    fetch("http://localhost:8081/Api/users")
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          const loadedFarmers: FarmerUser[] = data.map((u: any) => ({
            id: u.id,
            name: u.fullName || "Unknown",
            email: u.email || "",
            username: u.username || "",
            phone: u.phone || "N/A",
            nic: u.nic || "",
            age: (u.age || "").toString(),
            address: u.address || "N/A",
            role: u.role || "FARMER",
            memberSince: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Recently",
            status: u.status ? u.status.toLowerCase() as FarmerUser["status"] : "pending",
            teamSize: u.teamSize || 1,
            crops: []
          }));
          
          setFarmers(loadedFarmers);
        }
      })
      .catch(err => console.error("Failed to fetch backend users:", err));
  }, []);
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, chatFarmer]);

  // Derived Stats
  const managerStats = [
    { label: "Total Farmers", value: farmers.length.toString(), change: "+2", up: true, icon: Users, color: "green" },
    { label: "Active Crops", value: farmers.flatMap(f => f.crops).length.toString(), change: "+3", up: true, icon: Sprout, color: "green" },
    { label: "Pending Approvals", value: farmers.filter(f => f.status === "pending").length.toString(), change: "0", up: false, icon: Shield, color: "red" },
    { label: "Total Fields", value: "23 ha", change: "+4.2", up: true, icon: MapPin, color: "green" },
  ];

  // Filtered & sorted farmers
  const filteredFarmers = farmers
    .filter(f => statusFilter === "all" || f.status === statusFilter)
    .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.email.toLowerCase().includes(searchQuery.toLowerCase()) || f.nic.includes(searchQuery))
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else if (sortField === "status") cmp = a.status.localeCompare(b.status);
      else if (sortField === "teamSize") cmp = a.teamSize - b.teamSize;
      else if (sortField === "crops") cmp = a.crops.length - b.crops.length;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState("All Time");
  const [adminNotifications, setAdminNotifications] = useState([
    { id: 1, text: "A new farmer requested approval." },
    { id: 2, text: "System backup completed successfully." },
    { id: 3, text: "High server load detected in region Asia-South." }
  ]);

  const isDateInFilter = (dateString: string, filter: string) => {
    if (!dateString) return true;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filter === "Today") {
      return date.toDateString() === today.toDateString();
    } else if (filter === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return date.toDateString() === yesterday.toDateString();
    } else if (filter === "Last 7 Days") {
      const last7 = new Date(today);
      last7.setDate(last7.getDate() - 7);
      return date >= last7;
    } else if (filter === "This Month") {
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    } else if (filter === "This Year") {
      return date.getFullYear() === today.getFullYear();
    }
    return true; // For any other value like "All Time"
  };

  // All crops from all farmers
  const allCrops = farmers.flatMap(f => f.crops.map(c => ({ ...c, farmerName: f.name, farmerId: f.id })));
  const filteredCrops = allCrops
    .filter(c => isDateInFilter(c.date, selectedDateFilter))
    .filter(c => cropUserFilter === "all" || c.farmerId === cropUserFilter)
    .filter(c => c.name.toLowerCase().includes(cropSearch.toLowerCase()) || c.field.toLowerCase().includes(cropSearch.toLowerCase()) || c.tags?.some(t => t.toLowerCase().includes(cropSearch.toLowerCase())));

  const dismissNotification = (id: number) => setAdminNotifications(prev => prev.filter(n => n.id !== id));

  /* ═══════ ACTIONS ═══════ */
  
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const backendPayload = {
      fullName: newUser.name,
      username: (newUser as any).username || newUser.name.split(" ")[0].toLowerCase(),
      email: newUser.email,
      nic: newUser.nic,
      age: (newUser as any).age ? parseInt((newUser as any).age) : null,
      phone: newUser.phone,
      address: newUser.address,
      passwordHash: "pending_setup",
      farmingType: "N/A",
      teamSize: 1,
      role: "FARMER",
      status: "PENDING"
    };

    try {
      const res = await fetch("http://localhost:8081/Api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendPayload)
      });
      if (res.ok) {
        const data = await res.json();
        const createdUser: FarmerUser = {
          id: data.id,
          ...newUser,
          status: data.status ? data.status.toLowerCase() as FarmerUser["status"] : "pending",
          memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          teamSize: data.teamSize || 1,
          crops: []
        };
        setFarmers([createdUser, ...farmers]);
        setIsAddUserOpen(false);
        setNewUser({ name: "", email: "", phone: "", nic: "", address: "" });
      }
    } catch(err) {
      console.error("Error creating user:", err);
    }
  };

  const updateUserStatus = async (id: number, newStatus: FarmerUser["status"] | "deleted") => {
    try {
      if (newStatus === "deleted") {
        await fetch(`http://localhost:8081/Api/users/${id}`, { method: "DELETE" });
        setFarmers(farmers.filter(f => f.id !== id));
        if (selectedFarmer?.id === id) setSelectedFarmer(null);
      } else {
        const backendStatus = newStatus.toUpperCase();
        await fetch(`http://localhost:8081/Api/users/${id}/status?status=${backendStatus}`, { method: "PUT" });
        const updated = farmers.map(f => f.id === id ? { ...f, status: newStatus as FarmerUser["status"] } : f);
        setFarmers(updated);
        if (selectedFarmer?.id === id) setSelectedFarmer({ ...selectedFarmer, status: newStatus as FarmerUser["status"] });
      }
    } catch(err) {
      console.error("Error updating status:", err);
    }
  };

  const approveCrop = (cropId: number, farmerId: number) => {
    setFarmers(farmers.map(f => {
      if (f.id === farmerId) {
        return {
          ...f,
          crops: f.crops.map(c => c.id === cropId ? { ...c, status: "Approved" } : c)
        };
      }
      return f;
    }));
  };

  const handleAddTag = (cropId: number, farmerId: number) => {
    const tag = newTagInputs[cropId];
    if (!tag?.trim()) return;
    setFarmers(farmers.map(f => {
      if (f.id === farmerId) {
        return {
          ...f,
          crops: f.crops.map(c => c.id === cropId ? { ...c, tags: [...(c.tags || []), tag.trim()] } : c)
        };
      }
      return f;
    }));
    setNewTagInputs(prev => ({ ...prev, [cropId]: "" }));
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !chatFarmer) return;
    setAllMessages(prev => [...prev, { id: Date.now(), sender: "Manager", text: newMsg, time: "Just now", farmerId: chatFarmer.id }]);
    setNewMsg("");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    })
  };

  const statusColor = (s: string) => {
    if (s === "active") return "text-green-500 bg-green-500/10 border-green-500/20";
    if (s === "inactive" || s === "suspended") return "text-red-400 bg-red-500/10 border-red-500/20";
    return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  };

  const cropStatusColor = (s: string) => {
    if (s === "Approved") return "text-blue-500 border-blue-500/20 bg-blue-500/10";
    if (s === "Growing") return "text-green-500 border-green-500/20 bg-green-500/10";
    if (s === "Harvesting") return "text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
    if (s === "Seedling") return "text-teal-400 border-teal-500/20 bg-teal-500/10";
    return "text-purple-400 border-purple-500/20 bg-purple-500/10";
  };

  const farmerMessages = chatFarmer ? allMessages.filter(m => m.farmerId === chatFarmer.id) : [];
  
  const unreadCounts = farmers.reduce((acc, f) => {
    acc[f.id] = allMessages.filter(m => m.farmerId === f.id && m.sender !== "Manager").length;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="flex flex-col min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans font-light transition-colors duration-500 relative overflow-x-hidden">
      
      <DashboardBackground />

      {/* ═══════════════════ TOP HEADER BAR ═══════════════════ */}
      <header className="sticky top-0 z-40 bg-white/50 dark:bg-zinc-950/40 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 px-8 py-4 flex items-center justify-between transition-colors duration-500 relative">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Sprout size={20} className="text-green-500" strokeWidth={1.5} />
            <span className="hidden sm:inline text-sm text-zinc-900 dark:text-white font-gelasio tracking-wide">Crop Mgr Assist</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-2 ml-6">
            <button onClick={() => setIsNavOpen(!isNavOpen)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-green-500 transition-colors">
              {isNavOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
            <nav className="flex items-center bg-zinc-100/80 dark:bg-white/5 border border-zinc-200 dark:border-white/10 p-1 rounded-md overflow-hidden whitespace-nowrap">
              {navTabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(tab.id)}
                    animate={{ width: isNavOpen ? "auto" : "40px", paddingLeft: isNavOpen ? "1rem" : "0", paddingRight: isNavOpen ? "1rem" : "0" }}
                    className={`flex items-center justify-center gap-2 py-2 text-xs transition-colors duration-300 ${
                      active
                        ? "bg-white dark:bg-white/10 text-green-600 dark:text-green-400 shadow-sm dark:shadow-none border border-zinc-200 dark:border-white/10 rounded-sm"
                        : "text-zinc-500 dark:text-white/40 hover:text-zinc-900 dark:hover:text-white/70 border border-transparent"
                    }`}
                    title={!isNavOpen ? tab.label : ""}
                  >
                    <Icon size={16} strokeWidth={1.5} className="flex-shrink-0" />
                    {isNavOpen && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {tab.label}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center border border-zinc-200 dark:border-white/10 hover:border-green-500/30 text-zinc-500 dark:text-white transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-full"
            >
              {resolvedTheme === "dark" ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
            </motion.button>
          )}
          <div className="relative">
            <button onClick={() => setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications')} className="relative w-9 h-9 flex items-center justify-center border border-zinc-200 dark:border-white/10 hover:border-green-500/30 text-zinc-500 dark:text-white transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-full cursor-pointer">
              <Bell size={16} strokeWidth={1.5} />
              {adminNotifications.length > 0 && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-zinc-50 dark:border-zinc-950 rounded-full" />}
            </button>
            <AnimatePresence>
              {activeDropdown === 'notifications' && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-2 w-80 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-widest">Admin Alerts</span>
                    <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">{adminNotifications.length} New</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {adminNotifications.length > 0 ? adminNotifications.map(notif => (
                      <div key={notif.id} className="flex gap-3 p-4 border-b border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                          <Bell size={14} className="text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0 flex items-center justify-between">
                          <p className="text-xs text-zinc-800 dark:text-white/80 line-clamp-2">{notif.text}</p>
                          <button onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-colors ml-2">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-zinc-500 dark:text-white/40 text-xs">No new alerts</div>
                    )}
                  </div>
                  <button onClick={() => { setAdminNotifications([]); setActiveDropdown(null); }} className="w-full py-3 text-[10px] text-zinc-500 dark:text-white/40 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors uppercase tracking-widest text-center border-t border-zinc-200 dark:border-white/10">Clear All</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')} className="w-9 h-9 bg-gradient-to-br from-red-500 to-green-500 flex items-center justify-center text-xs text-white shadow-md rounded-full hover:scale-105 transition-transform cursor-pointer">
              MG
            </button>
            <AnimatePresence>
              {activeDropdown === 'profile' && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-2 w-56 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl shadow-2xl py-2 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-white/10 mb-2">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">Admin Manager</p>
                    <p className="text-[10px] text-zinc-500 dark:text-white/50 truncate">admin@farmhub.com</p>
                  </div>
                  <button onClick={() => { setActiveDropdown(null); setTheme(resolvedTheme === "dark" ? "light" : "dark"); }} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-3 text-zinc-600 dark:text-white/70 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-500 transition-colors"><Settings size={14}/> Toggle Theme</button>
                  <Link href="/login" className="w-full text-left px-4 py-2.5 mt-2 text-xs flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border-t border-zinc-200 dark:border-white/10"><LogOut size={14}/> Log Out</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <div className="flex-1 relative z-10 flex flex-col w-full max-w-full">
        <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 flex flex-col">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-gelasio tracking-wide text-zinc-900 dark:text-white">Manager Dashboard</h1>
              <p className="text-xs text-zinc-500 dark:text-white/40 mt-1 uppercase tracking-widest">Agricultural Enterprise Management</p>
            </div>
            <div className="relative z-20">
              <button onClick={() => setActiveDropdown(activeDropdown === 'date' ? null : 'date')} className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors group cursor-pointer border border-transparent hover:border-zinc-300 dark:hover:border-white/20">
                <Calendar size={14} className="text-zinc-500 dark:text-white/40 group-hover:text-green-500 transition-colors" strokeWidth={1.5} />
                <span className="text-xs text-zinc-500 dark:text-white/40 uppercase tracking-widest group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{selectedDateFilter}</span>
              </button>
              <AnimatePresence>
                {activeDropdown === 'date' && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-2 w-48 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                    {["Today", "Yesterday", "Last 7 Days", "This Month", "This Year", "All Time"].map(t => (
                      <button key={t} onClick={() => { setSelectedDateFilter(t); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2.5 text-xs ${selectedDateFilter === t ? 'text-green-500 bg-zinc-100 dark:bg-white/5' : 'text-zinc-600 dark:text-white/70'} hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-500 transition-colors`}>{t}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        <AnimatePresence mode="wait">

          {/* ════════ OVERVIEW TAB ════════ */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {managerStats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={fadeIn}
                      className="bg-white/70 dark:bg-[#0c0c0e]/70 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 p-6 rounded-3xl hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all duration-500 group shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-zinc-500 dark:text-white/40 uppercase tracking-widest">{stat.label}</span>
                        <div className={`w-8 h-8 flex items-center justify-center ${stat.color === "red" ? "bg-red-500/10" : "bg-green-500/10"}`}>
                          <Icon size={16} className={`${stat.color === "red" ? "text-red-500" : "text-green-500"} group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
                        </div>
                      </div>
                      <p className="text-2xl text-zinc-900 dark:text-white font-gelasio mb-2">{stat.value}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-[#0c0c0e]/70 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.1)] transition-shadow duration-500">
                  <h3 className="text-sm font-gelasio mb-6 text-zinc-900 dark:text-white">Farmer Status</h3>
                  <div className="flex flex-col gap-4">
                    {[
                      { label: "Active", count: farmers.filter(f => f.status === "active").length, color: "bg-green-500", total: farmers.length },
                      { label: "Pending", count: farmers.filter(f => f.status === "pending").length, color: "bg-yellow-500", total: farmers.length },
                      { label: "Inactive/Suspended", count: farmers.filter(f => f.status === "inactive" || f.status === "suspended").length, color: "bg-red-500", total: farmers.length },
                    ].map((s, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-zinc-600 dark:text-white/60">{s.label}</span>
                          <span className="text-zinc-900 dark:text-white">{s.count}</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-200 dark:bg-white/5 overflow-hidden">
                          <div className={`h-full ${s.color} transition-all duration-700`} style={{ width: `${(s.count / Math.max(s.total, 1)) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div custom={5} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-[#0c0c0e]/70 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.1)] transition-shadow duration-500">
                  <h3 className="text-sm font-gelasio mb-6 text-zinc-900 dark:text-white">Crop Health Overview</h3>
                  <div className="flex flex-col gap-3">
                    {allCrops.slice(0, 5).map((crop, i) => (
                      <div key={crop.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Leaf size={12} className="text-green-500" />
                          <span className="text-xs text-zinc-700 dark:text-white/70">{crop.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-zinc-200 dark:bg-white/5 overflow-hidden">
                            <div className={`h-full transition-all ${crop.health > 80 ? "bg-green-500" : crop.health > 60 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${crop.health}%` }} />
                          </div>
                          <span className="text-[10px] text-zinc-500 dark:text-white/40 w-8 text-right">{crop.health}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div custom={6} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-[#0c0c0e]/70 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.1)] transition-shadow duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-gelasio text-zinc-900 dark:text-white">Recent Messages</h3>
                    <button onClick={() => setActiveTab("messages")} className="text-[10px] text-green-500 hover:text-green-600 transition-colors uppercase tracking-widest">View All</button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {allMessages.filter(m => m.sender !== "Manager").slice(-4).map(msg => (
                      <div key={msg.id} className="flex items-start gap-3 group cursor-pointer" onClick={() => { setChatFarmer(farmers.find(f => f.id === msg.farmerId) || null); setActiveTab("messages"); }}>
                        <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-red-500 flex items-center justify-center text-[9px] text-white flex-shrink-0">
                          {msg.sender.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-zinc-800 dark:text-white/70 truncate">{msg.text}</p>
                          <p className="text-[10px] text-zinc-400 dark:text-white/30 mt-0.5">{msg.sender} • {msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

            </motion.div>
          )}

          {/* ════════ MANAGE USERS TAB ════════ */}
          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-4 flex-1">
                  <div className="flex-1 max-w-sm flex items-center bg-white/70 dark:bg-white/5 backdrop-blur-md border border-zinc-200 dark:border-white/10 px-4 py-2.5 gap-3">
                    <Search size={14} className="text-zinc-500 dark:text-white/40" />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, email, or NIC..." className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-white/30" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white/70 dark:bg-white/5 backdrop-blur-md border border-zinc-200 dark:border-white/10 px-3 py-2 gap-2">
                      <Filter size={12} className="text-zinc-500 dark:text-white/40" />
                      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="bg-transparent text-xs text-zinc-700 dark:text-white outline-none">
                        <option value="all" className="bg-white text-black">All Status</option>
                        <option value="active" className="bg-white text-black">Active</option>
                        <option value="inactive" className="bg-white text-black">Inactive</option>
                        <option value="pending" className="bg-white text-black">Pending</option>
                        <option value="suspended" className="bg-white text-black">Suspended</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsAddUserOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-xs uppercase tracking-widest hover:bg-green-600 transition-colors shadow-lg">
                  <Plus size={14} /> Add User
                </button>
              </div>

              <div className="bg-white/70 dark:bg-[#0c0c0e]/70 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02]">
                      <th className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest px-6 py-4 font-normal">Farmer</th>
                      <th className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest px-6 py-4 font-normal">NIC</th>
                      <th className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest px-6 py-4 font-normal">Status</th>
                      <th className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest px-6 py-4 font-normal">Crops</th>
                      <th className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest px-6 py-4 font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFarmers.map((f, i) => (
                      <motion.tr key={f.id} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="border-b border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-red-500 flex items-center justify-center text-[10px] text-white">{f.name.charAt(0)}</div>
                            <div>
                              <p className="text-sm font-gelasio text-zinc-900 dark:text-white/90">{f.name}</p>
                              <p className="text-[10px] text-zinc-400 dark:text-white/30">{f.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-600 dark:text-white/50 font-mono">{f.nic}</td>
                        <td className="px-6 py-4"><span className={`text-[10px] px-2 py-0.5 border capitalize ${statusColor(f.status)}`}>{f.status}</span></td>
                        <td className="px-6 py-4 text-xs text-zinc-600 dark:text-white/50">{f.crops.length}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => setSelectedFarmer(f)} className="w-7 h-7 flex items-center justify-center bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors" title="Manage Profile"><Eye size={12} /></button>
                            <button onClick={() => { setChatFarmer(f); setActiveTab("messages"); }} className="w-7 h-7 flex items-center justify-center bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors" title="Message"><Mail size={12} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {filteredFarmers.length === 0 && (
                  <div className="p-12 text-center text-xs text-zinc-500 dark:text-white/40">No farmers match your criteria.</div>
                )}
              </div>
            </motion.div>
          )}

          {/* ════════ CROP DETAILS TAB ════════ */}
          {activeTab === "crops" && (
            <motion.div key="crops" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[250px] flex items-center bg-white/70 dark:bg-white/5 backdrop-blur-md border border-zinc-200 dark:border-white/10 px-4 py-2.5 gap-3">
                  <Search size={14} className="text-zinc-500 dark:text-white/40" />
                  <input type="text" value={cropSearch} onChange={e => setCropSearch(e.target.value)} placeholder="Search crop name, field, or tags..." className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-white/30" />
                </div>
                <div className="flex items-center bg-white/70 dark:bg-white/5 backdrop-blur-md border border-zinc-200 dark:border-white/10 px-3 py-2 gap-2">
                  <User size={12} className="text-zinc-500 dark:text-white/40" />
                  <select value={cropUserFilter === "all" ? "all" : String(cropUserFilter)} onChange={e => setCropUserFilter(e.target.value === "all" ? "all" : Number(e.target.value))} className="bg-transparent text-xs text-zinc-700 dark:text-white outline-none">
                    <option value="all" className="bg-white text-black">All Farmers</option>
                    {farmers.map(f => <option key={f.id} value={f.id} className="bg-white text-black">{f.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCrops.map((crop, i) => (
                  <motion.div key={crop.id} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-[#0c0c0e]/70 backdrop-blur-xl border-t border-zinc-200 dark:border-white/10 p-6 rounded-3xl hover:border-green-500/30 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Leaf size={16} className="text-green-500" strokeWidth={1.5} />
                          <h4 className="text-sm font-gelasio text-zinc-900 dark:text-white">{crop.name}</h4>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 border ${cropStatusColor(crop.status)}`}>{crop.status}</span>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {crop.tags?.map((tag, idx) => (
                          <span key={idx} className="flex items-center gap-1 text-[9px] uppercase tracking-widest bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-white/40 px-2 py-1 rounded-sm">
                            <Tag size={10} /> {tag}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-3 text-xs text-zinc-500 dark:text-white/50 mb-6">
                        <div className="flex justify-between"><span>Farmer</span><span className="text-green-600 dark:text-green-400">{crop.farmerName}</span></div>
                        <div className="flex justify-between"><span>Field</span><span className="text-zinc-800 dark:text-white/70">{crop.field}</span></div>
                        <div className="flex justify-between"><span>Harvest</span><span className="text-zinc-800 dark:text-white/70">{crop.harvest}</span></div>
                        <div className="flex justify-between items-center">
                          <span>Health</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-zinc-200 dark:bg-white/5 overflow-hidden">
                              <div className={`h-full transition-all ${crop.health > 80 ? "bg-green-500" : crop.health > 60 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${crop.health}%` }} />
                            </div>
                            <span className="text-zinc-800 dark:text-white/70">{crop.health}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-zinc-200 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          placeholder="Add a tag..." 
                          className="flex-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-3 py-1.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-green-500/50"
                          value={newTagInputs[crop.id] || ""}
                          onChange={(e) => setNewTagInputs({...newTagInputs, [crop.id]: e.target.value})}
                          onKeyDown={(e) => { if(e.key === 'Enter') handleAddTag(crop.id, crop.farmerId); }}
                        />
                        <button onClick={() => handleAddTag(crop.id, crop.farmerId)} className="bg-zinc-200 dark:bg-white/10 px-3 py-1.5 text-xs hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors">Add</button>
                      </div>
                      
                      {crop.status !== "Approved" && (
                        <button onClick={() => approveCrop(crop.id, crop.farmerId)} className="w-full flex items-center justify-center gap-2 py-2 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-xs uppercase tracking-widest hover:bg-green-500/20 transition-colors mt-2">
                          <CheckCircle size={14} /> Approve Crop
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ════════ MESSAGES TAB ════════ */}
          {activeTab === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col md:flex-row gap-4 min-h-[60vh]">
              <div className="w-full md:w-72 flex-shrink-0 bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 flex flex-col shadow-sm dark:shadow-none rounded-xl overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-white/5">
                  <h3 className="text-sm font-gelasio text-zinc-900 dark:text-white mb-3">Conversations</h3>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[30vh] md:max-h-none">
                  {farmers.map(f => (
                    <div key={f.id} onClick={() => setChatFarmer(f)} className={`px-4 py-3 cursor-pointer border-b border-zinc-100 dark:border-white/5 transition-colors ${chatFarmer?.id === f.id ? "bg-green-500/5 dark:bg-green-500/10 border-l-2 border-l-green-500" : "hover:bg-zinc-50 dark:hover:bg-white/[0.02]"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-red-500 flex items-center justify-center text-[10px] text-white flex-shrink-0">{f.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-gelasio text-zinc-900 dark:text-white truncate">{f.name}</p>
                          <p className="text-[10px] text-zinc-400 dark:text-white/30 truncate mt-0.5">{allMessages.filter(m => m.farmerId === f.id).slice(-1)[0]?.text || "No messages yet"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 flex flex-col shadow-sm dark:shadow-none rounded-xl overflow-hidden">
                {chatFarmer ? (
                  <>
                    <div className="px-6 py-4 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-white/[0.02]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-red-500 flex items-center justify-center text-xs text-white">{chatFarmer.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-gelasio text-zinc-900 dark:text-white">{chatFarmer.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                      {farmerMessages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === "Manager" ? "items-end" : "items-start"}`}>
                          <span className="text-[9px] text-zinc-400 dark:text-white/30 mb-1">{msg.sender} • {msg.time}</span>
                          <div className={`px-4 py-2.5 text-xs max-w-[70%] leading-relaxed ${msg.sender === "Manager" ? "bg-green-500 text-white" : "bg-zinc-200 dark:bg-white/10 text-zinc-900 dark:text-white"}`}>{msg.text}</div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMsg} className="p-4 border-t border-zinc-200 dark:border-white/5 flex gap-3 bg-zinc-50/50 dark:bg-white/[0.02]">
                      <input type="text" value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type your reply..." className="flex-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-green-500/50 transition-colors" />
                      <button type="submit" className="bg-green-500 text-white px-4 py-2.5 flex items-center gap-2 text-xs hover:bg-green-600 transition-colors"><Send size={12} /> Send</button>
                    </form>
                  </>
                ) : (
                  <div className="p-12 flex items-center justify-center"><p className="text-sm text-zinc-500 dark:text-white/30">Select a farmer to start messaging</p></div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-zinc-200 dark:border-white/5 px-8 py-6 flex items-center justify-between text-[10px] text-zinc-500 dark:text-white/20 uppercase tracking-widest relative z-10 bg-zinc-50/60 dark:bg-zinc-950/60 backdrop-blur-xl mt-auto">
          <span>© 2026 Crop Mgr Assist — Manager Portal</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white/50 transition-colors">Terms</Link>
          </div>
        </footer>
      </div>

      {/* ════════ ADD USER MODAL ════════ */}
      <AnimatePresence>
        {isAddUserOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-white/70 dark:bg-[#0c0c0e]/70 backdrop-blur-xl border border-zinc-200 dark:border-white/10 w-full max-w-md rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-gelasio text-zinc-900 dark:text-white">Add New Farmer</h3>
                <button onClick={() => setIsAddUserOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><X size={16} /></button>
              </div>
              <form onSubmit={handleAddUser} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1 block">Full Name</label>
                  <input required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} type="text" className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-green-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1 block">Email</label>
                    <input required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} type="email" className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-green-500/50" />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1 block">NIC</label>
                    <input required value={newUser.nic} onChange={e => setNewUser({...newUser, nic: e.target.value})} type="text" className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-green-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1 block">Phone</label>
                  <input required value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} type="text" className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-green-500/50" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1 block">Address</label>
                  <input required value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} type="text" className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-green-500/50" />
                </div>
                <div className="flex gap-4 mt-4">
                  <button type="button" onClick={() => setIsAddUserOpen(false)} className="flex-1 py-2.5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-white/50 text-xs uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-green-500 text-white text-xs uppercase tracking-widest hover:bg-green-600">Add Farmer</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════ FARMER DETAIL MODAL (Manage Status & Delete) ════════ */}
      <AnimatePresence>
        {selectedFarmer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white/70 dark:bg-[#0c0c0e]/70 backdrop-blur-xl border border-zinc-200 dark:border-white/10 w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              
              <div className="sticky top-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/5 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-red-500 flex items-center justify-center text-sm text-white">{selectedFarmer.name.charAt(0)}</div>
                  <div>
                    <h3 className="text-lg font-gelasio text-zinc-900 dark:text-white">{selectedFarmer.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <select 
                        value={selectedFarmer.status} 
                        onChange={(e) => updateUserStatus(selectedFarmer.id, e.target.value as any)}
                        className={`text-[10px] px-2 py-0.5 border capitalize outline-none cursor-pointer ${statusColor(selectedFarmer.status)}`}
                      >
                        <option value="active" className="bg-white text-black">Active</option>
                        <option value="pending" className="bg-white text-black">Pending</option>
                        <option value="suspended" className="bg-white text-black">Suspended</option>
                        <option value="inactive" className="bg-white text-black">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedFarmer(null)} className="w-8 h-8 flex items-center justify-center border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"><X size={14} /></button>
              </div>

              <div className="p-6 space-y-6">
                {/* Admin Actions */}
                <div className="bg-red-500/5 border border-red-500/20 p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-widest">Danger Zone</h4>
                    <p className="text-[10px] text-zinc-500 dark:text-white/40 mt-1">Permanently remove this user from the system.</p>
                  </div>
                  <button onClick={() => updateUserStatus(selectedFarmer.id, "deleted")} className="flex items-center gap-2 text-xs bg-red-500 text-white px-3 py-1.5 hover:bg-red-600 transition-colors">
                    <Trash2 size={12} /> Delete User
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Email", value: selectedFarmer.email },
                    { label: "Phone", value: selectedFarmer.phone },
                    { label: "NIC", value: selectedFarmer.nic },
                    { label: "Address", value: selectedFarmer.address },
                    { label: "Team Size", value: `${selectedFarmer.teamSize} Members` },
                    { label: "Member Since", value: selectedFarmer.memberSince },
                  ].map((f, i) => (
                    <div key={i}>
                      <p className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest mb-1">{f.label}</p>
                      <p className="text-sm text-zinc-900 dark:text-white/80 font-gelasio">{f.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="text-xs text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-4">Crops ({selectedFarmer.crops.length})</h4>
                  {selectedFarmer.crops.length === 0 ? (
                    <p className="text-xs text-zinc-400 dark:text-white/30">No crops registered yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedFarmer.crops.map(c => (
                        <div key={c.id} className="border border-zinc-200 dark:border-white/5 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Leaf size={14} className="text-green-500" />
                            <div>
                              <p className="text-sm font-gelasio text-zinc-900 dark:text-white">{c.name}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {c.tags?.map((t, idx) => (
                                  <span key={idx} className="text-[9px] bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-white/50 px-1.5 rounded">{t}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] px-2 py-0.5 border ${cropStatusColor(c.status)}`}>{c.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════ MOBILE BOTTOM NAV ═══════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-white/10 px-6 py-3 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] safe-area-pb">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors duration-300 ${
                active ? "text-green-600 dark:text-green-400" : "text-zinc-500 dark:text-white/40 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <div className={`p-1.5 rounded-full transition-colors ${active ? "bg-green-500/10" : "bg-transparent"}`}>
                <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              </div>
              <span className="text-[10px] font-medium tracking-wide whitespace-nowrap">{tab.label.split(' ')[0]}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
