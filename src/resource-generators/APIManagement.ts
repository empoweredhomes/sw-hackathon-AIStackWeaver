import { ResourceGenerator } from "../interfaces/ResourceGenerator";
import { ApiGatewayResource } from "../types/APIManagement/ApiGatewayResource";
import { ResourceType } from "../types/ResourceType";

export class APIManagementGenerator implements ResourceGenerator{
    public generateResource(resource: ApiGatewayResource): void {
        if (resource.ResourceType !== ResourceType.ApiGateway) return;
    }
}