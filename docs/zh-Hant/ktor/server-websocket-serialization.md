[//]: # (title: Ktor 伺服器中的 WebSockets 序列化)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="server-websockets-serialization"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

類似於 [ContentNegotiation](server-serialization.md) 外掛，WebSockets 允許您以特定格式序列化/反序列化文字幀。Ktor 開箱即用支援以下格式：JSON、XML、CBOR 和 ProtoBuf。

## 新增依賴項 {id="add_dependencies"}

<snippet id="add_serialization_dependency">

在使用 kotlinx.serialization 轉換器之前，您需要依照 [Setup](https://github.com/Kotlin/kotlinx.serialization#setup) 章節的說明新增 Kotlin 序列化外掛。

#### JSON {id="add_json_dependency"}

要序列化/反序列化 JSON 資料，您可以選擇以下其中一個函式庫：kotlinx.serialization、Gson 或 Jackson。 

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

在建置腳本中新增 `ktor-serialization-kotlinx-json` artifact：

<var name="artifact_name" value="ktor-serialization-kotlinx-json"/>

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
    

</tab>
<tab title="Gson" group-key="gson">

在建置腳本中新增 `ktor-serialization-gson` artifact：

<var name="artifact_name" value="ktor-serialization-gson"/>

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
    

</tab>
<tab title="Jackson" group-key="jackson">

在建置腳本中新增 `ktor-serialization-jackson` artifact：

<var name="artifact_name" value="ktor-serialization-jackson"/>

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
    

</tab>
</tabs>

#### XML {id="add_xml_dependency"}

要序列化/反序列化 XML，請在建置腳本中新增 `ktor-serialization-kotlinx-xml`：

<var name="artifact_name" value="ktor-serialization-kotlinx-xml"/>

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
    

> 請注意，XML 序列化[不支援 `jsNode` 目標](https://github.com/pdvrieze/xmlutil/issues/83)。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

要序列化/反序列化 CBOR，請在建置腳本中新增 `ktor-serialization-kotlinx-cbor`：

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
    

#### ProtoBuf {id="add_protobuf_dependency"}

要序列化/反序列化 ProtoBuf，請在建置腳本中新增 `ktor-serialization-kotlinx-protobuf`：

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
    

</snippet>

## 設定序列化器 {id="configure_serializer"}

### JSON 序列化器 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

要在 WebSockets [設定](server-websockets.md#configure) 中註冊 JSON 序列化器，請建立一個帶有 `Json` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指定給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.kotlinx.*
import kotlinx.serialization.json.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Json)
}
```

</tab>
<tab title="Gson" group-key="gson">

要註冊 Gson 序列化器，請將 `GsonWebsocketContentConverter` 指定給 `contentConverter` 屬性：
```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</tab>
<tab title="Jackson" group-key="jackson">

要註冊 Jackson 序列化器，請將 `JacksonWebsocketContentConverter` 指定給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</tab>
</tabs>

### XML 序列化器 {id="register_xml"}

要在 WebSockets [設定](server-websockets.md#configure) 中註冊 XML 序列化器，請建立一個帶有 `XML` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指定給 `contentConverter` 屬性：
```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBOR 序列化器 {id="register_cbor"}
要在 WebSockets [設定](server-websockets.md#configure) 中註冊 CBOR 序列化器，請建立一個帶有 `Cbor` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指定給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBuf 序列化器 {id="register_protobuf"}
要在 WebSockets [設定](server-websockets.md#configure) 中註冊 ProtoBuf 序列化器，請建立一個帶有 `ProtoBuf` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指定給 `contentConverter` 屬性：

```kotlin
import kotlinx.serialization.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## 接收與傳送資料 {id="receive_send_data"}

### 建立資料類別 {id="create_data_class"}
要將幀序列化為物件或從物件反序列化，您需要建立一個資料類別，例如：
[object Promise]

如果您使用 kotlinx.serialization，請確保此類別帶有 `@Serializable` 註解：
[object Promise]

### 接收資料 {id="receive_data"}
要接收並轉換文字幀的內容，請呼叫接受資料類別作為參數的 `receiveDeserialized` 函式：
[object Promise]

要從 [incoming](server-websockets.md#api-overview) 通道接收反序列化幀，請使用 [WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html) 函式。`WebsocketContentConverter` 可透過 `WebSocketServerSession.converter` 屬性取得。

### 傳送資料 {id="send_data"}
要在文字幀中傳遞資料物件並使用 [指定格式](#configure_serializer)，您可以使用 `sendSerialized` 函式：

[object Promise]

> 您可以在此處找到完整的範例：[server-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-serialization)。