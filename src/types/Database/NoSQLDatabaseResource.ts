import { BaseResource } from "../BaseResource";
import { ResourceCategory } from "../ResourceCategory";
import { ResourceType } from "../ResourceType";

export interface NoSQLDatabaseResource extends BaseResource {
    ResourceCategory: ResourceCategory.Database;
    ResourceType: ResourceType.NoSQLDatabase;
    Configuration: {
      TableName: string;
      PrimaryKey: {
        Name: string;
        DataType: string;
      };
      SecondaryKey?: {
        Name: string;
        DataType: string;
      };
      CustomAttributes: {
        BillingConfiguration?: string;
        ThroughputConfig?: {
          Read: number;
          Write: number;
        };
        DataExpiryField?: string;
        EncryptionConfig?: {
          Type: string;
          Key?: string;
        };
      };
    };
  }