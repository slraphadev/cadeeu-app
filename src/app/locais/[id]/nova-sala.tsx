import { router, useLocalSearchParams } from 'expo-router';
import Stack from 'expo-router/stack';

import { useConsulta, useRepos } from '../../../db/BancoProvider';
import { FormSala } from '../../../features/FormSala';
import { textos } from '../../../strings';

export default function NovaSala() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const repos = useRepos();
  const local = useConsulta((r) => r.locais.obter(id));

  return (
    <>
      <Stack.Screen options={{ title: textos.salas.nova }} />
      <FormSala
        nomeDoLocal={local?.nome}
        onSalvar={(dados) => {
          repos.salas.criar(id, dados);
          router.back();
        }}
      />
    </>
  );
}
