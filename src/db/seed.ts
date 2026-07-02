import { db } from './index.ts';
import { countries, holidays, adsPositions } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  try {
    console.log("Checking if database needs seeding...");

    // Check if countries already exist
    const existingCountries = await db.select().from(countries).limit(1);
    if (existingCountries.length > 0) {
      console.log("Database already seeded with countries. Skipping seeding.");
      return;
    }

    console.log("Seeding countries...");
    const seededCountries = await db.insert(countries).values([
      { countryName: "Kenya", code: "KE", flag: "🇰🇪" },
      { countryName: "Nigeria", code: "NG", flag: "🇳🇬" },
      { countryName: "South Africa", code: "ZA", flag: "🇿🇦" },
      { countryName: "Ghana", code: "GH", flag: "🇬🇭" },
      { countryName: "Uganda", code: "UG", flag: "🇺🇬" }
    ]).returning();

    const countryMap = new Map<string, number>();
    for (const c of seededCountries) {
      countryMap.set(c.code, c.id);
    }

    console.log("Seeding holidays for 2026...");
    const holidayValues = [
      // KENYA
      {
        countryId: countryMap.get("KE")!,
        holidayName: "New Year's Day",
        date: "2026-01-01",
        month: "January",
        year: 2026,
        day: "Thursday",
        description: "Worldwide celebration of the start of the Gregorian calendar year.",
        type: "Public",
        isPublic: true
      },
      {
        countryId: countryMap.get("KE")!,
        holidayName: "Good Friday",
        date: "2026-04-03",
        month: "April",
        year: 2026,
        day: "Friday",
        description: "Christian holiday commemorating the crucifixion of Jesus Christ.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("KE")!,
        holidayName: "Easter Monday",
        date: "2026-04-06",
        month: "April",
        year: 2026,
        day: "Monday",
        description: "The day after Easter Sunday, celebrated as a public holiday in many countries.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("KE")!,
        holidayName: "Eid al-Fitr",
        date: "2026-03-20",
        month: "March",
        year: 2026,
        day: "Friday",
        description: "Islamic holiday marking the end of Ramadan, the holy month of fasting.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("KE")!,
        holidayName: "Labour Day",
        date: "2026-05-01",
        month: "May",
        year: 2026,
        day: "Friday",
        description: "Honoring the contribution of workers and labor unions in Kenya.",
        type: "Public",
        isPublic: true
      },
      {
        countryId: countryMap.get("KE")!,
        holidayName: "Madaraka Day",
        date: "2026-06-01",
        month: "June",
        year: 2026,
        day: "Monday",
        description: "Commemorates the day in 1963 when Kenya attained internal self-rule from Britain.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("KE")!,
        holidayName: "Eid al-Adha",
        date: "2026-05-27",
        month: "May",
        year: 2026,
        day: "Wednesday",
        description: "Islamic feast commemorating Ibrahim's willingness to sacrifice his son.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("KE")!,
        holidayName: "Huduma Day",
        date: "2026-10-10",
        month: "October",
        year: 2026,
        day: "Saturday",
        description: "A day set aside for national volunteer service and reflection on community service.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("KE")!,
        holidayName: "Mashujaa Day",
        date: "2026-10-20",
        month: "October",
        year: 2026,
        day: "Tuesday",
        description: "Commemorates the heroes who contributed to Kenya's struggle for independence.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("KE")!,
        holidayName: "Jamhuri Day",
        date: "2026-12-12",
        month: "December",
        year: 2026,
        day: "Saturday",
        description: "Kenya's most important holiday, celebrating independence and becoming a republic.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("KE")!,
        holidayName: "Christmas Day",
        date: "2026-12-25",
        month: "December",
        year: 2026,
        day: "Friday",
        description: "Annual festival commemorating the birth of Jesus Christ.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("KE")!,
        holidayName: "Boxing Day / Utamaduni Day",
        date: "2026-12-26",
        month: "December",
        year: 2026,
        day: "Saturday",
        description: "Celebration of cultural diversity and heritage in Kenya.",
        type: "Public",
        isPublic: true
      },

      // NIGERIA
      {
        countryId: countryMap.get("NG")!,
        holidayName: "New Year's Day",
        date: "2026-01-01",
        month: "January",
        year: 2026,
        day: "Thursday",
        description: "First day of the calendar year.",
        type: "Public",
        isPublic: true
      },
      {
        countryId: countryMap.get("NG")!,
        holidayName: "Good Friday",
        date: "2026-04-03",
        month: "April",
        year: 2026,
        day: "Friday",
        description: "Christian holy day commemorating the crucifixion.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("NG")!,
        holidayName: "Easter Monday",
        date: "2026-04-06",
        month: "April",
        year: 2026,
        day: "Monday",
        description: "Day of relaxation after Easter Sunday.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("NG")!,
        holidayName: "Eid al-Fitr",
        date: "2026-03-20",
        month: "March",
        year: 2026,
        day: "Friday",
        description: "Islamic celebration of breaking the fast.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("NG")!,
        holidayName: "Workers' Day",
        date: "2026-05-01",
        month: "May",
        year: 2026,
        day: "Friday",
        description: "Honoring working-class Nigerians.",
        type: "Public",
        isPublic: true
      },
      {
        countryId: countryMap.get("NG")!,
        holidayName: "Democracy Day",
        date: "2026-06-12",
        month: "June",
        year: 2026,
        day: "Friday",
        description: "Commemorates the return of democracy in Nigeria.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("NG")!,
        holidayName: "Eid al-Adha",
        date: "2026-05-27",
        month: "May",
        year: 2026,
        day: "Wednesday",
        description: "Islamic Feast of Sacrifice.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("NG")!,
        holidayName: "National Day",
        date: "2026-10-01",
        month: "October",
        year: 2026,
        day: "Thursday",
        description: "Commemorates Nigeria's independence from the United Kingdom in 1960.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("NG")!,
        holidayName: "Christmas Day",
        date: "2026-12-25",
        month: "December",
        year: 2026,
        day: "Friday",
        description: "Christian celebration of Jesus Christ's birth.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("NG")!,
        holidayName: "Boxing Day",
        date: "2026-12-26",
        month: "December",
        year: 2026,
        day: "Saturday",
        description: "Public holiday following Christmas.",
        type: "Public",
        isPublic: true
      },

      // SOUTH AFRICA
      {
        countryId: countryMap.get("ZA")!,
        holidayName: "New Year's Day",
        date: "2026-01-01",
        month: "January",
        year: 2026,
        day: "Thursday",
        description: "Celebration of the New Year.",
        type: "Public",
        isPublic: true
      },
      {
        countryId: countryMap.get("ZA")!,
        holidayName: "Human Rights Day",
        date: "2026-03-21",
        month: "March",
        year: 2026,
        day: "Saturday",
        description: "Commemorates the Sharpeville massacre and celebrates human rights.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("ZA")!,
        holidayName: "Good Friday",
        date: "2026-04-03",
        month: "April",
        year: 2026,
        day: "Friday",
        description: "Christian commemoration of the crucifixion.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("ZA")!,
        holidayName: "Family Day",
        date: "2026-04-06",
        month: "April",
        year: 2026,
        day: "Monday",
        description: "South African designation for Easter Monday.",
        type: "Public",
        isPublic: true
      },
      {
        countryId: countryMap.get("ZA")!,
        holidayName: "Freedom Day",
        date: "2026-04-27",
        month: "April",
        year: 2026,
        day: "Monday",
        description: "Commemorates the first democratic elections held in South Africa in 1994.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("ZA")!,
        holidayName: "Workers' Day",
        date: "2026-05-01",
        month: "May",
        year: 2026,
        day: "Friday",
        description: "Commemorates workers' rights and labor movements.",
        type: "Public",
        isPublic: true
      },
      {
        countryId: countryMap.get("ZA")!,
        holidayName: "Youth Day",
        date: "2026-06-16",
        month: "June",
        year: 2026,
        day: "Tuesday",
        description: "Honors the students who died in the 1976 Soweto Uprising.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("ZA")!,
        holidayName: "National Women's Day",
        date: "2026-08-09",
        month: "August",
        year: 2026,
        day: "Sunday",
        description: "Commemorates the 1956 march of women to protest pass laws.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("ZA")!,
        holidayName: "Heritage Day",
        date: "2026-09-24",
        month: "September",
        year: 2026,
        day: "Thursday",
        description: "Celebrates South Africa's diverse culture and heritage.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("ZA")!,
        holidayName: "Day of Reconciliation",
        date: "2026-12-16",
        month: "December",
        year: 2026,
        day: "Wednesday",
        description: "Promotes national unity and reconciliation across ethnic barriers.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("ZA")!,
        holidayName: "Christmas Day",
        date: "2026-12-25",
        month: "December",
        year: 2026,
        day: "Friday",
        description: "Christmas celebration.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("ZA")!,
        holidayName: "Day of Goodwill",
        date: "2026-12-26",
        month: "December",
        year: 2026,
        day: "Saturday",
        description: "A traditional day for giving back to the community.",
        type: "Public",
        isPublic: true
      },

      // GHANA
      {
        countryId: countryMap.get("GH")!,
        holidayName: "New Year's Day",
        date: "2026-01-01",
        month: "January",
        year: 2026,
        day: "Thursday",
        description: "Standard celebration of New Year.",
        type: "Public",
        isPublic: true
      },
      {
        countryId: countryMap.get("GH")!,
        holidayName: "Constitution Day",
        date: "2026-01-07",
        month: "January",
        year: 2026,
        day: "Wednesday",
        description: "Marks the adoption of the 1993 Fourth Republic constitution.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("GH")!,
        holidayName: "Independence Day",
        date: "2026-03-06",
        month: "March",
        year: 2026,
        day: "Friday",
        description: "Celebrates Ghana's independence from Britain in 1957.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("GH")!,
        holidayName: "Good Friday",
        date: "2026-04-03",
        month: "April",
        year: 2026,
        day: "Friday",
        description: "Christian Good Friday commemoration.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("GH")!,
        holidayName: "Easter Monday",
        date: "2026-04-06",
        month: "April",
        year: 2026,
        day: "Monday",
        description: "Day of reflection and community gathering.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("GH")!,
        holidayName: "Eid al-Fitr",
        date: "2026-03-20",
        month: "March",
        year: 2026,
        day: "Friday",
        description: "Eid fast-breaking feast.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("GH")!,
        holidayName: "May Day",
        date: "2026-05-01",
        month: "May",
        year: 2026,
        day: "Friday",
        description: "International Workers' Day in Ghana.",
        type: "Public",
        isPublic: true
      },
      {
        countryId: countryMap.get("GH")!,
        holidayName: "Eid al-Adha",
        date: "2026-05-27",
        month: "May",
        year: 2026,
        day: "Wednesday",
        description: "Islamic feast of sacrifice.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("GH")!,
        holidayName: "Founders' Day",
        date: "2026-08-04",
        month: "August",
        year: 2026,
        day: "Tuesday",
        description: "Honors the contributions of Ghana's pioneering founders.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("GH")!,
        holidayName: "Kwame Nkrumah Memorial Day",
        date: "2026-09-21",
        month: "September",
        year: 2026,
        day: "Monday",
        description: "Commemorates the birthday of Ghana's first president and leader.",
        type: "National",
        isPublic: true
      },
      {
        countryId: countryMap.get("GH")!,
        holidayName: "Farmer's Day",
        date: "2026-12-04",
        month: "December",
        year: 2026,
        day: "Friday",
        description: "Celebrates the contribution of farmers and fishermen to the country's economy.",
        type: "Public",
        isPublic: true
      },
      {
        countryId: countryMap.get("GH")!,
        holidayName: "Christmas Day",
        date: "2026-12-25",
        month: "December",
        year: 2026,
        day: "Friday",
        description: "Christmas commemoration.",
        type: "Religious",
        isPublic: true
      },
      {
        countryId: countryMap.get("GH")!,
        holidayName: "Boxing Day",
        date: "2026-12-26",
        month: "December",
        year: 2026,
        day: "Saturday",
        description: "Traditional day of sharing gifts.",
        type: "Public",
        isPublic: true
      }
    ];

    await db.insert(holidays).values(holidayValues);
    console.log(`Seeded ${holidayValues.length} holidays!`);

    console.log("Seeding Google Ads positions...");
    await db.insert(adsPositions).values([
      {
        positionKey: 'top_banner',
        displayName: 'Top Banner Ad',
        isActive: true,
        adClient: 'ca-pub-1234567890123456',
        adSlot: '1000000001',
        adFormat: 'auto'
      },
      {
        positionKey: 'results_between',
        displayName: 'Between Results Ad',
        isActive: true,
        adClient: 'ca-pub-1234567890123456',
        adSlot: '1000000002',
        adFormat: 'auto'
      },
      {
        positionKey: 'sidebar',
        displayName: 'Sidebar Ad',
        isActive: true,
        adClient: 'ca-pub-1234567890123456',
        adSlot: '1000000003',
        adFormat: 'auto'
      },
      {
        positionKey: 'footer',
        displayName: 'Footer Ad',
        isActive: true,
        adClient: 'ca-pub-1234567890123456',
        adSlot: '1000000004',
        adFormat: 'auto'
      }
    ]).onConflictDoNothing();

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}
