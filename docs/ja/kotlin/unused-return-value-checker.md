[//]: # (title: 未使用戻り値チェッカー)

<primary-label ref="experimental-general"/>

> この機能は、今後のKotlinリリースで安定化され、改善される予定です。
> 課題トラッカー[YouTrack](https://youtrack.jetbrains.com/issue/KT-12719)でのフィードバックをお待ちしております。
>
> 詳細については、関連する[KEEP提案](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)を参照してください。
>
{style="note"}

未使用戻り値チェッカーを使用すると、_破棄された結果_を検出できます。
これらは、`Unit`、`Nothing`、または`Nothing?`以外の値を生成する式から返され、かつ以下のいずれでもない値です。

* 変数またはプロパティに格納されていない。
* 返されるか、スローされる。
* 別の関数に引数として渡される。
* 呼び出しまたはセーフコールでレシーバーとして使用される。
* `if`、`when`、`while`などの条件でチェックされる。
* ラムダの最後のステートメントとして使用される。

チェッカーは、`++`や`--`のようなインクリメント演算、または`condition || return`のように右辺が現在の関数を終了させる短絡評価を行うブール式に対しては、破棄された結果を報告しません。

未使用戻り値チェッカーを使用して、関数呼び出しが有意義な結果を生成するにもかかわらず、その結果が暗黙的に破棄されてしまうバグを検出できます。
これにより、予期しない動作を防ぎ、そのような問題の特定を容易にすることができます。

以下は、文字列が作成されたものの使用されず、チェッカーによって破棄された結果として報告される例です。

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // チェッカーは、この結果が破棄されているという警告を報告します:
        // "Unused return value of 'plus'."
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

## 未使用戻り値チェッカーを設定する

コンパイラオプション`-Xreturn-value-checker`を使用すると、コンパイラが破棄された結果を報告する方法を制御できます。

以下のモードがあります。

* `disable`: 未使用戻り値チェッカーを無効にします (デフォルト)。
* `check`: チェッカーを有効にし、[マークされた関数](#mark-functions-to-check-ignored-results)からの破棄された結果に対して警告を報告します。
* `full`: チェッカーを有効にし、プロジェクト内のすべての関数を[マーク済み](#mark-functions-to-check-ignored-results)として扱い、破棄された結果に対して警告を報告します。

> すべてのマークされた関数はそのように伝播され、チェッカーが依存関係としてコードを使用するプロジェクトで有効になっている場合、破棄された結果が報告されます。
>
{style="note"}

プロジェクトで未使用戻り値チェッカーを使用するには、ビルド設定ファイルにコンパイラオプションを追加します。

<tabs>
<tab id="kotlin" title="Gradle">

```kotlin
// build.gradle(.kts)
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```
</tab>

<tab id="maven" title="Maven">

```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    ..
    <configuration>
        <args>
            <arg>-Xreturn-value-checker=check</arg>
        </args>
    </configuration>
</plugin>
```

</tab>
</tabs>

## 破棄された結果をチェックする関数をマークする

[コンパイラオプション`-Xreturn-value-checker`](#configure-the-unused-return-value-checker)を`check`に設定すると、Kotlin標準ライブラリのほとんどの関数と同様に、チェッカーはマークされた式からのみ破棄された結果を報告します。

独自のコードをマークするには、[`@MustUseReturnValues`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-must-use-return-value/)アノテーションを使用します。
チェッカーがカバーする範囲に応じて、ファイル、クラス、または関数に適用できます。

例えば、ファイル全体をマークできます。

```kotlin
// このファイル内のすべての関数とクラスをマークし、チェッカーが未使用の戻り値を報告するようにします
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

あるいは特定のクラスをマークすることもできます。

```kotlin
// このクラス内のすべての関数をマークし、チェッカーが未使用の戻り値を報告するようにします
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```

> コンパイラオプション`-Xreturn-value-checker`を`full`に設定することで、チェッカーをプロジェクト全体に適用できます。
> このオプションを使用する場合、コードに`@MustUseReturnValues`アノテーションを付ける必要はありません。
>
{style="note"}

## 破棄された結果のレポートを抑制する

[`@IgnorableReturnValue`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-ignorable-return-value/)アノテーションを付けることで、特定の関数のレポートを抑制できます。
`MutableList.add`のように、結果の破棄が一般的であり、想定される関数にアノテーションを付けます。

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

関数自体にアノテーションを付けずに警告を抑制することもできます。
これを行うには、結果をアンダースコア構文 (`_`) を使用した特殊な名前のない変数に代入します。

```kotlin
// 破棄できない関数
fun computeValue(): Int = 42

fun main() {

    // 警告を報告: 結果が破棄されています
    computeValue()

    // この呼び出し箇所でのみ、特殊な未使用変数で警告を抑制します
    val _ = computeValue()
}
```

### 関数オーバーライドにおける破棄された結果

関数をオーバーライドする場合、オーバーライドは基底宣言のアノテーションによって定義されたレポートルールを継承します。
これは、基底宣言がKotlin標準ライブラリまたは他のライブラリの依存関係の一部である場合にも適用されるため、チェッカーは`Any.hashCode()`のような関数のオーバーライドに対しても破棄された結果を報告します。

さらに、[`@IgnorableReturnValue`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-ignorable-return-value/)でマークされた関数を、[戻り値の使用を要求する](#mark-functions-to-check-ignored-results)別の関数でオーバーライドすることはできません。
ただし、結果が安全に破棄できる場合、`@MustUseReturnValues`でアノテーションされたクラスまたはインターフェース内で、オーバーライドを`@IgnorableReturnValue`でマークできます。

```kotlin
@MustUseReturnValues
interface Greeter {
    fun greet(name: String): String
}

object SilentGreeter : Greeter {
    @IgnorableReturnValue
    override fun greet(name: String): String = ""
}

fun check(g: Greeter) {
    // 警告を報告: 未使用の戻り値
    g.greet("John")

    // 警告なし
    SilentGreeter.greet("John")
}
```

## Javaアノテーションとの相互運用性

一部のJavaライブラリは、異なるアノテーションを使用して同様のメカニズムを採用しています。
未使用戻り値チェッカーは、次のアノテーションを`@MustUseReturnValues`の使用と同等として扱います。

* [`com.google.errorprone.annotations.CheckReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CheckReturnValue.html)
* [`edu.umd.cs.findbugs.annotations.CheckReturnValue`](https://findbugs.sourceforge.net/api/edu/umd/cs/findbugs/annotations/CheckReturnValue.html)
* [`org.jetbrains.annotations.CheckReturnValue`](https://javadoc.io/doc/org.jetbrains/annotations/latest/org/jetbrains/annotations/CheckReturnValue.html)
* [`org.springframework.lang.CheckReturnValue`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/lang/CheckReturnValue.html)
* [`org.jooq.CheckReturnValue`](https://www.jooq.org/javadoc/latest/org.jooq/org/jooq/CheckReturnValue.html)

また、[`com.google.errorprone.annotations.CanIgnoreReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CanIgnoreReturnValue.html)を`@IgnorableReturnValue`の使用と同等として扱います。