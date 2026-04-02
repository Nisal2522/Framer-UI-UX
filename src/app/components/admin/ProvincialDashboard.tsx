import { NationalDashboard } from "./NationalDashboard";

/** PDAFF officer view: same national widgets, scoped to an assigned province (sample: Battambang). */
export function ProvincialDashboard() {
  return <NationalDashboard scope="provincial" provinceLabel="Battambang" />;
}
