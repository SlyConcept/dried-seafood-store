export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
        About OceanDry
      </h1>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p>
          OceanDry was founded with a simple mission: bring high-quality dried
          seafood from trusted sources around the world to kitchens everywhere.
        </p>
        <p>
          We carefully select dried fish, shrimp, squid, seaweed and other
          seafood products that meet strict standards for freshness, flavor and
          safety. Whether you are a home cook looking for authentic ingredients
          or a restaurant seeking reliable supply, we are here to serve you.
        </p>
        <h2 className="text-xl font-semibold text-slate-900 mt-10">
          Why dried seafood?
        </h2>
        <p>
          Drying is one of the oldest and most effective ways to preserve
          seafood. It concentrates flavor, extends shelf life, and makes these
          ingredients easy to store and ship internationally — perfect for
          global customers who want authentic taste without compromise.
        </p>
        <h2 className="text-xl font-semibold text-slate-900 mt-10">
          Our promise
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Quality-checked products from reputable sources</li>
          <li>Secure packaging designed for long-distance shipping</li>
          <li>Transparent origin information</li>
          <li>Responsive customer support</li>
        </ul>
        <p className="mt-8 text-sm text-slate-500">
          Replace this text with your real business story, location, and values.
        </p>
      </div>
    </div>
  );
}
