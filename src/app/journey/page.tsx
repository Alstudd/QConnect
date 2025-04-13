import LearnJourney from "~/components/LearnJourney";
export default function JourneyPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <LearnJourney />
      </div>
    </div>
  );
}
