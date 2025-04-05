import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { TextInput, EmailInput, NumberInput } from "../../components/Inputs";
import { RadioInputs } from "../../components/RadioInputs";
import { useUser } from "../../contexts/UserContext";
import { LoanTable } from "../../components/LoanTable";
import { Button } from "../../components/Button";

import Auth from "../../utils/Auth";
import Api from "../../utils/Api";

interface LoanRequest {
  id: number;
  full_name: string;
  amount: number;
  status: string;
  created_at: string;
}

const initial_error_data = {
  full_name: [] as string[],
  id_number: [] as string[],
  email: [] as string[],
  amount: [] as string[],
  gender: [] as string[],
  id: [] as string[],
  status: [] as string[],
  updated_at: [] as string[],
  created_at: [] as string[],
};

const initial_form_data = {
  id: "",
  full_name: "",
  id_number: "",
  email: "",
  amount: "",
  gender: "",
  status: "",
  updated_at: "",
  created_at: "",
};

const DashboardPage = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [currentLoan, setCurrentLoan] = useState<LoanRequest | null>(null);

  const [formData, setFormData] = useState(initial_form_data);
  const [errors, setErrors] = useState(initial_error_data);

  const hasPermission = user?.permissions.includes("auth.view_loan");
  const hasEditPermission = user?.permissions.includes("auth.update_loan");

  useEffect(() => {
    if (!hasPermission) {
      Auth.clearTokens();
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/");
    }
  }, [hasPermission, setUser]);

  useEffect(() => {
    if (!hasPermission) return;
    fetchLoans();
    setLoading(true);
  }, [hasPermission, page]);

  const handleChange = (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const fetchLoans = () => {
    return Api.fetch("/admin/loans/", { page })
      .then((res) => {
        setLoans(res.data.results || []);
        setCount(res.data.count || 0);
      })
      .catch((err) => {
        toast.error("Error loading loan data");
        setError("Failed to load data.");
      })
      .finally(() => setLoading(false));
  };

  const onApprove = (loanId: number) => {
    Api.fetch(`/admin/loans/${loanId}/approve/`, { page }, "POST")
      .then(() => {
        toast.success("Loan approved successfully.");
        return fetchLoans();
      })
      .catch((error) => {
        toast.error("Error approving loan.");
      });
  };

  const onReject = (loanId: number) => {
    Api.fetch(`/admin/loans/${loanId}/reject/`, { page }, "POST")
      .then(() => {
        toast.success("Loan rejected successfully.");
        return fetchLoans();
      })
      .catch((error) => {
        toast.error("Error rejecting loan.");
      });
  };

  const onEdit = (loanId: number) => {
    Api.fetch(`/admin/loans/${loanId}/`)
      .then((response) => {
        setCurrentLoan(response.data);
        setFormData({ ...response.data });
        setIsEditing(true);
      })
      .catch((error) => {
        toast.error("Error fetching loan details.");
      });
  };

  const validateFormData = () => {
    const newErrors = { ...initial_error_data };
    let hasError = false;

    if (!formData.full_name.trim()) {
      newErrors.full_name = ["Full name is required."];
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = ["Email is required."];
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ["Email format is invalid."];
      hasError = true;
    }

    if (!formData.id_number.trim()) {
      newErrors.id_number = ["ID number is required."];
      hasError = true;
    }

    if (!formData.gender?.trim()) {
      newErrors.gender = ["Gender is required."];
      hasError = true;
    }

    if (
      !formData.amount ||
      isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = ["Amount must be a number greater than 0."];
      hasError = true;
    }

    return { newErrors, hasError };
  };

  const onCancel = () => {
    setIsEditing(false);
    setCurrentLoan(null);
  };

  const onUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const { newErrors, hasError } = validateFormData();

    if (hasError) {
      setErrors(newErrors);
      setTimeout(() => setErrors(initial_error_data), 6000);
      return;
    }

    const loanId = currentLoan?.id;
    if (loanId) {
      return Api.fetch(`/admin/loans/${loanId}/`, formData, "PUT")
        .then((res) => {
          toast.success("Loan updated successfully.");
          return fetchLoans().then((res) => {
            setIsEditing(false);
            setCurrentLoan(null);
          });
        })
        .catch((err) => {
          if (err.response?.data) {
            const backendErrors = err.response.data;
            const formattedErrors = { ...initial_error_data };

            for (const key in backendErrors) {
              formattedErrors[key] = backendErrors[key];
            }

            setErrors(formattedErrors);

            setTimeout(() => {
              setErrors(initial_error_data);
            }, 6000);
          }
          toast.error("Error updating loan.");
        });
    } else {
      toast.error("No loan selected for editing.");
    }
  };

  const onDelete = (loanId: number) => {
    if (window.confirm("Are you sure you want to delete this loan?")) {
      Api.fetch(`/admin/loans/${loanId}/`, {}, "DELETE")
        .then(() => {
          toast.success("Loan deleted successfully.");
          return fetchLoans();
        })
        .catch((error) => {
          toast.error("Error deleting loan.");
        });
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">
        Welcome to the Dashboard, {user?.username}!
      </h1>
      <p className="text-gray-700 mb-6 text-white">
        Here you will find an overview of loan requests.
      </p>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {isEditing && currentLoan && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold">Edit Loan Request</h2>
          <form
            onSubmit={onUpdate}
            className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <TextInput
              label="Full Name"
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e)}
              name="full_name"
              placeholder="John Doe"
              error={errors.full_name.length !== 0}
              errorMessage={errors.full_name[0]}
            />

            <TextInput
              label="Id Number"
              value={formData.id_number}
              onChange={(e) => handleChange("id_number", e)}
              name="id_number"
              placeholder="123123123"
              error={errors.id_number.length !== 0}
              errorMessage={errors.id_number[0]}
            />

            <EmailInput
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e)}
              name="email"
              placeholder="email@example.com"
              error={errors.email.length !== 0}
              errorMessage={errors.email[0]}
            />

            <NumberInput
              label="Amount"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e)}
              name="amount"
              placeholder="1000"
              error={errors.amount.length !== 0}
              errorMessage={errors.amount[0]}
            />

            <RadioInputs
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={(e) => handleChange("gender", e)}
              options={[
                { option: "Male", key: "M" },
                { option: "Female", key: "F" },
                { option: "Other", key: "O" },
              ]}
              error={errors.gender.length !== 0}
              errorMessage={errors.gender[0]}
            />
            <div></div>

            <Button type="button" variant="white" onClick={onCancel}>
              Cancel
            </Button>

            <Button type="submit" className="w-full mb-4">
              Save
            </Button>
          </form>
        </div>
      )}

      {!loading && !error && loans.length > 0 ? (
        <LoanTable
          loans={loans}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={onEdit}
          onDelete={onDelete}
          hasEditPerms={hasEditPermission}
        />
      ) : (
        !loading &&
        !error &&
        loans.length === 0 && <p className="text-white">No loans found.</p>
      )}
    </div>
  );
};

export default DashboardPage;
