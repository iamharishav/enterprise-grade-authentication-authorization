const {
    SignUpCommand,
    ConfirmSignUpCommand,
    ResendConfirmationCodeCommand,
    CognitoIdentityProviderClient,
} = require("@aws-sdk/client-cognito-identity-provider");
  
const signUp = async (clientId, username, password, email, fullName) => {
    const AWSCognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
    const params = new SignUpCommand({
        ClientId: clientId,
        Username: username,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }, { Name: "given_name", Value: fullName}],
    });
    return AWSCognito.send(params);
};

const confirmSignUp = async (clientId, username, code) => {
    const AWSCognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
    const params = new ConfirmSignUpCommand({
        ClientId: clientId,
        Username: username,
        ConfirmationCode: code,
    });
    return AWSCognito.send(params);
};

const resendConfirmationCode = async (clientId, username) => {
    const AWSCognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
    const params = new ResendConfirmationCodeCommand({
      ClientId: clientId,
      Username: username
    });
    return AWSCognito.send(params);
};

module.exports = { signUp, confirmSignUp, resendConfirmationCode };