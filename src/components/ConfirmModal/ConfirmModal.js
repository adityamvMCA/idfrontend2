import { AlertCircle } from "lucide-react";

function ConfirmModal({ open, onClose, onConfirm, formData }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
          <AlertCircle className="text-indigo-600" /> Confirm Your Details
        </h2>
        <p className="text-gray-600 mb-6">
          Please review your details before submitting your registration.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>Roll Number:</strong> {formData.rollNumber}</p>
          <p><strong>Department:</strong> {formData.department}</p>
          <p><strong>Blood Group:</strong> {formData.bloodGroup}</p>
          <p><strong>Validity:</strong> {formData.validity}</p>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmModal;