import { Alert } from 'react-native';

import { EmUsoError } from '../db/tipos';
import { textos } from '../strings';

/** Pede confirmação antes de excluir. */
export function confirmarExclusao(titulo: string, descricao: string, excluir: () => void) {
  Alert.alert(titulo, descricao, [
    { text: textos.comum.cancelar, style: 'cancel' },
    { text: textos.comum.excluir, style: 'destructive', onPress: excluir },
  ]);
}

/** Executa a exclusão e explica quando o registro ainda está em uso. */
export function excluirComAviso(excluir: () => void, mensagemEmUso: (usos: number) => string): boolean {
  try {
    excluir();
    return true;
  } catch (e) {
    if (e instanceof EmUsoError) {
      Alert.alert(textos.comum.naoFoiPossivelExcluir, mensagemEmUso(e.usos));
      return false;
    }
    throw e;
  }
}
