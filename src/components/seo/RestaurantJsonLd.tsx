import { SCHEDULE, SITE } from "@/data/site";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hhmm = (minutes: number) => `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export function RestaurantJsonLd({ url }: { url: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    url,
    servesCuisine: ["Hambúrguer", "Churrasco"],
    priceRange: "$$",
    telephone: SITE.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    openingHoursSpecification: SCHEDULE.flatMap((day, i) =>
      day ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: DAYS[i], opens: hhmm(day.open), closes: hhmm(day.close) }] : [],
    ),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
