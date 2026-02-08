import { Paper } from "@mui/material";
import PageIntro from "../PageIntro";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export const AuthCard = ({ title, subtitle, children }: AuthCardProps) => (
  <Paper
    elevation={8}
    sx={{
      p: 4,
      width: "100%",
      maxWidth: 420,
      minHeight: "100%",
      borderRadius: 3,
      alignItems: "center",
    }}
  >
    <PageIntro title={title} subtitle={subtitle} />
    {children}
  </Paper>
);
