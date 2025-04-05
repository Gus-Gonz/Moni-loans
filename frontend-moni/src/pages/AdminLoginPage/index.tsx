import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { PasswordInput, TextInput } from "../../components/Inputs";
import { Button } from "../../components/Button";

import Auth from "../../utils/Auth";
import Api from "../../utils/Api";
import { useUser } from "../../contexts/UserContext";

const initial_form_data = {
  username: "",
  password: "",
};

const initial_error_data = {
  username: [] as string[],
  password: [] as string[],
};

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initial_form_data);
  const [errors, setErrors] = useState(initial_error_data);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const { setUser } = useUser();

  const handleChange = (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
    if (invalidCredentials) setInvalidCredentials(false);
  };

  const validateFormData = () => {
    const newErrors = { ...initial_error_data };
    let hasError = false;

    if (!formData.username.trim()) {
      newErrors.username = ["Username is required."];
      hasError = true;
    }

    if (!formData.password.trim()) {
      newErrors.password = ["Password is required."];
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

    Api.fetch("/token/", formData, "POST")
      .then((res) => {
        if (res.data) {
          const { access, refresh } = res.data;

          Auth.setTokens(access, refresh);
          return handleFetchMe();
        } else {
          toast.error("Invalid login response.");
        }
      })
      .catch((err) => {
        toast.error("Invalid credentials");
        setInvalidCredentials(true);
        setTimeout(() => setInvalidCredentials(false), 4000);
      });
  };

  const handleFetchMe = () => {
    return Api.fetch("/me/", {}, "GET").then((res) => {
      setUser(res.data);
      toast.success("Welcome!");
      navigate("/admin/dashboard");
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Username"
            name="username"
            placeholder="Admin"
            value={formData.username}
            onChange={(e) => handleChange("username", e)}
            error={errors.username.length > 0}
            errorMessage={errors.username[0]}
          />

          <PasswordInput
            label="Password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={(e) => handleChange("password", e)}
            error={errors.password.length > 0}
            errorMessage={errors.password[0]}
          />

          {invalidCredentials && (
            <p className="text-sm text-red-600 text-center">
              Invalid credentials
            </p>
          )}

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-100 rounded-md text-black text-center ">
          <div className="text-sm space-y-1">
            <p>
              <strong>Username:</strong> Admin
            </p>
            <p>
              <strong>Password:</strong> Admin1234
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-100 rounded-md text-black text-center pt-3">
          <div className="text-sm space-y-1">
            <p>
              <strong>Username:</strong> Analyst
            </p>
            <p>
              <strong>Password:</strong> Analyst1234
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
