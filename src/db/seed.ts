import { prisma } from './prisma.ts';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getDayOfWeek = (year: number, monthNum: number, dayNum: number): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dateObj = new Date(year, monthNum - 1, dayNum);
  return days[dateObj.getDay()];
};

export async function seedDatabase() {
  try {
    console.log("Checking if database needs seeding...");

    // Check if we already have the full set of African countries
    const countryCount = await prisma.country.count();
    if (countryCount >= 50) {
      console.log(`Database already has ${countryCount} countries. Skipping seeding.`);
      return;
    }

    console.log("Clearing old country data for a complete fresh seed...");
    await prisma.country.deleteMany({});

    console.log("Seeding all 54 African countries...");
    const countriesToSeed = [
      { countryName: "Algeria", code: "DZ", flag: "🇩🇿", nationalHoliday: { name: "Revolution Day", date: "11-01", description: "Commemorates the start of the Algerian War of Independence." } },
      { countryName: "Angola", code: "AO", flag: "🇦🇴", nationalHoliday: { name: "Independence Day", date: "11-11", description: "Commemorates independence from Portugal in 1975." } },
      { countryName: "Benin", code: "BJ", flag: "🇧🇯", nationalHoliday: { name: "Independence Day", date: "08-01", description: "Commemorates independence from France in 1960." } },
      { countryName: "Botswana", code: "BW", flag: "🇧🇼", nationalHoliday: { name: "Botswana Day", date: "09-30", description: "Commemorates independence from the United Kingdom in 1966." } },
      { countryName: "Burkina Faso", code: "BF", flag: "🇧🇫", nationalHoliday: { name: "Republic Day", date: "12-11", description: "Commemorates the creation of the republic in 1958." } },
      { countryName: "Burundi", code: "BI", flag: "🇧🇮", nationalHoliday: { name: "Independence Day", date: "07-01", description: "Commemorates independence from Belgium in 1962." } },
      { countryName: "Cabo Verde", code: "CV", flag: "🇨🇻", nationalHoliday: { name: "Independence Day", date: "07-05", description: "Commemorates independence from Portugal in 1975." } },
      { countryName: "Cameroon", code: "CM", flag: "🇨🇲", nationalHoliday: { name: "National Day", date: "05-20", description: "Commemorates the creation of a unitary state in 1972." } },
      { countryName: "Central African Republic", code: "CF", flag: "🇨🇫", nationalHoliday: { name: "Republic Day", date: "12-01", description: "Commemorates the proclamation of the republic in 1958." } },
      { countryName: "Chad", code: "TD", flag: "🇹🇩", nationalHoliday: { name: "Independence Day", date: "08-11", description: "Commemorates independence from France in 1960." } },
      { countryName: "Comoros", code: "KM", flag: "🇰🇲", nationalHoliday: { name: "Independence Day", date: "07-06", description: "Commemorates independence from France in 1975." } },
      { countryName: "Democratic Republic of the Congo", code: "CD", flag: "🇨🇩", nationalHoliday: { name: "Independence Day", date: "06-30", description: "Commemorates independence from Belgium in 1960." } },
      { countryName: "Republic of the Congo", code: "CG", flag: "🇨🇬", nationalHoliday: { name: "National Day", date: "08-15", description: "Commemorates independence from France in 1960." } },
      { countryName: "Cote d'Ivoire", code: "CI", flag: "🇨🇮", nationalHoliday: { name: "Independence Day", date: "08-07", description: "Commemorates independence from France in 1960." } },
      { countryName: "Djibouti", code: "DJ", flag: "🇩🇯", nationalHoliday: { name: "Independence Day", date: "06-27", description: "Commemorates independence from France in 1977." } },
      { countryName: "Egypt", code: "EG", flag: "🇪🇬", nationalHoliday: { name: "Revolution Day", date: "07-23", description: "Commemorates the Egyptian Revolution of 1952." } },
      { countryName: "Equatorial Guinea", code: "GQ", flag: "🇬🇶", nationalHoliday: { name: "Independence Day", date: "10-12", description: "Commemorates independence from Spain in 1968." } },
      { countryName: "Eritrea", code: "ER", flag: "🇪🇷", nationalHoliday: { name: "Independence Day", date: "05-24", description: "Commemorates independence from Ethiopia in 1993." } },
      { countryName: "Eswatini", code: "SZ", flag: "🇸🇿", nationalHoliday: { name: "Somhlolo Day", date: "09-06", description: "Commemorates independence from the United Kingdom in 1968." } },
      { countryName: "Ethiopia", code: "ET", flag: "🇪🇹", nationalHoliday: { name: "Patriots' Victory Day", date: "05-05", description: "Commemorates the liberation from Italian occupation in 1941." } },
      { countryName: "Gabon", code: "GA", flag: "🇬🇦", nationalHoliday: { name: "Independence Day", date: "08-17", description: "Commemorates independence from France in 1960." } },
      { countryName: "Gambia", code: "GM", flag: "🇬🇲", nationalHoliday: { name: "Independence Day", date: "02-18", description: "Commemorates independence from the United Kingdom in 1965." } },
      { countryName: "Ghana", code: "GH", flag: "🇬🇭", nationalHoliday: { name: "Independence Day", date: "03-06", description: "Commemorates independence from the United Kingdom in 1957." } },
      { countryName: "Guinea", code: "GN", flag: "🇬🇳", nationalHoliday: { name: "Independence Day", date: "10-02", description: "Commemorates independence from France in 1958." } },
      { countryName: "Guinea-Bissau", code: "GW", flag: "🇬🇼", nationalHoliday: { name: "Independence Day", date: "09-24", description: "Commemorates the unilateral declaration of independence from Portugal in 1973." } },
      { countryName: "Kenya", code: "KE", flag: "🇰🇪", nationalHoliday: { name: "Jamhuri Day", date: "12-12", description: "Commemorates becoming an independent republic in 1964." } },
      { countryName: "Lesotho", code: "LS", flag: "🇱🇸", nationalHoliday: { name: "Independence Day", date: "10-04", description: "Commemorates independence from the United Kingdom in 1966." } },
      { countryName: "Liberia", code: "LR", flag: "🇱🇷", nationalHoliday: { name: "Independence Day", date: "07-26", description: "Commemorates the declaration of independence in 1847." } },
      { countryName: "Libya", code: "LY", flag: "🇱🇾", nationalHoliday: { name: "Liberation Day", date: "10-23", description: "Commemorates liberation from the Gaddafi regime in 2011." } },
      { countryName: "Madagascar", code: "MG", flag: "🇲🇬", nationalHoliday: { name: "Independence Day", date: "06-26", description: "Commemorates independence from France in 1960." } },
      { countryName: "Malawi", code: "MW", flag: "🇲🇼", nationalHoliday: { name: "Independence Day", date: "07-06", description: "Commemorates independence from the United Kingdom in 1964." } },
      { countryName: "Mali", code: "ML", flag: "🇲🇱", nationalHoliday: { name: "Independence Day", date: "09-22", description: "Commemorates independence from France in 1960." } },
      { countryName: "Mauritania", code: "MR", flag: "🇲🇷", nationalHoliday: { name: "Independence Day", date: "11-28", description: "Commemorates independence from France in 1960." } },
      { countryName: "Mauritius", code: "MU", flag: "🇲🇺", nationalHoliday: { name: "Independence Day", date: "03-12", description: "Commemorates independence from the United Kingdom in 1968." } },
      { countryName: "Morocco", code: "MA", flag: "🇲🇦", nationalHoliday: { name: "Throne Day", date: "07-30", description: "Commemorates the accession of King Mohammed VI." } },
      { countryName: "Mozambique", code: "MZ", flag: "🇲🇿", nationalHoliday: { name: "Independence Day", date: "06-25", description: "Commemorates independence from Portugal in 1975." } },
      { countryName: "Namibia", code: "NA", flag: "🇳🇦", nationalHoliday: { name: "Independence Day", date: "03-21", description: "Commemorates independence from South Africa in 1990." } },
      { countryName: "Niger", code: "NE", flag: "🇳🇪", nationalHoliday: { name: "Republic Day", date: "12-18", description: "Commemorates the founding of the Republic of Niger in 1958." } },
      { countryName: "Nigeria", code: "NG", flag: "🇳🇬", nationalHoliday: { name: "Independence Day", date: "10-01", description: "Commemorates independence from the United Kingdom in 1960." } },
      { countryName: "Rwanda", code: "RW", flag: "🇷🇼", nationalHoliday: { name: "Liberation Day", date: "07-04", description: "Commemorates the end of the 1994 genocide." } },
      { countryName: "Sao Tome and Principe", code: "ST", flag: "🇸🇹", nationalHoliday: { name: "Independence Day", date: "07-12", description: "Commemorates independence from Portugal in 1975." } },
      { countryName: "Senegal", code: "SN", flag: "🇸🇳", nationalHoliday: { name: "Independence Day", date: "04-04", description: "Commemorates independence from France in 1960." } },
      { countryName: "Seychelles", code: "SC", flag: "🇸🇨", nationalHoliday: { name: "National Day", date: "06-18", description: "Commemorates the adoption of the multi-party democracy constitution in 1993." } },
      { countryName: "Sierra Leone", code: "SL", flag: "🇸🇱", nationalHoliday: { name: "Independence Day", date: "04-27", description: "Commemorates independence from the United Kingdom in 1961." } },
      { countryName: "Somalia", code: "SO", flag: "🇸🇴", nationalHoliday: { name: "Independence Day", date: "07-01", description: "Commemorates the unification of British and Italian Somaliland in 1960." } },
      { countryName: "South Africa", code: "ZA", flag: "🇿🇦", nationalHoliday: { name: "Freedom Day", date: "04-27", description: "Commemorates the first post-apartheid elections held in 1994." } },
      { countryName: "South Sudan", code: "SS", flag: "🇸🇸", nationalHoliday: { name: "Independence Day", date: "07-09", description: "Commemorates independence from Sudan in 2011." } },
      { countryName: "Sudan", code: "SD", flag: "🇸🇩", nationalHoliday: { name: "Independence Day", date: "01-01", description: "Commemorates independence from Egypt and the United Kingdom in 1956." } },
      { countryName: "Tanzania", code: "TZ", flag: "🇹🇿", nationalHoliday: { name: "Union Day", date: "04-26", description: "Commemorates the union of Tanganyika and Zanzibar in 1964." } },
      { countryName: "Togo", code: "TG", flag: "🇹🇬", nationalHoliday: { name: "Independence Day", date: "04-27", description: "Commemorates independence from France in 1960." } },
      { countryName: "Tunisia", code: "TN", flag: "🇹🇳", nationalHoliday: { name: "Independence Day", date: "03-20", description: "Commemorates independence from France in 1956." } },
      { countryName: "Uganda", code: "UG", flag: "🇺🇬", nationalHoliday: { name: "Independence Day", date: "10-09", description: "Commemorates independence from the United Kingdom in 1962." } },
      { countryName: "Zambia", code: "ZM", flag: "🇿🇲", nationalHoliday: { name: "Independence Day", date: "10-24", description: "Commemorates independence from the United Kingdom in 1964." } },
      { countryName: "Zimbabwe", code: "ZW", flag: "🇿🇼", nationalHoliday: { name: "Independence Day", date: "04-18", description: "Commemorates independence from the United Kingdom in 1980." } }
    ];

    const seededCountries = [];
    for (const c of countriesToSeed) {
      const created = await prisma.country.create({
        data: {
          countryName: c.countryName,
          code: c.code,
          flag: c.flag,
        }
      });
      seededCountries.push({ ...created, nationalHoliday: c.nationalHoliday });
    }

    console.log(`Seeded ${seededCountries.length} countries! Seeding 2026 holidays...`);

    const holidayValues: any[] = [];

    for (const country of seededCountries) {
      // 1. New Year's Day (Jan 1)
      holidayValues.push({
        countryId: country.id,
        holidayName: "New Year's Day",
        date: "2026-01-01",
        month: "January",
        year: 2026,
        day: getDayOfWeek(2026, 1, 1),
        description: `New Year celebration in ${country.countryName}. Celebrated as a global standard public holiday to welcome the start of the Gregorian calendar year.`,
        type: "Public",
        isPublic: true
      });

      // 2. Good Friday (April 3, 2026)
      holidayValues.push({
        countryId: country.id,
        holidayName: "Good Friday",
        date: "2026-04-03",
        month: "April",
        year: 2026,
        day: getDayOfWeek(2026, 4, 3),
        description: `Christian holiday observed in ${country.countryName} commemorating the crucifixion of Jesus Christ.`,
        type: "Religious",
        isPublic: true
      });

      // 3. Easter Monday (April 6, 2026)
      holidayValues.push({
        countryId: country.id,
        holidayName: "Easter Monday",
        date: "2026-04-06",
        month: "April",
        year: 2026,
        day: getDayOfWeek(2026, 4, 6),
        description: `Easter celebration day of relaxation and worship in ${country.countryName}.`,
        type: "Religious",
        isPublic: true
      });

      // 4. Eid al-Fitr (March 20, 2026)
      holidayValues.push({
        countryId: country.id,
        holidayName: "Eid al-Fitr",
        date: "2026-03-20",
        month: "March",
        year: 2026,
        day: getDayOfWeek(2026, 3, 20),
        description: `Islamic festival marking the end of the fasting month of Ramadan, celebrated by Muslim communities in ${country.countryName}.`,
        type: "Religious",
        isPublic: true
      });

      // 5. Labour Day (May 1, 2026)
      holidayValues.push({
        countryId: country.id,
        holidayName: "International Workers' Day / Labour Day",
        date: "2026-05-01",
        month: "May",
        year: 2026,
        day: getDayOfWeek(2026, 5, 1),
        description: `Honoring workers, labor movements, and human rights contributions in ${country.countryName}.`,
        type: "Public",
        isPublic: true
      });

      // 6. Africa Day (May 25, 2026)
      holidayValues.push({
        countryId: country.id,
        holidayName: "Africa Day",
        date: "2026-05-25",
        month: "May",
        year: 2026,
        day: getDayOfWeek(2026, 5, 25),
        description: `Commemorates the founding of the Organisation of African Unity (OAU) in 1963, celebrating continental unity and progress.`,
        type: "National",
        isPublic: true
      });

      // 7. Eid al-Adha (May 27, 2026)
      holidayValues.push({
        countryId: country.id,
        holidayName: "Eid al-Adha",
        date: "2026-05-27",
        month: "May",
        year: 2026,
        day: getDayOfWeek(2026, 5, 27),
        description: `The Feast of Sacrifice, celebrated by Muslims in ${country.countryName} remembering Ibrahim's willingness to sacrifice his son.`,
        type: "Religious",
        isPublic: true
      });

      // 8. Custom National/Independence Day (from country specification)
      const [nMonth, nDay] = country.nationalHoliday.date.split("-").map(Number);
      holidayValues.push({
        countryId: country.id,
        holidayName: country.nationalHoliday.name,
        date: `2026-${country.nationalHoliday.date}`,
        month: monthNames[nMonth - 1],
        year: 2026,
        day: getDayOfWeek(2026, nMonth, nDay),
        description: country.nationalHoliday.description,
        type: "National",
        isPublic: true
      });

      // 9. Christmas Day (Dec 25, 2026)
      holidayValues.push({
        countryId: country.id,
        holidayName: "Christmas Day",
        date: "2026-12-25",
        month: "December",
        year: 2026,
        day: getDayOfWeek(2026, 12, 25),
        description: `Worldwide Christian festival celebrating the birth of Jesus Christ, observed as a popular public holiday.`,
        type: "Religious",
        isPublic: true
      });
    }

    // Insert holidays in bulk
    await prisma.holiday.createMany({ data: holidayValues });
    console.log(`Seeded ${holidayValues.length} public and national holidays across Africa!`);

    console.log("Seeding Google Ads positions...");
    const adsToSeed = [
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
    ];

    for (const ad of adsToSeed) {
      await prisma.adsPosition.upsert({
        where: { positionKey: ad.positionKey },
        update: {},
        create: ad,
      });
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}
