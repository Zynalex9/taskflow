import mongoose from "mongoose";
import { connectDB } from "../database";
import { boardModel } from "../models/board.models";
import { CardLabelModel } from "../models/card.label.model";
import { ListModel } from "../models/list.models";
import { CheckListModel } from "../models/card.checklist.model";
import { CardAttachmentModel } from "../models/card.attachments.model";
import { CardModel } from "../models/card.model";
import { UserModel } from "../models/user.model";
import bcryptjs from "bcryptjs";

async function seedTemplates() {
  await connectDB();

  const templates = [
    {
      title: "Kanban Project Template",
      cover: "https://images.unsplash.com/photo-1486728297118-82a07bc48a28",
      description: "A kanban workflow for general projects.",
      lists: {
        Backlog: [
          "Research requirements",
          "Collect user feedback",
          "Market analysis",
          "Draft initial proposal",
        ],
        "To Do": [
          "Set up Git repository",
          "Create project structure",
          "Install dependencies",
          "Define API endpoints",
        ],
        "In Progress": [
          "Implement authentication",
          "Build dashboard UI",
          "Integrate payment gateway",
          "Write unit tests",
        ],
        Done: [
          "Wireframes completed",
          "Project kickoff meeting",
          "Dev environment setup",
          "Team roles assigned",
        ],
      },
    },
    {
      title: "Content Planning Template",
      cover: "https://images.unsplash.com/photo-1678798694643-2b8fddcf900f",
      description: "Plan and manage your social media content.",
      lists: {
        Ideas: [
          "Instagram carousel: Tips for remote work",
          "YouTube tutorial: React performance",
          "Blog: Top 10 VSCode extensions",
          "Twitter poll: Favorite JS framework",
        ],
        Writing: [
          "Draft LinkedIn article: AI trends",
          "Medium blog: Web security basics",
          "Email newsletter: Monthly roundup",
          "Script for podcast episode",
        ],
        Scheduled: [
          "Schedule Instagram reel",
          "Queue Facebook ad campaign",
          "Plan TikTok collab",
          "Prepare Pinterest pins",
        ],
        Published: [
          "Twitter post: React Hooks tips",
          "LinkedIn carousel on leadership",
          "Blog post: Docker for beginners",
          "Newsletter: Productivity hacks",
        ],
      },
    },
    {
      title: "Bug Tracking Template",
      cover: "https://images.unsplash.com/photo-1754925703013-2f5c532b219c",
      description: "Track bugs from reporting to resolution.",
      lists: {
        Reported: [
          "UI glitch on login form",
          "Search not returning results",
          "Broken link in footer",
          "Form validation missing",
        ],
        Triaged: [
          "API timeout issue",
          "Slow image loading",
          "Dark mode color mismatch",
          "Mobile menu overlap",
        ],
        "In Progress": [
          "Fix email notification bug",
          "Resolve CORS error",
          "Correct typo in terms page",
          "Optimize database queries",
        ],
        Resolved: [
          "Memory leak fix deployed",
          "404 page styled",
          "Button alignment issue fixed",
          "Profile picture upload bug fixed",
        ],
      },
    },
    {
      title: "Event Planning Template",
      cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      description: "Organize tasks and schedules for events.",
      lists: {
        Planning: [
          "Book venue",
          "Confirm guest speakers",
          "Draft event agenda",
          "Select catering options",
        ],
        Preparation: [
          "Order promotional materials",
          "Arrange AV equipment",
          "Design event website",
          "Send invitations",
        ],
        "In Progress": [
          "Decorate venue",
          "Prepare registration desk",
          "Brief volunteers",
          "Test microphones",
        ],
        Completed: [
          "Send thank-you emails",
          "Post-event feedback survey",
          "Upload event photos",
          "Publish event highlights",
        ],
      },
    },
  ];

  for (const tmpl of templates) {
    const exists = await boardModel.findOne({
      title: tmpl.title,
      isTemplate: true,
    });
    if (exists) {
      console.log(`Skipping existing template: ${tmpl.title}`);
      continue;
    }

    const board = await boardModel.create({
      title: tmpl.title,
      cover: tmpl.cover,
      description: tmpl.description,
      isTemplate: true,
    });
    let systemUser = await UserModel.findOne({ email: "system@taskflow.com" });

    if (!systemUser) {
      systemUser = await UserModel.create({
        firstName: "System",
        secondName: "User",
        username: "system",
        email: "system@taskflow.com",
        password: await bcryptjs.hash("super-secure-password", 10), 
      });
    }
    // Create labels for the board
    const labelData = [
      { title: "Urgent", color: "#e74c3c" },
      { title: "High Priority", color: "#f39c12" },
      { title: "Medium Priority", color: "#3498db" },
      { title: "Low Priority", color: "#2ecc71" },
    ];
    const labels = await CardLabelModel.insertMany(
      labelData.map((l) => ({ ...l, board: board._id }))
    );

    const listIds: mongoose.Types.ObjectId[] = [];

    for (const [listName, cardNames] of Object.entries(tmpl.lists)) {
      const list = await ListModel.create({
        name: listName,
        board: board._id,
      });
      listIds.push(list._id);

      for (let i = 0; i < cardNames.length; i++) {
        // Create checklist for the card
        const checklist = await CheckListModel.create({
          title: "Checklist",
          items: [
            { title: "Step 1", checked: false },
            { title: "Step 2", checked: false },
            { title: "Step 3", checked: false },
          ],
          createdBy: systemUser._id,
        });

        // Create attachment
        const attachment = await CardAttachmentModel.create({
          fileUrl: "https://via.placeholder.com/300",
          name: "Sample Attachment",
          type: "image/png",
        });

        const card = await CardModel.create({
          name: cardNames[i],
          description: `Details about: ${cardNames[i]}`,
          list: list._id,
          priority: i % 2 === 0 ? "high" : "medium",
          labels: [labels[i % labels.length]._id],
          checklist: [checklist._id],
          attachments: [attachment._id],
          position: i + 1,
        });

        list.cards.push(card._id);
      }

      await list.save();
    }

    board.lists = listIds;
    await board.save();
    console.log(`✅ Created template: ${tmpl.title}`);
  }

  process.exit(0);
}

seedTemplates().catch((err) => {
  console.error(err);
  process.exit(1);
});
