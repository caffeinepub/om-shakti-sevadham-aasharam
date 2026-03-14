import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import type { GalleryItem, backendInterface } from "../backend";

interface Props {
  actor: backendInterface | null;
}

export default function GalleryPage({ actor }: Props) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    actor
      .getAllGalleryItems()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor]);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h2 className="font-display text-xl font-bold text-primary mb-4">
        🖼️ गैलरी
      </h2>
      {loading ? (
        <div
          className="grid grid-cols-2 gap-3"
          data-ocid="gallery.loading_state"
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="gallery.empty_state"
        >
          <p className="text-4xl mb-3">🖼️</p>
          <p>अभी कोई चित्र उपलब्ध नहीं है</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden border border-border bg-card"
              data-ocid={`gallery.item.${i + 1}`}
            >
              {item.blobId ? (
                <img
                  src={item.blobId.getDirectURL()}
                  alt={item.title}
                  className="w-full h-36 object-cover"
                />
              ) : (
                <div className="w-full h-36 bg-accent flex items-center justify-center">
                  <span className="text-4xl">
                    {item.itemType === "video" ? "🎬" : "🖼️"}
                  </span>
                </div>
              )}
              <div className="p-2">
                <p className="text-sm font-semibold truncate">{item.title}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {item.itemType}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
