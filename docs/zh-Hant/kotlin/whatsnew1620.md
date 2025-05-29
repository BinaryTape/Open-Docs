[//]: # (title: Kotlin 1.6.20 的新功能)

_[發佈日期：2022 年 4 月 4 日](releases.md#release-details)_

Kotlin 1.6.20 揭示了未來語言功能的預覽，將階層式結構 (hierarchical structure) 設定為多平台專案 (multiplatform projects) 的預設選項，並為其他組件帶來了演進性改進。

您也可以在這段影片中找到變更的簡短概述：

<video src="https://www.youtube.com/v/8F19ds109-o" title="What's new in Kotlin 1.6.20"/>

## 語言

在 Kotlin 1.6.20 中，您可以試用兩項新的語言功能：

*   [Kotlin/JVM 的環境接收器 (Context Receivers) 原型](#prototype-of-context-receivers-for-kotlin-jvm)
*   [確定非空值型別 (Definitely Non-nullable Types)](#definitely-non-nullable-types)

### Kotlin/JVM 的環境接收器 (Context Receivers) 原型

> 此功能為原型，僅適用於 Kotlin/JVM。啟用 `-Xcontext-receivers` 後，
> 編譯器將產生預發行二進位檔，這些檔案不能用於生產程式碼。
> 請僅在您的實驗專案中使用環境接收器。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供的回饋。
>
{style="warning"}

有了 Kotlin 1.6.20，您不再受限於只有一個接收器 (receiver)。如果您需要更多，可以透過在其宣告中加入環境接收器 (context receivers)，使函式、屬性和類別變得與環境相關（或稱**上下文相關**）。一個上下文相關的宣告會執行以下操作：

*   它要求所有宣告的環境接收器都必須作為隱式接收器存在於呼叫端的範圍 (caller's scope) 中。
*   它將宣告的環境接收器作為隱式接收器帶入其主體範圍 (body scope) 中。

```kotlin
interface LoggingContext {
    val log: Logger // This context provides a reference to a logger 
}

context(LoggingContext)
fun startBusinessOperation() {
    // You can access the log property since LoggingContext is an implicit receiver
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // You need to have LoggingContext in a scope as an implicit receiver
        // to call startBusinessOperation()
        startBusinessOperation()
    }
}
```

要在您的專案中啟用環境接收器，請使用 `-Xcontext-receivers` 編譯器選項。
您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md#detailed-design) 中找到此功能及其語法的詳細說明。

請注意，此實作是一個原型：

*   啟用 `-Xcontext-receivers` 後，編譯器將產生預發行二進位檔，這些檔案不能用於生產程式碼。
*   目前 IDE 對環境接收器的支援最少。

請在您的實驗專案中試用此功能，並在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-42435) 中與我們分享您的想法和經驗。
如果您遇到任何問題，請[提出新的問題](https://kotl.in/issue)。

### 確定非空值型別 (Definitely Non-nullable Types)

> 確定非空值型別處於 [Beta](components-stability.md) 階段。它們幾乎穩定，
> 但未來可能需要遷移步驟。
> 我們將盡力減少您必須進行的任何變更。
>
{style="warning"}

為了在擴展泛型 Java 類別和介面時提供更好的互通性，Kotlin 1.6.20 允許您使用新的語法 `T & Any` 在使用點 (use site) 將泛型型別參數標記為確定非空值。
該語法形式來自 [交集型別 (intersection types)](https://en.wikipedia.org/wiki/Intersection_type) 的表示法，目前僅限於左側具有可空上限 (nullable upper bounds) 的型別參數與右側的非空 `Any`：

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // OK
    elvisLike<String>("", "").length
    // Error: 'null' cannot be a value of a non-null type
    elvisLike<String>("", null).length

    // OK
    elvisLike<String?>(null, "").length
    // Error: 'null' cannot be a value of a non-null type
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

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md) 中了解有關確定非空值型別的更多資訊。

## Kotlin/JVM

Kotlin 1.6.20 引入：

*   JVM 介面中預設方法的相容性改進：[介面的新 `@JvmDefaultWithCompatibility` 註解](#new-jvmdefaultwithcompatibility-annotation-for-interfaces) 和 [`-Xjvm-default` 模式的相容性變更](#compatibility-changes-in-the-xjvm-default-modes)
*   [支援 JVM 後端 (JVM backend) 中單一模組的平行編譯](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
*   [支援功能介面建構子 (functional interface constructors) 的可呼叫參考 (callable references)](#support-for-callable-references-to-functional-interface-constructors)

### 介面的新 @JvmDefaultWithCompatibility 註解

Kotlin 1.6.20 引入了新的註解 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)：將其與 `-Xjvm-default=all` 編譯器選項一起使用，[為任何 Kotlin 介面中的任何非抽象成員建立 JVM 介面中的預設方法](java-to-kotlin-interop.md#default-methods-in-interfaces)。

如果存在使用未開啟 `-Xjvm-default=all` 選項編譯的 Kotlin 介面的用戶端，則它們可能與使用此選項編譯的程式碼不相容。
在 Kotlin 1.6.20 之前，為避免此相容性問題，[建議的方法](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility) 是使用 `-Xjvm-default=all-compatibility` 模式，並為不需要此類相容性的介面使用 `@JvmDefaultWithoutCompatibility` 註解。

這種方法有一些缺點：

*   新增介面時，您可能很容易忘記添加註解。
*   通常非公開部分中的介面比公開 API 中的介面更多，因此您最終會在程式碼中的許多地方使用此註解。

現在，您可以使用 `-Xjvm-default=all` 模式並使用 `@JvmDefaultWithCompatibility` 註解標記介面。
這允許您將此註解一次性添加到公開 API 中的所有介面，並且您不需要為新的非公開程式碼使用任何註解。

請在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48217) 中留下您對此新註解的回饋。

### -Xjvm-default 模式的相容性變更

Kotlin 1.6.20 新增了在預設模式下（`-Xjvm-default=disable` 編譯器選項）針對使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式編譯的模組進行編譯的選項。
與之前一樣，如果所有模組都採用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式，編譯也會成功。
您可以在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47000) 中留下您的回饋。

Kotlin 1.6.20 棄用了編譯器選項 `-Xjvm-default` 的 `compatibility` 和 `enable` 模式。
其他模式的描述中也有關於相容性的變更，但整體邏輯保持不變。
您可以查看 [更新的描述](java-to-kotlin-interop.md#compatibility-modes-for-default-methods)。

有關 Java 互通性 (Java interop) 中預設方法的更多資訊，請參閱 [互通性文件](java-to-kotlin-interop.md#default-methods-in-interfaces) 和 [此部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 支援 JVM 後端中單一模組的平行編譯

> 支援 JVM 後端中單一模組的平行編譯處於 [實驗性 (Experimental)](components-stability.md) 階段。
> 它可能隨時被移除或更改。需要選擇加入 (opt-in)（詳情請見下文），並且您應僅將其用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-46085) 中提供的回饋。
>
{style="warning"}

我們正在繼續努力[改進新的 JVM IR 後端編譯時間](https://youtrack.jetbrains.com/issue/KT-46768)。
在 Kotlin 1.6.20 中，我們新增了實驗性的 JVM IR 後端模式，以平行編譯模組中的所有檔案。
平行編譯可以將總編譯時間縮短多達 15%。

使用 [編譯器選項](compiler-reference.md#compiler-options) `-Xbackend-threads` 啟用實驗性平行後端模式。
為此選項使用以下參數：

*   `N` 是您要使用的執行緒數量。它不應大於您的 CPU 核心數；否則，由於執行緒之間的上下文切換，平行化將不再有效。
*   `0` 表示為每個 CPU 核心使用單獨的執行緒。

[Gradle](gradle.md) 可以平行執行任務，但當專案（或專案的主要部分）從 Gradle 的角度來看只是一個大任務時，這種平行化並沒有多大幫助。
如果您的專案是一個非常大的單體模組 (monolithic module)，請使用平行編譯以更快地進行編譯。
如果您的專案由許多小模組組成並由 Gradle 平行化建置，則新增另一層平行化可能會由於上下文切換而影響效能。

> 平行編譯有一些限制：
> *   它不適用於 [kapt](kapt.md)，因為 kapt 會停用 IR 後端
> *   設計上它需要更多的 JVM 堆記憶體。堆記憶體量與執行緒數量成正比。
>
{style="note"}

### 支援功能介面建構子 (Functional Interface Constructors) 的可呼叫參考 (Callable References)

> 支援功能介面建構子的可呼叫參考處於 [實驗性 (Experimental)](components-stability.md) 階段。
> 它可能隨時被移除或更改。需要選擇加入 (opt-in)（詳情請見下文），並且您應僅將其用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47939) 中提供的回饋。
>
{style="warning"}

支援功能介面建構子 (functional interface constructors) 的可呼叫參考 (callable references) 提供了一種源碼相容 (source-compatible) 的方式，可以從帶有建構子函式的介面遷移到[功能介面](fun-interfaces.md)。

考慮以下程式碼：

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

啟用功能介面建構子的可呼叫參考後，此程式碼可以只用一個功能介面宣告來替換：

```kotlin
fun interface Printer {
    fun print()
}
```

它的建構子將被隱式建立，並且任何使用 `::Printer` 函式參考的程式碼都將編譯成功。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```
{validate="false"}

透過使用 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 註解與 `DeprecationLevel.HIDDEN` 標記舊式函式 `Printer`，來保留二進位相容性：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```
{validate="false"}

使用編譯器選項 `-XXLanguage:+KotlinFunInterfaceConstructorReference` 啟用此功能。

## Kotlin/Native

Kotlin/Native 1.6.20 標誌著其新組件的持續發展。我們朝著與其他平台上 Kotlin 一致的開發體驗邁出了另一步：

*   [新記憶體管理器 (memory manager) 的更新](#an-update-on-the-new-memory-manager)
*   [新記憶體管理器中清理階段 (sweep phase) 的併發實作](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
*   [註解類別 (annotation classes) 的實例化](#instantiation-of-annotation-classes)
*   [與 Swift async/await 互通：返回 Swift 的 Void 而非 KotlinUnit](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
*   [使用 libbacktrace 改善堆疊追蹤 (stack traces)](#better-stack-traces-with-libbacktrace)
*   [支援獨立 Android 可執行檔 (standalone Android executables)](#support-for-standalone-android-executables)
*   [效能改進](#performance-improvements)
*   [cinterop 模組導入期間的錯誤處理改進](#improved-error-handling-during-cinterop-modules-import)
*   [支援 Xcode 13 函式庫](#support-for-xcode-13-libraries)

### 新記憶體管理器 (Memory Manager) 的更新 

> 新的 Kotlin/Native 記憶體管理器處於 [Alpha](components-stability.md) 階段。 
> 它將來可能會不相容地更改並需要手動遷移。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中提供的回饋。
>
{style="note"}

在 Kotlin 1.6.20 中，您可以試用新 Kotlin/Native 記憶體管理器的 Alpha 版本。
它消除了 JVM 和原生平台之間的差異，為多平台專案 (multiplatform projects) 提供一致的開發者體驗。
例如，您將更容易建立可在 Android 和 iOS 上運行的新的跨平台行動應用程式。

新的 Kotlin/Native 記憶體管理器取消了執行緒間物件共享的限制。
它還提供了無記憶體洩漏的併發程式設計原語 (concurrent programming primitives)，這些原語是安全的，不需要任何特殊管理或註解。

新的記憶體管理器將在未來版本中成為預設選項，因此我們鼓勵您現在就試用它。
查看我們的[部落格文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)以了解有關新記憶體管理器的更多資訊並探索示範專案，或直接跳到[遷移說明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)親自試用。

嘗試在您的專案中使用新的記憶體管理器，看看它是如何運作的，並在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享回饋。

### 新記憶體管理器中清理階段 (Sweep Phase) 的併發實作

如果您已經切換到我們在 [Kotlin 1.6 中宣布的新記憶體管理器](whatsnew16.md#preview-of-the-new-memory-manager)，您可能會注意到執行時間的巨大改進：我們的基準測試顯示平均提升了 35%。
從 1.6.20 開始，新的記憶體管理器還提供了清理階段的併發實作。
這也應該可以提高效能並縮短垃圾收集器暫停的持續時間。

要為新的 Kotlin/Native 記憶體管理器啟用此功能，請傳遞以下編譯器選項：

```bash
-Xgc=cms 
```

請隨時在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48526) 中分享您對新記憶體管理器效能的回饋。

### 註解類別 (Annotation Classes) 的實例化

在 Kotlin 1.6.0 中，註解類別的實例化對於 Kotlin/JVM 和 Kotlin/JS 而言已變得[穩定 (Stable)](components-stability.md)。
1.6.20 版本則為 Kotlin/Native 提供了支援。

了解更多關於[註解類別的實例化](annotations.md#instantiation)。

### 與 Swift async/await 互通：返回 Void 而非 KotlinUnit

> 與 Swift async/await 的併發互通性處於 [實驗性 (Experimental)](components-stability.md) 階段。它可能隨時被移除或更改。
> 您應僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 中提供的回饋。
>
{style="warning"}

我們持續在[實驗性 Swift async/await 互通性](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await)（自 Swift 5.5 起可用）方面努力。
Kotlin 1.6.20 在處理返回 `Unit` 型別的 `suspend` 函式方面與以前的版本不同。

以前，此類函式在 Swift 中呈現為返回 `KotlinUnit` 的 `async` 函式。然而，它們的正確返回型別是 `Void`，類似於非 suspend 函式。

為了避免破壞現有程式碼，我們引入了一個 Gradle 屬性，使編譯器將返回 `Unit` 的 suspend 函式轉換為具有 `Void` 返回型別的 `async` Swift 函式：

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

我們計劃在未來的 Kotlin 版本中將此行為設為預設。

### 使用 libbacktrace 改善堆疊追蹤 (Stack Traces)

> 使用 libbacktrace 解析原始碼位置處於 [實驗性 (Experimental)](components-stability.md) 階段。它可能隨時被移除或更改。
> 您應僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424) 中提供的回饋。
>
{style="warning"}

Kotlin/Native 現在能夠產生帶有檔案位置和行號的詳細堆疊追蹤，以便更好地對 `linux*`（除了 `linuxMips32` 和 `linuxMipsel32`）和 `androidNative*` 目標進行偵錯。

此功能底層使用了 [libbacktrace](https://github.com/ianlancetaylor/libbacktrace) 函式庫。
請看以下程式碼以查看差異範例：

```kotlin
fun main() = bar()
fun bar() = baz()
inline fun baz() {
    error("")
}
```

*   **1.6.20 之前：**

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

*   **1.6.20 搭配 libbacktrace：**

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
{initial-collapse-state="collapsed" collapsible="true"}

在 Apple 目標上，雖然它們已在堆疊追蹤中具備檔案位置和行號，但 libbacktrace 為內聯函式呼叫提供了更多詳細資訊：

*   **1.6.20 之前：**

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

*   **1.6.20 搭配 libbacktrace：**

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

要使用 libbacktrace 產生更好的堆疊追蹤，請將以下行新增到 `gradle.properties`：

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

請在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48424) 中告訴我們使用 libbacktrace 偵錯 Kotlin/Native 的體驗如何。

### 支援獨立 Android 可執行檔 (Standalone Android Executables)

以前，Kotlin/Native 中的 Android 原生可執行檔實際上並非可執行檔，而是您可以作為 NativeActivity 使用的共享函式庫。現在有了一個選項，可以為 Android 原生目標生成標準可執行檔。

為此，在您專案的 `build.gradle(.kts)` 部分，配置 `androidNative` 目標的可執行檔區塊。
新增以下二進位選項：

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

請注意，此功能將在 Kotlin 1.7.0 中成為預設選項。
如果您想保留當前行為，請使用以下設定：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

感謝 Mattia Iavarone 的[實作](https://github.com/jetbrains/kotlin/pull/4624)！

### 效能改進

我們正努力在 Kotlin/Native 上[加速編譯過程](https://youtrack.jetbrains.com/issue/KT-42294)並改善您的開發體驗。

Kotlin 1.6.20 帶來了一些效能更新和錯誤修復，這些更新和修復影響了 Kotlin 生成的 LLVM IR。
根據我們內部專案的基準測試，我們平均達到了以下效能提升：

*   執行時間減少 15%
*   發行和偵錯二進位檔的程式碼大小減少 20%
*   發行二進位檔的編譯時間減少 26%

這些變更還使大型內部專案的偵錯二進位檔編譯時間減少了 10%。

為實現這一目標，我們為一些編譯器生成的合成物件實作了靜態初始化，改進了我們為每個函式構建 LLVM IR 的方式，並優化了編譯器快取。

### cinterop 模組導入期間的錯誤處理改進

此版本改進了在您使用 `cinterop` 工具導入 Objective-C 模組時的錯誤處理（這對於 CocoaPods pod 來說是典型的）。
以前，如果您在嘗試使用 Objective-C 模組時遇到錯誤（例如，處理標頭中的編譯錯誤時），您會收到一條缺乏資訊的錯誤訊息，例如 `fatal error: could not build module $name`。
我們擴展了 `cinterop` 工具的這一部分，因此您將收到帶有擴展描述的錯誤訊息。

### 支援 Xcode 13 函式庫

Xcode 13 隨附的函式庫已在此版本中獲得全面支援。
您可以隨時從您的 Kotlin 程式碼中存取它們。

## Kotlin 多平台

1.6.20 為 Kotlin 多平台帶來了以下顯著更新：

*   [階層式結構支援現在是所有新多平台專案的預設選項](#hierarchical-structure-support-for-multiplatform-projects)
*   [Kotlin CocoaPods Gradle 外掛程式獲得了 CocoaPods 整合的幾個有用功能](#kotlin-cocoapods-gradle-plugin)

### 多平台專案的階層式結構支援

Kotlin 1.6.20 預設啟用階層式結構支援。
自從[在 Kotlin 1.4.0 中引入](whatsnew14.md#sharing-code-in-several-targets-with-the-hierarchical-project-structure)以來，我們顯著改進了前端並使 IDE 導入穩定。

以前，在多平台專案中新增程式碼有兩種方式。第一種是將其插入到平台特定的原始碼集 (source set) 中，該原始碼集僅限於一個目標，不能被其他平台重用。
第二種是使用在所有目前由 Kotlin 支援的平台之間共享的通用原始碼集。

現在您可以在一些相似的原生目標之間[共享原始碼](#better-code-sharing-in-your-project)，這些目標重複使用大量通用邏輯和第三方 API。
這項技術將提供正確的預設依賴項，並找到共享程式碼中可用的精確 API。
這消除了複雜的建置設定和使用變通方法來獲得 IDE 對原生目標之間共享原始碼集的支援。
它還有助於防止用於不同目標的不安全 API 使用。

該技術對於[函式庫作者](#more-opportunities-for-library-authors)也將派上用場，因為階層式專案結構允許他們發布和使用具有通用 API 的函式庫，適用於目標的子集。

預設情況下，使用階層式專案結構發布的函式庫僅與階層式結構專案相容。

#### 專案中更好的程式碼共享

在沒有階層式結構支援的情況下，沒有直接的方法可以跨**某些**而非**所有** [Kotlin 目標](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)共享程式碼。
一個常見的例子是跨所有 iOS 目標共享程式碼並存取 iOS 特定的[依賴項](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)，例如 Foundation。

多虧了階層式專案結構支援，您現在可以直接實現這一點。
在新結構中，原始碼集 (source sets) 形成一個階層。
您可以為給定原始碼集編譯到的每個目標使用平台特定的語言功能和可用的依賴項。

例如，考慮一個典型的多平台專案，其中包含兩個目標——`iosArm64` 和 `iosX64`，分別適用於 iOS 裝置和模擬器。
Kotlin 工具了解兩個目標具有相同的功能，並允許您從中間原始碼集 `iosMain` 存取該功能。

![iOS hierarchy example](ios-hierarchy-example.jpg){width=700}

Kotlin 工具鏈提供正確的預設依賴項，例如 Kotlin/Native stdlib 或原生函式庫。
此外，Kotlin 工具將盡力準確找出共享程式碼中可用的 API 介面區域。
這可以防止諸如在為 Windows 共享的程式碼中使用 macOS 特定功能之類的情況。

#### 為函式庫作者提供更多機會

當多平台函式庫發布時，其中間原始碼集 (intermediate source sets) 的 API 現在會正確地隨之發布，使其可供消費者使用。
同樣，Kotlin 工具鏈將自動找出消費者原始碼集中可用的 API，同時仔細檢查不安全的使用方式，例如在 JS 程式碼中使用適用於 JVM 的 API。
了解更多關於[在函式庫中共享程式碼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)。

#### 配置和設定

從 Kotlin 1.6.20 開始，所有新的多平台專案都將採用階層式專案結構。無需額外設定。

*   如果您已經[手動開啟](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)，您可以從 `gradle.properties` 中移除棄用選項：

  ```none
  # gradle.properties
  kotlin.mpp.enableGranularSourceSetsMetadata=true
  kotlin.native.enableDependencyPropagation=false // or 'true', depending on your previous setup
  ```

*   對於 Kotlin 1.6.20，我們建議使用 [Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 或更高版本以獲得最佳體驗。

*   您也可以選擇退出。要停用階層式結構支援，請在 `gradle.properties` 中設定以下選項：

  ```none
  # gradle.properties
  kotlin.mpp.hierarchicalStructureSupport=false
  ```

#### 留下您的回饋

這是整個生態系統的重大變革。我們非常感謝您的回饋，以幫助使其變得更好。

立即試用並將您遇到的任何困難報告給[我們的問題追蹤器](https://kotl.in/issue)。

### Kotlin CocoaPods Gradle 外掛程式

為簡化 CocoaPods 整合，Kotlin 1.6.20 提供了以下功能：

*   CocoaPods 外掛程式現在具有用於建置包含所有註冊目標的 XCFrameworks 並生成 Podspec 檔案的任務。當您不想直接與 Xcode 整合，但希望建置構件 (artifacts) 並將其部署到本機 CocoaPods 儲存庫時，這會很有用。
  
    了解更多關於[建置 XCFrameworks](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#build-xcframeworks)。

*   如果您在專案中使用 [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)，您習慣於為整個 Gradle 專案指定所需的 Pod 版本。現在您有更多選項：
  *   直接在 `cocoapods` 區塊中指定 Pod 版本
  *   繼續使用 Gradle 專案版本
  
    如果這些屬性都沒有配置，您將會收到錯誤。

*   您現在可以在 `cocoapods` 區塊中配置 CocoaPod 名稱，而無需更改整個 Gradle 專案的名稱。

*   CocoaPods 外掛程式引入了一個新的 `extraSpecAttributes` 屬性，您可以用它來配置以前硬編碼的 Podspec 檔案中的屬性，例如 `libraries` 或 `vendored_frameworks`。

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

請參閱完整的 Kotlin CocoaPods Gradle 外掛程式 [DSL 參考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)。

## Kotlin/JS

Kotlin/JS 在 1.6.20 中的改進主要影響 IR 編譯器：

*   [開發用二進位檔 (IR) 的增量編譯](#incremental-compilation-for-development-binaries-with-ir-compiler)
*   [預設情況下頂層屬性 (top-level properties) 的惰性初始化 (IR)](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)
*   [預設情況下專案模組的單獨 JS 檔案 (IR)](#separate-js-files-for-project-modules-by-default-with-ir-compiler)
*   [Char 類別優化 (IR)](#char-class-optimization)
*   [匯出改進 (IR 和舊版後端皆適用)](#improvements-to-export-and-typescript-declaration-generation)
*   [@AfterTest 對非同步測試的保證](#aftertest-guarantees-for-asynchronous-tests)

### 開發用二進位檔 (IR) 的增量編譯

為了讓使用 IR 編譯器開發 Kotlin/JS 更加高效，我們引入了一種新的**增量編譯**模式。

當使用 `compileDevelopmentExecutableKotlinJs` Gradle 任務以這種模式建置**開發用二進位檔**時，編譯器會在模組級別快取先前編譯的結果。
它在隨後的編譯過程中會對未更改的原始碼檔案使用快取的編譯結果，從而使編譯完成得更快，尤其是在進行小幅更改時。
請注意，此改進專門針對開發過程（縮短編輯-建置-偵錯週期），並且不影響生產構件的建置。

要為開發用二進位檔啟用增量編譯，請將以下行新增到專案的 `gradle.properties`：

```none
# gradle.properties
kotlin.incremental.js.ir=true // false by default
```

在我們的測試專案中，新模式使增量編譯速度提高了 30%。然而，此模式下的乾淨建置 (clean build) 變得較慢，因為需要建立和填充快取。

請在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-50203) 中告訴我們您對在 Kotlin/JS 專案中使用增量編譯的看法。

### 預設情況下頂層屬性 (Top-level Properties) 的惰性初始化 (IR)

在 Kotlin 1.4.30 中，我們提出了 JS IR 編譯器中[頂層屬性惰性初始化](whatsnew1430.md#lazy-initialization-of-top-level-properties)的原型。
透過消除應用程式啟動時初始化所有屬性的需要，惰性初始化縮短了啟動時間。
我們的測量顯示在實際 Kotlin/JS 應用程式上約有 10% 的加速。

現在，我們已對此機制進行完善和適當測試，並將惰性初始化設為 IR 編譯器中頂層屬性的預設選項。

```kotlin
// lazy initialization
val a = run {
    val result = // intensive computations
        println(result)
    result
} // run is executed upon the first usage of the variable
```

如果由於某種原因您需要在應用程式啟動時急切 (eagerly) 初始化屬性，請使用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/) 註解標記它。

### 預設情況下專案模組的單獨 JS 檔案 (IR)

以前，JS IR 編譯器提供了[為專案模組生成單獨 `.js` 檔案](https://youtrack.jetbrains.com/issue/KT-44319)的能力。
這是預設選項（整個專案的單一 `.js` 檔案）的替代方案。
這個檔案可能過大且不便使用，因為每當您想從專案中使用一個函式時，您都必須將整個 JS 檔案作為依賴項包含進來。
擁有多個檔案增加了靈活性並減少了此類依賴項的大小。此功能可透過 `-Xir-per-module` 編譯器選項使用。

從 1.6.20 開始，JS IR 編譯器預設為專案模組生成單獨的 `.js` 檔案。

現在可以使用以下 Gradle 屬性將專案編譯為單一 `.js` 檔案：

```none
# gradle.properties
kotlin.js.ir.output.granularity=whole-program // `per-module` is the default
```

在先前的版本中，實驗性的逐模組模式（透過 `-Xir-per-module=true` 標誌可用）在每個模組中呼叫 `main()` 函式。這與常規的單一 `.js` 模式不一致。從 1.6.20 開始，`main()` 函式將僅在主模組中呼叫，兩種情況皆如此。如果您確實需要在模組載入時運行某些程式碼，可以使用帶有 `@EagerInitialization` 註解的頂層屬性。請參閱[預設情況下頂層屬性的惰性初始化 (IR)](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)。

### Char 類別優化

`Char` 類別現在由 Kotlin/JS 編譯器處理，無需引入裝箱 (boxing)（類似於[內聯類別](inline-classes.md)）。
這加速了 Kotlin/JS 程式碼中對字元的操作。

除了效能改進之外，這也改變了 `Char` 匯出到 JavaScript 的方式：它現在被翻譯為 `Number`。

### 匯出 (Export) 和 TypeScript 宣告生成改進

Kotlin 1.6.20 為匯出機制（[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 註解），包括 [TypeScript 宣告生成 (`.d.ts`)](js-ir-compiler.md#preview-generation-of-typescript-declaration-files-d-ts) 帶來了多項修正和改進。
我們新增了匯出介面和列舉的能力，並修正了先前向我們報告的一些邊角案例中的匯出行為。
有關更多詳細資訊，請參閱 [YouTrack 中匯出改進的清單](https://youtrack.jetbrains.com/issues?q=Project:%20Kotlin%20issue%20id:%20KT-45434,%20KT-44494,%20KT-37916,%20KT-43191,%20KT-46961,%20KT-40236)。

了解更多關於[從 JavaScript 使用 Kotlin 程式碼](js-to-kotlin-interop.md)。

### @AfterTest 對非同步測試的保證

Kotlin 1.6.20 讓 [`@AfterTest`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-after-test/) 函式在 Kotlin/JS 上的非同步測試中正常運作。
如果測試函式的返回型別靜態解析為 [`Promise`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/)，編譯器現在會將 `@AfterTest` 函式的執行安排到相應的 [`then()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/then.html) 回呼。

## 安全性

Kotlin 1.6.20 引入了一些功能來提高程式碼的安全性：

*   [在 klibs 中使用相對路徑](#using-relative-paths-in-klibs)
*   [為 Kotlin/JS Gradle 專案保留 yarn.lock](#persisting-yarn-lock-for-kotlin-js-gradle-projects)
*   [預設情況下使用 `--ignore-scripts` 安裝 npm 依賴項](#installation-of-npm-dependencies-with-ignore-scripts-by-default)

### 在 klibs 中使用相對路徑

`klib` 格式的函式庫[包含](native-libraries.md#library-format)原始碼檔案的序列化 IR 表示形式，其中也包含它們的路徑，用於生成正確的偵錯資訊。
在 Kotlin 1.6.20 之前，儲存的檔案路徑是絕對路徑。由於函式庫作者可能不想共享絕對路徑，因此 1.6.20 版本提供了一個替代選項。

如果您正在發布一個 `klib` 並希望在構件中僅使用原始碼檔案的相對路徑，您現在可以傳遞 `-Xklib-relative-path-base` 編譯器選項，並帶有一個或多個原始碼檔案的基準路徑：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile::class).configureEach {
    // $base is a base path of source files
    kotlinOptions.freeCompilerArgs += "-Xklib-relative-path-base=$base"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile).configureEach {
    kotlinOptions {
        // $base is a base path of source files
        freeCompilerArgs += "-Xklib-relative-path-base=$base"
    }
}
``` 

</tab>
</tabs>

### 為 Kotlin/JS Gradle 專案保留 yarn.lock

> 此功能已回溯到 Kotlin 1.6.10。
>
{style="note"}

Kotlin/JS Gradle 外掛程式現在提供了保留 `yarn.lock` 檔案的能力，這使得鎖定專案的 npm 依賴項版本成為可能，而無需額外的 Gradle 配置。
此功能透過將自動生成的 `kotlin-js-store` 目錄新增到專案根目錄來改變預設專案結構。
它內部包含 `yarn.lock` 檔案。

我們強烈建議將 `kotlin-js-store` 目錄及其內容提交到您的版本控制系統。
將鎖定檔案提交到版本控制系統是[推薦的做法](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)，因為它確保您的應用程式在所有機器上都使用完全相同的依賴樹進行建置，無論這些機器是其他機器上的開發環境還是 CI/CD 服務。
鎖定檔案還可以防止在專案在新的機器上檢出時，您的 npm 依賴項被靜默更新，這是一個安全問題。

像 [Dependabot](https://github.com/dependabot) 這樣的工具還可以解析您的 Kotlin/JS 專案的 `yarn.lock` 檔案，並在您所依賴的任何 npm 套件受損時向您提供警告。

如果需要，您可以在建置腳本中更改目錄和鎖定檔案名稱：

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

> 更改鎖定檔案的名稱可能會導致依賴項檢查工具不再識別該檔案。
> 
{style="warning"}

### 預設情況下使用 --ignore-scripts 安裝 npm 依賴項

> 此功能已回溯到 Kotlin 1.6.10。
>
{style="note"}

Kotlin/JS Gradle 外掛程式現在預設阻止在安裝 npm 依賴項期間執行[生命週期指令碼](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)。
此變更旨在降低從受損 npm 套件執行惡意程式碼的可能性。

要回復到舊配置，您可以透過將以下行新增到 `build.gradle(.kts)` 中來明確啟用生命週期指令碼執行：

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

了解更多關於 [Kotlin/JS Gradle 專案的 npm 依賴項](js-project-setup.md#npm-dependencies)。

## Gradle

Kotlin 1.6.20 為 Kotlin Gradle 外掛程式帶來了以下變更：

*   用於定義 Kotlin 編譯器執行策略的新屬性 `kotlin.compiler.execution.strategy` 和 `compilerExecutionStrategy`
*   [棄用 `kapt.use.worker.api`、`kotlin.experimental.coroutines` 和 `kotlin.coroutines` 選項](#deprecation-of-build-options-for-kapt-and-coroutines)
*   [移除 `kotlin.parallel.tasks.in.project` 建置選項](#removal-of-the-kotlin-parallel-tasks-in-project-build-option)

### 用於定義 Kotlin 編譯器執行策略的屬性

在 Kotlin 1.6.20 之前，您使用系統屬性 `-Dkotlin.compiler.execution.strategy` 來定義 Kotlin 編譯器執行策略。
此屬性在某些情況下可能不便。
Kotlin 1.6.20 引入了一個同名 Gradle 屬性 `kotlin.compiler.execution.strategy`，以及編譯任務屬性 `compilerExecutionStrategy`。

系統屬性仍然有效，但將在未來版本中移除。

目前屬性的優先級如下：

*   任務屬性 `compilerExecutionStrategy` 的優先級高於系統屬性和 Gradle 屬性 `kotlin.compiler.execution.strategy`。
*   Gradle 屬性的優先級高於系統屬性。

您可以為這些屬性指派三種編譯器執行策略：

| 策略            | Kotlin 編譯器在哪裡執行      | 增量編譯 | 其他特性                                                       |
|-------------------|----------------------------|------------|------------------------------------------------------------------|
| Daemon          | 在其自己的守護程式進程內     | 是         | *預設策略*。可在不同 Gradle 守護程式之間共享                |
| In process        | 在 Gradle 守護程式進程內     | 否         | 可與 Gradle 守護程式共享堆記憶體                              |
| Out of process    | 每次呼叫都在單獨的進程中執行 | 否         | —                                                                |

因此，`kotlin.compiler.execution.strategy` 屬性（系統和 Gradle 的）的可用值為：
1. `daemon`（預設）
2. `in-process`
3. `out-of-process`

在 `gradle.properties` 中使用 Gradle 屬性 `kotlin.compiler.execution.strategy`：

```none
# gradle.properties
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 任務屬性的可用值為：

1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON`（預設）
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

在 Kotlin 1.6.20 中，我們更改了屬性的棄用級別：

*   我們棄用了透過 Kotlin 守護程式運行 [kapt](kapt.md) 的能力（使用 `kapt.use.worker.api`）——現在它會向 Gradle 的輸出產生警告。
    預設情況下，[kapt 自 1.3.70 版本以來一直使用 Gradle worker](kapt.md#run-kapt-tasks-in-parallel)，我們建議堅持使用此方法。

    我們將在未來版本中移除選項 `kapt.use.worker.api`。

*   我們棄用了 `kotlin.experimental.coroutines` Gradle DSL 選項和 `gradle.properties` 中使用的 `kotlin.coroutines` 屬性。
    只需使用**掛起函式 (suspending functions)** 或[將 `kotlinx.coroutines` 依賴項新增到您的 `build.gradle(.kts)` 檔案中](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)。
    
    在[協程指南](coroutines-guide.md)中了解更多關於協程的資訊。

### 移除 kotlin.parallel.tasks.in.project 建置選項

在 Kotlin 1.5.20 中，我們宣布了[建置選項 `kotlin.parallel.tasks.in.project` 的棄用](whatsnew1520.md#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)。
此選項已在 Kotlin 1.6.20 中移除。

根據專案的不同，Kotlin 守護程式中的平行編譯可能需要更多記憶體。
要減少記憶體消耗，請[增加 Kotlin 守護程式的 JVM 堆大小](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)。

了解更多關於 Kotlin Gradle 外掛程式中[目前支援的編譯器選項](gradle-compiler-options.md)。