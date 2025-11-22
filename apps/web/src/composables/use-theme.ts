import { useColorMode } from '@vueuse/core';

export const useTheme = () => {
  const mode = useColorMode({
    emitAuto: true,
    storageKey: 'vueuse-color-scheme',
  });

  return {
    mode,
  };
};
