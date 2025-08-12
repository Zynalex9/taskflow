export interface PageData {
  page: string;
  to: string;
  hero: {
    heading: string;
    subheading: string;
    description: string;
    buttonText: string;
  };
  captureHeader: {
    image: string;
    text: string;
  };
  captureSections1: {
    heading: string;
    text: string;
    image: string;
  };
  captureSections2: {
    heading: string;
    text: string;
    image: string;
  };
  captureSections3: {
    heading: string;
    text: string;
    image: string;
  };
}

export const featurePages = [
  {
    page: "inbox",
    itemName: "Inbox",

    hero: {
      heading: "Taskflow Inbox",
      subheading: "Capture, organize, and conquer every to-do",
      buttonText: "Try Taskflow For Free",
      linkText: "Learn more about Taskflow's plans and pricing.",
      linkTo: "",
      image: "/inbox-hero.png",
    },
    captureHeader: {
      heading: "Capture Anytime",
      text: `Say goodbye to lost to-dos and scattered ideas! Taskflow Inbox saves you from the chaos of emails, messages, and notes. Jot down thoughts as they come or effortlessly snatch snippets from your favorite tools—no need to organize them right away.`,
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/76s8l9DR2ZxNhjevNpluXZ/04387ada53789d2209416c5fff14d9cd/inbox-subheader_.png?w=2280&fm=webp",
    },
    captureSections1: {
      heading: "Instant Capture",
      text: `No more missed opportunities! Capture tasks and ideas from your favorite tools, like email and Slack, in a flash, so you’ll never let important items slip away.`,
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/3bcHZVmKoRsaSDFZKJwXDw/77413476c30fe9e370b31735ab8acc21/inbox-email.png?w=1614&fm=webp",
    },
    captureSections2: {
      heading: "Seamless organization",
      text: `Ready to tidy up? Simply drag and drop your captured items into the right boards, making organization a breeze.`,
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/5DRtL3KwxCfXwlkz5KOktV/9ccca794c97e1667b267ef9b23559876/inbox-to-board.png?w=1614&fm=webp",
    },
    captureSections3: {
      heading: "Intuitive organization",
      text: `Got quick to-dos? Mark them "Done" straight from the Inbox and keep your momentum going!`,
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/409sOWzv1tfbFOOHEyjIzs/4d40324069846676dacf868fe3b373e0/inbox-donestate.png?w=1614&fm=webp",
    },
  },
  {
    page: "planner",
    itemName: "Planner",
    hero: {
      heading: "Taskflow Planner",
      secondHeading: "Plan, stay focused, and get more [sh*t] done",
      subheading:
        "Planner is your ultimate planning companion to unlock the power of staying in the zone and getting more done.",
      buttonText: "Get Started",
      linkText: "Learn more about Taskflow's plans and pricing.",
      linkTo: "",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/5jLvxYsqWehh4tkm3FqMYj/eec08095626ec26259144e7055dd7d08/planner-hero.png?w=2280&fm=webp",
    },
    captureHeader: {
      heading: "Plan anytime, anywhere",
      text: `Focus and make time for what truly matters. Say goodbye to scattered schedules and missed deadlines! Taskflow Planner is your go-to tool for capturing and organizing your plans, whether you're at your desk or on the go.`,
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/76s8l9DR2ZxNhjevNpluXZ/04387ada53789d2209416c5fff14d9cd/inbox-subheader_.png?w=2280&fm=webp",
    },
    captureSections1: {
      heading: "Effortless scheduling",
      text: `Never miss a beat! Schedule tasks and events directly from your favorite tools, like Google Calendar and Outlook, ensuring you stay on top of everything.`,
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/5jLvxYsqWehh4tkm3FqMYj/eec08095626ec26259144e7055dd7d08/planner-hero.png?w=2280&fm=webp",
    },
    captureSections2: {
      heading: "Intuitive organization",
      text: `Ready to lock in your plans? Simply drag and drop your tasks into the right boards, making organization a breeze.`,
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/3EKhSNm6rGLbkmQbhL7d6l/9ae2600f804c8ae50c0fd4cb5c6b87dd/intuitive-organization.png?w=1614&fm=webp",
    },
    captureSections3: {
      heading: "Drag to Organize",
      text: `Just captured something? Drag and drop it into the perfect board later.`,
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/1EAMkyBfaJLQgiLvUqMiqQ/2c1013ad6d07c9d3a4ab1ef77d3a049e/stay-on-track.png?w=1614&fm=webp",
    },
  },
  {
    page: "intregation",
    itemName: "Integration",
    hero: {
      heading: "Taskflow Integrations",
      subheading: "Connect your favorite tools and work smarter, not harder",
      buttonText: "Explore Integrations",
      linkText:
        "Learn more about supported integrations and how to connect them.",
      linkTo: "",
      image: "https://via.placeholder.com/1200x600.png?text=Integration+Hero",
    },
    captureHeader: {
      heading: "Bring all your work together",
      text: `No more switching between tabs and apps! Taskflow Integrations link your tools so your work stays in one place, boosting productivity and keeping you in the zone.`,
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/76s8l9DR2ZxNhjevNpluXZ/04387ada53789d2209416c5fff14d9cd/inbox-subheader_.png?w=2280&fm=webp",
    },
    captureSections1: {
      heading: "Popular app connections",
      text: `Connect with Slack, Google Drive, Zoom, and more to create a unified workflow that keeps your team aligned.`,
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/5jLvxYsqWehh4tkm3FqMYj/eec08095626ec26259144e7055dd7d08/planner-hero.png?w=2280&fm=webp",
    },
    captureSections2: {
      heading: "Automate your workflow",
      text: `Set up rules and triggers between Taskflow and your favorite apps to save time on repetitive work.`,
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/3EKhSNm6rGLbkmQbhL7d6l/9ae2600f804c8ae50c0fd4cb5c6b87dd/intuitive-organization.png?w=1614&fm=webp",
    },
    captureSections3: {
      heading: "Custom integrations",
      text: `Use our API to connect with niche tools and build exactly the integrations you need.`,
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/1EAMkyBfaJLQgiLvUqMiqQ/2c1013ad6d07c9d3a4ab1ef77d3a049e/stay-on-track.png?w=1614&fm=webp",
    },
  },
];
export const solutionPages: PageData[] = [
  {
    page: "marketing-teams",
    to: "/solution/marketing-teams",
    hero: {
      heading: "Taskflow For Marketing Teams",
      subheading:
        "Taskflow makes it easy to capture every detail from emails, chats, and tools—all in one place.",
      description:
        "Whether launching a new product, campaign, or creating content, experience how Taskflow helps marketing teams around the world organize, plan, and get more done.",
      buttonText: "Get Started Free",
    },
    captureHeader: {
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/36PnpdmXvcwbAeIrYlONqB/41927205eb9a3cdcfb08320bc95dd806/Card4_2x.png?w=704&fm=webp",
      text: "Taskflow’s boards, lists, and cards enable teams to go from ideas to action in seconds. Visual and easy-to-use, Taskflow helps teams bring projects to life and keep them moving forward.",
    },
    captureSections1: {
      heading: "Visualize your work from the right angle.",
      text: "Power your Marketing team with Calendar View and ensure campaign launches are cool, calm, and collected—instead of chaotic.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/68zIvQpZurj8bcZbd6gshI/5864c4ed8e1f8ca9fb144eaf9b775d47/Calendar_View_Illo_7.png?w=1280&fm=webp",
    },
    captureSections2: {
      heading: "Power-Up Your Marketing Team’s Productivity",
      text: "Simple, adaptable, customizable. Make Taskflow your marketing hub with Power-Ups. Connect your favorite apps and integrations to Taskflow and gather all of the information you need to get things done under one roof.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/5YEBb9savBpFjYs3f73V9k/b780c8264ea47498e8e3c370d8c42499/Power-Ups.svg",
    },
    captureSections3: {
      heading: "Move Work Forward, Auto-magically",
      text: "Taskflow’s built-in automation makes it easy to automate the repetitive, everyday tasks that keep your team from focusing on the work that matters most.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/1ZYlxlyZWPd5fw6WqdnbEC/d2b6e3305528cd6c82f7e6e32a47def6/UI_Illo__Automation_Rules.png?w=1098&fm=webp",
    },
  },
  {
    page: "project-manager",
    to: "/solution/project-manager",
    hero: {
      heading: "Powerful Project Planning for Managers",
      subheading:
        "Organize, prioritize, and focus with synced calendars and focused time slots.",
      description:
        "Take control of your projects with smart scheduling tools and real-time visibility for your entire team.",
      buttonText: "Try It Now",
    },
    captureHeader: {
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/68zIvQpZurj8bcZbd6gshI/5864c4ed8e1f8ca9fb144eaf9b775d47/Calendar_View_Illo_7.png?w=1280&fm=webp",
      text: "From tracking deadlines to assigning tasks, Taskflow gives project managers the clarity they need to deliver on time.",
    },
    captureSections1: {
      heading: "Visualize your work from the right angle.",
      text: "Power your Marketing team with Calendar View and ensure campaign launches are cool, calm, and collected—instead of chaotic.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/68zIvQpZurj8bcZbd6gshI/5864c4ed8e1f8ca9fb144eaf9b775d47/Calendar_View_Illo_7.png?w=1280&fm=webp",
    },
    captureSections2: {
      heading: "Power-Up Your Marketing Team’s Productivity",
      text: "Simple, adaptable, customizable. Make Taskflow your marketing hub with Power-Ups. Connect your favorite apps and integrations to Taskflow and gather all of the information you need to get things done under one roof.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/5YEBb9savBpFjYs3f73V9k/b780c8264ea47498e8e3c370d8c42499/Power-Ups.svg",
    },
    captureSections3: {
      heading: "Move Work Forward, Auto-magically",
      text: "Taskflow’s built-in automation makes it easy to automate the repetitive, everyday tasks that keep your team from focusing on the work that matters most.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/1ZYlxlyZWPd5fw6WqdnbEC/d2b6e3305528cd6c82f7e6e32a47def6/UI_Illo__Automation_Rules.png?w=1098&fm=webp",
    },
  },
  {
    page: "engineering-teams",
    to: "/solution/engineering-teams",
    hero: {
      heading: "Automate Engineering Workflows",
      subheading:
        "Taskflow helps engineering teams automate repetitive tasks and keep sprints on track.",
      description:
        "Free your engineers from tedious manual tasks with automation that keeps development moving smoothly.",
      buttonText: "Explore Features",
    },
    captureHeader: {
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/68zIvQpZurj8bcZbd6gshI/5864c4ed8e1f8ca9fb144eaf9b775d47/Calendar_View_Illo_7.png?w=1280&fm=webp",
      text: "Whether it's sprint planning or bug tracking, Taskflow helps engineers focus on code—not coordination.",
    },
    captureSections1: {
      heading: "Visualize your work from the right angle.",
      text: "Power your Marketing team with Calendar View and ensure campaign launches are cool, calm, and collected—instead of chaotic.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/68zIvQpZurj8bcZbd6gshI/5864c4ed8e1f8ca9fb144eaf9b775d47/Calendar_View_Illo_7.png?w=1280&fm=webp",
    },
    captureSections2: {
      heading: "Power-Up Your Marketing Team’s Productivity",
      text: "Simple, adaptable, customizable. Make Taskflow your marketing hub with Power-Ups. Connect your favorite apps and integrations to Taskflow and gather all of the information you need to get things done under one roof.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/5YEBb9savBpFjYs3f73V9k/b780c8264ea47498e8e3c370d8c42499/Power-Ups.svg",
    },
    captureSections3: {
      heading: "Move Work Forward, Auto-magically",
      text: "Taskflow’s built-in automation makes it easy to automate the repetitive, everyday tasks that keep your team from focusing on the work that matters most.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/1ZYlxlyZWPd5fw6WqdnbEC/d2b6e3305528cd6c82f7e6e32a47def6/UI_Illo__Automation_Rules.png?w=1098&fm=webp",
    },
  },
  {
    page: "startups",
    to: "/solution/startups",
    hero: {
      heading: "Fuel Your Startup's Growth",
      subheading:
        "Integrate your tools and power up your team with Taskflow’s flexible plugin ecosystem.",
      description:
        "Scale your startup efficiently with flexible workflows and powerful integrations tailored to your unique needs.",
      buttonText: "Build With Taskflow",
    },
    captureHeader: {
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/68zIvQpZurj8bcZbd6gshI/5864c4ed8e1f8ca9fb144eaf9b775d47/Calendar_View_Illo_7.png?w=1280&fm=webp",
      text: "Startups thrive on speed. Taskflow helps your team execute fast, stay aligned, and plug into your favorite tools.",
    },
    captureSections1: {
      heading: "Visualize your work from the right angle.",
      text: "Power your Marketing team with Calendar View and ensure campaign launches are cool, calm, and collected—instead of chaotic.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/68zIvQpZurj8bcZbd6gshI/5864c4ed8e1f8ca9fb144eaf9b775d47/Calendar_View_Illo_7.png?w=1280&fm=webp",
    },
    captureSections2: {
      heading: "Power-Up Your Marketing Team’s Productivity",
      text: "Simple, adaptable, customizable. Make Taskflow your marketing hub with Power-Ups. Connect your favorite apps and integrations to Taskflow and gather all of the information you need to get things done under one roof.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/5YEBb9savBpFjYs3f73V9k/b780c8264ea47498e8e3c370d8c42499/Power-Ups.svg",
    },
    captureSections3: {
      heading: "Move Work Forward, Auto-magically",
      text: "Taskflow’s built-in automation makes it easy to automate the repetitive, everyday tasks that keep your team from focusing on the work that matters most.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/1ZYlxlyZWPd5fw6WqdnbEC/d2b6e3305528cd6c82f7e6e32a47def6/UI_Illo__Automation_Rules.png?w=1098&fm=webp",
    },
  },
  {
    page: "design-teams",
    to: "/solution/design-teams",
    hero: {
      heading: "Design With Structure and Freedom",
      subheading:
        "Help your design team stay creative and organized with ready-to-use templates and team tools.",
      description:
        "Empower your designers with templates, collaboration tools, and feedback workflows to deliver stunning work on time.",
      buttonText: "Start Designing",
    },
    captureHeader: {
      image: "/images/solution-hero.webp",
      text: "Give your team a blueprint for success with easy-to-use templates from industry leaders and the Taskflow community.",
    },
    captureSections1: {
      heading: "Visualize your work from the right angle.",
      text: "Power your Marketing team with Calendar View and ensure campaign launches are cool, calm, and collected—instead of chaotic.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/68zIvQpZurj8bcZbd6gshI/5864c4ed8e1f8ca9fb144eaf9b775d47/Calendar_View_Illo_7.png?w=1280&fm=webp",
    },
    captureSections2: {
      heading: "Power-Up Your Marketing Team’s Productivity",
      text: "Simple, adaptable, customizable. Make Taskflow your marketing hub with Power-Ups. Connect your favorite apps and integrations to Taskflow and gather all of the information you need to get things done under one roof.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/5YEBb9savBpFjYs3f73V9k/b780c8264ea47498e8e3c370d8c42499/Power-Ups.svg",
    },
    captureSections3: {
      heading: "Move Work Forward, Auto-magically",
      text: "Taskflow’s built-in automation makes it easy to automate the repetitive, everyday tasks that keep your team from focusing on the work that matters most.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/1ZYlxlyZWPd5fw6WqdnbEC/d2b6e3305528cd6c82f7e6e32a47def6/UI_Illo__Automation_Rules.png?w=1098&fm=webp",
    },
  },
  {
    page: "remote-teams",
    to: "/solution/remote-teams",
    hero: {
      heading: "Taskflow for Project Management",
      subheading:
        "Bring high-quality products to market faster with Taskflow. Discover the most effective ways product management teams can track product roadmaps, simplify sprints, and launch new updates with ease.",
      description:
        "Optimize remote teamwork with tools that simplify communication, task management, and project visibility across locations.",
      buttonText: "Learn More",
    },
    captureHeader: {
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/36PnpdmXvcwbAeIrYlONqB/41927205eb9a3cdcfb08320bc95dd806/Card4_2x.png?w=704&fm=webp",
      text: "Taskflow's boards, lists, and cards enable teams to go from ideas to action in seconds. Visual and easy-to-use, Taskflow helps teams bring projects to life and keep them moving forward.",
    },
    captureSections1: {
      heading: "Visualize your work from the right angle.",
      text: "Power your Marketing team with Calendar View and ensure campaign launches are cool, calm, and collected—instead of chaotic.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/68zIvQpZurj8bcZbd6gshI/5864c4ed8e1f8ca9fb144eaf9b775d47/Calendar_View_Illo_7.png?w=1280&fm=webp",
    },
    captureSections2: {
      heading: "Power-Up Your Marketing Team’s Productivity",
      text: "Simple, adaptable, customizable. Make Taskflow your marketing hub with Power-Ups. Connect your favorite apps and integrations to Taskflow and gather all of the information you need to get things done under one roof.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/5YEBb9savBpFjYs3f73V9k/b780c8264ea47498e8e3c370d8c42499/Power-Ups.svg",
    },
    captureSections3: {
      heading: "Move Work Forward, Auto-magically",
      text: "Taskflow’s built-in automation makes it easy to automate the repetitive, everyday tasks that keep your team from focusing on the work that matters most.",
      image:
        "https://images.ctfassets.net/rz1oowkt5gyp/1ZYlxlyZWPd5fw6WqdnbEC/d2b6e3305528cd6c82f7e6e32a47def6/UI_Illo__Automation_Rules.png?w=1098&fm=webp",
    },
  },
];
