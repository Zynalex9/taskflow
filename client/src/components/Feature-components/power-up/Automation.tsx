import Card from "./Card";

const Automation = () => {
  const cardData = [
    {
      bannerImg: "",
      linkTo: "custom-fields-with-external-data",
      logoImg:"https://trello-custom-fields-ed.sm-act.com/assets/img/app_icon_1.svg",
      heading: "Custom Fields With External Data",
      shortDescription: "Show or synchronise your large data sets with Trello",
      longDescription: "",
      users: "5,000+",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "",
      linkTo: "tablefy",
      logoImg:"https://tablefy.d1hgvjm9dk1ut.amplifyapp.com/icons/logo.svg",
      heading: "Tablefy (Create Tables on Cards - Free)",
      shortDescription:
        "Easily create tables on cards & keep work organized. Familiar spreadsheet experience for seamless teamwork.",
      longDescription: "",
      users: "1,000+",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "",
      linkTo: "google-calendar-sync",
      logoImg:"	https://google-calendar-sync-power-up.mig.team/icon.png",
      heading: "Google Calendar Sync",
      shortDescription:
        "Sync your Trello boards and cards with dates to Google Calendar",
      longDescription: "",
      users: "10,000+",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "",
      linkTo: "card-mirror-sync-2way",
      logoImg:"	https://trello.placker.com/power-up-mirror/current/img/mirror-logo.png",
      heading: "Card Mirror & Sync (2 way) by Placker",
      shortDescription:
        "Mirror & Sync cards across boards. Winner Atlassian codegest, best app for remote working.",
      longDescription: "",
      users: "25,000+",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "",
      linkTo: "card-mirror-card-sync-2way",
      logoImg:"https://i.ibb.co/GnSMp9r/new-logo.png",
      heading: "Card Mirror & Card Sync (2-Way)",
      shortDescription:
        "Two-way card mirroring across Trello boards and workspaces. Card syncing that just works!",
      longDescription: "",
      users: "1,000+",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "",
      linkTo: "hubspot-integration",
      logoImg:"https://apilabz.com/icons/hubspot.svg",
      heading: "HubSpot Integration",
      shortDescription:
        "Effortlessly convert Trello cards into HubSpot deals, streamlining your sales pipeline management.",
      longDescription: "",
      users: "100+",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "",
      linkTo: "conditional-list-colors",
      logoImg:"https://cdn.powerups.club/conditional-list-colors/logo.png",
      heading: "Conditional List Colors - Tiny Power-Ups Club",
      shortDescription:
        "Change list colors based on certain dynamic conditions",
      longDescription: "",
      users: "1,000+",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "",
      linkTo: "excel-trello-2way-sync",
      logoImg:"https://cdn.powerups.club/conditional-list-colors/logo.png",
      heading: "Excel + Trello 2-Way Sync",
      shortDescription:
        "Sync Trello cards with Excel rows using this powerful integration.",
      longDescription: "",
      users: "10,000+",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "",
      linkTo: "binotel-trello",
      logoImg:"https://binotel-trello.aglar.in/binotel_logo.png",
      heading: "Binotel + Trello",
      shortDescription:
        "Allows you to listen to calls directly from the trello card.",
      longDescription: "",
      users: "100+",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "",
      linkTo: "cronofy",
      logoImg:"https://dfcalg2svzojb.cloudfront.net/assets/cronofy-style/logos/cronofy/cronofy_icon_144-fa100685c615eb96e506d2288d532b4013197bd041b991da90a2ea080cb74173.png",
      heading: "Cronofy",
      shortDescription:
        "Real-time calendar sync between Trello and your calendar",
      longDescription: "",
      users: "50,000+",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "",
      linkTo: "notifications-by-infinity",
      logoImg:"https://notifications.infinitypowerups.com/icon.png",
      heading: "Notifications by Infinity",
      shortDescription:
        "Email, SMS and WhatsApp notifications based on Trello style automations",
      longDescription: "",
      users: "100+",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "",
      linkTo: "2way-board-sync-and-mirroring",
      logoImg:"https://unito.io/wp-content/uploads/2020/01/Unito-avatar-white-symbol.svg",
      heading: "2-Way Board Sync and Mirroring",
      shortDescription:
        "Sync cards across multiple Trello boards and keep them in sync. Build powerful workflows across all of your Trello boards.",
      longDescription: "",
      users: "50,000+",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
  ];
  return (
    <div className="flex w-full gap-2 flex-wrap">
      {cardData.map(({ heading, logoImg, shortDescription, users, bannerImg }, index) => (
        <Card
          key={index}
          heading={heading}
          logoImg={logoImg}
          shortDescription={shortDescription}
          users={users}
          bannerImg={bannerImg}
        />
      ))}
    </div>
  );
};

export default Automation;
