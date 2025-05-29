[//]: # (title: シリアライゼーション)

_シリアライゼーション_ とは、アプリケーションが使用するデータを、ネットワーク経由で転送したり、データベースやファイルに保存したりできる形式に変換するプロセスです。一方、_デシリアライゼーション_ は、外部ソースからデータを読み込み、それをランタイムオブジェクトに変換する逆のプロセスです。これらは、サードパーティとデータを交換するほとんどのアプリケーションにとって不可欠なものです。

[JSON](https://www.json.org/json-en.html) や [Protocol Buffers](https://developers.google.com/protocol-buffers) のような一部のデータシリアライゼーション形式は、特に一般的です。これらは言語に依存せず、プラットフォームにも依存しないため、任意のモダンな言語で記述されたシステム間でのデータ交換を可能にします。

Kotlinでは、データシリアライゼーションツールは独立したコンポーネントである [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) で利用できます。これは、`org.jetbrains.kotlin.plugin.serialization` Gradleプラグイン、[ランタイムライブラリ](#libraries)、およびコンパイラプラグインのいくつかの部分から構成されています。

コンパイラプラグインである `kotlinx-serialization-compiler-plugin` と `kotlinx-serialization-compiler-plugin-embeddable` は、Maven Central に直接公開されています。2番目のプラグインは、`kotlin-compiler-embeddable` アーティファクトと連携するように設計されており、これはスクリプティングアーティファクトのデフォルトオプションです。Gradleは、コンパイラプラグインをコンパイラの引数としてプロジェクトに追加します。

## ライブラリ

`kotlinx.serialization` は、JVM、JavaScript、Native のすべてのサポートされているプラットフォーム向けに、また JSON、CBOR、Protocol Buffers など、さまざまなシリアライゼーション形式向けのライブラリセットを提供します。サポートされているシリアライゼーション形式の完全なリストは [以下](#formats) で確認できます。

すべてのKotlinシリアライゼーションライブラリは `org.jetbrains.kotlinx:` グループに属しています。それらの名前は `kotlinx-serialization-` で始まり、シリアライゼーション形式を反映したサフィックスを持ちます。例:
* `org.jetbrains.kotlinx:kotlinx-serialization-json` は、KotlinプロジェクトにJSONシリアライゼーションを提供します。
* `org.jetbrains.kotlinx:kotlinx-serialization-cbor` は、CBORシリアライゼーションを提供します。

プラットフォーム固有のアーティファクトは自動的に処理されるため、手動で追加する必要はありません。JVM、JS、Native、およびマルチプラットフォームプロジェクトで同じ依存関係を使用してください。

`kotlinx.serialization` ライブラリは独自のバージョニング構造を使用しており、Kotlinのバージョニングとは一致しないことに注意してください。最新バージョンを見つけるには、[GitHub](https://github.com/Kotlin/kotlinx.serialization/releases) のリリースを確認してください。

## 形式

`kotlinx.serialization` には、さまざまなシリアライゼーション形式用のライブラリが含まれています。

* [JSON](https://www.json.org/): [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#json)
* [Protocol Buffers](https://developers.google.com/protocol-buffers): [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#protobuf)
* [CBOR](https://cbor.io/): [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#cbor)
* [Properties](https://en.wikipedia.org/wiki/.properties): [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#properties)
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON.md): [`kotlinx-serialization-hocon`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#hocon) (JVMのみ)

JSONシリアライゼーション (`kotlinx-serialization-json`) を除くすべてのライブラリは [Experimental](components-stability.md) であり、APIが予告なく変更される可能性があることに注意してください。

[YAML](https://yaml.org/) や [Apache Avro](https://avro.apache.org/) など、より多くのシリアライゼーション形式をサポートするコミュニティによってメンテナンスされているライブラリもあります。利用可能なシリアライゼーション形式に関する詳細については、[`kotlinx.serialization` ドキュメント](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md) を参照してください。

## 例: JSONシリアライゼーション

KotlinオブジェクトをJSONにシリアライズする方法を見てみましょう。

### プラグインと依存関係の追加

始める前に、プロジェクトでKotlinシリアライゼーションツールを使用できるようにビルドスクリプトを設定する必要があります。

1. KotlinシリアライゼーションGradleプラグイン `org.jetbrains.kotlin.plugin.serialization` (または Kotlin Gradle DSL では `kotlin("plugin.serialization")`) を適用します。

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

2. JSONシリアライゼーションライブラリの依存関係 `org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%` を追加します。

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

これで、コードでシリアライゼーションAPIを使用する準備が整いました。APIは `kotlinx.serialization` パッケージとその形式固有のサブパッケージ (例: `kotlinx.serialization.json`) にあります。

### JSONのシリアライズとデシリアライズ

1. `@Serializable` でアノテーションを付けて、クラスをシリアライズ可能にします。

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

結果として、このオブジェクトの状態をJSON形式で含む文字列 `{"a": 42, "b": "str"}` が得られます。

> オブジェクトのコレクション (リストなど) も、1回の呼び出しでシリアライズできます。
> 
> ```kotlin
> val dataList = listOf(Data(42, "str"), Data(12, "test"))
> val jsonList = Json.encodeToString(dataList)
> ```
> 
{style="note"}

3. `decodeFromString()` 関数を使用して、JSONからオブジェクトをデシリアライズします。

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

## 次のステップ

Kotlinでのシリアライゼーションに関する詳細については、[Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md) を参照してください。

以下のリソースで、Kotlinシリアライゼーションのさまざまな側面を探求できます。

* [Kotlinシリアライゼーションとそのコアコンセプトの詳細](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization.md)
* [Kotlinの組み込みシリアライズ可能クラスを探る](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
* [シリアライザをさらに詳しく見て、カスタムシリアライザを作成する方法を学ぶ](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers.md)
* [Kotlinでポリモーフィックシリアライゼーションがどのように処理されるかを発見する](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/polymorphism.md#open-polymorphism)
* [Kotlinシリアライゼーションを処理するさまざまなJSON機能について調べる](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json.md#json-elements)
* [Kotlinでサポートされている実験的なシリアライゼーション形式について詳しく学ぶ](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/formats.md)