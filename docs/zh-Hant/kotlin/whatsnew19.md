[//]: # (title: Kotlin 1.9.0 的新功能)

[發佈日期：2023 年 7 月 6 日](releases.md#release-details)

Kotlin 1.9.0 版本已推出，且 JVM 的 K2 編譯器現已進入 **Beta** 階段。此外，以下是一些主要的亮點：

*   [新的 Kotlin K2 編譯器更新](#new-kotlin-k2-compiler-updates)
*   [列舉類別 `values` 函式的穩定替代方案](#stable-replacement-of-the-enum-class-values-function)
*   [用於開放範圍的穩定 `..<` 運算子](#stable-operator-for-open-ended-ranges)
*   [根據名稱取得正規表達式捕獲群組的新共同函式](#new-common-function-to-get-regex-capture-group-by-name)
*   [建立父目錄的新路徑工具程式](#new-path-utility-to-create-parent-directories)
*   [Kotlin Multiplatform 中 Gradle 配置快取的預覽](#preview-of-the-gradle-configuration-cache)
*   [Kotlin Multiplatform 中 Android 目標支援的變更](#changes-to-android-target-support)
*   [Kotlin/Native 中自訂記憶體分配器的預覽](#preview-of-custom-memory-allocator)
*   [Kotlin/Native 中的函式庫連結](#library-linkage-in-kotlin-native)
*   [Kotlin/Wasm 中與大小相關的優化](#size-related-optimizations)

您也可以在這段影片中找到更新的簡要概述：

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="What's new in Kotlin 1.9.0"/>

## IDE 支援

支援 1.9.0 的 Kotlin 外掛程式適用於：

| IDE           | 支援的版本 |
| :------------ | :------------- |
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 外掛程式將包含在 Android Studio Giraffe (223) 和 Hedgehog (231) 的即將發佈版本中。

Kotlin 1.9.0 外掛程式將包含在 IntelliJ IDEA 2023.2 的即將發佈版本中。

> 若要下載 Kotlin 成品與依賴項，請[配置您的 Gradle 設定](#configure-gradle-settings)以使用 Maven Central Repository。
>
{style="warning"}

## 新的 Kotlin K2 編譯器更新

JetBrains 的 Kotlin 團隊持續穩定 K2 編譯器，而 1.9.0 版本引入了進一步的改進。
JVM 的 K2 編譯器現已進入 **Beta** 階段。

現在也對 Kotlin/Native 和多平台專案提供了基本支援。

### kapt 編譯器外掛程式與 K2 編譯器的相容性

您可以在專案中將 [kapt 外掛程式](kapt.md)與 K2 編譯器一起使用，但有一些限制。
儘管將 `languageVersion` 設定為 `2.0`，kapt 編譯器外掛程式仍然使用舊的編譯器。

如果您在 `languageVersion` 設定為 `2.0` 的專案中執行 kapt 編譯器外掛程式，kapt 將自動
切換到 `1.9` 並停用特定版本相容性檢查。此行為等同於包含以下命令引數：
*   `-Xskip-metadata-version-check`
*   `-Xskip-prerelease-check`
*   `-Xallow-unstable-dependencies`

這些檢查僅對 kapt 任務停用。所有其他編譯任務將繼續使用新的 K2 編譯器。

如果您在使用 kapt 與 K2 編譯器時遇到任何問題，請向我們的[問題追蹤器](http://kotl.in/issue)報告。

### 在您的專案中試用 K2 編譯器

從 1.9.0 開始，直到 Kotlin 2.0 發佈之前，您可以透過將 `kotlin.experimental.tryK2=true`
Gradle 屬性新增至您的 `gradle.properties` 檔案，輕鬆測試 K2 編譯器。您也可以執行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

此 Gradle 屬性會自動將語言版本設定為 2.0，並更新建置報告，其中包含使用 K2 編譯器編譯的 Kotlin
任務數量與當前編譯器的比較：

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradle 建置報告

[Gradle 建置報告](gradle-compilation-and-caches.md#build-reports)現在會顯示是使用了當前編譯器還是 K2 編譯器
來編譯程式碼。在 Kotlin 1.9.0 中，您可以在 [Gradle 建置掃描](https://scans.gradle.com/)中看到此資訊：

![Gradle build scan - K1](gradle-build-scan-k1.png){width=700}

![Gradle build scan - K2](gradle-build-scan-k2.png){width=700}

您也可以直接在建置報告中找到專案中使用的 Kotlin 版本：

```none
Task info:
  Kotlin language version: 1.9
```

> 如果您使用 Gradle 8.0，您可能會遇到一些建置報告問題，尤其是在啟用 Gradle 配置快取時。這是已知問題，已在 Gradle 8.1 及更高版本中修復。
>
{style="note"}

### 當前 K2 編譯器限制

在您的 Gradle 專案中啟用 K2 會帶來某些限制，這些限制可能會影響在以下情況下使用 Gradle 8.3 以下版本的專案：

*   `buildSrc` 中的原始碼編譯。
*   包含建置中 Gradle 外掛程式的編譯。
*   其他 Gradle 外掛程式的編譯，如果它們在 Gradle 8.3 以下版本的專案中使用。
*   建置 Gradle 外掛程式依賴項。

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

*   將您的專案中的 Gradle 版本更新到 8.3（當其可用時）。

### 對新的 K2 編譯器留下您的回饋

我們將感謝您提出的任何回饋！

*   直接向 K2 開發者在 Kotlin 的 Slack 上提供回饋 – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
    並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
*   將您使用新的 K2 編譯器遇到的任何問題報告到[我們的問題追蹤器](https://kotl.in/issue)。
*   [啟用 **Send usage statistics** 選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)以允許 JetBrains 收集有關 K2 使用情況的匿名數據。

## 語言

在 Kotlin 1.9.0 中，我們正在穩定一些先前引入的新語言功能：
*   [列舉類別 `values` 函式的替代方案](#stable-replacement-of-the-enum-class-values-function)
*   [資料物件與資料類別的對稱性](#stable-data-objects-for-symmetry-with-data-classes)
*   [支援帶有主體的次級建構函式的行內值類別](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### 列舉類別 `values` 函式的穩定替代方案

在 1.8.20 中，列舉類別的 `entries` 屬性作為實驗性功能引入。`entries` 屬性是
`synthetic values()` 函式的現代化高效能替代方案。在 1.9.0 中，`entries` 屬性已穩定。

> `values()` 函式仍然支援，但我們建議您改用 `entries` 屬性。
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

有關列舉類別 `entries` 屬性的更多資訊，請參閱 [Kotlin 1.8.20 的新功能](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)。

### 資料物件與資料類別的穩定對稱性

資料物件宣告，它在 [Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes) 中引入，
現已穩定。這包括為與資料類別對稱而添加的函式：`toString()`、`equals()` 和 `hashCode()`。

此功能在 `sealed` 層級結構（例如 `sealed class` 或 `sealed interface` 層級結構）中特別有用，
因為 `data object` 宣告可以方便地與 `data class` 宣告一起使用。在此範例中，將
`EndOfFile` 宣告為 `data object` 而不是普通的 `object` 意味著它自動擁有 `toString()` 函式，而
無需手動覆寫。這保持了與附帶的資料類別定義的對稱性。

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
{validate="false"}

有關更多資訊，請參閱 [Kotlin 1.8.20 的新功能](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)。

### 支援帶有主體的次級建構函式的行內值類別

從 Kotlin 1.9.0 開始，在[行內值類別](inline-classes.md)中使用帶有主體的次級建構函式
預設可用：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // 允許自 Kotlin 1.4.30 起：
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // 預設允許自 Kotlin 1.9.0 起：
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```
{validate="false"}

以前，Kotlin 只允許行內類別中使用公開主建構函式。因此，無法
封裝底層值或建立表示某些受約束值的行內類別。

隨著 Kotlin 的發展，這些問題得到了修復。Kotlin 1.4.30 解除了對 `init` 區塊的限制，然後 Kotlin 1.8.20
預覽了帶有主體的次級建構函式。它們現在預設可用。在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中了解更多關於 Kotlin 行內類別的開發。

## Kotlin/JVM

從版本 1.9.0 開始，編譯器可以產生位元組碼版本對應於 JVM 20 的類別。此外，
`JvmDefault` 註解和傳統 `-Xjvm-default` 模式的棄用仍在繼續。

### JvmDefault 註解和傳統 `-Xjvm-default` 模式的棄用

從 Kotlin 1.5 開始，`JvmDefault` 註解的使用已棄用，轉而使用較新的 `-Xjvm-default`
模式：`all` 和 `all-compatibility`。隨著 Kotlin 1.4 中 `JvmDefaultWithoutCompatibility` 的引入和
Kotlin 1.6 中 `JvmDefaultWithCompatibility` 的引入，這些模式提供了對 `DefaultImpls` 類別生成的全面控制，
確保與舊的 Kotlin 程式碼無縫相容。

因此，在 Kotlin 1.9.0 中，`JvmDefault` 註解不再具有任何意義，並已被標記為
已棄用，導致錯誤。它最終將從 Kotlin 中移除。

## Kotlin/Native

除其他改進外，此版本還為 [Kotlin/Native 記憶體管理器](native-memory-manager.md)帶來了進一步的改進，
這應該能增強其強韌性和效能：

*   [自訂記憶體分配器預覽](#preview-of-custom-memory-allocator)
*   [Objective-C 或 Swift 物件在主執行緒上的解除分配掛鉤](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
*   [在 Kotlin/Native 中存取常數值時不進行物件初始化](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
*   [在 Kotlin/Native 中為 iOS 模擬器測試配置獨立模式的能力](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
*   [Kotlin/Native 中的函式庫連結](#library-linkage-in-kotlin-native)

### 自訂記憶體分配器預覽

Kotlin 1.9.0 引入了自訂記憶體分配器的預覽。其分配系統改進了
[Kotlin/Native 記憶體管理器](native-memory-manager.md)的執行時效能。

Kotlin/Native 中當前的物件分配系統使用通用分配器，該分配器不具有高效垃圾回收的功能。
為了補償，它在垃圾收集器 (GC) 將所有已分配物件合併到單一列表之前維護執行緒局部鏈結串列，
該列表可以在掃描期間迭代。這種方法帶來了幾個效能缺點：

*   掃描順序缺乏記憶體局部性，通常導致分散的記憶體存取模式，從而導致潛在的效能問題。
*   鏈結串列每個物件都需要額外記憶體，增加了記憶體使用量，特別是在處理許多小型物件時。
*   已分配物件的單一列表使得平行化掃描變得困難，當變異執行緒分配物件速度比 GC 執行緒收集速度快時，這可能會導致記憶體使用問題。

為了解決這些問題，Kotlin 1.9.0 引入了自訂分配器的預覽。它將系統記憶體分為頁面，
允許依序獨立掃描。每次分配都成為頁面內的一個記憶體區塊，頁面會追蹤區塊大小。
不同的頁面型別針對各種分配大小進行了優化。記憶體區塊的連續排列確保了對所有已分配區塊的高效率迭代。

當執行緒分配記憶體時，它會根據分配大小搜尋合適的頁面。執行緒會維護一組用於不同大小類別的頁面。
通常，給定大小的當前頁面可以容納該分配。如果不能，執行緒會從共享分配空間請求不同的頁面。
此頁面可能已經可用，需要掃描，或者應首先建立。

新的分配器允許同時擁有多個獨立的分配空間，這將使 Kotlin 團隊能夠
實驗不同的頁面佈局，以進一步提高效能。

有關新分配器設計的更多資訊，請參閱此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。

#### 如何啟用

新增 `-Xallocator=custom` 編譯器選項：

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

#### 留下回饋

我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native) 中提供回饋，
以改進自訂分配器。

### Objective-C 或 Swift 物件在主執行緒上的解除分配掛鉤

從 Kotlin 1.9.0 開始，如果 Objective-C 或 Swift 物件在主執行緒上傳遞給 Kotlin，則其解除分配掛鉤將在主執行緒上呼叫。
[Kotlin/Native 記憶體管理器](native-memory-manager.md)以前處理 Objective-C 物件參照的方式可能導致記憶體洩漏。
我們相信新行為應該能提高記憶體管理器的強韌性。

考慮一個在 Kotlin 程式碼中被參照的 Objective-C 物件，例如，當它作為引數傳遞、由函式返回或從集合中檢索時。
在這種情況下，Kotlin 會建立自己的物件，該物件持有對 Objective-C 物件的參照。當 Kotlin 物件被解除分配時，
Kotlin/Native 執行時會呼叫 `objc_release` 函式，該函式會釋放該 Objective-C 參照。

以前，Kotlin/Native 記憶體管理器在特殊的 GC 執行緒上執行 `objc_release`。如果它是最後一個物件參照，
物件就會被解除分配。當 Objective-C 物件具有自訂解除分配掛鉤（例如 Objective-C 中的 `dealloc` 方法或 Swift 中的 `deinit` 區塊），
並且這些掛鉤期望在特定執行緒上呼叫時，可能會出現問題。

由於主執行緒上物件的掛鉤通常期望在那裡呼叫，因此 Kotlin/Native 執行時現在也
在主執行緒上呼叫 `objc_release`。這應該涵蓋了 Objective-C 物件在主執行緒上傳遞給 Kotlin，
並在那裡建立 Kotlin 對等物件的情況。這僅在處理主調度佇列時有效，對於常規 UI 應用程式來說是這種情況。
如果不是主佇列，或者物件在非主執行緒上傳遞給 Kotlin，則 `objc_release` 像以前一樣在特殊的 GC 執行緒上呼叫。

#### 如何選擇退出

如果您遇到問題，可以在 `gradle.properties` 檔案中使用以下選項停用此行為：

```none
kotlin.native.binary.objcDisposeOnMain=false
```

請務必向[我們的問題追蹤器](https://kotl.in/issue)報告此類情況。

### 在 Kotlin/Native 中存取常數值時不進行物件初始化

從 Kotlin 1.9.0 開始，Kotlin/Native 後端在存取 `const val` 欄位時不初始化物件：

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // 第一次不初始化
    val x = MyObject    // 發生初始化
    println(x.y)
}
```
{validate="false"}

此行為現在與 Kotlin/JVM 統一，其中實作與 Java 一致，在這種情況下物件從不初始化。
由於此變更，您也可以預期您的 Kotlin/Native 專案中會有某些效能改進。

### 在 Kotlin/Native 中為 iOS 模擬器測試配置獨立模式的能力

依預設，當為 Kotlin/Native 執行 iOS 模擬器測試時，會使用 `--standalone` 旗標以避免手動模擬器
啟動與關閉。在 1.9.0 中，您現在可以透過 `standalone` 屬性配置此旗標是否在 Gradle 任務中使用。
依預設，會使用 `--standalone` 旗標，因此獨立模式已啟用。

以下是如何在您的 `build.gradle.kts` 檔案中停用獨立模式的範例：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```
{validate="false"}

> 如果您停用獨立模式，您必須手動啟動模擬器。要從 CLI 啟動您的模擬器，
> 您可以使用以下命令：
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
>```
>
{style="warning"}

### Kotlin/Native 中的函式庫連結

從 Kotlin 1.9.0 開始，Kotlin/Native 編譯器處理 Kotlin 函式庫中的連結問題的方式與 Kotlin/JVM 相同。
如果某個第三方 Kotlin 函式庫的作者在另一個第三方 Kotlin 函式庫使用的實驗性 API 中進行了不相容的變更，您可能會面臨此類問題。

現在，如果第三方 Kotlin 函式庫之間存在連結問題，建置不會在編譯期間失敗。相反，您只會在執行時遇到這些錯誤，
就像在 JVM 上完全一樣。

Kotlin/Native 編譯器每次偵測到函式庫連結問題時都會報告警告。您可以在編譯日誌中找到此類警告，例如：

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

您可以進一步配置甚至停用專案中的此行為：

*   如果您不想在編譯日誌中看到這些警告，請使用 `-Xpartial-linkage-loglevel=INFO` 編譯器選項抑制它們。
*   也可以使用 `-Xpartial-linkage-loglevel=ERROR` 將報告警告的嚴重性提高到編譯錯誤。在這種情況下，編譯會失敗，您將在編譯日誌中看到所有錯誤。使用此選項可以更仔細地檢查連結問題。
*   如果您在使用此功能時遇到意外問題，您可以隨時使用
    `-Xpartial-linkage=disable` 編譯器選項選擇退出。請務必向[我們的問題追蹤器](https://kotl.in/issue)報告此類情況。

```kotlin
// 透過 Gradle 建置檔案傳遞編譯器選項的範例。
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 抑制連結警告：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // 將連結警告提升為錯誤：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // 完全停用該功能：
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```
{validate="false"}

### C 互通隱式整數轉換的編譯器選項

我們為 C 互通引入了一個編譯器選項，允許您使用隱式整數轉換。經過仔細考量，我們引入此編譯器選項是為了防止意外使用，因為此功能仍有改進空間，我們的目標是提供最高品質的 API。

在此程式碼範例中，隱式整數轉換允許 `options = 0`，即使 [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options)
具有無符號型別 `UInt` 且 `0` 是有符號。

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

若要搭配原生互通函式庫使用隱式轉換，請使用 `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion`
編譯器選項。

您可以在您的 Gradle `build.gradle.kts` 檔案中進行配置：
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
*   [新的 Android 來源集佈局預設啟用](#new-android-source-set-layout-enabled-by-default)
*   [多平台專案中 Gradle 配置快取的預覽](#preview-of-the-gradle-configuration-cache)

### Android 目標支援的變更

我們持續努力穩定 Kotlin 多平台。一個重要的步驟是為 Android 目標提供一流的
支援。我們很高興地宣布，未來，Google 的 Android 團隊將提供其自己的 Gradle 外掛程式來支援 Kotlin 多平台中的 Android。

為了為 Google 的這個新解決方案開闢道路，我們在 1.9.0 中重新命名了當前 Kotlin DSL 中的 `android` 區塊。
請將您的建置腳本中所有 `android` 區塊的出現處更改為 `androidTarget`。這是為了為 Google 即將推出的 DSL 釋放 `android` 名稱而進行的臨時變更。

Google 外掛程式將是處理多平台專案中 Android 的首選方式。當它準備好時，我們將提供必要的遷移說明，以便您可以像以前一樣使用簡短的 `android` 名稱。

### 新的 Android 來源集佈局預設啟用

從 Kotlin 1.9.0 開始，新的 Android 來源集佈局是預設值。它取代了以前的目錄命名方案，該方案在多方面令人困惑。新佈局有許多優點：

*   簡化型別語義 – 新的 Android 來源佈局提供了清晰且一致的命名約定，有助於區分不同型別的來源集。
*   改進的來源目錄佈局 – 透過新佈局，`SourceDirectories` 佈局變得更連貫，使組織程式碼和定位來源檔案變得更容易。
*   清晰的 Gradle 配置命名方案 – 該方案現在在 `KotlinSourceSets` 和 `AndroidSourceSets` 中都更加一致且可預測。

新的佈局需要 Android Gradle 外掛程式 7.0 或更高版本，並支援 Android Studio 2022.3 及更高版本。請參閱我們的
[遷移指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html)以在您的 `build.gradle(.kts)` 檔案中進行必要的變更。

### Gradle 配置快取的預覽

<anchor name="preview-of-gradle-configuration-cache"/>

Kotlin 1.9.0 支援多平台函式庫中的 [Gradle 配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html)。
如果您是函式庫作者，您已經可以受益於改進的建置效能。

Gradle 配置快取透過重複使用配置階段的結果來加速建置過程，以用於後續
建置。此功能自 Gradle 8.1 起已穩定。若要啟用它，請遵循 [Gradle 文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)中的說明。

> Kotlin 多平台外掛程式仍不支援帶有 Xcode 整合任務或 [Kotlin CocoaPods Gradle 外掛程式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)的 Gradle 配置快取。我們預計在未來的 Kotlin 版本中添加此功能。
>
{style="note"}

## Kotlin/Wasm

Kotlin 團隊持續實驗新的 Kotlin/Wasm 目標。此版本引入了多項效能和
[大小相關的優化](#size-related-optim化)，以及 [JavaScript 互通的更新](#updates-in-javascript-interop)。

### 大小相關的優化

Kotlin 1.9.0 為 WebAssembly (Wasm) 專案引入了顯著的大小改進。比較兩個「Hello World」專案，
Kotlin 1.9.0 中 Wasm 的程式碼佔用空間現在比 Kotlin 1.8.20 小 10 倍以上。

![Kotlin/Wasm size-related optimizations](wasm-1-9-0-size-improvements.png){width=700}

這些大小優化可提高資源利用率，並在以 Kotlin 程式碼為目標 Wasm 平台時改善效能。

### JavaScript 互通更新

此 Kotlin 更新引入了 Kotlin 和 JavaScript 之間在 Kotlin/Wasm 中的互通性變更。由於 Kotlin/Wasm
是一個[實驗性](components-stability.md#stability-levels-explained)功能，因此其互通性存在某些限制。

#### Dynamic 型別的限制

從版本 1.9.0 開始，Kotlin 不再支援在 Kotlin/Wasm 中使用 `Dynamic` 型別。這現在已棄用，
轉而使用新的通用 `JsAny` 型別，該型別有助於 JavaScript 互通性。

有關更多詳細資訊，請參閱 [Kotlin/Wasm 與 JavaScript 的互通性](wasm-js-interop.md)文件。

#### 非外部型別的限制

Kotlin/Wasm 支援在將值傳遞給 JavaScript 或從 JavaScript 傳遞值時，針對特定 Kotlin 靜態型別進行轉換。這些支援的
型別包括：

*   基本型別，例如有符號數、`Boolean` 和 `Char`。
*   `String`。
*   函式型別。

其他型別在沒有轉換的情況下作為不透明參照傳遞，導致 JavaScript 和 Kotlin
子型別之間不一致。

為了解決這個問題，Kotlin 將 JavaScript 互通性限制在一個支援良好的型別集合中。從 Kotlin 1.9.0 開始，只有外部、
基本、字串和函式型別支援在 Kotlin/Wasm JavaScript 互通性中。此外，還引入了一個單獨的顯式型別 `JsReference`，
用於表示可以在 JavaScript 互通性中使用的 Kotlin/Wasm 物件的句柄。

有關更多詳細資訊，請參閱 [Kotlin/Wasm 與 JavaScript 的互通性](wasm-js-interop.md)文件。

### Kotlin/Wasm 在 Kotlin Playground 中

Kotlin Playground 支援 Kotlin/Wasm 目標。
您可以編寫、執行和分享以 Kotlin/Wasm 為目標的 Kotlin 程式碼。[來看看吧！](https://pl.kotl.in/HDFAvimga)

> 使用 Kotlin/Wasm 需要在您的瀏覽器中啟用實驗性功能。
>
> [了解如何啟用這些功能](wasm-troubleshooting.md)。
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

此版本引入了 Kotlin/JS 的更新，包括移除了舊的 Kotlin/JS 編譯器、Kotlin/JS Gradle 外掛程式的棄用以及 ES2015 的實驗性支援：

*   [移除舊的 Kotlin/JS 編譯器](#removal-of-the-old-kotlin-js-compiler)
*   [Kotlin/JS Gradle 外掛程式的棄用](#deprecation-of-the-kotlin-js-gradle-plugin)
*   [外部列舉的棄用](#deprecation-of-external-enum)
*   [ES2015 類別和模組的實驗性支援](#experimental-support-for-es2015-classes-and-modules)
*   [JS 生產分發的預設目的地變更](#changed-default-destination-of-js-production-distribution)
*   [從 stdlib-js 中提取 org.w3c 宣告](#extract-org-w3c-declarations-from-stdlib-js)

> 從版本 1.9.0 開始，[部分函式庫連結](#library-linkage-in-kotlin-native)也針對 Kotlin/JS 啟用。
>
{style="note"}

### 移除舊的 Kotlin/JS 編譯器

在 Kotlin 1.8.0 中，我們[宣布](whatsnew18.md#stable-js-ir-compiler-backend)基於 IR 的後端已成為[穩定版本](components-stability.md)。
從那時起，未指定編譯器已成為錯誤，而使用舊編譯器則會導致警告。

在 Kotlin 1.9.0 中，使用舊後端會導致錯誤。請遵循我們的[遷移指南](js-ir-migration.md)遷移到 IR 編譯器。

### Kotlin/JS Gradle 外掛程式的棄用

從 Kotlin 1.9.0 開始，`kotlin-js` Gradle 外掛程式已
棄用。我們鼓勵您改用帶有 `js()` 目標的 `kotlin-multiplatform` Gradle 外掛程式。

Kotlin/JS Gradle 外掛程式的功能實質上複製了 `kotlin-multiplatform` 外掛程式，並且底層共用
相同的實作。這種重疊造成了混淆，並增加了 Kotlin 團隊的維護負擔。

有關遷移說明，請參閱我們的 [Kotlin 多平台相容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin)。如果您發現指南中未涵蓋的任何問題，請向我們的[問題追蹤器](http://kotl.in/issue)報告。

### 外部列舉的棄用

在 Kotlin 1.9.0 中，外部列舉的使用將被棄用，因為與靜態列舉成員（如 `entries`）存在問題，這些成員
無法存在於 Kotlin 之外。我們建議改用帶有物件子類別的外部密封類別：

```kotlin
// 之前
external enum class ExternalEnum { A, B }

// 之後
external sealed class ExternalEnum {
    object A: ExternalEnum
    object B: ExternalEnum
}
```
{validate="false"}

透過切換到帶有物件子類別的外部密封類別，您可以實現與外部列舉類似的功能，同時避免與預設方法相關的問題。

從 Kotlin 1.9.0 開始，外部列舉的使用將被標記為已棄用。我們鼓勵您更新程式碼，
利用建議的外部密封類別實作，以確保相容性和未來維護。

### ES2015 類別和模組的實驗性支援

此版本引入了 ES2015 模組和 ES2015 類別生成的[實驗性](components-stability.md#stability-levels-explained)支援：
*   模組提供了一種簡化程式碼庫並提高可維護性的方法。
*   類別允許您整合物件導向程式設計 (OOP) 原則，從而產生更簡潔、更直觀的程式碼。

若要啟用這些功能，請相應地更新您的 `build.gradle.kts` 檔案：

```kotlin
// build.gradle.kts
kotlin {
    js(IR) {
        useEsModules() // 啟用 ES2015 模組
        browser()
    }
}

// 啟用 ES2015 類別生成
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        useEsClasses = true
    }
}
```
{validate="false"}

[在官方文件中了解更多關於 ES2015 (ECMAScript 2015, ES6) 的資訊](https://262.ecma-international.org/6.0/)。

### JS 生產分發的預設目的地變更

在 Kotlin 1.9.0 之前，分發目標目錄是 `build/distributions`。然而，這是 Gradle 歸檔的常用目錄。
為了解決此問題，我們已將 Kotlin 1.9.0 中的預設分發目標目錄更改為：
`build/dist/<targetName>/<binaryName>`。

例如，`productionExecutable` 以前在 `build/distributions` 中。在 Kotlin 1.9.0 中，它位於 `build/dist/js/productionExecutable` 中。

> 如果您已有使用這些建置結果的管線，請務必更新目錄。
>
{style="warning"}

### 從 stdlib-js 中提取 org.w3c 宣告

自 Kotlin 1.9.0 起，`stdlib-js` 不再包含 `org.w3c` 宣告。相反，這些宣告已
移至單獨的 Gradle 依賴項。當您將 Kotlin 多平台 Gradle 外掛程式新增至您的 `build.gradle.kts` 檔案時，
這些宣告將自動包含在您的專案中，類似於標準函式庫。

無需任何手動操作或遷移。必要的調整將自動處理。

## Gradle

Kotlin 1.9.0 帶來了新的 Gradle 編譯器選項以及更多功能：

*   [移除 classpath 屬性](#removed-classpath-property)
*   [新的編譯器選項](#new-compiler-options)
*   [Kotlin/JVM 的專案層級編譯器選項](#project-level-compiler-options-for-kotlin-jvm)
*   [Kotlin/Native 模組名稱的編譯器選項](#compiler-option-for-kotlin-native-module-name)
*   [官方 Kotlin 函式庫的獨立編譯器外掛程式](#separate-compiler-plugins-for-official-kotlin-libraries)
*   [增加最低支援版本](#incremented-minimum-supported-version)
*   [kapt 不會導致 Gradle 中急切的任務建立](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
*   [JVM 目標驗證模式的程式化配置](#programmatic-configuration-of-the-jvm-target-validation-mode)

### 移除 classpath 屬性

在 Kotlin 1.7.0 中，我們宣布了 `KotlinCompile` 任務屬性 `classpath` 的棄用週期開始。
在 Kotlin 1.8.0 中，棄用級別提高到 `ERROR`。在此版本中，我們最終移除了 `classpath` 屬性。
所有編譯任務現在都應使用 `libraries` 輸入來獲取編譯所需的函式庫列表。

### 新的編譯器選項

Kotlin Gradle 外掛程式現在為選擇加入和編譯器的漸進模式提供了新屬性。

*   要選擇加入新的 API，您現在可以使用 `optIn` 屬性並傳遞字串列表，例如：`optIn.set(listOf(a, b, c))`。
*   要啟用漸進模式，請使用 `progressiveMode.set(true)`。

### Kotlin/JVM 的專案層級編譯器選項

從 Kotlin 1.9.0 開始，新的 `compilerOptions` 區塊在 `kotlin` 配置區塊內部可用：

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```
{validate="false"}

這使得配置編譯器選項更容易。然而，務必注意一些重要細節：

*   此配置僅在專案層級有效。
*   對於 Android 外掛程式，此區塊配置與以下相同的物件：

```kotlin
android {
    kotlinOptions {}
}
```
{validate="false"}

*   `android.kotlinOptions` 和 `kotlin.compilerOptions` 配置區塊互相覆寫。建置檔案中最後（最低）的區塊總是生效。
*   如果在專案層級配置 `moduleName`，其值在傳遞給編譯器時可能會更改。這對於 `main` 編譯不是這種情況，但對於其他型別，例如測試來源，Kotlin Gradle 外掛程式將添加 `_test` 後綴。
*   `tasks.withType<KotlinJvmCompile>().configureEach {}`（或 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`）中的配置會覆寫 `kotlin.compilerOptions` 和 `android.kotlinOptions`。

### Kotlin/Native 模組名稱的編譯器選項

Kotlin/Native 的 [`module-name`](compiler-reference.md#module-name-name-native) 編譯器選項現在在 Kotlin Gradle 外掛程式中很容易取得。

此選項指定編譯模組的名稱，也可用於為導出到 Objective-C 的宣告添加名稱前綴。

您現在可以直接在 Gradle 建置檔案的 `compilerOptions` 區塊中設定模組名稱：

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

Kotlin 1.9.0 為其官方函式庫引入了獨立的編譯器外掛程式。以前，編譯器外掛程式嵌入在
其相應的 Gradle 外掛程式中。這可能會在編譯器外掛程式與 Gradle 建置的 Kotlin 執行時版本相比，
編譯器外掛程式是針對更高 Kotlin 版本編譯的情況下導致相容性問題。

現在編譯器外掛程式作為獨立的依賴項添加，因此您將不再面臨與舊版 Gradle
的相容性問題。新方法的另一個主要優點是新的編譯器外掛程式可以與其他建置系統一起使用，
例如 [Bazel](https://bazel.build/)。

以下是我們現在發佈到 Maven Central 的新編譯器外掛程式列表：

*   kotlin-atomicfu-compiler-plugin
*   kotlin-allopen-compiler-plugin
*   kotlin-lombok-compiler-plugin
*   kotlin-noarg-compiler-plugin
*   kotlin-sam-with-receiver-compiler-plugin
*   kotlinx-serialization-compiler-plugin

每個外掛程式都有其 `-embeddable` 對應項，例如，`kotlin-allopen-compiler-plugin-embeddable` 旨在
與 `kotlin-compiler-embeddable` 成品一起使用，這是腳本化成品的預設選項。

Gradle 將這些外掛程式添加為編譯器引數。您無需對現有專案進行任何更改。

### 增加最低支援版本

從 Kotlin 1.9.0 開始，最低支援的 Android Gradle 外掛程式版本為 4.2.2。

請參閱我們文件中的 [Kotlin Gradle 外掛程式與可用 Gradle 版本的相容性](gradle-configure-project.md#apply-the-plugin)。

### kapt 不會導致 Gradle 中急切的任務建立

在 1.9.0 之前，[kapt 編譯器外掛程式](kapt.md)會透過請求 Kotlin 編譯任務的已配置實例來導致急切的任務建立。
此行為已在 Kotlin 1.9.0 中修復。如果您為 `build.gradle.kts` 檔案使用預設配置，則您的設定不受此變更影響。

> 如果您使用自訂配置，您的設定將受到不利影響。
> 例如，如果您使用 Gradle 的任務 API 修改了 `KotlinJvmCompile` 任務，您必須以同樣的方式修改
> `KaptGenerateStubs` 任務在您的建置腳本中。
>
> 例如，如果您的腳本包含 `KotlinJvmCompile` 任務的以下配置：
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // 您的自訂配置 }
> ```
> {validate="false"}
>
> 在這種情況下，您需要確保相同的修改包含在 `KaptGenerateStubs` 任務中：
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // 您的自訂配置 }
>```
> {validate="false"}
>
{style="warning"}

有關更多資訊，請參閱我們的 [YouTrack 工單](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation)。

### JVM 目標驗證模式的程式化配置

在 Kotlin 1.9.0 之前，只有一種方法可以調整 Kotlin 和 Java 之間 JVM 目標不相容性的偵測。
您必須在 `gradle.properties` 中為整個專案設定 `kotlin.jvm.target.validation.mode=ERROR`。

您現在也可以在任務層級在您的 `build.gradle.kts` 檔案中進行配置：

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```
{validate="false"}

## 標準函式庫

Kotlin 1.9.0 對標準函式庫有一些重大改進：
*   [`..<` 運算子](#stable-operator-for-open-ended-ranges) 和 [時間 API](#stable-time-api) 已穩定。
*   [Kotlin/Native 標準函式庫已徹底審查和更新](#the-kotlin-native-standard-library-s-journey-towards-stabilization)
*   [`@Volatile` 註解可在更多平台上使用](#stable-volatile-annotation)
*   [有一個**共同**函式可以根據名稱取得正規表達式捕獲群組](#new-common-function-to-get-regex-capture-group-by-name)
*   [引入了 `HexFormat` 類別來格式化和解析十六進位值](#new-hexformat-class-to-format-and-parse-hexadecimals)

### 用於開放範圍的穩定 `..<` 運算子

用於開放範圍的新 `..<` 運算子在 [Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges) 中引入，
並在 1.8.0 中穩定。在 1.9.0 中，用於處理開放範圍的標準函式庫 API 也已穩定。

我們的研究表明，新的 `..<` 運算子使得理解何時宣告開放範圍更容易。如果您
使用 [`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html) 中綴函式，很容易
犯下假設包含上限的錯誤。

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

> 從 IntelliJ IDEA 2023.1.1 版本開始，新的程式碼檢查功能可用，它會突出顯示何時可以
> 使用 `..<` 運算子。
>
{style="note"}

有關此運算子功能的更多資訊，請參閱 [Kotlin 1.7.20 的新功能](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)。

### 穩定時間 API

自 1.3.50 起，我們已預覽新的時間測量 API。API 的持續時間部分在 1.6.0 中穩定。在 1.9.0 中，
其餘的時間測量 API 已穩定。

舊的時間 API 提供了 `measureTimeMillis` 和 `measureNanoTime` 函式，它們不易於使用。雖然清楚它們都以不同單位測量時間，
但並不清楚 `measureTimeMillis` 使用[掛鐘](https://en.wikipedia.org/wiki/Elapsed_real_time)測量時間，
而 `measureNanoTime` 使用單調時間源。新的時間 API 解決了這個問題和其他問題，使 API 更方便使用者。

使用新的時間 API，您可以輕鬆地：
*   使用單調時間源和您想要的時間單位來測量執行某些程式碼所需的時間。
*   標記時間點。
*   比較並找到兩個時間點之間的差異。
*   檢查自特定時間點以來過了多少時間。
*   檢查當前時間是否已過特定時間點。

#### 測量程式碼執行時間

若要測量執行程式碼區塊所需的時間，請使用 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)
行內函式。

若要測量執行程式碼區塊所需的時間**並**返回程式碼區塊的結果，請使用
[`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 行內函式。

依預設，這兩個函式都使用單調時間源。但是，如果您想使用經過的即時時間源，您也可以。
例如，在 Android 上，預設時間源 `System.nanoTime()`
僅在裝置啟用時計算時間。當裝置進入深度睡眠時，它會失去時間追蹤。若要追蹤裝置深度睡眠時的時間，
您可以建立一個使用 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos())
的時間源：

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```
{validate="false"}

#### 標記並測量時間差異

若要標記特定的時間點，請使用 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/)
介面和 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 函式
來建立 [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)。若要測量來自同一時間源的
`TimeMark` 之間的差異，請使用減法運算子 (`-`)：

```kotlin
import kotlin.time.*

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 暫停 0.5 秒。
    val mark2 = timeSource.markNow()

    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // 也可以比較時間標記。
    println(mark2 > mark1) // 這是真的，因為 mark2 比 mark1 晚捕獲。
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-elapsed"}

若要檢查截止日期是否已過或超時是否已達到，請使用 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html)
和 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html)
擴展函式：

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    val fiveSeconds: Duration = 5.seconds
    val mark2 = mark1 + fiveSeconds

    // 還沒有到 5 秒
    println(mark2.hasPassedNow())
    // false

    // 等待六秒
    Thread.sleep(6000)
    println(mark2.hasPassedNow())
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-passednow"}

### Kotlin/Native 標準函式庫邁向穩定的歷程

隨著我們的 Kotlin/Native 標準函式庫持續成長，我們決定是時候進行全面審查，以確保
它符合我們的高標準。作為其中的一部分，我們仔細審查了**每個**現有的公開簽章。對於每個
簽章，我們都考慮了它是否：

*   具有獨特目的。
*   與其他 Kotlin API 一致。
*   與其對應的 JVM 行為相似。
*   未來可擴展。

基於這些考量，我們做出了以下決定之一：
*   使其穩定。
*   使其實驗性。
*   標記為 `private`。
*   修改其行為。
*   移至不同位置。
*   棄用它。
*   標記為已過時。

> 如果現有簽章已：
> *   移至另一個套件，則簽章仍然存在於原始套件中，但現在已棄用，棄用級別為：`WARNING`。IntelliJ IDEA 將在程式碼檢查時自動建議替代方案。
> *   棄用，則它已棄用，棄用級別為：`WARNING`。
> *   標記為已過時，則您可以繼續使用它，但它將來會被取代。
>
{style="note"}

我們不會在此列出審查的所有結果，但以下是一些亮點：
*   我們穩定化了 Atomics API。
*   我們將 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) 設為實驗性，現在需要不同的選擇加入才能使用該套件。有關更多資訊，請參閱[顯式 C 互通穩定性保證](#explicit-c-interoperability-stability-guarantees)。
*   我們將 [`Worker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker/) 類別及其相關 API 標記為已過時。
*   我們將 [`BitSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-bit-set/) 類別標記為已過時。
*   我們將 `kotlin.native.internal` 套件中的所有 `public` API 標記為 `private` 或將它們移至其他套件。

#### 顯式 C 互通穩定性保證

為保持我們的 API 高品質，我們決定將 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/)
設定為實驗性。儘管 `kotlinx.cinterop` 已經過徹底的嘗試與測試，但在我們足夠滿意使其穩定之前，仍有改進空間。我們建議您使用此 API 進行互通，但盡量將其使用限制在專案的特定區域。一旦我們開始發展此 API 以使其穩定，這將使您的遷移更容易。

如果您想使用類 C 外部 API（例如指標），您必須選擇加入 `@OptIn(ExperimentalForeignApi)`，否則您的程式碼將無法編譯。

若要使用 `kotlinx.cinterop` 的其餘部分（涵蓋 Objective-C/Swift 互通性），您必須選擇加入
`@OptIn(BetaInteropApi)`。如果您嘗試在沒有選擇加入的情況下使用此 API，您的程式碼將編譯，但編譯器會
發出警告，提供您可預期行為的清晰解釋。

有關這些註解的更多資訊，請參閱我們 [`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt) 的原始碼。

有關作為本次審查一部分的**所有**變更的更多資訊，請參閱我們的 [YouTrack 工單](https://youtrack.jetbrains.com/issue/KT-55765)。

我們將感謝您提出的任何回饋！您可以透過在[工單](https://youtrack.jetbrains.com/issue/KT-57728)上留言直接提供您的回饋。

### 穩定 @Volatile 註解

如果您用 `@Volatile` 註解 `var` 屬性，則後備欄位會被標記，以便對此欄位的任何讀取或寫入都是原子性的，並且寫入總是對其他執行緒可見。

在 1.8.20 之前，[`kotlin.jvm.Volatile` 註解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)
在共同標準函式庫中可用。然而，此註解僅在 JVM 上有效。如果您在其他平台上使用它，它會被忽略，這導致錯誤。

在 1.8.20 中，我們引入了一個實驗性的共同註解 `kotlin.concurrent.Volatile`，您可以在 JVM 和 Kotlin/Native 中預覽。

在 1.9.0 中，`kotlin.concurrent.Volatile` 已穩定。如果您在多平台專案中使用 `kotlin.jvm.Volatile`，我們
建議您遷移到 `kotlin.concurrent.Volatile`。

### 根據名稱取得正規表達式捕獲群組的新共同函式

在 1.9.0 之前，每個平台都有自己的擴展來根據其名稱從正規表達式匹配中取得正規表達式捕獲群組。
然而，沒有共同函式。在 Kotlin 1.8.0 之前，不可能有共同函式，
因為標準函式庫仍然支援 JVM 目標 1.6 和 1.7。

從 Kotlin 1.8.0 開始，標準函式庫使用 JVM 目標 1.8 編譯。因此在 1.9.0 中，現在有一個**共同**的
[`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html) 函式，您可以使用它來
檢索正規表達式匹配中屬於特定捕獲群組的群組內容。當您想要存取屬於特定捕獲群組的正規表達式匹配結果時，這很有用。

以下是一個包含三個捕獲群組（`city`、`state` 和 `areaCode`）的正規表達式範例。您
可以使用這些群組名稱來存取匹配的值：

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

### 建立父目錄的新路徑工具程式

在 1.9.0 中，有一個新的 `createParentDirectories()` 擴展函式，您可以使用它來建立一個新檔案以及所有
必要的父目錄。當您向 `createParentDirectories()` 提供檔案路徑時，它會檢查父目錄是否已存在。
如果存在，它不做任何事。然而，如果不存在，它會為您建立它們。

`createParentDirectories()` 在您複製檔案時特別有用。例如，您可以將其與 `copyToRecursively()` 函式結合使用：

 ```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
 ```
{validate="false"}

### 新的 HexFormat 類別來格式化和解析十六進位值

> 新的 `HexFormat` 類別及其相關的擴展函式是[實驗性](components-stability.md#stability-levels-explained)功能，
> 若要使用它們，您可以選擇加入 `@OptIn(ExperimentalStdlibApi::class)` 或編譯器引數
> `-opt-in=kotlin.ExperimentalStdlibApi`。
>
{style="warning"}

在 1.9.0 中，[`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 類別及其相關的
擴展函式作為實驗性功能提供，允許您在數值和十六進位字串之間進行轉換。
具體來說，您可以使用擴展函式在十六進位字串與 `ByteArrays` 或其他數值型別（`Int`、`Short`、`Long`）之間進行轉換。

例如：

```kotlin
println(93.toHexString()) // "0000005d"
```
{validate="false"}

`HexFormat` 類別包含可以使用 `HexFormat{}` 建構器配置的格式化選項。

如果您正在使用 `ByteArrays`，您有以下選項，這些選項可透過屬性配置：

| 選項 | 描述 |
| :------------ | :------------ |
| `upperCase` | 十六進位數字是大寫還是小寫。依預設，假定為小寫。`upperCase = false`。 |
| `bytes.bytesPerLine` | 每行最大位元組數。 |
| `bytes.bytesPerGroup` | 每組最大位元組數。 |
| `bytes.bytesSeparator` | 位元組間的分隔符。依預設無。 |
| `bytes.bytesPrefix` | 緊接在每個位元組的兩位數十六進位表示之前字串，依預設無。 |
| `bytes.bytesSuffix` | 緊接在每個位元組的兩位數十六進位表示之後字串，依預設無。 |

例如：

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// 使用 HexFormat{} 建構器用冒號分隔十六進位字串
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// "00:1b:63:84:45:e6"

// 使用 HexFormat{} 建構器來：
// * 將十六進位字串大寫
// * 將位元組成對分組
// * 用句號分隔
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// "001B.6384.45E6"
```
{validate="false"}

如果您正在使用數值型別，您有以下選項，這些選項可透過屬性配置：

| 選項 | 描述 |
| :------------ | :------------ |
| `number.prefix` | 十六進位字串的前綴，依預設無。 |
| `number.suffix` | 十六進位字串的後綴，依預設無。 |
| `number.removeLeadingZeros` | 是否移除十六進位字串中的前導零。依預設，不移除任何前導零。`number.removeLeadingZeros = false` |

例如：

```kotlin
// 使用 HexFormat{} 建構器解析具有前綴 "0x" 的十六進位值。
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // "58"
```
{validate="false"}

## 文件更新

Kotlin 文件收到了一些顯著變更：
*   [Kotlin 之旅](kotlin-tour-welcome.md) – 學習 Kotlin 程式語言的基礎知識，章節包含理論與實踐。
*   [Android 來源集佈局](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html) – 了解新的 Android 來源集佈局。
*   [Kotlin 多平台相容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html) – 了解您在使用 Kotlin 多平台開發專案時可能遇到的不相容變更。
*   [Kotlin Wasm](wasm-overview.md) – 了解 Kotlin/Wasm 以及如何在您的 Kotlin 多平台專案中使用它。

## 安裝 Kotlin 1.9.0

### 檢查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3 和 2023.1.1 會自動建議將 Kotlin
外掛程式更新到 1.9.0 版本。IntelliJ IDEA 2023.2 將包含 Kotlin 1.9.0 外掛程式。

Android Studio Giraffe (223) 和 Hedgehog (231) 將在其即將發佈的版本中支援 Kotlin 1.9.0。

新的命令列編譯器可在 [GitHub 發佈頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0)上下載。

### 配置 Gradle 設定

若要下載 Kotlin 成品與依賴項，請更新您的 `settings.gradle(.kts)` 檔案以使用 Maven Central Repository：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

如果未指定儲存庫，Gradle 將使用已停用的 JCenter 儲存庫，這可能導致 Kotlin 成品問題。

## Kotlin 1.9.0 相容性指南

Kotlin 1.9.0 是一個[功能發佈](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能
帶來與您為早期語言版本編寫的程式碼不相容的變更。在 [Kotlin 1.9.0 相容性指南](compatibility-guide-19.md)中找到這些變更的詳細列表。