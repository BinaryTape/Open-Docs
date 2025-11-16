`[//]: # (title: Kotlin 1.8.20 有什麼新功能)

_[發布日期：2023 年 4 月 25 日](releases.md#release-details)_

Kotlin 1.8.20 版本已發布，以下是其一些重要亮點：

*   [Kotlin K2 編譯器新功能更新](#new-kotlin-k2-compiler-updates)
*   [全新實驗性 Kotlin/Wasm 目標](#new-kotlin-wasm-target)
*   [Gradle 中 JVM 增量編譯預設開啟](#new-jvm-incremental-compilation-by-default-in-gradle)
*   [Kotlin/Native 目標更新](#update-for-kotlin-native-targets)
*   [Kotlin Multiplatform 中 Gradle 複合建構預覽](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
*   [Xcode 中 Gradle 錯誤輸出改進](#improved-output-for-gradle-errors-in-xcode)
*   [標準函式庫中 AutoCloseable 介面實驗性支援](#support-for-the-autocloseable-interface)
*   [標準函式庫中 Base64 編碼實驗性支援](#support-for-base64-encoding)

您也可以在此影片中找到變更的簡要概述：

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="Kotlin 1.8.20 有什麼新功能"/>

## IDE 支援

支援 1.8.20 的 Kotlin 外掛程式適用於：

| IDE            | 支援版本            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |

> 為了正確下載 Kotlin 構件 (artifacts) 和依賴項，請[配置 Gradle 設定](#configure-gradle-settings)以使用 Maven Central 儲存庫。
>
{style="warning"}

## Kotlin K2 編譯器新功能更新

Kotlin 團隊持續穩定 K2 編譯器。正如[Kotlin 1.7.0 公告](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)中所述，它仍處於 **Alpha** 階段。此版本為通往 [K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604) 之路引入了更多改進。

從 1.8.20 版本開始，Kotlin K2 編譯器：

*   具備序列化外掛程式的預覽版本。
*   提供 [JS IR 編譯器](js-ir-compiler.md)的 Alpha 支援。
*   引入了[新語言版本 Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/) 的未來發布。

透過以下影片了解更多關於新編譯器及其優勢：

*   [每個人都必須了解的全新 Kotlin K2 編譯器](https://www.youtube.com/watch?v=iTdJJq_LyoY)
*   [新 Kotlin K2 編譯器：專家評論](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何啟用 Kotlin K2 編譯器

若要啟用和測試 Kotlin K2 編譯器，請使用以下編譯器選項搭配新的語言版本：

```bash
-language-version 2.0
```

您可以在您的 `build.gradle(.kts)` 檔案中指定它：

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

### 提供您對新 K2 編譯器的意見回饋

我們非常感謝您的任何意見回饋！

*   直接向 Kotlin Slack 上的 K2 開發人員提供您的意見回饋 – [獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
*   在[我們的問題追蹤器](https://kotl.in/issue)上報告您在使用新 K2 編譯器時遇到的任何問題。
*   [啟用 **Send usage statistics** 選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，允許 JetBrains 收集關於 K2 使用情況的匿名數據。

## 語言

隨著 Kotlin 持續發展，我們在 1.8.20 版本中引入了新語言功能的預覽版本：

*   [Enum 類別 values 函式的現代化高效能替代方案](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
*   [用於與 data class 對稱的 data objects 預覽](#preview-of-data-objects-for-symmetry-with-data-classes)
*   [解除 inline classes 中帶有函式主體的次級建構函式限制預覽](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum 類別 values 函式的現代化高效能替代方案

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。需要選擇啟用（詳情請見下文）。僅用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上提供相關意見回饋。
>
{style="warning"}

Enum 類別具有一個合成 (synthetic) 的 `values()` 函式，它會返回一個定義好的列舉常數陣列。然而，在 Kotlin 和 Java 中，使用陣列可能導致[隱藏的效能問題](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues)。此外，大多數 API 使用集合 (collections)，這需要最終轉換。為了解決這些問題，我們為 Enum 類別引入了 `entries` 屬性，它應該取代 `values()` 函式使用。當呼叫時，`entries` 屬性會返回一個預先分配好的不可變 (immutable) 列舉常數列表。

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

#### 如何啟用 entries 屬性

若要試用此功能，請使用 `@OptIn(ExperimentalStdlibApi)` 選擇啟用，並啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過將以下內容添加到 `build.gradle(.kts)` 檔案中來實現：

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

> 從 IntelliJ IDEA 2023.1 開始，如果您已選擇啟用此功能，則相應的 IDE 檢查將通知您將 `values()` 轉換為 `entries` 並提供快速修復。
>
{style="tip"}

有關該提案的更多資訊，請參閱 [KEEP 說明](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)。

### 用於與 data class 對稱的 data objects 預覽

Data objects 允許您宣告具有單例 (singleton) 語義和簡潔 `toString()` 表示的物件。在此程式碼片段中，您可以看到如何透過在物件宣告中添加 `data` 關鍵字來提高其 `toString()` 輸出的可讀性：

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

特別對於 `sealed` 繼承層級 (例如 `sealed class` 或 `sealed interface` 繼承層級)，`data objects` 是絕佳的選擇，因為它們可以方便地與 `data class` 宣告一起使用。在此程式碼片段中，將 `EndOfFile` 宣告為 `data object` 而不是普通的 `object` 意味著它將獲得一個漂亮的 `toString`，而無需手動覆寫。這保持了與附帶的 data class 定義的對稱性。

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

#### data objects 的語義

自從在 [Kotlin 1.7.20](whatsnew1720.md#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects) 中首次預覽以來，data objects 的語義已得到完善。編譯器現在會自動為它們生成許多便利函式：

##### toString

data object 的 `toString()` 函式會返回物件的簡單名稱：

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals 和 hashCode

data object 的 `equals()` 函式確保所有與您的 `data object` 具有相同型別的物件都被視為相等。在大多數情況下，您在執行時只會有一個資料物件實例 (畢竟，`data object` 宣告了一個單例)。然而，在執行時產生另一個相同型別的物件的邊緣情況下 (例如，透過 `java.lang.reflect` 的平台反射，或使用在底層使用此 API 的 JVM 序列化函式庫)，這可以確保這些物件被視為相等。

請務必僅以結構方式 (使用 `==` 運算子) 比較 `data objects`，切勿以引用方式 (使用 `===` 運算子)。這有助於避免在執行時存在多個 data object 實例時的陷阱。以下程式碼片段說明了此特定邊緣情況：

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

生成的 `hashCode()` 函式的行為與 `equals()` 函式一致，因此 data object 的所有執行時實例都具有相同的雜湊碼 (hash code)。

##### data objects 沒有 copy 和 componentN 函式

雖然 `data object` 和 `data class` 宣告經常一起使用並有一些相似之處，但有些函式不會為 `data object` 生成：

由於 `data object` 宣告旨在用作單例物件，因此不會生成 `copy()` 函式。單例模式限制了類別的實例化為單一實例，允許創建實例的副本將違反該限制。

此外，與 `data class` 不同，`data object` 沒有任何資料屬性。由於嘗試解構此類物件沒有意義，因此不會生成 `componentN()` 函式。

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-4107) 上提供有關此功能的意見回饋。

#### 如何啟用 data objects 預覽

若要試用此功能，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過將以下內容添加到您的 `build.gradle(.kts)` 檔案中來實現：

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

### 解除 inline classes 中帶有函式主體的次級建構函式限制預覽

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。需要選擇啟用（詳情請見下文）。僅用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上提供相關意見回饋。
>
{style="warning"}

Kotlin 1.8.20 解除了[內聯類別 (inline classes)](inline-classes.md) 中使用帶有函式主體的次級建構函式的限制。

內聯類別過去只允許公開的主建構函式，不能帶有 `init` 區塊或次級建構函式，以便具有清晰的初始化語義。因此，不可能封裝底層值或創建表示某些受限值的內聯類別。

當 Kotlin 1.4.30 解除 `init` 區塊的限制時，這些問題得到了解決。現在，我們更進一步，在預覽模式下允許帶有函式主體的次級建構函式：

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

#### 如何啟用帶有函式主體的次級建構函式

若要試用此功能，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過將以下內容添加到您的 `build.gradle(.kts)` 中來實現：

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

我們鼓勵您試用此功能，並在 [YouTrack](https://kotl.in/issue) 中提交所有報告，以幫助我們在 Kotlin 1.9.0 中使其成為預設設定。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中了解更多關於 Kotlin 內聯類別的開發。

## 全新 Kotlin/Wasm 目標

Kotlin/Wasm (Kotlin WebAssembly) 在此版本中進入[實驗性](components-stability.md#stability-levels-explained)階段。Kotlin 團隊認為 [WebAssembly](https://webassembly.org/) 是一項很有前途的技術，並希望找到更好的方法讓您使用它並獲得 Kotlin 的所有優勢。

WebAssembly 二進位格式獨立於平台，因為它使用自己的虛擬機器運行。幾乎所有現代瀏覽器都已支援 WebAssembly 1.0。若要設定運行 WebAssembly 的環境，您只需啟用 Kotlin/Wasm 目標的實驗性垃圾收集模式。您可以在此處找到詳細說明：[如何啟用 Kotlin/Wasm](#how-to-enable-kotlin-wasm)。

我們想強調全新 Kotlin/Wasm 目標的以下優勢：

*   與 `wasm32` Kotlin/Native 目標相比，編譯速度更快，因為 Kotlin/Wasm 不需要使用 LLVM。
*   相較於 `wasm32` 目標，與 JS 的互通性以及與瀏覽器的整合更為容易，這歸功於 [Wasm 垃圾收集](https://github.com/WebAssembly/gc)。
*   與 Kotlin/JS 和 JavaScript 相比，應用程式啟動速度潛在更快，因為 Wasm 具有緊湊且易於解析的位元組碼。
*   與 Kotlin/JS 和 JavaScript 相比，應用程式執行時效能更高，因為 Wasm 是一種靜態型別語言。

從 1.8.20 版本開始，您可以在實驗性專案中使用 Kotlin/Wasm。我們為 Kotlin/Wasm 開箱即用提供了 Kotlin 標準函式庫 (`stdlib`) 和測試函式庫 (`kotlin.test`)。IDE 支援將在未來版本中添加。

[在此 YouTube 影片中了解更多關於 Kotlin/Wasm 的資訊](https://www.youtube.com/watch?v=-pqz9sKXatw)。

### 如何啟用 Kotlin/Wasm

若要啟用和測試 Kotlin/Wasm，請更新您的 `build.gradle.kts` 檔案：

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

> 查看[包含 Kotlin/Wasm 範例的 GitHub 儲存庫](https://github.com/Kotlin/kotlin-wasm-examples)。
>
{style="tip"}

若要運行 Kotlin/Wasm 專案，您需要更新目標環境的設定：

<tabs>
<tab title="Chrome">

*   對於版本 109：

    使用 `--js-flags=--experimental-wasm-gc` 命令列參數運行應用程式。

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

使用 `--js-flags=--experimental-wasm-gc` 命令列參數運行應用程式。

</tab>
</tabs>

### 提供您對 Kotlin/Wasm 的意見回饋

我們非常感謝您的任何意見回饋！

*   直接向 Kotlin Slack 的開發人員提供您的意見回饋 – [獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)並加入 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 頻道。
*   在[這個 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-56492)上報告您在使用 Kotlin/Wasm 時遇到的任何問題。

## Kotlin/JVM

Kotlin 1.8.20 引入了 [Java 合成屬性參考預覽](#preview-of-java-synthetic-property-references)以及[預設支援 kapt 存根 (stub) 生成任務中的 JVM IR 後端](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)。

### Java 合成屬性參考預覽

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。僅用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上提供相關意見回饋。
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

Kotlin 一直允許您編寫 `person.age`，其中 `age` 是一個合成屬性。現在，您還可以創建對 `Person::age` 和 `person::age` 的參考。對於 `name` 也同樣適用。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // Call a reference to Java synthetic property:
        .sortedBy(Person::age)
        // Call Java getter via the Kotlin property syntax:
        .forEach { person -> println(person.name) }
```
{validate="false"}

#### 如何啟用 Java 合成屬性參考

若要試用此功能，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過將以下內容添加到您的 `build.gradle(.kts)` 中來實現：

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

### 預設支援 kapt 存根生成任務中的 JVM IR 後端

在 Kotlin 1.7.20 中，我們引入了[對 kapt 存根生成任務中 JVM IR 後端的支援](whatsnew1720.md#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)。從此版本開始，此支援預設啟用。您不再需要在 `gradle.properties` 中指定 `kapt.use.jvm.ir=true` 來啟用它。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 上提供有關此功能的意見回饋。

## Kotlin/Native

Kotlin 1.8.20 包含了對支援的 Kotlin/Native 目標、與 Objective-C 的互通性以及 CocoaPods Gradle 外掛程式改進等方面的變更：

*   [Kotlin/Native 目標更新](#update-for-kotlin-native-targets)
*   [舊有記憶體管理器棄用](#deprecation-of-the-legacy-memory-manager)
*   [支援帶有 @import 指令的 Objective-C 標頭](#support-for-objective-c-headers-with-import-directives)
*   [CocoaPods Gradle 外掛程式支援僅連結模式](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
*   [在 UIKit 中將 Objective-C 擴充功能作為類別成員匯入](#import-objective-c-extensions-as-class-members-in-uikit)
*   [編譯器中編譯器快取管理重新實作](#reimplementation-of-compiler-cache-management-in-the-compiler)
*   [Cocoapods Gradle 外掛程式中 `useLibraries()` 棄用](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Native 目標更新
  
Kotlin 團隊決定重新審視 Kotlin/Native 支援的目標列表，將它們分為多個層級，並從 Kotlin 1.8.20 開始棄用其中一些目標。有關支援和已棄用目標的完整列表，請參閱 [Kotlin/Native 目標支援](native-target-support.md)部分。

以下目標已在 Kotlin 1.8.20 中棄用，並將在 1.9.20 中移除：

*   `iosArm32`
*   `watchosX86`
*   `wasm32`
*   `mingwX86`
*   `linuxArm32Hfp`
*   `linuxMips32`
*   `linuxMipsel32`

至於其餘目標，現在有三種支援層級，取決於 Kotlin/Native 編譯器中目標的支援和測試情況。目標可以移動到不同的層級。例如，我們將盡力在未來為 `iosArm64` 提供全面支援，因為它對 [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 至關重要。

如果您是函式庫作者，這些目標層級可以幫助您決定在 CI 工具上測試哪些目標以及跳過哪些目標。Kotlin 團隊在開發官方 Kotlin 函式庫時將採用相同的方法，例如 [kotlinx.coroutines](coroutines-guide.md)。

查看我們的[部落格文章](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/)以了解這些變更的原因。

### 舊有記憶體管理器棄用

從 1.8.20 開始，舊有記憶體管理器已被棄用，並將在 1.9.20 中移除。[新記憶體管理器](native-memory-manager.md)已在 1.7.20 中預設啟用，並持續獲得穩定性更新和效能改進。

如果您仍在使用舊有記憶體管理器，請從 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=strict` 選項，並遵循我們的[遷移指南](native-migration-guide.md)進行必要的變更。

新記憶體管理器不支援 `wasm32` 目標。該目標也[從此版本開始棄用](#update-for-kotlin-native-targets)，並將在 1.9.20 中移除。

### 支援帶有 @import 指令的 Objective-C 標頭

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。需要選擇啟用（詳情請見下文）。僅用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上提供相關意見回饋。
>
{style="warning"}

Kotlin/Native 現在可以匯入帶有 `@import` 指令的 Objective-C 標頭。此功能對於使用具有自動生成 Objective-C 標頭的 Swift 函式庫或用 Swift 編寫的 CocoaPods 依賴項的類別很有用。

以前，cinterop 工具無法分析透過 `@import` 指令依賴於 Objective-C 模組的標頭。原因是它缺乏對 `-fmodules` 選項的支援。

從 Kotlin 1.8.20 開始，您可以將 Objective-C 標頭與 `@import` 一起使用。為此，請在定義檔案中將 `-fmodules` 選項作為 `compilerOpts` 傳遞給編譯器。如果您使用 [CocoaPods 整合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)，請在 `pod()` 函式的配置區塊中指定 cinterop 選項，如下所示：

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

這是一個[備受期待的功能](https://youtrack.jetbrains.com/issue/KT-39120)，我們歡迎您在 [YouTrack](https://kotl.in/issue) 上提供相關意見回饋，以幫助我們在未來版本中將其設為預設。

### CocoaPods Gradle 外掛程式支援僅連結模式

藉由 Kotlin 1.8.20，您可以將 Pod 依賴項與動態框架僅用於連結，而無需生成 cinterop 綁定。當 cinterop 綁定已生成時，這會非常方便。

考慮一個包含 2 個模組的專案：一個函式庫和一個應用程式。該函式庫依賴於一個 Pod，但不產生框架，只產生 `.klib`。該應用程式依賴於該函式庫並產生一個動態框架。在這種情況下，您需要將此框架與函式庫所依賴的 Pod 連結起來，但您不需要 cinterop 綁定，因為它們已經為函式庫生成了。

若要啟用此功能，請在添加對 Pod 的依賴項時使用 `linkOnly` 選項或建構器 (builder) 屬性：

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

自 Xcode 14.1 以來，Objective-C 類別中的一些方法已移至類別成員。這導致生成了不同的 Kotlin API，並且這些方法被匯入為 Kotlin 擴充功能而不是方法。

您在使用 UIKit 覆寫方法時可能遇到因此產生的問題。例如，在 Kotlin 中對 `UIView` 進行子類化時，不可能覆寫 `drawRect()` 或 `layoutSubviews()` 方法。

自 1.8.20 起，在與 `NSView` 和 `UIView` 類別相同的標頭中宣告的類別成員會作為這些類別的成員匯入。這意味著從 `NSView` 和 `UIView` 繼承的方法可以像任何其他方法一樣輕鬆覆寫。

如果一切順利，我們計劃預設為所有 Objective-C 類別啟用此行為。

### 編譯器中編譯器快取管理重新實作

為了加速編譯器快取的演進，我們已將編譯器快取管理從 Kotlin Gradle 外掛程式移至 Kotlin/Native 編譯器。這解鎖了幾項重要改進的工作，包括與編譯時間和編譯器快取靈活性相關的改進。

如果您遇到問題需要恢復舊有行為，請使用 `kotlin.native.cacheOrchestration=gradle` Gradle 屬性。

我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上提供相關意見回饋。

### Cocoapods Gradle 外掛程式中 `useLibraries()` 棄用

Kotlin 1.8.20 開始了 `useLibraries()` 函式的棄用週期，該函式用於靜態函式庫的 [CocoaPods 整合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)。

我們引入 `useLibraries()` 函式以允許依賴包含靜態函式庫的 Pod。隨著時間的推移，這種情況變得非常罕見。大多數 Pod 透過原始碼分發，而 Objective-C 框架或 XCFrameworks 是二進位分發的常見選擇。

由於此函式不受歡迎，並且它造成了複雜化 Kotlin CocoaPods Gradle 外掛程式開發的問題，我們決定將其棄用。

有關框架和 XCFrameworks 的更多資訊，請參閱 [建構最終原生二進位檔](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。

## Kotlin 多平台

Kotlin 1.8.20 致力於透過對 Kotlin 多平台進行以下更新來改善開發人員體驗：

*   [設定原始碼集層級的新方法](#new-approach-to-source-set-hierarchy)
*   [Kotlin 多平台中 Gradle 複合建構支援的預覽](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
*   [Xcode 中 Gradle 錯誤輸出改進](#improved-output-for-gradle-errors-in-xcode)

### 設定原始碼集層級的新方法

> 原始碼集層級的新方法為[實驗性](components-stability.md#stability-levels-explained)。它可能在未來的 Kotlin 版本中未經事先通知而更改。需要選擇啟用（詳情請見下文）。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上提供相關意見回饋。
>
{style="warning"}

Kotlin 1.8.20 提供了一種在多平台專案中設定原始碼集層級的新方法 − 預設目標層級。新方法旨在取代像 `ios` 這樣的目標捷徑，這些捷徑有其[設計缺陷](#why-replace-shortcuts)。

預設目標層級背後的理念很簡單：您明確宣告專案編譯到的所有目標，Kotlin Gradle 外掛程式會根據指定的目標自動創建共享原始碼集。

#### 設定您的專案

考慮這個簡單的多平台行動應用程式範例：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // Enable the default target hierarchy:
    targetHierarchy.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

您可以將預設目標層級視為所有可能目標及其共享原始碼集的範本。當您在程式碼中宣告最終目標 `android`、`iosArm64` 和 `iosSimulatorArm64` 時，Kotlin Gradle 外掛程式會從範本中找到合適的共享原始碼集並為您創建它們。結果層級如下所示：

![使用預設目標層級的範例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

綠色原始碼集實際上已在專案中創建並存在，而預設範本中的灰色原始碼集則被忽略。正如您所見，Kotlin Gradle 外掛程式並未創建 `watchos` 原始碼集，例如，因為專案中沒有 `watchOS` 目標。

如果您添加一個 `watchOS` 目標，例如 `watchosArm64`，則會創建 `watchos` 原始碼集，並且來自 `apple`、`native` 和 `common` 原始碼集的程式碼也將編譯到 `watchosArm64`。

您可以在[文件](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)中找到預設目標層級的完整方案。

> 在此範例中，`apple` 和 `native` 原始碼集僅編譯到 `iosArm64` 和 `iosSimulatorArm64` 目標。因此，儘管它們的名字如此，它們仍然可以存取完整的 iOS API。這對於像 `native` 這樣的原始碼集可能違反直覺，因為您可能期望只有在所有原生目標上可用的 API 才能在此原始碼集中存取。此行為未來可能會改變。
>
{style="note"}

#### 為何取代捷徑 {initial-collapse-state="collapsed" collapsible="true"}

創建原始碼集層級可能很冗長、容易出錯，並且對初學者不友好。我們之前的解決方案是引入像 `ios` 這樣的捷徑，為您創建層級的一部分。然而，事實證明使用捷徑存在一個很大的設計缺陷：它們難以更改。

以 `ios` 捷徑為例。它只創建 `iosArm64` 和 `iosX64` 目標，這可能會令人困惑，並且在使用需要 `iosSimulatorArm64` 目標的 M1 主機上可能導致問題。然而，添加 `iosSimulatorArm64` 目標對於使用者專案來說可能是一個非常破壞性的改變：

*   `iosMain` 原始碼集中使用的所有依賴項都必須支援 `iosSimulatorArm64` 目標；否則，依賴項解析將失敗。
*   在添加新目標時，`iosMain` 中使用的一些原生 API 可能會消失 (儘管在 `iosSimulatorArm64` 的情況下不太可能發生)。
*   在某些情況下，例如當您在基於 Intel 的 MacBook 上編寫一個小型個人專案時，您甚至可能不需要此更改。

很明顯，捷徑未能解決配置層級的問題，這就是我們在某個時候停止添加新捷徑的原因。

預設目標層級乍看之下可能與捷徑相似，但它們有一個關鍵區別：**使用者必須明確指定目標集**。此集定義了您的專案如何編譯和發布，以及它如何參與依賴項解析。由於此集是固定的，因此 Kotlin Gradle 外掛程式的預設配置更改應會顯著減少生態系統中的困擾，並且提供工具輔助遷移將變得更加容易。

#### 如何啟用預設層級

這項新功能是[實驗性](components-stability.md#stability-levels-explained)。對於 Kotlin Gradle 建構腳本，您需要使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 選擇啟用。

有關更多資訊，請參閱[層級專案結構](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)。

#### 留下意見回饋

這對多平台專案來說是一個重大變革。我們非常感謝您的[意見回饋](https://kotl.in/issue)，以幫助使其更加完善。

### Kotlin 多平台中 Gradle 複合建構支援的預覽

> 此功能自 Kotlin Gradle 外掛程式 1.8.20 起已在 Gradle 建構中支援。對於 IDE 支援，請使用 IntelliJ IDEA 2023.1 Beta 2 (231.8109.2) 或更高版本，以及帶有任何 Kotlin IDE 外掛程式的 Kotlin Gradle 外掛程式 1.8.20。
>
{style="note"}

從 1.8.20 開始，Kotlin 多平台支援 [Gradle 複合建構 (composite builds)](https://docs.gradle.org/current/userguide/composite_builds.html)。複合建構允許您將單獨專案或同一專案部分中的建構包含到單一建構中。

由於一些技術挑戰，Kotlin 多平台與 Gradle 複合建構的搭配使用僅得到部分支援。Kotlin 1.8.20 包含了改進支援的預覽，該支援應該適用於更多種類的專案。若要試用它，請將以下選項添加到您的 `gradle.properties` 中：

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

此選項啟用新匯入模式的預覽。除了支援複合建構外，它還提供了多平台專案中更流暢的匯入體驗，因為我們已包含主要的錯誤修復和改進，以使匯入更穩定。

#### 已知問題

它仍是一個需要進一步穩定的預覽版本，您可能會在匯入過程中遇到一些問題。以下是我們計劃在 Kotlin 1.8.20 正式發布前修復的一些已知問題：

*   IntelliJ IDEA 2023.1 EAP 尚無可用的 Kotlin 1.8.20 外掛程式。儘管如此，您仍然可以將 Kotlin Gradle 外掛程式版本設定為 1.8.20，並在此 IDE 中試用複合建構。
*   如果您的專案包含指定了 `rootProject.name` 的建構，複合建構可能無法解析 Kotlin 中繼資料 (metadata)。有關解決方案和詳細資訊，請參閱[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-56536)。

我們鼓勵您試用此功能，並在 [YouTrack](https://kotl.in/issue) 上提交所有報告，以幫助我們在 Kotlin 1.9.0 中使其成為預設設定。

### Xcode 中 Gradle 錯誤輸出改進

如果您在 Xcode 中建構多平台專案時遇到問題，您可能會遇到「Command PhaseScriptExecution failed with a nonzero exit code」錯誤。此訊息表示 Gradle 呼叫失敗，但對於嘗試偵測問題並不是很有幫助。

從 Kotlin 1.8.20 開始，Xcode 可以解析 Kotlin/Native 編譯器的輸出。此外，如果 Gradle 建構失敗，您將在 Xcode 中看到來自根本原因例外情況的額外錯誤訊息。在大多數情況下，這將有助於識別根本問題。

![Xcode 中 Gradle 錯誤輸出改進](xcode-gradle-output.png){width=700}

對於 Xcode 整合的標準 Gradle 任務，例如可將多平台專案中的 iOS 框架連接到 Xcode 中的 iOS 應用程式的 `embedAndSignAppleFrameworkForXcode`，此新行為預設啟用。它也可以透過 `kotlin.native.useXcodeMessageStyle` Gradle 屬性啟用（或停用）。

## Kotlin/JavaScript

Kotlin 1.8.20 改變了 TypeScript 定義的生成方式。它還包含一項旨在改善您的偵錯體驗：

*   [從 Gradle 外掛程式中移除 Dukat 整合](#removal-of-dukat-integration-from-gradle-plugin)
*   [原始碼映射中 Kotlin 變數和函式名稱](#kotlin-variable-and-function-names-in-source-maps)
*   [選擇啟用 TypeScript 定義檔生成](#opt-in-for-generation-of-typescript-definition-files)

### 從 Gradle 外掛程式中移除 Dukat 整合

在 Kotlin 1.8.20 中，我們已從 Kotlin/JavaScript Gradle 外掛程式中移除了我們的[實驗性](components-stability.md#stability-levels-explained) Dukat 整合。Dukat 整合支援將 TypeScript 宣告檔案 (`.d.ts`) 自動轉換為 Kotlin 外部宣告。

您仍然可以透過使用我們的 [Dukat 工具](https://github.com/Kotlin/dukat)將 TypeScript 宣告檔案 (`.d.ts`) 轉換為 Kotlin 外部宣告。

> Dukat 工具為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。
>
{style="warning"}

### 原始碼映射中 Kotlin 變數和函式名稱

為了幫助偵錯，我們引入了將您在 Kotlin 程式碼中宣告的變數和函式名稱添加到原始碼映射 (source maps) 中的功能。在 1.8.20 之前，這些名稱在原始碼映射中不可用，因此在偵錯器中，您總是看到生成 JavaScript 的變數和函式名稱。

您可以透過在 Gradle 檔案 `build.gradle.kts` 中使用 `sourceMapNamesPolicy` 或 `-source-map-names-policy` 編譯器選項來配置添加的內容。下表列出了可能的設定：

| 設定                 | 描述                                                   | 範例輸出                    |
|-------------------------|---------------------------------------------------------------|-----------------------------------|
| `simple-names`          | 添加變數名稱和簡單函式名稱。（預設） | `main`                            |
| `fully-qualified-names` | 添加變數名稱和完全限定函式名稱。  | `com.example.kjs.playground.main` |
| `no`                    | 不添加任何變數或函式名稱。                      | N/A                               |

以下是 `build.gradle.kts` 檔案中的配置範例：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.Kotlin2JsCompile>().configureEach {
    compilercompileOptions.sourceMapNamesPolicy.set(org.jetbrains.kotlin.gradle.dsl.JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES) // or SOURCE_MAP_NAMES_POLICY_NO, or SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES
}
```
{validate="false"}

像基於 Chromium 的瀏覽器中提供的偵錯工具可以從您的原始碼映射中獲取原始 Kotlin 名稱，以提高堆疊追蹤 (stack trace) 的可讀性。祝您偵錯愉快！

> 變數和函式名稱在原始碼映射中的添加為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。
>
{style="warning"}

### 選擇啟用 TypeScript 定義檔生成

以前，如果您有一個產生可執行檔 (`binaries.executable()`) 的專案，Kotlin/JS IR 編譯器會收集任何標記有 `@JsExport` 的頂層宣告，並自動在 `.d.ts` 檔案中生成 TypeScript 定義。

由於這並非對每個專案都有用，我們在 Kotlin 1.8.20 中更改了此行為。如果您想要生成 TypeScript 定義，您必須在 Gradle 建構檔案中明確配置此功能。將 `generateTypeScriptDefinitions()` 添加到您的 `build.gradle.kts.file` 的 [`js` 部分](js-project-setup.md#execution-environments)中。例如：

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

> TypeScript 定義 (`d.ts`) 的生成為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。
>
{style="warning"}

## Gradle

Kotlin 1.8.20 完全兼容 Gradle 6.8 到 7.6，除了[多平台外掛程式中的一些特殊情況](https://youtrack.jetbrains.com/issue/KT-55751)。您也可以使用直到最新 Gradle 版本的 Gradle 版本，但如果您這樣做，請記住您可能會遇到棄用警告或某些新的 Gradle 功能可能無法正常運作。

此版本帶來了以下變更：

*   [Gradle 外掛程式版本新對齊方式](#new-gradle-plugins-versions-alignment)
*   [Gradle 中 JVM 增量編譯預設開啟](#new-jvm-incremental-compilation-by-default-in-gradle)
*   [編譯任務輸出精確備份](#precise-backup-of-compilation-tasks-outputs)
*   [所有 Gradle 版本 Kotlin/JVM 任務惰性創建](#lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions)
*   [編譯任務 destinationDirectory 的非預設位置](#non-default-location-of-compile-tasks-destinationdirectory)
*   [選擇不向 HTTP 統計服務報告編譯器參數的能力](#ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service)

### Gradle 外掛程式版本新對齊方式

Gradle 提供了一種方法來確保必須協同工作的依賴項在版本上始終[保持一致](https://docs.gradle.org/current/userguide/dependency_version_alignment.html#aligning_versions_natively_with_gradle)。Kotlin 1.8.20 也採用了這種方法。它預設啟用，因此您無需更改或更新配置即可啟用它。此外，您不再需要採用[此解決方法來解析 Kotlin Gradle 外掛程式的傳遞依賴項](whatsnew18.md#resolution-of-kotlin-gradle-plugins-transitive-dependencies)。

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-54691) 上提供有關此功能的意見回饋。

### Gradle 中 JVM 增量編譯預設開啟

[自 Kotlin 1.7.0 起可用的增量編譯新方法](whatsnew17.md#a-new-approach-to-incremental-compilation)現在預設啟用。您不再需要在 `gradle.properties` 中指定 `kotlin.incremental.useClasspathSnapshot=true` 來啟用它。

我們非常感謝您對此提供意見回饋。您可以在 YouTrack 中[提交問題](https://kotl.in/issue)。

### 編譯任務輸出精確備份

> 編譯任務輸出精確備份為[實驗性](components-stability.md#stability-levels-explained)。若要使用它，請將 `kotlin.compiler.preciseCompilationResultsBackup=true` 添加到 `gradle.properties`。我們非常感謝您在 [YouTrack](https://kotl.in/issue/experimental-ic-optimizations) 上提供相關意見回饋。
>
{style="warning"}

從 Kotlin 1.8.20 開始，您可以啟用精確備份，只有 Kotlin 在[增量編譯](gradle-compilation-and-caches.md#incremental-compilation)中重新編譯的類別才會被備份。完整備份和精確備份都有助於在編譯錯誤後再次增量運行建構。精確備份還比完整備份節省建構時間。在大型專案中，或者如果許多任務正在進行備份，特別是當專案位於緩慢的 HDD 上時，完整備份可能會花費**明顯的**建構時間。

此最佳化是實驗性的。您可以透過將 `kotlin.compiler.preciseCompilationResultsBackup` Gradle 屬性添加到 `gradle.properties` 檔案中來啟用它：

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrains 中精確備份使用範例 {initial-collapse-state="collapsed" collapsible="true"}

在以下圖表中，您可以看到與完整備份相比使用精確備份的範例：

![完整備份與精確備份的比較](comparison-of-full-and-precise-backups.png){width=700}

第一和第二張圖表顯示了 Kotlin 專案中精確備份如何影響 Kotlin Gradle 外掛程式的建構：

1.  在對許多模組所依賴的模組進行小的 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 變更後 – 添加一個新的公共方法。
2.  在對沒有其他模組依賴的模組進行小的非 ABI 變更後 – 添加一個私有函式。

第三張圖表顯示了 [Space](https://www.jetbrains.com/space/) 專案中的精確備份如何影響在對許多模組所依賴的 Kotlin/JS 模組進行小的非 ABI 變更後 – 添加一個私有函式 – 建構網頁前端。

這些測量是在配備 Apple M1 Max CPU 的電腦上進行的；不同電腦會產生略有不同的結果。影響效能的因素包括但不限於：

*   [Kotlin 守護程序 (daemon)](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle) 和 [Gradle 守護程序](https://docs.gradle.org/current/userguide/gradle-daemon.html) 的熱度。
*   磁碟的速度快慢。
*   CPU 型號及其忙碌程度。
*   哪些模組受到變更影響以及這些模組的大小。
*   變更是 ABI 還是非 ABI。

#### 使用建構報告評估最佳化 {initial-collapse-state="collapsed" collapsible="true"}

為了估計最佳化對您的專案和場景在您的電腦上的影響，您可以使用 [Kotlin 建構報告](gradle-compilation-and-caches.md#build-reports)。透過將以下屬性添加到您的 `gradle.properties` 檔案中來啟用文字檔案格式的報告：

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
  Backup output: 0.22 s // 請注意這個數字 
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

### 所有 Gradle 版本 Kotlin/JVM 任務惰性創建

對於在 Gradle 7.3+ 上使用 `org.jetbrains.kotlin.gradle.jvm` 外掛程式的專案，Kotlin Gradle 外掛程式不再急切地創建和配置任務 `compileKotlin`。在較低的 Gradle 版本上，它只是簡單地註冊所有任務，並且在試運行時不配置它們。現在在使用 Gradle 7.3+ 時，也採用相同的行為。

### 編譯任務 destinationDirectory 的非預設位置

如果您執行以下任一操作，請使用一些額外程式碼更新您的建構腳本：

*   覆寫 Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 任務的 `destinationDirectory` 位置。
*   使用已棄用的 Kotlin/JS/非 IR [變體](gradle-plugin-variants.md)並覆寫 `Kotlin2JsCompile` 任務的 `destinationDirectory`。

您需要在 JAR 檔案中明確將 `sourceSets.main.kotlin.classesDirectories` 添加到 `sourceSets.main.outputs`：

```groovy
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

### 選擇不向 HTTP 統計服務報告編譯器參數的能力

您現在可以控制 Kotlin Gradle 外掛程式是否應在 HTTP [建構報告](gradle-compilation-and-caches.md#build-reports)中包含編譯器參數。有時，您可能不需要外掛程式報告這些參數。如果專案包含許多模組，其報告中的編譯器參數可能非常龐大且不那麼有用。現在有一種方法可以禁用它，從而節省記憶體。在您的 `gradle.properties` 或 `local.properties` 中，使用 `kotlin.build.report.include_compiler_arguments=(true|false)` 屬性。

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55323/) 上提供有關此功能的意見回饋。

## 標準函式庫

Kotlin 1.8.20 添加了各種新功能，其中一些對於 Kotlin/Native 開發特別有用：

*   [AutoCloseable 介面支援](#support-for-the-autocloseable-interface)
*   [Base64 編碼和解碼支援](#support-for-base64-encoding)
*   [Kotlin/Native 中 @Volatile 支援](#support-for-volatile-in-kotlin-native)
*   [Kotlin/Native 中使用正規表達式時堆疊溢位錯誤修復](#bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native)

### AutoCloseable 介面支援

> 新的 `AutoCloseable` 介面為[實驗性](components-stability.md#stability-levels-explained)，若要使用它，您需要使用 `@OptIn(ExperimentalStdlibApi::class)` 或編譯器參數 `-opt-in=kotlin.ExperimentalStdlibApi` 選擇啟用。
>

{style="warning"}

`AutoCloseable` 介面已添加到通用標準函式庫中，以便您可以為所有函式庫使用一個通用介面來關閉資源。在 Kotlin/JVM 中，`AutoCloseable` 介面是 [`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html) 的別名。

此外，現在包含了擴充函式 `use()`，它在選定的資源上執行給定的區塊函式，然後正確關閉它，無論是否拋出例外。

通用標準函式庫中沒有任何實作 `AutoCloseable` 介面的公共類別。在下面的範例中，我們定義了 `XMLWriter` 介面，並假設存在一個實作它的資源。例如，此資源可能是一個打開檔案、寫入 XML 內容然後關閉它的類別。

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

### Base64 編碼支援

> 新的編碼和解碼功能為[實驗性](components-stability.md#stability-levels-explained)，若要使用它，您需要使用 `@OptIn(ExperimentalEncodingApi::class)` 或編譯器參數 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi` 選擇啟用。
>
{style="warning"}

我們添加了對 Base64 編碼和解碼的支援。我們提供了 3 個類別實例，每個實例使用不同的編碼方案並顯示不同的行為。對於標準的 [Base64 編碼方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)，請使用 `Base64.Default` 實例。

對於「URL 和檔案名安全」([URL and Filename safe](https://www.rfc-editor.org/rfc/rfc4648#section-5)) 編碼方案，請使用 `Base64.UrlSafe` 實例。

對於 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 編碼方案，請使用 `Base64.Mime` 實例。當您使用 `Base64.Mime` 實例時，所有編碼函式每 76 個字元會插入一個換行符。在解碼情況下，任何非法字元都會被跳過，並且不會拋出例外。

> `Base64.Default` 實例是 `Base64` 類別的伴隨物件。因此，您可以透過 `Base64.encode()` 和 `Base64.decode()` 呼叫其函式，而不是 `Base64.Default.encode()` 和 `Base64.Default.decode()`。
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

您可以使用額外的函式將位元組編碼或解碼到現有緩衝區中，以及將編碼結果附加到提供的 `Appendable` 型別物件。

在 Kotlin/JVM 中，我們還添加了擴充函式 `encodingWith()` 和 `decodingWith()`，以使您能夠使用輸入和輸出流執行 Base64 編碼和解碼。

### Kotlin/Native 中 @Volatile 支援

> `@Volatile` 在 Kotlin/Native 中為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。需要選擇啟用（詳情請見下文）。僅用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上提供相關意見回饋。
>
{style="warning"}

如果您使用 `@Volatile` 標註 `var` 屬性，則支援欄位會被標記，以便對該欄位的任何讀取或寫入都是原子性的，並且寫入始終對其他執行緒可見。

在 1.8.20 之前，[`kotlin.jvm.Volatile` 標註](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)在通用標準函式庫中可用。然而，此標註僅在 JVM 中有效。如果您在 Kotlin/Native 中使用它，它將被忽略，這可能導致錯誤。

在 1.8.20 中，我們引入了一個通用標註 `kotlin.concurrent.Volatile`，您可以在 JVM 和 Kotlin/Native 中使用它。

#### 如何啟用

若要試用此功能，請使用 `@OptIn(ExperimentalStdlibApi)` 選擇啟用，並啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過將以下內容添加到 `build.gradle(.kts)` 檔案中來實現：

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

### Kotlin/Native 中使用正規表達式時堆疊溢位錯誤修復

在 Kotlin 的先前版本中，如果您的正規表達式輸入包含大量字元，即使正規表達式模式非常簡單，也可能發生崩潰。在 1.8.20 中，此問題已解決。有關更多資訊，請參閱 [KT-46211](https://youtrack.jetbrains.com/issue/KT-46211)。

## 序列化更新

Kotlin 1.8.20 提供了[對 Kotlin K2 編譯器的 Alpha 支援](#prototype-serialization-compiler-plugin-for-kotlin-k2-compiler)並[禁止透過伴隨物件隱式自訂序列化器](#prohibit-implicit-serializer-customization-via-companion-object)。

### Kotlin K2 編譯器序列化器外掛程式原型

> 序列化編譯器外掛程式對 K2 的支援處於[Alpha](components-stability.md#stability-levels-explained) 階段。若要使用它，請[啟用 Kotlin K2 編譯器](#how-to-enable-the-kotlin-k2-compiler)。
>
{style="warning"}

從 1.8.20 開始，序列化編譯器外掛程式與 Kotlin K2 編譯器協同工作。請試用並[與我們分享您的意見回饋](#leave-your-feedback-on-the-new-k2-compiler)！

### 禁止透過伴隨物件隱式自訂序列化器

目前，可以透過 `@Serializable` 標註將類別宣告為可序列化，同時在伴隨物件上透過 `@Serializer` 標註宣告自訂序列化器。

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

在這種情況下，從 `@Serializable` 標註中不清楚使用了哪個序列化器。實際上，`Foo` 類別具有一個自訂序列化器。

為防止此類混淆，在 Kotlin 1.8.20 中，我們針對檢測到此情境時引入了編譯器警告。該警告包含解決此問題的可能遷移路徑。

如果您在程式碼中使用此類建構，我們建議您更新為以下形式：

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

透過這種方法，很清楚 `Foo` 類別使用伴隨物件中宣告的自訂序列化器。有關更多資訊，請參閱我們的 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-54441)。

> 在 Kotlin 2.0 中，我們計劃將此編譯警告升級為編譯錯誤。我們建議如果您看到此警告，請遷移您的程式碼。
>
{style="tip"}

## 文件更新

Kotlin 文件已獲得一些值得注意的變更：

*   [Spring Boot 和 Kotlin 入門](jvm-get-started-spring-boot.md) – 建立一個帶有資料庫的簡單應用程式，並了解更多關於 Spring Boot 和 Kotlin 的功能。
*   [作用域函式](scope-functions.md) – 學習如何使用標準函式庫中有用的作用域函式來簡化您的程式碼。
*   [CocoaPods 整合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) – 設定與 CocoaPods 協同工作的環境。

## 安裝 Kotlin 1.8.20

### 檢查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.2 和 2022.3 會自動建議將 Kotlin 外掛程式更新到版本 1.8.20。IntelliJ IDEA 2023.1 內建 Kotlin 外掛程式 1.8.20。

Android Studio Flamingo (222) 和 Giraffe (223) 將在下一個版本中支援 Kotlin 1.8.20。

新的命令列編譯器可在 [GitHub 發布頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20) 下載。

### 配置 Gradle 設定

為了正確下載 Kotlin 構件和依賴項，請更新您的 `settings.gradle(.kts)` 檔案以使用 Maven Central 儲存庫：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

如果未指定儲存庫，Gradle 將使用已停用的 JCenter 儲存庫，這可能導致 Kotlin 構件相關問題。