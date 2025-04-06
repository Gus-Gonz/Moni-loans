import React from "react";
import { Check, X, Edit, Trash } from "lucide-react";

import { truncateText } from "../utils/TextUtils";
import { Button } from "./Button";
import { Tooltip } from "./Tooltip";

interface LoanRequest {
  id: number;
  full_name: string;
  amount: number;
  status: string;
  created_at: string;
}

interface LoanTableProps {
  loans: LoanRequest[];
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onApprove: (loanId: number) => void;
  onReject: (loanId: number) => void;
  onEdit: (loanId: number) => void;
  onDelete: (loanId: number) => void;
  hasEditPerms?: boolean;
}

export const LoanTable: React.FC<LoanTableProps> = ({
  loans,
  page,
  onPageChange,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  totalPages,
  hasEditPerms,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full text-sm text-left text-gray-700 bg-white">
        <thead className="text-xs text-gray-500 uppercase bg-gray-100">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Full Name</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            {hasEditPerms && <th className="px-4 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr
              key={loan.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-3">{loan.id}</td>
              <td className="px-4 py-3">{truncateText(loan.full_name, 40)}</td>
              <td className="px-4 py-3">${loan.amount}</td>
              <td className="px-4 py-3">{loan.status}</td>
              <td className="px-4 py-3">
                {new Date(loan.created_at).toLocaleString()}
              </td>
              {hasEditPerms && (
                <td className="px-4 py-3 flex gap-2">
                  <Tooltip text="Edit">
                    <button
                      onClick={() => onEdit(loan.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </Tooltip>
                  {loan.status !== "APR" && (
                    <Tooltip text="Approve">
                      <button
                        onClick={() => onApprove(loan.id)}
                        className={`text-green-600 cursor-pointer`}
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </Tooltip>
                  )}
                  {loan.status !== "REJ" && (
                    <Tooltip text="Reject">
                      <button
                        onClick={() => onReject(loan.id)}
                        className="text-red-600 cursor-pointer"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </Tooltip>
                  )}
                  <Tooltip text="Delete">
                    <button
                      onClick={() => onDelete(loan.id)}
                      className="text-red-600 cursor-pointer"
                      title="Delete"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </Tooltip>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="min-w-full text-sm text-left text-gray-700 flex justify-center items-center gap-4 bg-gray-100 border-t border-gray-200 py-2">
        <Button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Previous
        </Button>
        <span className="text-black">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
