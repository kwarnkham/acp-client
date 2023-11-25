export default function useUtil () {
  const vhPage = (offset, height) => {
    return {
      height: height - offset + "px",
    }
  };

  const buildForm = (data) => {
    const keys = Object.keys(data);
    const formData = new FormData();
    keys.forEach((key) => {
      if (data[key] != undefined && !Array.isArray(data[key]))
        formData.append(key, data[key]);
      else if (Array.isArray(data[key])) {
        data[key].forEach((e, index) => {
          formData.append(`${key}[${index}]`, e);
        });
      }
    });
    return formData;
  }

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so adding 1
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  const getFirstDayOfMonth = () => {
    // Get current date
    const currentDate = new Date();

    // Get the start date of the current month
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0'); // Adding 1 as months are zero-indexed
    const day = '01'; // 1st day of the month
    const formattedStartDate = `${year}-${month}-${day}`;
    return formattedStartDate;
  }

  const getLastDayOfMonth = () => {
    // Get current date
    const currentDate = new Date();

    // Get the start date of the next month
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    // Subtract 1 day from the start of the next month to get the last day of the current month
    const lastDayOfCurrentMonth = new Date(nextMonth - 1);
    const year = lastDayOfCurrentMonth.getFullYear();
    const month = String(lastDayOfCurrentMonth.getMonth() + 1).padStart(2, '0'); // Adding 1 as months are zero-indexed
    const day = String(lastDayOfCurrentMonth.getDate()).padStart(2, '0');
    const formattedLastDate = `${year}-${month}-${day}`;
    return formattedLastDate;
  }

  const toDigits = (code, digits) => {
    if (digits < 2) digits = 2
    return code.toString().padStart(digits, "0")
  }

  return {
    vhPage, buildForm, toDigits, getTodayDate, getFirstDayOfMonth, getLastDayOfMonth
  }
}
