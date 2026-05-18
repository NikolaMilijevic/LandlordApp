import Link from "next/link";

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px", gap: "16px" }}>
      <h1>Landlord App</h1>
      <p>Property management for small landlords</p>
      <div style={{ display: "flex", gap: "12px" }}>
        <Link href="/sign-in">Sign in</Link>
        <Link href="/sign-up">Sign up</Link>
      </div>
    </div>
  );
}