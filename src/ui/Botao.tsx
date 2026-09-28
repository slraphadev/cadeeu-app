import { Pressable, View } from 'react-native';

import { useTema } from '../theme';
import { Icone, type NomeIcone } from './Icone';
import { Texto } from './Texto';

type Variante = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';

type Props = {
  rotulo: string;
  onPress: () => void;
  variante?: Variante;
  tamanho?: 'medium' | 'large';
  icone?: NomeIcone;
  desabilitado?: boolean;
  larguraTotal?: boolean;
};

/** Button do design system: Medium 40 ou Large 48 de altura, alvo de toque mínimo de 48. */
export function Botao({
  rotulo,
  onPress,
  variante = 'default',
  tamanho = 'large',
  icone,
  desabilitado,
  larguraTotal,
}: Props) {
  const { cores, espaco, raio, tamanho: tam, opacidade } = useTema();

  const estilos: Record<Variante, { fundo?: string; pressionado?: string; texto: string; borda?: string }> = {
    default: { fundo: cores.brand.default, pressionado: cores.brand.hover, texto: cores.text.onBrand },
    secondary: { fundo: cores.bg.surface2, pressionado: cores.bg.surface2, texto: cores.text.primary, borda: undefined },
    outline: { pressionado: cores.bg.surface2, texto: cores.text.primary, borda: cores.border.strong },
    ghost: { pressionado: cores.bg.surface2, texto: cores.text.primary },
    destructive: { fundo: cores.feedback.danger, pressionado: cores.feedback.dangerSoft, texto: cores.text.inverse },
  };
  const e = estilos[variante];
  const altura = tamanho === 'large' ? espaco[12] : espaco[10];
  const folga = (tam.touch - altura) / 2;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityState={{ disabled: desabilitado }}
      disabled={desabilitado}
      onPress={onPress}
      hitSlop={folga > 0 ? { top: folga, bottom: folga } : undefined}
      style={{ alignSelf: larguraTotal ? 'stretch' : 'flex-start', opacity: desabilitado ? opacidade.disabled : 1 }}>
      {({ pressed }) => {
        const pressionadoDestrutivo = pressed && variante === 'destructive';
        const corTexto = pressionadoDestrutivo ? cores.text.primary : e.texto;
        return (
          <View
            style={{
              height: altura,
              paddingHorizontal: tamanho === 'large' ? espaco[5] : espaco[4],
              gap: espaco[2],
              borderRadius: raio.lg,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: pressed ? e.pressionado : e.fundo,
              borderWidth: e.borda || pressionadoDestrutivo ? 1 : 0,
              borderColor: pressionadoDestrutivo ? cores.feedback.danger : e.borda,
            }}>
            {icone ? <Icone nome={icone} cor={corTexto} tamanho={espaco[5]} /> : null}
            <Texto estilo="labelM" cor={corTexto}>
              {rotulo}
            </Texto>
          </View>
        );
      }}
    </Pressable>
  );
}
