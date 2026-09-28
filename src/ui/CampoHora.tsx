import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';

import { dataComMinutos, formatarHora, minutosDe } from '../domain/tempo';
import { textos } from '../strings';
import { useTema } from '../theme';
import { Botao } from './Botao';
import { MolduraCampo, useCaixaCampo } from './Campo';
import { Icone } from './Icone';
import { Texto } from './Texto';
import { Veu } from './Veu';

type Props = {
  rotulo: string;
  valor: number | undefined;
  onChange: (minutos: number) => void;
  erro?: string;
};

/** Time Field: mostra "10h50" e abre o seletor de hora nativo, em 24 horas. */
export function CampoHora({ rotulo, valor, onChange, erro }: Props) {
  const tema = useTema();
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState(new Date());
  const caixa = useCaixaCampo(aberto, !!erro);
  const atual = dataComMinutos(valor ?? 8 * 60);

  function abrir() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: atual,
        mode: 'time',
        is24Hour: true,
        onValueChange: (_e, data) => onChange(minutosDe(data)),
      });
    } else {
      setRascunho(atual);
      setAberto(true);
    }
  }

  return (
    <MolduraCampo rotulo={rotulo} erro={erro}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${rotulo}: ${valor === undefined ? '' : formatarHora(valor)}`}
        onPress={abrir}
        style={[caixa, { flexDirection: 'row', alignItems: 'center', gap: tema.espaco[2] }]}>
        <Icone nome="clock" cor={tema.cores.text.secondary} tamanho={tema.espaco[5]} />
        <Texto estilo="bodyL" cor={valor === undefined ? tema.cores.text.secondary : tema.cores.text.primary}>
          {valor === undefined ? '--h--' : formatarHora(valor)}
        </Texto>
      </Pressable>

      {Platform.OS !== 'android' ? (
        <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => setAberto(false)}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Veu />
            <View
              style={{
                backgroundColor: tema.cores.bg.surface,
                padding: tema.espaco[4],
                gap: tema.espaco[3],
                borderTopLeftRadius: tema.raio.xl,
                borderTopRightRadius: tema.raio.xl,
              }}>
              <DateTimePicker
                value={rascunho}
                mode="time"
                display="spinner"
                is24Hour
                onValueChange={(_e, data) => setRascunho(data)}
              />
              <Botao
                rotulo={textos.comum.salvar}
                larguraTotal
                onPress={() => {
                  onChange(minutosDe(rascunho));
                  setAberto(false);
                }}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </MolduraCampo>
  );
}
