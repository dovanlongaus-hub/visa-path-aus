// src/components/layout/NavConfig.js
import { 
  Home, Map, CheckSquare, FileText, Upload, User, Briefcase, Award, 
  Sparkles, Bot, Target, Crown, BookOpen, HelpCircle, Bookmark, 
  Download, Users, Bell, Settings, Headphones, Lightbulb, Globe, 
  Plane, FolderOpen, LifeBuoy, Shield
} from "lucide-react";

export const navGroups = [
  {
    id: "pathways",
    label: "Lộ trình & Visa",
    icon: Globe,
    color: "navy",
    items: [
      { label: "Lộ trình PR", icon: Map, page: "Roadmap", desc: "Định hướng từng giai đoạn" },
      { label: "Visa 482", icon: Briefcase, page: "Visa482", desc: "Employer Sponsored" },
      { label: "Visa 858", icon: Award, page: "Visa858", desc: "National Innovation" },
      { label: "Kế hoạch cá nhân", icon: Target, page: "MyPlan", desc: "Mục tiêu theo mốc thời gian" },
      { label: "Checklist PR", icon: CheckSquare, page: "Checklist", desc: "Theo dõi tiến độ hồ sơ" },
      { label: "Chuẩn bị qua Úc", icon: Plane, page: "ArrivalGuide", desc: "Việc cần làm trước khi đến Úc" },
    ],
  },
  {
    id: "documents",
    label: "Hồ sơ & Biểu mẫu",
    icon: FolderOpen,
    color: "teal",
    items: [
      { label: "Hồ sơ cá nhân", icon: User, page: "Profile", desc: "Thông tin nền tảng & điểm EOI" },
      { label: "Upload CV", icon: Upload, page: "CVUpload", desc: "Chuẩn hóa dữ liệu bằng AI" },
      { label: "Biểu mẫu di trú", icon: FileText, page: "Forms", desc: "Form DIBP chính thức" },
      { label: "EOI & CV AI", icon: Sparkles, page: "EOIGenerator", desc: "Tạo hồ sơ EOI tự động" },
    ],
  },
  {
    id: "knowledge",
    label: "Kiến thức & Tài nguyên",
    icon: BookOpen,
    color: "sage",
    items: [
      { label: "Knowledge Base", icon: BookOpen, page: "Guide", desc: "Hướng dẫn chính thức" },
      { label: "FAQ", icon: HelpCircle, page: "FAQ", desc: "Câu hỏi thường gặp" },
      { label: "Câu chuyện thành công", icon: Users, page: "Testimonials", desc: "Kinh nghiệm thực tế" },
      { label: "Bookmarks", icon: Bookmark, page: "Bookmarks", desc: "Lưu bài yêu thích" },
      { label: "Tải xuống", icon: Download, page: "Downloads", desc: "Templates & guides" },
    ],
  },
  {
    id: "support",
    label: "Hỗ trợ & Hệ thống",
    icon: LifeBuoy,
    color: "stone",
    items: [
      { label: "Liên hệ", icon: Headphones, page: "Contact", desc: "Hỗ trợ trực tiếp" },
      { label: "Góp ý", icon: Lightbulb, page: "Feedback", desc: "Đề xuất cải tiến" },
      { label: "Thông báo", icon: Bell, page: "Notifications", desc: "Cập nhật hệ thống" },
      { label: "Cài đặt", icon: Settings, page: "Settings", desc: "Tùy chỉnh tài khoản" },
      { label: "Nâng cấp Premium", icon: Crown, page: "Pricing", desc: "Mở khóa tính năng nâng cao" },
    ],
  },
];

export const colorConfig = {
  navy:  { dot: "bg-[#18406e]", badge: "bg-[#e9f0f7] text-[#163a63] border-[#c7d8ea]", icon: "bg-[#dce8f4] text-[#163a63]", activeItem: "bg-[#e9f0f7] text-[#163a63]" },
  teal:  { dot: "bg-[#0f6b6f]", badge: "bg-[#e8f4f4] text-[#0f5458] border-[#c7e3e4]", icon: "bg-[#d9eeef] text-[#0f5458]", activeItem: "bg-[#e8f4f4] text-[#0f5458]" },
  sage:  { dot: "bg-[#2f6b4a]", badge: "bg-[#edf4ef] text-[#2a5a3f] border-[#cfe1d3]", icon: "bg-[#dfebe2] text-[#2a5a3f]", activeItem: "bg-[#edf4ef] text-[#2a5a3f]" },
  stone: { dot: "bg-[#7a5f40]", badge: "bg-[#f6f1ea] text-[#654e36] border-[#e7dccf]", icon: "bg-[#efe6da] text-[#654e36]", activeItem: "bg-[#f6f1ea] text-[#654e36]" },
};

export const NO_BACK_PAGES = ["Home", "Chat"];

export const PAGE_TITLES = {
  Roadmap: "Lộ trình PR",
  Visa482: "Visa 482",
  Visa858: "Visa 858",
  Profile: "Hồ sơ cá nhân",
  MyPlan: "Kế hoạch cá nhân",
  Checklist: "Checklist PR",
  ArrivalGuide: "Chuẩn bị qua Úc",
  CVUpload: "Upload CV",
  Forms: "Biểu mẫu di trú",
  EOIGenerator: "EOI & CV AI",
  Guide: "Knowledge Base",
  FAQ: "FAQ",
  Testimonials: "Câu chuyện thành công",
  Contact: "Liên hệ",
  Bookmarks: "Bookmarks",
  Downloads: "Tải xuống",
  Pricing: "Nâng cấp Premium",
  Notifications: "Thông báo",
  Settings: "Cài đặt",
  Feedback: "Góp ý",
  Article: "Bài viết",
  AdminActivate: "Admin – Kích hoạt",
  AdminFeedback: "Admin – Feedback",
  AdminGuide: "Admin – Knowledge Base",
};

export const adminPages = [
  { page: "AdminActivate", icon: Shield, title: "Kích hoạt" },
  { page: "AdminFeedback", icon: Lightbulb, title: "Feedback" },
  { page: "AdminGuide", icon: BookOpen, title: "Knowledge Base" },
];