[//]: # (title: WebSockets 序列化在 Ktor 伺服器中)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="server-websockets-serialization"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

類似於 [ContentNegotiation](server-serialization.md) 外掛程式，WebSockets 讓您能夠以特定格式序列化/反序列化文字影格。Ktor 開箱即用地支援以下格式：JSON、XML、CBOR 和 ProtoBuf。

## 新增依賴項 {id="add_dependencies"}

<include from="server-serialization.md" element-id="add_serialization_dependency"/>

## 設定序列化器 {id="configure_serializer"}

### JSON 序列化器 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

若要在 WebSockets [組態](server-websockets.md#configure) 中註冊 JSON 序列化器，請建立一個帶有 `Json` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.kotlinx.*
import kotlinx.serialization.json.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Json)
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

若要在 WebSockets [組態](server-websockets.md#configure) 中註冊 XML 序列化器，請建立一個帶有 `XML` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：
```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBOR 序列化器 {id="register_cbor"}
若要在 WebSockets [組態](server-websockets.md#configure) 中註冊 CBOR 序列化器，請建立一個帶有 `Cbor` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBuf 序列化器 {id="register_protobuf"}
若要在 WebSockets [組態](server-websockets.md#configure) 中註冊 ProtoBuf 序列化器，請建立一個帶有 `ProtoBuf` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import kotlinx.serialization.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## 接收與傳送資料 {id="receive_send_data"}

### 建立資料類別 (data class) {id="create_data_class"}
若要將影格序列化/反序列化為物件或從物件中序列化/反序列化影格，您需要建立一個資料類別，例如：
```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="11"}

如果您使用 kotlinx.serialization，請確保此類別帶有 `@Serializable` 註解：
```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="10-11"}

### 接收資料 {id="receive_data"}
若要接收並轉換文字影格的內容，請呼叫接受資料類別作為參數的 `receiveDeserialized` 函數：
```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="23-26"}

若要從 [傳入](server-websockets.md#api-overview) 通道接收反序列化的影格，請使用 [WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html) 函數。`WebsocketContentConverter` 可透過 `WebSocketServerSession.converter` 屬性取得。

### 傳送資料 {id="send_data"}
若要使用 [指定格式](#configure_serializer) 在文字影格中傳遞資料物件，您可以使用 `sendSerialized` 函數：

```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="20-22"}

> 您可以在此找到完整的範例：[server-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-serialization)。