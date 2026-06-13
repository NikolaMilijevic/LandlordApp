import { useAuth } from "@clerk/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Unit {
  id: string;
  label: string;
  monthlyRent: number;
  createdAt: string;
  tenants?: Tenant[];
}

export interface RentalProperty {
  id: string;
  clerkUserId: string;
  address: string;
  city: string;
  type: string;
  createdAt: string;
  units: Unit[];
}

export interface Tenant {
  id: string;
  unitId: string;
  name: string;
  email: string;
  phone: string;
  leaseStart: string;
  leaseEnd: string;
  deposit: number;
  rentDueDay: number;
  createdAt: string;
}

export interface CreatePropertyData {
  address: string;
  city: string;
  type: string;
  units: { label: string; monthlyRent: number }[];
}

export interface CreateTenantData {
  unitId: string;
  name: string;
  email: string;
  phone: string;
  leaseStart: string;
  leaseEnd: string;
  deposit: number;
  rentDueDay: number;
}

// API client factory — call this inside components with the token
export function createApiClient(token: string) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return {
    getProperties: async (): Promise<RentalProperty[]> => {
      const res = await fetch(`${API_URL}/api/properties`, { headers });
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },

    getProperty: async (id: string): Promise<RentalProperty> => {
      const res = await fetch(`${API_URL}/api/properties/${id}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch property");
      return res.json();
    },

    createProperty: async (data: CreatePropertyData): Promise<RentalProperty> => {
      const res = await fetch(`${API_URL}/api/properties`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create property");
      return res.json();
    },

    updateProperty: async (id: string, data: { address: string; city: string; type: string }): Promise<RentalProperty> => {
    const res = await fetch(`${API_URL}/api/properties/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update property");
    return res.json();
    },

    deleteProperty: async (id: string): Promise<void> => {
      const res = await fetch(`${API_URL}/api/properties/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to delete property");
    },

    getTenant: async (id: string): Promise<Tenant> => {
      const res = await fetch(`${API_URL}/api/tenants/${id}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch tenant");
      return res.json();
    },

    createTenant: async (data: CreateTenantData): Promise<Tenant> => {
      const res = await fetch(`${API_URL}/api/tenants`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create tenant");
      return res.json();
    },

    updateTenant: async (id: string, data: Omit<CreateTenantData, "unitId">): Promise<Tenant> => {
    const res = await fetch(`${API_URL}/api/tenants/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update tenant");
    return res.json();
    },

    deleteTenant: async (id: string): Promise<void> => {
      const res = await fetch(`${API_URL}/api/tenants/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to delete tenant");
    },
  };
}