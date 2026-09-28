import { router } from 'expo-router';
import { View } from 'react-native';

import { useConsulta, usePeriodoAtivo } from '../../db/BancoProvider';
import { agruparPorDia, nomeDoDia } from '../../domain/dias';
import { textos } from '../../strings';
import { useTema } from '../../theme';
import { Botao, CartaoCompromisso, EstadoVazio, Tela, Texto, TituloSecao } from '../../ui';

/** Grade: compromissos da semana agrupados por dia. */
export default function Grade() {
  const { cores, espaco } = useTema();
  const periodo = usePeriodoAtivo();
  const itens = useConsulta((r) => r.compromissos.listarGrade(periodo.id));
  const grupos = agruparPorDia(itens);
  const novo = () => router.push('/compromissos/novo');

  return (
    <Tela>
      <View style={{ gap: espaco[1] }}>
        <Texto estilo="overline" cor={cores.text.brand}>
          {textos.grade.periodo(periodo.nome)}
        </Texto>
        <Texto estilo="bodyS" cor={cores.text.secondary}>
          {textos.grade.compromissos(itens.length)}
        </Texto>
      </View>

      {grupos.length === 0 ? (
        <EstadoVazio
          titulo={textos.grade.vazioTitulo}
          descricao={textos.grade.vazioDescricao}
          acao={textos.grade.vazioAcao}
          onAcao={novo}
        />
      ) : (
        <>
          <Botao rotulo={textos.grade.novo} icone="plus" onPress={novo} larguraTotal />
          {grupos.map((g) => (
            <View key={g.dia} style={{ gap: espaco[3] }}>
              <TituloSecao>{nomeDoDia(g.dia)}</TituloSecao>
              {g.itens.map((i) => (
                <CartaoCompromisso
                  key={i.horarioId}
                  titulo={i.titulo}
                  sala={i.salaNome}
                  local={i.localNome}
                  inicioMin={i.inicioMin}
                  fimMin={i.fimMin}
                  onPress={() => router.push({ pathname: '/compromissos/[id]', params: { id: i.compromissoId } })}
                />
              ))}
            </View>
          ))}
        </>
      )}
    </Tela>
  );
}
