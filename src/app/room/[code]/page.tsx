import RoomPageClient from "./RoomPageClient";

export const instant = false;

export default async function RoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return <RoomPageClient code={code} />;
}