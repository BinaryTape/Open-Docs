[//]: # (title: Kotlin 1.8.20 の新機能)

<web-summary>新しい言語機能、Kotlin Multiplatform、JVM、Native、JS、および Wasm への更新、Gradle と Maven のビルドツールサポートなど、Kotlin 1.8.20 のリリースノートをご覧ください。</web-summary>

_[リリース日: 2023 年 4 月 25 日](releases.md#release-history)_

Kotlin 1.8.20 がリリースされました。主なハイライトは以下の通りです。

* [新しい Kotlin K2 コンパイラのアップデート](#new-kotlin-k2-compiler-updates)
* [新しい実験的な Kotlin/Wasm ターゲット](#new-kotlin-wasm-target)
* [Gradle における JVM インクリメンタルコンパイルのデフォルト有効化](#new-jvm-incremental-compilation-by-default-in-gradle)
* [Kotlin/Native ターゲットの更新](#update-for-kotlin-native-targets)
* [Kotlin Multiplatform における Gradle コンポジットビルドのプレビュー](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [Xcode における Gradle エラー出力の改善](#improved-output-for-gradle-errors-in-xcode)
* [標準ライブラリでの AutoCloseable インターフェースの実験的サポート](#support-for-the-autocloseable-interface)
* [標準ライブラリでの Base64 エンコーディングの実験的サポート](#support-for-base64-encoding)

以下の動画でも、変更点の短い概要をご覧いただけます。

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="What's new in Kotlin 1.8.20"/>

> Kotlin のリリースサイクルに関する情報は、[Kotlin のリリースプロセス](releases.md)を参照してください。
>
{style="tip"}

## IDE サポート

1.8.20 をサポートする Kotlin プラグインは、以下の IDE で利用可能です。

| IDE            | サポートされているバージョン            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |

> Kotlin のアーティファクトと依存関係を適切にダウンロードするために、Maven Central リポジトリを使用するように [Gradle の設定を構成](#configure-gradle-settings)してください。
>
{style="warning"}

## 新しい Kotlin K2 コンパイラのアップデート

Kotlin チームは K2 コンパイラの安定化を続けています。[Kotlin 1.7.0 の発表](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)で言及したように、K2 コンパイラはまだ **Alpha** 段階です。このリリースでは、[K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604) に向けたさらなる改善が導入されています。

この 1.8.20 リリースから、Kotlin K2 コンパイラは以下のようになります：

* serialization プラグインのプレビュー版を搭載。
* [JS IR コンパイラ](js-ir-compiler.md)の Alpha サポートを提供。
* 将来のリリースである[新しい言語バージョン Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/) を導入。

新しいコンパイラとその利点の詳細については、以下の動画をご覧ください：

* [What Everyone Must Know About The NEW Kotlin K2 Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [The New Kotlin K2 Compiler: Expert Review](https://www.youtube.com/watch?v=db19VFLZqJM)

### Kotlin K2 コンパイラを有効にする方法

Kotlin K2 コンパイラを有効にしてテストするには、以下のコンパイラオプションを使用して新しい言語バージョンを使用します。

```bash
-language-version 2.0
```

`build.gradle(.kts)` ファイルで指定することもできます：

```kotlin
kotlin {
   sourceSets.all {
       languageSettings {
           languageVersion = "2.0"
       }
   }
}
```

以前の `-Xuse-k2` コンパイラオプションは非推奨になりました。

> 新しい K2 コンパイラの Alpha 版は、JVM および JS IR プロジェクトでのみ動作します。Kotlin/Native やマルチプラットフォームプロジェクトはまだサポートしていません。
>
{style="warning"}

### 新しい K2 コンパイラへのフィードバック

皆様からのフィードバックをお待ちしております。

* Kotlin Slack で直接 K2 開発者にフィードバックを提供してください。 — [招待を受ける](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) して [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) チャンネルに参加してください。
* 新しい K2 コンパイラで直面した問題は、[弊社の課題トラッカー](https://kotl.in/issue)に報告してください。
* [**使用統計の送信 (Send usage statistics)** オプションを有効](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)にして、JetBrains が K2 の使用に関する匿名データを収集できるようにしてください。

## 言語

Kotlin の進化に伴い、1.8.20 では新しい言語機能のプレビュー版を導入しています：

* [Enum クラスの values 関数のモダンでパフォーマンスの高い代替](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
* [data class との対称性のための data object](#preview-of-data-objects-for-symmetry-with-data-classes)
* [インラインクラスにおけるボディを持つセカンダリコンストラクタの制限解除](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum クラスの values 関数のモダンでパフォーマンスの高い代替

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも変更または廃止される可能性があります。オプトインが必要です（詳細は以下を参照）。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Enum クラスには合成関数 `values()` があり、定義された列挙型定数の配列を返します。しかし、配列を使用すると、Kotlin や Java において[隠れたパフォーマンス上の問題](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues)が発生する可能性があります。また、ほとんどの API はコレクションを使用するため、最終的に変換が必要になります。これらの問題を解決するために、`values()` 関数の代わりに使用すべき Enum クラスの `entries` プロパティを導入しました。`entries` プロパティを呼び出すと、定義された列挙型定数の、事前に割り当てられた不変のリストが返されます。

> `values()` 関数は引き続きサポートされますが、代わりに `entries` プロパティを使用することをお勧めします。
>
{style="tip"}

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

@OptIn(ExperimentalStdlibApi::class)
fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```
{validate="false"}

#### entries プロパティを有効にする方法

この機能を試すには、`@OptIn(ExperimentalStdlibApi)` でオプトインし、`-language-version 1.9` コンパイラオプションを有効にします。Gradle プロジェクトでは、`build.gradle(.kts)` ファイルに以下を追加することで有効にできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

> IntelliJ IDEA 2023.1 以降、この機能をオプトインしている場合、適切な IDE インスペクションが `values()` から `entries` への変換を通知し、クイックフィックスを提供します。
>
{style="tip"}

提案に関する詳細情報は、[KEEP note](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md) を参照してください。

### data class との対称性のための data object

data object を使用すると、シングルトンセマンティクスとクリーンな `toString()` 表現を持つオブジェクトを宣言できます。次のスニペットでは、オブジェクト宣言に `data` キーワードを追加することで、`toString()` 出力の可読性がどのように向上するかを確認できます。

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

特に `sealed` 階層（`sealed class` や `sealed interface` の階層など）において、`data object` は `data class` 宣言と一緒に便利に使用できるため、非常に適しています。このスニペットでは、`EndOfFile` を単なる `object` ではなく `data object` として宣言することで、手動でオーバーライドしなくてもきれいな `toString` が得られます。これにより、付随する data class の定義との対称性が維持されます。

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```

#### data object のセマンティクス

[Kotlin 1.7.20](whatsnew1720.md#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects) での最初のプレビュー版以来、data object のセマンティクスは洗練されてきました。コンパイラは現在、以下のようないくつかの便利な関数を自動的に生成します：

##### toString

data object の `toString()` 関数は、オブジェクトの単純な名前を返します：

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals と hashCode

`data object` の `equals()` 関数は、その `data object` の型を持つすべてのオブジェクトが等しいと見なされることを保証します。ほとんどの場合、実行時には data object のインスタンスは 1 つだけです（結局のところ、`data object` はシングルトンを宣言するものです）。しかし、実行時に同じ型の別のオブジェクトが生成されるというエッジケース（たとえば、`java.lang.reflect` によるプラットフォームリフレクション、またはこの API を内部で使用する JVM シリアル化ライブラリを使用する場合など）において、オブジェクトが等しいものとして扱われることを保証します。

`data object` は常に（`==` 演算子を使用して）構造的に比較し、決して（`===` 演算子を使用して）参照で比較しないようにしてください。これにより、実行時に data object のインスタンスが複数存在する場合の落とし穴を避けることができます。次のスニペットは、この特定のエッジケースを示しています。

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // MySingleton
    println(evilTwin) // MySingleton

    // ライブラリが強制的に MySingleton の 2 番目のインスタンスを作成した場合でも、
    // その `equals` メソッドは true を返します：
    println(MySingleton == evilTwin) // true

    // data object を === で比較しないでください。
    println(MySingleton === evilTwin) // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin のリフレクションは data object のインスタンス化を許可しません。
    // これは "強制的に"（つまり Java プラットフォームのリフレクションによって）新しい MySingleton インスタンスを作成します。
    // 自分でこれを行わないでください！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成された `hashCode()` 関数の動作は `equals()` 関数の動作と一致しているため、`data object` のすべてのランタイムインスタンスは同じハッシュコードを持ちます。

##### data object には copy 関数と componentN 関数はありません

`data object` と `data class` 宣言はしばしば一緒に使用され、いくつかの類似点がありますが、`data object` には生成されない関数があります：

`data object` 宣言はシングルトンオブジェクトとして使用されることを意図しているため、`copy()` 関数は生成されません。シングルトンパターンはクラスのインスタンス化を単一のインスタンスに制限するものであり、インスタンスのコピーの作成を許可すると、その制限に違反するためです。

また、`data class` とは異なり、`data object` にはデータプロパティがありません。そのようなオブジェクトをデストラクト（分解）しようとしても意味がないため、`componentN()` 関数は生成されません。

この機能に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-4107) でお待ちしております。

#### data object プレビューを有効にする方法

この機能を試すには、`-language-version 1.9` コンパイラオプションを有効にします。Gradle プロジェクトでは、`build.gradle(.kts)` ファイルに以下を追加することで有効にできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

### インラインクラスにおけるボディを持つセカンダリコンストラクタの制限解除

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも変更または廃止される可能性があります。オプトインが必要です（詳細は以下を参照）。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.8.20 では、[インラインクラス](inline-classes.md)におけるボディを持つセカンダリコンストラクタの使用制限が解除されました。

以前のインラインクラスでは、明確な初期化セマンティクスを維持するために、`init` ブロックのないパブリックなプライマリコンストラクタ、またはセカンダリコンストラクタしか許可されていませんでした。その結果、基礎となる値をカプセル化したり、制限された値を表すインラインクラスを作成したりすることが不可能でした。

これらの問題は、Kotlin 1.4.30 で `init` ブロックの制限が解除された際に解消されました。今回、さらに一歩進んで、プレビューモードとしてボディを持つセカンダリコンストラクタが許可されるようになりました：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Kotlin 1.4.30 以降許可されています：
    init { 
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }

    // Kotlin 1.8.20 以降、プレビューとして利用可能：
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

#### ボディを持つセカンダリコンストラクタを有効にする方法

この機能を試すには、`-language-version 1.9` コンパイラオプションを有効にします。Gradle プロジェクトでは、`build.gradle(.kts)` に以下を追加することで有効にできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

この機能をぜひお試しいただき、Kotlin 1.9.0 でデフォルトにするための助けとなるよう、[YouTrack](https://kotl.in/issue) にレポートをお寄せください。

Kotlin インラインクラスの開発に関する詳細は、[この KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) を参照してください。

## 新しい Kotlin/Wasm ターゲット

Kotlin/Wasm (Kotlin WebAssembly) は、本リリースで[実験的](components-stability.md#stability-levels-explained)となりました。Kotlin チームは [WebAssembly](https://webassembly.org/) を有望なテクノロジーであると考えており、皆様が WebAssembly をより活用し、Kotlin のすべての利点を享受できるような方法を模索しています。

WebAssembly バイナリフォーマットは、独自の仮想マシンを使用して実行されるため、プラットフォームに依存しません。ほぼすべてのモダンブラウザがすでに WebAssembly 1.0 をサポートしています。Kotlin/Wasm ターゲットを実行するための環境をセットアップするには、実験的なガベージコレクションモードを有効にするだけです。詳細な手順についてはこちらを参照してください：[Kotlin/Wasm を有効にする方法](#how-to-enable-kotlin-wasm)。

新しい Kotlin/Wasm ターゲットの利点として、以下の点を強調したいと思います：

* Kotlin/Wasm は LLVM を使用する必要がないため、`wasm32` Kotlin/Native ターゲットと比較してコンパイル速度が速い。
* [Wasm ガベージコレクション](https://github.com/WebAssembly/gc)のおかげで、`wasm32` ターゲットと比較して JS との相互運用が容易で、ブラウザとの統合がスムーズである。
* Wasm はコンパクトで解析しやすいバイトコードを持つため、Kotlin/JS や JavaScript と比較してアプリケーションの起動が速くなる可能性がある。
* Wasm は静的型付け言語であるため、Kotlin/JS や JavaScript と比較してアプリケーションの実行時パフォーマンスが向上する。

1.8.20 リリース以降、実験的なプロジェクトで Kotlin/Wasm を使用できます。Kotlin 標準ライブラリ (`stdlib`) とテストライブラリ (`kotlin.test`) を Kotlin/Wasm 用に最初から提供しています。IDE サポートは将来のリリースで追加される予定です。

[Kotlin/Wasm の詳細については、こちらの YouTube 動画をご覧ください](https://www.youtube.com/watch?v=-pqz9sKXatw)。

### Kotlin/Wasm を有効にする方法

Kotlin/Wasm を有効にしてテストするには、`build.gradle.kts` ファイルを更新してください：

```kotlin
plugins {
    kotlin("multiplatform") version "1.8.20"
}

kotlin {
    wasm {
        binaries.executable()
        browser {
        }
    }
    sourceSets {
        val commonMain by getting
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
        val wasmMain by getting
        val wasmTest by getting
    }
}
```

> [Kotlin/Wasm の例が含まれた GitHub リポジトリ](https://github.com/Kotlin/kotlin-wasm-examples)をご覧ください。
>
{style="tip"}

Kotlin/Wasm プロジェクトを実行するには、ターゲット環境の設定を更新する必要があります：

<tabs>
<tab title="Chrome">

* バージョン 109 の場合：

  `--js-flags=--experimental-wasm-gc` コマンドライン引数を使用してアプリケーションを実行します。

* バージョン 110 以降の場合：

    1. ブラウザで `chrome://flags/#enable-webassembly-garbage-collection` にアクセスします。
    2. **WebAssembly Garbage Collection** を有効にします。
    3. ブラウザを再起動します。

</tab>
<tab title="Firefox">

バージョン 109 以降の場合：

1. ブラウザで `about:config` にアクセスします。
2. `javascript.options.wasm_function_references` と `javascript.options.wasm_gc` オプションを有効にします。
3. ブラウザを再起動します。

</tab>
<tab title="Edge">

バージョン 109 以降の場合：

`--js-flags=--experimental-wasm-gc` コマンドライン引数を使用してアプリケーションを実行します。

</tab>
</tabs>

### Kotlin/Wasm へのフィードバック

皆様からのフィードバックをお待ちしております。

* Kotlin Slack で直接開発者にフィードバックを提供してください。 — [招待を受ける](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) して [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) チャンネルに参加してください。
* Kotlin/Wasm で直面した問題は、[この YouTrack 課題](https://youtrack.jetbrains.com/issue/KT-56492)に報告してください。

## Kotlin/JVM

Kotlin 1.8.20 では、[Java 合成プロパティ参照のプレビュー](#preview-of-java-synthetic-property-references)と、[kapt スタブ生成タスクにおける JVM IR バックエンドのデフォルトサポート](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)が導入されています。

### Java 合成プロパティ参照のプレビュー

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも変更または廃止される可能性があります。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.8.20 では、Java の合成プロパティ（synthetic properties）に対する参照を作成できる機能が導入されました。たとえば、以下のような Java コードの場合です：

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}
```

Kotlin では以前から `person.age` と書くことができましたが、ここでの `age` は合成プロパティです。今回から、`Person::age` や `person::age` という参照を作成できるようになりました。`name` についても同様に機能します。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // Java 合成プロパティへの参照を呼び出す：
        .sortedBy(Person::age)
        // Kotlin プロパティ構文を介して Java ゲッターを呼び出す：
        .forEach { person -> println(person.name) }
```
{validate="false"}

#### Java 合成プロパティ参照を有効にする方法

この機能を試すには、`-language-version 1.9` コンパイラオプションを有効にします。Gradle プロジェクトでは、`build.gradle(.kts)` に以下を追加することで有効にできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

### kapt スタブ生成タスクにおける JVM IR バックエンドのデフォルトサポート

Kotlin 1.7.20 で、[kapt スタブ生成タスクにおける JVM IR バックエンドのサポート](whatsnew1720.md#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)を導入しました。本リリースより、このサポートがデフォルトで動作するようになります。有効にするために `gradle.properties` で `kapt.use.jvm.ir=true` を指定する必要はなくなりました。この機能に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) でお待ちしております。

## Kotlin/Native

Kotlin 1.8.20 には、サポートされる Kotlin/Native ターゲットの変更、Objective-C との相互運用性、CocoaPods Gradle プラグインの改善などのアップデートが含まれています：

* [Kotlin/Native ターゲットの更新](#update-for-kotlin-native-targets)
* [レガシーメモリマネージャの非推奨化](#deprecation-of-the-legacy-memory-manager)
* [@import ディレクティブを含む Objective-C ヘッダーのサポート](#support-for-objective-c-headers-with-import-directives)
* [CocoaPods Gradle プラグインにおけるリンク専用モードのサポート](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
* [UIKit におけるクラスメンバーとしての Objective-C エクステンションのインポート](#import-objective-c-extensions-as-class-members-in-uikit)
* [コンパイラにおけるコンパイラキャッシュ管理の再実装](#reimplementation-of-compiler-cache-management-in-the-compiler)
* [CocoaPods Gradle プラグインにおける `useLibraries()` の非推奨化](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Native ターゲットの更新
  
Kotlin チームは、Kotlin/Native でサポートされるターゲットのリストを再検討し、それらをティア（階層）に分け、Kotlin 1.8.20 から一部を非推奨にすることを決定しました。サポートされているターゲットと非推奨のターゲットの全リストについては、[Kotlin/Native ターゲットサポート](native-target-support.md)セクションを参照してください。

以下のターゲットは Kotlin 1.8.20 で非推奨となり、1.9.20 で削除される予定です：

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

残りのターゲットについては、ターゲットが Kotlin/Native コンパイラでどの程度サポートおよびテストされているかに応じて、3 つのサポートティアが設けられました。ターゲットは別のティアに移動される可能性があります。例えば、`iosArm64` は [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) にとって重要であるため、将来的に完全なサポート（ティア 1）を提供できるよう最善を尽くします。

ライブラリの作者であれば、これらのターゲットティアは CI ツールでどのターゲットをテストし、どれをスキップするかを決定するのに役立ちます。Kotlin チームも、[kotlinx.coroutines](coroutines-guide.md) のような公式 Kotlin ライブラリを開発する際に同様のアプローチを採用します。

これらの変更の理由についての詳細は、[ブログ投稿](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/)を確認してください。

### レガシーメモリマネージャの非推奨化

1.8.20 以降、レガシーメモリマネージャは非推奨となり、1.9.20 で削除される予定です。[新しいメモリマネージャ](native-memory-manager.md)は 1.7.20 でデフォルトで有効になっており、さらなる安定性のアップデートとパフォーマンスの向上が行われています。

まだレガシーメモリマネージャを使用している場合は、`gradle.properties` から `kotlin.native.binary.memoryModel=strict` オプションを削除し、[移行ガイド](native-migration-guide.md)に従って必要な変更を行ってください。

新しいメモリマネージャは `wasm32` ターゲットをサポートしていません。このターゲットも[本リリースより](#update-for-kotlin-native-targets)非推奨となっており、1.9.20 で削除されます。

### @import ディレクティブを含む Objective-C ヘッダーのサポート

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも変更または廃止される可能性があります。オプトインが必要です（詳細は以下を参照）。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin/Native で `@import` ディレクティブを含む Objective-C ヘッダーをインポートできるようになりました。この機能は、自動生成された Objective-C ヘッダーを持つ Swift ライブラリや、Swift で記述された CocoaPods の依存関係クラスを使用する際に便利です。

以前は、cinterop ツールは `@import` ディレクティブを介して Objective-C モジュールに依存するヘッダーを解析できませんでした。これは `-fmodules` オプションのサポートが不足していたためです。

Kotlin 1.8.20 以降、`@import` を含む Objective-C ヘッダーを使用できるようになりました。使用するには、定義ファイルで `compilerOpts` として `-fmodules` オプションをコンパイラに渡します。[CocoaPods 統合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)を使用している場合は、次のように `pod()` 関数の設定ブロックで cinterop オプションを指定します：

```kotlin
kotlin {
    ios()

    cocoapods {
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"

        ios.deploymentTarget = "13.5"

        pod("PodName") {
            extraOpts = listOf("-compiler-option", "-fmodules")
        }
    }
}
```

これは[非常に待ち望まれていた機能](https://youtrack.jetbrains.com/issue/KT-39120)であり、将来のリリースでデフォルトにできるよう、[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。

### CocoaPods Gradle プラグインにおけるリンク専用モードのサポート

Kotlin 1.8.20 では、動的フレームワークを持つ Pod の依存関係を、cinterop バインディングを生成せずにリンク専用として使用できるようになりました。これは、cinterop バインディングがすでに生成されている場合に便利です。

ライブラリとアプリの 2 つのモジュールを持つプロジェクトを考えてみましょう。ライブラリは Pod に依存していますが、フレームワークは生成せず、`.klib` のみを生成します。アプリはライブラリに依存し、動的フレームワークを生成します。この場合、このフレームワークをライブラリが依存する Pod とリンクさせる必要がありますが、ライブラリ用としてバインディングはすでに生成されているため、cinterop バインディングは必要ありません。

この機能を有効にするには、Pod への依存関係を追加する際に `linkOnly` オプションまたはビルダープロパティを使用します：

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

> 静的フレームワークでこのオプションを使用すると、Pod は静的フレームワークのリンクに使用されないため、Pod の依存関係が完全に削除されます。
>
{style="note"}

### UIKit におけるクラスメンバーとしての Objective-C エクステンションのインポート

Xcode 14.1 以降、Objective-C クラスの一部のメソッドがカテゴリーメンバーに移動されました。これにより、以前は異なる Kotlin API が生成され、これらのメソッドがメソッドではなく Kotlin エクステンションとしてインポートされていました。

これにより、UIKit を使用してメソッドをオーバーライドする際に問題が発生することがありました。例えば、Kotlin で UIView をサブクラス化する際に、`drawRect()` や `layoutSubviews()` メソッドをオーバーライドできなくなっていました。

1.8.20 以降、NSView および UIView クラスと同じヘッダーで宣言されているカテゴリーメンバーは、これらのクラスのメンバーとしてインポートされます。つまり、NSView および UIView を継承したメソッドは、他のメソッドと同様に簡単にオーバーライドできるようになります。

すべてが順調に進めば、すべての Objective-C クラスに対してこの動作をデフォルトで有効にする予定です。

### コンパイラにおけるコンパイラキャッシュ管理の再実装

コンパイラキャッシュの進化を加速させるため、コンパイラキャッシュの管理を Kotlin Gradle プラグインから Kotlin/Native コンパイラに移動しました。これにより、コンパイル時間やコンパイラキャッシュの柔軟性に関するいくつかの重要な改善への道が開かれました。

何か問題が発生し、以前の動作に戻す必要がある場合は、`kotlin.native.cacheOrchestration=gradle` という Gradle プロパティを使用してください。

これに関するフィードバックを [YouTrack](https://kotl.in/issue) でお待ちしております。

### CocoaPods Gradle プラグインにおける useLibraries() の非推奨化

Kotlin 1.8.20 では、静的ライブラリ用の [CocoaPods 統合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)で使用される `useLibraries()` 関数の非推奨サイクルが開始されます。

静的ライブラリを含む Pod への依存を許可するために `useLibraries()` 関数を導入しましたが、時間の経過とともにこのケースは非常に稀になりました。ほとんどの Pod はソースで配布されており、バイナリ配布には Objective-C フレームワークまたは XCFramework が一般的です。

この関数はあまり使われておらず、Kotlin CocoaPods Gradle プラグインの開発を複雑にする問題を引き起こしているため、非推奨にすることを決定しました。

フレームワークと XCFramework の詳細については、[最終的なネイティブバイナリのビルド](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)を参照してください。

## Kotlin Multiplatform

Kotlin 1.8.20 では、Kotlin Multiplatform の開発体験を向上させるために以下のアップデートが行われました：

* [ソースセット階層をセットアップするための新しいアプローチ](#new-approach-to-source-set-hierarchy)
* [Kotlin Multiplatform における Gradle コンポジットビルドサポートのプレビュー](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [Xcode における Gradle エラー出力の改善](#improved-output-for-gradle-errors-in-xcode)

### ソースセット階層への新しいアプローチ

> ソースセット階層への新しいアプローチは[実験的](components-stability.md#stability-levels-explained)です。将来の Kotlin リリースで予告なく変更される可能性があります。オプトインが必要です（詳細は以下を参照）。[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.8.20 では、マルチプラットフォームプロジェクトでソースセット階層をセットアップする新しい方法である「デフォルトターゲット階層 (default target hierarchy)」が提供されます。この新しいアプローチは、[設計上の欠陥](#why-replace-shortcuts)があった `ios` のようなターゲットショートカットを置き換えることを目的としています。

デフォルトターゲット階層の背後にある考え方はシンプルです。プロジェクトがコンパイルされるすべてのターゲットを明示的に宣言すると、Kotlin Gradle プラグインが指定されたターゲットに基づいて共有ソースセットを自動的に作成します。

#### プロジェクトのセットアップ

シンプルなマルチプラットフォームモバイルアプリの例を考えてみましょう：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // デフォルトターゲット階層を有効にする：
    targetHierarchy.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

デフォルトターゲット階層は、考えられるすべてのターゲットとその共有ソースセットのテンプレートのようなものだと考えることができます。コード内で最終的なターゲットである `android`、`iosArm64`、`iosSimulatorArm64` を宣言すると、Kotlin Gradle プラグインはテンプレートから適切な共有ソースセットを見つけ、それらを自動的に作成します。結果として得られる階層は次のようになります：

![デフォルトターゲット階層の使用例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

緑色のソースセットは実際に作成されプロジェクト内に存在しますが、デフォルトテンプレートにある灰色のソースセットは無視されます。ご覧の通り、プロジェクト内に watchOS ターゲットがないため、Kotlin Gradle プラグインは `watchos` ソースセットを作成していません。

`watchosArm64` などの watchOS ターゲットを追加すると、`watchos` ソースセットが作成され、`apple`、`native`、`common` ソースセットのコードも `watchosArm64` 用にコンパイルされるようになります。

デフォルトターゲット階層の完全なスキームは[ドキュメント](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)で確認できます。

> この例では、`apple` と `native` ソースセットは `iosArm64` と `iosSimulatorArm64` ターゲットに対してのみコンパイルされます。したがって、その名前に反して、これらはフル iOS API にアクセスできます。`native` などのソースセットの場合、すべてのネイティブターゲットで使用可能な API のみにアクセスできると期待されるかもしれませんが、この動作は将来変更される可能性があります。
>
{style="note"}

#### なぜショートカットを置き換えるのか {initial-collapse-state="collapsed" collapsible="true"}

ソースセットの階層を作成するのは冗長になりがちで、間違いやすく、初心者には不親切です。以前の解決策は、階層の一部を作成する `ios` のようなショートカットを導入することでした。しかし、ショートカットを使用してみると、大きな設計上の欠陥があることが判明しました。それは、変更が難しいということです。

例えば `ios` ショートカットを見てみましょう。これは `iosArm64` と `iosX64` ターゲットのみを作成しますが、これは混乱を招く可能性があり、`iosSimulatorArm64` ターゲットも必要とする M1 ベースのホストで作業する場合に問題を引き起こす可能性があります。しかし、`iosSimulatorArm64` ターゲットを追加することは、ユーザープロジェクトにとって非常に破壊的な変更になる可能性があります：

* `iosMain` ソースセットで使用されるすべての依存関係が `iosSimulatorArm64` ターゲットをサポートしている必要があります。そうでなければ、依存関係の解決が失敗します。
* 新しいターゲットを追加した際に、`iosMain` で使用されていた一部のネイティブ API が消える可能性があります（`iosSimulatorArm64` の場合は可能性は低いですが）。
* Intel ベースの MacBook で小さなペットプロジェクトを書いている場合など、この変更が全く必要ないケースもあります。

ショートカットが階層構成の問題を解決していないことは明らかであり、そのため、ある時点から新しいショートカットの追加を中止しました。

デフォルトターゲット階層は一見ショートカットに似ていますが、決定的な違いがあります：**ユーザーがターゲットのセットを明示的に指定しなければならない**という点です。このセットによって、プロジェクトがどのようにコンパイル・公開され、依存関係の解決にどのように参加するかが決まります。このセットは固定されているため、Kotlin Gradle プラグインによるデフォルト構成の変更がエコシステムに与える影響は大幅に少なくなり、ツールによる移行支援も容易になります。

#### デフォルト階層を有効にする方法

この新機能は[実験的](components-stability.md#stability-levels-explained)です。Kotlin Gradle ビルドスクリプトでは、`@OptIn(ExperimentalKotlinGradlePluginApi::class)` でオプトインする必要があります。

詳細は [Hierarchical project structure](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template) を参照してください。

#### フィードバックのお願い

これはマルチプラットフォームプロジェクトにおける大きな変更です。より良くするために、ぜひ[フィードバック](https://kotl.in/issue)をお寄せください。

### Kotlin Multiplatform における Gradle コンポジットビルドサポートのプレビュー

> この機能は、Kotlin Gradle プラグイン 1.8.20 以降の Gradle ビルドでサポートされています。IDE サポートについては、IntelliJ IDEA 2023.1 Beta 2 (231.8109.2) 以降と、Kotlin Gradle プラグイン 1.8.20 を任意の Kotlin IDE プラグインで使用してください。
>
{style="note"}

1.8.20 以降、Kotlin Multiplatform は [Gradle コンポジットビルド (composite builds)](https://docs.gradle.org/current/userguide/composite_builds.html) をサポートします。コンポジットビルドを使用すると、別々のプロジェクトのビルドや、同じプロジェクトの異なる部分を単一のビルドに含めることができます。

技術的な課題により、Kotlin Multiplatform での Gradle コンポジットビルドの使用は部分的にしかサポートされていませんでした。Kotlin 1.8.20 には、より多様なプロジェクトで動作する改善されたサポートのプレビューが含まれています。これを試すには、`gradle.properties` に以下のオプションを追加してください：

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

このオプションにより、新しいインポートモードのプレビューが有効になります。コンポジットビルドのサポートに加えて、インポートをより安定させるための主要なバグ修正や改善が含まれており、マルチプラットフォームプロジェクトでのインポート体験がよりスムーズになります。

#### 既知の問題

これはまだ安定化が必要なプレビュー版であり、途中でインポートに関する問題が発生する可能性があります。Kotlin 1.8.20 の最終リリースまでに修正を予定している既知の問題は以下の通りです：

* IntelliJ IDEA 2023.1 EAP 用の Kotlin 1.8.20 プラグインはまだ利用できません。それにもかかわらず、Kotlin Gradle プラグインのバージョンを 1.8.20 に設定すれば、この IDE でコンポジットビルドを試すことができます。
* プロジェクトに `rootProject.name` が指定されたビルドが含まれている場合、コンポジットビルドで Kotlin メタデータの解決に失敗することがあります。回避策と詳細については、この [Youtrack 課題](https://youtrack.jetbrains.com/issue/KT-56536)を参照してください。

ぜひお試しいただき、Kotlin 1.9.0 でデフォルトにするための助けとなるよう、[YouTrack](https://kotl.in/issue) にレポートをお寄せください。

### Xcode における Gradle エラー出力の改善

Xcode でマルチプラットフォームプロジェクトをビルドする際に問題が発生した場合、「Command PhaseScriptExecution failed with a nonzero exit code」というエラーに遭遇したことがあるかもしれません。このメッセージは Gradle の呼び出しが失敗したことを示していますが、問題の特定にはあまり役立ちません。

Kotlin 1.8.20 以降、Xcode は Kotlin/Native コンパイラからの出力を解析できるようになりました。さらに、Gradle ビルドが失敗した場合には、Xcode 上で根本原因となる例外からの追加エラーメッセージが表示されるようになります。多くの場合、これにより根本的な問題を特定するのに役立ちます。

![Xcode における Gradle エラー出力の改善](xcode-gradle-output.png){width=700}

新しい動作は、マルチプラットフォームプロジェクトの iOS フレームワークを Xcode の iOS アプリケーションに接続する `embedAndSignAppleFrameworkForXcode` などの Xcode 統合用の標準 Gradle タスクでデフォルトで有効になっています。また、`kotlin.native.useXcodeMessageStyle` Gradle プロパティを使用して有効化（または無効化）することもできます。

## Kotlin/JavaScript

Kotlin 1.8.20 では、TypeScript 定義の生成方法が変更されました。また、デバッグ体験を向上させるための変更も含まれています：

* [Gradle プラグインからの Dukat 統合の削除](#removal-of-dukat-integration-from-gradle-plugin)
* [ソースマップにおける Kotlin の変数名と関数名](#kotlin-variable-and-function-names-in-source-maps)
* [TypeScript 定義ファイル生成のオプトイン制への変更](#opt-in-for-generation-of-typescript-definition-files)

### Gradle プラグインからの Dukat 統合の削除

Kotlin 1.8.20 では、[実験的](components-stability.md#stability-levels-explained)であった Dukat 統合を Kotlin/JavaScript Gradle プラグインから削除しました。Dukat 統合は、TypeScript 宣言ファイル (`.d.ts`) から Kotlin の外部宣言への自動変換をサポートしていました。

TypeScript 宣言ファイル (`.d.ts`) から Kotlin の外部宣言への変換は、引き続き弊社の [Dukat ツール](https://github.com/Kotlin/dukat)を代わりに使用して行うことができます。

> Dukat ツールは[実験的](components-stability.md#stability-levels-explained)です。いつでも変更または廃止される可能性があります。
>
{style="warning"}

### ソースマップにおける Kotlin の変数名と関数名

デバッグを支援するために、Kotlin コードで宣言した変数名や関数名をソースマップに追加できる機能を導入しました。1.8.20 以前はソースマップでこれらを利用できなかったため、デバッガーでは常に生成された JavaScript の変数名と関数名が表示されていました。

Gradle ファイル `build.gradle.kts` の `sourceMapNamesPolicy`、または `-source-map-names-policy` コンパイラオプションを使用して、追加される内容を設定できます。以下の表に可能な設定を示します：

| 設定                 | 説明                                                   | 出力例                            |
|-------------------------|-------------------------------------------------------|-----------------------------------|
| `simple-names`          | 変数名と単純な関数名が追加されます。（デフォルト）       | `main`                            |
| `fully-qualified-names` | 変数名と完全修飾関数名が追加されます。                 | `com.example.kjs.playground.main` |
| `no`                    | 変数名や関数名は追加されません。                         | N/A                               |

`build.gradle.kts` ファイルでの設定例を以下に示します：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.Kotlin2JsCompile>().configureEach {
    compilercompileOptions.sourceMapNamesPolicy.set(org.jetbrains.kotlin.gradle.dsl.JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES) // または SOURCE_MAP_NAMES_POLICY_NO, SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES
}
```
{validate="false"}

Chromium ベースのブラウザで提供されているようなデバッグツールは、ソースマップからオリジナルの Kotlin 名を取得し、スタックトレースの可読性を向上させることができます。楽しいデバッグを！

> ソースマップへの変数名と関数名の追加は[実験的](components-stability.md#stability-levels-explained)です。いつでも変更または廃止される可能性があります。
>
{style="warning"}

### TypeScript 定義ファイル生成のオプトイン制への変更

以前は、実行可能ファイルを生成するプロジェクト (`binaries.executable()`) がある場合、Kotlin/JS IR コンパイラは `@JsExport` でマークされたすべてのトップレベル宣言を収集し、自動的に `.d.ts` ファイルに TypeScript 定義を生成していました。

これはすべてのプロジェクトに有用なわけではないため、Kotlin 1.8.20 で動作を変更しました。TypeScript 定義を生成したい場合は、Gradle ビルドファイルで明示的に構成する必要があります。`build.gradle.kts` ファイルの [`js` セクション](js-project-setup.md#execution-environments)に `generateTypeScriptDefinitions()` を追加してください。例：

```kotlin
kotlin {
    js {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```
{validate="false"}

> TypeScript 定義 (`d.ts`) の生成は[実験的](components-stability.md#stability-levels-explained)です。いつでも変更または廃止される可能性があります。
>
{style="warning"}

## Gradle

Kotlin 1.8.20 は、[Multiplatform プラグインの一部の特殊なケース](https://youtrack.jetbrains.com/issue/KT-55751)を除き、Gradle 6.8 から 7.6 と完全に互換性があります。最新の Gradle リリースまで使用することも可能ですが、その場合は非推奨の警告が表示されたり、一部の新しい Gradle 機能が動作しない可能性があることに注意してください。

このバージョンでは以下の変更が行われています：

* [Gradle プラグインのバージョンの新しいアライメント](#new-gradle-plugins-versions-alignment)
* [Gradle における JVM インクリメンタルコンパイルのデフォルト有効化](#new-jvm-incremental-compilation-by-default-in-gradle)
* [コンパイルタスクの出力の高精度なバックアップ](#precise-backup-of-compilation-tasks-outputs)
* [すべての Gradle バージョンにおける Kotlin/JVM タスクの遅延作成](#lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions)
* [コンパイルタスクの destinationDirectory の非デフォルトの場所](#non-default-location-of-compile-tasks-destinationdirectory)
* [HTTP 統計サービスへのコンパイラ引数の報告をオプトアウトする機能](#ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service)

### Gradle プラグインのバージョンの新しいアライメント

Gradle には、一緒に動作する必要がある依存関係の[バージョンが常に揃う (aligned)](https://docs.gradle.org/current/userguide/dependency_version_alignment.html#aligning_versions_natively_with_gradle) ようにする方法が提供されています。Kotlin 1.8.20 でもこのアプローチが採用されました。これはデフォルトで動作するため、有効にするために構成を変更したり更新したりする必要はありません。さらに、[Kotlin Gradle プラグインの推移的依存関係を解決するためのこの回避策](whatsnew18.md#resolution-of-kotlin-gradle-plugins-transitive-dependencies)に頼る必要もなくなりました。

この機能に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-54691) でお待ちしております。

### Gradle における JVM インクリメンタルコンパイルのデフォルト有効化

[Kotlin 1.7.0 から利用可能](whatsnew17.md#a-new-approach-to-incremental-compilation)となっていたインクリメンタルコンパイルの新しいアプローチが、デフォルトで動作するようになりました。有効にするために `gradle.properties` で `kotlin.incremental.useClasspathSnapshot=true` を指定する必要はなくなりました。

これに関するフィードバックをお待ちしております。YouTrack で[課題を報告](https://kotl.in/issue)できます。

### コンパイルタスクの出力の高精度なバックアップ

> コンパイルタスクの出力の高精度なバックアップ (Precise backup) は[実験的](components-stability.md#stability-levels-explained)です。使用するには、`gradle.properties` に `kotlin.compiler.preciseCompilationResultsBackup=true` を追加してください。これに関するフィードバックを [YouTrack](https://kotl.in/issue/experimental-ic-optimizations) でお待ちしております。
>
{style="warning"}

Kotlin 1.8.20 以降、高精度なバックアップを有効にできるようになりました。これにより、[インクリメンタルコンパイル](gradle-compilation-and-caches.md#incremental-compilation)で Kotlin が再コンパイルするクラスのみがバックアップされます。フルバックアップと高精度バックアップの両方が、コンパイルエラー後にビルドを再びインクリメンタルに実行するのに役立ちます。高精度バックアップは、フルバックアップと比較してビルド時間も短縮します。フルバックアップは、大規模なプロジェクトや多くのタスクがバックアップを作成している場合、特にプロジェクトが低速な HDD 上にある場合、**顕著な**ビルド時間を要することがあります。

この最適化は実験的です。`gradle.properties` ファイルに `kotlin.compiler.preciseCompilationResultsBackup` Gradle プロパティを追加することで有効にできます：

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrains における高精度バックアップの使用例 {initial-collapse-state="collapsed" collapsible="true"}

以下のチャートでは、フルバックアップと比較した高精度バックアップの使用例を確認できます：

![フルバックアップと高精度バックアップの比較](comparison-of-full-and-precise-backups.png){width=700}

最初の 2 つのチャートは、Kotlin プロジェクトにおいて高精度バックアップが Kotlin Gradle プラグインのビルドにどのように影響するかを示しています。

1. 多くのモジュールが依存しているモジュールに対して、新しいパブリックメソッドを追加するという小さな [ABI](https://ja.wikipedia.org/wiki/Application_binary_interface) 変更を行った後。
2. 他のどのモジュールも依存していないモジュールに対して、プライベート関数を追加するという小さな非 ABI 変更を行った後。

3 番目のチャートは、[Space](https://www.jetbrains.com/space/) プロジェクトにおいて、多くのモジュールが依存している Kotlin/JS モジュールに対してプライベート関数を追加するという小さな非 ABI 変更を行った後、高精度バックアップが Web フロントエンドのビルドにどのように影響するかを示しています。

これらの測定は Apple M1 Max CPU を搭載したコンピュータで行われました。コンピュータが異なれば結果も多少異なります。パフォーマンスに影響を与える要因には、以下が含まれますが、これらに限定されません：

* [Kotlin デーモン](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)と [Gradle デーモン](https://docs.gradle.org/current/userguide/gradle_daemon.html)がどの程度ウォームアップされているか。
* ディスクの速度。
* CPU のモデルと負荷状況。
* 変更によって影響を受けるモジュールと、それらのモジュールの大きさ。
* 変更が ABI か非 ABI か。

#### ビルドレポートによる最適化の評価 {initial-collapse-state="collapsed" collapsible="true"}

ご自身のプロジェクトやシナリオにおけるコンピュータへの最適化の影響を見積もるには、[Kotlin ビルドレポート](gradle-compilation-and-caches.md#build-reports)を使用できます。`gradle.properties` ファイルに以下のプロパティを追加して、テキストファイル形式のレポートを有効にします：

```none
kotlin.build.report.output=file
```

以下は、高精度バックアップを有効にする前のレポートの該当部分の例です：

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.59 s
<...>
Time metrics:
 Total Gradle task time: 0.59 s
 Task action before worker execution: 0.24 s
  Backup output: 0.22 s // この数値に注目してください
<...>
```

そして、高精度バックアップを有効にした後のレポートの該当部分の例です：

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.46 s
<...>
Time metrics:
 Total Gradle task time: 0.46 s
 Task action before worker execution: 0.07 s
  Backup output: 0.05 s // 時間が短縮されました
 Run compilation in Gradle worker: 0.32 s
  Clear jar cache: 0.00 s
  Precise backup output: 0.00 s // 高精度バックアップに関連
  Cleaning up the backup stash: 0.00 s // 高精度バックアップに関連
<...>
```

### すべての Gradle バージョンにおける Kotlin/JVM タスクの遅延作成

Gradle 7.3+ 上の `org.jetbrains.kotlin.gradle.jvm` プラグインを使用するプロジェクトにおいて、Kotlin Gradle プラグインは `compileKotlin` タスクを先行して (eagerly) 作成および構成しなくなりました。下位の Gradle バージョンでは単にすべてのタスクを登録し、ドライランでは構成しないようになっています。これと同じ動作が Gradle 7.3+ を使用している場合にも適用されます。

### コンパイルタスクの destinationDirectory の非デフォルトの場所

以下のいずれかを行っている場合は、ビルドスクリプトにいくつかのコードを追加して更新してください：

* Kotlin/JVM の `KotlinJvmCompile`/`KotlinCompile` タスクの `destinationDirectory` の場所をオーバーライドしている。
* 非推奨の Kotlin/JS/Non-IR [バリアント](gradle-plugin-variants.md)を使用し、`Kotlin2JsCompile` タスクの `destinationDirectory` をオーバーライドしている。

JAR ファイルの `sourceSets.main.outputs` に `sourceSets.main.kotlin.classesDirectories` を明示的に追加する必要があります：

```groovy
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

### HTTP 統計サービスへのコンパイラ引数の報告をオプトアウトする機能

Kotlin Gradle プラグインが HTTP [ビルドレポート](gradle-compilation-and-caches.md#build-reports)にコンパイラ引数を含めるかどうかを制御できるようになりました。プラグインがこれらの引数を報告する必要がない場合もあります。プロジェクトに多くのモジュールが含まれている場合、レポート内のコンパイラ引数は非常に重くなり、それほど役立たないことがあります。これを無効にしてメモリを節約する方法ができました。`gradle.properties` または `local.properties` で、`kotlin.build.report.include_compiler_arguments=(true|false)` プロパティを使用してください。

この機能に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-55323/) でお待ちしております。

## 標準ライブラリ

Kotlin 1.8.20 では、特に Kotlin/Native 開発に役立つものを含む、さまざまな新機能が追加されました：

* [AutoCloseable インターフェースのサポート](#support-for-the-autocloseable-interface)
* [Base64 エンコーディングおよびデコーディングのサポート](#support-for-base64-encoding)
* [Kotlin/Native における @Volatile のサポート](#support-for-volatile-in-kotlin-native)
* [Kotlin/Native における正規表現使用時のスタックオーバーフローのバグ修正](#bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native)

### AutoCloseable インターフェースのサポート

> 新しい `AutoCloseable` インターフェースは[実験的](components-stability.md#stability-levels-explained)です。使用するには、`@OptIn(ExperimentalStdlibApi::class)` またはコンパイラ引数 `-opt-in=kotlin.ExperimentalStdlibApi` でオプトインする必要があります。
>

{style="warning"}

共通標準ライブラリに `AutoCloseable` インターフェースが追加され、すべてのライブラリでリソースを閉じるために 1 つの共通インターフェースを使用できるようになりました。Kotlin/JVM では、`AutoCloseable` インターフェースは [`java.lang.AutoCloseable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html) のエイリアスです。

さらに、拡張関数 `use()` が含まれるようになりました。これにより、選択したリソースに対して指定されたブロック関数を実行し、例外がスローされたかどうかに関わらず、その後リソースを正しく閉じることができます。

共通標準ライブラリには、`AutoCloseable` インターフェースを実装するパブリッククラスはありません。以下の例では、`XMLWriter` インターフェースを定義し、それを実装するリソースがあると仮定します。例えば、このリソースはファイルを開き、XML コンテンツを書き込み、その後閉じるクラスである可能性があります。

```kotlin
interface XMLWriter : AutoCloseable {
    fun document(encoding: String, version: String, content: XMLWriter.() -> Unit)
    fun element(name: String, content: XMLWriter.() -> Unit)
    fun attribute(name: String, value: String)
    fun text(value: String)
}

fun writeBooksTo(writer: XMLWriter) {
    writer.use { xml ->
        xml.document(encoding = "UTF-8", version = "1.0") {
            element("bookstore") {
                element("book") {
                    attribute("category", "fiction")
                    element("title") { text("Harry Potter and the Prisoner of Azkaban") }
                    element("author") { text("J. K. Rowling") }
                    element("year") { text("1999") }
                    element("price") { text("29.99") }
                }
                element("book") {
                    attribute("category", "programming")
                    element("title") { text("Kotlin in Action") }
                    element("author") { text("Dmitry Jemerov") }
                    element("author") { text("Svetlana Isakova") }
                    element("year") { text("2017") }
                    element("price") { text("25.19") }
                }
            }
        }
    }
}
```
{validate="false"}

### Base64 エンコーディングのサポート

> 新しいエンコーディングおよびデコーディング機能は[実験的](components-stability.md#stability-levels-explained)です。使用するには、`@OptIn(ExperimentalEncodingApi::class)` またはコンパイラ引数 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi` でオプトインする必要があります。
>
{style="warning"}

Base64 エンコーディングおよびデコーディングのサポートを追加しました。それぞれ異なるエンコーディングスキームを使用し、異なる動作をする 3 つのクラスインスタンスを提供します。標準的な [Base64 エンコーディングスキーム](https://www.rfc-editor.org/rfc/rfc4648#section-4)には、`Base64.Default` インスタンスを使用してください。

["URL and Filename safe"](https://www.rfc-editor.org/rfc/rfc4648#section-5) エンコーディングスキームには、`Base64.UrlSafe` インスタンスを使用してください。

[MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) エンコーディングスキームには、`Base64.Mime` インスタンスを使用してください。`Base64.Mime` インスタンスを使用すると、すべてのエンコーディング関数は 76 文字ごとに改行セパレーターを挿入します。デコーディングの場合、不正な文字はスキップされ、例外はスローされません。

> `Base64.Default` インスタンスは `Base64` クラスのコンパニオンオブジェクトです。その結果、`Base64.Default.encode()` や `Base64.Default.decode()` の代わりに `Base64.encode()` および `Base64.decode()` を介してその関数を呼び出すことができます。
>
{style="tip"}

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// または：
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// または：
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```
{validate="false"}

既存のバッファに対してバイトをエンコードまたはデコードする追加の関数や、提供された `Appendable` 型のオブジェクトにエンコード結果を追加する関数も使用できます。

Kotlin/JVM では、入力ストリームおよび出力ストリームを使用して Base64 エンコーディングおよびデコーディングを実行できるように、拡張関数 `encodingWith()` および `decodingWith()` も追加されました。

### Kotlin/Native における @Volatile のサポート

> Kotlin/Native における `@Volatile` は[実験的](components-stability.md#stability-levels-explained)です。いつでも変更または廃止される可能性があります。オプトインが必要です（詳細は以下を参照）。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

`var` プロパティを `@Volatile` でアノテートすると、そのバッキングフィールドがマークされ、このフィールドへの読み取りまたは書き込みがアトミックになり、書き込みが常に他のスレッドから見えるようになります。

1.8.20 以前は、[`kotlin.jvm.Volatile` アノテーション](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)が共通標準ライブラリで利用可能でした。しかし、このアノテーションは JVM でのみ有効です。これを Kotlin/Native で使用しても無視され、エラーにつながる可能性がありました。

1.8.20 では、JVM と Kotlin/Native の両方で使用できる共通のアノテーション `kotlin.concurrent.Volatile` を導入しました。

#### 有効にする方法

この機能を試すには、`@OptIn(ExperimentalStdlibApi)` でオプトインし、`-language-version 1.9` コンパイラオプションを有効にします。Gradle プロジェクトでは、`build.gradle(.kts)` ファイルに以下を追加することで有効にできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

### Kotlin/Native における正規表現使用時のスタックオーバーフローのバグ修正

以前のバージョンの Kotlin では、正規表現パターンが非常にシンプルであっても、正規表現の入力に大量の文字が含まれている場合にクラッシュが発生することがありました。1.8.20 では、この問題は解決されました。詳細については [KT-46211](https://youtrack.jetbrains.com/issue/KT-46211) を参照してください。

## Serialization のアップデート

Kotlin 1.8.20 には、[Kotlin K2 コンパイラの Alpha サポート](#prototype-serialization-compiler-plugin-for-kotlin-k2-compiler)が含まれており、[コンパニオンオブジェクトを介したシリアライザーのカスタマイズが禁止](#prohibit-implicit-serializer-customization-via-companion-object)されました。

### Kotlin K2 コンパイラ用のシリアライゼーションコンパイラプラグインのプロトタイプ

> K2 用の serialization コンパイラプラグインのサポートは [Alpha](components-stability.md#stability-levels-explained) 段階です。使用するには、[Kotlin K2 コンパイラを有効](#how-to-enable-the-kotlin-k2-compiler)にしてください。
>
{style="warning"}

1.8.20 以降、serialization コンパイラプラグインが Kotlin K2 コンパイラで動作するようになりました。ぜひお試しいただき、[フィードバックをお寄せください](#leave-your-feedback-on-the-new-k2-compiler)。

### コンパニオンオブジェクトを介した暗黙的なシリアライザーカスタマイズの禁止

現在、クラスを `@Serializable` アノテーションでシリアライズ可能として宣言すると同時に、そのコンパニオンオブジェクトに `@Serializer` アノテーションを付けてカスタムシリアライザーを宣言することが可能です。

例：

```kotlin
import kotlinx.serialization.*

@Serializable
class Foo(val a: Int) {
    @Serializer(Foo::class)
    companion object {
        // KSerializer<Foo> のカスタム実装
    }
}
```

この場合、どのシリアライザーが使用されているかが `@Serializable` アノテーションから明確ではありません。実際には、クラス `Foo` はカスタムシリアライザーを持っています。

このような混乱を防ぐため、Kotlin 1.8.20 では、このシナリオが検出された場合にコンパイラ警告を導入しました。この警告には、この問題を解決するための考えられる移行パスが含まれています。

コード内でこのような構造を使用している場合は、以下のように更新することをお勧めします：

```kotlin
import kotlinx.serialization.*

@Serializable(Foo.Companion::class)
class Foo(val a: Int) {
    // @Serializer(Foo::class) を使用するかどうかは関係ありません
    companion object: KSerializer<Foo> {
        // KSerializer<Foo> のカスタム実装
    }
}
```

このアプローチにより、`Foo` クラスがコンパニオンオブジェクトで宣言されたカスタムシリアライザーを使用していることが明確になります。詳細については、弊社の [YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-54441)を参照してください。

> Kotlin 2.0 では、このコンパイル警告をコンパイルエラーに昇格させる予定です。この警告が表示された場合は、コードを移行することをお勧めします。
>
{style="tip"}

## ドキュメントのアップデート

Kotlin のドキュメントにいくつかの注目すべき変更が加えられました：

* [Spring Boot と Kotlin で始める](jvm-get-started-spring-boot.md) — データベースを使用してシンプルなアプリケーションを作成し、Spring Boot と Kotlin の機能について詳しく学びましょう。
* [スコープ関数](scope-functions.md) — 標準ライブラリの便利なスコープ関数を使用してコードを簡素化する方法を学びましょう。
* [CocoaPods 統合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) — CocoaPods を使用するための環境をセットアップしましょう。

## Kotlin 1.8.20 のインストール

### IDE バージョンの確認

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.2 および 2022.3 は、Kotlin プラグインをバージョン 1.8.20 に更新することを自動的に提案します。IntelliJ IDEA 2023.1 には、Kotlin プラグイン 1.8.20 が組み込まれています。

Android Studio Flamingo (222) および Giraffe (223) は、次のリリースで Kotlin 1.8.20 をサポートする予定です。

新しいコマンドラインコンパイラは、[GitHub のリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20)からダウンロードできます。

### Gradle の設定

Kotlin のアーティファクトと依存関係を適切にダウンロードするために、Maven Central リポジトリを使用するように `settings.gradle(.kts)` ファイルを更新してください：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

リポジトリが指定されていない場合、Gradle は廃止された JCenter リポジトリを使用するため、Kotlin アーティファクトで問題が発生する可能性があります。