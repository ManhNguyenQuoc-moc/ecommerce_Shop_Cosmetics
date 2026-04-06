export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')                   // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '')   // remove all previously split accents
    .replace(/đ/g, 'd')                // replace vietnamese character d
    .replace(/Đ/g, 'd')                // replace vietnamese character D
    .trim()                            // remove spaces from start and end
    .replace(/\s+/g, '-')              // replace spaces with -
    .replace(/[^\w\-]+/g, '')          // remove all non-word chars
    .replace(/\-\-+/g, '-');           // replace multiple - with single -
}
