[//]: # (title: Ktor Clientでのコンテンツネゴシエーションとシリアライズ)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="artifact_name" value="ktor-client-content-negotiation"/>

<tldr>
<p>
<b>必須となる依存関係</b>: <code>io.ktor:ktor-client-content-negotiation</code>
</p>
<var name="example_name" value="client-json-kotlinx"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx">
            client-json-kotlinx
        </a>
    </p>
    
</tldr>

<link-summary>
ContentNegotiationプラグインは、クライアントとサーバー間のメディアタイプをネゴシエートすること、およびリクエストの送信とレスポンスの受信時にコンテンツを特定の形式でシリアライズ/デシリアライズすることという、2つの主要な目的を果たします。
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-content-negotiation/io.ktor.client.plugins.contentnegotiation/-content-negotiation)プラグインは、2つの主要な目的を果たします:
* クライアントとサーバー間でメディアタイプをネゴシエートすること。このために、`Accept`および`Content-Type`ヘッダーを使用します。
* [リクエスト](client-requests.md)の送信時と[レスポンス](client-responses.md)の受信時に、コンテンツを特定の形式でシリアライズ/デシリアライズすること。Ktorは以下の形式をそのままサポートしています: JSON、XML、CBOR、そしてProtoBuf。XMLシリアライザーは[JVM](client-engines.md)でのみサポートされることに注意してください。

> サーバー側では、Ktorはコンテンツのシリアライズ/デシリアライズのために[ContentNegotiation](server-serialization.md)プラグインを提供します。

## 依存関係の追加 {id="add_dependencies"}
### ContentNegotiation {id="add_content_negotiation_dependency"}

    <p>
        <code>ContentNegotiation</code>を使用するには、ビルドスクリプトに<code>ktor-client-content-negotiation</code>アーティファクトを含める必要があります:
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
        Ktorクライアントに必要なアーティファクトの詳細については、<Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法について学びます。">クライアントの依存関係の追加</Links>を参照してください。
    </p>
    

特定の形式のシリアライザーには追加のアーティファクトが必要であることに注意してください。例えば、kotlinx.serializationではJSON用に`ktor-serialization-kotlinx-json`の依存関係が必要です。含まれるアーティファクトに応じて、Ktorは自動的にデフォルトのシリアライザーを選択します。必要に応じて、シリアライザーを明示的に[指定](#configure_serializer)し、設定できます。

### シリアライズ {id="serialization_dependency"}

kotlinx.serializationコンバーターを使用する前に、[Setup](https://github.com/Kotlin/kotlinx.serialization#setup)セクションに記載されているようにKotlinシリアライズプラグインを追加する必要があります。

#### JSON {id="add_json_dependency"}

JSONデータをシリアライズ/デシリアライズするには、kotlinx.serialization、Gson、Jacksonのいずれかのライブラリを選択できます。

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

ビルドスクリプトに`ktor-serialization-kotlinx-json`アーティファクトを追加します:

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

ビルドスクリプトに`ktor-serialization-gson`アーティファクトを追加します:

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

ビルドスクリプトに`ktor-serialization-jackson`アーティファクトを追加します:

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

XMLをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-xml`を追加します:

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
    

> XMLシリアライズは`jsNode`ターゲットではサポートされていないことに注意してください。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBORをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-cbor`を追加します:

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

ProtoBufをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-protobuf`を追加します:

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
    

## ContentNegotiationのインストール {id="install_plugin"}

`ContentNegotiation`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内の`install`関数に渡します:

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation)
}
```
これで、必要なJSONシリアライザーを[設定](#configure_serializer)できます。

## シリアライザーの設定 {id="configure_serializer"}

### JSONシリアライザー {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

アプリケーションにJSONシリアライザーを登録するには、`json`メソッドを呼び出します:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

`json`コンストラクターでは、例えば[JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/) APIにアクセスできます:
[object Promise]

完全な例はこちらで見つけることができます: [client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)。

</tab>
<tab title="Gson" group-key="gson">

アプリケーションにGsonシリアライザーを登録するには、[gson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-gson/io.ktor.serialization.gson/gson.html)メソッドを呼び出します:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        gson()
    }
}
```

`gson`メソッドを使用すると、[GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html)が提供するシリアライズ設定を調整することもできます。

</tab>
<tab title="Jackson" group-key="jackson">

アプリケーションにJacksonシリアライザーを登録するには、[jackson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-jackson/io.ktor.serialization.jackson/jackson.html)メソッドを呼び出します:

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        jackson()
    }
}
```

`jackson`メソッドを使用すると、[ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html)が提供するシリアライズ設定を調整することもできます。

</tab>
</tabs>

### XMLシリアライザー {id="register_xml"}

アプリケーションにXMLシリアライザーを登録するには、`xml`メソッドを呼び出します:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        xml()
    }
}
```

`xml`メソッドを使用すると、XMLシリアライズ設定にアクセスすることもできます。例えば:

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

### CBORシリアライザー {id="register_cbor"}
アプリケーションにCBORシリアライザーを登録するには、`cbor`メソッドを呼び出します:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        cbor()
    }
}
```

`cbor`メソッドを使用すると、[CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/)が提供するCBORシリアライズ設定にアクセスすることもできます。例えば:

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

### ProtoBufシリアライザー {id="register_protobuf"}
アプリケーションにProtoBufシリアライザーを登録するには、`protobuf`メソッドを呼び出します:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        protobuf()
    }
}
```

`protobuf`メソッドを使用すると、[ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/)が提供するProtoBufシリアライズ設定にアクセスすることもできます。例えば:

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

## データの送受信 {id="receive_send_data"}
### データクラスの作成 {id="create_data_class"}

データを受信・送信するには、データクラスが必要です。例えば:
[object Promise]

kotlinx.serializationを使用する場合は、このクラスに`@Serializable`アノテーションが付いていることを確認してください:
[object Promise]

<snippet id="serialization_types">

kotlinx.serializationライブラリは以下の型のシリアライズ/デシリアライズをサポートしています:

- [組み込みクラス](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
- [シーケンス](https://kotlinlang.org/docs/sequences.html)のデシリアライズ
- [フロー](https://kotlinlang.org/docs/flow.html)のシリアライズ

</snippet>

### データの送信 {id="send_data"}

[クラスインスタンス](#create_data_class)を[リクエスト](client-requests.md)ボディ内でJSONとして送信するには、`setBody`関数を使ってそのインスタンスを割り当て、`contentType`を呼び出してコンテンツタイプを`application/json`に設定します:

[object Promise]

データをXMLまたはCBORとして送信するには、`contentType`をそれぞれ`ContentType.Application.Xml`または`ContentType.Application.Cbor`に設定します。

### データの受信 {id="receive_data"}

サーバーが`application/json`、`application/xml`、または`application/cbor`のコンテンツを含む[レスポンス](client-responses.md)を送信した場合、レスポンスペイロードを受信する関数（以下の例では`body`）のパラメータとして[データクラス](#create_data_class)を指定することでデシリアライズできます:
[object Promise]

完全な例はこちらで見つけることができます: [client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)。