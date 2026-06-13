"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { createApiClient, RentalProperty } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Plus, User, Trash2, Pencil } from "lucide-react";

export default function PropertyDetailPage() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [property, setProperty] = useState<RentalProperty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      const data = await api.getProperty(id);
      setProperty(data);
      setLoading(false);
    };
    load();
  }, [getToken, id]);

  const handleDeleteProperty = async () => {
    if (!confirm("Delete this property and all its data?")) return;
    const token = await getToken();
    if (!token) return;
    const api = createApiClient(token);
    await api.deleteProperty(id);
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-softGray flex items-center justify-center">
        <p className="text-navy/40">Loading...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-softGray flex items-center justify-center">
        <p className="text-navy/40">Property not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-softGray">
        <nav className="bg-navy px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-white/60 hover:text-white transition">
                <ArrowLeft className="w-5 h-5" />
                </Link>
                <span className="text-white font-semibold text-lg">
                {property.address}
                </span>
            </div>
            <div className="flex items-center gap-3">
                <Link
                href={`/dashboard/properties/${id}/edit`}
                className="text-white/60 hover:text-white transition"
                >
                <Pencil className="w-5 h-5" />
                </Link>
                <button
                onClick={handleDeleteProperty}
                className="text-white/40 hover:text-red-400 transition"
                >
                <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Property info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-navy/40 uppercase tracking-wide mb-1">City</p>
              <p className="font-semibold text-navy">{property.city}</p>
            </div>
            <div>
              <p className="text-xs text-navy/40 uppercase tracking-wide mb-1">Type</p>
              <p className="font-semibold text-navy">{property.type}</p>
            </div>
            <div>
              <p className="text-xs text-navy/40 uppercase tracking-wide mb-1">Units</p>
              <p className="font-semibold text-navy">{property.units.length}</p>
            </div>
          </div>
        </div>

        {/* Units */}
        <div className="space-y-4">
          {property.units.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-navy">{unit.label}</h3>
                  <p className="text-sm text-navy/50">€{unit.monthlyRent}/month</p>
                </div>
                <Link
                  href={`/dashboard/properties/${id}/tenants/new?unitId=${unit.id}`}
                  className="inline-flex items-center gap-1.5 bg-mint text-emerald text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-emerald/20 transition"
                >
                  <Plus className="w-3 h-3" />
                  Add tenant
                </Link>
              </div>

              {/* Tenants */}
              {unit.tenants && unit.tenants.length > 0 ? (
                <div className="space-y-2">
                  {unit.tenants.map((tenant) => (
                    <Link
                      key={tenant.id}
                      href={`/dashboard/tenants/${tenant.id}`}
                      className="flex items-center gap-3 p-3 bg-softGray rounded-xl hover:bg-lightBlue transition"
                    >
                      <div className="w-8 h-8 bg-lightBlue rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-royal" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">{tenant.name}</p>
                        <p className="text-xs text-navy/50">{tenant.email}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-navy/40 text-center py-4">
                  No tenants yet — add one above
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}