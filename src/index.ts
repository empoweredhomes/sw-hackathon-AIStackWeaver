import fs from 'fs-extra';
import { SchemaValidator } from './validators/SchemaValidator';
import { CloudFormationGenerator } from './resource-generators/CloudFormation';

async function main(filePath: string) {
  try {
    // Read the JSON file
    const jsonData = await fs.readJson(filePath);

    // Create a new instance of ResourceValidator
    const validator = new SchemaValidator();

    // Validate the JSON data
    const isValid = validator.isValid(jsonData);

    // Log the validation result
    if (isValid) {
      console.log('The JSON configuration is valid.');
      const couldFormation = new CloudFormationGenerator();
      const resouceGroups = Object.keys(jsonData);
      resouceGroups.forEach(resouceGroup => {
        couldFormation.generateResourceGroup(jsonData[resouceGroup]);
      });
    } else {
      console.log('The JSON configuration is invalid.');
    }
  } catch (error) {
    const err = error as Error;
    console.error(`An error occurred: ${err.message}`);
  }
}

// Get the file path from command-line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide the path to the JSON file as a command-line argument.');
  process.exit(1);
}

// Call the main function
main(filePath).catch(err => {
  console.error(`An unexpected error occurred: ${err.message}`);
});