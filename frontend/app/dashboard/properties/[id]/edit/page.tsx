"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { createApiClient } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditPropertyPage() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("House");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      const property = await api.getProperty(id);
      setAddress(property.address);
      setCity(property.city);
      setType(property.type);
      setFetching(false);
    };
    load();
  }, [getToken, id]);

  const handleSubmit = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) return;
    const api = createApiClient(token);
    await api.updateProperty(id, { address, city, type });
    router.push(`/dashboard/properties/${id}`);
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
        <Link
          href={`/dashboard/properties/${id}`}
          className="text-white/60 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-white font-semibold text-lg">Edit property</span>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1.5">Street address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1.5">City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1.5">Property type</label>
            <div className="grid grid-cols-3 gap-3">
              {["House", "Apartment", "Multi-unit"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-3 rounded-xl border text-sm font-medium transition ${
                    type === t
                      ? "border-emerald bg-mint text-emerald"
                      : "border-gray-200 text-navy/60 hover:border-gray-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !address || !city}
            className="w-full bg-emerald text-navy font-semibold py-3.5 rounded-xl hover:bg-emerald/90 transition text-sm disabled:opacity-40"
          >
            {loading ? "Saving..." : "Save changes →"}
          </button>
        </div>
      </div>
    </div>
  );
}