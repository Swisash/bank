import { Box } from '@mui/material';
import logo from '../assets/logo.png'

const Logo = ({width = 60, sx ={} }) => {
    return (
        <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{
        width: width,
        height: "auto",
        filter: "drop-shadow(0px 6px 12px rgba(70, 46, 46, 0.15))",
        mb: 0.5,
        ...sx,
    }}
    >
    </Box>
    ); 
}
export default Logo;

