[//]: # (title: Ktor 客户端中的 WebSockets 序列化)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-websockets-serialization"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

类似于 [ContentNegotiation](client-serialization.md) 插件，WebSockets 允许您以特定格式序列化/反序列化文本帧。Ktor 客户端开箱即用支持以下格式：JSON、XML、CBOR 和 ProtoBuf。

## 添加依赖 {id="add_dependencies"}

<include from="server-serialization.md" element-id="add_serialization_dependency"/>

## 配置序列化器 {id="configure_serializer"}

### JSON 序列化器 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

要在 WebSockets [配置](client-websockets.topic#install_plugin)中注册 JSON 序列化器，请创建一个带有 `Json` 参数的 `KotlinxWebsocketSerializationConverter` 实例，并将此实例分配给 `contentConverter` 属性：

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

要在 WebSockets [配置](client-websockets.topic#install_plugin)中注册 XML 序列化器，请创建一个带有 `XML` 参数的 `KotlinxWebsocketSerializationConverter` 实例，并将此实例分配给 `contentConverter` 属性：

```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBOR 序列化器 {id="register_cbor"}
要在 WebSockets [配置](client-websockets.topic#install_plugin)中注册 CBOR 序列化器，请创建一个带有 `Cbor` 参数的 `KotlinxWebsocketSerializationConverter` 实例，并将此实例分配给 `contentConverter` 属性：

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBuf 序列化器 {id="register_protobuf"}
要在 WebSockets [配置](client-websockets.topic#install_plugin)中注册 ProtoBuf 序列化器，请创建一个带有 `ProtoBuf` 参数的 `KotlinxWebsocketSerializationConverter` 实例，并将此实例分配给 `contentConverter` 属性：

```kotlin
import io.ktor.serialization.kotlinx.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## 接收和发送数据 {id="receive_send_data"}
### 创建数据类 {id="create_data_class"}

要将文本帧序列化为对象或从对象反序列化，您需要创建一个数据类，例如：

```kotlin
```
{src="snippets/client-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="13"}

如果您使用 kotlinx.serialization，请确保此数据类具有 `@Serializable` 注解：

```kotlin
```
{src="snippets/client-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="12-13"}

要了解更多关于 `kotlinx.serialization` 的信息，请参阅 [Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)。

### 发送数据 {id="send_data"}

要以 [指定格式](#configure_serializer) 在文本帧中发送 [类实例](#create_data_class)，请使用 `sendSerialized` 函数：

```kotlin
```
{src="snippets/client-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="26-28"}

### 接收数据 {id="receive_data"}

要接收和转换文本帧的内容，请调用接受数据类作为参数的 `receiveDeserialized` 函数：

```kotlin
```
{src="snippets/client-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="22-25"}

要从 [incoming](client-websockets.topic#incoming) 通道接收反序列化帧，请使用 [WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html) 函数。`WebsocketContentConverter` 可通过 `DefaultClientWebSocketSession.converter` 属性获得。

> 您可以在此处找到完整示例：[client-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-websockets-serialization)。