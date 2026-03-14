import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      <div className="text-center p-5 bg-primary text-primary-foreground rounded-2xl">
        <div className="text-4xl mb-2">📍</div>
        <h2 className="font-display text-xl font-bold">संपर्क / आश्रम का पता</h2>
      </div>

      <Card data-ocid="contact.address.card">
        <CardContent className="p-5 space-y-3">
          <div className="flex gap-3 items-start">
            <span className="text-xl">📍</span>
            <div>
              <p className="font-semibold">आश्रम का पता</p>
              <p className="text-sm text-muted-foreground">
                ओम शक्ति सेवाधाम आश्रम,
                <br />
                मारुगाढ़, राजस्थान – 341001
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-xl">📞</span>
            <div>
              <p className="font-semibold">फोन नंबर</p>
              <a
                href="tel:+919876543210"
                className="text-sm text-primary"
                data-ocid="contact.phone.link"
              >
                +91 98765 43210
              </a>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-xl">🕐</span>
            <div>
              <p className="font-semibold">आश्रम समय</p>
              <p className="text-sm text-muted-foreground">
                प्रातः 5:00 – रात्रि 9:00
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => window.open("https://wa.me/919876543210", "_blank")}
          className="flex gap-2 bg-green-600 hover:bg-green-700 text-white"
          data-ocid="contact.whatsapp.button"
        >
          💬 WhatsApp
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            window.open(
              "https://maps.google.com/?q=Marugadh+Rajasthan",
              "_blank",
            )
          }
          data-ocid="contact.map.button"
        >
          🗺️ Map खोलें
        </Button>
      </div>

      <Card className="bg-accent" data-ocid="contact.timing.card">
        <CardContent className="p-4">
          <p className="font-semibold text-sm mb-2 text-primary">
            📅 दैनिक कार्यक्रम
          </p>
          <div className="text-xs space-y-1 text-foreground">
            <div className="flex justify-between">
              <span>प्रातः आरती</span>
              <span>5:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span>प्रवचन</span>
              <span>7:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span>भोग / प्रसाद</span>
              <span>12:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>सायं आरती</span>
              <span>7:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>शयन आरती</span>
              <span>9:00 PM</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
