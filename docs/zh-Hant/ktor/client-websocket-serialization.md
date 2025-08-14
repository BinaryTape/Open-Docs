[//]: # (title: Ktor 客戶端的 WebSockets 序列化)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-websockets-serialization"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

類似於 [ContentNegotiation](client-serialization.md) 外掛程式，WebSockets 允許您以特定格式序列化/反序列化文字幀。Ktor 客戶端開箱即用支援以下格式：JSON、XML、CBOR 和 ProtoBuf。

## 新增相依性 {id="add_dependencies"}

<snippet id="add_serialization_dependency">

在使用 kotlinx.serialization 轉換器之前，您需要如 [設定](https://github.com/Kotlin/kotlinx.serialization#setup) 部分所述，新增 Kotlin 序列化外掛程式。

#### JSON {id="add_json_dependency"}

為了序列化/反序列化 JSON 資料，您可以選擇以下其中一個函式庫：kotlinx.serialization、Gson 或 Jackson。

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

在建置腳本中新增 `ktor-serialization-kotlinx-json` artifact：

<var name="artifact_name" value="ktor-serialization-kotlinx-json"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
<tab title="Gson" group-key="gson">

在建置腳本中新增 `ktor-serialization-gson` artifact：

<var name="artifact_name" value="ktor-serialization-gson"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
<tab title="Jackson" group-key="jackson">

在建置腳本中新增 `ktor-serialization-jackson` artifact：

<var name="artifact_name" value="ktor-serialization-jackson"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
</tabs>

#### XML {id="add_xml_dependency"}

為了序列化/反序列化 XML，請在建置腳本中新增 `ktor-serialization-kotlinx-xml`：

<var name="artifact_name" value="ktor-serialization-kotlinx-xml"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

> 請注意，XML 序列化 [在 `jsNode` 目標上不受支援](https://github.com/pdvrieze/xmlutil/issues/83)。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

為了序列化/反序列化 CBOR，請在建置腳本中新增 `ktor-serialization-kotlinx-cbor`：

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### ProtoBuf {id="add_protobuf_dependency"}

為了序列化/反序列化 ProtoBuf，請在建置腳本中新增 `ktor-serialization-kotlinx-protobuf`：

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</snippet>

## 配置序列化器 {id="configure_serializer"}

### JSON 序列化器 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

為了在 WebSockets [配置](client-websockets.topic#install_plugin) 中註冊 JSON 序列化器，請使用 `Json` 參數建立一個 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

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

為了註冊 Gson 序列化器，請將 `GsonWebsocketContentConverter` 指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</tab>
<tab title="Jackson" group-key="jackson">

為了註冊 Jackson 序列化器，請將 `JacksonWebsocketContentConverter` 指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</tab>
</tabs>

### XML 序列化器 {id="register_xml"}

為了在 WebSockets [配置](client-websockets.topic#install_plugin) 中註冊 XML 序列化器，請使用 `XML` 參數建立一個 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBOR 序列化器 {id="register_cbor"}
為了在 WebSockets [配置](client-websockets.topic#install_plugin) 中註冊 CBOR 序列化器，請使用 `Cbor` 參數建立一個 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBuf 序列化器 {id="register_protobuf"}
為了在 WebSockets [配置](client-websockets.topic#install_plugin) 中註冊 ProtoBuf 序列化器，請使用 `ProtoBuf` 參數建立一個 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.kotlinx.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## 接收和傳送資料 {id="receive_send_data"}
### 建立一個資料類別 {id="create_data_class"}

為了將文字幀序列化/反序列化為/從一個物件，您需要建立一個資料類別，例如：

[object Promise]

如果您使用 kotlinx.serialization，請確保此類別具有 `@Serializable` 註解：

[object Promise]

欲了解更多關於 `kotlinx.serialization` 的資訊，請參閱 [Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)。

### 傳送資料 {id="send_data"}

為了在文字幀中以 [指定格式](#configure_serializer) 傳送一個 [類別實例](#create_data_class)，請使用 `sendSerialized` 函式：

[object Promise]

### 接收資料 {id="receive_data"}

為了接收並轉換文字幀的內容，請呼叫接受一個資料類別作為參數的 `receiveDeserialized` 函式：

[object Promise]

為了從 [傳入](client-websockets.topic#incoming) 通道接收反序列化的幀，請使用 [WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html) 函式。`WebsocketContentConverter` 可透過 `DefaultClientWebSocketSession.converter` 屬性取得。

> 您可以在此處找到完整範例：[client-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-websockets-serialization)。