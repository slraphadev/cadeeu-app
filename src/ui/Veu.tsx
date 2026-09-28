import { StyleSheet, View } from 'react-native';

import { useTema } from '../theme';

/**
 * Véu atrás de folhas e modais. O design system ainda não tem token de scrim:
 * usa o preto da marca (text/on-brand, igual nos dois modos) com opacity/faded.
 */
export function Veu() {
  const { cores, opacidade } = useTema();
  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: cores.text.onBrand, opacity: opacidade.faded }]}
    />
  );
}
