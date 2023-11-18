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

  const toDigits = (code, digits) => {
    if (digits < 2) digits = 2
    return code.toString().padStart(digits, "0")
  }

  return {
    vhPage, buildForm, toDigits
  }
}
