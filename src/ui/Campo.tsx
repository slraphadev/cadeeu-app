import { useState, type ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { useTema } from '../theme';
import { Icone } from './Icone';
import { Texto } from './Texto';

/** Rótulo + conteúdo + ajuda ou erro, compartilhado pelos campos do formulário. */
export function MolduraCampo({
  rotulo,
  ajuda,
  erro,
  children,
}: {
  rotulo: string;
  ajuda?: string;
  erro?: string;
  children: ReactNode;
}) {
  const { cores, espaco } = useTema();
  return (
    <View style={{ gap: espaco[2] }}>
      <Texto estilo="labelM">{rotulo}</Texto>
      {children}
      {erro ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: espaco[1] }}>
          <Icone nome="alert" cor={cores.feedback.danger} tamanho={espaco[4]} />
          <Texto estilo="caption" cor={cores.feedback.danger} accessibilityLiveRegion="polite">
            {erro}
          </Texto>
        </View>
      ) : ajuda ? (
        <Texto estilo="caption" cor={cores.text.secondary}>
          {ajuda}
        </Texto>
      ) : null}
    </View>
  );
}

/** Estilo da caixa do campo conforme o estado (Default, Focus, Error, Disabled). */
export function useCaixaCampo(foco: boolean, erro: boolean, desabilitado = false) {
  const { cores, espaco, raio, tamanho } = useTema();
  return {
    minHeight: tamanho.touch,
    paddingHorizontal: espaco[4],
    borderRadius: raio.lg,
    backgroundColor: desabilitado ? cores.bg.surface2 : cores.bg.surface,
    borderWidth: foco || erro ? 2 : 1,
    borderColor: erro ? cores.feedback.danger : foco ? cores.border.focus : cores.border.default,
  } as const;
}

type Props = Omit<TextInputProps, 'style'> & { rotulo: string; ajuda?: string; erro?: string };

/** Input do design system: altura 48, raio radius/lg. */
export function Campo({ rotulo, ajuda, erro, onFocus, onBlur, multiline, ...resto }: Props) {
  const tema = useTema();
  const [foco, setFoco] = useState(false);
  const caixa = useCaixaCampo(foco, !!erro);
  return (
    <MolduraCampo rotulo={rotulo} ajuda={ajuda} erro={erro}>
      <TextInput
        {...resto}
        multiline={multiline}
        accessibilityLabel={rotulo}
        placeholderTextColor={tema.cores.text.secondary}
        selectionColor={tema.cores.border.focus}
        onFocus={(e) => {
          setFoco(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFoco(false);
          onBlur?.(e);
        }}
        style={[
          caixa,
          tema.tipografia.bodyL,
          { color: tema.cores.text.primary },
          multiline ? { paddingVertical: tema.espaco[3], textAlignVertical: 'top', minHeight: tema.espaco[16] + tema.espaco[8] } : null,
        ]}
      />
    </MolduraCampo>
  );
}
