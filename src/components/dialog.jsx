"use client";
import { createContext, useContext, useState } from "react";

// Tạo context để chia sẻ trạng thái mở/tắt dialog.
const DialogContext = createContext();

export default function Dialog({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

// Sub-component "Trigger"
Dialog.Trigger = function ({ children }) {
  const { setOpen } = useContext(DialogContext);
  return (
    <div onClick={() => setOpen(true)} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
};

// Sub-component "Content"
Dialog.Content = function ({ children, className }) {
  const { open, setOpen } = useContext(DialogContext);

  if (!open) return null;

  // Bạn có thể thêm CSS tùy ý, hoặc UI library.
  return (
    <div className={className || ""} style={{
      backgroundColor: "#ffffff",
      position: "relative",
      padding: "1rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      marginTop: "1rem"
    }}>
      {/* Nút đóng */}
      <button onClick={() => setOpen(false)} style={{ float: "right" }}>X</button>
      {children}
    </div>
  );
};
