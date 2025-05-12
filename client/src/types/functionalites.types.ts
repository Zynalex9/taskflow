export interface ICard {
  _id: string;
  name: string;
  description: string;
  endDate: string; 
  createdBy: string;
  members: any[];  
  list: string;
  comments: any[]; 
  labels: string[];
  cover: string;
  priority: string;
  checklist: any[];  
  checked: boolean;
  attachments: any[];  
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
  isArchived: boolean;
  __v: number;
}

export interface IBoard {
  _id: string;
  title: string;
  lists: IList[];  
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

export interface IMember {
  user: string;
  role: string;
  _id: string;
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
