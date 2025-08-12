import React from "react";

const PricingHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
        Choose the plan that’s right for you
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        From individuals to large teams — Taskflow helps everyone get more done.
      </p>
    </section>
  );
};

export default PricingHero;
