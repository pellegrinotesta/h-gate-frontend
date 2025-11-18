import { BaseModel } from "../../../models/base-model";

export interface BaseUser extends BaseModel {
    roles?: string[];
}