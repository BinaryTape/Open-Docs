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
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">ネイティブサーバー</Links>サポート</b>: ✅
    </p>
    
</tldr>

<link-summary>
Ktorサーバー用の%plugin_name%プラグインを使用すると、値のリストをシリアライズおよびデシリアライズするためのカスタムコンバーターを追加できます。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-data-conversion/index.html)プラグインを使用すると、値のリストをシリアライズおよびデシリアライズできます。デフォルトでは、Ktorは[DefaultConversionService](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-default-conversion-service/index.html)を通じてプリミティブ型とEnumを処理します。`%plugin_name%`プラグインをインストールして構成することで、このサービスを拡張して追加の型を処理できます。

## 依存関係の追加 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
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
    

## %plugin_name%のインストール {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">モジュール</Links>の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ... <code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>内で。
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
    

## コンバーターの追加 {id="add-converters"}

%plugin_name%の設定内で型変換を定義できます。指定された型に対して`convert<T>`メソッドを提供し、利用可能な関数を使用して値のリストをシリアライズおよびデシリアライズします。

*   値のリストをデシリアライズするには、`decode()`関数を使用します。これは、URL内の繰り返し値を表す文字列のリストを受け取り、デコードされた値を返します。

  ```kotlin
  decode { values -> // converter: (values: List<String>) -> Any?
    //deserialize values
  }
  ```

*   値をシリアライズするには、`encode()`関数を使用します。この関数は任意の値を受け取り、それを表す文字列のリストを返します。

  ```kotlin
     encode { value -> // converter: (value: Any?) -> List<String>
       //serialize value
      }
  ```

## サービスへのアクセス

{id="service"}

現在のコンテキストから%plugin_name%サービスにアクセスできます。

```kotlin
val dataConversion = application.conversionService
```

その後、コンバーターサービスを使用してコールバック関数を呼び出すことができます。

*   `fromValues(values: List<String>, type: TypeInfo)`コールバック関数は、値のリストとして`values`を、値を変換する`TypeInfo`を受け取り、デコードされた値を返します。
*   `toValues(value: Any?)`コールバック関数は任意の値を受け取り、それを表す文字列のリストを返します。

## 例

以下の例では、`LocalDate`型のコンバーターが定義され、値のシリアライズおよびデシリアライズのために構成されています。`encode`関数が呼び出されると、サービスは`SimpleDateFormat`を使用して値を変換し、フォーマットされた値を含むリストを返します。
`decode`関数が呼び出されると、サービスは日付を`LocalDate`としてフォーマットし、それを返します。

[object Promise]

変換サービスは、エンコードおよびデコードされた値を取得するために手動で呼び出すことができます。

[object Promise]

完全な例については、[%example_name%](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%)を参照してください。