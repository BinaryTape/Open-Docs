[//]: # (title: シリアライゼーション)

_シリアライゼーション_とは、アプリケーションが使用するデータを、ネットワーク経由で転送したり、データベースやファイルに保存したりできる形式に変換するプロセスです。一方、_デシリアライゼーション_とは、外部ソースからデータを読み込み、それをランタイムオブジェクトに変換する逆のプロセスです。これら二つは、サードパーティとデータをやり取りするほとんどのアプリケーションにとって不可欠です。

[JSON](https://www.json.org/json-en.html)や[protocol buffers](https://developers.google.com/protocol-buffers)のようなデータシリアライゼーションフォーマットは特に一般的です。言語にとらわれず、プラットフォームにも依存しないため、あらゆるモダンな言語で書かれたシステム間でのデータ交換を可能にします。

Kotlinでは、データシリアライゼーションツールは、別のコンポーネントである[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)で利用できます。これは、`org.jetbrains.kotlin.plugin.serialization` Gradleプラグイン、[ランタイムライブラリ](#libraries)、およびコンパイラプラグインのいくつかの部分で構成されています。

コンパイラプラグインである`kotlinx-serialization-compiler-plugin`と`kotlinx-serialization-compiler-plugin-embeddable`は、Maven Centralに直接公開されています。後者のプラグインは、スクリプティングアーティファクトのデフォルトオプションである`kotlin-compiler-embeddable`アーティファクトと連携するように設計されています。Gradleは、コンパイラ引数としてコンパイラプラグインをプロジェクトに追加します。

## ライブラリ

`kotlinx.serialization`は、サポートされているすべてのプラットフォーム（JVM、JavaScript、Native）と、様々なシリアライゼーションフォーマット（JSON、CBOR、protocol buffersなど）用のライブラリセットを提供します。サポートされているシリアライゼーションフォーマットの完全なリストは[以下](#formats)で確認できます。

すべてのKotlinシリアライゼーションライブラリは`org.jetbrains.kotlinx:`グループに属しています。その名前は`kotlinx-serialization-`で始まり、シリアライゼーションフォーマットを反映したサフィックスを持ちます。例：
*   `org.jetbrains.kotlinx:kotlinx-serialization-json`は、KotlinプロジェクトにJSONシリアライゼーションを提供します。
*   `org.jetbrains.kotlinx:kotlinx-serialization-cbor`は、CBORシリアライゼーションを提供します。

プラットフォーム固有のアーティファクトは自動的に処理されるため、手動で追加する必要はありません。JVM、JS、Native、およびマルチプラットフォームプロジェクトで同じ依存関係を使用してください。

`kotlinx.serialization`ライブラリは独自のバージョン管理構造を使用しており、Kotlinのバージョン管理とは一致しないことに注意してください。最新バージョンを見つけるには、[GitHub](https://github.com/Kotlin/kotlinx.serialization/releases)のリリースを確認してください。

## フォーマット

`kotlinx.serialization`には、様々なシリアライゼーションフォーマット用のライブラリが含まれています。

*   [JSON](https://www.json.org/): [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#json)
*   [Protocol buffers](https://developers.google.com/protocol-buffers): [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#protobuf)
*   [CBOR](https://cbor.io/): [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#cbor)
*   [Properties](https://en.wikipedia.org/wiki/.properties): [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#properties)
*   [HOCON](https://github.com/lightbend/config/blob/master/HOCON.md): [`kotlinx-serialization-hocon`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#hocon) (JVMのみ)

JSONシリアライゼーション（`kotlinx-serialization-json`）を除くすべてのライブラリは[Experimental](components-stability.md)であり、APIが予告なく変更される可能性があることに注意してください。

[YAML](https://yaml.org/)や[Apache Avro](https://avro.apache.org/)など、より多くのシリアライゼーションフォーマットをサポートするコミュニティでメンテナンスされているライブラリもあります。利用可能なシリアライゼーションフォーマットに関する詳細情報については、[`kotlinx.serialization`のドキュメント](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md)を参照してください。

## 例: JSONシリアライゼーション

KotlinオブジェクトをJSONにシリアライズする方法を見てみましょう。

### プラグインと依存関係の追加

開始する前に、プロジェクトでKotlinシリアライゼーションツールを使用できるようにビルドスクリプトを設定する必要があります。

1.  KotlinシリアライゼーションGradleプラグイン`org.jetbrains.kotlin.plugin.serialization`（またはKotlin Gradle DSLで`kotlin("plugin.serialization")`）を適用します。

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

2.  JSONシリアライゼーションライブラリの依存関係`org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%`を追加します。

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

これで、コードでシリアライゼーションAPIを使用する準備ができました。APIは`kotlinx.serialization`パッケージとそのフォーマット固有のサブパッケージ（例：`kotlinx.serialization.json`）にあります。

### JSONのシリアライズとデシリアライズ

1.  クラスに`@Serializable`アノテーションを付与してシリアライズ可能にします。

```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class Data(val a: Int, val b: String)
```

2.  このクラスのインスタンスを`Json.encodeToString()`を呼び出してシリアライズします。

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

その結果、このオブジェクトの状態をJSONフォーマットで含む文字列:`{"a": 42, "b": "str"}`が得られます。

> リストなどのオブジェクトコレクションも、単一の呼び出しでシリアライズできます。
> 
> ```kotlin
> val dataList = listOf(Data(42, "str"), Data(12, "test"))
> val jsonList = Json.encodeToString(dataList)
> ```
> 
{style="note"}

3.  `decodeFromString()`関数を使用して、JSONからオブジェクトをデシリアライズします。

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

これで完了です！オブジェクトをJSON文字列にシリアライズし、それらをオブジェクトにデシリアライズすることに成功しました。

## 次について

Kotlinでのシリアライゼーションに関する詳細については、[Kotlin Serialization ガイド](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)を参照してください。

次のリソースでKotlinシリアライゼーションのさまざまな側面を探求できます。

*   [Kotlinシリアライゼーションとそのコアコンセプトについてさらに学ぶ](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization.md)
*   [Kotlinの組み込みシリアライズ可能クラスを探求する](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
*   [シリアライザをさらに詳しく見て、カスタムシリアライザの作成方法を学ぶ](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers.md)
*   [Kotlinでポリモーフィックシリアライゼーションがどのように処理されるかを発見する](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/polymorphism.md#open-polymorphism)
*   [Kotlinシリアライゼーションを扱うさまざまなJSON機能について調べる](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json.md#json-elements)
*   [Kotlinがサポートする実験的なシリアライゼーションフォーマットについてさらに学ぶ](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/formats.md)