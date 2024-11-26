import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import products from "@/assets/data/products";
import { PizzaSize } from "@/types";
import Button from "@/components/Button";
import { useCart } from "@/providers/CartProvider";
import { defaultPizzaImage } from "@/constants/Images";
import { useProduct } from "@/api/products";
import Colors from "@/constants/Colors";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const ProductDetailsScreen = () => {
  const { id: stringId } = useLocalSearchParams();
  const id = parseFloat(typeof stringId === "string" ? stringId : stringId[0]);
  const { data: product, error, isLoading } = useProduct(id);

  const router = useRouter();

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
      <Stack.Screen options={{ title: product.name }} />
      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>Select size</Text>
      <View style={styles.sizes}>
        {sizes.map((size) => (
          <Pressable
            onPress={() => setSelectedSize(size)}
            key={size}
            style={[
              styles.size,
              {
                backgroundColor: selectedSize === size ? "gainsboro" : "white",
              },
            ]}
          >
            <Text
              style={[
                styles.sizeText,
                { color: size === selectedSize ? "black" : "gray" },
              ]}
              key={size}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Button text="Add to cart" onPress={addToCart} />
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: { backgroundColor: "white", flex: 1, padding: 10 },
  image: { width: "100%", aspectRatio: 1 },
  price: { fontSize: 18, fontWeight: "bold", marginTop: "auto" },
  subtitle: {
    marginVertical: 10,
    fontWeight: "600",
  },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  size: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: { fontSize: 20, fontWeight: "bold" },
});
