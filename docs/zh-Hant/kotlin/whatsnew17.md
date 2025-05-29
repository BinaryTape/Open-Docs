[//]: # (title: Kotlin 1.7.0 有什麼新功能)

<tldr>
   <p>Kotlin 1.7.0 的 IDE 支援適用於 IntelliJ IDEA 2021.2、2021.3 和 2022.1。</p>
</tldr>

_[發佈日期：2022 年 6 月 9 日](releases.md#release-details)_

Kotlin 1.7.0 已發佈。它揭示了新的 Kotlin/JVM K2 編譯器的 Alpha 版本，穩定化了語言功能，並為 JVM、JS 和 Native 平台帶來了效能改進。

以下是此版本中的主要更新列表：

*   [新的 Kotlin K2 編譯器現已進入 Alpha 階段](#new-kotlin-k2-compiler-for-the-jvm-in-alpha)，它提供了顯著的效能改進。它僅適用於 JVM，所有編譯器外掛，包括 kapt，都無法與其搭配使用。
*   [Gradle 中增量編譯的新方法](#a-new-approach-to-incremental-compilation)。增量編譯現在也支援在依賴的非 Kotlin 模組中進行的更改，並與 Gradle 相容。
*   我們已穩定化了 [選擇加入需求註解](#stable-opt-in-requirements)、[明確非空類型](#stable-definitely-non-nullable-types) 和 [建構器型別推斷](#stable-builder-inference)。
*   [現在有了用於型別引數的底線運算子](#underscore-operator-for-type-arguments)。當指定其他型別時，您可以使用它自動推斷引數型別。
*   [此版本允許將實作委託給內聯類別的內聯值](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)。您現在可以建立在大多數情況下不分配記憶體的輕量級包裝器。

您也可以在這段影片中找到本次更改的簡短概述：

<video src="https://www.youtube.com/v/54WEfLKtCGk" title="Kotlin 1.7.0 有什麼新功能"/>

## 新的 Kotlin K2 編譯器已進入 JVM Alpha 階段

此 Kotlin 版本推出了新的 Kotlin K2 編譯器的 **Alpha** 版本。新編譯器旨在加速新語言功能的開發，統一 Kotlin 支援的所有平台，帶來效能改進，並為編譯器擴充功能提供 API。

我們已經發布了一些關於我們新編譯器及其優勢的詳細解釋：

*   [邁向新的 Kotlin 編譯器](https://www.youtube.com/watch?v=iTdJJq_LyoY)
*   [K2 編譯器：頂層視圖](https://www.youtube.com/watch?v=db19VFLZqJM)

需要指出的是，對於新 K2 編譯器的 Alpha 版本，我們主要專注於效能改進，它只適用於 JVM 專案。它不支援 Kotlin/JS、Kotlin/Native 或其他多平台專案，所有編譯器外掛，包括 [kapt](kapt.md)，都無法與其搭配使用。

我們的基準測試在內部專案上顯示出一些出色的結果：

| 專案        | 當前 Kotlin 編譯器效能 | 新的 K2 Kotlin 編譯器效能 | 效能提升 |
|---------------|-------------------------------------|------------------------------------|-------------------|
| Kotlin        | 2.2 KLOC/s                          | 4.8 KLOC/s                         | ~ x2.2            |
| YouTrack      | 1.8 KLOC/s                          | 4.2 KLOC/s                         | ~ x2.3            |
| IntelliJ IDEA | 1.8 KLOC/s                          | 3.9 KLOC/s                         | ~ x2.2            |
| Space         | 1.2 KLOC/s                          | 2.8 KLOC/s                         | ~ x2.3            |

> KLOC/s 效能數字代表編譯器每秒處理的千行程式碼數。
>
> {style="tip"}

您可以在您的 JVM 專案中查看效能提升，並與舊編譯器的結果進行比較。要啟用 Kotlin K2 編譯器，請使用以下編譯器選項：

```bash
-Xuse-k2
```

此外，K2 編譯器 [包含許多錯誤修正](https://youtrack.jetbrains.com/issues/KT?q=tag:%20FIR-preview-qa%20%23Resolved)。請注意，此列表中即使是 **State: Open** 的問題也已在 K2 中修復。

未來的 Kotlin 版本將會改進 K2 編譯器的穩定性並提供更多功能，敬請期待！

如果您在使用 Kotlin K2 編譯器時遇到任何效能問題，請向我們的 [問題追蹤器](https://kotl.in/issue) 報告。

## 語言

Kotlin 1.7.0 引入了對委託實作 (implementation by delegation) 的支援和用於型別引數的新底線運算子。它同時穩定化了在先前版本中作為預覽功能引入的幾項語言功能：

*   [將實作委託給內聯類別的內聯值](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)
*   [用於型別引數的底線運算子](#underscore-operator-for-type-arguments)
*   [穩定化建構器型別推斷](#stable-builder-inference)
*   [穩定化選擇加入需求](#stable-opt-in-requirements)
*   [穩定化明確非空類型](#stable-definitely-non-nullable-types)

### 允許將實作委託給內聯類別的內聯值

如果您想為值或類別實例建立一個輕量級包裝器，則有必要手動實作所有介面方法。委託實作解決了這個問題，但在 1.7.0 之前它不適用於內聯類別。此限制已移除，因此您現在可以在大多數情況下建立不分配記憶體的輕量級包裝器。

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

### 用於型別引數的底線運算子

Kotlin 1.7.0 引入了用於型別引數的底線運算子 `_`。當指定其他型別時，您可以使用它自動推斷型別引數：

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
    // T 被推斷為 String，因為 SomeImplementation 派生自 SomeClass<String>
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T 被推斷為 Int，因為 OtherImplementation 派生自 SomeClass<Int>
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```

> 您可以在變數列表中的任何位置使用底線運算子來推斷型別引數。
>
{style="note"}

### 穩定化建構器型別推斷

建構器型別推斷是一種特殊的型別推斷，在呼叫泛型建構器函式時非常有用。它幫助編譯器根據呼叫的型別引數進行推斷，利用其 Lambda 引數內部其他呼叫的型別資訊。

從 1.7.0 開始，如果常規型別推斷無法獲得足夠的型別資訊，建構器型別推斷會自動啟用，而無需指定 `-Xenable-builder-inference` 編譯器選項，該選項於 [1.6.0 引入](whatsnew16.md#changes-to-builder-inference)。

[了解如何編寫自訂泛型建構器](using-builders-with-builder-inference.md)。

### 穩定化選擇加入需求

[選擇加入需求](opt-in-requirements.md) 現已 [穩定](components-stability.md)，並且不需要額外的編譯器配置。

在 1.7.0 之前，選擇加入功能本身需要引數 `-opt-in=kotlin.RequiresOptIn` 以避免警告。它不再需要這個；但是，您仍然可以使用編譯器引數 `-opt-in` 來選擇加入其他註解，[模組](opt-in-requirements.md#opt-in-a-module)。

### 穩定化明確非空類型

在 Kotlin 1.7.0 中，明確非空類型已提升為 [穩定](components-stability.md)。它們在擴充泛型 Java 類別和介面時提供了更好的互通性。

您可以使用新語法 `T & Any` 在使用點將泛型型別參數標記為明確非空。語法形式來自 [交集型別](https://en.wikipedia.org/wiki/Intersection_type) 的表示法，現在僅限於在 `&` 左側具有可空上限的型別參數以及右側的非空 `Any`。

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // 正常
    elvisLike<String>("", "").length
    // 錯誤：'null' 不能是非空型別的值
    elvisLike<String>("", null).length

    // 正常
    elvisLike<String?>(null, "").length
    // 錯誤：'null' 不能是非空型別的值
    elvisLike<String?>(null, null).length
}
```

了解更多關於明確非空類型在 [這個 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md) 中。

## Kotlin/JVM

此版本為 Kotlin/JVM 編譯器帶來了效能改進和一個新的編譯器選項。此外，對函數式介面建構子的可呼叫引用已變得穩定。請注意，從 1.7.0 開始，Kotlin/JVM 編譯的預設目標版本是 `1.8`。

*   [編譯器效能優化](#compiler-performance-optimizations)
*   [新的編譯器選項 `-Xjdk-release`](#new-compiler-option-xjdk-release)
*   [穩定化函數式介面建構子的可呼叫引用](#stable-callable-references-to-functional-interface-constructors)
*   [移除了 JVM 目標版本 1.6](#removed-jvm-target-version-1-6)

### 編譯器效能優化

Kotlin 1.7.0 引入了 Kotlin/JVM 編譯器的效能改進。根據我們的基準測試，與 Kotlin 1.6.0 相比，編譯時間平均 [減少了 10%](https://youtrack.jetbrains.com/issue/KT-48233/Switching-to-JVM-IR-backend-increases-compilation-time-by-more-t#focus=Comments-27-6114542.0-0)。大量使用內聯函式的專案，例如 [使用 `kotlinx.html` 的專案](https://youtrack.jetbrains.com/issue/KT-51416/Compilation-of-kotlinx-html-DSL-should-still-be-faster)，歸功於位元碼後處理的改進，將會編譯得更快。

### 新的編譯器選項：-Xjdk-release

Kotlin 1.7.0 提供了一個新的編譯器選項 `-Xjdk-release`。此選項類似於 [javac 的命令列 `--release` 選項](http://openjdk.java.net/jeps/247)。`-Xjdk-release` 選項控制目標位元碼版本，並將類別路徑中 JDK 的 API 限制為指定的 Java 版本。例如，`kotlinc -Xjdk-release=1.8` 將不允許引用 `java.lang.Module`，即使依賴項中的 JDK 版本為 9 或更高。

> 此選項 [不保證](https://youtrack.jetbrains.com/issue/KT-29974) 對每個 JDK 發行版都有效。
>
{style="note"}

請在 [這個 YouTrack 工單](https://youtrack.jetbrains.com/issue/KT-29974/Add-a-compiler-option-Xjdk-release-similar-to-javac-s-release-to) 上留下您的回饋。

### 穩定化函數式介面建構子的可呼叫引用

對函數式介面建構子的 [可呼叫引用](reflection.md#callable-references) 現已 [穩定](components-stability.md)。了解如何 [從包含建構函式的介面遷移到函數式介面](fun-interfaces.md#migration-from-an-interface-with-constructor-function-to-a-functional-interface) 使用可呼叫引用。

請將您發現的任何問題報告給 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)。

### 移除了 JVM 目標版本 1.6

Kotlin/JVM 編譯的預設目標版本是 `1.8`。`1.6` 目標已移除。

請遷移到 JVM 目標 1.8 或更高版本。了解如何更新 JVM 目標版本，適用於：

*   [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm)
*   [Maven](maven.md#attributes-specific-to-jvm)
*   [命令列編譯器](compiler-reference.md#jvm-target-version)

## Kotlin/Native

Kotlin 1.7.0 包含了對 Objective-C 和 Swift 互通性的更改，並穩定化了在先前版本中引入的功能。它同時為新的記憶體管理器帶來了效能改進以及其他更新：

*   [新的記憶體管理器的效能改進](#performance-improvements-for-the-new-memory-manager)
*   [與 JVM 和 JS IR 後端統一的編譯器外掛 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
*   [支援獨立 Android 可執行檔](#support-for-standalone-android-executables)
*   [與 Swift async/await 互通：返回 `Void` 而非 `KotlinUnit`](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
*   [禁止透過 Objective-C 橋接器使用未聲明的異常](#prohibited-undeclared-exceptions-through-objective-c-bridges)
*   [改進的 CocoaPods 整合](#improved-cocoapods-integration)
*   [覆寫 Kotlin/Native 編譯器下載 URL](#overriding-the-kotlin-native-compiler-download-url)

### 新的記憶體管理器的效能改進

> 新的 Kotlin/Native 記憶體管理器目前處於 [Alpha](components-stability.md) 階段。
> 未來可能會有不相容的變更，並需要手動遷移。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中提供回饋。
>
{style="note"}

新的記憶體管理器仍處於 Alpha 階段，但正在朝著 [穩定](components-stability.md) 發展。此版本為新的記憶體管理器帶來了顯著的效能改進，尤其是在垃圾回收 (GC) 方面。具體來說，於 [1.6.20 引入](whatsnew1620.md) 的掃描階段的併發實作現在預設啟用。這有助於減少應用程式因 GC 而暫停的時間。新的 GC 排程器在選擇 GC 頻率方面表現更好，特別是對於更大的堆記憶體 (heaps)。

我們還專門優化了偵錯二進位檔，確保在記憶體管理器的實作程式碼中使用了適當的優化等級和鏈結時間優化。這幫助我們在基準測試中將偵錯二進位檔的執行時間提高了約 30%。

請在您的專案中嘗試使用新的記憶體管理器以了解其運作方式，並在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中與我們分享您的回饋。

### 與 JVM 和 JS IR 後端統一的編譯器外掛 ABI

從 Kotlin 1.7.0 開始，Kotlin 多平台 Gradle 外掛預設使用 Kotlin/Native 的可嵌入編譯器 jar。此 [功能於 1.6.0 宣布](whatsnew16.md#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends) 為實驗性 (Experimental)，現在已穩定並可供使用。

這項改進對函式庫作者來說非常方便，因為它改進了編譯器外掛的開發體驗。在此版本之前，您必須為 Kotlin/Native 提供單獨的 artifacts，但現在您可以為 Native 和其他支援的平台使用相同的編譯器外掛 artifacts。

> 此功能可能要求外掛開發者對其現有外掛採取遷移步驟。
>
> 了解如何為更新準備您的外掛在 [這個 YouTrack 工單](https://youtrack.jetbrains.com/issue/KT-48595) 中。
>
{style="warning"}

### 支援獨立 Android 可執行檔

Kotlin 1.7.0 提供了生成 Android Native 目標標準可執行檔的完整支援。它於 [1.6.20 引入](whatsnew1620.md#support-for-standalone-android-executables)，現在預設啟用。

如果您想恢復到 Kotlin/Native 生成共享函式庫的舊行為，請使用以下設定：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

### 與 Swift async/await 互通：返回 `Void` 而非 `KotlinUnit`

Kotlin `suspend` 函式在 Swift 中現在返回 `Void` 型別而非 `KotlinUnit`。這是與 Swift 的 `async`/`await` 互通性改進的結果。此功能於 [1.6.20 引入](whatsnew1620.md#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)，此版本預設啟用此行為。

您不再需要使用 `kotlin.native.binary.unitSuspendFunctionObjCExport=proper` 屬性來為這類函式返回正確的型別。

### 禁止透過 Objective-C 橋接器使用未聲明的異常

當您從 Swift/Objective-C 程式碼呼叫 Kotlin 程式碼（或反之）且此程式碼拋出異常時，應由發生異常的程式碼處理，除非您明確允許在語言之間透過適當的轉換來轉發異常（例如，使用 `@Throws` 註解）。

以前，Kotlin 有另一個意外的行為，即在某些情況下，未聲明的異常可能會從一種語言「洩漏」到另一種語言。Kotlin 1.7.0 修正了這個問題，現在這類情況會導致程式終止。

舉例來說，如果您在 Kotlin 中有一個 `{ throw Exception() }` 的 lambda，並從 Swift 中呼叫它，在 Kotlin 1.7.0 中，一旦異常到達 Swift 程式碼，程式就會終止。在以前的 Kotlin 版本中，這樣的異常可能會洩漏到 Swift 程式碼。

`@Throws` 註解仍如之前一樣運作。

### 改進的 CocoaPods 整合

從 Kotlin 1.7.0 開始，如果您想在專案中整合 CocoaPods，您不再需要安裝 `cocoapods-generate` 外掛。

以前，您需要同時安裝 CocoaPods 依賴管理器和 `cocoapods-generate` 外掛才能使用 CocoaPods，例如，在 Kotlin 多平台行動專案中處理 [iOS 依賴](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-dependencies.html#with-cocoapods)。

現在設定 CocoaPods 整合變得更容易了，並且我們解決了 `cocoapods-generate` 無法在 Ruby 3 及更高版本上安裝的問題。現在也支援在 Apple M1 上運作更好的最新 Ruby 版本。

了解如何設定 [初始 CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html#set-up-an-environment-to-work-with-cocoapods)。

### 覆寫 Kotlin/Native 編譯器下載 URL

從 Kotlin 1.7.0 開始，您可以自訂 Kotlin/Native 編譯器的下載 URL。這在 CI 上禁止外部鏈結時很有用。

要覆寫預設基礎 URL `https://download.jetbrains.com/kotlin/native/builds`，請使用以下 Gradle 屬性：

```none
kotlin.native.distribution.baseDownloadUrl=https://example.com
```

> 下載器會將 native 版本和目標作業系統附加到這個基礎 URL 後面，以確保它下載的是實際的編譯器發行版。
>
{style="note"}

## Kotlin/JS

Kotlin/JS 正在獲得對 [JS IR 編譯器後端](js-ir-compiler.md) 的進一步改進，以及其他可以改善您的開發體驗的更新：

*   [新的 IR 後端效能改進](#performance-improvements-for-the-new-ir-backend)
*   [使用 IR 時成員名稱的最小化](#minification-for-member-names-when-using-ir)
*   [透過 IR 後端的 polyfills 支援舊版瀏覽器](#support-for-older-browsers-via-polyfills-in-the-ir-backend)
*   [從 js 表達式動態載入 JavaScript 模組](#dynamically-load-javascript-modules-from-js-expressions)
*   [為 JavaScript 測試執行器指定環境變數](#specify-environment-variables-for-javascript-test-runners)

### 新的 IR 後端效能改進

此版本有一些主要更新，應能改善您的開發體驗：

*   Kotlin/JS 的增量編譯效能已顯著提升。建立 JS 專案所需的時間更少。現在，在許多情況下，增量重建的效能應該與舊版後端大致相當。
*   Kotlin/JS 最終的 bundle 所需空間更少，因為我們已顯著減少了最終 artifacts 的大小。對於一些大型專案，我們測量到生產 bundle 大小與舊版後端相比減少了高達 20%。
*   介面的型別檢查效能已提高了幾個數量級。
*   Kotlin 生成更高品質的 JS 程式碼

### 使用 IR 時成員名稱的最小化

Kotlin/JS IR 編譯器現在使用其內部關於 Kotlin 類別和函式之間關係的資訊，以應用更高效的最小化 (minification)，縮短函式、屬性和類別的名稱。這縮小了最終的打包應用程式。

當您以生產模式建置 Kotlin/JS 應用程式時，會自動應用此類最小化，並預設啟用。要禁用成員名稱最小化，請使用 `-Xir-minimized-member-names` 編譯器旗標：

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xir-minimized-member-names=false")
        }
    }
}
```

### 透過 IR 後端的 polyfills 支援舊版瀏覽器

用於 Kotlin/JS 的 IR 編譯器後端現在包含了與舊版後端相同的 polyfills。這使得用新編譯器編譯的程式碼可以在不支援 Kotlin 標準函式庫使用的所有 ES2015 方法的舊版瀏覽器中執行。只有專案實際使用的 polyfills 才包含在最終的 bundle 中，這最大程度地減少了它們對 bundle 大小的潛在影響。

使用 IR 編譯器時，此功能預設啟用，您無需配置它。

### 從 js 表達式動態載入 JavaScript 模組

當使用 JavaScript 模組時，大多數應用程式使用靜態匯入，其使用已涵蓋在 [JavaScript 模組整合](js-modules.md) 中。然而，Kotlin/JS 缺少一種在應用程式執行時動態載入 JavaScript 模組的機制。

從 Kotlin 1.7.0 開始，JavaScript 的 `import` 語句在 `js` 區塊中得到支援，允許您在執行時動態地將套件引入到您的應用程式中：

```kotlin
val myPackage = js("import('my-package')")
```

### 為 JavaScript 測試執行器指定環境變數

為了調整 Node.js 套件解析或向 Node.js 測試傳遞外部資訊，您現在可以指定 JavaScript 測試執行器使用的環境變數。要定義環境變數，請在您的建置腳本中 `testTask` 區塊內使用 `environment()` 函式並帶有鍵值對：

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

在 Kotlin 1.7.0 中，標準函式庫 (standard library) 獲得了一系列更改和改進。它們引入了新功能，穩定化了實驗性功能，並統一了 Native、JS 和 JVM 的命名捕獲組支援：

*   [min() 和 max() 集合函式返回為非空](#min-and-max-collection-functions-return-as-non-nullable)
*   [在特定索引處的正規表示式匹配](#regular-expression-matching-at-specific-indices)
*   [擴展了對舊語言和 API 版本的支援](#extended-support-for-previous-language-and-api-versions)
*   [透過反射存取註解](#access-to-annotations-via-reflection)
*   [穩定化深度遞迴函式](#stable-deep-recursive-functions)
*   [基於內聯類別的預設時間源時間標記](#time-marks-based-on-inline-classes-for-default-time-source)
*   [Java Optionals 的新實驗性擴展函式](#new-experimental-extension-functions-for-java-optionals)
*   [JS 和 Native 中對命名捕獲組的支援](#support-for-named-capturing-groups-in-js-and-native)

### min() 和 max() 集合函式返回為非空

在 [Kotlin 1.4.0](whatsnew14.md) 中，我們將集合函式 `min()` 和 `max()` 更名為 `minOrNull()` 和 `maxOrNull()`。這些新名稱更好地反映了它們的行為——如果接收集合為空則返回 null。這也有助於使函式的行為與整個 Kotlin 集合 API 中使用的命名約定保持一致。

對於 `minBy()`、`maxBy()`、`minWith()` 和 `maxWith()` 也是如此，它們都在 Kotlin 1.4.0 中獲得了 *OrNull() 同義詞。受此更改影響的舊函式已逐步棄用。

Kotlin 1.7.0 重新引入了原始的函式名稱，但帶有非空返回型別。新的 `min()`、`max()`、`minBy()`、`maxBy()`、`minWith()` 和 `maxWith()` 函式現在嚴格返回集合元素或拋出異常。

```kotlin
fun main() {
    val numbers = listOf<Int>()
    println(numbers.maxOrNull()) // "null"
    println(numbers.max()) // "Exception in... Collection is empty."
}
```

### 在特定索引處的正規表示式匹配

[於 1.5.30 引入](whatsnew1530.md#matching-with-regex-at-a-particular-position) 的 `Regex.matchAt()` 和 `Regex.matchesAt()` 函式現已穩定。它們提供了一種檢查正規表示式是否在 `String` 或 `CharSequence` 的特定位置有精確匹配的方法。

`matchesAt()` 檢查是否匹配並返回布林結果：

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    // regular expression: one digit, dot, one digit, dot, one or more digits
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
}
```

`matchAt()` 如果找到匹配，則返回匹配結果，否則返回 `null`：

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.7.0"
}
```

我們非常感謝您在 [這個 YouTrack 工單](https://youtrack.jetbrains.com/issue/KT-34021) 上提供回饋。

### 擴展了對舊語言和 API 版本的支援

為了支援函式庫作者開發可在廣泛的 Kotlin 舊版本中使用的函式庫，並解決 Kotlin 主要版本發布頻率增加的問題，我們已擴展了對舊語言和 API 版本的支援。

在 Kotlin 1.7.0 中，我們支援三個而不是兩個先前的語言和 API 版本。這意味著 Kotlin 1.7.0 支援開發目標為 Kotlin 1.4.0 或更舊版本的函式庫。有關向後相容性的更多資訊，請參閱 [相容性模式](compatibility-modes.md)。

### 透過反射存取註解

[於 1.6.0 首次引入](whatsnew16.md#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target) 的 `KAnnotatedElement.findAnnotations()` 擴展函式現已 [穩定](components-stability.md)。這個 [反射](reflection.md) 函式返回元素上指定型別的所有註解，包括單獨應用和重複的註解。

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

### 穩定化深度遞迴函式

深度遞迴函式 (Deep recursive functions) 自 [Kotlin 1.4.0](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/#Defining_deep_recursive_functions_using_coroutines) 起作為實驗性功能提供，現在在 Kotlin 1.7.0 中已 [穩定](components-stability.md)。使用 `DeepRecursiveFunction`，您可以定義一個將其堆疊保留在堆上而非使用實際呼叫堆疊的函式。這允許您執行非常深的遞迴計算。要呼叫深度遞迴函式，請 `invoke` 它。

在此範例中，深度遞迴函式用於遞迴計算二元樹的深度。即使這個範例函式遞迴呼叫自己 100,000 次，也不會拋出 `StackOverflowError`：

```kotlin
class Tree(val left: Tree?, val right: Tree?)

val calculateDepth = DeepRecursiveFunction<Tree?, Int> { t ->
    if (t == null) 0 else maxOf(
        callRecursive(t.left),
        callRecursive(t.right)
    ) + 1
}

fun main() {
    // Generate a tree with a depth of 100_000
    val deepTree = generateSequence(Tree(null, null)) { prev ->
        Tree(prev, null)
    }.take(100_000).last()

    println(calculateDepth(deepTree)) // 100000
}
```

如果您的遞迴深度超過 1000 次呼叫，請考慮在您的程式碼中使用深度遞迴函式。

### 基於內聯類別的預設時間源時間標記

Kotlin 1.7.0 改進了時間測量功能的效能，透過將 `TimeSource.Monotonic` 返回的時間標記變更為內聯值類別。這意味著呼叫 `markNow()`、`elapsedNow()`、`measureTime()` 和 `measureTimedValue()` 等函式時，不會為其 `TimeMark` 實例分配包裝類別。特別是在測量熱門路徑 (hot path) 中的程式碼片段時，這有助於最大程度地減少測量的效能影響：

```kotlin
@OptIn(ExperimentalTime::class)
fun main() {
    val mark = TimeSource.Monotonic.markNow() // Returned `TimeMark` is inline class
    val elapsedDuration = mark.elapsedNow()
}
```

> 此優化僅在靜態已知獲取 `TimeMark` 的時間源為 `TimeSource.Monotonic` 時才可用。
>
{style="note"}

### Java Optionals 的新實驗性擴展函式

Kotlin 1.7.0 帶來了新的便利函式，簡化了 Java 中 `Optional` 類別的使用。這些新函式可用於在 JVM 上解封和轉換可選物件，並有助於使 Java API 的使用更加簡潔。

`getOrNull()`、`getOrDefault()` 和 `getOrElse()` 擴展函式允許您在 `Optional` 存在時獲取其值。否則，您將分別獲得 `null`、預設值或由函式返回的值：

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

`toList()`、`toSet()` 和 `asSequence()` 擴展函式將存在的 `Optional` 值轉換為列表、集合或序列，否則返回一個空集合。`toCollection()` 擴展函式將 `Optional` 值附加到一個已存在的目標集合中：

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

這些擴展函式作為實驗性功能引入 Kotlin 1.7.0。您可以從 [這個 KEEP](https://github.com/Kotlin/KEEP/pull/291) 中了解更多關於 `Optional` 擴展的資訊。我們一如既往地歡迎您在 [Kotlin 問題追蹤器](https://kotl.in/issue) 中提供回饋。

### JS 和 Native 中對命名捕獲組的支援

從 Kotlin 1.7.0 開始，命名捕獲組 (named capturing groups) 不僅在 JVM 上受支援，在 JS 和 Native 平台上也受支援。

要為捕獲組命名，請在您的正規表示式中使用 `(?<name>group)` 語法。要獲取組匹配的文本，呼叫新引入的 [`MatchGroupCollection.get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/get.html) 函式並傳遞組名稱。

#### 透過名稱檢索匹配的組值

考慮這個匹配城市座標的範例。要獲取正規表示式匹配的組集合，請使用 [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html)。比較透過其編號（索引）和使用 `value` 透過其名稱檢索組內容的方式：

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

您現在也可以在反向引用組時使用組名稱。反向引用匹配先前由捕獲組匹配的相同文本。為此，請在您的正規表示式中使用 `\k<name>` 語法：

```kotlin
fun backRef() {
    val regex = "(?<title>\\w+), yes \\k<title>".toRegex()
    val match = regex.find("Do you copy? Sir, yes Sir!")!!
    println(match.value) // "Sir, yes Sir"
    println(match.groups["title"]?.value) // "Sir"
}
```

#### 替換表達式中的命名組

命名組引用可以用於替換表達式。考慮 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 函式，它將輸入中指定正規表示式的所有出現替換為替換表達式，以及 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) 函式，它只替換第一個匹配項。

替換字串中 `${name}` 的出現會被替換為與指定名稱的捕獲組相對應的子序列。您可以比較組引用中按名稱和索引進行的替換：

```kotlin
fun dateReplace() {
    val dateRegex = Regex("(?<dd>\\d{2})-(?<mm>\\d{2})-(?<yyyy>\\d{4})")
    val input = "Date of birth: 27-04-2022"
    println(dateRegex.replace(input, "${yyyy}-${mm}-${dd}")) // "出生日期: 2022-04-27" — 按名稱
    println(dateRegex.replace(input, "$3-$2-$1")) // "出生日期: 2022-04-27" — 按編號
}
```

## Gradle

此版本引入了新的建置報告、支援 Gradle 外掛變體、kapt 中的新統計數據，以及更多功能：

*   [增量編譯的新方法](#a-new-approach-to-incremental-compilation)
*   [用於追蹤編譯器效能的建置報告](#build-reports-for-kotlin-compiler-tasks)
*   [最低支援 Gradle 和 Android Gradle 外掛版本的更改](#bumping-minimum-supported-versions)
*   [支援 Gradle 外掛變體](#support-for-gradle-plugin-variants)
*   [Kotlin Gradle 外掛 API 的更新](#updates-in-the-kotlin-gradle-plugin-api)
*   [sam-with-receiver 外掛可透過外掛 API 取得](#the-sam-with-receiver-plugin-is-available-via-the-plugins-api)
*   [編譯任務的更改](#changes-in-compile-tasks)
*   [kapt 中每個註解處理器生成的文件數量新統計數據](#statistics-of-generated-files-by-each-annotation-processor-in-kapt)
*   [棄用 kotlin.compiler.execution.strategy 系統屬性](#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)
*   [移除已棄用的選項、方法和外掛](#removal-of-deprecated-options-methods-and-plugins)

### 增量編譯的新方法

> 增量編譯的新方法是 [實驗性](components-stability.md) 的。它可能隨時被放棄或更改。
> 需要選擇加入（詳情請見下文）。我們鼓勵您僅將其用於評估目的，並感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供回饋。
>
{style="warning"}

在 Kotlin 1.7.0 中，我們重新設計了跨模組更改的增量編譯。現在，增量編譯也支援在依賴的非 Kotlin 模組中進行的更改，並與 [Gradle 建置快取](https://docs.gradle.org/current/userguide/build_cache.html) 相容。編譯避免的支援也得到了改進。

我們預計，如果您使用建置快取或頻繁地在非 Kotlin Gradle 模組中進行更改，您將看到這種新方法帶來最顯著的效益。在快取命中後，對於更改，我們在 `kotlin-gradle-plugin` 模組上對 Kotlin 專案的測試顯示有超過 80% 的改進。

要嘗試這種新方法，請在您的 `gradle.properties` 中設定以下選項：

```none
kotlin.incremental.useClasspathSnapshot=true
```

> 增量編譯的新方法目前僅適用於 Gradle 建置系統中的 JVM 後端。
>
{style="note"}

了解增量編譯的新方法在底層是如何實作的在 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/) 中。

我們的計畫是穩定這項技術，並為其他後端（例如 JS）和建置系統新增支援。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中報告關於您在此編譯方案中遇到的任何問題或異常行為。謝謝！

Kotlin 團隊非常感謝 [Ivan Gavrilovic](https://github.com/gavra0)、[Hung Nguyen](https://github.com/hungvietnguyen)、[Cédric Champeau](https://github.com/melix) 以及其他外部貢獻者的幫助。

### 用於 Kotlin 編譯器任務的建置報告

> Kotlin 建置報告是 [實驗性](components-stability.md) 的。它們可能隨時被放棄或更改。
> 需要選擇加入（詳情請見下文）。僅將它們用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中對它們提供回饋。
>
{style="warning"}

Kotlin 1.7.0 引入了建置報告，有助於追蹤編譯器效能。報告包含不同編譯階段的持續時間以及編譯無法增量的原因。

當您想調查編譯器任務的問題時，建置報告會派上用場，例如：

*   當 Gradle 建置花費太多時間，並且您想了解效能不佳的根本原因時。
*   當同一個專案的編譯時間不同時，有時只需幾秒鐘，有時卻需要幾分鐘。

要啟用建置報告，請在您的 `gradle.properties` 中聲明建置報告輸出應儲存的位置：

```none
kotlin.build.report.output=file
```

以下值（及其組合）可用：

*   `file` 將建置報告儲存在本機檔案中。
*   `build_scan` 將建置報告儲存在 [建置掃描](https://scans.gradle.com/) 的 `custom values` 部分。

  > Gradle Enterprise 外掛會限制自訂值的數量和長度。在大型專案中，某些值可能會遺失。
  >
  {style="note"}

*   `http` 使用 HTTP(S) 發布建置報告。POST 方法以 JSON 格式發送度量。資料可能因版本而異。您可以在 [Kotlin 儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt) 中查看已發送資料的當前版本。

分析長時間運行的編譯的建置報告可以幫助您解決兩種常見情況：

*   建置不是增量的。分析原因並修復潛在問題。
*   建置是增量的，但花費了太多時間。嘗試重組原始碼文件 — 拆分大檔案，將單獨的類別儲存在不同的檔案中，重構大型類別，在不同的檔案中聲明頂層函式等等。

了解更多關於新的建置報告在 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/) 中。

歡迎您在您的基礎設施中嘗試使用建置報告。如果您有任何回饋、遇到任何問題或想提出改進建議，請隨時向我們的 [問題追蹤器](https://youtrack.jetbrains.com/newIssue) 報告。謝謝！

### 最低支援版本更新

從 Kotlin 1.7.0 開始，最低支援的 Gradle 版本是 6.7.1。我們不得不 [提高版本](https://youtrack.jetbrains.com/issue/KT-49733/Bump-minimal-supported-Gradle-version-to-6-7-1) 以支援 [Gradle 外掛變體](#support-for-gradle-plugin-variants) 和新的 Gradle API。未來，由於 Gradle 外掛變體功能，我們應該不再需要頻繁地提高最低支援版本。

此外，最低支援的 Android Gradle 外掛版本現在是 3.6.4。

### 支援 Gradle 外掛變體

Gradle 7.0 引入了一項針對 Gradle 外掛作者的新功能 — [帶有變體的外掛](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)。這項功能使得在為新的 Gradle 功能新增支援的同時，維護與 7.1 以下 Gradle 版本的相容性變得更容易。了解更多關於 [Gradle 中的變體選擇](https://docs.gradle.org/current/userguide/variant_model.html)。

透過 Gradle 外掛變體，我們可以為不同的 Gradle 版本提供不同的 Kotlin Gradle 外掛變體。目標是在 `main` 變體中支援基本的 Kotlin 編譯，它對應於最舊的受支援 Gradle 版本。每個變體都將針對相應版本的 Gradle 功能提供實作。最新的變體將支援最廣泛的 Gradle 功能集。透過這種方法，我們可以擴展對功能有限的舊版 Gradle 的支援。

目前，Kotlin Gradle 外掛只有兩個變體：

*   `main` 適用於 Gradle 6.7.1–6.9.3 版本
*   `gradle70` 適用於 Gradle 7.0 及更高版本

在未來的 Kotlin 版本中，我們可能會添加更多變體。

要檢查您的建置使用了哪個變體，請啟用 [`--info` 日誌級別](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)，並在輸出中找到以 `Using Kotlin Gradle plugin` 開頭的字串，例如 `Using Kotlin Gradle plugin main variant`。

> 以下是一些 Gradle 中變體選擇已知問題的解決方法：
> *   [pluginManagement 中的 ResolutionStrategy 對於多變體外掛不起作用](https://github.com/gradle/gradle/issues/20545)
> *   [當外掛作為 `buildSrc` 共同依賴項添加時，外掛變體被忽略](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

請在 [這個 YouTrack 工單](https://youtrack.jetbrains.com/issue/KT-49227/Support-Gradle-plugins-variants) 上留下您的回饋。

### Kotlin Gradle 外掛 API 的更新

Kotlin Gradle 外掛 API artifact 獲得了多項改進：

*   為 Kotlin/JVM 和 Kotlin/kapt 任務提供了新的介面，帶有使用者可配置的輸入。
*   有一個新的 `KotlinBasePlugin` 介面，所有 Kotlin 外掛都繼承自它。當您希望在應用任何 Kotlin Gradle 外掛（JVM、JS、多平台、Native 和其他平台）時觸發某些配置操作時，請使用此介面：

  ```kotlin
  project.plugins.withType<org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin>() {
      // Configure your action here
  }
  ```
  您可以將您對 `KotlinBasePlugin` 的回饋留在 [這個 YouTrack 工單](https://youtrack.jetbrains.com/issue/KT-48008/Consider-offering-a-KotlinBasePlugin) 中。

*   我們為 Android Gradle 外掛在其內部配置 Kotlin 編譯奠定了基礎，這意味著您無需將 Kotlin Android Gradle 外掛添加到您的建置中。
  請關注 [Android Gradle 外掛發布公告](https://developer.android.com/studio/releases/gradle-plugin) 以了解新增的支援並試用！

### sam-with-receiver 外掛可透過外掛 API 取得

[sam-with-receiver 編譯器外掛](sam-with-receiver-plugin.md) 現在可透過 [Gradle 外掛 DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block) 取得：

```kotlin
plugins {
    id("org.jetbrains.kotlin.plugin.sam.with.receiver") version "$kotlin_version"
}
```

### 編譯任務的更改

本版本中，編譯任務獲得了許多更改：

*   Kotlin 編譯任務不再繼承 Gradle 的 `AbstractCompile` 任務。它們只繼承 `DefaultTask`。
*   `AbstractCompile` 任務有 `sourceCompatibility` 和 `targetCompatibility` 輸入。由於不再繼承 `AbstractCompile` 任務，這些輸入在 Kotlin 使用者的腳本中不再可用。
*   `SourceTask.stableSources` 輸入不再可用，您應該使用 `sources` 輸入。`setSource(...)` 方法仍然可用。
*   所有編譯任務現在都使用 `libraries` 輸入來獲取編譯所需的函式庫列表。`KotlinCompile` 任務仍然包含已棄用的 Kotlin 屬性 `classpath`，該屬性將在未來版本中移除。
*   編譯任務仍然實作 `PatternFilterable` 介面，它允許過濾 Kotlin 原始碼。`sourceFilesExtensions` 輸入已被移除，以支援使用 `PatternFilterable` 方法。
*   已棄用的 `Gradle destinationDir: File` 輸出已被 `destinationDirectory: DirectoryProperty` 輸出取代。
*   Kotlin/Native 的 `AbstractNativeCompile` 任務現在繼承 `AbstractKotlinCompileTool` 基類。這是將 Kotlin/Native 建置工具整合到所有其他工具中的初始步驟。

請在 [這個 YouTrack 工單](https://youtrack.jetbrains.com/issue/KT-32805) 中留下您的回饋。

### kapt 中每個註解處理器生成的文件數量新統計數據

`kotlin-kapt` Gradle 外掛已經 [報告每個處理器的效能統計數據](https://github.com/JetBrains/kotlin/pull/4280)。從 Kotlin 1.7.0 開始，它還可以報告每個註解處理器生成的文件數量統計數據。

這有助於追蹤建置中是否存在未使用的註解處理器。您可以使用生成的報告來查找觸發不必要註解處理器的模組，並更新這些模組以防止這種情況發生。

分兩步啟用統計數據：

*   在您的 `build.gradle.kts` 中將 `showProcessorStats` 旗標設定為 `true`：

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

*   在您的 `gradle.properties` 中將 `kapt.verbose` Gradle 屬性設定為 `true`：
  
  ```none
  kapt.verbose=true
  ```

> 您也可以透過 [命令列選項 `verbose`](kapt.md#use-in-cli) 啟用詳細輸出。
>
{style="note"}

統計數據將以 `info` 級別顯示在日誌中。您會看到 `Annotation processor stats:` 行，後面是每個註解處理器的執行時間統計。在這些行之後，會有 `Generated files report:` 行，後面是每個註解處理器生成的文件數量統計。例如：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

請在 [這個 YouTrack 工單](https://youtrack.jetbrains.com/issue/KT-51132/KAPT-Support-reporting-the-number-of-generated-files-by-each-ann) 中留下您的回饋。

### 棄用 kotlin.compiler.execution.strategy 系統屬性

Kotlin 1.6.20 [引入了用於定義 Kotlin 編譯器執行策略的新屬性](whatsnew1620.md#properties-for-defining-kotlin-compiler-execution-strategy)。在 Kotlin 1.7.0 中，舊的系統屬性 `kotlin.compiler.execution.strategy` 已開始棄用週期，轉而支援新屬性。

當使用 `kotlin.compiler.execution.strategy` 系統屬性時，您將收到警告。此屬性將在未來版本中刪除。為了保留舊行為，請將此系統屬性替換為同名的 Gradle 屬性。您可以在 `gradle.properties` 中這樣做，例如：

```none
kotlin.compiler.execution.strategy=out-of-process
```

您也可以使用編譯任務屬性 `compilerExecutionStrategy`。在 [Gradle 頁面](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy) 上了解更多資訊。

### 移除已棄用的選項、方法和外掛

#### 移除 useExperimentalAnnotation 方法

在 Kotlin 1.7.0 中，我們完成了 `useExperimentalAnnotation` Gradle 方法的棄用週期。請改用 `optIn()` 以便在模組中選擇加入 API 的使用。

例如，如果您的 Gradle 模組是多平台的：

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

了解更多關於 Kotlin 中的 [選擇加入需求](opt-in-requirements.md)。

#### 移除已棄用的編譯器選項

我們已完成了幾個編譯器選項的棄用週期：

*   `kotlinOptions.jdkHome` 編譯器選項在 1.5.30 中已棄用，並已在當前版本中移除。如果 Gradle 建置包含此選項，現在將會失敗。我們鼓勵您使用自 Kotlin 1.5.30 起已支援的 [Java 工具鏈](whatsnew1530.md#support-for-java-toolchains)。
*   已棄用的 `noStdlib` 編譯器選項也已移除。Gradle 外掛使用 `kotlin.stdlib.default.dependency=true` 屬性來控制 Kotlin 標準函式庫是否存在。

> 編譯器引數 `-jdkHome` 和 `-no-stdlib` 仍然可用。
>
{style="note"}

#### 移除已棄用的外掛

在 Kotlin 1.4.0 中，`kotlin2js` 和 `kotlin-dce-plugin` 外掛已棄用，並已在此版本中移除。請改用新的 `org.jetbrains.kotlin.js` 外掛。當 Kotlin/JS Gradle 外掛 [正確配置](javascript-dce.md) 時，死程式碼消除 (DCE) 才會運作。

在 Kotlin 1.6.0 中，我們將 `KotlinGradleSubplugin` 類別的棄用級別更改為 `ERROR`。開發人員曾使用此類別編寫編譯器外掛。在此版本中，[此類別已移除](https://youtrack.jetbrains.com/issue/KT-48831/)。請改用 `KotlinCompilerPluginSupportPlugin` 類別。

> 最佳實踐是在整個專案中一致使用 1.7.0 及更高版本的 Kotlin 外掛。
>
{style="tip"}

#### 移除已棄用的協程 DSL 選項和屬性

我們移除了已棄用的 `kotlin.experimental.coroutines` Gradle DSL 選項和 `gradle.properties` 中使用的 `kotlin.coroutines` 屬性。現在您只需使用 _[ suspending 函式](coroutines-basics.md#extract-function-refactoring)_ 或 [將 `kotlinx.coroutines` 依賴項](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library) 添加到您的建置腳本中。

了解更多關於 [協程 (coroutines) 的資訊](coroutines-guide.md)。

#### 移除工具鏈擴展方法中的類型轉換

在 Kotlin 1.7.0 之前，當使用 Kotlin DSL 配置 Gradle 工具鏈時，您必須將型別轉換為 `JavaToolchainSpec` 類別：

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

IntelliJ IDEA 2022.1 和 Android Studio Chipmunk (212) 會自動建議將 Kotlin 外掛更新到 1.7.0。

> 對於 IntelliJ IDEA 2022.2 以及 Android Studio Dolphin (213) 或 Android Studio Electric Eel (221)，Kotlin 外掛 1.7.0 將隨即將發布的 IntelliJ IDEA 和 Android Studios 更新一起提供。
> 
{style="note"}

新的命令列編譯器可供下載在 [GitHub 發布頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.7.0) 上。

### 遷移現有專案或啟動新專案並使用 Kotlin 1.7.0

*   要將現有專案遷移到 Kotlin 1.7.0，請將 Kotlin 版本更改為 `1.7.0` 並重新匯入您的 Gradle 或 Maven 專案。[了解如何更新到 Kotlin 1.7.0](releases.md#update-to-a-new-kotlin-version)。

*   要啟動一個新專案並使用 Kotlin 1.7.0，請更新 Kotlin 外掛，並從 **File** | **New** | **Project** 執行專案精靈 (Project Wizard)。

### Kotlin 1.7.0 相容性指南

Kotlin 1.7.0 是一個 [功能發布版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能會帶來與您為早期語言版本編寫的程式碼不相容的更改。
在 [Kotlin 1.7.0 相容性指南](compatibility-guide-17.md) 中找到此類更改的詳細列表。