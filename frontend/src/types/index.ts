export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface NdviPoint {
  date: string;
  ndvi: number;
  ndre: number;
}

export interface Flight {
  id: string;
  field: string;
  date: string;
  status: "completed" | "processing" | "failed";
  ndvi: number;
}

export interface Alert {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
  date: string;
}

export interface DashboardStats {
  fieldsMonitored: number;
  flightsThisMonth: number;
  averageNdvi: number;
  openAlerts: number;
}

/*
 * Sample data for the dashboard.
 *
 * These values are placeholders used until field, flight, and alert records are
 * connected to the API. Every screen that renders them labels them as sample
 * data. Do not treat them as agronomic or operational records.
 */
export const sampleNdviTrend: NdviPoint[] = [
  { date: "2026-09-02", ndvi: 0.38, ndre: 0.24 },
  { date: "2026-09-09", ndvi: 0.43, ndre: 0.27 },
  { date: "2026-09-16", ndvi: 0.47, ndre: 0.3 },
  { date: "2026-09-23", ndvi: 0.52, ndre: 0.34 },
  { date: "2026-09-30", ndvi: 0.58, ndre: 0.38 },
  { date: "2026-10-07", ndvi: 0.63, ndre: 0.42 },
  { date: "2026-10-14", ndvi: 0.66, ndre: 0.45 },
  { date: "2026-10-21", ndvi: 0.62, ndre: 0.43 },
];

export const sampleFlights: Flight[] = [
  {
    id: "flight-1042",
    field: "North Orchard",
    date: "2026-10-24",
    status: "completed",
    ndvi: 0.71,
  },
  {
    id: "flight-1041",
    field: "Mill Creek",
    date: "2026-10-21",
    status: "completed",
    ndvi: 0.64,
  },
  {
    id: "flight-1039",
    field: "South Ridge",
    date: "2026-10-18",
    status: "processing",
    ndvi: 0.58,
  },
  {
    id: "flight-1036",
    field: "Willow Flats",
    date: "2026-10-12",
    status: "failed",
    ndvi: 0.49,
  },
];

export const sampleAlerts: Alert[] = [
  {
    id: "alert-1",
    severity: "critical",
    message: "Low NDVI in South Ridge block 4.",
    date: "2026-10-26",
  },
  {
    id: "alert-2",
    severity: "warning",
    message: "Flight processing delayed for Willow Flats.",
    date: "2026-10-25",
  },
  {
    id: "alert-3",
    severity: "info",
    message: "New imagery ready for North Orchard.",
    date: "2026-10-24",
  },
];

export const sampleStats: DashboardStats = {
  fieldsMonitored: 12,
  flightsThisMonth: 8,
  averageNdvi: 0.62,
  openAlerts: 3,
};
