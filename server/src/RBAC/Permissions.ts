export const PERMISSIONS = {
  WORKSPACE_VIEW: "workspace:view",
  WORKSPACE_EDIT: "workspace:edit",
  WORKSPACE_DELETE: "workspace:delete",
  WORKSPACE_MANAGE_MEMBERS: "workspace:manage_members",
  WORKSPACE_MANAGE_ADMINS: "workspace:manage_admins",
  WORKSPACE_CREATE_BOARD: "workspace:create_board",

  BOARD_VIEW: "board:view",
  BOARD_EDIT: "board:edit",
  BOARD_DELETE: "board:delete",
  BOARD_MANAGE_MEMBERS: "board:manage_members",
  BOARD_MANAGE_ADMINS: "board:manage_admins",
  BOARD_CREATE_LIST: "board:create_list",

  LIST_VIEW: "list:view",
  LIST_EDIT: "list:edit",
  LIST_DELETE: "list:delete",
  LIST_MANAGE_MEMBERS: "list:manage_members",
  LIST_CREATE_CARD: "list:create_card",

  CARD_VIEW: "card:view",
  CARD_EDIT: "card:edit",
  CARD_DELETE: "card:delete",
  CARD_MOVE: "card:move",
  CARD_COMMENT: "card:comment",
} as const;
