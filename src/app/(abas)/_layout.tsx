import Tabs from 'expo-router/js-tabs';

import { textos } from '../../strings';
import { useTema } from '../../theme';
import { Icone } from '../../ui';

export default function AbasLayout() {
  const tema = useTema();
  const { cores } = tema;
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: cores.bg.default },
        headerTintColor: cores.text.primary,
        headerTitleStyle: tema.tipografia.headingH3,
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: cores.bg.surface, borderTopColor: cores.border.default },
        tabBarActiveTintColor: cores.text.brand,
        tabBarInactiveTintColor: cores.text.secondary,
        tabBarLabelStyle: tema.tipografia.labelS,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: textos.abas.grade,
          tabBarIcon: ({ color }) => <Icone nome="calendar" cor={color} />,
        }}
      />
      <Tabs.Screen
        name="cadastros"
        options={{
          title: textos.abas.cadastros,
          tabBarIcon: ({ color }) => <Icone nome="list" cor={color} />,
        }}
      />
    </Tabs>
  );
}
