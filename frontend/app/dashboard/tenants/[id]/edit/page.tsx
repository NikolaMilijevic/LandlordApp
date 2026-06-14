"use client";

import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createApiClient } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

function EditTenantContent() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const searchParams = useSearchParams();
  const fromPropertyId = searchParams.get("from");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [leaseStart, setLeaseStart] = useState("");
  const [leaseEnd, setLeaseEnd] = useState("");
  const [deposit, setDeposit] = useState("");
  const [rentDueDay, setRentDueDay] = useState("1");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      const tenant = await api.getTenant(id);
      setName(tenant.name);
      setEmail(tenant.email);
      setPhone(tenant.phone);
      setLeaseStart(tenant.leaseStart.split("T")[0]);
      setLeaseEnd(tenant.leaseEnd.split("T")[0]);
      setDeposit(tenant.deposit.toString());
      setRentDueDay(tenant.rentDueDay.toString());
      setFetching(false);
    };
    load();
  }, [getToken, id]);

  const handleSubmit = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) return;
    const api = createApiClient(token);
    await api.updateTenant(id, {
      name,
      email,
      phone,
      leaseStart,
      leaseEnd,
      deposit: parseFloat(deposit) || 0,
      rentDueDay: parseInt(rentDueDay) || 1,
    });
    router.push(`/dashboard/tenants/${id}?from=${fromPropertyId ?? ""}`);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 focus:border-emerald";

  if (fetching) {
    return (
      <div className="min-h-screen bg-softGray flex items-center justify-center">
        <p className="text-navy/40">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-softGray">
      <nav className="bg-navy px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push(`/dashboard/tenants/${id}?from=${fromPropertyId ?? ""}`)}
          className="text-white/60 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-semibold text-lg">Edit tenant</span>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1.5">Full name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1.5">Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-navy/60 mb-1.5">Lease start</label>
              <input type="date" value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/60 mb-1.5">Lease end</label>
              <input type="date" value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-navy/60 mb-1.5">Security deposit (€)</label>
              <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/60 mb-1.5">Rent due day</label>
              <select value={rentDueDay} onChange={(e) => setRentDueDay(e.target.value)} className={inputClass}>
                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}{d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th"} of month
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-emerald text-navy font-semibold py-3.5 rounded-xl hover:bg-emerald/90 transition text-sm disabled:opacity-40"
          >
            {loading ? "Saving..." : "Save changes →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditTenantPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-softGray flex items-center justify-center">
        <p className="text-navy/40">Loading...</p>
      </div>
    }>
      <EditTenantContent />
    </Suspense>
  );
}