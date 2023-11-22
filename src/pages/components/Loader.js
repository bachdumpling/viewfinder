import { useEffect } from "react";

export default function Loader() {
  useEffect(() => {
    async function getLoader() {
      const { newtonsCradle } = await import("ldrs");
      newtonsCradle.register();
    }
    getLoader();
  }, []);

  return (
    <l-newtons-cradle size="60" speed="1.4" color="white"></l-newtons-cradle>
  );
}
