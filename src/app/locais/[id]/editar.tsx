import { router, useLocalSearchParams } from 'expo-router';
import Stack from 'expo-router/stack';

import { useConsulta, useRepos } from '../../../db/BancoProvider';
import { confirmarExclusao, excluirComAviso } from '../../../features/acoes';
import { FormLocal } from '../../../features/FormLocal';
import { textos } from '../../../strings';

export default function EditarLocal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const repos = useRepos();
  const local = useConsulta((r) => r.locais.obter(id));
  if (!local) return null;

  return (
    <>
      <Stack.Screen options={{ title: textos.locais.editar }} />
      <FormLocal
        inicial={{ nome: local.nome, apelido: local.apelido ?? '', observacao: local.observacao ?? '' }}
        onSalvar={(dados) => {
          repos.locais.atualizar(id, dados);
          router.back();
        }}
        onExcluir={() =>
          confirmarExclusao(textos.locais.confirmarExclusao, textos.locais.confirmarExclusaoDescricao, () => {
            if (excluirComAviso(() => repos.locais.excluir(id), textos.locais.emUso)) router.dismissTo('/cadastros');
          })
        }
      />
    </>
  );
}
