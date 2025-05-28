[//]: # (title: Ktor 客户端中的内容协商与序列化)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="artifact_name" value="ktor-client-content-negotiation"/>

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-json-kotlinx"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
ContentNegotiation 插件主要有两个目的：协商客户端和服务器之间的媒体类型，以及在发送请求和接收响应时以特定格式序列化/反序列化内容。
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-content-negotiation/io.ktor.client.plugins.contentnegotiation/-content-negotiation) 插件主要有两个目的：
*   协商客户端和服务器之间的媒体类型。为此，它使用 `Accept` 和 `Content-Type` 头。
*   在发送[请求](client-requests.md)和接收[响应](client-responses.md)时，以特定格式序列化/反序列化内容。Ktor 开箱即用地支持以下格式：JSON、XML、CBOR 和 ProtoBuf。请注意，XML 序列化器仅在 [JVM](client-engines.md) 上受支持。

> 在服务器端，Ktor 提供了 [ContentNegotiation](server-serialization.md) 插件用于序列化/反序列化内容。

## 添加依赖项 {id="add_dependencies"}
### ContentNegotiation {id="add_content_negotiation_dependency"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

请注意，特定格式的序列化器需要额外的工件。例如，kotlinx.serialization 的 JSON 需要 `ktor-serialization-kotlinx-json` 依赖项。Ktor 会根据包含的工件自动选择默认序列化器。如果需要，你可以显式[指定序列化器](#configure_serializer)并进行配置。

### 序列化 {id="serialization_dependency"}

在使用 kotlinx.serialization 转换器之前，你需要按照 [Setup](https://github.com/Kotlin/kotlinx.serialization#setup) 部分的说明添加 Kotlin 序列化插件。

#### JSON {id="add_json_dependency"}

要序列化/反序列化 JSON 数据，你可以选择以下库之一：kotlinx.serialization、Gson 或 Jackson。

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

在构建脚本中添加 `ktor-serialization-kotlinx-json` 工件：

<var name="artifact_name" value="ktor-serialization-kotlinx-json"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
<tab title="Gson" group-key="gson">

在构建脚本中添加 `ktor-serialization-gson` 工件：

<var name="artifact_name" value="ktor-serialization-gson"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
<tab title="Jackson" group-key="jackson">

在构建脚本中添加 `ktor-serialization-jackson` 工件：

<var name="artifact_name" value="ktor-serialization-jackson"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
</tabs>

#### XML {id="add_xml_dependency"}

要序列化/反序列化 XML，请在构建脚本中添加 `ktor-serialization-kotlinx-xml`：

<var name="artifact_name" value="ktor-serialization-kotlinx-xml"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

> 请注意，XML 序列化[在 `jsNode` 目标上不受支持](https://github.com/pdvrieze/xmlutil/issues/83)。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

要序列化/反序列化 CBOR，请在构建脚本中添加 `ktor-serialization-kotlinx-cbor`：

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### ProtoBuf {id="add_protobuf_dependency"}

要序列化/反序列化 ProtoBuf，请在构建脚本中添加 `ktor-serialization-kotlinx-protobuf`：

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 ContentNegotiation {id="install_plugin"}

要安装 `ContentNegotiation`，请在[客户端配置块](client-create-and-configure.md#configure-client)中将其传递给 `install` 函数：

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation)
}
```
现在你可以[配置](#configure_serializer)所需的 JSON 序列化器了。

## 配置序列化器 {id="configure_serializer"}

### JSON 序列化器 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

要在你的应用程序中注册 JSON 序列化器，请调用 `json` 方法：
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

在 `json` 构造函数中，你可以访问 [JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/) API，例如：
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="24-31"}

你可以在此处找到完整的示例：[client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)。

</tab>
<tab title="Gson" group-key="gson">

要在你的应用程序中注册 Gson 序列化器，请调用 [gson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-gson/io.ktor.serialization.gson/gson.html) 方法：
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        gson()
    }
}
```

`gson` 方法还允许你调整由 [GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html) 提供的序列化设置。

</tab>
<tab title="Jackson" group-key="jackson">

要在你的应用程序中注册 Jackson 序列化器，请调用 [jackson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-jackson/io.ktor.serialization.jackson/jackson.html) 方法：

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        jackson()
    }
}
```

`jackson` 方法还允许你调整由 [ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html) 提供的序列化设置。

</tab>
</tabs>

### XML 序列化器 {id="register_xml"}

要在你的应用程序中注册 XML 序列化器，请调用 `xml` 方法：
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        xml()
    }
}
```

`xml` 方法还允许你访问 XML 序列化设置，例如：

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
要在你的应用程序中注册 CBOR 序列化器，请调用 `cbor` 方法：
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        cbor()
    }
}
```

`cbor` 方法还允许你访问由 [CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/) 提供的 CBOR 序列化设置，例如：

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
要在你的应用程序中注册 ProtoBuf 序列化器，请调用 `protobuf` 方法：
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        protobuf()
    }
}
```

`protobuf` 方法还允许你访问由 [ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/) 提供的 ProtoBuf 序列化设置，例如：

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

## 接收和发送数据 {id="receive_send_data"}
### 创建数据类 {id="create_data_class"}

要接收和发送数据，你需要一个数据类，例如：
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="19"}

如果你使用 kotlinx.serialization，请确保此数据类带有 `@Serializable` 注解：
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="18-19"}

<include from="server-serialization.md" element-id="serialization_types"/>

### 发送数据 {id="send_data"}

要将[类实例](#create_data_class)作为 JSON 包含在[请求](client-requests.md)体中发送，请使用 `setBody` 函数赋值此实例，并通过调用 `contentType` 将内容类型设置为 `application/json`：

```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="33-36"}

要将数据作为 XML 或 CBOR 发送，请分别将 `contentType` 设置为 `ContentType.Application.Xml` 或 `ContentType.Application.Cbor`。

### 接收数据 {id="receive_data"}

当服务器发送带有 `application/json`、`application/xml` 或 `application/cbor` 内容的[响应](client-responses.md)时，你可以通过指定一个[数据类](#create_data_class)作为用于接收响应负载的函数（以下示例中的 `body`）的参数来反序列化它：
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="39"}

你可以在此处找到完整的示例：[client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)。