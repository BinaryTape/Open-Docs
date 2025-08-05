[//]: # (title: Kotlin 1.7.20 の新機能)

<tldr>
   <p>Kotlin 1.7.20のIDEサポートは、IntelliJ IDEA 2021.3、2022.1、および 2022.2 で利用できます。</p>
</tldr>

_[リリース日: 2022年9月29日](releases.md#release-details)_

Kotlin 1.7.20 がリリースされました！ 本リリースにおける主な変更点は次のとおりです。

* [新しいKotlin K2コンパイラーがall-open、SAM with receiver、Lombok、およびその他のコンパイラープラグインをサポートします](#support-for-kotlin-k2-compiler-plugins)
* [開区間を作成するための `..<` 演算子のプレビュー版を導入しました](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新しいKotlin/Nativeメモリマネージャーがデフォルトで有効になりました](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [JVM向けに新しい実験的機能である、ジェネリックな基底型を持つインラインクラスを導入しました](#generic-inline-classes)

変更点の簡単な概要については、この動画もご覧ください。

<video src="https://www.youtube.com/v/OG9npowJgE8" title="Kotlin 1.7.20の新機能"/>

## Kotlin K2 コンパイラープラグインのサポート

KotlinチームはK2コンパイラーの安定化を継続しています。
K2はまだ**アルファ版**ですが（[Kotlin 1.7.0リリース](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)で発表されたように）、
いくつかのコンパイラープラグインをサポートしています。 新しいコンパイラーに関するKotlinチームの最新情報は、[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-52604)で確認できます。

本1.7.20リリースより、Kotlin K2コンパイラーは以下のプラグインをサポートします。

* [`all-open`](all-open-plugin.md)
* [`no-arg`](no-arg-plugin.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Lombok](lombok.md)
* AtomicFU
* `jvm-abi-gen`

> 新しいK2コンパイラーのアルファ版はJVMプロジェクトでのみ動作します。
> Kotlin/JS、Kotlin/Native、またはその他のマルチプラットフォームプロジェクトはサポートしていません。
>
{style="warning"}

新しいコンパイラーとその利点の詳細については、以下の動画をご覧ください。
* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

### Kotlin K2 コンパイラーを有効にする方法

Kotlin K2コンパイラーを有効にしてテストするには、以下のコンパイラーオプションを使用します。

```bash
-Xuse-k2
```

`build.gradle(.kts)`ファイルで指定できます。

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

お使いのJVMプロジェクトでパフォーマンスの向上を確認し、以前のコンパイラーの結果と比較してください。

### 新しいK2コンパイラーに関するフィードバック

あらゆる形式のフィードバックをお待ちしております。
* Kotlin SlackでK2開発者に直接フィードバックを: [招待を受ける](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) と [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) チャンネルに参加してください。
* 新しいK2コンパイラーで直面した問題は、[私たちの課題トラッカー](https://kotl.in/issue)に報告してください。
* 「**使用統計を送信**」オプションを有効にして、JetBrainsがK2の使用状況に関する匿名データを収集できるようにします。

## 言語

Kotlin 1.7.20では、新しい言語機能のプレビュー版を導入するだけでなく、ビルダー型推論に制限を設けています。

* [開区間を作成するための `..<` 演算子のプレビュー](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新しいデータオブジェクト宣言](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [ビルダー型推論の制限](#new-builder-type-inference-restrictions)

### 開区間を作成するための `..<` 演算子のプレビュー

> 新しい演算子は[実験的](components-stability.md#stability-levels-explained)であり、IDEでのサポートは限定的です。
>
{style="warning"}

本リリースでは、新しい `..<` 演算子が導入されました。Kotlinには、値の範囲を表す `..` 演算子があります。新しい `..<` 演算子は `until` 関数のように機能し、開区間を定義するのに役立ちます。

<video src="https://www.youtube.com/watch?v=v0AHdAIBnbs" title="開区間用の新しい演算子"/>

私たちの調査によると、この新しい演算子は、開区間をより適切に表現し、上限が含まれていないことを明確にするのに役立ちます。

`when` 式で `..<` 演算子を使用する例を次に示します。

```kotlin
when (value) {
    in 0.0..<0.25 -> // First quarter
    in 0.25..<0.5 -> // Second quarter
    in 0.5..<0.75 -> // Third quarter
    in 0.75..1.0 ->  // Last quarter  <- ここでは閉区間であることに注意
}
```
{validate="false"}

#### 標準ライブラリAPIの変更点

共通Kotlin標準ライブラリの `kotlin.ranges` パッケージに以下の新しい型と操作が導入されます。

##### 新しい `OpenEndRange<T>` インターフェース

開区間を表す新しいインターフェースは、既存の `ClosedRange<T>` インターフェースと非常によく似ています。

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // 下限
    val start: T
    // 上限 (範囲には含まれない)
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```
{validate="false"}

##### 既存のイテラブル範囲での `OpenEndRange` の実装

開発者が上限が除外された範囲を取得する必要がある場合、現在は `until` 関数を使用して、同じ値を持つ閉じたイテラブル範囲を実質的に生成しています。`OpenEndRange<T>` を受け取る新しいAPIでこれらの範囲を利用できるようにするため、既存のイテラブル範囲である `IntRange`、`LongRange`、`CharRange`、`UIntRange`、および `ULongRange` でそのインターフェースを実装したいと考えています。そのため、これらは同時に `ClosedRange<T>` インターフェースと `OpenEndRange<T>` インターフェースの両方を実装することになります。

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```
{validate="false"}

##### 標準型向けの `rangeUntil` 演算子

`rangeTo` 演算子によって現在定義されているものと同じ型と組み合わせで `rangeUntil` 演算子が提供されます。プロトタイプ目的では拡張関数として提供していますが、一貫性を保つため、開区間APIを安定化する前に、後でメンバーとして実装することを計画しています。

#### `..<` 演算子を有効にする方法

`..<` 演算子を使用するか、独自の型でその演算子規約を実装するには、`-language-version 1.8` コンパイラーオプションを有効にしてください。

標準型の開区間をサポートするために導入された新しいAPI要素は、実験的な標準ライブラリAPIとしては通常通り、`@OptIn(ExperimentalStdlibApi::class)` のようにオプトインが必要です。または、`-opt-in=kotlin.ExperimentalStdlibApi` コンパイラーオプションを使用できます。

[この新しい演算子の詳細については、こちらのKEEPドキュメントをご覧ください](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)。

### データオブジェクトによるシングルトンおよびシールクラス階層の文字列表現の改善

> データオブジェクトは[実験的](components-stability.md#stability-levels-explained)であり、現時点ではIDEでのサポートが限定的です。
>
{style="warning"}

本リリースでは、新しい種類の `object` 宣言である `data object` が利用可能になりました。[データオブジェクト](https://youtrack.jetbrains.com/issue/KT-4107)は、概念的には通常の `object` 宣言と同一に動作しますが、きれいな `toString` 表現が標準で提供されます。

<video src="https://www.youtube.com/v/ovAqcwFhEGc" title="Kotlin 1.7.20 のデータオブジェクト"/>

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

これにより、`data object` 宣言はシールクラス階層に最適になります。その中で、`data class` 宣言と並行して使用できます。このスニペットでは、`EndOfFile` を通常の `object` ではなく `data object` として宣言することで、`toString` を手動でオーバーライドする必要なく、より良い表現が得られることを意味し、付随する `data class` の定義との対称性を維持します。

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

コードでデータオブジェクト宣言を使用するには、`-language-version 1.9` コンパイラーオプションを有効にします。Gradleプロジェクトでは、`build.gradle(.kts)` に以下を追加することでこれを行うことができます。

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

データオブジェクトの詳細については、以下をご覧いただき、[関連するKEEPドキュメント](https://github.com/Kotlin/KEEP/pull/316)で実装に関するフィードバックを共有してください。

### ビルダー型推論の新しい制限

Kotlin 1.7.20では、お使いのコードに影響を与える可能性のある[ビルダー型推論の使用](using-builders-with-builder-inference.md)に関して、いくつかの大きな制限が課せられます。これらの制限は、ラムダ自体を解析せずにパラメータを導出することが不可能な場合があるビルダーラムダ関数を含むコードに適用されます。パラメータは引数として使用されます。今後、コンパイラーはそのようなコードに対して常にエラーを表示し、明示的に型を指定するよう求めます。

これは破壊的変更ですが、私たちの調査では、これらのケースは非常にまれであり、制限がお使いのコードに影響を与えることはないはずです。もし影響がある場合は、以下のケースを検討してください。

* メンバーを隠す拡張関数を使用するビルダー推論。

  お使いのコードに、ビルダー型推論中に使用される同名の拡張関数が含まれている場合、コンパイラーはエラーを表示します。

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList {
            this.add(Data())
            this.get(0).doSmth() // 2に解決され、エラーにつながる
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
            this.get(0).doSmth() // 1に解決される
        }
    }
    ```

* 複数のラムダと、型引数が明示的に指定されていないビルダー推論。

  ビルダー型推論に2つ以上のラムダブロックがある場合、それらは型に影響を与えます。エラーを防ぐため、コンパイラーは型を指定するよう要求します。

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

上記で言及されていないケースに遭遇した場合は、私たちのチームに[課題を提出](https://kotl.in/issue)してください。

このビルダー型推論の更新に関する詳細については、この[YouTrack課題](https://youtrack.jetbrains.com/issue/KT-53797)をご覧ください。

## Kotlin/JVM

Kotlin 1.7.20では、ジェネリックなインラインクラスを導入し、デリゲートプロパティのバイトコード最適化をさらに追加し、kaptスタブ生成タスクでIRをサポートすることで、kaptですべての最新のKotlin機能を使用できるようになります。

* [ジェネリックなインラインクラス](#generic-inline-classes)
* [デリゲートプロパティのさらなる最適化されたケース](#more-optimized-cases-of-delegated-properties)
* [kaptスタブ生成タスクにおけるJVM IRバックエンドのサポート](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### ジェネリックなインラインクラス

> ジェネリックなインラインクラスは[実験的](components-stability.md#stability-levels-explained)な機能です。
> いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 1.7.20では、JVMインラインクラスの基底型を型パラメーターにすることを可能にします。コンパイラーはそれを `Any?` にマップするか、一般的には型パラメーターの上限にマップします。

<video src="https://www.youtube.com/v/0JRPA0tt9og" title="Kotlin 1.7.20 のジェネリックなインラインクラス"/>

以下の例を検討してください。

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // コンパイラーは fun compute-<hashcode>(s: Any?) を生成します
```

関数はインラインクラスをパラメーターとして受け入れます。パラメーターは型引数ではなく、上限にマップされます。

この機能を有効にするには、`-language-version 1.8` コンパイラーオプションを使用します。

この機能に関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-52994)でいただけると幸いです。

### デリゲートプロパティのさらなる最適化されたケース

Kotlin 1.6.0では、`$delegate` フィールドを省略し、[参照されるプロパティへの即時アクセスを生成](whatsnew16.md#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)することで、プロパティへのデリゲートの場合に最適化しました。1.7.20では、この最適化をより多くのケースに適用しました。
`$delegate` フィールドは、デリゲートが以下の場合に省略されるようになりました。

* 名前付きオブジェクト:

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }
  
  val s: String by NamedObject
  ```
  {validate="false"}

* [バッキングフィールド](properties.md#backing-fields)を持ち、同じモジュール内のデフォルトゲッターを持つ `val` の最終プロパティ:

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...
  
  class A {
      val s: String by impl
  }
  ```
  {validate="false"}

* 定数式、enumエントリー、`this`、または `null`。`this` の例を次に示します。

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
   
      val s by this
  }
  ```
  {validate="false"}

[デリゲートプロパティ](delegated-properties.md)の詳細をご覧ください。

この機能に関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-23397)でいただけると幸いです。

### kaptスタブ生成タスクにおけるJVM IRバックエンドのサポート

> kaptスタブ生成タスクにおけるJVM IRバックエンドのサポートは[実験的](components-stability.md)な機能です。
> いつでも変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
>
{style="warning"}

1.7.20より前は、kaptスタブ生成タスクは古いバックエンドを使用しており、[反復可能アノテーション](annotations.md#repeatable-annotations)は[kapt](kapt.md)で動作しませんでした。Kotlin 1.7.20では、kaptスタブ生成タスクで[JVM IRバックエンド](whatsnew15.md#stable-jvm-ir-backend)のサポートを追加しました。これにより、反復可能アノテーションを含め、kaptですべての最新のKotlin機能を使用できるようになります。

kaptでIRバックエンドを使用するには、`gradle.properties` ファイルに以下のオプションを追加します。

```none
kapt.use.jvm.ir=true
```

この機能に関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-49682)でいただけると幸いです。

## Kotlin/Native

Kotlin 1.7.20では、新しいKotlin/Nativeメモリマネージャーがデフォルトで有効になり、`Info.plist` ファイルをカスタマイズするオプションが追加されました。

* [新しいデフォルトのメモリマネージャー](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [Info.plist ファイルのカスタマイズ](#customizing-the-info-plist-file)

### 新しいKotlin/Nativeメモリマネージャーがデフォルトで有効に

本リリースでは、新しいメモリマネージャーにさらなる安定性とパフォーマンスの改善が加えられ、新しいメモリマネージャーを[ベータ版](components-stability.md)に昇格させることができました。

以前のメモリマネージャーは、`kotlinx.coroutines` ライブラリの実装に関する問題を含め、並行および非同期コードの記述を複雑にしていました。これにより、並行性の制限がiOSとAndroidプラットフォーム間でのKotlinコードの共有に問題を引き起こしたため、Kotlin Multiplatform Mobileの採用が妨げられました。新しいメモリマネージャーは、ついに[Kotlin Multiplatform Mobileをベータ版に昇格させる](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/)道を開きます。

新しいメモリマネージャーは、コンパイラーキャッシュもサポートしており、これによりコンパイル時間が以前のリリースと同等になります。新しいメモリマネージャーの利点の詳細については、プレビュー版に関する[オリジナルのブログ投稿](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)をご覧ください。より詳細な技術情報は[ドキュメント](native-memory-manager.md)で確認できます。

#### 設定とセットアップ

Kotlin 1.7.20より、新しいメモリマネージャーがデフォルトになりました。追加のセットアップはほとんど必要ありません。

すでに手動で有効にしている場合は、`gradle.properties` から `kotlin.native.binary.memoryModel=experimental` オプションを削除するか、`build.gradle(.kts)` ファイルから `binaryOptions["memoryModel"] = "experimental"` を削除できます。

必要であれば、`gradle.properties` で `kotlin.native.binary.memoryModel=strict` オプションを使用することで、従来のメモリマネージャーに戻すことができます。ただし、従来のメモリマネージャーではコンパイラーキャッシュのサポートが利用できなくなったため、コンパイル時間が悪化する可能性があります。

#### フリーズ

新しいメモリマネージャーでは、フリーズ（freezing）は非推奨になりました。従来のマネージャー（フリーズがまだ必要な場合）でコードを動作させる必要がある場合を除き、使用しないでください。これは、従来のメモリマネージャーのサポートを維持する必要があるライブラリ作者や、新しいメモリマネージャーで問題が発生した場合にフォールバックを用意したい開発者にとって役立つ可能性があります。

そのような場合は、新しいメモリマネージャーと従来のメモリマネージャーの両方でコードを一時的にサポートできます。非推奨の警告を無視するには、以下のいずれかを実行してください。

* 非推奨のAPIの使用箇所に `@OptIn(FreezingIsDeprecated::class)` アノテーションを付与します。
* GradleのすべてのKotlinソースセットに `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` を適用します。
* コンパイラーフラグ `-opt-in=kotlin.native.FreezingIsDeprecated` を渡します。

#### Swift/Objective-CからKotlinのサスペンド関数を呼び出す

新しいメモリマネージャーは、依然としてKotlinの `suspend` 関数をSwiftおよびObjective-Cからメインスレッド以外のスレッドから呼び出すことを制限しますが、新しいGradleオプションを使用することでこの制限を解除できます。

この制限は元々、コードが継続を元のスレッドで再開するようにディスパッチするケースのため、従来のメモリマネージャーで導入されました。このスレッドがサポートされているイベントループを持っていなかった場合、タスクは実行されず、コルーチンは再開されませんでした。

特定のケースでは、この制限はもはや必要ありませんが、必要なすべての条件のチェックを簡単に実装することはできません。このため、私たちは新しいメモリマネージャーでもこの制限を維持しつつ、無効にするオプションを導入することにしました。そのためには、`gradle.properties` に以下のオプションを追加します。

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

> `kotlinx.coroutines` の `native-mt` バージョン、または「元のスレッドへのディスパッチ」と同じアプローチを持つ他のライブラリを使用している場合は、このオプションを追加しないでください。
>
{style="warning"}

Kotlinチームは、このオプションの実装に貢献してくれた[Ahmed El-Helw](https://github.com/ahmedre)氏に深く感謝いたします。

#### フィードバック

これは私たちのエコシステムにとって重要な変更です。より良いものにするため、皆様からのフィードバックをお待ちしております。

ご自身のプロジェクトで新しいメモリマネージャーを試して、[私たちの課題トラッカーであるYouTrackでフィードバックを共有してください](https://youtrack.jetbrains.com/issue/KT-48525)。

### `Info.plist` ファイルのカスタマイズ

フレームワークを生成する際、Kotlin/Nativeコンパイラーは情報プロパティリストファイル `Info.plist` を生成します。以前は、その内容をカスタマイズするのは面倒でした。Kotlin 1.7.20では、以下のプロパティを直接設定できます。

| プロパティ                     | バイナリオプション              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

そのためには、対応するバイナリオプションを使用します。`-Xbinary=$option=$value` コンパイラーフラグを渡すか、必要なフレームワークに対して `binaryOption(option, value)` Gradle DSLを設定します。

Kotlinチームは、この機能の実装に貢献してくれたMads Ager氏に深く感謝いたします。

## Kotlin/JS

Kotlin/JSにはいくつかの機能強化が加えられ、開発者エクスペリエンスの向上とパフォーマンスの向上に貢献しています。

* Klibの生成が、依存関係のロード効率が向上したおかげで、インクリメンタルビルドとクリーンビルドの両方で高速化されました。
* [開発バイナリのインクリメンタルコンパイル](js-ir-compiler.md#incremental-compilation-for-development-binaries)が再構築され、クリーンビルドシナリオでの大幅な改善、インクリメンタルビルドの高速化、および安定性の修正がもたらされました。
* ネストされたオブジェクト、シールクラス、およびコンストラクター内のデフォルト値を持つパラメーター向けに、`.d.ts` の生成を改善しました。

## Gradle

Kotlin Gradleプラグインのアップデートは、新しいGradle機能と最新のGradleバージョンとの互換性に焦点を当てています。

Kotlin 1.7.20には、Gradle 7.1をサポートするための変更が含まれています。非推奨のメソッドとプロパティは削除または置き換えられ、Kotlin Gradleプラグインによって生成される非推奨警告の数を減らし、Gradle 8.0の将来的なサポートを妨げていた要因を取り除きました。

ただし、注意が必要な破壊的変更がいくつかあります。

### ターゲット構成

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` は、ジェネリックなパラメーター `SingleTargetExtension<T : KotlinTarget>` を持つようになりました。
* `kotlin.targets.fromPreset()` 規約は非推奨になりました。代わりに、引き続き `kotlin.targets { fromPreset() }` を使用できますが、[ターゲットを明示的に設定する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#targets)ことをお勧めします。
* Gradleによって自動生成されるターゲットアクセサーは、`kotlin.targets { }` ブロック内では利用できなくなりました。代わりに `findByName("targetName")` メソッドを使用してください。

  ただし、`kotlin.targets` の場合、例えば `kotlin.targets.linuxX64` のように、これらのアクセサーは引き続き利用できます。

### ソースディレクトリ構成

Kotlin Gradleプラグインは、Kotlin `SourceDirectorySet` をJavaの `SourceSet` グループへの `kotlin` 拡張として追加するようになりました。これにより、`build.gradle.kts` ファイルでソースディレクトリを、[Java、Groovy、Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl)で設定されるのと同様に設定できるようになります。

```kotlin
sourceSets {
    main {
        kotlin {
            java.setSrcDirs(listOf("src/java"))
            kotlin.setSrcDirs(listOf("src/kotlin"))
        }
    }
}
```

非推奨のGradle規約を使用する必要がなくなり、Kotlinのソースディレクトリを指定する必要がなくなりました。

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

### JVMツールチェーン構成の新しいメソッド

本リリースでは、[JVMツールチェーン機能](gradle-configure-project.md#gradle-java-toolchains-support)を有効にするための新しい `jvmToolchain()` メソッドが提供されます。`implementation` や `vendor` などの追加の[設定フィールド](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html)が不要な場合は、Kotlin拡張からこのメソッドを使用できます。

```kotlin
kotlin {
    jvmToolchain(17)
}
```

これにより、Kotlinプロジェクトのセットアッププロセスが簡素化され、追加の設定が不要になります。
本リリース以前は、JDKバージョンは以下の方法でのみ指定できました。

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## 標準ライブラリ

Kotlin 1.7.20では、`java.nio.file.Path` クラス向けに新しい[拡張関数](extensions.md#extension-functions)を提供します。これによりファイルツリーを走査できます。

* `walk()` は、指定されたパスをルートとするファイルツリーを遅延的に走査します。
* `fileVisitor()` は、`FileVisitor` を個別に作成することを可能にします。`FileVisitor` は、ディレクトリとファイルを走査する際のアクションを定義します。
* `visitFileTree(fileVisitor: FileVisitor, ...)` は、準備された `FileVisitor` を受け取り、内部で `java.nio.file.Files.walkFileTree()` を使用します。
* `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)` は、`builderAction` を使用して `FileVisitor` を作成し、`visitFileTree(fileVisitor, ...)` 関数を呼び出します。
* `FileVisitor` の戻り値の型である `FileVisitResult` は、`CONTINUE` というデフォルト値を持っています。これはファイルの処理を続行します。

> `java.nio.file.Path` の新しい拡張関数は[実験的](components-stability.md)です。
> いつでも変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
>
{style="warning"}

これらの新しい拡張関数でできることの例を次に示します。

* `FileVisitor` を明示的に作成して使用する:

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes ->
          // ディレクトリ訪問時のロジック
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // ファイル訪問時のロジック
          FileVisitResult.CONTINUE
      }
  }
  
  // ここにロジックが入る場合があります
  
  projectDirectory.visitFileTree(cleanVisitor)
  ```

* `builderAction` を使用して `FileVisitor` を作成し、すぐに使用する:

  ```kotlin
  projectDirectory.visitFileTree {
  // builderActionの定義:
      onPreVisitDirectory { directory, attributes ->
          // ディレクトリ訪問時のロジック
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // ファイル訪問時のロジック
          FileVisitResult.CONTINUE
      }
  }
  ```

* `walk()` 関数を使用して、指定されたパスをルートとするファイルツリーを走査する:

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
  
   
  // walk関数を使用:
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

実験的なAPIとしては通常通り、新しい拡張機能には `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` または `@kotlin.io.path.ExperimentalPathApi` のようにオプトインが必要です。または、`-opt-in=kotlin.io.path.ExperimentalPathApi` コンパイラーオプションを使用できます。

[`walk()` 関数](https://youtrack.jetbrains.com/issue/KT-52909)および[訪問拡張関数](https://youtrack.jetbrains.com/issue/KT-52910)に関するフィードバックをYouTrackでいただけると幸いです。

## ドキュメントの更新

以前のリリース以降、Kotlinドキュメントにはいくつかの注目すべき変更が加えられました。

### 改訂および改善されたページ

* [基本型概要](basic-types.md) – Kotlinで使用される基本型（数値、ブール値、文字、文字列、配列、符号なし整数）について学習します。
* [Kotlin開発用IDE](kotlin-ide.md) – 公式のKotlinサポートを持つIDEと、コミュニティがサポートするプラグインを持つツールのリストを確認してください。

### Kotlin Multiplatformジャーナルの新しい記事

* [ネイティブおよびクロスプラットフォームアプリ開発: 選択方法](https://www.jetbrains.com/help/kotlin-multiplatform-dev/native-and-cross-platform.html) – クロスプラットフォームアプリ開発とネイティブアプローチの概要と利点をご覧ください。
* [最高のクロスプラットフォームアプリ開発フレームワーク6選](https://www.jetbrains.com/help/kotlin-multiplatform-dev/cross-platform-frameworks.html) – クロスプラットフォームプロジェクトに適切なフレームワークを選択するのに役立つ主要な側面についてお読みください。

### 新規および更新されたチュートリアル

* [Kotlin Multiplatformを始める](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – Kotlinでのクロスプラットフォームモバイル開発について学び、AndroidとiOSの両方で動作するアプリを作成します。
* [ReactとKotlin/JSでWebアプリケーションを構築する](js-react.md) – KotlinのDSLと典型的なReactプログラムの機能を活用してブラウザアプリを作成します。

### リリースドキュメントの変更点

各リリースにおいて、推奨されるkotlinxライブラリのリストは提供されなくなりました。このリストには、Kotlin自体で推奨され、テストされたバージョンのみが含まれていました。一部のライブラリが互いに依存しており、推奨されるKotlinバージョンと異なる特別なkotlinxバージョンを必要とすることが考慮されていませんでした。

私たちは、ライブラリがどのように相互に関連し、互いに依存しているかについて情報を提供する方法を模索しており、プロジェクトのKotlinバージョンをアップグレードする際にどのkotlinxライブラリバージョンを使用すべきかが明確になるように取り組んでいます。

## Kotlin 1.7.20のインストール

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1、および 2022.2は、Kotlinプラグインを1.7.20に自動的に更新することを提案します。

> Android Studio Dolphin (213)、Electric Eel (221)、および Flamingo (222)の場合、Kotlinプラグイン1.7.20は、今後のAndroid Studioのアップデートとともに提供されます。
>
{style="note"}

新しいコマンドラインコンパイラーは、[GitHubリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20)からダウンロードできます。

### Kotlin 1.7.20の互換性ガイド

Kotlin 1.7.20はインクリメンタルリリースですが、Kotlin 1.7.0で導入された問題の広がりを制限するために、互換性のない変更がまだあります。

これらの変更の詳細なリストは、[Kotlin 1.7.20 の互換性ガイド](compatibility-guide-1720.md)で確認できます。