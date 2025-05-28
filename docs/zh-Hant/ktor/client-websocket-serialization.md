[//]: # (title: Ktor Client 中的 WebSockets 序列化)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-websockets-serialization"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

與 [ContentNegotiation](client-serialization.md) 外掛程式類似，WebSockets 允許您以特定格式序列化/反序列化文字訊框 (text frames)。Ktor 客戶端 (client) 開箱即用 (out-of-the-box) 支援以下格式：JSON、XML、CBOR 和 ProtoBuf。

## 加入依賴項 {id="add_dependencies"}

<include from="server-serialization.md" element-id="add_serialization_dependency"/>

## 配置序列化器 {id="configure_serializer"}

### JSON 序列化器 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

若要在 WebSockets [設定](client-websockets.topic#install_plugin)中註冊 JSON 序列化器，請建立一個帶有 `Json` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.kotlinx.*
import kotlinx.serialization.json.*

val client = HttpClient(CIO) {
    install(WebSockets) {
        contentConverter = KotlinxWebsocketSerializationConverter(Json)
    }
}
```

</tab>
<tab title="Gson" group-key="gson">

若要註冊 Gson 序列化器，請將 `GsonWebsocketContentConverter` 指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</tab>
<tab title="Jackson" group-key="jackson">

若要註冊 Jackson 序列化器，請將 `JacksonWebsocketContentConverter` 指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</tab>
</tabs>

### XML 序列化器 {id="register_xml"}

若要在 WebSockets [設定](client-websockets.topic#install_plugin)中註冊 XML 序列化器，請建立一個帶有 `XML` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBOR 序列化器 {id="register_cbor"}
若要在 WebSockets [設定](client-websockets.topic#install_plugin)中註冊 CBOR 序列化器，請建立一個帶有 `Cbor` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBuf 序列化器 {id="register_protobuf"}
若要在 WebSockets [設定](client-websockets.topic#install_plugin)中註冊 ProtoBuf 序列化器，請建立一個帶有 `ProtoBuf` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.kotlinx.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## 接收和傳送資料 {id="receive_send_data"}
### 建立資料類別 {id="create_data_class"}

若要將文字訊框序列化/反序列化為物件，您需要建立一個資料類別 (data class)，例如：

```kotlin
```
{src="snippets/client-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="13"}

如果您使用 `kotlinx.serialization`，請確保此類別具有 `@Serializable` 註解：

```kotlin
```
{src="snippets/client-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="12-13"}

要了解更多關於 `kotlinx.serialization` 的資訊，請參閱 [Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)。

### 傳送資料 {id="send_data"}

若要在[指定格式](#configure_serializer)的文字訊框中傳送[類別實例](#create_data_class)，請使用 `sendSerialized` 函式：

```kotlin
```
{src="snippets/client-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="26-28"}

### 接收資料 {id="receive_data"}

若要接收並轉換文字訊框的內容，請呼叫 `receiveDeserialized` 函式，該函式接受一個資料類別作為參數：

```kotlin
```
{src="snippets/client-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="22-25"}

若要從 [incoming](client-websockets.topic#incoming) 通道接收反序列化 (deserialized) 訊框，請使用 [WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html) 函式。`WebsocketContentConverter` 可透過 `DefaultClientWebSocketSession.converter` 屬性取得。

> 您可以在此處找到完整範例：[client-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-websockets-serialization)。