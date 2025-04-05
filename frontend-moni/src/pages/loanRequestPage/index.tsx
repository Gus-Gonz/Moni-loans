import React, { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

import { TextInput, EmailInput, NumberInput } from "../../components/Inputs";
import { RadioInputs } from "../../components/RadioInputs";
import Api from "../../utils/Api";

const initial_error_data = {
  full_name: [] as string[],
  id_number: [] as string[],
  email: [] as string[],
  amount: [] as string[],
  gender: [] as string[],
};

const initial_form_data = {
  full_name: "",
  id_number: "",
  email: "",
  amount: "",
  gender: "",
};

const LoanRequestPage = () => {
  const [formData, setFormData] = useState(initial_form_data);
  const [errors, setErrors] = useState(initial_error_data);
  const [loanStatus, setLoanStatus] = useState(null);

  const handleChange = (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { newErrors, hasError } = validateFormData();

    if (hasError) {
      setErrors(newErrors);
      setTimeout(() => setErrors(initial_error_data), 6000);
      return;
    }

    Api.fetch("/loan-requests/", formData, "POST")
      .then((res) => {
        const status = res?.data?.status;

        if (status === "APR") {
          setLoanStatus(status);
        } else if (status === "REJ") {
          setLoanStatus(status);
        }

        toast.success("Loan requested sent!");
        loanStatus;
        setFormData(initial_form_data);
        setErrors(initial_error_data);
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
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 bg-white rounded-xl shadow-md">
        {loanStatus === null ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
              Loan Request Form
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
              >
                Request Loan
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              {loanStatus === "APR" ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              {loanStatus === "APR"
                ? "Your loan was approved"
                : "Sorry, your loan was rejected"}
            </h2>
            <div>
              <button
                onClick={() => setLoanStatus(null)}
                className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
              >
                Back to Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanRequestPage;
