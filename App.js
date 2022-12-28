import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Modal,
  TouchableHighlight,
  Image,
} from "react-native";
import { WebView } from "react-native-webview";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  const [uri, setUri] = useState(
    "https://stackoverflow.com/questions/61977154/webview-uri-redirect-by-scanning-barcodes-with-react-native-expo"
  );

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setModalVisible(true);
    // console.warn("Scan returned " + data);
    setUri({ uri: data });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      <Modal
        animationType='slide'
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setScanned(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <WebView style={{ flex: 1 }} source={{ uri: uri["uri"] }} />

          <TouchableHighlight
            style={{
              backgroundColor: "black",
              padding: 15,
              alignItems: "center",
            }}
            onPress={() => {
              setModalVisible(!modalVisible);
              setScanned(false);
            }}
            underlayColor='slategray'
          >
            <Text style={{ color: "white", fontSize: 15 }}>Re Scan</Text>
          </TouchableHighlight>
        </View>
      </Modal>

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ marginBottom: 100 }}>
          <View style={{ alignItems: "center", marginBottom: 5 }}>
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain",
                marginBottom: 20,
              }}
              source={{ uri: "http://domain.biz/img/logo_dark.png" }}
            />
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                paddingBottom: 10,
              }}
            >
              QR Code Reader v0.5
            </Text>
          </View>
          <View
            style={{
              borderColor: "white",
              borderTopWidth: 5,
              borderBottomWidth: 5,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              paddingVertical: 80,
              paddingHorizontal: 100,
            }}
          />

          <View style={{ alignItems: "center", marginTop: 5 }}>
            <Text style={{ color: "white", fontSize: 15 }}>QR Scan...</Text>
          </View>
        </View>
      </BarCodeScanner>
    </View>
  );
}
