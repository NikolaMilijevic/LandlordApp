import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/health`,
    { cache: "no-store" }
  );
  const data = await res.json();

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Landlord App</h1>
        <UserButton />
      </div>
      <p>Clerk user ID: {userId}</p>
      <p>API status: {data.status}</p>
    </div>
  );
}