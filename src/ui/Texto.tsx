import { Text, type TextProps } from 'react-native';

import { useTema, type EstiloTexto } from '../theme';

type Props = TextProps & {
  estilo?: EstiloTexto;
  /** Cor já resolvida do tema. Padrão: text/primary. */
  cor?: string;
};

export function Texto({ estilo = 'bodyM', cor, style, ...resto }: Props) {
  const tema = useTema();
  return <Text {...resto} style={[tema.tipografia[estilo], { color: cor ?? tema.cores.text.primary }, style]} />;
}
