import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import api from "../api/fetch-backend";

const validateOtp = (otp) => {
  const trimmedOtp = otp.trim();

  if (!trimmedOtp) {
    return "OTP is required";
  }

  if (!/^\d+$/.test(trimmedOtp)) {
    return "OTP must contain only numbers";
  }

  if (trimmedOtp.length !== 6) {
    return "OTP must be 6 digits";
  }

  return "";
};

const VerifyOtpPage = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedIdentifier = localStorage.getItem("identifier");

    if (!savedIdentifier) {
      navigate("/login");
      return;
    }

    setIdentifier(savedIdentifier);
  }, [navigate]);

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const validationError = validateOtp(otp);

    if (validationError) {
        setError(validationError);
        return;
    }

    try {
        setLoading(true);

        const response = await api("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
            identifier,
            otp: otp.trim(),
        }),
        });

        const token = response.token;

        if (token) {
        document.cookie = `accessToken=${token}; path=/`;
        localStorage.setItem("accessToken", token);
        }

        setSuccessMessage(response.message || "OTP verified successfully");

        setTimeout(() => {
        navigate("/welcome");
        }, 500);
    } catch (error) {
        setError(error.message || "Invalid OTP. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleChangeIdentifier = () => {
    localStorage.removeItem("identifier");
    navigate("/login");
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
              Verify OTP
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Enter the OTP sent to{" "}
              <strong>{identifier}</strong>
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleVerifyOtp}>
              <TextField
                fullWidth
                label="OTP"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(event) => {
                    const value = event.target.value;

                    setError("");

                    if (/^\d*$/.test(value) && value.length <= 6) {
                    setOtp(value);
                    }
                }}
                error={Boolean(error)}
                helperText={error}
                sx={{ mb: 3 }}
              />

              <Stack spacing={2}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.3, borderRadius: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Verify OTP"}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleChangeIdentifier}
                  disabled={loading}
                  sx={{ py: 1.3, borderRadius: 2 }}
                >
                  Change Email / Phone
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default VerifyOtpPage;