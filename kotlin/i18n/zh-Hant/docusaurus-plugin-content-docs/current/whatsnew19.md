---
title: "Kotlin 1.9.0 的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[發布日期：2023 年 7 月 6 日](releases#release-details)_

Kotlin 1.9.0 版本已發布，並且 JVM 的 K2 編譯器現在為 **Beta** 版。此外，以下是一些主要亮點：

* [新的 Kotlin K2 編譯器更新](#new-kotlin-k2-compiler-updates)
* [穩定替換 enum class 的 values 函式](#stable-replacement-of-the-enum-class-values-function)
* [適用於開放範圍的穩定 `..<` 運算符](#stable-operator-for-open-ended-ranges)
* [新的通用函式，可依名稱取得 regex 擷取群組](#new-common-function-to-get-regex-capture-group-by-name)
* [用於建立父目錄的新路徑實用程式](#new-path-utility-to-create-parent-directories)
* [Kotlin Multiplatform 中 Gradle 設定快取的預覽](#preview-of-the-gradle-configuration-cache)
* [Kotlin Multiplatform 中 Android 目標支援的變更](#changes-to-android-target-support)
* [Kotlin/Native 中自訂記憶體分配器的預覽](#preview-of-custom-memory-allocator)
* [Kotlin/Native 中的程式庫連結](#library-linkage-in-kotlin-native)
* [Kotlin/Wasm 中與大小相關的優化](#size-related-optimizations)

您也可以在這段影片中找到更新的簡短概述：

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="What's new in Kotlin 1.9.0"/>

## IDE 支援

支援 1.9.0 的 Kotlin 外掛程式可用於：

| IDE | 支援的版本 |
|--|--|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 外掛程式將包含在 Android Studio Giraffe (223) 和 Hedgehog (231) 即將發布的版本中。

Kotlin 1.9.0 外掛程式將包含在 IntelliJ IDEA 2023.2 即將發布的版本中。

:::note
若要下載 Kotlin 成品和依賴項，請[設定您的 Gradle 設定](#configure-gradle-settings)以使用 Maven Central Repository。

## 新的 Kotlin K2 編譯器更新

JetBrains 的 Kotlin 團隊持續穩定 K2 編譯器，而 1.9.0 版本引入了更多改進。
JVM 的 K2 編譯器現在為 **Beta** 版。

現在也基本支援 Kotlin/Native 和多平台專案。

### kapt 編譯器外掛程式與 K2 編譯器的相容性

您可以在專案中搭配 K2 編譯器使用 [kapt 外掛程式](kapt)，但有一些限制。
儘管將 `languageVersion` 設定為 `2.0`，kapt 編譯器外掛程式仍然使用舊的編譯器。

如果您在 `languageVersion` 設定為 `2.0` 的專案中執行 kapt 編譯器外掛程式，kapt 會自動切換到 `1.9` 並停用特定的版本相容性檢查。
此行為相當於包含以下命令參數：
* `-Xskip-metadata-version-check`
* `-Xskip-prerelease-check`
* `-Xallow-unstable-dependencies`

這些檢查僅針對 kapt 任務停用。
所有其他編譯任務將繼續使用新的 K2 編譯器。

如果您在使用 kapt 與 K2 編譯器時遇到任何問題，請向我們的 [issue tracker](http://kotl.in/issue) 回報。

### 在您的專案中試用 K2 編譯器

從 1.9.0 開始，直到 Kotlin 2.0 發布為止，您可以輕鬆地透過將 `kotlin.experimental.tryK2=true`
Gradle 屬性新增至您的 `gradle.properties` 檔案來測試 K2 編譯器。您也可以執行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

此 Gradle 屬性會自動將語言版本設定為 2.0，並使用使用 K2 編譯器編譯的 Kotlin 任務數量與目前編譯器相比更新組建報告：

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradle 組建報告

[Gradle 組建報告](gradle-compilation-and-caches#build-reports) 現在會顯示目前或 K2 編譯器
是否用於編譯程式碼。在 Kotlin 1.9.0 中，您可以在 [Gradle 組建掃描](https://scans.gradle.com/)中看到此資訊：

<img src="/img/gradle-build-scan-k1.png" alt="Gradle build scan - K1" width="700" style={{verticalAlign: 'middle'}}/>

<img src="/img/gradle-build-scan-k2.png" alt="Gradle build scan - K2" width="700" style={{verticalAlign: 'middle'}}/>

您也可以在組建報告中找到專案中使用的 Kotlin 版本：

```none
Task info:
  Kotlin language version: 1.9
```

如果您使用 Gradle 8.0，您可能會遇到一些組建報告問題，尤其是在啟用 Gradle 設定
快取時。這是一個已知的問題，已在 Gradle 8.1 及更高版本中修正。

:::

### 目前 K2 編譯器的限制

在您的 Gradle 專案中啟用 K2 會有一些限制，這些限制可能會影響在以下情況下使用低於 8.3 的 Gradle 版本的專案：

* 從 `buildSrc` 編譯原始碼。
* 在包含的組建中編譯 Gradle 外掛程式。
* 如果其他 Gradle 外掛程式在 Gradle 版本低於 8.3 的專案中使用，則編譯這些外掛程式。
* 建置 Gradle 外掛程式依賴項。

如果您遇到上述任何問題，您可以採取以下步驟來解決：

* 設定 `buildSrc`、任何 Gradle 外掛程式及其依賴項的語言版本：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

* 將您專案中的 Gradle 版本更新到 8.3（如果有的話）。

### 提供您對新 K2 編譯器的意見反應

我們將感謝您提供的任何意見反應！

* 直接向 K2 開發人員 Kotlin 的 Slack 提供您的意見反應 – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
  並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
* 在 [our issue tracker](https://kotl.in/issue) 上回報您在使用新 K2 編譯器時遇到的任何問題。
* [啟用 **傳送使用統計資料** 選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以
  允許 JetBrains 收集關於 K2 使用情況的匿名資料。

## 語言

在 Kotlin 1.9.0 中，我們正在穩定一些先前引入的新的語言功能：
* [替換 enum class 的 values 函式](#stable-replacement-of-the-enum-class-values-function)
* [資料物件與資料類別的對稱性](#stable-data-objects-for-symmetry-with-data-classes)
* [支援內嵌數值類別中具有主體的輔助建構函式](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### 穩定替換 enum class 的 values 函式

在 1.8.20 中，引入了 enum 類別的 `entries` 屬性作為實驗性功能。`entries` 屬性是
合成 `values()` 函式的現代且高效能的替代方案。在 1.9.0 中，`entries` 屬性是穩定的。

:::note
`values()` 函式仍然支援，但我們建議您改用 `entries`
屬性。

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```

如需關於 enum 類別的 `entries` 屬性的詳細資訊，請參閱 [Kotlin 1.8.20 的新功能](whatsnew1820#a-modern-and-performant-replacement-of-the-enum-class-values-function)。

### 資料物件與資料類別的對稱性

資料物件宣告已在 [Kotlin 1.8.20](whatsnew1820#preview-of-data-objects-for-symmetry-with-data-classes) 中引入，
現在是穩定的。這包括為了與資料類別對稱而新增的函式：`toString()`、`equals()` 和 `hashCode()`。

此功能在 `sealed` 階層（例如 `sealed class` 或 `sealed interface` 階層）中特別有用，
因為 `data object` 宣告可以與 `data class` 宣告一起方便地使用。在此範例中，宣告
`EndOfFile` 作為 `data object` 而不是普通的 `object` 意味著它會自動具有 `toString()` 函式，而無需
手動覆寫它。這維持了與隨附資料類別定義的對稱性。

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

如需詳細資訊，請參閱 [Kotlin 1.8.20 的新功能](whatsnew1820#preview-of-data-objects-for-symmetry-with-data-classes)。

### 支援內嵌數值類別中具有主體的輔助建構函式

從 Kotlin 1.9.0 開始，預設情況下可以使用 [內嵌數值類別](inline-classes)中具有主體的輔助建構函式：

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

先前，Kotlin 僅允許在內嵌類別中使用公開的主要建構函式。因此，無法
封裝底層數值或建立表示一些受限數值的內嵌類別。

隨著 Kotlin 的開發，這些問題已得到解決。Kotlin 1.4.30 取消了對 `init` 區塊的限制，然後 Kotlin 1.8.20
附帶了具有主體的輔助建構函式的預覽。它們現在預設可用。如需關於
Kotlin 內嵌類別開發的詳細資訊，請參閱 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes)。

## Kotlin/JVM

從 1.9.0 版本開始，編譯器可以產生具有對應於 JVM 20 的位元組碼版本的類別。此外，
`JvmDefault` 註解和舊版 `-Xjvm-default` 模式的棄用正在持續。

### 棄用 JvmDefault 註解和舊版 -Xjvm-default 模式

從 Kotlin 1.5 開始，已棄用使用 `JvmDefault` 註解，而改用較新的 `-Xjvm-default`
模式：`all` 和 `all-compatibility`。隨著 Kotlin 1.4 中引入的 `JvmDefaultWithoutCompatibility` 和
Kotlin 1.6 中引入的 `JvmDefaultWithCompatibility`，這些模式提供了對 `DefaultImpls` 產生的全面控制
類別，確保與舊版 Kotlin 程式碼的無縫相容性。

因此，在 Kotlin 1.9.0 中，`JvmDefault` 註解不再具有任何意義，並且已標記為
已棄用，從而導致錯誤。它最終將從 Kotlin 中移除。

## Kotlin/Native

除了其他改進之外，此版本還為 [Kotlin/Native 記憶體管理器](native-memory-manager)帶來了進一步的改進，
這應可增強其穩健性和效能：

* [自訂記憶體分配器的預覽](#preview-of-custom-memory-allocator)
* [主要執行緒上的 Objective-C 或 Swift 物件取消分配掛鉤](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
* [在 Kotlin/Native 中存取常數數值時，不進行物件初始化](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [能夠為 iOS 模擬器測試設定獨立模式](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
* [Kotlin/Native 中的程式庫連結](#library-linkage-in-kotlin-native)

### 自訂記憶體分配器的預覽

Kotlin 1.9.0 引入了自訂記憶體分配器的預覽。其分配系統改善了
[Kotlin/Native 記憶體管理器](native-memory-manager)的執行階段效能。

Kotlin/Native 中目前的物件分配系統使用通用分配器，該分配器不具有
有效垃圾收集的功能。為了彌補這一點，它會在垃圾收集器 (GC) 將所有已分配的物件合併到單一清單之前，維護所有已分配物件的執行緒本機連結清單，然後可以在掃描期間反覆運算該清單。此方法會帶來一些效能缺點：

* 掃描順序缺少記憶體局部性，並且通常會導致分散的記憶體存取模式，從而導致潛在的效能問題。
* 連結清單需要每個物件的額外記憶體，從而增加記憶體使用量，尤其是在處理許多小型物件時。
* 單一的已分配物件清單使得難以平行化掃描，這可能會在變異執行緒分配物件的速度快於 GC 執行緒收集物件的速度時，導致記憶體使用量問題。

為了解決這些問題，Kotlin 1.9.0 引入了自訂分配器的預覽。它將系統記憶體劃分為頁面，
允許按順序獨立掃描。每個分配都成為頁面中的一個記憶體區塊，並且頁面
會追蹤區塊大小。不同的頁面類型針對各種分配大小進行了優化。記憶體區塊的連續排列
可確保有效反覆運算所有已分配的區塊。

當執行緒分配記憶體時，它會根據分配大小搜尋合適的頁面。執行緒會維護一組
用於不同大小類別的頁面。通常，給定大小的目前頁面可以容納分配。如果沒有，
則執行緒會從共用的分配空間請求不同的頁面。此頁面可能已經可用、需要
掃描或應首先建立。

新的分配器允許同時擁有多個獨立的分配空間，這將允許 Kotlin 團隊
試驗不同的頁面配置，以進一步提高效能。

如需關於新分配器設計的詳細資訊，請參閱此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README)。

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

#### 提供意見反應

我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native) 中提供的意見反應，
以改善自訂分配器。

### 主要執行緒上的 Objective-C 或 Swift 物件取消分配掛鉤

從 Kotlin 1.9.0 開始，如果物件
傳遞到 Kotlin，則會在主要執行緒上呼叫 Objective-C 或 Swift 物件取消分配掛鉤。先前 [Kotlin/Native 記憶體管理器](native-memory-manager)處理 Objective-C 物件參考的方式
可能會導致記憶體洩漏。我們相信新的行為應可提高
記憶體管理器的穩健性。

考慮一個在 Kotlin 程式碼中引用的 Objective-C 物件，例如，當作為引數傳遞、由
函式傳回或從集合中擷取時。在這種情況下，Kotlin 會建立自己的物件來保存對
Objective-C 物件的參考。當 Kotlin 物件被取消分配時，Kotlin/Native 執行階段會呼叫 `objc_release` 函式
來釋放該 Objective-C 參考。

先前，Kotlin/Native 記憶體管理器在特殊的 GC 執行緒上執行 `objc_release`。如果是最後一個物件參考，
則物件會被取消分配。當 Objective-C 物件具有自訂取消分配掛鉤（例如 Objective-C 中的 `dealloc`
方法或 Swift 中的 `deinit` 區塊）時，可能會出現問題，並且這些掛鉤預期在特定執行緒上呼叫。

由於主要執行緒上物件的掛鉤通常預期在那裡呼叫，因此 Kotlin/Native 執行階段現在也會
在主要執行緒上呼叫 `objc_release`。它應該涵蓋 Objective-C 物件已傳遞到
主要執行緒上的 Kotlin，從而在那裡建立 Kotlin 對等物件的情況。這僅在處理主要分派佇列
時才有效，這對於常規 UI 應用程式來說是這種情況。當它不是主要佇列或物件已傳遞到
主要執行緒以外的執行緒上的 Kotlin 時，`objc_release` 會像以前一樣在特殊的 GC 執行緒上呼叫。

#### 如何退出

如果您遇到問題，您可以使用以下選項在您的 `gradle.properties` 檔案中停用此行為：

```none
kotlin.native.binary.objcDisposeOnMain=false
```

請隨時向 [our issue tracker](https://kotl.in/issue) 回報此類案例。

### 在 Kotlin/Native 中存取常數數值時，不進行物件初始化

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

此行為現在與 Kotlin/JVM 統一，在 Kotlin/JVM 中，實作與 Java 一致，並且物件在這種情況下永遠不會
初始化。由於
此變更，您還可以期望您的 Kotlin/Native 專案在效能方面有所改善。

### 能夠為 Kotlin/Native 中 iOS 模擬器測試設定獨立模式

依預設，當為 Kotlin/Native 執行 iOS 模擬器測試時，會使用 `--standalone` 旗標，以避免手動模擬器
啟動和關閉。在 1.9.0 中，您現在可以透過 `standalone` 屬性在 Gradle 任務中設定是否使用此旗標。
依預設，會使用 `--standalone` 旗標，因此會啟用獨立模式。

以下是如何在您的 `build.gradle.kts` 檔案中停用獨立模式的範例：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```

如果您停用獨立模式，您必須手動啟動模擬器。若要從
CLI 啟動您的模擬器，您可以使用以下命令：

```shell
/usr/bin/xcrun simctl boot <DeviceId>
```

:::

### Kotlin/Native 中的程式庫連結

從 Kotlin 1.9.0 開始，Kotlin/Native 編譯器以與 Kotlin/JVM 相同的方式處理 Kotlin 程式庫中的連結問題。
如果一個協力廠商 Kotlin 程式庫的作者在另一個協力廠商 Kotlin 程式庫使用的實驗性
API 中進行不相容的變更，您可能會遇到此類問題。

現在，在協力廠商 Kotlin 程式庫之間存在連結問題的情況下，組建在編譯期間不會失敗。相反，您只會在執行階段遇到這些錯誤，就像在 JVM 上一樣。

Kotlin/Native 編譯器會在每次偵測到程式庫連結問題時報告警告。您可以在您的編譯記錄中找到此類警告，例如：

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

您可以進一步設定甚至停用專案中的此行為：

* 如果您不想在編譯記錄中看到這些警告，請使用 `-Xpartial-linkage-loglevel=INFO` 編譯器選項將其隱藏。
* 也可以使用 `-Xpartial-linkage-loglevel=ERROR` 將報告的警告的嚴重性提高到編譯錯誤。在這種情況下，編譯會失敗，並且您會在編譯記錄中看到所有錯誤。使用此選項可以更仔細地檢查連結問題。
* 如果您遇到此功能的意外問題，您可以隨時使用
  `-Xpartial-linkage=disable` 編譯器選項退出。請隨時向 [our issue
  tracker](https://kotl.in/issue) 回報此類案例。

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

### 用於 C 互操作隱式整數轉換的編譯器選項

我們已針對 C 互操作引入編譯器選項，可讓您使用隱式整數轉換。經過仔細考慮後，我們已引入此編譯器選項以防止意外使用，因為此功能仍有改進空間，並且我們的目標是擁有最高品質的 API。

在此程式碼範例中，即使 [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options)
具有不帶正負號的類型 `UInt` 且 `0` 帶正負號，隱式整數轉換也允許 `options = 0`。

```kotlin
val today = NSDate()
val tomorrow = NSCalendar.currentCalendar.dateByAddingUnit(
    unit = NSCalendarUnitDay,
    value = 1,
    toDate = today,
    options = 0
)
```

若要搭配原生互操作程式庫使用隱式轉換，請使用 `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion`
編譯器選項。

您可以在您的 Gradle `build.gradle.kts` 檔案中設定此選項：
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```

## Kotlin Multiplatform

Kotlin Multiplatform 在 1.9.0 中收到了一些值得注意的更新，旨在改善您的開發人員體驗：

* [Android 目標支援的變更](#changes-to-android-target-support)
* [依預設啟用新的 Android 原始碼集配置](#new-android-source-set-layout-enabled-by-default)
* [多平台專案中 Gradle 設定快取的預覽](#preview-of-the-gradle-configuration_cache)

### Android 目標支援的變更

我們持續努力穩定 Kotlin Multiplatform。一個重要的步驟是為 Android 目標提供一流的
支援。我們很高興地宣布，Google 的 Android 團隊將來會提供
自己的 Gradle 外掛程式，以支援 Kotlin Multiplatform 中的 Android。

為了替 Google 的此新解決方案打開道路，我們正在 1.9.0 中重新命名目前 Kotlin DSL 中的 `android` 區塊。
請將組建指令碼中所有出現的 `android` 區塊變更為 `androidTarget`。這是一個暫時性的
變更，這是為了讓 Google 即將推出的 DSL 釋出 `android` 名稱所必需的。

Google 外掛程式將是在多平台專案中使用 Android 的慣用方式。當它準備好時，我們將
提供必要的移轉指示，以便您可以像以前一樣使用簡短的 `android` 名稱。

### 依預設啟用新的 Android 原始碼集配置

從 Kotlin 1.9.0 開始，新的 Android 原始碼集配置是預設配置。它取代了先前用於
目錄的命名架構，這在多種方面令人困惑。新的配置具有許多優點：

* 簡化的類型語意 – 新的 Android 原始碼配置提供了清晰且一致的命名慣例，有助於區分不同類型的原始碼集。
* 改善的原始碼目錄配置 – 透過新的配置，`SourceDirectories` 排列變得更加一致，從而更容易組織程式碼和找到原始碼檔案。
* Gradle 組態的清晰命名架構 – 現在，在 `KotlinSourceSets` 和 `AndroidSourceSets` 中，架構都更加一致且可預測。

新的配置需要 Android Gradle 外掛程式版本 7.0 或更高版本，並且在 Android Studio 2022.3 及更高版本中支援。請參閱我們的
[移轉指南](multiplatform-android-layout) 以在您的 `build.gradle(.kts)` 檔案中進行必要的變更。

### Gradle 設定快取的預覽

<anchor name="preview-of-gradle-configuration-cache"/>

Kotlin 1.9.0 支援多平台程式庫中的 [Gradle 設定快取](https://docs.gradle.org/current/userguide/configuration_cache.html)。
如果您是程式庫作者，您已經可以從改善的組建效能中受益。

Gradle 設定快取可透過重複使用後續組建的設定階段結果來加快組建程序。
自 Gradle 8.1 以來，此功能已變得穩定。若要啟用它，請依照 [Gradle 文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)中的指示操作。

Kotlin Multiplatform 外掛程式仍然不支援具有 Xcode 整合任務或
[Kotlin CocoaPods Gradle 外掛程式](native-cocoapods-dsl-reference)的 Gradle 設定快取。我們期望在未來的 Kotlin 版本中新增此功能。

:::

## Kotlin/Wasm

Kotlin 團隊持續試驗新的 Kotlin/Wasm 目標。此版本引入了多項效能和
[與大小相關的優化](#size-related-optimizations)，以及 [JavaScript 互操作的更新](#updates-in-javascript-interop)。

### 與大小相關的優化

Kotlin 1.9.0 為 WebAssembly (Wasm) 專案引入了顯著的大小改善。比較兩個「Hello World」專案，
Kotlin 1.9.0 中 Wasm 的程式碼佔用空間現在比 Kotlin 1.8.20 小 10 倍以上。

<img src="/img/wasm-1-9-0-size-improvements.png" alt="Kotlin/Wasm size-related optimizations" width="700" style={{verticalAlign: 'middle'}}/>

這些大小優化可提高資源利用率並改善以 Kotlin 程式碼為目標的 Wasm
平台的效能。

### JavaScript 互操作的更新

此 Kotlin 更新引入了 Kotlin/Wasm 的 Kotlin 和 JavaScript 之間互操作性的變更。由於 Kotlin/Wasm
是一項 [實驗性](components-stability#stability-levels-explained) 功能，因此某些限制適用於其
互操作性。

#### Dynamic 類型限制

從 1.9.0 版本開始，Kotlin 不再支援在 Kotlin/Wasm 中使用 `Dynamic` 類型。現在已棄用此功能，而改用新的通用 `JsAny` 類型，它有助於 JavaScript 互操作性。

如需更多詳細資訊，請參閱 [Kotlin/Wasm 與 JavaScript 的互操作性](wasm-js-interop) 文件。

#### 非外部類型限制

當從 JavaScript 傳遞數值到 Kotlin 或傳遞數值到 JavaScript 時，Kotlin/Wasm 支援特定 Kotlin 靜態類型的轉換。這些支援的
類型包括：

* 基本類型，例如帶正負號的數值、`Boolean` 和 `Char`。
* `String`。
* 函式類型。

其他類型在沒有轉換的情況下作為不透明參考傳遞，導致 JavaScript 和 Kotlin
子類型之間的不一致。

為了解決此問題，Kotlin 將 JavaScript 互操作限制為一組良好支援的類型。從 Kotlin 1.9.0 開始，Kotlin/Wasm JavaScript 互操作中僅支援外部、基本、字串和函式類型。此外，已引入一個單獨的顯式類型，名為
`JsReference`，以表示可用於 JavaScript 互操作的 Kotlin/Wasm 物件的句柄。

如需更多詳細資訊，請參閱 [Kotlin/Wasm 與 JavaScript 的互操作性](wasm-js-interop) 文件。

### Kotlin Playground 中的 Kotlin/Wasm

Kotlin Playground 支援 Kotlin/Wasm 目標。
您可以編寫、執行和分享以 Kotlin/Wasm 為目標的 Kotlin 程式碼。[立即查看！](https://pl.kotl.in/HDFAvimga)

:::note
使用 Kotlin/Wasm 需要在您的瀏覽器中啟用實驗性功能。

[如需關於如何啟用這些功能的詳細資訊](wasm-troubleshooting)。

:::

```kotlin
import kotlin.time.*
import kotlin.time.measureTime

fun main() {
    println("Hello from Kotlin/Wasm!")
    computeAck(3, 10)
}

tailrec fun ack(m: Int, n: Int): Int = when {
    m == 0 `->` n + 1
    n == 0 `->` ack(m - 1, 1)
    else `->` ack(m - 1, ack(m, n - 1))
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

## Kotlin/JS

此版本引入了 Kotlin/JS 的更新，包括移除舊的 Kotlin/JS 編譯器、Kotlin/JS Gradle 外掛程式棄用和 ES2015 的實驗性
支援：

* [移除舊的 Kotlin/JS 編譯器](#removal-of-the-old-kotlin-js-compiler)
* [棄用 Kotlin/JS Gradle 外掛程式](#deprecation-of-the-kotlin-js-gradle-plugin)
* [棄用外部列舉](#deprecation-of-external-enum)
* [ES2015 類別和模組的實驗性支援](#experimental-support-for-es2015-classes-and-modules)
* [變更 JS 產品發佈的預設目的地](#changed-default-destination-of-js-production-distribution)
* [從 stdlib-js 擷取 org.w3c 宣告](#extract-org-w3c-declarations-from-stdlib-js)

:::note
從 1.9.0 版本開始，[部分程式庫連結](#library-linkage-in-kotlin-native) 也已為 Kotlin/JS 啟用。

:::

### 移除舊的 Kotlin/JS 編譯器

在 Kotlin 1.8.0 中，我們 [宣布](whatsnew18#stable-js-ir-compiler-backend) 基於 IR 的後端已變得 [穩定](components-stability)。
從那時起，不指定編譯器已成為錯誤，並且使用舊的編譯器會導致警告。

在 Kotlin 1.9.0 中，使用舊的後端會導致錯誤。請依照我們的 [移轉指南](js-ir-migration) 移轉到 IR 編譯器。

### 棄用 Kotlin/JS Gradle 外掛程式

從 Kotlin 1.9.0 開始，`kotlin-js` Gradle 外掛程式已棄用。
我們鼓勵您改為使用具有 `js()` 目標的 `kotlin-multiplatform` Gradle 外掛程式。

Kotlin/JS Gradle 外掛程式的功能基本上複製了 `kotlin-multiplatform` 外掛程式，並且在底層共用了
相同的實作。這種重疊造成了混淆，並增加了 Kotlin 團隊的維護負擔。

如需移轉指示，請參閱我們的 [Kotlin Multiplatform 相容性指南](multiplatform-compatibility-guide#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin)。
如果您發現指南中未涵蓋的任何問題，請向我們的 [issue tracker](http://kotl.in/issue) 回報。

### 棄用外部列舉

在 Kotlin 1.9.0 中，由於靜態列舉成員（例如 `entries`）的問題，將棄用使用外部列舉，
這些成員無法存在於 Kotlin 之外。我們建議改為使用具有物件子類別的外部密封類別：

```kotlin
// Before
external enum class ExternalEnum { A, B }

// After
external sealed class ExternalEnum {
    object A: ExternalEnum
    object B: ExternalEnum
}
```

透過切換到具有物件子類別的