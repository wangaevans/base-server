import chalk from 'chalk';

const logColors = {
  info: chalk.blue,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
};

const getCurrentTimestamp = () => new Date().toLocaleString();

const logMessage = (level, message) => {
  const colorFunction = logColors[level] || chalk.white;
  const timestamp = getCurrentTimestamp();
  const formattedMessage = colorFunction(`${timestamp} [${level.toUpperCase()}]: ${message}`);
  console.log(formattedMessage);
};

export const info = (message) => logMessage('info', message);
export const success = (message) => logMessage('success', message);
export const warning = (message) => logMessage('warning', message);
export const error = (message) => logMessage('error', message);
