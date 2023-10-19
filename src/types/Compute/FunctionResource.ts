import { BaseResource } from "../BaseResource";
import { ResourceCategory } from "../ResourceCategory";
import { ResourceType } from "../ResourceType";

export interface FunctionResource extends BaseResource {
    ResourceCategory: ResourceCategory.Compute;
    ResourceType: ResourceType.Function;
    Configuration: {
      Name: string;
      Runtime: string;
      Handler: string;
      MemorySize: number;
      Timeout: number;
      AccessControl: {
        Permissions: Array<{
          Resource: string;
          ResourceType: string;
          Actions: string[];
        }>;
      };
      Environment: {
        Variables: Array<{
            Name: string;
            Value: string;
          }>;
      };
    };
  };