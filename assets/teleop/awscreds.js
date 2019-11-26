function getAWSCredentials() {
    var awsConfiguration = {
        host: "<Update IoT Endpoint Here>", // AWS MQTT Endpoint 
        region: "<Update Region Here>", // AWS Region, ie. us-east-1
        accessKeyId: "<Update Access Key ID Here>", // AWS IAM User's Access Key
        secretAccessKey: "<Update Secret Access Key Here>", // AWS IAM User's Secret Key
        sessionToken: null
     };

     return awsConfiguration;
}
