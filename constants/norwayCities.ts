export interface NorwayCity {
  name: string;
  postcode: string;
}

export const norwayCities: NorwayCity[] = [
  { name: "Oslo", postcode: "0001" },
  { name: "Bergen", postcode: "5001" },
  { name: "Trondheim", postcode: "7001" },
  { name: "Stavanger", postcode: "4001" },
  { name: "Bærum", postcode: "1300" },
  { name: "Kristiansand", postcode: "4601" },
  { name: "Fredrikstad", postcode: "1601" },
  { name: "Tromsø", postcode: "9001" },
  { name: "Sandnes", postcode: "4301" },
  { name: "Asker", postcode: "1383" },
  { name: "Sarpsborg", postcode: "1701" },
  { name: "Skien", postcode: "3701" },
  { name: "Drammen", postcode: "3001" },
  { name: "Bodø", postcode: "8001" },
  { name: "Ålesund", postcode: "6001" },
  { name: "Tønsberg", postcode: "3101" },
  { name: "Moss", postcode: "1501" },
  { name: "Haugesund", postcode: "5501" },
  { name: "Arendal", postcode: "4801" },
  { name: "Sandefjord", postcode: "3201" },
  { name: "Larvik", postcode: "3251" },
  { name: "Hamar", postcode: "2301" },
  { name: "Halden", postcode: "1751" },
  { name: "Gjøvik", postcode: "2801" },
  { name: "Lillehammer", postcode: "2601" },
  { name: "Horten", postcode: "3181" },
  { name: "Molde", postcode: "6401" },
  { name: "Kongsberg", postcode: "3601" },
  { name: "Harstad", postcode: "9401" },
  { name: "Steinkjer", postcode: "7701" },
  { name: "Alta", postcode: "9501" },
  { name: "Mo i Rana", postcode: "8601" },
  { name: "Kristiansund", postcode: "6501" },
  { name: "Narvik", postcode: "8501" },
  { name: "Hønefoss", postcode: "3501" },
  { name: "Elverum", postcode: "2401" },
  { name: "Kongsvinger", postcode: "2201" },
  { name: "Notodden", postcode: "3671" },
  { name: "Vennesla", postcode: "4701" },
  { name: "Ringerike", postcode: "3507" },
  { name: "Egersund", postcode: "4371" },
  { name: "Førde", postcode: "6801" },
  { name: "Volda", postcode: "6101" },
  { name: "Åndalsnes", postcode: "6301" },
  { name: "Hammerfest", postcode: "9601" },
  { name: "Kirkenes", postcode: "9901" },
  { name: "Longyearbyen", postcode: "9171" },
];

// Helper function to get cities sorted by name
export const getSortedCities = (): NorwayCity[] => {
  return [...norwayCities].sort((a, b) => a.name.localeCompare(b.name));
};

// Helper function to get postcode by city name
export const getPostcodeByCity = (cityName: string): string | undefined => {
  const city = norwayCities.find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase()
  );
  return city?.postcode;
};

// Helper function to validate Norwegian postcode format (4 digits)
export const isValidNorwegianPostcode = (postcode: string): boolean => {
  return /^\d{4}$/.test(postcode);
};


