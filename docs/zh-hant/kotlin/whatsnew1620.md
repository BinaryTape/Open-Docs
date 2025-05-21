---
title: "Kotlin 1.6.20 的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[已發布：2022 年 4 月 4 日](releases#release-details)_

Kotlin 1.6.20 揭示了未來語言功能預覽，使階層式結構成為多平台專案的預設設定，並為其他元件帶來了漸進式改進。

您也可以在此影片中找到變更的簡短概述：

<video src="https://www.youtube.com/v/8F19ds109-o" title="What's new in Kotlin 1.6.20"/>

## 語言 （Language）

在 Kotlin 1.6.20 中，您可以嘗試兩個新的語言功能：

* [Kotlin/JVM 的 Context Receivers 原型](#prototype-of-context-receivers-for-kotlin-jvm)
* [絕對不可為空類型（Definitely non-nullable types）](#definitely-non-nullable-types)

### Kotlin/JVM 的 Context Receivers 原型

:::note
此功能是僅適用於 Kotlin/JVM 的原型。啟用 `-Xcontext-receivers` 後，
編譯器將產生無法在生產程式碼中使用的預發布二進位檔。
僅在您的玩具專案中使用 Context Receivers。
我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中的回饋。

使用 Kotlin 1.6.20，您不再僅限於擁有一個 Receiver。如果需要更多，您可以透過將 Context Receivers 新增至函式、屬性和類別宣告，使這些宣告具有上下文相依性（或 _contextual_）。Contextual 宣告會執行下列動作：

* 它要求所有宣告的 Context Receivers 都以隱含 Receiver 的形式存在於呼叫者的範圍中。
* 它將宣告的 Context Receivers 以隱含 Receiver 的形式帶入其主體範圍中。

```kotlin
interface LoggingContext {
    val log: Logger // 此上下文提供記錄器的參考
}

context(LoggingContext)
fun startBusinessOperation() {
    // 您可以存取 log 屬性，因為 LoggingContext 是隱含 Receiver
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // 您需要在範圍中擁有 LoggingContext 作為隱含 Receiver
        // 才能呼叫 startBusinessOperation()
        startBusinessOperation()
    }
}
```

若要在專案中啟用 Context Receivers，請使用 `-Xcontext-receivers` 編譯器選項。
您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers#detailed-design) 中找到此功能及其語法的詳細說明。

請注意，此實作是原型：

* 啟用 `-Xcontext-receivers` 後，編譯器將產生無法在生產程式碼中使用的預發布二進位檔
* 目前 IDE 對於 Context Receivers 的支援極少

請在您的玩具專案中試用此功能，並在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-42435) 中與我們分享您的想法和經驗。
如果您遇到任何問題，請[提交新的問題](https://kotl.in/issue)。

### 絕對不可為空類型（Definitely non-nullable types）

絕對不可為空類型處於 [Beta](components-stability) 階段。它們幾乎穩定，
但未來可能需要遷移步驟。
我們會盡力減少您必須進行的任何變更。

為了在擴充泛型 Java 類別和介面時提供更好的互通性，Kotlin 1.6.20 允許您使用新的語法 `T & Any` 將泛型類型參數標記為在使用位置上絕對不可為空。
語法形式來自於 [交集類型](https://en.wikipedia.org/wiki/Intersection_type) 的標記法，現在僅限於 `&` 左側具有可為空上限，右側具有不可為空 `Any` 的類型參數：

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

將語言版本設定為 `1.7` 以啟用此功能：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.7"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.7'
        }
    }
}
```

</TabItem>
</Tabs>

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types) 中深入瞭解絕對不可為空類型。

## Kotlin/JVM

Kotlin 1.6.20 引入：

* JVM 介面中預設方法的回溯相容性改進：[適用於介面的新 `@JvmDefaultWithCompatibility` 註解](#new-jvmdefaultwithcompatibility-annotation-for-interfaces) 和 [`-Xjvm-default` 模式中的回溯相容性變更](#compatibility-changes-in-the-xjvm-default-modes)
* [支援在 JVM 後端並行編譯單一模組](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
* [支援對可呼叫的函式介面建構函式的參考](#support-for-callable-references-to-functional-interface-constructors)

### 適用於介面的新 @JvmDefaultWithCompatibility 註解

Kotlin 1.6.20 引入了新的註解 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)：將它與 `-Xjvm-default=all` 編譯器選項一起使用，[以在 JVM 介面中建立預設方法](java-to-kotlin-interop#default-methods-in-interfaces)，適用於任何 Kotlin 介面中的任何非抽象成員。

如果有用戶端使用在沒有 `-Xjvm-default=all` 選項的情況下編譯的 Kotlin 介面，則它們可能與使用此選項編譯的程式碼不具備二進位檔回溯相容性。
在 Kotlin 1.6.20 之前，為了避免此回溯相容性問題，[建議的方法](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility) 是使用 `-Xjvm-default=all-compatibility` 模式，以及適用於不需要此類型回溯相容性的介面的 `@JvmDefaultWithoutCompatibility` 註解。

此方法存在一些缺點：

* 當新增新的介面時，您可能會輕易忘記新增註解。
* 通常，非公開部分中的介面比公開 API 中的介面更多，因此您最終會在程式碼中的許多位置都擁有此註解。

現在，您可以使用 `-Xjvm-default=all` 模式，並使用 `@JvmDefaultWithCompatibility` 註解標記介面。
這可讓您將此註解一次新增至公開 API 中的所有介面，並且您不需要對任何新的非公開程式碼使用任何註解。

請在 [此 YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-48217) 中留下關於此新註解的回饋。

### -Xjvm-default 模式中的回溯相容性變更

Kotlin 1.6.20 新增了針對以 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式編譯的模組，在預設模式（`-Xjvm-default=disable` 編譯器選項）中編譯模組的選項。
與之前一樣，如果所有模組都具有 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式，編譯也會成功。
您可以在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47000) 中留下您的回饋。

Kotlin 1.6.20 棄用了編譯器選項 `-Xjvm-default` 的 `compatibility` 和 `enable` 模式。
其他模式的描述中也存在與回溯相容性相關的變更，但整體邏輯保持不變。
您可以查看[更新的描述](java-to-kotlin-interop#compatibility-modes-for-default-methods)。

如需 Java 互通性中預設方法的詳細資訊，請參閱[互通性文件](java-to-kotlin-interop#default-methods-in-interfaces) 和
[此部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 支援在 JVM 後端並行編譯單一模組

支援在 JVM 後端並行編譯單一模組是 [實驗性](components-stability) 的。
它可能會隨時被捨棄或變更。需要選擇加入（請參閱以下詳細資訊），並且您應該僅將它用於評估目的。
我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-46085) 中對它的回饋。

我們正在繼續努力[縮短新的 JVM IR 後端編譯時間](https://youtrack.jetbrains.com/issue/KT-46768)。
在 Kotlin 1.6.20 中，我們新增了實驗性 JVM IR 後端模式，以並行方式編譯模組中的所有檔案。
並行編譯最多可以減少 15% 的總編譯時間。

使用 [編譯器選項](compiler-reference#compiler-options) `-Xbackend-threads` 啟用實驗性並行後端模式。
將下列引數用於此選項：

* `N` 是您想要使用的執行緒數。它不應大於您的 CPU 核心數；否則，由於執行緒之間切換上下文，並行化會停止有效
* `0` 對於每個 CPU 核心使用單獨的執行緒

[Gradle](gradle) 可以並行執行任務，但是當一個專案（或專案的主要部分）僅是從 Gradle 的角度來看的一個大型任務時，此類型的並行化作用不大。
如果您有一個非常大的單體模組，請使用並行編譯來更快地進行編譯。
如果您的專案由許多小型模組組成，並且具有由 Gradle 並行化的建置，則新增另一層並行化可能會由於上下文切換而損害效能。

並行編譯有一些限制：
* 它不適用於 [kapt](kapt)，因為 kapt 停用了 IR 後端
* 依設計，它需要更多 JVM 堆積。堆積量與執行緒數成正比

:::

### 支援對可呼叫的函式介面建構函式的參考

:::note
支援對可呼叫的函式介面建構函式的參考是 [實驗性](components-stability) 的。
它可能會隨時被捨棄或變更。需要選擇加入（請參閱以下詳細資訊），並且您應該僅將它用於評估目的。
我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47939) 中對它的回饋。

支援對函式介面建構函式的 [可呼叫參考](reflection#callable-references) 增加了一種來源回溯相容的方式，可從具有建構函式函式的介面遷移到 [函式介面](fun-interfaces)。

請考慮下列程式碼：

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () `->` Unit): Printer = object : Printer { override fun print() = block() }
```

啟用對函式介面建構函式的可呼叫參考後，可以使用函式介面宣告來取代此程式碼：

```kotlin
fun interface Printer {
    fun print()
}
```

其建構函式將隱式建立，並且任何使用 `::Printer` 函式參考的程式碼都將編譯。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```

透過使用 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 註解和 `DeprecationLevel.HIDDEN` 標記舊版函式 `Printer` 來保留二進位檔回溯相容性：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

使用編譯器選項 `-XXLanguage:+KotlinFunInterfaceConstructorReference` 啟用此功能。

## Kotlin/Native

Kotlin/Native 1.6.20 標誌著其新元件的持續開發。我們朝著在其他平台上提供一致的 Kotlin 體驗又邁出了一步：

* [關於新記憶體管理員的更新](#an-update-on-the-new-memory-manager)
* [用於新記憶體管理員中 Sweep 階段的並行實作](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
* [註解類別的實例化](#instantiation-of-annotation-classes)
* [與 Swift async/await 的互通性：傳回 Swift 的 Void 而不是 KotlinUnit](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [具有 libbacktrace 的更佳堆疊追蹤](#better-stack-traces-with-libbacktrace)
* [支援獨立 Android 可執行檔](#support-for-standalone-android-executables)
* [效能改進](#performance-improvements)
* [改進 cinterop 模組匯入期間的錯誤處理](#improved-error-handling-during-cinterop-modules-import)
* [支援 Xcode 13 程式庫](#support-for-xcode-13-libraries)

### 關於新記憶體管理員的更新

新的 Kotlin/Native 記憶體管理員處於 [Alpha](components-stability) 階段。
它可能會以不回溯相容的方式變更，並且未來需要手動遷移。
我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中對它的回饋。

:::

使用 Kotlin 1.6.20，您可以試用新 Kotlin/Native 記憶體管理員的 Alpha 版本。
它消除了 JVM 和 Native 平台之間的差異，以在多平台專案中提供一致的開發人員體驗。
例如，您將可以更輕鬆地建立適用於 Android 和 iOS 的新跨平台行動應用程式。

新的 Kotlin/Native 記憶體管理員解除了對執行緒之間物件共用的限制。
它還提供了安全且無需任何特殊管理或註解的無記憶體洩漏並行程式設計基本元素。

新的記憶體管理員將在未來的版本中成為預設設定，因此我們建議您立即試用它。
查看我們的 [部落格文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/) 以瞭解有關新記憶體管理員的更多資訊，並探索示範專案，或直接跳到 [遷移指示](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM) 以自行試用。

嘗試在您的專案中使用新的記憶體管理員，以瞭解它的運作方式，並在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享回饋。

### 用於新記憶體管理員中 Sweep 階段的並行實作

如果您已切換到我們在 [Kotlin 1.6 中宣布](whatsnew16#preview-of-the-new-memory-manager) 的新記憶體管理員，您可能會注意到執行時間的巨大改進：我們的基準測試顯示平均提高了 35%。
從 1.6.20 開始，還有適用於新記憶體管理員的 Sweep 階段的並行實作。
這也應該可以提高效能並減少垃圾收集器暫停的持續時間。

若要為新的 Kotlin/Native 記憶體管理員啟用此功能，請傳遞下列編譯器選項：

```bash
-Xgc=cms 
```

請隨時在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48526) 中分享您對新記憶體管理員效能的回饋。

### 註解類別的實例化

在 Kotlin 1.6.0 中，註解類別的實例化對於 Kotlin/JVM 和 Kotlin/JS 而言已變得 [穩定](components-stability)。
1.6.20 版本提供了對 Kotlin/Native 的支援。

深入瞭解[註解類別的實例化](annotations#instantiation)。

### 與 Swift async/await 的互通性：傳回 Swift 的 Void 而不是 KotlinUnit

:::note
與 Swift async/await 的並行互通性是 [實驗性](components-stability) 的。它可能會隨時被捨棄或變更。
您應該僅將它用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 中對它的回饋。

我們一直在繼續開發 [與 Swift 的 async/await 進行實驗性互通性](whatsnew1530#experimental-interoperability-with-swift-5-5-async-await)（自 Swift 5.5 起可用）。
Kotlin 1.6.20 與先前版本在處理具有 `Unit` 傳回類型的 `suspend` 函式的方式上有所不同。

先前，此類函式在 Swift 中呈現為傳回 `KotlinUnit` 的 `async` 函式。但是，它們的正確傳回類型是 `Void`，類似於非暫停函式。

為了避免中斷現有的程式碼，我們引入了一個 Gradle 屬性，使編譯器能夠將傳回 `Unit` 的暫停函式轉換為傳回類型為 `Void` 的 `async` Swift：

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

我們計劃在未來的 Kotlin 版本中將此行為設為預設行為。

### 具有 libbacktrace 的更佳堆疊追蹤

使用 libbacktrace 解決來源位置是 [實驗性](components-stability) 的。它可能會隨時被捨棄或變更。
您應該僅將它用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424) 中對它的回饋。

Kotlin/Native 現在能夠產生具有檔案位置和行號的詳細堆疊追蹤，
以便更好地對 `linux*`（`linuxMips32` 和 `linuxMipsel32` 除外）和 `androidNative*` 目標進行偵錯。

此功能在幕後使用 [libbacktrace](https://github.com/ianlancetaylor/libbacktrace) 程式庫。
查看下列程式碼以查看差異範例：

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

* **具有 libbacktrace 的 1.6.20：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x229550    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe        0x22420c    kfun:kotlin.Exception#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe        0x22430c    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe        0x22470c    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe        0x25fac8    kfun:#bar(){} + 104 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)
   at 5   example.kexe        0x25fac8    kfun:#bar(){} + 104 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe        0x25fac8    kfun:#bar(){} + 104 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe        0x25fa4c    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
```

在堆疊追蹤中已具有檔案位置和行號的 Apple 目標上，libbacktrace 為內嵌函式呼叫提供更多詳細資訊：

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

* **具有 libbacktrace 的 1.6.20：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10669bc88    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x106696bd6    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x106696cc6    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x106697016    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)  
:::caution
at 5   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe    0x106689d35    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe    0x106689cac    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```

若要產生具有 libbacktrace 的更佳堆疊追蹤，請將下列行新增至 `gradle.properties`：

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

請在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48424) 中告訴我們使用 libbacktrace 偵錯 Kotlin/Native 的運作方式。

### 支援獨立 Android 可執行檔

先前，Kotlin/Native 中的 Android Native 可執行檔實際上並不是可執行檔，而是您可以當作 NativeActivity 使用的共用程式庫。現在有一個選項可以為 Android Native 目標產生標準可執行檔。

為此，在專案的 `build.gradle(.kts)` 部分中，設定 `androidNative` 目標的可執行檔區塊。
新增下列二進位檔選項：

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

請注意，此功能將在 Kotlin 1.7.0 中成為預設設定。
如果您想要保留目前的行為，請使用下列設定：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

感謝 Mattia Iavarone 的 [實作](https://github.com/jetbrains/kotlin/pull/4624)！

### 效能改進

我們正在努力開發 Kotlin/Native，以[加快編譯程序](https://youtrack.jetbrains.com/issue/KT-42294) 並改善您的開發體驗。

Kotlin 1.6.20 帶來了一些效能更新和錯誤修正，這些更新和錯誤修正會影響 Kotlin 產生的 LLVM IR。
根據我們內部專案的基準測試，我們平均實現了下列效能提升：

* 執行時間縮短 15%
* 發布和偵錯二進位檔的程式碼大小縮小 20%
* 發布二進位檔的編譯時間縮短 26%

這些變更還將大型內部專案上偵錯二進位檔的編譯時間縮短了 10%。

為了實現這一點，我們為一些編譯器產生的合成物件實作了靜態初始化，改進了我們為每個函式建構 LLVM IR 的方式，並最佳化了編譯器快取。

### 改進 cinterop 模組匯入期間的錯誤處理

此版本針對您使用 `cinterop` 工具匯入 Objective-C 模組（這是 CocoaPods Pod 的典型做法）的情況引入了改進的錯誤處理。
先前，如果您在嘗試使用 Objective-C 模組時發生錯誤（例如，在處理標頭中的編譯錯誤時），您會收到一條沒有提供太多資訊的錯誤訊息，例如 `fatal error: could not build module $name`。
我們擴充了 `cinterop` 工具的這一部分，因此您將收到一條包含擴充描述的錯誤訊息。

### 支援 Xcode 13 程式庫

自此版本起，Xcode 13 隨附的程式庫已獲得完整支援。
您可以隨時從 Kotlin 程式碼中的任何位置存取它們。

## Kotlin Multiplatform

1.6.20 為 Kotlin Multiplatform 帶來了下列值得注意的更新：

* [階層式結構支援現在是所有新多平台專案的預設設定](#hierarchical-structure-support-for-multiplatform-projects)
* [Kotlin CocoaPods Gradle 外掛程式收到了幾個用於 CocoaPods 整合的實用功能](#kotlin-cocoapods-gradle-plugin)

### 階層式結構支援現在是多平台專案的預設設定

Kotlin 1.6.20 預設已啟用階層式結構支援。
自從 [在 Kotlin 1.4.0 中引入它](whatsnew14#sharing-code-in-several-targets-with-the-hierarchical-project-structure) 以來，我們已大幅改進前端並使 IDE 匯入穩定。

先前，有兩種方法可以在多平台專案中新增程式碼。第一種方法是將它插入特定於平台的來源集，該來源集僅限於一個目標且無法由其他平台重複使用。
第二種方法是使用在目前 Kotlin 支援的所有平台上共用的通用來源集。

現在，您可以[在多個類似的 Native 目標之間共用原始碼](#better-code-sharing-in-your-project)，這些目標會重複使用許多通用邏輯和第三方 API。
此技術將提供正確的預設相依性，並找到共用程式碼中可用的確切 API。
這消除了複雜的建置設定，並且不必使用解決方法來取得 IDE 支援以在 Native 目標之間共用來源集。
它還有助於防止不安全的 API 用法，這些用法適用於不同的目標。

此技術對於 [程式庫作者](#more-opportunities-for-library-authors) 也會派上用場，因為階層式專案結構允許他們發布和使用具有適用於目標子集的通用 API 的程式庫。

預設情況下，使用階層式專案結構發布的程式庫僅與階層式結構專案相容。

#### 專案中更好的程式碼共用

如果沒有階層式結構支援，則沒有直接的方法可以在 _某些_（但不是_所有_）[Kotlin 目標](multiplatform-dsl-reference#targets) 之間共用程式碼。
一個常見的範例是在所有 iOS 目標之間共用程式碼，並存取特定於 iOS 的 [相依性](multiplatform-share-on-platforms#connect-platform-specific-libraries)，例如 Foundation。

感謝階層式專案結構支援，您現在可以開箱即用地實現此目的。
在新的結構中，來源集形成階層。
您可以使用適用於給定來源集編譯成的每個目標的特定於平台的語言功能和相依性。

例如，請考慮一個具有兩個目標的典型多平台專案，即適用於 iOS 裝置和模擬器的 `iosArm64` 和 `iosX64`。
Kotlin 工具瞭解到這兩個目標具有相同的功能，並允許您從中繼來源集 `iosMain` 存取該功能。

<img src="/img/ios-hierarchy-example.jpg" alt="iOS hierarchy example" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin 工具鏈提供正確的預設相依性，例如 Kotlin/Native stdlib 或 Native 程式庫