import { router } from 'expo-router';
import { View } from 'react-native';

import { useConsulta } from '../../db/BancoProvider';
import { textos } from '../../strings';
import { useTema } from '../../theme';
import { Botao, EstadoVazio, ItemLista, Tela, TituloSecao } from '../../ui';

/** Cadastros: lista de locais; cada local abre as salas dele. */
export default function Cadastros() {
  const { raio } = useTema();
  const locais = useConsulta((r) => r.locais.listar());
  const novo = () => router.push('/locais/novo');

  return (
    <Tela>
      {locais.length === 0 ? (
        <EstadoVazio
          titulo={textos.locais.vazioTitulo}
          descricao={textos.locais.vazioDescricao}
          acao={textos.locais.vazioAcao}
          onAcao={novo}
        />
      ) : (
        <>
          <Botao rotulo={textos.locais.novo} icone="plus" onPress={novo} larguraTotal />
          <TituloSecao>{textos.locais.titulo}</TituloSecao>
          <View style={{ borderRadius: raio.xl, overflow: 'hidden' }}>
            {locais.map((l) => (
              <ItemLista
                key={l.id}
                icone="map-pin"
                titulo={l.nome}
                subtitulo={l.apelido ?? l.observacao}
                contagem={textos.locais.salas(l.totalSalas)}
                onPress={() => router.push({ pathname: '/locais/[id]', params: { id: l.id } })}
              />
            ))}
          </View>
        </>
      )}
    </Tela>
  );
}
