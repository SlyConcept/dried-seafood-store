export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Shipping Information
      </h1>
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <p>
          We ship dried seafood worldwide. Because products are shelf-stable,
          they travel well and arrive in excellent condition when properly
          packaged.
        </p>

        <h2 className="text-xl font-semibold text-slate-900">
          How shipping works
        </h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Place your order on the website.</li>
          <li>
            We review the order and calculate shipping based on your location
            and package weight.
          </li>
          <li>
            You receive payment instructions (or pay via integrated checkout
            once connected).
          </li>
          <li>We pack and ship your order with tracking when available.</li>
        </ol>

        <h2 className="text-xl font-semibold text-slate-900">
          Estimated delivery
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Domestic (same country): 3–10 business days</li>
          <li>International: 7–25 business days depending on destination</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900">
          Customs & duties
        </h2>
        <p>
          International orders may be subject to customs duties or import taxes
          in the destination country. These are the responsibility of the buyer.
          We recommend checking local regulations for dried seafood imports.
        </p>

        <p className="text-sm text-slate-500 mt-10">
          Update this page with your actual shipping rates, carriers, and
          policies.
        </p>
      </div>
    </div>
  );
}
