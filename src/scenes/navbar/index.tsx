import { useState } from "react";
import { Link } from "react-router-dom";
import InsightsIcon from '@mui/icons-material/Insights';
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";

// Import your chatbot component
import Chatbot from "@/components/Chatbot"; // adjust path if needed

const Navbar = () => {
  const { palette } = useTheme();
  const [selected, setSelected] = useState("dashboard");

  // State to toggle chatbot
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
        {/* LEFT SIDE (logo) */}
        <FlexBetween gap="0.75rem" onClick={() => setIsChatOpen(true)} sx={{ cursor: "pointer" }}>
          <InsightsIcon sx={{ fontSize: "28px" }} />
          <Typography variant="h4" fontSize="16px">
            FInSight
          </Typography>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="2rem">
          <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
            <Link
              to="/"
              onClick={() => setSelected("dashboard")}
              style={{
                color: selected === "dashboard" ? "inherit" : palette.grey[700],
                textDecoration: "inherit",
              }}
            >
              dashboard
            </Link>
          </Box>
          <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
            <Link
              to="/predictions"
              onClick={() => setSelected("predictions")}
              style={{
                color: selected === "predictions" ? "inherit" : palette.grey[700],
                textDecoration: "inherit",
              }}
            >
              predictions
            </Link>
          </Box>
        </FlexBetween>
      </FlexBetween>

      {/* Chatbot modal */}
      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default Navbar;
