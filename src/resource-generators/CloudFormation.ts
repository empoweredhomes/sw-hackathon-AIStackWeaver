import { ResourceGenerator } from "../interfaces/ResourceGenerator";
import { BaseResource } from "../types/BaseResource";
import { ResourceCategory } from "../types/ResourceCategory";
import { APIManagementGenerator } from "./APIManagement";
import { ComputeGenerator } from "./Compute";
import { DatabaseGenerator } from "./Database";

export class CloudFormationGenerator implements ResourceGenerator {
    private resouceGenerators: { [key: string]:  ResourceGenerator } = {
        [ResourceCategory.APIManagement]: new APIManagementGenerator(),
        [ResourceCategory.Compute]: new ComputeGenerator(),
        [ResourceCategory.Database]: new DatabaseGenerator()
    };

    public generateResource(resource: BaseResource): void {
        const generator = this.resouceGenerators[resource.ResourceCategory];
        if (!generator) return;
        generator.generateResource(resource);
    }
}