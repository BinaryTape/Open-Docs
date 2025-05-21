---
title: シリアライゼーション
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_Serialization_（シリアライゼーション）とは、アプリケーションで使用されるデータを、ネットワーク経由で転送したり、データベースやファイルに保存したりできる形式に変換する処理のことです。一方、_deserialization_（デシリアライゼーション）は、外部ソースからデータを読み込み、それを実行時のオブジェクトに変換する逆の処理です。これらは一体となって、サードパーティとデータを交換するほとんどのアプリケーションにとって不可欠です。

[JSON](https://www.json.org/json-en.html) や [protocol buffers](https://developers.google.com/protocol-buffers) など、一部のデータシリアライゼーション形式は特によく使用されます。言語やプラットフォームに依存しないため、最新の言語で記述されたシステム間のデータ交換が可能です。

Kotlin では、データシリアライゼーションツールは、個別のコンポーネントである [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) で利用できます。これは、`org.jetbrains.kotlin.plugin.serialization` Gradle プラグイン、[ランタイムライブラリ](#libraries)、およびコンパイラプラグインのいくつかの部分で構成されています。

コンパイラプラグインである `kotlinx-serialization-compiler-plugin` と `kotlinx-serialization-compiler-plugin-embeddable` は、Maven Central に直接公開されています。2 番目のプラグインは、スクリプト作成アーティファクトのデフォルトオプションである `kotlin-compiler-embeddable` アーティファクトと連携するように設計されています。Gradle は、コンパイラ引数としてコンパイラプラグインをプロジェクトに追加します。

## Libraries

`kotlinx.serialization` は、サポートされているすべてのプラットフォーム（JVM、JavaScript、Native）と、JSON、CBOR、protocol buffers などのさまざまなシリアライゼーション形式に対応するライブラリセットを提供します。サポートされているシリアライゼーション形式の完全なリストは、[以下](#formats)にあります。

すべての Kotlin シリアライゼーションライブラリは、`org.jetbrains.kotlinx:` グループに属しています。これらの名前は `kotlinx-serialization-` で始まり、シリアライゼーション形式を反映したサフィックスが付いています。例：
* `org.jetbrains.kotlinx:kotlinx-serialization-json` は、Kotlin プロジェクトに JSON シリアライゼーションを提供します。
* `org.jetbrains.kotlinx:kotlinx-serialization-cbor` は、CBOR シリアライゼーションを提供します。

プラットフォーム固有のアーティファクトは自動的に処理されるため、手動で追加する必要はありません。JVM、JS、Native、およびマルチプラットフォームプロジェクトで同じ依存関係を使用します。

`kotlinx.serialization` ライブラリは、Kotlin のバージョン管理とは一致しない独自のバージョン管理構造を使用していることに注意してください。[GitHub](https://github.com/Kotlin/kotlinx.serialization/releases) でリリースをチェックして、最新バージョンを見つけてください。

## Formats

`kotlinx.serialization` には、さまざまなシリアライゼーション形式のライブラリが含まれています。

* [JSON](https://www.json.org/): [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#json)
* [Protocol buffers](https://developers.google.com/protocol-buffers): [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#protobuf)
* [CBOR](https://cbor.io/): [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#cbor)
* [Properties](https://en.wikipedia.org/wiki/.properties): [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#properties)
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON): [`kotlinx-serialization-hocon`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#hocon) (JVM 上のみ)

JSON シリアライゼーション (`kotlinx-serialization-json`) を除くすべてのライブラリは [Experimental](components-stability) であり、API が予告なしに変更される可能性があることに注意してください。

[YAML](https://yaml.org/) や [Apache Avro](https://avro.apache.org/) など、より多くのシリアライゼーション形式をサポートするコミュニティによってメンテナンスされているライブラリもあります。利用可能なシリアライゼーション形式の詳細については、[`kotlinx.serialization` のドキュメント](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README)を参照してください。

## Example: JSON serialization

Kotlin オブジェクトを JSON にシリアライズする方法を見てみましょう。

### Add plugins and dependencies

開始する前に、プロジェクトで Kotlin シリアライゼーションツールを使用できるように、ビルドスクリプトを構成する必要があります。

1. Kotlin シリアライゼーション Gradle プラグイン `org.jetbrains.kotlin.plugin.serialization` (または Kotlin Gradle DSL で `kotlin("plugin.serialization")`) を適用します。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    plugins {
        kotlin("jvm") version "2.1.20"
        kotlin("plugin.serialization") version "2.1.20"
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.jvm' version '2.1.20'
        id 'org.jetbrains.kotlin.plugin.serialization' version '2.1.20'  
    }
    ```

    </TabItem>
    </Tabs>

2. JSON シリアライゼーションライブラリの依存関係を追加します:`org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0`

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0")
    } 
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0'
    } 
    ```

    </TabItem>
    </Tabs>

これで、コードでシリアライゼーション API を使用する準備ができました。API は、`kotlinx.serialization` パッケージとその形式固有のサブパッケージ（`kotlinx.serialization.json` など）にあります。

### Serialize and deserialize JSON

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

結果として、JSON 形式でこのオブジェクトの状態を含む文字列 `{"a": 42, "b": "str"}` が得られます。

:::note
リストなどのオブジェクトコレクションを 1 回の呼び出しでシリアライズすることもできます。

```kotlin
val dataList = listOf(Data(42, "str"), Data(12, "test"))
val jsonList = Json.encodeToString(dataList)
```

:::

3. `decodeFromString()` 関数を使用して、JSON からオブジェクトをデシリアライズします。

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

以上です。オブジェクトを JSON 文字列にシリアライズし、オブジェクトにデシリアライズすることに成功しました。

## What's next

Kotlin のシリアライゼーションの詳細については、[Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide) を参照してください。

次のリソースで、Kotlin シリアライゼーションのさまざまな側面を探ることができます。

* [Learn more about Kotlin serialization and its core concepts](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization)
* [Explore the built-in serializable classes of Kotlin](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes)
* [Look at serializers in more detail and learn how to create custom serializers](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers)
* [Discover how polymorphic serialization is handled in Kotlin](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/polymorphism#open-polymorphism)
* [Look into the various JSON features handling Kotlin serialization](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json#json-elements)
* [Learn more about the experimental serialization formats supported by Kotlin](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/formats)