const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const { signUp, confirmSignUp, resendConfirmationCode } = require('./AWSCognitoUtils');
require('dotenv').config();
const COGNITO_CLIENT_ID = process.env.COGNITO_CLINNT_ID;
app.get('/', (req, res) => {
    res.send({message: `Enterprise grade Authentication and Authorization`});
});

app.post('/sign-up-with-email', async (req, res) => {
    try {
        const {given_name, email_address, username, password} = req.body;
        await signUp(COGNITO_CLIENT_ID, username, password, email_address, given_name);
        res.status(201).json({message: 'User signed up successfully!'});
    } catch(err){
        console.log(err);
        if ( err.__type === 'InvalidParameterException' ) {
            res.status(403).json({message: err.message});
            return;
        }
        if ( err.__type === 'InvalidPasswordException' ) {
            res.status(403).json({message: err.message});
            return;
        }
        if ( err.__type === 'UsernameExistsException' ) {
            res.status(409).json({message: 'The username is already taken, please try with different username.'});
            return;
        }
        res.status(500).json({ message: 'There was error in creating your account, please try again.' });
    }
});

app.post('/confirm-sign-up', async (req, res) => {
    const { username, code } = req.body;
    try {
        await confirmSignUp(COGNITO_CLIENT_ID, username, code);
        res.status(200).json({message: 'Your account is confirmed, you can login using username and password'});
    } catch (err) {
        console.log(err);
        if( err.__type === 'CodeMismatchException') {
            res.status(403).json({message: err.message});
            return;
        }
        if( err.__type === 'AliasExistsException') {
            res.status(403).json({message: "An account with your email address already exists in the platform, either update new email address or login to your confirmed account."});
            return;
        }
        res.status(500).json({ message: 'There was an error in confirming your account, please try again.' });
    }
});

app.post('/resend-verification-code', async (req, res) => {
    const {username} = req.body;
    try {
        await resendConfirmationCode(COGNITO_CLIENT_ID, username);
        res.status(200).json({message: 'Verification code has been sent to your registered email address.'});
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: 'There was an error in resending the verification code' });
    }
});

module.exports = app;
