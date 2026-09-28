import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { useTema } from '../theme';

/** Área rolável padrão das telas, com fundo bg/default e margens do design system. */
export function Tela({ children }: { children: ReactNode }) {
  const { cores, espaco } = useTema();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: cores.bg.default }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: espaco[4], gap: espaco[6], paddingBottom: espaco[16] }}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
