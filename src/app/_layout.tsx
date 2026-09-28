import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import Stack from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BancoProvider } from '../db/BancoProvider';
import { textos } from '../strings';
import { useTema } from '../theme';
import { Texto } from '../ui';

SplashScreen.preventAutoHideAsync();

function Aviso({ mensagem, detalhe }: { mensagem: string; detalhe?: string }) {
  const { cores, espaco } = useTema();
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: espaco[6], gap: espaco[2], backgroundColor: cores.bg.default }}>
      <Texto estilo="headingH3">{mensagem}</Texto>
      {detalhe ? (
        <Texto estilo="bodyS" cor={cores.text.secondary}>
          {detalhe}
        </Texto>
      ) : null}
    </View>
  );
}

function Navegacao() {
  const tema = useTema();
  const { cores } = tema;
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const base = tema.modo === 'dark' ? DarkTheme : DefaultTheme;
  const temaNavegacao = {
    ...base,
    colors: {
      ...base.colors,
      primary: cores.text.brand,
      background: cores.bg.default,
      card: cores.bg.default,
      text: cores.text.primary,
      border: cores.border.default,
    },
  };

  return (
    <ThemeProvider value={temaNavegacao}>
      <StatusBar style={tema.modo === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.bg.default },
          headerTintColor: cores.text.primary,
          headerTitleStyle: tema.tipografia.headingH3,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: cores.bg.default },
        }}>
        <Stack.Screen name="(abas)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <BancoProvider
        carregando={<Aviso mensagem={textos.app.carregando} />}
        erro={(detalhe) => <Aviso mensagem={textos.app.erroBanco} detalhe={detalhe} />}>
        <Navegacao />
      </BancoProvider>
    </SafeAreaProvider>
  );
}
