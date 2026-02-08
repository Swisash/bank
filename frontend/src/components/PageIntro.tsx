import { Box, Typography } from "@mui/material";
import logo from "../assets/logo.png";

type PageIntroProps = {
    title: string,
    subtitle: string | undefined
}


const PageIntro = ({ title  ,subtitle } : PageIntroProps ) => (
  <Box textAlign="center" mb={2} sx={{alignItems:'center'}}>
    <Box
      component="img"
      src={logo}
      alt="Logo"
      sx={{
        width: 140,
        height: "auto",
        filter: "drop-shadow(0px 6px 12px rgba(70, 46, 46, 0.15))",
        mb: 0.5,
      }}
    />
    <Typography variant="h4" fontWeight="bold" sx={{ mb: subtitle ? 0.5 : 0 }} >{title}</Typography>
    <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
  </Box>
);


export default PageIntro;
