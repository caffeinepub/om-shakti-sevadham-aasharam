export default function AboutPage() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center p-6 bg-primary text-primary-foreground rounded-2xl">
        <div className="text-5xl mb-3">🛕</div>
        <h2 className="font-display text-2xl font-bold">ओम शक्ति सेवाधाम आश्रम</h2>
        <p className="text-sm opacity-90">मारुगाढ़, राजस्थान</p>
      </div>

      <div
        className="bg-card border border-border rounded-2xl p-5 space-y-3"
        data-ocid="about.intro.card"
      >
        <h3 className="font-display text-lg font-semibold text-primary">
          🕉️ आश्रम परिचय
        </h3>
        <p className="text-sm leading-relaxed text-foreground">
          ओम शक्ति सेवाधाम आश्रम, मारुगाढ़ एक पवित्र आध्यात्मिक स्थल है जहाँ भक्तगण भक्ति,
          सेवा और आध्यात्मिक ज्ञान प्राप्त करने आते हैं। यह आश्रम सनातन धर्म की परंपराओं को
          जीवित रखते हुए समाज सेवा के कार्यों में भी अग्रणी है।
        </p>
      </div>

      <div
        className="bg-card border border-border rounded-2xl p-5 space-y-3"
        data-ocid="about.purpose.card"
      >
        <h3 className="font-display text-lg font-semibold text-primary">
          🎯 आश्रम का उद्देश्य
        </h3>
        <ul className="text-sm space-y-2 text-foreground">
          <li className="flex gap-2">
            <span>•</span> भक्तों को आध्यात्मिक शांति और मार्गदर्शन प्रदान करना
          </li>
          <li className="flex gap-2">
            <span>•</span> नि:शुल्क भंडारा और सेवा कार्य
          </li>
          <li className="flex gap-2">
            <span>•</span> धार्मिक शिक्षा और संस्कार
          </li>
          <li className="flex gap-2">
            <span>•</span> गरीबों और जरूरतमंदों की सहायता
          </li>
          <li className="flex gap-2">
            <span>•</span> यज्ञ, सत्संग और कथा का आयोजन
          </li>
        </ul>
      </div>

      <div
        className="bg-card border border-border rounded-2xl p-5 space-y-3"
        data-ocid="about.guruji.card"
      >
        <h3 className="font-display text-lg font-semibold text-primary">
          🙏 महंत जी / गुरुजी
        </h3>
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-3xl flex-shrink-0">
            🧘
          </div>
          <div>
            <p className="font-semibold">श्री महंत जी महाराज</p>
            <p className="text-sm text-muted-foreground mt-1">
              पूज्य महंत जी महाराज आश्रम के संस्थापक एवं मार्गदर्शक हैं। उनके सानिध्य में हजारों
              भक्त आध्यात्मिक लाभ उठा रहे हैं। उनके प्रवचन और उपदेश जीवन को नई दिशा प्रदान
              करते हैं।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
