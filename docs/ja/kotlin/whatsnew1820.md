[//]: # (title: Kotlin 1.8.20 の新機能)

_[リリース日: 2023年4月25日](releases.md#release-details)_

Kotlin 1.8.20 がリリースされ、主なハイライトは以下の通りです。

*   [新しい Kotlin K2 コンパイラの更新](#new-kotlin-k2-compiler-updates)
*   [新しい実験的な Kotlin/Wasm ターゲット](#new-kotlin-wasm-target)
*   [Gradle でデフォルトで有効になった新しい JVM インクリメンタルコンパイル](#new-jvm-incremental-compilation-by-default-in-gradle)
*   [Kotlin/Native ターゲットの更新](#update-for-kotlin-native-targets)
*   [Kotlin Multiplatform での Gradle コンポジットビルドのプレビュー](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
*   [Xcode での Gradle エラー出力の改善](#improved-output-for-gradle-errors-in-xcode)
*   [標準ライブラリにおける AutoCloseable インターフェースの実験的なサポート](#support-for-the-autocloseable-interface)
*   [標準ライブラリにおける Base64 エンコーディングの実験的なサポート](#support-for-base64-encoding)

これらの変更点の概要は以下の動画でもご確認いただけます。

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="Kotlin 1.8.20 の新機能"/>

## IDE サポート

1.8.20 をサポートする Kotlin プラグインは、以下の IDE で利用可能です。

| IDE            | サポートバージョン            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |

> Kotlin の成果物と依存関係を適切にダウンロードするには、[Gradle 設定](#configure-gradle-settings)を
> Maven Central リポジトリを使用するように構成してください。
>
{style="warning"}

## 新しい Kotlin K2 コンパイラの更新

Kotlin チームは K2 コンパイラの安定化を続けています。[Kotlin 1.7.0 の発表](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)で述べたように、まだ **Alpha** 段階です。
今回のリリースでは、[K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604) に向けてさらなる改善が導入されました。

この 1.8.20 リリースから、Kotlin K2 コンパイラは以下の機能を提供します。

*   シリアライズプラグインのプレビューバージョンが含まれています。
*   [JS IR コンパイラ](js-ir-compiler.md)の Alpha サポートを提供します。
*   [新しい言語バージョン、Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/) の将来のリリースを導入します。

新しいコンパイラとその利点の詳細については、以下の動画をご覧ください。

*   [What Everyone Must Know About The NEW Kotlin K2 Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
*   [The New Kotlin K2 Compiler: Expert Review](https://www.youtube.com/watch?v=db19VFLZqJM)

### Kotlin K2 コンパイラを有効にする方法

Kotlin K2 コンパイラを有効にしてテストするには、以下のコンパイラオプションで新しい言語バージョンを使用します。

```bash
-language-version 2.0
```

`build.gradle(.kts)` ファイルで指定できます。

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

> 新しい K2 コンパイラの Alpha バージョンは、JVM および JS IR プロジェクトでのみ動作します。
> Kotlin/Native やマルチプラットフォームプロジェクトはまだサポートしていません。
>
{style="warning"}

### 新しい K2 コンパイラに関するフィードバックをお願いします

皆様からのフィードバックをお待ちしております！

*   Kotlin Slack で K2 開発者に直接フィードバックを提供してください – [招待状を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)して、[#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) チャンネルに参加してください。
*   新しい K2 コンパイラで遭遇した問題は、[課題トラッカー](https://kotl.in/issue)に報告してください。
*   JetBrains が K2 の使用に関する匿名データを収集できるように、[**使用統計の送信**オプションを有効](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)にしてください。

## 言語

Kotlin は進化を続けており、1.8.20 では新しい言語機能のプレビューバージョンを導入しています。

*   [Enum クラスの values 関数を置き換えるモダンで高性能な代替機能](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
*   [データクラスとの対称性のためのデータオブジェクトのプレビュー](#preview-of-data-objects-for-symmetry-with-data-classes)
*   [インラインクラス内の本文を持つセカンダリコンストラクタの制限解除のプレビュー](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum クラスの values 関数を置き換えるモダンで高性能な代替機能

> この機能は[実験的](components-stability.md#stability-levels-explained)です。
> いつでも変更または削除される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
> [YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Enum クラスには、定義された Enum 定数の配列を返す合成の `values()` 関数があります。しかし、配列を使用すると、Kotlin や Java で[隠れたパフォーマンス問題](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues)が発生する可能性があります。さらに、ほとんどの API はコレクションを使用するため、最終的な変換が必要です。これらの問題を解決するため、`values()` 関数ではなく、Enum クラスの `entries` プロパティを導入しました。`entries` プロパティを呼び出すと、事前に割り当てられた定義済み Enum 定数のイミュータブルなリストが返されます。

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

この機能を試すには、`@OptIn(ExperimentalStdlibApi)` でオプトインし、`-language-version 1.9` コンパイラオプションを有効にします。Gradle プロジェクトでは、`build.gradle(.kts)` ファイルに以下を追加することで行えます。

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

> IntelliJ IDEA 2023.1 以降では、この機能をオプトインしている場合、適切な IDE のインスペクションが
> `values()` から `entries` への変換について通知し、クイックフィックスを提供します。
>
{style="tip"}

提案の詳細については、[KEEP ノート](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)を参照してください。

### データクラスとの対称性のためのデータオブジェクトのプレビュー

データオブジェクトを使用すると、シングルトンのセマンティクスとクリーンな `toString()` 表現を持つオブジェクトを宣言できます。次のスニペットでは、オブジェクト宣言に `data` キーワードを追加することで、その `toString()` 出力の可読性がどのように向上するかを確認できます。

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

特に `sealed` 階層（`sealed class` や `sealed interface` 階層など）では、`data object` は `data class` 宣言と一緒に便利に使用できるため、非常に適しています。このスニペットでは、`EndOfFile` をプレーンな `object` ではなく `data object` として宣言することで、手動でオーバーライドする必要なく、きれいな `toString` を得ることができます。これにより、付随するデータクラス定義との対称性が維持されます。

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

#### データオブジェクトのセマンティクス

[Kotlin 1.7.20](whatsnew1720.md#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects) での最初のプレビューバージョン以降、データオブジェクトのセマンティクスは洗練されました。コンパイラは現在、以下の便利な関数を自動的に生成します。

##### toString

データオブジェクトの `toString()` 関数は、オブジェクトの単純名 (simple name) を返します。

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals と hashCode

`data object` の `equals()` 関数は、`data object` の型を持つすべてのオブジェクトが等しいとみなされることを保証します。ほとんどの場合、実行時にはデータオブジェクトの単一のインスタンスしか存在しません（結局、`data object` はシングルトンを宣言します）。ただし、実行時に同じ型の別のオブジェクトが生成される（たとえば、`java.lang.reflect` を介したプラットフォームリフレクション、またはこの API を内部で使用する JVM シリアライズライブラリを使用した場合）といったエッジケースでは、これによりオブジェクトが等しいものとして扱われることが保証されます。

`data object` は構造的に（`==` 演算子を使用して）のみ比較し、参照（`===` 演算子）では決して比較しないようにしてください。これにより、実行時にデータオブジェクトの複数のインスタンスが存在する場合の落とし穴を回避できます。次のスニペットは、この特定のエッジケースを示しています。

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

生成される `hashCode()` 関数の動作は `equals()` 関数の動作と一貫しており、`data object` のすべてのランタイムインスタンスが同じハッシュコードを持つようにします。

##### データオブジェクトには copy および componentN 関数は生成されません

`data object` と `data class` 宣言はしばしば一緒に使用され、いくつかの類似点がありますが、`data object` に対しては生成されない関数がいくつかあります。

`data object` 宣言はシングルトンオブジェクトとして使用することを意図しているため、`copy()` 関数は生成されません。シングルトンパターンは、クラスのインスタンス化を単一のインスタンスに制限するため、インスタンスのコピーが作成されることを許可すると、その制限に違反することになります。

また、`data class` とは異なり、`data object` にはデータプロパティがありません。このようなオブジェクトを分割 (destructure) しようとすることは意味がないため、`componentN()` 関数は生成されません。

この機能に関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-4107)でお待ちしております。

#### データオブジェクトのプレビューを有効にする方法

この機能を試すには、`-language-version 1.9` コンパイラオプションを有効にします。Gradle プロジェクトでは、`build.gradle(.kts)` ファイルに以下を追加することで行えます。

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

### インラインクラス内の本文を持つセカンダリコンストラクタの制限解除のプレビュー

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも変更または削除される可能性があります。
> オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.8.20 では、[インラインクラス](inline-classes.md)における本文を持つセカンダリコンストラクタの使用に関する制限が解除されました。

インラインクラスは以前、明確な初期化セマンティクスを持つために `init` ブロックやセカンダリコンストラクタを持たないパブリックなプライマリコンストラクタのみを許可していました。その結果、基になる値をカプセル化したり、制約のある値を表現するインラインクラスを作成したりすることが不可能でした。

これらの問題は、Kotlin 1.4.30 で `init` ブロックの制限が解除された際に修正されました。今回、さらに一歩進んで、プレビューモードで本文を持つセカンダリコンストラクタを許可します。

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Allowed since Kotlin 1.4.30:
    init { 
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }

    // Preview available since Kotlin 1.8.20:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

#### 本文を持つセカンダリコンストラクタを有効にする方法

この機能を試すには、`-language-version 1.9` コンパイラオプションを有効にします。Gradle プロジェクトでは、`build.gradle(.kts)` に以下を追加することで行えます。

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

この機能をぜひお試しいただき、[YouTrack](https://kotl.in/issue) にレポートを提出して、Kotlin 1.9.0 でデフォルトにするためのご協力をお願いいたします。

Kotlin のインラインクラスの開発については、[こちらの KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) をご覧ください。

## 新しい Kotlin/Wasm ターゲット

Kotlin/Wasm (Kotlin WebAssembly) がこのリリースで[実験的](components-stability.md#stability-levels-explained)機能となりました。Kotlin チームは [WebAssembly](https://webassembly.org/) を有望な技術と捉えており、Kotlin の利点をすべて活用できるより良い方法を見つけたいと考えています。

WebAssembly バイナリ形式は独自の仮想マシンを使用して実行されるため、プラットフォームに依存しません。ほとんどすべてのモダンブラウザはすでに WebAssembly 1.0 をサポートしています。WebAssembly を実行するための環境をセットアップするには、Kotlin/Wasm がターゲットとする実験的なガベージコレクションモードを有効にするだけで済みます。詳細な手順は[Kotlin/Wasm を有効にする方法](#how-to-enable-kotlin-wasm)で確認できます。

新しい Kotlin/Wasm ターゲットの以下の利点を強調したいと思います。

*   Kotlin/Wasm は LLVM を使用する必要がないため、`wasm32` Kotlin/Native ターゲットと比較してコンパイル速度が速い。
*   [Wasm ガベージコレクション](https://github.com/WebAssembly/gc)のおかげで、`wasm32` ターゲットと比較して JS との相互運用性やブラウザとの統合が容易。
*   Wasm はコンパクトで解析しやすいバイトコードを持つため、Kotlin/JS および JavaScript と比較してアプリケーションの起動が潜在的に速い。
*   Wasm は静的型付け言語であるため、Kotlin/JS および JavaScript と比較してアプリケーションの実行時パフォーマンスが向上。

1.8.20 リリースから、実験的なプロジェクトで Kotlin/Wasm を使用できます。
Kotlin 標準ライブラリ (`stdlib`) およびテストライブラリ (`kotlin.test`) は、Kotlin/Wasm 向けにすぐに利用可能です。
IDE サポートは将来のリリースで追加される予定です。

[この YouTube 動画で Kotlin/Wasm について詳しく学ぶ](https://www.youtube.com/watch?v=-pqz9sKXatw)。

### Kotlin/Wasm を有効にする方法

Kotlin/Wasm を有効にしてテストするには、`build.gradle.kts` ファイルを更新します。

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

> [Kotlin/Wasm のサンプルを含む GitHub リポジトリ](https://github.com/Kotlin/kotlin-wasm-examples)をご覧ください。
>
{style="tip"}

Kotlin/Wasm プロジェクトを実行するには、ターゲット環境の設定を更新する必要があります。

<tabs>
<tab title="Chrome">

*   バージョン 109 の場合:

    `--js-flags=--experimental-wasm-gc` コマンドライン引数を付けてアプリケーションを実行します。

*   バージョン 110 以降の場合:

    1.  ブラウザで `chrome://flags/#enable-webassembly-garbage-collection` に移動します。
    2.  **WebAssembly Garbage Collection** を有効にします。
    3.  ブラウザを再起動します。

</tab>
<tab title="Firefox">

バージョン 109 以降の場合:

1.  ブラウザで `about:config` に移動します。
2.  `javascript.options.wasm_function_references` と `javascript.options.wasm_gc` オプションを有効にします。
3.  ブラウザを再起動します。

</tab>
<tab title="Edge">

バージョン 109 以降の場合:

`--js-flags=--experimental-wasm-gc` コマンドライン引数を付けてアプリケーションを実行します。

</tab>
</tabs>

### Kotlin/Wasm に関するフィードバックをお願いします

皆様からのフィードバックをお待ちしております！

*   Kotlin Slack で開発者に直接フィードバックを提供してください – [招待状を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)して、[#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) チャンネルに参加してください。
*   Kotlin/Wasm で遭遇した問題は、[この YouTrack 課題](https://youtrack.jetbrains.com/issue/KT-56492)に報告してください。

## Kotlin/JVM

Kotlin 1.8.20 では、[Java の合成プロパティ参照のプレビュー](#preview-of-java-synthetic-property-references)と、[kapt スタブ生成タスクにおける JVM IR バックエンドのデフォルトサポート](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)が導入されました。

### Java の合成プロパティ参照のプレビュー

> この機能は[実験的](components-stability.md#stability-levels-explained)です。
> いつでも変更または削除される可能性があります。評価目的でのみ使用してください。
> [YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.8.20 では、Java の合成プロパティへの参照を作成する機能が導入されました。例えば、次の Java コードの場合です。

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

Kotlin では、これまでも `age` が合成プロパティである場合に `person.age` と記述することができました。
今回、`Person::age` や `person::age` への参照を作成することもできるようになりました。`name` についても同様に動作します。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // Call a reference to Java synthetic property:
        .sortedBy(Person::age)
        // Call Java getter via the Kotlin property syntax:
        .forEach { person -> println(person.name) }
```
{validate="false"}

#### Java の合成プロパティ参照を有効にする方法

この機能を試すには、`-language-version 1.9` コンパイラオプションを有効にします。
Gradle プロジェクトでは、`build.gradle(.kts)` に以下を追加することで行えます。

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

Kotlin 1.7.20 では、[kapt スタブ生成タスクにおける JVM IR バックエンドのサポート](whatsnew1720.md#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)を導入しました。今回のリリースから、このサポートはデフォルトで有効になります。有効にするために `kapt.use.jvm.ir=true` を `gradle.properties` で指定する必要はなくなりました。
この機能に関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-49682)でお待ちしております。

## Kotlin/Native

Kotlin 1.8.20 には、サポートされる Kotlin/Native ターゲットの変更、Objective-C との相互運用性、CocoaPods Gradle プラグインの改善などが含まれています。

*   [Kotlin/Native ターゲットの更新](#update-for-kotlin-native-targets)
*   [レガシーメモリマネージャーの非推奨化](#deprecation-of-the-legacy-memory-manager)
*   [@import ディレクティブを含む Objective-C ヘッダーのサポート](#support-for-objective-c-headers-with-import-directives)
*   [Cocoapods Gradle プラグインにおけるリンクオンリーモードのサポート](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
*   [Objective-C 拡張を UIKit のクラスメンバとしてインポート](#import-objective-c-extensions-as-class-members-in-uikit)
*   [コンパイラにおけるコンパイラキャッシュ管理の再実装](#reimplementation-of-compiler-cache-management-in-the-compiler)
*   [Cocoapods Gradle プラグインにおける `useLibraries()` の非推奨化](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)

### Kotlin/Native ターゲットの更新

Kotlin チームは、Kotlin/Native でサポートされるターゲットのリストを見直し、ティアに分割し、
Kotlin 1.8.20 から一部のターゲットを非推奨とすることを決定しました。サポートされるターゲットと非推奨のターゲットの全リストについては、[Kotlin/Native ターゲットサポート](native-target-support.md)セクションを参照してください。

以下のターゲットは Kotlin 1.8.20 で非推奨となり、1.9.20 で削除されます。

*   `iosArm32`
*   `watchosX86`
*   `wasm32`
*   `mingwX86`
*   `linuxArm32Hfp`
*   `linuxMips32`
*   `linuxMipsel32`

残りのターゲットについては、Kotlin/Native コンパイラでターゲットがどの程度サポートされ、テストされているかに応じて、3つのサポートティアが設けられました。ターゲットは異なるティアに移動する可能性があります。例えば、`iosArm64` は[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html)にとって重要であるため、将来的には完全なサポートを提供するよう最善を尽くします。

ライブラリの作者であれば、これらのターゲットティアは CI ツールでどのターゲットをテストし、どのターゲットをスキップするかを決定するのに役立ちます。Kotlin チームは、[kotlinx.coroutines](coroutines-guide.md) のような公式 Kotlin ライブラリを開発する際にも同じアプローチを使用します。

これらの変更の理由については、[ブログ記事](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/)をご覧ください。

### レガシーメモリマネージャーの非推奨化

1.8.20 以降、レガシーメモリマネージャーは非推奨となり、1.9.20 で削除されます。
[新しいメモリマネージャー](native-memory-manager.md)は 1.7.20 でデフォルトで有効になり、さらなる安定性アップデートとパフォーマンス改善を受けてきました。

まだレガシーメモリマネージャーを使用している場合は、`gradle.properties` から `kotlin.native.binary.memoryModel=strict` オプションを削除し、必要な変更を行うために[移行ガイド](native-migration-guide.md)に従ってください。

新しいメモリマネージャーは `wasm32` ターゲットをサポートしていません。このターゲットも[今回のリリースから非推奨](#update-for-kotlin-native-targets)となり、1.9.20 で削除されます。

### @import ディレクティブを含む Objective-C ヘッダーのサポート

> この機能は[実験的](components-stability.md#stability-levels-explained)です。
> いつでも変更または削除される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
> [YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin/Native は `@import` ディレクティブを含む Objective-C ヘッダーをインポートできるようになりました。この機能は、自動生成された Objective-C ヘッダーを持つ Swift ライブラリや、Swift で書かれた CocoaPods 依存関係のクラスを使用する場合に役立ちます。

以前は、cinterop ツールは `@import` ディレクティブを介して Objective-C モジュールに依存するヘッダーを解析できませんでした。その理由は、`-fmodules` オプションのサポートが不足していたためです。

Kotlin 1.8.20 以降、`@import` を使用する Objective-C ヘッダーを使用できます。これを行うには、定義ファイルで `-fmodules` オプションを `compilerOpts` としてコンパイラに渡します。[CocoaPods 統合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)を使用している場合、`pod()` 関数の構成ブロックで cinterop オプションを次のように指定します。

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

これは[待望の機能](https://youtrack.jetbrains.com/issue/KT-39120)であり、将来のリリースでデフォルトにするためのフィードバックを[YouTrack](https://kotl.in/issue)でお待ちしております。

### Cocoapods Gradle プラグインにおけるリンクオンリーモードのサポート

Kotlin 1.8.20 では、Pod 依存関係を動的フレームワークとともにリンク専用で使用し、
cinterop バインディングを生成しないようにすることができます。これは cinterop バインディングがすでに生成されている場合に便利です。

ライブラリとアプリの2つのモジュールを持つプロジェクトを考えてみましょう。ライブラリは Pod に依存しますが、フレームワークは生成せず、`.klib` のみ生成します。アプリはライブラリに依存し、動的フレームワークを生成します。
この場合、ライブラリが依存する Pods とこのフレームワークをリンクする必要がありますが、cinterop バインディングはすでにライブラリ用に生成されているため、必要ありません。

この機能を有効にするには、Pod への依存関係を追加する際に `linkOnly` オプションまたはビルダープロパティを使用します。

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

> このオプションを静的フレームワークとともに使用すると、Pods は静的フレームワークのリンクには使用されないため、Pod 依存関係が完全に削除されます。
>
{style="note"}

### Objective-C 拡張を UIKit のクラスメンバとしてインポート

Xcode 14.1 以降、Objective-C クラスの一部のメソッドがカテゴリメンバに移動されました。これにより、異なる Kotlin API が生成され、これらのメソッドはメソッドではなく Kotlin 拡張としてインポートされるようになりました。

これにより、UIKit を使用してメソッドをオーバーライドする際に問題が発生することがありました。たとえば、Kotlin で UIVIew をサブクラス化する際に `drawRect()` や `layoutSubviews()` メソッドをオーバーライドできなくなりました。

1.8.20 以降、NSView および UIView クラスと同じヘッダーで宣言されているカテゴリメンバは、これらのクラスのメンバとしてインポートされます。これは、NSView および UIView からサブクラス化するメソッドが、他のメソッドと同様に簡単にオーバーライドできることを意味します。

すべてがうまくいけば、将来的にはこの動作をすべての Objective-C クラスでデフォルトで有効にする予定です。

### コンパイラにおけるコンパイラキャッシュ管理の再実装

コンパイラキャッシュの進化を加速させるため、コンパイラキャッシュ管理を Kotlin Gradle プラグインから Kotlin/Native コンパイラに移行しました。これにより、コンパイル時間やコンパイラキャッシュの柔軟性に関するいくつかの重要な改善への作業が開放されます。

問題が発生し、古い動作に戻す必要がある場合は、`kotlin.native.cacheOrchestration=gradle` という Gradle プロパティを使用してください。

この件に関するフィードバックを[YouTrack](https://kotl.in/issue)でお待ちしております。

### Cocoapods Gradle プラグインにおける useLibraries() の非推奨化

Kotlin 1.8.20 では、静的ライブラリ向けの [CocoaPods 統合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)で使用される `useLibraries()` 関数の非推奨化サイクルを開始します。

私たちは静的ライブラリを含む Pods への依存を可能にするために `useLibraries()` 関数を導入しました。しかし、時間の経過とともに、このケースは非常にまれになりました。ほとんどの Pods はソースで配布されており、Objective-C フレームワークまたは XCFrameworks がバイナリ配布の一般的な選択肢となっています。

この関数は人気がなく、Kotlin CocoaPods Gradle プラグインの開発を複雑にする問題を引き起こすため、非推奨とすることにしました。

フレームワークと XCFrameworks の詳細については、[最終ネイティブバイナリのビルド](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)を参照してください。

## Kotlin Multiplatform

Kotlin 1.8.20 は、Kotlin Multiplatform への以下のアップデートにより、開発者エクスペリエンスの向上を目指します。

*   [ソースセット階層の設定における新しいアプローチ](#new-approach-to-source-set-hierarchy)
*   [Kotlin Multiplatform での Gradle コンポジットビルドのサポートのプレビュー](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
*   [Xcode での Gradle エラー出力の改善](#improved-output-for-gradle-errors-in-xcode)

### ソースセット階層への新しいアプローチ

> ソースセット階層への新しいアプローチは[実験的](components-stability.md#stability-levels-explained)です。
> 将来の Kotlin リリースで予告なく変更される可能性があります。オプトインが必要です（詳細は下記参照）。
> [YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.8.20 では、マルチプラットフォームプロジェクトのソースセット階層を設定する新しい方法として、デフォルトのターゲット階層を提供します。この新しいアプローチは、[設計上の欠陥](#why-replace-shortcuts)がある `ios` のようなターゲットショートカットを置き換えることを意図しています。

デフォルトのターゲット階層のアイデアはシンプルです。プロジェクトがコンパイルするすべてのターゲットを明示的に宣言すると、Kotlin Gradle プラグインが指定されたターゲットに基づいて共有ソースセットを自動的に作成します。

#### プロジェクトのセットアップ

簡単なマルチプラットフォームモバイルアプリの例を考えてみましょう。

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // Enable the default target hierarchy:
    targetHierarchy.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

デフォルトのターゲット階層は、利用可能なすべてのターゲットとそれらの共有ソースセットのテンプレートとして考えることができます。コード内で最終的なターゲット `android`、`iosArm64`、`iosSimulatorArm64` を宣言すると、Kotlin Gradle プラグインがテンプレートから適切な共有ソースセットを見つけて作成します。その結果の階層は次のようになります。

![デフォルトのターゲット階層の使用例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

緑色のソースセットは実際に作成されプロジェクトに存在しますが、デフォルトテンプレートからの灰色のソースセットは無視されます。ご覧のとおり、Kotlin Gradle プラグインは、たとえば `watchos` ソースセットを作成していません。これは、プロジェクトに watchOS ターゲットがないためです。

`watchosArm64` のような watchOS ターゲットを追加すると、`watchos` ソースセットが作成され、`apple`、`native`、`common` ソースセットからのコードも `watchosArm64` にコンパイルされます。

デフォルトのターゲット階層の完全なスキームは、[ドキュメント](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)で確認できます。

> この例では、`apple` および `native` ソースセットは `iosArm64` および `iosSimulatorArm64` ターゲットにのみコンパイルされます。
> そのため、それらの名前にもかかわらず、完全な iOS API にアクセスできます。
> これは `native` のようなソースセットでは直感に反するかもしれません。なぜなら、このソースセットではすべてのネイティブターゲットで利用可能な API のみがアクセス可能であると期待されるかもしれないからです。この動作は将来変更される可能性があります。
>
{style="note"}

#### ショートカットを置き換える理由 {initial-collapse-state="collapsed" collapsible="true"}

ソースセットの階層を作成することは、冗長でエラーが発生しやすく、初心者には優しくありませんでした。以前の解決策は、`ios` のようなショートカットを導入し、階層の一部を自動生成することでした。しかし、ショートカットの使用は、大きな設計上の欠陥、つまり変更が難しいという問題があることが判明しました。

例えば、`ios` ショートカットは `iosArm64` と `iosX64` ターゲットのみを作成します。これは混乱を招き、`iosSimulatorArm64` ターゲットも必要とする M1 ベースのホストで作業する際に問題を引き起こす可能性があります。しかし、`iosSimulatorArm64` ターゲットを追加することは、ユーザープロジェクトにとって非常に破壊的な変更となる可能性があります。

*   `iosMain` ソースセットで使用されるすべての依存関係は、`iosSimulatorArm64` ターゲットをサポートしている必要があります。そうでない場合、依存関係の解決が失敗します。
*   `iosMain` で使用される一部のネイティブ API は、新しいターゲットを追加すると消失する可能性があります（ただし、`iosSimulatorArm64` の場合は可能性は低いです）。
*   Intel ベースの MacBook で小さな個人プロジェクトを作成している場合など、この変更が不要な場合もあります。

ショートカットが階層の設定という問題を解決しなかったことは明らかになり、そのため、ある時点で新しいショートカットの追加を中止しました。

デフォルトのターゲット階層は一見ショートカットに似ているかもしれませんが、重要な違いがあります。それは、**ユーザーがターゲットのセットを明示的に指定する必要がある**ということです。このセットは、プロジェクトがどのようにコンパイルされ、公開され、依存関係の解決に参加するかを定義します。このセットが固定されているため、Kotlin Gradle プラグインによるデフォルト設定の変更は、エコシステムに与える混乱が大幅に少なくなり、ツール支援による移行の提供がはるかに容易になります。

#### デフォルトの階層を有効にする方法

この新機能は[実験的](components-stability.md#stability-levels-explained)です。Kotlin Gradle ビルドスクリプトの場合、`@OptIn(ExperimentalKotlinGradlePluginApi::class)` でオプトインする必要があります。

詳細については、[階層型プロジェクト構造](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)を参照してください。

#### フィードバックを残す

これはマルチプラットフォームプロジェクトにとって重要な変更です。より良くするために、皆様からの[フィードバック](https://kotl.in/issue)をお待ちしております。

### Kotlin Multiplatform での Gradle コンポジットビルドのサポートのプレビュー

> この機能は Kotlin Gradle Plugin 1.8.20 から Gradle ビルドでサポートされています。IDE サポートについては、IntelliJ IDEA
> 2023.1 Beta 2 (231.8109.2) 以降と、任意の Kotlin IDE プラグインを搭載した Kotlin Gradle プラグイン 1.8.20 を使用してください。
>
{style="note"}

1.8.20 以降、Kotlin Multiplatform は [Gradle コンポジットビルド](https://docs.gradle.org/current/userguide/composite_builds.html)をサポートします。
コンポジットビルドを使用すると、別々のプロジェクトのビルド、または同じプロジェクトの一部を単一のビルドに含めることができます。

いくつかの技術的な課題により、Kotlin Multiplatform での Gradle コンポジットビルドの使用は部分的にしかサポートされていませんでした。
Kotlin 1.8.20 には、より多くの種類のプロジェクトで動作するはずの改善されたサポートのプレビューが含まれています。
試すには、`gradle.properties` に以下のオプションを追加してください。

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

このオプションは、新しいインポートモードのプレビューを有効にします。コンポジットビルドのサポートに加えて、インポートをより安定させるための主要なバグ修正と改善が含まれているため、マルチプラットフォームプロジェクトでのインポートエクスペリエンスがよりスムーズになります。

#### 既知の問題

これはまだプレビューバージョンであり、さらなる安定化が必要です。途中でインポートに関するいくつかの問題に遭遇する可能性があります。Kotlin 1.8.20 の最終リリース前に修正を計画している既知の問題をいくつか挙げます。

*   IntelliJ IDEA 2023.1 EAP には、まだ Kotlin 1.8.20 プラグインが利用できません。それでも、Kotlin Gradle プラグインのバージョンを 1.8.20 に設定し、この IDE でコンポジットビルドを試すことはできます。
*   プロジェクトに `rootProject.name` が指定されたビルドが含まれている場合、コンポジットビルドが Kotlin メタデータを解決できないことがあります。
    回避策と詳細については、この [Youtrack 課題](https://youtrack.jetbrains.com/issue/KT-56536)を参照してください。

ぜひお試しいただき、[YouTrack](https://kotl.in/issue) にすべてのレポートを提出して、Kotlin 1.9.0 でデフォルトにするためのご協力をお願いいたします。

### Xcode での Gradle エラー出力の改善

Xcode でマルチプラットフォームプロジェクトをビルドする際に問題が発生した場合、「Command PhaseScriptExecution failed with a nonzero exit code」というエラーに遭遇したことがあるかもしれません。
このメッセージは Gradle の呼び出しが失敗したことを示しますが、問題の検出にはあまり役立ちません。

Kotlin 1.8.20 以降、Xcode は Kotlin/Native コンパイラからの出力を解析できるようになりました。さらに、Gradle ビルドが失敗した場合、Xcode で根本原因の例外からの追加のエラーメッセージが表示されます。ほとんどの場合、これにより根本的な問題を特定するのに役立ちます。

![Xcode での Gradle エラー出力の改善](xcode-gradle-output.png){width=700}

この新しい動作は、Xcode 統合のための標準的な Gradle タスク（例えば、マルチプラットフォームプロジェクトの iOS フレームワークを Xcode の iOS アプリケーションに接続できる `embedAndSignAppleFrameworkForXcode` など）でデフォルトで有効になっています。また、`kotlin.native.useXcodeMessageStyle` Gradle プロパティを使用して有効（または無効）にすることもできます。

## Kotlin/JavaScript

Kotlin 1.8.20 では、TypeScript 定義の生成方法が変更されました。また、デバッグエクスペリエンスを向上させるための変更も含まれています。

*   [Gradle プラグインからの Dukat 統合の削除](#removal-of-dukat-integration-from-gradle-plugin)
*   [ソースマップにおける Kotlin の変数名と関数名](#kotlin-variable-and-function-names-in-source-maps)
*   [TypeScript 定義ファイルの生成をオプトイン](#opt-in-for-generation-of-typescript-definition-files)

### Gradle プラグインからの Dukat 統合の削除

Kotlin 1.8.20 では、Kotlin/JavaScript Gradle プラグインから[実験的](components-stability.md#stability-levels-explained)な Dukat 統合を削除しました。Dukat 統合は、TypeScript 宣言ファイル（`.d.ts`）から Kotlin 外部宣言への自動変換をサポートしていました。

TypeScript 宣言ファイル（`.d.ts`）から Kotlin 外部宣言への変換は、引き続き[Dukat ツール](https://github.com/Kotlin/dukat)を使用することで可能です。

> Dukat ツールは[実験的](components-stability.md#stability-levels-explained)です。
> いつでも変更または削除される可能性があります。
>
{style="warning"}

### ソースマップにおける Kotlin の変数名と関数名

デバッグを助けるために、変数や関数の Kotlin コードで宣言した名前をソースマップに追加する機能が導入されました。1.8.20 以前は、これらはソースマップで利用できなかったため、デバッガでは常に生成された JavaScript の変数名と関数名が表示されていました。

Gradle ファイル `build.gradle.kts` の `sourceMapNamesPolicy`、または `-source-map-names-policy` コンパイラオプションを使用して、追加する内容を設定できます。以下の表に可能な設定を示します。

| 設定                 | 説明                                                   | 出力例                            |
|-------------------------|---------------------------------------------------------------|-----------------------------------|
| `simple-names`          | 変数名と単純な関数名が追加されます。（デフォルト） | `main`                            |
| `fully-qualified-names` | 変数名と完全修飾関数名が追加されます。  | `com.example.kjs.playground.main` |
| `no`                    | 変数名も関数名も追加されません。                      | N/A                               |

`build.gradle.kts` ファイルの構成例を以下に示します。

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>().configureEach {
    compilerOptions.sourceMapNamesPolicy.set(org.jetbrains.kotlin.gradle.dsl.JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES) // or SOURCE_MAP_NAMES_POLICY_NO, or SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES
}
```
{validate="false"}

Chromium ベースのブラウザで提供されるもののようなデバッグツールは、ソースマップから元の Kotlin 名を取得して、スタックトレースの可読性を向上させることができます。快適なデバッグをお楽しみください！

> ソースマップへの変数名と関数名の追加は[実験的](components-stability.md#stability-levels-explained)です。
> いつでも変更または削除される可能性があります。
>
{style="warning"}

### TypeScript 定義ファイルの生成をオプトイン

以前は、実行可能ファイルを生成するプロジェクト (`binaries.executable()`) の場合、Kotlin/JS IR コンパイラは `@JsExport` でマークされたトップレベル宣言を収集し、自動的に TypeScript 定義を `.d.ts` ファイルに生成していました。

これはすべてのプロジェクトに役立つわけではないため、Kotlin 1.8.20 では動作を変更しました。TypeScript 定義を生成したい場合は、Gradle ビルドファイルで明示的にこれを構成する必要があります。`build.gradle.kts` ファイルの [`js` セクション](js-project-setup.md#execution-environments)に `generateTypeScriptDefinitions()` を追加してください。例：

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

> TypeScript 定義 (`d.ts`) の生成は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。
>
{style="warning"}

## Gradle

Kotlin 1.8.20 は、Gradle 6.8 から 7.6 までと完全に互換性がありますが、[Multiplatform プラグインのいくつかの特別なケース](https://youtrack.jetbrains.com/issue/KT-55751)は除きます。
最新の Gradle リリースまで使用することもできますが、その場合、非推奨の警告に遭遇したり、一部の新しい Gradle 機能が動作しない可能性があることに注意してください。

このバージョンでは、以下の変更が加えられました。

*   [新しい Gradle プラグインバージョンのアラインメント](#new-gradle-plugins-versions-alignment)
*   [Gradle でデフォルトで有効になった新しい JVM インクリメンタルコンパイル](#new-jvm-incremental-compilation-by-default-in-gradle)
*   [コンパイルタスク出力の正確なバックアップ](#precise-backup-of-compilation-tasks-outputs)
*   [すべての Gradle バージョンで Kotlin/JVM タスクを遅延作成](#lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions)
*   [コンパイルタスクの destinationDirectory の非デフォルトロケーション](#non-default-location-of-compile-tasks-destinationdirectory)
*   [HTTP 統計サービスへのコンパイラ引数のレポートをオプトアウトする機能](#ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service)

### 新しい Gradle プラグインバージョンのアラインメント

Gradle は、連携して動作する必要がある依存関係の[バージョンを常に揃える](https://docs.gradle.org/current/userguide/dependency_version_alignment.html#aligning_versions_natively_with_gradle)方法を提供しています。
Kotlin 1.8.20 もこのアプローチを採用しました。デフォルトで動作するため、有効にするために設定を変更したり更新したりする必要はありません。さらに、[Kotlin Gradle プラグインの推移的依存関係を解決するためのこの回避策](whatsnew18.md#resolution-of-kotlin-gradle-plugins-transitive-dependencies)に頼る必要もなくなりました。

この機能に関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-54691)でお待ちしております。

### Gradle でデフォルトで有効になった新しい JVM インクリメンタルコンパイル

[Kotlin 1.7.0 から利用可能](whatsnew17.md#a-new-approach-to-incremental-compilation)になったインクリメンタルコンパイルの新しいアプローチは、デフォルトで動作するようになりました。有効にするために `kotlin.incremental.useClasspathSnapshot=true` を `gradle.properties` で指定する必要はなくなりました。

この件に関するフィードバックをお待ちしております。[YouTrack](https://kotl.in/issue)で課題を報告してください。

### コンパイルタスク出力の正確なバックアップ

> コンパイルタスク出力の正確なバックアップは[実験的](components-stability.md#stability-levels-explained)です。
> 使用するには、`gradle.properties` に `kotlin.compiler.preciseCompilationResultsBackup=true` を追加してください。
> [YouTrack](https://kotl.in/issue/experimental-ic-optimizations) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.8.20 以降、正確なバックアップを有効にできるようになりました。これにより、[インクリメンタルコンパイル](gradle-compilation-and-caches.md#incremental-compilation)で Kotlin が再コンパイルするクラスのみがバックアップされます。
完全バックアップと正確なバックアップの両方が、コンパイルエラー後にビルドをインクリメンタルに再度実行するのに役立ちます。正確なバックアップは、完全バックアップと比較してビルド時間を節約します。完全バックアップは、特にプロジェクトが遅い HDD にある場合や、多くのタスクがバックアップを行っている場合に、大規模プロジェクトで**かなりの**ビルド時間を要する可能性があります。

この最適化は実験的です。`gradle.properties` ファイルに `kotlin.compiler.preciseCompilationResultsBackup` Gradle プロパティを追加することで有効にできます。

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrains における正確なバックアップ使用例 {initial-collapse-state="collapsed" collapsible="true"}

以下のチャートでは、完全バックアップと比較した正確なバックアップの使用例を確認できます。

![完全バックアップと正確なバックアップの比較](comparison-of-full-and-precise-backups.png){width=700}

最初の2つのチャートは、Kotlin プロジェクトにおける正確なバックアップが、Kotlin Gradle プラグインのビルドにどのように影響するかを示しています。

1.  多くのモジュールが依存するモジュールに、小さな [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 変更（新しいパブリックメソッドの追加）を加えた後。
2.  他のモジュールが依存しないモジュールに、小さな非 ABI 変更（プライベート関数の追加）を加えた後。

3番目のチャートは、[Space](https://www.jetbrains.com/space/) プロジェクトにおける正確なバックアップが、多くのモジュールが依存する Kotlin/JS モジュールに小さな非 ABI 変更（プライベート関数の追加）を加えた後の Web フロントエンドのビルドにどのように影響するかを示しています。

これらの測定は Apple M1 Max CPU を搭載したコンピュータで実施されました。異なるコンピュータではわずかに異なる結果が得られる場合があります。パフォーマンスに影響を与える要因には、以下が含まれますが、これらに限定されません。

*   [Kotlin デーモン](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)と
    [Gradle デーモン](https://docs.gradle.org/current/userguide/gradle_daemon.html)のウォームアップ度。
*   ディスクの速度。
*   CPU モデルと使用率。
*   変更によって影響を受けるモジュールと、それらのモジュールのサイズ。
*   変更が ABI 変更か非 ABI 変更か。

#### ビルドレポートを使用した最適化の評価 {initial-collapse-state="collapsed" collapsible="true"}

使用しているコンピュータで、プロジェクトとシナリオに対する最適化の影響を評価するには、[Kotlin ビルドレポート](gradle-compilation-and-caches.md#build-reports)を使用できます。
以下のプロパティを `gradle.properties` ファイルに追加して、テキストファイル形式のレポートを有効にします。

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
  Backup output: 0.22 s // Pay attention to this number 
<...>
```

正確なバックアップを有効にした後のレポートの関連部分の例を以下に示します。

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.46 s
<...>
Time metrics:
 Total Gradle task time: 0.46 s
 Task action before worker execution: 0.07 s
  Backup output: 0.05 s // The time has reduced
 Run compilation in Gradle worker: 0.32 s
  Clear jar cache: 0.00 s
  Precise backup output: 0.00 s // Related to precise backup
  Cleaning up the backup stash: 0.00 s // Related to precise backup
<...>
```

### すべての Gradle バージョンで Kotlin/JVM タスクを遅延作成

Gradle 7.3+ で `org.jetbrains.kotlin.gradle.jvm` プラグインを使用しているプロジェクトの場合、Kotlin Gradle プラグインは `compileKotlin` タスクを積極的に作成および構成しなくなりました。下位の Gradle バージョンでは、すべてのタスクを登録するだけで、ドライランでは構成しませんでした。この同じ動作が、Gradle 7.3+ を使用する場合も適用されるようになりました。

### コンパイルタスクの destinationDirectory の非デフォルトロケーション

以下のいずれかの操作を行う場合は、ビルドスクリプトにいくつかの追加コードを更新してください。

*   Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` タスクの `destinationDirectory` ロケーションをオーバーライドする。
*   非推奨の Kotlin/JS/Non-IR [バリアント](gradle-plugin-variants.md)を使用し、`Kotlin2JsCompile` タスクの `destinationDirectory` をオーバーライドする。

`sourceSets.main.kotlin.classesDirectories` を JAR ファイルの `sourceSets.main.outputs` に明示的に追加する必要があります。

```groovy
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

### HTTP 統計サービスへのコンパイラ引数のレポートをオプトアウトする機能

Kotlin Gradle プラグインが HTTP [ビルドレポート](gradle-compilation-and-caches.md#build-reports)にコンパイラ引数を含めるかどうかを制御できるようになりました。
プロジェクトに多くのモジュールが含まれている場合、レポート内のコンパイラ引数が非常に重く、あまり役に立たない場合があります。これを無効にしてメモリを節約する方法が追加されました。
`gradle.properties` または `local.properties` で、`kotlin.build.report.include_compiler_arguments=(true|false)` プロパティを使用してください。

この機能に関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-55323/)でお待ちしております。

## 標準ライブラリ

Kotlin 1.8.20 では、特に Kotlin/Native 開発に役立つものを含む、さまざまな新機能が追加されました。

*   [AutoCloseable インターフェースのサポート](#support-for-the-autocloseable-interface)
*   [Base64 エンコーディングとデコーディングのサポート](#support-for-base64-encoding)
*   [Kotlin/Native での @Volatile のサポート](#support-for-volatile-in-kotlin-native)
*   [Kotlin/Native での正規表現使用時のスタックオーバーフローのバグ修正](#bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native)

### AutoCloseable インターフェースのサポート

> 新しい `AutoCloseable` インターフェースは[実験的](components-stability.md#stability-levels-explained)であり、使用するには
> `@OptIn(ExperimentalStdlibApi::class)` またはコンパイラ引数 `-opt-in=kotlin.ExperimentalStdlibApi` でオプトインする必要があります。
>
{style="warning"}

`AutoCloseable` インターフェースが共通標準ライブラリに追加され、すべてのライブラリでリソースを閉じるための共通インターフェースを使用できるようになりました。Kotlin/JVM では、`AutoCloseable` インターフェースは [`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html) のエイリアスです。

さらに、拡張関数 `use()` が含まれるようになりました。これは、選択されたリソースに対して指定されたブロック関数を実行し、例外がスローされたかどうかに関わらず、適切にクローズします。

共通標準ライブラリには、`AutoCloseable` インターフェースを実装する公開クラスはありません。以下の例では、`XMLWriter` インターフェースを定義し、それを実装するリソースが存在すると仮定します。たとえば、このリソースは、ファイルを開き、XML コンテンツを書き込み、その後ファイルを閉じるクラスである可能性があります。

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

> 新しいエンコードとデコード機能は[実験的](components-stability.md#stability-levels-explained)であり、
> 使用するには `@OptIn(ExperimentalEncodingApi::class)` または
> コンパイラ引数 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi` でオプトインする必要があります。
>
{style="warning"}

Base64 エンコーディングとデコーディングのサポートが追加されました。異なるエンコーディングスキームを使用し、異なる動作を示す 3 つのクラスインスタンスを提供します。標準の[Base64 エンコーディングスキーム](https://www.rfc-editor.org/rfc/rfc4648#section-4)には `Base64.Default` インスタンスを使用します。

["URL およびファイル名セーフ"](https://www.rfc-editor.org/rfc/rfc4648#section-5)エンコーディングスキームには `Base64.UrlSafe` インスタンスを使用します。

[MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) エンコーディングスキームには `Base64.Mime` インスタンスを使用します。`Base64.Mime` インスタンスを使用すると、すべてのエンコーディング関数は 76 文字ごとに改行コードを挿入します。デコーディングの場合、不正な文字はスキップされ、例外はスローされません。

> `Base64.Default` インスタンスは `Base64` クラスのコンパニオンオブジェクトです。そのため、`Base64.Default.encode()` および `Base64.Default.decode()` の代わりに `Base64.encode()` および `Base64.decode()` を介してその関数を呼び出すことができます。
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

既存のバッファにバイトをエンコードまたはデコードしたり、提供された `Appendable` 型オブジェクトにエンコード結果を追加したりするための追加関数を使用できます。

Kotlin/JVM では、入出力ストリームで Base64 エンコーディングとデコーディングを実行できるように、拡張関数 `encodingWith()` と `decodingWith()` も追加されました。

### Kotlin/Native での @Volatile のサポート

> Kotlin/Native の `@Volatile` は[実験的](components-stability.md#stability-levels-explained)です。
> いつでも変更または削除される可能性があります。オプトインが必要です（詳細は下記参照）。
> 評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

`var` プロパティに `@Volatile` アノテーションを付与すると、そのバッキングフィールドがマークされ、そのフィールドへの読み書きがアトミックになり、書き込みが常に他のスレッドから見えるようになります。

1.8.20 以前は、[`kotlin.jvm.Volatile` アノテーション](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)が共通標準ライブラリで利用可能でした。しかし、このアノテーションは JVM でのみ有効でした。
Kotlin/Native で使用した場合、無視され、エラーにつながる可能性がありました。

1.8.20 では、JVM と Kotlin/Native の両方で使用できる共通アノテーション `kotlin.concurrent.Volatile` を導入しました。

#### 有効にする方法

この機能を試すには、`@OptIn(ExperimentalStdlibApi)` でオプトインし、`-language-version 1.9` コンパイラオプションを有効にします。Gradle プロジェクトでは、`build.gradle(.kts)` ファイルに以下を追加することで行えます。

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

### Kotlin/Native での正規表現使用時のスタックオーバーフローのバグ修正

以前の Kotlin バージョンでは、正規表現パターンが非常に単純であっても、正規表現の入力に大量の文字が含まれているとクラッシュが発生する可能性がありました。1.8.20 では、この問題が解決されました。
詳細については、[KT-46211](https://youtrack.jetbrains.com/issue/KT-46211) を参照してください。

## シリアライズの更新

Kotlin 1.8.20 には、[Kotlin K2 コンパイラの Alpha サポート](#prototype-serialization-compiler-plugin-for-kotlin-k2-compiler)と、[コンパニオンオブジェクトによるシリアライザのカスタマイズの禁止](#prohibit-implicit-serializer-customization-via-companion-object)が含まれています。

### Kotlin K2 コンパイラ用のプロトタイプシリアライズコンパイラプラグイン

> K2 用シリアライズコンパイラプラグインのサポートは[Alpha](components-stability.md#stability-levels-explained)版です。使用するには、
> [Kotlin K2 コンパイラを有効](#how-to-enable-the-kotlin-k2-compiler)にする必要があります。
>
{style="warning"}

1.8.20 以降、シリアライズコンパイラプラグインは Kotlin K2 コンパイラと連携して動作します。
ぜひお試しいただき、[フィードバックをお寄せください](#leave-your-feedback-on-the-new-k2-compiler)！

### コンパニオンオブジェクトによる暗黙的なシリアライザカスタマイズの禁止

現在、`@Serializable` アノテーションを使用してクラスをシリアライズ可能として宣言し、同時にそのコンパニオンオブジェクトに `@Serializer` アノテーションを付けてカスタムシリアライザを宣言することが可能です。

例：

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

この場合、`@Serializable` アノテーションからはどのシリアライザが使用されているか不明確です。実際には、クラス `Foo` はカスタムシリアライザを使用しています。

このような混乱を防ぐため、Kotlin 1.8.20 では、このシナリオが検出された場合にコンパイラ警告を導入しました。この警告には、問題を解決するための移行パスが含まれています。

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

このアプローチにより、`Foo` クラスがコンパニオンオブジェクトで宣言されたカスタムシリアライザを使用していることが明確になります。詳細については、[YouTrack のチケット](https://youtrack.jetbrains.com/issue/KT-54441)を参照してください。

> Kotlin 2.0 では、コンパイラ警告をコンパイラエラーに昇格させる予定です。この警告が表示された場合は、
> コードを移行することをお勧めします。
>
{style="tip"}

## ドキュメントの更新

Kotlin ドキュメントにはいくつかの注目すべき変更が加えられました。

*   [Spring Boot と Kotlin を始めよう](jvm-get-started-spring-boot.md) – データベースを備えたシンプルなアプリケーションを作成し、Spring Boot と Kotlin の機能について詳しく学びます。
*   [スコープ関数](scope-functions.md) – 標準ライブラリの便利なスコープ関数を使用してコードを簡素化する方法を学びます。
*   [CocoaPods 統合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) – CocoaPods を使用するための環境をセットアップします。

## Kotlin 1.8.20 をインストールする

### IDE バージョンの確認

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.2 および 2022.3 は、Kotlin プラグインをバージョン 1.8.20 に自動的に更新することを提案します。IntelliJ IDEA 2023.1 には、Kotlin プラグイン 1.8.20 が組み込まれています。

Android Studio Flamingo (222) および Giraffe (223) は、次のリリースで Kotlin 1.8.20 をサポートする予定です。

新しいコマンドラインコンパイラは、[GitHub のリリース](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20)ページからダウンロードできます。

### Gradle 設定の構成

Kotlin の成果物と依存関係を適切にダウンロードするには、`settings.gradle(.kts)` ファイルを更新して
Maven Central リポジトリを使用するようにしてください。

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

リポジトリが指定されていない場合、Gradle は使用停止された JCenter リポジトリを使用し、Kotlin の成果物に関する問題を引き起こす可能性があります。