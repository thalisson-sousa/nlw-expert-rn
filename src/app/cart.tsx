import { useState } from 'react';
import { useNavigation } from 'expo-router';
import { Text, View, ScrollView, Alert, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { ProductCartProps, useCartStore } from "@/stores/cart-store";

import { formatCurrency } from "@/utils/functions/format-currency";

import { Header } from "@/components/header";
import { Product } from "@/components/product";
import Input from "@/components/input";
import { Button } from "@/components/button";
import { LinkButton } from "@/components/link-button";

const PHONE_NUMBER = "";

export default function Cart() {
  const [address, setAddress] = useState("");
  const cardStore = useCartStore();
  const navigation = useNavigation();

  const total = formatCurrency(
    cardStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
      {
        text: "Cancelar",
      },
      {
        text: "Remover",
        onPress: () => cardStore.remove(product.id),
      },
    ])
  }

  function handnleOrder() {
    if(address.trim().length === 0) {
      return Alert.alert("Pedido", "Informe os dados da Entrega.")
    }

    const products = cardStore.products.map((product) => `\n ${product.quantity} ${product.title}`).join("");
    
    const message = `
    🍔 NOVO PEDIDO 🍔
    \n Entregar em: ${address}
    ${products}
    \n Valor total: ${total}
    `

    Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`)

    cardStore.clear();
    navigation.goBack();
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho " />

      <KeyboardAwareScrollView>
        <ScrollView>
          <View className="p-5 flex-1">
            {cardStore.products.length > 0 ? (
              <View className="border-b border-slate-700">
                {cardStore.products.map((product) => (
                  <Product key={product.id} data={product} onPress={() => handleProductRemove(product)} />
                ))}
              </View>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Seu Carrinho está vazio.
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4">
              <Text className="text-white text-xl font-subtitle">Total:</Text>
              <Text className="text-lime-400 text-2xl font-heading">
                {total}
              </Text>
            </View>
            <Input 
            placeholder="Informe o endereço de entrega com rua, bairro, cep, número e complemento" 
            onChangeText={setAddress}
            blurOnSubmit={true}
            onSubmitEditing={handnleOrder}
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">

        <Button onPress={handnleOrder}>
          <Button.Text>Enviar Pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton title="Voltar ao cardápio" href="/" />

      </View>

    </View>
  );
}
