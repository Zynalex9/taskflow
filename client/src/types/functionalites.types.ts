export interface IMember {
  user: string;
  role: string;
  _id: string;
}

export interface IBoard {
  _id: string;
  title: string;
  lists: any[];
  favourite: boolean;
  background: string;
  visibility: string;
  createdBy: string;
  workspace: string;
  cover: string;
  members: IMember[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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
