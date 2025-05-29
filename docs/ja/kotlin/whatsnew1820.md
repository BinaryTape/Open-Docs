[//]: # (title: Kotlin 1.8.20の新機能)

_[リリース日: 2023年4月25日](releases.md#release-details)_

Kotlin 1.8.20がリリースされ、その主なハイライトは以下の通りです。

*   [Kotlin K2コンパイラの新しい更新](#new-kotlin-k2-compiler-updates)
*   [新しい実験的なKotlin/Wasmターゲット](#new-kotlin-wasm-target)
*   [GradleでのJVMインクリメンタルコンパイルがデフォルトに](#new-jvm-incremental-compilation-by-default-in-gradle)
*   [Kotlin/Nativeターゲットの更新](#update-for-kotlin-native-targets)
*   [Kotlin MultiplatformにおけるGradle複合ビルドのプレビュー](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
*   [XcodeにおけるGradleエラー出力の改善](#improved-output-for-gradle-errors-in-xcode)
*   [標準ライブラリにおける`AutoCloseable`インターフェースの実験的なサポート](#support-for-the-autocloseable-interface)
*   [標準ライブラリにおけるBase64エンコーディングの実験的なサポート](#support-for-base64-encoding)

これらの変更点の短い概要を、こちらの動画でもご確認いただけます。

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="What's new in Kotlin 1.8.20"/>

## IDEのサポート

Kotlin 1.8.20をサポートするKotlinプラグインは、以下のIDEで利用可能です。

| IDE            | サポートされているバージョン            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |

> Kotlinのアーティファクトと依存関係を適切にダウンロードするには、[Gradle設定を構成](#configure-gradle-settings)してMaven Centralリポジトリを使用してください。
>
{style="warning"}

## Kotlin K2コンパイラの新しい更新

KotlinチームはK2コンパイラの安定化を継続しています。[Kotlin 1.7.0のお知らせ](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)で述べたように、まだ**Alpha**版です。今回のリリースでは、[K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604)に向けたさらなる改善が導入されています。

この1.8.20リリースから、Kotlin K2コンパイラは以下のようになります。

*   シリアライズプラグインのプレビュー版が利用可能です。
*   [JS IRコンパイラ](js-ir-compiler.md)のAlphaサポートを提供します。
*   [新しい言語バージョン、Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/)の将来のリリースを導入します。

新しいコンパイラとその利点については、以下の動画で詳しくご紹介しています。

*   [新しいKotlin K2コンパイラについて誰もが知っておくべきこと](https://www.youtube.com/watch?v=iTdJJq_LyoY)
*   [新しいKotlin K2コンパイラ: エキスパートレビュー](https://www.youtube.com/watch?v=db19VFLZqJM)

### Kotlin K2コンパイラを有効にする方法

Kotlin K2コンパイラを有効にしてテストするには、新しい言語バージョンを以下のコンパイラオプションとともに使用してください。

```bash
-language-version 2.0
```

`build.gradle(.kts)`ファイルで指定できます。

```kotlin
kotlin {
   sourceSets.all {
       languageSettings {
           languageVersion = "2.0"
       }
   }
}
```

以前の`-Xuse-k2`コンパイラオプションは非推奨になりました。

> 新しいK2コンパイラのAlpha版は、JVMおよびJS IRプロジェクトでのみ動作します。Kotlin/Nativeや任意のマルチプラットフォームプロジェクトはまだサポートしていません。
>
{style="warning"}

### 新しいK2コンパイラに関するフィードバックをお願いします

皆様からのフィードバックを心よりお待ちしております！

*   Kotlin SlackでK2開発者に直接フィードバックを提供してください – [招待を取得](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)し、[#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257)チャンネルに参加してください。
*   新しいK2コンパイラで直面した問題は、[課題トラッカー](https://kotl.in/issue)に報告してください。
*   K2の使用に関する匿名データをJetBrainsが収集できるように、[**使用統計を送信**オプションを有効](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)にしてください。

## 言語

Kotlinが進化を続ける中、1.8.20では新しい言語機能のプレビュー版が導入されます。

*   [Enumクラスの`values`関数の現代的で高性能な代替](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
*   [データクラスとの対称性のためのデータオブジェクト](#preview-of-data-objects-for-symmetry-with-data-classes)
*   [インラインクラスのボディを持つセカンダリコンストラクタに関する制限の緩和](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enumクラスの`values`関数の現代的で高性能な代替

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。この機能に関するフィードバックは[YouTrack](https://kotl.in/issue)までお寄せください。
>
{style="warning"}

Enumクラスには、定義されたenum定数の配列を返す合成`values()`関数があります。しかし、配列を使用するとKotlinやJavaで[隠れたパフォーマンス問題](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues)につながる可能性があります。さらに、ほとんどのAPIはコレクションを使用しており、最終的な変換が必要です。これらの問題を解決するために、Enumクラスに`entries`プロパティを導入しました。これは`values()`関数の代わりに使用すべきです。呼び出されたとき、`entries`プロパティは事前に割り当てられた変更不可能なenum定数のリストを返します。

> `values()`関数は引き続きサポートされていますが、代わりに`entries`プロパティを使用することをお勧めします。
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

#### `entries`プロパティを有効にする方法

この機能を試すには、`@OptIn(ExperimentalStdlibApi)`でオプトインし、`-language-version 1.9`コンパイラオプションを有効にしてください。Gradleプロジェクトでは、`build.gradle(.kts)`ファイルに以下を追加することで行えます。

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

> IntelliJ IDEA 2023.1以降、この機能をオプトインしている場合、適切なIDEインスペクションにより`values()`から`entries`への変換が通知され、クイックフィックスが提供されます。
>
{style="tip"}

この提案に関する詳細については、[KEEPノート](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)を参照してください。

### データクラスとの対称性のためのデータオブジェクトのプレビュー

データオブジェクトを使用すると、シングルトンセマンティクスとクリーンな`toString()`表現を持つオブジェクトを宣言できます。このスニペットでは、`data`キーワードをオブジェクト宣言に追加すると、`toString()`出力の可読性がどのように向上するかを確認できます。

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

特に`sealed`階層（`sealed class`や`sealed interface`階層など）では、`data objects`は`data class`宣言とともに便利に利用できるため、非常に適しています。このスニペットでは、`EndOfFile`を通常の`object`ではなく`data object`として宣言することで、手動でオーバーライドすることなく美しい`toString`を取得できます。これにより、付随するデータクラスの定義との対称性が維持されます。

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: Int) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```

#### データオブジェクトのセマンティクス

[Kotlin 1.7.20](whatsnew1720.md#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)での最初のプレビュー版以来、データオブジェクトのセマンティクスは洗練されてきました。コンパイラは現在、データオブジェクトのためにいくつかの便利な関数を自動的に生成します。

##### `toString`

データオブジェクトの`toString()`関数は、オブジェクトのシンプルな名前を返します。

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### `equals` と `hashCode`

`data object`の`equals()`関数は、`data object`の型を持つすべてのオブジェクトが等しいと見なされることを保証します。ほとんどの場合、実行時には`data object`の単一のインスタンスしか持ちません（結局のところ、`data object`はシングルトンを宣言します）。しかし、同じ型の別のオブジェクトが実行時（例えば、`java.lang.reflect`を介したプラットフォームリフレクション、またはこのAPIを内部で利用するJVMシリアライゼーションライブラリの使用によって）に生成されるというエッジケースでは、これによりオブジェクトが等しいものとして扱われることが保証されます。

`data object`は、参照ではなく（`===`演算子ではなく）構造的に（`==`演算子を使用して）のみ比較するようにしてください。これにより、実行時に`data object`のインスタンスが複数存在する場合の落とし穴を回避できます。次のスニペットは、この特定のエッジケースを示しています。

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // MySingleton
    println(evilTwin) // MySingleton

    // Even when a library forcefully creates a second instance of MySingleton, its `equals` method returns true:
    println(MySingleton == evilTwin) // true

    // Do not compare data objects via ===.
    println(MySingleton === evilTwin) // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin reflection does not permit the instantiation of data objects.
    // This creates a new MySingleton instance "by force" (i.e., Java platform reflection)
    // Don't do this yourself!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成される`hashCode()`関数の動作は`equals()`関数の動作と一貫しており、`data object`のすべての実行時インスタンスが同じハッシュコードを持つようになっています。

##### データオブジェクトには`copy`および`componentN`関数はありません

`data object`と`data class`宣言はしばしば一緒に使用され、いくつかの類似点がありますが、`data object`に対しては生成されない関数がいくつかあります。

`data object`宣言はシングルトンオブジェクトとして使用されることを意図しているため、`copy()`関数は生成されません。シングルトンパターンは、クラスのインスタンス化を単一のインスタンスに制限しており、そのインスタンスのコピーが作成されることを許可すると、その制限に違反することになります。

また、`data class`とは異なり、`data object`にはデータプロパティがありません。そのようなオブジェクトを分解しようとすることは意味がないため、`componentN()`関数は生成されません。

この機能に関するフィードバックは、[YouTrack](https://youtrack.jetbrains.com/issue/KT-4107)までお寄せください。

#### データオブジェクトプレビューを有効にする方法

この機能を試すには、`-language-version 1.9`コンパイラオプションを有効にしてください。Gradleプロジェクトでは、`build.gradle(.kts)`ファイルに以下を追加することで行えます。

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

### インラインクラスのボディを持つセカンダリコンストラクタに関する制限の緩和のプレビュー

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。この機能に関するフィードバックは[YouTrack](https://kotl.in/issue)までお寄せください。
>
{style="warning"}

Kotlin 1.8.20では、[インラインクラス](inline-classes.md)におけるボディを持つセカンダリコンストラクタの使用に関する制限が緩和されます。

インラインクラスはこれまで、明確な初期化セマンティクスを持つために、`init`ブロックやセカンダリコンストラクタなしのpublicなプライマリコンストラクタのみを許可していました。その結果、基底値をカプセル化したり、制約付きの値を表現するインラインクラスを作成したりすることが不可能でした。

これらの問題は、Kotlin 1.4.30で`init`ブロックの制限が解除されたときに修正されました。今回、さらに一歩進んで、プレビューモードでボディを持つセカンダリコンストラクタを許可します。

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Kotlin 1.4.30以降許可:
    init { 
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }

    // Kotlin 1.8.20以降プレビューで利用可能:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

#### ボディを持つセカンダリコンストラクタを有効にする方法

この機能を試すには、`-language-version 1.9`コンパイラオプションを有効にしてください。Gradleプロジェクトでは、`build.gradle(.kts)`に以下を追加することで行えます。

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

この機能をぜひお試しいただき、Kotlin 1.9.0でデフォルトにできるよう、[YouTrack](https://kotl.in/issue)にすべてのレポートを提出していただくことをお勧めします。

Kotlinインラインクラスの開発について詳しくは、[こちらのKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md)をご覧ください。

## 新しいKotlin/Wasmターゲット

このリリースで、Kotlin/Wasm (Kotlin WebAssembly)は[実験的](components-stability.md#stability-levels-explained)機能となります。Kotlinチームは[WebAssembly](https://webassembly.org/)を有望な技術と考えており、Kotlinのすべての利点を活用できるより良い方法を見つけたいと考えています。

WebAssemblyのバイナリフォーマットは、独自の仮想マシンを使用して実行されるため、プラットフォームに依存しません。ほとんどすべてのモダンブラウザはすでにWebAssembly 1.0をサポートしています。WebAssemblyを実行するための環境を設定するには、Kotlin/Wasmがターゲットとする実験的なガベージコレクションモードを有効にするだけです。詳細な手順はこちらで確認できます: [Kotlin/Wasmを有効にする方法](#how-to-enable-kotlin-wasm)。

新しいKotlin/Wasmターゲットの以下の利点を強調したいと思います。

*   Kotlin/WasmはLLVMを使用する必要がないため、`wasm32` Kotlin/Nativeターゲットと比較してコンパイル速度が高速です。
*   [Wasmガベージコレクション](https://github.com/WebAssembly/gc)のおかげで、`wasm32`ターゲットと比較してJSとの相互運用性およびブラウザとの統合が容易です。
*   Wasmはコンパクトで解析しやすいバイトコードを持っているため、Kotlin/JSやJavaScriptと比較してアプリケーションの起動が高速になる可能性があります。
*   Wasmは静的型付け言語であるため、Kotlin/JSやJavaScriptと比較してアプリケーションのランタイムパフォーマンスが向上します。

1.8.20リリースから、実験的なプロジェクトでKotlin/Wasmを使用できるようになります。Kotlin/Wasm用にKotlin標準ライブラリ（`stdlib`）とテストライブラリ（`kotlin.test`）をすぐに利用できるように提供します。IDEのサポートは将来のリリースで追加される予定です。

[このYouTube動画でKotlin/Wasmについて詳しく学ぶ](https://www.youtube.com/watch?v=-pqz9sKXatw)。

### Kotlin/Wasmを有効にする方法

Kotlin/Wasmを有効にしてテストするには、`build.gradle.kts`ファイルを更新してください。

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

> [Kotlin/Wasmの例を含むGitHubリポジリ](https://github.com/Kotlin/kotlin-wasm-examples)をご覧ください。
>
{style="tip"}

Kotlin/Wasmプロジェクトを実行するには、ターゲット環境の設定を更新する必要があります。

<tabs>
<tab title="Chrome">

*   バージョン109の場合:

    アプリケーションを`--js-flags=--experimental-wasm-gc`コマンドライン引数で実行します。

*   バージョン110以降の場合:

    1.  ブラウザで`chrome://flags/#enable-webassembly-garbage-collection`にアクセスします。
    2.  **WebAssembly Garbage Collection**を有効にします。
    3.  ブラウザを再起動します。

</tab>
<tab title="Firefox">

バージョン109以降の場合:

1.  ブラウザで`about:config`にアクセスします。
2.  `javascript.options.wasm_function_references`および`javascript.options.wasm_gc`オプションを有効にします。
3.  ブラウザを再起動します。

</tab>
<tab title="Edge">

バージョン109以降の場合:

アプリケーションを`--js-flags=--experimental-wasm-gc`コマンドライン引数で実行します。

</tab>
</tabs>

### Kotlin/Wasmに関するフィードバックをお願いします

皆様からのフィードバックを心よりお待ちしております！

*   Kotlin Slackで開発者に直接フィードバックを提供してください – [招待を取得](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)し、[#webassembly](https://kotlinlang.slack.com/archives/CDFP59223)チャンネルに参加してください。
*   Kotlin/Wasmで直面した問題は、[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-56492)に報告してください。

## Kotlin/JVM

Kotlin 1.8.20では、[Java合成プロパティ参照のプレビュー](#preview-of-java-synthetic-property-references)と、[kaptスタブ生成タスクにおけるJVM IRバックエンドのサポートがデフォルトで有効](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)になります。

### Java合成プロパティ参照のプレビュー

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。評価目的でのみ使用してください。この機能に関するフィードバックは[YouTrack](https://kotl.in/issue)までお寄せください。
>
{style="warning"}

Kotlin 1.8.20では、Java合成プロパティへの参照を作成する機能が導入されました。例えば、以下のJavaコードの場合です。

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

Kotlinではこれまでも、`age`が合成プロパティである`person.age`と書くことができました。今回、`Person::age`や`person::age`への参照も作成できるようになりました。`name`についても同様です。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // Java合成プロパティへの参照を呼び出す:
        .sortedBy(Person::age)
        // Kotlinプロパティ構文を介してJavaゲッターを呼び出す:
        .forEach { person -> println(person.name) }
```
{validate="false"}

#### Java合成プロパティ参照を有効にする方法

この機能を試すには、`-language-version 1.9`コンパイラオプションを有効にしてください。Gradleプロジェクトでは、`build.gradle(.kts)`に以下を追加することで行えます。

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

### kaptスタブ生成タスクにおけるJVM IRバックエンドのサポートがデフォルトに

Kotlin 1.7.20で、[kaptスタブ生成タスクにおけるJVM IRバックエンドのサポート](whatsnew1720.md#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)を導入しました。このリリースから、このサポートはデフォルトで動作します。有効にするために`gradle.properties`に`kapt.use.jvm.ir=true`を指定する必要はなくなりました。この機能に関するフィードバックは[YouTrack](https://youtrack.jetbrains.com/issue/KT-49682)までお寄せください。

## Kotlin/Native

Kotlin 1.8.20には、サポートされるKotlin/Nativeターゲットの変更、Objective-Cとの相互運用性、CocoaPods Gradleプラグインの改善などが含まれています。

*   [Kotlin/Nativeターゲットの更新](#update-for-kotlin-native-targets)
*   [レガシーメモリマネージャーの非推奨化](#deprecation-of-the-legacy-memory-manager)
*   [`@import`ディレクティブを持つObjective-Cヘッダーのサポート](#support-for-objective-c-headers-with-import-directives)
*   [Cocoapods Gradleプラグインにおけるリンクオンリーモードのサポート](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
*   [UIKitでのObjective-C拡張をクラスメンバーとしてインポート](#import-objective-c-extensions-as-class-members-in-uikit)
*   [コンパイラにおけるコンパイラキャッシュ管理の再実装](#reimplementation-of-compiler-cache-management-in-the-compiler)
*   [Cocoapods Gradleプラグインにおける`useLibraries()`の非推奨化](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Nativeターゲットの更新
  
Kotlinチームは、Kotlin/Nativeがサポートするターゲットのリストを見直し、それらをティアに分割し、Kotlin 1.8.20から一部を非推奨とすることを決定しました。サポートされているターゲットと非推奨のターゲットの完全なリストについては、[Kotlin/Nativeターゲットサポート](native-target-support.md)セクションを参照してください。

以下のターゲットはKotlin 1.8.20で非推奨となり、1.9.20で削除されます。

*   `iosArm32`
*   `watchosX86`
*   `wasm32`
*   `mingwX86`
*   `linuxArm32Hfp`
*   `linuxMips32`
*   `linuxMipsel32`

残りのターゲットについては、Kotlin/Nativeコンパイラでターゲットがどれだけサポートされ、テストされているかに応じて、3つのサポートティアが設けられています。ターゲットは異なるティアに移動する可能性があります。例えば、[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)にとって重要であるため、将来的には`iosArm64`を完全にサポートするよう最善を尽くします。

ライブラリ作者であれば、これらのターゲットティアは、CIツールでどのターゲットをテストし、どのターゲットをスキップするかを決定するのに役立ちます。Kotlinチームも、[kotlinx.coroutines](coroutines-guide.md)のような公式Kotlinライブラリを開発する際に同じアプローチを使用します。

これらの変更の理由について詳しくは、[ブログ記事](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/)をご覧ください。

### レガシーメモリマネージャーの非推奨化

1.8.20から、レガシーメモリマネージャーは非推奨となり、1.9.20で削除されます。[新しいメモリマネージャー](native-memory-manager.md)は1.7.20でデフォルトで有効になり、さらなる安定性向上とパフォーマンス改善が継続的に行われています。

レガシーメモリマネージャーをまだ使用している場合は、`gradle.properties`から`kotlin.native.binary.memoryModel=strict`オプションを削除し、必要な変更を行うために[移行ガイド](native-migration-guide.md)に従ってください。

新しいメモリマネージャーは`wasm32`ターゲットをサポートしていません。このターゲットも[このリリースから非推奨](#update-for-kotlin-native-targets)となり、1.9.20で削除されます。

### `@import`ディレクティブを持つObjective-Cヘッダーのサポート

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。この機能に関するフィードバックは[YouTrack](https://kotl.in/issue)までお寄せください。
>
{style="warning"}

Kotlin/Nativeは、`@import`ディレクティブを持つObjective-Cヘッダーをインポートできるようになりました。この機能は、自動生成されたObjective-Cヘッダーを持つSwiftライブラリや、Swiftで書かれたCocoaPods依存関係のクラスを使用する場合に役立ちます。

以前は、cinteropツールは`@import`ディレクティブを介してObjective-Cモジュールに依存するヘッダーを解析できませんでした。これは、`-fmodules`オプションのサポートが不足していたためです。

Kotlin 1.8.20から、`@import`を持つObjective-Cヘッダーを使用できるようになりました。そのためには、定義ファイルで`-fmodules`オプションを`compilerOpts`としてコンパイラに渡します。[CocoaPods統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)を使用している場合は、`pod()`関数の設定ブロックでcinteropオプションを次のように指定します。

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

これは[待ち望まれていた機能](https://youtrack.jetbrains.com/issue/KT-39120)であり、将来のリリースでデフォルトにできるよう、[YouTrack](https://kotl.in/issue)でのフィードバックをお待ちしております。

### Cocoapods Gradleプラグインにおけるリンクオンリーモードのサポート

Kotlin 1.8.20では、cinteropバインディングを生成することなく、動的フレームワークを持つPod依存関係をリンク専用として使用できます。これは、cinteropバインディングがすでに生成されている場合に便利です。

ライブラリとアプリの2つのモジュールを持つプロジェクトを考えてみましょう。ライブラリはPodに依存していますが、フレームワークを生成せず、`.klib`のみを生成します。アプリはライブラリに依存し、動的フレームワークを生成します。この場合、このフレームワークをライブラリが依存するPodとリンクさせる必要がありますが、cinteropバインディングはライブラリ用にすでに生成されているため必要ありません。

この機能を有効にするには、Podへの依存関係を追加する際に`linkOnly`オプションまたはビルダプロパティを使用します。

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

> このオプションを静的フレームワークで使用すると、Podは静的フレームワークのリンクには使用されないため、Podの依存関係が完全に削除されます。
>
{style="note"}

### UIKitでObjective-C拡張をクラスメンバーとしてインポート

Xcode 14.1以降、Objective-Cクラスの一部のメソッドがカテゴリメンバーに移動されました。これにより、異なるKotlin APIが生成され、これらのメソッドはメソッドではなくKotlin拡張としてインポートされるようになりました。

UIKitを使用してメソッドをオーバーライドする際に、これにより問題が発生した可能性があります。例えば、Kotlinで`UIView`をサブクラス化する際に`drawRect()`や`layoutSubviews()`メソッドをオーバーライドすることが不可能になりました。

1.8.20以降、`NSView`および`UIView`クラスと同じヘッダーで宣言されているカテゴリメンバーは、これらのクラスのメンバーとしてインポートされます。これにより、`NSView`および`UIView`からサブクラス化するメソッドは、他のメソッドと同様に簡単にオーバーライドできます。

すべてが順調に進めば、すべてのObjective-Cクラスに対してこの動作をデフォルトで有効にする予定です。

### コンパイラにおけるコンパイラキャッシュ管理の再実装

コンパイラキャッシュの進化を加速させるため、コンパイラキャッシュ管理をKotlin GradleプラグインからKotlin/Nativeコンパイラに移動しました。これにより、コンパイル時間やコンパイラキャッシュの柔軟性に関するものを含め、いくつかの重要な改善作業のブロックが解除されました。

問題が発生し、以前の動作に戻す必要がある場合は、`kotlin.native.cacheOrchestration=gradle` Gradleプロパティを使用してください。

これに関するフィードバックは、[YouTrack](https://kotl.in/issue)までお寄せください。

### Cocoapods Gradleプラグインにおける`useLibraries()`の非推奨化

Kotlin 1.8.20では、静的ライブラリ向け[CocoaPods統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)で使用される`useLibraries()`関数の非推奨化サイクルが開始されます。

静的ライブラリを含むPodへの依存を許可するために`useLibraries()`関数を導入しました。しかし、時間の経過とともに、このケースは非常に稀になりました。ほとんどのPodはソースで配布されており、Objective-CフレームワークやXCFrameworksがバイナリ配布の一般的な選択肢となっています。

この関数はあまり使われておらず、Kotlin CocoaPods Gradleプラグインの開発を複雑にする問題を引き起こすため、非推奨とすることを決定しました。

フレームワークとXCFrameworksに関する詳細については、[最終的なネイティブバイナリをビルドする](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)を参照してください。

## Kotlin Multiplatform

Kotlin 1.8.20では、Kotlin Multiplatformに対する以下の更新により、開発者エクスペリエンスの向上を目指しています。

*   [ソースセット階層の設定に関する新しいアプローチ](#new-approach-to-source-set-hierarchy)
*   [Kotlin MultiplatformにおけるGradle複合ビルドサポートのプレビュー](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
*   [XcodeにおけるGradleエラー出力の改善](#improved-output-for-gradle-errors-in-xcode)

### ソースセット階層への新しいアプローチ

> ソースセット階層への新しいアプローチは[実験的](components-stability.md#stability-levels-explained)です。将来のKotlinリリースで予告なく変更される可能性があります。オプトインが必要です（詳細は下記参照）。[YouTrack](https://kotl.in/issue)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.8.20では、マルチプラットフォームプロジェクトのソースセット階層を設定する新しい方法として、デフォルトターゲット階層が提供されます。この新しいアプローチは、[設計上の欠陥](#why-replace-shortcuts)を持つ`ios`のようなターゲットショートカットを置き換えることを目的としています。

デフォルトターゲット階層の背後にある考え方はシンプルです。プロジェクトがコンパイルするすべてのターゲットを明示的に宣言すると、Kotlin Gradleプラグインが指定されたターゲットに基づいて共有ソースセットを自動的に作成します。

#### プロジェクトをセットアップする

シンプルなマルチプラットフォームモバイルアプリの例を考えてみましょう。

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // デフォルトターゲット階層を有効にする:
    targetHierarchy.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

デフォルトターゲット階層は、可能なすべてのターゲットとそれらの共有ソースセットのテンプレートと考えることができます。コード内で最終的なターゲット`android`、`iosArm64`、`iosSimulatorArm64`を宣言すると、Kotlin Gradleプラグインはテンプレートから適切な共有ソースセットを見つけて作成します。結果として得られる階層は次のようになります。

![An example of using the default target hierarchy](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

緑色のソースセットは実際に作成されプロジェクトに存在しますが、デフォルトテンプレートの灰色のソースセットは無視されます。ご覧のとおり、Kotlin Gradleプラグインは、例えば`watchos`ソースセットを作成していません。これは、プロジェクトにwatchOSターゲットがないためです。

`watchosArm64`のようなwatchOSターゲットを追加すると、`watchos`ソースセットが作成され、`apple`、`native`、`common`ソースセットからのコードも`watchosArm64`にコンパイルされます。

デフォルトターゲット階層の完全なスキームは、[ドキュメント](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)で確認できます。

> この例では、`apple`と`native`ソースセットは`iosArm64`と`iosSimulatorArm64`ターゲットにのみコンパイルされます。そのため、その名前にもかかわらず、完全なiOS APIにアクセスできます。これは`native`のようなソースセットにとっては直感に反するかもしれません。なぜなら、すべてのネイティブターゲットで利用可能なAPIのみがこのソースセットでアクセスできると予想されるからです。この動作は将来変更される可能性があります。
>
{style="note"}

#### なぜショートカットを置き換えるのか {initial-collapse-state="collapsed" collapsible="true"}

ソースセット階層を作成することは、冗長でエラーが発生しやすく、初心者には優しくありませんでした。以前の解決策は、階層の一部を自動的に作成する`ios`のようなショートカットを導入することでした。しかし、ショートカットの使用には大きな設計上の欠陥があることが判明しました。それは変更が難しいということです。

例えば、`ios`ショートカットを考えてみましょう。これは`iosArm64`と`iosX64`ターゲットのみを作成するため、混乱を招き、`iosSimulatorArm64`ターゲットも必要とするM1ベースのホストで作業する際に問題につながる可能性があります。しかし、`iosSimulatorArm64`ターゲットを追加することは、ユーザープロジェクトにとって非常に破壊的な変更となる可能性があります。

*   `iosMain`ソースセットで使用されるすべての依存関係は`iosSimulatorArm64`ターゲットをサポートしている必要があります。そうでない場合、依存関係の解決に失敗します。
*   新しいターゲットを追加すると、`iosMain`で使用されている一部のネイティブAPIが消える可能性があります（ただし、`iosSimulatorArm64`の場合にはほとんどありません）。
*   IntelベースのMacBookで小さな個人プロジェクトを作成している場合など、この変更自体が必要ない場合もあります。

ショートカットが階層設定の問題を解決しないことが明らかになったため、ある時点で新しいショートカットの追加を停止しました。

デフォルトターゲット階層は一見するとショートカットに似ているかもしれませんが、決定的な違いがあります。それは、**ユーザーがターゲットのセットを明示的に指定する必要がある**ということです。このセットは、プロジェクトがどのようにコンパイルされ、公開され、依存関係の解決に参加するかを定義します。このセットは固定されているため、Kotlin Gradleプラグインからのデフォルト設定の変更は、エコシステムに与える影響が大幅に少なくなり、ツール支援による移行の提供がはるかに容易になります。

#### デフォルト階層を有効にする方法

この新機能は[実験的](components-stability.md#stability-levels-explained)です。Kotlin Gradleビルドスクリプトの場合、`@OptIn(ExperimentalKotlinGradlePluginApi::class)`でオプトインする必要があります。

詳細については、[階層型プロジェクト構造](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)を参照してください。

#### フィードバックを残す

これはマルチプラットフォームプロジェクトにとって重要な変更です。さらに改善するため、[フィードバック](https://kotl.in/issue)をお寄せください。

### Kotlin MultiplatformにおけるGradle複合ビルドサポートのプレビュー

> この機能は、Kotlin Gradleプラグイン1.8.20以降、Gradleビルドでサポートされています。IDEサポートについては、IntelliJ IDEA 2023.1 Beta 2 (231.8109.2)以降と、任意のKotlin IDEプラグインがインストールされたKotlin Gradleプラグイン1.8.20を使用してください。
>
{style="note"}

1.8.20から、Kotlin Multiplatformは[Gradle複合ビルド](https://docs.gradle.org/current/userguide/composite_builds.html)をサポートします。複合ビルドを使用すると、別々のプロジェクトまたは同じプロジェクトの一部を単一のビルドに含めることができます。

いくつかの技術的な課題のため、Kotlin MultiplatformでのGradle複合ビルドの使用は部分的にしかサポートされていませんでした。Kotlin 1.8.20には、より幅広いプロジェクトで機能するはずの改善されたサポートのプレビューが含まれています。これを試すには、`gradle.properties`に以下のオプションを追加してください。

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

このオプションは、新しいインポートモードのプレビューを有効にします。複合ビルドのサポートに加えて、インポートをより安定させるための主要なバグ修正と改善が含まれているため、マルチプラットフォームプロジェクトでのよりスムーズなインポートエクスペリエンスを提供します。

#### 既知の問題

これはまださらなる安定化が必要なプレビューバージョンであり、インポート中にいくつかの問題に遭遇する可能性があります。Kotlin 1.8.20の最終リリース前に修正を予定している既知の問題は以下の通りです。

*   IntelliJ IDEA 2023.1 EAP向けにはまだKotlin 1.8.20プラグインが利用できません。それにもかかわらず、Kotlin Gradleプラグインのバージョンを1.8.20に設定し、このIDEで複合ビルドを試すことは可能です。
*   プロジェクトに`rootProject.name`が指定されたビルドが含まれている場合、複合ビルドがKotlinメタデータの解決に失敗する可能性があります。回避策と詳細については、この[YouTrack課題](https://youtrack.jetbrains.com/issue/KT-56536)を参照してください。

ぜひお試しいただき、Kotlin 1.9.0でデフォルトにできるよう、[YouTrack](https://kotl.in/issue)にすべてのレポートを提出していただくことをお勧めします。

### XcodeにおけるGradleエラー出力の改善

Xcodeでマルチプラットフォームプロジェクトをビルドする際に問題が発生した場合、「Command PhaseScriptExecution failed with a nonzero exit code」エラーに遭遇したことがあるかもしれません。このメッセージはGradleの呼び出しが失敗したことを示していますが、問題の特定にはあまり役立ちません。

Kotlin 1.8.20から、XcodeはKotlin/Nativeコンパイラからの出力を解析できるようになりました。さらに、Gradleビルドが失敗した場合、Xcodeで根本原因の例外からの追加のエラーメッセージが表示されます。ほとんどの場合、これにより根本的な問題を特定するのに役立ちます。

![Improved output for Gradle errors in Xcode](xcode-gradle-output.png){width=700}

この新しい動作は、Xcode統合のための標準的なGradleタスク（マルチプラットフォームプロジェクトのiOSフレームワークをXcodeのiOSアプリケーションに接続できる`embedAndSignAppleFrameworkForXcode`など）でデフォルトで有効になります。また、`kotlin.native.useXcodeMessageStyle` Gradleプロパティを使用して有効（または無効）にすることもできます。

## Kotlin/JavaScript

Kotlin 1.8.20では、TypeScript定義の生成方法が変更されます。また、デバッグエクスペリエンスを向上させるための変更も含まれています。

*   [GradleプラグインからのDukat統合の削除](#removal-of-dukat-integration-from-gradle-plugin)
*   [ソースマップ内のKotlin変数名と関数名](#kotlin-variable-and-function-names-in-source-maps)
*   [TypeScript定義ファイルの生成へのオプトイン](#opt-in-for-generation-of-typescript-definition-files)

### GradleプラグインからのDukat統合の削除

Kotlin 1.8.20では、Kotlin/JavaScript Gradleプラグインから[実験的](components-stability.md#stability-levels-explained)なDukat統合を削除しました。Dukat統合は、TypeScript宣言ファイル（`.d.ts`）をKotlin外部宣言に自動変換する機能をサポートしていました。

代わりに、[Dukatツール](https://github.com/Kotlin/dukat)を使用して、TypeScript宣言ファイル（`.d.ts`）をKotlin外部宣言に変換することは引き続き可能です。

> Dukatツールは[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。
>
{style="warning"}

### ソースマップ内のKotlin変数名と関数名

デバッグを支援するため、Kotlinコードで宣言した変数名と関数名をソースマップに追加する機能が導入されました。1.8.20以前は、これらはソースマップで利用できなかったため、デバッガーでは常に生成されたJavaScriptの変数名と関数名が表示されていました。

追加される内容は、Gradleファイルの`build.gradle.kts`で`sourceMapNamesPolicy`を使用するか、`-source-map-names-policy`コンパイラオプションを使用して設定できます。以下の表に可能な設定を示します。

| 設定 | 説明 | 出力例 |
|-------------------------|---------------------------------------------------------------|-----------------------------------|
| `simple-names`          | 変数名と単純な関数名が追加されます。(デフォルト) | `main`                            |
| `fully-qualified-names` | 変数名と完全修飾関数名が追加されます。 | `com.example.kjs.playground.main` |
| `no`                    | 変数名や関数名は追加されません。 | N/A |

`build.gradle.kts`ファイルでの設定例を以下に示します。

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.Kotlin2JsCompile>().configureEach {
    compilercompileOptions.sourceMapNamesPolicy.set(org.jetbrains.kotlin.gradle.dsl.JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES) // or SOURCE_MAP_NAMES_POLICY_NO, or SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES
}
```
{validate="false"}

Chromiumベースのブラウザで提供されているようなデバッグツールは、ソースマップから元のKotlin名を取得して、スタックトレースの可読性を向上させることができます。快適なデバッグをお楽しみください！

> ソースマップへの変数名と関数名の追加は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。
>
{style="warning"}

### TypeScript定義ファイルの生成へのオプトイン

以前は、実行可能ファイル（`binaries.executable()`）を生成するプロジェクトがある場合、Kotlin/JS IRコンパイラは`@JsExport`でマークされたすべてのトップレベル宣言を収集し、`.d.ts`ファイルにTypeScript定義を自動的に生成していました。

これはすべてのプロジェクトで有用であるわけではないため、Kotlin 1.8.20で動作を変更しました。TypeScript定義を生成したい場合は、Gradleビルドファイルで明示的にこれを設定する必要があります。[ `js`セクション](js-project-setup.md#execution-environments)の`build.gradle.kts.file`に`generateTypeScriptDefinitions()`を追加してください。例を示します。

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

> TypeScript定義（`d.ts`）の生成は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。
>
{style="warning"}

## Gradle

Kotlin 1.8.20は、[マルチプラットフォームプラグインのいくつかの特殊なケース](https://youtrack.jetbrains.com/issue/KT-55751)を除き、Gradle 6.8から7.6までと完全に互換性があります。最新のGradleリリースまでのバージョンを使用することも可能ですが、その場合、非推奨の警告に遭遇したり、一部の新しいGradle機能が動作しない可能性があることに留意してください。

このバージョンでは、以下の変更が導入されています。

*   [Gradleプラグインバージョンの新しいアラインメント](#new-gradle-plugins-versions-alignment)
*   [GradleでのJVMインクリメンタルコンパイルがデフォルトに](#new-jvm-incremental-compilation-by-default-in-gradle)
*   [コンパイルタスク出力の正確なバックアップ](#precise-backup-of-compilation-tasks-outputs)
*   [すべてのGradleバージョンにおけるKotlin/JVMタスクの遅延作成](#lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions)
*   [コンパイルタスクの`destinationDirectory`の非デフォルトロケーション](#non-default-location-of-compile-tasks-destinationdirectory)
*   [コンパイラ引数をHTTP統計サービスに報告しないオプション](#ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service)

### Gradleプラグインバージョンの新しいアラインメント

Gradleは、連携して動作する必要がある依存関係が常に[バージョンを揃える](https://docs.gradle.org/current/userguide/dependency_version_alignment.html#aligning_versions_natively_with_gradle)方法を提供します。Kotlin 1.8.20もこのアプローチを採用しました。デフォルトで動作するため、有効にするために設定を変更したり更新したりする必要はありません。さらに、[Kotlin Gradleプラグインの推移的依存関係を解決するためのこの回避策](whatsnew18.md#resolution-of-kotlin-gradle-plugins-transitive-dependencies)に頼る必要もなくなりました。

この機能に関するフィードバックは、[YouTrack](https://youtrack.jetbrains.com/issue/KT-54691)までお寄せください。

### GradleでのJVMインクリメンタルコンパイルがデフォルトに

[Kotlin 1.7.0から利用可能であった](whatsnew17.md#a-new-approach-to-incremental-compilation)インクリメンタルコンパイルの新しいアプローチが、デフォルトで動作するようになりました。有効にするために`gradle.properties`に`kotlin.incremental.useClasspathSnapshot=true`を指定する必要はなくなりました。

これに関するフィードバックをお待ちしております。[YouTrackに課題を提出](https://kotl.in/issue)できます。

### コンパイルタスク出力の正確なバックアップ

> コンパイルタスク出力の正確なバックアップは[実験的](components-stability.md#stability-levels-explained)です。使用するには、`gradle.properties`に`kotlin.compiler.preciseCompilationResultsBackup=true`を追加してください。この機能に関するフィードバックは[YouTrack](https://kotl.in/issue/experimental-ic-optimizations)までお寄せください。
>
{style="warning"}

Kotlin 1.8.20から、正確なバックアップを有効にできるようになりました。これにより、[インクリメンタルコンパイル](gradle-compilation-and-caches.md#incremental-compilation)でKotlinが再コンパイルするクラスのみがバックアップされます。完全バックアップと正確なバックアップの両方が、コンパイルエラー後にビルドを再びインクリメンタルに実行するのに役立ちます。正確なバックアップは、完全バックアップと比較してビルド時間を節約します。完全バックアップは、大規模なプロジェクトや、多くのタスクがバックアップを作成している場合、特にプロジェクトが低速なHDD上にある場合に、**かなりの**ビルド時間を要する可能性があります。

この最適化は実験的です。`gradle.properties`ファイルに`kotlin.compiler.preciseCompilationResultsBackup`Gradleプロパティを追加することで有効にできます。

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrainsでの正確なバックアップ使用例 {initial-collapse-state="collapsed" collapsible="true"}

以下のチャートでは、完全バックアップと比較した正確なバックアップの使用例を確認できます。

![Comparison of full and precise backups](comparison-of-full-and-precise-backups.png){width=700}

最初の2つのチャートは、Kotlinプロジェクトにおける正確なバックアップがKotlin Gradleプラグインのビルドにどのように影響するかを示しています。

1.  多くのモジュールが依存するモジュールに、小さな[ABI](https://en.wikipedia.org/wiki/Application_binary_interface)変更（新しいpublicメソッドの追加）を行った後。
2.  他のモジュールが依存しないモジュールに、小さな非ABI変更（プライベート関数の追加）を行った後。

3番目のチャートは、[Space](https://www.jetbrains.com/space/)プロジェクトにおける正確なバックアップが、多くのモジュールが依存するKotlin/JSモジュールに小さな非ABI変更（プライベート関数の追加）を行った後のWebフロントエンドのビルドにどのように影響するかを示しています。

これらの測定はApple M1 Max CPUを搭載したコンピュータで実行されました。異なるコンピュータではわずかに異なる結果が得られます。パフォーマンスに影響を与える要因には、以下が含まれますが、これに限定されません。

*   [Kotlinデーモン](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)および[Gradleデーモン](https://docs.gradle.org/current/userguide/gradle_daemon.html)の状態。
*   ディスクの速度。
*   CPUモデルと使用率。
*   変更によって影響を受けるモジュールとそれらのモジュールのサイズ。
*   変更がABIであるか非ABIであるか。

#### ビルドレポートを使用した最適化の評価 {initial-collapse-state="collapsed" collapsible="true"}

プロジェクトとシナリオにおける最適化の影響をコンピュータで推定するには、[Kotlinビルドレポート](gradle-compilation-and-caches.md#build-reports)を使用できます。テキストファイル形式でレポートを有効にするには、`gradle.properties`ファイルに以下のプロパティを追加してください。

```none
kotlin.build.report.output=file
```

正確なバックアップを有効にする前のレポートの関連部分の例を以下に示します。

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.59 s
<...>
Time metrics:
 Total Gradle task time: 0.59 s
 Task action before worker execution: 0.24 s
  Backup output: 0.22 s // この数値に注意してください 
<...>
```

正確なバックアップを有効にした後のレポートの関連部分の例を以下に示します。

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.46 s
<...>
Time metrics:
 Total Gradle task time: 0.46 s
 Task action before worker execution: 0.07 s
  Backup output: 0.05 s // 時間が短縮されました
 Run compilation in Gradle worker: 0.32 s
  Clear jar cache: 0.00 s
  Precise backup output: 0.00 s // 正確なバックアップに関連
  Cleaning up the backup stash: 0.00 s // 正確なバックアップに関連
<...>
```

### すべてのGradleバージョンにおけるKotlin/JVMタスクの遅延作成

Gradle 7.3+の`org.jetbrains.kotlin.gradle.jvm`プラグインを使用するプロジェクトでは、Kotlin Gradleプラグインはタスク`compileKotlin`を積極的に作成・設定しなくなりました。下位のGradleバージョンでは、すべてのタスクを登録するだけで、ドライラン時にはそれらを設定しません。Gradle 7.3+を使用する場合も同じ動作が適用されるようになりました。

### コンパイルタスクの`destinationDirectory`の非デフォルトロケーション

以下のいずれかの操作を行う場合は、ビルドスクリプトに追加のコードを記述して更新してください。

*   Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile`タスクの`destinationDirectory`のロケーションをオーバーライドする。
*   非推奨のKotlin/JS/非IR[バリアント](gradle-plugin-variants.md)を使用し、`Kotlin2JsCompile`タスクの`destinationDirectory`をオーバーライドする。

JARファイル内の`sourceSets.main.outputs`に`sourceSets.main.kotlin.classesDirectories`を明示的に追加する必要があります。

```groovy
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

### コンパイラ引数をHTTP統計サービスに報告しないオプション

Kotlin GradleプラグインがHTTP[ビルドレポート](gradle-compilation-and-caches.md#build-reports)にコンパイラ引数を含めるかどうかを制御できるようになりました。場合によっては、プラグインがこれらの引数を報告する必要がないかもしれません。プロジェクトに多くのモジュールが含まれている場合、レポート内のコンパイラ引数は非常に重く、あまり役に立たないことがあります。現在、これを無効にしてメモリを節約する方法があります。`gradle.properties`または`local.properties`で、`kotlin.build.report.include_compiler_arguments=(true|false)`プロパティを使用してください。

この機能に関するフィードバックは、[YouTrack](https://youtrack.jetbrains.com/issue/KT-55323/)までお寄せください。

## 標準ライブラリ

Kotlin 1.8.20では、Kotlin/Native開発に特に役立つものを含め、さまざまな新機能が追加されました。

*   [`AutoCloseable`インターフェースのサポート](#support-for-the-autocloseable-interface)
*   [Base64エンコードとデコードのサポート](#support-for-base64-encoding)
*   [Kotlin/Nativeでの`@Volatile`のサポート](#support-for-volatile-in-kotlin-native)
*   [Kotlin/Nativeで正規表現使用時のスタックオーバーフローのバグ修正](#bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native)

### `AutoCloseable`インターフェースのサポート

> 新しい`AutoCloseable`インターフェースは[実験的](components-stability.md#stability-levels-explained)であり、使用するには`@OptIn(ExperimentalStdlibApi::class)`またはコンパイラ引数`-opt-in=kotlin.ExperimentalStdlibApi`でオプトインする必要があります。
>
{style="warning"}

`AutoCloseable`インターフェースは共通標準ライブラリに追加され、すべてのライブラリでリソースを閉じるための共通インターフェースとして使用できるようになりました。Kotlin/JVMでは、`AutoCloseable`インターフェースは[`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html)のエイリアスです。

さらに、拡張関数`use()`が追加されました。これは、選択されたリソースに対して与えられたブロック関数を実行し、例外がスローされたかどうかにかかわらず、そのリソースを正しく閉じます。

共通標準ライブラリには、`AutoCloseable`インターフェースを実装するpublicなクラスはありません。以下の例では、`XMLWriter`インターフェースを定義し、それを実装するリソースが存在すると仮定しています。例えば、このリソースは、ファイルを開き、XMLコンテンツを書き込み、その後ファイルを閉じるクラスである可能性があります。

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

### Base64エンコーディングのサポート

> 新しいエンコードおよびデコード機能は[実験的](components-stability.md#stability-levels-explained)であり、使用するには`@OptIn(ExperimentalEncodingApi::class)`またはコンパイラ引数`-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`でオプトインする必要があります。
>
{style="warning"}

Base64エンコードとデコードのサポートを追加しました。異なるエンコードスキームを使用し、異なる動作を示す3つのクラスインスタンスを提供します。標準の[Base64エンコーディングスキーム](https://www.rfc-editor.org/rfc/rfc4648#section-4)には`Base64.Default`インスタンスを使用してください。

「[URLおよびファイル名セーフ](https://www.rfc-editor.org/rfc/rfc4648#section-5)」エンコーディングスキームには`Base64.UrlSafe`インスタンスを使用してください。

[MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8)エンコーディングスキームには`Base64.Mime`インスタンスを使用してください。`Base64.Mime`インスタンスを使用する場合、すべてのエンコード関数は76文字ごとに改行コードを挿入します。デコードの場合、不正な文字はスキップされ、例外はスローされません。

> `Base64.Default`インスタンスは`Base64`クラスのコンパニオンオブジェクトです。その結果、`Base64.Default.encode()`や`Base64.Default.decode()`の代わりに、`Base64.encode()`や`Base64.decode()`を介してその関数を呼び出すことができます。
>
{style="tip"}

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// Alternatively:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// Alternatively:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```
{validate="false"}

既存のバッファにバイトをエンコードまたはデコードしたり、提供された`Appendable`型オブジェクトにエンコード結果を追記したりする追加の関数を使用できます。

Kotlin/JVMでは、入出力ストリームを使用してBase64エンコードとデコードを実行できるように、拡張関数`encodingWith()`と`decodingWith()`も追加しました。

### Kotlin/Nativeでの`@Volatile`のサポート

> Kotlin/Nativeにおける`@Volatile`は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。この機能に関するフィードバックは[YouTrack](https://kotl.in/issue)までお寄せください。
>
{style="warning"}

`var`プロパティに`@Volatile`をアノテーションすると、バッキングフィールドがマークされ、そのフィールドへのすべての読み取りと書き込みがアトミックになり、書き込みは常に他のスレッドから見えるようになります。

1.8.20以前は、[`kotlin.jvm.Volatile`アノテーション](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)が共通標準ライブラリで利用可能でした。しかし、このアノテーションはJVMでのみ有効です。Kotlin/Nativeで使用すると無視され、エラーにつながる可能性があります。

1.8.20では、JVMとKotlin/Nativeの両方で使用できる共通アノテーション`kotlin.concurrent.Volatile`を導入しました。

#### 有効にする方法

この機能を試すには、`@OptIn(ExperimentalStdlibApi)`でオプトインし、`-language-version 1.9`コンパイラオプションを有効にしてください。Gradleプロジェクトでは、`build.gradle(.kts)`ファイルに以下を追加することで行えます。

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

### Kotlin/Nativeで正規表現使用時のスタックオーバーフローのバグ修正

Kotlinの以前のバージョンでは、正規表現パターンが非常に単純であっても、正規表現入力に多数の文字が含まれている場合にクラッシュが発生する可能性がありました。1.8.20では、この問題が解決されました。詳細については、[KT-46211](https://youtrack.jetbrains.com/issue/KT-46211)を参照してください。

## シリアライゼーションの更新

Kotlin 1.8.20には、[Kotlin K2コンパイラのAlphaサポート](#prototype-serialization-compiler-plugin-for-kotlin-k2-compiler)と、[コンパニオンオブジェクトを介したシリアライザのカスタマイズの禁止](#prohibit-implicit-serializer-customization-via-companion-object)が含まれています。

### Kotlin K2コンパイラ用プロトタイプシリアライゼーションコンパイラプラグイン

> K2用シリアライゼーションコンパイラプラグインのサポートは[Alpha](components-stability.md#stability-levels-explained)版です。使用するには、[Kotlin K2コンパイラを有効](#how-to-enable-the-kotlin-k2-compiler)にしてください。
>
{style="warning"}

1.8.20から、シリアライゼーションコンパイラプラグインはKotlin K2コンパイラで動作します。ぜひお試しいただき、[フィードバックをお寄せください](#leave-your-feedback-on-the-new-k2-compiler)！

### コンパニオンオブジェクトによる暗黙的なシリアライザカスタマイズの禁止

現在、`@Serializable`アノテーションでクラスをシリアライズ可能として宣言し、同時にコンパニオンオブジェクトに`@Serializer`アノテーションでカスタムシリアライザを宣言することが可能です。

例:

```kotlin
import kotlinx.serialization.*

@Serializable
class Foo(val a: Int) {
    @Serializer(Foo::class)
    companion object {
        // Custom implementation of KSerializer<Foo>
    }
}
```

この場合、`@Serializable`アノテーションからはどのシリアライザが使用されているかが不明確です。実際には、クラス`Foo`にはカスタムシリアライザがあります。

このような混乱を防ぐため、Kotlin 1.8.20では、このシナリオが検出された場合にコンパイラ警告を導入しました。この警告には、この問題を解決するための移行パスも含まれています。

コードでこのような構造を使用している場合は、以下のように更新することをお勧めします。

```kotlin
import kotlinx.serialization.*

@Serializable(Foo.Companion::class)
class Foo(val a: Int) {
    // Doesn't matter if you use @Serializer(Foo::class) or not
    companion object: KSerializer<Foo> {
        // Custom implementation of KSerializer<Foo>
    }
}
```

このアプローチでは、`Foo`クラスがコンパニオンオブジェクトで宣言されたカスタムシリアライザを使用していることが明確です。詳細については、[YouTrackチケット](https://youtrack.jetbrains.com/issue/KT-54441)を参照してください。

> Kotlin 2.0では、このコンパイル警告をコンパイラエラーに昇格させる予定です。この警告が表示された場合は、コードを移行することをお勧めします。
>
{style="tip"}

## ドキュメントの更新

Kotlinのドキュメントにはいくつかの注目すべき変更が加えられました。

*   [Spring BootとKotlinで始める](jvm-get-started-spring-boot.md) – データベースを備えたシンプルなアプリケーションを作成し、Spring BootとKotlinの機能について詳しく学びます。
*   [スコープ関数](scope-functions.md) – 標準ライブラリの便利なスコープ関数でコードを簡素化する方法を学びます。
*   [CocoaPods統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) – CocoaPodsを扱うための環境をセットアップします。

## Kotlin 1.8.20をインストールする

### IDEのバージョンを確認する

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.2および2022.3は、Kotlinプラグインをバージョン1.8.20に更新するよう自動的に提案します。IntelliJ IDEA 2023.1には、Kotlinプラグイン1.8.20が組み込まれています。

Android Studio Flamingo (222)およびGiraffe (223)は、次期リリースでKotlin 1.8.20をサポートします。

新しいコマンドラインコンパイラは、[GitHubリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20)からダウンロードできます。

### Gradle設定を構成する

Kotlinのアーティファクトと依存関係を適切にダウンロードするには、`settings.gradle(.kts)`ファイルを更新してMaven Centralリポジトリを使用してください。

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

リポジトリが指定されていない場合、Gradleは非推奨のJCenterリポジトリを使用するため、Kotlinアーティファクトで問題が発生する可能性があります。