import { JoinClass } from "~/components/JoinClass";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const classId = id;

  return <JoinClass classId={classId} />;
}
