import axios from 'axios';

export const handler = async (event) => {
  try {
    const path = event.rawPath || event.path; 
    if (path === '/notify')  
    return await sendNotification(event)
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};


const sendNotification = async (event)=> {
  const { memberId, projectName } = event.queryStringParameters;

  
  if (!memberId || !projectName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing memberId or projectName' }),
    };
  }

  const memberList = memberId.split(',').map(id => `<@${id.trim()}>`).join(', ');

  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  const message = {
    text: `Project Deployment Alert:\n Members: ${memberList}\n Project Name: *${projectName}*`,
  };

  await axios.post(slackWebhookUrl, message);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Notification sent successfully' }),
  };
}