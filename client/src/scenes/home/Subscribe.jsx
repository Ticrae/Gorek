import { Box, Typography, InputBase, Divider, IconButton } from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { useState } from "react";

const Subscribe = () => {
  const [email, setEmail] = useState("");

  return (
    <Box width={"80%"} margin={"80px auto"} textAlign={"center"}>
      <IconButton>
        <MarkEmailReadOutlinedIcon fontSize="large" />
      </IconButton>
      <Typography variant="h3">Subscribe To Our Newsletter</Typography>
      <Typography>
        and receive $20 coupon for your first order when you checkout
      </Typography>
      <Box
        width={"75%"}
        padding={"2px 4px"}
        margin={"15px auto"}
        display={"flex"}
        alignItems={"center"}
        bgcolor={"#f2f2f2"}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={"Enter Email"}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <Divider sx={{ m: 0.5, height: 28 }} orientation={"vertical"} />
        <Typography sx={{ padding: "10px", ":hover": { cursor: "pointer" } }}>
          Subscribe
        </Typography>
      </Box>
    </Box>
  );
};

export default Subscribe;
