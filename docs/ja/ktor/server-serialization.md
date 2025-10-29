[//]: # (title: Ktor Serverにおけるコンテンツネゴシエーションとシリアライゼーション)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="package_name" value="io.ktor.server.plugins.contentnegotiation"/>
<var name="artifact_name" value="ktor-server-content-negotiation"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>サポート</b>: ✅
</p>
</tldr>

<link-summary>
ContentNegotiationプラグインには主に2つの目的があります。クライアントとサーバー間のメディアタイプネゴシエーションと、特定のフォーマットでのコンテンツのシリアライゼーション/デシリアライゼーションです。
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html)プラグインには主に2つの目的があります。
* クライアントとサーバー間のメディアタイプをネゴシエーションする。これには`Accept`ヘッダーと`Content-Type`ヘッダーが使用されます。
* 特定のフォーマットでコンテンツをシリアライズ/デシリアライズする。Ktorは以下のフォーマットをそのままサポートしています: JSON、XML、CBOR、ProtoBuf。

> クライアント側では、Ktorはコンテンツのシリアライゼーション/デシリアライゼーションのために[ContentNegotiation](client-serialization.md)プラグインを提供しています。

## 依存関係の追加 {id="add_dependencies"}

### ContentNegotiation {id="add_content_negotiation_dependency"}

<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります:
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

特定のフォーマット用のシリアライザーには、追加のアーティファクトが必要となることに注意してください。たとえば、kotlinx.serializationではJSON用に`ktor-serialization-kotlinx-json`の依存関係が必要です。

### シリアライゼーション {id="serialization_dependency"}

<snippet id="add_serialization_dependency">

kotlinx.serializationコンバーターを使用する前に、[セットアップ](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されているように、Kotlin serializationプラグインを追加する必要があります。

#### JSON {id="add_json_dependency"}

JSONデータをシリアライズ/デシリアライズするには、kotlinx.serialization、Gson、Jacksonのいずれかのライブラリを選択できます。

<Tabs group="json-libraries">
<TabItem title="kotlinx.serialization" group-key="kotlinx">

ビルドスクリプトに`ktor-serialization-kotlinx-json`アーティファクトを追加します:

<var name="artifact_name" value="ktor-serialization-kotlinx-json"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

</TabItem>
<TabItem title="Gson" group-key="gson">

ビルドスクリプトに`ktor-serialization-gson`アーティファクトを追加します:

<var name="artifact_name" value="ktor-serialization-gson"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

</TabItem>
<TabItem title="Jackson" group-key="jackson">

ビルドスクリプトに`ktor-serialization-jackson`アーティファクトを追加します:

<var name="artifact_name" value="ktor-serialization-jackson"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

</TabItem>
</Tabs>

#### XML {id="add_xml_dependency"}

XMLをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-xml`を追加します:

<var name="artifact_name" value="ktor-serialization-kotlinx-xml"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

> XMLシリアライゼーションは[`jsNode`ターゲットでサポートされていません](https://github.com/pdvrieze/xmlutil/issues/83)のでご注意ください。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBORをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-cbor`を追加します:

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

#### ProtoBuf {id="add_protobuf_dependency"}

ProtoBufをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-protobuf`を追加します:

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

</snippet>

## ContentNegotiationのインストール {id="install_plugin"}

<p>
    アプリケーションに<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に<code>%plugin_name%</code>プラグインを渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出し内。
    </li>
    <li>
        ... <code>Application</code>クラスの拡張関数である明示的に定義された<code>module</code>内。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## シリアライザーの設定 {id="configure_serializer"}

Ktorは以下のフォーマットをそのままサポートしています: [JSON](#register_json)、[XML](#register_xml)、[CBOR](#register_cbor)。独自のカスタムシリアライザーを実装することもできます。

### JSONシリアライザー {id="register_json"}

<Tabs group="json-libraries">
<TabItem title="kotlinx.serialization" group-key="kotlinx">

アプリケーションでJSONシリアライザーを登録するには、`json`メソッドを呼び出します:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

install(ContentNegotiation) {
    json()
}
```

`json`メソッドでは、[JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/)によって提供されるシリアライゼーション設定を調整することもできます。例:

```kotlin

    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
```

</TabItem>
<TabItem title="Gson" group-key="gson">

アプリケーションでGsonシリアライザーを登録するには、`gson`メソッドを呼び出します:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

install(ContentNegotiation) {
    gson()
}
```

`gson`メソッドでは、[GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html)によって提供されるシリアライゼーション設定を調整することもできます。例:

```kotlin
install(ContentNegotiation) {
    gson {
        registerTypeAdapter(LocalDate::class.java, LocalDateAdapter())
        setDateFormat(DateFormat.LONG, DateFormat.SHORT)
        setPrettyPrinting()
    }
```

</TabItem>
<TabItem title="Jackson" group-key="jackson">

アプリケーションでJacksonシリアライザーを登録するには、`jackson`メソッドを呼び出します:

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

install(ContentNegotiation) {
    jackson()
}
```

`jackson`メソッドでは、[ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html)によって提供されるシリアライゼーション設定を調整することもできます。例:

```kotlin
install(ContentNegotiation) {
    jackson {
        configure(SerializationFeature.INDENT_OUTPUT, true)
        setDefaultPrettyPrinter(DefaultPrettyPrinter().apply {
            indentArraysWith(DefaultPrettyPrinter.FixedSpaceIndenter.instance)
            indentObjectsWith(DefaultIndenter("  ", "
"))
        })
        registerModule(JavaTimeModule())  // support java.time.* types
    }
}
```

</TabItem>
</Tabs>

### XMLシリアライザー {id="register_xml"}

アプリケーションでXMLシリアライザーを登録するには、`xml`メソッドを呼び出します:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

install(ContentNegotiation) {
    xml()
}
```

`xml`メソッドでは、XMLシリアライゼーション設定にアクセスすることもできます。例:

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
アプリケーションでCBORシリアライザーを登録するには、`cbor`メソッドを呼び出します:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

install(ContentNegotiation) {
    cbor()
}
```

`cbor`メソッドでは、[CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/)によって提供されるCBORシリアライゼーション設定にアクセスすることもできます。例:

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
アプリケーションでProtoBufシリアライザーを登録するには、`protobuf`メソッドを呼び出します:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

install(ContentNegotiation) {
    protobuf()
}
```

`protobuf`メソッドでは、[ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/)によって提供されるProtoBufシリアライゼーション設定にアクセスすることもできます。例:

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

指定された`Content-Type`にカスタムシリアライザーを登録するには、`register`メソッドを呼び出す必要があります。以下の例では、`application/json`および`application/xml`データをデシリアライズするために2つの[カスタムシリアライザー](#implement_custom_serializer)が登録されています:

```kotlin
install(ContentNegotiation) {
    register(ContentType.Application.Json, CustomJsonConverter())
    register(ContentType.Application.Xml, CustomXmlConverter())
}
```

## データの受信と送信 {id="receive_send_data"}

### データクラスの作成 {id="create_data_class"}
受信したデータをオブジェクトにデシリアライズするには、データクラスを作成する必要があります。例:
```kotlin
@Serializable
```

kotlinx.serializationを使用する場合、このクラスに`@Serializable`アノテーションが付いていることを確認してください:
```kotlin
import kotlinx.serialization.*
import io.ktor.server.util.getValue

@Serializable
```

<snippet id="serialization_types">

以下の型のシリアライゼーション/デシリアライゼーションは、kotlinx.serializationライブラリによってサポートされています:

- [組み込みクラス](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
- [シーケンス](https://kotlinlang.org/docs/sequences.html)のデシリアライゼーション
- [フロー](https://kotlinlang.org/docs/flow.html)のシリアライゼーション

</snippet>

### データの受信 {id="receive_data"}
リクエストのコンテンツを受信して変換するには、データクラスをパラメータとして受け取る`receive`メソッドを呼び出します:
```kotlin

        post("/customer") {
            val customer = call.receive<Customer>()
            customerStorage.add(customer)
            call.respondText("Customer stored correctly", status = HttpStatusCode.Created)
```

リクエストの`Content-Type`は、リクエストを処理するための[シリアライザー](#configure_serializer)を選択するために使用されます。以下の例は、JSONまたはXMLデータを含む[HTTPクライアント](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)リクエストが、サーバー側で`Customer`オブジェクトに変換される様子を示しています:

<Tabs>
<TabItem title="JSON">

```HTTP
POST http://0.0.0.0:8080/customer
Content-Type: application/json

{
  "id": 3,
  "firstName": "Jet",
  "lastName": "Brains"
}

```

</TabItem>
<TabItem title="XML">

```HTTP
POST http://0.0.0.0:8080/customer
Content-Type: application/xml

<Customer id="3" firstName="Jet" lastName="Brains"/>
```

</TabItem>
</Tabs>

完全な例は、[json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)で確認できます。

### データの送信 {id="send_data"}
レスポンスでデータオブジェクトを渡すには、`respond`メソッドを使用できます:
```kotlin
routing {
    get("/customer/{id}") {
        val id: Int by call.parameters
        val customer: Customer = customerStorage.find { it.id == id }!!
        call.respond(customer)
```

この場合、Ktorは`Accept`ヘッダーを使用して必要な[シリアライザー](#configure_serializer)を選択します。完全な例は、[json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)で確認できます。

## カスタムシリアライザーの実装 {id="implement_custom_serializer"}

Ktorでは、データのシリアライゼーション/デシリアライゼーションのために独自の[シリアライザー](#configure_serializer)を作成できます。これを行うには、[ContentConverter](https://api.ktor.io/ktor-serialization/io.ktor.serialization/-content-converter/index.html)インターフェースを実装する必要があります:
```kotlin
interface ContentConverter {
    suspend fun serialize(contentType: ContentType, charset: Charset, typeInfo: TypeInfo, value: Any): OutgoingContent?
    suspend fun deserialize(charset: Charset, typeInfo: TypeInfo, content: ByteReadChannel): Any?
}
```
実装例として、[GsonConverter](https://github.com/ktorio/ktor/blob/main/ktor-shared/ktor-serialization/ktor-serialization-gson/jvm/src/GsonConverter.kt)クラスを参照してください。