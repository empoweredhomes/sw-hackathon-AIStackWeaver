import { BaseResource } from "../BaseResource";
import { FunctionResource } from "../Compute/FunctionResource";
import { ResourceCategory } from "../ResourceCategory";
import { ResourceType } from "../ResourceType";

export interface ApiGatewayResource extends BaseResource {
    ResourceCategory: ResourceCategory.APIManagement;
    ResourceType: ResourceType.ApiGateway;
    Configuration: {
      ApiName: string;
      Routes: Array<{
        AllowedChildren: ["Function"];
        Path: string;
        Method: string;
        Resource: FunctionResource;
      }>;
      AccessControl: {
        Authentication: {
          Type: string;
        };
        RateLimit?: {
          PerSecond: number;
          PerDay: number;
        };
      };
      CustomAttributes: {
        Logging?: {
          Enabled: boolean;
          Format: string;
        };
      };
    };
  }