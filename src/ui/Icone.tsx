import type { ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

/** Traçados 24×24 do conjunto de ícones do design system (traço de 2px). */
const ICONES = {
  'chevron-right': <Path d="M9 5 L16 12 L9 19" />,
  'chevron-down': <Path d="M5 9 L12 16 L19 9" />,
  plus: <Path d="M12 5 L12 19 M5 12 L19 12" />,
  check: <Path d="M5 12.5 L10 17 L19 7" />,
  clock: (
    <>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 7 L12 12 L15.5 14" />
    </>
  ),
  'map-pin': (
    <>
      <Path d="M12 21.5 C12 21.5 5 14.5 5 9.5 C5 5.6 8.1 2.5 12 2.5 C15.9 2.5 19 5.6 19 9.5 C19 14.5 12 21.5 12 21.5 Z" />
      <Circle cx={12} cy={9.5} r={2.5} />
    </>
  ),
  door: (
    <>
      <Path d="M5 21 L19 21 M7 21 L7 3 L17 3 L17 21" />
      <Circle cx={14.25} cy={12.25} r={0.75} />
    </>
  ),
  calendar: (
    <>
      <Rect x={3.5} y={5} width={17} height={15.5} rx={4} />
      <Path d="M3.5 10 L20.5 10 M8 3 L8 7 M16 3 L16 7" />
    </>
  ),
  list: <Path d="M9 6 L20 6 M9 12 L20 12 M9 18 L20 18 M4 6 L5 6 M4 12 L5 12 M4 18 L5 18" />,
  pencil: <Path d="M4 20 L4 16 L15 5 L19 9 L8 20 Z M13 7 L17 11" />,
  x: <Path d="M6 6 L18 18 M18 6 L6 18" />,
  alert: <Path d="M12 3.5 L21.5 20 L2.5 20 Z M12 10 L12 14 M12 17 L12 17.2" />,
} as const;

export type NomeIcone = keyof typeof ICONES;

export function Icone({ nome, cor, tamanho = 24 }: { nome: NomeIcone; cor: ColorValue; tamanho?: number }) {
  return (
    <Svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke={cor}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessible={false}>
      {ICONES[nome]}
    </Svg>
  );
}
