import axios from "axios";

export const uploadInvoiceThumbnail = async (base64Image) => {
  if (!base64Image) throw new Error("No image provided");

  console.log("Uploading:", base64Image.substring(0, 50));

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dndae9cjq/image/upload",
      {
        file: base64Image,
        upload_preset: "addupload",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.secure_url;
  } catch (error) {
  console.log("FULL CLOUDINARY ERROR:");
  console.log(JSON.stringify(error.response?.data, null, 2));
  throw error;
}
};