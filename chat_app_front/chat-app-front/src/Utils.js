// Utility functions to common uses

export default function capitalizeFirstLetter(string) {
  if (string.length === 0) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}