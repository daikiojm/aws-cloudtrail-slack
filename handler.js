'use strict';
const zlib = require('zlib');
const async = require('async');
const request = require('request');

// set slack setting
const slack_endpoint = 'https://slack.com/api/chat.postMessage';
const slack_token = process.env.SLACK_TOKEN;
const slack_channel = process.env.SLACK_CHANNEL;
const slack_user = process.env.SLACK_USERNAME;

module.exports.notify = (event, context, callback) => {
    const payload = new Buffer(event.awslogs.data, 'base64');
    zlib.gunzip(payload, (err, res) => {
        if (err) {
            return callback(err);
        }
        const parsed = JSON.parse(res.toString('utf8'));
        console.log('Decoded payload:', JSON.stringify(parsed));

        async.map(parsed.logEvents, (data, callback) => {
          notifySlack(data, callback);
        }, (err, results) =>{
          if (!err) {
            console.log(results);
            callback(null, 'success');
          }
        });
    });
}

let notifySlack = (data, callback) => {
  let log = JSON.parse(data.message);

  let attachment = {
    "fallback": log.eventName + " by " + log.userIdentity.userName,
    "color": "#36a64f",
    "author_name": log.userIdentity.userName,
    "title": log.eventName,
    "fields": [
      {
        "title": "awsRegion",
        "value": log.awsRegion,
        "short": false
      },
      {
        "title": "eventSource",
        "value": log.eventSource,
        "short": false
      },
      {
        "title": "eventId",
        "value": log.eventID,
        "short": false
      }
    ],
    "thumb_url": "https://d0.awsstatic.com/security-center/KMS_Benefit_100x100_Compliance.png",
    "ts": new Date(log.eventTime).getTime() / 1000
  }

  let payload = {
    form: {
      token: slack_token,
      channel: slack_channel,
      username: slack_user,
      attachments: JSON.stringify([attachment])
    }
  }
  // post slack message
  request.post(slack_endpoint, payload, (error, response, body) => {
        if (error) {
          console.log(error)
        } else {
          callback(null, 'slack api call success');
        }
      }
  )
}
