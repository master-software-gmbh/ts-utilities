declare global {
  interface Date {
    toISODateString(): string;
  }
}

Date.prototype.toISODateString = function () {
  const YYYY = this.getFullYear();
  const MM = (this.getMonth() + 1).toString().padStart(2, '0');
  const DD = this.getDate().toString().padStart(2, '0');

  return `${YYYY}-${MM}-${DD}`;
};
