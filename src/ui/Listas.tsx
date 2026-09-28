import { Pressable, View } from 'react-native';

import { formatarIntervalo } from '../domain/tempo';
import { textos } from '../strings';
import { useTema } from '../theme';
import { Botao } from './Botao';
import { Icone, type NomeIcone } from './Icone';
import { Texto } from './Texto';

/** Card de compromisso: a sala é o texto de maior peso. */
export function CartaoCompromisso(p: {
  titulo: string;
  sala: string | null;
  local: string;
  inicioMin: number;
  fimMin: number;
  onPress: () => void;
}) {
  const { cores, espaco, raio } = useTema();
  const horario = formatarIntervalo(p.inicioMin, p.fimMin);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${p.sala ?? textos.grade.semSala}, ${p.titulo}, ${p.local}, ${horario}`}
      onPress={p.onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? cores.bg.surface2 : cores.bg.surface,
        borderColor: cores.border.default,
        borderWidth: 1,
        borderRadius: raio.xl,
        padding: espaco[4],
        gap: espaco[1],
      })}>
      <Texto estilo="labelS" cor={cores.text.secondary}>
        {horario}
      </Texto>
      <Texto estilo="headingH1" cor={p.sala ? cores.text.primary : cores.text.secondary}>
        {p.sala ?? textos.grade.semSala}
      </Texto>
      <Texto estilo="headingH4">{p.titulo}</Texto>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: espaco[1] }}>
        <Icone nome="map-pin" cor={cores.text.secondary} tamanho={espaco[4]} />
        <Texto estilo="bodyS" cor={cores.text.secondary}>
          {p.local}
        </Texto>
      </View>
    </Pressable>
  );
}

/** Item de lista para Locais e Salas. */
export function ItemLista(p: {
  icone: NomeIcone;
  titulo: string;
  subtitulo?: string | null;
  contagem?: string;
  onPress?: () => void;
}) {
  const { cores, espaco, raio } = useTema();
  return (
    <Pressable
      accessibilityRole={p.onPress ? 'button' : undefined}
      disabled={!p.onPress}
      onPress={p.onPress}
      style={({ pressed }) => ({
        minHeight: espaco[16],
        paddingHorizontal: espaco[4],
        paddingVertical: espaco[3],
        flexDirection: 'row',
        alignItems: 'center',
        gap: espaco[3],
        backgroundColor: pressed ? cores.bg.surface2 : cores.bg.surface,
        borderBottomWidth: 1,
        borderBottomColor: cores.border.default,
      })}>
      <View
        style={{
          width: espaco[10],
          height: espaco[10],
          borderRadius: raio.md,
          backgroundColor: cores.brand.soft,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icone nome={p.icone} cor={cores.text.brand} />
      </View>
      <View style={{ flex: 1, gap: espaco[0.5] }}>
        <Texto estilo="headingH4">{p.titulo}</Texto>
        {p.subtitulo ? (
          <Texto estilo="bodyS" cor={cores.text.secondary}>
            {p.subtitulo}
          </Texto>
        ) : null}
      </View>
      {p.contagem ? (
        <View
          style={{
            paddingHorizontal: espaco[2],
            paddingVertical: espaco[0.5],
            borderRadius: raio.full,
            backgroundColor: cores.bg.surface2,
          }}>
          <Texto estilo="labelS" cor={cores.text.secondary}>
            {p.contagem}
          </Texto>
        </View>
      ) : null}
      {p.onPress ? <Icone nome="chevron-right" cor={cores.text.secondary} /> : null}
    </Pressable>
  );
}

/** Estado vazio: explica o motivo e oferece a próxima ação. */
export function EstadoVazio(p: { titulo: string; descricao: string; acao?: string; onAcao?: () => void }) {
  const { cores, espaco, raio } = useTema();
  return (
    <View
      style={{
        alignItems: 'center',
        gap: espaco[4],
        padding: espaco[6],
        backgroundColor: cores.bg.surface,
        borderRadius: raio.xl,
      }}>
      <View style={{ gap: espaco[2], alignItems: 'center' }}>
        <Texto estilo="headingH3" style={{ textAlign: 'center' }}>
          {p.titulo}
        </Texto>
        <Texto estilo="bodyM" cor={cores.text.secondary} style={{ textAlign: 'center' }}>
          {p.descricao}
        </Texto>
      </View>
      {p.acao && p.onAcao ? <Botao rotulo={p.acao} icone="plus" onPress={p.onAcao} /> : null}
    </View>
  );
}

/** Título de seção dentro de uma tela (Overline). */
export function TituloSecao({ children }: { children: string }) {
  const { cores } = useTema();
  return (
    <Texto estilo="overline" cor={cores.text.secondary} accessibilityRole="header">
      {children}
    </Texto>
  );
}
