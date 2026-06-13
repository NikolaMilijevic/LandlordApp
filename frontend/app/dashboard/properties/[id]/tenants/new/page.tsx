"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createApiClient } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewTenantPage() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = params.id as string;
  const unitId = searchParams.get("unitId") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [leaseStart, setLeaseStart] = useState("");
  const [leaseEnd, setLeaseEnd] = useState("");
  const [deposit, setDeposit] = useState("");
  const [rentDueDay, setRentDueDay] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const api = createApiClient(token);
      await api.createTenant({
        unitId,
        name,
        email,
        phone,
        leaseStart,
        leaseEnd,
        deposit: parseFloat(deposit) || 0,
        rentDueDay: parseInt(rentDueDay) || 1,
      });
      router.push(`/dashboard/properties/${propertyId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 focus:border-emerald";

  const isValid = name && email && leaseStart && leaseEnd;

  return (
    <div className="min-h-screen bg-softGray">
      <nav className="bg-navy px-8 py-4 flex items-center gap-4">
        <Link
          href={`/dashboard/properties/${propertyId}`}
          className="text-white/60 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-white font-semibold text-lg">Add tenant</span>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-4">

          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1.5">
              Full name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ana Petrović"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1.5">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ana@email.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1.5">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+381 63 555 1234"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-navy/60 mb-1.5">
                Lease start <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={leaseStart}
                onChange={(e) => setLeaseStart(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/60 mb-1.5">
                Lease end <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={leaseEnd}
                onChange={(e) => setLeaseEnd(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-navy/60 mb-1.5">
                Security deposit (€)
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/60 mb-1.5">
                Rent due day
              </label>
              <select
                value={rentDueDay}
                onChange={(e) => setRentDueDay(e.target.value)}
                className={inputClass}
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}{d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th"} of month
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="w-full bg-emerald text-navy font-semibold py-3.5 rounded-xl hover:bg-emerald/90 transition text-sm disabled:opacity-40 mt-2"
          >
            {loading ? "Saving..." : "Add tenant →"}
          </button>
        </div>
      </div>
    </div>
  );
}