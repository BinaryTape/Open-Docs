---
title: オプトインの要件
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlinの標準ライブラリは、特定のAPI要素の使用に明示的な同意を要求し、許可するメカニズムを提供します。
このメカニズムにより、ライブラリの作成者は、APIが実験的な状態にあり、将来予告なく変更される可能性がある場合など、オプトインが必要な特定の条件についてユーザーに通知できます。

ユーザーを保護するために、コンパイラーはこれらの条件について警告し、APIを使用する前にオプトインすることを要求します。

## APIへのオプトイン

ライブラリの作成者がライブラリのAPIから宣言を**[使用するためにオプトインを要求する](#require-opt-in-to-use-api)**とマークした場合、
コードで使用する前に明示的な同意を与える必要があります。
オプトインする方法はいくつかあります。状況に最適なアプローチを選択することをお勧めします。

### ローカルでオプトイン

コードで使用するときに特定のAPI要素にオプトインするには、実験的APIマーカーへの参照とともに[`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/)
アノテーションを使用します。たとえば、オプトインが必要な`DateProvider`クラスを使用するとします。

```kotlin
// ライブラリのコード
@RequiresOptIn(message = "このAPIは実験的です。予告なしに将来変更される可能性があります。")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// オプトインが必要なクラス
class DateProvider
```

コードで、`DateProvider`クラスを使用する関数を宣言する前に、`@OptIn`アノテーションを`MyDateTime`アノテーションクラスへの参照とともに追加します。

```kotlin
// クライアントのコード
@OptIn(MyDateTime::class)

// DateProviderを使用
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

このアプローチでは、`getDate()`関数がコード内の別の場所で呼び出されたり、
別の開発者が使用したりしても、オプトインは不要であることに注意することが重要です。

```kotlin
// クライアントのコード
@OptIn(MyDateTime::class)

// DateProviderを使用
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    // OK: オプトインは不要
    println(getDate()) 
}
```

オプトインの要件は伝播されないため、他のユーザーが気付かずに実験的なAPIを使用する可能性があります。これを回避するには、
オプトインの要件を伝播する方が安全です。

#### オプトインの要件を伝播する

ライブラリなど、サードパーティで使用することを目的としたコードでAPIを使用する場合は、APIへのオプトイン要件も伝播できます。
これを行うには、ライブラリで使用されているものと同じ**[オプトイン要件アノテーション](#create-opt-in-requirement-annotations)**で宣言をマークします。

たとえば、`DateProvider`クラスを使用する関数を宣言する前に、`@MyDateTime`アノテーションを追加します。

```kotlin
// クライアントのコード
@MyDateTime
fun getDate(): Date {
    // OK: 関数もオプトインが必要
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // エラー: getDate()はオプトインが必要
}
```

この例でわかるように、アノテーションが付けられた関数は、`@MyDateTime` APIの一部であるように見えます。
オプトインは、`getDate()`関数のユーザーにオプトイン要件を伝播します。

API要素のシグネチャにオプトインが必要な型が含まれている場合、シグネチャ自体もオプトインを必要とする必要があります。
そうでない場合、API要素がオプトインを必要としないが、そのシグネチャにオプトインが必要な型が含まれている場合、それを使用するとエラーが発生します。

```kotlin
// クライアントのコード
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK: 関数もオプトインが必要
    println(getDate())
}
```

同様に、シグネチャにオプトインが必要な型が含まれている宣言に`@OptIn`を適用すると、オプトイン要件は
引き続き伝播されます。

```kotlin
// クライアントのコード
@OptIn(MyDateTime::class)
// シグネチャ内のDateProviderによりオプトインを伝播
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // エラー: getDate()はオプトインが必要
}
```

オプトインの要件を伝播する場合は、API要素が安定し、オプトイン要件がなくなった場合でも、オプトイン要件が残っている他のAPI要素は実験的なままであることを理解しておくことが重要です。たとえば、ライブラリの作成者が`getDate()`関数が安定したため、オプトイン要件を削除したとします。

```kotlin
// ライブラリのコード
// オプトイン要件なし
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

オプトインアノテーションを削除せずに`displayDate()`関数を使用すると、
オプトインが不要になった場合でも、実験的なままになります。

```kotlin
// クライアントのコード

// まだ実験的!
@MyDateTime 
fun displayDate() {
    // 安定したライブラリ関数を使用
    println(getDate())
}
```

#### 複数のAPIにオプトインする

複数のAPIにオプトインするには、すべてのオプトイン要件アノテーションで宣言をマークします。例：

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

または、`@OptIn`を使用します。

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### ファイル内でオプトイン

ファイル内のすべての関数とクラスに対してオプトインが必要なAPIを使用するには、パッケージの指定とインポートの前に、ファイルの先頭にファイルレベルのアノテーション`@file:OptIn`を追加します。

 ```kotlin
 // クライアントのコード
 @file:OptIn(MyDateTime::class)
 ```

### モジュール内でオプトイン

:::note
`-opt-in`コンパイラーオプションは、Kotlin 1.6.0以降で使用できます。以前のKotlinバージョンでは、`-Xopt-in`を使用します。

:::

オプトインが必要なAPIの使用法すべてにアノテーションを付けたくない場合は、モジュール全体に対してオプトインできます。
モジュールでAPIを使用するためにオプトインするには、引数`-opt-in`を使用してコンパイルし、
使用するAPIのオプトイン要件アノテーションの完全修飾名を指定します: `-opt-in=org.mylibrary.OptInAnnotation`。
この引数でコンパイルすると、モジュール内のすべての宣言にアノテーション`@OptIn(OptInAnnotation::class)`が付いているのと同じ効果があります。

Gradleでモジュールをビルドする場合は、次のように引数を追加できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions.optIn.add("org.mylibrary.OptInAnnotation")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</TabItem>
</Tabs>

Gradleモジュールがマルチプラットフォームモジュールである場合は、`optIn`メソッドを使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
sourceSets {
    all {
        languageSettings {
            optIn('org.mylibrary.OptInAnnotation')
        }
    }
}
```

</TabItem>
</Tabs>

Mavenの場合は、以下を使用します。

```xml
<build>
<plugins>
<plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>...</executions>
            <configuration>
                <args>
                    <arg>-opt-in=org.mylibrary.OptInAnnotation</arg>                    
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

モジュールレベルで複数のAPIにオプトインするには、モジュールで使用されるオプトイン要件マーカーごとに、記述されている引数のいずれかを追加します。

### クラスまたはインターフェースから継承するためにオプトインする

ライブラリの作成者がAPIを提供しているが、ユーザーがそれを拡張する前に明示的にオプトインすることを要求したい場合があります。
たとえば、ライブラリAPIが使用しても安定しているが、将来新しい抽象関数で拡張される可能性があるため、継承には安定していない場合があります。
ライブラリの作成者は、[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)アノテーションを使用して、[open](inheritance)または[abstractクラス](classes#abstract-classes)および[非関数インターフェース](interfaces)をマークすることにより、これを強制できます。

このようなAPI要素を使用し、コードで拡張するためにオプトインするには、アノテーションクラスへの参照とともに`@SubclassOptInRequired`アノテーションを使用します。
たとえば、オプトインが必要な`CoreLibraryApi`インターフェースを使用するとします。

```kotlin
// ライブラリのコード
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "このライブラリのインターフェースは実験的です"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 拡張するためにオプトインが必要なインターフェース
interface CoreLibraryApi 
```

コードで、`CoreLibraryApi`インターフェースから継承する新しいインターフェースを作成する前に、`UnstableApi`アノテーションクラスへの参照とともに`@SubclassOptInRequired`
アノテーションを追加します。

```kotlin
// クライアントのコード
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

`@SubclassOptInRequired`アノテーションをクラスで使用する場合、オプトイン要件は
[インナークラスまたはネストされたクラス](nested-classes)に伝播されないことに注意してください。

```kotlin
// ライブラリのコード
@RequiresOptIn
annotation class ExperimentalFeature

@SubclassOptInRequired(ExperimentalFeature::class)
open class FileSystem {
    open class File
}

// クライアントのコード

// オプトインが必要
class NetworkFileSystem : FileSystem()

// ネストされたクラス
// オプトインは不要
class TextFile : FileSystem.File()
```

または、`@OptIn`アノテーションを使用してオプトインすることもできます。実験的なマーカーアノテーションを使用して、
要件をコード内のクラスの使用法にさらに伝播することもできます。

```kotlin
// クライアントのコード
// @OptInアノテーションを使用
@OptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi

// アノテーションクラスを参照するアノテーションを使用
// オプトイン要件をさらに伝播
@UnstableApi
interface SomeImplementation : CoreLibraryApi
```

## APIを使用するためにオプトインを要求する

ライブラリのユーザーがAPIを使用する前にオプトインすることを要求できます。さらに、オプトイン要件を削除するまで、APIの使用に関する特別な条件についてユーザーに通知できます。

### オプトイン要件アノテーションを作成する

モジュールのAPIを使用するためにオプトインを要求するには、**オプトイン要件アノテーション**として使用するアノテーションクラスを作成します。
このクラスには、[`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/)のアノテーションを付ける必要があります。

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

オプトイン要件アノテーションは、いくつかの要件を満たす必要があります。それらは次のものを持っている必要があります。

* `BINARY`または`RUNTIME` [保持](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/)。
* [ターゲット](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)としての`EXPRESSION`、`FILE`、`TYPE`、または`TYPE_PARAMETER`。
* パラメータなし。

オプトイン要件には、2つの重大度[レベル](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/)のいずれかがあります。

* `RequiresOptIn.Level.ERROR`。オプトインは必須です。そうでない場合、マークされたAPIを使用するコードはコンパイルされません。これがデフォルトのレベルです。
* `RequiresOptIn.Level.WARNING`。オプトインは必須ではありませんが、推奨されます。それがないと、コンパイラーは警告を発します。

目的のレベルを設定するには、`@RequiresOptIn`アノテーションの`level`パラメータを指定します。

さらに、APIユーザーに`message`を提供できます。コンパイラーは、オプトインせずにAPIを使用しようとするユーザーにこのメッセージを表示します。

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "このAPIは実験的です。将来互換性のない変更が加えられる可能性があります。")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

オプトインが必要な複数の独立した機能を公開する場合は、それぞれのアノテーションを宣言します。
これにより、クライアントが明示的に受け入れる機能のみを使用できるため、APIの使用がクライアントにとって安全になります。
これはまた、機能を個別にオプトイン要件から削除できることを意味し、APIの保守が容易になります。

### API要素をマークする

API要素を使用するためにオプトインを要求するには、オプトイン要件アノテーションでその宣言にアノテーションを付けます。

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

一部の言語要素では、オプトイン要件アノテーションが適用されないことに注意してください。

* バックグラウンドフィールドまたはプロパティのゲッターにアノテーションを付けることはできません。プロパティ自体にのみアノテーションを付けることができます。
* ローカル変数または値パラメータにアノテーションを付けることはできません。

## APIを拡張するためにオプトインを要求する

APIのどの特定の部分を使用および拡張できるかをより細かく制御したい場合があります。
たとえば、一部のAPIが使用するには安定しているが、次の場合です。

* デフォルトの実装なしで新しい抽象関数を追加することが予想されるインターフェースのファミリがある場合など、**進行中の進化により実装が不安定**。
* 調整された方法で動作する必要がある個々の関数など、**実装がデリケートまたは脆弱**。
* 以前に`null`値を考慮していなかったコードで、入力パラメータ`T`をnullableバージョン`T?`に変更するなど、**将来的に外部実装のバックワード非互換な方法でコントラクトが弱まる可能性がある**。

このような場合、ユーザーがAPIをさらに拡張する前に、APIにオプトインすることを要求できます。ユーザーは、APIから継承するか、抽象関数を実装することにより、APIを拡張できます。
[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)アノテーションを使用すると、[open](inheritance)または[abstractクラス](classes#abstract-classes)および[非関数インターフェース](interfaces)に対してこのオプトインの要件を強制できます。

API要素にオプトイン要件を追加するには、[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)アノテーションを
アノテーションクラスへの参照とともに使用します。

```kotlin
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "このライブラリのインターフェースは実験的です"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 拡張するためにオプトインが必要なインターフェース
interface CoreLibraryApi 
```

`@SubclassOptInRequired`アノテーションを使用してオプトインを要求する場合、要件は
[インナークラスまたはネストされたクラス](nested-classes)に伝播されないことに注意してください。

APIで`@SubclassOptInRequired`アノテーションを使用する方法の実際の例については、`kotlinx.coroutines`ライブラリの[`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)
インターフェースを確認してください。

## 安定前のAPIのオプトイン要件

まだ安定していない機能にオプトイン要件を使用する場合は、クライアントコードを中断しないように、APIの卒業を慎重に処理してください。

安定前のAPIが卒業し、安定した状態でリリースされたら、宣言からオプトイン要件アノテーションを削除します。
クライアントは、その後、制限なしにそれらを使用できます。ただし、既存のクライアントコードの互換性を維持するために、アノテーションクラスをモジュールに残しておく必要があります。

コードからアノテーションを削除して再コンパイルすることにより、APIユーザーにモジュールを更新するように促すには、アノテーションを
[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)としてマークし、非推奨メッセージで説明を提供します。

```kotlin
@Deprecated("このオプトイン要件はもう使用されていません。コードからその使用法を削除してください。")
@RequiresOptIn
annotation class ExperimentalDateTime
```