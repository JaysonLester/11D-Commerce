import React from "react";
import { FaTimes } from "react-icons/fa";

const TermsModal = ({ closeModal }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-md shadow-md max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">TERMS AND CONDITIONS</h2>
        <button
          onClick={closeModal}
          className="text-zinc-600 hover:underline focus:outline-none"
        >
          <FaTimes />
        </button>
      </div>
      <div className="text-gray-700 overflow-y-auto max-h-60">
        <p>
          Welcome to 11D Commerce! These terms and conditions outline the rules
          and regulations for the use of the 11D Commerce website.
        </p>

        <section className="mt-4">
          <h3 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h3>
          <p>
            By accessing this website, we assume you accept these terms and
            conditions. Do not continue to use 11D Commerce if you do not agree
            to take all of the terms and conditions stated on this page.
          </p>
        </section>

        <section className="mt-4">
          <h3 className="text-lg font-semibold mb-2">2. Privacy</h3>
          <p>
            Your privacy is important to us. Please review our Privacy Policy,
            which also governs your visit to 11D Commerce, to understand our
            practices.
          </p>
        </section>

        <section className="mt-4">
          <h3 className="text-lg font-semibold mb-2">3. Products and Services</h3>
          <p>
            All products and services available on 11D Commerce are subject to
            availability. Prices are subject to change without notice.
          </p>
        </section>

        <section className="mt-4">
          <h3 className="text-lg font-semibold mb-2">4. User Account</h3>
          <p>
            If you create an account on 11D Commerce, you are responsible for
            maintaining the confidentiality of your account and password. You
            agree to accept responsibility for all activities that occur under
            your account.
          </p>
        </section>

        {/* Additional terms and conditions content */}
      </div>
    </div>
  </div>
);

export default TermsModal;
