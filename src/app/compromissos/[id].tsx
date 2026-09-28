import { router, useLocalSearchParams } from 'expo-router';
import Stack from 'expo-router/stack';

import { useConsulta, useRepos } from '../../db/BancoProvider';
import { confirmarExclusao } from '../../features/acoes';
import { FormCompromisso } from '../../features/FormCompromisso';
import { textos } from '../../strings';

export default function EditarCompromisso() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const repos = useRepos();
  const edicao = useConsulta((r) => r.compromissos.obterParaEdicao(id));
  if (!edicao) return null;
  const { compromisso, horario } = edicao;

  return (
    <>
      <Stack.Screen options={{ title: textos.compromissos.editar }} />
      <FormCompromisso
        inicial={{
          titulo: compromisso.titulo,
          observacao: compromisso.observacao ?? '',
          diaSemana: horario.diaSemana ?? undefined,
          inicioMin: horario.inicioMin,
          fimMin: horario.fimMin,
          localId: horario.localId,
          salaId: horario.salaId,
        }}
        onSalvar={(dados) => {
          repos.compromissos.atualizarSemanal(id, dados);
          router.back();
        }}
        onExcluir={() =>
          confirmarExclusao(textos.compromissos.confirmarExclusao, textos.compromissos.confirmarExclusaoDescricao, () => {
            repos.compromissos.excluir(id);
            router.back();
          })
        }
      />
    </>
  );
}
