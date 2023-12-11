import React, { useState } from 'react';

const GenerateReportModal = ({ onClose, onGenerateReport }) => {
  const [reportData, setReportData] = useState({
    date: '',
    status: '',
    productType: '',
    color: '',
    size: '',
    productCode: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenerateReport = () => {
    onGenerateReport(reportData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 max-w-md rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Generate Report</h2>

        {/* Date Input */}
        <div className="mb-4">
         
          <input
            value={reportData.date}
            onChange={handleInputChange}
          />
        </div>

        {/* Other Input Fields (Status, Product Type, Color, Size, Product Code) */}
        {/* ... (Add similar structure for other input fields) */}

        {/* Buttons (Generate Report and Close) */}
        <div className="flex justify-end">
          <button
            onClick={handleGenerateReport}
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Generate Report
          </button>
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal;