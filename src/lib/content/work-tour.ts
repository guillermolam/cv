const DOB = '1985-11-07';

export type WorkTourPlaceType = 'birth' | 'education' | 'work';

export type WorkTourPlaceStay = {
  id: string;
  placeId: string;
  city: string;
  country: string;
  label: string;
  latitude: number;
  longitude: number;
  type: WorkTourPlaceType;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  durationKnown: boolean;
  note?: string;
};

export type WorkTourStop = {
  id: string;
  label: string;
  focusLabel: string;
  placeIds: string[];
  latitude: number;
  longitude: number;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  companies: string[];
  roles: string[];
  note?: string;
};

export type WorkTourPlaceSummary = {
  id: string;
  city: string;
  country: string;
  label: string;
  latitude: number;
  longitude: number;
  durationMonths: number | null;
  durationKnown: boolean;
  companies: string[];
  roles: string[];
  ageLabels: string[];
  stayLabels: string[];
  note?: string;
};

const monthIndex = (value: string) => {
  const [yearRaw, monthRaw] = value.split('-');
  const year = Number.parseInt(yearRaw ?? '', 10);
  const month = Number.parseInt(monthRaw ?? '1', 10);
  return year * 12 + (month - 1);
};

const currentMonthIndex = () => {
  const now = new Date();
  return now.getUTCFullYear() * 12 + now.getUTCMonth();
};

export const formatMonths = (months: number | null) => {
  if (months === null) return 'Duration not dated in CV';
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  if (years > 0 && remainder > 0) return `${years}y ${remainder}m`;
  if (years > 0) return `${years}y`;
  return `${remainder}m`;
};

export const getAgeAtDate = (dateValue: string) => {
  const [yearRaw, monthRaw, dayRaw] = dateValue.split('-');
  const year = Number.parseInt(yearRaw ?? '', 10);
  const month = Number.parseInt(monthRaw ?? '1', 10);
  const day = Number.parseInt(dayRaw ?? '1', 10);
  const birth = new Date(`${DOB}T00:00:00Z`);
  const at = new Date(Date.UTC(year, month - 1, day));
  let age = at.getUTCFullYear() - birth.getUTCFullYear();
  const monthDelta = at.getUTCMonth() - birth.getUTCMonth();
  const beforeBirthday =
    monthDelta < 0 ||
    (monthDelta === 0 && at.getUTCDate() < birth.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
};

const getDurationMonths = (stay: WorkTourPlaceStay) => {
  if (!stay.durationKnown) return null;
  const end = stay.isCurrent
    ? currentMonthIndex()
    : monthIndex(stay.endDate ?? stay.startDate);
  return end - monthIndex(stay.startDate) + 1;
};

export const workTourStays: WorkTourPlaceStay[] = [
  {
    id: 'madrid-uam',
    placeId: 'madrid-es',
    city: 'Madrid',
    country: 'Spain',
    label: 'Madrid, Spain',
    latitude: 40.4168,
    longitude: -3.7038,
    type: 'education',
    company: 'Universidad Autonoma de Madrid',
    role: 'Computer Science',
    startDate: '2003-09',
    endDate: '2009-01',
    durationKnown: true,
  },
  {
    id: 'madrid-everis',
    placeId: 'madrid-es',
    city: 'Madrid',
    country: 'Spain',
    label: 'Madrid, Spain',
    latitude: 40.4168,
    longitude: -3.7038,
    type: 'work',
    company: 'Everis',
    role: 'Advanced Analyst/Programmer',
    startDate: '2011-01',
    endDate: '2012-05',
    durationKnown: true,
  },
  {
    id: 'madrid-bull',
    placeId: 'madrid-es',
    city: 'Madrid',
    country: 'Spain',
    label: 'Madrid, Spain',
    latitude: 40.4168,
    longitude: -3.7038,
    type: 'work',
    company: 'Bull',
    role: 'Senior Analyst Programmer',
    startDate: '2012-05',
    endDate: '2013-07',
    durationKnown: true,
  },
  {
    id: 'boston-bogota-4sight-boston',
    placeId: 'boston-us',
    city: 'Boston',
    country: 'United States',
    label: 'Boston, United States',
    latitude: 42.3601,
    longitude: -71.0589,
    type: 'work',
    company: '4Sight Technologies',
    role: 'Senior Software Engineer',
    startDate: '2013-07',
    endDate: '2017-04',
    durationKnown: false,
    note: 'CV lists Boston and Bogota for the same 4Sight period without a dated split.',
  },
  {
    id: 'boston-mapfre',
    placeId: 'boston-us',
    city: 'Boston',
    country: 'United States',
    label: 'Boston, United States',
    latitude: 42.3601,
    longitude: -71.0589,
    type: 'work',
    company: 'MAPFRE',
    role: 'Application Architect',
    startDate: '2017-05',
    endDate: '2019-09',
    durationKnown: true,
  },
  {
    id: 'boston-vass',
    placeId: 'boston-us',
    city: 'Boston',
    country: 'United States',
    label: 'Boston, United States',
    latitude: 42.3601,
    longitude: -71.0589,
    type: 'work',
    company: 'VASS US',
    role: 'Solutions Architect',
    startDate: '2019-09',
    endDate: '2021-02',
    durationKnown: true,
  },
  {
    id: 'bogota-4sight',
    placeId: 'bogota-co',
    city: 'Bogota',
    country: 'Colombia',
    label: 'Bogota, Colombia',
    latitude: 4.711,
    longitude: -74.0721,
    type: 'work',
    company: '4Sight Technologies',
    role: 'Senior Software Engineer',
    startDate: '2013-07',
    endDate: '2017-04',
    durationKnown: false,
    note: 'CV lists Boston and Bogota for the same 4Sight period without a dated split.',
  },
  {
    id: 'madrid-savana',
    placeId: 'madrid-es',
    city: 'Madrid',
    country: 'Spain',
    label: 'Madrid, Spain',
    latitude: 40.4168,
    longitude: -3.7038,
    type: 'work',
    company: 'Savana Med',
    role: 'Architecture, Cloud Infrastructure & Security Lead',
    startDate: '2021-03',
    endDate: '2021-06',
    durationKnown: true,
  },
  {
    id: 'brussels-ec',
    placeId: 'brussels-be',
    city: 'Brussels',
    country: 'Belgium',
    label: 'Brussels, Belgium',
    latitude: 50.8503,
    longitude: 4.3517,
    type: 'work',
    company: 'European Commission',
    role: 'DevSecOps Engineer',
    startDate: '2021-06',
    endDate: '2022-10',
    durationKnown: true,
  },
  {
    id: 'madrid-bbva',
    placeId: 'madrid-es',
    city: 'Madrid',
    country: 'Spain',
    label: 'Madrid, Spain',
    latitude: 40.4168,
    longitude: -3.7038,
    type: 'work',
    company: 'BBVA',
    role: 'Senior DevSecOps Engineer',
    startDate: '2023-03',
    endDate: '2024-03',
    durationKnown: true,
  },
  {
    id: 'malaga-ciklum',
    placeId: 'malaga-es',
    city: 'Malaga',
    country: 'Spain',
    label: 'Malaga, Spain',
    latitude: 36.7213,
    longitude: -4.4214,
    type: 'work',
    company: 'Ciklum',
    role: 'Senior DevOps Engineer',
    startDate: '2024-04',
    endDate: '2024-11',
    durationKnown: true,
  },
  {
    id: 'zurich-skyguide',
    placeId: 'zurich-ch',
    city: 'Zurich',
    country: 'Switzerland',
    label: 'Zurich, Switzerland',
    latitude: 47.3769,
    longitude: 8.5417,
    type: 'work',
    company: 'Skyguide',
    role: 'Senior DevOps Engineer',
    startDate: '2025-01',
    isCurrent: true,
    durationKnown: true,
  },
];

export const workTourStops: WorkTourStop[] = [
  {
    id: 'madrid-everis',
    label: 'Everis',
    focusLabel: 'Madrid, Spain',
    placeIds: ['madrid-es'],
    latitude: 40.4168,
    longitude: -3.7038,
    startDate: '2011-01',
    endDate: '2012-05',
    companies: ['Everis'],
    roles: ['Advanced Analyst/Programmer'],
  },
  {
    id: 'madrid-bull',
    label: 'Bull',
    focusLabel: 'Madrid, Spain',
    placeIds: ['madrid-es'],
    latitude: 40.4168,
    longitude: -3.7038,
    startDate: '2012-05',
    endDate: '2013-07',
    companies: ['Bull'],
    roles: ['Senior Analyst Programmer'],
  },
  {
    id: 'boston-bogota-4sight',
    label: '4Sight Technologies',
    focusLabel: 'Boston and Bogota',
    placeIds: ['boston-us', 'bogota-co'],
    latitude: 23.5356,
    longitude: -72.5655,
    startDate: '2013-07',
    endDate: '2017-04',
    companies: ['4Sight Technologies'],
    roles: ['Senior Software Engineer'],
    note: 'The CV names both cities for this role but does not date the split between them.',
  },
  {
    id: 'boston-mapfre',
    label: 'MAPFRE',
    focusLabel: 'Boston, United States',
    placeIds: ['boston-us'],
    latitude: 42.3601,
    longitude: -71.0589,
    startDate: '2017-05',
    endDate: '2019-09',
    companies: ['MAPFRE'],
    roles: ['Application Architect'],
  },
  {
    id: 'boston-vass',
    label: 'VASS US',
    focusLabel: 'Boston, United States',
    placeIds: ['boston-us'],
    latitude: 42.3601,
    longitude: -71.0589,
    startDate: '2019-09',
    endDate: '2021-02',
    companies: ['VASS US'],
    roles: ['Solutions Architect'],
  },
  {
    id: 'madrid-savana',
    label: 'Savana Med',
    focusLabel: 'Madrid, Spain',
    placeIds: ['madrid-es'],
    latitude: 40.4168,
    longitude: -3.7038,
    startDate: '2021-03',
    endDate: '2021-06',
    companies: ['Savana Med'],
    roles: ['Architecture, Cloud Infrastructure & Security Lead'],
  },
  {
    id: 'brussels-ec',
    label: 'European Commission',
    focusLabel: 'Brussels, Belgium',
    placeIds: ['brussels-be'],
    latitude: 50.8503,
    longitude: 4.3517,
    startDate: '2021-06',
    endDate: '2022-10',
    companies: ['European Commission'],
    roles: ['DevSecOps Engineer'],
  },
  {
    id: 'madrid-bbva',
    label: 'BBVA',
    focusLabel: 'Madrid, Spain',
    placeIds: ['madrid-es'],
    latitude: 40.4168,
    longitude: -3.7038,
    startDate: '2023-03',
    endDate: '2024-03',
    companies: ['BBVA'],
    roles: ['Senior DevSecOps Engineer'],
  },
  {
    id: 'malaga-ciklum',
    label: 'Ciklum',
    focusLabel: 'Malaga, Spain',
    placeIds: ['malaga-es'],
    latitude: 36.7213,
    longitude: -4.4214,
    startDate: '2024-04',
    endDate: '2024-11',
    companies: ['Ciklum'],
    roles: ['Senior DevOps Engineer'],
  },
  {
    id: 'zurich-skyguide',
    label: 'Skyguide',
    focusLabel: 'Zurich, Switzerland',
    placeIds: ['zurich-ch'],
    latitude: 47.3769,
    longitude: 8.5417,
    startDate: '2025-01',
    isCurrent: true,
    companies: ['Skyguide'],
    roles: ['Senior DevOps Engineer'],
  },
];

export const getWorkTourPlaces = (): WorkTourPlaceSummary[] => {
  const grouped = new Map<string, WorkTourPlaceSummary>();

  for (const stay of workTourStays) {
    const durationMonths = getDurationMonths(stay);
    const age = getAgeAtDate(stay.startDate);
    const stayLabel = stay.isCurrent
      ? `${stay.startDate} - Present`
      : stay.endDate
        ? `${stay.startDate} - ${stay.endDate}`
        : stay.startDate;

    const existing = grouped.get(stay.placeId);
    if (!existing) {
      grouped.set(stay.placeId, {
        id: stay.placeId,
        city: stay.city,
        country: stay.country,
        label: stay.label,
        latitude: stay.latitude,
        longitude: stay.longitude,
        durationMonths,
        durationKnown: stay.durationKnown,
        companies: [stay.company],
        roles: [stay.role],
        ageLabels: [`${age}`],
        stayLabels: [`${stay.company} (${stayLabel})`],
        note: stay.note,
      });
      continue;
    }

    if (!existing.companies.includes(stay.company))
      existing.companies.push(stay.company);
    if (!existing.roles.includes(stay.role)) existing.roles.push(stay.role);
    if (!existing.ageLabels.includes(`${age}`))
      existing.ageLabels.push(`${age}`);
    existing.stayLabels.push(`${stay.company} (${stayLabel})`);
    if (existing.durationMonths !== null && durationMonths !== null) {
      existing.durationMonths += durationMonths;
    } else {
      existing.durationMonths = null;
      existing.durationKnown = false;
    }
    if (stay.note && !existing.note) existing.note = stay.note;
  }

  return [...grouped.values()].sort((a, b) => {
    const left = a.durationMonths ?? -1;
    const right = b.durationMonths ?? -1;
    return right - left;
  });
};
