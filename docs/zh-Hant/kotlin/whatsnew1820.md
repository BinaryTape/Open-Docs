[//]: # (title: Kotlin 1.8.20 有什麼新功能)

_[發佈時間：2023 年 4 月 25 日](releases.md#release-details)_

Kotlin 1.8.20 版本已釋出，以下是它的一些最大亮點：

*   [新的 Kotlin K2 編譯器更新](#new-kotlin-k2-compiler-updates)
*   [新的實驗性 Kotlin/Wasm 目標](#new-kotlin-wasm-target)
*   [Gradle 中預設啟用新的 JVM 增量編譯](#new-jvm-incremental-compilation-by-default-in-gradle)
*   [Kotlin/Native 目標的更新](#update-for-kotlin-native-targets)
*   [Kotlin Multiplatform 中 Gradle 複合建構的預覽](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
*   [Xcode 中 Gradle 錯誤輸出的改進](#improved-output-for-gradle-errors-in-xcode)
*   [標準函式庫中 `AutoCloseable` 介面的實驗性支援](#support-for-the-autocloseable-interface)
*   [標準函式庫中 Base64 編碼的實驗性支援](#support-for-base64-encoding)

您也可以在這段影片中找到變更的簡短概述：

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="What's new in Kotlin 1.8.20"/>

## IDE 支援

支援 1.8.20 的 Kotlin 外掛程式適用於：

| IDE            | 支援的版本            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |

> 為了正確下載 Kotlin Artifact (產物) 和依賴項，請[設定 Gradle 設定](#configure-gradle-settings)以使用 Maven Central 儲存庫。
>
{style="warning"}

## 新的 Kotlin K2 編譯器更新

Kotlin 團隊持續穩定化 K2 編譯器。如[Kotlin 1.7.0 公告](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)中所述，它仍處於 **Alpha** 階段。此版本引入了邁向 [K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604) 的進一步改進。

從 1.8.20 版本開始，Kotlin K2 編譯器：

*   提供序列化外掛程式的預覽版本。
*   提供 [JS IR 編譯器](js-ir-compiler.md)的 Alpha 支援。
*   引入了[新語言版本 Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/) 的未來版本。

在以下影片中了解有關新編譯器及其優勢的更多資訊：

*   [每個 Kotlin 開發者都必須了解的全新 Kotlin K2 編譯器](https://www.youtube.com/watch?v=iTdJJq_LyoY)
*   [新的 Kotlin K2 編譯器：專家評論](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何啟用 Kotlin K2 編譯器

要啟用並測試 Kotlin K2 編譯器，請使用以下編譯器選項啟用新語言版本：

```bash
-language-version 2.0
```

您可以在 `build.gradle(.kts)` 檔案中指定它：

```kotlin
kotlin {
   sourceSets.all {
       languageSettings {
           languageVersion = "2.0"
       }
   }
}
```

先前的 `-Xuse-k2` 編譯器選項已棄用。

> 新 K2 編譯器的 Alpha 版本僅適用於 JVM 和 JS IR 專案。它尚不支援 Kotlin/Native 或任何多平台專案。
>
{style="warning"}

### 對新 K2 編譯器留下您的意見回饋

我們將不勝感激您的任何意見回饋！

*   直接在 Kotlin Slack 上向 K2 開發者提供您的意見回饋 – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
*   在[我們的問題追蹤器](https://kotl.in/issue)上回報您在使用新 K2 編譯器時遇到的任何問題。
*   [啟用「傳送使用統計資料」選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，以允許 JetBrains 收集有關 K2 使用情況的匿名資料。

## 語言

隨著 Kotlin 的持續演進，我們在 1.8.20 中引入了新語言功能的預覽版本：

*   [Enum 類別 `values` 函式的一個現代且高效能的替代方案](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
*   [用於與資料類別對稱的資料物件](#preview-of-data-objects-for-symmetry-with-data-classes)
*   [解除對內嵌類別中帶有函式體的次要建構函式的限制預覽](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum 類別 `values` 函式的一個現代且高效能的替代方案

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。需要選擇啟用（詳情如下）。僅用於評估目的。我們將不勝感激您在 [YouTrack](https://kotl.in/issue) 上對此的意見回饋。
>
{style="warning"}

列舉類別具有一個合成的 `values()` 函式，它返回一個已定義列舉常數的陣列。然而，在 Kotlin 和 Java 中使用陣列可能會導致[隱藏的效能問題](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues)。此外，大多數 API 都使用集合，這需要最終的轉換。為了解決這些問題，我們為列舉類別引入了 `entries` 屬性，它應該用來替代 `values()` 函式。當被呼叫時，`entries` 屬性會返回一個預先分配的不可變列舉常數列表。

> `values()` 函式仍然受支援，但我們建議您改用 `entries` 屬性。
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

#### 如何啟用 `entries` 屬性

若要試用此功能，請選擇啟用 `@OptIn(ExperimentalStdlibApi)` 並啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過將以下內容新增至 `build.gradle(.kts)` 檔案中來實現：

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

> 從 IntelliJ IDEA 2023.1 開始，如果您已選擇啟用此功能，適當的 IDE 檢查將通知您從 `values()` 轉換為 `entries` 並提供快速修復。
>
{style="tip"}

有關該提案的更多資訊，請參閱 [KEEP 說明](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)。

### 用於與資料類別對稱的資料物件預覽

資料物件允許您宣告具有單例語義和清晰 `toString()` 表示的物件。在此程式碼片段中，您可以看到向物件宣告添加 `data` 關鍵字如何改進其 `toString()` 輸出閱讀性：

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

特別對於 `sealed` 階層（例如 `sealed class` 或 `sealed interface` 階層），`data objects` 是絕佳的選擇，因為它們可以方便地與 `data class` 宣告一起使用。在此程式碼片段中，將 `EndOfFile` 宣告為 `data object` 而不是普通 `object` 意味著它將獲得一個漂亮的 `toString`，而無需手動覆寫。這保持了與隨附資料類別定義的對稱性。

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

#### 資料物件的語義

自其在 [Kotlin 1.7.20](whatsnew1720.md#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects) 中的第一個預覽版本以來，資料物件的語義已得到完善。編譯器現在會自動為它們產生許多便利函式：

##### toString

資料物件的 `toString()` 函式返回物件的簡單名稱：

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals 和 hashCode

`data object` 的 `equals()` 函式確保所有具有 `data object` 類型的物件都被視為相等。在大多數情況下，您在執行時只會有一個資料物件實例（畢竟，`data object` 宣告了一個單例）。但是，在執行時產生同一類型另一個物件的特殊情況下（例如，透過 `java.lang.reflect` 進行平台反射，或使用在底層使用此 API 的 JVM 序列化函式庫），這可以確保這些物件被視為相等。

請確保只以結構方式比較 `data objects`（使用 `==` 運算子），而不是參考方式（`===` 運算子）。這有助於避免在執行時存在多個資料物件實例時的陷阱。以下程式碼片段說明了此特定特殊情況：

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // MySingleton
    println(evilTwin) // MySingleton

    // 即使函式庫強制建立 MySingleton 的第二個實例，其 `equals` 方法也會返回 true：
    println(MySingleton == evilTwin) // true

    // 不要透過 === 比較資料物件。
    println(MySingleton === evilTwin) // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 反射不允許實例化資料物件。
    // 這會「強制」建立一個新的 MySingleton 實例（即 Java 平台反射）
    // 自己不要這樣做！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

所產生的 `hashCode()` 函式的行為與 `equals()` 函式的行為一致，因此 `data object` 的所有執行時實例都具有相同的雜湊碼。

##### 資料物件沒有 `copy` 和 `componentN` 函式

雖然 `data object` 和 `data class` 宣告通常一起使用並有一些相似之處，但對於 `data object`，不會產生某些函式：

由於 `data object` 宣告旨在用作單例物件，因此不會產生 `copy()` 函式。單例模式限制了類別的實例化為單一實例，而允許建立實例的副本將違反該限制。

此外，與 `data class` 不同，`data object` 沒有任何資料屬性。由於嘗試解構此類物件沒有意義，因此不會產生 `componentN()` 函式。

我們將不勝感激您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-4107) 上對此功能的意見回饋。

#### 如何啟用資料物件預覽

要試用此功能，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過將以下內容新增至 `build.gradle(.kts)` 檔案中來實現：

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

### 解除對內嵌類別中帶有函式體的次要建構函式的限制預覽

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。需要選擇啟用（詳情如下）。僅用於評估目的。我們將不勝感激您在 [YouTrack](https://kotl.in/issue) 上對此的意見回饋。
>
{style="warning"}

Kotlin 1.8.20 解除了對[內嵌類別](inline-classes.md)中帶有函式體的次要建構函式的使用限制。

內嵌類別過去只允許沒有 `init` 區塊或次要建構函式的公共主建構函式，以便具有清晰的初始化語義。因此，不可能封裝底層值或建立表示某些受限值的內嵌類別。

這些問題在 Kotlin 1.4.30 解除 `init` 區塊的限制時得到解決。現在我們更進一步，允許在預覽模式下使用帶有函式體的次要建構函式：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // 允許從 Kotlin 1.4.30 開始：
    init { 
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }

    // 預覽功能從 Kotlin 1.8.20 開始可用：
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

#### 如何啟用帶有函式體的次要建構函式

要試用此功能，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過將以下內容新增至 `build.gradle(.kts)` 中來實現：

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

我們鼓勵您試用此功能並在 [YouTrack](https://kotl.in/issue) 中提交所有報告，以幫助我們在 Kotlin 1.9.0 中將其設為預設。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中了解有關 Kotlin 內嵌類別開發的更多資訊。

## 新的 Kotlin/Wasm 目標

Kotlin/Wasm (Kotlin WebAssembly) 在此版本中進入[實驗性](components-stability.md#stability-levels-explained)階段。Kotlin 團隊認為 [WebAssembly](https://webassembly.org/) 是一項很有前景的技術，並希望找到更好的方法讓您使用它並獲得 Kotlin 的所有優勢。

WebAssembly 二進位格式獨立於平台，因為它使用自己的虛擬機器執行。幾乎所有現代瀏覽器都已經支援 WebAssembly 1.0。要設定執行 WebAssembly 的環境，您只需啟用 Kotlin/Wasm 目標所需的實驗性垃圾收集模式。您可以在此處找到詳細說明：[如何啟用 Kotlin/Wasm](#how-to-enable-kotlin-wasm)。

我們想強調新 Kotlin/Wasm 目標的以下優點：

*   與 `wasm32` Kotlin/Native 目標相比，編譯速度更快，因為 Kotlin/Wasm 無需使用 LLVM。
*   由於 [Wasm 垃圾收集](https://github.com/WebAssembly/gc)，與 `wasm32` 目標相比，與 JS 的互操作性以及與瀏覽器的整合更容易。
*   與 Kotlin/JS 和 JavaScript 相比，應用程式啟動可能更快，因為 Wasm 具有緊湊且易於解析的位元組碼。
*   與 Kotlin/JS 和 JavaScript 相比，應用程式執行時效能更高，因為 Wasm 是一種靜態型別語言。

從 1.8.20 版本開始，您可以在實驗性專案中使用 Kotlin/Wasm。我們開箱即用地為 Kotlin/Wasm 提供 Kotlin 標準函式庫 (`stdlib`) 和測試函式庫 (`kotlin.test`)。IDE 支援將在未來版本中添加。

[在此 YouTube 影片中了解有關 Kotlin/Wasm 的更多資訊](https://www.youtube.com/watch?v=-pqz9sKXatw)。

### 如何啟用 Kotlin/Wasm

要啟用和測試 Kotlin/Wasm，請更新您的 `build.gradle.kts` 檔案：

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

> 請查看 [Kotlin/Wasm 範例的 GitHub 儲存庫](https://github.com/Kotlin/kotlin-wasm-examples)。
>
{style="tip"}

要執行 Kotlin/Wasm 專案，您需要更新目標環境的設定：

<tabs>
<tab title="Chrome">

*   對於版本 109：

    使用 `--js-flags=--experimental-wasm-gc` 命令列引數執行應用程式。

*   對於版本 110 或更高版本：

    1.  在瀏覽器中前往 `chrome://flags/#enable-webassembly-garbage-collection`。
    2.  啟用 **WebAssembly Garbage Collection**。
    3.  重新啟動瀏覽器。

</tab>
<tab title="Firefox">

對於版本 109 或更高版本：

1.  在瀏覽器中前往 `about:config`。
2.  啟用 `javascript.options.wasm_function_references` 和 `javascript.options.wasm_gc` 選項。
3.  重新啟動瀏覽器。

</tab>
<tab title="Edge">

對於版本 109 或更高版本：

使用 `--js-flags=--experimental-wasm-gc` 命令列引數執行應用程式。

</tab>
</tabs>

### 對 Kotlin/Wasm 留下您的意見回饋

我們將不勝感激您的任何意見回饋！

*   直接在 Kotlin Slack 上向開發者提供您的意見回饋 – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)並加入 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 頻道。
*   在[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-56492)上回報您在使用 Kotlin/Wasm 時遇到的任何問題。

## Kotlin/JVM

Kotlin 1.8.20 引入了 [Java 合成屬性參考的預覽](#preview-of-java-synthetic-property-references)以及 [kapt 存根產生任務中預設支援 JVM IR 後端](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)。

### Java 合成屬性參考的預覽

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。僅用於評估目的。我們將不勝感激您在 [YouTrack](https://kotl.in/issue) 上對此的意見回饋。
>
{style="warning"}

Kotlin 1.8.20 引入了建立 Java 合成屬性參考的功能，例如，對於以下 Java 程式碼：

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

Kotlin 一直允許您編寫 `person.age`，其中 `age` 是一個合成屬性。現在，您還可以建立 `Person::age` 和 `person::age` 的參考。對於 `name` 也同樣適用。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // 呼叫 Java 合成屬性參考：
        .sortedBy(Person::age)
        // 透過 Kotlin 屬性語法呼叫 Java getter：
        .forEach { person -> println(person.name) }
```
{validate="false"}

#### 如何啟用 Java 合成屬性參考

要試用此功能，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過將以下內容新增至 `build.gradle(.kts)` 中來實現：

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

### kapt 存根產生任務中預設支援 JVM IR 後端

在 Kotlin 1.7.20 中，我們引入了 [kapt 存根產生任務中對 JVM IR 後端的支援](whatsnew1720.md#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)。從此版本開始，此支援預設啟用。您不再需要在 `gradle.properties` 中指定 `kapt.use.jvm.ir=true` 來啟用它。我們將不勝感激您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 上對此功能的意見回饋。

## Kotlin/Native

Kotlin 1.8.20 包含對支援的 Kotlin/Native 目標、與 Objective-C 的互操作性以及 CocoaPods Gradle 外掛程式的改進等變更：

*   [Kotlin/Native 目標的更新](#update-for-kotlin-native-targets)
*   [舊版記憶體管理器已棄用](#deprecation-of-the-legacy-memory-manager)
*   [支援帶有 `@import` 指令的 Objective-C 標頭檔](#support-for-objective-c-headers-with-import-directives)
*   [Cocoapods Gradle 外掛程式中對僅連結模式的支援](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
*   [在 UIKit 中將 Objective-C 擴充功能作為類別成員匯入](#import-objective-c-extensions-as-class-members-in-uikit)
*   [編譯器中編譯器快取管理的重新實作](#reimplementation-of-compiler-cache-management-in-the-compiler)
*   [Cocoapods Gradle 外掛程式中 `useLibraries()` 的棄用](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Native 目標的更新
  
Kotlin 團隊決定重新審視 Kotlin/Native 支援的目標列表，將它們分為多個層級，並從 Kotlin 1.8.20 開始棄用其中一些。有關支援和已棄用目標的完整列表，請參閱 [Kotlin/Native 目標支援](native-target-support.md)部分。

以下目標已隨 Kotlin 1.8.20 棄用，並將在 1.9.20 中移除：

*   `iosArm32`
*   `watchosX86`
*   `wasm32`
*   `mingwX86`
*   `linuxArm32Hfp`
*   `linuxMips32`
*   `linuxMipsel32`

至於其餘目標，現在有三個支援層級，具體取決於目標在 Kotlin/Native 編譯器中的支援和測試程度。目標可以移至不同的層級。例如，我們將盡力在未來為 `iosArm64` 提供全面支援，因為它對 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 至關重要。

如果您是函式庫作者，這些目標層級可以幫助您決定在 CI 工具上測試哪些目標以及跳過哪些目標。Kotlin 團隊在開發官方 Kotlin 函式庫時也將採用相同的方法，例如 [kotlinx.coroutines](coroutines-guide.md)。

查看我們的[部落格文章](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/)，了解有關這些變更原因的更多資訊。

### 舊版記憶體管理器已棄用

從 1.8.20 開始，舊版記憶體管理器已棄用，並將在 1.9.20 中移除。[新記憶體管理器](native-memory-manager.md)已在 1.7.20 中預設啟用，並持續接收進一步的穩定性更新和效能改進。

如果您仍在使用舊版記憶體管理器，請從 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=strict` 選項，並遵循我們的[遷移指南](native-migration-guide.md)進行必要的變更。

新記憶體管理器不支援 `wasm32` 目標。此目標也[從此版本開始](#update-for-kotlin-native-targets)棄用，並將在 1.9.20 中移除。

### 支援帶有 @import 指令的 Objective-C 標頭檔

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。需要選擇啟用（詳情如下）。僅用於評估目的。我們將不勝感激您在 [YouTrack](https://kotl.in/issue) 上對此的意見回饋。
>
{style="warning"}

Kotlin/Native 現在可以匯入帶有 `@import` 指令的 Objective-C 標頭檔。此功能對於使用帶有自動產生 Objective-C 標頭檔的 Swift 函式庫或以 Swift 編寫的 CocoaPods 依賴項的類別非常有用。

以前，cinterop 工具無法分析透過 `@import` 指令依賴 Objective-C 模組的標頭檔。原因是它缺少對 `-fmodules` 選項的支援。

從 Kotlin 1.8.20 開始，您可以使用帶有 `@import` 的 Objective-C 標頭檔。為此，請在定義檔案中將 `-fmodules` 選項作為 `compilerOpts` 傳遞給編譯器。如果您使用 [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)，請在 `pod()` 函式的設定區塊中指定 cinterop 選項，如下所示：

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

這是一個[備受期待的功能](https://youtrack.jetbrains.com/issue/KT-39120)，我們歡迎您在 [YouTrack](https://kotl.in/issue) 上提供有關它的意見回饋，以幫助我們在未來版本中將其設為預設。

### Cocoapods Gradle 外掛程式中對僅連結模式的支援

透過 Kotlin 1.8.20，您可以將 Pod 依賴項與動態框架僅用於連結，而無需產生 cinterop 綁定。這在 cinterop 綁定已產生時可能會派上用場。

考慮一個包含 2 個模組的專案，一個函式庫和一個應用程式。函式庫依賴於 Pod 但不產生框架，只產生 `.klib`。應用程式依賴於函式庫並產生動態框架。在這種情況下，您需要將此框架與函式庫所依賴的 Pod 連結，但您不需要 cinterop 綁定，因為它們已為函式庫產生。

要啟用此功能，請在添加對 Pod 的依賴項時使用 `linkOnly` 選項或構建器屬性：

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

> 如果您將此選項與靜態框架一起使用，它將完全移除 Pod 依賴項，因為 Pod 不用於靜態框架連結。
>
{style="note"}

### 在 UIKit 中將 Objective-C 擴充功能作為類別成員匯入

自 Xcode 14.1 以來，Objective-C 類別中的一些方法已移至類別成員。這導致產生了不同的 Kotlin API，並且這些方法被匯入為 Kotlin 擴充功能而不是方法。

您可能在覆寫使用 UIKit 的方法時遇到過因此類別問題。例如，在 Kotlin 中子類化 UIVIew 時，無法覆寫 `drawRect()` 或 `layoutSubviews()` 方法。

自 1.8.20 以來，在與 NSView 和 UIView 類別相同的標頭檔中宣告的類別成員被匯入為這些類別的成員。這意味著從 NSView 和 UIView 子類化的方法可以像任何其他方法一樣輕鬆覆寫。

如果一切順利，我們計劃在所有 Objective-C 類別中預設啟用此行為。

### 編譯器中編譯器快取管理的重新實作

為了加速編譯器快取的演進，我們已將編譯器快取管理從 Kotlin Gradle 外掛程式移至 Kotlin/Native 編譯器。這解除了對多項重要改進的工作，包括與編譯時間和編譯器快取彈性相關的改進。

如果您遇到問題並需要恢復舊行為，請使用 `kotlin.native.cacheOrchestration=gradle` Gradle 屬性。

我們將不勝感激您在 [YouTrack](https://kotl.in/issue) 上對此的意見回饋。

### Cocoapods Gradle 外掛程式中 `useLibraries()` 的棄用

Kotlin 1.8.20 開始棄用用於靜態函式庫的 [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)中的 `useLibraries()` 函式。

我們引入 `useLibraries()` 函式是為了允許依賴包含靜態函式庫的 Pod。隨著時間的推移，這種情況變得非常罕見。大多數 Pod 都以原始碼形式分發，而 Objective-C 框架或 XCFrameworks 是二進位分發的常見選擇。

由於此函式不受歡迎，並且它產生了使 Kotlin CocoaPods Gradle 外掛程式開發複雜化的問題，我們決定棄用它。

有關框架和 XCFrameworks 的更多資訊，請參閱[建構最終原生二進位檔](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。

## Kotlin Multiplatform

Kotlin 1.8.20 致力於透過 Kotlin Multiplatform 的以下更新來改善開發人員體驗：

*   [設定原始碼集層次結構的新方法](#new-approach-to-source-set-hierarchy)
*   [Kotlin Multiplatform 中 Gradle 複合建構支援的預覽](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
*   [Xcode 中 Gradle 錯誤輸出的改進](#improved-output-for-gradle-errors-in-xcode)

### 設定原始碼集層次結構的新方法

> 設定原始碼集層次結構的新方法為[實驗性](components-stability.md#stability-levels-explained)。它可能在未來的 Kotlin 版本中在不另行通知的情況下更改。需要選擇啟用（詳情如下）。我們將不勝感激您在 [YouTrack](https://kotl.in/issue) 上的意見回饋。
>
{style="warning"}

Kotlin 1.8.20 提供了一種在多平台專案中設定原始碼集層次結構的新方法 − 預設目標層次結構。新方法旨在取代像 `ios` 這樣的目標捷徑，它們有其[設計缺陷](#why-replace-shortcuts)。

預設目標層次結構背後的想法很簡單：您明確宣告專案編譯到的所有目標，而 Kotlin Gradle 外掛程式會根據指定的目標自動建立共享原始碼集。

#### 設定您的專案

考慮以下一個簡單的多平台行動應用程式範例：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // 啟用預設目標層次結構：
    targetHierarchy.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

您可以將預設目標層次結構視為所有可能目標及其共享原始碼集的範本。當您在程式碼中宣告最終目標 `android`、`iosArm64` 和 `iosSimulatorArm64` 時，Kotlin Gradle 外掛程式會從範本中找到合適的共享原始碼集並為您建立它們。產生的層次結構如下所示：

![使用預設目標層次結構的範例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

綠色原始碼集在專案中實際建立並存在，而預設範本中的灰色原始碼集則被忽略。如您所見，Kotlin Gradle 外掛程式沒有建立 `watchos` 原始碼集，例如，因為專案中沒有 watchOS 目標。

如果您添加 watchOS 目標，例如 `watchosArm64`，則會建立 `watchos` 原始碼集，並且來自 `apple`、`native` 和 `common` 原始碼集的程式碼也會編譯到 `watchosArm64`。

您可以在[文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)中找到預設目標層次結構的完整方案。

> 在此範例中，`apple` 和 `native` 原始碼集僅編譯到 `iosArm64` 和 `iosSimulatorArm64` 目標。因此，儘管它們的名稱如此，它們仍可存取完整的 iOS API。對於像 `native` 這樣的原始碼集，這可能會違反直覺，因為您可能期望只有所有原生目標上可用的 API 才能在此原始碼集中存取。此行為將來可能會改變。
>
{style="note"}

#### 為何取代捷徑 {initial-collapse-state="collapsed" collapsible="true"}

建立原始碼集層次結構可能冗長、容易出錯且對初學者不友好。我們之前的解決方案是引入像 `ios` 這樣的捷徑，為您建立部分層次結構。然而，事實證明，使用捷徑有一個很大的設計缺陷：它們難以更改。

以 `ios` 捷徑為例。它只會建立 `iosArm64` 和 `iosX64` 目標，這可能會令人困惑，並可能導致在需要 `iosSimulatorArm64` 目標的 M1 主機上工作時出現問題。然而，添加 `iosSimulatorArm64` 目標對於使用者專案來說可能是一個非常具有破壞性的變更：

*   `iosMain` 原始碼集中使用的所有依賴項都必須支援 `iosSimulatorArm64` 目標；否則，依賴項解析將失敗。
*   在 `iosMain` 中使用的一些原生 API 在添加新目標時可能會消失（儘管在 `iosSimulatorArm64` 的情況下不太可能）。
*   在某些情況下，例如在 Intel 型 MacBook 上編寫一個小型寵物專案時，您甚至可能不需要此更改。

顯然，捷徑並未解決設定層次結構的問題，這就是我們在某個時候停止添加新捷徑的原因。

預設目標層次結構乍看之下可能與捷徑相似，但它們有一個關鍵區別：**使用者必須明確指定目標集**。此集定義了您的專案如何編譯和發佈，以及它如何參與依賴項解析。由於此集是固定的，因此 Kotlin Gradle 外掛程式的預設設定更改應會顯著減少生態系統中的困擾，並且提供工具輔助遷移將更容易。

#### 如何啟用預設層次結構

此新功能為[實驗性](components-stability.md#stability-levels-explained)。對於 Kotlin Gradle 建構腳本，您需要選擇啟用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)`。

有關更多資訊，請參閱[階層式專案結構](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)。

#### 留下意見回饋

這對多平台專案來說是一個重大變更。我們將不勝感激您的[意見回饋](https://kotl.in/issue)以幫助使其變得更好。

### Kotlin Multiplatform 中 Gradle 複合建構支援的預覽

> 自 Kotlin Gradle 外掛程式 1.8.20 起，此功能已在 Gradle 建構中受支援。對於 IDE 支援，請使用 IntelliJ IDEA 2023.1 Beta 2 (231.8109.2) 或更高版本，以及帶有任何 Kotlin IDE 外掛程式的 Kotlin Gradle 外掛程式 1.8.20。
>
{style="note"}

從 1.8.20 開始，Kotlin Multiplatform 支援 [Gradle 複合建構](https://docs.gradle.org/current/userguide/composite_builds.html)。複合建構允許您將單獨專案的建構或同一專案的部分包含在單一建構中。

由於某些技術挑戰，使用 Gradle 複合建構與 Kotlin Multiplatform 僅部分支援。Kotlin 1.8.20 包含改進支援的預覽，該支援應適用於更多種類的專案。要試用它，請將以下選項添加到您的 `gradle.properties` 中：

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

此選項啟用新匯入模式的預覽。除了支援複合建構之外，它還在多平台專案中提供了更順暢的匯入體驗，因為我們包含了主要的錯誤修復和改進，以使匯入更加穩定。

#### 已知問題

這仍然是一個需要進一步穩定化的預覽版本，您可能會在匯入過程中遇到一些問題。以下是我們計劃在 Kotlin 1.8.20 最終發佈之前修復的一些已知問題：

*   IntelliJ IDEA 2023.1 EAP 尚未提供 Kotlin 1.8.20 外掛程式。儘管如此，您仍然可以將 Kotlin Gradle 外掛程式版本設定為 1.8.20，並在此 IDE 中試用複合建構。
*   如果您的專案包含帶有指定 `rootProject.name` 的建構，複合建構可能無法解析 Kotlin 中繼資料。有關變通方法和詳細資訊，請參閱[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-56536)。

我們鼓勵您試用並在 [YouTrack](https://kotl.in/issue) 上提交所有報告，以幫助我們在 Kotlin 1.9.0 中將其設為預設。

### Xcode 中 Gradle 錯誤輸出的改進

如果您在 Xcode 中建構多平台專案時遇到問題，您可能會遇到「Command PhaseScriptExecution failed with a nonzero exit code」錯誤。此訊息表示 Gradle 呼叫失敗，但在嘗試偵測問題時並沒有太大幫助。

從 Kotlin 1.8.20 開始，Xcode 可以解析來自 Kotlin/Native 編譯器的輸出。此外，如果 Gradle 建構失敗，您將在 Xcode 中看到來自根本原因異常的額外錯誤訊息。在大多數情況下，這將有助於識別根本問題。

![Xcode 中 Gradle 錯誤輸出的改進](xcode-gradle-output.png){width=700}

新行為預設啟用，適用於 Xcode 整合的標準 Gradle 任務，例如 `embedAndSignAppleFrameworkForXcode`，它可以將多平台專案中的 iOS 框架連接到 Xcode 中的 iOS 應用程式。也可以使用 `kotlin.native.useXcodeMessageStyle` Gradle 屬性啟用（或停用）它。

## Kotlin/JavaScript

Kotlin 1.8.20 改變了產生 TypeScript 定義的方式。它還包含旨在改善您的偵錯體驗的變更：

*   [從 Gradle 外掛程式中移除 Dukat 整合](#removal-of-dukat-integration-from-gradle-plugin)
*   [原始碼對應中的 Kotlin 變數和函式名稱](#kotlin-variable-and-function-names-in-source-maps)
*   [選擇啟用 TypeScript 定義檔案的產生](#opt-in-for-generation-of-typescript-definition-files)

### 從 Gradle 外掛程式中移除 Dukat 整合

在 Kotlin 1.8.20 中，我們已從 Kotlin/JavaScript Gradle 外掛程式中移除了我們的[實驗性](components-stability.md#stability-levels-explained) Dukat 整合。Dukat 整合支援將 TypeScript 宣告檔案 (`.d.ts`) 自動轉換為 Kotlin 外部宣告。

您仍然可以透過使用我們的 [Dukat 工具](https://github.com/Kotlin/dukat)將 TypeScript 宣告檔案 (`.d.ts`) 轉換為 Kotlin 外部宣告。

> Dukat 工具為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。
>
{style="warning"}

### 原始碼對應中的 Kotlin 變數和函式名稱

為了幫助偵錯，我們引入了將您在 Kotlin 程式碼中宣告的變數和函式名稱添加到原始碼對應中的功能。在 1.8.20 之前，這些名稱在原始碼對應中不可用，因此在偵錯器中，您總是看到所產生 JavaScript 的變數和函式名稱。

您可以使用 `sourceMapNamesPolicy` 在您的 Gradle 檔案 `build.gradle.kts` 中設定要添加的內容，或者使用 `-source-map-names-policy` 編譯器選項。下表列出了可能的設定：

| 設定                 | 描述                                                                | 範例輸出                    |
|-------------------------|---------------------------------------------------------------------|-----------------------------------|
| `simple-names`          | 添加變數名稱和簡單函式名稱。（預設）                                | `main`                            |
| `fully-qualified-names` | 添加變數名稱和完全合格的函式名稱。                            | `com.example.kjs.playground.main` |
| `no`                    | 不添加任何變數或函式名稱。                                          | 不適用                               |

請參閱以下 `build.gradle.kts` 檔案中的範例設定：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.Kotlin2JsCompile>().configureEach {
    compilerOptions.sourceMapNamesPolicy.set(org.jetbrains.kotlin.gradle.dsl.JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES) // or SOURCE_MAP_NAMES_POLICY_NO, or SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES
}
```
{validate="false"}

偵錯工具，例如基於 Chromium 瀏覽器中提供的工具，可以從您的原始碼對應中獲取原始 Kotlin 名稱，以提高堆疊追蹤的可讀性。祝您偵錯愉快！

> 原始碼對應中添加變數和函式名稱為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。
>
{style="warning"}

### 選擇啟用 TypeScript 定義檔案的產生

以前，如果您的專案產生可執行檔 (`binaries.executable()`)，Kotlin/JS IR 編譯器會收集任何標記有 `@JsExport` 的頂層宣告，並自動在 `.d.ts` 檔案中產生 TypeScript 定義。

由於這對於每個專案都不是必需的，我們在 Kotlin 1.8.20 中改變了此行為。如果您想產生 TypeScript 定義，則必須在您的 Gradle 建構檔案中明確設定此功能。將 `generateTypeScriptDefinitions()` 添加到您的 `build.gradle.kts.file` 中的 [`js` 區塊](js-project-setup.md#execution-environments)。例如：

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

> TypeScript 定義 (`d.ts`) 的產生為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。
>
{style="warning"}

## Gradle

Kotlin 1.8.20 完全相容於 Gradle 6.8 到 7.6，除了 [Multiplatform 外掛程式中的一些特殊情況](https://youtrack.jetbrains.com/issue/KT-55751)。您也可以使用最新的 Gradle 版本，但如果您這樣做，請記住您可能會遇到棄用警告或某些新的 Gradle 功能可能無法正常運作。

此版本帶來了以下變更：

*   [Gradle 外掛程式版本的新對齊方式](#new-gradle-plugins-versions-alignment)
*   [Gradle 中預設啟用新的 JVM 增量編譯](#new-jvm-incremental-compilation-by-default-in-gradle)
*   [編譯任務輸出的精確備份](#precise-backup-of-compilation-tasks-outputs)
*   [所有 Gradle 版本都延遲建立 Kotlin/JVM 任務](#lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions)
*   [編譯任務 `destinationDirectory` 的非預設位置](#non-default-location-of-compile-tasks-destinationdirectory)
*   [選擇退出向 HTTP 統計服務回報編譯器引數的功能](#ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service)

### Gradle 外掛程式版本的新對齊方式

Gradle 提供了一種方法來確保必須協同工作的依賴項其[版本始終對齊](https://docs.gradle.org/current/userguide/dependency_version_alignment.html#aligning_versions_natively_with_gradle)。Kotlin 1.8.20 也採用了這種方法。它預設啟用，因此您無需更改或更新您的設定來啟用它。此外，您不再需要使用[此變通方法來解析 Kotlin Gradle 外掛程式的傳遞依賴項](whatsnew18.md#resolution-of-kotlin-gradle-plugins-transitive-dependencies)。

我們將不勝感激您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-54691) 上對此功能的意見回饋。

### Gradle 中預設啟用新的 JVM 增量編譯

新的增量編譯方法[自 Kotlin 1.7.0 起可用](whatsnew17.md#a-new-approach-to-incremental-compilation)，現在預設啟用。您不再需要在 `gradle.properties` 中指定 `kotlin.incremental.useClasspathSnapshot=true` 來啟用它。

我們將不勝感激您對此的意見回饋。您可以在 YouTrack 中[提交問題](https://kotl.in/issue)。

### 編譯任務輸出的精確備份

> 編譯任務輸出的精確備份為[實驗性](components-stability.md#stability-levels-explained)。要使用它，請將 `kotlin.compiler.preciseCompilationResultsBackup=true` 添加到 `gradle.properties`。我們將不勝感激您在 [YouTrack](https://kotl.in/issue/experimental-ic-optimizations) 上對此的意見回饋。
>
{style="warning"}

從 Kotlin 1.8.20 開始，您可以啟用精確備份，這樣只有在[增量編譯](gradle-compilation-and-caches.md#incremental-compilation)中重新編譯的類別才會被備份。完整備份和精確備份都有助於在編譯錯誤後再次增量執行建構。與完整備份相比，精確備份還節省了建構時間。在大型專案或許多任務正在備份時，完整備份可能需要**明顯的**建構時間，尤其是在專案位於慢速 HDD 上時。

此最佳化是實驗性的。您可以透過將 `kotlin.compiler.preciseCompilationResultsBackup` Gradle 屬性添加到 `gradle.properties` 檔案中來啟用它：

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrains 中精確備份使用範例 {initial-collapse-state="collapsed" collapsible="true"}

在以下圖表中，您可以看到與完整備份相比使用精確備份的範例：

![完整備份與精確備份的比較](comparison-of-full-and-precise-backups.png){width=700}

第一張和第二張圖表顯示了 Kotlin 專案中的精確備份如何影響 Kotlin Gradle 外掛程式的建構：

1.  在對許多模組都依賴的模組進行小型 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 更改（添加新公共方法）之後。
2.  在對沒有其他模組依賴的模組進行小型非 ABI 更改（添加私有函式）之後。

第三張圖表顯示了在對許多模組都依賴的 Kotlin/JS 模組進行小型非 ABI 更改（添加私有函式）之後，[Space](https://www.jetbrains.com/space/) 專案中的精確備份如何影響 Web 前端建構。

這些測量是在配備 Apple M1 Max CPU 的電腦上進行的；不同的電腦將產生略微不同的結果。影響效能的因素包括但不限於：

*   [Kotlin 守護程序](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)和 [Gradle 守護程序](https://docs.gradle.org/current/userguide/gradle_daemon.html)的活躍程度。
*   磁碟的速度快慢。
*   CPU 型號及其繁忙程度。
*   哪些模組受到更改影響以及這些模組的大小。
*   更改是 ABI 還是非 ABI。

#### 使用建構報告評估最佳化 {initial-collapse-state="collapsed" collapsible="true"}

要評估最佳化對您的電腦、專案和場景的影響，您可以使用 [Kotlin 建構報告](gradle-compilation-and-caches.md#build-reports)。透過將以下屬性添加到您的 `gradle.properties` 檔案中，以純文字檔案格式啟用報告：

```none
kotlin.build.report.output=file
```

以下是啟用精確備份之前報告相關部分的範例：

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.59 s
<...>
Time metrics:
 Total Gradle task time: 0.59 s
 Task action before worker execution: 0.24 s
  Backup output: 0.22 s // 注意這個數字 
<...>
```

以下是啟用精確備份之後報告相關部分的範例：

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.46 s
<...>
Time metrics:
 Total Gradle task time: 0.46 s
 Task action before worker execution: 0.07 s
  Backup output: 0.05 s // 時間已減少
 Run compilation in Gradle worker: 0.32 s
  Clear jar cache: 0.00 s
  Precise backup output: 0.00 s // 與精確備份相關
  Cleaning up the backup stash: 0.00 s // 與精確備份相關
<...>
```

### 所有 Gradle 版本都延遲建立 Kotlin/JVM 任務

對於在 Gradle 7.3+ 上使用 `org.jetbrains.kotlin.gradle.jvm` 外掛程式的專案，Kotlin Gradle 外掛程式不再急切地建立和設定 `compileKotlin` 任務。在較低的 Gradle 版本上，它只是註冊所有任務，並且在試執行時不設定它們。現在在使用 Gradle 7.3+ 時也適用相同的行為。

### 編譯任務 `destinationDirectory` 的非預設位置

如果您執行以下操作之一，請使用一些額外的程式碼更新您的建構腳本：

*   覆寫 Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 任務的 `destinationDirectory` 位置。
*   使用已棄用的 Kotlin/JS/非 IR [變體](gradle-plugin-variants.md)並覆寫 `Kotlin2JsCompile` 任務的 `destinationDirectory`。

您需要明確將 `sourceSets.main.kotlin.classesDirectories` 添加到 JAR 檔案中的 `sourceSets.main.outputs`：

```groovy
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

### 選擇退出向 HTTP 統計服務回報編譯器引數的功能

您現在可以控制 Kotlin Gradle 外掛程式是否應在 HTTP [建構報告](gradle-compilation-and-caches.md#build-reports)中包含編譯器引數。有時，您可能不需要外掛程式回報這些引數。如果專案包含許多模組，其報告中的編譯器引數可能會非常龐大且沒有太大幫助。現在有一種方法可以禁用它，從而節省記憶體。在您的 `gradle.properties` 或 `local.properties` 中，使用 `kotlin.build.report.include_compiler_arguments=(true|false)` 屬性。

我們將不勝感激您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55323/) 上對此功能的意見回饋。

## 標準函式庫

Kotlin 1.8.20 添加了各種新功能，其中一些對於 Kotlin/Native 開發特別有用：

*   [支援 `AutoCloseable` 介面](#support-for-the-autocloseable-interface)
*   [支援 Base64 編碼和解碼](#support-for-base64-encoding)
*   [支援 Kotlin/Native 中的 `@Volatile`](#support-for-volatile-in-kotlin-native)
*   [修復了在 Kotlin/Native 中使用正規表達式時的堆疊溢位錯誤](#bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native)

### 支援 `AutoCloseable` 介面

> 新的 `AutoCloseable` 介面為[實驗性](components-stability.md#stability-levels-explained)，要使用它，您需要選擇啟用 `@OptIn(ExperimentalStdlibApi::class)` 或編譯器引數 `-opt-in=kotlin.ExperimentalStdlibApi`。
>

{style="warning"}

`AutoCloseable` 介面已添加到通用標準函式庫中，以便您可以為所有函式庫使用一個通用介面來關閉資源。在 Kotlin/JVM 中，`AutoCloseable` 介面是 [`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html) 的別名。

此外，現在還包含擴充函式 `use()`，它在選定的資源上執行給定的區塊函式，然後正確關閉它，無論是否拋出異常。

通用標準函式庫中沒有實現 `AutoCloseable` 介面的公共類別。在下面的範例中，我們定義了 `XMLWriter` 介面，並假設有一個資源實現了它。例如，此資源可能是一個打開檔案、寫入 XML 內容然後關閉它的類別。

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

### 支援 Base64 編碼

> 新的編碼和解碼功能為[實驗性](components-stability.md#stability-levels-explained)，要使用它，您需要選擇啟用 `@OptIn(ExperimentalEncodingApi::class)` 或編譯器引數 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`。
>
{style="warning"}

我們已添加對 Base64 編碼和解碼的支援。我們提供 3 個類別實例，每個實例使用不同的編碼方案並顯示不同的行為。使用 `Base64.Default` 實例進行標準 [Base64 編碼方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)。

使用 `Base64.UrlSafe` 實例進行「[URL 和檔案名安全](https://www.rfc-editor.org/rfc/rfc4648#section-5)」編碼方案。

使用 `Base64.Mime` 實例進行 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 編碼方案。當您使用 `Base64.Mime` 實例時，所有編碼函式每 76 個字元插入一個換行符。在解碼情況下，任何非法字元都會被跳過並且不會拋出異常。

> `Base64.Default` 實例是 `Base64` 類別的伴生物件。因此，您可以透過 `Base64.encode()` 和 `Base64.decode()` 呼叫其函式，而不是 `Base64.Default.encode()` 和 `Base64.Default.decode()`。
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

您可以使用其他函式將位元組編碼或解碼到現有緩衝區中，以及將編碼結果附加到提供的 `Appendable` 類型物件。

在 Kotlin/JVM 中，我們還添加了擴充函式 `encodingWith()` 和 `decodingWith()`，使您能夠使用輸入和輸出流執行 Base64 編碼和解碼。

### 支援 Kotlin/Native 中的 @Volatile

> Kotlin/Native 中的 `@Volatile` 為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。需要選擇啟用（詳情如下）。僅用於評估目的。我們將不勝感激您在 [YouTrack](https://kotl.in/issue) 上對此的意見回饋。
>
{style="warning"}

如果您使用 `@Volatile` 註解 `var` 屬性，則支援欄位將被標記，以便對此欄位的任何讀取或寫入都是原子操作，並且寫入始終對其他執行緒可見。

在 1.8.20 之前，[`kotlin.jvm.Volatile` 註解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)在通用標準函式庫中可用。然而，此註解僅在 JVM 中有效。如果您在 Kotlin/Native 中使用它，它將被忽略，這可能導致錯誤。

在 1.8.20 中，我們引入了一個通用註解 `kotlin.concurrent.Volatile`，您可以在 JVM 和 Kotlin/Native 中使用它。

#### 如何啟用

要試用此功能，請選擇啟用 `@OptIn(ExperimentalStdlibApi)` 並啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過將以下內容新增至 `build.gradle(.kts)` 檔案中來實現：

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

### 修復了在 Kotlin/Native 中使用正規表達式時的堆疊溢位錯誤

在以前的 Kotlin 版本中，如果您的正規表達式輸入包含大量字元，即使正規表達式模式非常簡單，也可能發生崩潰。在 1.8.20 中，此問題已解決。有關更多資訊，請參閱 [KT-46211](https://youtrack.jetbrains.com/issue/KT-46211)。

## 序列化更新

Kotlin 1.8.20 支援 [Kotlin K2 編譯器的 Alpha 版序列化編譯器外掛程式](#prototype-serialization-compiler-plugin-for-kotlin-k2-compiler)並[禁止透過伴生物件自訂序列化器](#prohibit-implicit-serializer-customization-via-companion-object)。

### Kotlin K2 編譯器的原型序列化編譯器外掛程式

> K2 序列化編譯器外掛程式的支援處於 [Alpha](components-stability.md#stability-levels-explained) 階段。要使用它，請[啟用 Kotlin K2 編譯器](#how-to-enable-the-kotlin-k2-compiler)。
>
{style="warning"}

從 1.8.20 開始，序列化編譯器外掛程式與 Kotlin K2 編譯器協同工作。試一試並[與我們分享您的意見回饋](#leave-your-feedback-on-the-new-k2-compiler)！

### 禁止透過伴生物件隱式自訂序列化器

目前，可以透過 `@Serializable` 註解將類別宣告為可序列化，同時透過其伴生物件上的 `@Serializer` 註解宣告自訂序列化器。

例如：

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

在這種情況下，從 `@Serializable` 註解中不清楚使用了哪個序列化器。實際上，類別 `Foo` 有一個自訂序列化器。

為了防止這種混淆，在 Kotlin 1.8.20 中，我們引入了一個編譯器警告，當檢測到此場景時。該警告包括一個可能的遷移路徑來解決此問題。

如果您在程式碼中使用此類建構，我們建議將其更新為以下內容：

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

透過這種方法，很明顯 `Foo` 類別使用在伴生物件中宣告的自訂序列化器。有關更多資訊，請參閱我們的 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-54441)。

> 在 Kotlin 2.0 中，我們計劃將編譯警告提升為編譯錯誤。如果您看到此警告，我們建議您遷移程式碼。
>
{style="tip"}

## 文件更新

Kotlin 文件收到了一些顯著的變更：

*   [使用 Spring Boot 和 Kotlin 開始](jvm-get-started-spring-boot.md) – 建立一個帶有資料庫的簡單應用程式，並了解更多關於 Spring Boot 和 Kotlin 的功能。
*   [作用域函式](scope-functions.md) – 了解如何使用標準函式庫中有用的作用域函式簡化您的程式碼。
*   [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) – 設定工作環境以使用 CocoaPods。

## 安裝 Kotlin 1.8.20

### 檢查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.2 和 2022.3 會自動建議將 Kotlin 外掛程式更新到 1.8.20 版本。IntelliJ IDEA 2023.1 內建了 Kotlin 外掛程式 1.8.20。

Android Studio Flamingo (222) 和 Giraffe (223) 將在下一個版本中支援 Kotlin 1.8.20。

新的命令列編譯器可從 [GitHub 發佈頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20)下載。

### 設定 Gradle 設定

為了正確下載 Kotlin Artifact (產物) 和依賴項，請更新您的 `settings.gradle(.kts)` 檔案以使用 Maven Central 儲存庫：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

如果未指定儲存庫，Gradle 將使用已停用的 JCenter 儲存庫，這可能導致 Kotlin Artifact 問題。