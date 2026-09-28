import { router } from 'expo-router';
import Stack from 'expo-router/stack';

import { useRepos } from '../../db/BancoProvider';
import { FormLocal } from '../../features/FormLocal';
import { textos } from '../../strings';

export default function NovoLocal() {
  const repos = useRepos();
  return (
    <>
      <Stack.Screen options={{ title: textos.locais.novo }} />
      <FormLocal
        onSalvar={(dados) => {
          const local = repos.locais.criar(dados);
          router.replace({ pathname: '/locais/[id]', params: { id: local.id } });
        }}
      />
    </>
  );
}
