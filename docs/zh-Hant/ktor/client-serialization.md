[//]: # (title: Ktor 用戶端中的內容協商與序列化)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="artifact_name" value="ktor-client-content-negotiation"/>

<tldr>
<p>
<b>Required dependencies</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-json-kotlinx"/>

    <p>
        <b>Code example</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
ContentNegotiation 外掛程式主要有兩個目的：協商用戶端與伺服器之間的媒體類型，以及在傳送請求和接收回應時以特定格式序列化/反序列化內容。
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-content-negotiation/io.ktor.client.plugins.contentnegotiation/-content-negotiation) 外掛程式主要有兩個目的：
*   協商用戶端與伺服器之間的媒體類型。為此，它使用 `Accept` 和 `Content-Type` 標頭。
*   在傳送 [請求](client-requests.md) 和接收 [回應](client-responses.md) 時以特定格式序列化/反序列化內容。Ktor 支援以下開箱即用的格式：JSON、XML、CBOR 和 ProtoBuf。請注意，XML 序列化器僅在 [JVM](client-engines.md) 上支援。

> 在伺服器端，Ktor 提供 [ContentNegotiation](server-serialization.md) 外掛程式用於序列化/反序列化內容。

## 新增相依性 {id="add_dependencies"}
### ContentNegotiation {id="add_content_negotiation_dependency"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 成品：
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
    

    <p>
        您可以從 <Links href="/ktor/client-dependencies" summary="瞭解如何將用戶端相依性新增到現有專案。">新增用戶端相依性</Links> 中瞭解更多關於 Ktor 用戶端所需的成品。
    </p>
    

請注意，特定格式的序列化器需要額外的成品。例如，kotlinx.serialization 需要 JSON 的 `ktor-serialization-kotlinx-json` 相依性。根據包含的成品，Ktor 會自動選擇預設的序列化器。如有需要，您可以明確 [指定序列化器](#configure_serializer) 並進行配置。

### 序列化 {id="serialization_dependency"}

在使用 kotlinx.serialization 轉換器之前，您需要依照 [設定](https://github.com/Kotlin/kotlinx.serialization#setup) 部分的說明新增 Kotlin 序列化外掛程式。

#### JSON {id="add_json_dependency"}

若要序列化/反序列化 JSON 資料，您可以選擇以下其中一個函式庫：kotlinx.serialization、Gson 或 Jackson。

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

在建置腳本中新增 `ktor-serialization-kotlinx-json` 成品：

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

在建置腳本中新增 `ktor-serialization-gson` 成品：

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

在建置腳本中新增 `ktor-serialization-jackson` 成品：

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

若要序列化/反序列化 XML，在建置腳本中新增 `ktor-serialization-kotlinx-xml`：

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
    

> 請注意，XML 序列化 [在 `jsNode` 目標上不支援](https://github.com/pdvrieze/xmlutil/issues/83)。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

若要序列化/反序列化 CBOR，在建置腳本中新增 `ktor-serialization-kotlinx-cbor`：

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

若要序列化/反序列化 ProtoBuf，在建置腳本中新增 `ktor-serialization-kotlinx-protobuf`：

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
    

## 安裝 ContentNegotiation {id="install_plugin"}

若要安裝 `ContentNegotiation`，請將其傳遞給 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內的 `install` 函數：

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation)
}
```
現在您可以 [配置](#configure_serializer) 所需的 JSON 序列化器。

## 配置序列化器 {id="configure_serializer"}

### JSON 序列化器 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

若要在應用程式中註冊 JSON 序列化器，呼叫 `json` 方法：
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

在 `json` 建構函數中，您可以存取 [JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/) API，例如：
[object Promise]

您可以在此處找到完整範例：[client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)。

</tab>
<tab title="Gson" group-key="gson">

若要在應用程式中註冊 Gson 序列化器，呼叫 [gson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-gson/io.ktor.serialization.gson/gson.html) 方法：
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        gson()
    }
}
```

`gson` 方法也允許您調整由 [GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com/google/gson/GsonBuilder.html) 提供的序列化設定。

</tab>
<tab title="Jackson" group-key="jackson">

若要在應用程式中註冊 Jackson 序列化器，呼叫 [jackson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-jackson/io.ktor.serialization.jackson/jackson.html) 方法：

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        jackson()
    }
}
```

`jackson` 方法也允許您調整由 [ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html) 提供的序列化設定。

</tab>
</tabs>

### XML 序列化器 {id="register_xml"}

若要在應用程式中註冊 XML 序列化器，呼叫 `xml` 方法：
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        xml()
    }
}
```

`xml` 方法也允許您存取 XML 序列化設定，例如：

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*
import nl.adaptivity.xmlutil.*
import nl.adaptivity.xmlutil.serialization.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        xml(format = XML {
            xmlDeclMode = XmlDeclMode.Charset
        })
    }
}
```

### CBOR 序列化器 {id="register_cbor"}
若要在應用程式中註冊 CBOR 序列化器，呼叫 `cbor` 方法：
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        cbor()
    }
}
```

`cbor` 方法也允許您存取由 [CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/) 提供的 CBOR 序列化設定，例如：

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*
import kotlinx.serialization.cbor.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        cbor(Cbor {
            ignoreUnknownKeys = true
        })
    }
}
```

### ProtoBuf 序列化器 {id="register_protobuf"}
若要在應用程式中註冊 ProtoBuf 序列化器，呼叫 `protobuf` 方法：
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        protobuf()
    }
}
```

`protobuf` 方法也允許您存取由 [ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/) 提供的 ProtoBuf 序列化設定，例如：

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*
import kotlinx.serialization.protobuf.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        protobuf(ProtoBuf {
            encodeDefaults = true
        })
    }
}
```

## 接收和傳送資料 {id="receive_send_data"}
### 建立資料類別 {id="create_data_class"}

若要接收和傳送資料，您需要有一個資料類別，例如：
[object Promise]

如果您使用 kotlinx.serialization，請確保此類別具有 `@Serializable` 註解：
[object Promise]

<snippet id="serialization_types">

kotlinx.serialization 函式庫支援以下類型的序列化/反序列化：

- [內建類別](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
- [序列](https://kotlinlang.org/docs/sequences.html) 的反序列化
- [流](https://kotlinlang.org/docs/flow.html) 的序列化

</snippet>

### 傳送資料 {id="send_data"}

若要以 JSON 格式在 [請求](client-requests.md) 主體中傳送 [類別實例](#create_data_class)，請使用 `setBody` 函數指派此實例，並透過呼叫 `contentType` 將內容類型設定為 `application/json`：

[object Promise]

若要以 XML 或 CBOR 格式傳送資料，請分別將 `contentType` 設定為 `ContentType.Application.Xml` 或 `ContentType.Application.Cbor`。

### 接收資料 {id="receive_data"}

當伺服器傳送包含 `application/json`、`application/xml` 或 `application/cbor` 內容的 [回應](client-responses.md) 時，您可以透過指定 [資料類別](#create_data_class) 作為用於接收回應承載 (`body` 在以下範例中) 的函數參數來反序列化它：
[object Promise]

您可以在此處找到完整範例：[client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)。