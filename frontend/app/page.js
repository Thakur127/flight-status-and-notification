import FlightTable from "@/components/FlightStatus/FlightTable";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="p-4">
        <div className="relative">
          <h1 className="text-3xl font-semibold">Flight Status</h1>
          <span className="px-1 border rounded-full bg-green-500 text-gray-100 text-xs">
            Live
          </span>
        </div>
        <FlightTable />
      </div>
    </MaxWidthWrapper>
  );
}
