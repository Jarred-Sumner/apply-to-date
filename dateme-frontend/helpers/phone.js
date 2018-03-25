import { parse, format, isValidNumber } from "libphonenumber-js";

export const phoneLabel = rawPhone => {
  if (rawPhone) {
    const phone = parse(rawPhone, {
      defaultCountry: "US"
    });

    if (isValidNumber(phone)) {
      return format(phone, "National");
    } else {
      return rawPhone;
    }
  } else {
    return rawPhone;
  }
};
