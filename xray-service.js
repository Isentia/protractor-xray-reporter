const popsicle = require('popsicle');
const auth = require('popsicle-basic-auth');

const XrayService = (options) => {
    this.createExecution = (body, callback) => {
        popsicle.request({
            method: 'POST',
            url: options.xrayUrl,
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .use(auth(options.jiraUser, options.jiraPassword))
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error(res.body);
                } else {
                    console.log('Pushed test execution to X-Ray');
                    callback();
                }
            })
            .catch((error) => {
                throw new Error(error);
            });
    };

    return this;
};

const XrayCloudService = (options) => {
   
    this.getAuthentication = () =>{
        const body = {
            'client_id': options.jiraClientID,
            'client_secret': options.jiraClientSecret
        }
        return popsicle.request({
            method: 'POST',
            url: options.xrayCloudAuthenticateUrl,
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error(res.body);
                } else {
                    console.log('Register jira client id and secret to X-Ray cloud');
                    return res.body.replace(/"/g, "")
                }
            })
            .catch((error) => {
                throw new Error(error);
            });
    };

    this.createExecution = (body, callback, xrayToken) => {
        return popsicle.request({
            method: 'POST',
            url: options.xrayCloudUrl,
            body,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + xrayToken
            }
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error(res.body);
                } else {
                    console.log('Pushed test execution to X-Ray cloud');
                    callback();
                }
            })
            .catch((error) => {
                throw new Error(error);
            });
    };

    return this;
};

module.exports = {
    XrayService: XrayService,
    XrayCloudService: XrayCloudService
}

