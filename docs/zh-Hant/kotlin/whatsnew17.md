[//]: # (title: Kotlin 1.7.0 有哪些新功能)

<tldr>
   <p>Kotlin 1.7.0 的 IDE 支援適用於 IntelliJ IDEA 2021.2、2021.3 和 2022.1。</p>
</tldr>

_[發布日期：2022 年 6 月 9 日](releases.md#release-details)_

Kotlin 1.7.0 已發布。它發布了新 Kotlin/JVM K2 編譯器的 Alpha 版本，穩定化了語言功能，並為 JVM、JS 和 Native 平台帶來了效能改進。

以下是此版本中主要更新的列表：

* [新的 Kotlin K2 編譯器現在處於 Alpha 階段](#new-kotlin-k2-compiler-for-the-jvm-in-alpha)，它提供了顯著的效能改進。它僅適用於 JVM，並且不支援任何編譯器插件，包括 kapt。
* [Gradle 中增量編譯的新方法](#a-new-approach-to-incremental-compilation)。增量編譯現在也支援在依賴的非 Kotlin 模組中進行的變更，並且與 Gradle 相容。
* 我們已穩定化[選擇性啟用要求註解](#stable-opt-in-requirements)、[明確非空類型](#stable-definitely-non-nullable-types)和[建立器推斷](#stable-builder-inference)。
* [現在有型別引數的底線運算子](#underscore-operator-for-type-arguments)。您可以使用它在指定其他類型時自動推斷引數的類型。
* [此版本允許委託實作至行內類別的行內值](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)。您現在可以建立輕量級包裝器，在大多數情況下它們不會分配記憶體。

您也可以在此影片中找到這些變更的簡短概覽：

<video src="https://www.youtube.com/v/54WEfLKtCGk" title="Kotlin 1.7.0 有哪些新功能"/>

## 新的 Kotlin K2 編譯器現在處於 JVM 的 Alpha 階段

此 Kotlin 版本引入了新 Kotlin K2 編譯器的 **Alpha** 版本。新編譯器旨在加速新語言功能的開發，統一 Kotlin 支援的所有平台，帶來效能改進，並提供編譯器擴充的 API。

我們已經發布了一些關於我們新編譯器及其優勢的詳細說明：

* [新 Kotlin 編譯器的發展之路](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 編譯器：頂層視圖](https://www.youtube.com/watch?v=db19VFLZqJM)

需要指出的是，K2 編譯器 Alpha 版本主要著重於效能改進，並且它僅適用於 JVM 專案。它不支援 Kotlin/JS、Kotlin/Native 或其他多平台專案，並且不支援任何編譯器插件，包括 [kapt](kapt.md)。

我們的基準測試顯示了在內部專案上的一些出色結果：

| 專案       | 當前 Kotlin 編譯器效能 | 新 K2 Kotlin 編譯器效能 | 效能提升 |
|---------------|--------------------------|-------------------------|------------|
| Kotlin        | 2.2 KLOC/s               | 4.8 KLOC/s              | ~ x2.2     |
| YouTrack      | 1.8 KLOC/s               | 4.2 KLOC/s              | ~ x2.3     |
| IntelliJ IDEA | 1.8 KLOC/s               | 3.9 KLOC/s              | ~ x2.2     |
| Space         | 1.2 KLOC/s               | 2.8 KLOC/s              | ~ x2.3     |

> KLOC/s 效能數字代表編譯器每秒處理數千行程式碼的數量。
>
> {style="tip"}

您可以在您的 JVM 專案中查看效能提升，並與舊編譯器的結果進行比較。要啟用 Kotlin K2 編譯器，請使用以下編譯器選項：

```bash
-Xuse-k2
```

此外，K2 編譯器[包含許多錯誤修正](https://youtrack.jetbrains.com/issues/KT?q=tag:%20FIR-preview-qa%20%23Resolved)。請注意，即使此列表中**狀態：開放**的議題實際上也已在 K2 中修復。

接下來的 Kotlin 版本將改進 K2 編譯器的穩定性並提供更多功能，敬請期待！

如果您在使用 Kotlin K2 編譯器時遇到任何效能問題，請[向我們的問題追蹤器回報](https://kotl.in/issue)。

## 語言

Kotlin 1.7.0 引入了對委託實作和型別引數新底線運算子的支援。它還穩定化了先前版本中作為預覽版引入的幾個語言功能：

* [委託實作至行內類別的行內值](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)
* [型別引數的底線運算子](#underscore-operator-for-type-arguments)
* [穩定版建立器推斷](#stable-builder-inference)
* [穩定版選擇性啟用要求](#stable-opt-in-requirements)
* [穩定版明確非空類型](#stable-definitely-non-nullable-types)

### 允許委託實作至行內類別的行內值

如果您想為值或類別實例建立輕量級包裝器，則需要手動實作所有介面方法。委託實作解決了這個問題，但它在 1.7.0 之前不適用於行內類別。此限制已移除，因此您現在可以建立輕量級包裝器，在大多數情況下它們不會分配記憶體。

```kotlin
interface Bar {
    fun foo() = "foo"
}

@JvmInline
value class BarWrapper(val bar: Bar): Bar by bar

fun main() {
    val bw = BarWrapper(object: Bar {})
    println(bw.foo())
}
```

### 型別引數的底線運算子

Kotlin 1.7.0 引入了型別引數的底線運算子 `_`。您可以使用它在指定其他類型時自動推斷型別引數：

```kotlin
abstract class SomeClass<T> {
    abstract fun execute(): T
}

class SomeImplementation : SomeClass<String>() {
    override fun execute(): String = "Test"
}

class OtherImplementation : SomeClass<Int>() {
    override fun execute(): Int = 42
}

object Runner {
    inline fun <reified S: SomeClass<T>, T> run(): T {
        return S::class.java.getDeclaredConstructor().newInstance().execute()
    }
}

fun main() {
    // 因為 SomeImplementation 衍生自 SomeClass<String>，所以 T 被推斷為 String
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // 因為 OtherImplementation 衍生自 SomeClass<Int>，所以 T 被推斷為 Int
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```

> 您可以在變數清單中的任何位置使用底線運算子來推斷型別引數。
>
{style="note"}

### 穩定版建立器推斷

建立器推斷是一種特殊類型的型別推斷，在呼叫泛型建立器函數時非常有用。它有助於編譯器使用其 lambda 引數中其他呼叫的型別資訊來推斷呼叫的型別引數。

從 1.7.0 開始，如果常規型別推斷無法在不指定 `-Xenable-builder-inference` 編譯器選項的情況下獲得足夠的型別資訊，則建立器推斷將自動啟用，該選項在 [1.6.0 中引入](whatsnew16.md#changes-to-builder-inference)。

[了解如何編寫自訂泛型建立器](using-builders-with-builder-inference.md)。

### 穩定版選擇性啟用要求

[選擇性啟用要求](opt-in-requirements.md)現在是[穩定版](components-stability.md)，不需要額外的編譯器組態。

在 1.7.0 之前，選擇性啟用功能本身需要引數 `-opt-in=kotlin.RequiresOptIn` 以避免警告。現在不再需要此引數；但是，您仍然可以使用編譯器引數 `-opt-in` 來選擇性啟用其他註解、[一個模組](opt-in-requirements.md#opt-in-a-module)。

### 穩定版明確非空類型

在 Kotlin 1.7.0 中，明確非空類型已升級為[穩定版](components-stability.md)。它們在擴充泛型 Java 類別和介面時提供了更好的互通性。

您可以使用新語法 `T & Any` 在使用位置將泛型型別參數標記為明確非空。這種語法形式來自[交集類型](https://en.wikipedia.org/wiki/Intersection_type)的表示法，現在僅限於 `&` 左側帶有可空上限的型別參數和右側帶有非空 `Any` 的型別參數：

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // 正常
    elvisLike<String>("", "").length
    // 錯誤：'null' 不能是非空類型的值
    elvisLike<String>("", null).length

    // 正常
    elvisLike<String?>(null, "").length
    // 錯誤：'null' 不能是非空類型的值
    elvisLike<String?>(null, null).length
}
```

在 [this KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md) 中了解有關明確非空類型的更多資訊。

## Kotlin/JVM

此版本為 Kotlin/JVM 編譯器帶來了效能改進和一個新的編譯器選項。此外，函數式介面建構函式的可呼叫引用已變得穩定。請注意，從 1.7.0 開始，Kotlin/JVM 編譯的預設目標版本是 `1.8`。

* [編譯器效能最佳化](#compiler-performance-optimizations)
* [新編譯器選項：-Xjdk-release](#new-compiler-option-xjdk-release)
* [函數式介面建構函式的穩定可呼叫引用](#stable-callable-references-to-functional-interface-constructors)
* [已移除 JVM 目標版本 1.6](#removed-jvm-target-version-1-6)

### 編譯器效能最佳化

Kotlin 1.7.0 為 Kotlin/JVM 編譯器帶來了效能改進。根據我們的基準測試，與 Kotlin 1.6.0 相比，編譯時間[平均減少了 10%](https://youtrack.jetbrains.com/issue/KT-48233/Switching-to-JVM-IR-backend-increases-compilation-time-by-more-t#focus=Comments-27-6114542.0-0)。由於位元碼後處理的改進，大量使用行內函數的專案，例如[使用 `kotlinx.html` 的專案](https://youtrack.jetbrains.com/issue/KT-51416/Compilation-of-kotlinx-html-DSL-should-still-be-faster)，將會編譯得更快。

### 新編譯器選項：-Xjdk-release

Kotlin 1.7.0 引入了一個新的編譯器選項 `-Xjdk-release`。此選項類似於 [javac 的命令列 `--release` 選項](http://openjdk.java.net/jeps/247)。`-Xjdk-release` 選項控制目標位元碼版本，並將類別路徑中 JDK 的 API 限制為指定的 Java 版本。例如，`kotlinc -Xjdk-release=1.8` 將不允許引用 `java.lang.Module`，即使依賴項中的 JDK 版本是 9 或更高版本。

> 此選項[不保證](https://youtrack.jetbrains.com/issue/KT-29974)對每個 JDK 發行版都有效。
>
{style="note"}

請在[此 YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-29974/Add-a-compiler-option-Xjdk-release-similar-to-javac-s-release-to)中留下您的回饋。

### 函數式介面建構函式的穩定可呼叫引用

函數式介面建構函式的[可呼叫引用](reflection.md#callable-references)現在是[穩定版](components-stability.md)。了解如何[遷移](fun-interfaces.md#migration-from-an-interface-with-constructor-function-to-a-functional-interface)從帶有建構函式函數的介面到使用可呼叫引用的函數式介面。

請在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中報告您發現的任何問題。

### 已移除 JVM 目標版本 1.6

Kotlin/JVM 編譯的預設目標版本是 `1.8`。`1.6` 目標已移除。

請遷移到 JVM 目標 1.8 或更高版本。了解如何更新 JVM 目標版本適用於：

* [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm)
* [Maven](maven.md#attributes-specific-to-jvm)
* [命令列編譯器](compiler-reference.md#jvm-target-version)

## Kotlin/Native

Kotlin 1.7.0 包含了對 Objective-C 和 Swift 互通性的變更，並穩定化了先前版本中引入的功能。它還為新記憶體管理器帶來了效能改進以及其他更新：

* [新記憶體管理器的效能改進](#performance-improvements-for-the-new-memory-manager)
* [與 JVM 和 JS IR 後端的統一編譯器插件 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [支援獨立 Android 可執行檔](#support-for-standalone-android-executables)
* [與 Swift async/await 的互通性：返回 Void 而不是 KotlinUnit](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [禁止透過 Objective-C 橋接器傳遞未宣告的例外](#prohibited-undeclared-exceptions-through-objective-c-bridges)
* [改進的 CocoaPods 整合](#improved-cocoapods-integration)
* [覆寫 Kotlin/Native 編譯器下載 URL](#overriding-the-kotlin-native-compiler-download-url)

### 新記憶體管理器的效能改進

> 新的 Kotlin/Native 記憶體管理器處於 [Alpha](components-stability.md) 階段。
> 它可能在未來發生不相容的變更並需要手動遷移。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中提供回饋。
>
{style="note"}

新記憶體管理器仍處於 Alpha 階段，但它正在成為[穩定版](components-stability.md)。此版本為新記憶體管理器帶來了顯著的效能改進，尤其是在垃圾回收 (GC) 方面。具體來說，在 [1.6.20 中引入](whatsnew1620.md)的清掃階段並行實作現在預設啟用。這有助於減少應用程式因 GC 暫停的時間。新的 GC 排程器在選擇 GC 頻率方面表現更好，尤其對於較大的堆。

此外，我們特別優化了偵錯二進位檔，確保在記憶體管理器的實作程式碼中使用了適當的優化等級和連結時優化。這有助於我們在基準測試中將偵錯二進位檔的執行時間提高了約 30%。

嘗試在您的專案中使用新的記憶體管理器，看看它是如何運作的，並在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中與我們分享您的回饋。

### 與 JVM 和 JS IR 後端的統一編譯器插件 ABI

從 Kotlin 1.7.0 開始，Kotlin 多平台 Gradle 插件預設使用 Kotlin/Native 的可嵌入編譯器 Jar。此[功能在 1.6.0 中作為實驗性功能宣布](whatsnew16.md#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)，現在它已穩定且可使用。

這項改進對於函式庫作者來說非常方便，因為它改進了編譯器插件開發體驗。在此版本之前，您必須為 Kotlin/Native 提供單獨的構件，但現在您可以為 Native 和其他支援的平台使用相同的編譯器插件構件。

> 此功能可能需要插件開發人員對其現有插件採取遷移步驟。
>
> 了解如何在此 [YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-48595)中準備您的插件以進行更新。
>
{style="warning"}

### 支援獨立 Android 可執行檔

Kotlin 1.7.0 為為 Android Native 目標產生標準可執行檔提供了全面支援。它[在 1.6.20 中引入](whatsnew1620.md#support-for-standalone-android-executables)，現在預設啟用。

如果您想回復到 Kotlin/Native 產生共用函式庫的先前行為，請使用以下設定：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

### 與 Swift async/await 的互通性：返回 Void 而不是 KotlinUnit

Kotlin `suspend` 函數現在在 Swift 中返回 `Void` 類型而不是 `KotlinUnit`。這是與 Swift 的 `async`/`await` 互通性改進的結果。此功能[在 1.6.20 中引入](whatsnew1620.md#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)，此版本預設啟用此行為。

您不再需要使用 `kotlin.native.binary.unitSuspendFunctionObjCExport=proper` 屬性來為此類函數返回正確的類型。

### 禁止透過 Objective-C 橋接器傳遞未宣告的例外

當您從 Swift/Objective-C 程式碼呼叫 Kotlin 程式碼（反之亦然），並且此程式碼拋出例外時，它應該由發生例外的程式碼處理，除非您明確允許透過適當的轉換在語言之間轉發例外（例如，使用 `@Throws` 註解）。

以前，Kotlin 有另一種無意中的行為，即未宣告的例外在某些情況下可能會從一種語言「洩漏」到另一種語言。Kotlin 1.7.0 修復了這個問題，現在此類情況會導致程式終止。

因此，例如，如果您在 Kotlin 中有一個 `{ throw Exception() }` lambda 並從 Swift 中呼叫它，在 Kotlin 1.7.0 中，一旦例外到達 Swift 程式碼，它將立即終止。在以前的 Kotlin 版本中，此類例外可能會洩漏到 Swift 程式碼。

`@Throws` 註解繼續像以前一樣工作。

### 改進的 CocoaPods 整合

從 Kotlin 1.7.0 開始，如果您想在專案中整合 CocoaPods，您不再需要安裝 `cocoapods-generate` 插件。

以前，您需要安裝 CocoaPods 依賴管理器和 `cocoapods-generate` 插件才能使用 CocoaPods，例如，在 Kotlin 多平台行動專案中處理 [iOS 依賴項](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-dependencies.html#with-cocoapods)。

現在設定 CocoaPods 整合更容易，我們解決了 `cocoapods-generate` 無法安裝在 Ruby 3 及更高版本上的問題。現在也支援在 Apple M1 上運作更好的最新 Ruby 版本。

了解如何設定[初始 CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html#set-up-an-environment-to-work-with-cocoapods)。

### 覆寫 Kotlin/Native 編譯器下載 URL

從 Kotlin 1.7.0 開始，您可以自訂 Kotlin/Native 編譯器的下載 URL。當 CI 上的外部連結被禁止時，這非常有用。

要覆寫預設基本 URL `https://download.jetbrains.com/kotlin/native/builds`，請使用以下 Gradle 屬性：

```none
kotlin.native.distribution.baseDownloadUrl=https://example.com
```

> 下載器會將原生版本和目標作業系統附加到此基本 URL，以確保它下載實際的編譯器發行版。
>
{style="note"}

## Kotlin/JS

Kotlin/JS 正在對 [JS IR 編譯器後端](js-ir-compiler.md)進行進一步改進，以及其他可以改善您的開發體驗的更新：

* [新 IR 後端的效能改進](#performance-improvements-for-the-new-ir-backend)
* [使用 IR 時成員名稱的最小化](#minification-for-member-names-when-using-ir)
* [透過 IR 後端中的 polyfills 支援舊版瀏覽器](#support-for-older-browsers-via-polyfills-in-the-ir-backend)
* [從 js 表達式動態載入 JavaScript 模組](#dynamically-load-javascript-modules-from-js-expressions)
* [為 JavaScript 測試執行器指定環境變數](#specify-environment-variables-for-javascript-test-runners)

### 新 IR 後端的效能改進

此版本有一些主要的更新，應能改善您的開發體驗：

* Kotlin/JS 的增量編譯效能已顯著改進。構建 JS 專案所需時間更少。現在，在許多情況下，增量重建的效能應該與舊版後端大致相同。
* Kotlin/JS 最終捆綁包所需空間更少，因為我們顯著縮小了最終構件的大小。我們測量了某些大型專案的生產捆綁包大小比舊版後端減少了高達 20%。
* 介面的類型檢查已數量級地改進。
* Kotlin 產生更高品質的 JS 程式碼。

### 使用 IR 時成員名稱的最小化

Kotlin/JS IR 編譯器現在利用其關於 Kotlin 類別和函數之間關係的內部資訊，應用更有效的最小化，縮短函數、屬性和類別的名稱。這會縮小最終捆綁的應用程式。

這種最小化類型在您以生產模式構建 Kotlin/JS 應用程式時自動應用，並且預設啟用。要禁用成員名稱最小化，請使用 `-Xir-minimized-member-names` 編譯器標誌：

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xir-minimized-member-names=false")
        }
    }
}
```

### 透過 IR 後端中的 polyfills 支援舊版瀏覽器

Kotlin/JS 的 IR 編譯器後端現在包含與舊版後端相同的 polyfills。這使得使用新編譯器編譯的程式碼可以在不支援 Kotlin 標準函式庫使用的所有 ES2015 方法的舊版瀏覽器中執行。只有專案實際使用的那些 polyfills 會包含在最終捆綁包中，這最大限度地減少了它們對捆綁包大小的潛在影響。

此功能在使用 IR 編譯器時預設啟用，您無需進行配置。

### 從 js 表達式動態載入 JavaScript 模組

在使用 JavaScript 模組時，大多數應用程式使用靜態導入，其使用已透過 [JavaScript 模組整合](js-modules.md)涵蓋。然而，Kotlin/JS 缺少一種機制來在應用程式中於執行時動態載入 JavaScript 模組。

從 Kotlin 1.7.0 開始，JavaScript 的 `import` 陳述式在 `js` 區塊中得到支援，允許您在執行時動態將套件引入您的應用程式：

```kotlin
val myPackage = js("import('my-package')")
```

### 為 JavaScript 測試執行器指定環境變數

為了調整 Node.js 套件解析或將外部資訊傳遞給 Node.js 測試，您現在可以指定 JavaScript 測試執行器使用的環境變數。要定義環境變數，請在建置腳本的 `testTask` 區塊中使用帶有鍵值對的 `environment()` 函數：

```kotlin
kotlin {
    js {
        nodejs {
            testTask {
                environment("key", "value")
            }
        }
    }
}
```

## 標準函式庫

在 Kotlin 1.7.0 中，標準函式庫收到了一系列變更和改進。它們引入了新功能，穩定化了實驗性功能，並統一了 Native、JS 和 JVM 命名捕獲群組的支援：

* [min() 和 max() 集合函數返回非空值](#min-and-max-collection-functions-return-as-non-nullable)
* [特定索引處的正規表達式匹配](#regular-expression-matching-at-specific-indices)
* [擴展對先前語言和 API 版本的支援](#extended-support-for-previous-language-and-api-versions)
* [透過反射存取註解](#access-to-annotations-via-reflection)
* [穩定版深度遞迴函數](#stable-deep-recursive-functions)
* [基於行內類別的預設時間來源時間標記](#time-marks-based-on-inline-classes-for-default-time-source)
* [Java Optional 的新實驗性擴展函數](#new-experimental-extension-functions-for-java-optionals)
* [JS 和 Native 中對命名捕獲群組的支援](#support-for-named-capturing-groups-in-js-and-native)

### min() 和 max() 集合函數返回非空值

在 [Kotlin 1.4.0](whatsnew14.md) 中，我們將 `min()` 和 `max()` 集合函數重新命名為 `minOrNull()` 和 `maxOrNull()`。這些新名稱更好地反映了它們的行為 — 如果接收器集合為空則返回 null。它還有助於使函數行為與整個 Kotlin 集合 API 中使用的命名慣例保持一致。

`minBy()`、`maxBy()`、`minWith()` 和 `maxWith()` 也是如此，它們都在 Kotlin 1.4.0 中獲得了其 *OrNull() 同義詞。受此變更影響的舊函數已逐步棄用。

Kotlin 1.7.0 重新引入了原始函數名稱，但帶有非空返回類型。新的 `min()`、`max()`、`minBy()`、`maxBy()`、`minWith()` 和 `maxWith()` 函數現在嚴格返回集合元素或拋出例外。

```kotlin
fun main() {
    val numbers = listOf<Int>()
    println(numbers.maxOrNull()) // "null"
    println(numbers.max()) // "Exception in... Collection is empty."
}
```

### 特定索引處的正規表達式匹配

在 [1.5.30 中引入](whatsnew1530.md#matching-with-regex-at-a-particular-position)的 `Regex.matchAt()` 和 `Regex.matchesAt()` 函數現在是穩定版。它們提供了一種檢查正規表達式是否在 `String` 或 `CharSequence` 中的特定位置具有精確匹配的方法。

`matchesAt()` 檢查匹配並返回布林結果：

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    // 正規表達式：一位數字，點，一位數字，點，一位或多位數字
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
}
```

`matchAt()` 如果找到匹配則返回匹配，否則返回 `null`：

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.7.0"
}
```

我們非常感謝您對此 [YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-34021)的回饋。

### 擴展對先前語言和 API 版本的支援

為了支援函式庫作者開發旨在可在廣泛的舊版 Kotlin 中使用的函式庫，並解決主要 Kotlin 版本發布頻率增加的問題，我們擴展了對先前語言和 API 版本的支援。

透過 Kotlin 1.7.0，我們支援三個而不是兩個先前的語言和 API 版本。這意味著 Kotlin 1.7.0 支援開發目標為 Kotlin 1.4.0 或更低版本的函式庫。有關向下相容性的更多資訊，請參閱[相容性模式](compatibility-modes.md)。

### 透過反射存取註解

首次[在 1.6.0 中引入](whatsnew16.md#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)的 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 擴展函數現在是[穩定版](components-stability.md)。這個[反射](reflection.md)函數返回元素上給定類型的所有註解，包括單獨應用和重複的註解。

```kotlin
@Repeatable
annotation class Tag(val name: String)

@Tag("First Tag")
@Tag("Second Tag")
fun taggedFunction() {
    println("I'm a tagged function!")
}

fun main() {
    val x = ::taggedFunction
    val foo = x as KAnnotatedElement
    println(foo.findAnnotations<Tag>()) // [@Tag(name=First Tag), @Tag(name=Second Tag)]
}
```

### 穩定版深度遞迴函數

深度遞迴函數自 [Kotlin 1.4.0](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/#Defining_deep_recursive_functions_using_coroutines) 以來一直作為實驗性功能提供，現在它們在 Kotlin 1.7.0 中是[穩定版](components-stability.md)。使用 `DeepRecursiveFunction`，您可以定義一個將其堆疊保留在堆上而不是使用實際呼叫堆疊的函數。這允許您執行非常深的遞迴計算。要呼叫深度遞迴函數，請 `invoke` 它。

在此範例中，深度遞迴函數用於遞迴計算二元樹的深度。即使此範例函數遞迴呼叫自身 100,000 次，也不會拋出 `StackOverflowError`：

```kotlin
class Tree(val left: Tree?, val right: Tree?)

val calculateDepth = DeepRecursiveFunction<Tree?, Int> { t ->
    if (t == null) 0 else maxOf(
        callRecursive(t.left),
        callRecursive(t.right)
    ) + 1
}

fun main() {
    // 產生深度為 100_000 的樹
    val deepTree = generateSequence(Tree(null, null)) { prev ->
        Tree(prev, null)
    }.take(100_000).last()

    println(calculateDepth(deepTree)) // 100000
}
```

考慮在您的程式碼中使用深度遞迴函數，如果您的遞迴深度超過 1000 次呼叫。

### 基於行內類別的預設時間來源時間標記

Kotlin 1.7.0 透過將 `TimeSource.Monotonic` 返回的時間標記變更為行內值類別來改進時間測量功能的效能。這意味著呼叫 `markNow()`、`elapsedNow()`、`measureTime()` 和 `measureTimedValue()` 等函數不會為其 `TimeMark` 實例分配包裝器類別。特別是當測量屬於熱路徑的程式碼片段時，這有助於最大程度地減少測量對效能的影響：

```kotlin
@OptIn(ExperimentalTime::class)
fun main() {
    val mark = TimeSource.Monotonic.markNow() // 返回的 `TimeMark` 是行內類別
    val elapsedDuration = mark.elapsedNow()
}
```

> 此最佳化僅在靜態已知取得 `TimeMark` 的時間來源為 `TimeSource.Monotonic` 時才可用。
>
{style="note"}

### Java Optional 的新實驗性擴展函數

Kotlin 1.7.0 附帶了新的便利函數，可簡化在 Java 中使用 `Optional` 類別。這些新函數可用於解包和轉換 JVM 上的可選物件，並有助於使 Java API 的使用更簡潔。

`getOrNull()`、`getOrDefault()` 和 `getOrElse()` 擴展函數允許您在 `Optional` 存在時獲取其值。否則，您將分別獲得 `null`、預設值或由函數返回的值：

```kotlin
val presentOptional = Optional.of("I'm here!")

println(presentOptional.getOrNull())
// "I'm here!"

val absentOptional = Optional.empty<String>()

println(absentOptional.getOrNull())
// null
println(absentOptional.getOrDefault("Nobody here!"))
// "Nobody here!"
println(absentOptional.getOrElse {
    println("Optional was absent!")
    "Default value!"
})
// "Optional was absent!"
// "Default value!"
```

`toList()`、`toSet()` 和 `asSequence()` 擴展函數將存在的 `Optional` 值轉換為列表、集合或序列，否則返回空集合。`toCollection()` 擴展函數將 `Optional` 值附加到已存在的目標集合：

```kotlin
val presentOptional = Optional.of("I'm here!")
val absentOptional = Optional.empty<String>()
println(presentOptional.toList() + "," + absentOptional.toList())
// ["I'm here!"], []
println(presentOptional.toSet() + "," + absentOptional.toSet())
// ["I'm here!"], []
val myCollection = mutableListOf<String>()
absentOptional.toCollection(myCollection)
println(myCollection)
// []
presentOptional.toCollection(myCollection)
println(myCollection)
// ["I'm here!"]
val list = listOf(presentOptional, absentOptional).flatMap { it.asSequence() }
println(list)
// ["I'm here!"]
```

這些擴展函數在 Kotlin 1.7.0 中作為實驗性功能引入。您可以在 [this KEEP](https://github.com/Kotlin/KEEP/pull/291) 中了解有關 `Optional` 擴展的更多資訊。一如既往，我們歡迎您在 [Kotlin 問題追蹤器](https://kotl.in/issue)中提供回饋。

### JS 和 Native 中對命名捕獲群組的支援

從 Kotlin 1.7.0 開始，命名捕獲群組不僅在 JVM 上受支援，而且在 JS 和 Native 平台上也受支援。

要為捕獲群組命名，請在您的正規表達式中使用 `(?<name>group)` 語法。要獲取群組匹配的文本，請呼叫新引入的 [`MatchGroupCollection.get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/get.html) 函數並傳遞群組名稱。

#### 按名稱檢索匹配群組值

考慮這個用於匹配城市座標的範例。要獲取正規表達式匹配的群組集合，請使用 [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html)。比較按其編號 (索引) 和按其名稱使用 `value` 檢索群組內容：

```kotlin
fun main() {
    val regex = "\\b(?<city>[A-Za-z\\s]+),\\s(?<state>[A-Z]{2}):\\s(?<areaCode>[0-9]{3})\\b".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    val match = regex.find(input)!!
    println(match.groups["city"]?.value) // "Austin" — 按名稱
    println(match.groups[2]?.value) // "TX" — 按編號
}
```

#### 命名反向引用

您現在還可以在反向引用群組時使用群組名稱。反向引用匹配之前由捕獲群組匹配的相同文本。為此，請在您的正規表達式中使用 `\k<name>` 語法：

```kotlin
fun backRef() {
    val regex = "(?<title>\\w+), yes \\k<title>".toRegex()
    val match = regex.find("Do you copy? Sir, yes Sir!")!!
    println(match.value) // "Sir, yes Sir"
    println(match.groups["title"]?.value) // "Sir"
}
```

#### 替換表達式中的命名群組

命名群組引用可用於替換表達式。考慮 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 函數，它將輸入中指定正規表達式的所有出現替換為替換表達式，以及 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) 函數，它僅替換第一個匹配。

替換字串中 `${name}` 的出現將替換為與帶指定名稱的捕獲群組對應的子序列。您可以比較按名稱和索引的群組引用中的替換：

```kotlin
fun dateReplace() {
    val dateRegex = Regex("(?<dd>\\d{2})-(?<mm>\\d{2})-(?<yyyy>\\d{4})")
    val input = "Date of birth: 27-04-2022"
    println(dateRegex.replace(input, "\${yyyy}-\${mm}-\${dd}")) // "Date of birth: 2022-04-27" — 按名稱
    println(dateRegex.replace(input, "\$3-\$2-\$1")) // "Date of birth: 2022-04-27" — 按編號
}
```

## Gradle

此版本引入了新的建置報告、對 Gradle 插件變體的支援、kapt 中的新統計資料等等：

* [增量編譯的新方法](#a-new-approach-to-incremental-compilation)
* [追蹤編譯器效能的新建置報告](#build-reports-for-kotlin-compiler-tasks)
* [Gradle 和 Android Gradle 插件的最低支援版本變更](#bumping-minimum-supported-versions)
* [支援 Gradle 插件變體](#support-for-gradle-plugin-variants)
* [Kotlin Gradle 插件 API 中的更新](#updates-in-the-kotlin-gradle-plugin-api)
* [透過插件 API 提供 sam-with-receiver 插件](#the-sam-with-receiver-plugin-is-available-via-the-plugins-api)
* [編譯任務中的變更](#changes-in-compile-tasks)
* [kapt 中每個註解處理器產生檔案的新統計資料](#statistics-of-generated-files-by-each-annotation-processor-in-kapt)
* [kotlin.compiler.execution.strategy 系統屬性的棄用](#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)
* [移除棄用選項、方法和插件](#removal-of-deprecated-options-methods-and-plugins)

### 增量編譯的新方法

> 增量編譯的新方法是[實驗性](components-stability.md)的。它可能隨時被移除或更改。
> 需要選擇性啟用 (請參閱下面的詳細資訊)。我們鼓勵您僅將其用於評估目的，我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供回饋。
>
{style="warning"}

在 Kotlin 1.7.0 中，我們重新設計了跨模組變更的增量編譯。現在，增量編譯也支援在依賴的非 Kotlin 模組中進行的變更，並且與 [Gradle 建置快取](https://docs.gradle.org/current/userguide/build_cache.html)相容。編譯避免的支援也得到了改進。

如果您使用建置快取或經常在非 Kotlin Gradle 模組中進行變更，我們預計您將從這種新方法中獲得最顯著的效益。我們對 `kotlin-gradle-plugin` 模組的 Kotlin 專案測試顯示，快取命中後的變更改進超過 80%。

要嘗試這種新方法，請在 `gradle.properties` 中設定以下選項：

```none
kotlin.incremental.useClasspathSnapshot=true
```

> 增量編譯的新方法目前僅適用於 Gradle 建置系統中的 JVM 後端。
>
{style="note"}

在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)中了解增量編譯新方法的底層實作方式。

我們的計劃是穩定化這項技術並新增對其他後端（例如 JS）和建置系統的支援。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中報告您在此編譯方案中遇到的任何問題或奇怪行為。謝謝！

Kotlin 團隊非常感謝 [Ivan Gavrilovic](https://github.com/gavra0)、[Hung Nguyen](https://github.com/hungvietnguyen)、[Cédric Champeau](https://github.com/melix) 和其他外部貢獻者的幫助。

### 追蹤編譯器效能的新建置報告

> Kotlin 建置報告是[實驗性](components-stability.md)的。它們可能隨時被移除或更改。
> 需要選擇性啟用 (請參閱下面的詳細資訊)。僅將它們用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供對它們的回饋。
>
{style="warning"}

Kotlin 1.7.0 引入了有助於追蹤編譯器效能的建置報告。報告包含不同編譯階段的持續時間以及編譯無法增量的原因。

當您想調查編譯器任務的問題時，建置報告非常有用，例如：

* 當 Gradle 建置耗時過多，並且您想了解效能不佳的根本原因時。
* 當同一專案的編譯時間不同，有時需要幾秒鐘，有時需要幾分鐘時。

要啟用建置報告，請在 `gradle.properties` 中宣告儲存建置報告輸出的位置：

```none
kotlin.build.report.output=file
```

以下值（及其組合）可用：

* `file` 將建置報告儲存在本機檔案中。
* `build_scan` 將建置報告儲存在 [build scan](https://scans.gradle.com/) 的 `custom values` 部分。

  > Gradle Enterprise 插件限制自訂值的數量及其長度。在大型專案中，某些值可能會遺失。
  >
  {style="note"}

* `http` 使用 HTTP(S) 發佈建置報告。POST 方法以 JSON 格式傳送指標。資料可能會因版本而異。您可以在 [Kotlin 儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)中查看傳送資料的當前版本。

有兩種常見情況，分析長時間執行編譯的建置報告可以幫助您解決：

* 建置不是增量的。分析原因並解決潛在問題。
* 建置是增量的，但耗時過多。嘗試重新組織原始碼檔案 — 分割大檔案，將單獨的類別儲存在不同檔案中，重構大型類別，在不同檔案中宣告頂層函數等等。

在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/)中了解有關新建置報告的更多資訊。

歡迎您嘗試在您的基礎設施中使用建置報告。如果您有任何回饋，遇到任何問題，或想提出改進建議，請隨時在我們的[問題追蹤器](https://youtrack.jetbrains.com/newIssue)中報告。謝謝！

### Gradle 和 Android Gradle 插件的最低支援版本變更

從 Kotlin 1.7.0 開始，最低支援的 Gradle 版本是 6.7.1。我們不得不[提高版本](https://youtrack.jetbrains.com/issue/KT-49733/Bump-minimal-supported-Gradle-version-to-6-7-1)以支援 [Gradle 插件變體](#support-for-gradle-plugin-variants)和新的 Gradle API。未來，由於 Gradle 插件變體功能，我們不應該再像以前那樣頻繁地提高最低支援版本。

此外，最低支援的 Android Gradle 插件版本現在是 3.6.4。

### 支援 Gradle 插件變體

Gradle 7.0 為 Gradle 插件作者引入了一項新功能 — [帶變體的插件](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)。此功能使得在新增對新 Gradle 功能的支援的同時，更容易維護與 7.1 以下 Gradle 版本的相容性。了解有關 [Gradle 中變體選擇](https://docs.gradle.org/current/userguide/variant_model.html)的更多資訊。

透過 Gradle 插件變體，我們可以為不同的 Gradle 版本發布不同的 Kotlin Gradle 插件變體。目標是在 `main` 變體中支援基本 Kotlin 編譯，這對應於 Gradle 的最舊支援版本。每個變體將具有來自相應版本的 Gradle 功能實作。最新的變體將支援最廣泛的 Gradle 功能集。透過這種方法，我們可以擴展對功能有限的舊版 Gradle 的支援。

目前，Kotlin Gradle 插件只有兩種變體：

* `main` 適用於 Gradle 6.7.1–6.9.3 版
* `gradle70` 適用於 Gradle 7.0 及更高版本

在未來的 Kotlin 版本中，我們可能會增加更多。

要檢查您的建置使用哪個變體，請啟用 [`--info` 記錄級別](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)並在輸出中查找以 `Using Kotlin Gradle plugin` 開頭的字串，例如 `Using Kotlin Gradle plugin main variant`。

> 以下是一些 Gradle 中變體選擇已知問題的解決方法：
> * [pluginManagement 中的 ResolutionStrategy 不適用於多變體插件](https://github.com/gradle/gradle/issues/20545)
> * [當插件作為 `buildSrc` 通用依賴項添加時，插件變體被忽略](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

請在[此 YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-49227/Support-Gradle-plugins-variants)中留下您的回饋。

### Kotlin Gradle 插件 API 中的更新

Kotlin Gradle 插件 API 構件收到了一些改進：

* 新增了帶有使用者可配置輸入的 Kotlin/JVM 和 Kotlin/kapt 任務的介面。
* 新增了 `KotlinBasePlugin` 介面，所有 Kotlin 插件都繼承自它。當您想在應用任何 Kotlin Gradle 插件（JVM、JS、多平台、Native 和其他平台）時觸發一些組態動作時，請使用此介面：

  ```kotlin
  project.plugins.withType<org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin>() {
      // 在此處配置您的動作
  }
  ```
  您可以[在此 YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-48008/Consider-offering-a-KotlinBasePlugin)中留下關於 `KotlinBasePlugin` 的回饋。

* 我們為 Android Gradle 插件奠定了基礎，以便在自身內部配置 Kotlin 編譯，這意味著您無需將 Kotlin Android Gradle 插件新增到您的建置中。
  請關注 [Android Gradle 插件發布公告](https://developer.android.com/studio/releases/gradle-plugin)以了解新增的支援並嘗試一下！

### 透過插件 API 提供 sam-with-receiver 插件

[sam-with-receiver 編譯器插件](sam-with-receiver-plugin.md)現在可透過 [Gradle 插件 DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block) 取得：

```kotlin
plugins {
    id("org.jetbrains.kotlin.plugin.sam.with.receiver") version "$kotlin_version"
}
```

### 編譯任務中的變更

此版本中編譯任務收到了大量變更：

* Kotlin 編譯任務不再繼承 Gradle 的 `AbstractCompile` 任務。它們僅繼承 `DefaultTask`。
* `AbstractCompile` 任務具有 `sourceCompatibility` 和 `targetCompatibility` 輸入。由於不再繼承 `AbstractCompile` 任務，這些輸入在 Kotlin 使用者腳本中不再可用。
* `SourceTask.stableSources` 輸入不再可用，您應該使用 `sources` 輸入。`setSource(...)` 方法仍然可用。
* 所有編譯任務現在都使用 `libraries` 輸入來表示編譯所需的函式庫列表。`KotlinCompile` 任務仍然具有棄用的 Kotlin 屬性 `classpath`，該屬性將在未來版本中移除。
* 編譯任務仍然實作 `PatternFilterable` 介面，該介面允許過濾 Kotlin 原始碼。`sourceFilesExtensions` 輸入已移除，改為使用 `PatternFilterable` 方法。
* 棄用的 `Gradle destinationDir: File` 輸出已替換為 `destinationDirectory: DirectoryProperty` 輸出。
* Kotlin/Native `AbstractNativeCompile` 任務現在繼承 `AbstractKotlinCompileTool` 基底類別。這是將 Kotlin/Native 建置工具整合到所有其他工具的初步步驟。

請在[此 YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-32805)中留下您的回饋。

### kapt 中每個註解處理器產生檔案的新統計資料

`kotlin-kapt` Gradle 插件已經[報告每個處理器的效能統計資料](https://github.com/JetBrains/kotlin/pull/4280)。從 Kotlin 1.7.0 開始，它還可以報告每個註解處理器產生檔案數量的統計資料。

這對於追蹤建置中是否存在未使用的註解處理器非常有用。您可以使用產生的報告來查找觸發不必要註解處理器的模組，並更新模組以防止此情況。

分兩步啟用統計資料：

* 在您的 `build.gradle.kts` 中將 `showProcessorStats` 標誌設定為 `true`：

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

* 在您的 `gradle.properties` 中將 `kapt.verbose` Gradle 屬性設定為 `true`：
  
  ```none
  kapt.verbose=true
  ```

> 您也可以透過[命令列選項 `verbose`](kapt.md#use-in-cli) 啟用詳細輸出。
>
{style="note"}

統計資料將以 `info` 等級顯示在日誌中。您將看到 `Annotation processor stats:` 行，其後是每個註解處理器的執行時間統計資料。在這些行之後，將有 `Generated files report:` 行，其後是每個註解處理器產生檔案數量的統計資料。例如：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

請在[此 YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-51132/KAPT-Support-reporting-the-number-of-generated-files-by-each-ann)中留下您的回饋。

### kotlin.compiler.execution.strategy 系統屬性的棄用

Kotlin 1.6.20 引入了[用於定義 Kotlin 編譯器執行策略的新屬性](whatsnew1620.md#properties-for-defining-kotlin-compiler-execution-strategy)。在 Kotlin 1.7.0 中，舊系統屬性 `kotlin.compiler.execution.strategy` 已開始棄用週期，改用新屬性。

當使用 `kotlin.compiler.execution.strategy` 系統屬性時，您將收到警告。此屬性將在未來版本中刪除。要保留舊行為，請用同名的 Gradle 屬性替換系統屬性。您可以在 `gradle.properties` 中執行此操作，例如：

```none
kotlin.compiler.execution.strategy=out-of-process
```

您還可以使用編譯任務屬性 `compilerExecutionStrategy`。在 [Gradle 頁面](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)上了解更多資訊。

### 移除棄用選項、方法和插件

#### 移除 useExperimentalAnnotation 方法

在 Kotlin 1.7.0 中，我們完成了 `useExperimentalAnnotation` Gradle 方法的棄用週期。請改用 `optIn()` 來選擇性啟用在模組中使用 API。

例如，如果您的 Gradle 模組是多平台的：

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

在 Kotlin 中了解有關[選擇性啟用要求](opt-in-requirements.md)的更多資訊。

#### 移除棄用的編譯器選項

我們已完成幾個編譯器選項的棄用週期：

* `kotlinOptions.jdkHome` 編譯器選項在 1.5.30 中棄用，並已在當前版本中移除。如果 Gradle 建置包含此選項，現在將失敗。我們鼓勵您使用 [Java 工具鏈](whatsnew1530.md#support-for-java-toolchains)，它自 Kotlin 1.5.30 起已受支援。
* 棄用的 `noStdlib` 編譯器選項也已移除。Gradle 插件使用 `kotlin.stdlib.default.dependency=true` 屬性來控制 Kotlin 標準函式庫是否存在。

> 編譯器引數 `-jdkHome` 和 `-no-stdlib` 仍然可用。
>
{style="note"}

#### 移除棄用的插件

在 Kotlin 1.4.0 中，`kotlin2js` 和 `kotlin-dce-plugin` 插件被棄用，它們已在此版本中移除。請改用新的 `org.jetbrains.kotlin.js` 插件而不是 `kotlin2js`。當 Kotlin/JS Gradle 插件正確配置時，無用程式碼移除 (DCE) 才會運作。

在 Kotlin 1.6.0 中，我們將 `KotlinGradleSubplugin` 類別的棄用等級變更為 `ERROR`。開發人員使用此類別編寫編譯器插件。在此版本中，[此類別已移除](https://youtrack.jetbrains.com/issue/KT-48831/)。請改用 `KotlinCompilerPluginSupportPlugin` 類別。

> 最佳實踐是在整個專案中使用 1.7.0 及更高版本的 Kotlin 插件。
>
{style="tip"}

#### 移除棄用的協程 DSL 選項和屬性

我們移除了棄用的 `kotlin.experimental.coroutines` Gradle DSL 選項和 `gradle.properties` 中使用的 `kotlin.coroutines` 屬性。現在您只需使用[暫停函數](coroutines-basics.md#extract-function-refactoring)或[將 `kotlinx.coroutines` 依賴項新增](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)到您的建置腳本中即可。

在[協程指南](coroutines-guide.md)中了解有關協程的更多資訊。

#### 移除工具鏈擴展方法中的類型轉換

在 Kotlin 1.7.0 之前，當使用 Kotlin DSL 配置 Gradle 工具鏈時，您必須執行類型轉換為 `JavaToolchainSpec` 類別：

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

現在，您可以省略 `(this as JavaToolchainSpec)` 部分：

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

## 遷移到 Kotlin 1.7.0

### 安裝 Kotlin 1.7.0

IntelliJ IDEA 2022.1 和 Android Studio Chipmunk (212) 會自動建議將 Kotlin 插件更新到 1.7.0。

> 對於 IntelliJ IDEA 2022.2，以及 Android Studio Dolphin (213) 或 Android Studio Electric Eel (221)，Kotlin 插件 1.7.0 將隨即將推出的 IntelliJ IDEA 和 Android Studio 更新一同提供。
> 
{style="note"}

新的命令列編譯器可在 [GitHub 發布頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.7.0)下載。

### 遷移現有專案或使用 Kotlin 1.7.0 開始新專案

* 要將現有專案遷移到 Kotlin 1.7.0，請將 Kotlin 版本更改為 `1.7.0` 並重新導入您的 Gradle 或 Maven 專案。[了解如何更新到 Kotlin 1.7.0](releases.md#update-to-a-new-kotlin-version)。

* 要使用 Kotlin 1.7.0 開始新專案，請更新 Kotlin 插件並從 **File** | **New** | **Project** 執行專案精靈。

### Kotlin 1.7.0 相容性指南

Kotlin 1.7.0 是一個[功能發行版](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能會帶來與您為早期語言版本編寫的程式碼不相容的變更。在 [Kotlin 1.7.0 相容性指南](compatibility-guide-17.md)中找到此類變更的詳細列表。