/**
 * Uploads a file to ImageKit via our internal Next.js API route
 * @param {File} file - Browser File object
 * @param {string} [folder] - Target folder in ImageKit (e.g. "/products")
 * @returns {Promise<{ url: string, fileId: string, name: string }>}
 */
export async function uploadImage(file, folder = "/products") {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Image upload failed");
  }

  return data;
}
