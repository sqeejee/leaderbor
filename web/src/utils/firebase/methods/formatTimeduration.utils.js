export const formatTimeDuration = (seconds) => {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime =
    (days > 0 ? days + "d " : "") +
    (hours > 0 ? hours + "h " : "") +
    (minutes > 0 ? minutes + "m " : "") +
    (remainingSeconds > 0 ? remainingSeconds + "s" : "");

  return formattedTime.trim();
};
