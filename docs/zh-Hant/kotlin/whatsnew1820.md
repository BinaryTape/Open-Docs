[//]: # (title: Kotlin 1.8.20 的新功能)

<web-summary>閱讀 Kotlin 1.8.20 版本說明，涵蓋新的語言特性、Kotlin Multiplatform、JVM、Native、JS 和 Wasm 的更新，以及對 Gradle 和 Maven 的建置工具支援。</web-summary>

_[發佈日期：2023 年 4 月 25 日](releases.md#release-history)_

Kotlin 1.8.20 已經正式發佈，以下是其中的一些重大亮點：

* [新的 Kotlin K2 編譯器更新](#new-kotlin-k2-compiler-updates)
* [新的實驗性 Kotlin/Wasm 目標](#new-kotlin-wasm-target)
* [Gradle 中預設啟用的新 JVM 增量編譯](#new-jvm-incremental-compilation-by-default-in-gradle)
* [Kotlin/Native 目標的更新](#update-for-kotlin-native-targets)
* [Kotlin Multiplatform 中 Gradle 複合組建支援的預覽](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [改進 Xcode 中 Gradle 錯誤的輸出](#improved-output-for-gradle-errors-in-xcode)
* [標準函式庫中對 AutoCloseable 介面的實驗性支援](#support-for-the-autocloseable-interface)
* [標準函式庫中對 Base64 編碼的實驗性支援](#support-for-base64-encoding)

您也可以在此影片中找到這些變更的簡短概述：

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="What's new in Kotlin 1.8.20"/>

> 有關 Kotlin 發佈週期的資訊，請參閱 [Kotlin 發佈程序](releases.md)。
>
{style="tip"}

## IDE 支援

支援 1.8.20 的 Kotlin 外掛程式可用於：

| IDE            | 支援的版本                     |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x, 2023.1.x  |
| Android Studio | Flamingo (222)                |

> 為了正確下載 Kotlin 構件和相依性，請[配置 Gradle 設定](#configure-gradle-settings)以使用 Maven Central 儲存庫。
>
{style="warning"}

## 新的 Kotlin K2 編譯器更新

Kotlin 團隊持續穩定 K2 編譯器。正如在 [Kotlin 1.7.0 公告](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)中所提到的，它仍處於 **Alpha** 階段。此版本在邁向 [K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604) 的道路上引入了進一步的改進。

從此 1.8.20 版本開始，Kotlin K2 編譯器：

* 提供了序列化外掛程式的預覽版本。
* 為 [JS IR 編譯器](js-ir-compiler.md)提供 Alpha 支援。
* 引入了未來將發佈的[新語言版本 Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/)。

在以下影片中進一步了解新的編譯器及其優勢：

* [關於新的 Kotlin K2 編譯器，每個人都必須知道的事](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [新的 Kotlin K2 編譯器：專家評測](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何啟用 Kotlin K2 編譯器

要啟用並測試 Kotlin K2 編譯器，請使用具有以下編譯器選項的新語言版本：

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

先前的 `-Xuse-k2` 編譯器選項已被棄用。

> 新 K2 編譯器的 Alpha 版本僅適用於 JVM 和 JS IR 專案。它目前尚不支援 Kotlin/Native 或任何多平台專案。
>
{style="warning"}

### 對新 K2 編譯器提供回饋

我們非常感謝您提供的任何回饋！

* 在 Kotlin Slack 上直接向 K2 開發人員提供您的回饋 – [獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
* 在[我們的問題追蹤器](https://kotl.in/issue)上報告您在使用新 K2 編譯器時遇到的任何問題。
* [啟用 **Send usage statistics** 選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，允許 JetBrains 收集有關 K2 使用情況的匿名資料。

## 語言

隨著 Kotlin 的持續演進，我們在 1.8.20 中為新的語言特性引入了預覽版本：

* [Enum 類別 values 函式的現代且高效能替代方案](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
* [用於與 data class 保持對稱的 data object](#preview-of-data-objects-for-symmetry-with-data-classes)
* [解除對內嵌類別中具有主體的次要建構函式的限制](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum 類別 values 函式的現代且高效能替代方案

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被刪除或更改。需要加入 (opt-in)（詳見下文）。僅用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上對此提供回饋。
>
{style="warning"}

Enum 類別具有一個合成的 `values()` 函式，它會傳回一個定義的列舉常數陣列。然而，在 Kotlin 和 Java 中使用陣列可能會導致[隱藏的效能問題](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues)。此外，大多數 API 使用集合，這最終需要進行轉換。為了修正這些問題，我們為 Enum 類別引入了 `entries` 屬性，應該使用它來代替 `values()` 函式。當呼叫 `entries` 屬性時，它會傳回一個預先分配的、定義好的列舉常數不可變列表。

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

要試用此功能，請使用 `@OptIn(ExperimentalStdlibApi)` 加入，並啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過在 `build.gradle(.kts)` 檔案中新增以下內容來實現：

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

> 從 IntelliJ IDEA 2023.1 開始，如果您已加入此功能，相應的 IDE 檢查將通知您將 `values()` 轉換為 `entries` 並提供快速修正。
>
{style="tip"}

有關該提案的更多資訊，請參閱 [KEEP 說明](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)。

### 用於與 data class 保持對稱的 data object 預覽

Data object 允許您宣告具有單例語意和簡潔 `toString()` 表示的物件。在此程式碼片段中，您可以看到將 `data` 關鍵字新增到物件宣告中如何提高其 `toString()` 輸出的可讀性：

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

特別是對於 `sealed` 階層結構（例如 `sealed class` 或 `sealed interface` 階層結構），`data object` 非常適合，因為它們可以與 `data class` 宣告一起方便地使用。在此程式碼片段中，將 `EndOfFile` 宣告為 `data object` 而不是普通 `object`，意味著它將獲得漂亮的 `toString` 而無需手動覆寫它。這保持了與隨附的 data class 定義的對稱性。

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

#### data object 的語意

自從在 [Kotlin 1.7.20](whatsnew1720.md#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects) 中發佈第一個預覽版本以來，data object 的語意已得到完善。編譯器現在會自動為它們產生一些便捷函式：

##### toString

`data object` 的 `toString()` 函式會傳回物件的簡單名稱：

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals 和 hashCode

`data object` 的 `equals()` 函式確保所有具有 `data object` 型別的物件都被視為相等。在大多數情況下，您在執行階段只會有一個 data object 執行個體（畢管竟，`data object` 宣告的是單例）。然而，在執行階段產生同型別另一個物件的邊緣情況下（例如，透過 `java.lang.reflect` 使用平台反射，或使用在底層使用此 API 的 JVM 序列化程式庫），這可確保這些物件被視為相等。

請確保僅對 `data object` 進行結構化比較（使用 `==` 運算子），而絕不要透過參照（`===` 運算子）進行比較。這有助於避免執行階段存在多個 data object 執行個體時的陷阱。以下程式碼片段說明了這種特殊的邊緣情況：

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // MySingleton
    println(evilTwin) // MySingleton

    // 即使程式庫強制建立 MySingleton 的第二個執行個體，其 `equals` 方法也會傳回 true：
    println(MySingleton == evilTwin) // true

    // 請勿透過 === 比較 data object。
    println(MySingleton === evilTwin) // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 反射不允許具現化 data object。
    // 這會「強制」建立一個新的 MySingleton 執行個體（即 Java 平台反射）
    // 請不要自己這樣做！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

產生的 `hashCode()` 函式的行為與 `equals()` 函式的行為一致，因此 `data object` 的所有執行階段執行個體都具有相同的雜湊碼。

##### data object 沒有 copy 和 componentN 函式

雖然 `data object` 和 `data class` 宣告經常一起使用且具有一些相似之處，但有些函式不會為 `data object` 產生：

因為 `data object` 宣告旨在用作單例物件，所以不會產生 `copy()` 函式。單例模式將類別的具現化限制為單個執行個體，而允許建立執行個體的副本將違反該限制。

此外，與 `data class` 不同，`data object` 沒有任何資料屬性。由於嘗試解構此類物件沒有意義，因此不會產生 `componentN()` 函式。

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-4107) 上對此功能提供回饋。

#### 如何啟用 data object 預覽

要試用此功能，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過在 `build.gradle(.kts)` 檔案中新增以下內容來實現：

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

### 解除對內嵌類別中具有主體的次要建構函式的限制預覽

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被刪除或更改。需要加入 (opt-in)（詳見下文）。僅用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上提供回饋。
>
{style="warning"}

Kotlin 1.8.20 解除了在[內嵌類別](inline-classes.md)中使用具有主體的次要建構函式的限制。

內嵌類別以前僅允許不帶 `init` 區塊的公開主建構函式或具有明確初始化語意的次要建構函式。因此，無法封裝底層值，也無法建立代表某些受限值的內嵌類別。

當 Kotlin 1.4.30 解除對 `init` 區塊的限制時，這些問題得到了解決。現在我們更進一步，在預覽模式下允許具有主體的次要建構函式：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // 自 Kotlin 1.4.30 起允許：
    init { 
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }

    // 自 Kotlin 1.8.20 起提供預覽：
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

#### 如何啟用具有主體的次要建構函式

要試用此功能，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過在 `build.gradle(.kts)` 中新增以下內容來實現：

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

我們鼓勵您試用此功能並在 [YouTrack](https://kotl.in/issue) 中提交所有報告，以幫助我們使其在 Kotlin 1.9.0 中成為預設設定。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中了解更多關於 Kotlin 內嵌類別開發的資訊。

## 新的 Kotlin/Wasm 目標

Kotlin/Wasm (Kotlin WebAssembly) 在此版本中進入[實驗階段](components-stability.md#stability-levels-explained)。Kotlin 團隊認為 [WebAssembly](https://webassembly.org/) 是一項很有前途的技術，並希望為您找到更好的使用方式，以獲得 Kotlin 的所有好處。

WebAssembly 二進位格式與平台無關，因為它使用自己的虛擬機運行。幾乎所有現代瀏覽器都已支援 WebAssembly 1.0。要設定執行 WebAssembly 的環境，您只需啟用 Kotlin/Wasm 目標的實驗性垃圾回收模式。您可以在此處找到詳細說明：[如何啟用 Kotlin/Wasm](#how-to-enable-kotlin-wasm)。

我們要強調新的 Kotlin/Wasm 目標的以下優點：

* 與 `wasm32` Kotlin/Native 目標相比，編譯速度更快，因為 Kotlin/Wasm 不需要使用 LLVM。
* 得益於 [Wasm 垃圾回收](https://github.com/WebAssembly/gc)，與 `wasm32` 目標相比，與 JS 的互通性和與瀏覽器的整合更容易。
* 與 Kotlin/JS 和 JavaScript 相比，應用程式啟動速度可能更快，因為 Wasm 具有緊湊且易於剖析的位元組碼。
* 與 Kotlin/JS 和 JavaScript 相比，應用程式執行階段效能得到提高，因為 Wasm 是一種靜態型別語言。

從 1.8.20 版本開始，您可以在您的實驗性專案中使用 Kotlin/Wasm。我們開箱即用地為 Kotlin/Wasm 提供 Kotlin 標準函式庫 (`stdlib`) 和測試函式庫 (`kotlin.test`)。IDE 支援將在未來版本中新增。

[在此 YouTube 影片中了解有關 Kotlin/Wasm 的更多資訊](https://www.youtube.com/watch?v=-pqz9sKXatw)。

### 如何啟用 Kotlin/Wasm

要啟用並測試 Kotlin/Wasm，請更新您的 `build.gradle.kts` 檔案：

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

> 查看 [包含 Kotlin/Wasm 範例的 GitHub 儲存庫](https://github.com/Kotlin/kotlin-wasm-examples)。
>
{style="tip"}

要執行 Kotlin/Wasm 專案，您需要更新目標環境的設定：

<tabs>
<tab title="Chrome">

* 對於 109 版本：

  使用 `--js-flags=--experimental-wasm-gc` 命令列引數執行應用程式。

* 對於 110 或更高版本：

    1. 在瀏覽器中前往 `chrome://flags/#enable-webassembly-garbage-collection`。
    2. 啟用 **WebAssembly Garbage Collection**。
    3. 重新啟動瀏覽器。

</tab>
<tab title="Firefox">

對於 109 或更高版本：

1. 在瀏覽器中前往 `about:config`。
2. 啟用 `javascript.options.wasm_function_references` 和 `javascript.options.wasm_gc` 選項。
3. 重新啟動瀏覽器。

</tab>
<tab title="Edge">

對於 109 或更高版本：

使用 `--js-flags=--experimental-wasm-gc` 命令列引數執行應用程式。

</tab>
</tabs>

### 對 Kotlin/Wasm 提供回饋

我們非常感謝您提供的任何回饋！

* 在 Kotlin Slack 上直接向開發人員提供您的回饋 – [獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)並加入 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 頻道。
* 在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-56492) 上報告您在使用 Kotlin/Wasm 時遇到的任何問題。

## Kotlin/JVM

Kotlin 1.8.20 引入了 [Java 合成屬性參照預覽](#preview-of-java-synthetic-property-references)，以及 [預設在 kapt 虛設常式產生任務中支援 JVM IR 後端](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)。

### Java 合成屬性參照預覽

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被刪除或更改。僅用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上對此提供回饋。
>
{style="warning"}

Kotlin 1.8.20 引入了建立對 Java 合成屬性參照的能力，例如，對於如下 Java 程式碼：

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

Kotlin 一直允許您編寫 `person.age`，其中 `age` 是一個合成屬性。現在，您也可以建立對 `Person::age` 和 `person::age` 的參照。同樣地，這對 `name` 也適用。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // 呼叫 Java 合成屬性參照：
        .sortedBy(Person::age)
        // 透過 Kotlin 屬性語法呼叫 Java getter：
        .forEach { person -> println(person.name) }
```
{validate="false"}

#### 如何啟用 Java 合成屬性參照

要試用此功能，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過在 `build.gradle(.kts)` 中新增以下內容來實現：

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

### 預設在 kapt 虛設常式產生任務中支援 JVM IR 後端

在 Kotlin 1.7.20 中，我們引入了 [對 kapt 虛設常式產生任務中 JVM IR 後端的支援](whatsnew1720.md#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)。從此版本開始，此支援將預設啟用。您不再需要在 `gradle.properties` 中指定 `kapt.use.jvm.ir=true` 來啟用它。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 上對此功能提供回饋。

## Kotlin/Native

Kotlin 1.8.20 包含對支援的 Kotlin/Native 目標、與 Objective-C 的互通性以及 CocoaPods Gradle 外掛程式的改進等更新：

* [Kotlin/Native 目標更新](#update-for-kotlin-native-targets)
* [棄用舊版記憶體管理器](#deprecation-of-the-legacy-memory-manager)
* [支援具有 @import 指示詞的 Objective-C 標頭](#support-for-objective-c-headers-with-import-directives)
* [CocoaPods Gradle 外掛程式支援 link-only 模式](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
* [在 UIKit 中將 Objective-C 擴充功能作為類別成員匯入](#import-objective-c-extensions-as-class-members-in-uikit)
* [在編譯器中重新實作編譯器快取管理](#reimplementation-of-compiler-cache-management-in-the-compiler)
* [在 CocoaPods Gradle 外掛程式中棄用 `useLibraries()`](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Native 目標更新
  
Kotlin 團隊決定重新檢視 Kotlin/Native 支援的目標列表，將其分為不同層級 (tiers)，並從 Kotlin 1.8.20 開始棄用其中一部分。請參閱 [Kotlin/Native 目標支援](native-target-support.md)章節以獲取支援和棄用目標的完整列表。

以下目標已在 Kotlin 1.8.20 中棄用，並將在 1.9.20 中移除：

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

至於其餘目標，現在根據目標在 Kotlin/Native 編譯器中的支援和測試程度分為三個支援層級。目標可能會被移動到不同的層級。例如，我們將盡最大努力在未來為 `iosArm64` 提供完整支援，因為它對 [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 非常重要。

如果您是程式庫作者，這些目標層級可以幫助您決定在 CI 工具上測試哪些目標以及跳過哪些目標。Kotlin 團隊在開發官方 Kotlin 函式庫（如 [kotlinx.coroutines](coroutines-guide.md)）時也將採用相同的方法。

請查看我們的 [部落格文章](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/) 以了解有關這些變更原因的更多資訊。

### 棄用舊版記憶體管理器

從 1.8.20 開始，舊版記憶體管理器已被棄用，並將在 1.9.20 中移除。[新記憶體管理器](native-memory-manager.md)已在 1.7.20 中預設啟用，並且一直在接受進一步的穩定性更新和效能改進。

如果您仍在使用舊版記憶體管理器，請從 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=strict` 選項，並按照我們的 [遷移指南](native-migration-guide.md) 進行必要的變更。

新記憶體管理器不支援 `wasm32` 目標。該目標也從[此版本開始棄用](#update-for-kotlin-native-targets)，並將在 1.9.20 中移除。

### 支援具有 @import 指示詞的 Objective-C 標頭

> 此功能為 [實驗性](components-stability.md#stability-levels-explained)。它可能隨時被刪除或更改。需要加入 (opt-in)（詳見下文）。僅用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上對此提供回饋。
>
{style="warning"}

Kotlin/Native 現在可以匯入具有 `@import` 指示詞的 Objective-C 標頭。此功能對於使用具有自動產生 Objective-C 標頭的 Swift 程式庫，或使用以 Swift 編寫的 CocoaPods 相依性類別非常有用。

以前，cinterop 工具無法分析透過 `@import` 指示詞依賴 Objective-C 模組的標頭。原因是它缺乏對 `-fmodules` 選項的支援。

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

這是一個 [備受期待的功能](https://youtrack.jetbrains.com/issue/KT-39120)，我們歡迎您在 [YouTrack](https://kotl.in/issue) 中提供相關回饋，以幫助我們在未來版本中將其作為預設設定。

### CocoaPods Gradle 外掛程式支援 link-only 模式

在 Kotlin 1.8.20 中，您可以將具有動態框架的 Pod 相依性僅用於連結，而無需產生 cinterop 綁定。這在已經產生了 cinterop 綁定時可能會派上用場。

考慮一個具有 2 個模組（一個程式庫和一個應用程式）的專案。該程式庫依賴於一個 Pod，但不產生框架，僅產生一個 `.klib`。應用程式依賴於該程式庫並產生一個動態框架。在這種情況下，您需要將此框架與程式庫所依賴的 Pod 連結，但您不需要 cinterop 綁定，因為它們已經為程式庫產生了。

要啟用此功能，請在新增 Pod 相依性時使用 `linkOnly` 選項或構建器屬性：

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

> 如果您對靜態框架使用此選項，它將完全移除 Pod 相依性，因為 Pod 不用於靜態框架連結。
>
{style="note"}

### 在 UIKit 中將 Objective-C 擴充功能作為類別成員匯入

自 Xcode 14.1 起，Objective-C 類別中的一些方法已移至類別 (category) 成員。這導致產生了不同的 Kotlin API，並且這些方法被作為 Kotlin 擴充功能而非方法匯入。

在使用 UIKit 覆寫方法時，您可能遇到過由此引起的問題。例如，在 Kotlin 中對 UIView 進行子類化時，變得無法覆寫 `drawRect()` 或 `layoutSubviews()` 方法。

從 1.8.20 開始，在與 NSView 和 UIView 類別相同的標頭中宣告的類別成員將作為這些類別的成員匯入。這意味著從 NSView 和 UIView 子類化的方法可以像任何其他方法一樣輕鬆覆寫。

如果一切順利，我們計劃對所有 Objective-C 類別預設啟用此行為。

### 在編譯器中重新實作編譯器快取管理

為了加速編譯器快取的演進，我們已將編譯器快取管理從 Kotlin Gradle 外掛程式移至 Kotlin/Native 編譯器。這解除了幾項重要改進的工作，包括與編譯時間和編譯器快取靈活性相關的改進。

如果您遇到某些問題並需要返回舊行為，請使用 `kotlin.native.cacheOrchestration=gradle` Gradle 屬性。

我們非常感謝您 [在 YouTrack 上](https://kotl.in/issue) 提供相關回饋。

### 在 CocoaPods Gradle 外掛程式中棄用 useLibraries()

Kotlin 1.8.20 開始了對用於靜態程式庫 [CocoaPods 整合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) 的 `useLibraries()` 函式的棄用週期。

我們引入 `useLibraries()` 函式是為了允許對包含靜態程式庫的 Pod 進行依賴。隨著時間的推移，這種情況已變得非常少見。大多數 Pod 是透過原始碼分發的，而 Objective-C 框架或 XCFrameworks 是二進位分發的常見選擇。

由於此函式不受歡迎，且會產生使 Kotlin CocoaPods Gradle 外掛程式開發複雜化的問題，我們決定將其棄用。

有關框架和 XCFrameworks 的更多資訊，請參閱 [建置最終的原生二進位檔案](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。

## Kotlin Multiplatform

Kotlin 1.8.20 致力於透過以下 Kotlin Multiplatform 更新來改進開發者體驗：

* [設定原始碼集階層結構的新方法](#new-approach-to-source-set-hierarchy)
* [Kotlin Multiplatform 中 Gradle 複合組建支援的預覽](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [改進 Xcode 中 Gradle 錯誤的輸出](#improved-output-for-gradle-errors-in-xcode)

### 設定原始碼集階層結構的新方法

> 設定原始碼集階層結構的新方法處於 [實驗階段](components-stability.md#stability-levels-explained)。未來 Kotlin 版本可能會在不事先通知的情況下進行更改。需要加入 (opt-in)（詳見下文）。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 提供回饋。
>
{style="warning"}

Kotlin 1.8.20 在您的多平台專案中提供了一種設定原始碼集階層結構的新方法 − 預設目標階層結構。新方法旨在取代像 `ios` 這樣的目標捷徑，因為這些捷徑有其 [設計缺陷](#why-replace-shortcuts)。

預設目標階層結構背後的想法很簡單：您明確宣告專案編譯到的所有目標，Kotlin Gradle 外掛程式會根據指定的目標自動建立共享的原始碼集。

#### 設定您的專案

考慮這個簡單的多平台行動應用程式範例：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // 啟用預設目標階層結構：
    targetHierarchy.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

您可以將預設目標階層結構視為所有可能目標及其共享原始碼集的範本。當您在程式碼中宣告最終目標 `android`、`iosArm64` 和 `iosSimulatorArm64` 時，Kotlin Gradle 外掛程式會從範本中找到合適的共享原始碼集並為您建立它們。產生的階層結構如下所示：

![使用預設目標階層結構的範例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

綠色的原始碼集是專案中實際建立並存在的，而預設範本中的灰色原始碼集則被忽略。如您所見，Kotlin Gradle 外掛程式沒有建立 `watchos` 原始碼集，因為專案中沒有 watchOS 目標。

如果您新增一個 watchOS 目標（例如 `watchosArm64`），則會建立 `watchos` 原始碼集，並且來自 `apple`、`native` 和 `common` 原始碼集的程式碼也會編譯到 `watchosArm64`。

您可以在 [文件](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template) 中找到預設目標階層結構的完整方案。

> 在此範例中，`apple` 和 `native` 原始碼集僅編譯到 `iosArm64` 和 `iosSimulatorArm64` 目標。因此，儘管名稱如此，它們仍可存取完整的 iOS API。這對於 `native` 這樣的原始碼集可能不太直觀，因為您可能期望在此原始碼集中只能存取所有原生目標上都可用的 API。此行為將來可能會改變。
>
{style="note"}

#### 為什麼要替換捷徑 {initial-collapse-state="collapsed" collapsible="true"}

建立原始碼集階層結構可能非常冗長、容易出錯且對初學者不友好。我們之前的解決方案是引入像 `ios` 這樣的捷徑，為您建立階層結構的一部分。然而，使用捷徑的經驗證明它們有一個很大的設計缺陷：很難更改。

以 `ios` 捷徑為例。它僅建立 `iosArm64` 和 `iosX64` 目標，這可能會令人困惑，並且在需要 `iosSimulatorArm64` 目標的 M1 主機上工作時可能會導致問題。然而，新增 `iosSimulatorArm64` 目標對使用者專案來說可能是一個非常具有破壞性的變更：

* `iosMain` 原始碼集中使用的所有相依性都必須支援 `iosSimulatorArm64` 目標；否則，相依性解析將失敗。
* 新增目標時，`iosMain` 中使用的某些原生 API 可能會消失（儘管在 `iosSimulatorArm64` 的情況下不太可能發生）。
* 在某些情況下，例如在基於 Intel 的 MacBook 上編寫一個小型個人專案時，您甚至可能不需要此變更。

顯然，捷徑並沒有解決配置階層結構的問題，這就是為什麼我們在某個時候停止新增新捷徑的原因。

預設目標階層結構乍看之下可能與捷徑相似，但它們有一個關鍵區別：**使用者必須明確指定目標集**。此集合定義了專案如何編譯和發佈，以及它如何參與相依性解析。由於此集合是固定的，因此來自 Kotlin Gradle 外掛程式的預設配置變更對生態系統造成的困擾應該會顯著減少，並且提供工具輔助遷移也會容易得多。

#### 如何啟用預設階層結構

這項新功能是 [實驗性的](components-stability.md#stability-levels-explained)。對於 Kotlin Gradle 組建指令碼，您需要使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 加入。

更多資訊請參閱 [階層式專案結構](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)。

#### 提供回饋

這是對多平台專案的一項重大變更。我們非常感謝您的 [回饋](https://kotl.in/issue)，以幫助我們做得更好。

### Kotlin Multiplatform 中 Gradle 複合組建支援的預覽

> 自 Kotlin Gradle Plugin 1.8.20 起，Gradle 組建已支援此功能。對於 IDE 支援，請使用 IntelliJ IDEA 2023.1 Beta 2 (231.8109.2) 或更高版本，以及搭配任何 Kotlin IDE 外掛程式的 Kotlin Gradle Plugin 1.8.20。
>
{style="note"}

從 1.8.20 開始，Kotlin Multiplatform 支援 [Gradle 複合組建](https://docs.gradle.org/current/userguide/composite_builds.html)。複合組建允許您將不同專案或同一專案不同部分的組建包含到單個組建中。

由於一些技術挑戰，將 Gradle 複合組建與 Kotlin Multiplatform 結合使用以前僅獲得部分支援。Kotlin 1.8.20 包含改進支援的預覽版，該支援應適用於更多種類的專案。要試用它，請在您的 `gradle.properties` 中新增以下選項：

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

此選項啟用了新匯入模式的預覽。除了支援複合組建外，它還在多平台專案中提供了更流暢的匯入體驗，因為我們包含了一些主要的錯誤修復和改進，以使匯入更加穩定。

#### 已知問題

這仍然是一個需要進一步穩定的預覽版本，您在此過程中可能會遇到一些匯入問題。以下是我們計劃在 Kotlin 1.8.20 最終版本發佈前修復的一些已知問題：

* IntelliJ IDEA 2023.1 EAP 尚無可用的 Kotlin 1.8.20 外掛程式。儘管如此，您仍可以將 Kotlin Gradle 外掛程式版本設定為 1.8.20，並在此 IDE 中嘗試複合組建。
* 如果您的專案包含指定了 `rootProject.name` 的組建，則複合組建可能無法解析 Kotlin 中繼資料。有關因應措施和詳細資訊，請參閱此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-56536)。

我們鼓勵您試用它並在 [YouTrack](https://kotl.in/issue) 上提交所有報告，以幫助我們使其在 Kotlin 1.9.0 中成為預設設定。

### 改進 Xcode 中 Gradle 錯誤的輸出

如果您在 Xcode 中建置多平台專案時遇到問題，您可能遇到過 "Command PhaseScriptExecution failed with a nonzero exit code" 錯誤。此訊息表示 Gradle 調用失敗，但在嘗試偵測問題時並非很有幫助。

從 Kotlin 1.8.20 開始，Xcode 可以剖析來自 Kotlin/Native 編譯器的輸出。此外，如果 Gradle 建置失敗，您將在 Xcode 中看到來自根本原因異常的額外錯誤訊息。在大多數情況下，這將有助於識別根本問題。

![改進 Xcode 中 Gradle 錯誤的輸出](xcode-gradle-output.png){width=700}

新行為已預設為標準的 Xcode 整合 Gradle 任務（如 `embedAndSignAppleFrameworkForXcode`）啟用，該任務可以將您的多平台專案中的 iOS 框架連接到 Xcode 中的 iOS 應用程式。也可以使用 `kotlin.native.useXcodeMessageStyle` Gradle 屬性來啟用（或停用）它。

## Kotlin/JavaScript

Kotlin 1.8.20 更改了產生 TypeScript 定義的方式。它還包含一項旨在改進偵錯體驗的變更：

* [從 Gradle 外掛程式中移除 Dukat 整合](#removal-of-dukat-integration-from-gradle-plugin)
* [原始碼對應檔中的 Kotlin 變數和函式名稱](#kotlin-variable-and-function-names-in-source-maps)
* [加入 TypeScript 定義檔案的產生](#opt-in-for-generation-of-typescript-definition-files)

### 從 Gradle 外掛程式中移除 Dukat 整合

在 Kotlin 1.8.20 中，我們已從 Kotlin/JavaScript Gradle 外掛程式中移除了 [實驗性](components-stability.md#stability-levels-explained) 的 Dukat 整合。Dukat 整合支援將 TypeScript 宣告檔案 (`.d.ts`) 自動轉換為 Kotlin 外部宣告。

您仍然可以使用我們的 [Dukat 工具](https://github.com/Kotlin/dukat) 將 TypeScript 宣告檔案 (`.d.ts`) 轉換為 Kotlin 外部宣告。

> Dukat 工具是 [實驗性的](components-stability.md#stability-levels-explained)。它可能隨時被刪除或更改。
>
{style="warning"}

### 原始碼對應檔中的 Kotlin 變數和函式名稱

為了幫助偵錯，我們引入了將您在 Kotlin 程式碼中為變數和函式宣告的名稱新增到原始碼對應檔的功能。在 1.8.20 之前，這些在原始碼對應檔中不可用，因此在偵錯工具中，您始終只能看到產生的 JavaScript 的變數和函式名稱。

您可以透過在 Gradle 檔案 `build.gradle.kts` 中使用 `sourceMapNamesPolicy` 或 `-source-map-names-policy` 編譯器選項來配置新增內容。下表列出了可能的設定：

| 設定                    | 描述                                                   | 範例輸出                           |
|-------------------------|--------------------------------------------------------|-----------------------------------|
| `simple-names`          | 新增變數名稱和簡單的函式名稱。（預設）                    | `main`                            |
| `fully-qualified-names` | 新增變數名稱和完全限定的函式名稱。                        | `com.example.kjs.playground.main` |
| `no`                    | 不新增變數或函式名稱。                                    | N/A                               |

請參閱下方 `build.gradle.kts` 檔案中的配置範例：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.Kotlin2JsCompile>().configureEach {
    compilercompileOptions.sourceMapNamesPolicy.set(org.jetbrains.kotlin.gradle.dsl.JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES) // 或 SOURCE_MAP_NAMES_POLICY_NO, 或 SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES
}
```
{validate="false"}

Chromium 系列瀏覽器提供的偵錯工具可以從您的原始碼對應檔中獲取原始 Kotlin 名稱，以提高堆疊追蹤的可讀性。祝偵錯愉快！

> 在原始碼對應檔中新增變數和函式名稱是 [實驗性的](components-stability.md#stability-levels-explained)。它可能隨時被刪除或更改。
>
{style="warning"}

### 加入 TypeScript 定義檔案的產生

以前，如果您有一個產生可執行檔案的專案 (`binaries.executable()`)，Kotlin/JS IR 編譯器會收集標有 `@JsExport` 的任何頂層宣告，並自動在 `.d.ts` 檔案中產生 TypeScript 定義。

由於這並非對每個專案都有用，我們在 Kotlin 1.8.20 中更改了此行為。如果您想產生 TypeScript 定義，則必須在 Gradle 建置檔案中明確配置。在 `build.gradle.kts` 檔案的 [`js` 區段](js-project-setup.md#execution-environments) 中新增 `generateTypeScriptDefinitions()`。例如：

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

> TypeScript 定義 (`d.ts`) 的產生是 [實驗性的](components-stability.md#stability-levels-explained)。它可能隨時被刪除或更改。
>
{style="warning"}

## Gradle

Kotlin 1.8.20 與 Gradle 6.8 到 7.6 完全相容，但 [多平台外掛程式中的一些特殊情況](https://youtrack.jetbrains.com/issue/KT-55751) 除外。您也可以使用到最新 Gradle 發佈版本為止的版本，但如果這樣做，請記住您可能會遇到棄用警告，或者某些新的 Gradle 功能可能無法運作。

此版本帶來了以下變更：

* [Gradle 外掛程式版本的新對齊方式](#new-gradle-plugins-versions-alignment)
* [Gradle 中預設啟用的新 JVM 增量編譯](#new-jvm-incremental-compilation-by-default-in-gradle)
* [編譯任務輸出的精確備份](#precise-backup-of-compilation-tasks-outputs)
* [所有 Gradle 版本的延遲 Kotlin/JVM 任務建立](#lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions)
* [編譯任務 destinationDirectory 的非預設位置](#non-default-location-of-compile-tasks-destinationdirectory)
* [能夠選擇不向 HTTP 統計服務報告編譯器引數](#ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service)

### Gradle 外掛程式版本的新對齊方式

Gradle 提供了一種方法來確保必須協同工作的相依性始終 [版本對齊](https://docs.gradle.org/current/userguide/dependency_version_alignment.html#aligning_versions_natively_with_gradle)。Kotlin 1.8.20 也採用了這種方法。它預設運作，因此您不需要更改或更新配置即可啟用它。此外，您不再需要使用 [解決 Kotlin Gradle 外掛程式遞移相依性的因應措施](whatsnew18.md#resolution-of-kotlin-gradle-plugins-transitive-dependencies)。

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-54691) 上對此功能提供回饋。

### Gradle 中預設啟用的新 JVM 增量編譯

新的增量編譯方法（[自 Kotlin 1.7.0 起可用](whatsnew17.md#a-new-approach-to-incremental-compilation)）現在已預設啟用。您不再需要在 `gradle.properties` 中指定 `kotlin.incremental.useClasspathSnapshot=true` 來啟用它。

我們非常感謝您對此提供回饋。您可以在 YouTrack 中 [提交問題](https://kotl.in/issue)。

### 編譯任務輸出的精確備份

> 編譯任務輸出的精確備份是 [實驗性的](components-stability.md#stability-levels-explained)。要使用它，請將 `kotlin.compiler.preciseCompilationResultsBackup=true` 新增到 `gradle.properties`。我們非常感謝您在 [YouTrack](https://kotl.in/issue/experimental-ic-optimizations) 上對此提供回饋。
>
{style="warning"}

從 Kotlin 1.8.20 開始，您可以啟用精確備份，僅備份 Kotlin 在 [增量編譯](gradle-compilation-and-caches.md#incremental-compilation) 中重新編譯的那些類別。完整備份和精確備份都有助於在編譯錯誤後再次以增量方式執行建置。與完整備份相比，精確備份還可以節省建置時間。在大型專案中，或者如果許多任務都在進行備份，完整備份可能會消耗 **顯著的** 建置時間，特別是如果專案位於慢速 HDD 上。

此優化是實驗性的。您可以透過將 `kotlin.compiler.preciseCompilationResultsBackup` Gradle 屬性新增到 `gradle.properties` 檔案來啟用它：

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrains 中精確備份的使用範例 {initial-collapse-state="collapsed" collapsible="true"}

在以下圖表中，您可以看到精確備份與完整備份的對比範例：

![完整備份與精確備份的比較](comparison-of-full-and-precise-backups.png){width=700}

第一張和第二張圖表顯示了 Kotlin 專案中精確備份如何影響 Kotlin Gradle 外掛程式的建置：

1. 在對許多模組依賴的模組進行小型 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 更改（新增新的公開方法）之後。
2. 在對沒有其他模組依賴的模組進行小型非 ABI 更改（新增私有函式）之後。

第三張圖表顯示了 [Space](https://www.jetbrains.com/space/) 專案中的精確備份如何影響在對許多模組依賴的 Kotlin/JS 模組進行小型非 ABI 更改（新增私有函式）後 Web 前端的建置。

這些測量是在配備 Apple M1 Max CPU 的電腦上執行的；不同的電腦會產生略微不同的結果。影響效能的因素包括但不限於：

* [Kotlin 守護程序 (daemon)](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle) 和 [Gradle 守護程序](https://docs.gradle.org/current/userguide/gradle_daemon.html) 的熱度。
* 磁碟的速度。
* CPU 型號及其忙碌程度。
* 哪些模組受更改影響以及這些模組的大小。
* 更改是 ABI 還是非 ABI。

#### 使用建置報告評估優化 {initial-collapse-state="collapsed" collapsible="true"}

要估計優化對您的電腦、專案和場景的影響，您可以使用 [Kotlin 建置報告](gradle-compilation-and-caches.md#build-reports)。透過將以下屬性新增到您的 `gradle.properties` 檔案中，以文字檔案格式啟用報告：

```none
kotlin.build.report.output=file
```

以下是啟用精確備份前報告相關部分的範例：

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.59 s
<...>
Time metrics:
 Total Gradle task time: 0.59 s
 Task action before worker execution: 0.24 s
  Backup output: 0.22 s // 注意這個數字 
<...>
```

以下是啟用精確備份後報告相關部分的範例：

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.46 s
<...>
Time metrics:
 Total Gradle task time: 0.46 s
 Task action before worker execution: 0.07 s
  Backup output: 0.05 s // 時間縮短了
 Run compilation in Gradle worker: 0.32 s
  Clear jar cache: 0.00 s
  Precise backup output: 0.00 s // 與精確備份相關
  Cleaning up the backup stash: 0.00 s // 與精確備份相關
<...>
```

### 所有 Gradle 版本的延遲 Kotlin/JVM 任務建立

對於在 Gradle 7.3+ 上使用 `org.jetbrains.kotlin.gradle.jvm` 外掛程式的專案，Kotlin Gradle 外掛程式不再過早建立和配置任務 `compileKotlin`。在較低版本的 Gradle 上，它僅註冊所有任務而不進行試運行配置。在使用 Gradle 7.3+ 時，現在也採用相同的行為。

### 編譯任務 destinationDirectory 的非預設位置

如果您執行以下操作之一，請使用一些額外程式碼更新您的建置指令碼：

* 覆寫 Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 任務的 `destinationDirectory` 位置。
* 使用已棄用的 Kotlin/JS/Non-IR [變體](gradle-plugin-variants.md) 並覆寫 `Kotlin2JsCompile` 任務的 `destinationDirectory`。

您需要在 JAR 檔案中明確將 `sourceSets.main.kotlin.classesDirectories` 新增到 `sourceSets.main.outputs`：

```groovy
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

### 能夠選擇不向 HTTP 統計服務報告編譯器引數

您現在可以控制 Kotlin Gradle 外掛程式是否應在 HTTP [建置報告](gradle-compilation-and-caches.md#build-reports) 中包含編譯器引數。有時，您可能不需要外掛程式報告這些引數。如果專案包含許多模組，其報告中的編譯器引數可能會非常沈重且並非那麼有用。現在有一種方法可以停用它並從而節省記憶體。在您的 `gradle.properties` 或 `local.properties` 中，使用 `kotlin.build.report.include_compiler_arguments=(true|false)` 屬性。

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55323/) 上對此功能提供回饋。

## 標準函式庫

Kotlin 1.8.20 新增了多種新功能，其中一些對於 Kotlin/Native 開發特別有用：

* [支援 AutoCloseable 介面](#support-for-the-autocloseable-interface)
* [支援 Base64 編碼和解碼](#support-for-base64-encoding)
* [Kotlin/Native 中對 @Volatile 的支援](#support-for-volatile-in-kotlin-native)
* [修復了在 Kotlin/Native 中使用正規表示式時發生的堆疊溢位錯誤](#bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native)

### 支援 AutoCloseable 介面

> 新的 `AutoCloseable` 介面是 [實驗性的](components-stability.md#stability-levels-explained)，要使用它，您需要使用 `@OptIn(ExperimentalStdlibApi::class)` 或編譯器引數 `-opt-in=kotlin.ExperimentalStdlibApi` 加入。
>

{style="warning"}

`AutoCloseable` 介面已新增到通用標準函式庫中，以便您可以使用一個通用介面來讓所有函式庫關閉資源。在 Kotlin/JVM 中，`AutoCloseable` 介面是 [`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html) 的別名。

此外，現在還包含了擴充功能函式 `use()`，它會在所選資源上執行指定的區塊函式，然後無論是否拋出異常，都會正確地將其關閉。

通用標準函式庫中沒有實作 `AutoCloseable` 介面的公開類別。在下面的範例中，我們定義了 `XMLWriter` 介面並假設有一個實作它的資源。例如，此資源可以是一個開啟檔案、寫入 XML 內容然後將其關閉的類別。

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

> 新的編碼和解碼功能是 [實驗性的](components-stability.md#stability-levels-explained)，要使用它，您需要使用 `@OptIn(ExperimentalEncodingApi::class)` 或編譯器引數 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi` 加入。
>
{style="warning"}

我們新增了對 Base64 編碼和解碼的支援。我們提供了 3 個類別執行個體，每個執行個體使用不同的編碼方案並展現不同的行為。對於標準的 [Base64 編碼方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)，請使用 `Base64.Default` 執行個體。

對於 ["URL and Filename safe"](https://www.rfc-editor.org/rfc/rfc4648#section-5) 編碼方案，請使用 `Base64.UrlSafe` 執行個體。

對於 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 編碼方案，請使用 `Base64.Mime` 執行個體。當您使用 `Base64.Mime` 執行個體時，所有編碼函式每 76 個字元就會插入一個行分隔符。在解碼的情況下，任何非法字元都會被跳過，而不會拋出異常。

> `Base64.Default` 執行個體是 `Base64` 類別的伴隨物件。因此，您可以透過 `Base64.encode()` 和 `Base64.decode()` 呼叫其函式，而不必使用 `Base64.Default.encode()` 和 `Base64.Default.decode()`。
>
{style="tip"}

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// 或者：
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// 或者：
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```
{validate="false"}

您可以使用額外的函式將位元組編碼或解碼到現有的緩衝區中，以及將編碼結果附加到提供的 `Appendable` 型別物件上。

在 Kotlin/JVM 中，我們還新增了擴充功能函式 `encodingWith()` 和 `decodingWith()`，以便您能夠使用輸入和輸出流執行 Base64 編碼和解碼。

### Kotlin/Native 中對 @Volatile 的支援

> Kotlin/Native 中的 `@Volatile` 是 [實驗性的](components-stability.md#stability-levels-explained)。它可能隨時被刪除或更改。需要加入 (opt-in)（詳見下文）。僅用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上提供相關回饋。
>
{style="warning"}

如果您使用 `@Volatile` 註解一個 `var` 屬性，那麼後置欄位會被標記，以便對此欄位的任何讀取或寫入都是不可分割的，並且寫入對於其他執行緒始終可見。

在 1.8.20 之前，[`kotlin.jvm.Volatile` 註解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/) 僅在通用標準函式庫中可用。然而，此註解僅在 JVM 中有效。如果您在 Kotlin/Native 中使用它，它會被忽略，這可能會導致錯誤。

在 1.8.20 中，我們引入了一個通用註解 `kotlin.concurrent.Volatile`，您可以在 JVM 和 Kotlin/Native 中同時使用它。

#### 如何啟用

要試用此功能，請使用 `@OptIn(ExperimentalStdlibApi)` 加入，並啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過在 `build.gradle(.kts)` 檔案中新增以下內容來實現：

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

### 修復了在 Kotlin/Native 中使用正規表示式時發生的堆疊溢位錯誤

在先前的 Kotlin 版本中，如果您的正規表示式輸入包含大量字元，即使正規表示式模式非常簡單，也可能會發生當機。在 1.8.20 中，此問題已得到解決。欲了解更多資訊，請參閱 [KT-46211](https://youtrack.jetbrains.com/issue/KT-46211)。

## 序列化更新

Kotlin 1.8.20 帶來了 [對 Kotlin K2 編譯器的 Alpha 支援](#prototype-serialization-compiler-plugin-for-kotlin-k2-compiler)，並 [禁止透過伴隨物件進行序列化程式自訂](#prohibit-implicit-serializer-customization-via-companion-object)。

### 用於 Kotlin K2 編譯器的原型序列化編譯器外掛程式

> 對 K2 的序列化編譯器外掛程式支援處於 [Alpha](components-stability.md#stability-levels-explained) 階段。要使用它，請 [啟用 Kotlin K2 編譯器](#how-to-enable-the-kotlin-k2-compiler)。
>
{style="warning"}

從 1.8.20 開始，序列化編譯器外掛程式可與 Kotlin K2 編譯器配合使用。請試用它並 [與我們分享您的回饋](#leave-your-feedback-on-the-new-k2-compiler)！

### 禁止透過伴隨物件進行隱式序列化程式自訂

目前，可以使用 `@Serializable` 註解將類別宣告為可序列化，同時在其伴隨物件上使用 `@Serializer` 註解宣告自訂序列化程式。

例如：

```kotlin
import kotlinx.serialization.*

@Serializable
class Foo(val a: Int) {
    @Serializer(Foo::class)
    companion object {
        // KSerializer<Foo> 的自訂實作
    }
}
```

在這種情況下，僅從 `@Serializable` 註解看不出使用了哪個序列化程式。實際上，`Foo` 類別有一個自訂序列化程式。

為了防止這種困惑，在 Kotlin 1.8.20 中，我們引入了一個編譯器警告，用於偵測到此類場景。該警告包含了可能的遷移路徑來解決此問題。

如果您在程式碼中使用此類結構，我們建議將其更新為如下所示：

```kotlin
import kotlinx.serialization.*

@Serializable(Foo.Companion::class)
class Foo(val a: Int) {
    // 使用或不使用 @Serializer(Foo::class) 都沒關係
    companion object: KSerializer<Foo> {
        // KSerializer<Foo> 的自訂實作
    }
}
```

透過這種方法，可以清楚地看到 `Foo` 類別使用的是在伴隨物件中宣告的自訂序列化程式。欲了解更多資訊，請參閱我們的 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-54441)。

> 在 Kotlin 2.0 中，我們計劃將編譯警告升級為編譯錯誤。如果您看到此警告，建議您遷移程式碼。
>
{style="tip"}

## 文件更新

Kotlin 文件進行了一些顯著的更改：

* [開始使用 Spring Boot 和 Kotlin](jvm-get-started-spring-boot.md) – 建立一個帶有資料庫的簡單應用程式，並了解有關 Spring Boot 和 Kotlin 特性的更多資訊。
* [作用域函式 (Scope functions)](scope-functions.md) – 了解如何使用標準函式庫中實用的作用域函式來簡化您的程式碼。
* [CocoaPods 整合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) – 設定使用 CocoaPods 的環境。

## 安裝 Kotlin 1.8.20

### 檢查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.2 和 2022.3 會自動建議將 Kotlin 外掛程式更新到 1.8.20 版本。IntelliJ IDEA 2023.1 內建了 Kotlin 外掛程式 1.8.20。

Android Studio Flamingo (222) 和 Giraffe (223) 將在下一個版本中支援 Kotlin 1.8.20。

新的命令列編譯器可在 [GitHub 發佈頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20) 下載。

### 配置 Gradle 設定

要正確下載 Kotlin 構件和相依性，請更新您的 `settings.gradle(.kts)` 檔案以使用 Maven Central 儲存庫：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

如果未指定儲存庫，Gradle 會使用已停用的 JCenter 儲存庫，這可能會導致 Kotlin 構件出現問題。