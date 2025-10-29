[//]: # (title: Ktor 伺服器中的內容協商與序列化)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="package_name" value="io.ktor.server.plugins.contentnegotiation"/>
<var name="artifact_name" value="ktor-server-content-negotiation"/>

<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native 並允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。">原生伺服器</Links>支援</b>: ✅
</p>
</tldr>

<link-summary>
ContentNegotiation 外掛程式有兩個主要目的：在客戶端與伺服器之間協商媒體類型，以及將內容序列化/反序列化為特定格式。
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html) 外掛程式有兩個主要目的：
* 在客戶端與伺服器之間協商媒體類型。為此，它使用 `Accept` 和 `Content-Type` 標頭。
* 以特定格式序列化/反序列化內容。Ktor 開箱即用支援以下格式：JSON、XML、CBOR 和 ProtoBuf。

> 在客戶端，Ktor 提供了 [ContentNegotiation](client-serialization.md) 外掛程式用於序列化/反序列化內容。

## 新增依賴 {id="add_dependencies"}

### ContentNegotiation {id="add_content_negotiation_dependency"}

<p>
    要使用 <code>%plugin_name%</code>，您需要將 <code>%artifact_name%</code> Artifact 包含在建構指令稿中：
</p>
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

請注意，特定格式的序列化器需要額外的 Artifact。例如，kotlinx.serialization 需要 `ktor-serialization-kotlinx-json` 依賴用於 JSON。

### 序列化 {id="serialization_dependency"}

<snippet id="add_serialization_dependency">

在使用 kotlinx.serialization 轉換器之前，您需要如 [設定](https://github.com/Kotlin/kotlinx.serialization#setup) 小節中所述新增 Kotlin 序列化外掛程式。

#### JSON {id="add_json_dependency"}

要序列化/反序列化 JSON 資料，您可以選擇以下其中一個函式庫：kotlinx.serialization、Gson 或 Jackson。 

<Tabs group="json-libraries">
<TabItem title="kotlinx.serialization" group-key="kotlinx">

在建構指令稿中新增 `ktor-serialization-kotlinx-json` Artifact：

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

在建構指令稿中新增 `ktor-serialization-gson` Artifact：

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

在建構指令稿中新增 `ktor-serialization-jackson` Artifact：

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

要序列化/反序列化 XML，請在建構指令稿中新增 `ktor-serialization-kotlinx-xml`：

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

> 請注意，`jsNode` 目標不支援 XML 序列化。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

要序列化/反序列化 CBOR，請在建構指令稿中新增 `ktor-serialization-kotlinx-cbor`：

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

要序列化/反序列化 ProtoBuf，請在建構指令稿中新增 `ktor-serialization-kotlinx-protobuf`：

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

</snippet>

## 安裝 ContentNegotiation {id="install_plugin"}

<p>
    要<a href="#install">安裝</a> <code>%plugin_name%</code> 外掛程式到應用程式，
    請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。
    以下程式碼片段展示如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，該 <code>module</code> 是 <code>Application</code> 類別的擴充函數。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## 配置序列化器 {id="configure_serializer"}

Ktor 開箱即用支援以下格式：[JSON](#register_json)、[XML](#register_xml)、[CBOR](#register_cbor)。您也可以實作自己的自訂序列化器。

### JSON 序列化器 {id="register_json"}

<Tabs group="json-libraries">
<TabItem title="kotlinx.serialization" group-key="kotlinx">

要在您的應用程式中註冊 JSON 序列化器，請呼叫 `json` 方法：
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

install(ContentNegotiation) {
    json()
}
```

`json` 方法也允許您調整由 [JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/) 提供的序列化設定，例如：

```kotlin

    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
```

</TabItem>
<TabItem title="Gson" group-key="gson">

要在您的應用程式中註冊 Gson 序列化器，請呼叫 `gson` 方法：
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

install(ContentNegotiation) {
    gson()
}
```

`gson` 方法也允許您調整由 [GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html) 提供的序列化設定，例如：

```kotlin
install(ContentNegotiation) {
    gson {
        registerTypeAdapter(LocalDate::class.java, LocalDateAdapter())
        setDateFormat(DateFormat.LONG, DateFormat.SHORT)
        setPrettyPrinting()
    }
```

</TabItem>
<TabItem title="Jackson" group-key="jackson">

要在您的應用程式中註冊 Jackson 序列化器，請呼叫 `jackson` 方法：

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

install(ContentNegotiation) {
    jackson()
}
```

`jackson` 方法也允許您調整由 [ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html) 提供的序列化設定，例如：

```kotlin
install(ContentNegotiation) {
    jackson {
        configure(SerializationFeature.INDENT_OUTPUT, true)
        setDefaultPrettyPrinter(DefaultPrettyPrinter().apply {
            indentArraysWith(DefaultPrettyPrinter.FixedSpaceIndenter.instance)
            indentObjectsWith(DefaultIndenter("  ", "
"))
        })
        registerModule(JavaTimeModule())  // support java.time.* types
    }
}
```

</TabItem>
</Tabs>

### XML 序列化器 {id="register_xml"}

要在您的應用程式中註冊 XML 序列化器，請呼叫 `xml` 方法：
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

install(ContentNegotiation) {
    xml()
}
```

`xml` 方法也允許您存取 XML 序列化設定，例如：

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*
import nl.adaptivity.xmlutil.*
import nl.adaptivity.xmlutil.serialization.*

install(ContentNegotiation) {
    xml(format = XML {
        xmlDeclMode = XmlDeclMode.Charset
    })
}
```

### CBOR 序列化器 {id="register_cbor"}
要在您的應用程式中註冊 CBOR 序列化器，請呼叫 `cbor` 方法：
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

install(ContentNegotiation) {
    cbor()
}
```

`cbor` 方法也允許您存取由 [CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/) 提供的 CBOR 序列化設定，例如：

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*
import kotlinx.serialization.cbor.*

install(ContentNegotiation) {
    cbor(Cbor {
        ignoreUnknownKeys = true
    })
}
```

### ProtoBuf 序列化器 {id="register_protobuf"}
要在您的應用程式中註冊 ProtoBuf 序列化器，請呼叫 `protobuf` 方法：
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

install(ContentNegotiation) {
    protobuf()
}
```

`protobuf` 方法也允許您存取由 [ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/) 提供的 ProtoBuf 序列化設定，例如：

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*
import kotlinx.serialization.protobuf.*

install(ContentNegotiation) {
    protobuf(ProtoBuf {
        encodeDefaults = true
    })
}
```

### 自訂序列化器 {id="register_custom"}

要為指定的 `Content-Type` 註冊自訂序列化器，您需要呼叫 `register` 方法。在下面的範例中，註冊了兩個 [自訂序列化器](#implement_custom_serializer) 以反序列化 `application/json` 和 `application/xml` 資料：

```kotlin
install(ContentNegotiation) {
    register(ContentType.Application.Json, CustomJsonConverter())
    register(ContentType.Application.Xml, CustomXmlConverter())
}
```

## 接收與傳送資料 {id="receive_send_data"}

### 建立資料類別 {id="create_data_class"}
要將接收到的資料反序列化為物件，您需要建立一個資料類別，例如：
```kotlin
@Serializable
```

如果您使用 kotlinx.serialization，請確保此類別具有 `@Serializable` 註解：
```kotlin
import kotlinx.serialization.*
import io.ktor.server.util.getValue

@Serializable
```

<snippet id="serialization_types">

kotlinx.serialization 函式庫支援以下類型的序列化/反序列化：

- [內建類別](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
- [序列](https://kotlinlang.org/docs/sequences.html) 的反序列化
- [流](https://kotlinlang.org/docs/flow.html) 的序列化

</snippet>

### 接收資料 {id="receive_data"}
要接收並轉換請求的內容，請呼叫接受資料類別作為參數的 `receive` 方法：
```kotlin

        post("/customer") {
            val customer = call.receive<Customer>()
            customerStorage.add(customer)
            call.respondText("Customer stored correctly", status = HttpStatusCode.Created)
```

請求的 `Content-Type` 將用於選擇[序列化器](#configure_serializer)來處理請求。以下範例展示了一個包含 JSON 或 XML 資料的 [HTTP 客戶端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) 請求範例，該請求在伺服器端會被轉換為 `Customer` 物件：

<Tabs>
<TabItem title="JSON">

```HTTP
POST http://0.0.0.0:8080/customer
Content-Type: application/json

{
  "id": 3,
  "firstName": "Jet",
  "lastName": "Brains"
}

```

</TabItem>
<TabItem title="XML">

```HTTP
POST http://0.0.0.0:8080/customer
Content-Type: application/xml

<Customer id="3" firstName="Jet" lastName="Brains"/>
```

</TabItem>
</Tabs>

您可以在這裡找到完整範例：[json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)。

### 傳送資料 {id="send_data"}
要在回應中傳遞資料物件，您可以使用 `respond` 方法：
```kotlin
routing {
    get("/customer/{id}") {
        val id: Int by call.parameters
        val customer: Customer = customerStorage.find { it.id == id }!!
        call.respond(customer)
```

在這種情況下，Ktor 使用 `Accept` 標頭來選擇所需的[序列化器](#configure_serializer)。您可以在這裡找到完整範例：[json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)。

## 實作自訂序列化器 {id="implement_custom_serializer"}

在 Ktor 中，您可以編寫自己的[序列化器](#configure_serializer)來序列化/反序列化資料。為此，您需要實作 [ContentConverter](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-content-converter/index.html) 介面：
```kotlin
interface ContentConverter {
    suspend fun serialize(contentType: ContentType, charset: Charset, typeInfo: TypeInfo, value: Any): OutgoingContent?
    suspend fun deserialize(charset: Charset, typeInfo: TypeInfo, content: ByteReadChannel): Any?
}
```
請參考 [GsonConverter](https://github.com/ktorio/ktor/blob/main/ktor-shared/ktor-serialization/ktor-serialization-gson/jvm/src/GsonConverter.kt) 類別作為實作範例。