import { prisma } from './prisma.ts';

// Helper for query-layer error sanitization
function sanitizeError(msg: string, error: unknown): Error {
  console.error(`${msg}:`, error);
  return new Error(msg, { cause: error });
}

// ---------------------------------------------------------
// Countries Queries & CRUD
// ---------------------------------------------------------

export async function getCountries() {
  try {
    return await prisma.country.findMany({
      orderBy: {
        countryName: 'asc',
      },
    });
  } catch (error) {
    throw sanitizeError("Failed to fetch countries from database", error);
  }
}

export async function getCountryById(id: number) {
  try {
    return await prisma.country.findUnique({
      where: { id },
    });
  } catch (error) {
    throw sanitizeError(`Failed to fetch country with ID ${id}`, error);
  }
}

export async function getCountryByName(name: string) {
  try {
    return await prisma.country.findUnique({
      where: { countryName: name },
    });
  } catch (error) {
    throw sanitizeError(`Failed to fetch country with name ${name}`, error);
  }
}

export async function createCountry(data: { countryName: string; code: string; flag?: string }) {
  try {
    return await prisma.country.create({
      data: {
        countryName: data.countryName,
        code: data.code.toUpperCase(),
        flag: data.flag || "🌍",
      },
    });
  } catch (error) {
    throw sanitizeError("Failed to create country", error);
  }
}

export async function updateCountry(id: number, data: { countryName?: string; code?: string; flag?: string }) {
  try {
    const updateObj: any = {};
    if (data.countryName !== undefined) updateObj.countryName = data.countryName;
    if (data.code !== undefined) updateObj.code = data.code.toUpperCase();
    if (data.flag !== undefined) updateObj.flag = data.flag;

    return await prisma.country.update({
      where: { id },
      data: updateObj,
    });
  } catch (error) {
    throw sanitizeError(`Failed to update country with ID ${id}`, error);
  }
}

export async function deleteCountry(id: number) {
  try {
    return await prisma.country.delete({
      where: { id },
    });
  } catch (error) {
    throw sanitizeError(`Failed to delete country with ID ${id}`, error);
  }
}

// ---------------------------------------------------------
// Holidays Queries & CRUD
// ---------------------------------------------------------

export interface HolidayFilters {
  countryId?: number;
  countryName?: string;
  month?: string;
  year?: number;
  type?: string;
  search?: string;
}

export async function getHolidays(filters: HolidayFilters = {}) {
  try {
    const conditions: any = {};

    if (filters.countryId) {
      conditions.countryId = filters.countryId;
    }
    if (filters.month) {
      conditions.month = filters.month;
    }
    if (filters.year) {
      conditions.year = filters.year;
    }
    if (filters.type) {
      conditions.type = filters.type;
    }
    if (filters.search) {
      conditions.holidayName = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    const results = await prisma.holiday.findMany({
      where: conditions,
      include: {
        country: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const mapped = results.map(h => ({
      id: h.id,
      holidayName: h.holidayName,
      date: h.date,
      month: h.month,
      year: h.year,
      day: h.day,
      description: h.description,
      type: h.type,
      isPublic: h.isPublic,
      countryId: h.countryId,
      countryName: h.country?.countryName || null,
      countryCode: h.country?.code || null,
      countryFlag: h.country?.flag || null,
    }));

    if (filters.countryName) {
      return mapped.filter(h => h.countryName?.toLowerCase() === filters.countryName?.toLowerCase());
    }

    return mapped;
  } catch (error) {
    throw sanitizeError("Failed to fetch holidays with filters", error);
  }
}

export async function getHolidayById(id: number) {
  try {
    const h = await prisma.holiday.findUnique({
      where: { id },
      include: {
        country: true,
      },
    });

    if (!h) return null;

    return {
      id: h.id,
      holidayName: h.holidayName,
      date: h.date,
      month: h.month,
      year: h.year,
      day: h.day,
      description: h.description,
      type: h.type,
      isPublic: h.isPublic,
      countryId: h.countryId,
      countryName: h.country?.countryName || null,
      countryCode: h.country?.code || null,
      countryFlag: h.country?.flag || null,
    };
  } catch (error) {
    throw sanitizeError(`Failed to fetch holiday with ID ${id}`, error);
  }
}

export async function createHoliday(data: {
  countryId: number;
  holidayName: string;
  date: string;
  month: string;
  year: number;
  day: string;
  description: string;
  type: string;
  isPublic?: boolean;
}) {
  try {
    return await prisma.holiday.create({
      data: {
        countryId: data.countryId,
        holidayName: data.holidayName,
        date: data.date,
        month: data.month,
        year: data.year,
        day: data.day,
        description: data.description,
        type: data.type,
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
      },
    });
  } catch (error) {
    throw sanitizeError("Failed to create holiday", error);
  }
}

export async function updateHoliday(id: number, data: {
  countryId?: number;
  holidayName?: string;
  date?: string;
  month?: string;
  year?: number;
  day?: string;
  description?: string;
  type?: string;
  isPublic?: boolean;
}) {
  try {
    const updateObj: any = {};
    if (data.countryId !== undefined) updateObj.countryId = data.countryId;
    if (data.holidayName !== undefined) updateObj.holidayName = data.holidayName;
    if (data.date !== undefined) updateObj.date = data.date;
    if (data.month !== undefined) updateObj.month = data.month;
    if (data.year !== undefined) updateObj.year = data.year;
    if (data.day !== undefined) updateObj.day = data.day;
    if (data.description !== undefined) updateObj.description = data.description;
    if (data.type !== undefined) updateObj.type = data.type;
    if (data.isPublic !== undefined) updateObj.isPublic = data.isPublic;

    return await prisma.holiday.update({
      where: { id },
      data: updateObj,
    });
  } catch (error) {
    throw sanitizeError(`Failed to update holiday with ID ${id}`, error);
  }
}

export async function deleteHoliday(id: number) {
  try {
    return await prisma.holiday.delete({
      where: { id },
    });
  } catch (error) {
    throw sanitizeError(`Failed to delete holiday with ID ${id}`, error);
  }
}

// ---------------------------------------------------------
// Ads Positions Queries & Config
// ---------------------------------------------------------

export async function getAdsPositions() {
  try {
    return await prisma.adsPosition.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  } catch (error) {
    throw sanitizeError("Failed to fetch Google Ads positions", error);
  }
}

export async function updateAdPosition(id: number, data: {
  isActive?: boolean;
  adClient?: string;
  adSlot?: string;
  adFormat?: string;
}) {
  try {
    const updateObj: any = {};
    if (data.isActive !== undefined) updateObj.isActive = data.isActive;
    if (data.adClient !== undefined) updateObj.adClient = data.adClient;
    if (data.adSlot !== undefined) updateObj.adSlot = data.adSlot;
    if (data.adFormat !== undefined) updateObj.adFormat = data.adFormat;

    return await prisma.adsPosition.update({
      where: { id },
      data: updateObj,
    });
  } catch (error) {
    throw sanitizeError(`Failed to update Ad position with ID ${id}`, error);
  }
}
