[//]: # (title: Kotlin 2.1.0 有什麼新功能)

_[發布日期：2024 年 11 月 27 日](releases.md#release-details)_

Kotlin 2.1.0 版本現已推出！以下是主要亮點：

*   **預覽版新語言功能**：[在帶有主體的 `when` 表達式中使用守衛條件](#guard-conditions-in-when-with-a-subject)、[非局部 `break` 和 `continue`](#non-local-break-and-continue)，以及[多美元符號字串插值](#multi-dollar-string-interpolation)。
*   **K2 編譯器更新**：[編譯器檢查的更高彈性](#extra-compiler-checks) 和 [kapt 實作的改進](#improved-k2-kapt-implementation)。
*   **Kotlin Multiplatform**：引入了 [對 Swift 匯出的基本支援](#basic-support-for-swift-export)，[用於編譯器選項的穩定 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)，以及更多。
*   **Kotlin/Native**：[`iosArm64` 支援改進](#iosarm64-promoted-to-tier-1) 和其他更新。
*   **Kotlin/Wasm**：多項更新，包括[支援增量編譯](#support-for-incremental-compilation)。
*   **Gradle 支援**：[與新版本 Gradle 和 Android Gradle 外掛程式的相容性改進](#gradle-improvements)，以及 [Kotlin Gradle 外掛程式 API 的更新](#new-api-for-kotlin-gradle-plugin-extensions)。
*   **文件**：[Kotlin 文件的重大改進](#documentation-updates)。

## IDE 支援

支援 2.1.0 的 Kotlin 外掛程式已捆綁在最新的 IntelliJ IDEA 和 Android Studio 中。您無需更新 IDE 中的 Kotlin 外掛程式。您只需在建構腳本中將 Kotlin 版本更改為 2.1.0。

有關詳細資訊，請參閱 [更新到新的 Kotlin 版本](releases.md#update-to-a-new-kotlin-version)。

## 語言

在發布帶有 K2 編譯器的 Kotlin 2.0.0 後，JetBrains 團隊正專注於透過新功能改進語言。在此版本中，我們很高興宣布多項新的語言設計改進。

這些功能目前在預覽版中提供，我們鼓勵您試用並分享您的回饋：

*   [在帶有主體的 `when` 表達式中使用守衛條件](#guard-conditions-in-when-with-a-subject)
*   [非局部 `break` 和 `continue`](#non-local-break-and-continue)
*   [多美元符號插值：改進了字串文字中 `$` 符號的處理方式](#multi-dollar-string-interpolation)

> 所有功能都已在啟用 K2 模式的最新 IntelliJ IDEA 2024.3 版本中獲得 IDE 支援。
>
> 更多資訊請參閱 [IntelliJ IDEA 2024.3 部落格文章](https://blog.jetbrains.com/idea/2024/11/intellij-idea-2024-3/)。
>
{style="tip"}

[查看 Kotlin 語言設計功能和提案的完整列表](kotlin-language-features-and-proposals.md)。

此版本還帶來了以下語言更新：

*   [](#support-for-requiring-opt-in-to-extend-apis)
*   [](#improved-overload-resolution-for-functions-with-generic-types)
*   [](#improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes)

### 在帶有主體的 when 表達式中使用守衛條件

> 此功能處於 [預覽版](kotlin-evolution-principles.md#pre-stable-features) 階段，需要選擇啟用 (opt-in)（詳情請參閱下方）。
>
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140) 中提供回饋。
>
{style="warning"}

從 2.1.0 開始，您可以在帶有主體 (`when` subject) 的 `when` 表達式或語句中使用守衛條件 (guard conditions)。

守衛條件允許您為 `when` 表達式的分支包含多個條件，使複雜的控制流程更加明確和簡潔，並扁平化程式碼結構。

要在分支中包含守衛條件，請將其放在主要條件之後，並用 `if` 分隔：

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal {
        fun feedCat() {}
    }

    data class Dog(val breed: String) : Animal {
        fun feedDog() {}
    }
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // Branch with only the primary condition. Calls `feedDog()` when `animal` is `Dog`
        is Animal.Dog -> animal.feedDog()
        // Branch with both primary and guard conditions. Calls `feedCat()` when `animal` is `Cat` and is not `mouseHunter`
        is Animal.Cat if !animal.mouseHunter -> animal.feedCat()
        // Prints "Unknown animal" if none of the above conditions match
        else -> println("Unknown animal")
    }
}
```

在單個 `when` 表達式中，您可以組合帶有和不帶守衛條件的分支。帶有守衛條件的分支中的程式碼僅在主要條件和守衛條件均為 `true` 時執行。如果主要條件不匹配，則不評估守衛條件。此外，守衛條件支援 `else if`。

若要在您的專案中啟用守衛條件，請在命令列中使用以下編譯器選項：

```bash
kotlinc -Xwhen-guards main.kt
```

或將其添加到您的 Gradle 建構檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-guards")
    }
}
```

### 非局部 break 和 continue

> 此功能處於 [預覽版](kotlin-evolution-principles.md#pre-stable-features) 階段，需要選擇啟用 (opt-in)（詳情請參閱下方）。
>
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436) 中提供回饋。
>
{style="warning"}

Kotlin 2.1.0 增加了另一個期待已久的功能預覽版：使用非局部 `break` 和 `continue` 的能力。此功能擴展了您在內聯函數範圍內可以使用的工具集，並減少了專案中的樣板程式碼。

以前，您只能使用非局部返回。現在，Kotlin 還支援非局部應用 `break` 和 `continue` [跳轉表達式](returns.md)。這意味著您可以在作為內聯函數參數傳遞的 Lambda 表達式中應用它們，該內聯函數包含循環：

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
            continue
        }
        if (variable == 0) return true // If variable is zero, return true
    }
    return false
}
```

若要在您的專案中試用此功能，請在命令列中使用 `-Xnon-local-break-continue` 編譯器選項：

```bash
kotlinc -Xnon-local-break-continue main.kt
```

或將其添加到您的 Gradle 建構檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnon-local-break-continue")
    }
}
```

我們計畫在未來的 Kotlin 版本中使此功能穩定。如果您在使用非局部 `break` 和 `continue` 時遇到任何問題，請向我們的 [問題追蹤器](https://youtrack.jetbrains.com/issue/KT-1436) 報告。

### 多美元符號字串插值

> 此功能處於 [預覽版](kotlin-evolution-principles.md#pre-stable-features) 階段，需要選擇啟用 (opt-in)（詳情請參閱下方）。
>
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425) 中提供回饋。
>
{style="warning"}

Kotlin 2.1.0 引入了對多美元符號字串插值的支援，改進了字串文字中美元符號 (`$`) 的處理方式。此功能在需要多個美元符號的上下文中很有用，例如範本引擎、JSON 綱要或其他數據格式。

Kotlin 中的字串插值使用單個美元符號。然而，在字串中使用文字美元符號（這在金融數據和範本系統中很常見）需要變通辦法，例如 `${'$'}`。啟用多美元符號插值功能後，您可以設定多少個美元符號會觸發插值，而較少的美元符號將被視為字串文字。

以下是一個使用 `:` 來生成帶有佔位符的 JSON 綱要多行字串的範例：

```kotlin
val KClass<*>.jsonSchema : String
    get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

在此範例中，開頭的 `$` 表示您需要 **兩個美元符號** (`$`) 來觸發插值。這防止了 `$schema`、`$id` 和 `$dynamicAnchor` 被解釋為插值標記。

當處理使用美元符號作為佔位符語法的系統時，這種方法尤其有用。

若要啟用此功能，請在命令列中使用以下編譯器選項：

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

或者，更新您的 Gradle 建構檔案的 `compilerOptions {}` 區塊：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

如果您的程式碼已經使用單個美元符號的標準字串插值，則無需更改。您可以隨時使用 `$` 來表示字串中的文字美元符號。

### 支援要求選擇啟用才能擴充 API

Kotlin 2.1.0 引入了 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 註解，它允許程式庫作者要求使用者在實作實驗性介面或擴充實驗性類別之前，明確地選擇啟用 (opt-in)。

當程式庫 API 穩定到足以使用，但可能隨新抽象函數演進，使其不穩定而無法繼承時，此功能會很有用。

若要將選擇啟用要求新增至 API 元素，請使用 `@SubclassOptInRequired` 註解並參考註解類別：

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

在此範例中，`CoreLibraryApi` 介面要求使用者在實作之前選擇啟用。使用者可以這樣選擇啟用：

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

> 當您使用 `@SubclassOptInRequired` 註解要求選擇啟用時，該要求不會傳播到任何 [內部或巢狀類別](nested-classes.md)。
>
{style="note"}

有關如何在您的 API 中使用 `@SubclassOptInRequired` 註解的實際範例，請查看 `kotlinx.coroutines` 程式庫中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 介面。

### 改進了帶有泛型類型的函數的重載解析

以前，如果函數有多個重載，其中一些的參數為泛型類型，而另一些在相同位置具有函數類型，則解析行為有時可能會不一致。

這導致了根據您的重載是成員函數還是擴展函數而產生不同的行為。例如：

```kotlin
class KeyValueStore<K, V> {
    fun store(key: K, value: V) {} // 1
    fun store(key: K, lazyValue: () -> V) {} // 2
}

fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, value: V) {} // 1
fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, lazyValue: () -> V) {} // 2

fun test(kvs: KeyValueStore<String, Int>) {
    // Member functions
    kvs.store("", 1)    // Resolves to 1
    kvs.store("") { 1 } // Resolves to 2

    // Extension functions
    kvs.storeExtension("", 1)    // Resolves to 1
    kvs.storeExtension("") { 1 } // Doesn't resolve
}
```

在此範例中，`KeyValueStore` 類別有兩個 `store()` 函數的重載，其中一個重載的函數參數具有泛型類型 `K` 和 `V`，另一個具有返回泛型類型 `V` 的 lambda 函數。同樣，擴展函數 `storeExtension()` 也有兩個重載。

當 `store()` 函數在帶有和不帶 lambda 函數的情況下被呼叫時，編譯器成功解析了正確的重載。然而，當擴展函數 `storeExtension()` 帶有 lambda 函數被呼叫時，編譯器沒有解析正確的重載，因為它錯誤地認為兩個重載都適用。

為了解決此問題，我們引入了一種新的啟發式方法，以便編譯器可以丟棄一個可能的重載，當具有泛型類型的函數參數無法根據來自不同參數的資訊接受 lambda 函數時。此更改使成員函數和擴展函數的行為保持一致，並且在 Kotlin 2.1.0 中預設啟用。

### 改進了 sealed class 的 when 表達式的窮舉檢查

在 Kotlin 以前的版本中，即使 `sealed class` 層次結構中的所有情況都已涵蓋，編譯器仍要求在 `when` 表達式中為具有 sealed upper bounds 的類型參數使用 `else` 分支。Kotlin 2.1.0 解決並改進了此行為，使窮舉檢查 (exhaustiveness checks) 更強大，並允許您移除多餘的 `else` 分支，使 `when` 表達式更簡潔和直觀。

以下是一個展示此變更的範例：

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error -> "Error!"
    is Success -> result.value
    // Requires no else branch
}
```

## Kotlin K2 編譯器

透過 Kotlin 2.1.0，K2 編譯器現在在處理編譯器檢查和警告方面提供了 [更高的彈性](#extra-compiler-checks)，以及 [對 kapt 外掛程式的改進支援](#improved-k2-kapt-implementation)。

### 額外的編譯器檢查

在 Kotlin 2.1.0 中，您現在可以在 K2 編譯器中啟用額外的檢查。這些是額外的宣告、表達式和類型檢查，通常對編譯不重要，但如果您想驗證以下情況，仍然很有用：

| 檢查類型                                  | 註解                                                                                   |
| :---------------------------------------- | :------------------------------------------------------------------------------------- |
| `REDUNDANT_NULLABLE`                      | 使用 `Boolean??` 而不是 `Boolean?`                                                     |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN`         | 使用 `java.lang.String` 而不是 `kotlin.String`                                         |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | 使用 `arrayOf("") == arrayOf("")` 而不是 `arrayOf("").contentEquals(arrayOf(""))`         |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD`     | 使用 `42.toInt()` 而不是 `42`                                                          |
| `USELESS_CALL_ON_NOT_NULL`                | 使用 `"".orEmpty()` 而不是 `""`                                                        |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE` | 使用 `"$string"` 而不是 `string`                                                         |
| `UNUSED_ANONYMOUS_PARAMETER`              | 參數在 Lambda 表達式中傳遞但從未使用                                                          |
| `REDUNDANT_VISIBILITY_MODIFIER`           | 使用 `public class Klass` 而不是 `class Klass`                                         |
| `REDUNDANT_MODALITY_MODIFIER`             | 使用 `final class Klass` 而不是 `class Klass`                                          |
| `REDUNDANT_SETTER_PARAMETER_TYPE`         | 使用 `set(value: Int)` 而不是 `set(value)`                                             |
| `CAN_BE_VAL`                              | 定義了 `var local = 0` 但從未重新賦值，可改為 `val local = 42`                                   |
| `ASSIGNED_VALUE_IS_NEVER_READ`            | 定義了 `val local = 42` 但之後在程式碼中從未使用                                                |
| `UNUSED_VARIABLE`                         | 定義了 `val local = 0` 但在程式碼中從未使用                                                     |
| `REDUNDANT_RETURN_UNIT_TYPE`              | 使用 `fun foo(): Unit {}` 而不是 `fun foo() {}`                                        |
| `UNREACHABLE_CODE`                        | 程式碼語句存在但從無法執行                                                                     |

如果檢查為真，您將收到一個編譯器警告，並附帶如何解決問題的建議。

額外檢查預設禁用。若要啟用它們，請在命令列中使用 `-Wextra` 編譯器選項，或在您的 Gradle 建構檔案的 `compilerOptions {}` 區塊中指定 `extraWarnings`：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

有關如何定義和使用編譯器選項的更多資訊，請參閱 [Kotlin Gradle 外掛程式中的編譯器選項](gradle-compiler-options.md)。

### 全域警告抑制

在 2.1.0 中，Kotlin 編譯器收到了一個高度請求的功能——全域抑制警告的能力。

您現在可以透過在命令列中使用 `-Xsuppress-warning=WARNING_NAME` 語法或在您的建構檔案的 `compilerOptions {}` 區塊中使用 `freeCompilerArgs` 屬性，在整個專案中抑制特定警告。

例如，如果您的專案中啟用了 [額外的編譯器檢查](#extra-compiler-checks)，但您想抑制其中一個，請使用：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

如果您想抑制某個警告但不知道其名稱，請選取元素並點擊燈泡圖示（或使用 <shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut>）：

![Warning name intention](warning-name-intention.png){width=500}

新的編譯器選項目前處於 [實驗階段](components-stability.md#stability-levels-explained)。以下細節也值得注意：

*   不允許錯誤抑制。
*   如果您傳遞了未知的警告名稱，編譯將導致錯誤。
*   您可以一次指定多個警告：

   <tabs>
   <tab title="命令列">

   ```bash
   kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
   ```

   </tab>
   <tab title="建構檔案">

   ```kotlin
   // build.gradle.kts
   kotlin {
       compilerOptions {
           freeCompilerArgs.addAll(
               listOf(
                   "-Xsuppress-warning=NOTHING_TO_INLINE",
                   "-Xsuppress-warning=NO_TAIL_CALLS_FOUND"
               )
           )
       }
   }
   ```

   </tab>
   </tabs>

### 改進的 K2 kapt 實作

> K2 編譯器的 kapt 外掛程式 (K2 kapt) 處於 [Alpha](components-stability.md#stability-levels-explained) 階段。它可能隨時更改。
>
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) 中提供回饋。
>
{style="warning"}

目前，使用 [kapt](kapt.md) 外掛程式的專案預設使用 K1 編譯器，支援 Kotlin 版本高達 1.9。

在 Kotlin 1.9.20 中，我們推出了帶有 K2 編譯器的 kapt 外掛程式的實驗性實作 (K2 kapt)。我們現在改進了 K2 kapt 的內部實作，以減輕技術和效能問題。

雖然新的 K2 kapt 實作沒有引入新功能，但其效能與以前的 K2 kapt 實作相比顯著提高。此外，K2 kapt 外掛程式的行為現在與 K1 kapt 更為接近。

若要使用新的 K2 kapt 外掛程式實作，請像啟用之前的 K2 kapt 外掛程式一樣啟用它。將以下選項新增至您的專案的 `gradle.properties` 檔案中：

```kotlin
kapt.use.k2=true
```

在即將發布的版本中，K2 kapt 實作將預設啟用，取代 K1 kapt，因此您將不再需要手動啟用它。

在新實作穩定之前，我們非常感謝您的 [回饋](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

### 無符號類型與非基本類型之間重載衝突的解析

此版本解決了以前版本中可能出現的重載衝突解析問題，當函數針對無符號類型和非基本類型進行重載時，如下列範例：

#### 重載擴充函數

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // Overload resolution ambiguity before Kotlin 2.1.0
}
```

在早期版本中，呼叫 `uByte.doStuff()` 導致歧義，因為 `Any` 和 `UByte` 擴展都適用。

#### 重載頂層函數

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // Overload resolution ambiguity before Kotlin 2.1.0
}
```

同樣，呼叫 `doStuff(uByte)` 也是模稜兩可的，因為編譯器無法決定是使用 `Any` 版本還是 `UByte` 版本。在 2.1.0 中，編譯器現在正確處理這些情況，透過優先處理更具體的類型（在本例中為 `UByte`）來解決歧義。

## Kotlin/JVM

從 2.1.0 版本開始，編譯器可以生成包含 Java 23 字節碼的類別。

### 將 JSpecify 可空性不匹配診斷嚴重性更改為嚴格

Kotlin 2.1.0 預設強制執行 `org.jspecify.annotations` 中的可空性註解的嚴格處理，從而提高了 Java 互通性的類型安全性。

以下可空性註解受到影響：

*   `org.jspecify.annotations.Nullable`
*   `org.jspecify.annotations.NonNull`
*   `org.jspecify.annotations.NullMarked`
*   `org.jspecify.nullness` 中的舊版註解（JSpecify 0.2 及更早版本）

從 Kotlin 2.1.0 開始，可空性不匹配預設從警告提升為錯誤。這確保了 `@NonNull` 和 `@Nullable` 等註解在類型檢查期間被強制執行，防止在執行時出現意外的空值性問題。

`@NullMarked` 註解還會影響其範圍內所有成員的可空性，使得在處理帶註解的 Java 程式碼時行為更具可預測性。

以下是一個展示新預設行為的範例：

```java
// Java
import org.jspecify.annotations.*;
public class SomeJavaClass {
    @NonNull
    public String foo() { //...
    }

    @Nullable
    public String bar() { //...
    }
}
```

```kotlin
// Kotlin
fun test(sjc: SomeJavaClass) {
    // Accesses a non-null result, which is allowed
    sjc.foo().length

    // Raises an error in the default strict mode because the result is nullable
    // To avoid the error, use ?.length instead
    sjc.bar().length
}
```

您可以手動控制這些註解的診斷嚴重性。為此，請使用 `-Xnullability-annotations` 編譯器選項選擇模式：

*   `ignore`：忽略可空性不匹配。
*   `warning`：報告可空性不匹配的警告。
*   `strict`：報告可空性不匹配的錯誤（預設模式）。

有關更多資訊，請參閱 [可空性註解](java-interop.md#nullability-annotations)。

## Kotlin Multiplatform

Kotlin 2.1.0 引入了 [對 Swift 匯出的基本支援](#basic-support-for-swift-export)，並使 [發布 Kotlin Multiplatform 程式庫更容易](#ability-to-publish-kotlin-libraries-from-any-host)。它還專注於 Gradle 方面的改進，這些改進穩定化了 [用於配置編譯器選項的新 DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)，並帶來了 [隔離專案功能的預覽](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

### 用於 Multiplatform 專案中編譯器選項的新 Gradle DSL 升級為穩定版

在 Kotlin 2.0.0 中，[我們引入了一個新的實驗性 Gradle DSL](whatsnew20.md#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)，以簡化跨多平台專案的編譯器選項配置。在 Kotlin 2.1.0 中，此 DSL 已升級為穩定版。

整體專案配置現在分為三層。最高層是擴充功能層級，其次是目標層級，最低層是編譯單元（通常是編譯任務）：

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

要了解有關不同層級以及如何在其間配置編譯器選項的更多資訊，請參閱 [編譯器選項](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compiler-options)。

### 預覽 Gradle 在 Kotlin Multiplatform 中的隔離專案

> 此功能處於 [實驗階段](components-stability.md#stability-levels-explained)，目前在 Gradle 中處於 Alpha 前期狀態。
> 僅與 Gradle 8.10 版一起使用，並且僅用於評估目的。該功能可能隨時被移除或更改。
>
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中提供回饋。需要選擇啟用 (opt-in)（詳情請參閱下方）。
>
{style="warning"}

在 Kotlin 2.1.0 中，您可以在您的 Multiplatform 專案中預覽 Gradle 的 [隔離專案](https://docs.gradle.org/current/userguide/isolated_projects.html) 功能。

Gradle 中的隔離專案功能透過「隔離」各個 Gradle 專案的配置來提高建構效能。每個專案的建構邏輯被限制為不能直接存取其他專案的可變狀態，從而允許它們安全地並行運行。為支援此功能，我們對 Kotlin Gradle 外掛程式的模型進行了一些更改，我們有興趣了解您在此預覽階段的經驗。

有兩種方法可以啟用 Kotlin Gradle 外掛程式的新模型：

*   選項 1：**測試相容性但不啟用隔離專案** –
    若要檢查與 Kotlin Gradle 外掛程式新模型的相容性，但不啟用隔離專案功能，請將以下 Gradle 屬性新增至您的專案的 `gradle.properties` 檔案中：

    ```none
    # gradle.properties
    kotlin.kmp.isolated-projects.support=enable
    ```

*   選項 2：**啟用隔離專案進行測試** –
    在 Gradle 中啟用隔離專案功能會自動將 Kotlin Gradle 外掛程式配置為使用新模型。若要啟用隔離專案功能，請 [設定系統屬性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。在這種情況下，您無需將 Kotlin Gradle 外掛程式的 Gradle 屬性新增至您的專案。

### 對 Swift 匯出的基本支援

> 此功能目前處於早期開發階段。它可能隨時被移除或更改。
> 需要選擇啟用 (opt-in)（詳情請參閱下方），您應僅用於評估目的。
> 我們非常感謝您在 [YouTrack](https://kotl.in/issue) 中提供回饋。
>
{style="warning"}

2.1.0 版本邁出了支援 Kotlin 中 Swift 匯出的第一步，允許您將 Kotlin 原始碼直接匯出到 Swift 介面，而無需使用 Objective-C 標頭。這應該會簡化 Apple 目標的多平台開發。

當前基本支援包括以下能力：

*   將 Kotlin 中的多個 Gradle 模組直接匯出到 Swift。
*   使用 `moduleName` 屬性定義自訂 Swift 模組名稱。
*   使用 `flattenPackage` 屬性設定套件結構的折疊規則。

您可以使用專案中的以下建構檔案作為設定 Swift 匯出的起點：

```kotlin
// build.gradle.kts
kotlin {

    iosX64()
    iosArm64()
    iosSimulatorArm64()

    @OptIn(ExperimentalSwiftExportDsl::class)
    swiftExport {
        // Root module name
        moduleName = "Shared"

        // Collapse rule
        // Removes package prefix from generated Swift code
        flattenPackage = "com.example.sandbox"

        // Export external modules
        export(project(":subproject")) {
            // Exported module name
            moduleName = "Subproject"
            // Collapse exported dependency rule
            flattenPackage = "com.subproject.library"
        }
    }
}
```

您也可以複製我們已設定好 Swift 匯出的 [公共範例](https://github.com/Kotlin/swift-export-sample)。

編譯器會自動生成所有必要檔案（包括 `swiftmodule` 檔案、靜態 `a` 程式庫以及標頭和 `modulemap` 檔案），並將它們複製到應用程式的建構目錄中，您可以從 Xcode 存取該目錄。

#### 如何啟用 Swift 匯出

請記住，此功能目前仍處於早期開發階段。

Swift 匯出目前適用於使用 [直接整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html) 將 iOS 框架連接到 Xcode 專案的專案。這是透過 Android Studio 或 [Web 精靈](https://kmp.jetbrains.com/) 建立的 Kotlin Multiplatform 專案的標準配置。

若要在您的專案中試用 Swift 匯出：

1.  將以下 Gradle 選項新增至您的 `gradle.properties` 檔案中：

    ```none
    # gradle.properties
    kotlin.experimental.swift-export.enabled=true
    ```

2.  在 Xcode 中，打開專案設定。
3.  在 **Build Phases** (建構階段) 標籤中，找到帶有 `embedAndSignAppleFrameworkForXcode` 任務的 **Run Script** (執行腳本) 階段。
4.  調整腳本，使其在執行腳本階段中包含 `embedSwiftExportForXcode` 任務：

    ```bash
    ./gradlew :<Shared module name>:embedSwiftExportForXcode
    ```

    ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

#### 關於 Swift 匯出的回饋

我們計畫在未來的 Kotlin 版本中擴展並穩定 Swift 匯出支援。請在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-64572) 中留下您的回饋。

### 從任何主機發布 Kotlin 程式庫的能力

> 此功能目前處於 [實驗階段](components-stability.md#stability-levels-explained)。
> 需要選擇啟用 (opt-in)（詳情請參閱下方），您應僅用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中提供回饋。
>
{style="warning"}

Kotlin 編譯器會生成 `.klib` 構件用於發布 Kotlin 程式庫。以前，您可以從任何主機獲取必要的構件，除了需要 Mac 機器才能處理的 Apple 平台目標。這對針對 iOS、macOS、tvOS 和 watchOS 目標的 Kotlin Multiplatform 專案施加了特殊限制。

Kotlin 2.1.0 解除了此限制，增加了對交叉編譯的支援。現在您可以使用任何主機生成 `.klib` 構件，這應能大大簡化 Kotlin 和 Kotlin Multiplatform 程式庫的發布流程。

#### 如何啟用從任何主機發布程式庫

若要在您的專案中試用交叉編譯，請將以下二進制選項新增至您的 `gradle.properties` 檔案中：

```none
# gradle.properties
kotlin.native.enableKlibsCrossCompilation=true
```

此功能目前處於實驗階段，並有一些限制。如果您符合以下條件，仍然需要使用 Mac 電腦：

*   您的程式庫具有 [cinterop 依賴項](native-c-interop.md)。
*   您的專案中設定了 [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)。
*   您需要為 Apple 目標建構或測試 [最終二進位檔](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。

#### 關於從任何主機發布程式庫的回饋

我們計畫在未來的 Kotlin 版本中穩定此功能並進一步改進程式庫發布。請在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中留下您的回饋。

有關更多資訊，請參閱 [發布多平台程式庫](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)。

### 支援非打包的 klibs

Kotlin 2.1.0 使生成非打包的 `.klib` 檔案構件成為可能。這使您可以選擇直接配置對 klibs 的依賴項，而無需先解包它們。

此變更還可以提高效能，減少您的 Kotlin/Wasm、Kotlin/JS 和 Kotlin/Native 專案中的編譯和連結時間。

例如，我們的基準測試顯示，在包含 1 個連結任務和 10 個編譯任務的專案中，總建構時間的效能提高了約 3%（該專案建構一個依賴於 9 個簡化專案的單個原生可執行二進位檔）。然而，對建構時間的實際影響取決於子專案的數量及其各自的大小。

#### 如何設定您的專案

預設情況下，Kotlin 編譯和連結任務現在已配置為使用新的非打包構件。

如果您已設定自訂建構邏輯以解析 klibs，並希望使用新的未打包構件，則需要在您的 Gradle 建構檔案中明確指定 klib 套件解析的首選變體：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.plugin.attributes.KlibPackaging
// ...
val resolvableConfiguration = configurations.resolvable("resolvable") {

    // For the new non-packed configuration:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.NON_PACKED))

    // For the previous packed configuration:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.PACKED))
}
```

非打包的 `.klib` 檔案在您的專案的建構目錄中以與以前打包檔案相同的路徑生成。反之，打包的 klibs 現在位於 `build/libs` 目錄中。

如果未指定屬性，則使用打包變體。您可以透過以下控制台指令查看可用屬性和變體的列表：

```shell
./gradlew outgoingVariants
```

我們非常感謝您在 [YouTrack](https://kotl.in/issue) 中提供有關此功能的回饋。

### 進一步棄用舊的 `android` 目標

在 Kotlin 2.1.0 中，舊的 `android` 目標名稱的棄用警告已升級為錯誤。

目前，我們建議在針對 Android 的 Kotlin Multiplatform 專案中使用 `androidTarget` 選項。這是一個臨時解決方案，旨在為 Google 即將推出的 Android/KMP 外掛程式釋放 `android` 名稱。

當新外掛程式可用時，我們將提供進一步的遷移說明。Google 的新 DSL 將成為 Kotlin Multiplatform 中 Android 目標支援的首選選項。

有關更多資訊，請參閱 [Kotlin Multiplatform 相容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#rename-of-android-target-to-androidtarget)。

### 移除對宣告多個相同類型目標的支援

在 Kotlin 2.1.0 之前，您可以在多平台專案中宣告多個相同類型的目標。然而，這使得區分目標和有效支援共享原始碼集變得具有挑戰性。在大多數情況下，更簡單的設定（例如使用單獨的 Gradle 專案）效果更好。有關如何遷移的詳細指導和範例，請參閱 Kotlin Multiplatform 相容性指南中的 [宣告多個相似目標](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#declaring-several-similar-targets)。

如果您在多平台專案中宣告了多個相同類型的目標，Kotlin 1.9.20 會觸發棄用警告。在 Kotlin 2.1.0 中，此棄用警告現在對於除 Kotlin/JS 目標以外的所有目標都已成為錯誤。要了解 Kotlin/JS 目標為何豁免的更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode) 中的此問題。

## Kotlin/Native

Kotlin 2.1.0 包括 [對 `iosArm64` 目標支援的升級](#iosarm64-promoted-to-tier-1)、[cinterop 中快取過程的改進](#changes-to-caching-in-cinterop) 以及其他更新。

### iosArm64 升級為 Tier 1

`iosArm64` 目標對於 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 開發至關重要，已升級為 Tier 1。這是 Kotlin/Native 編譯器中最高級別的支援。

這意味著該目標會在 CI 管道上定期測試，以確保它能夠編譯和運行。我們還為該目標提供了編譯器發布之間的原始碼和二進位檔相容性。

有關目標層級的更多資訊，請參閱 [Kotlin/Native 目標支援](native-target-support.md)。

### LLVM 從 11.1.0 更新到 16.0.0

在 Kotlin 2.1.0 中，我們將 LLVM 從 11.1.0 版更新到 16.0.0 版。新版本包括錯誤修復和安全更新。在某些情況下，它還提供了編譯器最佳化和更快的編譯。

如果您的專案中有 Linux 目標，請注意 Kotlin/Native 編譯器現在預設對所有 Linux 目標使用 `lld` 連結器。

此更新不應影響您的程式碼，但如果您遇到任何問題，請向我們的 [問題追蹤器](http://kotl.in/issue) 報告。

### cinterop 中快取機制的變更

在 Kotlin 2.1.0 中，我們正在更改 cinterop 的快取過程。它不再具有 [`CacheableTask`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/CacheableTask.html) 註解類型。新的推薦方法是使用 [`cacheIf`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.tasks/-task-outputs/cache-if.html) 輸出類型來快取任務的結果。

這應該可以解決 `UP-TO-DATE` 檢查未能偵測到 [定義檔案](native-definition-file.md) 中指定之標頭檔變更的問題，從而阻止建構系統重新編譯程式碼。

### 棄用 mimalloc 記憶體分配器

早在 Kotlin 1.9.0 中，我們就引入了新的記憶體分配器，然後在 Kotlin 1.9.20 中將其預設啟用。新的分配器旨在使垃圾收集更有效率，並提高 Kotlin/Native 記憶體管理器在執行時的效能。

新的記憶體分配器取代了以前的預設分配器 [mimalloc](https://github.com/microsoft/mimalloc)。現在，是時候在 Kotlin/Native 編譯器中棄用 mimalloc 了。

您現在可以從您的建構腳本中移除 `-Xallocator=mimalloc` 編譯器選項。如果您遇到任何問題，請向我們的 [問題追蹤器](http://kotl.in/issue) 報告。

有關 Kotlin 中記憶體分配器和垃圾收集的更多資訊，請參閱 [Kotlin/Native 記憶體管理](native-memory-manager.md)。

## Kotlin/Wasm

Kotlin/Wasm 收到多項更新，並 [支援增量編譯](#support-for-incremental-compilation)。

### 支援增量編譯

以前，當您在 Kotlin 程式碼中更改某些內容時，Kotlin/Wasm 工具鏈必須重新編譯整個程式碼庫。

從 2.1.0 開始，Wasm 目標支援增量編譯。在開發任務中，編譯器現在僅重新編譯與上次編譯以來的更改相關的檔案，這顯著減少了編譯時間。

此變更目前使編譯速度提高了一倍，並且計畫在未來版本中進一步改進。

在目前的設定中，Wasm 目標的增量編譯預設是禁用的。若要啟用增量編譯，請將以下行新增至您的專案的 `local.properties` 或 `gradle.properties` 檔案中：

```none
# gradle.properties
kotlin.incremental.wasm=true
```

試用 Kotlin/Wasm 增量編譯並 [分享您的回饋](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)。您的見解將有助於更快地使此功能穩定並預設啟用。

### 瀏覽器 API 已移至 kotlinx-browser 獨立程式庫

以前，Web API 和相關目標工具的宣告是 Kotlin/Wasm 標準程式庫的一部分。

在此版本中，`org.w3c.*` 宣告已從 Kotlin/Wasm 標準程式庫移至新的 [kotlinx-browser 程式庫](https://github.com/kotlin/kotlinx-browser)。此程式庫還包括其他與 Web 相關的套件，例如 `org.khronos.webgl`、`kotlin.dom` 和 `kotlinx.browser`。

這種分離提供了模組化，使得 Web 相關 API 可以在 Kotlin 的發布週期之外獨立更新。此外，Kotlin/Wasm 標準程式庫現在只包含任何 JavaScript 環境中可用的宣告。

若要使用來自已移動套件的宣告，您需要將 `kotlinx-browser` 依賴項添加到您的專案的建構配置檔案中：

```kotlin
// build.gradle.kts
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```

### 改進了 Kotlin/Wasm 的偵錯體驗

以前，在 Web 瀏覽器中偵錯 Kotlin/Wasm 程式碼時，您可能會在偵錯介面中遇到變數值的低階表示。這通常使得追蹤應用程式的當前狀態變得具有挑戰性。

![Kotlin/Wasm old debugger](wasm-old-debugger.png){width=700}

為了改善此體驗，已在變數視圖中新增了自訂格式化器。此實作使用了 [自訂格式化器 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)，此 API 支援 Firefox 和基於 Chromium 的主要瀏覽器。

透過這項變更，您現在可以以更使用者友好且易於理解的方式顯示和定位變數值。

![Kotlin/Wasm improved debugger](wasm-debugger-improved.png){width=700}

若要試用新的偵錯體驗：

1.  將以下編譯器選項新增至 `wasmJs {}` 編譯器選項中：

    ```kotlin
    // build.gradle.kts
    kotlin {
        wasmJs {
            // ...

            compilerOptions {
                freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
            }
        }
    }
    ```

2.  在您的瀏覽器中啟用自訂格式化器：

    *   在 Chrome 開發者工具中，透過 **Settings | Preferences | Console** (設定 | 偏好設定 | 控制台) 啟用：

        ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=700}

    *   在 Firefox 開發者工具中，透過 **Settings | Advanced settings** (設定 | 進階設定) 啟用：

        ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=700}

### 減少了 Kotlin/Wasm 二進位檔的大小

您的生產建構所產生的 Wasm 二進位檔大小將減少高達 30%，並且您可能會看到一些效能改進。這是因為 `--closed-world`、`--type-ssa` 和 `--type-merging` Binaryen 選項現在被認為對所有 Kotlin/Wasm 專案安全可用，並且預設啟用。

### 改進了 Kotlin/Wasm 中的 JavaScript 陣列互通性

儘管 Kotlin/Wasm 的標準程式庫提供了用於 JavaScript 陣列的 `JsArray<T>` 類型，但沒有直接的方法將 `JsArray<T>` 轉換為 Kotlin 的原生 `Array` 或 `List` 類型。

這種差距需要為陣列轉換創建自訂函數，使得 Kotlin 和 JavaScript 程式碼之間的互通性複雜化。

此版本引入了一個適配器函數，可自動將 `JsArray<T>` 轉換為 `Array<T>`，反之亦然，從而簡化了陣列操作。

以下是泛型類型轉換的範例：Kotlin `List<T>` 和 `Array<T>` 到 JavaScript `JsArray<T>`。

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

類似的方法也適用於將類型化陣列轉換為其 Kotlin 對等物（例如 `IntArray` 和 `Int32Array`）。有關詳細資訊和實作，請參閱 [`kotlinx-browser` 儲存庫](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)。

以下是類型化陣列轉換的範例：Kotlin `IntArray` 到 JavaScript `Int32Array`。

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)

    // Uses .toInt32Array() to convert Kotlin IntArray to JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()

    // Uses toIntArray() to convert JavaScript Int32Array back to Kotlin IntArray
    val kotlinIntArray: IntArray = jsInt32Array.toIntArray()
```

### 支援在 Kotlin/Wasm 中存取 JavaScript 異常細節

以前，當 Kotlin/Wasm 中發生 JavaScript 異常時，`JsException` 類型僅提供通用訊息，而沒有來自原始 JavaScript 錯誤的詳細資訊。

從 Kotlin 2.1.0 開始，您可以透過啟用特定的編譯器選項，將 `JsException` 配置為包含原始錯誤訊息和堆疊追蹤。這提供了更多上下文，有助於診斷源自 JavaScript 的問題。

此行為取決於 `WebAssembly.JSTag` API，該 API 僅在某些瀏覽器中可用：

*   **Chrome**：從版本 115 開始支援
*   **Firefox**：從版本 129 開始支援
*   **Safari**：尚未支援

若要啟用此功能（預設為禁用），請將以下編譯器選項新增至您的 `build.gradle.kts` 檔案中：

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

以下是一個展示新行為的範例：

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Message: ${e.message}")
        // Message: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Stacktrace:")
        // Stacktrace:

        // Prints the full JavaScript stack trace
        e.printStackTrace()
    }
}
```

啟用 `-Xwasm-attach-js-exception` 選項後，`JsException` 會提供來自 JavaScript 錯誤的特定詳細資訊。如果沒有此選項，`JsException` 僅包含一個通用訊息，表示在執行 JavaScript 程式碼時拋出了異常。

### 棄用預設匯出

作為遷移到命名匯出的一部分，以前在 JavaScript 中將預設匯入用於 Kotlin/Wasm 匯出時，會向控制台列印錯誤。

在 2.1.0 中，預設匯入已完全移除，以全面支援命名匯出。

在為 Kotlin/Wasm 目標編寫 JavaScript 程式碼時，您現在需要使用相應的命名匯入，而不是預設匯入。

此變更標誌著遷移到命名匯出的棄用週期的最後階段：

**在 2.0.0 版本中**：會向控制台列印警告訊息，解釋透過預設匯出實體已被棄用。

**在 2.0.20 版本中**：會發生錯誤，要求使用相應的命名匯入。

**在 2.1.0 版本中**：預設匯入的使用已完全移除。

### 子專案專用的 Node.js 設定

您可以透過為 `rootProject` 的 `NodeJsRootPlugin` 類別定義屬性來配置專案的 Node.js 設定。在 2.1.0 中，您可以使用新的 `NodeJsPlugin` 類別為每個子專案配置這些設定。以下是一個展示如何為子專案設定特定 Node.js 版本的範例：

```kotlin
// build.gradle.kts
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "22.0.0"
}
```

若要將新類別用於整個專案，請在 `allprojects {}` 區塊中添加相同的程式碼：

```kotlin
// build.gradle.kts
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

您還可以使用 Gradle 慣例外掛程式將設定應用於特定的一組子專案。

## Kotlin/JS

### 支援屬性中的非識別符號字元

Kotlin/JS 以前不允許在測試方法名稱中使用包含反引號 (backticks) 的空格。

同樣，也無法存取包含 Kotlin 識別符號中不允許之字元（例如連字號或空格）的 JavaScript 物件屬性：

```kotlin
external interface Headers {
    var accept: String?

    // Invalid Kotlin identifier due to hyphen
    var `content-length`: String?
}

val headers: Headers = TODO("value provided by a JS library")
val accept = headers.accept
// Causes error due to the hyphen in property name
val length = headers.`content-length`
```

此行為與 JavaScript 和 TypeScript 不同，後者允許使用非識別符號字元存取此類屬性。

從 Kotlin 2.1.0 開始，此功能預設啟用。Kotlin/JS 現在允許您使用反引號 (``) 和 `@JsName` 註解來與包含非識別符號字元的 JavaScript 屬性互動，並使用測試方法名稱。

此外，您可以使用 `@JsName` 和 `@JsQualifier` 註解將 Kotlin 屬性名稱映射到 JavaScript 對等名稱：

```kotlin
object Bar {
    val `property example`: String = "bar"
}

@JsQualifier("fooNamespace")
external object Foo {
    val `property example`: String
}

@JsExport
object Baz {
    val `property example`: String = "bar"
}

fun main() {
    // In JavaScript, this is compiled into Bar.property_example_HASH
    println(Bar.`property example`)
    // In JavaScript, this is compiled into fooNamespace["property example"]
    println(Foo.`property example`)
    // In JavaScript, this is compiled into Baz["property example"]
    println(Baz.`property example`)
}
```

### 支援生成 ES2015 箭頭函數

在 Kotlin 2.1.0 中，Kotlin/JS 引入了對生成 ES2015 箭頭函數（例如 `(a, b) => expression`）而非匿名函數的支援。

使用箭頭函數可以減少您專案的打包大小，尤其是在使用實驗性的 `-Xir-generate-inline-anonymous-functions` 模式時。這也使得生成的程式碼更符合現代 JS 規範。

當目標為 ES2015 時，此功能預設啟用。或者，您可以使用 `-Xes-arrow-functions` 命令列參數啟用它。

透過 [官方文件](https://262.ecma-international.org/6.0/) 了解更多有關 ES2015 (ECMAScript 2015, ES6) 的資訊。

## Gradle 改進

Kotlin 2.1.0 完全相容於 Gradle 7.6.3 到 8.6。Gradle 8.7 到 8.10 版也受到支援，僅有一個例外。如果您使用 Kotlin Multiplatform Gradle 外掛程式，您在呼叫 JVM 目標中的 `withJava()` 函數的多平台專案中可能會看到棄用警告。我們計畫盡快修復此問題。

有關更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542) 中的相關問題。

您還可以使用最新發布的 Gradle 版本，但請記住，您可能會遇到棄用警告或某些新的 Gradle 功能可能無法正常工作。

### 最低支援的 AGP 版本提升至 7.3.1

從 Kotlin 2.1.0 開始，最低支援的 Android Gradle 外掛程式版本為 7.3.1。

### 最低支援的 Gradle 版本提升至 7.6.3

從 Kotlin 2.1.0 開始，最低支援的 Gradle 版本為 7.6.3。

### Kotlin Gradle 外掛程式擴充的新 API

Kotlin 2.1.0 引入了一個新的 API，使您更容易為配置 Kotlin Gradle 外掛程式創建自己的外掛程式。此更改棄用了 `KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 介面，並為外掛程式作者引入了以下介面：

| 名稱                     | 描述                                                                                                                                                                                                                                                          |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `KotlinBaseExtension`    | 一個外掛程式 DSL 擴充類型，用於設定整個專案的常用 Kotlin JVM、Android 和 Multiplatform 外掛程式選項：<list><li>`org.jetbrains.kotlin.jvm`</li><li>`org.jetbrains.kotlin.android`</li><li>`org.jetbrains.kotlin.multiplatform`</li></list> |
| `KotlinJvmExtension`     | 一個外掛程式 DSL 擴充類型，用於設定整個專案的 Kotlin **JVM** 外掛程式選項。                                                                                                                                                                    |
| `KotlinAndroidExtension` | 一個外掛程式 DSL 擴充類型，用於設定整個專案的 Kotlin **Android** 外掛程式選項。                                                                                                                                                                |

例如，如果您想為 JVM 和 Android 專案配置編譯器選項，請使用 `KotlinBaseExtension`：

```kotlin
configure<KotlinBaseExtension> {
    if (this is HasConfigurableKotlinCompilerOptions<*>) {
        with(compilerOptions) {
            if (this is KotlinJvmCompilerOptions) {
                jvmTarget.set(JvmTarget.JVM_17)
            }
        }
    }
}
```

這會將 JVM 和 Android 專案的 JVM 目標設定為 17。

若要專門為 JVM 專案設定編譯器選項，請使用 `KotlinJvmExtension`：

```kotlin
configure<KotlinJvmExtension> {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }

    target.mavenPublication {
        groupId = "com.example"
        artifactId = "example-project"
        version = "1.0-SNAPSHOT"
    }
}
```

此範例同樣將 JVM 專案的 JVM 目標設定為 17。它還為專案配置了 Maven 發布，以便其輸出發布到 Maven 儲存庫。

您可以完全以相同的方式使用 `KotlinAndroidExtension`。

### 編譯器符號從 Kotlin Gradle 外掛程式 API 中隱藏

以前，KGP 在其執行時依賴項中包含了 `org.jetbrains.kotlin:kotlin-compiler-embeddable`，這使得內部編譯器符號在建構腳本類別路徑中可用。這些符號僅供內部使用。

從 Kotlin 2.1.0 開始，KGP 將 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 類別檔案的子集捆綁到其 JAR 檔案中，並逐步移除它們。此變更旨在防止相容性問題並簡化 KGP 維護。

如果您建構邏輯的其他部分（例如 `kotlinter` 等外掛程式）依賴於與 KGP 捆綁的版本不同的 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 版本，則可能導致衝突和執行時異常。

為防止此類問題，如果 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 與 KGP 同時存在於建構類別路徑中，KGP 現在會顯示警告。

作為長期解決方案，如果您是使用 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 類別的外掛程式作者，我們建議在隔離的類別載入器中執行它們。例如，您可以使用 [Gradle Workers API](https://docs.gradle.org/current/userguide/worker_api.html) 透過類別載入器或進程隔離來實現。

#### 使用 Gradle Workers API

此範例展示了如何在產生 Gradle 外掛程式的專案中安全地使用 Kotlin 編譯器。首先，在您的建構腳本中新增一個僅編譯依賴項。這使得該符號僅在編譯時可用：

```kotlin
// build.gradle.kts
dependencies {
    compileOnly("org.jetbrains.kotlin:kotlin-compiler-embeddable:%kotlinVersion%")
}
```

接著，定義一個 Gradle 工作動作以列印 Kotlin 編譯器版本：

```kotlin
import org.gradle.workers.WorkAction
import org.gradle.workers.WorkParameters
import org.jetbrains.kotlin.config.KotlinCompilerVersion
abstract class ActionUsingKotlinCompiler : WorkAction<WorkParameters.None> {
    override fun execute() {
        println("Kotlin compiler version: ${KotlinCompilerVersion.getVersion()}")
    }
}
```

現在，建立一個任務，使用類別載入器隔離將此動作提交給工作執行器：

```kotlin
import org.gradle.api.DefaultTask
import org.gradle.api.file.ConfigurableFileCollection
import org.gradle.api.tasks.Classpath
import org.gradle.api.tasks.TaskAction
import org.gradle.workers.WorkerExecutor
import javax.inject.Inject
abstract class TaskUsingKotlinCompiler: DefaultTask() {
    @get:Inject
    abstract val executor: WorkerExecutor

    @get:Classpath
    abstract val kotlinCompiler: ConfigurableFileCollection

    @TaskAction
    fun compile() {
        val workQueue = executor.classLoaderIsolation {
            classpath.from(kotlinCompiler)
        }
        workQueue.submit(ActionUsingKotlinCompiler::class.java) {}
    }
}
```

最後，在您的 Gradle 外掛程式中配置 Kotlin 編譯器類別路徑：

```kotlin
import org.gradle.api.Plugin
import org.gradle.api.Project
abstract class MyPlugin: Plugin<Project> {
    override fun apply(target: Project) {
        val myDependencyScope = target.configurations.create("myDependencyScope")
        target.dependencies.add(myDependencyScope.name, "$KOTLIN_COMPILER_EMBEDDABLE:$KOTLIN_COMPILER_VERSION")
        val myResolvableConfiguration = target.configurations.create("myResolvable") {
            extendsFrom(myDependencyScope)
        }
        target.tasks.register("myTask", TaskUsingKotlinCompiler::class.java) {
            kotlinCompiler.from(myResolvableConfiguration)
        }
    }

    companion object {
        const val KOTLIN_COMPILER_EMBEDDABLE = "org.jetbrains.kotlin:kotlin-compiler-embeddable"
        const val KOTLIN_COMPILER_VERSION = "%kotlinVersion%"
    }
}
```

## Compose 編譯器更新

### 支援多個穩定性配置文件

Compose 編譯器可以解釋多個穩定性配置文件，但 Compose 編譯器 Gradle 外掛程式的 `stabilityConfigurationFile` 選項以前只允許指定一個檔案。在 Kotlin 2.1.0 中，此功能經過重新設計，允許您為單個模組使用多個穩定性配置文件：

*   `stabilityConfigurationFile` 選項已棄用。
*   新增選項 `stabilityConfigurationFiles`，類型為 `ListProperty<RegularFile>`。

以下是使用新選項向 Compose 編譯器傳遞多個檔案的方法：

```kotlin
// build.gradle.kt
composeCompiler {
    stabilityConfigurationFiles.addAll(
        project.layout.projectDirectory.file("configuration-file1.conf"),
        project.layout.projectDirectory.file("configuration-file2.conf"),
    )
}
```

### 可暫停組合

可暫停組合 (Pausable composition) 是一個新的實驗性功能，它改變了編譯器生成可跳過函數的方式。啟用此功能後，組合可以在運行時的跳過點暫停，從而允許長時間運行的組合過程分佈在多個幀中。可暫停組合用於惰性列表和其他效能密集型組件，用於預先擷取可能導致在阻塞模式下執行時畫面丟失的內容。

若要試用可暫停組合，請在 Compose 編譯器的 Gradle 配置中添加以下功能標誌：

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.PausableComposition
    )
}
```

> 此功能的運行時支援已在 `androidx.compose.runtime` 的 1.8.0-alpha02 版本中添加。
> 當與舊版本運行時一起使用時，此功能標誌沒有作用。
>
{style="note"}

### 開放和覆寫的 @Composable 函數的變更

虛擬 (open、abstract 和 overridden) `@Composable` 函數不再可重新啟動。可重新啟動組的程式碼生成會生成與繼承 [無法正常工作](https://issuetracker.google.com/329477544) 的呼叫，導致執行時崩潰。

這意味著虛擬函數不會被重新啟動或跳過：每當其狀態失效時，運行時將轉而重新組合其父組合項。如果您的程式碼對重新組合敏感，您可能會注意到運行時行為的變化。

### 效能改進

Compose 編譯器過去會建立模組 IR 的完整副本以轉換 `@Composable` 類型。除了在複製與 Compose 無關的元素時增加記憶體消耗外，此行為還在 [某些邊緣情況](https://issuetracker.google.com/365066530) 下破壞了下游編譯器外掛程式。

此複製操作已移除，可能導致更快的編譯時間。

## 標準程式庫

### 標準程式庫 API 棄用嚴重性的變更

在 Kotlin 2.1.0 中，我們將多個標準程式庫 API 的棄用嚴重性從警告提升為錯誤。如果您的程式碼依賴這些 API，您需要更新它以確保相容性。最值得注意的變更包括：

*   **Char 和 String 的區域設定敏感大小寫轉換函數已棄用**：
    諸如 `Char.toLowerCase()`、`Char.toUpperCase()`、`String.toUpperCase()` 和 `String.toLowerCase()` 等函數現在已棄用，使用它們會導致錯誤。請將它們替換為區域設定無關的函數替代品或其他大小寫轉換機制。如果您想繼續使用預設區域設定，請將 `String.toLowerCase()` 之類的呼叫替換為 `String.lowercase(Locale.getDefault())`，明確指定區域設定。對於區域設定無關的轉換，請將它們替換為 `String.lowercase()`，該函數預設使用不變區域設定。

*   **Kotlin/Native 凍結 API 已棄用**：
    以前標記為 `@FreezingIsDeprecated` 註解的凍結相關宣告現在使用會導致錯誤。此變更反映了從 Kotlin/Native 中的舊版記憶體管理器轉換，該管理器需要凍結物件才能在執行緒之間共享。要了解如何在新的記憶體模型中從凍結相關 API 遷移，請參閱 [Kotlin/Native 遷移指南](native-migration-guide.md#update-your-code)。有關更多資訊，請參閱 [關於凍結棄用的公告](whatsnew1720.md#freezing)。

*   **`appendln()` 已棄用，改用 `appendLine()`**：
    `StringBuilder.appendln()` 和 `Appendable.appendln()` 函數現在已棄用，使用它們會導致錯誤。要替換它們，請改用 `StringBuilder.appendLine()` 或 `Appendable.appendLine()` 函數。`appendln()` 函數已棄用，因為在 Kotlin/JVM 上，它使用 `line.separator` 系統屬性，該屬性在每個作業系統上都有不同的預設值。在 Kotlin/JVM 上，此屬性在 Windows 上預設為 `\r
` (CR LF)，在其他系統上預設為 `
` (LF)。另一方面，`appendLine()` 函數始終使用 `
` (LF) 作為行分隔符，確保跨平台的行為一致性。

有關此版本中受影響 API 的完整列表，請參閱 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628) YouTrack 問題。

### java.nio.file.Path 的穩定檔案樹遍歷擴充

Kotlin 1.7.20 引入了 `java.nio.file.Path` 類別的實驗性 [擴充函數](extensions.md#extension-functions)，允許您遍歷檔案樹。在 Kotlin 2.1.0 中，以下檔案樹遍歷擴充功能現在已 [穩定](components-stability.md#stability-levels-explained)：

*   `walk()` 惰性地遍歷以指定路徑為根的檔案樹。
*   `fileVisitor()` 使建立 `FileVisitor` 成為可能。`FileVisitor` 指定了在遍歷期間對目錄和檔案執行的動作。
*   `visitFileTree(fileVisitor: FileVisitor, ...)` 遍歷檔案樹，在每個遇到的條目上呼叫指定的 `FileVisitor`，它在底層使用 `java.nio.file.Files.walkFileTree()` 函數。
*   `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)` 使用提供的 `builderAction` 建立 `FileVisitor` 並呼叫 `visitFileTree(fileVisitor, ...)` 函數。
*   `sealed interface FileVisitorBuilder` 允許您定義自訂的 `FileVisitor` 實作。
*   `enum class PathWalkOption` 為 `Path.walk()` 函數提供了遍歷選項。

以下範例展示了如何使用這些檔案遍歷 API 來建立自訂的 `FileVisitor` 行為，這允許您定義訪問檔案和目錄的特定動作。

例如，您可以明確地創建一個 `FileVisitor` 並稍後使用它：

```kotlin
val cleanVisitor = fileVisitor {
    onPreVisitDirectory { directory, attributes ->
        // Placeholder: Add logic on visiting directories
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // Placeholder: Add logic on visiting files
        FileVisitResult.CONTINUE
    }
}

// Placeholder: Add logic here for general setup before traversal
projectDirectory.visitFileTree(cleanVisitor)
```

您也可以使用 `builderAction` 建立一個 `FileVisitor` 並立即用於遍歷：

```kotlin
projectDirectory.visitFileTree {
    // Defines the builderAction:
    onPreVisitDirectory { directory, attributes ->
        // Some logic on visiting directories
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // Some logic on visiting files
        FileVisitResult.CONTINUE
    }
}
```

此外，您可以使用 `walk()` 函數遍歷以指定路徑為根的檔案樹：

```kotlin
fun traverseFileTree() {
    val cleanVisitor = fileVisitor {
        onPreVisitDirectory { directory, _ ->
            if (directory.name == "build") {
                directory.toFile().deleteRecursively()
                FileVisitResult.SKIP_SUBTREE
            } else {
                FileVisitResult.CONTINUE
            }
        }

        // Deletes files with the .class extension
        onVisitFile { file, _ ->
            if (file.extension == "class") {
                file.deleteExisting()
            }
            FileVisitResult.CONTINUE
        }
    }

    // Sets up the root directory and files
    val rootDirectory = createTempDirectory("Project")

    // Creates the src directory with A.kt and A.class files
    rootDirectory.resolve("src").let { srcDirectory ->
        srcDirectory.createDirectory()
        srcDirectory.resolve("A.kt").createFile()
        srcDirectory.resolve("A.class").createFile()
    }

    // Creates the build directory with a Project.jar file
    rootDirectory.resolve("build").let { buildDirectory ->
        buildDirectory.createDirectory()
        buildDirectory.resolve("Project.jar").createFile()
    }

    // Uses the walk() function:
    val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructure)
    // "[, build, build/Project.jar, src, src/A.class, src/A.kt]"

    // Traverses the file tree with cleanVisitor, applying the rootDirectory.visitFileTree(cleanVisitor) cleanup rules
    val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructureAfterClean)
    // "[, src, src/A.kt]"
}
```

## 文件更新

Kotlin 文件收到了一些顯著的變更：

### 語言概念

*   改進的 [空值安全](null-safety.md) 頁面 – 了解如何在程式碼中安全地處理 `null` 值。
*   改進的 [物件宣告與表達式](object-declarations.md) 頁面 –
    了解如何定義類別並在一個步驟中建立實例。
*   改進的 [when 表達式與語句](control-flow.md#when-expressions-and-statements) 部分 –
    了解 `when` 條件以及如何使用它。
*   更新的 [Kotlin 路線圖](roadmap.md)、[Kotlin 演進原則](kotlin-evolution-principles.md) 和 [Kotlin 語言功能與提案](kotlin-language-features-and-proposals.md) 頁面 –
    了解 Kotlin 的計畫、持續發展和指導原則。

### Compose 編譯器

*   [Compose 編譯器文件](compose-compiler-migration-guide.md) 現已位於「編譯器與外掛程式」部分 –
    了解 Compose 編譯器、編譯器選項以及遷移步驟。

### API 參考

*   新的 [Kotlin Gradle 外掛程式 API 參考](https://kotlinlang.org/api/kotlin-gradle-plugin) –
    探索 Kotlin Gradle 外掛程式和 Compose 編譯器 Gradle 外掛程式的 API 參考。

### 多平台開發

*   新的 [為多平台建構 Kotlin 程式庫](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html) 頁面 –
    了解如何為 Kotlin Multiplatform 設計您的 Kotlin 程式庫。
*   新的 [Kotlin Multiplatform 簡介](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 頁面 – 了解 Kotlin Multiplatform 的關鍵概念、依賴項、程式庫等等。
*   更新的 [Kotlin Multiplatform 概覽](multiplatform.topic) 頁面 – 瀏覽 Kotlin Multiplatform 的要點和常見用例。
*   新的 [iOS 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-integration-overview.html) 部分 – 了解如何將 Kotlin Multiplatform 共享模組整合到您的 iOS 應用程式中。
*   新的 [Kotlin/Native 定義檔案](native-definition-file.md) 頁面 – 了解如何建立定義檔案以使用 C 和 Objective-C 程式庫。
*   [開始使用 WASI](wasm-wasi.md) –
    了解如何使用 WASI 在各種 WebAssembly 虛擬機中運行簡單的 Kotlin/Wasm 應用程式。

### 工具

*   [新的 Dokka 遷移指南](dokka-migration.md) – 了解如何遷移到 Dokka Gradle 外掛程式 v2。

## Kotlin 2.1.0 相容性指南

Kotlin 2.1.0 是一個功能發布版本，因此可能會帶來與您為早期版本的語言編寫的程式碼不相容的變更。這些變更的詳細列表請參閱 [Kotlin 2.1.0 相容性指南](compatibility-guide-21.md)。

## 安裝 Kotlin 2.1.0

從 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式作為捆綁外掛程式隨您的 IDE 一起分發。這意味著您不能再從 JetBrains Marketplace 安裝該外掛程式。

若要更新到新的 Kotlin 版本，請在您的建構腳本中將 [Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 變更為 2.1.0。