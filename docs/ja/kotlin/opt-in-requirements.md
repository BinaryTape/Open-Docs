[//]: # (title: オプトイン要件)

Kotlin標準ライブラリは、特定のAPI要素を使用するための明示的な同意を要求し、与えるメカニズムを提供します。このメカニズムにより、ライブラリの作者は、APIが実験的な状態であり、将来変更される可能性がある場合など、オプトインが必要となる特定の条件についてユーザーに通知できます。

ユーザーを保護するため、コンパイラはこれらの条件について警告し、APIを使用する前にオプトインすることを要求します。

## APIのオプトイン

ライブラリの作者が、自身のライブラリのAPIからの宣言を**[オプトインが必要](#require-opt-in-to-use-api)**としてマークしている場合、コードでそれを使用する前に明示的な同意を与える必要があります。オプトインにはいくつかの方法があります。状況に最適なアプローチを選択することをお勧めします。

### ローカルでオプトイン

コードで特定のAPI要素にオプトインするには、[`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/)アノテーションと実験的なAPIマーカーへの参照を使用します。たとえば、オプトインが必要な`DateProvider`クラスを使用するとします。

```kotlin
// ライブラリコード
@RequiresOptIn(message = "This API is experimental. It could change in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// オプトインが必要なクラス
class DateProvider
```

コードでは、`DateProvider`クラスを使用する関数を宣言する前に、`MyDateTime`アノテーションクラスへの参照とともに`@OptIn`アノテーションを追加します。

```kotlin
// クライアントコード
@OptIn(MyDateTime::class)

// DateProviderを使用
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

このアプローチでは、`getDate()`関数がコードの別の場所で呼び出されたり、他の開発者によって使用されたりした場合、オプトインは不要であることに注意することが重要です。

```kotlin
// クライアントコード
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

オプトイン要件は伝播しないため、他の人が実験的なAPIを意図せずに使用する可能性があります。これを避けるには、オプトイン要件を伝播する方が安全です。

#### オプトイン要件の伝播

ライブラリなど、サードパーティでの使用を意図したAPIをコードで使用する場合、そのオプトイン要件を自身のAPIにも伝播させることができます。これを行うには、ライブラリで使用されているものと同じ**[オプトイン要件アノテーション](#create-opt-in-requirement-annotations)**で宣言をマークします。

たとえば、`DateProvider`クラスを使用する関数を宣言する前に、`@MyDateTime`アノテーションを追加します。

```kotlin
// クライアントコード
@MyDateTime
fun getDate(): Date {
    // OK: この関数もオプトインが必要です
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // エラー: getDate()にはオプトインが必要
}
```

この例からわかるように、アノテーションが付加された関数は`@MyDateTime` APIの一部であるかのように見えます。オプトインは、`getDate()`関数のユーザーにオプトイン要件を伝播します。

API要素のシグネチャにオプトインが必要な型が含まれる場合、シグネチャ自体もオプトインを要求する必要があります。そうでない場合、API要素がオプトインを要求しないが、そのシグネチャにオプトインを要求する型が含まれる場合、それを使用するとエラーが発生します。

```kotlin
// クライアントコード
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK: この関数もオプトインが必要です
    println(getDate())
}
```

同様に、シグネチャにオプトインが必要な型が含まれる宣言に`@OptIn`を適用した場合でも、オプトイン要件は伝播します。

```kotlin
// クライアントコード
@OptIn(MyDateTime::class)
// シグネチャ内のDateProviderによりオプトインを伝播
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // エラー: getDate()にはオプトインが必要
}
```

オプトイン要件を伝播する際、API要素が安定してオプトイン要件がなくなった場合でも、オプトイン要件が残っている他のAPI要素は引き続き実験的なままです。たとえば、ライブラリの作者が`getDate()`関数が安定したため、そのオプトイン要件を削除したとします。

```kotlin
// ライブラリコード
// オプトイン要件なし
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

`displayDate()`関数をオプトインアノテーションを削除せずに使用した場合、オプトインが不要になったとしても、それは実験的なままです。

```kotlin
// クライアントコード

// まだ実験的！
@MyDateTime 
fun displayDate() {
    // 安定したライブラリ関数を使用
    println(getDate())
}
```

#### 複数のAPIへのオプトイン

複数のAPIにオプトインするには、すべてのオプトイン要件アノテーションで宣言をマークします。例：

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

または、代わりに`@OptIn`を使用します。

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### ファイルでオプトイン

ファイル内のすべての関数とクラスに対してオプトインが必要なAPIを使用するには、パッケージ指定とインポートの前に、ファイルレベルのアノテーション`@file:OptIn`をファイルの先頭に追加します。

 ```kotlin
 // クライアントコード
 @file:OptIn(MyDateTime::class)
 ```

### モジュールでオプトイン

> `-opt-in`コンパイラオプションはKotlin 1.6.0以降で利用可能です。それ以前のKotlinバージョンでは、`-Xopt-in`を使用してください。
> {style="note"}

オプトインが必要なAPIのすべての使用箇所にアノテーションを付けたくない場合、モジュール全体でそれらのAPIにオプトインできます。モジュールでAPIの使用にオプトインするには、`-opt-in`引数を使用してコンパイルし、使用するAPIのオプトイン要件アノテーションの完全修飾名を指定します：`-opt-in=org.mylibrary.OptInAnnotation`。この引数でコンパイルすると、モジュール内のすべての宣言に`@OptIn(OptInAnnotation::class)`アノテーションが付いているのと同じ効果があります。

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
kotlin {
    compilerOptions {
        optIn.add("org.mylibrary.OptInAnnotation")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</tab>
</tabs>

Mavenの場合は、次を使用します。

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

モジュールレベルで複数のAPIにオプトインするには、モジュールで使用されている各オプトイン要件マーカーに対して、記述された引数のいずれかを追加します。

### クラスまたはインターフェースの継承にオプトイン

ライブラリの作者は、APIを提供するものの、ユーザーがそれを拡張する前に明示的なオプトインを要求したい場合があります。たとえば、ライブラリAPIは使用に対しては安定していても、将来新しい抽象関数が追加される可能性があるため、継承に対しては安定していない場合があります。ライブラリの作者は、[オープンクラス](inheritance.md)や[抽象クラス](classes.md#abstract-classes)、[非関数型インターフェース](interfaces.md)を[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)アノテーションでマークすることで、これを強制できます。

そのようなAPI要素を使用し、コードでそれを拡張するためにオプトインするには、アノテーションクラスへの参照とともに`@SubclassOptInRequired`アノテーションを使用します。たとえば、オプトインが必要な`CoreLibraryApi`インターフェースを使用するとします。

```kotlin
// ライブラリコード
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 拡張にオプトインが必要なインターフェース
interface CoreLibraryApi 
```

コードでは、`CoreLibraryApi`インターフェースを継承する新しいインターフェースを作成する前に、`UnstableApi`アノテーションクラスへの参照とともに`@SubclassOptInRequired`アノテーションを追加します。

```kotlin
// クライアントコード
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

クラスに`@SubclassOptInRequired`アノテーションを使用する場合、オプトイン要件は[インナークラスまたはネストされたクラス](nested-classes.md)には伝播しないことに注意してください。

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

// ネストされたクラス
// オプトインは不要
class TextFile : FileSystem.File()
```

あるいは、`@OptIn`アノテーションを使用してオプトインすることもできます。また、実験的なマーカーアノテーションを使用して、コード内のそのクラスのすべての使用箇所に要件をさらに伝播させることもできます。

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

## APIの使用にオプトインを要求

ライブラリのユーザーがAPIを使用する前にオプトインすることを要求できます。さらに、オプトイン要件を削除するまで、APIを使用するための特別な条件についてユーザーに通知することもできます。

### オプトイン要件アノテーションの作成

モジュールのAPIの使用にオプトインを要求するには、**オプトイン要件アノテーション**として使用するアノテーションクラスを作成します。このクラスは[`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/)でアノテーションを付ける必要があります。

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

オプトイン要件アノテーションはいくつかの要件を満たす必要があります。これらは次のものを持つ必要があります。

*   `BINARY`または`RUNTIME`の[保持期間](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/)。
*   [ターゲット](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)として`EXPRESSION`、`FILE`、`TYPE`、または`TYPE_PARAMETER`。
*   パラメータなし。

オプトイン要件は、2つの重要度[レベル](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/)のいずれかを持つことができます。

*   `RequiresOptIn.Level.ERROR`。オプトインは必須です。そうしないと、マークされたAPIを使用するコードはコンパイルされません。これがデフォルトレベルです。
*   `RequiresOptIn.Level.WARNING`。オプトインは必須ではありませんが、推奨されます。これがないと、コンパイラは警告を発します。

目的のレベルを設定するには、`@RequiresOptIn`アノテーションの`level`パラメータを指定します。

さらに、APIユーザーに`message`を提供できます。コンパイラは、オプトインなしでAPIを使用しようとするユーザーにこのメッセージを表示します。

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This API is experimental. It can be incompatibly changed in the future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

オプトインが必要な複数の独立した機能を公開する場合、それぞれにアノテーションを宣言します。これにより、クライアントは明示的に許可した機能のみを使用できるため、APIの使用がより安全になります。また、機能からオプトイン要件を個別に削除できるため、APIの保守が容易になります。

### API要素のマーク付け

API要素を使用するためにオプトインを要求するには、その宣言をオプトイン要件アノテーションでアノテーション付けします。

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

一部の言語要素では、オプトイン要件アノテーションは適用できないことに注意してください。

*   プロパティのバッキングフィールドやゲッターにアノテーションを付けることはできません。プロパティ自体にのみアノテーションを付けます。
*   ローカル変数や値パラメータにアノテーションを付けることはできません。

## APIの拡張にオプトインを要求

APIのどの特定の部分を使用および拡張できるかについて、よりきめ細かい制御が必要な場合があります。たとえば、使用に対しては安定しているが、次のようなAPIがある場合です。

*   進行中の進化のため**実装が不安定**な場合。たとえば、デフォルト実装のない新しい抽象関数を追加する予定のインターフェース群がある場合など。
*   **実装が繊細または脆弱**な場合。たとえば、協調して動作する必要がある個別の関数など。
*   外部実装に対して後方互換性のない方法で**将来的に契約が弱められる可能性がある**場合。たとえば、以前は`null`値を考慮していなかったコードで、入力パラメータ`T`をnullableバージョン`T?`に変更する場合など。

そのような場合、ユーザーがAPIをさらに拡張する前に、そのAPIにオプトインすることを要求できます。ユーザーは、APIを継承するか、抽象関数を実装することによってAPIを拡張できます。[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)アノテーションを使用することで、[オープンクラス](inheritance.md)や[抽象クラス](classes.md#abstract-classes)、[非関数型インターフェース](interfaces.md)に対するこのオプトイン要件を強制できます。

API要素にオプトイン要件を追加するには、アノテーションクラスへの参照とともに[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)アノテーションを使用します。

```kotlin
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 拡張にオプトインが必要なインターフェース
interface CoreLibraryApi 
```

`@SubclassOptInRequired`アノテーションを使用してオプトインを要求する場合、その要件は[インナークラスまたはネストされたクラス](nested-classes.md)には伝播しないことに注意してください。

APIで`@SubclassOptInRequired`アノテーションを使用する実例については、`kotlinx.coroutines`ライブラリの[`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)インターフェースを参照してください。

## プレ安定版APIのオプトイン要件

まだ安定していない機能にオプトイン要件を使用する場合、クライアントコードが壊れないようにAPIの段階的リリースを慎重に扱ってください。

プレ安定版APIが段階的リリースされ、安定した状態で公開されたら、宣言からオプトイン要件アノテーションを削除してください。クライアントは制限なくそれらを使用できるようになります。ただし、既存のクライアントコードとの互換性を保つために、アノテーションクラスはモジュールに残しておくべきです。

APIユーザーがコードからすべてのアノテーションを削除して再コンパイルすることでモジュールを更新するように促すには、アノテーションを[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)としてマークし、非推奨メッセージで説明を提供します。

```kotlin
@Deprecated("This opt-in requirement is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime