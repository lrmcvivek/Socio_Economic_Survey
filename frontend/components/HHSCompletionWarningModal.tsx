"use client";

import { CheckCircle } from "lucide-react";
import Button from "@/components/Button";

interface HHSCompletionWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNew?: () => void;
  slumId?: string;
  assignmentId?: string;
}

export default function HHSCompletionWarningModal({
  isOpen,
  onClose,
  onAddNew,
  slumId,
  assignmentId,
}: HHSCompletionWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111827] border border-slate-700 rounded-xl p-4 sm:p-6 max-w-md w-full sm:mx-4 mx-2 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-500/20 p-3 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <h2 className="text-lg font-bold text-white">
            All Households Surveyed
          </h2>
        </div>

        <p className="text-slate-400 mb-6 leading-relaxed">
          All household surveys have been completed for this slum. If you've
          found a new household that wasn't previously recorded, you can add it
          directly.
        </p>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            size="md"
            onClick={onAddNew}
            className="flex-1 bg-green-600 hover:bg-green-500"
          >
            Add New Household
          </Button>
        </div>
      </div>
    </div>
  );
}
