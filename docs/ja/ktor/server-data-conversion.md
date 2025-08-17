[//]: # (title: データ変換)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-data-conversion"/>
<var name="package_name" value="io.ktor.server.plugins.dataconversion"/>
<var name="plugin_name" value="DataConversion"/>
<var name="example_name" value="data-conversion"/>

<tldr>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

<link-summary>
Ktorサーバー用の`%plugin_name%`プラグインを使用すると、値のリストのシリアライズおよびデシリアライズのためのカスタムコンバーターを追加できます。
</link-summary>

[`%plugin_name%`](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-data-conversion/index.html)プラグインを使用すると、値のリストをシリアライズおよびデシリアライズできます。デフォルトでは、Ktorは[`DefaultConversionService`](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-default-conversion-service/index.html)を介してプリミティブ型と列挙型を処理します。このサービスを拡張して追加の型を処理するには、`%plugin_name%`プラグインをインストールして設定します。

## 依存関係を追加する {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、<code>%artifact_name%</code>アーティファクトをビルドスクリプトに含める必要があります。
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

## %plugin_name%をインストールする {id="install_plugin"}

<p>
    <code>%plugin_name%</code>プラグインをアプリケーションに<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
</p>
<list>
    <li>
        ...<code>embeddedServer</code>関数呼び出し内で。
    </li>
    <li>
        ...明示的に定義された<code>module</code>内。これは<code>Application</code>クラスの拡張関数です。
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

## コンバーターを追加する {id="add-converters"}

`%plugin_name%`の設定内で型変換を定義できます。指定された型に対して<code>convert<T></code>メソッドを提供し、利用可能な関数を使用して値のリストをシリアライズおよびデシリアライズします。

* `decode()`関数を使用して値のリストをデシリアライズします。これは、URL内の繰り返し値を表す文字列のリストを受け取り、デコードされた値を返します。

  ```kotlin
  decode { values -> // converter: (values: List<String>) -> Any?
    //値をデシリアライズする
  }
  ```

* `encode()`関数を使用して値をシリアライズします。この関数は任意の値をとり、それを表す文字列のリストを返します。

  ```kotlin
     encode { value -> // converter: (value: Any?) -> List<String>
       //値をシリアライズする
      }
  ```

## サービスにアクセスする

{id="service"}

現在のコンテキストから`%plugin_name%`サービスにアクセスできます。

```kotlin
val dataConversion = application.conversionService
```

その後、コンバーターサービスを使用してコールバック関数を呼び出すことができます。

* <code>fromValues(values: List<String>, type: TypeInfo)</code>コールバック関数は、<code>values</code>を文字列のリストとして、および値を変換するための<code>TypeInfo</code>を受け入れ、デコードされた値を返します。
* <code>toValues(value: Any?)</code>コールバック関数は、任意の値をとり、それを表す文字列のリストを返します。

## 例

以下の例では、<code>LocalDate</code>型のコンバーターが定義され、値のシリアライズおよびデシリアライズ用に設定されています。<code>encode</code>関数が呼び出されると、サービスは<code>SimpleDateFormat</code>を使用して値を変換し、フォーマットされた値を含むリストを返します。<code>decode</code>関数が呼び出されると、サービスは日付を<code>LocalDate</code>としてフォーマットし、それを返します。

```kotlin
    install(DataConversion) {
        convert<LocalDate> { // this: DelegatingConversionService
            val formatter = DateTimeFormatterBuilder()
                .appendValue(ChronoField.YEAR, 4, 4, SignStyle.NEVER)
                .appendValue(ChronoField.MONTH_OF_YEAR, 2)
                .appendValue(ChronoField.DAY_OF_MONTH, 2)
                .toFormatter(Locale.ROOT)

            decode { values -> // converter: (values: List<String>) -> Any?
                LocalDate.from(formatter.parse(values.single()))
            }

            encode { value -> // converter: (value: Any?) -> List<String>
                listOf(SimpleDateFormat.getInstance().format(value))
            }
        }
    }
```

変換サービスは、エンコードおよびデコードされた値を取得するために手動で呼び出すことができます。

```kotlin
val encodedDate = application.conversionService.toValues(call.parameters["date"])
val decodedDate = application.conversionService.fromValues(encodedDate, typeInfo<LocalDate>())
```

完全な例については、[`%example_name%`](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%)を参照してください。