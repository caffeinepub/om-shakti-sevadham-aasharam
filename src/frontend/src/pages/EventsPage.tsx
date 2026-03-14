import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Event, backendInterface } from "../backend";

interface Props {
  actor: backendInterface | null;
}

export default function EventsPage({ actor }: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);

  useEffect(() => {
    if (!actor) return;
    actor
      .getAllEvents()
      .then((evts) => setEvents(evts.slice().reverse()))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor]);

  const register = async (eventId: string) => {
    if (!actor) return;
    setRegistering(eventId);
    try {
      await actor.registerForEvent(eventId);
      toast.success("कार्यक्रम में पंजीकरण सफल!");
    } catch {
      toast.error("पंजीकरण विफल हुआ");
    } finally {
      setRegistering(null);
    }
  };

  const formatDate = (t: bigint) =>
    new Date(Number(t) / 1_000_000).toLocaleDateString("hi-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h2 className="font-display text-xl font-bold text-primary mb-4">
        📅 आने वाले कार्यक्रम
      </h2>
      {loading ? (
        <div className="space-y-3" data-ocid="events.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="events.empty_state"
        >
          <p className="text-4xl mb-3">📅</p>
          <p>अभी कोई कार्यक्रम नहीं है</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((evt, i) => (
            <Card key={evt.id} data-ocid={`events.item.${i + 1}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-display text-base">
                    {evt.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {evt.eventType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {evt.description}
                </p>
                <div className="text-xs space-y-1">
                  <p>📅 {formatDate(evt.date)}</p>
                  <p>📍 {evt.location}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => register(evt.id)}
                  disabled={registering === evt.id}
                  data-ocid={`events.register.button.${i + 1}`}
                  className="w-full mt-2"
                >
                  {registering === evt.id ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : null}
                  {registering === evt.id
                    ? "पंजीकरण हो रहा है..."
                    : "🙏 कार्यक्रम में जुड़ें"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
