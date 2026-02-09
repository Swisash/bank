import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  AppBar,
  Toolbar,
  Card,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { transferMoney } from "../api/transactionsApi";
import { getCurrentUser } from "../api/authApi";
import { useUser } from "../context/UserContext";


const TransferMoney = () => {
  const navigate = useNavigate();
  const { user, account, setUserData } = useUser();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleTransferMoney = async () => {
    setError("");
    try {
      await transferMoney(recipientEmail, amount, description);
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message);
      console.error("Transfer failed:", error.message);
    }
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAccount();
  }, [user,account,setUserData]);

  return (
    <Box sx={{ bgcolor: "#F5F7FB", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar
        position="fixed"
        color="inherit"
        elevation={1}
        sx={{ bgcolor: "white", borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
           <Stack direction="row" spacing={2} alignItems="center">
          <Typography fontWeight={700} color="text.primary">SHIZZ BANK</Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
            sx={{ px: 2, textTransform: "none" }}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
          <Box sx={{ width: 100 }} />
         </Stack> 
           
          <Stack direction="row" spacing={2} alignItems="center">
      <Box textAlign="right">
        <Typography variant="subtitle2" fontWeight={600}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.email}
        </Typography>
      </Box>
    </Stack>
            
        </Toolbar>
      </AppBar>

      {/* Spacer for fixed AppBar */}
      <Box sx={(theme) => theme.mixins.toolbar} />

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Stack spacing={4}>

          {/* ===== Transfer Summary ===== */}
          <Card sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            background: "linear-gradient(110deg, #0A8F7F 0%, #1E66D0 55%, #6C63FF 100%)",
            color: "white",
            mb: 5,
            boxShadow: "0 14px 40px rgba(30, 102, 208, 0.25)"
        }}>
            <Stack spacing={2} alignItems="center">
                <Box sx={{ px: 2, py: 0.6, borderRadius: 999, bgcolor: "rgba(255,255,255,0.18)" }}>
                    <Typography variant="body2" sx={{ opacity: 0.95 }}>Available Balance</Typography>
                </Box>
                <Typography variant="h2" fontWeight={800} sx={{ lineHeight: 1 }}>
                    {account?.balance.toLocaleString()} {account?.currency}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.light" }} />
                    <Typography variant="caption" sx={{ opacity: 0.9, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Account Status: {account?.status}
                    </Typography>
                </Stack>
            </Stack>
        </Card>

          {/* ===== Transfer Details ===== */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SendIcon fontSize="small" color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Transfer Details
                </Typography>
              </Stack>

              <TextField
                label="Recipient email"
                placeholder="demo@shizzbank.com"
                fullWidth
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />

              <TextField
                label="Amount (ILS)"
                type="number"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              <TextField
                label="Description"
                multiline
                rows={3}
                placeholder="Payment for..."
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {error && (
                <Typography color="error" variant="caption">
                  {error}
                </Typography>
              )}

              <Button
                variant="highlighted"
                size="large"
                startIcon={<SendIcon />}
                sx={{ py: 1.5, mt: 1 }}
                onClick={handleTransferMoney}
              >
                Send Money
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default TransferMoney;
