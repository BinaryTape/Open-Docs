[//]: # (title: Opt-in要件)

Kotlinの標準ライブラリは、特定のAPI要素の使用に明示的な同意を求め、与えるメカニズムを提供しています。このメカニズムにより、ライブラリの作者は、APIが実験的な状態であり将来変更される可能性があるといった、オプトインを必要とする特定の条件をユーザーに知らせることができます。

ユーザーを保護するため、コンパイラはこれらの条件について警告し、APIを使用する前にオプトインすることを要求します。

## APIをオプトインする

ライブラリの作者が、そのライブラリのAPIの宣言を**[オプトインが必要](#require-opt-in-to-use-api)**とマークした場合、そのAPIをコードで使用する前に明示的な同意を与える必要があります。オプトインする方法はいくつかあります。状況に最適なアプローチを選択することをお勧めします。

### ローカルでオプトインする

コードで特定のAPI要素を使用する際にローカルでオプトインするには、実験的なAPIマーカーへの参照とともに[`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/)アノテーションを使用します。例えば、オプトインが必要な`DateProvider`クラスを使用したいとします。

```kotlin
// ライブラリコード
@RequiresOptIn(message = "This API is experimental. It could change in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// オプトインを必要とするクラス
class DateProvider
```

コード内で、`DateProvider`クラスを使用する関数を宣言する前に、`MyDateTime`アノテーションクラスへの参照とともに`@OptIn`アノテーションを追加します。

```kotlin
// クライアントコード
@OptIn(MyDateTime::class)

// DateProviderを使用する
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

このアプローチでは、`getDate()`関数がコード内の他の場所で呼び出されたり、他の開発者によって使用されたりする場合、オプトインは必要ないことに注意することが重要です。

```kotlin
// クライアントコード
@OptIn(MyDateTime::class)

// DateProviderを使用する
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    // OK: オプトインは不要
    println(getDate()) 
}
```

オプトイン要件は伝播しないため、他の開発者が実験的なAPIを意図せずに使用してしまう可能性があります。これを避けるためには、オプトイン要件を伝播させる方が安全です。

#### オプトイン要件を伝播する

ライブラリなど、サードパーティが使用することを意図したAPIをコードで使用する場合、そのオプトイン要件を自分のAPIにも伝播させることができます。これを行うには、ライブラリで使用されているのと同じ**[オプトイン要件アノテーション](#create-opt-in-requirement-annotations)**で宣言をマークします。

例えば、`DateProvider`クラスを使用する関数を宣言する前に、`@MyDateTime`アノテーションを追加します。

```kotlin
// クライアントコード
@MyDateTime
fun getDate(): Date {
    // OK: この関数もオプトインが必要
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // エラー: getDate()はオプトインが必要
}
```

この例でわかるように、アノテーションが付いた関数は`@MyDateTime` APIの一部であるかのように見えます。オプトインは、`getDate()`関数のユーザーにオプトイン要件を伝播させます。

API要素のシグネチャにオプトインが必要な型が含まれる場合、そのシグネチャ自体もオプトインを必要とします。そうでなければ、API要素がオプトインを必要としないにもかかわらず、そのシグネチャにオプトインが必要な型が含まれている場合、それを使用するとエラーが発生します。

```kotlin
// クライアントコード
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK: この関数もオプトインが必要
    println(getDate())
}
```

同様に、シグネチャにオプトインが必要な型が含まれる宣言に`@OptIn`を適用した場合でも、オプトイン要件は伝播します。

```kotlin
// クライアントコード
@OptIn(MyDateTime::class)
// シグネチャ内のDateProviderによりオプトインが伝播する
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // エラー: getDate()はオプトインが必要
}
```

オプトイン要件を伝播させる際に理解しておくべき重要な点は、API要素が安定化し、オプトイン要件がなくなったとしても、オプトイン要件が残っている他のAPI要素は実験的なままになるということです。例えば、ライブラリ作者が`getDate()`関数が安定化したためオプトイン要件を削除したとします。

```kotlin
// ライブラリコード
// オプトイン要件なし
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

オプトインアノテーションを削除せずに`displayDate()`関数を使用した場合、オプトインが不要になったにもかかわらず、それは実験的なままです。

```kotlin
// クライアントコード

// まだ実験的！
@MyDateTime 
fun displayDate() {
    // 安定版ライブラリ関数を使用する
    println(getDate())
}
```

#### 複数のAPIをオプトインする

複数のAPIをオプトインするには、宣言にすべてのオプトイン要件アノテーションをマークします。例：

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

または、代わりに`@OptIn`を使用します。

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### ファイルをオプトインする

ファイル内のすべての関数とクラスに対してオプトインが必要なAPIを使用するには、パッケージ指定とインポートの前に、ファイルの先頭にファイルレベルのアノテーション`@file:OptIn`を追加します。

 ```kotlin
 // クライアントコード
 @file:OptIn(MyDateTime::class)
 ```

### モジュールをオプトインする

> `-opt-in`コンパイラオプションはKotlin 1.6.0から利用可能です。それ以前のKotlinバージョンでは、`-Xopt-in`を使用してください。
>
{style="note"}

オプトインが必要なAPIのすべての使用箇所にアノテーションを付けたくない場合は、モジュール全体でそれらをオプトインできます。モジュール内でAPIの使用をオプトインするには、`-opt-in`引数を指定してコンパイルし、使用するAPIのオプトイン要件アノテーションの完全修飾名を指定します：`-opt-in=org.mylibrary.OptInAnnotation`。この引数でコンパイルすると、モジュール内のすべての宣言に`@OptIn(OptInAnnotation::class)`アノテーションが付いているかと同じ効果があります。

Gradleでモジュールをビルドする場合、次のように引数を追加できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions.optIn.add("org.mylibrary.OptInAnnotation")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</tab>
</tabs>

Gradleモジュールがマルチプラットフォームモジュールの場合、`optIn`メソッドを使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
sourceSets {
    all {
        languageSettings {
            optIn('org.mylibrary.OptInAnnotation')
        }
    }
}
```

</tab>
</tabs>

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

モジュールレベルで複数のAPIをオプトインするには、モジュールで使用されている各オプトイン要件マーカーに対して、記述された引数のいずれかを追加します。

### クラスまたはインターフェースからの継承をオプトインする

ライブラリの作者がAPIを提供しているものの、ユーザーがそれを拡張する前に明示的にオプトインすることを要求したい場合があります。例えば、ライブラリAPIは使用するには安定していても、新しい抽象関数が将来追加される可能性があるため、継承するには安定していない場合があります。ライブラリの作者は、[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)アノテーションを使用して、[open](inheritance.md)または[abstract class](classes.md#abstract-classes)や[非関数型インターフェース](interfaces.md)をマークすることでこれを強制できます。

このようなAPI要素をコード内でオプトインして拡張するには、アノテーションクラスへの参照とともに`@SubclassOptInRequired`アノテーションを使用します。例えば、オプトインが必要な`CoreLibraryApi`インターフェースを使用したいとします。

```kotlin
// ライブラリコード
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 拡張にオプトインを必要とするインターフェース
interface CoreLibraryApi 
```

コード内で、`CoreLibraryApi`インターフェースを継承する新しいインターフェースを作成する前に、`UnstableApi`アノテーションクラスへの参照とともに`@SubclassOptInRequired`アノテーションを追加します。

```kotlin
// クライアントコード
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

`@SubclassOptInRequired`アノテーションをクラスに適用した場合、オプトイン要件は[入れ子クラス](nested-classes.md)には伝播しないことに注意してください。

```kotlin
// ライブラリコード
@RequiresOptIn
annotation class ExperimentalFeature

@SubclassOptInRequired(ExperimentalFeature::class)
open class FileSystem {
    open class File
}

// クライアントコード

// オプトインが必要
class NetworkFileSystem : FileSystem()

// 入れ子クラス
// オプトインは不要
class TextFile : FileSystem.File()
```

あるいは、`@OptIn`アノテーションを使用してオプトインすることもできます。また、実験的なマーカーアノテーションを使用して、そのクラスのあらゆる使用箇所に要件をさらに伝播させることもできます。

```kotlin
// クライアントコード
// @OptInアノテーションを使用
@OptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi

// アノテーションクラスを参照するアノテーションを使用
// オプトイン要件をさらに伝播
@UnstableApi
interface SomeImplementation : CoreLibraryApi
```

## APIの使用にオプトインを要求する

ライブラリのユーザーに、APIを使用する前にオプトインすることを要求できます。さらに、オプトイン要件を削除することを決定するまで、APIを使用するための特別な条件をユーザーに知らせることができます。

### オプトイン要件アノテーションを作成する

モジュールのAPIを使用するためにオプトインを要求するには、**オプトイン要件アノテーション**として使用するアノテーションクラスを作成します。このクラスには[`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/)アノテーションが付いている必要があります。

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

オプトイン要件アノテーションは、いくつかの要件を満たす必要があります。これらは次の要素を持つ必要があります。

*   `BINARY`または`RUNTIME`の[保持期間](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/)。
*   `EXPRESSION`、`FILE`、`TYPE`、または`TYPE_PARAMETER`を[ターゲット](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)とする。
*   パラメータがない。

オプトイン要件には、2つの深刻度[レベル](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/)のいずれかを設定できます。

*   `RequiresOptIn.Level.ERROR`。オプトインは必須です。必須でなければ、マークされたAPIを使用するコードはコンパイルされません。これがデフォルトのレベルです。
*   `RequiresOptIn.Level.WARNING`。オプトインは必須ではありませんが、推奨されます。これがない場合、コンパイラは警告を発します。

目的のレベルを設定するには、`@RequiresOptIn`アノテーションの`level`パラメータを指定します。

さらに、APIユーザーに`message`を提供できます。コンパイラは、オプトインなしでAPIを使用しようとするユーザーにこのメッセージを表示します。

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This API is experimental. It can be incompatibly changed in the future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

複数の独立した機能がオプトインを必要とする場合は、それぞれのアノテーションを宣言してください。これにより、クライアントが明示的に受け入れた機能のみを使用できるため、APIの使用がより安全になります。また、機能からオプトイン要件を個別に削除できるため、APIの保守が容易になります。

### API要素をマークする

API要素の使用にオプトインを要求するには、その宣言にオプトイン要件アノテーションを付けます。

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

一部の言語要素では、オプトイン要件アノテーションが適用できないことに注意してください。

*   バッキングフィールドやプロパティのゲッターにはアノテーションを付けることはできません。プロパティ自体にのみ可能です。
*   ローカル変数や値パラメータにはアノテーションを付けることはできません。

## APIの拡張にオプトインを要求する

APIのどの特定の部分が使用および拡張できるかについて、より詳細な制御が必要な場合があります。例えば、APIが使用には安定していても、次のような理由で不安定な場合があります。

*   新しい抽象関数がデフォルトの実装なしで追加されることが予想されるようなインターフェース群がある場合など、継続的な進化のため**実装するには不安定**な場合。
*   調整された方法で動作する必要がある個々の関数など、**実装するのがデリケートまたは脆弱**な場合。
*   以前は`null`値を考慮していなかったコードで、入力パラメータ`T`をnullableバージョン`T?`に変更するなど、将来的に後方互換性のない方法で外部実装の**契約が弱められる可能性**がある場合。

このような場合、ユーザーがAPIをさらに拡張する前に、そのAPIにオプトインすることを要求できます。ユーザーは、APIを継承したり、抽象関数を実装したりすることでAPIを拡張できます。[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)アノテーションを使用することで、[open](inheritance.md)または[abstract class](classes.md#abstract-classes)や[非関数型インターフェース](interfaces.md)のオプトイン要件を強制できます。

API要素にオプトイン要件を追加するには、[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)アノテーションとアノテーションクラスへの参照を使用します。

```kotlin
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 拡張にオプトインを必要とするインターフェース
interface CoreLibraryApi 
```

`@SubclassOptInRequired`アノテーションを使用してオプトインを要求する場合、その要件は[入れ子クラス](nested-classes.md)には伝播しないことに注意してください。

APIで`@SubclassOptInRequired`アノテーションを使用する実際の例については、`kotlinx.coroutines`ライブラリの[`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)インターフェースを確認してください。

## プレ安定版APIのオプトイン要件

まだ安定版ではない機能にオプトイン要件を使用する場合は、クライアントコードを壊さないようにAPIの段階的リリースを慎重に扱ってください。

プレ安定版APIが安定状態に移行しリリースされたら、宣言からオプトイン要件アノテーションを削除します。これにより、クライアントは制限なくそれらを使用できるようになります。ただし、既存のクライアントコードとの互換性を保つため、アノテーションクラスはモジュールに残しておくべきです。

APIユーザーがコードからアノテーションを削除して再コンパイルすることでモジュールを更新するように促すため、アノテーションを[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)とマークし、非推奨メッセージで説明を提供してください。

```kotlin
@Deprecated("This opt-in requirement is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime