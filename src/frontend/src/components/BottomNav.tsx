import { BookOpen, Calendar, Heart, Home, Image, Phone } from "lucide-react";
import type { Page } from "../App";

interface BottomNavProps {
  page: Page;
  setPage: (p: Page) => void;
}

const navItems: { page: Page; icon: React.ReactNode; label: string }[] = [
  { page: "home", icon: <Home className="h-5 w-5" />, label: "होम" },
  { page: "pravachan", icon: <BookOpen className="h-5 w-5" />, label: "प्रवचन" },
  { page: "events", icon: <Calendar className="h-5 w-5" />, label: "कार्यक्रम" },
  { page: "donation", icon: <Heart className="h-5 w-5" />, label: "दान" },
  { page: "gallery", icon: <Image className="h-5 w-5" />, label: "गैलरी" },
  { page: "contact", icon: <Phone className="h-5 w-5" />, label: "संपर्क" },
];

export default function BottomNav({ page, setPage }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg"
      data-ocid="bottom_nav.panel"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.page}
            onClick={() => setPage(item.page)}
            data-ocid={`bottom_nav.${item.page}.link`}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 text-xs transition-colors ${
              page === item.page
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
