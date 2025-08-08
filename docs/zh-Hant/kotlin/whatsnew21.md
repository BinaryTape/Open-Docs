[//]: # (title: Kotlin 2.1.0 的新功能)

_[發佈日期：2024 年 11 月 27 日](releases.md#release-details)_

Kotlin 2.1.0 版本現已推出！以下是主要亮點：

* **預覽版中新的語言功能**：[`when` 條件式中帶有主體的防護條件](#guard-conditions-in-when-with-a-subject)、
  [非局部 `break` 和 `continue`](#non-local-break-and-continue)，以及 [多美元符號字串插值](#multi-dollar-string-interpolation)。
* **K2 編譯器更新**：[編譯器檢查的更大彈性](#extra-compiler-checks) 和 [kapt 實作的改進](#improved-k2-kapt-implementation)。
* **Kotlin 多平台**：引入了 [對 Swift 匯出的基本支援](#basic-support-for-swift-export)、
  [編譯器選項的穩定 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable) 等。
* **Kotlin/Native**：[`iosArm64` 支援度提升](#iosarm64-promoted-to-tier-1) 和其他更新。
* **Kotlin/Wasm**：多項更新，包括 [支援增量編譯](#support-for-incremental-compilation)。
* **Gradle 支援**：[與較新版本 Gradle 及 Android Gradle 外掛程式的相容性提升](#gradle-improvements)，
  以及 [Kotlin Gradle 外掛程式 API 的更新](#new-api-for-kotlin-gradle-plugin-extensions)。
* **文件**：[Kotlin 文件有顯著改進](#documentation-updates)。

## IDE 支援

支援 2.1.0 的 Kotlin 外掛程式已捆綁在最新版 IntelliJ IDEA 和 Android Studio 中。
您不需要更新 IDE 中的 Kotlin 外掛程式。
您所需要做的就是將建置腳本中的 Kotlin 版本更改為 2.1.0。

有關詳細資訊，請參閱 [更新至新的 Kotlin 版本](releases.md#update-to-a-new-kotlin-version)。

## 語言

在 K2 編譯器隨 Kotlin 2.0.0 發佈後，JetBrains 團隊正專注於透過新功能改進語言。
在此版本中，我們很高興宣布數項新的語言設計改進。

這些功能已提供預覽，我們鼓勵您嘗試並分享您的回饋：

* [`when` 條件式中帶有主體的防護條件](#guard-conditions-in-when-with-a-subject)
* [非局部 `break` 和 `continue`](#non-local-break-and-continue)
* [多美元符號插值 (Multi-dollar Interpolation)：改進字串字面值中 `$` 的處理方式](#multi-dollar-string-interpolation)

> 所有功能在啟用 K2 模式的最新版 IntelliJ IDEA 2024.3 中均有 IDE 支援。
>
> 在 [IntelliJ IDEA 2024.3 部落格文章](https://blog.jetbrains.com/idea/2024/11/intellij-idea-2024-3/) 中了解更多資訊。
>
{style="tip"}

[查看 Kotlin 語言設計功能和提案的完整列表](kotlin-language-features-and-proposals.md)。

此版本也帶來了以下語言更新：

* [](#support-for-requiring-opt-in-to-extend-apis)
* [](#improved-overload-resolution-for-functions-with-generic-types)
* [](#improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes)

### `when` 條件式中帶有主體的防護條件

> 此功能處於 [預覽](kotlin-evolution-principles.md#pre-stable-features) 階段，需要選擇啟用 (詳情請見下文)。
>
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140) 中提供回饋。
>
{style="warning"}

從 2.1.0 開始，您可以在帶有主體的 `when` 條件式或陳述式中使用防護條件 (guard conditions)。

防護條件允許您為 `when` 條件式的分支包含多個條件，使複雜的控制流更為明確和簡潔，並簡化程式碼結構。

要在分支中包含防護條件，請將其放置在主要條件之後，並以 `if` 分隔：

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
        // 僅包含主要條件的分支。當 `animal` 為 `Dog` 時呼叫 `feedDog()`。
        is Animal.Dog -> animal.feedDog()
        // 包含主要條件和防護條件的分支。當 `animal` 為 `Cat` 且非 `mouseHunter` 時呼叫 `feedCat()`。
        is Animal.Cat if !animal.mouseHunter -> animal.feedCat()
        // 若上述條件均不符合，則印出 "Unknown animal"。
        else -> println("Unknown animal")
    }
}
```

在單個 `when` 條件式中，您可以組合帶有和不帶防護條件的分支。
帶有防護條件的分支中的程式碼僅在主要條件和防護條件均為 `true` 時執行。
如果主要條件不匹配，則不會評估防護條件。
此外，防護條件也支援 `else if`。

若要在專案中啟用防護條件，請在命令列中使用以下編譯器選項：

```bash
kotlinc -Xwhen-guards main.kt
```

或將其添加到 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-guards")
    }
}
```

### 非局部 break 和 continue

> 此功能處於 [預覽](kotlin-evolution-principles.md#pre-stable-features) 階段，需要選擇啟用 (詳情請見下文)。
>
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436) 中提供回饋。
>
{style="warning"}

Kotlin 2.1.0 新增了另一項期待已久的功能預覽：使用非局部 (non-local) `break` 和 `continue` 的能力。
此功能擴展了您在內聯函數範圍內可以使用的工具集，並減少了專案中的重複程式碼。

以前，您只能使用非局部返回 (non-local returns)。
現在，Kotlin 也支援非局部 (non-locally) 的 `break` 和 `continue` [跳轉表達式](returns.md)。
這意味著您可以在作為引數傳遞給包含迴圈的內聯函數的 lambda 表達式中使用它們：

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
            continue
        }
        if (variable == 0) return true // 如果變數為零，返回 true
    }
    return false
}
```

若要在您的專案中嘗試此功能，請在命令列中使用 `-Xnon-local-break-continue` 編譯器選項：

```bash
kotlinc -Xnon-local-break-continue main.kt
```

或將其添加到 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnon-local-break-continue")
    }
}
```

我們計劃在未來的 Kotlin 版本中使此功能穩定 (Stable)。
如果您在使用非局部 `break` 和 `continue` 時遇到任何問題，請向我們的 [問題追蹤器](https://youtrack.jetbrains.com/issue/KT-1436) 回報。

### 多美元符號字串插值

> 此功能處於 [預覽](kotlin-evolution-principles.md#pre-stable-features) 階段，需要選擇啟用 (詳情請見下文)。
>
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425) 中提供回饋。
>
{style="warning"}

Kotlin 2.1.0 引入了多美元符號字串插值 (multi-dollar string interpolation) 的支援，改進了字串字面值中美元符號 (`$`) 的處理方式。
此功能在需要多個美元符號的環境中非常有用，例如模板引擎、JSON 綱要或其它資料格式。

Kotlin 中的字串插值使用單個美元符號。
然而，在字串中使用字面值美元符號 (這在財務資料和模板系統中很常見) 需要變通方法，例如 `${'$'}`。
啟用多美元符號插值功能後，您可以設定多少個美元符號會觸發插值，而較少數量的美元符號則被視為字串字面值。

以下是如何使用 `:` 產生帶有預留位置的 JSON 綱要多行字串的範例：

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

在此範例中，開頭的 `$` 意味著您需要 **兩個美元符號** (`$$`) 來觸發插值。
這可以防止 `$schema`、`$id` 和 `$dynamicAnchor` 被解釋為插值標記。

這種方法在處理使用美元符號作為預留位置語法的系統時特別有用。

若要啟用此功能，請在命令列中使用以下編譯器選項：

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

或者，更新 Gradle 建置檔案的 `compilerOptions {}` 區塊：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

如果您的程式碼已經使用單個美元符號的標準字串插值，則無需更改。
當您需要在字串中使用字面值美元符號時，可以使用 `$`。

### 支援要求選擇啟用以擴展 API

Kotlin 2.1.0 引入了 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 註解，它允許函式庫作者在使用者實作實驗性介面或擴展實驗性類別之前，要求明確的選擇啟用 (opt-in)。

當函式庫 API 穩定到足以使用，但可能會隨著新的抽象函數而演進，導致繼承不穩定時，此功能會很有用。

若要為 API 元素新增選擇啟用要求，請使用 `@SubclassOptInRequired` 註解並引用註解類別：

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

在此範例中，`CoreLibraryApi` 介面要求使用者在實作之前選擇啟用。
使用者可以這樣選擇啟用：

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

> 當您使用 `@SubclassOptInRequired` 註解來要求選擇啟用時，此要求不會傳播到任何 [內部或巢狀類別](nested-classes.md)。
>
{style="note"}

有關如何在 API 中使用 `@SubclassOptInRequired` 註解的實際範例，請查看 `kotlinx.coroutines` 函式庫中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 介面。

### 泛型類型函數的重載解析改進

以前，如果您有多個函數重載，其中一些具有泛型類型的值參數，而另一些在相同位置具有函數類型，則解析行為有時可能不一致。

這導致了不同的行為，具體取決於您的重載是成員函數還是擴展函數。
例如：

```kotlin
class KeyValueStore<K, V> {
    fun store(key: K, value: V) {} // 1
    fun store(key: K, lazyValue: () -> V) {} // 2
}

fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, value: V) {} // 1
fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, lazyValue: () -> V) {} // 2

fun test(kvs: KeyValueStore<String, Int>) {
    // 成員函數
    kvs.store("", 1)    // 解析為 1
    kvs.store("") { 1 } // 解析為 2

    // 擴展函數
    kvs.storeExtension("", 1)    // 解析為 1
    kvs.storeExtension("") { 1 } // 無法解析
}
```

在此範例中，`KeyValueStore` 類別有兩個 `store()` 函數的重載，其中一個重載具有泛型類型 `K` 和 `V` 的函數參數，另一個則具有返回泛型類型 `V` 的 lambda 函數。
同樣，擴展函數 `storeExtension()` 也有兩個重載。

當 `store()` 函數在帶有或不帶 lambda 函數的情況下被呼叫時，編譯器成功解析了正確的重載。
然而，當擴展函數 `storeExtension()` 在帶有 lambda 函數的情況下被呼叫時，編譯器未能解析出正確的重載，因為它錯誤地認為兩個重載都適用。

為了解決這個問題，我們引入了一種新的啟發式方法，以便當一個具有泛型類型的函數參數無法根據不同引數的資訊接受 lambda 函數時，編譯器可以捨棄一個可能的重載。
此變更使成員函數和擴展函數的行為保持一致，並且在 Kotlin 2.1.0 中預設啟用。

### `when` 條件式中密封類別的窮盡性檢查改進

在先前版本的 Kotlin 中，即使 `sealed class` 階層中的所有情況都已涵蓋，編譯器仍要求 `when` 條件式中類型參數的密封上限 (sealed upper bounds) 必須有 `else` 分支。
Kotlin 2.1.0 解決並改進了這種行為，使窮盡性檢查 (exhaustiveness checks) 更強大，並允許您移除多餘的 `else` 分支，讓 `when` 條件式更簡潔、更直觀。

以下是演示此變更的範例：

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error -> "Error!"
    is Success -> result.value
    // 不再需要 else 分支
}
```

## Kotlin K2 編譯器

隨著 Kotlin 2.1.0 的推出，K2 編譯器現在在處理 [編譯器檢查](#extra-compiler-checks) 和 [警告](#global-warning-suppression) 時提供了更大的彈性，並 [改進了對 kapt 外掛程式的支援](#improved-k2-kapt-implementation)。

### 額外編譯器檢查

使用 Kotlin 2.1.0，您現在可以在 K2 編譯器中啟用額外檢查。
這些是額外的宣告、表達式和類型檢查，通常對編譯不關鍵，但如果您想要驗證以下情況，它們仍然很有用：

| 檢查類型                                              | 註解                                                                                   |
|:----------------------------------------------------|:---------------------------------------------------------------------------------------|
| `REDUNDANT_NULLABLE`                                | 使用 `Boolean??` 而非 `Boolean?`                                                       |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN`                   | 使用 `java.lang.String` 而非 `kotlin.String`                                           |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS`| 使用 `arrayOf("") == arrayOf("")` 而非 `arrayOf("").contentEquals(arrayOf(""))`         |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD`               | 使用 `42.toInt()` 而非 `42`                                                            |
| `USELESS_CALL_ON_NOT_NULL`                          | 使用 `"".orEmpty()` 而非 `""`                                                          |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE`       | 使用 `"$string"` 而非 `string`                                                         |
| `UNUSED_ANONYMOUS_PARAMETER`                        | 在 lambda 表達式中傳遞了參數但從未使用過                                                      |
| `REDUNDANT_VISIBILITY_MODIFIER`                     | 使用 `public class Klass` 而非 `class Klass`                                           |
| `REDUNDANT_MODALITY_MODIFIER`                       | 使用 `final class Klass` 而非 `class Klass`                                            |
| `REDUNDANT_SETTER_PARAMETER_TYPE`                   | 使用 `set(value: Int)` 而非 `set(value)`                                               |
| `CAN_BE_VAL`                                        | 定義了 `var local = 0` 但從未重新賦值，可改為 `val local = 42`                               |
| `ASSIGNED_VALUE_IS_NEVER_READ`                      | 定義了 `val local = 42` 但之後在程式碼中從未使用過                                            |
| `UNUSED_VARIABLE`                                   | 定義了 `val local = 0` 但從未在程式碼中使用過                                            |
| `REDUNDANT_RETURN_UNIT_TYPE`                        | 使用 `fun foo(): Unit {}` 而非 `fun foo() {}`                                          |
| `UNREACHABLE_CODE`                                  | 程式碼陳述式存在但永遠無法執行                                                                  |

如果檢查結果為真，您將收到一個編譯器警告，其中包含如何解決問題的建議。

額外檢查預設為禁用。
若要啟用它們，請在命令列中使用 `-Wextra` 編譯器選項，或在 Gradle 建置檔案的 `compilerOptions {}` 區塊中指定 `extraWarnings`：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

有關如何定義和使用編譯器選項的更多資訊，請參閱 [Kotlin Gradle 外掛程式中的編譯器選項](gradle-compiler-options.md)。

### 全局警告抑制

在 2.1.0 中，Kotlin 編譯器收到了一項廣受要求的功能 – 全局抑制警告的能力。

您現在可以透過在命令列中使用 `-Xsuppress-warning=WARNING_NAME` 語法，或在建置檔案的 `compilerOptions {}` 區塊中使用 `freeCompilerArgs` 屬性，來抑制整個專案中的特定警告。

例如，如果您的專案中啟用了 [額外編譯器檢查](#extra-compiler-checks) 但想要抑制其中一項，請使用：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

如果您想抑制某個警告但不知道其名稱，請選擇該元素並點擊燈泡圖示 (或使用 <shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut>)：

![Warning name intention](warning-name-intention.png){width=500}

這個新的編譯器選項目前處於 [實驗階段](components-stability.md#stability-levels-explained)。
以下細節也值得注意：

* 不允許抑制錯誤。
* 如果您傳遞了未知的警告名稱，編譯將會導致錯誤。
* 您可以一次指定多個警告：
  
   <tabs>
   <tab title="命令列">

   ```bash
   kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
   ```

   </tab>
   <tab title="建置檔案">

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

> K2 編譯器的 kapt 外掛程式 (K2 kapt) 處於 [Alpha](components-stability.md#stability-levels-explained) 階段。
> 它可能隨時變更。
>
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) 中提供回饋。
>
{style="warning"}

目前，使用 [kapt](kapt.md) 外掛程式的專案預設與 K1 編譯器配合使用，支援 Kotlin 版本最高至 1.9。

在 Kotlin 1.9.20 中，我們推出了 K2 編譯器的 kapt 外掛程式 (K2 kapt) 的實驗性實作。
我們現在已改進 K2 kapt 的內部實作，以減輕技術和效能問題。

雖然新的 K2 kapt 實作沒有引入新功能，但其效能相比之前的 K2 kapt 實作已顯著提升。
此外，K2 kapt 外掛程式的行為現在與 K1 kapt 更為接近。

若要使用新的 K2 kapt 外掛程式實作，請像啟用之前的 K2 kapt 外掛程式一樣啟用它。
將以下選項添加到專案的 `gradle.properties` 檔案中：

```kotlin
kapt.use.k2=true
```

在即將發布的版本中，K2 kapt 實作將預設啟用，取代 K1 kapt，因此您將不再需要手動啟用它。

在新實作穩定之前，我們非常感謝您的 [回饋](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

### 無符號類型與非基本類型之間重載衝突的解析

此版本解決了在先前版本中當函數為無符號 (unsigned) 和非基本類型 (non-primitive types) 重載時可能發生的重載衝突解析問題，如下列範例所示：

#### 重載的擴展函數

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // 在 Kotlin 2.1.0 之前存在重載解析歧義
}
```

在早期版本中，呼叫 `uByte.doStuff()` 導致歧義，因為 `Any` 和 `UByte` 擴展都適用。

#### 重載的頂層函數

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // 在 Kotlin 2.1.0 之前存在重載解析歧義
}
```

同樣，`doStuff(uByte)` 的呼叫也存在歧義，因為編譯器無法決定是使用 `Any` 版本還是 `UByte` 版本。
在 2.1.0 中，編譯器現在可以正確處理這些情況，透過優先考慮更具體的類型 (在本例中為 `UByte`) 來解決歧義。

## Kotlin/JVM

從 2.1.0 版開始，編譯器可以產生包含 Java 23 位元組碼的類別。

### 將 JSpecify 可空性不匹配診斷嚴重性變更為嚴格

Kotlin 2.1.0 強化了對 `org.jspecify.annotations` 中可空性註解的嚴格處理，提高了 Java 互通性的類型安全性。

以下可空性註解受到影響：

* `org.jspecify.annotations.Nullable`
* `org.jspecify.annotations.NonNull`
* `org.jspecify.annotations.NullMarked`
* `org.jspecify.nullness` 中的舊版註解 (JSpecify 0.2 及更早版本)

從 Kotlin 2.1.0 開始，可空性不匹配預設從警告提升為錯誤。
這確保了 `@NonNull` 和 `@Nullable` 等註解在類型檢查期間得到執行，防止執行時出現意外的可空性問題。

`@NullMarked` 註解也影響其範圍內所有成員的可空性，使得在使用帶註解的 Java 程式碼時行為更具可預測性。

以下是演示新預設行為的範例：

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
    // 訪問非空結果，這是允許的
    sjc.foo().length

    // 在預設的嚴格模式下會引發錯誤，因為結果是可空的
    // 為避免錯誤，請改用 ?.length
    sjc.bar().length
}
```

您可以手動控制這些註解的診斷嚴重性。
為此，請使用 `-Xnullability-annotations` 編譯器選項選擇模式：

* `ignore`: 忽略可空性不匹配。
* `warning`: 報告可空性不匹配的警告。
* `strict`: 報告可空性不匹配的錯誤 (預設模式)。

有關更多資訊，請參閱 [可空性註解](java-interop.md#nullability-annotations)。

## Kotlin 多平台

Kotlin 2.1.0 引入了 [對 Swift 匯出的基本支援](#basic-support-for-swift-export)，並使 [發布 Kotlin 多平台函式庫變得更容易](#ability-to-publish-kotlin-libraries-from-any-host)。
它還專注於 Gradle 周圍的改進，這些改進穩定化了 [用於配置編譯器選項的新 DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable) 並帶來了 [隔離專案功能 (Isolated Projects) 的預覽](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

### 多平台專案中編譯器選項的新 Gradle DSL 已提升為穩定版

在 Kotlin 2.0.0 中，[我們引入了一個新的實驗性 Gradle DSL](whatsnew20.md#new-gradle-dsl-for-compiler-options-in-multiplatform-projects) 以簡化多平台專案中編譯器選項的配置。
在 Kotlin 2.1.0 中，此 DSL 已提升為穩定版。

整體專案配置現在有三個層次。最高層是擴展層，其次是目標層，最低層是編譯單元 (通常是一個編譯任務)：

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

若要了解不同層次以及如何在它們之間配置編譯器選項的更多資訊，請參閱 [編譯器選項](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compiler-options)。

### 預覽 Gradle 中的隔離專案 (Isolated Projects) 功能在 Kotlin 多平台中的應用

> 此功能為 [實驗性](components-stability.md#stability-levels-explained)，目前在 Gradle 中處於 Alpha 前階段。
> 僅能與 Gradle 8.10 版一起使用，且僅用於評估目的。此功能可能隨時被移除或更改。
>
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中提供回饋。需要選擇啟用 (詳情請見下文)。
>
{style="warning"}

在 Kotlin 2.1.0 中，您可以在多平台專案中預覽 Gradle 的 [隔離專案 (Isolated Projects)](https://docs.gradle.org/current/userguide/isolated_projects.html) 功能。

Gradle 中的隔離專案功能透過「隔離」每個 Gradle 專案的配置來提高建置效能。
每個專案的建置邏輯都限制了直接存取其他專案的可變狀態，從而允許它們安全地平行執行。
為了支援此功能，我們對 Kotlin Gradle 外掛程式的模型進行了一些更改，我們很樂意在預覽階段聽取您的使用經驗。

有兩種方法可以啟用 Kotlin Gradle 外掛程式的新模型：

* 選項 1：**在不啟用隔離專案的情況下測試相容性** –
  若要在不啟用隔離專案功能的情況下檢查與 Kotlin Gradle 外掛程式新模型的相容性，請將以下 Gradle 屬性添加到專案的 `gradle.properties` 檔案中：

  ```none
  # gradle.properties
  kotlin.kmp.isolated-projects.support=enable
  ```

* 選項 2：**啟用隔離專案後測試** –
  在 Gradle 中啟用隔離專案功能會自動配置 Kotlin Gradle 外掛程式以使用新模型。
  若要啟用隔離專案功能，請 [設定系統屬性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。
  在這種情況下，您無需將 Kotlin Gradle 外掛程式的 Gradle 屬性添加到您的專案中。

### 對 Swift 匯出的基本支援

> 此功能目前處於早期開發階段。它可能隨時被移除或更改。
> 需要選擇啟用 (詳情請見下文)，且您僅應將其用於評估目的。
> 我們非常感謝您在 [YouTrack](https://kotl.in/issue) 中提供回饋。
>
{style="warning"}

2.1.0 版邁出了在 Kotlin 中支援 Swift 匯出的第一步，允許您將 Kotlin 原始碼直接匯出到 Swift 介面，而無需使用 Objective-C 標頭。
這應能使針對 Apple 目標的多平台開發更加容易。

目前的基本支援包括以下能力：

* 將多個 Gradle 模組從 Kotlin 直接匯出到 Swift。
* 使用 `moduleName` 屬性定義自訂的 Swift 模組名稱。
* 使用 `flattenPackage` 屬性設定套件結構的折疊規則。

您可以使用專案中的以下建置檔案作為設定 Swift 匯出的起點：

```kotlin
// build.gradle.kts
kotlin {

    iosX64()
    iosArm64()
    iosSimulatorArm64()

    @OptIn(ExperimentalSwiftExportDsl::class)
    swiftExport {
        // 根模組名稱
        moduleName = "Shared"

        // 折疊規則
        // 從生成的 Swift 程式碼中移除套件前綴
        flattenPackage = "com.example.sandbox"

        // 匯出外部模組
        export(project(":subproject")) {
            // 匯出的模組名稱
            moduleName = "Subproject"
            // 折疊匯出的依賴規則
            flattenPackage = "com.subproject.library"
        }
    }
}
```

您也可以複製我們已設定好 Swift 匯出的 [公開範例](https://github.com/Kotlin/swift-export-sample)。

編譯器會自動產生所有必要檔案 (包括 `swiftmodule` 檔案、靜態 `a` 函式庫，以及標頭和 `modulemap` 檔案)，並將其複製到應用程式的建置目錄中，您可以從 Xcode 存取該目錄。

#### 如何啟用 Swift 匯出

請記住，此功能目前仍處於早期開發階段。

Swift 匯出目前適用於使用 [直接整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html) 將 iOS 框架連接到 Xcode 專案的專案。
這是 Android Studio 或透過 [網頁精靈](https://kmp.jetbrains.com/) 建立的 Kotlin 多平台專案的標準配置。

若要在您的專案中試用 Swift 匯出：

1. 將以下 Gradle 選項添加到您的 `gradle.properties` 檔案中：

   ```none
   # gradle.properties
   kotlin.experimental.swift-export.enabled=true
   ```

2. 在 Xcode 中，打開專案設定。
3. 在 **Build Phases** 標籤頁中，找到包含 `embedAndSignAppleFrameworkForXcode` 任務的 **Run Script** 階段。
4. 調整腳本，改為在執行腳本階段使用 `embedSwiftExportForXcode` 任務：

   ```bash
   ./gradlew :<Shared module name>:embedSwiftExportForXcode
   ```

   ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

#### 留下 Swift 匯出的回饋

我們計劃在未來的 Kotlin 版本中擴展和穩定 Swift 匯出支援。
請在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-64572) 中留下您的回饋。

### 從任何主機發布 Kotlin 函式庫的能力

> 此功能目前為 [實驗性](components-stability.md#stability-levels-explained)。
> 需要選擇啟用 (詳情請見下文)，且您僅應將其用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中提供回饋。
>
{style="warning"}

Kotlin 編譯器產生 `.klib` 成品以發布 Kotlin 函式庫。
以前，您可以從任何主機取得所需的成品，但 Apple 平台目標除外，它們需要 Mac 機器。
這對針對 iOS、macOS、tvOS 和 watchOS 目標的 Kotlin 多平台專案造成了特殊限制。

Kotlin 2.1.0 解除了這項限制，增加了對交叉編譯的支援。
現在您可以使用任何主機來產生 `.klib` 成品，這應能大大簡化 Kotlin 和 Kotlin 多平台函式庫的發布流程。

#### 如何啟用從任何主機發布函式庫

若要在您的專案中嘗試交叉編譯，請將以下二進位選項添加到您的 `gradle.properties` 檔案中：

```none
# gradle.properties
kotlin.native.enableKlibsCrossCompilation=true
```

此功能目前是實驗性的，並有一些限制。如果您符合以下情況，您仍然需要使用 Mac 機器：

* 您的函式庫具有 [cinterop 依賴項](native-c-interop.md)。
* 您的專案中設定了 [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)。
* 您需要為 Apple 目標建置或測試 [最終二進位檔](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。

#### 留下從任何主機發布函式庫的回饋

我們計劃在未來的 Kotlin 版本中穩定此功能並進一步改進函式庫發布。
請在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中留下您的回饋。

有關更多資訊，請參閱 [發布多平台函式庫](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)。

### 支援非打包的 klib

Kotlin 2.1.0 使得產生非打包 (`.klib`) 檔案成品成為可能。
這讓您可以直接配置對 klib 的依賴，而無需先解壓縮它們。

此變更還可以提高效能，減少 Kotlin/Wasm、Kotlin/JS 和 Kotlin/Native 專案的編譯和鏈接時間。

例如，我們的基準測試顯示，在一個包含 1 個鏈接任務和 10 個編譯任務的專案中，總建置時間的效能提高了約 3% (該專案建置一個依賴於 9 個簡化專案的單一原生可執行二進位檔)。
然而，對建置時間的實際影響取決於子專案的數量及其各自的大小。

#### 如何設定您的專案

預設情況下，Kotlin 編譯和鏈接任務現在配置為使用新的非打包成品。

如果您已為解析 klib 設定了自訂建置邏輯並希望使用新的未打包成品，您需要在 Gradle 建置檔案中明確指定 klib 套件解析的首選變體：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.plugin.attributes.KlibPackaging
// ...
val resolvableConfiguration = configurations.resolvable("resolvable") {

    // 對於新的非打包配置：
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.NON_PACKED))

    // 對於先前的打包配置：
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.PACKED))
}
```

非打包的 `.klib` 檔案在專案的建置目錄中生成的路徑與先前打包的檔案相同。
反過來，打包的 klib 現在位於 `build/libs` 目錄中。

如果未指定任何屬性，則使用打包變體。
您可以使用以下控制台命令檢查可用屬性和變體的列表：

```shell
./gradlew outgoingVariants
```

我們非常感謝您在 [YouTrack](https://kotl.in/issue) 中提供對此功能的回饋。

### 舊版 `android` 目標的進一步棄用

在 Kotlin 2.1.0 中，針對舊的 `android` 目標名稱的棄用警告已提升為錯誤。

目前，我們建議在針對 Android 的 Kotlin 多平台專案中使用 `androidTarget` 選項。
這是一個臨時解決方案，旨在為即將推出的 Google Android/KMP 外掛程式釋放 `android` 名稱。

當新的外掛程式可用時，我們將提供進一步的遷移說明。
來自 Google 的新 DSL 將是 Kotlin 多平台中 Android 目標支援的首選選項。

有關更多資訊，請參閱 [Kotlin 多平台相容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#rename-of-android-target-to-androidtarget)。

### 停止支援宣告多個相同類型的目標

在 Kotlin 2.1.0 之前，您可以在多平台專案中宣告多個相同類型的目標。
然而，這使得區分目標和有效支援共享原始碼集變得具有挑戰性。
在大多數情況下，更簡單的設定 (例如使用單獨的 Gradle 專案) 效果更好。
有關如何遷移的詳細指南和範例，請參閱 Kotlin 多平台相容性指南中的 [宣告多個類似目標](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#declaring-several-similar-targets)。

如果您的多平台專案中宣告了多個相同類型的目標，Kotlin 1.9.20 會觸發棄用警告。
在 Kotlin 2.1.0 中，此棄用警告現在對於除 Kotlin/JS 目標之外的所有目標都變為錯誤。
要了解 Kotlin/JS 目標為何豁免的更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode) 中的此問題。

## Kotlin/Native

Kotlin 2.1.0 包含了 [對 `iosArm64` 目標支援的升級](#iosarm64-promoted-to-tier-1)、[改進的 cinterop 緩存過程](#changes-to-caching-in-cinterop) 和其他更新。

### iosArm64 提升為 Tier 1

`iosArm64` 目標對於 [Kotlin 多平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 開發至關重要，已提升為 Tier 1 (第一層級)。
這是 Kotlin/Native 編譯器中最高級別的支援。

這表示該目標會定期在 CI 管線中進行測試，以確保其能夠編譯和運行。
我們也為該目標提供編譯器版本之間的原始碼和二進位兼容性。

有關目標層級的更多資訊，請參閱 [Kotlin/Native 目標支援](native-target-support.md)。

### LLVM 從 11.1.0 更新到 16.0.0

在 Kotlin 2.1.0 中，我們將 LLVM 從 11.1.0 版更新到 16.0.0 版。
新版本包含錯誤修復和安全更新。
在某些情況下，它還提供了編譯器最佳化和更快的編譯速度。

如果您的專案中有 Linux 目標，請注意 Kotlin/Native 編譯器現在預設對所有 Linux 目標使用 `lld` 鏈接器。

此更新不應影響您的程式碼，但如果您遇到任何問題，請向我們的 [問題追蹤器](http://kotl.in/issue) 回報。

### cinterop 緩存的變更

在 Kotlin 2.1.0 中，我們正在對 cinterop 緩存過程進行更改。它不再具有
[`CacheableTask`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/CacheableTask.html) 註解類型。
新的推薦方法是使用 [`cacheIf`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.tasks/-task-outputs/cache-if.html) 輸出類型來緩存任務結果。

這應該可以解決 `UP-TO-DATE` 檢查未能檢測到 [定義文件](native-definition-file.md) 中指定的頭檔案變更的問題，從而阻止建置系統重新編譯程式碼。

### mimalloc 記憶體分配器的棄用

回溯到 Kotlin 1.9.0，我們引入了新的記憶體分配器，然後在 Kotlin 1.9.20 中預設啟用它。
新的分配器旨在使垃圾收集更有效率，並提高 Kotlin/Native 記憶體管理器的運行時效能。

新的記憶體分配器取代了以前的預設分配器，[mimalloc](https://github.com/microsoft/mimalloc)。
現在，是時候在 Kotlin/Native 編譯器中棄用 mimalloc 了。

您現在可以從建置腳本中移除 `-Xallocator=mimalloc` 編譯器選項。
如果您遇到任何問題，請向我們的 [問題追蹤器](http://kotl.in/issue) 回報。

有關 Kotlin 中記憶體分配器和垃圾收集的更多資訊，請參閱 [Kotlin/Native 記憶體管理](native-memory-manager.md)。

## Kotlin/Wasm

Kotlin/Wasm 收到多項更新，並 [支援增量編譯](#support-for-incremental-compilation)。

### 支援增量編譯

以前，當您更改 Kotlin 程式碼中的某些內容時，Kotlin/Wasm 工具鏈必須重新編譯整個程式碼庫。

從 2.1.0 開始，Wasm 目標支援增量編譯。
在開發任務中，編譯器現在只重新編譯與上次編譯中的更改相關的文件，這顯著減少了編譯時間。

此變更目前將編譯速度提高了一倍，並計劃在未來版本中進一步改進。

在目前設定中，Wasm 目標的增量編譯預設為禁用。
若要啟用增量編譯，請將以下行添加到專案的 `local.properties` 或 `gradle.properties` 檔案中：

```none
# gradle.properties
kotlin.incremental.wasm=true
```

試用 Kotlin/Wasm 增量編譯並 [分享您的回饋](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)。
您的見解將有助於使此功能更快地穩定並預設啟用。

### 瀏覽器 API 移至 kotlinx-browser 獨立函式庫

以前，Web API 和相關目標工具的宣告是 Kotlin/Wasm 標準函式庫的一部分。

在此版本中，`org.w3c.*` 宣告已從 Kotlin/Wasm 標準函式庫移至新的 [kotlinx-browser 函式庫](https://github.com/kotlin/kotlinx-browser)。
此函式庫還包含其他與 Web 相關的套件，例如 `org.khronos.webgl`、`kotlin.dom` 和 `kotlinx.browser`。

這種分離提供了模組化，使得與 Web 相關的 API 可以在 Kotlin 的發布週期之外獨立更新。
此外，Kotlin/Wasm 標準函式庫現在只包含在任何 JavaScript 環境中可用的宣告。

若要使用已移動套件中的宣告，您需要將 `kotlinx-browser` 依賴項添加到專案的建置配置檔案中：

```kotlin
// build.gradle.kts
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```

### 改善 Kotlin/Wasm 的偵錯體驗

以前，在網頁瀏覽器中偵錯 Kotlin/Wasm 程式碼時，您可能會遇到偵錯介面中變數值的低階表示。
這通常使得追蹤應用程式的目前狀態變得困難。

![Kotlin/Wasm old debugger](wasm-old-debugger.png){width=700}

為改善此體驗，變數視圖中已新增自訂格式化工具 (custom formatters)。
此實作使用 [自訂格式化工具 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)，此 API 支援 Firefox 和基於 Chromium 的主要瀏覽器。

透過此變更，您現在可以以更使用者友好和易於理解的方式顯示和定位變數值。

![Kotlin/Wasm improved debugger](wasm-debugger-improved.png){width=700}

若要嘗試新的偵錯體驗：

1. 將以下編譯器選項添加到 `wasmJs {}` 編譯器選項中：

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

2. 在您的瀏覽器中啟用自訂格式化工具：

   * 在 Chrome DevTools 中，可透過 **設定 | 偏好設定 | 主控台** 取得：

     ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=700}

   * 在 Firefox DevTools 中，可透過 **設定 | 進階設定** 取得：

     ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=700}

### 減少 Kotlin/Wasm 二進位檔的大小

生產建置產生的 Wasm 二進位檔大小將減少高達 30%，您可能會看到一些效能改進。
這是因為 `--closed-world`、`--type-ssa` 和 `--type-merging` 等 Binaryen 選項現在被認為對所有 Kotlin/Wasm 專案安全可用，並已預設啟用。

### 改進 Kotlin/Wasm 中的 JavaScript 陣列互通性

雖然 Kotlin/Wasm 的標準函式庫為 JavaScript 陣列提供了 `JsArray<T>` 類型，但沒有直接的方法將 `JsArray<T>` 轉換為 Kotlin 的原生 `Array` 或 `List` 類型。

這個空白需要建立自訂函數來進行陣列轉換，使 Kotlin 和 JavaScript 程式碼之間的互通性複雜化。

此版本引入了一個適配器函數，可自動將 `JsArray<T>` 轉換為 `Array<T>` 和反之，從而簡化了陣列操作。

以下是泛型類型之間轉換的範例：Kotlin `List<T>` 和 `Array<T>` 到 JavaScript `JsArray<T>`。

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// 使用 .toJsArray() 將 List 或 Array 轉換為 JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// 使用 .toArray() 和 .toList() 將其轉換回 Kotlin 類型
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

類似的方法可用於將型別陣列轉換為其 Kotlin 等效項 (例如 `IntArray` 和 `Int32Array`)。有關詳細資訊和實作，請參閱 [`kotlinx-browser` 儲存庫]( https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)。

以下是型別陣列之間轉換的範例：Kotlin `IntArray` 到 JavaScript `Int32Array`。

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // 使用 .toInt32Array() 將 Kotlin IntArray 轉換為 JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // 使用 toIntArray() 將 JavaScript Int32Array 轉換回 Kotlin IntArray
    val kotlinIntArray: IntArray = jsInt32Array.toIntArray()
```

### 支援在 Kotlin/Wasm 中存取 JavaScript 異常詳細資訊

以前，當 Kotlin/Wasm 中發生 JavaScript 異常時，`JsException` 類型只提供一個通用訊息，而沒有來自原始 JavaScript 錯誤的詳細資訊。

從 Kotlin 2.1.0 開始，您可以透過啟用特定的編譯器選項，將 `JsException` 配置為包含原始錯誤訊息和堆疊追蹤。
這提供了更多上下文，有助於診斷源自 JavaScript 的問題。

此行為取決於 `WebAssembly.JSTag` API，此 API 僅在某些瀏覽器中可用：

* **Chrome**：從 115 版開始支援
* **Firefox**：從 129 版開始支援
* **Safari**：尚未支援

若要啟用此功能 (預設為禁用)，請將以下編譯器選項添加到您的 `build.gradle.kts` 檔案中：

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

以下是演示新行為的範例：

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: 意外的語法單字 'a'，"an invalid JSON" 不是有效的 JSON

        println("Message: ${e.message}")
        // 訊息：意外的語法單字 'a'，"an invalid JSON" 不是有效的 JSON

        println("Stacktrace:")
        // 堆疊追蹤：

        // 列印完整的 JavaScript 堆疊追蹤
        e.printStackTrace()
    }
}
```

啟用 `-Xwasm-attach-js-exception` 選項後，`JsException` 會提供來自 JavaScript 錯誤的特定詳細資訊。
如果沒有該選項，`JsException` 只包含一個通用訊息，指出在執行 JavaScript 程式碼時拋出了一個異常。

### 預設匯出的棄用

作為遷移到命名匯出 (named exports) 的一部分，以前在 JavaScript 中為 Kotlin/Wasm 匯出使用預設導入 (default import) 時，控制台會列印錯誤。

在 2.1.0 中，預設導入已被完全移除，以全面支援命名匯出。

現在，在為 Kotlin/Wasm 目標編寫 JavaScript 程式碼時，您需要使用相應的命名導入，而不是預設導入。

此變更標誌著遷移到命名匯出的棄用週期的最後階段：

**在 2.0.0 版中：** 控制台會列印警告訊息，解釋透過預設匯出導出實體已被棄用。

**在 2.0.20 版中：** 發生錯誤，要求使用相應的命名導入。

**在 2.1.0 版中：** 預設導入的使用已被完全移除。

### 子專案專屬的 Node.js 設定

您可以透過為 `rootProject` 定義 `NodeJsRootPlugin` 類別的屬性來配置專案的 Node.js 設定。
在 2.1.0 中，您可以使用一個新類別 `NodeJsPlugin` 為每個子專案配置這些設定。
以下是演示如何為子專案設定特定 Node.js 版本的範例：

```kotlin
// build.gradle.kts
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "22.0.0"
}
```

若要將新類別用於整個專案，請將相同的程式碼添加到 `allprojects {}` 區塊中：

```kotlin
// build.gradle.kts
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

您也可以使用 Gradle 慣例外掛程式將設定應用於特定的一組子專案。

## Kotlin/JS

### 支援屬性中的非識別符字元

Kotlin/JS 以前不允許在反引號中包含空格的 [測試方法名稱](coding-conventions.md#names-for-test-methods)。

同樣，也無法存取包含 Kotlin 識別符中不允許的字元 (例如連字符或空格) 的 JavaScript 物件屬性：

```kotlin
external interface Headers {
    var accept: String?

    // 因連字符導致無效的 Kotlin 識別符
    var `content-length`: String?
}

val headers: Headers = TODO("value provided by a JS library")
val accept = headers.accept
// 因屬性名稱中的連字符導致錯誤
val length = headers.`content-length`
```

此行為與 JavaScript 和 TypeScript 不同，後者允許使用非識別符字元存取此類屬性。

從 Kotlin 2.1.0 開始，此功能預設啟用。
Kotlin/JS 現在允許您使用反引號 (``) 和 `@JsName` 註解來與包含非識別符字元的 JavaScript 屬性互動，並用於測試方法的名稱。

此外，您可以使用 `@JsName` 和 ` @JsQualifier` 註解將 Kotlin 屬性名稱映射到 JavaScript 對等名稱：

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
    // 在 JavaScript 中，這會被編譯為 Bar.property_example_HASH
    println(Bar.`property example`)
    // 在 JavaScript 中，這會被編譯為 fooNamespace["property example"]
    println(Foo.`property example`)
    // 在 JavaScript 中，這會被編譯為 Baz["property example"]
    println(Baz.`property example`)
}
```

### 支援產生 ES2015 箭頭函數

在 Kotlin 2.1.0 中，Kotlin/JS 引入了對產生 ES2015 箭頭函數 (arrow functions) 的支援，例如 `(a, b) => expression`，而不是匿名函數。

使用箭頭函數可以減少專案的捆綁包大小，特別是在使用實驗性的 `-Xir-generate-inline-anonymous-functions` 模式時。
這也使產生的程式碼更符合現代 JavaScript。

當目標為 ES2015 時，此功能預設啟用。
或者，您可以使用 `-Xes-arrow-functions` 命令列引數來啟用它。

在 [官方文件](https://262.ecma-international.org/6.0/) 中了解更多關於 [ES2015 (ECMAScript 2015, ES6)](https://262.ecma-international.org/6.0/) 的資訊。

## Gradle 改進

Kotlin 2.1.0 完全相容於 Gradle 7.6.3 至 8.6 版本。
Gradle 8.7 至 8.10 版本也受支援，但只有一個例外。
如果您使用 Kotlin 多平台 Gradle 外掛程式，您可能會在您的多平台專案中看到調用 JVM 目標中的 `withJava()` 函數的棄用警告。
我們計劃盡快修復此問題。

有關更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542) 中的相關問題。

您也可以使用最新發布的 Gradle 版本，但請記住，如果這樣做，您可能會遇到棄用警告或某些新的 Gradle 功能可能無法工作。

### 最低支援的 AGP 版本提升至 7.3.1

從 Kotlin 2.1.0 開始，支援的最低 Android Gradle 外掛程式版本為 7.3.1。

### 最低支援的 Gradle 版本提升至 7.6.3

從 Kotlin 2.1.0 開始，支援的最低 Gradle 版本為 7.6.3。

### Kotlin Gradle 外掛程式擴展的新 API

Kotlin 2.1.0 引入了一個新的 API，使您更容易建立自己的外掛程式來配置 Kotlin Gradle 外掛程式。
此變更棄用了 `KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 介面，並為外掛程式作者引入了以下介面：

| 名稱                     | 描述                                                                                                                                                                                                                                                                   |
|:-------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `KotlinBaseExtension`    | 用於配置整個專案的通用 Kotlin JVM、Android 和多平台外掛程式選項的外掛程式 DSL 擴展類型：<list><li>`org.jetbrains.kotlin.jvm`</li><li>`org.jetbrains.kotlin.android`</li><li>`org.jetbrains.kotlin.multiplatform`</li></list> |
| `KotlinJvmExtension`     | 用於配置整個專案的 Kotlin **JVM** 外掛程式選項的外掛程式 DSL 擴展類型。                                                                                                                                                                                                   |
| `KotlinAndroidExtension` | 用於配置整個專案的 Kotlin **Android** 外掛程式選項的外掛程式 DSL 擴展類型。                                                                                                                                                                                               |

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

這將 JVM 目標配置為 17，適用於 JVM 和 Android 專案。

若要專門為 JVM 專案配置編譯器選項，請使用 `KotlinJvmExtension`：

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

此範例同樣為 JVM 專案配置 JVM 目標為 17。
它還為專案配置了 Maven 發布，以便其輸出發布到 Maven 儲存庫。

您可以完全以相同的方式使用 `KotlinAndroidExtension`。

### 編譯器符號從 Kotlin Gradle 外掛程式 API 中隱藏

以前，KGP 在其運行時依賴項中包含了 `org.jetbrains.kotlin:kotlin-compiler-embeddable`，使得內部編譯器符號在建置腳本類別路徑中可用。
這些符號僅供內部使用。

從 Kotlin 2.1.0 開始，KGP 將 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 類別檔案的子集捆綁到其 JAR 檔案中，並逐步移除它們。
此變更旨在防止相容性問題並簡化 KGP 的維護。

如果您的建置邏輯的其他部分 (例如 `kotlinter` 等外掛程式) 依賴於與 KGP 捆綁的版本不同的 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 版本，則可能導致衝突和運行時異常。

為了防止此類問題，如果 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 與 KGP 同時存在於建置類別路徑中，KGP 現在會顯示警告。

作為長期解決方案，如果您是使用 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 類別的外掛程式作者，我們建議您在隔離的類別載入器中運行它們。
例如，您可以使用 [Gradle Workers API](https://docs.gradle.org/current/userguide/worker_api.html) 結合類別載入器或進程隔離來實現。

#### 使用 Gradle Workers API

此範例演示如何在產生 Gradle 外掛程式的專案中安全地使用 Kotlin 編譯器。
首先，在您的建置腳本中添加一個僅編譯依賴項。
這使得符號僅在編譯時可用：

```kotlin
// build.gradle.kts
dependencies {
    compileOnly("org.jetbrains.kotlin:kotlin-compiler-embeddable:%kotlinVersion%")
}
```

接下來，定義一個 Gradle 工作操作以列印 Kotlin 編譯器版本：

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

現在建立一個任務，使用類別載入器隔離將此操作提交給工作執行器：

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

### 支援多個穩定性配置檔案

Compose 編譯器可以解釋多個穩定性配置檔案，但 Compose 編譯器 Gradle 外掛程式的 `stabilityConfigurationFile` 選項以前只允許指定單個檔案。
在 Kotlin 2.1.0 中，此功能已重構，允許您為單個模組使用多個穩定性配置檔案：

* `stabilityConfigurationFile` 選項已棄用。
* 有一個新選項 `stabilityConfigurationFiles`，其類型為 `ListProperty<RegularFile>`。

以下是如何使用新選項將多個檔案傳遞給 Compose 編譯器：

```kotlin
// build.gradle.kt
composeCompiler {
    stabilityConfigurationFiles.addAll(
        project.layout.projectDirectory.file("configuration-file1.conf"),
        project.layout.projectDirectory.file("configuration-file2.conf"),
    )
}
```

### 可暫停組合 (Pausable composition)

可暫停組合 (Pausable composition) 是一項新的實驗性功能，它改變了編譯器產生可跳過函數的方式。
啟用此功能後，組合可以在運行時在跳過點暫停，允許長時間運行的組合過程分攤到多個幀中。
可暫停組合用於惰性列表和其他性能密集型組件中，用於預取內容，這些內容在以阻塞方式執行時可能會導致幀丟失。

若要試用可暫停組合，請在 Compose 編譯器的 Gradle 配置中添加以下功能標誌：

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.PausableComposition
    )
}
```

> 對此功能的運行時支援已在 `androidx.compose.runtime` 的 1.8.0-alpha02 版本中添加。
> 當與舊版運行時一起使用時，此功能標誌無效。
>
{style="note"}

### 開放式 (open) 和覆寫 (overridden) @Composable 函數的變更

虛擬 (open、abstract 和 overridden) 的 `@Composable` 函數不能再是可重新啟動的 (restartable)。
可重新啟動組的程式碼生成會產生 [與繼承不正確](https://issuetracker.google.com/329477544) 的呼叫，導致運行時崩潰。

這意味著虛擬函數將不會被重新啟動或跳過：每當它們的狀態失效時，運行時將轉而重新組合它們的父 composable。
如果您的程式碼對重新組合敏感，您可能會注意到運行時行為的變化。

### 效能改進

Compose 編譯器以前會創建模組 IR 的完整副本以轉換 `@Composable` 類型。
除了複製與 Compose 無關的元素時增加記憶體消耗外，這種行為還在 [某些邊緣情況下](https://issu-tracker.google.com/365066530) 破壞了下游編譯器外掛程式。

此複製操作已移除，可能導致更快的編譯時間。

## 標準函式庫

### 標準函式庫 API 棄用嚴重性的變更

在 Kotlin 2.1.0 中，我們將多個標準函式庫 API 的棄用嚴重性級別從警告提升為錯誤。
如果您的程式碼依賴於這些 API，您需要更新它以確保相容性。
最顯著的變化包括：

* **針對 `Char` 和 `String` 的區域設定敏感大小寫轉換函數已棄用：**
  `Char.toLowerCase()`、`Char.toUpperCase()`、`String.toUpperCase()` 和 `String.toLowerCase()` 等函數現已棄用，使用它們會導致錯誤。
  請使用不依賴區域設定的函數替代品或其他大小寫轉換機制來取代它們。
  如果您想繼續使用預設區域設定，請將 `String.toLowerCase()` 等呼叫替換為 `String.lowercase(Locale.getDefault())`，明確指定區域設定。
  對於不依賴區域設定的轉換，請將它們替換為 `String.lowercase()`，它預設使用不變的區域設定。

* **Kotlin/Native 凍結 API 已棄用：**
  以前標記有 `@FreezingIsDeprecated` 註解的凍結相關宣告現在會導致錯誤。
  此變更反映了從 Kotlin/Native 中傳統記憶體管理器的過渡，傳統記憶體管理器需要凍結物件才能在執行緒之間共享它們。
  若要了解如何在新的記憶體模型中從凍結相關 API 遷移，請參閱 [Kotlin/Native 遷移指南](native-migration-guide.md#update-your-code)。
  有關更多資訊，請參閱 [關於凍結棄用的公告](whatsnew1720.md#freezing)。

* **`appendln()` 已棄用，改用 `appendLine()`：**
  `StringBuilder.appendln()` 和 `Appendable.appendln()` 函數現已棄用，使用它們會導致錯誤。
  若要取代它們，請改用 `StringBuilder.appendLine()` 或 `Appendable.appendLine()` 函數。
  `appendln()` 函數被棄用是因為在 Kotlin/JVM 上，它使用了 `line.separator` 系統屬性，該屬性在每個作業系統上都有不同的預設值。
  在 Kotlin/JVM 上，此屬性在 Windows 上預設為 `\r
` (CR LF)，在其他系統上預設為 `
` (LF)。
  另一方面，`appendLine()` 函數始終使用 `
` (LF) 作為行分隔符，確保跨平台行為一致。

有關此版本中受影響 API 的完整列表，請參閱 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628) YouTrack 問題。

### java.nio.file.Path 的穩定檔案樹遍歷擴展

Kotlin 1.7.20 引入了針對 `java.nio.file.Path` 類別的實驗性 [擴展函數](extensions.md#extension-functions)，允許您遍歷檔案樹。
在 Kotlin 2.1.0 中，以下檔案樹遍歷擴展現已 [穩定](components-stability.md#stability-levels-explained)：

* `walk()` 惰性遍歷以指定路徑為根的檔案樹。
* `fileVisitor()` 使得可以單獨建立 `FileVisitor`。`FileVisitor` 指定了在遍歷期間對目錄和檔案執行的操作。
* `visitFileTree(fileVisitor: FileVisitor, ...)` 遍歷檔案樹，對每個遇到的條目調用指定的 `FileVisitor`，它底層使用了 `java.nio.file.Files.walkFileTree()` 函數。
* `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)` 使用提供的 `builderAction` 建立 `FileVisitor` 並呼叫 `visitFileTree(fileVisitor, ...)` 函數。
* `sealed interface FileVisitorBuilder` 允許您定義自訂的 `FileVisitor` 實作。
* `enum class PathWalkOption` 為 `Path.walk()` 函數提供遍歷選項。

以下範例演示了如何使用這些檔案遍歷 API 建立自訂的 `FileVisitor` 行為，這允許您定義訪問檔案和目錄的特定操作。

例如，您可以明確地建立一個 `FileVisitor` 並稍後使用它：

```kotlin
val cleanVisitor = fileVisitor {
    onPreVisitDirectory { directory, attributes ->
        // 佔位符：新增訪問目錄的邏輯
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // 佔位符：新增訪問檔案的邏輯
        FileVisitResult.CONTINUE
    }
}

// 佔位符：在此處新增遍歷前的通用設定邏輯
projectDirectory.visitFileTree(cleanVisitor)
```

您也可以使用 `builderAction` 建立 `FileVisitor` 並立即用於遍歷：

```kotlin
projectDirectory.visitFileTree {
    // 定義 builderAction：
    onPreVisitDirectory { directory, attributes ->
        // 訪問目錄的一些邏輯
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // 訪問檔案的一些邏輯
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

        // 刪除副檔名為 .class 的檔案
        onVisitFile { file, _ ->
            if (file.extension == "class") {
                file.deleteExisting()
            }
            FileVisitResult.CONTINUE
        }
    }

    // 設定根目錄和檔案
    val rootDirectory = createTempDirectory("Project")

    // 建立包含 A.kt 和 A.class 檔案的 src 目錄
    rootDirectory.resolve("src").let { srcDirectory ->
        srcDirectory.createDirectory()
        srcDirectory.resolve("A.kt").createFile()
        srcDirectory.resolve("A.class").createFile()
    }

    // 建立包含 Project.jar 檔案的 build 目錄
    rootDirectory.resolve("build").let { buildDirectory ->
        buildDirectory.createDirectory()
        buildDirectory.resolve("Project.jar").createFile()
    }

    // 使用 walk() 函數：
    val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructure)
    // "[, build, build/Project.jar, src, src/A.class, src/A.kt]"
  
    // 使用 cleanVisitor 遍歷檔案樹，應用 rootDirectory.visitFileTree(cleanVisitor) 清理規則
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

* 改進的 [空安全](null-safety.md) 頁面 – 了解如何在程式碼中安全地處理 `null` 值。
* 改進的 [物件宣告與表達式](object-declarations.md) 頁面 –
  了解如何一步定義類別並建立實例。
* 改進的 [When 表達式與陳述式](control-flow.md#when-expressions-and-statements) 部分 –
  了解 `when` 條件式以及如何使用它。
* 更新的 [Kotlin 路線圖](roadmap.md)、[Kotlin 演進原則](kotlin-evolution-principles.md) 和
  [Kotlin 語言功能與提案](kotlin-language-features-and-proposals.md) 頁面 –
  了解 Kotlin 的計劃、持續發展和指導原則。

### Compose 編譯器

* [Compose 編譯器文件](compose-compiler-migration-guide.md) 現已位於「編譯器與外掛程式」部分 –
  了解 Compose 編譯器、編譯器選項以及遷移步驟。

### API 參考

* 新的 [Kotlin Gradle 外掛程式 API 參考](https://kotlinlang.org/api/kotlin-gradle-plugin) –
  探索 Kotlin Gradle 外掛程式和 Compose 編譯器 Gradle 外掛程式的 API 參考。

### 多平台開發

* 新的 [為多平台建置 Kotlin 函式庫](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html) 頁面 –
  了解如何為 Kotlin 多平台設計您的 Kotlin 函式庫。
* 新的 [Kotlin 多平台介紹](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 頁面 – 了解 Kotlin 多平台的關鍵概念、依賴項、函式庫等。
* 更新的 [Kotlin 多平台概述](multiplatform.topic) 頁面 – 瀏覽 Kotlin 多平台的基本要點和常用案例。
* 新的 [iOS 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-integration-overview.html) 部分 – 了解如何將 Kotlin 多平台共享模組整合到您的 iOS 應用程式中。
* 新的 [Kotlin/Native 的定義文件](native-definition-file.md) 頁面 – 了解如何建立定義文件以使用 C 和 Objective-C 函式庫。
* [開始使用 WASI](wasm-wasi.md) –
  了解如何在各種 WebAssembly 虛擬機中，使用 WASI 運行簡單的 Kotlin/Wasm 應用程式。

### 工具

* [新的 Dokka 遷移指南](dokka-migration.md) – 了解如何遷移到 Dokka Gradle 外掛程式 v2。

## Kotlin 2.1.0 相容性指南

Kotlin 2.1.0 是一個功能發布版本，因此可能會帶來與您為早期語言版本編寫的程式碼不相容的變更。
在 [Kotlin 2.1.0 相容性指南](compatibility-guide-21.md) 中找到這些變更的詳細列表。

## 安裝 Kotlin 2.1.0

從 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式作為捆綁外掛程式隨附在您的 IDE 中分發。
這意味著您無法再從 JetBrains Marketplace 安裝外掛程式。

若要更新到新的 Kotlin 版本，請在您的建置腳本中將 [Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 更改為 2.1.0。