import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  
  useEffect(() => {
    if (scannerRef.current) return;
    const scanner =
      new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: 250,
        },
        false
      );
    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        await onScan(decodedText);
        scanner.clear();
      },
      () => {}
    );
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch(() => {});

        scannerRef.current = null;
      }
    };
  }, []);
  return <div id="reader"></div>;
}

export default QRScanner;