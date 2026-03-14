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

export default function DonationPage({ actor }: Props) {
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!actor) return;
    if (!donorName || !amount) {
      toast.error("नाम और राशि अनिवार्य है");
      return;
    }
    setLoading(true);
    try {
      await actor.addDonation(
        Date.now().toString(),
        donorName,
        BigInt(Math.round(Number.parseFloat(amount))),
        purpose || "सामान्य दान",
      );
      toast.success("दान रिकॉर्ड सफलतापूर्वक दर्ज हुआ! धन्यवाद 🙏");
      setDonorName("");
      setAmount("");
      setPurpose("");
    } catch {
      toast.error("दान दर्ज करने में त्रुटि");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      <div className="text-center p-5 bg-primary text-primary-foreground rounded-2xl">
        <div className="text-4xl mb-2">❤️</div>
        <h2 className="font-display text-xl font-bold">दान / सेवा</h2>
        <p className="text-sm opacity-90">आपका हर योगदान पुण्य का कार्य है</p>
      </div>

      {/* UPI Payment */}
      <Card data-ocid="donation.upi.card">
        <CardHeader>
          <CardTitle className="font-display text-base text-primary">
            💳 ऑनलाइन भुगतान
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-accent rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">UPI ID</p>
            <p className="font-mono font-bold text-lg text-primary">
              omshakti@upi
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-sm">
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground">बैंक खाता</p>
              <p className="font-semibold">SBI – 1234567890</p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground">IFSC</p>
              <p className="font-semibold">SBIN0001234</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            PhonePe / Google Pay / Paytm / NEFT सभी स्वीकार्य
          </p>
        </CardContent>
      </Card>

      {/* Donation Record */}
      <Card data-ocid="donation.form.card">
        <CardHeader>
          <CardTitle className="font-display text-base text-primary">
            📋 दान रिकॉर्ड दर्ज करें
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="dname">दाता का नाम *</Label>
            <Input
              id="dname"
              placeholder="आपका नाम"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              data-ocid="donation.name.input"
            />
          </div>
          <div>
            <Label htmlFor="amt">दान राशि (₹) *</Label>
            <Input
              id="amt"
              type="number"
              placeholder="राशि दर्ज करें"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-ocid="donation.amount.input"
            />
          </div>
          <div>
            <Label htmlFor="purpose">उद्देश्य</Label>
            <Textarea
              id="purpose"
              placeholder="दान का उद्देश्य (वैकल्पिक)"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              data-ocid="donation.purpose.textarea"
            />
          </div>
          <Button
            onClick={submit}
            disabled={loading}
            className="w-full"
            data-ocid="donation.submit_button"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "🙏 "
            )}
            {loading ? "दर्ज हो रहा है..." : "दान दर्ज करें"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
