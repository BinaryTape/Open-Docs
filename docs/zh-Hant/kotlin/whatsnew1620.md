[//]: # (title: Kotlin 1.6.20 的新功能)

<web-summary>閱讀 Kotlin 1.6.20 發行說明，內容涵蓋新的語言特性、Kotlin Multiplatform、JVM、Native、JS 的更新，以及 Gradle 和 Maven 的建置工具支援。</web-summary>

_[發佈日期：2022 年 4 月 4 日](releases.md#release-history)_

Kotlin 1.6.20 展示了未來語言特性的預覽，將階層結構（hierarchical structure）設為多平台專案的預設值，並為其他組件帶來了進化式的改進。

您也可以在此影片中找到變更的簡短摘要：

<video src="https://www.youtube.com/v/8F19ds109-o" title="Kotlin 1.6.20 的新功能"/>

> 有關 Kotlin 發佈週期的資訊，請參閱 [Kotlin 發佈流程](releases.md)。
>
{style="tip"}

## 語言 (Language)

在 Kotlin 1.6.20 中，您可以試用兩個新的語言特性：

* [Kotlin/JVM 上下文接收器原型](#prototype-of-context-receivers-for-kotlin-jvm)
* [絕對不可為 null 的型別 (Definitely non-nullable types)](#definitely-non-nullable-types)

### Kotlin/JVM 上下文接收器原型

> 此功能是僅適用於 Kotlin/JVM 的原型。啟用 `-Xcontext-receivers` 後，編譯器將產生無法在生產程式碼中使用的預先發佈二進位檔。請僅在您的玩具專案（toy projects）中使用上下文接收器。我們非常歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 提供回饋。
>
{style="warning"}

有了 Kotlin 1.6.20，您不再受限於只能擁有一個接收器。如果您需要更多，可以透過在宣告中加入上下文接收器（context receiver），使函式、屬性和類別具有上下文相關性（或稱為「上下文型」_contextual_）。上下文宣告會執行以下操作：

* 它要求所有宣告的上下文接收器都必須以隱式接收器（implicit receiver）的形式存在於呼叫者的作用域中。
* 它會將宣告的上下文接收器作為隱式接收器帶入其主體作用域中。

```kotlin
interface LoggingContext {
    val log: Logger // 此上下文提供 logger 的參考 
}

context(LoggingContext)
fun startBusinessOperation() {
    // 您可以存取 log 屬性，因為 LoggingContext 是一個隱式接收器
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // 您需要在作用域中擁有 LoggingContext 作為隱式接收器
        // 才能呼叫 startBusinessOperation()
        startBusinessOperation()
    }
}
```

若要在您的專案中啟用上下文接收器，請使用 `-Xcontext-receivers` 編譯器選項。您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md#detailed-design) 中找到該功能及其語法的詳細說明。

請注意，目前的實作是原型：

* 啟用 `-Xcontext-receivers` 後，編譯器將產生無法在生產程式碼中使用的預先發佈二進位檔
* 目前 IDE 對上下文接收器的支援非常有限

請在您的玩具專案中試用此功能，並在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-42435) 中與我們分享您的想法和經驗。如果您遇到任何問題，請 [提交新問題](https://kotl.in/issue)。

### 絕對不可為 null 的型別 (Definitely non-nullable types)

> 絕對不可為 null 的型別目前處於 [Beta](components-stability.md) 階段。它們幾乎已經穩定，但未來可能需要遷移步驟。我們將盡力減少您必須進行的任何更動。
>
{style="warning"}

為了在擴充泛型 Java 類別和介面時提供更好的互通性，Kotlin 1.6.20 允許您在使用的位置使用新語法 `T & Any` 將泛型型別參數標記為絕對不可為 null。這種語法形式來自 [交集型別 (intersection types)](https://en.wikipedia.org/wiki/Intersection_type) 的標記法，目前僅限於在 `&` 左側具有可為 null 的上界、右側為不可為 null 的 `Any` 的型別參數：

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // 正確
    elvisLike<String>("", "").length
    // 錯誤：'null' 不能是不可為 null 型別的值
    elvisLike<String>("", null).length

    // 正確
    elvisLike<String?>(null, "").length
    // 錯誤：'null' 不能是不可為 null 型別的值
    elvisLike<String?>(null, null).length
}
```
{validate="false"}

將語言版本設定為 `1.7` 以啟用此功能：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.7"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.7'
        }
    }
}
```

</tab>
</tabs>

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md) 中進一步了解絕對不可為 null 的型別。

## Kotlin/JVM

Kotlin 1.6.20 引入了：

* JVM 介面中預設方法的相容性改進：[介面的新 `@JvmDefaultWithCompatibility` 註解](#new-jvmdefaultwithcompatibility-annotation-for-interfaces) 以及 [在 `-Xjvm-default` 模式中的相容性變更](#compatibility-changes-in-the-xjvm-default-modes)
* [支援在 JVM 後端平行編譯單一模組](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
* [支援對函數式介面建構函式的可呼叫參考](#support-for-callable-references-to-functional-interface-constructors)

### 介面的新 @JvmDefaultWithCompatibility 註解

Kotlin 1.6.20 引入了新註解 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)：將其與 `-Xjvm-default=all` 編譯器選項一起使用，[為任何 Kotlin 介面中的任何非抽象成員在 JVM 介面中建立預設方法](java-to-kotlin-interop.md#default-methods-in-interfaces)。

如果有的用戶端使用您在不含 `-Xjvm-default=all` 選項下編譯的 Kotlin 介面，它們可能與使用此選項編譯的程式碼發生二進位不相容。在 Kotlin 1.6.20 之前，為了避免這種相容性問題，[建議的方法](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility) 是使用 `-Xjvm-default=all-compatibility` 模式，並對不需要這種類型相容性的介面使用 `@JvmDefaultWithoutCompatibility` 註解。

這種方法有一些缺點：

* 加入新介面時，您很容易忘記加入註解。
* 通常非公開部分的介面比公開 API 中的介面多，因此最終您的程式碼中很多地方都會有這個註解。

現在，您可以使用 `-Xjvm-default=all` 模式並使用 `@JvmDefaultWithCompatibility` 註解標記介面。這讓您可以一次性將此註解加入公開 API 中的所有介面，且無需對新的非公開程式碼使用任何註解。

請在 [此 YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-48217) 中留下您對此新註解的回饋。

### -Xjvm-default 模式下的相容性變更

Kotlin 1.6.20 增加了將預設模式（`-Xjvm-default=disable` 編譯器選項）編譯的模組與使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式編譯的模組進行編譯的選項。與以前一樣，如果所有模組都具有 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式，編譯也會成功。您可以在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47000) 中留下回饋。

Kotlin 1.6.20 棄用了編譯器選項 `-Xjvm-default` 的 `compatibility` 和 `enable` 模式。其他模式的說明中關於相容性的部分有所更動，但整體邏輯保持不變。您可以查看 [更新後的說明](java-to-kotlin-interop.md#compatibility-modes-for-default-methods)。

有關 Java 互通中預設方法的更多資訊，請參閱 [互通性文件](java-to-kotlin-interop.md#default-methods-in-interfaces) 以及 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 支援在 JVM 後端並行編譯單一模組

> 支援在 JVM 後端並行編譯單一模組功能處於 [實驗性](components-stability.md) 階段。它隨時可能被捨棄或更動。需要手動啟用（見下方詳情），且您應僅將其用於評估目的。我們非常歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-46085) 提供回饋。
>
{style="warning"}

我們正在繼續努力 [改進新的 JVM IR 後端編譯時間](https://youtrack.jetbrains.com/issue/KT-46768)。在 Kotlin 1.6.20 中，我們加入了實驗性的 JVM IR 後端模式，用以平行編譯模組中的所有檔案。平行編譯最多可以減少 15 % 的總編譯時間。

使用 [編譯器選項](compiler-reference.md#compiler-options) `-Xbackend-threads` 啟用實驗性平行後端模式。請為此選項使用以下引數：

* `N` 是您想要使用的執行緒數量。它不應大於您的 CPU 核心數；否則，由於執行緒之間的上下文切換，平行化將失去效率。
* `0` 表示為每個 CPU 核心使用一個單獨的執行緒。

[Gradle](gradle.md) 可以平行執行任務，但從 Gradle 的角度來看，當一個專案（或專案的主要部分）只是一個大任務時，這種類型的平行化並無太大幫助。如果您有一個非常龐大的單體模組，請使用平行編譯來更快地完成編譯。如果您的專案由許多小模組組成，並且已經由 Gradle 進行了平行建置，那麼加入另一層平行化可能會因為上下文切換而損害效能。

> 平行編譯有一些限制：
> * 它不適用於 [kapt](kapt.md)，因為 kapt 會停用 IR 後端
> * 設計上它需要更多 JVM 堆積（heap）。堆積量與執行緒數量成正比
>
{style="note"}

### 支援對函數式介面建構函式的可呼叫參考

> 支援對函數式介面建構函式的可呼叫參考功能處於 [實驗性](components-stability.md) 階段。它隨時可能被捨棄或更動。需要手動啟用（見下方詳情），且您應僅將其用於評估目的。我們非常歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47939) 提供回饋。
>
{style="warning"}

支援對 [可呼叫參考](reflection.md#callable-references) 至函數式介面建構函式，提供了一種原始碼相容的方式，可以從具有建構函式函式的介面遷移到 [函數式介面 (functional interface)](fun-interfaces.md)。

請考慮以下程式碼：

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

啟用對函數式介面建構函式的可呼叫參考後，此程式碼可以替換為僅僅一個函數式介面宣告：

```kotlin
fun interface Printer {
    fun print()
}
```

它的建構函式將會隱式建立，任何使用 `::Printer` 函式參考的程式碼都將能通過編譯。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```
{validate="false"}

透過使用 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 註解並設定 `DeprecationLevel.HIDDEN` 來標記舊有的 `Printer` 函式，以維持二進位相容性：

```kotlin
@Deprecated(message = "關於棄用的訊息", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```
{validate="false"}

使用編譯器選項 `-XXLanguage:+KotlinFunInterfaceConstructorReference` 啟用此功能。

## Kotlin/Native

Kotlin/Native 1.6.20 標誌著其新組件的持續開發。我們在與其他平台上的 Kotlin 保持一致體驗方面又邁出了一步：

* [新記憶體管理員更新](#an-update-on-the-new-memory-manager)
* [新記憶體管理員清除階段的並行實作](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
* [註解類別的具現化](#instantiation-of-annotation-classes)
* [與 Swift async/await 互通：傳回 Swift 的 Void 而非 KotlinUnit](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [使用 libbacktrace 提供更好的堆疊追蹤](#better-stack-traces-with-libbacktrace)
* [支援獨立 Android 可執行檔](#support-for-standalone-android-executables)
* [效能改進](#performance-improvements)
* [改進 cinterop 模組匯入期間的錯誤處理](#improved-error-handling-during-cinterop-modules-import)
* [支援 Xcode 13 程式庫](#support-for-xcode-13-libraries)

### 新記憶體管理員更新 

> 新的 Kotlin/Native 記憶體管理員目前處於 [Alpha](components-stability.md) 階段。未來可能會發生不相容的更動並需要手動遷移。我們非常歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 提供回饋。
>
{style="note"}

有了 Kotlin 1.6.20，您可以試用新 Kotlin/Native 記憶體管理員的 Alpha 版本。它消除了 JVM 和 Native 平台之間的差異，在多平台專案中提供一致的開發人員體驗。例如，您將能更輕鬆地建立可在 Android 和 iOS 上運作的新跨平台行動應用程式。

新的 Kotlin/Native 記憶體管理員解除了在執行緒之間共享物件的限制。它還提供了無洩漏的並行程式設計基元，這些基元是安全的，不需要任何特殊的管理或註解。

新的記憶體管理員將在未來版本中成為預設值，因此我們鼓勵您現在就試用。查看我們的 [部落格文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/) 以了解更多關於新記憶體管理員的資訊並探索示範專案，或直接跳轉到 [遷移說明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md) 自行試用。

請嘗試在您的專案中使用新的記憶體管理員，看看它的運作情況，並在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享回饋。

### 新記憶體管理員清除階段的並行實作

如果您已經切換到我們在 [Kotlin 1.6 中發佈](whatsnew16.md#preview-of-the-new-memory-manager) 的新記憶體管理員，您可能會注意到執行時間有了巨大的改進：我們的基準測試顯示平均提升了 35 %。從 1.6.20 開始，新記憶體管理員還提供清除階段（sweep phase）的並行實作。這也應該會提高效能並縮短垃圾收集器的停頓時間。

若要為新的 Kotlin/Native 記憶體管理員啟用該功能，請傳遞以下編譯器選項：

```bash
-Xgc=cms 
```

歡迎在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48526) 中分享您對新記憶體管理員效能的回饋。

### 註解類別的具現化

在 Kotlin 1.6.0 中，註解類別的具現化在 Kotlin/JVM 和 Kotlin/JS 已達到 [穩定 (Stable)](components-stability.md)。1.6.20 版本則為 Kotlin/Native 提供了支援。

進一步了解 [註解類別的具現化](annotations.md#instantiation)。

### 與 Swift async/await 互通：傳回 Void 而非 KotlinUnit

> 與 Swift async/await 的並行互通性功能處於 [實驗性](components-stability.md) 階段。它隨時可能被捨棄或更動。您應僅將其用於評估目的。我們非常歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 提供回饋。
>
{style="warning"}

我們繼續開發與 [Swift async/await 的實驗性互通性](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await)（自 Swift 5.5 起可用）。Kotlin 1.6.20 與先前版本在處理傳回型別為 `Unit` 的 `suspend` 函式方面有所不同。

先前，此類函式在 Swift 中呈現為傳回 `KotlinUnit` 的 `async` 函式。然而，它們合適的傳回型別應該是 `Void`，類似於非掛起（non-suspending）函式。

為了避免破壞現有程式碼，我們引入了一個 Gradle 屬性，使編譯器將傳回 `Unit` 的掛起函式轉換為傳回 `Void` 型別的 `async` Swift 函式：

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

我們計畫在未來的 Kotlin 版本中將此行為設為預設。

### 使用 libbacktrace 提供更好的堆疊追蹤

> 使用 libbacktrace 解析原始碼位置功能處於 [實驗性](components-stability.md) 階段。它隨時可能被捨棄或更動。您應僅將其用於評估目的。我們非常歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424) 提供回饋。
>
{style="warning"}

Kotlin/Native 現在能夠產生包含檔案位置和行號的詳細堆疊追蹤，以便更好地偵錯 `linux*`（`linuxMips32` 和 `linuxMipsel32` 除外）和 `androidNative*` 目標。

此功能在底層使用了 [libbacktrace](https://github.com/ianlancetaylor/libbacktrace) 程式庫。請看以下程式碼來了解差異的範例：

```kotlin
fun main() = bar()
fun bar() = baz()
inline fun baz() {
    error("")
}
```

* **1.6.20 之前：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x227190       kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96
   at 1   example.kexe        0x221e4c       kfun:kotlin.Exception#<init>(kotlin.String?){} + 92
   at 2   example.kexe        0x221f4c       kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92
   at 3   example.kexe        0x22234c       kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92
   at 4   example.kexe        0x25d708       kfun:#bar(){} + 104
   at 5   example.kexe        0x25d68c       kfun:#main(){} + 12
```
{initial-collapse-state="collapsed" collapsible="true"}

* **1.6.20 使用 libbacktrace：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x229550    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe        0x22420c    kfun:kotlin.Exception#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe        0x22430c    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe        0x22470c    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe        0x25fac8    kfun:#bar(){} + 104 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)
   at 5   example.kexe        0x25fac8    kfun:#bar(){} + 104 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe        0x25fac8    kfun:#bar(){} + 104 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe        0x25fa4c    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
```
{initial-collapse-state="collapsed" collapsible="true"}

在 Apple 目標上（原本堆疊追蹤中已有檔案位置和行號），libbacktrace 為內嵌函式（inline function）呼叫提供了更多細節：

* **1.6.20 之前：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10a85a8f8    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x10a855846    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x10a855936    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x10a855c86    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x10a8489a5    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:1)
   at 5   example.kexe    0x10a84891c    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```
{initial-collapse-state="collapsed" collapsible="true"}

* **1.6.20 使用 libbacktrace：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10669bc88    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x106696bd6    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x106696cc6    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x106697016    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)
>>  at 5   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe    0x106689d35    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe    0x106689cac    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```
{initial-collapse-state="collapsed" collapsible="true"}

若要使用 libbacktrace 產生更好的堆疊追蹤，請在 `gradle.properties` 中加入以下行：

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

請在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48424) 中告訴我們使用 libbacktrace 偵錯 Kotlin/Native 的效果如何。

### 支援獨立 Android 可執行檔

先前，Kotlin/Native 中的 Android Native 可執行檔實際上並非可執行檔，而是可以作為 NativeActivity 使用的共享程式庫。現在，有一個選項可以為 Android Native 目標產生標準的可執行檔。

為此，在專案的 `build.gradle(.kts)` 部分，配置 `androidNative` 目標的執行塊。加入以下二進位選項：

```kotlin
kotlin {
    androidNativeX64("android") {
        binaries {
            executable {
                binaryOptions["androidProgramType"] = "standalone"
            }
        }
    }
}
```

請注意，此功能將在 Kotlin 1.7.0 中成為預設。如果您想保留目前的行為，請使用以下設定：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

感謝 Mattia Iavarone 的 [實作](https://github.com/jetbrains/kotlin/pull/4624)！

### 效能改進

我們正努力在 Kotlin/Native 上 [加速編譯過程](https://youtrack.jetbrains.com/issue/KT-42294) 並改進您的開發體驗。

Kotlin 1.6.20 帶來了一些效能更新和錯誤修復，這些更動會影響 Kotlin 產生的 LLVM IR。根據我們內部專案的基準測試，我們平均實現了以下效能提升：

* 執行時間減少 15 %
* 發佈版與偵錯版二進位檔的程式碼大小減少 20 %
* 發佈版二進位檔的編譯時間減少 26 %

這些變更還為一個大型內部專案的偵錯版二進位檔減少了 10 % 的編譯時間。

為了實現這一點，我們為一些編譯器產生的合成物件實作了靜態初始化，改進了我們為每個函式建構 LLVM IR 的方式，並優化了編譯器快取。

### 改進 cinterop 模組匯入期間的錯誤處理

此版本針對使用 `cinterop` 工具匯入 Objective-C 模組的情況（常見於 CocoaPods pods）引入了改進的錯誤處理。先前，如果您在嘗試處理 Objective-C 模組時出錯（例如，處理標頭檔中的編譯錯誤時），您會收到一個不具描述性的錯誤訊息，例如 `fatal error: could not build module $name`。我們擴充了 `cinterop` 工具的這部分，因此您將收到帶有詳細說明的錯誤訊息。

### 支援 Xcode 13 程式庫

從此版本開始，隨 Xcode 13 提供的程式庫已獲得全面支援。您可以隨意在 Kotlin 程式碼中的任何位置存取它們。

## Kotlin Multiplatform

1.6.20 為 Kotlin Multiplatform 帶來了以下顯著更新：

* [所有新多平台專案現在預設支援階層結構](#hierarchical-structure-support-for-multiplatform-projects)
* [Kotlin CocoaPods Gradle 外掛程式新增了幾個用於 CocoaPods 整合的實用功能](#kotlin-cocoapods-gradle-plugin)

### 多平台專案的階層結構支援

Kotlin 1.6.20 預設啟用了階層結構支援。自從 [在 Kotlin 1.4.0 中引入](whatsnew14.md#sharing-code-in-several-targets-with-the-hierarchical-project-structure) 以來，我們顯著改進了前端並使 IDE 匯入變得穩定。

先前，在多平台專案中加入程式碼有兩種方式。第一種是將其插入特定平台的原始碼集（source set），這僅限於一個目標且無法被其他平台重複使用。第二種是使用在 Kotlin 目前支援的所有平台之間共享的通用原始碼集。

現在，您可以在多個相似的原生目標之間 [共享原始碼](#better-code-sharing-in-your-project)，這些目標重複使用了許多通用邏輯和第三方 API。該技術將提供正確的預設相依性，並找到共享程式碼中可用的確切 API。這消除了複雜的建置設定，也無需使用變通方法來獲得對在原生目標之間共享原始碼集的 IDE 支援。它還有助於防止針對不同目標的安全性 API 誤用。

該技術對於 [程式庫作者](#more-opportunities-for-library-authors) 也很有用，因為階層式專案結構允許他們發佈和取用針對目標子集具有通用 API 的程式庫。

預設情況下，使用階層式專案結構發佈的程式庫僅與階層結構專案相容。

#### 您專案中更好的程式碼共享

在沒有階層結構支援的情況下，沒有直接的方法可以在 _部分_ 但非 _全部_ [Kotlin 目標](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets) 之間共享程式碼。一個常見的範例是在所有 iOS 目標之間共享程式碼，並存取 iOS 特定的 [相依性](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)，例如 Foundation。

多虧了階層式專案結構支援，您現在可以開箱即用地實現這一點。在新結構中，原始碼集形成一個階層。您可以使用針對給定原始碼集編譯到的每個目標可用的平台特定語言特性和相依性。

例如，考慮一個典型具有兩個目標的多平台專案 — 用於 iOS 裝置和模擬器的 `iosArm64` 和 `iosX64`。Kotlin 工具鏈理解這兩個目標具有相同的函式，並允許您從中間原始碼集 `iosMain` 存取該函式。

![iOS 階層範例](ios-hierarchy-example.jpg){width=700}

Kotlin 工具鏈提供正確的預設相依性，如 Kotlin/Native stdlib 或原生程式庫。此外，Kotlin 工具將盡力尋找共享程式碼中確切可用的 API 表面積。這可以防止諸如在為 Windows 共享的程式碼中使用 macOS 特定函式之類的情況。

#### 為程式庫作者提供更多機會

發佈多平台程式庫時，其中間原始碼集的 API 現在會隨之正確發佈，供取用者使用。同樣地，Kotlin 工具鏈將自動找出取用者原始碼集中可用的 API，同時仔細監控不安全的使用情況，例如在 JS 程式碼中使用針對 JVM 的 API。進一步了解 [在程式庫中共享程式碼](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-in-libraries)。

#### 設定與安裝

從 Kotlin 1.6.20 開始，您的所有新多平台專案都將具有階層式專案結構。無需額外設定。

* 如果您已經 [手動開啟它](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)，可以從 `gradle.properties` 中移除棄用的選項：

  ```none
  # gradle.properties
  kotlin.mpp.enableGranularSourceSetsMetadata=true
  kotlin.native.enableDependencyPropagation=false // 或 'true'，視您先前的設定而定
  ```

* 對於 Kotlin 1.6.20，我們建議使用 [Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 或更新版本以獲得最佳體驗。

* 您也可以選擇退出。若要停用階層結構支援，請在 `gradle.properties` 中設定以下選項：

  ```none
  # gradle.properties
  kotlin.mpp.hierarchicalStructureSupport=false
  ```

#### 留下您的回饋

這是對整個生態系統的重大變更。我們非常感謝您的回饋，以協助將其做得更好。

請立即試用並將您遇到的任何困難回報至 [我們的問題追蹤器](https://kotl.in/issue)。

### Kotlin CocoaPods Gradle 外掛程式

為了簡化 CocoaPods 整合，Kotlin 1.6.20 提供了以下功能：

* CocoaPods 外掛程式現在具有建置包含所有註冊目標的 XCFrameworks 並產生 Podspec 檔案的任務。當您不想直接與 Xcode 整合，但想要建置產物並將其部署到您的本機 CocoaPods 存儲庫時，這非常有用。
  
  進一步了解 [建置 XCFrameworks](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#build-xcframeworks)。

* 如果您在專案中使用 [CocoaPods 整合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)，您已經習慣為整個 Gradle 專案指定所需的 Pod 版本。現在您有更多選項：
  * 直接在 `cocoapods` 區塊中指定 Pod 版本
  * 繼續使用 Gradle 專案版本
  
  如果這些屬性都沒有配置，您將會收到錯誤。

* 您現在可以在 `cocoapods` 區塊中配置 CocoaPod 名稱，而不是更改整個 Gradle 專案的名稱。

* CocoaPods 外掛程式引入了一個新的 `extraSpecAttributes` 屬性，您可以用它來配置先前寫死在 Podspec 檔案中的屬性，例如 `libraries` 或 `vendored_frameworks`。

```kotlin
kotlin {
    cocoapods {
        version = "1.0"
        name = "MyCocoaPod"
        extraSpecAttributes["social_media_url"] = 'https://twitter.com/kotlin'
        extraSpecAttributes["vendored_frameworks"] = 'CustomFramework.xcframework'
        extraSpecAttributes["libraries"] = 'xml'
    }
}
```

請參閱完整的 Kotlin CocoaPods Gradle 外掛程式 [DSL 參考](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html)。

## Kotlin/JS

Kotlin/JS 在 1.6.20 中的改進主要影響 IR 編譯器：

* [開發版二進位檔 (IR) 的增量編譯](#incremental-compilation-for-development-binaries-with-ir-compiler)
* [預設對頂層屬性進行延遲初始化 (IR)](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)
* [預設為專案模組產生個別的 JS 檔案 (IR)](#separate-js-files-for-project-modules-by-default-with-ir-compiler)
* [Char 類別優化 (IR)](#char-class-optimization)
* [導出改進（IR 和舊版後端）](#improvements-to-export-and-typescript-declaration-generation)
* [針對非同步測試的 @AfterTest 保證](#aftertest-guarantees-for-asynchronous-tests)

### 開發版二進位檔使用 IR 編譯器的增量編譯

為了使使用 IR 編譯器的 Kotlin/JS 開發更有效率，我們引入了一種新的「增量編譯 (incremental compilation)」模式。

在此模式下使用 `compileDevelopmentExecutableKotlinJs` Gradle 任務建置 **開發版二進位檔** 時，編譯器會在模組層級快取先前編譯的結果。它在後續編譯中對未變更的原始檔使用快取的編譯結果，使其能更快完成，尤其是在更動較小時。請注意，此改進僅針對開發過程（縮短編輯-建置-偵錯循環），不影響生產環境產物的建置。

若要為開發版二進位檔啟用增量編譯，請在專案的 `gradle.properties` 中加入以下行：

```none
# gradle.properties
kotlin.incremental.js.ir=true // 預設為 false
```

在我們的測試專案中，新模式使增量編譯速度提升了高達 30 %。然而，由於需要建立和填充快取，此模式下的乾淨建置（clean build）變得較慢。

請在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-50203) 中告訴我們您對於在 Kotlin/JS 專案中使用增量編譯的看法。

### 預設使用 IR 編譯器延遲初始化頂層屬性

在 Kotlin 1.4.30 中，我們展示了 JS IR 編譯器中 [延遲初始化頂層屬性](whatsnew1430.md#lazy-initialization-of-top-level-properties) 的原型。透過消除應用程式啟動時初始化所有屬性的需求，延遲初始化縮短了啟動時間。我們的測量顯示，在真實的 Kotlin/JS 應用程式上大約有 10 % 的提速。

現在，在對此機制進行了打磨和充分測試後，我們將延遲初始化設為 IR 編譯器中頂層屬性的預設行為。

```kotlin
// 延遲初始化
val a = run {
    val result = // 密集運算
        println(result)
    result
} // run 在第一次使用該變數時執行
```

如果出於某種原因您需要積極初始化（在應用程式啟動時）某個屬性，請使用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/) 註解標記它。

### 預設使用 IR 編譯器為專案模組產生個別的 JS 檔案

先前，JS IR 編譯器提供了 [為專案模組產生個別 .js 檔案的能力](https://youtrack.jetbrains.com/issue/KT-44319)。這是預設選項（整個專案產生單一 .js 檔案）的替代方案。該檔案可能太大且使用不便，因為每當您想從專案中使用一個函式時，都必須包含整個 JS 檔案作為相依項。擁有複數檔案增加了靈活性並減少了此類相依項的大小。此功能可透過 `-Xir-per-module` 編譯器選項使用。

從 1.6.20 開始，JS IR 編譯器預設會為專案模組產生個別的 `.js` 檔案。

現在可以透過以下 Gradle 屬性將專案編譯為單一 `.js` 檔案：

```none
# gradle.properties
kotlin.js.ir.output.granularity=whole-program // `per-module` 是預設值
```

在先前的發佈版本中，實驗性的逐模組（per-module）模式（透過 `-Xir-per-module=true` 標記使用）會在每個模組中調用 `main()` 函式。這與常規的單一 `.js` 模式不一致。從 1.6.20 開始，在這兩種情況下，`main()` 函式都將僅在主模組中被調用。如果您確實需要在載入模組時執行某些程式碼，可以使用標註有 `@EagerInitialization` 註解的頂層屬性。請參閱 [預設使用 IR 編譯器延遲初始化頂層屬性](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)。

### Char 類別優化

`Char` 類別現在由 Kotlin/JS 編譯器處理，而不會引入裝箱（boxing）（類似於 [內聯類別 (inline classes)](inline-classes.md)）。這加速了 Kotlin/JS 程式碼中字元的運算。

除了效能提升外，這也改變了 `Char` 導出到 JavaScript 的方式：它現在被轉換為 `Number`。

### 導出與 TypeScript 宣告產生的改進

Kotlin 1.6.20 為導出機制（[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 註解）帶來了多項修正與改進，包括 [TypeScript 宣告 (.d.ts) 的產生](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)。我們加入了導出介面和列舉的能力，並修復了先前向我們回報的一些邊緣情況下的導出行為。如需更多細節，請參閱 [YouTrack 中的導出改進清單](https://youtrack.jetbrains.com/issues?q=Project:%20Kotlin%20issue%20id:%20KT-45434,%20KT-44494,%20KT-37916,%20KT-43191,%20KT-46961,%20KT-40236)。

進一步了解 [如何從 JavaScript 使用 Kotlin 程式碼](js-to-kotlin-interop.md)。

### @AfterTest 針對非同步測試的保證

Kotlin 1.6.20 讓 [`@AfterTest`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-after-test/) 函式在 Kotlin/JS 上的非同步測試中能正常運作。如果一個測試函式的傳回型別被靜態解析為 [`Promise`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/)，編譯器現在會將 `@AfterTest` 函式的執行排定到對應的 [`then()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/then.html) 回呼中。

## 安全性 (Security)

Kotlin 1.6.20 引入了幾項功能來提高程式碼的安全性：

* [在 klib 中使用相對路徑](#using-relative-paths-in-klibs)
* [為 Kotlin/JS Gradle 專案保留 yarn.lock](#persisting-yarn-lock-for-kotlin-js-gradle-projects)
* [預設使用 --ignore-scripts 安裝 npm 相依性](#installation-of-npm-dependencies-with-ignore-scripts-by-default)

### 在 klib 中使用相對路徑

`klib` 格式的程式庫 [包含](native-libraries.md#library-format) 原始檔的序列化 IR 表示形式，其中也包括用於產生正確偵錯資訊的路徑。在 Kotlin 1.6.20 之前，儲存的檔案路徑是絕對路徑。由於程式庫作者可能不想分享絕對路徑，1.6.20 版本提供了一個替代選項。

如果您正在發佈一個 `klib` 並希望在產物中僅使用原始檔的相對路徑，您現在可以傳遞 `-Xklib-relative-path-base` 編譯器選項，並附帶一個或多個原始檔的基準路徑：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile::class).configureEach {
    // $base 是原始檔的基準路徑
    kotlinOptions.freeCompilerArgs += "-Xklib-relative-path-base=$base"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile).configureEach {
    kotlinOptions {
        // $base 是原始檔的基準路徑
        freeCompilerArgs += "-Xklib-relative-path-base=$base"
    }
}
``` 

</tab>
</tabs>

### 為 Kotlin/JS Gradle 專案保留 yarn.lock

> 該功能已回推至 Kotlin 1.6.10。
>
{style="note"}

Kotlin/JS Gradle 外掛程式現在提供了保留 `yarn.lock` 檔案的能力，使得在無需額外 Gradle 配置的情況下就能鎖定專案的 npm 相依性版本。此功能透過在專案根目錄加入自動產生的 `kotlin-js-store` 目錄，改變了預設的專案結構。它將 `yarn.lock` 檔案保存在其中。

我們強烈建議將 `kotlin-js-store` 目錄及其內容提交到您的版本控制系統中。將 lockfile 提交到版本控制系統是一項 [建議實務](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)，因為它能確保您的應用程式在所有機器上都使用完全相同的相依性樹進行建置，無論是其他機器上的開發環境還是 CI/CD 服務。Lockfile 還能防止在新的機器上檢出專案時 npm 相依性被無意中更新，這是一個安全性考量。

像 [Dependabot](https://github.com/dependabot) 這樣的工具也可以剖析 Kotlin/JS 專案的 `yarn.lock` 檔案，並在您依賴的任何 npm 套件受損時為您提供警告。

如果需要，您可以在建置腳本中更改目錄和 lockfile 的名稱：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
``` 

</tab>
</tabs>

> 更改 lockfile 的名稱可能會導致相依性檢查工具無法再識別該檔案。
> 
{style="warning"}

### 預設使用 --ignore-scripts 安裝 npm 相依性

> 該功能已回推至 Kotlin 1.6.10。
>
{style="note"}

Kotlin/JS Gradle 外掛程式現在預設會阻止在安裝 npm 相依性期間執行 [生命週期腳本 (lifecycle scripts)](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)。這項更動旨在降低執行來自受損 npm 套件的惡意程式碼的可能性。

若要回退到舊配置，您可以透過在 `build.gradle(.kts)` 中加入以下行來明確啟用生命週期腳本執行：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).ignoreScripts = false
}
``` 

</tab>
</tabs>

進一步了解 [Kotlin/JS Gradle 專案的 npm 相依性](js-project-setup.md#npm-dependencies)。

## Gradle

Kotlin 1.6.20 為 Kotlin Gradle 外掛程式帶來了以下變更：

* 用於定義 Kotlin 編譯器執行策略的新 [屬性 `kotlin.compiler.execution.strategy` 和 `compilerExecutionStrategy`](#properties-for-defining-kotlin-compiler-execution-strategy)
* [棄用 `kapt.use.worker.api`、`kotlin.experimental.coroutines` 和 `kotlin.coroutines` 選項](#deprecation-of-build-options-for-kapt-and-coroutines)
* [移除 `kotlin.parallel.tasks.in.project` 建置選項](#removal-of-the-kotlin-parallel-tasks-in-project-build-option)

### 用於定義 Kotlin 編譯器執行策略的屬性

在 Kotlin 1.6.20 之前，您使用系統屬性 `-Dkotlin.compiler.execution.strategy` 來定義 Kotlin 編譯器執行策略。這個屬性在某些情況下可能不方便。Kotlin 1.6.20 引入了一個同名的 Gradle 屬性 `kotlin.compiler.execution.strategy`，以及編譯任務屬性 `compilerExecutionStrategy`。

系統屬性仍然有效，但在未來的發佈版本中將被移除。

目前屬性的優先順序如下：

* 任務屬性 `compilerExecutionStrategy` 的優先權高於系統屬性和 Gradle 屬性 `kotlin.compiler.execution.strategy`。
* Gradle 屬性的優先權高於系統屬性。

您可以為這些屬性分配三種編譯器執行策略：

| 策略 | Kotlin 編譯器的執行位置 | 增量編譯 | 其他特性 |
|----------------|--------------------------------------|-------------------------|------------------------------------------------------------------------|
| Daemon | 在其自身的守護程序 (daemon process) 中 | 是 | *預設策略*。可以在不同的 Gradle 守護程序之間共享 |
| In process | 在 Gradle 守護程序中 | 否 | 可能與 Gradle 守護程序共享堆積 (heap) |
| Out of process | 為每次呼叫在個別程序中執行 | 否 | — |

相應地，`kotlin.compiler.execution.strategy` 屬性（包括系統和 Gradle）的可選值為：
1. `daemon` (預設)
2. `in-process`
3. `out-of-process`

在 `gradle.properties` 中使用 Gradle 屬性 `kotlin.compiler.execution.strategy`：

```none
# gradle.properties
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 任務屬性的可選值為：

1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (預設)
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

在 `build.gradle.kts` 建置腳本中使用任務屬性 `compilerExecutionStrategy`：

```kotlin
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<KotlinCompile>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

請在 [此 YouTrack 任務](https://youtrack.jetbrains.com/issue/KT-49299) 中留下您的回饋。

### 棄用 kapt 和協程的建置選項

在 Kotlin 1.6.20 中，我們更改了屬性的棄用層級：

* 我們棄用了透過 Kotlin 守護程序使用 `kapt.use.worker.api` 執行 [kapt](kapt.md) 的能力 — 現在它會在 Gradle 輸出中產生警告。預設情況下，自 1.3.70 版本起 [kapt 一直在使用 Gradle workers](kapt.md#run-kapt-tasks-in-parallel)，我們建議堅持使用此方法。

  我們將在未來的發佈版本中移除 `kapt.use.worker.api` 選項。

* 我們棄用了 `kotlin.experimental.coroutines` Gradle DSL 選項以及在 `gradle.properties` 中使用的 `kotlin.coroutines` 屬性。只需使用「掛起函式（suspending functions）」或 [將 `kotlinx.coroutines` 相依性加入](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library) 您的 `build.gradle(.kts)` 檔案中即可。
  
  在 [協程指南](coroutines-guide.md) 中了解更多關於協程的資訊。

### 移除 kotlin.parallel.tasks.in.project 建置選項

在 Kotlin 1.5.20 中，我們宣佈了 [建置選項 `kotlin.parallel.tasks.in.project` 的棄用](whatsnew1520.md#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)。此選項已在 Kotlin 1.6.20 中移除。

視專案而定，Kotlin 守護程序中的平行編譯可能需要更多記憶體。若要減少記憶體消耗，請 [增加 Kotlin 守護程序的堆積大小](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)。

在 Kotlin Gradle 外掛程式中進一步了解 [目前支援的編譯器選項](gradle-compiler-options.md)。