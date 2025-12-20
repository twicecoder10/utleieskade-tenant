// Translation utilities for Norwegian and English

export type Language = "Norwegian" | "English";

export const translations: Record<Language, Record<string, string>> = {
  Norwegian: {
    // Common
    "Welcome back": "Velkommen tilbake",
    "Manage your property issues effortlessly": "Administrer eiendomsproblemer enkelt",
    "Report damages": "Rapporter skader",
    "Let us know about any damage that needs attention.": "Gi oss beskjed om skader som trenger oppmerksomhet.",
    "Active Cases": "Aktive saker",
    "requires attention": "krever oppmerksomhet",
    "Resolved Issues": "Løste problemer",
    "Last 30 days": "Siste 30 dager",
    "Scheduled Inspections": "Planlagte inspeksjoner",
    "Next:": "Neste:",
    "No upcoming inspections": "Ingen kommende inspeksjoner",
    "Quick Action": "Hurtig handling",
    "Report New Case": "Rapporter ny sak",
    "View All Cases": "Se alle saker",
    "Download Receipts": "Last ned kvitteringer",
    "Submitted Cases": "Innsendte saker",
    "View all": "Se alle",
    "Frequently asked questions": "Ofte stilte spørsmål",
    "Everything you need to know about the product and billing.": "Alt du trenger å vite om produktet og fakturering.",
    "Still have questions?": "Har du fortsatt spørsmål?",
    "Can't find the answer you're looking for? Please contact us.": "Finner du ikke svaret du leter etter? Ta kontakt med oss.",
    "Send us a mail": "Send oss en e-post",
    "Settings": "Innstillinger",
    "Account": "Konto",
    "First Name": "Fornavn",
    "Last Name": "Etternavn",
    "Phone Number": "Telefonnummer",
    "Email": "E-post",
    "Save Changes": "Lagre endringer",
    "Security & Privacy": "Sikkerhet og personvern",
    "Password": "Passord",
    "Privacy Policy": "Personvernregler",
    "Language": "Språk",
    "Appearance": "Utseende",
    "Light mode": "Lys modus",
    "Dark mode": "Mørk modus",
    "Delete account": "Slett konto",
    "Search": "Søk",
    "Oslo, Norway": "Oslo, Norge",
    "No submitted reports found": "Ingen innsendte rapporter funnet",
    "Error fetching tenant cases": "Feil ved henting av saker",
    "Error fetching dashboard data": "Feil ved henting av dashboarddata",
    "Error fetching user data": "Feil ved henting av brukerdata",
  },
  English: {
    // All English strings remain the same
    "Welcome back": "Welcome back",
    "Manage your property issues effortlessly": "Manage your property issues effortlessly",
    "Report damages": "Report damages",
    "Let us know about any damage that needs attention.": "Let us know about any damage that needs attention.",
    "Active Cases": "Active Cases",
    "requires attention": "requires attention",
    "Resolved Issues": "Resolved Issues",
    "Last 30 days": "Last 30 days",
    "Scheduled Inspections": "Scheduled Inspections",
    "Next:": "Next:",
    "No upcoming inspections": "No upcoming inspections",
    "Quick Action": "Quick Action",
    "Submitted Cases": "Submitted Cases",
    "View all": "View all",
    "Frequently asked questions": "Frequently asked questions",
    "Everything you need to know about the product and billing.": "Everything you need to know about the product and billing.",
    "Still have questions?": "Still have questions?",
    "Can't find the answer you're looking for? Please contact us.": "Can't find the answer you're looking for? Please contact us.",
    "Send us a mail": "Send us a mail",
    "Settings": "Settings",
    "Account": "Account",
    "First Name": "First Name",
    "Last Name": "Last Name",
    "Phone Number": "Phone Number",
    "Email": "Email",
    "Save Changes": "Save Changes",
    "Security & Privacy": "Security & Privacy",
    "Password": "Password",
    "Privacy Policy": "Privacy Policy",
    "Language": "Language",
    "Appearance": "Appearance",
    "Light mode": "Light mode",
    "Dark mode": "Dark mode",
    "Delete account": "Delete account",
    "Search": "Search",
    "Oslo, Norway": "Oslo, Norway",
    "No submitted reports found": "No submitted reports found",
    "Error fetching tenant cases": "Error fetching tenant cases",
    "Error fetching dashboard data": "Error fetching dashboard data",
    "Error fetching user data": "Error fetching user data",
  },
};

// Translation hook/function
export const useTranslation = (language: Language = "Norwegian") => {
  return (key: string): string => {
    return translations[language][key] || key;
  };
};

// Get translation directly
export const t = (key: string, language: Language = "Norwegian"): string => {
  return translations[language][key] || key;
};

