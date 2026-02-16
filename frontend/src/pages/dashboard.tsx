import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Stack,
  Card,
  Avatar,
  Paper,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // אייקון לפתיחה
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/authApi";
import { useUser } from "../context/UserContext";
import  Logo  from "../components/Logo";


const Dashboard = () => {
    const navigate = useNavigate();
    const { user, account, transactions, setUserData } = useUser();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getCurrentUser();
                setUserData(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
    if (!user) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [user, setUserData]);

    if (loading) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#F6F7FB", width: "100%" }}>
            
            {/* Navbar */}
            <AppBar
                position="fixed"
                color="inherit"
                elevation={1}
                sx={{ bgcolor: "white", borderBottom: "1px solid", borderColor: "divider", borderRadius: 1 }}
            >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                           <Logo />
                        <Typography fontWeight={800} color="text.primary">SHIZZ BANK</Typography>
                        <Button startIcon={<SendIcon />} onClick={() => navigate('/transferMoney')} sx={{ textTransform: "none" }}>
                            Transfer
                        </Button>
                        <Button startIcon={<HistoryIcon />} onClick={() => navigate('/history')} sx={{ textTransform: "none" }}>
                            History
                        </Button>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {user && <Typography variant="subtitle2" fontWeight={600}>{user.firstName} {user.lastName}</Typography>}
                            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                        </Box>
                        <Button variant="outlined" size="small" startIcon={<LogoutIcon />} sx={{ textTransform: "none" }}>Logout</Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Box sx={(theme) => theme.mixins.toolbar} />

            <Container maxWidth={false} disableGutters sx={{ py: 0}}>

                <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, bgcolor: "white", borderBottom: "1px solid", borderColor: "divider" }}>
                    
                    {/* Header */}
                    <Box sx={{ mb: 4, textAlign: "center" }}>
                        <Typography variant="h4" fontWeight={800}>Welcome back, {user?.firstName}!</Typography>
                        <Typography color="text.secondary">Manage your finances and track your expenses</Typography>
                    </Box>

                    {/* Balance Card */}
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

                    {/* Transactions Section */}
                    <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight={700}>Recent Activity</Typography>
                            <Button variant="text" size="small" sx={{ textTransform: "none" }}>View All</Button>
                        </Stack>

                        <Stack spacing={1}>
                            {transactions?.slice(0,5).map((tx) => {
                                const isOutgoing = tx.fromEmail === user?.email;
                                
                                return (
                                    <Accordion 
                                        key={tx._id} 
                                        disableGutters 
                                        elevation={0} 
                                        sx={{ 
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: "12px !important",
                                            '&:before': { display: 'none' }, // מבטל את הקו המובנה של MUI
                                            overflow: 'hidden',
                                            bgcolor: "white"
                                        }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%', pr: 2 }}>
                                                {/* אייקון כניסה/יציאה בלבד */}
                                                <Avatar sx={{ 
                                                    bgcolor: isOutgoing ? "#ff9292ff" : "#b8f1bbff",
                                                    color: isOutgoing ? "error.main" : "success.main",
                                                    width: 40, height: 40 
                                                }}>
                                                    {isOutgoing ? <ArrowUpwardIcon fontSize="small"  /> : <ArrowDownwardIcon fontSize="small" />}
                                                </Avatar>

                                                {/* תיאור ותאריך */}
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight={700}>
                                                        {tx.description || (isOutgoing ? "Money Sent" : "Money Received")}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(tx.createdAt).toLocaleDateString('he-IL')}
                                                    </Typography>
                                                </Box>

                                                {/* סכום */}
                                                <Typography fontWeight={800} color={isOutgoing ? "error.main" : "success.main"}>
                                                    {isOutgoing ? `-` : `+`}{tx.amount.toLocaleString()} {account?.currency}
                                                </Typography>
                                            </Stack>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ bgcolor: "grey.50", borderTop: "1px solid", borderColor: "divider" }}>
                                            <Stack spacing={1}>
                                                <Stack direction="row" justifyContent="space-between">
                                                    <Typography variant="caption" color="text.primary"  fontWeight={600}>Transaction ID: {tx._id}</Typography>                                                
                                                </Stack>
                                                <Stack direction="row" justifyContent="space-between">
                                                    <Typography variant="caption" color="text.primary" fontWeight={600}>{isOutgoing ? "To:" : "From:"} {isOutgoing ? tx.toEmail : tx.fromEmail}</Typography>
                                                </Stack>
                                                <Stack direction="row" justifyContent="space-between">
                                                    <Typography variant="caption" color="text.primary" fontWeight={600}> Status: 
                                                        <Typography variant="caption" sx={{ color: 'info.main', textTransform: 'capitalize' }}> {tx.status}
                                                            </Typography> 
                                                    </Typography>
                                                    
                                                </Stack>
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Dashboard;

