import RegisterForEvent from "@/components/RegisterForEvents";

export default function TestPage() {
  return (
    <div className="p-10">
      <RegisterForEvent
        eventName="Test Event"
        maxPart={3}
        minPart={1}
        regFees={100}
      />
    </div>
  );
}