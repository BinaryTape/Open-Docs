---
title: "Kotlin 1.7.0 的新特性"
---
:::info
<p>
   Kotlin 1.7.0 的 IDE 支援適用於 IntelliJ IDEA 2021.2、2021.3 和 2022.1。
</p>
:::

_[已發布：2022 年 6 月 9 日](releases#release-details)_

Kotlin 1.7.0 已經發布。它揭示了新的 Kotlin/JVM K2 編譯器的 Alpha 版本、穩定了語言功能，並為 JVM、JS 和 Native 平台帶來了效能改進。

以下是此版本中的主要更新列表：

* [新的 Kotlin K2 編譯器現在是 Alpha 版](#new-kotlin-k2-compiler-for-the-jvm-in-alpha)，它提供了顯著的效能改進。它僅適用於 JVM，並且包括 kapt 在內的所有編譯器外掛程式都無法與之協同運作。
* [Gradle 中增量編譯的新方法](#a-new-approach-to-incremental-compilation)。現在也支援對依賴的非 Kotlin 模組內所做的變更進行增量編譯，並且與 Gradle 相容。
* 我們已經穩定了[選擇加入需求註解](#stable-opt-in-requirements)、[明確的非空類型](#stable-definitely-non-nullable-types)和[建構器推斷](#stable-builder-inference)。
* [現在有一個用於類型引數的底線運算子](#underscore-operator-for-type-arguments)。當指定其他類型時，您可以使用它來自動推斷引數的類型。
* [此版本允許透過委託來實作 inline 類別的 inline value](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)。現在，您可以建立輕量級包裝函式，在大多數情況下不會配置記憶體。

您也可以在此影片中找到變更的簡短概述：

<video src="https://www.youtube.com/v/54WEfLKtCGk" title="What's new in Kotlin 1.7.0"/>

## 用於 JVM 的新 Kotlin K2 編譯器（Alpha 版）

此 Kotlin 版本引入了新的 Kotlin K2 編譯器的 **Alpha** 版本。新編譯器的目標是加速新語言功能的開發、統一 Kotlin 支援的所有平台、帶來效能改進，並為編譯器擴充功能提供 API。

我們已經發布了一些關於我們的新編譯器及其優點的詳細說明：

* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

重要的是要指出，對於新的 K2 編譯器的 Alpha 版本，我們主要關注效能改進，並且它僅適用於 JVM 專案。它不支援 Kotlin/JS、Kotlin/Native 或其他多平台專案，並且包括 [kapt](kapt) 在內的所有編譯器外掛程式都無法與之協同運作。

我們的基準測試在我們的內部專案中顯示了一些出色的結果：

| 專案          | 目前的 Kotlin 編譯器效能 | 新的 K2 Kotlin 編譯器效能 | 效能提升 |
|---------------|-------------------------|------------------------|-------------------|
| Kotlin        | 2.2 KLOC/s              | 4.8 KLOC/s             | ~ x2.2            |
| YouTrack      | 1.8 KLOC/s              | 4.2 KLOC/s             | ~ x2.3            |
| IntelliJ IDEA | 1.8 KLOC/s              | 3.9 KLOC/s             | ~ x2.2            |
| Space         | 1.2 KLOC/s              | 2.8 KLOC/s             | ~ x2.3            |
:::note
KLOC/s 效能數字代表編譯器每秒處理的數千行程式碼的數量。

您可以查看 JVM 專案的效能提升，並將其與舊編譯器的結果進行比較。若要啟用 Kotlin K2 編譯器，請使用以下編譯器選項：

```bash
-Xuse-k2
```

此外，K2 編譯器[包含許多錯誤修復](https://youtrack.jetbrains.com/issues/KT?q=tag:%20FIR-preview-qa%20%23Resolved)。請注意，即使此清單中 **State: Open** 的問題實際上已在 K2 中修復。

下一個 Kotlin 版本將提高 K2 編譯器的穩定性並提供更多功能，敬請關注！

如果您在使用 Kotlin K2 編譯器時遇到任何效能問題，請[向我們的問題追蹤器報告](https://kotl.in/issue)。

## 語言

Kotlin 1.7.0 引入了對委託實作和用於類型引數的新底線運算子的支援。它還穩定了在先前版本中作為預覽引入的幾個語言功能：

* [透過委託來實作 inline 類別的 inline value](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)
* [用於類型引數的底線運算子](#underscore-operator-for-type-arguments)
* [穩定的建構器推斷](#stable-builder-inference)
* [穩定的選擇加入需求](#stable-opt-in-requirements)
* [明確的非空類型](#stable-definitely-non-nullable-types)

### 允許透過委託來實作 inline 類別的 inline value

如果您想要為值或類別實例建立輕量級包裝函式，則必須手動實作所有介面方法。委託實作可以解決此問題，但在 1.7.0 之前，它不適用於 inline 類別。此限制已移除，因此您現在可以建立輕量級包裝函式，在大多數情況下不會配置記憶體。

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

### 用於類型引數的底線運算子

Kotlin 1.7.0 引入了用於類型引數的底線運算子 `_`。當指定其他類型時，您可以使用它來自動推斷類型引數：

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
    // T 會被推斷為 String，因為 SomeImplementation 衍生自 SomeClass<String>
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T 會被推斷為 Int，因為 OtherImplementation 衍生自 SomeClass<Int>
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```

您可以在變數清單中的任何位置使用底線運算子來推斷類型引數。

:::

### 穩定的建構器推斷

建構器推斷是一種特殊的類型推斷，在呼叫泛型建構器函數時非常有用。它有助於編譯器使用關於其 lambda 引數內的其他呼叫的類型資訊來推斷呼叫的類型引數。

從 1.7.0 開始，如果常規類型推斷無法獲得足夠的關於類型的資訊，而無需指定 `-Xenable-builder-inference` 編譯器選項（該選項已在 [1.6.0 中引入](whatsnew16#changes-to-builder-inference)），則會自動啟用建構器推斷。

[了解如何編寫自訂泛型建構器](using-builders-with-builder-inference)。

### 穩定的選擇加入需求

[選擇加入需求](opt-in-requirements)現在是[穩定的](components-stability)，並且不需要其他編譯器設定。

在 1.7.0 之前，選擇加入功能本身需要引數 `-opt-in=kotlin.RequiresOptIn` 才能避免警告。它不再需要此引數；但是，您仍然可以使用編譯器引數 `-opt-in` 來選擇加入其他註解[模組](opt-in-requirements#opt-in-a-module)。

### 穩定的明確非空類型

在 Kotlin 1.7.0 中，明確的非空類型已升級為 [Stable](components-stability)。當擴充泛型 Java 類別和介面時，它們提供更好的互通性。

您可以使用新的語法 `T & Any` 在使用點將泛型類型參數標記為明確的非空類型。語法形式來自 [交集類型](https://en.wikipedia.org/wiki/Intersection_type) 的表示法，現在僅限於 `&` 左側具有可空上限的類型參數和右側的非空 `Any`：

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // OK
    elvisLike<String>("", "").length
    // 錯誤：'null' 不能是非空類型的值
    elvisLike<String>("", null).length

    // OK
    elvisLike<String?>(null, "").length
    // 錯誤：'null' 不能是非空類型的值
    elvisLike<String?>(null, null).length
}
```

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types) 中了解有關明確非空類型的更多資訊。

## Kotlin/JVM

此版本為 Kotlin/JVM 編譯器帶來了效能改進和一個新的編譯器選項。此外，對函數式介面建構子的可呼叫引用已變得穩定。請注意，自 1.7.0 起，Kotlin/JVM 編譯的預設目標版本為 `1.8`。

* [編譯器效能最佳化](#compiler-performance-optimizations)
* [新的編譯器選項 `-Xjdk-release`](#new-compiler-option-xjdk-release)
* [對函數式介面建構子的穩定可呼叫引用](#stable-callable-references-to-functional-interface-constructors)
* [已移除 JVM 目標版本 1.6](#removed-jvm-target-version-1-6)

### 編譯器效能最佳化

Kotlin 1.7.0 為 Kotlin/JVM 編譯器引入了效能改進。根據我們的基準測試，與 Kotlin 1.6.0 相比，編譯時間[平均減少了 10%](https://youtrack.jetbrains.com/issue/KT-48233/Switching-to-JVM-IR-backend-increases-compilation-time-by-more-t#focus=Comments-27-6114542.0-0)。大量使用 inline 函數的專案（例如，[使用 `kotlinx.html` 的專案](https://youtrack.jetbrains.com/issue/KT-51416/Compilation-of-kotlinx-html-DSL-should-still-be-faster)）由於位元組碼後處理的改進，編譯速度會更快。

### 新的編譯器選項：-Xjdk-release

Kotlin 1.7.0 提供了一個新的編譯器選項 `-Xjdk-release`。此選項類似於 [javac 的命令列 `--release` 選項](http://openjdk.java.net/jeps/247)。`-Xjdk-release` 選項控制目標位元組碼版本，並將類別路徑中 JDK 的 API 限制為指定的 Java 版本。例如，`kotlinc -Xjdk-release=1.8` 不允許引用 `java.lang.Module`，即使依賴項中的 JDK 是版本 9 或更高版本。

:::note
[不能保證](https://youtrack.jetbrains.com/issue/KT-29974) 此選項對每個 JDK 發行版都有效。

:::

請在 [此 YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-29974/Add-a-compiler-option-Xjdk-release-similar-to-javac-s-release-to) 上留下您的意見。

### 對函數式介面建構子的穩定可呼叫引用

對函數式介面建構子的[可呼叫引用](reflection#callable-references)現在是[穩定的](components-stability)。了解如何使用可呼叫引用從具有建構子函數的介面[遷移](fun-interfaces#migration-from-an-interface-with-constructor-function-to-a-functional-interface)到函數式介面。

請在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中報告您發現的任何問題。

### 已移除 JVM 目標版本 1.6

Kotlin/JVM 編譯的預設目標版本為 `1.8`。已移除 `1.6` 目標。

請遷移到 JVM 目標 1.8 或更高版本。了解如何更新以下項目的 JVM 目標版本：

* [Gradle](gradle-compiler-options#attributes-specific-to-jvm)
* [Maven](maven#attributes-specific-to-jvm)
* [命令列編譯器](compiler-reference#jvm-target-version)

## Kotlin/Native

Kotlin 1.7.0 包含對 Objective-C 和 Swift 互通性的變更，並穩定了在先前版本中引入的功能。它還為新的記憶體管理器帶來了效能改進以及其他更新：

* [新的記憶體管理器的效能改進](#performance-improvements-for-the-new-memory-manager)
* [與 JVM 和 JS IR 後端統一的編譯器外掛程式 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [對獨立 Android 可執行檔的支援](#support-for-standalone-android-executables)
* [與 Swift async/await 的互通性：傳回 `Void` 而不是 `KotlinUnit`](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [禁止透過 Objective-C 橋接傳遞未宣告的例外](#prohibited-undeclared-exceptions-through-objective-c-bridges)
* [改進的 CocoaPods 整合](#improved-cocoapods-integration)
* [覆寫 Kotlin/Native 編譯器下載 URL](#overriding-the-kotlin-native-compiler-download-url)

### 新的記憶體管理器的效能改進

:::note
新的 Kotlin/Native 記憶體管理器處於 [Alpha](components-stability) 階段。
它可能會發生不相容的變更，並且將來可能需要手動遷移。
我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中提供的意見。

:::

新的記憶體管理器仍在 Alpha 階段，但它正在成為 [Stable](components-stability)。此版本為新的記憶體管理器提供了顯著的效能改進，尤其是在垃圾回收 (GC) 方面。特別是，掃描階段的並行實作（[在 1.6.20 中引入](whatsnew1620)）現在預設為啟用。這有助於減少應用程式因 GC 而暫停的時間。新的 GC 排程器更擅長選擇 GC 頻率，尤其是在較大的堆上。

此外，我們還專門針對偵錯二進位檔進行了最佳化，確保在記憶體管理器的實作程式碼中使用適當的最佳化層級和連結時間最佳化。這有助於我們在基準測試中將偵錯二進位檔的執行時間大約提高了 30%。

嘗試在您的專案中使用新的記憶體管理器，看看它的運作方式，並在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中與我們分享您的意見。

### 與 JVM 和 JS IR 後端統一的編譯器外掛程式 ABI

從 Kotlin 1.7.0 開始，Kotlin Multiplatform Gradle 外掛程式預設使用適用於 Kotlin/Native 的可嵌入編譯器 jar。此[功能已在 1.6.0 中宣布](whatsnew16#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)為實驗性功能，現在它已穩定且可以使用。

此改進對於程式庫作者來說非常方便，因為它可以改善編譯器外掛程式的開發體驗。在此版本之前，您必須為 Kotlin/Native 提供單獨的成品，但現在您可以將相同的編譯器外掛程式成品用於 Native 和其他支援的平台。

:::note
此功能可能需要外掛程式開發人員為其現有的外掛程式採取遷移步驟。

在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48595) 中了解如何為更新準備您的外掛程式。

### 對獨立 Android 可執行檔的支援

Kotlin 1.7.0 提供對為 Android Native 目標產生標準可執行檔的完整支援。它已[在 1.6.20 中引入](whatsnew1620#support-for-standalone-android-executables)，現在預設為啟用。

如果您想要回復到 Kotlin/Native 產生共用程式庫的先前行為，請使用以下設定：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

### 與 Swift async/await 的互通性：傳回 Void 而不是 KotlinUnit

Kotlin `suspend` 函數現在在 Swift 中傳回 `Void` 類型，而不是 `KotlinUnit`。這是與 Swift 的 `async`/`await` 改進互通性的結果。此功能已[在 1.6.20 中引入](whatsnew1620#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)，並且此版本預設啟用此行為。

您不再需要使用 `kotlin.native.binary.unitSuspendFunctionObjCExport=proper` 屬性來為此類函數傳回正確的類型。

### 禁止透過 Objective-C 橋接傳遞未宣告的例外

當您從 Swift/Objective-C 程式碼（或反之亦然）呼叫 Kotlin 程式碼並且此程式碼擲回例外時，除非您特別允許在語言之間轉發例外並進行適當的轉換（例如，使用 `@Throws` 註解），否則應由發生例外的程式碼處理該例外。

先前，Kotlin 還有另一種非預期的行為，在某些情況下，未宣告的例外可能會從一種語言「洩漏」到另一種語言。Kotlin 1.7.0 修復了該問題，現在這種情況會導致程式終止。

因此，例如，如果您在 Kotlin 中有一個 `{ throw Exception() }` lambda 並從 Swift 呼叫它，則在 Kotlin 1.7.0 中，一旦例外到達 Swift 程式碼，它就會終止。在先前的 Kotlin 版本中，此類例外可能會洩漏到 Swift 程式碼。

`@Throws` 註解會繼續像以前一樣運作。

### 改進的 CocoaPods 整合

從 Kotlin 1.7.0 開始，如果您想要在專案中整合 CocoaPods，則不再需要安裝 `cocoapods-generate` 外掛程式。

先前，您需要安裝 CocoaPods 依賴項管理器和 `cocoapods-generate` 外掛程式才能使用 CocoaPods，例如，在 Kotlin Multiplatform Mobile 專案中處理 [iOS 依賴項](multiplatform-ios-dependencies#with-cocoapods)。

現在，設定 CocoaPods 整合更容易了，並且我們已解決 `cocoapods-generate` 無法在 Ruby 3 及更高版本上安裝的問題。現在還支援在 Apple M1 上運作更好的最新 Ruby 版本。

請參閱如何設定 [初始 CocoaPods 整合](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)。

### 覆寫 Kotlin/Native 編譯器下載 URL

從 Kotlin 1.7.0 開始，您可以自訂 Kotlin/Native 編譯器的下載 URL。當 CI 上的外部連結被禁止時，這很有用。

若要覆寫預設基本 URL `https://download.jetbrains.com/kotlin/native/builds`，請使用以下 Gradle 屬性：

```none
kotlin.native.distribution.baseDownloadUrl=https://example.com
```

下載器會將 native 版本和目標作業系統附加到此基本 URL，以確保它下載實際的編譯器發行版。

:::

## Kotlin/JS

Kotlin/JS 正在接收對 [JS IR 編譯器後端](js-ir-compiler) 的進一步改進以及其他更新，這些更新可以改善您的開發體驗：

* [新的 IR 後端的效能改進](#performance-improvements-for-the-new-ir-backend)
* [使用 IR 時縮小成員名稱](#minification-for-member-names-when-using-ir)
* [透過 IR 後端中的 polyfill 支援較舊的瀏覽器](#support-for-older-browsers-via-polyfills-in-the-ir-backend)
* [從 js 運算式動態載入 JavaScript 模組](#dynamically-load-javascript-modules-from-js-expressions)
* [為 JavaScript 測試執行器指定環境變數](#specify-environment-variables-for-javascript-test-runners)

### 新的 IR 後端的效能改進

此版本有一些重大更新，應該可以改善您的開發體驗：

* Kotlin/JS 的增量編譯效能已顯著提高。建置 JS 專案所需的時間更少。在許多情況下，增量重建現在應該與舊版後端大致相同。
* Kotlin/JS 最終套件需要更少的空間，因為我們已顯著縮小最終成品的大小。對於某些大型專案，與舊版後端相比，我們已測量到生產套件大小減少了高達 20%。
* 對介面的類型檢查已改進了幾個數量級。
* Kotlin 產生更高品質的 JS 程式碼

### 使用 IR 時縮小成員名稱

Kotlin/JS IR 編譯器現在使用其關於 Kotlin 類別和函數關係的內部資訊來應用更有效的縮小，縮短函數、屬性和類別的名稱。這會縮小產生的套件應用程式。

當您在生產模式下建置 Kotlin/JS 應用程式時，會自動應用此類型的縮小，並且預設為啟用。若要停用成員名稱縮小，請使用 `-Xir-minimized-member-names` 編譯器旗標：

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xir-minimized-member-names=false")
        }
    }
}
```

### 透過 IR 後端中的 polyfill 支援較舊的瀏覽器

適用於 Kotlin/JS 的 IR 編譯器後端現在包含與舊版後端相同的 polyfill。這允許使用新編譯器編譯的程式碼在不支援 Kotlin 標準程式庫使用的所有 ES2015 方法的較舊瀏覽器中執行。只有專案實際使用的那些 polyfill 包含在最終套件中，這將最大程度地減少它們對套件大小的潛在影響。

當使用 IR 編譯器時，預設會啟用此功能，並且您不需要設定它。

### 從 js 運算式動態載入 JavaScript 模組

使用 JavaScript 模組時，大多數應用程式使用靜態匯入，其使用已在 [JavaScript 模組整合](js-modules) 中涵蓋。但是，Kotlin/JS 缺少一種在應用程式中於執行階段動態載入 JavaScript 模組的機制。

從 Kotlin 1.7.0 開始，JavaScript 中的 `import` 語句在 `js` 區塊中受到支援，允許您在執行階段將套件動態載入到您的應用程式中：

```kotlin
val myPackage = js("import('my-package')")
```

### 為 JavaScript 測試執行器指定環境變數

若要調整 Node.js 套件解析或將外部資訊傳遞給 Node.js 測試，您現在可以指定 JavaScript 測試執行器使用的環境變數。若要定義環境變數，請在組建腳本中的 `testTask` 區塊內使用具有鍵值對的 `environment()` 函數：

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

## 標準程式庫

在 Kotlin 1.7.0 中，標準程式庫進行了一系列變更和改進。它們引入了新功能、穩定了實驗性功能，並統一了對 Native、JS 和 JVM 的命名捕獲群組的支援：

* [min() 和 max() 集合函數傳回為非可空](#min-and-max-collection-functions-return-as-non-nullable)
* [在特定索引處進行正則表達式匹配](#regular-expression-matching-at-specific-indices)
* [擴展對先前語言和 API 版本的支援](#extended-support-for-previous-language-and-api-versions)
* [透過反射存取註解](#access-to-annotations-via-reflection)
* [穩定的深度遞迴函數](#stable-deep-recursive-functions)
* [基於 inline 類別的預設時間來源的時間標記](#time-marks-based-on-inline-classes-for-default-time-source)
* [Java Optionals 的新實驗性擴展函數](#new-experimental-extension-functions-for-java-optionals)
* [支援 JS 和 Native 中的命名捕獲群組](#support-for-named-capturing-groups-in-js-and-native)

### min() 和 max() 集合函數傳回為非可空

在 [Kotlin 1.4.0](whatsnew14) 中，我們將 `min()` 和 `max()` 集合函數重新命名為 `minOrNull()` 和 `maxOrNull()`。這些新名稱更好地反映了它們的行為 – 如果接收器集合為空，則傳回 null。它還有助於使函數的行為與 Kotlin 集合 API 中使用的命名約定保持一致。

`minBy()`、`maxBy()`、`minWith()` 和 `maxWith()` 也是如此，它們都在 Kotlin 1.4.0 中獲得了 *OrNull() 同義詞。受此變更影響的較舊函數已逐漸被棄用。

Kotlin 1.7.0 重新引入了原始函數名稱，但具有非可空傳回類型。新的 `min()`、`max()`、`minBy()`、`maxBy()`、`minWith()` 和 `maxWith()` 函數現在嚴格傳回集合元素或擲回例外。

```kotlin
fun main() {
    val numbers = listOf<Int>()
    println(numbers.maxOrNull()) // "null"
    println(numbers.max()) // "Exception in... Collection is empty."
}
```

### 在特定索引處進行正則表達式匹配

`Regex.matchAt()` 和 `Regex.matchesAt()` 函數（[在 1.5.30 中引入](whatsnew1530#matching-with-regex-at-a-particular-position)）現在是穩定的。它們提供了一種檢查正則表達式是否在 `String` 或 `CharSequence` 中的特定位置具有精確匹配的方法。

`matchesAt()` 檢查是否存在匹配項，並傳回布林值結果：

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    // 正則表達式：一位數字、點、一位數字、點、一位或多位數字
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
}
```

`matchAt()` 傳回找到的匹配項，如果未找到，則傳回 `null`：

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.7.0"
}
```

我們將感謝您對此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-34021) 提供的意見。

### 擴展對先前語言和 API 版本的支援

為了支援開發旨在在各種先前 Kotlin 版本中使用的程式庫的程式庫作者，並解決 Kotlin 主要版本發布頻率增加的問題，我們擴展了對先前語言和 API 版本的支援。

使用 Kotlin 1.7.0，我們支援三個先前的語言和 API 版本，而不是兩個。這表示 Kotlin 1.7.0 支援開發以低至 1.4.0 的 Kotlin 版本為目標的程式庫。有關向後相容性的更多資訊，請參閱 [相容性模式](compatibility-modes)。

### 透過反射存取註解

[`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 擴展函數（首次[在 1.6.0 中引入](whatsnew16#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)）現在是 [Stable](components-stability)。此 [反射](reflection) 函數傳回元素上給定類型的所有註解，包括單獨應用和重複的註解。

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

### 穩定的深度遞迴函數

自 [Kotlin 1.4.0](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/#Defining_deep_recursive_functions_using_coroutines) 以來，深度遞迴函數已作為實驗性功能提供，並且它們現在在 Kotlin 1.7.0 中是 [Stable](components-stability)。使用 `DeepRecursiveFunction`，您可以定義一個將其堆疊保留在堆上而不是使用實際呼叫堆疊的函數。這允許您執行非常深入的遞迴計算。若要呼叫深度遞迴函數，請 `invoke` 它。

在此範例中，深度遞迴函數用於遞迴計算二元樹的深度。即使此範例函數遞迴呼叫自身 100,000 次，也不會擲回 `StackOverflowError`：

```kotlin
class Tree(val left: Tree?, val right: Tree?)

val calculateDepth = DeepRecursiveFunction<Tree?, Int> { t `->`
    if (t == null) 0 else maxOf(
        callRecursive(t.left),
        callRecursive(t.right)
    ) + 1
}

fun main() {
    // 產生深度為 100_000 的樹狀結構
    val deepTree = generateSequence(Tree(null, null)) { prev `->`
        Tree(prev, null)
    }.take(100_000).last()

    println(calculateDepth(deepTree)) // 100000
}
```

考慮在您的程式碼中使用深度遞迴函數，其中遞迴深度超過 1000 個呼叫。

### 基於 inline 類別的預設時間來源的時間標記

Kotlin 1.7.0 透過將 `TimeSource.Monotonic` 傳回的時間標記變更為 inline value 類別來提高時間測量功能的效能。這表示呼叫諸如 `markNow()`、`elapsedNow()`、`measureTime()` 和 `measureTimedValue()` 之類的函數不會為其 `TimeMark` 實例配置包裝函式類別。特別是當測量一段程式碼時，該程式碼是熱路徑的一部分，這有助於最大限度地減少測量的效能影響：

```kotlin
@OptIn(ExperimentalTime::class)
fun main() {
    val mark = TimeSource.Monotonic.markNow() // 傳回的 `TimeMark` 是 inline 類別
    val elapsedDuration = mark.elapsedNow()
}
```

:::note
僅當靜態已知從中獲得 `TimeMark` 的時間來源是 `TimeSource.Monotonic` 時，此最佳化才可用。

:::

### Java Optionals 的新實驗性擴展函數

Kotlin 1.7.0 附帶了新的便利函數，可簡化在 Java 中使用 `Optional` 類別。這些新函數可用於解包和轉換 JVM 上的可選物件，並有助於使使用 Java API 更簡潔。

`getOrNull()`、`getOrDefault()` 和 `getOrElse()` 擴展函數允許您取得 `Optional` 的值（如果存在）。否則，您將分別獲得 `null`、預設值或由函數傳回的值：

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

`toList()`、`toSet()` 和 `asSequence()` 擴展函數將現有 `Optional` 的值轉換為清單、集合或序列，否則傳回空集合。`toCollection()` 擴展函數將 `Optional` 值附加到已存在的目標集合：

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
println(