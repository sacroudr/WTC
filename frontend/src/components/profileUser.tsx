// frontend/src/components/ProfileUserPopover.tsx

import React, { useState } from "react";
import {
  Popover,
  Typography,
  Box,
  
  Divider,
  Button,
} from "@mui/material";
import ChangePasswordDialog from "./changePasswordDialog";

interface ProfileUserPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  open: boolean;
}

const ProfileUserPopover: React.FC<ProfileUserPopoverProps> = ({ anchorEl, onClose, open }) => {


    const [openDialog, setOpenDialog] = useState(false);

  const token = localStorage.getItem("token");
  let prenom = "";
  let nom = "";
  let mail = "";

  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      mail = payload.mail || "";
      if (mail) {
        const parts = mail.split("@")[0].split(".");
        prenom = parts[0] || "";
        nom = parts[1] || "";
      }
    }
  } catch (error) {
    console.error("Erreur décodage token:", error);
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: { p: 2, width: 250, boxShadow: 3, borderRadius: 2 },
      }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={1}>
        <Box>
          <Typography variant="subtitle1">{prenom} {nom.toUpperCase()}</Typography>
          <Typography variant="body2" color="text.secondary">{mail}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box mt={2}>
        <Button
            fullWidth
            variant="outlined"
            onClick={() => setOpenDialog(true)}
            sx={{ textTransform: "none", borderRadius: 2 }}
        >
            Modifier mot de passe
        </Button>
        </Box>
        <ChangePasswordDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Popover>
  );
};

export default ProfileUserPopover;
