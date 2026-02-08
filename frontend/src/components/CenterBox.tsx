import { Box } from "@mui/material";
import type { ReactNode } from "react";

type CenterBoxProps = {
  children: ReactNode;
};

const CenterBox = ({children} : CenterBoxProps) => {
  return (
    <>   
      <Box
        sx={{
          minHeight: "80%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
          p: 2, 
        }}
      >
        {children}
      </Box>
    </>
  );
};


export default CenterBox;