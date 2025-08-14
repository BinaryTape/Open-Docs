[//]: # (title: KtorサーバーでのWebSocketシリアライゼーション)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="server-websockets-serialization"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[ContentNegotiation](server-serialization.md) プラグインと同様に、WebSockets では特定の形式でテキストフレームをシリアライズ/デシリアライズできます。Ktor は、JSON、XML、CBOR、ProtoBuf といった以下の形式を標準でサポートしています。

## 依存関係を追加する {id="add_dependencies"}

<snippet id="add_serialization_dependency">

kotlinx.serialization コンバーターを使用する前に、[セットアップ](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されているように、Kotlin シリアライゼーションプラグインを追加する必要があります。

#### JSON {id="add_json_dependency"}

JSON データをシリアライズ/デシリアライズするには、kotlinx.serialization、Gson、Jackson のいずれかのライブラリを選択できます。

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

ビルドスクリプトに `ktor-serialization-kotlinx-json` アーティファクトを追加します:

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

ビルドスクリプトに `ktor-serialization-gson` アーティファクトを追加します:

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

ビルドスクリプトに `ktor-serialization-jackson` アーティファクトを追加します:

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

XML をシリアライズ/デシリアライズするには、ビルドスクリプトに `ktor-serialization-kotlinx-xml` を追加します:

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
    

> XML シリアライゼーションは [`jsNode` ターゲットでサポートされていない](https://github.com/pdvrieze/xmlutil/issues/83) ことに注意してください。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBOR をシリアライズ/デシリアライズするには、ビルドスクリプトに `ktor-serialization-kotlinx-cbor` を追加します:

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

ProtoBuf をシリアライズ/デシリアライズするには、ビルドスクリプトに `ktor-serialization-kotlinx-protobuf` を追加します:

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

## シリアライザーの構成 {id="configure_serializer"}

### JSON シリアライザー {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

WebSockets の[設定](server-websockets.md#configure)で JSON シリアライザーを登録するには、`Json` パラメータを指定して `KotlinxWebsocketSerializationConverter` インスタンスを作成し、このインスタンスを `contentConverter` プロパティに割り当てます:

```kotlin
import io.ktor.serialization.kotlinx.*
import kotlinx.serialization.json.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Json)
}
```

</tab>
<tab title="Gson" group-key="gson">

Gson シリアライザーを登録するには、`GsonWebsocketContentConverter` を `contentConverter` プロパティに割り当てます:
```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</tab>
<tab title="Jackson" group-key="jackson">

Jackson シリアライザーを登録するには、`JacksonWebsocketContentConverter` を `contentConverter` プロパティに割り当てます:

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</tab>
</tabs>

### XML シリアライザー {id="register_xml"}

WebSockets の[設定](server-websockets.md#configure)で XML シリアライザーを登録するには、`XML` パラメータを指定して `KotlinxWebsocketSerializationConverter` インスタンスを作成し、このインスタンスを `contentConverter` プロパティに割り当てます:
```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBOR シリアライザー {id="register_cbor"}
WebSockets の[設定](server-websockets.md#configure)で CBOR シリアライザーを登録するには、`Cbor` パラメータを指定して `KotlinxWebsocketSerializationConverter` インスタンスを作成し、このインスタンスを `contentConverter` プロパティに割り当てます:

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBuf シリアライザー {id="register_protobuf"}
WebSockets の[設定](server-websockets.md#configure)で ProtoBuf シリアライザーを登録するには、`ProtoBuf` パラメータを指定して `KotlinxWebsocketSerializationConverter` インスタンスを作成し、このインスタンスを `contentConverter` プロパティに割り当てます:

```kotlin
import kotlinx.serialization.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## データの受信と送信 {id="receive_send_data"}

### データクラスの作成 {id="create_data_class"}
フレームをオブジェクトとの間でシリアライズ/デシリアライズするには、データクラスを作成する必要があります。例:
[object Promise]

kotlinx.serialization を使用する場合、このクラスに `@Serializable` アノテーションが付与されていることを確認してください:
[object Promise]

### データを受信する {id="receive_data"}
テキストフレームの内容を受信して変換するには、データクラスをパラメータとして受け取る `receiveDeserialized` 関数を呼び出します:
[object Promise]

[incoming](server-websockets.md#api-overview) チャネルからデシリアライズされたフレームを受信するには、[WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html) 関数を使用します。`WebsocketContentConverter` は `WebSocketServerSession.converter` プロパティを通じて利用できます。

### データを送信する {id="send_data"}
[指定された形式](#configure_serializer)を使用してデータオブジェクトをテキストフレームで渡すには、`sendSerialized` 関数を使用できます:

[object Promise]

> 完全なサンプルはこちらにあります: [server-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-serialization)。