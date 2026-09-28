import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { textos } from '../strings';
import { useTema } from '../theme';
import { Botao } from './Botao';
import { Campo, MolduraCampo, useCaixaCampo } from './Campo';
import { Icone, type NomeIcone } from './Icone';
import { Texto } from './Texto';
import { Veu } from './Veu';

export type Opcao = { id: string; rotulo: string; detalhe?: string | null };

type Props = {
  rotulo: string;
  placeholder: string;
  icone: NomeIcone;
  opcoes: Opcao[];
  valor: string | null | undefined;
  onChange: (id: string | null) => void;
  /** Texto da ação no fim da lista, ex. "Criar novo local". */
  rotuloCriar: string;
  /** Rótulo do campo do formulário de criação inline. */
  rotuloNovo: string;
  /** Cria o item e devolve o id; a opção criada fica selecionada. */
  onCriar: (nome: string) => string;
  /** Mensagem quando não há opções. */
  textoVazio: string;
  /** Se definido, mostra uma opção para deixar sem valor (ex. "Sem sala"). */
  rotuloNenhum?: string;
  desabilitado?: boolean;
  erro?: string;
};

/**
 * Select do design system, com criação inline no fim da lista:
 * o usuário cadastra local ou sala sem sair do formulário do compromisso.
 */
export function Selecao(props: Props) {
  const tema = useTema();
  const { espaco, cores, raio, tamanho } = tema;
  const insets = useSafeAreaInsets();
  const [aberto, setAberto] = useState(false);
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState('');
  const [erroNome, setErroNome] = useState<string>();
  const caixa = useCaixaCampo(aberto, !!props.erro, props.desabilitado);
  const selecionada = props.opcoes.find((o) => o.id === props.valor);

  function fechar() {
    setAberto(false);
    setCriando(false);
    setNome('');
    setErroNome(undefined);
  }

  function escolher(id: string | null) {
    props.onChange(id);
    fechar();
  }

  function criar() {
    const limpo = nome.trim();
    if (!limpo) {
      setErroNome(textos.validacao.obrigatorio);
      return;
    }
    escolher(props.onCriar(limpo));
  }

  const linha = { minHeight: tamanho.touch, paddingHorizontal: espaco[3], borderRadius: raio.md } as const;

  return (
    <MolduraCampo rotulo={props.rotulo} erro={props.erro}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${props.rotulo}: ${selecionada?.rotulo ?? props.placeholder}`}
        accessibilityState={{ disabled: props.desabilitado }}
        disabled={props.desabilitado}
        onPress={() => setAberto(true)}
        style={[
          caixa,
          { flexDirection: 'row', alignItems: 'center', gap: espaco[2] },
          props.desabilitado ? { opacity: tema.opacidade.disabled } : null,
        ]}>
        <Icone nome={props.icone} cor={cores.text.secondary} tamanho={espaco[5]} />
        <Texto
          estilo="bodyL"
          numberOfLines={1}
          style={{ flex: 1 }}
          cor={selecionada ? cores.text.primary : cores.text.secondary}>
          {selecionada?.rotulo ?? (props.valor === null && props.rotuloNenhum ? props.rotuloNenhum : props.placeholder)}
        </Texto>
        <Icone nome="chevron-down" cor={cores.text.secondary} tamanho={espaco[5]} />
      </Pressable>

      <Modal visible={aberto} transparent animationType="slide" onRequestClose={fechar}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <Pressable accessibilityLabel={textos.comum.cancelar} onPress={fechar} style={{ flex: 1 }}>
            <Veu />
          </Pressable>
          <View
            style={{
              backgroundColor: cores.bg.surface,
              borderTopLeftRadius: raio.xl,
              borderTopRightRadius: raio.xl,
              padding: espaco[4],
              paddingBottom: espaco[4] + insets.bottom,
              gap: espaco[2],
              maxHeight: '80%',
            }}>
            <Texto estilo="headingH3">{props.rotulo}</Texto>
            {criando ? (
              <View style={{ gap: espaco[4] }}>
                <Campo
                  rotulo={props.rotuloNovo}
                  value={nome}
                  onChangeText={(v) => {
                    setNome(v);
                    setErroNome(undefined);
                  }}
                  erro={erroNome}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={criar}
                />
                <View style={{ flexDirection: 'row', gap: espaco[2] }}>
                  <Botao rotulo={textos.comum.criar} onPress={criar} />
                  <Botao rotulo={textos.comum.cancelar} variante="ghost" onPress={() => setCriando(false)} />
                </View>
              </View>
            ) : (
              <ScrollView keyboardShouldPersistTaps="handled">
                {props.opcoes.length === 0 ? (
                  <Texto estilo="bodyS" cor={cores.text.secondary} style={{ padding: espaco[3] }}>
                    {props.textoVazio}
                  </Texto>
                ) : null}
                {props.rotuloNenhum ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => escolher(null)}
                    style={({ pressed }) => [
                      linha,
                      { justifyContent: 'center', backgroundColor: pressed ? cores.bg.surface2 : undefined },
                    ]}>
                    <Texto estilo="bodyM" cor={cores.text.secondary}>
                      {props.rotuloNenhum}
                    </Texto>
                  </Pressable>
                ) : null}
                {props.opcoes.map((o) => {
                  const ativa = o.id === props.valor;
                  return (
                    <Pressable
                      key={o.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: ativa }}
                      onPress={() => escolher(o.id)}
                      style={({ pressed }) => [
                        linha,
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: espaco[2],
                          backgroundColor: ativa ? cores.brand.soft : pressed ? cores.bg.surface2 : undefined,
                        },
                      ]}>
                      <View style={{ flex: 1, paddingVertical: espaco[2] }}>
                        <Texto estilo="bodyM">{o.rotulo}</Texto>
                        {o.detalhe ? (
                          <Texto estilo="caption" cor={cores.text.secondary}>
                            {o.detalhe}
                          </Texto>
                        ) : null}
                      </View>
                      {ativa ? <Icone nome="check" cor={cores.text.brand} tamanho={espaco[5]} /> : null}
                    </Pressable>
                  );
                })}
                <View style={{ height: 1, backgroundColor: cores.border.default, marginVertical: espaco[1] }} />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setCriando(true)}
                  style={({ pressed }) => [
                    linha,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: espaco[2],
                      backgroundColor: pressed ? cores.bg.surface2 : undefined,
                    },
                  ]}>
                  <Icone nome="plus" cor={cores.text.brand} tamanho={espaco[5]} />
                  <Texto estilo="labelM" cor={cores.text.brand}>
                    {props.rotuloCriar}
                  </Texto>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </MolduraCampo>
  );
}
