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
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import api from "../api/fetch-backend";

const WelcomePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api("/auth/me", {
        method: "GET",
      });

      if (!response.success || !response.user) {
        throw new Error("User not found");
      }

      setUser(response.user);
    } catch (error) {
      setError(error.message || "Session expired. Please login again.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
        await api("/auth/logout", {
        method: "POST",
        });
    } catch (error) {
        console.error(error.message || "Logout failed");
    } finally {
        localStorage.removeItem("identifier");

        document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        navigate("/login");
    }
    };
  if (loading) {
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
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {user && (
              <>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Welcome, {user.name}
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  You are successfully logged in.
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Stack spacing={1.5}>
                  <Typography>
                    <strong>User ID:</strong> {user.id}
                  </Typography>

                  <Typography>
                    <strong>Name:</strong> {user.name || "N/A"}
                  </Typography>

                  <Typography>
                    <strong>Gender:</strong> {user.gender || "N/A"}
                  </Typography>

                  <Typography>
                    <strong>Email:</strong> {user.emailId || "N/A"}
                  </Typography>

                  <Typography>
                    <strong>Phone:</strong> {user.phoneNumber || "N/A"}
                  </Typography>
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  size="large"
                  onClick={handleLogout}
                  sx={{ mt: 4, py: 1.3, borderRadius: 2 }}
                >
                  Logout
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default WelcomePage;