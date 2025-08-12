import React from "react";

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "For individuals or small teams getting started with Trello.",
      features: [
        "Unlimited cards",
        "Up to 10 boards per workspace",
        "Unlimited Power-Ups per board",
        "Basic integrations",
      ],
      button: "Get Started",
    },
    {
      name: "Standard",
      price: "$5",
      period: "/user/month",
      description: "For teams that need to manage more work and collaborate.",
      features: [
        "Unlimited boards",
        "Advanced checklists",
        "Custom fields",
        "Priority support",
      ],
      button: "Upgrade Now",
    },
    {
      name: "Premium",
      price: "$10",
      period: "/user/month",
      description: "For teams that need to track multiple projects and visualize work.",
      features: [
        "Timeline, Calendar, Dashboard views",
        "Admin & security features",
        "Workspace table view",
        "Advanced integrations",
      ],
      button: "Go Premium",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Best for large organizations needing advanced controls.",
      features: [
        "Organization-wide permissions",
        "SSO & advanced security",
        "Unlimited workspaces",
        "Dedicated account manager",
      ],
      button: "Contact Sales",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Choose the plan that’s right for you
        </h1>
        <p className="text-lg text-gray-600">
          From small teams to large enterprises, Trello has a plan for everyone.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <p className="text-3xl font-bold text-[#0065FF]">
                {plan.price}
                <span className="text-base font-medium text-gray-500">
                  {plan.period}
                </span>
              </p>
              <p className="text-gray-600 mt-3 mb-6">{plan.description}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 font-bold mr-2">✔</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full py-2 px-4 rounded-lg bg-[#0065FF] text-white font-medium hover:bg-[#0065FF]/70 transition-colors">
              {plan.button}
            </button>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="max-w-3xl mx-auto mt-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Still not sure which plan is right for you?
        </h2>
        <p className="text-gray-600 mb-6">
          Start with Free, upgrade anytime as your team grows.
        </p>
        <button className="px-6 py-3 bg-[#0065FF] text-white rounded-lg font-medium hover:bg-[#0065FF]/70">
          Get Started for Free
        </button>
      </div>
    </div>
  );
};

export default PricingPage;