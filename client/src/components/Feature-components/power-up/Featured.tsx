import Card from "./Card";

const Featured = () => {
  const cardData = [
    {
      bannerImg:
        "https://trello-server--pup-assets.us-east-1.prod.public.atl-paas.net/655f68bed3dee74f143b8c5a/hero-images/@2x.png",
      linkTo: "any-fields",
      logoImg:
        "https://trello.schnapps.tech/static/images/any-fields/icon-black-256.svg",
      heading: "Any Fields",
      shortDescription:
        "Create custom fields and share them across boards. Use filters to analyze data across cards.",
      longDescription: "",
      users: "10,000+ users",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg:
        "https://trello-server--pup-assets.us-east-1.prod.public.atl-paas.net/637307154b117e05a423c8a1/hero-images/@2x.png",
      linkTo: "outlook-calendar",
      logoImg: "https://kryl.com/apps/trello/outlook/images/logo.png",
      heading: "Outlook Calendar for Trello by Kryl Solutions",
      shortDescription:
        "A Power-Up to bring your Outlook Calendar and Trello Tasks under one view.",
      longDescription: "",
      users: "25,000+ users",
      categories: [""],
      madeBy: "Kryl Solutions",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "https://plugin.trello.services/images/unito-boardsync@2x.png",
      linkTo: "board-sync",
      logoImg:
        "https://unito.io/wp-content/uploads/2020/01/Unito-avatar-white-symbol.svg",
      heading: "2-Way Board Sync and Mirroring",
      shortDescription:
        "Sync cards across multiple Trello boards and keep them in sync. Build powerful workflows across all of your Trello boards.",
      longDescription: "",
      users: "50,000+ users",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg:
        "https://trello-server--pup-assets.us-east-1.prod.public.atl-paas.net/6211e70cf500cc8f17546a80/hero-images/@2x.png",
      linkTo: "card-time",
      logoImg: "https://www.gtola.com/card-time-in-list/logoBlack144.png",
      heading: "Card Time In List by GTOLA",
      shortDescription:
        "Report the duration of each card in the list via a label. Track time automatically and export to Excel/CSV/PDF.",
      longDescription: "",
      users: "5,000+ users",
      categories: [""],
      madeBy: "GTOLA",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "https://plugin.trello.services/images/google-drive@2x.jpg",
      linkTo: "google-drive",
      logoImg:
        "https://www.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png",
      heading: "Google Drive",
      shortDescription:
        "Access your Drive files for a project directly from its card, or create and attach new Drive files to a card.",
      longDescription: "",
      users: "2,000,000+ users",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "https://plugin.trello.services/images/list-limits@2x.jpg",
      linkTo: "list-limits",
      logoImg: "https://list-limits.trello.services/images/list-limits.svg",
      heading: "List Limits",
      shortDescription:
        "Set a limit on your lists to highlight them if the number of cards in it passes the limit.",
      longDescription: "",
      users: "1,000,000+ users",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg: "https://plugin.trello.services/images/readme@2x.png",
      linkTo: "read-me",
      logoImg: "https://readme.trello.services/images/icon.png",
      heading: "Read Me",
      shortDescription: 'Write a "Read Me" for your board in Markdown! 📝',
      longDescription: "",
      users: "100,000+ users",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg:
        "https://trello-server--pup-assets.us-east-1.prod.public.atl-paas.net/655f68bed3dee74f143b8c5a/hero-images/@2x.png",
      linkTo: "any-fields",
      logoImg:
        "https://trello.schnapps.tech/static/images/any-fields/icon-black-256.svg",
      heading: "Any Fields",
      shortDescription:
        "Create custom fields and share them across boards. Use filters to analyze data across cards.",
      longDescription: "",
      users: "10,000+ users",
      categories: [""],
      madeBy: "",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
    {
      bannerImg:
        "https://trello-server--pup-assets.us-east-1.prod.public.atl-paas.net/6211e70cf500cc8f17546a80/hero-images/@2x.png",
      linkTo: "card-time",
      logoImg: "https://www.gtola.com/card-time-in-list/logoBlack144.png",
      heading: "Card Time In List by GTOLA",
      shortDescription:
        "Report the duration of each card in the list via a label. Track time automatically and export to Excel/CSV/PDF.",
      longDescription: "",
      users: "5,000+ users",
      categories: [""],
      madeBy: "GTOLA",
      keyFeatures: [""],
      why: "",
      pricing: "",
      ourVision: "",
      prices: [""],
    },
  ];

  return (
    <>
      <div
        className="w-full min-h-[50vh]  flex gap-5 flex-col items-center justify-center text-center bg-contain bg-center mb-20 "
        style={{
          backgroundImage:
            "url('https://trello.com/assets/260b9c5f78bd43739ef9.png')",
        }}
      >
        <h1 className="font-charlie-display-sm text-5xl">
          {" "}
          Power-ups for Taskflow
        </h1>
        <p className="text-lg">
          Calendars, Voting, Repeating Cards and so much more with integrations 
          like Jira, <br/> Slack, Google Drive, InVision - get your Trello superpowers
          now!
        </p>
      </div>
      <div
        className="flex w-full gap-2 
      flex-wrap"
      >
        {cardData.map(
          ({ bannerImg, heading, logoImg, shortDescription, users }) => (
            <Card
              bannerImg={bannerImg}
              heading={heading}
              logoImg={logoImg}
              shortDescription={shortDescription}
              users={users}
            />
          )
        )}
      </div>
    </>
  );
};

export default Featured;
