"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sun, Moon, LogOut, Search, Bell, Users, Sprout,
  ArrowUpRight, ArrowDownRight, User, Leaf, MapPin, Calendar,
  MessageSquare, Send, X, Filter, SortAsc, SortDesc, Eye,
  Mail, BarChart3, Shield, Check, Plus, Trash2, Tag, CheckCircle
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

/* ═══════ MOCK DATA ═══════ */
const mockFarmers: FarmerUser[] = [
  {
    id: 1, name: "John Farmer", email: "john@farmhub.com", phone: "+94 77 123 4567",
    nic: "200012345678", address: "123 Green Valley, Kandy", memberSince: "Mar 2026", status: "active", teamSize: 12,
    crops: [
      { id: 101, name: "Rice (Samba)", field: "Field A-01", status: "Growing", health: 92, planted: "2026-03-15", harvest: "2026-08-20", area: "2.5 ha", tags: ["Premium Quality"] },
      { id: 102, name: "Tea (Ceylon)", field: "Field B-03", status: "Harvesting", health: 88, planted: "2026-01-10", harvest: "2026-07-01", area: "1.8 ha", tags: ["Export"] },
    ]
  },
  {
    id: 2, name: "Nimali Perera", email: "nimali@greenfield.lk", phone: "+94 71 987 6543",
    nic: "199856781234", address: "45 Paddy Lane, Anuradhapura", memberSince: "Jan 2026", status: "active", teamSize: 8,
    crops: [
      { id: 201, name: "Vegetables (Mixed)", field: "Field C-02", status: "Seedling", health: 95, planted: "2026-06-01", harvest: "2026-09-15", area: "0.6 ha", tags: ["Organic"] },
      { id: 202, name: "Cinnamon", field: "Field D-01", status: "Growing", health: 78, planted: "2025-11-20", harvest: "2026-11-20", area: "3.2 ha" },
      { id: 203, name: "Pepper", field: "Field D-02", status: "Mature", health: 90, planted: "2025-06-15", harvest: "2026-06-15", area: "1.4 ha" },
    ]
  },
  {
    id: 3, name: "Kamal Silva", email: "kamal@harvest.lk", phone: "+94 76 555 1234",
    nic: "198734567890", address: "78 Coconut Road, Galle", memberSince: "Feb 2026", status: "active", teamSize: 15,
    crops: [
      { id: 301, name: "Coconut", field: "Field E-04", status: "Mature", health: 85, planted: "2023-05-10", harvest: "Ongoing", area: "4.0 ha" },
    ]
  },
  {
    id: 4, name: "Saman Bandara", email: "saman@crops.lk", phone: "+94 70 111 2222",
    nic: "199512348765", address: "12 Hill Street, Nuwara Eliya", memberSince: "Apr 2026", status: "pending", teamSize: 3,
    crops: []
  },
  {
    id: 5, name: "Lakshmi Fernando", email: "lakshmi@farmnet.lk", phone: "+94 75 333 4444",
    nic: "200187654321", address: "56 Riverside, Matale", memberSince: "May 2026", status: "inactive", teamSize: 6,
    crops: [
      { id: 501, name: "Rubber", field: "Field F-01", status: "Growing", health: 70, planted: "2025-09-01", harvest: "2027-09-01", area: "5.0 ha" },
      { id: 502, name: "Clove", field: "Field F-02", status: "Seedling", health: 60, planted: "2026-05-01", harvest: "2027-05-01", area: "0.8 ha" },
    ]
  },
];

/* ═══════ NAV TABS ═══════ */
type TabId = "overview" | "users" | "crops" | "messages";

const navTabs: { label: string; id: TabId; icon: any }[] = [
  { label: "Overview", id: "overview", icon: BarChart3 },
  { label: "Manage Users", id: "users", icon: Users },
  { label: "Crop Details", id: "crops", icon: Sprout },
  { label: "Messages", id: "messages", icon: MessageSquare },
];

export default function ManagerDashboard() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  
  // Users state
  const [farmers, setFarmers] = useState<FarmerUser[]>(mockFarmers);
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

  useEffect(() => { setMounted(true); }, []);
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

  // All crops from all farmers
  const allCrops = farmers.flatMap(f => f.crops.map(c => ({ ...c, farmerName: f.name, farmerId: f.id })));
  const filteredCrops = allCrops
    .filter(c => cropUserFilter === "all" || c.farmerId === cropUserFilter)
    .filter(c => c.name.toLowerCase().includes(cropSearch.toLowerCase()) || c.field.toLowerCase().includes(cropSearch.toLowerCase()) || c.tags?.some(t => t.toLowerCase().includes(cropSearch.toLowerCase())));

  /* ═══════ ACTIONS ═══════ */
  
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const createdUser: FarmerUser = {
      id: Date.now(),
      ...newUser,
      status: "pending",
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      teamSize: 1,
      crops: []
    };
    setFarmers([createdUser, ...farmers]);
    setIsAddUserOpen(false);
    setNewUser({ name: "", email: "", phone: "", nic: "", address: "" });
  };

  const updateUserStatus = (id: number, newStatus: FarmerUser["status"] | "deleted") => {
    if (newStatus === "deleted") {
      setFarmers(farmers.filter(f => f.id !== id));
      if (selectedFarmer?.id === id) setSelectedFarmer(null);
    } else {
      const updated = farmers.map(f => f.id === id ? { ...f, status: newStatus as FarmerUser["status"] } : f);
      setFarmers(updated);
      if (selectedFarmer?.id === id) setSelectedFarmer({ ...selectedFarmer, status: newStatus as FarmerUser["status"] });
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
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans font-light transition-colors duration-500 relative overflow-hidden">
      
      <DashboardBackground />

      {/* ═══════════════════ TOP HEADER BAR ═══════════════════ */}
      <header className="sticky top-0 z-40 bg-zinc-50/60 dark:bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 px-8 py-4 flex items-center justify-between transition-colors duration-500 relative z-20">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Sprout size={20} className="text-green-500" strokeWidth={1.5} />
            <span className="text-sm text-zinc-900 dark:text-white font-gelasio tracking-wide">Crop Mgr Assist</span>
          </Link>
          
          <nav className="hidden md:flex items-center bg-zinc-100/80 dark:bg-white/5 border border-zinc-200 dark:border-white/10 p-1 ml-6">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-white/10 text-green-600 dark:text-green-400 shadow-sm dark:shadow-none border border-zinc-200 dark:border-white/10"
                      : "text-zinc-500 dark:text-white/40 hover:text-zinc-900 dark:hover:text-white/70 border border-transparent"
                  }`}
                >
                  <Icon size={14} strokeWidth={1.5} />
                  {tab.label}
                </motion.button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center border border-zinc-200 dark:border-white/10 hover:border-green-500/30 text-zinc-500 dark:text-white transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-md"
            >
              {resolvedTheme === "dark" ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
            </motion.button>
          )}
          <button className="relative w-9 h-9 flex items-center justify-center border border-zinc-200 dark:border-white/10 hover:border-green-500/30 text-zinc-500 dark:text-white transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-md">
            <Bell size={16} strokeWidth={1.5} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-zinc-50 dark:border-zinc-950" />
          </button>
          <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-green-500 flex items-center justify-center text-xs text-white shadow-md">
            MG
          </div>
          <Link href="/login" className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600 dark:text-red-400/60 dark:hover:text-red-400 transition-colors ml-2">
            <LogOut size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </header>

      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <main className="flex-1 p-6 md:p-8 relative z-10 overflow-y-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-gelasio tracking-wide text-zinc-900 dark:text-white">Manager Dashboard</h1>
            <p className="text-xs text-zinc-500 dark:text-white/40 mt-1 uppercase tracking-widest">Agricultural Enterprise Management</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-white/30">
            <Calendar size={14} strokeWidth={1.5} />
            <span>Today</span>
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
                      className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 p-6 hover:border-green-500/30 transition-all duration-300 group shadow-sm dark:shadow-none"
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
                <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 p-6 shadow-sm dark:shadow-none">
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

                <motion.div custom={5} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 p-6 shadow-sm dark:shadow-none">
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

                <motion.div custom={6} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 p-6 shadow-sm dark:shadow-none">
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
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsAddUserOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-xs uppercase tracking-widest hover:bg-green-600 transition-colors shadow-lg">
                  <Plus size={14} /> Add User
                </button>
              </div>

              <div className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
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
                    <option value="all">All Farmers</option>
                    {farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCrops.map((crop, i) => (
                  <motion.div key={crop.id} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 p-6 shadow-sm dark:shadow-none flex flex-col justify-between">
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
            <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-4" style={{ height: "calc(100vh - 220px)" }}>
              <div className="w-72 flex-shrink-0 bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 flex flex-col overflow-hidden shadow-sm dark:shadow-none">
                <div className="p-4 border-b border-zinc-200 dark:border-white/5">
                  <h3 className="text-sm font-gelasio text-zinc-900 dark:text-white mb-3">Conversations</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
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

              <div className="flex-1 bg-white/70 dark:bg-white/[0.02] backdrop-blur-md border border-zinc-200/50 dark:border-white/5 flex flex-col overflow-hidden shadow-sm dark:shadow-none">
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
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
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
                  <div className="flex-1 flex items-center justify-center"><p className="text-sm text-zinc-500 dark:text-white/30">Select a farmer to start messaging</p></div>
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

      {/* ════════ ADD USER MODAL ════════ */}
      <AnimatePresence>
        {isAddUserOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 w-full max-w-md shadow-2xl p-8">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              
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
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
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
    </div>
  );
}
