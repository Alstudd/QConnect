import { JoinClass } from "~/components/JoinClass";

export default function Page({ params }: { params: { id: string } }) {
  const classId = params.id;

  return <JoinClass classId={classId} />;
}
