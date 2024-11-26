import { View, Text, StyleSheet, Image, TextInput, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { defaultPizzaImage } from "../../../constants/Images";
import Colors from "../../../constants/Colors";
import Button from "../../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";

const CreateScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");

  const router = useRouter();
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);
  const { data: updatingProduct, isLoading } = useProduct(id);

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const validateInput = () => {
    setErrors("");
    if (!name) {
      setErrors("Name is required");
      return false;
    }
    if (!price) {
      setErrors("Price is required");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors("Price should be a number");
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (isEditing) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  const onCreate = () => {
    if (!validateInput()) {
      return;
    }

    insertProduct(
      {
        name,
        price: parseFloat(price),
        image,
      },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
        onError: (error) => {
          console.warn("Error creating product", error);
        },
      }
    );
  };

  const onUpdate = () => {
    if (!validateInput()) {
      return;
    }
    updateProduct(
      { id, name, price: parseFloat(price), image },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const resetFields = () => {
    setName("");
    setPrice("");
    setImage("");
  };

  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        router.replace("/(admin)");
      },
      onError: (error) => {
        console.warn("Error deleting product", error);
      },
    });
  };

  const handleDeleteButtonPress = () => {
    Alert.alert("Delete", "Are you sure you want to delete this dish?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          onDelete();
        },
      },
    ]);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isEditing ? "Edit Product" : "Create Product" }}
      />
      <Image
        source={{ uri: image || defaultPizzaImage }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text onPress={pickImage} style={styles.textButton}>
        Select Image
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Margarita..."
        style={styles.input}
      />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="9.99"
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.error}>{errors}</Text>
      <Button onPress={onSubmit} text={isEditing ? "Update" : "Create"} />
      {isEditing && (
        <Text
          onPress={handleDeleteButtonPress}
          style={[styles.textButton, { color: "red" }]}
        >
          Delete
        </Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
  label: {
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});

export default CreateScreen;
