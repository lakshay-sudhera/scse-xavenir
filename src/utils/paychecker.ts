export const checkIsFromCse = (email: string) => {
  const isFromCse =
    /^[0-9]{4}(?:ugcs|pgcsca|rscs|rsca)[0-9]{3}@nitjsr\.ac\.in$|^[0-9]{4}(?:pgcscs|pgcsds|pgcsis)[0-9]{2}@nitjsr\.ac\.in$/i.test(
      email
    ); //lets see
  return isFromCse;
};
export const check3rdYear = (email: string) => {
  const year = 2023; // dynamically assigned year
  const pattern = new RegExp(
    `^${year}(?:ugcs)[0-9]{3}@nitjsr\\.ac\\.in$|^[0-9]{4}(?:pgcscs|pgcsds|pgcsis)[0-9]{2}@nitjsr\\.ac\\.in$`,
    "i"
  );
  const match = pattern.test(email);
  // console.log(match);
  return match;
};
export const checkIsFromNit = (email: string) => {
  return (
    typeof email === "string" && email.toLowerCase().endsWith("@nitjsr.ac.in")
  );
};
