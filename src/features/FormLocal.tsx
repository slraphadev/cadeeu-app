import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { localSchema, type LocalDados, type LocalEntrada } from '../domain/validacao';
import { textos } from '../strings';
import { useTema } from '../theme';
import { Botao, Campo, Tela } from '../ui';

type Props = {
  inicial?: Partial<LocalEntrada>;
  onSalvar: (dados: LocalDados) => void;
  onExcluir?: () => void;
};

export function FormLocal({ inicial, onSalvar, onExcluir }: Props) {
  const { espaco } = useTema();
  const t = textos.locais.campos;
  const { control, handleSubmit } = useForm<LocalEntrada, unknown, LocalDados>({
    resolver: zodResolver(localSchema),
    defaultValues: { nome: '', apelido: '', observacao: '', ...inicial },
  });

  return (
    <Tela>
      <View style={{ gap: espaco[5] }}>
        <Controller
          control={control}
          name="nome"
          render={({ field, fieldState }) => (
            <Campo
              rotulo={t.nome}
              placeholder={t.nomeExemplo}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              erro={fieldState.error?.message}
              maxLength={60}
              autoFocus={!inicial?.nome}
            />
          )}
        />
        <Controller
          control={control}
          name="apelido"
          render={({ field, fieldState }) => (
            <Campo
              rotulo={textos.comum.opcional(t.apelido)}
              placeholder={t.apelidoExemplo}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              erro={fieldState.error?.message}
              maxLength={30}
            />
          )}
        />
        <Controller
          control={control}
          name="observacao"
          render={({ field, fieldState }) => (
            <Campo
              rotulo={textos.comum.opcional(t.observacao)}
              placeholder={t.observacaoExemplo}
              value={field.value ?? ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              erro={fieldState.error?.message}
              maxLength={200}
              multiline
            />
          )}
        />
      </View>
      <View style={{ gap: espaco[3] }}>
        <Botao rotulo={textos.comum.salvar} onPress={handleSubmit(onSalvar)} larguraTotal />
        {onExcluir ? (
          <Botao rotulo={textos.locais.excluir} variante="ghost" icone="x" onPress={onExcluir} larguraTotal />
        ) : null}
      </View>
    </Tela>
  );
}
