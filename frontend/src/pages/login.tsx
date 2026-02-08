
import CenterBox from "../components/CenterBox";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { AuthCard } from "../components/auth/AuthCard";
import { AuthForm } from "../components/auth/AuthForm";
import { Box, Button, Divider, Typography } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <CenterBox>
      <AuthCard
        title="Sign In"
        subtitle="Welcome to your digital banking services"
      >
        <AuthForm
          submitLabel="Sign In"
          error={error}
          onSubmit={handleLogin}
          fields={[
            {
              label: "Email",
              value: email,
              onChange: setEmail,
            },
            {
              label: "Password",
              type: "password",
              value: password,
              onChange: setPassword,
            },
          ]}
        />

        <Box mt={3} mb={2}>
          <Divider>
            <Typography variant="caption" color="text.secondary">
              or
            </Typography>
          </Divider>
        </Box>

        <Typography variant="body2" textAlign="center" color="text.secondary" mb={1.5}>
          Don't have an account?
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/signup")}
          sx={{
            borderWidth: 2,
            fontWeight: "bold",
            py: 1.2,
          }}
        >
          Create Account
        </Button>
      </AuthCard>
    </CenterBox>
  );
};

export default Login;
