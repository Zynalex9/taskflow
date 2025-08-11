export interface IWorkspace {
  _id: string;
  name: string;
  admin: string[];
  boards: IBoard[];
  members: { role: string; _id: string; user: IUser }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  cover?: string;
}
export interface IComment {
  _id: string;
  comment: string;
  author: IUser;
  createdAt: string;
  updatedAt: string;
}
export interface IChecklistItems {
  _id: string;
  title: string;
  completed: boolean;
  createdBy: string;
  assignedTo: string[];
}
export interface IChecklist {
  _id: string;
  title: string;
  card: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  items: IChecklistItems[];
}
export interface ILabel {
  card: string;
  color: string;
  createdAt: string;
  name: string;
  updatedAt: string;
  _id: string;
}

export interface IAttachment {
  cardId: string;
  createdAt: string;
  fileUrl: string;
  filename: string;
  updatedAt: string;
  uploadedBy: string;
  _id: string;
}
export interface IUser {
  firstName: string;
  secondName: string;
  _id: string;
  username: string;
  email: string;
  workspace: string[];
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface MemberData extends IUser {
  role: string;
}
export interface ICard {
  _id: string;
  name: string;
  description: string;
  endDate: string;
  startDate: string;
  createdBy: string;
  members: IUser[];
  list: IList | string;
  comments: IComment[];
  labels: ILabel[];
  cover: string;
  priority: string;
  checklist: IChecklist[];
  checked: boolean;
  attachments: IAttachment[];
  position: number;
  __v: number;
}

export interface IList {
  _id: string;
  name: string;
  color: string;
  cards: ICard[];
  createdBy: string;
  position: number;
  board: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  __v: number;
}

export interface IBoard {
  _id: string;
  title: string;
  lists: IList[];
  description: string;
  favourite: boolean;
  background: string;
  visibility: string;
  createdBy: string;
  workspace: string;
  cover: string;
  members: IMember[];
  createdAt: string;
  updatedAt: string;
  membersData: MemberData[];
  __v: number;
}

export interface IMember extends IUser {
  user: string;
  role: string;
  _id: string;
}

export interface IWorkspaceResponse {
  statusCode: number;
  data: {
    ownedWorkspaces: IWorkspace[];
    joinedWorkspaces: IWorkspace[];
  };
  message: string;
  success: boolean;
}
export interface ISingleWorkspaceResponse {
  statusCode: number;
  data: IWorkspace
  message: string;
  success: boolean;
}
export interface IBoardResponse {
  statusCode: number;
  data: {
    yourBoards: IBoard[];
    otherBoards: IBoard[];
  };
  message: string;
  success: boolean;
}
export interface ISingleBoardResponse {
  statusCode: number;
  data: IBoard;
  message: string;
  success: boolean;
}
export interface IListResponse {
  message: string;
  success: boolean;
  newList: IList;
}
export interface ICardResponse {
  message: string;
  success: boolean;
  newCard: ICard;
}
export interface ISingleCardResponse {
  statusCode: number;
  status: boolean;
  data: ICard;
}
export interface ICommentResponse {
  success: boolean;
  newComment: IComment;
  message: string;
}
export interface IChecklistResponse {
  success: boolean;
  newChecklist: IChecklist;
  message: string;
}
export interface IChecklistItemResponse {
  success: boolean;
  checkList: IChecklist;
  message: string;
}
export interface IAddDateResponse {
  success: boolean;
  card: ICard;
  message: string;
}
export interface ILabelsResponse {
  success: boolean;
  labels: ILabel[];
  message: string;
}
export interface QueryDBResponse {
  statusCode: 200;
  data: {
    workspaces: IWorkspace[];
    boards: IBoard[];
    lists: IList[];
    cards: ICard[];
  };
  success: boolean;
  message: string;
}
