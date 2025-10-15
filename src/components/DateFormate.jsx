const formatDate = (date) => {
  if (!date) return null;
  const newDate = new Date(date);
  if (isNaN(newDate)) {
    console.error('Invalid date format');
    return null;
  }
  const day = newDate.getDate().toString().padStart(2, '0');
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const year = newDate.getFullYear().toString();

  return `${day}-${month}-${year}`;
};
const formatDateTime = (date) => {
  if (!date) return null;
  const newDate = new Date(date);
  if (isNaN(newDate)) {
    console.error('Invalid date format');
    return null;
  }

  const day = newDate.getDate().toString().padStart(2, '0');
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const year = newDate.getFullYear().toString();
  const hours = newDate.getHours().toString().padStart(2, '0');
  const minutes = newDate.getMinutes().toString().padStart(2, '0');

  // Return date and time separated by comma
  return `${day}-${month}-${year}, ${hours}:${minutes}`;
};

const formatDateTimeSplit = (date) => {
  if (!date) return null;
  const newDate = new Date(date);
  if (isNaN(newDate)) {
    console.error('Invalid date format');
    return null;
  }

  const day = newDate.getDate().toString().padStart(2, '0');
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const year = newDate.getFullYear().toString();

  const hours = newDate.getHours().toString().padStart(2, '0');
  const minutes = newDate.getMinutes().toString().padStart(2, '0');

  // return with line break
  return `${day}-${month}-${year}\n${hours}:${minutes}`;
};

export { formatDate, formatDateTime, formatDateTimeSplit };
