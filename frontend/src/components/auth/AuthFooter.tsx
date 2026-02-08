import { Typography, Link } from "@mui/material";

type AuthFooterProps = {
  text: string;
  actionLabel: string;
  onAction: () => void;
};

const AuthFooter = ({ text, actionLabel, onAction }: AuthFooterProps) => (
  <Typography variant="body2" textAlign="center">
    {text}{" "}
    <Link
      component="button"
      onClick={onAction}
      sx={{ fontWeight: "bold", textDecoration: "none" , color:"#635bff"}}
    >
      {actionLabel}
    </Link>
  </Typography>
);

export default AuthFooter;
