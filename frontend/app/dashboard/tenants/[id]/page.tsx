"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createApiClient, Tenant } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, Banknote, Trash2, Pencil } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function TenantDetailPage() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const searchParams = useSearchParams();
  const fromPropertyId = searchParams.get("from");

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      if (!token) return;
      const api = createApiClient(token);
      const data = await api.getTenant(id);
      setTenant(data);
      setLoading(false);
    };
    load();
  }, [getToken, id]);

  const handleDelete = async () => {
    const token = await getToken();
    if (!token) return;
    const api = createApiClient(token);
    await api.deleteTenant(id);
    if (fromPropertyId) {
      router.push(`/dashboard/properties/${fromPropertyId}`);
    } else {
      router.push("/dashboard");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const daysUntilExpiry = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-softGray flex items-center justify-center">
        <p className="text-navy/40">Loading...</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-softGray flex items-center justify-center">
        <p className="text-navy/40">Tenant not found.</p>
      </div>
    );
  }

  const daysLeft = daysUntilExpiry(tenant.leaseEnd);
  const leaseExpiringSoon = daysLeft <= 90;

  return (
    <div className="min-h-screen bg-softGray">
      <nav className="bg-navy px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (fromPropertyId) {
                router.push(`/dashboard/properties/${fromPropertyId}`);
              } else {
                router.push("/dashboard");
              }
            }}
            className="text-white/60 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-white font-semibold text-lg">{tenant.name}</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-4">

        {/* Lease expiry warning */}
        {leaseExpiringSoon && (
          <div className={`rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2 ${
            daysLeft <= 30
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}>
            <Calendar className="w-4 h-4 flex-shrink-0" />
            {daysLeft <= 0
              ? "Lease has expired"
              : `Lease expires in ${daysLeft} days — ${formatDate(tenant.leaseEnd)}`}
          </div>
        )}

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs font-medium text-navy/40 uppercase tracking-wide mb-4">
              Contact
            </p>
            <div className="flex flex-direction-row gap-2">
              <Link
                href={`/dashboard/tenants/${id}/edit`}
                className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 border border-yellow-200 px-3 py-1.5 rounded-lg hover:border-yellow-300 transition"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:border-red-300 transition">
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove tenant</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {tenant.name}? Their lease and payment history will be deleted. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Remove tenant
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="space-y-3">
            <Link
              href={`mailto:${tenant.email}`}
              className="flex items-center gap-3 text-sm text-navy hover:text-royal transition"
            >
              <Mail className="w-4 h-4 text-navy/40" />
              {tenant.email}
            </Link>
            {tenant.phone && (
            <Link
                href={`tel:${tenant.phone}`}
                className="flex items-center gap-3 text-sm text-navy hover:text-royal transition"
            >
                <Phone className="w-4 h-4 text-navy/40" />
                {tenant.phone}
              </Link>
            )}
          </div>
        </div>

        {/* Lease details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-xs font-medium text-navy/40 uppercase tracking-wide mb-4">
            Lease details
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-navy/40 mb-1">Start date</p>
              <p className="text-sm font-medium text-navy">{formatDate(tenant.leaseStart)}</p>
            </div>
            <div>
              <p className="text-xs text-navy/40 mb-1">End date</p>
              <p className={`text-sm font-medium ${leaseExpiringSoon ? "text-amber-600" : "text-navy"}`}>
                {formatDate(tenant.leaseEnd)}
              </p>
            </div>
            <div>
              <p className="text-xs text-navy/40 mb-1">Rent due</p>
              <p className="text-sm font-medium text-navy">
                {tenant.rentDueDay}{tenant.rentDueDay === 1 ? "st" : tenant.rentDueDay === 2 ? "nd" : tenant.rentDueDay === 3 ? "rd" : "th"} of month
              </p>
            </div>
            <div>
              <p className="text-xs text-navy/40 mb-1">Security deposit</p>
              <p className="text-sm font-medium text-navy">€{tenant.deposit}</p>
            </div>
          </div>

          {/* Lease progress bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-navy/40 mb-1.5">
              <span>{formatDate(tenant.leaseStart)}</span>
              <span>{formatDate(tenant.leaseEnd)}</span>
            </div>
            <div className="h-1.5 bg-softGray rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(0,
                    ((new Date().getTime() - new Date(tenant.leaseStart).getTime()) /
                    (new Date(tenant.leaseEnd).getTime() - new Date(tenant.leaseStart).getTime())) * 100
                  ))}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Rent */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-xs font-medium text-navy/40 uppercase tracking-wide mb-4">
            Rent
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mint rounded-xl flex items-center justify-center">
              <Banknote className="w-5 h-5 text-emerald" />
            </div>
            <div>
              <p className="text-lg font-semibold text-navy">
                €{tenant.deposit}
              </p>
              <p className="text-xs text-navy/40">
                due on the {tenant.rentDueDay}{tenant.rentDueDay === 1 ? "st" : tenant.rentDueDay === 2 ? "nd" : tenant.rentDueDay === 3 ? "rd" : "th"} each month
              </p>
            </div>
          </div>
        </div>

        {/* Coming soon */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-navy/40">
            Payment history and maintenance requests coming in week 3
          </p>
        </div>

      </div>
    </div>
  );
}