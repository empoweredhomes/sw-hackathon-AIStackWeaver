import { App } from '@aws-cdk/core';
import { ThermoCloudStackStack } from '../ThermoCloudStackStack';


const app = new App();

new ThermoCloudStackStack(app, 'ThermoCloudStack');