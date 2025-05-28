[//]: # (title: Ktor ClientにおけるWebSocketsのシリアライズ)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-websockets-serialization"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[ContentNegotiation](client-serialization.md)プラグインと同様に、WebSocketsではテキストフレームを特定のフォーマットでシリアライズ/デシリアライズできます。Ktorクライアントは、JSON、XML、CBOR、ProtoBufといったフォーマットをすぐにサポートしています。

## 依存関係を追加 {id="add_dependencies"}

<include from="server-serialization.md" element-id="add_serialization_dependency"/>

## シリアライザーを構成する {id="configure_serializer"}

### JSONシリアライザー {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

WebSocketsの[構成](client-websockets.topic#install_plugin)でJSONシリアライザーを登録するには、`Json`パラメータを持つ`KotlinxWebsocketSerializationConverter`インスタンスを作成し、このインスタンスを`contentConverter`プロパティに割り当てます。

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

Gsonシリアライザーを登録するには、`GsonWebsocketContentConverter`を`contentConverter`プロパティに割り当てます。

```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</tab>
<tab title="Jackson" group-key="jackson">

Jacksonシリアライザーを登録するには、`JacksonWebsocketContentConverter`を`contentConverter`プロパティに割り当てます。

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</tab>
</tabs>

### XMLシリアライザー {id="register_xml"}

WebSocketsの[構成](client-websockets.topic#install_plugin)でXMLシリアライザーを登録するには、`XML`パラメータを持つ`KotlinxWebsocketSerializationConverter`インスタンスを作成し、このインスタンスを`contentConverter`プロパティに割り当てます。

```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBORシリアライザー {id="register_cbor"}
WebSocketsの[構成](client-websockets.topic#install_plugin)でCBORシリアライザーを登録するには、`Cbor`パラメータを持つ`KotlinxWebsocketSerializationConverter`インスタンスを作成し、このインスタンスを`contentConverter`プロパティに割り当てます。

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBufシリアライザー {id="register_protobuf"}
WebSocketsの[構成](client-websockets.topic#install_plugin)でProtoBufシリアライザーを登録するには、`ProtoBuf`パラメータを持つ`KotlinxWebsocketSerializationConverter`インスタンスを作成し、このインスタンスを`contentConverter`プロパティに割り当てます。

```kotlin
import io.ktor.serialization.kotlinx.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## データの受信と送信 {id="receive_send_data"}
### データクラスを作成する {id="create_data_class"}

テキストフレームをオブジェクトにシリアライズ/デシリアライズするには、以下のようなデータクラスを作成する必要があります。

```kotlin
```
{src="snippets/client-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="13"}

`kotlinx.serialization`を使用する場合、このクラスに`@Serializable`アノテーションが付いていることを確認してください。

```kotlin
```
{src="snippets/client-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="12-13"}

`kotlinx.serialization`の詳細については、[Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)を参照してください。

### データを送信する {id="send_data"}

[指定されたフォーマット](#configure_serializer)のテキストフレーム内で[クラスインスタンス](#create_data_class)を送信するには、`sendSerialized`関数を使用します。

```kotlin
```
{src="snippets/client-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="26-28"}

### データを受信する {id="receive_data"}

テキストフレームの内容を受信して変換するには、データクラスをパラメータとして受け取る`receiveDeserialized`関数を呼び出します。

```kotlin
```
{src="snippets/client-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="22-25"}

[incoming](client-websockets.topic#incoming)チャネルからデシリアライズされたフレームを受信するには、[WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html)関数を使用します。`WebsocketContentConverter`は`DefaultClientWebSocketSession.converter`プロパティを介して利用可能です。

> 完全なサンプルはこちらで確認できます: [client-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-websockets-serialization)。