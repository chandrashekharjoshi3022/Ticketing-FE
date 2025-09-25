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

export { formatDate };
