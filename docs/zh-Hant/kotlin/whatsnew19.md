[//]: # (title: Kotlin 1.9.0 的新功能)

[發佈日期：2023 年 7 月 6 日](releases.md#release-details)

Kotlin 1.9.0 版本已發佈，並且適用於 JVM 的 K2 編譯器現已進入 **Beta** 階段。此外，以下是一些主要的亮點：

*   [新的 Kotlin K2 編譯器更新](#new-kotlin-k2-compiler-updates)
*   [列舉類別 values 函式的穩定替代](#stable-replacement-of-the-enum-class-values-function)
*   [用於開放式範圍的穩定 `..<` 運算子](#stable-operator-for-open-ended-ranges)
*   [按名稱取得正規表達式捕獲組的新通用函式](#new-common-function-to-get-regex-capture-group-by-name)
*   [用於建立父目錄的新路徑工具](#new-path-utility-to-create-parent-directories)
*   [Kotlin 多平台中 Gradle 設定快取的預覽](#preview-of-the-gradle-configuration-cache)
*   [Kotlin 多平台中 Android 目標支援的變更](#changes-to-android-target-support)
*   [Kotlin/Native 中自訂記憶體配置器的預覽](#preview-of-custom-memory-allocator)
*   [Kotlin/Native 中的函式庫連結](#library-linkage-in-kotlin-native)
*   [Kotlin/Wasm 中與大小相關的優化](#size-related-optimizations)

您也可以在這部影片中找到更新的簡短概述：

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="Kotlin 1.9.0 的新功能"/>

## IDE 支援

支援 1.9.0 的 Kotlin 外掛程式適用於：

| IDE           | 支援版本      |
|---------------|---------------|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 外掛程式將包含在 Android Studio Giraffe (223) 和 Hedgehog (231) 的即將發佈版本中。

Kotlin 1.9.0 外掛程式將包含在 IntelliJ IDEA 2023.2 的即將發佈版本中。

> 要下載 Kotlin 的人工製品和依賴項，請[配置您的 Gradle 設定](#configure-gradle-settings)以使用 Maven Central Repository。
>
{style="warning"}

## 新的 Kotlin K2 編譯器更新

JetBrains 的 Kotlin 團隊持續穩定 K2 編譯器，並且 1.9.0 版本引入了進一步的進展。適用於 JVM 的 K2 編譯器現已進入 **Beta** 階段。

現在也對 Kotlin/Native 和多平台專案提供基本支援。

### kapt 編譯器外掛與 K2 編譯器的相容性

您可以在專案中將 [kapt 外掛程式](kapt.md)與 K2 編譯器一起使用，但存在一些限制。儘管將 `languageVersion` 設定為 `2.0`，kapt 編譯器外掛程式仍使用舊版編譯器。

如果您在 `languageVersion` 設定為 `2.0` 的專案中執行 kapt 編譯器外掛程式，kapt 將自動切換到 `1.9` 並停用特定的版本相容性檢查。此行為等同於包含以下命令參數：
*   `-Xskip-metadata-version-check`
*   `-Xskip-prerelease-check`
*   `-Xallow-unstable-dependencies`

這些檢查僅針對 kapt 任務停用。所有其他編譯任務將繼續使用新的 K2 編譯器。

如果您在使用 kapt 和 K2 編譯器時遇到任何問題，請向我們的[問題追蹤器](http://kotl.in/issue)報告。

### 在您的專案中試用 K2 編譯器

從 1.9.0 開始，直到 Kotlin 2.0 發佈為止，您可以透過在 `gradle.properties` 檔案中加入 `kotlin.experimental.tryK2=true` Gradle 屬性，輕鬆測試 K2 編譯器。您也可以執行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

此 Gradle 屬性會自動將語言版本設定為 2.0，並更新建構報告，其中包含與目前編譯器相比，使用 K2 編譯器編譯的 Kotlin 任務數量：

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradle 建構報告

[Gradle 建構報告](gradle-compilation-and-caches.md#build-reports)現在顯示是使用目前編譯器還是 K2 編譯器來編譯程式碼。在 Kotlin 1.9.0 中，您可以在[Gradle 建構掃描](https://scans.gradle.com/)中看到此資訊：

![Gradle build scan - K1](gradle-build-scan-k1.png){width=700}

![Gradle build scan - K2](gradle-build-scan-k2.png){width=700}

您也可以直接在建構報告中找到專案中使用的 Kotlin 版本：

```none
Task info:
  Kotlin language version: 1.9
```

> 如果您使用 Gradle 8.0，您可能會遇到一些建構報告問題，尤其是在啟用 Gradle 設定快取時。這是一個已知問題，已在 Gradle 8.1 及更高版本中修復。
>
{style="note"}

### 目前 K2 編譯器限制

在您的 Gradle 專案中啟用 K2 會帶來某些限制，這些限制可能會在以下情況下影響使用 Gradle 8.3 以下版本的專案：

*   來自 `buildSrc` 的原始碼編譯。
*   包含的建構中 Gradle 外掛程式的編譯。
*   如果在 Gradle 8.3 以下版本的專案中使用其他 Gradle 外掛程式的編譯。
*   建構 Gradle 外掛程式依賴項。

如果您遇到上述任何問題，可以採取以下步驟來解決：

*   為 `buildSrc`、任何 Gradle 外掛程式及其依賴項設定語言版本：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

*   當 Gradle 8.3 可用時，將您專案中的 Gradle 版本更新到 8.3。

### 提供您對新 K2 編譯器的回饋

我們非常感謝您的任何回饋！

*   直接向 K2 開發者提供您的回饋，加入 Kotlin 的 Slack – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
*   向[我們的問題追蹤器](https://kotl.in/issue)報告您在使用新 K2 編譯器時遇到的任何問題。
*   [啟用**傳送使用統計資料**選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，以允許 JetBrains 收集關於 K2 使用情況的匿名資料。

## 語言

在 Kotlin 1.9.0 中，我們正在穩定一些早期引入的新語言功能：
*   [列舉類別 values 函式的替代](#stable-replacement-of-the-enum-class-values-function)
*   [資料物件與資料類別的對稱性](#stable-data-objects-for-symmetry-with-data-classes)
*   [支援內聯值類別中帶有函式體的次級建構子](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### 列舉類別 values 函式的穩定替代

在 1.8.20 中，為列舉類別引入了 `entries` 屬性作為實驗性功能。`entries` 屬性是合成 `values()` 函式的現代化且高效能的替代。在 1.9.0 中，`entries` 屬性已穩定。

> `values()` 函式仍然受支援，但我們建議您改用 `entries` 屬性。
>
{style="tip"}

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```
{validate="false"}

有關列舉類別 `entries` 屬性的更多資訊，請參閱[Kotlin 1.8.20 的新功能](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)。

### 資料物件與資料類別對稱的穩定資料物件

資料物件宣告，在[Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)中引入，現已穩定。這包括為與資料類別對稱而新增的函式：`toString()`、`equals()` 和 `hashCode()`。

此功能對於 `sealed` 階層 (例如 `sealed class` 或 `sealed interface` 階層) 特別有用，因為 `data object` 宣告可以方便地與 `data class` 宣告一起使用。在此範例中，將 `EndOfFile` 宣告為 `data object` 而不是普通 `object`，表示它會自動擁有 `toString()` 函式，而無需手動覆寫。這保持了與隨附資料類別定義的對稱性。

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```
{validate="false"}

有關更多資訊，請參閱[Kotlin 1.8.20 的新功能](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)。

### 支援內聯值類別中帶有函式體的次級建構子

從 Kotlin 1.9.0 開始，[內聯值類別](inline-classes.md)中帶有函式體的次級建構子預設可用：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Allowed since Kotlin 1.4.30:
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // Allowed by default since Kotlin 1.9.0:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```
{validate="false"}

以前，Kotlin 只允許內聯類別中的公開主建構子。因此，不可能封裝底層值或建立一個可以表示某些受限值的內聯類別。

隨著 Kotlin 的發展，這些問題得到了解決。Kotlin 1.4.30 解除了對 `init` 區塊的限制，然後 Kotlin 1.8.20 帶來了帶有函式體的次級建構子的預覽。它們現在預設可用。透過[這個 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 了解更多關於 Kotlin 內聯類別的發展。

## Kotlin/JVM

從 1.9.0 版開始，編譯器可以生成位元碼版本對應於 JVM 20 的類別。此外，`JvmDefault` 註解和舊版 `-Xjvm-default` 模式的棄用仍在繼續。

### JvmDefault 註解和舊版 -Xjvm-default 模式的棄用

從 Kotlin 1.5 開始，`JvmDefault` 註解的使用已被棄用，轉而使用較新的 `-Xjvm-default` 模式：`all` 和 `all-compatibility`。隨著 Kotlin 1.4 中引入 `JvmDefaultWithoutCompatibility` 和 Kotlin 1.6 中引入 `JvmDefaultWithCompatibility`，這些模式提供了對 `DefaultImpls` 類別生成方式的全面控制，確保與舊版 Kotlin 程式碼的無縫相容性。

因此，在 Kotlin 1.9.0 中，`JvmDefault` 註解不再具有任何意義，並已被標記為已棄用，導致錯誤。它最終將從 Kotlin 中移除。

## Kotlin/Native

除了其他改進之外，此版本還為 [Kotlin/Native 記憶體管理器](native-memory-manager.md)帶來了進一步的改進，這應該會增強其穩健性和效能：

*   [自訂記憶體配置器的預覽](#preview-of-custom-memory-allocator)
*   [主執行緒上 Objective-C 或 Swift 物件解除配置掛鉤](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
*   [在 Kotlin/Native 中存取常數值時不進行物件初始化](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
*   [在 Kotlin/Native 中為 iOS 模擬器測試配置獨立模式的功能](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
*   [Kotlin/Native 中的函式庫連結](#library-linkage-in-kotlin-native)

### 自訂記憶體配置器的預覽

Kotlin 1.9.0 引入了自訂記憶體配置器的預覽。其配置系統改進了 [Kotlin/Native 記憶體管理器](native-memory-manager.md)的執行時效能。

Kotlin/Native 中目前的物件配置系統使用一種通用配置器，該配置器不具備高效垃圾回收的功能。為了彌補這一點，它在垃圾收集器 (GC) 將所有已配置物件合併為一個單一列表之前，會維護所有已配置物件的執行緒局部鏈結列表，該列表可以在清理期間進行迭代。這種方法帶來了幾個效能方面的缺點：

*   清理順序缺乏記憶體局部性，通常會導致分散的記憶體存取模式，從而引發潛在的效能問題。
*   鏈結列表每個物件需要額外的記憶體，增加了記憶體使用量，尤其是在處理許多小型物件時。
*   已配置物件的單一列表使得平行清理變得困難，這可能會導致當變動器執行緒配置物件的速度快於 GC 執行緒收集它們的速度時，出現記憶體使用問題。

為了解決這些問題，Kotlin 1.9.0 引入了自訂配置器的預覽。它將系統記憶體分為頁面，允許以連續順序獨立清理。每個配置都成為頁面內的記憶體區塊，頁面會追蹤區塊大小。不同的頁面類型針對各種配置大小進行了優化。記憶體區塊的連續排列確保了對所有已配置區塊的有效迭代。

當執行緒配置記憶體時，它會根據配置大小搜尋合適的頁面。執行緒會維護一組用於不同大小類別的頁面。通常，給定大小的當前頁面可以容納配置。如果不能，執行緒會從共用配置空間請求不同的頁面。此頁面可能已經可用、需要清理，或應該首先建立。

新的配置器允許同時擁有多個獨立的配置空間，這將使 Kotlin 團隊能夠嘗試不同的頁面佈局，以進一步提高效能。

有關新配置器設計的更多資訊，請參閱此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。

#### 如何啟用

加入 `-Xallocator=custom` 編譯器選項：

```kotlin
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                freeCompilerArgs.add("-Xallocator=custom")
            }
        }
    }
}
```
{validate="false"}

#### 提供回饋

我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native) 中提供回饋，以改進自訂配置器。

### 主執行緒上 Objective-C 或 Swift 物件的解除配置掛鉤

從 Kotlin 1.9.0 開始，如果 Objective-C 或 Swift 物件是在主執行緒上傳遞給 Kotlin 的，則其解除配置掛鉤會在主執行緒上被呼叫。[Kotlin/Native 記憶體管理器](native-memory-manager.md)先前處理 Objective-C 物件引用的方式可能會導致記憶體洩漏。我們相信新的行為應該能提高記憶體管理器的穩健性。

考慮在 Kotlin 程式碼中被引用的 Objective-C 物件，例如，當作為引數傳遞、由函式傳回或從集合中擷取時。在這種情況下，Kotlin 會建立自己的物件，該物件持有對 Objective-C 物件的引用。當 Kotlin 物件被解除配置時，Kotlin/Native 執行時會呼叫 `objc_release` 函式來釋放該 Objective-C 引用。

以前，Kotlin/Native 記憶體管理器在一個特殊的 GC 執行緒上執行 `objc_release`。如果是最後一個物件引用，該物件就會被解除配置。當 Objective-C 物件具有自訂解除配置掛鉤，例如 Objective-C 中的 `dealloc` 方法或 Swift 中的 `deinit` 區塊，並且這些掛鉤期望在特定執行緒上被呼叫時，就可能出現問題。

由於主執行緒上的物件掛鉤通常期望在那裡被呼叫，因此 Kotlin/Native 執行時現在也會在主執行緒上呼叫 `objc_release`。這應該涵蓋了 Objective-C 物件在主執行緒上傳遞給 Kotlin，並在那裡建立 Kotlin 對等物件的情況。這僅在主派遣佇列被處理時有效，這對於常規 UI 應用程式來說是常見情況。當不是主佇列或物件是在非主執行緒上傳遞給 Kotlin 時，`objc_release` 將像以前一樣在特殊的 GC 執行緒上被呼叫。

#### 如何選擇退出

如果您遇到問題，可以在 `gradle.properties` 檔案中透過以下選項停用此行為：

```none
kotlin.native.binary.objcDisposeOnMain=false
```

請隨時向[我們的問題追蹤器](https://kotl.in/issue)報告此類情況。

### 在 Kotlin/Native 中存取常數值時不進行物件初始化

從 Kotlin 1.9.0 開始，Kotlin/Native 後端在存取 `const val` 欄位時不會初始化物件：

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // No initialization at first
    val x = MyObject    // Initialization occurs
    println(x.y)
}
```
{validate="false"}

此行為現在與 Kotlin/JVM 統一，其中實作與 Java 一致，在這種情況下物件從未初始化。由於此變更，您也可以預期您的 Kotlin/Native 專案會有一些效能改進。

### 在 Kotlin/Native 中為 iOS 模擬器測試配置獨立模式的功能

預設情況下，當為 Kotlin/Native 執行 iOS 模擬器測試時，會使用 `--standalone` 旗標以避免手動啟動和關閉模擬器。在 1.9.0 中，您現在可以透過 `standalone` 屬性配置此旗標是否在 Gradle 任務中使用。預設情況下，`--standalone` 旗標會被使用，因此獨立模式是啟用的。

以下是如何在您的 `build.gradle.kts` 檔案中停用獨立模式的範例：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```
{validate="false"}

> 如果您停用獨立模式，您必須手動啟動模擬器。要從 CLI 啟動您的模擬器，您可以使用以下命令：
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
> ```
>
{style="warning"}

### Kotlin/Native 中的函式庫連結

從 Kotlin 1.9.0 開始，Kotlin/Native 編譯器處理 Kotlin 函式庫中的連結問題的方式與 Kotlin/JVM 相同。如果一個第三方 Kotlin 函式庫的作者在實驗性 API 中進行了不相容的變更，而另一個第三方 Kotlin 函式庫使用了這些 API，您可能會面臨此類問題。

現在，如果第三方 Kotlin 函式庫之間存在連結問題，建構在編譯期間不會失敗。相反，您只會在執行時遇到這些錯誤，就像在 JVM 上一樣。

每當 Kotlin/Native 編譯器偵測到函式庫連結問題時，它都會報告警告。您可以在編譯日誌中找到此類警告，例如：

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

您可以在專案中進一步配置甚至停用此行為：

*   如果您不想在編譯日誌中看到這些警告，請使用 `-Xpartial-linkage-loglevel=INFO` 編譯器選項將其抑制。
*   也可以使用 `-Xpartial-linkage-loglevel=ERROR` 將報告的警告嚴重性提高到編譯錯誤。在這種情況下，編譯會失敗，您將在編譯日誌中看到所有錯誤。使用此選項可以更仔細地檢查連結問題。
*   如果您遇到此功能出現意外問題，您始終可以使用 `-Xpartial-linkage=disable` 編譯器選項選擇退出。請隨時向[我們的問題追蹤器](https://kotl.in/issue)報告此類情況。

```kotlin
// An example of passing compiler options via Gradle build file.
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // To suppress linkage warnings:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // To raise linkage warnings to errors:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // To disable the feature completely:
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```
{validate="false"}

### C 語言互通性隱式整數轉換的編譯器選項

我們引入了一個用於 C 語言互通性的編譯器選項，允許您使用隱式整數轉換。經過仔細考慮，我們引入此編譯器選項是為了防止無意中使用，因為此功能仍有改進空間，我們的目標是擁有最高品質的 API。

在此程式碼範例中，即使 [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options) 具有無符號類型 `UInt` 且 `0` 為有符號，隱式整數轉換仍允許 `options = 0`。

```kotlin
val today = NSDate()
val tomorrow = NSCalendar.currentCalendar.dateByAddingUnit(
    unit = NSCalendarUnitDay,
    value = 1,
    toDate = today,
    options = 0
)
```
{validate="false"}

要將隱式轉換與原生互通性函式庫一起使用，請使用 `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion` 編譯器選項。

您可以在您的 Gradle `build.gradle.kts` 檔案中配置此項：
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```
{validate="false"}

## Kotlin 多平台

Kotlin 多平台在 1.9.0 中收到了一些顯著更新，旨在改善您的開發者體驗：

*   [Android 目標支援的變更](#changes-to-android-target-support)
*   [預設啟用新的 Android 原始碼集佈局](#new-android-source-set-layout-enabled-by-default)
*   [多平台專案中 Gradle 設定快取的預覽](#preview-of-the-gradle-configuration-cache)

### Android 目標支援的變更

我們持續努力穩定 Kotlin 多平台。一個重要步驟是為 Android 目標提供一流的支援。我們很高興地宣布，未來 Google 的 Android 團隊將提供自己的 Gradle 外掛程式來支援 Kotlin 多平台中的 Android。

為了為 Google 的這個新解決方案鋪路，我們在 1.9.0 中重新命名了目前 Kotlin DSL 中的 `android` 區塊。請將您建構腳本中所有出現的 `android` 區塊變更為 `androidTarget`。這是一個臨時變更，是為了釋放 `android` 名稱以供 Google 即將推出的 DSL 使用。

Google 外掛程式將是處理多平台專案中 Android 的首選方式。準備就緒後，我們將提供必要的遷移說明，以便您能夠像以前一樣使用簡短的 `android` 名稱。

### 預設啟用新的 Android 原始碼集佈局

從 Kotlin 1.9.0 開始，新的 Android 原始碼集佈局為預設。它取代了以前的目錄命名方案，該方案在多方面令人困惑。新的佈局具有許多優點：

*   簡化的類型語義 – 新的 Android 原始碼佈局提供了清晰一致的命名約定，有助於區分不同類型的原始碼集。
*   改進的原始碼目錄佈局 – 透過新的佈局，`SourceDirectories` 的排列變得更加連貫，更容易組織程式碼和定位原始檔。
*   Gradle 配置的清晰命名方案 – 該方案現在在 `KotlinSourceSets` 和 `AndroidSourceSets` 中都更加一致和可預測。

新的佈局需要 Android Gradle 外掛程式版本 7.0 或更高版本，並在 Android Studio 2022.3 及更高版本中受支援。請參閱我們的[遷移指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html)以在您的 `build.gradle(.kts)` 檔案中進行必要的更改。

### Gradle 設定快取的預覽

<anchor name="preview-of-gradle-configuration-cache"/>

Kotlin 1.9.0 支援多平台函式庫中的 [Gradle 設定快取](https://docs.gradle.org/current/userguide/configuration_cache.html)。如果您是函式庫作者，您已經可以從改進的建構效能中受益。

Gradle 設定快取透過重複使用配置階段的結果來加速後續建構的過程。該功能自 Gradle 8.1 起已穩定。要啟用它，請按照 [Gradle 文件](https://docs.gradle.com/current/userguide/configuration_cache.html#config_cache:usage)中的說明進行操作。

> Kotlin 多平台外掛程式仍不支援 Xcode 整合任務或 [Kotlin CocoaPods Gradle 外掛程式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)的 Gradle 設定快取。我們預計在未來的 Kotlin 版本中加入此功能。
>
{style="note"}

## Kotlin/Wasm

Kotlin 團隊持續實驗新的 Kotlin/Wasm 目標。此版本引入了多項效能和[與大小相關的優化](#size-related-optimizations)，以及 [JavaScript 互通性中的更新](#updates-in-javascript-interop)。

### 與大小相關的優化

Kotlin 1.9.0 為 WebAssembly (Wasm) 專案引入了顯著的大小改進。比較兩個「Hello World」專案，Kotlin 1.9.0 中 Wasm 的程式碼佔用空間現在比 Kotlin 1.8.20 小 10 倍以上。

![Kotlin/Wasm size-related optimizations](wasm-1-9-0-size-improvements.png){width=700}

這些大小優化在以 Kotlin 程式碼為目標 Wasm 平台時，可提高資源利用效率並改進效能。

### JavaScript 互通性中的更新

此 Kotlin 更新引入了 Kotlin/Wasm 的 Kotlin 與 JavaScript 之間互通性的變更。由於 Kotlin/Wasm 是一個[實驗性](components-stability.md#stability-levels-explained)功能，其互通性存在某些限制。

#### 動態類型的限制

從 1.9.0 版開始，Kotlin 不再支援在 Kotlin/Wasm 中使用 `Dynamic` 類型。此功能現已棄用，轉而使用新的通用 `JsAny` 類型，該類型有助於 JavaScript 互通性。

有關更多詳細資訊，請參閱 [Kotlin/Wasm 與 JavaScript 互通性](wasm-js-interop.md)文件。

#### 非外部類型的限制

Kotlin/Wasm 支援在將值傳遞給 JavaScript 和從 JavaScript 傳出時，對特定 Kotlin 靜態類型進行轉換。這些支援的類型包括：

*   基本類型，例如有符號數字、`Boolean` 和 `Char`。
*   `String`。
*   函式類型。

其他類型則未經轉換作為不透明引用傳遞，導致 JavaScript 和 Kotlin 子類型之間的不一致。

為了解決此問題，Kotlin 將 JavaScript 互通性限制為一組支援良好的類型。從 Kotlin 1.9.0 開始，Kotlin/Wasm JavaScript 互通性僅支援外部、基本類型、字串和函式類型。此外，還引入了一個單獨的顯式類型 `JsReference`，用於表示可用於 JavaScript 互通性的 Kotlin/Wasm 物件句柄。

有關更多詳細資訊，請參閱 [Kotlin/Wasm 與 JavaScript 互通性](wasm-js-interop.md)文件。

### Kotlin Playground 中的 Kotlin/Wasm

Kotlin Playground 支援 Kotlin/Wasm 目標。
您可以編寫、執行和分享針對 Kotlin/Wasm 的 Kotlin 程式碼。[立即查看！](https://pl.kotl.in/HDFAvimga)

> 使用 Kotlin/Wasm 需要在您的瀏覽器中啟用實驗性功能。
>
> [了解更多如何啟用這些功能](wasm-troubleshooting.md)。
>
{style="note"}

```kotlin
import kotlin.time.*
import kotlin.time.measureTime

fun main() {
    println("Hello from Kotlin/Wasm!")
    computeAck(3, 10)
}

tailrec fun ack(m: Int, n: Int): Int = when {
    m == 0 -> n + 1
    n == 0 -> ack(m - 1, 1)
    else -> ack(m - 1, ack(m, n - 1))
}

fun computeAck(m: Int, n: Int) {
    var res = 0
    val t = measureTime {
        res = ack(m, n)
    }
    println()
    println("ack($m, $n) = ${res}")
    println("duration: ${t.inWholeNanoseconds / 1e6} ms")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-1-9-0-kotlin-wasm-playground"}

## Kotlin/JS

此版本引入了 Kotlin/JS 的更新，包括移除舊的 Kotlin/JS 編譯器、Kotlin/JS Gradle 外掛程式的棄用以及對 ES2015 的實驗性支援：

*   [移除舊的 Kotlin/JS 編譯器](#removal-of-the-old-kotlin-js-compiler)
*   [Kotlin/JS Gradle 外掛程式的棄用](#deprecation-of-the-kotlin-js-gradle-plugin)
*   [外部列舉的棄用](#deprecation-of-external-enum)
*   [對 ES2015 類別和模組的實驗性支援](#experimental-support-for-es2015-classes-and-modules)
*   [JS 生產發佈的預設目標變更](#changed-default-destination-of-js-production-distribution)
*   [從 stdlib-js 中提取 org.w3c 宣告](#extract-org-w3c-declarations-from-stdlib-js)

> 從 1.9.0 版開始，[部分函式庫連結](#library-linkage-in-kotlin-native)也適用於 Kotlin/JS。
>
{style="note"}

### 移除舊的 Kotlin/JS 編譯器

在 Kotlin 1.8.0 中，我們[宣布](whatsnew18.md#stable-js-ir-compiler-backend)基於 IR 的後端已[穩定](components-stability.md)。從那時起，不指定編譯器已成為錯誤，使用舊編譯器會導致警告。

在 Kotlin 1.9.0 中，使用舊後端會導致錯誤。請遵循我們的[遷移指南](js-ir-migration.md)遷移到 IR 編譯器。

### Kotlin/JS Gradle 外掛程式的棄用

從 Kotlin 1.9.0 開始，`kotlin-js` Gradle 外掛程式已棄用。我們鼓勵您改用 `kotlin-multiplatform` Gradle 外掛程式與 `js()` 目標。

Kotlin/JS Gradle 外掛程式的功能實質上重複了 `kotlin-multiplatform` 外掛程式，並且在底層共享相同的實作。這種重疊造成了混淆，並增加了 Kotlin 團隊的維護負擔。

請參閱我們的[Kotlin 多平台相容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin)以獲取遷移說明。如果您發現指南中未涵蓋的任何問題，請向我們的[問題追蹤器](http://kotl.in/issue)報告。

### 外部列舉的棄用

在 Kotlin 1.9.0 中，由於 `entries` 等靜態列舉成員無法存在於 Kotlin 之外的問題，外部列舉的使用將被棄用。我們建議改用帶有物件子類別的外部密封類別：

```kotlin
// Before
external enum class ExternalEnum { A, B }

// After
external sealed class ExternalEnum {
    object A: ExternalEnum
    object B: ExternalEnum
}
```
{validate="false"}

透過切換到帶有物件子類別的外部密封類別，您可以實現與外部列舉類似的功能，同時避免與預設方法相關的問題。

從 Kotlin 1.9.0 開始，外部列舉的使用將被標記為棄用。我們鼓勵您更新程式碼以利用建議的外部密封類別實作，以確保相容性和未來的維護。

### 對 ES2015 類別和模組的實驗性支援

此版本引入了對 ES2015 模組和 ES2015 類別生成的[實驗性](components-stability.md#stability-levels-explained)支援：
*   模組提供了一種簡化程式碼庫並提高可維護性的方法。
*   類別允許您整合物件導向程式設計 (OOP) 原則，從而產生更清晰、更直觀的程式碼。

要啟用這些功能，請相應地更新您的 `build.gradle.kts` 檔案：

```kotlin
// build.gradle.kts
kotlin {
    js(IR) {
        useEsModules() // Enables ES2015 modules
        browser()
    }
}

// Enables ES2015 classes generation
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        useEsClasses = true
    }
}
```
{validate="false"}

[在官方文件中了解更多關於 ES2015 (ECMAScript 2015, ES6)](https://262.ecma-international.org/6.0/)。

### JS 生產發佈的預設目標變更

在 Kotlin 1.9.0 之前，發佈目標目錄是 `build/distributions`。然而，這是 Gradle 歸檔的常見目錄。為了解決這個問題，我們將 Kotlin 1.9.0 中的預設發佈目標目錄更改為：`build/dist/<targetName>/<binaryName>`。

例如，`productionExecutable` 以前在 `build/distributions` 中。在 Kotlin 1.9.0 中，它位於 `build/dist/js/productionExecutable` 中。

> 如果您有使用這些建構結果的流水線，請務必更新目錄。
>
{style="warning"}

### 從 stdlib-js 中提取 org.w3c 宣告

從 Kotlin 1.9.0 開始，`stdlib-js` 不再包含 `org.w3c` 宣告。相反，這些宣告已移至單獨的 Gradle 依賴項中。當您將 Kotlin 多平台 Gradle 外掛程式添加到您的 `build.gradle.kts` 檔案時，這些宣告將自動包含在您的專案中，類似於標準函式庫。

無需任何手動操作或遷移。必要的調整將自動處理。

## Gradle

Kotlin 1.9.0 帶來了新的 Gradle 編譯器選項以及更多功能：

*   [移除了 classpath 屬性](#removed-classpath-property)
*   [新的 Gradle 編譯器選項](#new-compiler-options)
*   [Kotlin/JVM 的專案級編譯器選項](#project-level-compiler-options-for-kotlin-jvm)
*   [Kotlin/Native 模組名稱的編譯器選項](#compiler-option-for-kotlin-native-module-name)
*   [官方 Kotlin 函式庫的獨立編譯器外掛程式](#separate-compiler-plugins-for-official-kotlin-libraries)
*   [增加最低支援版本](#incremented-minimum-supported-version)
*   [kapt 不會導致 Gradle 中急切任務建立](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
*   [JVM 目標驗證模式的程式化配置](#programmatic-configuration-of-the-jvm-target-validation-mode)

### 移除了 classpath 屬性

在 Kotlin 1.7.0 中，我們宣布了 `KotlinCompile` 任務屬性 `classpath` 的棄用週期開始。在 Kotlin 1.8.0 中，棄用級別提高到 `ERROR`。在此版本中，我們最終移除了 `classpath` 屬性。所有編譯任務現在都應該使用 `libraries` 輸入作為編譯所需的函式庫列表。

### 新的編譯器選項

Kotlin Gradle 外掛程式現在為選擇加入 (opt-ins) 和編譯器的漸進模式提供了新的屬性。

*   要選擇加入 (opt in) 新的 API，您現在可以使用 `optIn` 屬性並傳遞字串列表，例如：`optIn.set(listOf(a, b, c))`。
*   要啟用漸進模式，請使用 `progressiveMode.set(true)`。

### Kotlin/JVM 的專案級編譯器選項

從 Kotlin 1.9.0 開始，`kotlin` 配置區塊內提供了一個新的 `compilerOptions` 區塊：

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```
{validate="false"}

這使得配置編譯器選項更加容易。然而，需要注意一些重要的細節：

*   此配置僅適用於專案級別。
*   對於 Android 外掛程式，此區塊配置與以下相同的物件：

```kotlin
android {
    kotlinOptions {}
}
```
{validate="false"}

*   `android.kotlinOptions` 和 `kotlin.compilerOptions` 配置區塊會互相覆寫。建構檔案中最後 (最低) 的區塊始終生效。
*   如果 `moduleName` 在專案級別配置，其值在傳遞給編譯器時可能會改變。這對於 `main` 編譯來說不是問題，但對於其他類型，例如測試原始碼，Kotlin Gradle 外掛程式會添加 `_test` 後綴。
*   `tasks.withType<KotlinJvmCompile>().configureEach {}` (或 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`) 中的配置會覆寫 `kotlin.compilerOptions` 和 `android.kotlinOptions`。

### Kotlin/Native 模組名稱的編譯器選項

Kotlin/Native 的 [`module-name`](compiler-reference.md#module-name-name-native) 編譯器選項現在在 Kotlin Gradle 外掛程式中輕鬆可用。

此選項指定編譯模組的名稱，也可用於為匯出到 Objective-C 的宣告添加名稱前綴。

您現在可以直接在 Gradle 建構檔案的 `compilerOptions` 區塊中設定模組名稱：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>("compileKotlinLinuxX64") {
    compilerOptions {
        moduleName.set("my-module-name")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlinLinuxX64", org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile.class) {
    compilerOptions {
        moduleName = "my-module-name"
    }
}
```

</tab>
</tabs>

### 官方 Kotlin 函式庫的獨立編譯器外掛程式

Kotlin 1.9.0 為其官方函式庫引入了獨立的編譯器外掛程式。以前，編譯器外掛程式嵌入在其對應的 Gradle 外掛程式中。如果編譯器外掛程式是針對比 Gradle 建構的 Kotlin 執行時版本更高的 Kotlin 版本編譯的，這可能會導致相容性問題。

現在，編譯器外掛程式作為獨立的依賴項添加，因此您將不再面臨與舊版 Gradle 的相容性問題。新方法的另一個主要優點是，新的編譯器外掛程式可以用於其他建構系統，例如 [Bazel](https://bazel.build/)。

以下是我們目前發佈到 Maven Central 的新編譯器外掛程式列表：

*   kotlin-atomicfu-compiler-plugin
*   kotlin-allopen-compiler-plugin
*   kotlin-lombok-compiler-plugin
*   kotlin-noarg-compiler-plugin
*   kotlin-sam-with-receiver-compiler-plugin
*   kotlinx-serialization-compiler-plugin

每個外掛程式都有其 `-embeddable` 對應項，例如，`kotlin-allopen-compiler-plugin-embeddable` 旨在與 `kotlin-compiler-embeddable` 人工製品一起使用，這是腳本人工製品的預設選項。

Gradle 將這些外掛程式作為編譯器參數添加。您無需對現有專案進行任何更改。

### 增加最低支援版本

從 Kotlin 1.9.0 開始，最低支援的 Android Gradle 外掛程式版本是 4.2.2。

請參閱[我們的文件中 Kotlin Gradle 外掛程式與可用 Gradle 版本的相容性](gradle-configure-project.md#apply-the-plugin)。

### kapt 不會導致 Gradle 中急切任務建立

在 1.9.0 之前，[kapt 編譯器外掛程式](kapt.md)會透過請求 Kotlin 編譯任務的配置實例來導致急切任務建立。此行為已在 Kotlin 1.9.0 中修復。如果您對 `build.gradle.kts` 檔案使用預設配置，則您的設定不受此變更的影響。

> 如果您使用自訂配置，您的設定將受到不利影響。
> 例如，如果您使用 Gradle 的任務 API 修改了 `KotlinJvmCompile` 任務，您必須以相同方式修改建構腳本中的 `KaptGenerateStubs` 任務。
>
> 例如，如果您的腳本針對 `KotlinJvmCompile` 任務有以下配置：
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // Your custom configuration }
> ```
> {validate="false"}
>
> 在這種情況下，您需要確保相同的修改也包含在 `KaptGenerateStubs` 任務中：
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // Your custom configuration }
> ```
> {validate="false"}
>
{style="warning"}

有關更多資訊，請參閱我們的 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation)。

### JVM 目標驗證模式的程式化配置

在 Kotlin 1.9.0 之前，只有一種方法可以調整 Kotlin 和 Java 之間 JVM 目標不相容性的偵測。您必須在整個專案的 `gradle.properties` 中設定 `kotlin.jvm.target.validation.mode=ERROR`。

您現在也可以在您的 `build.gradle.kts` 檔案中在任務級別配置它：

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```
{validate="false"}

## 標準函式庫

Kotlin 1.9.0 對標準函式庫有一些重大改進：
*   `..<` 運算子和時間 API 已穩定。
*   Kotlin/Native 標準函式庫已徹底審查和更新
*   `@Volatile` 註解可在更多平台使用
*   有一個**通用**函式可以按名稱取得正規表達式捕獲組
*   引入了 `HexFormat` 類別以格式化和解析十六進位

### 用於開放式範圍的穩定 `..<` 運算子

新的 `..<` 運算子用於開放式範圍，該運算子在 [Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges) 中引入，並在 1.8.0 中穩定。在 1.9.0 中，用於處理開放式範圍的標準函式庫 API 也已穩定。

我們的研究表明，新的 `..<` 運算子使得理解何時宣告開放式範圍變得更容易。如果您使用 [`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html) 中綴函式，很容易誤以為上限包含在內。

以下是使用 `until` 函式的範例：

```kotlin
fun main() {
    for (number in 2 until 10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 2 4 6 8
}
```
{validate="false"}

以下是使用新 `..<` 運算子的範例：

```kotlin
fun main() {
    for (number in 2..<10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 2 4 6 8
}
```
{validate="false"}

> 從 IntelliJ IDEA 2023.1.1 版開始，提供了一項新的程式碼檢查，會強調何時可以使用 `..<` 運算子。
>
{style="note"}

有關此運算子的更多資訊，請參閱[Kotlin 1.7.20 的新功能](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)。

### 穩定的時間 API

自 1.3.50 起，我們預覽了一個新的時間測量 API。該 API 的持續時間部分在 1.6.0 中穩定。在 1.9.0 中，剩餘的時間測量 API 已穩定。

舊的時間 API 提供了 `measureTimeMillis` 和 `measureNanoTime` 函式，它們使用起來不直觀。儘管很明顯它們都以不同的單位測量時間，但 `measureTimeMillis` 使用[真實時間](https://en.wikipedia.org/wiki/Elapsed_real_time)測量時間，而 `measureNanoTime` 使用單調時間源則不清楚。新的時間 API 解決了這些問題和其他問題，使 API 更使用者友好。

使用新的時間 API，您可以輕鬆地：
*   使用單調時間源和您所需的時間單位測量執行某些程式碼所需的時間。
*   標記時間中的一個時刻。
*   比較並找出兩個時間點之間的差異。
*   檢查自特定時間點以來過了多少時間。
*   檢查目前時間是否已超過特定時間點。

#### 測量程式碼執行時間

要測量執行程式碼區塊所需的時間，請使用 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 內聯函式。

要測量執行程式碼區塊所需的時間**並**傳回該程式碼區塊的結果，請使用 [`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 內聯函式。

預設情況下，這兩個函式都使用單調時間源。但是，如果您想使用一個經過的真實時間源，您也可以。例如，在 Android 上，預設時間源 `System.nanoTime()` 僅在設備處於活動狀態時計時。當設備進入深度睡眠時，它會失去時間追蹤。要在設備深度睡眠時保持時間追蹤，您可以創建一個使用 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos()) 的時間源：

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```
{validate="false"}

#### 標記和測量時間差異

要標記時間中的一個特定時刻，請使用 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/) 介面和 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 函式來建立一個 [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)。要測量來自相同時間源的 `TimeMark` 之間的差異，請使用減法運算子 (`-`)：

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // Sleep 0.5 seconds.
    val mark2 = timeSource.markNow()

    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // It's also possible to compare time marks with each other.
    println(mark2 > mark1) // This is true, as mark2 was captured later than mark1.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-elapsed"}

要檢查截止日期是否已過或超時是否已達到，請使用 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html) 和 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 擴展函式：

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    val fiveSeconds: Duration = 5.seconds
    val mark2 = mark1 + fiveSeconds

    // It hasn't been 5 seconds yet
    println(mark2.hasPassedNow())
    // false

    // Wait six seconds
    Thread.sleep(6000)
    println(mark2.hasPassedNow())
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-passednow"}

### Kotlin/Native 標準函式庫的穩定化歷程

隨著我們的 Kotlin/Native 標準函式庫持續成長，我們決定是時候進行全面審查，以確保它符合我們的高標準。作為其中的一部分，我們仔細審查了**每個**現有的公共簽章。對於每個簽章，我們考慮了它是否：

*   具有獨特用途。
*   與其他 Kotlin API 一致。
*   與其 JVM 對應項具有相似行為。
*   經得起未來考驗。

根據這些考量，我們做出了以下其中一項決定：
*   使其穩定。
*   使其成為實驗性功能。
*   將其標記為 `private`。
*   修改其行為。
*   將其移動到不同的位置。
*   棄用它。
*   將其標記為過時。

> 如果現有簽章已：
> *   移動到另一個套件，則該簽章仍然存在於原始套件中，但現在已棄用，棄用級別為：`WARNING`。IntelliJ IDEA 會在程式碼檢查時自動建議替代方案。
> *   棄用，則它已棄用，棄用級別為：`WARNING`。
> *   標記為過時，則您可以繼續使用它，但它將來會被替換。
>
{style="note"}

我們不會在此列出所有審查結果，但以下是一些亮點：
*   我們穩定化了原子性 API。
*   我們將 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) 設定為實驗性功能，現在需要不同的選擇加入才能使用該套件。有關更多資訊，請參閱[明確的 C 語言互通性穩定性保證](#explicit-c-interoperability-stability-guarantees)。
*   我們將 [`Worker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker/) 類別及其相關 API 標記為過時。
*   我們將 [`BitSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-bit-set/) 類別標記為過時。
*   我們將 `kotlin.native.internal` 套件中的所有 `public` API 標記為 `private` 或將其移至其他套件。

#### 明確的 C 語言互通性穩定性保證

為保持我們 API 的高品質，我們決定將 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) 設定為實驗性功能。儘管 `kotlinx.cinterop` 已經過徹底試用和測試，但在我們滿意到足以將其穩定化之前，仍有改進空間。我們建議您使用此 API 進行互通性，但請盡量將其使用限制在專案的特定區域。這將使您在我們開始演進此 API 以使其穩定時，更容易進行遷移。

如果您想使用 C 語言類型的外部 API，例如指標，您必須使用 `@OptIn(ExperimentalForeignApi)` 選擇加入 (opt in)，否則您的程式碼將無法編譯。

要使用 `kotlinx.cinterop` 的其餘部分（涵蓋 Objective-C/Swift 互通性），您必須使用 `@OptIn(BetaInteropApi)` 選擇加入 (opt in)。如果您嘗試在未選擇加入的情況下使用此 API，您的程式碼將會編譯，但編譯器會發出警告，清楚解釋您可以預期的行為。

有關這些註解的更多資訊，請參閱我們的 [`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt) 原始碼。

有關此審查中**所有**變更的更多資訊，請參閱我們的 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-55765)。

我們非常感謝您的任何回饋！您可以直接在[票證](https://youtrack.jetbrains.com/issue/KT-57728)上留言提供回饋。

### 穩定的 @Volatile 註解

如果您使用 `@Volatile` 註解一個 `var` 屬性，則其支援欄位會被標記，以便對該欄位的任何讀取或寫入都是原子性的，並且寫入總是對其他執行緒可見。

在 1.8.20 之前，[`kotlin.jvm.Volatile` 註解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)在通用標準函式庫中可用。然而，此註解僅在 JVM 上有效。如果您在其他平台使用它，它會被忽略，導致錯誤。

在 1.8.20 中，我們引入了一個實驗性通用註解 `kotlin.concurrent.Volatile`，您可以在 JVM 和 Kotlin/Native 中預覽它。

在 1.9.0 中，`kotlin.concurrent.Volatile` 已穩定。如果您在多平台專案中使用 `kotlin.jvm.Volatile`，我們建議您遷移到 `kotlin.concurrent.Volatile`。

### 按名稱取得正規表達式捕獲組的新通用函式

在 1.9.0 之前，每個平台都有自己的擴展功能，可以從正規表達式匹配中按名稱取得正規表達式捕獲組。但是沒有通用函式。在 Kotlin 1.8.0 之前不可能有通用函式，因為標準函式庫仍然支援 JVM 目標 1.6 和 1.7。

從 Kotlin 1.8.0 起，標準函式庫是使用 JVM 目標 1.8 編譯的。因此在 1.9.0 中，現在有一個**通用** [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html) 函式，您可以用它來按名稱檢索正規表達式匹配的組內容。當您想存取屬於特定捕獲組的正規表達式匹配結果時，這非常有用。

以下是一個包含三個捕獲組 (`city`、`state` 和 `areaCode`) 的正規表達式範例。您可以使用這些組名稱來存取匹配的值：

```kotlin
fun main() {
    val regex = """\b(?<city>[A-Za-z\s]+),\s(?<state>[A-Z]{2}):\s(?<areaCode>[0-9]{3})\b""".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    
    val match = regex.find(input)!!
    println(match.groups["city"]?.value)
    // Austin
    println(match.groups["state"]?.value)
    // TX
    println(match.groups["areaCode"]?.value)
    // 123
}
```
{validate="false"}

### 用於建立父目錄的新路徑工具

在 1.9.0 中，有一個新的 `createParentDirectories()` 擴展函式，您可以用它來建立一個帶有所有必要父目錄的新檔案。當您向 `createParentDirectories()` 提供檔案路徑時，它會檢查父目錄是否已存在。如果存在，它不執行任何操作。但是，如果不存在，它會為您建立。

`createParentDirectories()` 在您複製檔案時特別有用。例如，您可以將其與 `copyToRecursively()` 函式結合使用：

 ```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
 ```
{validate="false"}

### 用於格式化和解析十六進位的新 HexFormat 類別

> 新的 `HexFormat` 類別及其相關擴展函式是[實驗性](components-stability.md#stability-levels-explained)功能，要使用它們，您可以使用 `@OptIn(ExperimentalStdlibApi::class)` 或編譯器參數 `-opt-in=kotlin.ExperimentalStdlibApi` 選擇加入 (opt in)。
>
{style="warning"}

在 1.9.0 中，[`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 類別及其相關擴展函式作為實驗性功能提供，允許您在數值和十六進位字串之間進行轉換。具體來說，您可以使用擴展函式在十六進位字串和 `ByteArrays` 或其他數值類型 (`Int`、`Short`、`Long`) 之間進行轉換。

例如：

```kotlin
println(93.toHexString()) // "0000005d"
```
{validate="false"}

`HexFormat` 類別包含格式化選項，您可以使用 `HexFormat{}` 建構器進行配置。

如果您正在使用 `ByteArrays`，您有以下選項，這些選項可透過屬性配置：

| 選項 | 描述 |
|--|--|
| `upperCase` | 十六進位數字是大寫還是小寫。預設情況下，假定為小寫。`upperCase = false`。 |
| `bytes.bytesPerLine` | 每行的最大位元組數。 |
| `bytes.bytesPerGroup` | 每組的最大位元組數。 |
| `bytes.bytesSeparator` | 位元組之間的分隔符。預設為無。 |
| `bytes.bytesPrefix` | 緊接在每個位元組的兩位十六進位表示法之前的字串，預設為無。 |
| `bytes.bytesSuffix` | 緊接在每個位元組的兩位十六進位表示法之後的字串，預設為無。 |

例如：

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// Use HexFormat{} builder to separate the hexadecimal string by colons
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// "00:1b:63:84:45:e6"

// Use HexFormat{} builder to:
// * Make the hexadecimal string uppercase
// * Group the bytes in pairs
// * Separate by periods
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// "001B.6384.45E6"
```
{validate="false"}

如果您正在使用數值類型，您有以下選項，這些選項可透過屬性配置：

| 選項 | 描述 |
|--|--|
| `number.prefix` | 十六進位字串的前綴，預設為無。 |
| `number.suffix` | 十六進位字串的後綴，預設為無。 |
| `number.removeLeadingZeros` | 是否移除十六進位字串中的前導零。預設情況下，不移除前導零。`number.removeLeadingZeros = false` |

例如：

```kotlin
// Use HexFormat{} builder to parse a hexadecimal that has prefix: "0x".
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // "58"
```
{validate="false"}

## 文件更新

Kotlin 文件收到了一些顯著的變更：
*   [Kotlin 導覽](kotlin-tour-welcome.md) – 透過包含理論和實踐的章節，學習 Kotlin 程式語言的基礎知識。
*   [Android 原始碼集佈局](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html) – 了解新的 Android 原始碼集佈局。
*   [Kotlin 多平台相容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html) – 了解在使用 Kotlin 多平台開發專案時可能遇到的不相容變更。
*   [Kotlin Wasm](wasm-overview.md) – 了解 Kotlin/Wasm 以及如何在您的 Kotlin 多平台專案中使用它。

## 安裝 Kotlin 1.9.0

### 檢查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3 和 2023.1.1 會自動建議將 Kotlin 外掛程式更新到 1.9.0 版。IntelliJ IDEA 2023.2 將包含 Kotlin 1.9.0 外掛程式。

Android Studio Giraffe (223) 和 Hedgehog (231) 將在其即將發布的版本中支援 Kotlin 1.9.0。

新的命令列編譯器可從 [GitHub 發布頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0)下載。

### 配置 Gradle 設定

要下載 Kotlin 的人工製品和依賴項，請更新您的 `settings.gradle(.kts)` 檔案以使用 Maven Central 儲存庫：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

如果未指定儲存庫，Gradle 會使用已淘汰的 JCenter 儲存庫，這可能會導致 Kotlin 人工製品出現問題。

## Kotlin 1.9.0 相容性指南

Kotlin 1.9.0 是一個[功能發布版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能會帶來與您為該語言早期版本編寫的程式碼不相容的變更。在[Kotlin 1.9.0 相容性指南](compatibility-guide-19.md)中查找這些變更的詳細列表。