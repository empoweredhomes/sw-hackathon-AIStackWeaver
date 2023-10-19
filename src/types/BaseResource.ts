import { ResourceCategory } from "./ResourceCategory";
import { ResourceType } from "./ResourceType";

export interface BaseResource {
    ResourceCategory: ResourceCategory;
    ResourceType: ResourceType;
}