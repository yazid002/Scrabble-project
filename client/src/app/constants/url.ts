const URL: { aws: string; dev: string } = {
    aws: 'ec2-99-79-57-8.ca-central-1.compute.amazonaws.com',
    dev: 'http://localhost',
};
const PORT = 3000;

export const SERVER_URL = URL.aws + ':' + PORT;

export const RESPONSE_DELAY = 1000;
