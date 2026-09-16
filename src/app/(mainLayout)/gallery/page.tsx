import GalleryClient from "@/src/components/gallery/GalleryClient";

async function getGalleryData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/gallery?limit=50`,
      {
        next: { revalidate: 10 }, // ১০ সেকেন্ড পর পর নতুন ডাটা চেক করবে (টেস্টিং এর জন্য পারফেক্ট)
      },
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const assets = await getGalleryData();

  console.log("Fetched Assets From DB:", assets);

  return <GalleryClient initialImages={assets} />;
}
