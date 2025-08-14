[//]: # (title: Ktor Server 中的 WebSockets 序列化)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="server-websockets-serialization"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

类似于 [ContentNegotiation](server-serialization.md) 插件，WebSockets 允许你以特定格式序列化/反序列化文本帧。Ktor 开箱即用地支持以下格式：JSON、XML、CBOR 和 ProtoBuf。

## 添加依赖项 {id="add_dependencies"}

<snippet id="add_serialization_dependency">

在使用 kotlinx.serialization 转换器之前，你需要按照 [Setup](https://github.com/Kotlin/kotlinx.serialization#setup) 部分所述，添加 Kotlin 序列化插件。

#### JSON {id="add_json_dependency"}

要序列化/反序列化 JSON 数据，你可以选择以下库之一：kotlinx.serialization、Gson 或 Jackson。

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

在构建脚本中添加 `ktor-serialization-kotlinx-json` artifact：

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

在构建脚本中添加 `ktor-serialization-gson` artifact：

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

在构建脚本中添加 `ktor-serialization-jackson` artifact：

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

要序列化/反序列化 XML，请在构建脚本中添加 `ktor-serialization-kotlinx-xml`：

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
    

> 请注意，XML 序列化[在 `jsNode` 目标平台不受支持](https://github.com/pdvrieze/xmlutil/issues/83)。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

要序列化/反序列化 CBOR，请在构建脚本中添加 `ktor-serialization-kotlinx-cbor`：

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

要序列化/反序列化 ProtoBuf，请在构建脚本中添加 `ktor-serialization-kotlinx-protobuf`：

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

## 配置序列化器 {id="configure_serializer"}

### JSON 序列化器 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

要在 WebSockets [配置](server-websockets.md#configure)中注册 JSON 序列化器，请创建一个带有 `Json` 参数的 `KotlinxWebsocketSerializationConverter` 实例，并将此实例赋值给 `contentConverter` 属性：

```kotlin
import io.ktor.serialization.kotlinx.*
import kotlinx.serialization.json.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Json)
}
```

</tab>
<tab title="Gson" group-key="gson">

要注册 Gson 序列化器，请将 `GsonWebsocketContentConverter` 赋值给 `contentConverter` 属性：
```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</tab>
<tab title="Jackson" group-key="jackson">

要注册 Jackson 序列化器，请将 `JacksonWebsocketContentConverter` 赋值给 `contentConverter` 属性：

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</tab>
</tabs>

### XML 序列化器 {id="register_xml"}

要在 WebSockets [配置](server-websockets.md#configure)中注册 XML 序列化器，请创建一个带有 `XML` 参数的 `KotlinxWebsocketSerializationConverter` 实例，并将此实例赋值给 `contentConverter` 属性：
```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBOR 序列化器 {id="register_cbor"}
要在 WebSockets [配置](server-websockets.md#configure)中注册 CBOR 序列化器，请创建一个带有 `Cbor` 参数的 `KotlinxWebsocketSerializationConverter` 实例，并将此实例赋值给 `contentConverter` 属性：

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBuf 序列化器 {id="register_protobuf"}
要在 WebSockets [配置](server-websockets.md#configure)中注册 ProtoBuf 序列化器，请创建一个带有 `ProtoBuf` 参数的 `KotlinxWebsocketSerializationConverter` 实例，并将此实例赋值给 `contentConverter` 属性：

```kotlin
import kotlinx.serialization.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## 接收和发送数据 {id="receive_send_data"}

### 创建数据类 {id="create_data_class"}
要将帧序列化为对象或从对象反序列化帧，你需要创建一个数据类，例如：
[object Promise]

如果你使用 kotlinx.serialization，请确保此数据类带有 `@Serializable` 注解：
[object Promise]

### 接收数据 {id="receive_data"}
要接收和转换文本帧的内容，请调用 `receiveDeserialized` 函数，该函数接受一个数据类作为形参：
[object Promise]

要从 [incoming](server-websockets.md#api-overview) 通道接收反序列化的帧，请使用 [WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html) 函数。`WebsocketContentConverter` 可通过 `WebSocketServerSession.converter` 属性获取。

### 发送数据 {id="send_data"}
要在文本帧中传递数据对象并使用 [指定格式](#configure_serializer)，你可以使用 `sendSerialized` 函数：

[object Promise]

> 你可以在此处找到完整示例：[server-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-serialization)。