import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  page: Page;
  setPage: (p: Page) => void;
  isAdmin: boolean;
}

const pageTitles: Record<Page, string> = {
  home: "ओम शक्ति सेवाधाम",
  about: "आश्रम परिचय",
  pravachan: "दैनिक प्रवचन",
  events: "कार्यक्रम",
  donation: "दान / सेवा",
  gallery: "गैलरी",
  contact: "संपर्क करें",
  volunteer: "स्वयंसेवक",
  admin: "प्रशासन",
};

export default function Header({ page, setPage, isAdmin }: HeaderProps) {
  const { clear } = useInternetIdentity();
  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-saffron">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => setPage("home")}
          className="flex items-center gap-2"
          data-ocid="header.home.link"
        >
          <span className="text-2xl">🕉️</span>
          <span className="font-display text-lg font-semibold">
            {pageTitles[page]}
          </span>
        </button>
        <div className="flex gap-2">
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage("admin")}
              data-ocid="header.admin.link"
              className="text-primary-foreground hover:bg-primary/80"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => clear()}
            data-ocid="header.logout.button"
            className="text-primary-foreground hover:bg-primary/80"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
