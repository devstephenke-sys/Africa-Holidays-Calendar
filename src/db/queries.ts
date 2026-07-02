import { db } from './index.ts';
import { countries, holidays, adsPositions } from './schema.ts';
import { eq, and, ilike, SQL } from 'drizzle-orm';

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
    return await db.select().from(countries).orderBy(countries.countryName);
  } catch (error) {
    throw sanitizeError("Failed to fetch countries from database", error);
  }
}

export async function getCountryById(id: number) {
  try {
    const result = await db.select().from(countries).where(eq(countries.id, id));
    return result[0] || null;
  } catch (error) {
    throw sanitizeError(`Failed to fetch country with ID ${id}`, error);
  }
}

export async function getCountryByName(name: string) {
  try {
    const result = await db.select().from(countries).where(eq(countries.countryName, name));
    return result[0] || null;
  } catch (error) {
    throw sanitizeError(`Failed to fetch country with name ${name}`, error);
  }
}

export async function createCountry(data: { countryName: string; code: string; flag?: string }) {
  try {
    const result = await db.insert(countries)
      .values({
        countryName: data.countryName,
        code: data.code.toUpperCase(),
        flag: data.flag || "🌍",
      })
      .returning();
    return result[0];
  } catch (error) {
    throw sanitizeError("Failed to create country", error);
  }
}

export async function updateCountry(id: number, data: { countryName?: string; code?: string; flag?: string }) {
  try {
    const updateObj: Partial<typeof countries.$inferInsert> = {};
    if (data.countryName !== undefined) updateObj.countryName = data.countryName;
    if (data.code !== undefined) updateObj.code = data.code.toUpperCase();
    if (data.flag !== undefined) updateObj.flag = data.flag;

    const result = await db.update(countries)
      .set(updateObj)
      .where(eq(countries.id, id))
      .returning();
    return result[0];
  } catch (error) {
    throw sanitizeError(`Failed to update country with ID ${id}`, error);
  }
}

export async function deleteCountry(id: number) {
  try {
    const result = await db.delete(countries).where(eq(countries.id, id)).returning();
    return result[0];
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
    const conditions: SQL[] = [];

    if (filters.countryId) {
      conditions.push(eq(holidays.countryId, filters.countryId));
    }
    if (filters.month) {
      conditions.push(eq(holidays.month, filters.month));
    }
    if (filters.year) {
      conditions.push(eq(holidays.year, filters.year));
    }
    if (filters.type) {
      conditions.push(eq(holidays.type, filters.type));
    }
    if (filters.search) {
      conditions.push(ilike(holidays.holidayName, `%${filters.search}%`));
    }

    // Build query
    let query = db.select({
      id: holidays.id,
      holidayName: holidays.holidayName,
      date: holidays.date,
      month: holidays.month,
      year: holidays.year,
      day: holidays.day,
      description: holidays.description,
      type: holidays.type,
      isPublic: holidays.isPublic,
      countryId: holidays.countryId,
      countryName: countries.countryName,
      countryCode: countries.code,
      countryFlag: countries.flag,
    })
    .from(holidays)
    .leftJoin(countries, eq(holidays.countryId, countries.id));

    // Apply where clause if there are conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Sort by date/month order. For simplicity, sort by date string (e.g. YYYY-MM-DD)
    const results = await query.orderBy(holidays.date);

    // If countryName filter was requested client-side (for SEO friendly slugs)
    if (filters.countryName) {
      return results.filter(h => h.countryName?.toLowerCase() === filters.countryName?.toLowerCase());
    }

    return results;
  } catch (error) {
    throw sanitizeError("Failed to fetch holidays with filters", error);
  }
}

export async function getHolidayById(id: number) {
  try {
    const result = await db.select({
      id: holidays.id,
      holidayName: holidays.holidayName,
      date: holidays.date,
      month: holidays.month,
      year: holidays.year,
      day: holidays.day,
      description: holidays.description,
      type: holidays.type,
      isPublic: holidays.isPublic,
      countryId: holidays.countryId,
      countryName: countries.countryName,
      countryCode: countries.code,
      countryFlag: countries.flag,
    })
    .from(holidays)
    .leftJoin(countries, eq(holidays.countryId, countries.id))
    .where(eq(holidays.id, id));

    return result[0] || null;
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
    const result = await db.insert(holidays)
      .values({
        countryId: data.countryId,
        holidayName: data.holidayName,
        date: data.date,
        month: data.month,
        year: data.year,
        day: data.day,
        description: data.description,
        type: data.type,
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
      })
      .returning();
    return result[0];
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
    const updateObj: Partial<typeof holidays.$inferInsert> = {};
    if (data.countryId !== undefined) updateObj.countryId = data.countryId;
    if (data.holidayName !== undefined) updateObj.holidayName = data.holidayName;
    if (data.date !== undefined) updateObj.date = data.date;
    if (data.month !== undefined) updateObj.month = data.month;
    if (data.year !== undefined) updateObj.year = data.year;
    if (data.day !== undefined) updateObj.day = data.day;
    if (data.description !== undefined) updateObj.description = data.description;
    if (data.type !== undefined) updateObj.type = data.type;
    if (data.isPublic !== undefined) updateObj.isPublic = data.isPublic;

    const result = await db.update(holidays)
      .set(updateObj)
      .where(eq(holidays.id, id))
      .returning();
    return result[0];
  } catch (error) {
    throw sanitizeError(`Failed to update holiday with ID ${id}`, error);
  }
}

export async function deleteHoliday(id: number) {
  try {
    const result = await db.delete(holidays).where(eq(holidays.id, id)).returning();
    return result[0];
  } catch (error) {
    throw sanitizeError(`Failed to delete holiday with ID ${id}`, error);
  }
}

// ---------------------------------------------------------
// Ads Positions Queries & Config
// ---------------------------------------------------------

export async function getAdsPositions() {
  try {
    return await db.select().from(adsPositions).orderBy(adsPositions.id);
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
    const updateObj: Partial<typeof adsPositions.$inferInsert> = {};
    if (data.isActive !== undefined) updateObj.isActive = data.isActive;
    if (data.adClient !== undefined) updateObj.adClient = data.adClient;
    if (data.adSlot !== undefined) updateObj.adSlot = data.adSlot;
    if (data.adFormat !== undefined) updateObj.adFormat = data.adFormat;

    const result = await db.update(adsPositions)
      .set(updateObj)
      .where(eq(adsPositions.id, id))
      .returning();
    return result[0];
  } catch (error) {
    throw sanitizeError(`Failed to update Ad position with ID ${id}`, error);
  }
}
