import { ResourceGenerator } from "../interfaces/ResourceGenerator";
import { FunctionResource } from "../types/Compute/FunctionResource";
import { ResourceType } from "../types/ResourceType";

export class ComputeGenerator implements ResourceGenerator{
    public generateResource(resource: FunctionResource): void {
        if (resource.ResourceType !== ResourceType.Function) return;
    }
}