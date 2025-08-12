import React from "react";

type FeatureTableProps = {
  features: { name: string; free: boolean; standard: boolean; premium: boolean }[];
};

const FeatureTable: React.FC<FeatureTableProps> = ({ features }) => {
  return (
    <div className="overflow-x-auto mt-12">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Features</th>
            <th className="p-3 text-center">Free</th>
            <th className="p-3 text-center">Standard</th>
            <th className="p-3 text-center">Premium</th>
          </tr>
        </thead>
        <tbody>
          {features.map((f, idx) => (
            <tr key={idx} className="border-t border-gray-200">
              <td className="p-3">{f.name}</td>
              <td className="p-3 text-center">{f.free ? "✔" : "—"}</td>
              <td className="p-3 text-center">{f.standard ? "✔" : "—"}</td>
              <td className="p-3 text-center">{f.premium ? "✔" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeatureTable;
