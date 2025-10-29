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

與 [ContentNegotiation](server-serialization.md) 插件類似，WebSockets 允許您以特定格式序列化/反序列化文字訊框。Ktor 開箱即用支援以下格式：JSON、XML、CBOR 和 ProtoBuf。

## 新增依賴項 {id="add_dependencies"}

在使用 kotlinx.serialization 轉換器之前，您需要新增 Kotlin 序列化插件，如 [設定](https://github.com/Kotlin/kotlinx.serialization#setup) 部分所述。

#### JSON {id="add_json_dependency"}

若要序列化/反序列化 JSON 資料，您可以選擇以下其中一個函式庫：kotlinx.serialization、Gson 或 Jackson。

<Tabs group="json-libraries">
<TabItem title="kotlinx.serialization" group-key="kotlinx">

在建置腳本中新增 `ktor-serialization-kotlinx-json` Artifact：

<var name="artifact_name" value="ktor-serialization-kotlinx-json"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

</TabItem>
<TabItem title="Gson" group-key="gson">

在建置腳本中新增 `ktor-serialization-gson` Artifact：

<var name="artifact_name" value="ktor-serialization-gson"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

</TabItem>
<TabItem title="Jackson" group-key="jackson">

在建置腳本中新增 `ktor-serialization-jackson` Artifact：

<var name="artifact_name" value="ktor-serialization-jackson"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

</TabItem>
</Tabs>

#### XML {id="add_xml_dependency"}

若要序列化/反序列化 XML，請在建置腳本中新增 `ktor-serialization-kotlinx-xml`：

<var name="artifact_name" value="ktor-serialization-kotlinx-xml"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

> 請注意，XML 序列化 [不支援 `jsNode` 目標](https://github.com/pdvrieze/xmlutil/issues/83)。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

若要序列化/反序列化 CBOR，請在建置腳本中新增 `ktor-serialization-kotlinx-cbor`：

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

#### ProtoBuf {id="add_protobuf_dependency"}

若要序列化/反序列化 ProtoBuf，請在建置腳本中新增 `ktor-serialization-kotlinx-protobuf`：

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 配置序列化器 {id="configure_serializer"}

### JSON 序列化器 {id="register_json"}

<Tabs group="json-libraries">
<TabItem title="kotlinx.serialization" group-key="kotlinx">

若要在 WebSockets [配置](server-websockets.md#configure) 中註冊 JSON 序列化器，請建立一個帶有 `Json` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.kotlinx.*
import kotlinx.serialization.json.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Json)
}
```

</TabItem>
<TabItem title="Gson" group-key="gson">

若要註冊 Gson 序列化器，請將 `GsonWebsocketContentConverter` 指派給 `contentConverter` 屬性：
```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</TabItem>
<TabItem title="Jackson" group-key="jackson">

若要註冊 Jackson 序列化器，請將 `JacksonWebsocketContentConverter` 指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</TabItem>
</Tabs>

### XML 序列化器 {id="register_xml"}

若要在 WebSockets [配置](server-websockets.md#configure) 中註冊 XML 序列化器，請建立一個帶有 `XML` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：
```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBOR 序列化器 {id="register_cbor"}
若要在 WebSockets [配置](server-websockets.md#configure) 中註冊 CBOR 序列化器，請建立一個帶有 `Cbor` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBuf 序列化器 {id="register_protobuf"}
若要在 WebSockets [配置](server-websockets.md#configure) 中註冊 ProtoBuf 序列化器，請建立一個帶有 `ProtoBuf` 參數的 `KotlinxWebsocketSerializationConverter` 實例，並將此實例指派給 `contentConverter` 屬性：

```kotlin
import kotlinx.serialization.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## 接收與傳送資料 {id="receive_send_data"}

### 建立資料類別 {id="create_data_class"}
若要將訊框序列化/反序列化為物件或從物件序列化/反序列化訊框，您需要建立一個資料類別，例如：
```kotlin
data class Customer(val id: Int, val firstName: String, val lastName: String)
```

如果您使用 kotlinx.serialization，請確保此類別具有 `@Serializable` 註解：
```kotlin
@Serializable
data class Customer(val id: Int, val firstName: String, val lastName: String)
```

### 接收資料 {id="receive_data"}
若要接收並轉換文字訊框的內容，請呼叫 `receiveDeserialized` 函式，該函式接受一個資料類別作為參數：
```kotlin
webSocket("/customer") {
    val customer = receiveDeserialized<Customer>()
    println("伺服器已收到 ID 為 ${customer.id} 的客戶。")
}
```

若要從 [傳入](server-websockets.md#api-overview) 頻道接收反序列化訊框，請使用 [WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html) 函式。`WebsocketContentConverter` 可透過 `WebSocketServerSession.converter` 屬性取得。

### 傳送資料 {id="send_data"}
若要在文字訊框中傳遞資料物件，並使用 [指定格式](#configure_serializer)，您可以使用 `sendSerialized` 函式：

```kotlin
webSocket("/customer/1") {
    sendSerialized(Customer(1, "Jane", "Smith"))
}
```

> 您可以在此處找到完整範例：[server-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-serialization)。