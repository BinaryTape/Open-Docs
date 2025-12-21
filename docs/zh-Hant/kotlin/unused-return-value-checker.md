[//]: # (title: 未使用的回傳值檢查器)

<primary-label ref="experimental-general"/>

> 此功能計劃在未來的 Kotlin 版本中穩定並改進。
> 我們非常感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719) 中提供回饋。
> 
> 更多資訊請參閱相關的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)。
>
{style="note"}

未使用的回傳值檢查器可讓您偵測到 _被忽略的結果_。
這些是從產生 `Unit`、`Nothing` 或 `Nothing?` 以外值的表達式所回傳，且未符合以下任一條件的值：

*   儲存在變數或屬性中。
*   回傳或拋出。
*   作為引數傳遞給另一個函式。
*   在呼叫或安全呼叫中作為接收者使用。
*   在 `if`、`when` 或 `while` 等條件中檢查。
*   作為 lambda 的最後一個語句使用。

檢查器不會針對遞增操作（例如 `++` 和 `--`），或右側會結束目前函式的布林捷徑（例如 `condition || return`）回報被忽略的結果。

您可以使用未使用的回傳值檢查器來捕捉這樣的錯誤：函式呼叫產生了有意義的結果，但該結果卻被默默地丟棄。
這有助於防止意外行為，並使此類問題更容易追蹤。

以下是一個範例，其中字串已建立但從未使用，因此檢查器將其回報為被忽略的結果：

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // 檢查器回報此結果被忽略的警告：
        // "plus" 的回傳值未使用。
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

## 配置未使用的回傳值檢查器

您可以使用 `-Xreturn-value-checker` 編譯器選項來控制編譯器如何回報被忽略的結果。

它有以下模式：

*   `disable` 禁用未使用的回傳值檢查器（預設）。
*   `check` 啟用檢查器，並回報來自 [標記函式](#mark-functions-to-check-ignored-results) 的被忽略結果的警告。
*   `full` 啟用檢查器，將專案中的所有函式視為 [已標記](#mark-functions-to-check-ignored-results)，並回報被忽略結果的警告。

> 所有標記的函式都會照此傳播，如果在使用您的程式碼作為依賴項的專案中啟用檢查器，則會回報被忽略的結果。
> 
{style="note"}

要在您的專案中使用未使用的回傳值檢查器，請將編譯器選項新增至您的建置設定檔中：

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

## 標記函式以檢查被忽略的結果

當您將 [`-Xreturn-value-checker` 編譯器選項](#configure-the-unused-return-value-checker) 設定為 `check` 時，
檢查器只會回報來自已標記表達式的被忽略結果，就像 Kotlin 標準函式庫中的大多數函式一樣。

要標記您自己的程式碼，請使用 [`@MustUseReturnValues`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-must-use-return-value/) 註解。
您可以根據您希望檢查器涵蓋的範圍，將其應用於檔案、類別或函式。

例如，您可以標記整個檔案：

```kotlin
// 標記此檔案中的所有函式和類別，以便檢查器回報未使用的回傳值
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

或特定類別：

```kotlin
// 標記此類別中的所有函式，以便檢查器回報未使用的回傳值
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```

> 您可以透過將 `-Xreturn-value-checker` 編譯器選項設定為 `full`，將檢查器應用於您的整個專案。
> 使用此選項，您無需使用 `@MustUseReturnValues` 註解您的程式碼。
>
{style="note"}

## 抑制被忽略結果的回報

您可以透過使用 [`@IgnorableReturnValue`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-ignorable-return-value/) 註解特定函式來抑制其回報。
註解那些忽略結果是常見且預期的函式，例如 `MutableList.add`：

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

您可以在不註解函式本身的情況下抑制警告。
為此，請將結果賦值給一個特殊的、帶有底線語法 (`_`) 的匿名變數：

```kotlin
// 不可忽略的函式
fun computeValue(): Int = 42

fun main() {

    // 回報警告：結果被忽略
    computeValue()

    // 僅在此呼叫點使用特殊未使用的變數抑制警告
    val _ = computeValue()
}
```

### 函式覆寫中的被忽略結果

當您覆寫一個函式時，覆寫會繼承基礎宣告上註解所定義的回報規則。
這也適用於基礎宣告是 Kotlin 標準函式庫或其他函式庫依賴項的一部分時，因此檢查器會針對 `Any.hashCode()` 等函式的覆寫回報被忽略的結果。

此外，您不能使用 [要求其回傳值被使用](#mark-functions-to-check-ignored-results) 的另一個函式來覆寫標記有 `@IgnorableReturnValue` 的函式。
然而，當其結果可以安全地被忽略時，您可以在標記有 `@MustUseReturnValues` 註解的類別或介面中，使用 `@IgnorableReturnValue` 標記覆寫：

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
    // 回報警告：未使用的回傳值
    g.greet("John")

    // 無警告
    SilentGreeter.greet("John")
}
```

## 與 Java 註解的互通性

一些 Java 函式庫使用具有不同註解的類似機制。
未使用的回傳值檢查器將以下註解視為等同於使用 `@MustUseReturnValues`：

*   [`com.google.errorprone.annotations.CheckReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CheckReturnValue.html)
*   [`edu.umd.cs.findbugs.annotations.CheckReturnValue`](https://findbugs.sourceforge.net/api/edu/umd/cs/findbugs/annotations/CheckReturnValue.html)
*   [`org.jetbrains.annotations.CheckReturnValue`](https://javadoc.io/doc/org.jetbrains/annotations/latest/org/jetbrains/annotations/CheckReturnValue.html)
*   [`org.springframework.lang.CheckReturnValue`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/lang/CheckReturnValue.html)
*   [`org.jooq.CheckReturnValue`](https://www.jooq.org/javadoc/latest/org.jooq/org/jooq/CheckReturnValue.html)

它也將 [`com.google.errorprone.annotations.CanIgnoreReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CanIgnoreReturnValue.html) 視為等同於使用 `@IgnorableReturnValue`。