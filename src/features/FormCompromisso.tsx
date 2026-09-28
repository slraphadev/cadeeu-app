import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { View } from 'react-native';

import { useConsulta, useRepos } from '../db/BancoProvider';
import {
  compromissoSchema,
  localSchema,
  salaSchema,
  type CompromissoDados,
  type CompromissoEntrada,
} from '../domain/validacao';
import { textos } from '../strings';
import { useTema } from '../theme';
import { Botao, Campo, CampoHora, ChipsDia, Selecao, Tela } from '../ui';

type Props = {
  inicial?: Partial<CompromissoEntrada>;
  onSalvar: (dados: CompromissoDados) => void;
  onExcluir?: () => void;
};

/**
 * Compromisso com um horário semanal. Local e sala podem ser criados
 * aqui mesmo, sem sair do formulário.
 */
export function FormCompromisso({ inicial, onSalvar, onExcluir }: Props) {
  const { espaco } = useTema();
  const repos = useRepos();
  const t = textos.compromissos;
  const { control, handleSubmit, setValue } = useForm<CompromissoEntrada, unknown, CompromissoDados>({
    resolver: zodResolver(compromissoSchema),
    defaultValues: { titulo: '', observacao: '', salaId: null, ...inicial },
  });

  const localId = useWatch({ control, name: 'localId' });
  const locais = useConsulta((r) => r.locais.listar());
  const salas = useConsulta((r) => (localId ? r.salas.listarPorLocal(localId) : []));

  return (
    <Tela>
      <View style={{ gap: espaco[5] }}>
        <Controller
          control={control}
          name="titulo"
          render={({ field, fieldState }) => (
            <Campo
              rotulo={t.campos.titulo}
              placeholder={t.campos.tituloExemplo}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              erro={fieldState.error?.message}
              maxLength={60}
              autoFocus={!inicial?.titulo}
            />
          )}
        />

        <Controller
          control={control}
          name="diaSemana"
          render={({ field, fieldState }) => (
            <ChipsDia
              rotulo={t.campos.dia}
              valor={field.value}
              onChange={field.onChange}
              erro={fieldState.error?.message}
            />
          )}
        />

        <View style={{ flexDirection: 'row', gap: espaco[3] }}>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name="inicioMin"
              render={({ field, fieldState }) => (
                <CampoHora
                  rotulo={t.campos.inicio}
                  valor={field.value}
                  onChange={field.onChange}
                  erro={fieldState.error?.message}
                />
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name="fimMin"
              render={({ field, fieldState }) => (
                <CampoHora
                  rotulo={t.campos.fim}
                  valor={field.value}
                  onChange={field.onChange}
                  erro={fieldState.error?.message}
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="localId"
          render={({ field, fieldState }) => (
            <Selecao
              rotulo={t.campos.local}
              placeholder={t.campos.localEscolha}
              icone="map-pin"
              opcoes={locais.map((l) => ({ id: l.id, rotulo: l.nome, detalhe: l.apelido }))}
              valor={field.value}
              onChange={(id) => {
                if (id !== field.value) setValue('salaId', null);
                field.onChange(id ?? undefined);
              }}
              rotuloCriar={t.criarLocal}
              rotuloNovo={t.nomeNovoLocal}
              textoVazio={t.nenhumLocal}
              onCriar={(nome) => repos.locais.criar(localSchema.parse({ nome })).id}
              erro={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="salaId"
          render={({ field, fieldState }) => (
            <Selecao
              rotulo={textos.comum.opcional(t.campos.sala)}
              placeholder={localId ? t.campos.salaEscolha : t.campos.salaSemLocal}
              icone="door"
              opcoes={salas.map((s) => ({ id: s.id, rotulo: s.nome, detalhe: s.bloco }))}
              valor={field.value}
              onChange={field.onChange}
              rotuloCriar={t.criarSala}
              rotuloNovo={t.nomeNovaSala}
              rotuloNenhum={t.campos.semSala}
              textoVazio={t.nenhumaSala}
              onCriar={(nome) => repos.salas.criar(localId as string, salaSchema.parse({ nome })).id}
              desabilitado={!localId}
              erro={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="observacao"
          render={({ field, fieldState }) => (
            <Campo
              rotulo={textos.comum.opcional(t.campos.observacao)}
              placeholder={t.campos.observacaoExemplo}
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
        <Botao rotulo={t.salvar} onPress={handleSubmit(onSalvar)} larguraTotal />
        {onExcluir ? (
          <Botao rotulo={t.excluir} variante="ghost" icone="x" onPress={onExcluir} larguraTotal />
        ) : null}
      </View>
    </Tela>
  );
}
