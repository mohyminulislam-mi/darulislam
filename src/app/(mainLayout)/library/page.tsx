import axios from "axios";
import ContentSections from "@/src/components/library/ContentSections";
import PrayerTimesResponsive from "@/src/components/library/Library";

export interface MetadataCounts {
  ilm?: Record<string, number>;
  amol?: Record<string, number>;
  dawah?: Record<string, number>;
}

async function getLibraryMetadata(): Promise<MetadataCounts> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const response = await axios.get(`${baseUrl}/library/metadata`, {
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.data?.success) {
      return response.data.counts || {};
    }
    return {};
  } catch (error) {
    console.error("Failed to fetch library metadata:", error);
    return {};
  }
}

const page = async () => {
  const metadataCounts = await getLibraryMetadata();

  return (
    <div>
      <PrayerTimesResponsive />
      <ContentSections metadataCounts={metadataCounts} />
    </div>
  );
};

export default page;