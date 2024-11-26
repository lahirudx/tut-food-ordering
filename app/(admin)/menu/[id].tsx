import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import products from "@/assets/data/products";
import { PizzaSize } from "@/types";
import Button from "@/components/Button";
import { useCart } from "@/providers/CartProvider";
import { defaultPizzaImage } from "@/constants/Images";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useProduct } from "@/api/products";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const ProductDetailsScreen = () => {
  const router = useRouter();

  const { id: stringId } = useLocalSearchParams();
  const id = parseFloat(typeof stringId === "string" ? stringId : stringId[0]);
  const { data: product, error, isLoading } = useProduct(id);

  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

  const addToCart = () => {
    if (!product) {
      return;
    }

    addItem(product, selectedSize);
    router.push("/cart");
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error fetching products</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Product not found</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Edit",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${product.id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: { backgroundColor: "white", flex: 1, padding: 10 },
  image: { width: "100%", aspectRatio: 1 },
  title: { fontSize: 20, fontWeight: "bold" },
  price: { fontSize: 18, fontWeight: "bold" },
  subtitle: {
    marginVertical: 10,
    fontWeight: "600",
  },
});
