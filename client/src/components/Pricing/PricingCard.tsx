import React from "react";

type PricingCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonLabel: string;
  highlighted?: boolean;
};

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  description,
  features,
  buttonLabel,
  highlighted = false,
}) => {
  return (
    <div
      className={`flex flex-col border rounded-xl p-6 shadow-sm ${
        highlighted
          ? "border-blue-600 shadow-lg scale-105"
          : "border-gray-200"
      } transition-transform`}
    >
      <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
      <p className="text-3xl font-bold mt-2">{price}</p>
      <p className="text-gray-500 mt-2">{description}</p>
      <ul className="mt-4 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-700">
            <span className="text-blue-600">✔</span>
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`mt-6 py-2 px-4 rounded-lg font-medium ${
          highlighted
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
        }`}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default PricingCard;
