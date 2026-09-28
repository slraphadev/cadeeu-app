import { router, useLocalSearchParams } from 'expo-router';
import Stack from 'expo-router/stack';

import { useConsulta, useRepos } from '../../db/BancoProvider';
import { confirmarExclusao, excluirComAviso } from '../../features/acoes';
import { FormSala } from '../../features/FormSala';
import { textos } from '../../strings';

export default function EditarSala() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const repos = useRepos();
  const sala = useConsulta((r) => r.salas.obter(id));
  const local = useConsulta((r) => (sala ? r.locais.obter(sala.localId) : undefined));
  if (!sala) return null;

  return (
    <>
      <Stack.Screen options={{ title: textos.salas.editar }} />
      <FormSala
        nomeDoLocal={local?.nome}
        inicial={{
          nome: sala.nome,
          bloco: sala.bloco ?? '',
          andar: sala.andar ?? '',
          observacao: sala.observacao ?? '',
        }}
        onSalvar={(dados) => {
          repos.salas.atualizar(id, dados);
          router.back();
        }}
        onExcluir={() =>
          confirmarExclusao(textos.salas.confirmarExclusao, textos.salas.confirmarExclusaoDescricao, () => {
            if (excluirComAviso(() => repos.salas.excluir(id), textos.salas.emUso)) router.back();
          })
        }
      />
    </>
  );
}
