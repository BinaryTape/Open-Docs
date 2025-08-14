[//]: # (title: Ktor Server 中的內容協商與序列化)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="package_name" value="io.ktor.server.plugins.contentnegotiation"/>
<var name="artifact_name" value="ktor-server-content-negotiation"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links>支援</b>: ✅
    </p>
    
</tldr>

<link-summary>
ContentNegotiation 插件主要有兩個目的：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html) 插件主要有兩個目的：
*   協商客戶端與伺服器之間的媒體類型。為此，它使用 `Accept` 和 `Content-Type` 標頭。
*   以特定格式序列化/反序列化內容。Ktor 開箱即用支援以下格式：JSON、XML、CBOR 和 ProtoBuf。

> 在客戶端，Ktor 提供 [ContentNegotiation](client-serialization.md) 插件用於序列化/反序列化內容。

## 新增依賴項 {id="add_dependencies"}

### ContentNegotiation {id="add_content_negotiation_dependency"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
    </p>
    

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
    

請注意，特定格式的序列化器需要額外的 artifact。例如，kotlinx.serialization 針對 JSON 需要 `ktor-serialization-kotlinx-json` 依賴項。

### 序列化 {id="serialization_dependency"}

<snippet id="add_serialization_dependency">

在使用 kotlinx.serialization 轉換器之前，您需要如 [設定](https://github.com/Kotlin/kotlinx.serialization#setup) 部分所述新增 Kotlin 序列化插件。

#### JSON {id="add_json_dependency"}

若要序列化/反序列化 JSON 資料，您可以選擇以下函式庫之一：kotlinx.serialization、Gson 或 Jackson。

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

若要序列化/反序列化 XML，請在建置腳本中新增 `ktor-serialization-kotlinx-xml`：

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
    

> 請注意，XML 序列化 [在 `jsNode` 目標上不受支援](https://github.com/pdvrieze/xmlutil/issues/83)。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

若要序列化/反序列化 CBOR，請在建置腳本中新增 `ktor-serialization-kotlinx-cbor`：

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

若要序列化/反序列化 ProtoBuf，請在建置腳本中新增 `ktor-serialization-kotlinx-protobuf`：

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

## 安裝 ContentNegotiation {id="install_plugin"}

    <p>
        若要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式，
        請在指定的<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">模組</Links>中將其傳遞給 <code>install</code> 函式。
        以下程式碼片段顯示了如何安裝 <code>%plugin_name%</code>...
    </p>
    <list>
        <li>
            ...在 <code>embeddedServer</code> 函式呼叫內部。
        </li>
        <li>
            ...在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的擴展函式。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## 配置序列化器 {id="configure_serializer"}

Ktor 開箱即用支援以下格式：[JSON](#register_json)、[XML](#register_xml)、[CBOR](#register_cbor)。您也可以實作自己的自訂序列化器。

### JSON 序列化器 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

若要在您的應用程式中註冊 JSON 序列化器，請呼叫 `json` 方法：
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

install(ContentNegotiation) {
    json()
}
```

`json` 方法還允許您調整 [JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/) 提供的序列化設定，例如：

[object Promise]

</tab>
<tab title="Gson" group-key="gson">

若要在您的應用程式中註冊 Gson 序列化器，請呼叫 `gson` 方法：
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

install(ContentNegotiation) {
    gson()
}
```

`gson` 方法還允許您調整 [GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html) 提供的序列化設定，例如：

[object Promise]

</tab>
<tab title="Jackson" group-key="jackson">

若要在您的應用程式中註冊 Jackson 序列化器，請呼叫 `jackson` 方法：

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

install(ContentNegotiation) {
    jackson()
}
```

`jackson` 方法還允許您調整 [ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html) 提供的序列化設定，例如：

[object Promise]

</tab>
</tabs>

### XML 序列化器 {id="register_xml"}

若要在您的應用程式中註冊 XML 序列化器，請呼叫 `xml` 方法：
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

install(ContentNegotiation) {
    xml()
}
```

`xml` 方法還允許您存取 XML 序列化設定，例如：

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
若要在您的應用程式中註冊 CBOR 序列化器，請呼叫 `cbor` 方法：
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

install(ContentNegotiation) {
    cbor()
}
```

`cbor` 方法還允許您存取 [CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/) 提供的 CBOR 序列化設定，例如：

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
若要在您的應用程式中註冊 ProtoBuf 序列化器，請呼叫 `protobuf` 方法：
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

install(ContentNegotiation) {
    protobuf()
}
```

`protobuf` 方法還允許您存取 [ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/) 提供的 ProtoBuf 序列化設定，例如：

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

若要為指定的 `Content-Type` 註冊自訂序列化器，您需要呼叫 `register` 方法。在以下範例中，註冊了兩個[自訂序列化器](#implement_custom_serializer)來反序列化 `application/json` 和 `application/xml` 資料：

```kotlin
install(ContentNegotiation) {
    register(ContentType.Application.Json, CustomJsonConverter())
    register(ContentType.Application.Xml, CustomXmlConverter())
}
```

## 接收與傳送資料 {id="receive_send_data"}

### 建立一個 data class {id="create_data_class"}
若要將接收到的資料反序列化為物件，您需要建立一個 data class，例如：
[object Promise]

如果您使用 kotlinx.serialization，請確保此 class 具有 `@Serializable` 註解：
[object Promise]

<snippet id="serialization_types">

kotlinx.serialization 函式庫支援以下類型的序列化/反序列化：

- [內建類別 (Builtin classes)](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
- [序列 (Sequences)](https://kotlinlang.org/docs/sequences.html) 的反序列化
- [流 (Flows)](https://kotlinlang.org/docs/flow.html) 的序列化

</snippet>

### 接收資料 {id="receive_data"}
若要接收並轉換請求內容，請呼叫接受 data class 作為參數的 `receive` 方法：
[object Promise]

請求的 `Content-Type` 將用於選擇[序列化器](#configure_serializer)來處理請求。以下範例顯示了一個範例 [HTTP 客戶端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) 請求，其中包含 JSON 或 XML 資料，這些資料在伺服器端被轉換為 `Customer` 物件：

<tabs>
<tab title="JSON">

[object Promise]

</tab>
<tab title="XML">

[object Promise]

</tab>
</tabs>

您可以在此處找到完整範例：[json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)。

### 傳送資料 {id="send_data"}
若要在回應中傳遞資料物件，您可以使用 `respond` 方法：
[object Promise]

在此情況下，Ktor 使用 `Accept` 標頭來選擇所需的[序列化器](#configure_serializer)。您可以在此處找到完整範例：[json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)。

## 實作自訂序列化器 {id="implement_custom_serializer"}

在 Ktor 中，您可以編寫自己的[序列化器](#configure_serializer)來序列化/反序列化資料。為此，您需要實作 [ContentConverter](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-content-converter/index.html) 介面：
```kotlin
interface ContentConverter {
    suspend fun serialize(contentType: ContentType, charset: Charset, typeInfo: TypeInfo, value: Any): OutgoingContent?
    suspend fun deserialize(charset: Charset, typeInfo: TypeInfo, content: ByteReadChannel): Any?
}
```
請參考 [GsonConverter](https://github.com/ktorio/ktor/blob/main/ktor-shared/ktor-serialization/ktor-serialization-gson/jvm/src/GsonConverter.kt) 類別作為實作範例。