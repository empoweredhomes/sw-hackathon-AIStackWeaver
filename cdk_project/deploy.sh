export AWS_REGION='us-east-1'
rm -rf node_modules
npm install
zip -r -qq deploy.zip src/*

if [ "$1" = "--deploy" ] || [ "$1" = "-d" ]; then
  npx cdk deploy
else
  npx cdk synth
fi
rm deploy.zip