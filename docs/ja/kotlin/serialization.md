[//]: # (title: シリアライズ)

シリアライズ（_Serialization_）とは、アプリケーションで使用されるデータを、ネットワーク経由で転送したり、データベースやファイルに保存したりできる形式に変換するプロセスのことです。一方、デシリアライズ（_deserialization_）は、外部ソースからデータを読み取り、それをランタイムオブジェクトに変換する逆のプロセスです。これらは、サードパーティとデータをやり取りするほとんどのアプリケーションにとって不可欠な要素です。

[JSON](https://www.json.org/json-en.html) や [Protocol Buffers](https://developers.google.com/protocol-buffers) などの一部のデータシリアライズ形式は、特に一般的です。これらは言語やプラットフォームに依存しないため、あらゆる現代的な言語で書かれたシステム間でのデータ交換を可能にします。

Kotlin では、データシリアライズツールは別のコンポーネントである [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) で提供されています。これは、`org.jetbrains.kotlin.plugin.serialization` Gradle プラグイン、[ランタイムライブラリ](#libraries)、およびコンパイラプラグインのいくつかの部分で構成されています。

コンパイラプラグインである `kotlinx-serialization-compiler-plugin` と `kotlinx-serialization-compiler-plugin-embeddable` は、Maven Central に直接公開されています。後者のプラグインは、スクリプトアーティファクトのデフォルトオプションである `kotlin-compiler-embeddable` アーティファクトと連携するように設計されています。Gradle は、コンパイラ引数としてこれらのコンパイラプラグインをプロジェクトに追加します。

## ライブラリ

`kotlinx.serialization` は、サポートされているすべてのプラットフォーム（JVM、JavaScript、Native）および、さまざまなシリアライズ形式（JSON、CBOR、Protocol Buffers など）に対応するライブラリセットを提供しています。サポートされているシリアライズ形式の完全なリストは [以下](#formats) で確認できます。

すべての Kotlin シリアライズライブラリは `org.jetbrains.kotlinx:` グループに属しています。それらの名前は `kotlinx-serialization-` で始まり、シリアライズ形式を反映したサフィックスが付いています。例：
* `org.jetbrains.kotlinx:kotlinx-serialization-json` は、Kotlin プロジェクトに JSON シリアライズを提供します。
* `org.jetbrains.kotlinx:kotlinx-serialization-cbor` は、CBOR シリアライズを提供します。

プラットフォーム固有のアーティファクトは自動的に処理されるため、手動で追加する必要はありません。JVM、JS、Native、およびマルチプラットフォームプロジェクトで同じ依存関係を使用してください。

`kotlinx.serialization` ライブラリは、Kotlin のバージョン管理とは一致しない独自のバージョン管理構造を使用していることに注意してください。最新バージョンを確認するには、[GitHub のリリース](https://github.com/Kotlin/kotlinx.serialization/releases) をチェックしてください。

## 形式

`kotlinx.serialization` には、さまざまなシリアライズ形式に対応するライブラリが含まれています。

* [JSON](https://www.json.org/): [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#json)
* [Protocol Buffers](https://developers.google.com/protocol-buffers): [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#protobuf)
* [CBOR](https://cbor.io/): [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#cbor)
* [Properties](https://en.wikipedia.org/wiki/.properties): [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#properties)
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON.md): [`kotlinx-serialization-hocon`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#hocon) (JVM のみ)

JSON シリアライズ（`kotlinx-serialization-json`）以外のすべてのライブラリは[実験的（Experimental）](components-stability.md)であり、予告なしに API が変更される可能性があることに注意してください。

また、[YAML](https://yaml.org/) や [Apache Avro](https://avro.apache.org/) など、より多くのシリアライズ形式をサポートするコミュニティメンテナンスのライブラリもあります。利用可能なシリアライズ形式の詳細については、[`kotlinx.serialization` のドキュメント](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md)を参照してください。

## 例: JSON シリアライズ

Kotlin オブジェクトを JSON にシリアライズする方法を見てみましょう。

### プラグインと依存関係の追加

開始する前に、プロジェクトで Kotlin シリアライズツールを使用できるようにビルドスクリプトを構成する必要があります。

1. Kotlin シリアライズ Gradle プラグイン `org.jetbrains.kotlin.plugin.serialization`（または Kotlin Gradle DSL では `kotlin("plugin.serialization")`）を適用します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.serialization") version "%kotlinVersion%"
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
        id 'org.jetbrains.kotlin.plugin.serialization' version '%kotlinVersion%'  
    }
    ```

    </tab>
    </tabs>

2. JSON シリアライズライブラリの依存関係を追加します：`org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%`

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%'
    }
    ```

    </tab>
    </tabs>

これで、コード内でシリアライズ API を使用する準備が整いました。API は `kotlinx.serialization` パッケージとその形式固有のサブパッケージ（`kotlinx.serialization.json` など）にあります。

### JSON のシリアライズとデシリアライズ

1. クラスに `@Serializable` アノテーションを付けて、シリアライズ可能にします。

    ```kotlin
    import kotlinx.serialization.Serializable
    
    @Serializable
    data class Data(val a: Int, val b: String)
    ```

2. `Json.encodeToString()` を呼び出して、このクラスのインスタンスをシリアライズします。

    ```kotlin
    import kotlinx.serialization.Serializable
    import kotlinx.serialization.json.Json
    import kotlinx.serialization.encodeToString
    
    @Serializable
    data class Data(val a: Int, val b: String)
    
    fun main() {
        val json = Json.encodeToString(Data(42, "str"))
    }
    ```

   結果として、JSON 形式でこのオブジェクトの状態を含む文字列が得られます：`{"a": 42, "b": "str"}`

   > リストなどのオブジェクトコレクションも、1 回の呼び出しでシリアライズできます：
   > 
   > ```kotlin
   > val dataList = listOf(Data(42, "str"), Data(12, "test"))
   > val jsonList = Json.encodeToString(dataList)
   > ```
   > 
   {style="note"}

3. JSON からオブジェクトをデシリアライズするには、`decodeFromString()` 関数を使用します。

    ```kotlin
    import kotlinx.serialization.Serializable
    import kotlinx.serialization.json.Json
    import kotlinx.serialization.decodeFromString
    
    @Serializable
    data class Data(val a: Int, val b: String)
    
    fun main() {
        val obj = Json.decodeFromString<Data>("""{"a":42, "b": "str"}""")
    }
    ```

以上です！オブジェクトを JSON 文字列にシリアライズし、それを再びオブジェクトにデシリアライズすることに成功しました。

## 次のステップ

Kotlin でのシリアライズの詳細については、[Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md) を参照してください。

以下のリソースで Kotlin シリアライズのさまざまな側面を調べることができます：

* [Kotlin シリアライズとその核となる概念について詳しく学ぶ](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization.md)
* [Kotlin の組み込みシリアライズ可能クラスを調べる](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
* [シリアライザーの詳細を確認し、カスタムシリアライザーを作成する方法を学ぶ](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers.md)
* [Kotlin でポリモーフィックなシリアライズがどのように処理されるかを確認する](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/polymorphism.md#open-polymorphism)
* [Kotlin シリアライズを扱うさまざまな JSON 機能を確認する](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json.md#json-elements)
* [Kotlin でサポートされている実験的なシリアライズ形式について詳しく学ぶ](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/formats.md)