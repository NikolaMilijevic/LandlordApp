"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createApiClient } from "@/lib/api";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UnitInput {
  label: string;
  monthlyRent: string;
}

export default function NewPropertyPage() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("House");
  const [units, setUnits] = useState<UnitInput[]>([
    { label: "", monthlyRent: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addUnit = () =>
    setUnits([...units, { label: "", monthlyRent: "" }]);

  const removeUnit = (i: number) =>
    setUnits(units.filter((_, idx) => idx !== i));

  const updateUnit = (i: number, field: keyof UnitInput, value: string) => {
    const updated = [...units];
    updated[i][field] = value;
    setUnits(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const api = createApiClient(token);
      await api.createProperty({
        address,
        city,
        type,
        units: units.map((u) => ({
          label: u.label || `Unit ${units.indexOf(u) + 1}`,
          monthlyRent: parseFloat(u.monthlyRent) || 0,
        })),
      });
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 focus:border-emerald";

  return (
    <div className="min-h-screen bg-softGray">
      <nav className="bg-navy px-8 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-white/60 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-white font-semibold text-lg">Add property</span>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-10">

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
                step >= s
                  ? "bg-emerald text-navy"
                  : "bg-gray-200 text-navy/40"
              }`}>
                {s}
              </div>
              {s === 1 && (
                <div className={`h-0.5 w-16 transition ${
                  step > 1 ? "bg-emerald" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
          <span className="text-sm text-navy/50 ml-2">
            {step === 1 ? "Property details" : "Units"}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-navy/60 mb-1.5">
                  Street address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 14 Maple Street"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy/60 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Belgrade"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy/60 mb-1.5">
                  Property type
                </label>
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
                onClick={() => setStep(2)}
                disabled={!address || !city}
                className="w-full bg-emerald text-navy font-semibold py-3 rounded-xl hover:bg-emerald/90 transition text-sm disabled:opacity-40 mt-2"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <div className="space-y-3 mb-4">
                {units.map((unit, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="text-xs text-navy/40 min-w-[50px]">
                      Unit {i + 1}
                    </span>
                    <input
                      type="text"
                      value={unit.label}
                      onChange={(e) => updateUnit(i, "label", e.target.value)}
                      placeholder="Label (e.g. Ground floor)"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      value={unit.monthlyRent}
                      onChange={(e) => updateUnit(i, "monthlyRent", e.target.value)}
                      placeholder="€/mo"
                      className={`${inputClass} w-28`}
                    />
                    {units.length > 1 && (
                      <button
                        onClick={() => removeUnit(i)}
                        className="text-navy/30 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addUnit}
                className="w-full border border-dashed border-gray-300 text-navy/50 text-sm py-2.5 rounded-xl hover:border-emerald hover:text-emerald transition mb-6"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Add another unit
              </button>

              {error && (
                <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 text-navy/60 font-medium py-3 rounded-xl hover:bg-softGray transition text-sm"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-emerald text-navy font-semibold py-3 rounded-xl hover:bg-emerald/90 transition text-sm disabled:opacity-40"
                >
                  {loading ? "Saving..." : "Save property ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}