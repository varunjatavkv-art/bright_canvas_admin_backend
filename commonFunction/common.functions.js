export function formatDate(isoString) {
    // 1. Create a Date object from the ISO string.
    // The 'Z' at the end indicates UTC time.
    const date = new Date(isoString);
  
    // 2. Define month abbreviations
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  
    // 3. Extract components (using UTC methods to keep the date consistent with the 'Z' input)
    const day = date.getUTCDate();
    const monthIndex = date.getUTCMonth();
    const year = date.getUTCFullYear();
  
    // 4. Format the day: prepend '0' if less than 10
    const formattedDay = day < 10 ? `0${day}` : day;
  
    // 5. Assemble the final string
    return `${formattedDay} ${monthNames[monthIndex]} ${year}`;
  }