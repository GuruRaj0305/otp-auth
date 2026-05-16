import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import api from "../api/fetch-backend";

const isEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const isPhoneNumber = (value) => {
  return /^[6-9]\d{9}$/.test(value);
};

const validateIdentifier = (value) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Email or phone number is required";
  }

  if (!isEmail(trimmedValue) && !isPhoneNumber(trimmedValue)) {
    return "Enter a valid email or 10-digit Indian phone number";
  }

  return "";
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (event) => {
    event.preventDefault();

    setFieldError("");
    setApiError("");
    setSuccessMessage("");

    const validationError = validateIdentifier(identifier);

    if (validationError) {
      setFieldError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await api("/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({
          identifier: identifier.trim(),
        }),
      });

      localStorage.setItem("identifier", identifier.trim());

      setSuccessMessage(response.message || "OTP sent successfully");

      setTimeout(() => {
        navigate("/verify-otp");
      }, 500);
    } catch (error) {
      setApiError(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ width: "100%", borderRadius: 3, boxShadow: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Login with OTP
            </Typography>

            {apiError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {apiError}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSendOtp}>
              <TextField
                fullWidth
                label="Email or Phone Number"
                placeholder="Email or Phone Number"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  setFieldError("");
                  setApiError("");
                }}
                error={Boolean(fieldError)}
                helperText={fieldError}
                sx={{ mb: 3 }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.3, borderRadius: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Send OTP"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;