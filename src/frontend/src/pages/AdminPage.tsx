import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  Announcement,
  Donation,
  Event,
  GalleryItem,
  Mantra,
  Message,
  Volunteer,
  backendInterface,
} from "../backend";

interface Props {
  actor: backendInterface | null;
}

export default function AdminPage({ actor }: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [_gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAll = useCallback(() => {
    if (!actor) return;
    actor
      .getAllEvents()
      .then(setEvents)
      .catch(() => {});
    actor
      .getAllMessages()
      .then(setMessages)
      .catch(() => {});
    actor
      .getAllMantras()
      .then(setMantras)
      .catch(() => {});
    actor
      .getAllAnnouncements()
      .then(setAnnouncements)
      .catch(() => {});
    actor
      .getAllDonations()
      .then(setDonations)
      .catch(() => {});
    actor
      .getAllVolunteers()
      .then(setVolunteers)
      .catch(() => {});
    actor
      .getAllGalleryItems()
      .then(setGallery)
      .catch(() => {});
  }, [actor]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Event form
  const [evtName, setEvtName] = useState("");
  const [evtDesc, setEvtDesc] = useState("");
  const [evtDate, setEvtDate] = useState("");
  const [evtLoc, setEvtLoc] = useState("");
  const [evtType, setEvtType] = useState("");

  const addEvent = async () => {
    if (!actor || !evtName || !evtDate) {
      toast.error("नाम और दिनांक आवश्यक");
      return;
    }
    setLoading(true);
    try {
      await actor.createEvent(
        Date.now().toString(),
        evtName,
        evtDesc,
        BigInt(new Date(evtDate).getTime() * 1_000_000),
        evtLoc,
        evtType,
      );
      toast.success("कार्यक्रम जोड़ा गया");
      setEvtName("");
      setEvtDesc("");
      setEvtDate("");
      setEvtLoc("");
      setEvtType("");
      loadAll();
    } catch {
      toast.error("त्रुटि");
    } finally {
      setLoading(false);
    }
  };

  // Message form
  const [msgText, setMsgText] = useState("");
  const addMessage = async () => {
    if (!actor || !msgText) return;
    setLoading(true);
    try {
      await actor.addMessage(Date.now().toString(), msgText);
      toast.success("संदेश जोड़ा गया");
      setMsgText("");
      loadAll();
    } catch {
      toast.error("त्रुटि");
    } finally {
      setLoading(false);
    }
  };

  // Mantra form
  const [mantraTitle, setMantraTitle] = useState("");
  const [mantraText, setMantraText] = useState("");
  const addMantra = async () => {
    if (!actor || !mantraTitle) return;
    setLoading(true);
    try {
      await actor.addMantra(Date.now().toString(), mantraTitle, mantraText);
      toast.success("मंत्र जोड़ा गया");
      setMantraTitle("");
      setMantraText("");
      loadAll();
    } catch {
      toast.error("त्रुटि");
    } finally {
      setLoading(false);
    }
  };

  // Announcement form
  const [annTitle, setAnnTitle] = useState("");
  const [annDesc, setAnnDesc] = useState("");
  const [annDate, setAnnDate] = useState("");
  const addAnnouncement = async () => {
    if (!actor || !annTitle) return;
    setLoading(true);
    try {
      await actor.addAnnouncement(
        Date.now().toString(),
        annTitle,
        annDesc,
        BigInt(new Date(annDate || Date.now()).getTime() * 1_000_000),
      );
      toast.success("घोषणा जोड़ी गई");
      setAnnTitle("");
      setAnnDesc("");
      setAnnDate("");
      loadAll();
    } catch {
      toast.error("त्रुटि");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (fn: () => Promise<void>, refresh: () => void) => {
    try {
      await fn();
      refresh();
      toast.success("हटाया गया");
    } catch {
      toast.error("त्रुटि");
    }
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h2 className="font-display text-xl font-bold text-primary mb-4">
        ⚙️ प्रशासन पैनल
      </h2>
      <Tabs defaultValue="events" data-ocid="admin.tab">
        <TabsList className="w-full flex-wrap h-auto gap-1 mb-4">
          <TabsTrigger value="events">कार्यक्रम</TabsTrigger>
          <TabsTrigger value="messages">संदेश</TabsTrigger>
          <TabsTrigger value="mantras">मंत्र</TabsTrigger>
          <TabsTrigger value="announce">घोषणा</TabsTrigger>
          <TabsTrigger value="donations">दान</TabsTrigger>
          <TabsTrigger value="volunteers">स्वयंसेवक</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">नया कार्यक्रम जोड़ें</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                placeholder="कार्यक्रम का नाम"
                value={evtName}
                onChange={(e) => setEvtName(e.target.value)}
                data-ocid="admin.event.name.input"
              />
              <Textarea
                placeholder="विवरण"
                value={evtDesc}
                onChange={(e) => setEvtDesc(e.target.value)}
                data-ocid="admin.event.desc.textarea"
              />
              <Input
                type="date"
                value={evtDate}
                onChange={(e) => setEvtDate(e.target.value)}
                data-ocid="admin.event.date.input"
              />
              <Input
                placeholder="स्थान"
                value={evtLoc}
                onChange={(e) => setEvtLoc(e.target.value)}
                data-ocid="admin.event.location.input"
              />
              <Input
                placeholder="प्रकार"
                value={evtType}
                onChange={(e) => setEvtType(e.target.value)}
                data-ocid="admin.event.type.input"
              />
              <Button
                onClick={addEvent}
                disabled={loading}
                className="w-full"
                data-ocid="admin.event.submit_button"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : null}{" "}
                जोड़ें
              </Button>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {events.map((e, i) => (
              <div
                key={e.id}
                className="flex items-center justify-between p-3 bg-card border rounded-lg"
                data-ocid={`admin.event.item.${i + 1}`}
              >
                <span className="text-sm font-medium">{e.name}</span>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    deleteItem(() => actor!.deleteEvent(e.id), loadAll)
                  }
                  data-ocid={`admin.event.delete_button.${i + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">नया दैनिक संदेश</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                placeholder="आज का आध्यात्मिक संदेश"
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                data-ocid="admin.message.textarea"
              />
              <Button
                onClick={addMessage}
                disabled={loading}
                className="w-full"
                data-ocid="admin.message.submit_button"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : null}{" "}
                प्रकाशित करें
              </Button>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {messages
              .slice()
              .reverse()
              .map((m, i) => (
                <div
                  key={m.id}
                  className="p-3 bg-card border rounded-lg text-sm"
                  data-ocid={`admin.message.item.${i + 1}`}
                >
                  {m.text}
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="mantras">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">नया मंत्र / आरती जोड़ें</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                placeholder="शीर्षक"
                value={mantraTitle}
                onChange={(e) => setMantraTitle(e.target.value)}
                data-ocid="admin.mantra.title.input"
              />
              <Textarea
                placeholder="मंत्र / आरती पाठ"
                value={mantraText}
                onChange={(e) => setMantraText(e.target.value)}
                rows={4}
                data-ocid="admin.mantra.text.textarea"
              />
              <Button
                onClick={addMantra}
                disabled={loading}
                className="w-full"
                data-ocid="admin.mantra.submit_button"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : null}{" "}
                जोड़ें
              </Button>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {mantras.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 bg-card border rounded-lg"
                data-ocid={`admin.mantra.item.${i + 1}`}
              >
                <span className="text-sm font-medium">{m.title}</span>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    deleteItem(() => actor!.deleteMantra(m.id), loadAll)
                  }
                  data-ocid={`admin.mantra.delete_button.${i + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announce">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">नई घोषणा</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                placeholder="शीर्षक"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                data-ocid="admin.announce.title.input"
              />
              <Textarea
                placeholder="विवरण"
                value={annDesc}
                onChange={(e) => setAnnDesc(e.target.value)}
                data-ocid="admin.announce.desc.textarea"
              />
              <Input
                type="date"
                value={annDate}
                onChange={(e) => setAnnDate(e.target.value)}
                data-ocid="admin.announce.date.input"
              />
              <Button
                onClick={addAnnouncement}
                disabled={loading}
                className="w-full"
                data-ocid="admin.announce.submit_button"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : null}{" "}
                प्रकाशित करें
              </Button>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {announcements.map((a, i) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 bg-card border rounded-lg"
                data-ocid={`admin.announce.item.${i + 1}`}
              >
                <span className="text-sm font-medium">{a.title}</span>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    deleteItem(() => actor!.deleteAnnouncement(a.id), loadAll)
                  }
                  data-ocid={`admin.announce.delete_button.${i + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="donations">
          <Table data-ocid="admin.donations.table">
            <TableHeader>
              <TableRow>
                <TableHead>दाता</TableHead>
                <TableHead>राशि (₹)</TableHead>
                <TableHead>उद्देश्य</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                    data-ocid="admin.donations.empty_state"
                  >
                    कोई दान नहीं
                  </TableCell>
                </TableRow>
              ) : (
                donations.map((d, i) => (
                  <TableRow
                    key={d.id}
                    data-ocid={`admin.donations.row.${i + 1}`}
                  >
                    <TableCell>{d.donorName}</TableCell>
                    <TableCell>₹{d.amount.toString()}</TableCell>
                    <TableCell>{d.purpose}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="volunteers">
          <Table data-ocid="admin.volunteers.table">
            <TableHeader>
              <TableRow>
                <TableHead>नाम</TableHead>
                <TableHead>मोबाइल</TableHead>
                <TableHead>कौशल</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                    data-ocid="admin.volunteers.empty_state"
                  >
                    कोई स्वयंसेवक नहीं
                  </TableCell>
                </TableRow>
              ) : (
                volunteers.map((v, i) => (
                  <TableRow
                    key={v.id}
                    data-ocid={`admin.volunteers.row.${i + 1}`}
                  >
                    <TableCell>{v.name}</TableCell>
                    <TableCell>{v.mobile}</TableCell>
                    <TableCell>{v.skills}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
