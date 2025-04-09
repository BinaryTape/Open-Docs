---
title: "Kotlin 1.8.20 の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[リリース: 2023年4月25日](releases#release-details)_

Kotlin 1.8.20 がリリースされました。主なハイライトを以下に示します。

* [Kotlin K2 コンパイラーの最新情報](#new-kotlin-k2-compiler-updates)
* [新しい実験的な Kotlin/Wasm ターゲット](#new-kotlin-wasm-target)
* [Gradle での新しい JVM インクリメンタルコンパイルをデフォルトで有効化](#new-jvm-incremental-compilation-by-default-in-gradle)
* [Kotlin/Native ターゲットのアップデート](#update-for-kotlin-native-targets)
* [Kotlin Multiplatform での Gradle コンポジットビルドサポートのプレビュー](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [Xcode での Gradle エラーの出力改善](#improved-output-for-gradle-errors-in-xcode)
* [標準ライブラリでの AutoCloseable インターフェースの実験的サポート](#support-for-the-autocloseable-interface)
* [標準ライブラリでの Base64 エンコーディングの実験的サポート](#support-for-base64-encoding)

変更点の概要については、以下の動画をご覧ください。

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="What's new in Kotlin 1.8.20"/>

## IDE サポート

1.8.20 をサポートする Kotlin プラグインは、以下で使用できます。

| IDE            | サポート対象バージョン            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |
:::note
Kotlin のアーティファクトと依存関係を正しくダウンロードするには、Maven Central リポジトリを使用するように[Gradle の設定を構成](#configure-gradle-settings)してください。

## Kotlin K2 コンパイラーの最新情報

Kotlin チームは、K2 コンパイラーの安定化を続けています。[Kotlin 1.7.0 のお知らせ](whatsnew17#new-kotlin-k2-compiler-for-the-jvm-in-alpha)で述べたように、まだ **Alpha** 段階です。このリリースでは、[K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604) に向けたさらなる改善が導入されています。

この 1.8.20 リリース以降、Kotlin K2 コンパイラーは次のようになります。

* シリアライゼーション (serialization) プラグインのプレビュー版があります。
* [JS IR コンパイラー](js-ir-compiler)の Alpha サポートを提供します。
* [新しい言語バージョン Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/) の今後のリリースを紹介します。

新しいコンパイラーとその利点については、以下の動画をご覧ください。

* [What Everyone Must Know About The NEW Kotlin K2 Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [The New Kotlin K2 Compiler: Expert Review](https://www.youtube.com/watch?v=db19VFLZqJM)

### Kotlin K2 コンパイラーを有効にする方法

Kotlin K2 コンパイラーを有効にしてテストするには、次のコンパイラーオプションを使用して新しい言語バージョンを使用します。

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

以前の `-Xuse-k2` コンパイラーオプションは非推奨になりました。

新しい K2 コンパイラーの Alpha バージョンは、JVM および JS IR プロジェクトでのみ動作します。Kotlin/Native やマルチプラットフォームプロジェクトはまだサポートしていません。

### 新しい K2 コンパイラーに関するフィードバックをお寄せください

皆様からのフィードバックをお待ちしております。

* Kotlin Slack で K2 開発者に直接フィードバックをお寄せください - [招待状を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) し、[#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) チャンネルに参加してください。
* 新しい K2 コンパイラーで直面した問題を[課題追跡システム](https://kotl.in/issue)に報告してください。
* **使用状況統計を送信する**オプションを[有効にして](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)、JetBrains が K2 の使用状況に関する匿名データを収集できるようにしてください。

## 言語

Kotlin の進化に伴い、1.8.20 で新しい言語機能のプレビュー版を導入しています。

* [Enum クラス values 関数の最新で高性能な代替](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
* [データクラスとの対称性のためのデータオブジェクト](#preview-of-data-objects-for-symmetry-with-data-classes)
* [インラインクラスにおける本体を持つセカンダリコンストラクターの制限の解除](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum クラス values 関数の最新で高性能な代替

この機能は[実験的](components-stability#stability-levels-explained)です。いつでも削除または変更される可能性があります。オプトインが必要です (詳細は下記参照)。評価目的でのみ使用してください。この件に関して[YouTrack](https://kotl.in/issue)でフィードバックをお待ちしています。

Enum クラスには、定義された enum 定数の配列を返す合成 `values()` 関数があります。ただし、配列を使用すると、Kotlin および Java で[隠れたパフォーマンスの問題](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries#examples-of-performance-issues)が発生する可能性があります。さらに、ほとんどの API はコレクションを使用しており、最終的には変換が必要です。これらの問題を解決するために、Enum クラスに `entries` プロパティを導入しました。これは `values()` 関数の代わりに使用する必要があります。呼び出されると、`entries` プロパティは定義された enum 定数の事前割り当てされた不変リストを返します。

`values()` 関数はまだサポートされていますが、代わりに `entries` プロパティを使用することをお勧めします。

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

@OptIn(ExperimentalStdlibApi::class)
fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```

#### entries プロパティを有効にする方法

この機能を試すには、`@OptIn(ExperimentalStdlibApi)` でオプトインし、`-language-version 1.9` コンパイラーオプションを有効にします。Gradle プロジェクトでは、`build.gradle(.kts)` ファイルに以下を追加することで有効にできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

IntelliJ IDEA 2023.1 以降では、この機能をオプトインした場合、適切な IDE インスペクションが `values()` から `entries` への変換について通知し、クイックフィックスを提供します。

提案の詳細については、[KEEP ノート](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries)を参照してください。

### データクラスとの対称性のためのデータオブジェクトのプレビュー

データオブジェクトを使用すると、シングルトンのセマンティクスとクリーンな `toString()` 表現を持つオブジェクトを宣言できます。このスニペットでは、オブジェクト宣言に `data` キーワードを追加すると、`toString()` 出力の可読性が向上する様子を確認できます。

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

特に `sealed` 階層 (sealed class や sealed interface 階層など) の場合、`data objects` は `data class` 宣言と一緒に便利に使用できるため、非常に適しています。このスニペットでは、`EndOfFile` をプレーンな `object` ではなく `data object` として宣言すると、手動でオーバーライドする必要なく、美しい `toString` が得られます。これにより、付属のデータクラス定義との対称性が維持されます。

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

[Kotlin 1.7.20](whatsnew1720#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects) の最初のプレビュー版以降、データオブジェクトのセマンティクスは洗練されています。コンパイラーは、便利な関数を多数自動的に生成するようになりました。

##### toString

データオブジェクトの `toString()` 関数は、オブジェクトの単純な名前を返します。

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals と hashCode

`data object` の `equals()` 関数は、`data object` のタイプを持つすべてのオブジェクトが等しいと見なされるようにします。ほとんどの場合、ランタイムにはデータオブジェクトのインスタンスが 1 つだけ存在します (結局のところ、`data object` はシングルトンを宣言します)。ただし、ランタイムで同じタイプの別のオブジェクトが生成される場合 (たとえば、`java.lang.reflect` を介したプラットフォームリフレクション、またはこの API を内部で使用する JVM シリアライゼーションライブラリを使用)、オブジェクトが等しいものとして扱われるようにします。

`data objects` は、構造的にのみ比較し (`==` 演算子を使用)、参照で比較しないでください (`===` 演算子)。これにより、ランタイムにデータオブジェクトの複数のインスタンスが存在する場合の落とし穴を回避できます。次のスニペットは、この特定の端的なケースを示しています。

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

生成された `hashCode()` 関数の動作は、`equals()` 関数の動作と一致するため、`data object` のすべてのランタイムインスタンスは同じハッシュコードを持ちます。

##### データオブジェクトの copy および componentN 関数はありません

`data object` と `data class` の宣言は一緒によく使用され、いくつかの類似点がありますが、`data object` に対して生成されない関数がいくつかあります。

`data object` 宣言はシングルトンオブジェクトとして使用されることを目的としているため、`copy()` 関数は生成されません。シングルトンパターンはクラスのインスタンス化を単一のインスタンスに制限し、インスタンスのコピーを作成できるようにすると、その制限に違反します。

また、`data class` とは異なり、`data object` にはデータプロパティがありません。そのようなオブジェクトを分解しようとしても意味がないため、`componentN()` 関数は生成されません。

この機能に関して[YouTrack](https://youtrack.jetbrains.com/issue/KT-4107)でフィードバックをお待ちしています。

#### データオブジェクトのプレビューを有効にする方法

この機能を試すには、`-language-version 1.9` コンパイラーオプションを有効にします。Gradle プロジェクトでは、`build.gradle(.kts)` ファイルに以下を追加することで有効にできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

### インラインクラスにおける本体を持つセカンダリコンストラクターの制限の解除のプレビュー

この機能は[実験的](components-stability#stability-levels-explained)です。いつでも削除または変更される可能性があります。オプトインが必要です (詳細は下記参照)。評価目的でのみ使用してください。この件に関して[YouTrack](https://kotl.in/issue)でフィードバックをお待ちしています。

Kotlin 1.8.20 では、[インラインクラス](inline-classes)における本体を持つセカンダリコンストラクターの使用に関する制限が解除されています。

インラインクラスは、明確な初期化セマンティクスを持つ `init` ブロックまたはセカンダリコンストラクターなしで、パブリックプライマリコンストラクターのみを許可していました。その結果、基礎となる値をカプセル化したり、制約された値を表すインラインクラスを作成したりすることができませんでした。

これらの問題は、Kotlin 1.4.30 で `init` ブロックの制限が解除されたときに修正されました。現在、プレビューモードで本体を持つセカンダリコンストラクターを許可することで、さらに一歩進んでいます。

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

#### 本体のセカンダリコンストラクターを有効にする方法

この機能を試すには、`-language-version 1.9` コンパイラーオプションを有効にします。Gradle プロジェクトでは、`build.gradle(.kts)` に以下を追加することで有効にできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

この機能を試して、[YouTrack](https://kotl.in/issue) にすべてのレポートを送信して、Kotlin 1.9.0 でデフォルトにすることにご協力ください。

Kotlin インラインクラスの開発の詳細については、[この KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes) を参照してください。

## 新しい Kotlin/Wasm ターゲット

Kotlin/Wasm (Kotlin WebAssembly) は、このリリースで[実験的](components-stability#stability-levels-explained)になります。Kotlin チームは、[WebAssembly](https://webassembly.org/) が有望なテクノロジーであると考えており、より良い方法でそれを使用し、Kotlin のすべての利点を享受できるようにしたいと考えています。

WebAssembly バイナリ形式は、独自の仮想マシンを使用して実行されるため、プラットフォームに依存しません。ほとんどすべての最新ブラウザーはすでに WebAssembly 1.0 をサポートしています。WebAssembly を実行するための環境をセットアップするには、Kotlin/Wasm がターゲットとする実験的なガベージコレクションモードを有効にするだけです。詳細な手順は、こちらをご覧ください: [Kotlin/Wasm を有効にする方法](#how-to-enable-kotlin-wasm)。

新しい Kotlin/Wasm ターゲットの次の利点を強調したいと思います。

* Kotlin/Wasm は LLVM を使用する必要がないため、`wasm32` Kotlin/Native ターゲットと比較してコンパイル速度が向上します。
* [Wasm ガベージコレクション](https://github.com/WebAssembly/gc)のおかげで、`wasm32` ターゲットと比較して、JS との相互運用性とブラウザーとの統合が容易になります。
* Wasm はコンパクトで解析しやすいバイトコードであるため、Kotlin/JS および JavaScript と比較して、アプリケーションの起動が潜在的に高速になります。
* Wasm は静的に型付けされた言語であるため、Kotlin/JS および JavaScript と比較して、アプリケーションのランタイムパフォーマンスが向上します。

1.8.20 リリース以降、実験的なプロジェクトで Kotlin/Wasm を使用できます。Kotlin/Wasm には、Kotlin 標準ライブラリ (`stdlib`) とテストライブラリ (`kotlin.test`) がすぐに使用できます。IDE のサポートは将来のリリースで追加されます。

[この YouTube ビデオで Kotlin/Wasm の詳細をご覧ください](https://www.youtube.com/watch?v=-pqz9sKXatw)。

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

[Kotlin/Wasm の例を含む GitHub リポジトリ](https://github.com/Kotlin/kotlin-wasm-examples)をご覧ください。

Kotlin/Wasm プロジェクトを実行するには、ターゲット環境の設定を更新する必要があります。

<Tabs>
<TabItem value="Chrome" label="Chrome">

* バージョン 109 の場合:

  `--js-flags=--experimental-wasm-gc` コマンドライン引数を使用してアプリケーションを実行します。

* バージョン 110 以降の場合:

    1. ブラウザで `chrome://flags/#enable-webassembly-garbage-collection` に移動します。
    2. **WebAssembly Garbage Collection** を有効にします。
    3. ブラウザを再起動します。

</TabItem>
<TabItem value="Firefox" label="Firefox">

バージョン 109 以降の場合:

1. ブラウザで `about:config` に移動します。
2. `javascript.options.wasm_function_references` および `javascript.options.wasm_gc` オプションを有効にします。
3. ブラウザを再起動します。

</TabItem>
<TabItem value="Edge" label="Edge">

バージョン 109 以降の場合:

`--js-flags=--experimental-wasm-gc` コマンドライン引数を使用してアプリケーションを実行します。

</TabItem>
</Tabs>

### Kotlin/Wasm に関するフィードバックをお寄せください

皆様からのフィードバックをお待ちしております。

* Kotlin Slack で開発者に直接フィードバックをお寄せください - [招待状を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) し、[#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) チャンネルに参加してください。
* Kotlin/Wasm で直面した問題を[この YouTrack issue](https://youtrack.jetbrains.com/issue/KT-56492) に報告してください。

## Kotlin/JVM

Kotlin 1.8.20 では、[Java 合成プロパティ参照のプレビュー](#preview-of-java-synthetic-property-references)と、[kapt スタブ生成タスクでの JVM IR バックエンドのデフォルトサポート](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)が導入されています。

### Java 合成プロパティ参照のプレビュー

この機能は[実験的](components-stability#stability-levels-explained)です。いつでも削除または変更される可能性があります。評価目的でのみ使用してください。この件に関して[YouTrack](https://kotl.in/issue)でフィードバックをお待ちしています。

Kotlin 1.8.20 では、Java 合成プロパティへの参照を作成できるようになりました。たとえば、次のような Java コードの場合です。

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

Kotlin では、`age` が合成プロパティである `person.age` を常に記述できました。
現在、`Person::age` および `person::age` への参照を作成することもできます。`name` についてもすべて同じように機能します。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // Call a reference to Java synthetic property:
        .sortedBy(Person::age)
        // Call Java getter via the Kotlin property syntax:
        .forEach { person `->` println(person.name) }
```

#### Java 合成プロパティ参照を有効にする方法

この機能を試すには、`-language-version 1.9` コンパイラーオプションを有効にします。
Gradle プロジェクトでは、`build.gradle(.kts)` に以下を追加することで有効にできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

### kapt スタブ生成タスクでの JVM IR バックエンドのデフォルトサポート

Kotlin 1.7.20 では、[kapt スタブ生成タスクでの JVM IR バックエンドのサポート](whatsnew1720#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)を導入しました。このリリース以降、このサポートはデフォルトで有効になっています。有効にするために、`gradle.properties` で `kapt.use.jvm.ir=true` を指定する必要はなくなりました。この機能に関して[YouTrack](https://youtrack.jetbrains.com/issue/KT-49682)でフィードバックをお待ちしています。

## Kotlin/Native

Kotlin 1.8.20 には、サポートされている Kotlin/Native ターゲット、Objective-C との相互運用性、CocoaPods Gradle プラグインの改善などに関する変更が含まれています。

* [Kotlin/Native ターゲットのアップデート](#update-for-kotlin-native-targets)
* [レガシーメモリマネージャーの非推奨化](#deprecation-of-the-legacy-memory-manager)
* [@import ディレクティブを使用した Objective-C ヘッダーのサポート](#support-for-objective-c-headers-with-import-directives)
* [Cocoapods Gradle プラグインでのリンク専用モードのサポート](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
* [UIKit での Objective-C 拡張機能をクラスメンバーとしてインポート](#import-objective-c-extensions-as-class-members-in-uikit)
* [コンパイラーでのコンパイラーキャッシュ管理の再実装](#reimplementation-of-compiler-cache-management-in-the-compiler)
* [Cocoapods Gradle プラグインでの `useLibraries()` の非推奨化](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Native ターゲットのアップデート
  
Kotlin チームは、Kotlin/Native でサポートされているターゲットのリストを見直し、それらをティアに分割し、Kotlin 1.8.20 以降、その一部を非推奨にすることを決定しました。サポートされているターゲットと非推奨のターゲットの完全なリストについては、[Kotlin/Native ターゲットのサポート](native-target-support) セクションを参照してください。

次のターゲットは Kotlin 1.8.20 で非推奨となり、1.9.20 で削除されます。

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

残りのターゲットについては、Kotlin/Native コンパイラーでターゲットがどの程度サポートおよびテストされているかに応じて、3 つのサポートティアがあります。ターゲットは別のティアに移動できます。たとえば、[Kotlin Multiplatform](multiplatform-intro)にとって重要であるため、将来的には `iosArm64` の完全なサポートを提供するように最善を尽くします。

ライブラリの作成者の場合、これらのターゲットティアは、どのターゲットを CI ツールでテストし、どのターゲットをスキップするかを決定するのに役立ちます。Kotlin チームは、[kotlinx.coroutines](coroutines-guide)などの公式 Kotlin ライブラリを開発するときに同じアプローチを使用します。

これらの変更の理由の詳細については、[ブログ記事](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/)をご覧ください。

### レガシーメモリマネージャーの非推奨化

1.8.20 以降、レガシーメモリマネージャーは非推奨となり、1.9.20 で削除されます。
[新しいメモリマネージャー](native-memory-manager)は 1.7.20 でデフォルトで有効になり、安定性の更新とパフォーマンスの改善がさらに加えられています。

レガシーメモリマネージャーをまだ使用している場合は、`gradle.properties` から `kotlin.native.binary.memoryModel=strict` オプションを削除し、[移行ガイド](native-migration-guide)に従って必要な変更を行ってください。

新しいメモリマネージャーは `wasm32` ターゲットをサポートしていません。このターゲットも[このリリースから](#update-for-kotlin-native-targets)非推奨になり、1.9.20 で削除されます。

### @import ディレクティブを使用した Objective-C ヘッダーのサポート

この機能は[実験的](components-stability#stability-levels-explained)です。いつでも削除または変更される可能性があります。オプトインが必要です (詳細は下記参照)。評価目的でのみ使用してください。この件に関して[YouTrack](https://kotl.in/issue)でフィードバックをお待ちしています。

Kotlin/Native は、`@import` ディレクティブを使用して Objective-C ヘッダーをインポートできるようになりました。この機能は、Swift で記述された CocoaPods 依存関係の自動生成された Objective-C ヘッダーまたはクラスを持つ Swift ライブラリを使用する場合に役立ちます。

以前は、cinterop ツールは `@import` ディレクティブを介して Objective-C モジュールに依存するヘッダーを分析できませんでした。その理由は、`-fmodules` オプションのサポートが不足していたためです。

Kotlin 1.8.20 以降、`@import` で Objective-C ヘッダーを使用できます。これを行うには、定義ファイルの `compilerOpts` としてコンパイラーに `-fmodules` オプションを渡します。[CocoaPods 統合](native-cocoapods)を使用する場合は、次のように `pod()` 関数の構成ブロックで cinterop オプションを指定します。

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

これは[非常に待望されていた機能](https://youtrack.jetbrains.com/issue/KT-39120)であり、将来のリリースでデフォルトにすることにご協力いただけるよう、[YouTrack](https://kotl.in/issue)でフィードバックをお待ちしております。

### Cocoapods Gradle プラグインでのリンク専用モードのサポート

Kotlin 1.8.20 では、cinterop バインディングを生成せずに、動的フレームワークでのみ Pod 依存関係をリンクに使用できます。これは、cinterop バインディングがすでに生成されている場合に役立ちます。

ライブラリとアプリの 2 つのモジュールを持つプロジェクトを検討してください。ライブラリは Pod に依存していますが、フレームワークを生成せず、`.klib` のみを生成します。アプリはライブラリに依存し、動的フレームワークを生成します。
この場合、このフレームワークをライブラリが依存する Pod とリンクする必要があります。
ただし、cinterop バインディングはライブラリに対してすでに生成されているため、cinterop バインディングは必要ありません。

この機能を有効にするには、Pod への依存関係を追加するときに、`linkOnly` オプションまたはビルダープロパティを使用します。

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

このオプションを静的フレームワークで使用すると、Pods は静的フレームワークのリンクに使用されないため、Pod 依存関係が完全に削除されます。

:::

### UIKit での Objective-C 拡張機能をクラスメンバーとしてインポート

Xcode 14.1 以降、Objective-C クラスの一部のメソッドはカテゴリメンバーに移動されました。これにより、異なる Kotlin API が生成され、これらのメソッドはメソッドではなく Kotlin 拡張機能としてインポートされました。

UIKit を使用してメソッドをオーバーライドするときに、このことが原因で問題が発生した可能性があります。たとえば、Kotlin で UIVIew をサブクラス化するときに、`drawRect()` または `layoutSubviews()` メソッドをオーバーライドできなくなりました。

1.8.20 以降、NSView および UIView クラスと同じヘッダーで宣言されているカテゴリメンバーは、これらのクラスのメンバーとしてインポートされます。つまり、NSView および UIView からサブクラス化するメソッドは、他のメソッドと同様に簡単にオーバーライドできます。

すべてが順調に進めば、Objective-C クラスのすべてに対してこの動作をデフォルトで有効にする予定です。

### コンパイラーでのコンパイラーキャッシュ管理の再実装

コンパイラーキャッシュの進化を加速するために、コンパイラーキャッシュ管理を Kotlin Gradle プラグインから Kotlin/Native コンパイラーに移動しました。これにより、コンパイル時間とコンパイラーキャッシュの柔軟性に関連するものなど、いくつかの重要な改善に関する作業がブロック解除されます。

問題が発生して以前の動作に戻る必要がある場合は、`kotlin.native.cacheOrchestration=gradle` Gradle プロパティを使用します。

この件に関して[YouTrack](https://kotl.in/issue)でフィードバックをお待ちしています。

### Cocoapods Gradle プラグインでの `useLibraries()` の非推奨化

Kotlin 1.8.20 は、静的ライブラリの[CocoaPods 統合](native-cocoapods)で使用される `useLibraries()` 関数の非推奨サイクルを開始します。

静的ライブラリを含む Pod への依存関係を許可するために `useLibraries()` 関数を導入しました。時間が経つにつれて、このケースは非常にまれになりました。ほとんどの Pod はソースによって配布され、Objective-C フレームワークまたは XCFramework はバイナリ配布の一般的な選択肢です。

この関数は人気がなく、Kotlin CocoaPods Gradle プラグインの開発を複雑にする問題が発生するため、非推奨にすることにしました。

フレームワークと XCFramework の詳細については、[最終的なネイティブバイナリの構築](multiplatform-build-native-binaries)を参照してください。

## Kotlin Multiplatform

Kotlin 1.8.20 は、Kotlin Multiplatform の次のアップデートにより、開発者のエクスペリエンスを向上させるように努めています。

* [ソースセット階層をセットアップするための新しい