"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { createApiClient, RentalProperty } from "@/lib/api";
import { Building2, Plus, ChevronRight } from "lucide-react";

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [properties, setProperties] = useState<RentalProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      const data = await api.getProperties();
      setProperties(data);
      setLoading(false);
    };
    load();
  }, [getToken]);

  return (
    <div className="min-h-screen bg-softGray">

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-4 bg-navy border-b border-white/10">
        <nav className="flex items-center gap-3">
          <Image
              src="/lessor_logo_only_transparent.png"
              alt="Lessor logo"
              width={36}
              height={36}
              className="object-contain brightness-0 invert"
            />
          <span className="text-white font-semibold text-lg tracking-tight">Lessor</span>
        </nav>
        <UserButton />
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-navy">Your properties</h1>
            <p className="text-navy/60 text-sm mt-1">
              {properties.length === 0
                ? "No properties yet"
                : `${properties.length} ${properties.length === 1 ? "property" : "properties"}`}
            </p>
          </div>
          <Link
            href="/dashboard/properties/new"
            className="inline-flex items-center gap-2 bg-emerald text-navy font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald/90 transition text-sm"
          >
            <Plus className="w-4 h-4" />
            Add property
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-navy/40">
            Loading properties...
          </div>
        )}

        {/* Empty state */}
        {!loading && properties.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <Building2 className="w-12 h-12 text-navy/20 mx-auto mb-4" />
            <h2 className="text-navy font-semibold text-lg mb-2">
              Add your first property
            </h2>
            <p className="text-navy/50 text-sm mb-6">
              Start by adding a property and its units.
            </p>
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center gap-2 bg-emerald text-navy font-semibold px-6 py-3 rounded-xl hover:bg-emerald/90 transition text-sm"
            >
              <Plus className="w-4 h-4" />
              Add property
            </Link>
          </div>
        )}

        {/* Property list */}
        {!loading && properties.length > 0 && (
          <div className="space-y-4">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/dashboard/properties/${property.id}`}
                className="block bg-white rounded-2xl border border-gray-200 p-6 hover:border-emerald/40 transition group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-navy text-base">
                      {property.address}
                    </h3>
                    <p className="text-navy/50 text-sm mt-0.5">
                      {property.city} · {property.type} · {property.units.length}{" "}
                      {property.units.length === 1 ? "unit" : "units"}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-navy/30 group-hover:text-emerald transition" />
                </div>

                {property.units.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.units.map((unit) => (
                      <span
                        key={unit.id}
                        className="text-xs bg-softGray text-navy/60 px-3 py-1 rounded-full"
                      >
                        {unit.label} — €{unit.monthlyRent}/mo
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}