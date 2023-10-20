
          import { HeatSource } from './HeatSource';
import { ThermoNuclearAPIApi } from './ThermoNuclearAPI';

          import { ConstructProps } from './ConstructProps';
          import * as cdk from '@aws-cdk/core';

          export class ThermoCloudStackStack extends cdk.Stack {
            private constructProps: ConstructProps = {
                resouceIds: {}
            };
            constructor(scope: cdk.App, id: string) {
              super(scope, id);
              let resource: any;
                
                    resource = new HeatSource(this, 'HeatSource', this.constructProps);
                    this.constructProps.resouceIds['NoSQLDatabase::HeatSource'] = resource.resourceArn;
                
                    resource = new ThermoNuclearAPIApi(this, 'ThermoNuclearAPIApi', this.constructProps);
                    this.constructProps.resouceIds['ApiGateway::ThermoNuclearAPI'] = resource.resourceArn;
                
            }
          }
        