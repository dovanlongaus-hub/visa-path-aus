import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import Header from "./Header";
import MobileBottomBar from "./MobileBottomBar";
import GlobalSearch from "../components/GlobalSearch";
import MobileMoreSheet from "./MobileMoreSheet";

export default function LayoutNew({ children, currentPageName }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistoryStack(prev => (prev[prev.length - 1] !== currentPageName ? [...prev, currentPageName].slice(-20) : prev));
  }, [currentPageName]);

  const handleBack = () => {
    const prev = [...historyStack].reverse().find(p => p !== currentPageName);
    navigate(createPageUrl(prev || "Home"));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentPageName={currentPageName} setSearchOpen={setSearchOpen} handleBack={handleBack} />
      
      <main className="pb-16 lg:pb-0">{children}</main>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      {showMoreSheet && <MobileMoreSheet currentPageName={currentPageName} onClose={() => setShowMoreSheet(false)} />}
      <MobileBottomBar currentPageName={currentPageName} onMoreClick={() => setShowMoreSheet(!showMoreSheet)} showMoreSheet={showMoreSheet} />
    </div>
  );
}