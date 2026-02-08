import { Box, TextField, Stack, Button, Typography, Link, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupUser } from "../api/authApi";

import CenterBox from "../components/CenterBox";
import { AuthCard } from "../components/auth/AuthCard";

const Signup = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = async () => {
    try {
      await signupUser(email ,password ,firstName ,lastName ,phone);
      navigate("/login");
    } catch (error) {
      // add error message after
    }
  };

  return (
    <CenterBox>
      <AuthCard
        title="Create Account"
        subtitle="Join us and enjoy advanced banking"
      >
        <Stack spacing={2.5}>
          <TextField
            label="First Name"
            placeholder="John"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <TextField
            label="Last Name"
            placeholder="Doe"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <TextField
            label="Email"
            placeholder="your@email.com"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Phone"
            placeholder="+1 (555) 000-0000"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button variant="highlighted" fullWidth onClick={handleSignup}>
            Sign Up
          </Button>

          <Box mt={1}>
            <Divider>
              <Typography variant="caption" color="text.secondary">
                or
              </Typography>
            </Divider>
          </Box>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already have an account?
          </Typography>

          <Link
            component="button"
            onClick={() => navigate("/login")}
            sx={{
              fontWeight: "bold",
              textDecoration: "none",
              color: "#635bff",
              textAlign: "center",
            }}
          >
            Sign In
          </Link>
        </Stack>
      </AuthCard>
    </CenterBox>
  );
};

export default Signup;
