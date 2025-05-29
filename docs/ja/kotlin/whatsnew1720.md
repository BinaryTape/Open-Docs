[//]: # (title: Kotlin 1.7.20 の新機能)

<tldr>
   <p>Kotlin 1.7.20 の IDE サポートは、IntelliJ IDEA 2021.3、2022.1、2022.2 で利用可能です。</p>
</tldr>

_[リリース日: 2022年9月29日](releases.md#release-details)_

Kotlin 1.7.20 がリリースされました！ このリリースの主なハイライトは以下の通りです。

* [新しい Kotlin K2 コンパイラが `all-open`、SAM with receiver、Lombok、その他のコンパイラプラグインをサポート](#support-for-kotlin-k2-compiler-plugins)
* [開区間を作成するための `..<` 演算子のプレビューを導入](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新しい Kotlin/Native メモリマネージャがデフォルトで有効に](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [JVM 向けに新しい実験的な機能である、ジェネリックな基底型を持つインラインクラスを導入](#generic-inline-classes)

変更点の簡単な概要は、以下の動画でも確認できます。

<video src="https://www.youtube.com/v/OG9npowJgE8" title="What's new in Kotlin 1.7.20"/>

## Kotlin K2 コンパイラプラグインのサポート

Kotlin チームは K2 コンパイラの安定化を継続しています。
K2 はまだ**Alpha**版ですが（[Kotlin 1.7.0 リリース](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)で発表された通り）、
いくつかのコンパイラプラグインをサポートするようになりました。新しいコンパイラに関する Kotlin チームからの更新は、[この YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-52604)で確認できます。

この 1.7.20 リリースから、Kotlin K2 コンパイラは以下のプラグインをサポートします。

* [`all-open`](all-open-plugin.md)
* [`no-arg`](no-arg-plugin.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Lombok](lombok.md)
* AtomicFU
* `jvm-abi-gen`

> 新しい K2 コンパイラの Alpha 版は JVM プロジェクトでのみ動作します。
> Kotlin/JS、Kotlin/Native、または他のマルチプラットフォームプロジェクトはサポートしていません。
>
{style="warning"}

新しいコンパイラとその利点について、以下の動画で詳細をご覧ください。
* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

### Kotlin K2 コンパイラを有効にする方法

Kotlin K2 コンパイラを有効にしてテストするには、以下のコンパイラオプションを使用します。

```bash
-Xuse-k2
```

`build.gradle(.kts)` ファイルで指定できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions.useK2 = true
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    kotlinOptions.useK2 = true
}
```
</tab>
</tabs>

ご自身の JVM プロジェクトでのパフォーマンス向上を試して、古いコンパイラの結果と比較してみてください。

### 新しい K2 コンパイラに関するフィードバック

どのような形でも皆様からのフィードバックを大変歓迎いたします。
* Kotlin Slack の K2 開発者に直接フィードバックを提供してください: [招待状を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)し、[#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257)チャンネルに参加してください。
* 新しい K2 コンパイラで遭遇した問題は、[弊社のイシュートラッカー](https://kotl.in/issue)に報告してください。
* K2 の使用に関する匿名データを JetBrains が収集できるように、[**使用状況統計の送信**オプション](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)を有効にしてください。

## 言語

Kotlin 1.7.20 では、新しい言語機能のプレビュー版が導入され、ビルダ型推論に制限が加えられました。

* [開区間を作成するための `..<` 演算子のプレビュー](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新しい `data object` 宣言](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [ビルダ型推論の制限](#new-builder-type-inference-restrictions)

### 開区間を作成するための `..<` 演算子のプレビュー

> この新しい演算子は[Experimental](components-stability.md#stability-levels-explained)であり、IDE でのサポートは限定的です。
>
{style="warning"}

このリリースでは、新しい `..<` 演算子が導入されました。Kotlin には値の範囲を表す `..` 演算子があります。新しい `..<`
演算子は `until` 関数のように動作し、開区間を定義するのに役立ちます。

<video src="https://www.youtube.com/watch?v=v0AHdAIBnbs" title="New operator for open-ended ranges"/>

弊社の調査によると、この新しい演算子は開区間を表現するのに優れており、上限が含まれないことを明確に示しています。

以下に、`when` 式で `..<` 演算子を使用する例を示します。

```kotlin
when (value) {
    in 0.0..<0.25 -> // 第1クォーター
    in 0.25..<0.5 -> // 第2クォーター
    in 0.5..<0.75 -> // 第3クォーター
    in 0.75..1.0 ->  // 最終クォーター  <- ここが閉区間であることに注意
}
```
{validate="false"}

#### 標準ライブラリ API の変更点

以下の新しい型と操作が、共通 Kotlin 標準ライブラリの `kotlin.ranges` パッケージに導入されます。

##### 新しい OpenEndRange&lt;T&gt; インターフェース

開区間を表す新しいインターフェースは、既存の `ClosedRange<T>` インターフェースと非常によく似ています。

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // 下限
    val start: T
    // 上限（範囲には含まれません）
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```
{validate="false"}

##### 既存のイテラブルな範囲における OpenEndRange の実装

開発者が除外された上限を持つ範囲を取得する必要がある場合、現在では `until` 関数を使用して、同じ値を持つ閉じたイテラブルな範囲を効果的に生成しています。これらの範囲を `OpenEndRange<T>` を受け入れる新しい API で利用可能にするために、既存のイテラブルな範囲である `IntRange`、`LongRange`、`CharRange`、`UIntRange`、`ULongRange` にそのインターフェースを実装したいと考えています。これにより、これらは `ClosedRange<T>` と `OpenEndRange<T>` の両インターフェースを同時に実装することになります。

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```
{validate="false"}

##### 標準型に対する rangeUntil 演算子

`rangeUntil` 演算子は、現在 `rangeTo` 演算子によって定義されているのと同じ型と組み合わせで提供されます。これらはプロトタイプ目的で拡張関数として提供されていますが、整合性を保つため、開区間 API を安定化する前に後でメンバーとして実装する予定です。

#### `..<` 演算子を有効にする方法

`..<` 演算子を使用するか、ご自身の型にその演算子規約を実装するには、`-language-version 1.8` コンパイラオプションを有効にしてください。

標準型の開区間をサポートするために導入された新しい API 要素は、実験的な stdlib API と同様にオプトインが必要です: `@OptIn(ExperimentalStdlibApi::class)`。または、`-opt-in=kotlin.ExperimentalStdlibApi` コンパイラオプションを使用することもできます。

[この KEEP ドキュメントで新しい演算子についてさらに詳しく読む](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)。

### データオブジェクトによるシングルトンとシールドクラス階層の文字列表現の改善

> データオブジェクトは[Experimental](components-stability.md#stability-levels-explained)であり、現時点では IDE でのサポートが限定的です。
>
{style="warning"}

このリリースでは、新しい種類の `object` 宣言である `data object` が導入されました。[データオブジェクト](https://youtrack.jetbrains.com/issue/KT-4107)は、概念的には通常の `object` 宣言と同一に動作しますが、そのまま使用できるクリーンな `toString` 表現が付属しています。

<video src="https://www.youtube.com/v/ovAqcwFhEGc" title="Data objects in Kotlin 1.7.20"/>

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

これにより、`data object` 宣言は sealed class 階層に最適です。sealed class 階層では、`data class` 宣言と組み合わせて使用できます。このスニペットでは、`EndOfFile` を通常の `object` ではなく `data object` として宣言することで、手動でオーバーライドすることなく美しい `toString` を取得でき、付随する `data class` の定義との対称性が保たれます。

```kotlin
sealed class ReadResult {
    data class Number(val value: Int) : ReadResult()
    data class Text(val value: String) : ReadResult()
    data object EndOfFile : ReadResult()
}

fun main() {
    println(ReadResult.Number(1)) // Number(value=1)
    println(ReadResult.Text("Foo")) // Text(value=Foo)
    println(ReadResult.EndOfFile) // EndOfFile
}
```

#### データオブジェクトを有効にする方法

コードでデータオブジェクト宣言を使用するには、`-language-version 1.9` コンパイラオプションを有効にしてください。Gradle プロジェクトでは、`build.gradle(.kts)` に以下を追加することで実現できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    // ...
    kotlinOptions.languageVersion = "1.9"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    // ...
    kotlinOptions.languageVersion = '1.9'
}
```
</tab>
</tabs>

データオブジェクトの詳細について、またその実装に関するフィードバックは、[関連する KEEP ドキュメント](https://github.com/Kotlin/KEEP/pull/316)で共有してください。

### 新しいビルダ型推論の制限

Kotlin 1.7.20 では、[ビルダ型推論の使用](using-builders-with-builder-inference.md)にいくつかの主要な制限が加えられており、コードに影響を与える可能性があります。これらの制限は、ビルダラムダ関数を含むコードに適用され、ラムダ自体を分析せずにパラメータを導出することが不可能な場合です。パラメータは引数として使用されます。現在、コンパイラはそのようなコードに対して常にエラーを表示し、型を明示的に指定するよう求めます。

これは破壊的な変更ですが、弊社の調査によると、これらのケースは非常に稀であり、制限がコードに影響を与えることはないはずです。もし影響がある場合は、以下のケースを検討してください。

* メンバーを隠蔽する拡張機能を持つビルダ推論。

  コードにビルダ推論中に使用される同名の拡張関数が含まれている場合、コンパイラはエラーを表示します。

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList {
            this.add(Data())
            this.get(0).doSmth() // 2 に解決され、エラーにつながります
        }
    }
    ```
    {validate="false"} 
  
  コードを修正するには、型を明示的に指定する必要があります。

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList<Data> { // 型引数！
            this.add(Data())
            this.get(0).doSmth() // 1 に解決されます
        }
    }
    ```

* 複数のラムダを持つビルダ推論で、型引数が明示的に指定されていない場合。

  ビルダ推論に2つ以上のラムダブロックがある場合、それらは型に影響を与えます。エラーを防ぐために、コンパイラは型の指定を要求します。

    ```kotlin
    fun <T: Any> buildList(
        first: MutableList<T>.() -> Unit, 
        second: MutableList<T>.() -> Unit
    ): List<T> {
        val list = mutableListOf<T>()
        list.first()
        list.second()
        return list 
    }
    
    fun main() {
        buildList(
            first = { // this: MutableList<String>
                add("")
            },
            second = { // this: MutableList<Int> 
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```
    {validate="false"}

  エラーを修正するには、型を明示的に指定し、型の不一致を修正する必要があります。

    ```kotlin
    fun main() {
        buildList<Int>(
            first = { // this: MutableList<Int>
                add(0)
            },
            second = { // this: MutableList<Int>
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```

上記で言及されていないケースが見つかった場合は、[弊社チームにイシューを提出](https://kotl.in/issue)してください。

このビルダ推論の更新に関する詳細については、[この YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-53797)を参照してください。

## Kotlin/JVM

Kotlin 1.7.20 では、ジェネリックなインラインクラスが導入され、委譲プロパティに対するバイトコード最適化がさらに追加され、kapt スタブ生成タスクで IR をサポートすることで、最新の Kotlin 機能をすべて kapt で使用できるようになりました。

* [ジェネリックなインラインクラス](#generic-inline-classes)
* [委譲プロパティのさらなる最適化ケース](#more-optimized-cases-of-delegated-properties)
* [kapt スタブ生成タスクでの JVM IR バックエンドのサポート](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### ジェネリックなインラインクラス

> ジェネリックなインラインクラスは[Experimental](components-stability.md#stability-levels-explained)機能です。
> いつでも廃止または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994)でのフィードバックを高く評価いたします。
>
{style="warning"}

Kotlin 1.7.20 では、JVM インラインクラスの基底型を型パラメータにできるようになりました。コンパイラはそれを `Any?`、または一般的には型パラメータの上限にマッピングします。

<video src="https://www.youtube.com/v/0JRPA0tt9og" title="Generic inline classes in Kotlin 1.7.20"/>

以下の例を検討してください。

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // コンパイラは fun compute-<hashcode>(s: Any?) を生成します
```

この関数は、インラインクラスをパラメータとして受け取ります。パラメータは型引数ではなく、上限にマッピングされます。

この機能を有効にするには、`-language-version 1.8` コンパイラオプションを使用します。

[YouTrack](https://youtrack.jetbrains.com/issue/KT-52994)でのこの機能に関するフィードバックを高く評価いたします。

### 委譲プロパティのさらなる最適化ケース

Kotlin 1.6.0 では、`$delegate` フィールドを省略し、[参照されるプロパティへの即時アクセスを生成する](whatsnew16.md#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)ことで、プロパティへの委譲のケースを最適化しました。1.7.20 では、この最適化をより多くのケースに実装しました。
デリゲートが以下の場合、`$delegate` フィールドは省略されます。

* 名前付きオブジェクトの場合：

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }
  
  val s: String by NamedObject
  ```
  {validate="false"}

* 同じモジュール内に[バッキングフィールド](properties.md#backing-fields)とデフォルトゲッターを持つ final `val` プロパティの場合：

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...
  
  class A {
      val s: String by impl
  }
  ```
  {validate="false"}

* 定数式、enum エントリ、`this`、または `null` の場合。以下は `this` の例です。

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
   
      val s by this
  }
  ```
  {validate="false"}

[委譲プロパティ](delegated-properties.md)について詳しくはこちら。

[YouTrack](https://youtrack.jetbrains.com/issue/KT-23397)でのこの機能に関するフィードバックを高く評価いたします。

### kapt スタブ生成タスクでの JVM IR バックエンドのサポート

> kapt スタブ生成タスクにおける JVM IR バックエンドのサポートは[Experimental](components-stability.md)機能です。
> いつでも変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
>
{style="warning"}

1.7.20 より前は、kapt スタブ生成タスクは古いバックエンドを使用しており、[repeatable annotations](annotations.md#repeatable-annotations)は[kapt](kapt.md)では動作しませんでした。Kotlin 1.7.20 では、kapt スタブ生成タスクで[JVM IR バックエンド](whatsnew15.md#stable-jvm-ir-backend)のサポートを追加しました。これにより、repeatable annotations を含む最新の Kotlin 機能をすべて kapt で使用できるようになります。

kapt で IR バックエンドを使用するには、以下のオプションを `gradle.properties` ファイルに追加します。

```none
kapt.use.jvm.ir=true
```

[YouTrack](https://youtrack.jetbrains.com/issue/KT-49682)でのこの機能に関するフィードバックを高く評価いたします。

## Kotlin/Native

Kotlin 1.7.20 では、新しい Kotlin/Native メモリマネージャがデフォルトで有効になり、`Info.plist` ファイルをカスタマイズするオプションが追加されました。

* [新しいデフォルトメモリマネージャ](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [`Info.plist` ファイルのカスタマイズ](#customizing-the-info-plist-file)

### 新しい Kotlin/Native メモリマネージャがデフォルトで有効に

このリリースでは、新しいメモリマネージャにさらなる安定性とパフォーマンスの改善がもたらされ、新しいメモリマネージャを[Beta](components-stability.md)版に昇格させることが可能になりました。

以前のメモリマネージャは、`kotlinx.coroutines` ライブラリの実装における問題を含め、並行および非同期コードの記述を複雑にしていました。このため、並行処理の制限が iOS と Android プラットフォーム間で Kotlin コードを共有する際に問題を引き起こし、Kotlin Multiplatform Mobile の採用が妨げられていました。新しいメモリマネージャは、ついに[Kotlin Multiplatform Mobile を Beta 版に昇格させる](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/)道を開きました。

新しいメモリマネージャはコンパイラキャッシュもサポートしており、コンパイル時間を以前のリリースと同等にしています。新しいメモリマネージャの利点の詳細については、プレビュー版に関する[元のブログ記事](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)を参照してください。より技術的な詳細は[ドキュメント](native-memory-manager.md)で確認できます。

#### 設定とセットアップ

Kotlin 1.7.20 から、新しいメモリマネージャがデフォルトになります。追加の設定はほとんど必要ありません。

すでに手動で有効にしている場合は、`gradle.properties` から `kotlin.native.binary.memoryModel=experimental` オプションを、または `build.gradle(.kts)` ファイルから `binaryOptions["memoryModel"] = "experimental"` を削除できます。

必要に応じて、`gradle.properties` で `kotlin.native.binary.memoryModel=strict` オプションを使用して、レガシーメモリマネージャに戻すことができます。ただし、レガシーメモリマネージャではコンパイラキャッシュのサポートが利用できなくなったため、コンパイル時間が悪化する可能性があります。

#### フリージング

新しいメモリマネージャでは、フリージングは非推奨です。レガシーマネージャ（フリージングがまだ必要な場合）でコードを動作させる必要がある場合を除き、使用しないでください。これは、レガシーメモリマネージャのサポートを維持する必要があるライブラリ作成者や、新しいメモリマネージャで問題が発生した場合にフォールバックを用意したい開発者にとって役立つかもしれません。

そのような場合、新しいメモリマネージャとレガシーメモリマネージャの両方で一時的にコードをサポートできます。非推奨の警告を無視するには、以下のいずれかを実行します。

* 非推奨 API の使用箇所に `@OptIn(FreezingIsDeprecated::class)` をアノテーション付けします。
* Gradle のすべての Kotlin ソースセットに `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` を適用します。
* コンパイラフラグ `-opt-in=kotlin.native.FreezingIsDeprecated` を渡します。

#### Kotlin の `suspend` 関数を Swift/Objective-C から呼び出す

新しいメモリマネージャは、Kotlin の `suspend` 関数を Swift および Objective-C からメインスレッド以外のスレッドで呼び出すことを依然として制限していますが、新しい Gradle オプションでこの制限を解除できます。

この制限は、コードが継続を元のスレッドで再開するようにディスパッチするケースがあったため、元々レガシーメモリマネージャで導入されました。このスレッドにサポートされているイベントループがなかった場合、タスクは実行されず、コルーチンは再開されませんでした。

特定の場合、この制限は不要になりましたが、必要なすべての条件のチェックを簡単に実装することはできません。このため、無効にするオプションを導入しつつ、新しいメモリマネージャに残すことを決定しました。そのためには、以下のオプションを `gradle.properties` に追加します。

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

> `kotlinx.coroutines` の `native-mt` バージョン、または同じ「元のスレッドへのディスパッチ」アプローチを持つ他のライブラリを使用している場合は、このオプションを追加しないでください。
>
{style="warning"}

Kotlin チームは、このオプションを実装してくれた [Ahmed El-Helw](https://github.com/ahmedre) 氏に深く感謝いたします。

#### フィードバックを残す

これは弊社のエコシステムにとって重要な変更です。さらに改善するために、皆様からのフィードバックを高く評価いたします。

ご自身のプロジェクトで新しいメモリマネージャを試して、[弊社のイシュートラッカー YouTrack でフィードバックを共有](https://youtrack.jetbrains.com/issue/KT-48525)してください。

### Info.plist ファイルのカスタマイズ

フレームワークを生成する際、Kotlin/Native コンパイラは情報プロパティリストファイル `Info.plist` を生成します。以前は、その内容をカスタマイズするのが面倒でした。Kotlin 1.7.20 では、以下のプロパティを直接設定できます。

| Property                     | Binary option              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

そのためには、対応するバイナリオプションを使用します。必要なフレームワークに対して、`-Xbinary=$option=$value` コンパイラフラグを渡すか、`binaryOption(option, value)` Gradle DSL を設定します。

Kotlin チームは、この機能を実装してくれた Mads Ager 氏に深く感謝いたします。

## Kotlin/JS

Kotlin/JS は、開発者エクスペリエンスを向上させ、パフォーマンスを向上させるいくつかの機能強化を受けました。

* 依存関係のロード効率が改善されたおかげで、増分ビルドとクリーンビルドの両方で Klib 生成が高速化されました。
* [開発バイナリの増分コンパイル](js-ir-compiler.md#incremental-compilation-for-development-binaries)が再設計され、クリーンビルドシナリオでの大幅な改善、より高速な増分ビルド、および安定性の修正がもたらされました。
* ネストされたオブジェクト、sealed クラス、およびコンストラクタのオプションパラメータに対する `.d.ts` 生成を改善しました。

## Gradle

Kotlin Gradle プラグインの更新は、新しい Gradle 機能および最新の Gradle バージョンとの互換性に重点を置いています。

Kotlin 1.7.20 には、Gradle 7.1 をサポートするための変更が含まれています。非推奨のメソッドとプロパティが削除または置き換えられ、Kotlin Gradle プラグインによって生成される非推奨の警告の数を減らし、Gradle 8.0 の将来のサポートを妨げないようにしました。

ただし、注意が必要な破壊的変更がいくつかあります。

### ターゲット構成

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` は現在、ジェネリックパラメータ `SingleTargetExtension<T : KotlinTarget>` を持ちます。
* `kotlin.targets.fromPreset()` 規約は非推奨になりました。代わりに、引き続き `kotlin.targets { fromPreset() }` を使用できますが、[ターゲットを明示的に設定する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#targets)ことをお勧めします。
* Gradle によって自動生成されるターゲットアクセサは、`kotlin.targets { }` ブロック内では利用できなくなりました。代わりに `findByName("targetName")` メソッドを使用してください。

  なお、`kotlin.targets` の場合、例えば `kotlin.targets.linuxX64` のようなアクセサは引き続き利用可能です。

### ソースディレクトリ構成

Kotlin Gradle プラグインは、Kotlin `SourceDirectorySet` を Java の `SourceSet` グループに `kotlin` 拡張として追加するようになりました。これにより、[Java、Groovy、Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl)で設定されるのと同様に、`build.gradle.kts` ファイルでソースディレクトリを設定することが可能になります。

```kotlin
sourceSets {
    main {
        java.setSrcDirs(listOf("src/java"))
        kotlin.setSrcDirs(listOf("src/kotlin"))
    }
}
```

非推奨の Gradle 規約を使用したり、Kotlin のソースディレクトリを指定したりする必要がなくなりました。

`kotlin` 拡張を使用して `KotlinSourceSet` にアクセスすることもできます。

```kotlin
kotlin {
    sourceSets {
        main {
        // ...
        }
    }
}
```

### JVM ツールチェイン設定のための新しいメソッド

このリリースでは、[JVM ツールチェイン機能](gradle-configure-project.md#gradle-java-toolchains-support)を有効にするための新しい `jvmToolchain()` メソッドが提供されます。`implementation` や `vendor` などの追加の[設定フィールド](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html)が不要な場合は、Kotlin 拡張からこのメソッドを使用できます。

```kotlin
kotlin {
    jvmToolchain(17)
}
```

これにより、Kotlin プロジェクトのセットアッププロセスが追加設定なしで簡素化されます。このリリース以前は、JDK バージョンを以下の方法でのみ指定できました。

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## 標準ライブラリ

Kotlin 1.7.20 では、`java.nio.file.Path` クラスに新しい[拡張関数](extensions.md#extension-functions)が提供され、ファイルツリーを走査できるようになりました。

* `walk()` は、指定されたパスをルートとするファイルツリーを遅延的に走査します。
* `fileVisitor()` は、`FileVisitor` を個別に作成することを可能にします。`FileVisitor` は、ディレクトリとファイルを走査する際のアクションを定義します。
* `visitFileTree(fileVisitor: FileVisitor, ...)` は、準備された `FileVisitor` を消費し、内部で `java.nio.file.Files.walkFileTree()` を使用します。
* `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)` は、`builderAction` で `FileVisitor` を作成し、`visitFileTree(fileVisitor, ...)` 関数を呼び出します。
* `FileVisitor` の戻り値の型である `FileVisitResult` は、ファイルの処理を継続する `CONTINUE` のデフォルト値を持ちます。

> `java.nio.file.Path` の新しい拡張関数は[Experimental](components-stability.md)です。
> いつでも変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
>
{style="warning"}

これらの新しい拡張関数でできることの例をいくつか示します。

* 明示的に `FileVisitor` を作成し、それから使用する：

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes ->
          // ディレクトリを訪問する際のロジック
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // ファイルを訪問する際のロジック
          FileVisitResult.CONTINUE
      }
  }
  
  // ロジックをここに追加できます
  
  projectDirectory.visitFileTree(cleanVisitor)
  ```

* `builderAction` で `FileVisitor` を作成し、すぐに使用する：

  ```kotlin
  projectDirectory.visitFileTree {
  // builderAction の定義:
      onPreVisitDirectory { directory, attributes ->
          // ディレクトリを訪問する際のロジック
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // ファイルを訪問する際のロジック
          FileVisitResult.CONTINUE
      }
  }
  ```

* `walk()` 関数を使用して、指定されたパスをルートとするファイルツリーを走査する：

  ```kotlin
  @OptIn(kotlin.io.path.ExperimentalPathApi::class)
  fun traverseFileTree() {
      val cleanVisitor = fileVisitor {
          onPreVisitDirectory { directory, _ ->
              if (directory.name == "build") {
                  directory.toFile().deleteRecursively()
                  FileVisitResult.SKIP_SUBTREE
              } else {
                  FileVisitResult.CONTINUE
              }
          }
  
          onVisitFile { file, _ ->
              if (file.extension == "class") {
                  file.deleteExisting()
              }
              FileVisitResult.CONTINUE
          }
      }
  
      val rootDirectory = createTempDirectory("Project")
  
      rootDirectory.resolve("src").let { srcDirectory ->
          srcDirectory.createDirectory()
          srcDirectory.resolve("A.kt").createFile()
          srcDirectory.resolve("A.class").createFile()
      }
  
      rootDirectory.resolve("build").let { buildDirectory ->
          buildDirectory.createDirectory()
          buildDirectory.resolve("Project.jar").createFile()
      }
  
   
  // walk 関数を使用します:
      val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructure, "[, build, build/Project.jar, src, src/A.class, src/A.kt]")
  
      rootDirectory.visitFileTree(cleanVisitor)
  
      val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructureAfterClean, "[, src, src/A.kt]")
  //sampleEnd
  }
  ```

実験的な API と同様に、新しい拡張機能にはオプトインが必要です：`@OptIn(kotlin.io.path.ExperimentalPathApi::class)` または `@kotlin.io.path.ExperimentalPathApi`。または、コンパイラオプション `-opt-in=kotlin.io.path.ExperimentalPathApi` を使用することもできます。

[YouTrack](https://youtrack.jetbrains.com/issue/KT-52909)での[`walk()`関数](https://youtrack.jetbrains.com/issue/KT-52909)および[訪問拡張関数](https://youtrack.jetbrains.com/issue/KT-52910)に関するフィードバックを高く評価いたします。

## ドキュメントの更新

前回のリリース以降、Kotlin ドキュメントにはいくつかの注目すべき変更が加えられました。

### 改訂および改善されたページ

* [基本型概要](basic-types.md) – Kotlin で使用される基本型（数値、ブール、文字、文字列、配列、符号なし整数）について学習します。
* [Kotlin 開発用 IDE](kotlin-ide.md) – 公式の Kotlin サポートがある IDE と、コミュニティがサポートするプラグインがあるツールのリストを参照してください。

### Kotlin Multiplatform journal の新しい記事

* [ネイティブとクロスプラットフォームアプリ開発: どちらを選ぶべきか？](https://www.jetbrains.com/help/kotlin-multiplatform-dev/native-and-cross-platform.html) – クロスプラットフォームアプリ開発とネイティブアプローチの概要と利点をご覧ください。
* [最高のクロスプラットフォームアプリ開発フレームワーク6選](https://www.jetbrains.com/help/kotlin-multiplatform-dev/cross-platform-frameworks.html) – クロスプラットフォームプロジェクトに適切なフレームワークを選択するための主要な側面についてお読みください。

### 新規および更新されたチュートリアル

* [Kotlin Multiplatform を始める](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – Kotlin によるクロスプラットフォームモバイル開発について学び、Android と iOS の両方で動作するアプリを作成します。
* [React と Kotlin/JS でウェブアプリケーションを構築する](js-react.md) – Kotlin の DSL と典型的な React プログラムの機能を探索して、ブラウザアプリを作成します。

### リリースドキュメントの変更点

各リリースで推奨される kotlinx ライブラリのリストは提供されなくなりました。このリストには、Kotlin 自体で推奨されテストされたバージョンのみが含まれていました。一部のライブラリが相互に依存しており、推奨される Kotlin バージョンとは異なる特別な kotlinx バージョンを必要とすることが考慮されていませんでした。

プロジェクトで Kotlin バージョンをアップグレードする際に、どの kotlinx ライブラリバージョンを使用すべきかを明確にするために、ライブラリがどのように相互に関連し、依存しているかに関する情報を提供する方法を検討しています。

## Kotlin 1.7.20 のインストール

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1、2022.2 は、Kotlin プラグインを 1.7.20 に自動的に更新することを提案します。

> Android Studio Dolphin (213)、Electric Eel (221)、Flamingo (222) の場合、Kotlin プラグイン 1.7.20 は今後の Android Studio の更新で提供されます。
>
{style="note"}

新しいコマンドラインコンパイラは、[GitHub リリースぺージ](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20)からダウンロードできます。

### Kotlin 1.7.20 の互換性ガイド

Kotlin 1.7.20 は増分リリースですが、Kotlin 1.7.0 で導入された問題の広がりを制限するために、互換性のない変更を加えざるを得ませんでした。

これらの変更点の詳細なリストは、[Kotlin 1.7.20 の互換性ガイド](compatibility-guide-1720.md)で確認できます。