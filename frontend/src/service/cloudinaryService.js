import axios from "axios";

export const uploadInvoiceThumbnail = async (base64Image) => {
  if (!base64Image) {
    throw new Error("No image provided for Cloudinary upload");
  }

  // Convert base64 string to a Blob
  const res = await fetch(base64Image);
  const blob = await res.blob();

  const formData = new FormData();
  formData.append("file", blob, `invoice_${Date.now()}.png`);
  formData.append("upload_preset", "addupload");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dhadf5h7j/image/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.secure_url; // URL of uploaded image
  } catch (error) {
    console.error(
      "Cloudinary Upload Error:",
      error.response?.data || error
    );
    throw error;
  }
};
