import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { salaSchema, type SalaDados, type SalaEntrada } from '../domain/validacao';
import { textos } from '../strings';
import { useTema } from '../theme';
import { Botao, Campo, Tela, Texto } from '../ui';

type Props = {
  nomeDoLocal?: string;
  inicial?: Partial<SalaEntrada>;
  onSalvar: (dados: SalaDados) => void;
  onExcluir?: () => void;
};

export function FormSala({ nomeDoLocal, inicial, onSalvar, onExcluir }: Props) {
  const { cores, espaco } = useTema();
  const t = textos.salas.campos;
  const { control, handleSubmit } = useForm<SalaEntrada, unknown, SalaDados>({
    resolver: zodResolver(salaSchema),
    defaultValues: { nome: '', bloco: '', andar: '', observacao: '', ...inicial },
  });

  const campo = (
    nome: 'nome' | 'bloco' | 'andar' | 'observacao',
    rotulo: string,
    exemplo: string,
    max: number,
    extra?: { autoFocus?: boolean; multiline?: boolean },
  ) => (
    <Controller
      control={control}
      name={nome}
      render={({ field, fieldState }) => (
        <Campo
          rotulo={rotulo}
          placeholder={exemplo}
          value={field.value ?? ''}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          erro={fieldState.error?.message}
          maxLength={max}
          {...extra}
        />
      )}
    />
  );

  return (
    <Tela>
      {nomeDoLocal ? (
        <Texto estilo="overline" cor={cores.text.brand}>
          {nomeDoLocal}
        </Texto>
      ) : null}
      <View style={{ gap: espaco[5] }}>
        {campo('nome', t.nome, t.nomeExemplo, 40, { autoFocus: !inicial?.nome })}
        {campo('bloco', textos.comum.opcional(t.bloco), t.blocoExemplo, 40)}
        {campo('andar', textos.comum.opcional(t.andar), t.andarExemplo, 20)}
        {campo('observacao', textos.comum.opcional(t.observacao), t.observacaoExemplo, 200, { multiline: true })}
      </View>
      <View style={{ gap: espaco[3] }}>
        <Botao rotulo={textos.comum.salvar} onPress={handleSubmit(onSalvar)} larguraTotal />
        {onExcluir ? (
          <Botao rotulo={textos.salas.excluir} variante="ghost" icone="x" onPress={onExcluir} larguraTotal />
        ) : null}
      </View>
    </Tela>
  );
}
