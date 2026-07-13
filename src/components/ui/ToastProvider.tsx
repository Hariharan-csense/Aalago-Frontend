import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

type Severity = "success" | "error" | "info" | "warning";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

type ToastContextValue = {
  showToast: (message: string, severity?: Severity) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity>("info");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("Confirm");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmLabel, setConfirmLabel] = useState("Confirm");
  const [cancelLabel, setCancelLabel] = useState("Cancel");
  const confirmResolverRef = useRef<((value: boolean) => void) | null>(null);

  const showToast = useCallback((msg: string, sev: Severity = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions) => {
    setConfirmTitle(options.title ?? "Confirm");
    setConfirmMessage(options.message);
    setConfirmLabel(options.confirmLabel ?? "Confirm");
    setCancelLabel(options.cancelLabel ?? "Cancel");
    setConfirmOpen(true);
    return new Promise<boolean>((resolve) => {
      confirmResolverRef.current = resolve;
    });
  }, []);

  function closeConfirm(result: boolean) {
    setConfirmOpen(false);
    confirmResolverRef.current?.(result);
    confirmResolverRef.current = null;
  }

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          variant="filled"
          sx={{ width: "100%", minWidth: 280 }}
        >
          {message}
        </Alert>
      </Snackbar>

      <Dialog
        open={confirmOpen}
        onClose={() => closeConfirm(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>{confirmTitle}</DialogTitle>
        <DialogContent>
          <p className="m-0 text-charcoal/80 text-sm leading-relaxed">{confirmMessage}</p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => closeConfirm(false)} color="inherit">
            {cancelLabel}
          </Button>
          <Button
            onClick={() => closeConfirm(true)}
            variant="contained"
            sx={{ bgcolor: "#c41e2a", "&:hover": { bgcolor: "#9e1822" } }}
          >
            {confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default ToastProvider;
