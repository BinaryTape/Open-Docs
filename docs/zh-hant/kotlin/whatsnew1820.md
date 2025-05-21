---
title: "Kotlin 1.8.20 的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[已發佈：2023 年 4 月 25 日](releases#release-details)_

Kotlin 1.8.20 版本已發佈，以下是一些最重要的亮點：

* [新的 Kotlin K2 編譯器更新](#new-kotlin-k2-compiler-updates)
* [新的實驗性 Kotlin/Wasm 目標](#new-kotlin-wasm-target)
* [預設在 Gradle 中使用新的 JVM 增量編譯](#new-jvm-incremental-compilation-by-default-in-gradle)
* [Kotlin/Native 目標的更新](#update-for-kotlin-native-targets)
* [Kotlin Multiplatform 中 Gradle 複合建置的預覽](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [改進了 Xcode 中 Gradle 錯誤的輸出](#improved-output-for-gradle-errors-in-xcode)
* [標準函式庫中對 AutoCloseable 介面的實驗性支援](#support-for-the-autocloseable-interface)
* [標準函式庫中對 Base64 編碼的實驗性支援](#support-for-base64-encoding)

您還可以在此影片中找到變更的簡短概述：

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="What's new in Kotlin 1.8.20"/>

## IDE 支援

支援 1.8.20 的 Kotlin 插件可用於：

| IDE            | 支援的版本            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |
:::note
為了正確下載 Kotlin 成品（Artifacts）和依賴項（Dependencies），[設定 Gradle 設定](#configure-gradle-settings)
以使用 Maven Central 儲存庫。

## 新的 Kotlin K2 編譯器更新

Kotlin 團隊持續穩定 K2 編譯器。如
[Kotlin 1.7.0 公告](whatsnew17#new-kotlin-k2-compiler-for-the-jvm-in-alpha)中所述，它仍處於 **Alpha** 階段。
此版本在 [K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604) 的道路上引入了進一步的改進。

從 1.8.20 版本開始，Kotlin K2 編譯器：

* 具有序列化插件的預覽版本。
* 為 [JS IR 編譯器](js-ir-compiler)提供 Alpha 支援。
* 引入了未來版本的
  [新語言版本 Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/)。

在以下影片中了解有關新編譯器及其優點的更多資訊：

* [What Everyone Must Know About The NEW Kotlin K2 Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [The New Kotlin K2 Compiler: Expert Review](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何啟用 Kotlin K2 編譯器

若要啟用和測試 Kotlin K2 編譯器，請使用具有以下編譯器選項的新語言版本：

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

新的 K2 編譯器的 Alpha 版本僅適用於 JVM 和 JS IR 專案。
它尚不支援 Kotlin/Native 或任何多平台專案。

### 留下您對新 K2 編譯器的意見反應

我們將感謝您的任何意見反應！

* 在 Kotlin Slack 上直接向 K2 開發人員提供您的意見反應 – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
* 在 [我們的問題追蹤器](https://kotl.in/issue) 上回報您在使用新的 K2 編譯器時遇到的任何問題。
* [啟用 **傳送使用情況統計資料** 選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以
  允許 JetBrains 收集有關 K2 使用情況的匿名資料。

## 語言

隨著 Kotlin 的持續發展，我們在 1.8.20 中引入了新語言功能的預覽版本：

* [Enum 類別 `values` 函式的現代化和高效能替代方案](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
* [用於與資料類別對稱的資料物件](#preview-of-data-objects-for-symmetry-with-data-classes)
* [取消對內聯類別中具有主體的次要建構函式的限制](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum 類別 `values` 函式的現代化和高效能替代方案

此功能是 [實驗性](components-stability#stability-levels-explained) 的。
它可能會隨時刪除或變更。需要選擇加入（請參閱以下詳細資訊）。僅將其用於評估目的。
我們將感謝您在 [YouTrack](https://kotl.in/issue) 上對其提出的意見反應。

Enum 類別具有合成 `values()` 函式，該函式會傳回已定義的 enum 常數陣列。但是，使用陣列可能會導致 Kotlin 和 Java 中 [隱藏的效能問題](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries#examples-of-performance-issues)。此外，大多數 API 都使用集合，這需要最終轉換。為了修正這些問題，我們為 Enum 類別引入了 `entries` 屬性，應使用該屬性來取代 `values()` 函式。呼叫時，`entries` 屬性會傳回已預先配置的已定義 enum 常數的不可變清單。

`values()` 函式仍受支援，但我們建議您改用 `entries` 屬性。

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

@OptIn(ExperimentalStdlibApi::class)
fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```

#### 如何啟用 `entries` 屬性

若要試用此功能，請使用 `@OptIn(ExperimentalStdlibApi)` 選擇加入，並啟用 `-language-version 1.9` 編譯器
選項。在 Gradle 專案中，您可以透過將以下內容新增至您的 `build.gradle(.kts)` 檔案來執行此操作：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

從 IntelliJ IDEA 2023.1 開始，如果您已選擇加入此功能，則適當的 IDE
檢查將通知您有關從 `values()` 轉換為 `entries`，並提供快速修正。

如需有關提案的更多資訊，請參閱 [KEEP 註解](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries)。

### 用於與資料類別對稱的資料物件預覽

資料物件允許您宣告具有 singleton 語意和簡潔 `toString()` 表示法的物件。在此程式碼片段中，您可以看到將 `data` 關鍵字新增至物件宣告如何提高其 `toString()` 輸出的可讀性：

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

特別是對於 `sealed` 階層（例如 `sealed class` 或 `sealed interface` 階層），`data objects` 非常適合，因為它們可以與 `data class` 宣告一起方便地使用。在此程式碼片段中，將 `EndOfFile` 宣告為 `data object` 而不是純 `object` 意味著它將獲得一個漂亮的 `toString`，而無需手動覆寫它。這保持了與隨附資料類別定義的對稱性。

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

#### 資料物件的語意

自從它們在 [Kotlin 1.7.20](whatsnew1720#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects) 中的第一個預覽版本以來，資料物件的語意已得到完善。編譯器現在會自動為它們產生許多便利函式：

##### toString

資料物件的 `toString()` 函式會傳回物件的簡單名稱：

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals 和 hashCode

`data object` 的 `equals()` 函式可確保所有具有您的 `data object` 類型的物件都被視為相等。在大多數情況下，您在執行階段只會有一個資料物件的執行個體（畢竟，`data object` 宣告了一個 singleton）。但是，在執行階段產生相同類型的另一個物件的邊緣情況下（例如，透過 `java.lang.reflect` 的平台反射，或使用在幕後使用此 API 的 JVM 序列化函式庫），這可確保將物件視為相等。

請務必僅以結構方式比較 `data objects`（使用 `==` 運算符），而永遠不要按參考（`===` 運算符）。這有助於避免在執行階段存在多個資料物件執行個體時出現的陷阱。以下程式碼片段說明了這個特定的邊緣情況：

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

產生的 `hashCode()` 函式的行為與 `equals()` 函式的行為一致，因此 `data object` 的所有執行階段執行個體都具有相同的雜湊碼。

##### 沒有 copy 和 componentN 函式用於資料物件

雖然 `data object` 和 `data class` 宣告經常一起使用且具有一些相似之處，但有些函式不會為 `data object` 產生：

因為 `data object` 宣告旨在用作 singleton 物件，因此不會產生 `copy()` 函式。singleton 模式將類別的執行個體化限制為單個執行個體，並且允許建立執行個體的副本會違反該限制。

此外，與 `data class` 不同，`data object` 沒有任何資料屬性。由於嘗試解構此類物件沒有任何意義，因此不會產生 `componentN()` 函式。

我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-4107) 上對此功能提出的意見反應。

#### 如何啟用資料物件預覽

若要試用此功能，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過
將以下內容新增至您的 `build.gradle(.kts)` 檔案來執行此操作：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

### 預覽取消對內聯類別中具有主體的次要建構函式的限制

此功能是 [實驗性](components-stability#stability-levels-explained) 的。它可能會隨時刪除或變更。
需要選擇加入（請參閱以下詳細資訊）。僅將其用於評估目的。我們將感謝您在 [YouTrack](https://kotl.in/issue) 上對其提出的意見反應。

Kotlin 1.8.20 取消了對在 [內聯類別](inline-classes) 中使用具有主體的次要建構函式的限制。

內聯類別過去只允許一個沒有 `init` 區塊或次要建構函式的公用主要建構函式，以具有明確的初始化語意。因此，不可能封裝基礎值或建立表示某些受限值的內聯類別。

當 Kotlin 1.4.30 取消對 `init` 區塊的限制時，這些問題得到了修正。現在，我們更進一步，並允許在預覽模式下使用具有主體的次要建構函式：

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

#### 如何啟用具有主體的次要建構函式

若要試用此功能，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過
將以下內容新增至您的 `build.gradle(.kts)`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

我們鼓勵您試用此功能並在 [YouTrack](https://kotl.in/issue) 中提交所有回報，以協助我們使其
成為 Kotlin 1.9.0 中的預設值。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes) 中了解有關 Kotlin 內聯類別開發的更多資訊。

## 新的 Kotlin/Wasm 目標

Kotlin/Wasm（Kotlin WebAssembly）在此版本中變為 [實驗性](components-stability#stability-levels-explained)。Kotlin 團隊發現 [WebAssembly](https://webassembly.org/) 是一項有前途的技術，並希望找到更好的方法讓您使用它並獲得 Kotlin 的所有優點。

WebAssembly 二進位格式獨立於平台，因為它使用自己的虛擬機器執行。幾乎所有現代瀏覽器都已支援 WebAssembly 1.0。若要設定執行 WebAssembly 的環境，您只需要啟用 Kotlin/Wasm 目標的實驗性垃圾收集模式。您可以在此處找到詳細說明：[如何啟用 Kotlin/Wasm](#how-to-enable-kotlin-wasm)。

我們想強調新的 Kotlin/Wasm 目標的以下優點：

* 與 `wasm32` Kotlin/Native 目標相比，編譯速度更快，因為 Kotlin/Wasm 不必使用 LLVM。
* 與 `wasm32` 目標相比，更容易與 JS 互通並與瀏覽器整合，這要歸功於 [Wasm 垃圾收集](https://github.com/WebAssembly/gc)。
* 與 Kotlin/JS 和 JavaScript 相比，應用程式啟動速度可能更快，因為 Wasm 具有緊湊且易於剖析的位元組碼。
* 與 Kotlin/JS 和 JavaScript 相比，應用程式執行階段效能有所提高，因為 Wasm 是一種靜態類型語言。

從 1.8.20 版本開始，您可以在您的實驗性專案中使用 Kotlin/Wasm。
我們預設為 Kotlin/Wasm 提供 Kotlin 標準函式庫 (`stdlib`) 和測試函式庫 (`kotlin.test`)。
IDE 支援將在未來的版本中新增。

[在此 YouTube 影片中了解有關 Kotlin/Wasm 的更多資訊](https://www.youtube.com/watch?v=-pqz9sKXatw)。

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

查看 [具有 Kotlin/Wasm 範例的 GitHub 儲存庫](https://github.com/Kotlin/kotlin-wasm-examples)。

若要執行 Kotlin/Wasm 專案，您需要更新目標環境的設定：

<Tabs>
<TabItem value="Chrome" label="Chrome">

* 對於 109 版：

  使用 `--js-flags=--experimental-wasm-gc` 命令列引數執行應用程式。

* 對於 110 版或更新版本：

    1. 在您的瀏覽器中前往 `chrome://flags/#enable-webassembly-garbage-collection`。
    2. 啟用 **WebAssembly 垃圾收集**。
    3. 重新啟動您的瀏覽器。

</TabItem>
<TabItem value="Firefox" label="Firefox">

對於 109 版或更新版本：

1. 在您的瀏覽器中前往 `about:config`。
2. 啟用 `javascript.options.wasm_function_references` 和 `javascript.options.wasm_gc` 選項。
3. 重新啟動您的瀏覽器。

</TabItem>
<TabItem value="Edge" label="Edge">

對於 109 版或更新版本：

使用 `--js-flags=--experimental-wasm-gc` 命令列引數執行應用程式。

</TabItem>
</Tabs>

### 留下您對 Kotlin/Wasm 的意見反應

我們將感謝您的任何意見反應！

* 在 Kotlin Slack 中直接向開發人員提供您的意見反應 – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  並加入 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 頻道。
* 在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-56492) 上回報您在使用 Kotlin/Wasm 時遇到的任何問題。

## Kotlin/JVM

Kotlin 1.8.20 引入了 [Java 合成屬性參考的預覽](#preview-of-java-synthetic-property-references)
和 [預設支援 kapt stub 產生任務中的 JVM IR 後端](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)。

### Java 合成屬性參考的預覽

此功能是 [實驗性](components-stability#stability-levels-explained) 的。
它可能會隨時刪除或變更。僅將其用於評估目的。
我們將感謝您在 [YouTrack](https://kotl.in/issue) 上對其提出的意見反應。

Kotlin 1.8.20 引入了建立 Java 合成屬性參考的能力，例如，對於以下 Java 程式碼：

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

Kotlin 一直允許您編寫 `person.age`，其中 `age` 是一個合成屬性。
現在，您也可以建立對 `Person::age` 和 `person::age` 的參考。所有相同的東西也適用於 `name`。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // Call a reference to Java synthetic property:
        .sortedBy(Person::age)
        // Call Java getter via the Kotlin property syntax:
        .forEach { person `->` println(person.name) }
```

#### 如何啟用 Java 合成屬性參考

若要試用此功能，請啟用 `-language-version 1.9` 編譯器選項。
在 Gradle 專案中，您可以透過將以下內容新增至您的 `build.gradle(.kts)` 來執行此操作：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

### 預設支援 kapt stub 產生任務中的 JVM IR 後端

在 Kotlin 1.7.20 中，我們引入了 [對 kapt stub 產生任務中的 JVM IR 後端的支援](whatsnew1720#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)。從此版本開始，此支援預設情況下有效。您不再需要在 `gradle.properties` 中指定 `kapt.use.jvm.ir=true` 來啟用它。
我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 上對此功能提出的意見反應。

## Kotlin/Native

Kotlin 1.8.20 包含對受支援的 Kotlin/Native 目標、與 Objective-C 的互通性以及 CocoaPods Gradle 插件的改進的變更，以及其他更新：

* [Kotlin/Native 目標的更新](#update-for-kotlin-native-targets)
* [已棄用舊版記憶體管理員](#deprecation-of-the-legacy-memory-manager)
* [支援具有 @import 指令的 Objective-C 標頭](#support-for-objective-c-headers-with-import-directives)
* [支援 Cocoapods Gradle 插件中的僅連結模式](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
* [將 UIKit 中的 Objective-C 擴展匯入為類別成員](#import-objective-c-extensions-as-class-members-in-uikit)
* [重新實作編譯器中的編譯器快取管理](#reimplementation-of-compiler-cache-management-in-the-compiler)
* [已棄用 Cocoapods Gradle 插件中的 `useLibraries()`](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Native 目標的更新
  
Kotlin 團隊決定重新檢視 Kotlin/Native 支援的目標清單、將其分為多個層級，
並從 Kotlin 1.8.20 開始棄用其中一些目標。請參閱 [Kotlin/Native 目標支援](native-target-support)
區段，以取得受支援和已棄用目標的完整清單。

以下目標已在 Kotlin 1.8.20 中棄用，並將在 1.9.20 中移除：

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

對於其餘目標，現在有三個支援層級，具體取決於目標在 Kotlin/Native 編譯器中受到支援和
測試的程度。目標可以移至不同的層級。例如，我們將盡最大努力在未來為 `iosArm64` 提供完整的支援，因為它對於 [Kotlin Multiplatform](multiplatform-intro) 而言很重要。

如果您是函式庫作者，這些目標層級可以協助您決定要在 CI 工具上測試哪些目標以及要略過哪些目標。Kotlin 團隊將在開發官方 Kotlin 函式庫（例如 [kotlinx.coroutines](coroutines-guide)）時使用相同的方法。

查看我們的 [部落格文章](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/) 以了解
有關這些變更原因的更多資訊。

### 已棄用舊版記憶體管理員

從 1.8.20 開始，舊版記憶體管理員已棄用，並將在 1.9.20 中移除。[新的記憶體管理員](native-memory-manager) 已在 1.7.20 中預設啟用，並且一直在接收進一步的穩定性更新和效能改進。

如果您仍在使用舊版記憶體管理員，請從您的 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=strict` 選項，並遵循我們的 [遷移指南](native-migration-guide) 進行必要的變更。

新的記憶體管理員不支援 `wasm32` 目標。此目標也 [從此版本開始棄用](#update-for-kotlin-native-targets)，並將在 1.9.20 中移除。

### 支援具有 @import 指令的 Objective-C 標頭

此功能是 [實驗性](components-stability#stability-levels-explained) 的。
它可能會隨時刪除或變更。需要選擇加入（請參閱以下詳細資訊）。僅將其用於評估目的。
我們將感謝您在 [YouTrack](https://kotl.in/issue) 上對其提出的意見反應。

Kotlin/Native 現在可以匯入具有 `@import` 指令的 Objective-C 標頭。此功能對於使用具有自動產生的 Objective-C 標頭或以 Swift 編寫的 CocoaPods 依賴項類別的 Swift
函式庫非常有用。

先前，cinterop 工具無法分析透過 `@import` 指令依賴於 Objective-C 模組的標頭。原因是它缺乏對 `-fmodules` 選項的支援。

從 Kotlin 1.8.20 開始，您可以使用具有 `@import` 的 Objective-C 標頭。若要執行此操作，請在定義檔案中以 `compilerOpts` 形式將 `-fmodules` 選項傳遞給編譯器。如果您使用 [CocoaPods 整合](native-cocoapods)，請在 `pod()` 函式的設定區塊中指定 cinterop 選項，如下所示：

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

這是一個 [高度期待的功能](https://youtrack.jetbrains.com/issue/KT-39120)，我們歡迎您在 [YouTrack](https://kotl.in/issue) 中對其提出的意見反應，以協助我們使其成為未來版本中的預設值。

### 支援 Cocoapods Gradle 插件中的僅連結模式

使用 Kotlin 1.8.20，您可以僅將 Pod 依賴項與動態框架連結，而無需產生 cinterop 繫結。當已產生 cinterop 繫結時，這可能會派上用場。

考慮一個具有 2 個模組的專案，一個函式庫和一個應用程式。該函式庫依賴於一個 Pod，但不產生框架，只產生一個 `.klib`。該應用程式依賴於該函式庫並產生一個動態框架。在這種情況下，您需要使用該函式庫依賴的 Pod 連結此框架，但您不需要 cinterop 繫結，因為它們已為該函式庫產生。

若要啟用該功能，請在使用 Pod 時使用 `linkOnly` 選項或建構器屬性新增依賴項：

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

如果您將此選項與靜態框架一起使用，它將完全移除 Pod 依賴項，因為 Pod 不用於靜態框架連結。

:::

### 將 UIKit 中的 Objective-C 擴展匯入為類別成員

自 Xcode 14.1 以來，Objective-C 類別中的某些方法已移至類別成員。這導致產生不同的 Kotlin API，並且這些方法匯入為 Kotlin 擴展而不是方法。

當使用 UIKit 覆寫方法時，您可能遇到了由此產生的問題。例如，當在 Kotlin 中將 UIVIew 子類化時，無法覆寫 `drawRect()` 或 `layoutSubviews()` 方法。

自 1.8.20 以來，在與 NSView 和 UIView 類別相同的標頭中宣告的類別成員會匯入為這些類別的成員。這意味著可以輕鬆覆寫從 NSView 和 UIView 子類化的方法，就像任何其他方法一樣。

如果一切順利，我們計劃預設為所有 Objective-C 類別啟用此行為。

### 重新實作編譯器中的編譯器快取管理

為了加速編譯器快取的發展，我們已將編譯器快取管理從 Kotlin Gradle 插件移至 Kotlin/Native 編譯器。這解鎖了對幾個重要改進的工作，包括與編譯時間和編譯器快取彈性相關的改進。

如果您遇到問題並需要返回舊的行為，請使用 `kotlin.native.cacheOrchestration=gradle` Gradle 屬性。

我們將感謝您在 [YouTrack 中](https://kotl.in/issue) 提出對此的意見反應。

### 已棄用 Cocoapods Gradle 插件中的 useLibraries()

Kotlin 1.8.20 開始棄用用於靜態函式庫的 [CocoaPods 整合](native-cocoapods) 中的 `useLibraries()` 函式。

我們引入了 `useLibraries()` 函式，以允許依賴於包含靜態函式庫的 Pod。隨著時間的推移，這種情況已變得非常罕見。大多數 Pod 都是透過來源分發的，而 Objective-C 框架或 XCFramework 是二進位分發的常見選擇。

由於此函式不受歡迎，並且它會產生使 Kotlin CocoaPods Gradle 插件的開發複雜化的問題，因此我們決定棄用它。

如需有關框架和 XCFramework 的更多資訊，請參閱 [建置最終的原生二進位檔案](multiplatform-build-native-binaries)。

## Kotlin Multiplatform

Kotlin 1.8.20 致力於透過以下 Kotlin Multiplatform 更新來改善開發人員體驗：

* [設定來源集階層的新方法](#new-approach-to-source-set