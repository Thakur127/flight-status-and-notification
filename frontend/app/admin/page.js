import Dashboard from "@/components/Dashboard/Dashboard";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Head from "next/head";

export const metadata = {
  title: "Flight status - Admin",
};

const page = () => {
  return (
    <MaxWidthWrapper className="">
      <div className="p-4">
        <h1 className="text-3xl font-semibold">Admin Panel</h1>
        <Dashboard />
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
