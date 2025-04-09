---
title: "Kotlin 2.1.0 的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[已發佈：2024 年 11 月 27 日](releases#release-details)_

Kotlin 2.1.0 版本正式推出！以下是主要亮點：

* **預覽版中的新語言特性**：[帶主詞的 `when` 語句中的守衛條件（Guard conditions）](#guard-conditions-in-when-with-a-subject)、
  [非本地 `break` 和 `continue`](#non-local-break-and-continue)，以及 [多美元符號字串插值（Multi-dollar string interpolation）](#multi-dollar-string-interpolation)。
* **K2 編譯器更新**：[編譯器檢查方面有更大的彈性](#extra-compiler-checks) 和 [kapt 實作的改進](#improved-k2-kapt-implementation)。
* **Kotlin 多平台（Kotlin Multiplatform）**：引入了 [對 Swift 導出的基本支援](#basic-support-for-swift-export)、
  [用於編譯器選項的穩定 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)，以及更多。
* **Kotlin/Native**：[改進了對 `iosArm64` 的支援](#iosarm64-promoted-to-tier-1) 和其他更新。
* **Kotlin/Wasm**：多項更新，包括 [對增量編譯的支援](#support-for-incremental-compilation)。
* **Gradle 支援**：[改進了與較新版本 Gradle 和 Android Gradle 插件的相容性](#gradle-improvements)，
  以及 [Kotlin Gradle 插件 API 的更新](#new-api-for-kotlin-gradle-plugin-extensions)。
* **文件**：[Kotlin 文件的大幅改進](#documentation-updates)。

## IDE 支援

支援 2.1.0 的 Kotlin 插件已捆綁在最新的 IntelliJ IDEA 和 Android Studio 中。
您無需更新 IDE 中的 Kotlin 插件。
您只需要在您的建置腳本中將 Kotlin 版本變更為 2.1.0 即可。

詳情請參閱 [更新至新的 Kotlin 版本](releases#update-to-a-new-kotlin-version)。

## 語言

在發佈包含 K2 編譯器的 Kotlin 2.0.0 版本之後，JetBrains 團隊正專注於使用新特性來改進語言。
在此版本中，我們很高興宣佈多項新的語言設計改進。

這些特性以預覽形式提供，我們鼓勵您試用它們並分享您的回饋：

* [帶主詞的 `when` 語句中的守衛條件（Guard conditions）](#guard-conditions-in-when-with-a-subject)
* [非本地 `break` 和 `continue`](#non-local-break-and-continue)
* [多美元符號插值：改進了對字串常值中 `你是一位精通技术文档翻译的专业翻译人员，负责将英文技术文档翻译为繁体中文。请严格遵循以下要求：
  
  ## 翻译风格和质量要求
  1. 尽量符合繁体中文互联网的使用语境，并正确处理倒装和不同语言的语序，给专业的名词适当保留括号以及英文注释
  2. 术语使用统一、准确，并根据上下文自然融入语句

  ## 技术要求

  1. 保持所有 Markdown 格式、代码块和链接不变  
  2. 代码示例内的代码**不要翻译**
  3. 术语表中的术语必须使用指定翻译
  4. 对于无法确定的专有名词，保留英文原文
  5. 参考提供的之前翻译过的文档，保持翻译风格和术语使用的一致性

  ## 输出要求

  - 仅输出翻译结果，不要添加解释或注释
  - 保持所有原始的 Markdown 语法和格式
  - 保留原文中的所有代码块、变量名和函数名不变
  - 确保所有链接和引用保持不变
  
  ## 术语表
  无相关术语

  ## 参考翻译
  无参考翻译

  ## 待翻译内容
  ```markdown
   的處理](#multi-dollar-string-interpolation)

:::note
所有特性在最新的 2024.3 版本的 IntelliJ IDEA 中，啟用 K2 模式後均獲得 IDE 支援。

在 [IntelliJ IDEA 2024.3 部落格文章](https://blog.jetbrains.com/idea/2024/11/intellij-idea-2024-3/) 中瞭解更多資訊。

[查看 Kotlin 語言設計特性和提案的完整清單](kotlin-language-features-and-proposals)。

此版本還帶來了以下語言更新：

* [](#support-for-requiring-opt-in-to-extend-apis)
* [](#improved-overload-resolution-for-functions-with-generic-types)
* [](#improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes)

### 帶主詞的 when 語句中的守衛條件（Guard conditions）

此特性為 [預覽版](kotlin-evolution-principles#pre-stable-features)，
並且需要選擇加入（詳情請見下文）。

我們很樂意在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140) 中收到您的回饋。

從 2.1.0 開始，您可以在帶有主詞的 `when` 運算式或陳述式中使用守衛條件（Guard conditions）。

守衛條件（Guard conditions）允許您在 `when` 運算式的分支中包含多個條件，
使複雜的控制流程更加明確和簡潔，並簡化程式碼結構。

若要在分支中包含守衛條件（Guard condition），請將其放在主要條件之後，並以 `if` 分隔：

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
        // 僅具有主要條件的分支。當 `Animal` 為 `Dog` 時，傳回 `feedDog()`
        is Animal.Dog `->` animal.feedDog()
        // 具有主要條件和守衛條件的分支。當 `Animal` 為 `Cat` 且不是 `mouseHunter` 時，傳回 `feedCat()`
        is Animal.Cat if !animal.mouseHunter `->` animal.feedCat()
        // 如果以上條件都不符合，則傳回 "Unknown animal"
        else `->` println("Unknown animal")
    }
}
```

在單個 `when` 運算式中，您可以組合具有和不具有守衛條件的分支。
僅當主要條件和守衛條件均為 `true` 時，才會執行具有守衛條件的分支中的程式碼。
如果主要條件不符合，則不會評估守衛條件。
此外，守衛條件支援 `else if`。

若要在您的專案中啟用守衛條件，請在命令列中使用以下編譯器選項：

```bash
kotlinc -Xwhen-guards main.kt
```

或將其新增至 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-guards")
    }
}
```

### 非本地 break 和 continue

此特性為 [預覽版](kotlin-evolution-principles#pre-stable-features)，
並且需要選擇加入（詳情請見下文）。

我們很樂意在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436) 中收到您的回饋。

Kotlin 2.1.0 新增了另一個期待已久的特性的預覽，即使用非本地 `break` 和 `continue` 的能力。
此特性擴展了您可以在 inline 函式範圍內使用的工具集，並減少了您專案中的樣板程式碼。

先前，您只能使用非本地傳回值。
現在，Kotlin 也支援非本地的 `break` 和 `continue` [跳躍運算式](returns)。
這表示您可以在作為引數傳遞給封閉迴圈的 inline 函式的 lambda 運算式中使用它們：

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

若要在您的專案中試用此特性，請在命令列中使用 `-Xnon-local-break-continue` 編譯器選項：

```bash
kotlinc -Xnon-local-break-continue main.kt
```

或將其新增至 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnon-local-break-continue")
    }
}
```

我們計劃在未來的 Kotlin 版本中使此特性穩定。
如果您在使用非本地 `break` 和 `continue` 時遇到任何問題，
請將其報告給我們的 [issue 追蹤器](https://youtrack.jetbrains.com/issue/KT-1436)。

### 多美元符號字串插值（Multi-dollar string interpolation）

此特性為 [預覽版](kotlin-evolution-principles#pre-stable-features)，
並且需要選擇加入（詳情請見下文）。

我們很樂意在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425) 中收到您的回饋。

Kotlin 2.1.0 引入了對多美元符號字串插值的支援，
改進了在字串常值中處理美元符號 (`你是一位精通技术文档翻译的专业翻译人员，负责将英文技术文档翻译为繁体中文。请严格遵循以下要求：
  
  ## 翻译风格和质量要求
  1. 尽量符合繁体中文互联网的使用语境，并正确处理倒装和不同语言的语序，给专业的名词适当保留括号以及英文注释
  2. 术语使用统一、准确，并根据上下文自然融入语句

  ## 技术要求

  1. 保持所有 Markdown 格式、代码块和链接不变  
  2. 代码示例内的代码**不要翻译**
  3. 术语表中的术语必须使用指定翻译
  4. 对于无法确定的专有名词，保留英文原文
  5. 参考提供的之前翻译过的文档，保持翻译风格和术语使用的一致性

  ## 输出要求

  - 仅输出翻译结果，不要添加解释或注释
  - 保持所有原始的 Markdown 语法和格式
  - 保留原文中的所有代码块、变量名和函数名不变
  - 确保所有链接和引用保持不变
  
  ## 术语表
  无相关术语

  ## 参考翻译
  无参考翻译

  ## 待翻译内容
  ```markdown
  )。
此特性在需要多個美元符號的上下文中很有用，
例如範本引擎、JSON 結構描述或其他資料格式。

Kotlin 中的字串插值使用單個美元符號。
但是，在字串中使用文字美元符號（在財務資料和範本系統中很常見）需要使用 `${'`你是一位精通技术文档翻译的专业翻译人员，负责将英文技术文档翻译为繁体中文。请严格遵循以下要求：
  
  ## 翻译风格和质量要求
  1. 尽量符合繁体中文互联网的使用语境，并正确处理倒装和不同语言的语序，给专业的名词适当保留括号以及英文注释
  2. 术语使用统一、准确，并根据上下文自然融入语句

  ## 技术要求

  1. 保持所有 Markdown 格式、代码块和链接不变  
  2. 代码示例内的代码**不要翻译**
  3. 术语表中的术语必须使用指定翻译
  4. 对于无法确定的专有名词，保留英文原文
  5. 参考提供的之前翻译过的文档，保持翻译风格和术语使用的一致性

  ## 输出要求

  - 仅输出翻译结果，不要添加解释或注释
  - 保持所有原始的 Markdown 语法和格式
  - 保留原文中的所有代码块、变量名和函数名不变
  - 确保所有链接和引用保持不变
  
  ## 术语表
  无相关术语

  ## 参考翻译
  无参考翻译

  ## 待翻译内容
  ```markdown
  }` 之類的變通方法。
啟用多美元符號插值特性後，您可以設定觸發插值所需的美元符號數量，
較少的美元符號將被視為字串常值。

以下是如何使用 `你是一位精通技术文档翻译的专业翻译人员，负责将英文技术文档翻译为繁体中文。请严格遵循以下要求：
  
  ## 翻译风格和质量要求
  1. 尽量符合繁体中文互联网的使用语境，并正确处理倒装和不同语言的语序，给专业的名词适当保留括号以及英文注释
  2. 术语使用统一、准确，并根据上下文自然融入语句

  ## 技术要求

  1. 保持所有 Markdown 格式、代码块和链接不变  
  2. 代码示例内的代码**不要翻译**
  3. 术语表中的术语必须使用指定翻译
  4. 对于无法确定的专有名词，保留英文原文
  5. 参考提供的之前翻译过的文档，保持翻译风格和术语使用的一致性

  ## 输出要求

  - 仅输出翻译结果，不要添加解释或注释
  - 保持所有原始的 Markdown 语法和格式
  - 保留原文中的所有代码块、变量名和函数名不变
  - 确保所有链接和引用保持不变
  
  ## 术语表
  无相关术语

  ## 参考翻译
  无参考翻译

  ## 待翻译内容
  ```markdown
  產生具有預留位置的 JSON 結構描述多行字串的範例：

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

在本範例中，初始 `$` 表示您需要 **兩個美元符號** (`$`) 才能觸發插值。
它可以防止 `$schema`、`$id` 和 `$dynamicAnchor` 被解譯為插值標記。

此方法在使用將美元符號用於預留位置語法的系統時特別有用。

若要啟用此特性，請在命令列中使用以下編譯器選項：

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

如果您的程式碼已使用具有單個美元符號的標準字串插值，則無需進行任何變更。
每當您需要在字串中使用文字美元符號時，都可以使用 `$`。

### 支援要求選擇加入以擴充 API

Kotlin 2.1.0 引入了 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 註釋，
這允許程式庫作者要求明確選擇加入，使用者才能實作實驗性介面或擴充實驗性類別。

當程式庫 API 足夠穩定可供使用，但可能會隨著新的抽象函式而發展時，此特性會很有用，
使其對繼承而言不穩定。

若要將選擇加入需求新增至 API 元素，請使用 `@SubclassOptInRequired`
註釋，並參照註釋類別：

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

在本範例中，`CoreLibraryApi` 介面要求使用者先選擇加入，才能實作它。
使用者可以這樣選擇加入：

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

當您使用 `@SubclassOptInRequired` 註釋來要求選擇加入時，
該需求不會傳播到任何 [內部或巢狀類別](nested-classes)。

:::

如需如何在您的 API 中使用 `@SubclassOptInRequired` 註釋的實際範例，
請查看 `kotlinx.coroutines` 程式庫中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)
介面。

### 改進了具有泛型型別函式的重載解析

先前，如果您有多個函式的重載，其中一些函式具有泛型型別的值參數，
而另一些函式在相同位置具有函式型別，則解析行為有時可能不一致。

這導致不同的行為，具體取決於您的重載是成員函式還是擴充函式。
例如：

```kotlin
class KeyValueStore<K, V> {
    fun store(key: K, value: V) {} // 1
    fun store(key: K, lazyValue: () `->` V) {} // 2
}

fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, value: V) {} // 1 
fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, lazyValue: () `->` V) {} // 2

fun test(kvs: KeyValueStore<String, Int>) {
    // Member functions
    kvs.store("", 1)    // Resolves to 1
    kvs.store("") { 1 } // Resolves to 2

    // Extension functions
    kvs.storeExtension("", 1)    // Resolves to 1
    kvs.storeExtension("") { 1 } // Doesn't resolve
}
```

在本範例中，`KeyValueStore` 類別具有 `store()` 函式的兩個重載，
其中一個重載具有帶有泛型型別 `K` 和 `V` 的函式參數，
另一個重載具有傳回泛型型別 `V` 的 lambda 函式。
同樣，擴充函式也有兩個重載：`storeExtension()`。

當使用和不使用 lambda 函式呼叫 `store()` 函式時，
編譯器成功解析了正確的重載。
但是，當使用 lambda 函式呼叫擴充函式 `storeExtension()` 時，
編譯器未解析正確的重載，因為它錯誤地認為兩個重載都適用。

為了修正此問題，我們引入了一種新的啟發式方法，以便編譯器可以捨棄可能的重載，
如果帶有泛型型別的函式參數無法根據來自另一個引數的資訊接受 lambda 函式。
此變更使成員函式和擴充函式的行為保持一致，
並且預設在 Kotlin 2.1.0 中啟用。

### 改進了對帶有密封類別的 when 運算式的窮舉性檢查

在 Kotlin 的先前版本中，編譯器要求在 `when` 中使用 `else` 分支
運算式，用於具有密封上限的型別參數，即使涵蓋了 `sealed class` 階層中的所有案例。
此行為在 Kotlin 2.1.0 中得到解決和改進，
使窮舉性檢查更加強大，並允許您移除多餘的 `else` 分支，
保持 `when` 運算式更簡潔且更直觀。

以下範例展示了變更：

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error `->` "Error!"
    is Success `->` result.value
    // Requires no else branch
}
```

## Kotlin K2 編譯器

在 Kotlin 2.1.0 中，K2 編譯器現在在 [使用編譯器檢查時提供更大的彈性](#extra-compiler-checks)
和 [警告](#global-warning-suppression)，以及 [改進了對 kapt 插件的支援](#improved-k2-kapt-implementation)。

### 額外的編譯器檢查

在 Kotlin 2.1.0 中，您現在可以在 K2 編譯器中啟用額外的檢查。
這些是額外的宣告、運算式和型別檢查，通常對於編譯而言並非至關重要，
但如果您想要驗證以下案例，仍然很有用：

| 檢查型別                                            | 註解                                                                                  |
|-------------------------------------------------------|------------------------------------------------------------------------------------------|
| `REDUNDANT_NULLABLE`                                  | 使用了 `Boolean??` 而不是 `Boolean?`                                                |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN`                     | 使用了 `java.lang.String` 而不是 `kotlin.String`                                    |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | 使用了 `arrayOf("") == arrayOf("")` 而不是 `arrayOf("").contentEquals(arrayOf(""))` |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD`                 | 使用了 `42.toInt()` 而不是 `42`                                                     |
| `USELESS_CALL_ON_NOT_NULL`                            | 使用了 `"".orEmpty()` 而不是 `""`                                                   |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE`         | 使用了 `"$string"` 而不是 `string`                                                  |
| `UNUSED_ANONYMOUS_PARAMETER`                          | 參數已在 lambda 運算式中傳遞，但從未使用                                                 |
| `REDUNDANT_VISIBILITY_MODIFIER`                       | 使用了 `public class Klass` 而不是 `class Klass`                                    |
| `REDUNDANT_MODALITY_MODIFIER`                         | 使用了 `final class Klass` 而不是 `class Klass`                                     |
| `REDUNDANT_SETTER_PARAMETER_TYPE`                     | 使用了 `set(value: Int)` 而不是 `set(value)`                                        |
| `CAN_BE_VAL`                                          | 已定義 `var local = 0` 但從未重新指派，可以改為 `val local = 42`                                       |
| `ASSIGNED_VALUE_IS_NEVER_READ`                        | 已定義 `val local = 42` 但之後從未使用在程式碼中                                                  |
| `UNUSED_VARIABLE`                                     | 已定義 `val local = 0` 但從未使用在程式碼中                                                   |
| `REDUNDANT_RETURN_UNIT_TYPE`                          | 使用了 `fun foo(): Unit {}` 而不是 `fun foo() {}`                                   |
| `UNREACHABLE_CODE`                                    | 存在程式碼陳述式，但永遠無法執行                                                     |

如果檢查為 true，您將收到一則編譯器警告，並提供有關如何修正問題的建議。

額外的檢查預設為停用。
若要啟用它們，請在命令列中使用 `-Wextra` 編譯器選項，或在 Gradle 建置檔案的 `compilerOptions {}` 區塊中指定 `extraWarnings`：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

如需有關如何定義和使用編譯器選項的詳細資訊，
請參閱 [Kotlin Gradle 插件中的編譯器選項](gradle-compiler-options)。

### 全域警告抑制

在 2.1.0 中，Kotlin 編譯器收到一個廣受歡迎的特性 – 全域抑制警告的能力。

您現在可以使用 `-Xsuppress-warning=WARNING_NAME` 語法在整個專案中抑制特定警告
在命令列中，或在建置檔案的 `compilerOptions {}` 區塊中使用 `freeCompilerArgs` 屬性。

例如，如果您在專案中啟用了 [額外的編譯器檢查](#extra-compiler-checks)，但想要抑制其中一項檢查，請使用：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

如果您想要抑制警告但不知道其名稱，請選取元素並按一下燈泡圖示（或使用 <shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut>）：

<img src="/img/warning-name-intention.png" alt="Warning name intention" width="500" style={{verticalAlign: 'middle'}}/>

新的編譯器選項目前為 [實驗性](components-stability#stability-levels-explained)。
以下細節也值得注意：

* 不允許抑制錯誤。
* 如果您傳遞未知的警告名稱，編譯將導致錯誤。
* 您可以一次指定多個警告：
  
   <Tabs>
   <TabItem value="Command line" label="命令列">

   ```bash
   kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
   ```

   </TabItem>
   <TabItem value="Build file" label="建置檔案">

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

   </TabItem>
   </Tabs>

### 改進的 K2 kapt 實作

:::note
用於 K2 編譯器 (K2 kapt) 的 kapt 插件處於 [Alpha](components-stability#stability-levels-explained) 階段。
它可能隨時變更。

我們很樂意在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) 中收到您的回饋。

目前，使用 [kapt](kapt) 插件的專案預設使用 K1 編譯器，
支援高達 1.9 的 Kotlin 版本。

在 Kotlin 1.9.20 中，我們推出了 K2 編譯器 (K2 kapt) 的 kapt 插件的實驗性實作。
我們現在改進了 K2 kapt 的內部實作，以減輕技術和效能問題。

雖然新的 K2 kapt 實作未引入新特性，
但與先前的 K2 kapt 實作相比，其效能已顯著提高。
此外，K2 kapt 插件的行為現在更接近 K1 kapt 的行為。

若要使用新的 K2 kapt 插件實作，請像啟用先前的 K2 kapt 插件一樣啟用它。
將以下選項新增至您專案的 `gradle.properties` 檔案中：

```kotlin
kapt.use.k2=true
```

在即將發佈的版本中，K2 kapt 實作將預設啟用，而不是 K1 kapt，
因此您將不再需要手動啟用它。

在新實作穩定之前，我們非常感謝您的 [回饋](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

### 解決 unsigned 型別和非基本型別之間的重載衝突

此版本解決了重載衝突的解析問題
在先前的版本中，當函式針對 unsigned 型別和非基本型別重載時，可能會發生這種情況，
如以下範例所示：

#### 重載的擴充函式

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // Kotlin 2.1.0 之前的重載解析不明確
}
```

在較早的版本中，呼叫 `uByte.doStuff()` 會導致不明確，因為 `Any` 和 `UByte` 擴充都適用。

#### 重載的頂層函式

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // Kotlin 2.1.0 之前的重載解析不明確
}
```

同樣，呼叫 `doStuff(uByte)` 也是不明確的，因為編譯器無法決定要使用 `Any` 版本還是 `UByte` 版本。
在 2.1.0 中，編譯器現在可以正確處理這些案例，通過優先處理更特定的型別來解決不明確性，
在本例中為 `UByte`。

## Kotlin/JVM

從 2.1.0 版本開始，編譯器可以產生包含 Java 23 位元組碼的類別。

### 將 JSpecify 可空性不符診斷嚴重性變更為嚴格

Kotlin 2.1.0 強制嚴格處理來自 `org.jspecify.annotations` 的可空性註釋，
從而提高了 Java 互通性的型別安全性。

以下可空性註釋受到影響：

* `org.jspecify.annotations.Nullable`
* `org.jspecify.annotations.NonNull`
* `org.jspecify.annotations.NullMarked`
* `org.jspecify.nullness` 中的舊版註釋 (JSpecify 0.2 及更早版本)

從 Kotlin 2.1.0 開始，可空性不符預設會從警告提升為錯誤。
這可確保在型別檢查期間強制執行 `@NonNull` 和 `@Nullable` 之類的註釋，
防止在執行階段出現意外的可空性問題。

`@NullMarked` 註釋也會影響其範圍內所有成員的可空性，
使您在使用已註釋的 Java 程式碼時，行為更具可預測性。

以下範例展示了新的預設行為：

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

您可以手動控制這些註釋的診斷嚴重性。
為此，請使用 `-Xnullability-annotations` 編譯器選項來選擇模式：

* `ignore`：忽略可空性不符。
* `warning`：報告可空性不符的警告。
* `strict`：報告可空性不符的錯誤（預設模式）。

如需詳細資訊，請參閱 [可空性註釋](java-interop#nullability-annotations)。

## Kotlin 多平台（Kotlin Multiplatform）

Kotlin 2.1.0 引入了 [對 Swift 導出的基本支援](#basic-support-for-swift-export)，並且讓
[從任何主機發佈 Kotlin 多平台（Kotlin Multiplatform）程式庫變得更加容易](#ability-to-publish-kotlin-libraries-from-any-host)。
它也專注於 Gradle 周圍的改進，這些改進穩定了 [用於設定編譯器選項的新 DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)，
並且帶來了 [Isolated Projects 特性的預覽](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

### 在多平台（Multiplatform）專案中，用於編譯器選項的新的 Gradle DSL 升級為 Stable

在 Kotlin 2.0.0 中，[我們引入了新的實驗性 Gradle DSL](whatsnew20#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
以簡化跨多平台專案的編譯器選項的設定。
在 Kotlin 2.1.0 中，此 DSL 已升級為 Stable。

整體專案設定現在有三個層級。最高層級是擴充層級，
然後是目標層級，最低層級是編譯單元（通常是編譯任務）：

<img src="/img/compiler-options-levels.svg" alt="Kotlin compiler options levels" width="700" style={{verticalAlign: 'middle'}}/>

若要瞭解有關不同層級以及如何在它們之間設定編譯器選項的詳細資訊，
請參閱 [編譯器選項](multiplatform-dsl-reference#compiler-options)。

### 在 Kotlin 多平台（Kotlin Multiplatform）中預覽 Gradle 的 Isolated Projects

此特性為 [實驗性](components-stability#stability-levels-explained)，並且目前在 Gradle 中處於 pre-Alpha 狀態。
僅在 Gradle 8.10 版中使用它，並且僅用於評估目的。此特性可能隨時被捨棄或變更。

我們很樂意在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中收到您對它的回饋。
需要選擇加入（詳情請見下文）。

在 Kotlin 2.1.0 中，
您可以在您的多平台專案中預覽 Gradle 的 [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)
特性。

Gradle 中的 Isolated Projects 特性通過「隔離」來提高建置效能
個別 Gradle 專案的設定彼此隔離。
每個專案的建置邏輯都被限制為直接存取其他專案的可變狀態，
從而允許它們安全地並行執行。
為了支援此特性，我們對 Kotlin Gradle 插件的模型進行了一些變更，
並且我們有興趣聽取您在此預覽階段中的體驗。

有兩種方法可以啟用 Kotlin Gradle 插件的新模型：

* 選項 1：**在不啟用 Isolated Projects 的情況下測試相容性** –
  若要檢查與 Kotlin Gradle 插件的新模型的相容性，而不啟用 Isolated Projects 特性，
  請在您專案的 `gradle.properties` 檔案中新增以下 Gradle 屬性：

  ```none
  # gradle