import { router } from 'expo-router';
import Stack from 'expo-router/stack';

import { usePeriodoAtivo, useRepos } from '../../db/BancoProvider';
import { FormCompromisso } from '../../features/FormCompromisso';
import { textos } from '../../strings';

export default function NovoCompromisso() {
  const repos = useRepos();
  const periodo = usePeriodoAtivo();
  return (
    <>
      <Stack.Screen options={{ title: textos.compromissos.novo }} />
      <FormCompromisso
        onSalvar={(dados) => {
          repos.compromissos.criarSemanal(periodo.id, dados);
          router.back();
        }}
      />
    </>
  );
}
