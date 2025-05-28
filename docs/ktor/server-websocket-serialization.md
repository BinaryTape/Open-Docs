[//]: # (title: Ktor 服务器中的 WebSockets 序列化)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="server-websockets-serialization"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

类似于 [ContentNegotiation](server-serialization.md) 插件，WebSockets 允许您以特定格式序列化和反序列化文本帧。Ktor 开箱即用地支持以下格式：JSON、XML、CBOR 和 ProtoBuf。

## 添加依赖项 {id="add_dependencies"}

<include from="server-serialization.md" element-id="add_serialization_dependency"/>

## 配置序列化器 {id="configure_serializer"}

### JSON 序列化器 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

要在 WebSockets [配置](server-websockets.md#configure)中注册 JSON 序列化器，请使用 `Json` 参数创建 `KotlinxWebsocketSerializationConverter` 实例，并将此实例分配给 `contentConverter` 属性：

```kotlin
import io.ktor.serialization.kotlinx.*
import kotlinx.serialization.json.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Json)
}
```

</tab>
<tab title="Gson" group-key="gson">

要注册 Gson 序列化器，请将 `GsonWebsocketContentConverter` 分配给 `contentConverter` 属性：
```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</tab>
<tab title="Jackson" group-key="jackson">

要注册 Jackson 序列化器，请将 `JacksonWebsocketContentConverter` 分配给 `contentConverter` 属性：

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</tab>
</tabs>

### XML 序列化器 {id="register_xml"}

要在 WebSockets [配置](server-websockets.md#configure)中注册 XML 序列化器，请使用 `XML` 参数创建 `KotlinxWebsocketSerializationConverter` 实例，并将此实例分配给 `contentConverter` 属性：
```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBOR 序列化器 {id="register_cbor"}
要在 WebSockets [配置](server-websockets.md#configure)中注册 CBOR 序列化器，请使用 `Cbor` 参数创建 `KotlinxWebsocketSerializationConverter` 实例，并将此实例分配给 `contentConverter` 属性：

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBuf 序列化器 {id="register_protobuf"}
要在 WebSockets [配置](server-websockets.md#configure)中注册 ProtoBuf 序列化器，请使用 `ProtoBuf` 参数创建 `KotlinxWebsocketSerializationConverter` 实例，并将此实例分配给 `contentConverter` 属性：

```kotlin
import kotlinx.serialization.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## 接收和发送数据 {id="receive_send_data"}

### 创建数据类 {id="create_data_class"}
要将帧序列化为对象或从对象反序列化帧，您需要创建一个数据类，例如：
```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="11"}

如果您使用 kotlinx.serialization，请确保此数据类带有 `@Serializable` 注解：
```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="10-11"}

### 接收数据 {id="receive_data"}
要接收和转换文本帧的内容，请调用接受数据类作为参数的 `receiveDeserialized` 函数：
```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="23-26"}

要从 [incoming](server-websockets.md#api-overview) 通道接收反序列化帧，请使用 [WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html) 函数。`WebsocketContentConverter` 可通过 `WebSocketServerSession.converter` 属性获得。

### 发送数据 {id="send_data"}
要使用 [指定格式](#configure_serializer) 在文本帧中传递数据对象，您可以使用 `sendSerialized` 函数：

```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="20-22"}

> 您可以在此处找到完整示例：[server-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-serialization)。