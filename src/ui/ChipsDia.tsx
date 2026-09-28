import { Pressable, View } from 'react-native';

import { DIAS } from '../domain/dias';
import { useTema } from '../theme';
import { MolduraCampo } from './Campo';
import { Texto } from './Texto';

type Props = { rotulo: string; valor: number | undefined; onChange: (dia: number) => void; erro?: string };

/** Chip de dia da semana: visível com 40 de altura, alvo de toque de 48. Escolha única na v0.1. */
export function ChipsDia({ rotulo, valor, onChange, erro }: Props) {
  const { cores, espaco, raio, tamanho } = useTema();
  return (
    <MolduraCampo rotulo={rotulo} erro={erro}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} accessibilityRole="radiogroup">
        {DIAS.map((d) => {
          const ativo = d.dia === valor;
          return (
            <Pressable
              key={d.dia}
              accessibilityRole="radio"
              accessibilityLabel={d.longo}
              accessibilityState={{ selected: ativo }}
              onPress={() => onChange(d.dia)}
              style={{ minWidth: tamanho.touch, height: tamanho.touch, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  height: espaco[10],
                  minWidth: espaco[10],
                  paddingHorizontal: espaco[2],
                  borderRadius: raio.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: ativo ? cores.brand.default : cores.bg.surface,
                  borderWidth: ativo ? 0 : 1,
                  borderColor: cores.border.default,
                }}>
                <Texto estilo="labelM" cor={ativo ? cores.text.onBrand : cores.text.primary}>
                  {d.curto}
                </Texto>
              </View>
            </Pressable>
          );
        })}
      </View>
    </MolduraCampo>
  );
}
