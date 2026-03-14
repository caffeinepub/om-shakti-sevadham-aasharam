import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { backendInterface } from "../backend";

interface Props {
  actor: backendInterface | null;
}

export default function VolunteerPage({ actor }: Props) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!actor) return;
    if (!name || !mobile) {
      toast.error("नाम और मोबाइल अनिवार्य है");
      return;
    }
    setLoading(true);
    try {
      await actor.registerVolunteer(
        Date.now().toString(),
        name,
        mobile,
        skills,
        availability,
      );
      toast.success("स्वयंसेवक के रूप में पंजीकरण सफल! 🙏");
      setName("");
      setMobile("");
      setSkills("");
      setAvailability("");
    } catch {
      toast.error("पंजीकरण विफल");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="text-center p-5 bg-primary text-primary-foreground rounded-2xl mb-5">
        <div className="text-4xl mb-2">🙏</div>
        <h2 className="font-display text-xl font-bold">स्वयंसेवक पंजीकरण</h2>
        <p className="text-sm opacity-90">सेवा ही भक्ति है – आश्रम सेवा में भाग लें</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base text-primary">
            अपनी जानकारी भरें
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="vname">नाम *</Label>
            <Input
              id="vname"
              placeholder="आपका पूरा नाम"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-ocid="volunteer.name.input"
            />
          </div>
          <div>
            <Label htmlFor="vmobile">मोबाइल नंबर *</Label>
            <Input
              id="vmobile"
              placeholder="मोबाइल नंबर"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              data-ocid="volunteer.mobile.input"
            />
          </div>
          <div>
            <Label htmlFor="vskills">कौशल / योग्यता</Label>
            <Textarea
              id="vskills"
              placeholder="आपकी विशेष योग्यता (जैसे: खाना बनाना, प्रबंधन, चिकित्सा...)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              data-ocid="volunteer.skills.textarea"
            />
          </div>
          <div>
            <Label htmlFor="vavail">उपलब्धता</Label>
            <Input
              id="vavail"
              placeholder="कब उपलब्ध हैं (जैसे: सप्ताहांत, छुट्टियाँ...)"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              data-ocid="volunteer.availability.input"
            />
          </div>
          <Button
            onClick={submit}
            disabled={loading}
            className="w-full"
            data-ocid="volunteer.submit_button"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "🙏 "
            )}
            {loading ? "पंजीकरण हो रहा है..." : "स्वयंसेवक बनें"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
