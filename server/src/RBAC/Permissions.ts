export const PERMISSIONS = {
  /* Workspace */
  WORKSPACE_VIEW: "workspace:view",
  WORKSPACE_EDIT: "workspace:edit",
  WORKSPACE_DELETE: "workspace:delete",
  WORKSPACE_MANAGE_MEMBERS: "workspace:manage_members",
  WORKSPACE_MANAGE_ADMINS: "workspace:manage_admins",
  WORKSPACE_CREATE: "workspace:create",
  WORKSPACE_CREATE_BOARD: "workspace:create_board",

  /* Board */
  BOARD_VIEW: "board:view",
  BOARD_EDIT: "board:edit",
  BOARD_DELETE: "board:delete",
  BOARD_MANAGE_MEMBERS: "board:manage_members",
  BOARD_MANAGE_ADMINS_ADD: "board:manage_admins_add",
  BOARD_MANAGE_ADMINS_REMOVE: "board:manage_admins_remove",
  BOARD_CREATE_LIST: "board:create_list",
  BOARD_COPY: "board:copy",
  BOARD_DESCRIPTION: "board:description",
  BOARD_UPDATE_COVER: "board:update_cover",
  BOARD_UPDATE_VISIBILITY: "board:update_visibility",
  BOARD_DETAILS: "board:details",
  BOARD_FAVOURITE: "board:favourite",
  BOARD_INVITE:"board:invite",

  /* List */
  LIST_VIEW: "list:view",
  LIST_EDIT: "list:edit",
  LIST_DELETE: "list:delete",
  LIST_MANAGE_MEMBERS: "list:manage_members",
  LIST_CREATE_CARD: "list:create_card",
  LIST_COPY: "list:copy",
  LIST_MOVE: "list:move",

  /* Card */
  CARD_VIEW: "card:view",
  CARD_EDIT: "card:edit",
  CARD_DELETE: "card:delete",
  CARD_MOVE: "card:move",
  CARD_COMMENT: "card:comment",
  CARD_ATTACHMENT: "card:attachment",
  CARD_CHECKLIST: "card:checklist",
  CARD_DATE: "card:date",
  CARD_LABEL: "card:label",
  CARD_COPY: "card:copy",
  CARD_JOIN:"card:join",
  CARD_TOGGLE:"card:toggle",
  CARD_COVER:"card:cover"
} as const;
