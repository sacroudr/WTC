import React, { useState } from "react";
import {
  Dialog,
//   DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
  Paper,
  Divider,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ open, onClose }) => {
  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");

  const [showAncien, setShowAncien] = useState(false);
  const [showNouveau, setShowNouveau] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token non trouvé.");

      const payload = JSON.parse(atob(token.split(".")[1]));
      const mail = payload.mail;

      await axios.post("http://127.0.0.1:8000/utilisateurs/auth/change-password", {
        mail,
        ancien_mot_de_passe: ancienMotDePasse,
        nouveau_mot_de_passe: nouveauMotDePasse,
      });

      setSuccess(true);
      setSnackbarOpen(true);
      setAncienMotDePasse("");
      setNouveauMotDePasse("");
      setConfirmationMotDePasse("");
      onClose();
    } catch (err: unknown) {
        let message = "Erreur lors de la mise à jour.";
        if (axios.isAxiosError(err)) {
            message = err.response?.data?.detail || message;
            if (Array.isArray(message)) {
            message = message[0]?.msg;
            }
        }
        setError(message);
        setSnackbarOpen(true);
        }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
            Modifier le mot de passe
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                type={showAncien ? "text" : "password"}
                label="Ancien mot de passe"
                value={ancienMotDePasse}
                onChange={(e) => setAncienMotDePasse(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowAncien((prev) => !prev)} edge="end">
                        {showAncien ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                type={showNouveau ? "text" : "password"}
                label="Nouveau mot de passe"
                value={nouveauMotDePasse}
                onChange={(e) => setNouveauMotDePasse(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNouveau((prev) => !prev)} edge="end">
                        {showNouveau ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                type={showConfirmation ? "text" : "password"}
                label="Confirmer le mot de passe"
                value={confirmationMotDePasse}
                onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmation((prev) => !prev)} edge="end">
                        {showConfirmation ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Typography color="error" fontSize={14}>
                  {error}
                </Typography>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ mt: 1, justifyContent: "flex-end" }}>
            <Button onClick={onClose} color="secondary" variant="text">
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: "linear-gradient(45deg, #3168B1, #1e487a)",
                color: "#fff",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(45deg, #275a9e, #16355b)",
                },
              }}
            >
              {loading ? "En cours..." : "Valider"}
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {success ? "Mot de passe mis à jour avec succès !" : error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChangePasswordDialog;
