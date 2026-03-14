import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import type { Page } from "../App";
import type { Announcement, Message, backendInterface } from "../backend";

interface HomePageProps {
  setPage: (p: Page) => void;
  actor: backendInterface | null;
  isAdmin: boolean;
}

const navCards = [
  {
    page: "about" as Page,
    icon: "🛕",
    title: "आश्रम परिचय",
    desc: "आश्रम का उद्देश्य और परिचय",
    color: "bg-orange-50 border-orange-200",
  },
  {
    page: "pravachan" as Page,
    icon: "📿",
    title: "प्रवचन / भजन",
    desc: "दैनिक आध्यात्मिक संदेश",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    page: "events" as Page,
    icon: "📅",
    title: "कार्यक्रम",
    desc: "आने वाले भंडारा, यज्ञ, सत्संग",
    color: "bg-amber-50 border-amber-200",
  },
  {
    page: "donation" as Page,
    icon: "❤️",
    title: "दान / सेवा",
    desc: "आश्रम सेवा में योगदान दें",
    color: "bg-red-50 border-red-200",
  },
  {
    page: "gallery" as Page,
    icon: "🖼️",
    title: "गैलरी",
    desc: "आश्रम और कार्यक्रमों के चित्र",
    color: "bg-rose-50 border-rose-200",
  },
  {
    page: "contact" as Page,
    icon: "📍",
    title: "संपर्क करें",
    desc: "पता, फोन, WhatsApp",
    color: "bg-pink-50 border-pink-200",
  },
];

export default function HomePage({ setPage, actor, isAdmin }: HomePageProps) {
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    if (!actor) return;
    actor
      .getAllMessages()
      .then((msgs) => {
        if (msgs.length > 0) setLatestMessage(msgs[msgs.length - 1]);
      })
      .catch(() => {});
    actor
      .getAllAnnouncements()
      .then(setAnnouncements)
      .catch(() => {});
  }, [actor]);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Welcome banner */}
      <div className="text-center mb-6 p-6 rounded-2xl bg-primary text-primary-foreground shadow-saffron">
        <div className="text-4xl mb-2">🕉️</div>
        <h1 className="font-display text-2xl font-bold">जय माता दी</h1>
        <p className="text-sm opacity-90 mt-1">
          मारुगाढ़ – ओम शक्ति सेवाधाम आश्रम में आपका स्वागत है
        </p>
      </div>

      {/* Daily message */}
      {latestMessage && (
        <div
          className="mb-5 p-4 bg-accent rounded-xl border border-border"
          data-ocid="home.message.card"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
            आज का संदेश ✨
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {latestMessage.text}
          </p>
        </div>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="mb-5 space-y-2">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">
            घोषणाएं 📢
          </p>
          {announcements.slice(-2).map((a, i) => (
            <div
              key={a.id}
              className="p-3 bg-secondary rounded-lg border border-border"
              data-ocid={`home.announcement.item.${i + 1}`}
            >
              <p className="font-semibold text-sm">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Nav cards */}
      <div className="grid grid-cols-2 gap-3">
        {navCards.map((card) => (
          <button
            type="button"
            key={card.page}
            onClick={() => setPage(card.page)}
            data-ocid={`home.${card.page}.button`}
            className={`p-4 rounded-2xl border-2 text-left transition-transform active:scale-95 ${card.color} hover:shadow-md`}
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <p className="font-semibold text-foreground text-sm">
              {card.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.desc}</p>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPage("volunteer")}
          data-ocid="home.volunteer.button"
          className="p-4 rounded-2xl border-2 text-left transition-transform active:scale-95 bg-green-50 border-green-200 hover:shadow-md"
        >
          <div className="text-3xl mb-2">🙏</div>
          <p className="font-semibold text-foreground text-sm">स्वयंसेवक</p>
          <p className="text-xs text-muted-foreground mt-0.5">सेवा में भाग लें</p>
        </button>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setPage("admin")}
            data-ocid="home.admin.button"
            className="p-4 rounded-2xl border-2 text-left transition-transform active:scale-95 bg-purple-50 border-purple-200 hover:shadow-md"
          >
            <div className="text-3xl mb-2">⚙️</div>
            <p className="font-semibold text-foreground text-sm">प्रशासन</p>
            <p className="text-xs text-muted-foreground mt-0.5">सामग्री प्रबंधन</p>
          </button>
        )}
      </div>

      {/* Festival badge */}
      <div className="mt-6 text-center">
        <Badge variant="secondary" className="text-xs">
          🙏 हर हर महादेव • जय माँ दुर्गा
        </Badge>
      </div>
    </div>
  );
}
