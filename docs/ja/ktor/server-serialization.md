[//]: # (title: Ktorサーバーにおけるコンテンツネゴシエーションとシリアライゼーション)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="package_name" value="io.ktor.server.plugins.contentnegotiation"/>
<var name="artifact_name" value="ktor-server-content-negotiation"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
    </p>
    
</tldr>

<link-summary>
ContentNegotiationプラグインには主に2つの目的があります。それは、クライアントとサーバー間でメディアタイプをネゴシエートすること、およびコンテンツを特定の形式でシリアライズ/デシリアライズすることです。
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html)プラグインには主に2つの目的があります。
* クライアントとサーバー間でメディアタイプをネゴシエートすること。この目的のために、`Accept`ヘッダーと`Content-Type`ヘッダーを使用します。
* コンテンツを特定の形式でシリアライズ/デシリアライズすること。Ktorは以下の形式をすぐに利用できる形でサポートしています: JSON、XML、CBOR、ProtoBuf。

> クライアント側では、Ktorはコンテンツをシリアライズ/デシリアライズするための[ContentNegotiation](client-serialization.md)プラグインを提供しています。

## 依存関係の追加 {id="add_dependencies"}

### ContentNegotiation {id="add_content_negotiation_dependency"}

    <p>
        <code>%plugin_name%</code>を使用するには、<code>%artifact_name%</code>アーティファクトをビルドスクリプトに含める必要があります。
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
    

なお、特定の形式のシリアライザーには追加のアーティファクトが必要です。例えば、kotlinx.serializationではJSONに`ktor-serialization-kotlinx-json`依存関係が必要です。

### Serialization {id="serialization_dependency"}

<snippet id="add_serialization_dependency">

kotlinx.serializationコンバーターを使用する前に、[Setup](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されているようにKotlinシリアライゼーションプラグインを追加する必要があります。

#### JSON {id="add_json_dependency"}

JSONデータをシリアライズ/デシリアライズするには、kotlinx.serialization、Gson、Jacksonのいずれかのライブラリを選択できます。

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

<code>ktor-serialization-kotlinx-json</code>アーティファクトをビルドスクリプトに追加してください:

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

<code>ktor-serialization-gson</code>アーティファクトをビルドスクリプトに追加してください:

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

<code>ktor-serialization-jackson</code>アーティファクトをビルドスクリプトに追加してください:

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

XMLをシリアライズ/デシリアライズするには、<code>ktor-serialization-kotlinx-xml</code>をビルドスクリプトに追加してください:

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
    

> なお、XMLシリアライゼーションは[<code>jsNode</code>ターゲットではサポートされていません](https://github.com/pdvrieze/xmlutil/issues/83)。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBORをシリアライズ/デシリアライズするには、<code>ktor-serialization-kotlinx-cbor</code>をビルドスクリプトに追加してください:

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

ProtoBufをシリアライズ/デシリアライズするには、<code>ktor-serialization-kotlinx-protobuf</code>をビルドスクリプトに追加してください:

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

## ContentNegotiationのインストール {id="install_plugin"}

    <p>
        <code>%plugin_name%</code>プラグインをアプリケーションに<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ... 明示的に定義された<code>module</code>（<code>Application</code>クラスの拡張関数）内で。
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
    

## シリアライザーの構成 {id="configure_serializer"}

Ktorは以下の形式をすぐに利用できる形でサポートしています: [JSON](#register_json)、[XML](#register_xml)、[CBOR](#register_cbor)。また、独自のカスタムシリアライザーを実装することもできます。

### JSONシリアライザー {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

アプリケーションにJSONシリアライザーを登録するには、<code>json</code>メソッドを呼び出します:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

install(ContentNegotiation) {
    json()
}
```

<code>json</code>メソッドは、[JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/)によって提供されるシリアライゼーション設定を調整することもできます。例えば:

[object Promise]

</tab>
<tab title="Gson" group-key="gson">

アプリケーションにGsonシリアライザーを登録するには、<code>gson</code>メソッドを呼び出します:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

install(ContentNegotiation) {
    gson()
}
```

<code>gson</code>メソッドは、[GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html)によって提供されるシリアライゼーション設定を調整することもできます。例えば:

[object Promise]

</tab>
<tab title="Jackson" group-key="jackson">

アプリケーションにJacksonシリアライザーを登録するには、<code>jackson</code>メソッドを呼び出します:

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

install(ContentNegotiation) {
    jackson()
}
```

<code>jackson</code>メソッドは、[ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html)によって提供されるシリアライゼーション設定を調整することもできます。例えば:

[object Promise]

</tab>
</tabs>

### XMLシリアライザー {id="register_xml"}

アプリケーションにXMLシリアライザーを登録するには、<code>xml</code>メソッドを呼び出します:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

install(ContentNegotiation) {
    xml()
}
```

<code>xml</code>メソッドは、XMLシリアライゼーション設定にアクセスすることもできます。例えば:

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

### CBORシリアライザー {id="register_cbor"}
アプリケーションにCBORシリアライザーを登録するには、<code>cbor</code>メソッドを呼び出します:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

install(ContentNegotiation) {
    cbor()
}
```

<code>cbor</code>メソッドは、[CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/)によって提供されるCBORシリアライゼーション設定にアクセスすることもできます。例えば:

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

### ProtoBufシリアライザー {id="register_protobuf"}
アプリケーションにProtoBufシリアライザーを登録するには、<code>protobuf</code>メソッドを呼び出します:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

install(ContentNegotiation) {
    protobuf()
}
```

<code>protobuf</code>メソッドは、[ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/)によって提供されるProtoBufシリアライゼーション設定にアクセスすることもできます。例えば:

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

### カスタムシリアライザー {id="register_custom"}

指定された<code>Content-Type</code>にカスタムシリアライザーを登録するには、<code>register</code>メソッドを呼び出す必要があります。以下の例では、<code>application/json</code>データと<code>application/xml</code>データをデシリアライズするために、2つの[カスタムシリアライザー](#implement_custom_serializer)が登録されています:

```kotlin
install(ContentNegotiation) {
    register(ContentType.Application.Json, CustomJsonConverter())
    register(ContentType.Application.Xml, CustomXmlConverter())
}
```

## データの受信と送信 {id="receive_send_data"}

### データクラスの作成 {id="create_data_class"}
受信したデータをオブジェクトにデシリアライズするには、データクラスを作成する必要があります。例えば:
[object Promise]

kotlinx.serializationを使用する場合、このクラスに<code>@Serializable</code>アノテーションがあることを確認してください:
[object Promise]

<snippet id="serialization_types">

以下の型のシリアライズ/デシリアライズは、kotlinx.serializationライブラリによってサポートされています:

- [組み込みクラス](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
- [シーケンス](https://kotlinlang.org/docs/sequences.html)のデシリアライズ
- [フロー](https://kotlinlang.org/docs/flow.html)のシリアライズ

</snippet>

### データの受信 {id="receive_data"}
リクエストのコンテンツを受信して変換するには、データクラスをパラメーターとして受け入れる<code>receive</code>メソッドを呼び出します:
[object Promise]

リクエストの<code>Content-Type</code>は、リクエストを処理するための[シリアライザー](#configure_serializer)を選択するために使用されます。以下の例は、JSONまたはXMLデータを含むサンプル[HTTPクライアント](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)リクエストが、サーバー側で<code>Customer</code>オブジェクトに変換される様子を示しています:

<tabs>
<tab title="JSON">

[object Promise]

</tab>
<tab title="XML">

[object Promise]

</tab>
</tabs>

完全な例はこちらで確認できます: [json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)。

### データの送信 {id="send_data"}
レスポンスでデータオブジェクトを渡すには、<code>respond</code>メソッドを使用できます:
[object Promise]

この場合、Ktorは<code>Accept</code>ヘッダーを使用して必要な[シリアライザー](#configure_serializer)を選択します。完全な例はこちらで確認できます: [json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)。

## カスタムシリアライザーの実装 {id="implement_custom_serializer"}

Ktorでは、データをシリアライズ/デシリアライズするために独自の[シリアライザー](#configure_serializer)を作成できます。これを行うには、[ContentConverter](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-content-converter/index.html)インターフェースを実装する必要があります:
```kotlin
interface ContentConverter {
    suspend fun serialize(contentType: ContentType, charset: Charset, typeInfo: TypeInfo, value: Any): OutgoingContent?
    suspend fun deserialize(charset: Charset, typeInfo: TypeInfo, content: ByteReadChannel): Any?
}
```
[GsonConverter](https://github.com/ktorio/ktor/blob/main/ktor-shared/ktor-serialization/ktor-serialization-gson/jvm/src/GsonConverter.kt)クラスを実装例として参考にしてください。