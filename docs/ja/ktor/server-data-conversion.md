[//]: # (title: データ変換)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-data-conversion"/>
<var name="package_name" value="io.ktor.server.plugins.dataconversion"/>
<var name="plugin_name" value="DataConversion"/>
<var name="example_name" value="data-conversion"/>

<tldr>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
Ktorサーバーの%plugin_name%プラグインを使用すると、値のリストをシリアライズおよびデシリアライズするためのカスタムコンバーターを追加できます。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-data-conversion/index.html)プラグインを使用すると、値のリストをシリアライズおよびデシリアライズできます。デフォルトでは、Ktorは[DefaultConversionService](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-default-conversion-service/index.html)を介してプリミティブ型とEnumを処理します。%plugin_name%プラグインをインストールして構成することで、このサービスを拡張して追加の型を処理できます。

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name%のインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## コンバーターの追加 {id="add-converters"}

%plugin_name%の構成内で型変換を定義できます。指定された型に対して`convert<T>`メソッドを提供し、利用可能な関数を使用して値のリストをシリアライズおよびデシリアライズします。

*   `decode()`関数を使用して値のリストをデシリアライズします。これは、URL内の繰り返された値を表す文字列のリストを受け取り、デコードされた値を返します。

    ```kotlin
    decode { values -> // converter: (values: List<String>) -> Any?
      //deserialize values
    }
    ```

*   `encode()`関数を使用して値をシリアライズします。この関数は任意の値を引数にとり、それを表す文字列のリストを返します。

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

次に、コンバーターサービスを使用してコールバック関数を呼び出すことができます。

*   `fromValues(values: List<String>, type: TypeInfo)`コールバック関数は、`values`を文字列のリストとして受け取り、値を変換するための`TypeInfo`を受け取り、デコードされた値を返します。
*   `toValues(value: Any?)`コールバック関数は任意の値を受け取り、それを表す文字列のリストを返します。

## 例

次の例では、`LocalDate`型のコンバーターが定義され、値のシリアライズおよびデシリアライズを行うように構成されています。`encode`関数が呼び出されると、サービスは`SimpleDateFormat`を使用して値を変換し、フォーマットされた値を含むリストを返します。`decode`関数が呼び出されると、サービスは日付を`LocalDate`としてフォーマットし、それを返します。

```kotlin
```

{src="snippets/data-conversion/src/main/kotlin/dataconversion/Application.kt" include-lines="18-34"}

変換サービスは、エンコードおよびデコードされた値を取得するために手動で呼び出すこともできます。

```kotlin
```

{src="snippets/data-conversion/src/main/kotlin/dataconversion/Application.kt" include-lines="38-39"}

完全な例については、[%example_name%](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%)を参照してください。