export default function useUtil () {
  const vhPage = (offset, height) => ({
    height: height - offset + "px",
  });
  return {
    vhPage
  }
}
