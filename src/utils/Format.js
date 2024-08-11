const formatDataTime = (isoDateString) => {
    const originalDate = new Date(isoDateString);
    const localDateString = originalDate.toLocaleString();
    return localDateString;
}

const formatDate = (dateString) => {
    // Create a new Date object from the dateString
    const date = new Date(dateString);

    // Extract the parts of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Format the date as desired
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

const capitalizeFirstLetter = (string) => {
    // all wword
    return string.replace(/\b\w/g, l => l.toUpperCase());
}

export {
    formatDataTime,
    formatDate,
    capitalizeFirstLetter
}