import { BaseResource } from "../types/BaseResource";

export interface ResourceGenerator {
    generateResource(resource: BaseResource): void;
}