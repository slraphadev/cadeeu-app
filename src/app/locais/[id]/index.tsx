import { router, useLocalSearchParams } from 'expo-router';
import Stack from 'expo-router/stack';
import { View } from 'react-native';

import { useConsulta } from '../../../db/BancoProvider';
import { textos } from '../../../strings';
import { useTema } from '../../../theme';
import { Botao, ItemLista, Tela, Texto, TituloSecao } from '../../../ui';

/** Detalhe do local com as salas dele. */
export default function DetalheLocal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cores, espaco, raio } = useTema();
  const local = useConsulta((r) => r.locais.obter(id));
  const salas = useConsulta((r) => r.salas.listarPorLocal(id));

  if (!local) return <Stack.Screen options={{ title: '' }} />;

  return (
    <>
      <Stack.Screen options={{ title: local.nome }} />
      <Tela>
        {local.apelido || local.observacao ? (
          <View style={{ gap: espaco[1] }}>
            {local.apelido ? <Texto estilo="headingH4">{local.apelido}</Texto> : null}
            {local.observacao ? (
              <Texto estilo="bodyM" cor={cores.text.secondary}>
                {local.observacao}
              </Texto>
            ) : null}
          </View>
        ) : null}

        <View style={{ gap: espaco[3] }}>
          <TituloSecao>{textos.salas.titulo}</TituloSecao>
          {salas.length === 0 ? (
            <Texto estilo="bodyM" cor={cores.text.secondary}>
              {textos.salas.vazio}
            </Texto>
          ) : (
            <View style={{ borderRadius: raio.xl, overflow: 'hidden' }}>
              {salas.map((s) => (
                <ItemLista
                  key={s.id}
                  icone="door"
                  titulo={s.nome}
                  subtitulo={[s.bloco, s.andar, s.observacao].filter(Boolean).join(' · ')}
                  contagem={textos.salas.compromissos(s.totalCompromissos)}
                  onPress={() => router.push({ pathname: '/salas/[id]', params: { id: s.id } })}
                />
              ))}
            </View>
          )}
          <Botao
            rotulo={textos.salas.nova}
            icone="plus"
            variante="secondary"
            larguraTotal
            onPress={() => router.push({ pathname: '/locais/[id]/nova-sala', params: { id } })}
          />
        </View>

        <Botao
          rotulo={textos.locais.editar}
          icone="pencil"
          variante="outline"
          larguraTotal
          onPress={() => router.push({ pathname: '/locais/[id]/editar', params: { id } })}
        />
      </Tela>
    </>
  );
}
