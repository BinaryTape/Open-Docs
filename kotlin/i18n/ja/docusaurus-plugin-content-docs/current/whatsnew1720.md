---
title: "Kotlin 1.7.20 の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   Kotlin 1.7.20 の IDE サポートは、IntelliJ IDEA 2021.3、2022.1、および 2022.2 で利用できます。
</p>

:::

_[リリース: 2022年9月29日](releases#release-details)_

Kotlin 1.7.20 がリリースされました! このリリースからのハイライトをいくつかご紹介します。

* [新しい Kotlin K2 compiler が `all-open`、SAM with receiver、Lombok、およびその他の compiler plugin をサポート](#support-for-kotlin-k2-compiler-plugins)
* [オープンエンド範囲を作成するための `..<` 演算子のプレビューを導入](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新しい Kotlin/Native memory manager がデフォルトで有効に](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [JVM の新しい実験的機能として、総称的な基になる型を持つ inline class を導入](#generic-inline-classes)

この動画で変更点の簡単な概要を確認することもできます。

<video src="https://www.youtube.com/v/OG9npowJgE8" title="What's new in Kotlin 1.7.20"/>

## Kotlin K2 compiler plugin のサポート

Kotlin チームは、K2 compiler の安定化を継続しています。
K2 はまだ **Alpha** 段階ですが ([Kotlin 1.7.0 release](whatsnew17#new-kotlin-k2-compiler-for-the-jvm-in-alpha) で発表)、いくつかの compiler plugin をサポートするようになりました。
新しい compiler に関する Kotlin チームからの最新情報を受け取るには、[この YouTrack issue](https://youtrack.jetbrains.com/issue/KT-52604) をフォローしてください。

この 1.7.20 リリースから、Kotlin K2 compiler は次の plugin をサポートします。

* [`all-open`](all-open-plugin)
* [`no-arg`](no-arg-plugin)
* [SAM with receiver](sam-with-receiver-plugin)
* [Lombok](lombok)
* AtomicFU
* `jvm-abi-gen`

:::note
新しい K2 compiler の Alpha 版は、JVM プロジェクトでのみ動作します。
Kotlin/JS、Kotlin/Native、またはその他のマルチプラットフォームプロジェクトはサポートしていません。

新しい compiler とその利点については、次の動画をご覧ください。
* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

### Kotlin K2 compiler を有効にする方法

Kotlin K2 compiler を有効にしてテストするには、次の compiler option を使用します。

```bash
-Xuse-k2
```

`build.gradle(.kts)` ファイルで指定できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions.useK2 = true
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
compileKotlin {
    kotlinOptions.useK2 = true
}
```
</TabItem>
</Tabs>

JVM プロジェクトでの performance boost を確認し、古い compiler の結果と比較してください。

### 新しい K2 compiler に関するフィードバックをお寄せください

いかなる形でもフィードバックをお待ちしております。
* Kotlin Slack で K2 開発者に直接フィードバックを提供してください。[招待状を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) して、[#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) チャンネルに参加してください。
* 新しい K2 compiler で直面した問題を [課題追跡システム](https://kotl.in/issue) に報告してください。
* [**使用状況統計の送信** option を有効にする](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) ことで、JetBrains が K2 の使用に関する匿名データを収集できるようにします。

## 言語

Kotlin 1.7.20 では、新しい言語機能のプレビュー版が導入され、builder type inference に制限が加えられています。

* [オープンエンド範囲を作成するための ..< 演算子のプレビュー](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新しい data object 宣言](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [Builder type inference の制限](#new-builder-type-inference-restrictions)

### オープンエンド範囲を作成するための ..< 演算子のプレビュー

新しい演算子は [Experimental](components-stability#stability-levels-explained) であり、IDE でのサポートは限られています。

このリリースでは、新しい `..<` 演算子が導入されています。 Kotlin には、値の範囲を表す `..` 演算子があります。 新しい `..<`
演算子は `until` 関数のように動作し、オープンエンド範囲を定義するのに役立ちます。

<video src="https://www.youtube.com/watch?v=v0AHdAIBnbs" title="New operator for open-ended ranges"/>

調査によると、この新しい演算子は、オープンエンド範囲を表現し、上限が含まれていないことを明確にする上で、より効果的です。

`when` 式で `..<` 演算子を使用する例を次に示します。

```kotlin
when (value) {
    in 0.0..&lt;0.25 `->` // First quarter
    in 0.25..&lt;0.5 `->` // Second quarter
    in 0.5..&lt;0.75 `->` // Third quarter
    in 0.75..1.0 `->`  // Last quarter  `<-` Note closed range here
}
```

#### 標準ライブラリ API の変更

次の新しい型と operation が、共通の Kotlin 標準ライブラリの `kotlin.ranges` package に導入されます。

##### 新しい OpenEndRange&lt;T&gt; interface

オープンエンド範囲を表す新しい interface は、既存の `ClosedRange<T>` interface と非常によく似ています。

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // Lower bound
    val start: T
    // Upper bound, not included in the range
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```

##### 既存の iterable range で OpenEndRange を実装

開発者が除外された上限を持つ範囲を取得する必要がある場合、現在 `until` 関数を使用して、効果的に同じ値を持つ閉じた iterable range を生成します。 これらの範囲を `OpenEndRange<T>` を受け取る新しい API で受け入れられるようにするために、既存の iterable range である `IntRange`、`LongRange`、`CharRange`、`UIntRange`、および `ULongRange` でその interface を実装します。 したがって、`ClosedRange<T>` と `OpenEndRange<T>` の両方の interface を同時に実装します。

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```

##### 標準型に対する rangeUntil 演算子

`rangeUntil` 演算子は、現在 `rangeTo` 演算子によって定義されている同じ型と組み合わせに対して提供されます。
プロトタイプを作成する目的で extension 関数として提供しますが、一貫性を保つために、オープンエンド範囲 API を安定化する前に、後で member にする予定です。

#### ..&lt; 演算子を有効にする方法

`..<` 演算子を使用するか、独自の型に対してその演算子 convention を実装するには、`-language-version 1.8`
compiler option を有効にします。

標準型のオープンエンド範囲をサポートするために導入された新しい API element は、experimental stdlib API の場合と同様に、opt-in が必要です: `@OptIn(ExperimentalStdlibApi::class)`。 または、
`-opt-in=kotlin.ExperimentalStdlibApi` compiler option を使用することもできます。

[この KEEP ドキュメントで新しい演算子について詳しく読む](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges)。

### data object を使用した singleton および sealed class hierarchy の string 表現の改善

Data object は [Experimental](components-stability#stability-levels-explained) であり、現時点では IDE でのサポートは限られています。

このリリースでは、使用できる新しい型の `object` 宣言 `data object` が導入されています。 [Data object](https://youtrack.jetbrains.com/issue/KT-4107)
は、概念的には通常の `object` 宣言と同じように動作しますが、すぐに使用できるクリーンな `toString` 表現が付属しています。

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

これにより、`data object` 宣言は sealed class hierarchy に最適になり、`data class` と組み合わせて使用できます。
この snippet で、`EndOfFile` をプレーンな `object` ではなく `data object` として宣言することは、手動で override する必要なく、きれいな `toString` を取得し、付属の `data class`
定義との対称性を維持することを意味します。

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

#### Data object を有効にする方法

コードで data object 宣言を使用するには、`-language-version 1.9` compiler option を有効にします。 Gradle プロジェクトでは、
`build.gradle(.kts)` に次を追加することで有効にできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    // ...
    kotlinOptions.languageVersion = "1.9"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
compileKotlin {
    // ...
    kotlinOptions.languageVersion = '1.9'
}
```
</TabItem>
</Tabs>

data object について詳しく読み、[それぞれの KEEP ドキュメント](https://github.com/Kotlin/KEEP/pull/316) で実装に関するフィードバックを共有してください。

### New builder type inference の制限

Kotlin 1.7.20 では、コードに影響を与える可能性のある [builder type inference の使用](using-builders-with-builder-inference)
にいくつかの主要な制限が加えられています。 これらの制限は、lambda 自体を分析せずに parameter を導出することが不可能な builder lambda 関数を含むコードに適用されます。 parameter は引数として使用されます。 現在、compiler はそのようなコードに対して常に error を表示し、型を明示的に指定するように求めます。

これは破壊的な変更ですが、調査によると、これらのケースは非常にまれであり、制限はコードに影響を与えないはずです。 影響を与える場合は、次のケースを検討してください。

* Member を隠す extension を使用した Builder inference。

  コードに builder inference 中に使用される同じ名前の extension 関数が含まれている場合、
  compiler は error を表示します。

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList {
            this.add(Data())
            this.get(0).doSmth() // Resolves to 2 and leads to error
        }
    }
    ```
     
  
  コードを修正するには、型を明示的に指定する必要があります。

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList<Data> { // Type argument!
            this.add(Data())
            this.get(0).doSmth() // Resolves to 1
        }
    }
    ```

* 複数の lambda を使用した Builder inference で、type argument が明示的に指定されていません。

  Builder inference に 2 つ以上の lambda block がある場合、それらは型に影響を与えます。 error を防ぐために、compiler
  では型を指定する必要があります。

    ```kotlin
    fun <T: Any> buildList(
        first: MutableList<T>.() `->` Unit, 
        second: MutableList<T>.() `->` Unit
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
    

  error を修正するには、型を明示的に指定し、型の不一致を修正する必要があります。

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

上記で言及されているケースが見つからない場合は、[issue を送信](https://kotl.in/issue) してください。

この builder inference の更新の詳細については、[この YouTrack issue](https://youtrack.jetbrains.com/issue/KT-53797) を参照してください。

## Kotlin/JVM

Kotlin 1.7.20 では、generic inline class が導入され、delegated property の bytecode 最適化が追加され、
kapt stub generating task で IR がサポートされるため、kapt で最新の Kotlin 機能をすべて使用できます。

* [Generic inline class](#generic-inline-classes)
* [Delegated property の最適化されたケース](#more-optimized-cases-of-delegated-properties)
* [kapt stub generating task での JVM IR backend のサポート](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### Generic inline class

Generic inline class は [Experimental](components-stability#stability-levels-explained) 機能です。
いつでも削除または変更される可能性があります。 Opt-in が必要です (詳細については下記を参照)。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) でのフィードバックをお待ちしております。

Kotlin 1.7.20 では、JVM inline class の基になる型を type parameter にすることができます。 compiler はそれを `Any?` または、一般的には type parameter の上限に map します。

<video src="https://www.youtube.com/v/0JRPA0tt9og" title="Generic inline classes in Kotlin 1.7.20"/>

次の例を考えてみましょう。

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // Compiler generates fun compute-<hashcode>(s: Any?)
```

関数は inline class を parameter として受け入れます。 parameter は、type argument ではなく上限に map されます。

この機能を有効にするには、`-language-version 1.8` compiler option を使用します。

この機能に関するフィードバックをお待ちしております。[YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) までお寄せください。

### Delegated property の最適化されたケース

Kotlin 1.6.0 では、`$delegate` field を省略し、[参照される property への即時アクセスを生成](whatsnew16#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)することで、property への委譲のケースを最適化しました。 1.7.20 では、より多くのケースに対してこの最適化を実装しました。
delegate が次の場合、`$delegate` field は省略されるようになりました。

* 名前付き object:

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }
  
  val s: String by NamedObject
  ```
  

* [backing field](properties#backing-fields) と同じ module 内の default getter を持つ final `val` property:

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...
  
  class A {
      val s: String by impl
  }
  ```
  

* 定数式、enum entry、`this`、または `null`。 `this` の例を次に示します。

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
   
      val s by this
  }
  ```
  

[委譲された property](delegated-properties) について詳しく学びましょう。

この機能に関するフィードバックをお待ちしております。[YouTrack](https://youtrack.jetbrains.com/issue/KT-23397) までお寄せください。

### kapt stub generating task での JVM IR backend のサポート

kapt stub generating task での JVM IR backend のサポートは [Experimental](components-stability) 機能です。
いつでも変更される可能性があります。 Opt-in が必要です (詳細については下記を参照)。評価目的でのみ使用してください。

1.7.20 より前は、kapt stub generating task は古い backend を使用し、[repeatable annotation](annotations#repeatable-annotations)
は [kapt](kapt) では機能しませんでした。 Kotlin 1.7.20 では、[JVM IR backend](whatsnew15#stable-jvm-ir-backend) のサポートを追加しました。
kapt stub generating task で。 これにより、repeatable annotation を含む、kapt で最新の Kotlin 機能をすべて使用できます。

kapt で IR backend を使用するには、次の option を `gradle.properties` ファイルに追加します。

```none
kapt.use.jvm.ir=true
```

この機能に関するフィードバックをお待ちしております。[YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) までお寄せください。

## Kotlin/Native

Kotlin 1.7.20 には、デフォルトで有効になっている新しい Kotlin/Native memory manager が付属しており、
`Info.plist` ファイルをカスタマイズする option が用意されています。

* [新しい default memory manager](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [Info.plist ファイルのカスタマイズ](#customizing-the-info-plist-file)

### 新しい Kotlin/Native memory manager がデフォルトで有効に

このリリースでは、新しい memory manager の安定性と performance がさらに向上し、新しい memory manager を [Beta](components-stability) に昇格させることができます。

以前の memory manager では、`kotlinx.coroutines` ライブラリの実装に関する問題を含め、concurrent コードと asynchronous コードの記述が複雑になりました。 これにより、concurrency の制限により、iOS プラットフォームと Android プラットフォーム間で Kotlin コードを共有する際に問題が発生したため、Kotlin Multiplatform Mobile の採用が阻止されました。 新しい memory manager は、最終的に [Kotlin Multiplatform Mobile を Beta に昇格させる](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/) への道を開きます。

新しい memory manager は、コンパイル時間を以前のリリースと同等にする compiler cache もサポートしています。
新しい memory manager の利点の詳細については、preview 版のオリジナルの [ブログ投稿](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/) を参照してください。 技術的な詳細については、[ドキュメント](native-memory-manager) を参照してください。

#### 構成と設定

Kotlin 1.7.20 以降、新しい memory manager が default になります。 追加の設定はあまり必要ありません。

既に手動でオンにしている場合は、`gradle.properties` または `binaryOptions["memoryModel"] = "experimental"` から `kotlin.native.binary.memoryModel=experimental` option を削除できます。

必要に応じて、`gradle.properties` で `kotlin.native.binary.memoryModel=strict` option を使用して、従来の memory manager に切り替えることができます。 ただし、compiler cache のサポートは従来の memory manager では利用できなくなったため、コンパイル時間が悪化する可能性があります。

#### Freezing

新しい memory manager では、freezing は deprecated になりました。 コードを従来の manager で動作させる必要がある場合 (freezing がまだ必要な場合) を除いて、使用しないでください。 これは、従来の memory manager のサポートを維持する必要があるライブラリの作成者や、新しい memory manager で問題が発生した場合に fallback を持ちたい開発者にとって役立つ場合があります。

このような場合、新しい memory manager と従来の memory manager の両方でコードを一時的にサポートできます。 deprecation warning を無視するには、次のいずれかを実行します。

* deprecated API の使用箇所に `@OptIn(FreezingIsDeprecated::class)` annotation を付けます。
* `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` を Gradle 内のすべての Kotlin source set に適用します。
* compiler flag `-opt-in=kotlin.native.FreezingIsDeprecated` を渡します。

#### Kotlin suspending 関数を Swift/Objective-C から呼び出す

新しい memory manager では、メインスレッド以外のスレッドからの Swift および Objective-C からの Kotlin `suspend` 関数の呼び出しはまだ制限されていますが、新しい Gradle option を使用して解除できます。

この制限は元々、継続を元のスレッドで再開されるように dispatch するコードの場合に、従来の memory manager で導入されました。 このスレッドにサポートされている event loop がない場合、task は実行されず、coroutine は再開されません。

特定の場合、この制限は不要になりましたが、必要なすべての条件の check を簡単に実装することはできません。 このため、新しい memory manager で保持することを決定しましたが、無効にする option を導入しました。 これを行うには、次の option を `gradle.properties` に追加します。

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

`kotlinx.coroutines` の `native-mt` バージョンまたは同じ "元のスレッドへの dispatch" アプローチを持つ他のライブラリを使用する場合は、この option を追加しないでください。

Kotlin チームは、この option を実装してくれた [Ahmed El-Helw](https://github.com/ahmedre) に非常に感謝しています。

#### フィードバックをお寄せください

これは、エコシステムに対する大きな変更です。 より良いものにするために、フィードバックをお待ちしております。

プロジェクトで新しい memory manager を試し、[課題追跡システムである YouTrack でフィードバックを共有してください](https://youtrack.jetbrains.com/issue/KT-48525)。

### Info.plist ファイルのカスタマイズ

framework を作成する場合、Kotlin/Native compiler は information property list ファイル `Info.plist` を生成します。
以前は、その内容をカスタマイズするのは面倒でした。 Kotlin 1.7.20 では、次の property を直接設定できます。

| Property                     | Binary option              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

これを行うには、対応する binary option を使用します。
`-Xbinary=$option=$value` compiler flag を渡すか、必要な framework の `binaryOption(option, value)` Gradle DSL を設定します。

Kotlin チームは、この機能を実装してくれた Mads Ager に非常に感謝しています。

## Kotlin/JS

Kotlin/JS は、開発者のエクスペリエンスを向上させ、performance を向上させるいくつかの強化を受けました。

* 依存関係の読み込みの効率が向上したため、Klib の生成が incremental build と clean build の両方で高速化されました。
* [development binary の incremental compilation](js-ir-compiler#incremental-compilation-for-development-binaries)
  が書き直され、clean build シナリオの大幅な改善、incremental build の高速化、および安定性の修正が行われました。
* nested object、sealed class、および constructor の optional parameter に対する `.d.ts` の生成を改善しました。

## Gradle

Kotlin Gradle plugin の更新は、新しい Gradle 機能と最新の Gradle
バージョンとの互換性に重点を置いています。

Kotlin 1.7.20 には、Gradle 7.1 をサポートするための変更が含まれています。 deprecated な method と property が削除または置き換えられ、Kotlin Gradle plugin によって生成される deprecation warning の数が減少し、Gradle 8.0 の今後のサポートがブロック解除されました。

ただし、注意が必要な破壊的な変更がいくつかあります。

### Target 構成

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` に generic parameter が追加されました `SingleTargetExtension<T : KotlinTarget>`。
* `kotlin.targets.fromPreset()` convention は deprecated になりました。 代わりに、`kotlin.targets { fromPreset() }` を引き続き使用できますが、[target を明示的に設定する](multiplatform-discover-project#targets) ことをお勧めします。
* Gradle によって自動生成された Target accessor は、`kotlin.targets { }` block 内では使用できなくなりました。 代わりに、`findByName("targetName")`
  method を使用してください。

  このような accessor は、`kotlin.targets` の場合、たとえば `kotlin.targets.linuxX64` では引き続き使用できることに注意してください。

### Source directory 構成

Kotlin Gradle plugin は、Kotlin `SourceDirectorySet` を Java の `SourceSet` グループへの `kotlin` extension として追加するようになりました。
これにより、[Java、Groovy、および Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl) で構成されている方法と同様に、`build.gradle.kts` ファイルで source directory を構成できます。

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

deprecated な Gradle convention を使用して Kotlin の source directory を指定する必要はなくなりました。

`kotlin` extension を使用して `KotlinSourceSet` にアクセスすることもできることに注意してください。

```kotlin
kotlin {
    sourceSets {
        main {
        // ...
        }
    }
}
```

### JVM toolchain 構成用の新しい method

このリリースでは、[JVM toolchain 機能](gradle-configure-project#gradle-java-toolchains-support) を有効にするための新しい `jvmToolchain()` method が提供されています。
`implementation` や `vendor` などの追加の [構成 field](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html) が不要な場合は、Kotlin extension からこの method を使用できます。

```kotlin
kotlin {
    jvmToolchain(17)
}
```

これにより、追加の構成なしで Kotlin プロジェクトの設定プロセスが簡素化されます。
このリリースより前は、次の方法でのみ JDK バージョンを指定できました。

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## 標準ライブラリ

Kotlin 1.7.20 では、ファイルツリーを walk スルーできる `java.nio.file.Path` class の新しい [extension 関数](extensions#extension-functions) が提供されています。

* `walk()` は、指定された path をルートとするファイルツリーを lazily traverse します。
* `fileVisitor()` を使用すると、`FileVisitor` を個別に作成できます。 `FileVisitor` は、directories 上の action を定義します
  およびファイル traversal 時に。
* `visitFileTree(fileVisitor: FileVisitor, ...)` は、準備完了の `FileVisitor` を消費し、`java.nio.file.Files.walkFileTree()`
  を内部で使用します。
* `visitFileTree(..., builderAction: FileVisitorBuilder.() `->` Unit)` は、`builderAction` を使用して `FileVisitor` を作成し、
  `visitFileTree(fileVisitor, ...)` 関数を呼び出します。
* `FileVisitResult` (`FileVisitor` の return type) には、ファイルの処理を続行する `CONTINUE` default 値があります。

`java.nio.file.Path` の新しい extension 関数は [Experimental](components-stability) です。
いつでも変更される可能性があります。 Opt-in が必要です (詳細については下記を参照)。評価目的でのみ使用してください。

これらの新しい extension 関数を使用してできることをいくつか示します。

* `FileVisitor` を明示的に作成してから使用します。

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes `->`
          // Some logic on visiting directories
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes `->`
          // Some logic on visiting files
          FileVisitResult.CONTINUE
      }
  }
  
  // Some logic may go here
  
  projectDirectory.visitFileTree(cleanVisitor)
  ```

* `builderAction` を使用して `FileVisitor` を作成し、すぐに使用します。

  ```kotlin
  projectDirectory.visitFileTree {
  // Definition of the builderAction:
      onPreVisitDirectory { directory, attributes `->`
          // Some logic on visiting directories
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes `->`
          // Some logic on visiting files
          FileVisitResult.CONTINUE
      }
  }
  ```

* `walk()` 関数を使用して、指定された path をルートとするファイルツリーを traverse します。

  ```kotlin
  @OptIn(kotlin.io.path.ExperimentalPathApi::class)
  fun traverseFileTree() {
      val cleanVisitor = fileVisitor {
          onPreVisitDirectory { directory, _ `->`
              if (directory.name == "build") {
                  directory.toFile().deleteRecursively()
                  FileVisitResult.SKIP_SUBTREE
              } else {
                  FileVisitResult.CONTINUE
              }
          }
  
          onVisitFile { file, _ `->`
              if (file.extension == "class") {
                  file.deleteExisting()
              }
              FileVisitResult.CONTINUE
          }
      }
  
      val rootDirectory = createTempDirectory("Project")
  
      rootDirectory.resolve("src").let { srcDirectory `->`
          srcDirectory.createDirectory()
          srcDirectory.resolve("A.kt").createFile()
          srcDirectory.resolve("A.class").createFile()
      }
  
      rootDirectory.resolve("build").let { buildDirectory `->`
          buildDirectory.createDirectory()
          buildDirectory.resolve("Project.jar").createFile()
      }
  
   
  // Use walk function:
      val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructure, "[, build, build/Project.jar, src, src/A.class, src/A.kt]")
  
      rootDirectory.visitFileTree(cleanVisitor)
  
      val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructureAfterClean, "[, src, src/A.kt]")

  }
  ```

experimental API の場合と同様に、新しい extension には opt-in が必要です: `@OptIn(kotlin.io.path.ExperimentalPathApi::class)`
または `@kotlin.io.path.ExperimentalPathApi`。 または、compiler option `-opt-in=kotlin.io.path.ExperimentalPathApi` を使用できます。

[YouTrack での [`walk()` 関数](https://youtrack.jetbrains.com/issue/KT-52909) と
[visit extension 関数](https://youtrack.jetbrains.com/issue/KT-52910) に関するフィードバックをお待ちしております。

## ドキュメントの更新

前回のリリース以降、Kotlin ドキュメントにはいくつかの注目すべき変更がありました。

### 刷新および改善されたページ

* [Basic types overview](basic-types) – Kotlin で使用される基本的な型 (数値、ブール値、文字、文字列、配列、および unsigned integer number) について学びます。
* [IDEs for Kotlin development](kotlin-ide) – 公式の Kotlin サポートを備えた IDE のリストと、コミュニティでサポートされている plugin を持つツールをご覧ください。

### Kotlin Multiplatform ジャーナルの新しい記事

* [Native and cross-platform app development: how to choose?](https://www.jetbrains.com/help/kotlin-multiplatform-dev/native-and-cross-platform.html) – クロスプラットフォームアプリ開発とネイティブアプローチの概要と利点をご覧ください。
* [The six best cross-platform app development frameworks](https://www.jetbrains.com/help/kotlin-multiplatform-dev/cross-platform-frameworks.html) – クロスプラットフォームプロジェクトに適した framework を選択するのに役立つ重要な側面について読んでください。

### 新規および更新されたチュートリアル

* [Get started with Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – Kotlin でのクロスプラットフォームモバイル開発について学び、Android と iOS の両方で動作するアプリを作成します。
* [Build a web application with React and Kotlin/JS](js-react) – Kotlin の DSL と典型的な React プログラムの機能を調べて、ブラウザアプリを作成します。

### リリースドキュメントの変更

各リリースで推奨される kotlinx ライブラリのリストは提供されなくな