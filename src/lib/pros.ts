export type Trade =
  | "Electrician"
  | "Plumber"
  | "HVAC"
  | "Mobile Groomer"
  | "Carpenter"
  | "Roofer"
  | "Mason"
  | "Landscaper"
  | "Painter"
  | "Appliance Repair";

export interface VerifiedPro {
  license: string;
  business: string;
  pro: string;
  trade: Trade;
  city: string;
  bonded: boolean;
  insured: boolean;
  rating: number;
  jobs: number;
  verifiedAgo: string;
}

export const verifiedPros: VerifiedPro[] = [
  {
    license: "EL-48213",
    business: "Riverbend Electric",
    pro: "D. Whitaker",
    trade: "Electrician",
    city: "Columbus, OH",
    bonded: true,
    insured: true,
    rating: 4.9,
    jobs: 312,
    verifiedAgo: "2 min ago",
  },
  {
    license: "PL-99102",
    business: "Apex Plumbing Co.",
    pro: "M. Okafor",
    trade: "Plumber",
    city: "Dayton, OH",
    bonded: true,
    insured: true,
    rating: 4.8,
    jobs: 289,
    verifiedAgo: "6 min ago",
  },
  {
    license: "HV-20571",
    business: "Cornerstone Heating & Air",
    pro: "R. Lindqvist",
    trade: "HVAC",
    city: "Cincinnati, OH",
    bonded: true,
    insured: true,
    rating: 4.9,
    jobs: 402,
    verifiedAgo: "11 min ago",
  },
  {
    license: "GM-33418",
    business: "Barker & Sons Grooming",
    pro: "T. Barker",
    trade: "Mobile Groomer",
    city: "Grandview, OH",
    bonded: false,
    insured: true,
    rating: 5.0,
    jobs: 96,
    verifiedAgo: "17 min ago",
  },
  {
    license: "CP-77204",
    business: "Ironwood Carpentry",
    pro: "J. Ferro",
    trade: "Carpenter",
    city: "Worthington, OH",
    bonded: true,
    insured: true,
    rating: 4.7,
    jobs: 174,
    verifiedAgo: "23 min ago",
  },
  {
    license: "RF-51037",
    business: "Ridgeline Roofing",
    pro: "S. Cormack",
    trade: "Roofer",
    city: "New Albany, OH",
    bonded: true,
    insured: true,
    rating: 4.8,
    jobs: 141,
    verifiedAgo: "29 min ago",
  },
  {
    license: "MS-20884",
    business: "Hawke Masonry Works",
    pro: "L. Hawke",
    trade: "Mason",
    city: "Pickerington, OH",
    bonded: true,
    insured: true,
    rating: 4.9,
    jobs: 88,
    verifiedAgo: "34 min ago",
  },
  {
    license: "LS-64011",
    business: "Meridian Lawn & Ground",
    pro: "P. Deveraux",
    trade: "Landscaper",
    city: "Dublin, OH",
    bonded: false,
    insured: true,
    rating: 4.6,
    jobs: 210,
    verifiedAgo: "41 min ago",
  },
  {
    license: "PN-90366",
    business: "Franklin & Finch Painting",
    pro: "A. Romano",
    trade: "Painter",
    city: "Grove City, OH",
    bonded: true,
    insured: true,
    rating: 4.7,
    jobs: 163,
    verifiedAgo: "48 min ago",
  },
  {
    license: "AR-12275",
    business: "Honest Appliance Repair",
    pro: "K. Osei",
    trade: "Appliance Repair",
    city: "Bexley, OH",
    bonded: true,
    insured: true,
    rating: 4.8,
    jobs: 247,
    verifiedAgo: "55 min ago",
  },
  {
    license: "EL-62901",
    business: "Midnight City Electrical",
    pro: "V. Nguyen",
    trade: "Electrician",
    city: "Hilltop, OH",
    bonded: true,
    insured: true,
    rating: 4.9,
    jobs: 198,
    verifiedAgo: "1 hr ago",
  },
  {
    license: "PL-40717",
    business: "Straightpipe Plumbing",
    pro: "E. Kowalczyk",
    trade: "Plumber",
    city: "Whitehall, OH",
    bonded: true,
    insured: true,
    rating: 4.8,
    jobs: 155,
    verifiedAgo: "1 hr ago",
  },
  {
    license: "HV-81845",
    business: "Three Brothers Climate",
    pro: "D. Marchetti",
    trade: "HVAC",
    city: "Reynoldsburg, OH",
    bonded: true,
    insured: true,
    rating: 4.9,
    jobs: 329,
    verifiedAgo: "1 hr ago",
  },
  {
    license: "GM-45502",
    business: "Wagly Mobile Grooming",
    pro: "R. Shelton",
    trade: "Mobile Groomer",
    city: "Upper Arlington, OH",
    bonded: false,
    insured: true,
    rating: 5.0,
    jobs: 121,
    verifiedAgo: "2 hrs ago",
  },
  {
    license: "RF-73119",
    business: "Beacon Roof & Weather",
    pro: "H. Prasert",
    trade: "Roofer",
    city: "Westerville, OH",
    bonded: true,
    insured: true,
    rating: 4.7,
    jobs: 132,
    verifiedAgo: "2 hrs ago",
  },
  {
    license: "PN-26048",
    business: "North End Paint Co.",
    pro: "G. Vasquez",
    trade: "Painter",
    city: "Gahanna, OH",
    bonded: true,
    insured: true,
    rating: 4.6,
    jobs: 118,
    verifiedAgo: "2 hrs ago",
  },
];

export const registryStats = [
  { value: 12418, decimals: 0, suffix: "", label: "Verified pros on the books" },
  { value: 3214, decimals: 0, suffix: "", label: "Towns & neighborhoods covered" },
  { value: 99.2, decimals: 1, suffix: "%", label: "Entries with zero complaints" },
  { value: 41300, decimals: 0, suffix: "+", label: "Jobs booked this year" },
];
