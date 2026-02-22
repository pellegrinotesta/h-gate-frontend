import { BaseModel } from "./base-model";

export interface PageResponse<M extends BaseModel> {
  content: M[];
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
}
