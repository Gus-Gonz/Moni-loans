import React from "react";
import { Check, X, Edit, Trash } from "lucide-react";

import { Button } from "./Button";
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
              <td className="px-4 py-3">{loan.full_name}</td>
              <td className="px-4 py-3">${loan.amount}</td>
              <td className="px-4 py-3">{loan.status}</td>
              <td className="px-4 py-3">
                {new Date(loan.created_at).toLocaleString()}
              </td>
              {hasEditPerms && (
                <td className="px-4 py-3 flex gap-2">
                  <div className="relative group">
                    <button
                      onClick={() => onEdit(loan.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <span
                      className={`
                        absolute
                        bottom-full
                        left-1/2
                        transform
                        -translate-x-1/2
                        -translate-y-1
                        text-xs
                        text-white
                        bg-black
                        p-1
                        rounded
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity
                        `}
                    >
                      Edit
                    </span>
                  </div>
                  {loan.status !== "APR" && (
                    <div className="relative group">
                      <button
                        onClick={() => onApprove(loan.id)}
                        className={`text-green-600 cursor-pointer`}
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <span
                        className={`
                            absolute
                            bottom-full
                            left-1/2
                            transform
                            -translate-x-1/2
                            -translate-y-1
                            text-xs
                            text-white
                            bg-black
                            p-1
                            rounded
                            opacity-0
                            group-hover:opacity-100
                            transition-opacity
                            `}
                      >
                        Approve
                      </span>
                    </div>
                  )}
                  {loan.status !== "REJ" && (
                    <div className="relative group">
                      <button
                        onClick={() => onReject(loan.id)}
                        disabled={loan.status === "REJ"}
                        className="text-red-600 cursor-pointer"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <span
                        className={`
                            absolute
                            bottom-full
                            left-1/2
                            transform
                            -translate-x-1/2
                            -translate-y-1
                            text-xs
                            text-white
                            bg-black
                            p-1
                            rounded
                            opacity-0
                            group-hover:opacity-100
                            transition-opacity
                            `}
                      >
                        Reject
                      </span>
                    </div>
                  )}
                  <div className="relative group">
                    <button
                      onClick={() => onDelete(loan.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                    <span
                      className={`
                        absolute
                        bottom-full
                        left-1/2
                        transform
                        -translate-x-1/2
                        -translate-y-1
                        text-xs
                        text-white
                        bg-black
                        p-1
                        rounded
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity
                        `}
                    >
                      Delete
                    </span>
                  </div>
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
