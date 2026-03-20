import React from "react";

const resources = [
  { label: "Department of Home Affairs (immi.homeaffairs.gov.au)", url: "https://immi.homeaffairs.gov.au" },
  { label: "SkillSelect EOI Portal", url: "https://www.homeaffairs.gov.au/skillselect" },
  { label: "MARA Migration Agent Search", url: "https://www.mara.gov.au/search-the-register-of-agents/" },
  { label: "VisaEnvoy Blog & Updates", url: "https://visaenvoy.com/news/" },
  { label: "ImmiAdvisor Community", url: "https://immiadvisor.com/" },
];

export default function ResourceLinks() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-12 mb-24">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Nguồn tham khảo & hỗ trợ di trú</h2>
        <ul className="space-y-6">
          {resources.map((item, idx) => (
            <li key={idx} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-900 text-lg hover:underline">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white text-center py-3 text-sm font-semibold shadow-lg z-50">
        Phiên bản mới: Nguồn tham khảo & hỗ trợ di trú (ResourceLinks.jsx)
      </div>
    </div>
  );
}
