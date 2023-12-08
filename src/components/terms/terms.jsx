import React from "react";
import { FaTimes } from "react-icons/fa";

const TermsModal = ({ closeModal }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-md shadow-md w-1/4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">TERMS AND CONDITIONS</h2>
        <button
          onClick={closeModal}
          className="text-zinc-600 hover:underline focus:outline-none"
        >
          <FaTimes />
        </button>
      </div>
      <div className="text-gray-700">
        {/* Add your terms and conditions content here */}
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          condimentum metus in augue bibendum, nec fermentum nulla facilisis.
        </p>
        {/* Additional terms and conditions content */}
      </div>
    </div>
  </div>
);

export default TermsModal;
