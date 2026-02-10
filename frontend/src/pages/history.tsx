import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Stack,
  Avatar,
  Paper,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNew";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // אייקון לפתיחה
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useEffect } from "react";
import { getCurrentUser } from "../api/authApi";
import type { GetCurrentUserResponse } from "../api/types";


const History = () => {
    const navigate = useNavigate();
    // 1. Destructure setUserData so you can actually use it
    const { user, account, transactions, setUserData } = useUser();

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const data = await getCurrentUser();
                setUserData(data);
            } catch (err) {
                console.error("Fetch failed:", err);
            }
        };

        // 2. Only fetch if we don't have the data yet to save API calls
        if (!transactions) {
            fetchAccount();
        }
        
        // 3. Keep dependency array simple to avoid infinite loops
    }, [setUserData]); 
      
    // 4. Handle the state accurately
    if (!transactions) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography>Loading your history...</Typography>
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
                        <Typography fontWeight={800} color="text.primary">SHIZZ BANK</Typography>
                            <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
                            sx={{ px: 2, textTransform: "none" }}
                            onClick={() => navigate("/dashboard")}
                        >
                        Back to Dashboard
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
                        <Typography variant="h4" fontWeight={800}>Transactions History</Typography>
                        <Typography color="text.secondary">All your transactions in one place</Typography>
                    </Box>


                    {/* Transactions Section */}
                    <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight={700}>Recent Activity</Typography>
                        </Stack>

                        <Stack spacing={1}>
                            {transactions?.map((tx) => {
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

}

export default History;

function setUserData(data: GetCurrentUserResponse) {
    throw new Error("Function not implemented.");
}
