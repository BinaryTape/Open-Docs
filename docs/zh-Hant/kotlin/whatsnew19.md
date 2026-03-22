[//]: # (title: Kotlin 1.9.0 的新功能)

<web-summary>閱讀 Kotlin 1.9.0 發佈說明，涵蓋新的語言特性、Kotlin 多平台、JVM、Native、JS 和 Wasm 的更新，以及 Gradle 與 Maven 的建置工具支援。</web-summary>

_[發佈日期：2023 年 7 月 6 日](releases.md#release-history)_

Kotlin 1.9.0 版本已發佈，用於 JVM 的 K2 編譯器目前處於 **Beta** 階段。此外，以下是本次更新的主要亮點：

* [新的 Kotlin K2 編譯器更新](#new-kotlin-k2-compiler-updates)
* [穩定取代 enum 類別的 values 函式](#stable-replacement-of-the-enum-class-values-function)
* [用於開放式範圍的穩定 `..<` 運算子](#stable-operator-for-open-ended-ranges)
* [新的通用函式，可依名稱獲取正則表示式捕獲群組](#new-common-function-to-get-regex-capture-group-by-name)
* [新的路徑工具，用於建立父目錄](#new-path-utility-to-create-parent-directories)
* [Kotlin 多平台中 Gradle 組態快取的預覽](#preview-of-the-gradle-configuration-cache)
* [Kotlin 多平台中 Android 目標支援的變更](#changes-to-android-target-support)
* [Kotlin/Native 中自訂記憶體分配器的預覽](#preview-of-custom-memory-allocator)
* [Kotlin/Native 中的程式庫連結](#library-linkage-in-kotlin-native)
* [Kotlin/Wasm 中與尺寸相關的最佳化](#size-related-optimizations)

您也可以在此影片中找到更新內容的簡短概述：

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="Kotlin 1.9.0 的新功能"/>

> 有關 Kotlin 發佈週期的資訊，請參閱 [Kotlin 發佈流程](releases.md)。
>
{style="tip"}

## IDE 支援

支援 1.9.0 的 Kotlin 外掛程式適用於：

| IDE | 支援的版本 |
|--|--|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 外掛程式將包含在 Android Studio Giraffe (223) 和 Hedgehog (231) 的即將發佈版本中。

Kotlin 1.9.0 外掛程式將包含在 IntelliJ IDEA 2023.2 的即將發佈版本中。

> 要下載 Kotlin 構件和相依性，請[設定您的 Gradle 設定](#configure-gradle-settings)以使用 Maven Central 儲存庫。
>
{style="warning"}

## 新的 Kotlin K2 編譯器更新

JetBrains 的 Kotlin 團隊持續穩定 K2 編譯器，1.9.0 版本引入了進一步的進展。
用於 JVM 的 K2 編譯器目前處於 **Beta** 階段。

現在也對 Kotlin/Native 和多平台專案提供了基礎支援。

### kapt 編譯器外掛程式與 K2 編譯器的相容性

您可以在專案中將 [kapt 外掛程式](kapt.md)與 K2 編譯器一起使用，但有一些限制。
儘管將 `languageVersion` 設定為 `2.0`，kapt 編譯器外掛程式仍然使用舊的編譯器。

如果您在 `languageVersion` 設定為 `2.0` 的專案中執行 kapt 編譯器外掛程式，kapt 將自動切換回 `1.9` 並停用特定的版本相容性檢查。此行為等同於包含以下指令引數：
* `-Xskip-metadata-version-check`
* `-Xskip-prerelease-check`
* `-Xallow-unstable-dependencies`

這些檢查僅針對 kapt 任務停用。所有其他編譯任務將繼續使用新的 K2 編譯器。

如果您在將 kapt 與 K2 編譯器一起使用時遇到任何問題，請回報至我們的[問題追蹤器](http://kotl.in/issue)。

### 在您的專案中嘗試 K2 編譯器

從 1.9.0 開始直到 Kotlin 2.0 發佈之前，您可以透過在 `gradle.properties` 檔案中加入 `kotlin.experimental.tryK2=true` Gradle 屬性來輕鬆測試 K2 編譯器。您也可以執行以下指令：

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

此 Gradle 屬性會自動將語言版本設定為 2.0，並使用 K2 編譯器編譯的 Kotlin 任務數量與當前編譯器的比較來更新建置報告：

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradle 建置報告

[Gradle 建置報告](gradle-compilation-and-caches.md#build-reports)現在會顯示是使用當前編譯器還是 K2 編譯器來編譯程式碼。在 Kotlin 1.9.0 中，您可以在您的 [Gradle 建置掃描](https://scans.gradle.com/)中看到此資訊：

![Gradle 建置掃描 - K1](gradle-build-scan-k1.png){width=700}

![Gradle 建置掃描 - K2](gradle-build-scan-k2.png){width=700}

您也可以直接在建置報告中找到專案使用的 Kotlin 版本：

```none
Task info:
  Kotlin language version: 1.9
```

> 如果您使用 Gradle 8.0，您可能會遇到建置報告的一些問題，特別是當啟用了 Gradle 組態快取時。這是一個已知問題，已在 Gradle 8.1 及更高版本中修正。
>
{style="note"}

### 當前 K2 編譯器的限制

在您的 Gradle 專案中啟用 K2 存在某些限制，這些限制在以下情況下可能會影響使用 Gradle 8.3 以下版本的專案：

* 編譯來自 `buildSrc` 的原始碼。
* 編譯包含在建置（included builds）中的 Gradle 外掛程式。
* 編譯其他 Gradle 外掛程式（如果它們在 Gradle 8.3 以下版本的專案中使用）。
* 建置 Gradle 外掛程式相依性。

如果您遇到上述任何問題，可以採取以下步驟來解決：

* 為 `buildSrc`、任何 Gradle 外掛程式及其相依性設定語言版本：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

* 當 Gradle 8.3 版本可用時，更新您專案中的 Gradle 版本。

### 留下您對新 K2 編譯器的回饋

我們非常感謝您的任何回饋！

* 直接在 Kotlin 的 Slack 上向 K2 開發人員提供回饋 – [獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
* 在[我們的問題追蹤器](https://kotl.in/issue)上回報您在使用新 K2 編譯器時遇到的任何問題。
* [啟用 **傳送使用統計資料** 選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)以允許 JetBrains 收集有關 K2 使用情況的匿名數據。

## 語言

在 Kotlin 1.9.0 中，我們正在穩定一些先前引入的新語言特性：
* [取代 enum 類別的 values 函式](#stable-replacement-of-the-enum-class-values-function)
* [Data object 與 data class 的對稱性](#stable-data-objects-for-symmetry-with-data-classes)
* [支援在內聯值類別中包含主體的次要建構函式](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### 穩定取代 enum 類別的 values 函式

在 1.8.20 中，引入了 enum 類別的 `entries` 屬性作為實驗性功能。`entries` 屬性是合成的 `values()` 函式的現代化且高效的替代方案。在 1.9.0 中，`entries` 屬性已進入穩定階段。

> 雖然仍然支援 `values()` 函式，但我們建議您改用 `entries` 屬性。
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

有關 enum 類別 `entries` 屬性的更多資訊，請參閱 [Kotlin 1.8.20 的新功能](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)。

### 穩定 Data object 以與 data class 對稱

在 [Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes) 中引入的 `data object` 宣告現在已穩定。這包括為與 `data class` 對稱而新增的函式：`toString()`、`equals()` 和 `hashCode()`。

此功能在處理 `sealed` 階層（如 `sealed class` 或 `sealed interface` 階層）時特別有用，因為 `data object` 宣告可以方便地與 `data class` 宣告一起使用。在此範例中，將 `EndOfFile` 宣告為 `data object` 而不是普通 `object`，意味著它會自動擁有 `toString()` 函式，而無需手動覆寫。這保持了與隨附的 `data class` 定義的對稱性。

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

### 支援在內聯值類別中包含主體的次要建構函式

從 Kotlin 1.9.0 開始，在[內聯值類別](inline-classes.md)中使用包含主體的次要建構函式已預設可用：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // 自 Kotlin 1.4.30 起允許：
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // 自 Kotlin 1.9.0 起預設允許：
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```
{validate="false"}

以前，Kotlin 在內聯類別中僅允許公開的主要建構函式。因此，無法封裝底層值或建立代表某些受限值的內聯類別。

隨著 Kotlin 的發展，這些問題得到了解決。Kotlin 1.4.30 取消了對 `init` 區塊的限制，隨後 Kotlin 1.8.20 提供了包含主體的次要建構函式的預覽。現在它們已預設可用。在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中了解更多關於 Kotlin 內聯類別的發展。

## Kotlin/JVM

從 1.9.0 版本開始，編譯器可以產生位元組碼版本對應於 JVM 20 的類別。此外，持續棄用 `JvmDefault` 註解和舊有的 `-Xjvm-default` 模式。

### 棄用 JvmDefault 註解與舊有 -Xjvm-default 模式

從 Kotlin 1.5 開始，`JvmDefault` 註解的使用已被棄用，轉而使用較新的 `-Xjvm-default` 模式：`all` 和 `all-compatibility`。隨著 Kotlin 1.4 引入 `JvmDefaultWithoutCompatibility` 和 Kotlin 1.6 引入 `JvmDefaultWithCompatibility`，這些模式提供了對 `DefaultImpls` 類別產生的全面控制，確保與舊版 Kotlin 程式碼的無縫相容性。

因此在 Kotlin 1.9.0 中，`JvmDefault` 註解不再具有任何意義，並已被標記為棄用，這將導致錯誤。它最終將從 Kotlin 中移除。

## Kotlin/Native

除了其他改進之外，此版本還為 [Kotlin/Native 記憶體管理員](native-memory-manager.md)帶來了進一步的進展，這將增強其穩健性和效能：

* [自訂記憶體分配器預覽](#preview-of-custom-memory-allocator)
* [主執行緒上的 Objective-C 或 Swift 物件釋放鉤子](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
* [在 Kotlin/Native 中存取常數值時不進行物件初始化](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [能夠為 Kotlin/Native 中的 iOS 模擬器測試設定獨立模式](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
* [Kotlin/Native 中的程式庫連結](#library-linkage-in-kotlin-native)

### 自訂記憶體分配器預覽

Kotlin 1.9.0 引入了自訂記憶體分配器的預覽。其分配系統提高了 [Kotlin/Native 記憶體管理員](native-memory-manager.md)的執行時效能。

Kotlin/Native 當前的物件分配系統使用通用分配器，該分配器不具備高效垃圾回收的功能。為了補償，它在垃圾回收器 (GC) 將所有已分配物件合併到單個列表（可在掃描期間遍歷）之前，維護這些物件的執行緒局部鏈表。這種方法存在幾個效能缺點：

* 掃描順序缺乏記憶體局部性，通常導致分散的記憶體存取模式，從而引發潛在的效能問題。
* 鏈表需要為每個物件提供額外記憶體，增加了記憶體使用量，特別是在處理許多小物件時。
* 已分配物件的單一列表使得並行化掃描變得具有挑戰性，當 mutator 執行緒分配物件的速度快於 GC 執行緒回收它們的速度時，可能會導致記憶體使用問題。

為了縮短這些問題，Kotlin 1.9.0 引入了自訂分配器的預覽。它將系統記憶體劃分為頁面，允許按連續順序進行獨立掃描。每次分配都成為頁面內的一個記憶體區塊，頁面會追蹤區塊大小。不同的頁面類型針對各種分配大小進行了最佳化。記憶體區塊的連續排列確保了對所有已分配區塊的高效遍歷。

當執行緒分配記憶體時，它會根據分配大小搜尋合適的頁面。執行緒為不同的尺寸類別維護一組頁面。通常，給定尺寸的當前頁面可以容納分配。如果不行，執行緒會從共用分配空間請求不同的頁面。此頁面可能已經可用、需要掃描，或者應該先建立。

新的分配器允許同時擁有多個獨立的分配空間，這將允許 Kotlin 團隊嘗試不同的頁面佈局，以進一步提高效能。

有關新分配器設計的更多資訊，請參閱此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。

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

#### 留下回饋

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native) 中提供回饋，以改進自訂分配器。

### 主執行緒上的 Objective-C 或 Swift 物件釋放鉤子

從 Kotlin 1.9.0 開始，如果 Objective-C 或 Swift 物件是在主執行緒傳遞給 Kotlin 的，則會在主執行緒呼叫該物件的釋放鉤子（deallocation hook）。[Kotlin/Native 記憶體管理員](native-memory-manager.md)以前處理 Objective-C 物件參照的方式可能會導致記憶體洩漏。我們相信新的行為應該會提高記憶體管理員的穩健性。

考慮一個在 Kotlin 程式碼中被參照的 Objective-C 物件，例如，當作為引數傳遞、由函式傳回或從集合中擷取時。在這種情況下，Kotlin 會建立自己的物件來保存對 Objective-C 物件的參照。當 Kotlin 物件被釋放時，Kotlin/Native 執行時會呼叫 `objc_release` 函式來釋放該 Objective-C 參照。

以前，Kotlin/Native 記憶體管理員在特殊的 GC 執行緒上執行 `objc_release`。如果它是最後一個物件參照，該物件就會被釋放。當 Objective-C 物件具有自訂釋放鉤子（如 Objective-C 中的 `dealloc` 方法或 Swift 中的 `deinit` 區塊），且這些鉤子預期在特定執行緒上呼叫時，可能會出現問題。

由於主執行緒上物件的鉤子通常預期在那裡被呼叫，因此 Kotlin/Native 執行時現在也會在主執行緒上呼叫 `objc_release`。這應該涵蓋了 Objective-C 物件在主執行緒上傳遞給 Kotlin 的情況，並在那裡建立了一個 Kotlin 同儕物件。這僅在處理主分派隊列（main dispatch queue）時有效，這對於常規 UI 應用程式來說是常見情況。當不是主隊列或物件是在非主執行緒上傳遞給 Kotlin 時，`objc_release` 會像以前一樣在特殊的 GC 執行緒上呼叫。

#### 如何選擇退出

如果您遇到問題，可以在 `gradle.properties` 檔案中使用以下選項停用此行為：

```none
kotlin.native.binary.objcDisposeOnMain=false
```

如有此類情況，請隨時回報至[我們的問題追蹤器](https://kotl.in/issue)。

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
    println(MyObject.y) // 最初不會初始化
    val x = MyObject    // 發生初始化
    println(x.y)
}
```
{validate="false"}

此行為現在與 Kotlin/JVM 統一，在 Kotlin/JVM 中，實作與 Java 一致，且在這種情況下永遠不會初始化物件。得益於此變更，您也可以預期 Kotlin/Native 專案中的一些效能改進。

### 能夠為 Kotlin/Native 中的 iOS 模擬器測試設定獨立模式

預設情況下，當執行 Kotlin/Native 的 iOS 模擬器測試時，會使用 `--standalone` 旗標來避免手動啟動和關閉模擬器。在 1.9.0 中，您現在可以透過 `standalone` 屬性在 Gradle 任務中設定是否使用此旗標。預設情況下，使用 `--standalone` 旗標，因此啟用了獨立模式。

以下是如何在 `build.gradle.kts` 檔案中停用獨立模式的範例：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```
{validate="false"}

> 如果您停用獨立模式，則必須手動啟動模擬器。要從命令列啟動模擬器，您可以使用以下指令：
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
>```
>
{style="warning"}

### Kotlin/Native 中的程式庫連結

從 Kotlin 1.9.0 開始，Kotlin/Native 編譯器處理 Kotlin 程式庫中的連結問題的方式與 Kotlin/JVM 相同。如果一個第三方 Kotlin 程式庫的作者對另一個第三方 Kotlin 程式庫所使用的實驗性 API 進行了不相容的更改，您可能會遇到此類問題。

現在，如果第三方 Kotlin 程式庫之間出現連結問題，建置不會在編譯期間失敗。相反，您只會在執行時遇到這些錯誤，就像在 JVM 上一樣。

Kotlin/Native 編譯器每次偵測到程式庫連結問題時都會報告警告。您可以在編譯日誌中找到此類警告，例如：

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

您可以進一步設定甚至停用專案中的此行為：

* 如果您不想在編譯日誌中看到這些警告，請使用 `-Xpartial-linkage-loglevel=INFO` 編譯器選項將其隱藏。
* 也可以使用 `-Xpartial-linkage-loglevel=ERROR` 將報告的警告嚴重級別提升為編譯錯誤。在這種情況下，編譯會失敗，您將在編譯日誌中看到所有錯誤。使用此選項可以更仔細地檢查連結問題。
* 如果您遇到此功能的意外問題，隨時可以透過 `-Xpartial-linkage=disable` 編譯器選項選擇退出。如有此類情況，請隨時回報至[我們的問題追蹤器](https://kotl.in/issue)。

```kotlin
// 透過 Gradle 建置檔案傳遞編譯器選項的範例。
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 隱藏連結警告：
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

### C 互通性隱式整數轉換的編譯器選項

我們為 C 互通性引入了一個編譯器選項，允許您使用隱式整數轉換。經過仔細考慮，我們引入此編譯器選項是為了防止無意中使用，因為此功能仍有改進空間，我們的目標是提供最高品質的 API。

在此程式碼範例中，即使 [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options) 是無符號型別 `UInt` 且 `0` 是有符號的，隱式整數轉換也允許 `options = 0`。

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

要對原生互通性程式庫使用隱式轉換，請使用 `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion` 編譯器選項。

您可以在 Gradle `build.gradle.kts` 檔案中設定此項：
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```
{validate="false"}

## Kotlin 多平台

Kotlin 多平台在 1.9.0 中獲得了一些值得注意的更新，旨在改進您的開發人員體驗：

* [Android 目標支援的變更](#changes-to-android-target-support)
* [預設啟用的新 Android 原始碼集佈局](#new-android-source-set-layout-enabled-by-default)
* [多平台專案中 Gradle 組態快取的預覽](#preview-of-the-gradle-configuration-cache)

### Android 目標支援的變更

我們繼續努力穩定 Kotlin 多平台。一個關鍵步驟是為 Android 目標提供一流的支援。我們很高興地宣佈，未來 Google 的 Android 團隊將提供其專屬的 Gradle 外掛程式，以支援 Kotlin 多平台中的 Android。

為了給 Google 的這個新方案讓路，我們在 1.9.0 的當前 Kotlin DSL 中重新命名了 `android` 區塊。請將您建置腳本中所有出現的 `android` 區塊更改為 `androidTarget`。這是一個臨時性的更改，對於為 Google 即將推出的 DSL 騰出 `android` 名稱是必要的。

Google 外掛程式將成為在多平台專案中處理 Android 的首選方式。當它準備就緒時，我們將提供必要的遷移說明，以便您可以像以前一樣使用簡短的 `android` 名稱。

### 預設啟用的新 Android 原始碼集佈局

從 Kotlin 1.9.0 開始，新的 Android 原始碼集佈局已成為預設。它取代了以前的目錄命名方案，該方案在多方面都容易令人困惑。新佈局具有多項優點：

* 簡化的型別語意 – 新的 Android 原始碼佈局提供了清晰且一致的命名慣例，有助於區分不同類型的原始碼集。
* 改進的原始碼目錄佈局 – 使用新佈局，`SourceDirectories` 排列變得更加連貫，使得組織程式碼和尋找原始碼檔案更加容易。
* 明確的 Gradle 組態命名方案 – 現在 `KotlinSourceSets` 和 `AndroidSourceSets` 中的方案更加一致且可預測。

新佈局需要 Android Gradle Plugin 7.0 或更高版本，並在 Android Studio 2022.3 及更高版本中受支援。請參閱我們的[遷移指南](https://kotlinlang.org/docs/multiplatform/multiplatform-android-layout.html)以在您的 `build.gradle(.kts)` 檔案中進行必要的變更。

### Gradle 組態快取預覽

<p id="preview-of-gradle-configuration-cache">Kotlin 1.9.0 在多平台程式庫中支援 <a href="https://docs.gradle.org/current/userguide/configuration_cache.html">Gradle 組態快取</a>。如果您是程式庫作者，現在已經可以從改進的建置效能中受益。</p>

Gradle 組態快取透過為後續建置重用組態階段的結果來加速建置過程。此功能自 Gradle 8.1 起已穩定。要啟用它，請按照 [Gradle 文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)中的說明進行操作。

> Kotlin 多平台外掛程式目前仍然不支援 Xcode 整合任務或 [Kotlin CocoaPods Gradle 外掛程式](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html) 的 Gradle 組態快取。我們預計在未來的 Kotlin 版本中加入此功能。
>
{style="note"}

## Kotlin/Wasm

Kotlin 團隊繼續對新的 Kotlin/Wasm 目標進行實驗。此版本引入了多項效能和[尺寸相關的最佳化](#size-related-optimizations)，以及 [JavaScript 互通性的更新](#updates-in-javascript-interop)。

### 尺寸相關的最佳化

Kotlin 1.9.0 為 WebAssembly (Wasm) 專案引入了顯著的尺寸改進。比較兩個 "Hello World" 專案，Kotlin 1.9.0 中的 Wasm 程式碼佔用空間現在比 Kotlin 1.8.20 小了 10 倍以上。

![Kotlin/Wasm 尺寸相關最佳化](wasm-1-9-0-size-improvements.png){width=700}

這些尺寸最佳化使得在使用 Kotlin 程式碼針對 Wasm 平台時，資源利用更高效且效能更佳。

### JavaScript 互通性更新

本次 Kotlin 更新引入了 Kotlin/Wasm 專案中 Kotlin 與 JavaScript 互通性的變更。由於 Kotlin/Wasm 是一項[實驗性](components-stability.md#stability-levels-explained)功能，其互通性存在某些限制。

#### 限制 Dynamic 型別

從 1.9.0 版本開始，Kotlin 不再支援在 Kotlin/Wasm 中使用 `Dynamic` 型別。這已被棄用，轉而使用新的通用 `JsAny` 型別，這有利於 JavaScript 互通性。

有關更多詳細資訊，請參閱 [Kotlin/Wasm 與 JavaScript 的互通性](wasm-js-interop.md)文件。

#### 限制非外部型別

在與 JavaScript 相互傳遞值時，Kotlin/Wasm 支援特定 Kotlin 靜態型別的轉換。這些受支援的型別包括：

* 基本型別，如有符號數字、`Boolean` 和 `Char`。
* `String`。
* 函式型別。

其他型別在沒有轉換的情況下作為不透明參照（opaque reference）傳遞，這導致了 JavaScript 和 Kotlin 子型別化之間的不一致。

為了解決這個問題，Kotlin 將 JavaScript 互通限制在了一組受支援良好的型別中。從 Kotlin 1.9.0 開始，Kotlin/Wasm JavaScript 互通中僅支援外部、基本型別、字串和函式型別。此外，還引入了一個名為 `JsReference` 的獨立明確型別，用於表示可在 JavaScript 互通中使用的 Kotlin/Wasm 物件控制代碼（handle）。

有關更多詳細資訊，請參閱 [Kotlin/Wasm 與 JavaScript 的互通性](wasm-js-interop.md)文件。

### Kotlin Playground 中的 Kotlin/Wasm

Kotlin Playground 支援 Kotlin/Wasm 目標。
您可以編寫、執行和分享針對 Kotlin/Wasm 的 Kotlin 程式碼。[快來看看吧！](https://pl.kotl.in/HDFAvimga)

> 使用 Kotlin/Wasm 需要在瀏覽器中啟用實驗性功能。
>
> [進一步了解如何啟用這些功能](wasm-configuration.md)。
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

此版本引入了 Kotlin/JS 的更新，包括移除了舊的 Kotlin/JS 編譯器、Kotlin/JS Gradle 外掛程式棄用，以及對 ES2015 的實驗性支援：

* [移除舊的 Kotlin/JS 編譯器](#removal-of-the-old-kotlin-js-compiler)
* [棄用 Kotlin/JS Gradle 外掛程式](#deprecation-of-the-kotlin-js-gradle-plugin)
* [棄用 external enum](#deprecation-of-external-enum)
* [對 ES2015 類別和模組的實驗性支援](#experimental-support-for-es2015-classes-and-modules)
* [更改了 JS 生產發佈內容的預設目的地](#changed-default-destination-of-js-production-distribution)
* [從 stdlib-js 中擷取 org.w3c 宣告](#extract-org-w3c-declarations-from-stdlib-js)

> 從 1.9.0 版本開始，[部分程式庫連結](#library-linkage-in-kotlin-native)也對 Kotlin/JS 啟用。
>
{style="note"}

### 移除舊的 Kotlin/JS 編譯器

在 Kotlin 1.8.0 中，我們[宣佈](whatsnew18.md#stable-js-ir-compiler-backend)基於 IR 的後端已穩定。從那時起，不指定編譯器已成為錯誤，而使用舊編譯器會導致警告。

在 Kotlin 1.9.0 中，使用舊後端會導致錯誤。請遷移到 IR 編譯器。

### 棄用 Kotlin/JS Gradle 外掛程式

從 Kotlin 1.9.0 開始，`kotlin-js` Gradle 外掛程式已被棄用。我們鼓勵您改用具有 `js()` 目標的 `kotlin-multiplatform` Gradle 外掛程式。

Kotlin/JS Gradle 外掛程式的功能本質上與 `kotlin-multiplatform` 外掛程式重複，並且在底層共用相同的實作。這種重疊造成了混淆並增加了 Kotlin 團隊的維護負擔。

有關遷移說明，請參閱我們的 [Kotlin 多平台相容性指南](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin)。如果您發現指南中未涵蓋的任何問題，請回報至我們的[問題追蹤器](http://kotl.in/issue)。

### 棄用 external enum

在 Kotlin 1.9.0 中，由於靜態 enum 成員（如 `entries`）無法存在於 Kotlin 之外的問題，將棄用 external enum。我們建議改用具有物件子類別的外部密封類別（external sealed class）：

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

透過切換到具有物件子類別的外部密封類別，您可以實現與 external enum 類似的功能，同時避免與預設方法相關的問題。

從 Kotlin 1.9.0 開始，使用 external enum 將被標記為棄用。我們鼓勵您更新程式碼以使用建議的外部密封類別實作，以確保相容性和未來維護。

### 對 ES2015 類別和模組的實驗性支援

此版本引入了對 ES2015 模組和產生 ES2015 類別的[實驗性](components-stability.md#stability-levels-explained)支援：
* 模組提供了一種簡化程式碼庫並提高可維護性的方法。
* 類別允許您納入物件導向程式設計 (OOP) 原則，從而產生更簡潔直觀的程式碼。

要啟用這些功能，請相應地更新您的 `build.gradle.kts` 檔案：

```kotlin
// build.gradle.kts
kotlin {
    js(IR) {
        useEsModules() // 啟用 ES2015 模組
        browser()
    }
}

// 啟用 ES2015 類別產生
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        useEsClasses = true
    }
}
```
{validate="false"}

[在官方文件中進一步了解 ES2015 (ECMAScript 2015, ES6)](https://262.ecma-international.org/6.0/)。

### 更改了 JS 生產發佈內容的預設目的地

在 Kotlin 1.9.0 之前，發佈目標目錄為 `build/distributions`。然而，這是 Gradle 封存檔案的通用目錄。為了解決這個問題，我們在 Kotlin 1.9.0 中將預設發佈目標目錄更改為：`build/dist/<targetName>/<binaryName>`。

例如，以前 `productionExecutable` 在 `build/distributions`。在 Kotlin 1.9.0 中，它位於 `build/dist/js/productionExecutable`。

> 如果您有現有的管線使用這些建置結果，請務必更新目錄路徑。
>
{style="warning"}

### 從 stdlib-js 中擷取 org.w3c 宣告

自 Kotlin 1.9.0 起，`stdlib-js` 不再包含 `org.w3c` 宣告。相反，這些宣告已被移至一個單獨的 Gradle 相依性。當您將 Kotlin 多平台 Gradle 外掛程式加入 `build.gradle.kts` 檔案時，這些宣告將自動包含在您的專案中，類似於標準函式庫。

不需要任何手動操作或遷移。必要的調整將自動處理。

## Gradle

Kotlin 1.9.0 帶來了新的 Gradle 編譯器選項以及更多內容：

* [移除了 classpath 屬性](#removed-classpath-property)
* [新的 Gradle 編譯器選項](#new-compiler-options)
* [Kotlin/JVM 的專案級編譯器選項](#project-level-compiler-options-for-kotlin-jvm)
* [Kotlin/Native 模組名稱的編譯器選項](#compiler-option-for-kotlin-native-module-name)
* [官方 Kotlin 程式庫的獨立編譯器外掛程式](#separate-compiler-plugins-for-official-kotlin-libraries)
* [提升了最低支援版本](#incremented-minimum-supported-version)
* [kapt 不會導致任務提前建立](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
* [JVM 目標驗證模式的程式化組態](#programmatic-configuration-of-the-jvm-target-validation-mode)

### 移除了 classpath 屬性

在 Kotlin 1.7.0 中，我們宣佈開始 `KotlinCompile` 任務屬性 `classpath` 的棄用週期。在 Kotlin 1.8.0 中，棄用級別已提升為 `ERROR`。在此版本中，我們終於移除了 `classpath` 屬性。現在所有編譯任務都應使用 `libraries` 輸入來獲取編譯所需的程式庫清單。

### 新的編譯器選項

Kotlin Gradle 外掛程式現在為選擇加入 (opt-in) 和編譯器的漸進模式 (progressive mode) 提供了新屬性。

* 要選擇加入新 API，現在可以使用 `optIn` 屬性並傳遞字串列表，例如：`optIn.set(listOf(a, b, c))`。
* 要啟用漸進模式，請使用 `progressiveMode.set(true)`。

### Kotlin/JVM 的專案級編譯器選項

從 Kotlin 1.9.0 開始，在 `kotlin` 設定區塊中提供了一個新的 `compilerOptions` 區塊：

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```
{validate="false"}

這使得設定編譯器選項變得更加容易。但是，請注意一些重要細節：

* 此組態僅在專案層級有效。
* 對於 Android 外掛程式，此區塊設定的物件與以下內容相同：

```kotlin
android {
    kotlinOptions {}
}
```
{validate="false"}

* `android.kotlinOptions` 和 `kotlin.compilerOptions` 設定區塊會互相覆寫。建置檔案中最後一個（最下方）區塊始終生效。
* 如果在專案層級設定了 `moduleName`，其值在傳遞給編譯器時可能會發生變化。這不適用於 `main` 編譯，但對於其他類型（例如測試原始碼），Kotlin Gradle 外掛程式會加入 `_test` 後綴。
* `tasks.withType<KotlinJvmCompile>().configureEach {}`（或 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`）內部的組態會覆寫 `kotlin.compilerOptions` 和 `android.kotlinOptions`。

### Kotlin/Native 模組名稱的編譯器選項

Kotlin/Native [`module-name`](compiler-reference.md#module-name-name-native) 編譯器選項現在可以在 Kotlin Gradle 外掛程式中輕鬆使用。

此選項指定編譯模組的名稱，也可用於為匯出到 Objective-C 的宣告加入名稱前綴。

現在您可以在 Gradle 建置檔案的 `compilerOptions` 區塊中直接設定模組名稱：

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

### 官方 Kotlin 程式庫的獨立編譯器外掛程式

Kotlin 1.9.0 為其官方程式庫引入了獨立的編譯器外掛程式。以前，編譯器外掛程式被內嵌在相應的 Gradle 外掛程式中。如果編譯器外掛程式是針對比 Gradle 建置的 Kotlin 執行時版本更高的 Kotlin 版本編譯的，這可能會導致相容性問題。

現在編譯器外掛程式作為獨立相依性加入，因此您將不再面臨與舊版本 Gradle 的相容性問題。新方法的另一個主要優點是新的編譯器外掛程式可以與 [Bazel](https://bazel.build/) 等其他建置系統一起使用。

以下是我們現在發佈到 Maven Central 的新編譯器外掛程式列表：

* kotlin-atomicfu-compiler-plugin
* kotlin-allopen-compiler-plugin
* kotlin-lombok-compiler-plugin
* kotlin-noarg-compiler-plugin
* kotlin-sam-with-receiver-compiler-plugin
* kotlinx-serialization-compiler-plugin

每個外掛程式都有其 `-embeddable` 對應版本，例如，`kotlin-allopen-compiler-plugin-embeddable` 旨在與 `kotlin-compiler-embeddable` 構件（指令碼構件的預設選項）配合使用。

Gradle 會將這些外掛程式作為編譯器引數加入。您不需要對現有專案進行任何更改。

### 提升了最低支援版本

從 Kotlin 1.9.0 開始，最低支援的 Android Gradle plugin 版本為 4.2.2。

請參閱我們文件中的 [Kotlin Gradle 外掛程式與可用 Gradle 版本的相容性](gradle-configure-project.md#apply-the-plugin)。

### kapt 不會導致 Gradle 任務提前建立

在 1.9.0 之前，[kapt 編譯器外掛程式](kapt.md)透過請求已設定的 Kotlin 編譯任務實例來導致任務提前建立（eager task creation）。此行為已在 Kotlin 1.9.0 中修正。如果您為 `build.gradle.kts` 檔案使用預設組態，則您的設定不受此更改影響。

> 如果您使用自訂組態，您的設定將受到不利影響。
> 例如，如果您使用 Gradle 的 tasks API 修改了 `KotlinJvmCompile` 任務，則必須在建置腳本中同樣修改 `KaptGenerateStubs` 任務。
>
> 例如，如果您的腳本對 `KotlinJvmCompile` 任務有以下設定：
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // 您的自訂組態 }
> ```
> {validate="false"}
>
> 在這種情況下，您需要確保同樣的修改也包含在 `KaptGenerateStubs` 任務中：
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // 您的自訂組態 }
>```
> {validate="false"}
> 
{style="warning"}

有關更多資訊，請參閱我們的 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation)。

### JVM 目標驗證模式的程式化組態

在 Kotlin 1.9.0 之前，只有一種方法可以調整偵測 Kotlin 與 Java 之間的 JVM 目標不相容性。您必須在整個專案的 `gradle.properties` 中設定 `kotlin.jvm.target.validation.mode=ERROR`。

現在您也可以在 `build.gradle.kts` 檔案的任務層級進行設定：

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```
{validate="false"}

## 標準函式庫

Kotlin 1.9.0 為標準函式庫帶來了一些重大的改進：
* [`..<` 運算子](#stable-operator-for-open-ended-ranges) 和 [Time API](#stable-time-api) 已穩定。
* [Kotlin/Native 標準函式庫已徹底審查並更新](#the-kotlin-native-standard-library-s-journey-towards-stabilization)
* [`@Volatile` 註解可在更多平台使用](#stable-volatile-annotation)
* [現在有一個 **通用** 函式可依名稱獲取正則表示式捕獲群組](#new-common-function-to-get-regex-capture-group-by-name)
* [引入了 `HexFormat` 類別來格式化和解析十六進位值](#new-hexformat-class-to-format-and-parse-hexadecimals)

### 用於開放式範圍的穩定 ..< 運算子

在 [Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges) 中引入並在 1.8.0 中穩定的用於開放式範圍（open-ended ranges）的新 `..<` 運算子，其標準函式庫中處理開放式範圍的 API 在 1.9.0 中也已穩定。

我們的研究顯示，新的 `..<` 運算子更容易讓人理解何時宣告了開放式範圍。如果您使用 [`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html) 中綴函式，很容易誤以為包含了上限。

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

> 從 IntelliJ IDEA 2023.1.1 版本開始，提供了一項新的程式碼檢查，會醒目提示何時可以使用 `..<` 運算子。
>
{style="note"}

有關使用此運算子可以做什麼的更多資訊，請參閱 [Kotlin 1.7.20 的新功能](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)。

### 穩定 Time API

自 1.3.50 起，我們預覽了新的時間測量 API。該 API 的持續時間（duration）部分在 1.6.0 中已穩定。在 1.9.0 中，剩餘的時間測量 API 已穩定。

舊的 Time API 提供了 `measureTimeMillis` 和 `measureNanoTime` 函式，它們使用起來並不直觀。雖然很明顯它們都以不同的單位測量時間，但不清楚 `measureTimeMillis` 使用的是[掛鐘時間](https://en.wikipedia.org/wiki/Elapsed_real_time)（wall clock），而 `measureNanoTime` 使用的是單調時間源（monotonic time source）。新的 Time API 解決了這些問題，使 API 更加易於使用。

透過新的 Time API，您可以輕鬆地：
* 使用具有所需時間單位的單調時間源來測量執行某些程式碼所需的時間。
* 標記一個時間點。
* 比較並找出兩個時間點之間的差異。
* 檢查自特定時間點以來經過了多少時間。
* 檢查當前時間是否已超過特定時間點。

#### 測量程式碼執行時間

要測量執行一段程式碼所需的時間，請使用 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 內嵌函式。

要測量執行一段程式碼所需的時間 **並** 傳回該程式碼區塊的結果，請使用 [`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 內嵌函式。

預設情況下，這兩個函式都使用單調時間源。但是，如果您想使用經過的實時源（elapsed real-time source），也可以。例如，在 Android 上，預設時間源 `System.nanoTime()` 僅在設備處於活動狀態時計時。當設備進入深度睡眠時，它會失去對時間的追蹤。要在設備處於深度睡眠時追蹤時間，您可以建立一個使用 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos()) 的時間源：

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```
{validate="false"}

#### 標記並測量時間差異

要標記特定時間點，請使用 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/) 介面和 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 函式來建立 [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)。要測量來自同一時間源的 `TimeMark` 之間的差異，請使用減法運算子 (`-`)：

```kotlin
import kotlin.time.*

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 睡眠 0.5 秒。
    val mark2 = timeSource.markNow()

    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // 也可以互相比較時間標記。
    println(mark2 > mark1) // 這是 true，因為 mark2 捕捉的時間晚於 mark1。
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-elapsed"}

要檢查截止日期是否已過或是否已達到超時，請使用 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html) 和 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 擴充函式：

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    val fiveSeconds: Duration = 5.seconds
    val mark2 = mark1 + fiveSeconds

    // 還不到 5 秒
    println(mark2.hasPassedNow())
    // false

    // 等待六秒
    Thread.sleep(6000)
    println(mark2.hasPassedNow())
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-passednow"}

### Kotlin/Native 標準函式庫的穩定之路

隨著我們 Kotlin/Native 標準函式庫的不斷成長，我們認為現在是進行全面審查以確保其符合我們高標準的時候了。作為其中的一部分，我們仔細審查了 **每一個** 現有的公開簽章。對於每個簽章，我們考慮它是否：

* 具有獨特的目的。
* 與其他 Kotlin API 一致。
* 具有與 JVM 對應項類似的行為。
* 面向未來。

基於這些考慮，我們做出了以下決定之一：
* 使其穩定。
* 使其成為實驗性。
* 將其標記為 `private`。
* 修改其行為。
* 將其移至不同位置。
* 棄用它。
* 將其標記為過時（obsolete）。

> 如果現有簽章已被：
> * 移至另一個套件，則該簽章在原始套件中仍然存在，但現在已被棄用，棄用級別為：`WARNING`。IntelliJ IDEA 會在程式碼檢查時自動建議替換方案。
> * 棄用，則已被標記為棄用，棄用級別為：`WARNING`。
> * 標記為過時，則您可以繼續使用它，但將在未來被替換。
>
{style="note"}

我們不會在此列出審查的所有結果，但以下是一些亮點：
* 我們穩定了 Atomics API。
* 我們將 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) 設為實驗性，現在需要不同的選擇加入才能使用該套件。如需更多資訊，請參閱[明確的 C 互通性穩定保證](#explicit-c-interoperability-stability-guarantees)。
* 我們將 [`Worker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker/) 類別及其相關 API 標記為過時。
* 我們將 [`BitSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-bit-set/) 類別標記為過時。
* 我們將 `kotlin.native.internal` 套件中的所有 `public` API 標記為 `private` 或將其移至其他套件。

#### 明確的 C 互通性穩定保證

為了保持 API 的高品質，我們決定將 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) 設為實驗性。雖然 `kotlinx.cinterop` 已經過徹底的測試和驗證，但在我們滿意到足以使其穩定之前，仍有改進空間。我們建議您使用此 API 進行互通，但盡量將其使用限制在專案中的特定區域。這將使您在我們開始演進此 API 以使其穩定時，更容易進行遷移。

如果您想使用 C 風格的外部 API（如指標），則必須使用 `@OptIn(ExperimentalForeignApi)` 選擇加入，否則您的程式碼將無法編譯。

要使用 `kotlinx.cinterop` 的其餘部分（涵蓋 Objective-C/Swift 互通性），您必須使用 `@OptIn(BetaInteropApi)` 選擇加入。如果您在沒有選擇加入的情況下嘗試使用此 API，您的程式碼將可以編譯，但編譯器會發出警告，並提供您可以預期之行為的明確說明。

有關這些註解的更多資訊，請參閱我們的 [`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt) 原始碼。

有關作為本次審查一部分的 **所有** 變更的更多資訊，請參閱我們的 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-55765)。

我們非常感謝您的任何回饋！您可以直接在該[票證](https://youtrack.jetbrains.com/issue/KT-57728)下留言提供您的回饋。

### 穩定 @Volatile 註解

如果您使用 `@Volatile` 註解一個 `var` 屬性，則支援欄位會被標記，以便對此欄位的任何讀取或寫入都是原子的，且寫入始終對其他執行緒可見。

在 1.8.20 之前，[`kotlin.jvm.Volatile` 註解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/) 在通用標準函式庫中可用。然而，此註解僅在 JVM 上有效。如果您在其他平台上使用它，它會被忽略，從而導致錯誤。

在 1.8.20 中，我們引入了一個實驗性的通用註解 `kotlin.concurrent.Volatile`，您可以在 JVM 和 Kotlin/Native 中預覽。

在 1.9.0 中，`kotlin.concurrent.Volatile` 已穩定。如果您在多平台專案中使用 `kotlin.jvm.Volatile`，我們建議您遷移到 `kotlin.concurrent.Volatile`。

### 新的通用函式，可依名稱獲取正則表示式捕獲群組

在 1.9.0 之前，每個平台都有其自己的擴充，用於從正則表示式比對中依其名稱獲取捕獲群組。然而，並沒有通用的函式。在 Kotlin 1.8.0 之前不可能有通用函式，因為標準函式庫仍然支援 JVM 目標 1.6 和 1.7。

自 Kotlin 1.8.0 起，標準函式庫使用 JVM 目標 1.8 編譯。因此在 1.9.0 中，現在有一個 **通用** 的 [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html) 函式，您可以使用它依其名稱為正則表示式比對檢索群組內容。這在您想要存取屬於特定捕獲群組的正則表示式比對結果時非常有用。

以下是一個正則表示式包含三個捕獲群組的範例：`city`、`state` 和 `areaCode`。您可以使用這些群組名稱來存取相符的值：

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

### 新的路徑工具，用於建立父目錄

在 1.9.0 中有一個新的 `createParentDirectories()` 擴充函式，您可以使用它建立一個包含所有必要父目錄的新檔案。當您將檔案路徑提供給 `createParentDirectories()` 時，它會檢查父目錄是否已存在。如果已存在，則不執行任何操作。但是，如果不存在，它會為您建立它們。

`createParentDirectories()` 在複製檔案時特別有用。例如，您可以將其與 `copyToRecursively()` 函式結合使用：

 ```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
 ```
{validate="false"}

### 新的 HexFormat 類別來格式化和解析十六進位值

> 新的 `HexFormat` 類別及其相關擴充函式是 [實驗性](components-stability.md#stability-levels-explained) 功能，要使用它們，您可以選擇加入 `@OptIn(ExperimentalStdlibApi::class)` 或編譯器引數 `-opt-in=kotlin.ExperimentalStdlibApi`。
>
{style="warning"}

在 1.9.0 中，[`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 類別及其相關擴充函式作為實驗性功能提供，允許您在數值和十六進位字串之間進行轉換。具體來說，您可以使用擴充函式在十六進位字串與 `ByteArrays` 或其他數值型別（`Int`, `Short`, `Long`）之間進行轉換。

例如：

```kotlin
println(93.toHexString()) // "0000005d"
```
{validate="false"}

`HexFormat` 類別包含可以使用 `HexFormat{}` 建構器設定的格式化選項。

如果您處理的是 `ByteArrays`，您有以下選項，可透過屬性進行設定：

| 選項 | 描述 |
|--|--|
| `upperCase` | 十六進位數字是大寫還是小寫。預設情況下，假定為小寫。`upperCase = false`。 |
| `bytes.bytesPerLine` | 每行最大位元組數。 |
| `bytes.bytesPerGroup` | 每組最大位元組數。 |
| `bytes.bytesSeparator` | 位元組之間的分隔符號。預設為空。 |
| `bytes.bytesPrefix` | 緊接在每個位元組的兩位十六進位表示之前的字串，預設為空。 |
| `bytes.bytesSuffix` | 緊接在每個位元組的兩位十六進位表示之後的字串，預設為空。 |

例如：

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// 使用 HexFormat{} 建構器以冒號分隔十六進位字串
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// "00:1b:63:84:45:e6"

// 使用 HexFormat{} 建構器以：
// * 使十六進位字串大寫
// * 將位元組成對分組
// * 以句點分隔
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// "001B.6384.45E6"
```
{validate="false"}

如果您處理的是數值型別，您有以下選項，可透過屬性進行設定：

| 選項 | 描述 |
|--|--|
| `number.prefix` | 十六進位字串的前綴，預設為空。 |
| `number.suffix` | 十六進位字串的後綴，預設為空。 |
| `number.removeLeadingZeros` | 是否移除十六進位字串中的前導零。預設不移除。`number.removeLeadingZeros = false` |

例如：

```kotlin
// 使用 HexFormat{} 建構器來解析具有前綴 "0x" 的十六進位值。
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // "58"
```
{validate="false"}

## 文件更新

Kotlin 文件已進行了一些值得注意的更改：
* [Kotlin 之旅](kotlin-tour-welcome.md) – 透過包含理論和實作的章節學習 Kotlin 程式語言的基礎知識。
* [Android 原始碼集佈局](https://kotlinlang.org/docs/multiplatform/multiplatform-android-layout.html) – 了解新的 Android 原始碼集佈局。
* [Kotlin 多平台相容性指南](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html) – 了解您在開發 Kotlin 多平台專案時可能遇到的不相容更改。
* [Kotlin Wasm](wasm-overview.md) – 了解 Kotlin/Wasm 以及如何在您的 Kotlin 多平台專案中使用它。

## 安裝 Kotlin 1.9.0

### 檢查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3 和 2023.1.1 會自動建議將 Kotlin 外掛程式更新為 1.9.0 版本。IntelliJ IDEA 2023.2 將包含 Kotlin 1.9.0 外掛程式。

Android Studio Giraffe (223) 和 Hedgehog (231) 將在即將發佈的版本中支援 Kotlin 1.9.0。

新的命令列編譯器可在 [GitHub 發佈頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0)上下載。

### 設定 Gradle 設定

要下載 Kotlin 構件和相依性，請更新您的 `settings.gradle(.kts)` 檔案以使用 Maven Central 儲存庫：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

如果未指定儲存庫，Gradle 會使用已淘汰的 JCenter 儲存庫，這可能會導致 Kotlin 構件出現問題。

## Kotlin 1.9.0 相容性指南

Kotlin 1.9.0 是一個[特性發佈版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能會帶來與您為該語言早期版本編寫的程式碼不相容的更改。在 [Kotlin 1.9.0 相容性指南](compatibility-guide-19.md)中尋找這些更改的詳細清單。