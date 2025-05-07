// QR Code insertion
fetch("/api/qrcode")
  .then(res => res.json())
  .then(data => {
    const qrImg = document.createElement("img");
    qrImg.id = "qrcode-image";
    qrImg.src = data.qr;
    qrImg.alt = "QR code for upload";
    document.getElementById("qrcode-div").appendChild(qrImg);
  });