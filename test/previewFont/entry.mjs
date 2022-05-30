import run from './index.mjs';

const testCssUrl = 'D:/zbooks/learn-node/test/previewFont/bootstrap/bootstrap.css';
const inputCssUrl = process.argv[3];

run(inputCssUrl || testCssUrl);
