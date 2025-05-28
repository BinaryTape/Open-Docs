[//]: # (title: Ktor 用戶端中的內容協商與序列化)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="artifact_name" value="ktor-client-content-negotiation"/>

<tldr>
<p>
<b>必備依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-json-kotlinx"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
ContentNegotiation 外掛有兩個主要目的：在用戶端和伺服器之間協商媒體類型，以及在傳送請求和接收回應時，以特定格式序列化/反序列化內容。
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-content-negotiation/io.ktor.client.plugins.contentnegotiation/-content-negotiation) 外掛有兩個主要目的：
* 在用戶端和伺服器之間協商媒體類型。為此，它使用 `Accept` 和 `Content-Type` 標頭。
* 在傳送[請求](client-requests.md)和接收[回應](client-responses.md)時，以特定格式序列化/反序列化內容。Ktor 開箱即用地支援以下格式：JSON、XML、CBOR 和 ProtoBuf。請注意，XML 序列化器僅在 [JVM](client-engines.md) 上受支援。

> 在伺服器端，Ktor 提供 [ContentNegotiation](server-serialization.md) 外掛用於內容的序列化/反序列化。

## 新增依賴項 {id="add_dependencies"}
### ContentNegotiation {id="add_content_negotiation_dependency"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

請注意，特定格式的序列化器需要額外的構件 (artifact)。例如，kotlinx.serialization 需要 `ktor-serialization-kotlinx-json` 依賴項用於 JSON。根據包含的構件，Ktor 會自動選擇預設序列化器。如果需要，您可以明確地[指定序列化器](#configure_serializer)並進行配置。

### 序列化 {id="serialization_dependency"}

在使用 kotlinx.serialization 轉換器之前，您需要如 [設定](https://github.com/Kotlin/kotlinx.serialization#setup) 部分所述，新增 Kotlin 序列化外掛。

#### JSON {id="add_json_dependency"}

為了序列化/反序列化 JSON 資料，您可以選擇以下函式庫之一：kotlinx.serialization、Gson 或 Jackson。

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

在建置腳本中新增 `ktor-serialization-kotlinx-json` 構件：

<var name="artifact_name" value="ktor-serialization-kotlinx-json"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
<tab title="Gson" group-key="gson">

在建置腳本中新增 `ktor-serialization-gson` 構件：

<var name="artifact_name" value="ktor-serialization-gson"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
<tab title="Jackson" group-key="jackson">

在建置腳本中新增 `ktor-serialization-jackson` 構件：

<var name="artifact_name" value="ktor-serialization-jackson"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
</tabs>

#### XML {id="add_xml_dependency"}

為了序列化/反序列化 XML，請在建置腳本中新增 `ktor-serialization-kotlinx-xml`：

<var name="artifact_name" value="ktor-serialization-kotlinx-xml"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

> 請注意，XML 序列化[不支援在 `jsNode` 目標上](https://github.com/pdvrieze/xmlutil/issues/83)。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

為了序列化/反序列化 CBOR，請在建置腳本中新增 `ktor-serialization-kotlinx-cbor`：

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### ProtoBuf {id="add_protobuf_dependency"}

為了序列化/反序列化 ProtoBuf，請在建置腳本中新增 `ktor-serialization-kotlinx-protobuf`：

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 ContentNegotiation {id="install_plugin"}

要安裝 `ContentNegotiation`，請將其傳遞給 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內的 `install` 函式：

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation)
}
```
現在您可以[配置](#configure_serializer)所需的 JSON 序列化器。

## 配置序列化器 {id="configure_serializer"}

### JSON 序列化器 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

要在您的應用程式中註冊 JSON 序列化器，請呼叫 `json` 方法：
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

在 `json` 建構式中，您可以存取 [JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/) API，例如：
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="24-31"}

您可以在這裡找到完整範例：[client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)。

</tab>
<tab title="Gson" group-key="gson">

要在您的應用程式中註冊 Gson 序列化器，請呼叫 [gson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-gson/io.ktor.serialization.gson/gson.html) 方法：
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        gson()
    }
}
```

`gson` 方法也允許您調整由 [GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html) 提供的序列化設定。

</tab>
<tab title="Jackson" group-key="jackson">

要在您的應用程式中註冊 Jackson 序列化器，請呼叫 [jackson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-jackson/io.ktor.serialization.jackson/jackson.html) 方法：

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

要在您的應用程式中註冊 XML 序列化器，請呼叫 `xml` 方法：
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
要在您的應用程式中註冊 CBOR 序列化器，請呼叫 `cbor` 方法：
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
要在您的應用程式中註冊 ProtoBuf 序列化器，請呼叫 `protobuf` 方法：
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

## 接收與傳送資料 {id="receive_send_data"}
### 建立資料類別 {id="create_data_class"}

要接收和傳送資料，您需要一個資料類別 (data class)，例如：
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="19"}

如果您使用 kotlinx.serialization，請確保此類別具有 `@Serializable` 註解：
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="18-19"}

<include from="server-serialization.md" element-id="serialization_types"/>

### 傳送資料 {id="send_data"}

要將一個[類別實例](#create_data_class)作為 JSON 在[請求](client-requests.md)內文中傳送，請使用 `setBody` 函式指派此實例，並透過呼叫 `contentType` 將內容類型設定為 `application/json`：

```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="33-36"}

要將資料以 XML 或 CBOR 格式傳送，請將 `contentType` 分別設定為 `ContentType.Application.Xml` 或 `ContentType.Application.Cbor`。

### 接收資料 {id="receive_data"}

當伺服器傳送內容為 `application/json`、`application/xml` 或 `application/cbor` 的[回應](client-responses.md)時，您可以透過將[資料類別](#create_data_class)指定為用於接收回應酬載 (以下範例中的 `body`) 的函式參數來反序列化它：
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="39"}

您可以在這裡找到完整範例：[client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)。