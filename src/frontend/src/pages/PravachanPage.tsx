import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import type { Mantra, Message, backendInterface } from "../backend";

interface Props {
  actor: backendInterface | null;
}

export default function PravachanPage({ actor }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    Promise.all([actor.getAllMessages(), actor.getAllMantras()])
      .then(([msgs, mts]) => {
        setMessages(msgs.reverse());
        setMantras(mts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor]);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <Tabs defaultValue="pravachan" data-ocid="pravachan.tab">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="pravachan" className="flex-1">
            📖 प्रवचन
          </TabsTrigger>
          <TabsTrigger value="mantra" className="flex-1">
            📿 मंत्र / आरती
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pravachan">
          {loading ? (
            <div className="space-y-3" data-ocid="pravachan.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="pravachan.empty_state"
            >
              <p className="text-4xl mb-3">📖</p>
              <p>अभी कोई प्रवचन उपलब्ध नहीं है</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <Card key={msg.id} data-ocid={`pravachan.item.${i + 1}`}>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(
                        Number(msg.date) / 1_000_000,
                      ).toLocaleDateString("hi-IN")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mantra">
          {loading ? (
            <div className="space-y-3" data-ocid="mantra.loading_state">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : mantras.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="mantra.empty_state"
            >
              <p className="text-4xl mb-3">📿</p>
              <p>अभी कोई मंत्र उपलब्ध नहीं है</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mantras.map((m, i) => (
                <Card key={m.id} data-ocid={`mantra.item.${i + 1}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-base text-primary">
                      {m.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {m.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
