[//]: # (title: Kotlin 1.6.20 有什麼新功能)

_[發佈日期：2022 年 4 月 4 日](releases.md#release-details)_

Kotlin 1.6.20 揭示了未來語言功能的預覽，將階層式結構設定為多平台專案的預設值，並為其他元件帶來了演進式改進。

您也可以在這段影片中找到變更的簡要概述：

<video src="https://www.youtube.com/v/8F19ds109-o" title="What's new in Kotlin 1.6.20"/>

## 語言

在 Kotlin 1.6.20 中，您可以嘗試兩項新的語言功能：

*   [Kotlin/JVM 的情境接收器原型](#prototype-of-context-receivers-for-kotlin-jvm)
*   [明確非空值型別](#definitely-non-nullable-types)

### Kotlin/JVM 的情境接收器原型

> 此功能為原型，僅適用於 Kotlin/JVM。啟用 `-Xcontext-receivers` 後，
> 編譯器將產生無法用於正式環境程式碼的預發行二進位檔。
> 僅在您的練習專案中使用情境接收器。
> 我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供的意見回饋。
>
{style="warning"}

有了 Kotlin 1.6.20，您不再僅限於擁有一個接收器。如果您需要更多，可以透過在宣告中新增情境接收器，使函數、屬性和類別依情境而定（或_情境相關_）。情境宣告會執行以下操作：

*   它要求所有宣告的情境接收器都必須作為隱式接收器存在於呼叫者的作用域中。
*   它將宣告的情境接收器作為隱式接收器帶入其主體作用域。

```kotlin
interface LoggingContext {
    val log: Logger // 此情境提供對記錄器的參考 
}

context(LoggingContext)
fun startBusinessOperation() {
    // 您可以存取 log 屬性，因為 LoggingContext 是隱式接收器
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // 您需要將 LoggingContext 作為隱式接收器置於作用域中
        // 才能呼叫 startBusinessOperation()
        startBusinessOperation()
    }
}
```

若要在您的專案中啟用情境接收器，請使用 `-Xcontext-receivers` 編譯器選項。
您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md#detailed-design) 中找到此功能的詳細說明及其語法。

請注意，此實作是原型：

*   啟用 `-Xcontext-receivers` 後，編譯器將產生無法用於正式環境程式碼的預發行二進位檔
*   目前對情境接收器的 IDE 支援最少

請在您的練習專案中試用此功能，並在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-42435) 中與我們分享您的想法和經驗。
如果您遇到任何問題，請[提交新問題](https://kotl.in/issue)。

### 明確非空值型別

> 明確非空值型別處於 [Beta 測試版](components-stability.md)階段。它們幾乎穩定，
> 但未來可能需要遷移步驟。
> 我們將盡力減少您必須進行的任何變更。
>
{style="warning"}

為了在擴充泛型 Java 類別和介面時提供更好的互通性，Kotlin 1.6.20 允許您使用新語法 `T & Any` 在使用站點上將泛型型別參數標記為明確非空值。
此語法形式來自[交集型別](https://en.wikipedia.org/wiki/Intersection_type)的表示法，目前僅限於 `&` 左側帶有可空值上限且右側帶有非空值 `Any` 的型別參數：

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

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md) 中了解有關明確非空值型別的更多資訊。

## Kotlin/JVM

Kotlin 1.6.20 引入了：

*   JVM 介面中預設方法的相容性改進：[介面的新 `@JvmDefaultWithCompatibility` 註解](#new-jvmdefaultwithcompatibility-annotation-for-interfaces)和 [`-Xjvm-default` 模式中的相容性變更](#compatibility-changes-in-the-xjvm-default-modes)
*   [支援 JVM 後端中單一模組的平行編譯](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
*   [支援對函數介面建構子的可呼叫引用](#support-for-callable-references-to-functional-interface-constructors)

### 介面的新 @JvmDefaultWithCompatibility 註解

Kotlin 1.6.20 引入了新註解 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)：將其與 `-Xjvm-default=all` 編譯器選項一起使用，[為 JVM 介面中的任何 Kotlin 介面中的任何非抽象成員建立預設方法](java-to-kotlin-interop.md#default-methods-in-interfaces)。

如果有一些客戶端使用您的 Kotlin 介面，且這些介面是在沒有 `-Xjvm-default=all` 選項的情況下編譯的，那麼它們可能與使用此選項編譯的程式碼二進位不相容。
在 Kotlin 1.6.20 之前，為避免此相容性問題，[建議的方法](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility)是使用 `-Xjvm-default=all-compatibility` 模式，並為不需要此類相容性的介面使用 `@JvmDefaultWithoutCompatibility` 註解。

此方法有一些缺點：

*   新增新介面時，您可能會輕易忘記新增註解。
*   通常非公開部分比公共應用程式介面有更多介面，因此您最終會在程式碼中許多地方使用此註解。

現在，您可以使用 `-Xjvm-default=all` 模式並使用 `@JvmDefaultWithCompatibility` 註解標記介面。
這允許您一次將此註解新增到公共應用程式介面中的所有介面，並且您無需為新的非公開程式碼使用任何註解。

請在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48217) 中留下您對此新註解的意見回饋。

### -Xjvm-default 模式中的相容性變更

Kotlin 1.6.20 增加了將預設模式（`-Xjvm-default=disable` 編譯器選項）中的模組與使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式編譯的模組進行編譯的選項。
一如既往，如果所有模組都使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式，編譯也會成功。
您可以在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47000) 中留下您的意見回饋。

Kotlin 1.6.20 棄用了編譯器選項 `-Xjvm-default` 的 `compatibility` 和 `enable` 模式。
其他模式的描述中關於相容性的變更，但整體邏輯保持不變。
您可以查閱[更新的描述](java-to-kotlin-interop.md#compatibility-modes-for-default-methods)。

有關 Java 互通性中預設方法的更多資訊，請參閱[互通性文件](java-to-kotlin-interop.md#default-methods-in-interfaces)和
[此部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 支援 JVM 後端中單一模組的平行編譯

> 支援 JVM 後端中單一模組的平行編譯是 [實驗性](components-stability.md)的。
> 它可能隨時被移除或變更。需要選擇啟用（詳情見下），您應該僅將其用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-46085) 中提供意見回饋。
>
{style="warning"}

我們正在繼續努力[改進新的 JVM IR 後端編譯時間](https://youtrack.jetbrains.com/issue/KT-46768)。
在 Kotlin 1.6.20 中，我們新增了實驗性 JVM IR 後端模式，以平行編譯模組中的所有檔案。
平行編譯可以將總編譯時間縮短多達 15%。

使用[編譯器選項](compiler-reference.md#compiler-options) `-Xbackend-threads` 啟用實驗性平行後端模式。
此選項請使用以下引數：

*   `N` 是您要使用的執行緒數量。它不應大於您的 CPU 核心數量；否則，由於執行緒間的內容切換，平行化將停止有效
*   `0` 為每個 CPU 核心使用單獨的執行緒

[Gradle](gradle.md) 可以平行執行任務，但這種平行化在專案（或專案的主要部分）在 Gradle 看來只是一個大任務時，並沒有太大幫助。
如果您有一個非常大的單一巨型模組，請使用平行編譯以更快地編譯。
如果您的專案由許多小型模組組成，並且建置由 Gradle 平行化，那麼增加另一層平行化可能會由於內容切換而損害效能。

> 平行編譯有一些限制：
> *   它不適用於 [kapt](kapt.md)，因為 kapt 會停用 IR 後端
> *   根據設計，它需要更多的 JVM 堆積記憶體。堆積記憶體量與執行緒數量成正比
>
{style="note"}

### 支援對函數介面建構子的可呼叫引用

> 支援對函數介面建構子的可呼叫引用是 [實驗性](components-stability.md)的。
> 它可能隨時被移除或變更。需要選擇啟用（詳情見下），您應該僅將其用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47939) 中提供意見回饋。
>
{style="warning"}

支援對[可呼叫引用](reflection.md#callable-references)到函數介面建構子的功能，提供了一種原始碼相容的方式，可以從具有建構子函數的介面遷移到[函數介面](fun-interfaces.md)。

考慮以下程式碼：

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

啟用對函數介面建構子的可呼叫引用後，此程式碼可以替換為僅一個函數介面宣告：

```kotlin
fun interface Printer {
    fun print()
}
```

它的建構子將被隱式建立，任何使用 `::Printer` 函數引用的程式碼都將編譯。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```
{validate="false"}

透過使用 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 註解和 `DeprecationLevel.HIDDEN` 標記舊版函數 `Printer` 來保留二進位相容性：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```
{validate="false"}

使用編譯器選項 `-XXLanguage:+KotlinFunInterfaceConstructorReference` 啟用此功能。

## Kotlin/Native

Kotlin/Native 1.6.20 標誌著其新元件的持續發展。我們在與 Kotlin 在其他平台上的體驗一致性方面又邁出了一步：

*   [新記憶體管理器的更新](#an-update-on-the-new-memory-manager)
*   [新記憶體管理器中清理階段的併發實作](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
*   [註解類別的實例化](#instantiation-of-annotation-classes)
*   [與 Swift async/await 的互通性：返回 Swift 的 Void 而非 KotlinUnit](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
*   [透過 libbacktrace 改善堆疊追蹤](#better-stack-traces-with-libbacktrace)
*   [支援獨立 Android 可執行檔](#support-for-standalone-android-executables)
*   [效能改進](#performance-improvements)
*   [cinterop 模組匯入期間的錯誤處理改進](#improved-error-handling-during-cinterop-modules-import)
*   [支援 Xcode 13 函式庫](#support-for-xcode-13-libraries)

### 新記憶體管理器的更新

> 新的 Kotlin/Native 記憶體管理器處於 [Alpha 測試版](components-stability.md)階段。
> 它可能在未來不相容地變更並需要手動遷移。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中提供意見回饋。
>
{style="note"}

透過 Kotlin 1.6.20，您可以嘗試新 Kotlin/Native 記憶體管理器的 Alpha 版本。
它消除了 JVM 和 Native 平台之間的差異，以在多平台專案中提供一致的開發者體驗。
例如，您將更容易建立可在 Android 和 iOS 上運作的新跨平台行動應用程式。

新的 Kotlin/Native 記憶體管理器取消了執行緒間物件共享的限制。
它還提供了無記憶體洩漏的併發程式設計原語，這些原語安全且不需要任何特殊管理或註解。

新的記憶體管理器將在未來版本中成為預設值，因此我們鼓勵您現在就嘗試。
查閱我們的[部落格文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)以了解有關新記憶體管理器的更多資訊並探索示範專案，或直接跳至[遷移說明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)親自嘗試。

請嘗試在您的專案上使用新記憶體管理器，看看它是如何運作的，並在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享意見回饋。

### 新記憶體管理器中清理階段的併發實作

如果您已切換到我們在 [Kotlin 1.6 中宣布](whatsnew16.md#preview-of-the-new-memory-manager)的新記憶體管理器，您可能會注意到執行時間有了巨大的改進：我們的基準測試顯示平均提高了 35%。
從 1.6.20 開始，新記憶體管理器的清理階段也提供了併發實作。
這也應能改善效能並縮短垃圾收集器暫停的持續時間。

若要為新的 Kotlin/Native 記憶體管理器啟用此功能，請傳遞以下編譯器選項：

```bash
-Xgc=cms 
```

請隨時在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48526) 中分享您對新記憶體管理器效能的意見回饋。

### 註解類別的實例化

在 Kotlin 1.6.0 中，註解類別的實例化對於 Kotlin/JVM 和 Kotlin/JS 成為了[穩定](components-stability.md)功能。
1.6.20 版本提供了對 Kotlin/Native 的支援。

了解有關[註解類別實例化](annotations.md#instantiation)的更多資訊。

### 與 Swift async/await 的互通性：返回 Void 而非 KotlinUnit

> 與 Swift async/await 的併發互通性是 [實驗性](components-stability.md)的。它可能隨時被移除或變更。
> 您應該僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 中提供意見回饋。
>
{style="warning"}

我們持續致力於[與 Swift 的 async/await 的實驗性互通性](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await)（Swift 5.5 後可用）。
Kotlin 1.6.20 在處理 `Unit` 回傳型別的 `suspend` 函數方面與先前版本不同。

以前，此類函數在 Swift 中呈現為返回 `KotlinUnit` 的 `async` 函數。然而，它們的正確回傳型別應為 `Void`，類似於非暫停函數。

為了避免破壞現有程式碼，我們引入了一個 Gradle 屬性，該屬性使編譯器將返回 `Unit` 的 `suspend` 函數轉換為返回 `Void` 的 `async` Swift 函數：

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

我們計劃在未來的 Kotlin 版本中將此行為設為預設。

### 透過 libbacktrace 改善堆疊追蹤

> 使用 libbacktrace 解析原始碼位置是 [實驗性](components-stability.md)的。它可能隨時被移除或變更。
> 您應該僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424) 中提供意見回饋。
>
{style="warning"}

Kotlin/Native 現在能夠產生包含檔案位置和行號的詳細堆疊追蹤，
以便更好地除錯 `linux*`（`linuxMips32` 和 `linuxMipsel32` 除外）和 `androidNative*` 目標。

此功能在底層使用了 [`libbacktrace`](https://github.com/ianlancetaylor/libbacktrace) 函式庫。
請看以下程式碼，了解差異範例：

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

在 Apple 目標上，這些目標已經在堆疊追蹤中包含檔案位置和行號，libbacktrace 為內聯函數呼叫提供了更多詳細資訊：

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

若要透過 libbacktrace 產生更好的堆疊追蹤，請將以下行新增到 `gradle.properties`：

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

請在[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48424)中告訴我們您使用 libbacktrace 除錯 Kotlin/Native 的體驗。

### 支援獨立 Android 可執行檔

以前，Kotlin/Native 中的 Android 原生可執行檔實際上不是可執行檔，而是您可以作為 NativeActivity 使用的共享函式庫。現在有一個選項可以為 Android 原生目標生成標準可執行檔。

為此，在您的專案的 `build.gradle(.kts)` 部分中，配置您的 `androidNative` 目標的可執行檔區塊。
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

請注意，此功能將在 Kotlin 1.7.0 中成為預設值。
如果您想保留目前的行為，請使用以下設定：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

感謝 Mattia Iavarone 的[實作](https://github.com/jetbrains/kotlin/pull/4624)！

### 效能改進

我們正在努力改進 Kotlin/Native，以[加速編譯過程](https://youtrack.jetbrains.com/issue/KT-42294)並提升您的開發體驗。

Kotlin 1.6.20 帶來了一些效能更新和錯誤修正，這些變更影響了 Kotlin 生成的 LLVM IR。
根據我們內部專案的基準測試，我們平均達到了以下效能提升：

*   執行時間減少 15%
*   發佈和除錯二進位檔的程式碼大小減少 20%
*   發佈二進位檔的編譯時間減少 26%

這些變更還使大型內部專案的除錯二進位檔編譯時間減少了 10%。

為此，我們為一些編譯器生成的合成物件實作了靜態初始化，改進了為每個函數建立 LLVM IR 結構的方式，並優化了編譯器快取。

### cinterop 模組匯入期間的錯誤處理改進

此版本改進了在您使用 `cinterop` 工具匯入 Objective-C 模組（例如 CocoaPods pods 通常這樣做）時的錯誤處理。
以前，如果您在嘗試使用 Objective-C 模組時遇到錯誤（例如，處理標頭中的編譯錯誤時），您會收到一條資訊不足的錯誤訊息，例如 `fatal error: could not build module $name`。
我們擴展了 `cinterop` 工具的這部分，因此您將收到包含擴展說明的錯誤訊息。

### 支援 Xcode 13 函式庫

此版本中完全支援 Xcode 13 隨附的函式庫。
請隨時從您的 Kotlin 程式碼中的任何位置存取它們。

## Kotlin Multiplatform

1.6.20 為 Kotlin Multiplatform 帶來了以下值得注意的更新：

*   [多平台專案的階層式結構支援現在是預設選項](#hierarchical-structure-support-for-multiplatform-projects)
*   [Kotlin CocoaPods Gradle 外掛程式收到了幾個有用的 CocoaPods 整合功能](#kotlin-cocoapods-gradle-plugin)

### 多平台專案的階層式結構支援

Kotlin 1.6.20 預設啟用階層式結構支援。
自從在 [Kotlin 1.4.0 中引入](whatsnew14.md#sharing-code-in-several-targets-with-the-hierarchical-project-structure)以來，我們大幅改進了前端並使 IDE 匯入穩定。

以前，在多平台專案中新增程式碼有兩種方式。第一種是將其插入平台特定原始碼集，該原始碼集僅限於一個目標，無法被其他平台重複使用。
第二種是使用跨所有 Kotlin 目前支援的平台共享的通用原始碼集。

現在您可以在[專案中更好地共享程式碼](#better-code-sharing-in-your-project)，在幾個類似的原生目標之間共享原始碼，這些目標重複使用大量通用邏輯和第三方應用程式介面。
此技術將提供正確的預設依賴項，並找到共享程式碼中可用的精確應用程式介面。
這消除了複雜的建置設定和必須使用變通方法才能獲得對原生目標之間共享原始碼集的 IDE 支援。
它還有助於防止針對不同目標的不安全應用程式介面使用。

此技術對於[函式庫作者](#more-opportunities-for-library-authors)也將很有用，因為階層式專案結構允許他們發佈和使用針對目標子集的通用應用程式介面函式庫。

預設情況下，使用階層式專案結構發佈的函式庫僅與階層式結構專案相容。

#### 專案中更好的程式碼共享

在沒有階層式結構支援的情況下，無法直接地在**某些**而非**所有** [Kotlin 目標](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)之間共享程式碼。
一個常見的例子是在所有 iOS 目標之間共享程式碼，並存取 iOS 特定的[依賴項](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)，例如 Foundation。

多虧了階層式專案結構支援，您現在可以開箱即用地實現這一點。
在新結構中，原始碼集形成階層。
您可以針對給定原始碼集編譯到的每個目標，使用平台特定的語言功能和可用的依賴項。

例如，考慮一個典型的多平台專案，它有兩個目標 — `iosArm64` 和 `iosX64` 分別用於 iOS 裝置和模擬器。
Kotlin 工具鏈理解這兩個目標具有相同的功能，並允許您從中間原始碼集 `iosMain` 存取該功能。

![iOS hierarchy example](ios-hierarchy-example.jpg){width=700}

Kotlin 工具鏈提供正確的預設依賴項，例如 Kotlin/Native 標準函式庫或原生函式庫。
此外，Kotlin 工具鏈將盡力找出共享程式碼中可用的精確應用程式介面範圍。
這可以防止例如在為 Windows 共享的程式碼中使用 macOS 特定函數等情況。

#### 為函式庫作者帶來更多機會

當多平台函式庫發佈時，其中間原始碼集的應用程式介面現在已正確地與其一同發佈，供消費者使用。
同樣，Kotlin 工具鏈將自動找出消費者原始碼集中可用的應用程式介面，同時仔細防範不安全的使用方式，例如在 JS 程式碼中使用適用於 JVM 的應用程式介面。
了解有關[在函式庫中共享程式碼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)的更多資訊。

#### 配置和設定

從 Kotlin 1.6.20 開始，所有新建立的多平台專案都將採用階層式專案結構。無需額外設定。

*   如果您已[手動開啟](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)它，您可以從 `gradle.properties` 中移除已棄用的選項：

    ```none
    # gradle.properties
    kotlin.mpp.enableGranularSourceSetsMetadata=true
    kotlin.native.enableDependencyPropagation=false // 或 'true'，取決於您之前的設定
    ```

*   對於 Kotlin 1.6.20，我們建議使用 [Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 或更高版本以獲得最佳體驗。

*   您也可以選擇退出。若要停用階層式結構支援，請在 `gradle.properties` 中設定以下選項：

    ```none
    # gradle.properties
    kotlin.mpp.hierarchicalStructureSupport=false
    ```

#### 留下您的意見回饋

這是對整個生態系統的重大變革。我們非常感謝您的意見回饋，以幫助使其更臻完善。

現在就試試看，並向我們的[問題追蹤器](https://kotl.in/issue)報告您遇到的任何困難。

### Kotlin CocoaPods Gradle 外掛程式

為簡化 CocoaPods 整合，Kotlin 1.6.20 提供了以下功能：

*   CocoaPods 外掛程式現在具有建置 XCFrameworks 並包含所有註冊目標以及生成 Podspec 檔案的任務。當您不想直接與 Xcode 整合，但想要建置產物並將其部署到本地 CocoaPods 儲存庫時，這會很有用。
    
    了解更多關於[建置 XCFrameworks](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#build-xcframeworks) 的資訊。

*   如果您在專案中使用 [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)，您習慣於為整個 Gradle 專案指定所需的 Pod 版本。現在您有更多選項：
    *   直接在 `cocoapods` 區塊中指定 Pod 版本
    *   繼續使用 Gradle 專案版本
    
    如果這些屬性都沒有配置，您將會收到錯誤。

*   您現在可以在 `cocoapods` 區塊中配置 CocoaPod 名稱，而無需更改整個 Gradle 專案的名稱。

*   CocoaPods 外掛程式引入了一個新的 `extraSpecAttributes` 屬性，您可以使用它來配置 Podspec 檔案中以前硬編碼的屬性，例如 `libraries` 或 `vendored_frameworks`。

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

Kotlin/JS 1.6.20 中的改進主要影響 IR 編譯器：

*   [開發二進位檔的增量編譯 (IR)](#incremental-compilation-for-development-binaries-with-ir-compiler)
*   [預設情況下頂層屬性的惰性初始化 (IR)](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)
*   [預設情況下為專案模組單獨生成 JS 檔案 (IR)](#separate-js-files-for-project-modules-by-default-with-ir-compiler)
*   [Char 類別優化 (IR)](#char-class-optimization)
*   [匯出改進（IR 和舊版後端皆有）](#improvements-to-export-and-typescript-declaration-generation)
*   [異步測試的 `@AfterTest` 保證](#aftertest-guarantees-for-asynchronous-tests)

### 開發二進位檔的增量編譯 (IR 編譯器)

為使使用 IR 編譯器的 Kotlin/JS 開發更有效率，我們引入了一種新的_增量編譯_模式。

在此模式下，當使用 `compileDevelopmentExecutableKotlinJs` Gradle 任務建置**開發二進位檔**時，編譯器會在模組層級快取先前編譯的結果。
它在後續編譯期間會使用未更改原始檔的快取編譯結果，從而使編譯更快完成，尤其是在進行小改動時。
請注意，此改進專門針對開發過程（縮短編輯-建置-除錯循環），不影響正式環境產物的建置。

若要啟用開發二進位檔的增量編譯，請將以下行新增到專案的 `gradle.properties`：

```none
# gradle.properties
kotlin.incremental.js.ir=true // 預設為 false
```

在我們的測試專案中，新模式使增量編譯速度提高了 30%。然而，在此模式下進行清理建置會變慢，因為需要建立和填充快取。

請在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-50203) 中告訴我們您使用增量編譯與您的 Kotlin/JS 專案的體驗。

### 預設情況下頂層屬性的惰性初始化 (IR 編譯器)

在 Kotlin 1.4.30 中，我們展示了 JS IR 編譯器中[頂層屬性惰性初始化](whatsnew1430.md#lazy-initialization-of-top-level-properties)的原型。
透過消除在應用程式啟動時初始化所有屬性的需要，惰性初始化減少了啟動時間。
我們的測量顯示，在實際的 Kotlin/JS 應用程式上，速度約提高了 10%。

現在，經過完善和適當測試此機制，我們將惰性初始化設為 IR 編譯器中頂層屬性的預設值。

```kotlin
// 惰性初始化
val a = run {
    val result = // 密集的計算
        println(result)
    result
} // run 在變數首次使用時執行
```

如果由於某種原因您需要急切地初始化屬性（在應用程式啟動時），請使用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/) 註解標記它。

### 預設情況下為專案模組單獨生成 JS 檔案 (IR 編譯器)

以前，JS IR 編譯器提供了[為專案模組生成單獨的 `.js` 檔案](https://youtrack.jetbrains.com/issue/KT-44319)的能力。
這是預設選項的替代方案——為整個專案生成一個單一的 `.js` 檔案。
該檔案可能過大且不方便使用，因為每當您想從專案中使用一個函數時，都必須將整個 JS 檔案作為依賴項包含進來。
擁有多個檔案增加了靈活性並減少了此類依賴項的大小。此功能可透過 `-Xir-per-module` 編譯器選項使用。

從 1.6.20 開始，JS IR 編譯器預設為專案模組生成單獨的 `.js` 檔案。

現在可以透過以下 Gradle 屬性將專案編譯為單一 `.js` 檔案：

```none
# gradle.properties
kotlin.js.ir.output.granularity=whole-program // `per-module` 是預設值
```

在以前的版本中，實驗性的每模組模式（透過 `-Xir-per-module=true` 旗標可用）會呼叫每個模組中的 `main()` 函數。這與常規的單一 `.js` 模式不一致。從 1.6.20 開始，`main()` 函數將僅在主模組中呼叫，無論是哪種情況。如果您確實需要在載入模組時執行某些程式碼，您可以使用帶有 `@EagerInitialization` 註解的頂層屬性。請參閱[預設情況下頂層屬性的惰性初始化 (IR)](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)。

### Char 類別優化

`Char` 類別現在由 Kotlin/JS 編譯器處理，而無需引入裝箱（類似於[內聯類別](inline-classes.md)）。
這加速了 Kotlin/JS 程式碼中對字元的運算。

除了效能改進之外，這還改變了 `Char` 匯出到 JavaScript 的方式：它現在被轉換為 `Number`。

### 匯出和 TypeScript 宣告產生改進

Kotlin 1.6.20 為匯出機制（[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 註解）帶來了多個修正和改進，包括 [TypeScript 宣告檔（`.d.ts`）的產生](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)。
我們新增了匯出介面和列舉的能力，並修正了先前向我們報告的一些邊緣情況下的匯出行為。
有關更多詳細資訊，請參閱 [YouTrack 中匯出改進的清單](https://youtrack.jetbrains.com/issues?q=Project:%20Kotlin%20issue%20id:%20KT-45434,%20KT-44494,%20KT-37916,%20KT-43191,%20KT-46961,%20KT-40236)。

了解有關[從 JavaScript 使用 Kotlin 程式碼](js-to-kotlin-interop.md)的更多資訊。

### 異步測試的 @AfterTest 保證

Kotlin 1.6.20 使 [`@AfterTest`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-after-test/) 函數在 Kotlin/JS 上的異步測試中正常工作。
如果測試函數的回傳型別靜態解析為 [`Promise`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/)，編譯器現在會將 `@AfterTest` 函數的執行排程到相應的 [`then()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/then.html) 回呼函數。

## 安全性

Kotlin 1.6.20 引入了幾項功能來改善您程式碼的安全性：

*   [在 klibs 中使用相對路徑](#using-relative-paths-in-klibs)
*   [為 Kotlin/JS Gradle 專案持久化 `yarn.lock` 檔案](#persisting-yarn-lock-for-kotlin-js-gradle-projects)
*   [預設情況下使用 `--ignore-scripts` 安裝 npm 依賴項](#installation-of-npm-dependencies-with-ignore-scripts-by-default)

### 在 klibs 中使用相對路徑

`klib` 格式的函式庫[包含](native-libraries.md#library-format)原始檔的序列化 IR 表示，其中也包含它們的路徑，用於生成正確的除錯資訊。
在 Kotlin 1.6.20 之前，儲存的檔案路徑是絕對的。由於函式庫作者可能不想共享絕對路徑，因此 1.6.20 版本提供了一個替代選項。

如果您正在發佈 `klib` 並希望在產物中僅使用原始檔的相對路徑，您現在可以傳遞 `-Xklib-relative-path-base` 編譯器選項，並帶有一個或多個原始檔的基本路徑：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile::class).configureEach {
    // $base 是原始檔的基本路徑
    kotlinOptions.freeCompilerArgs += "-Xklib-relative-path-base=$base"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile).configureEach {
    kotlinOptions {
        // $base 是原始檔的基本路徑
        freeCompilerArgs += "-Xklib-relative-path-base=$base"
    }
}
```

</tab>
</tabs>

### 為 Kotlin/JS Gradle 專案持久化 `yarn.lock` 檔案

> 此功能已回溯移植到 Kotlin 1.6.10。
>
{style="note"}

Kotlin/JS Gradle 外掛程式現在提供了持久化 `yarn.lock` 檔案的功能，使得鎖定專案的 npm 依賴項版本成為可能，無需額外的 Gradle 配置。
此功能透過在專案根目錄中新增自動生成的 `kotlin-js-store` 目錄，改變了預設專案結構。
該目錄內部包含 `yarn.lock` 檔案。

我們強烈建議將 `kotlin-js-store` 目錄及其內容提交到您的版本控制系統。
將鎖定檔案提交到您的版本控制系統是一種[推薦的做法](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)，因為它確保您的應用程式在所有機器上都使用完全相同的依賴樹進行建置，無論這些機器是其他機器上的開發環境還是 CI/CD 服務。
鎖定檔案還可以防止您的 npm 依賴項在專案在新機器上被檢出時自動更新，這是一個安全疑慮。

[Dependabot](https://github.com/dependabot) 等工具也可以解析您的 Kotlin/JS 專案的 `yarn.lock` 檔案，並在您依賴的任何 npm 套件受到危害時向您提供警告。

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

> 更改鎖定檔案的名稱可能會導致依賴項檢查工具無法再識別該檔案。
> 
{style="warning"}

### 預設情況下使用 `--ignore-scripts` 安裝 npm 依賴項

> 此功能已回溯移植到 Kotlin 1.6.10。
>
{style="note"}

Kotlin/JS Gradle 外掛程式現在預設阻止在安裝 npm 依賴項期間執行[生命週期腳本](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)。
此變更旨在降低執行來自受損 npm 套件的惡意程式碼的可能性。

若要回滾到舊配置，您可以透過在 `build.gradle(.kts)` 中新增以下行來明確啟用生命週期腳本執行：

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

了解有關 [Kotlin/JS Gradle 專案的 npm 依賴項](js-project-setup.md#npm-dependencies)的更多資訊。

## Gradle

Kotlin 1.6.20 為 Kotlin Gradle 外掛程式帶來了以下變更：

*   用於定義 Kotlin 編譯器執行策略的新[屬性 `kotlin.compiler.execution.strategy` 和 `compilerExecutionStrategy`](#properties-for-defining-kotlin-compiler-execution-strategy)
*   [棄用選項 `kapt.use.worker.api`、`kotlin.experimental.coroutines` 和 `kotlin.coroutines`](#deprecation-of-build-options-for-kapt-and-coroutines)
*   [移除 `kotlin.parallel.tasks.in.project` 建置選項](#removal-of-the-kotlin-parallel-tasks-in-project-build-option)

### 用於定義 Kotlin 編譯器執行策略的屬性

在 Kotlin 1.6.20 之前，您使用系統屬性 `-Dkotlin.compiler.execution.strategy` 來定義 Kotlin 編譯器執行策略。
此屬性在某些情況下可能不方便。
Kotlin 1.6.20 引入了一個同名的 Gradle 屬性 `kotlin.compiler.execution.strategy` 和編譯任務屬性 `compilerExecutionStrategy`。

系統屬性仍然有效，但將在未來版本中移除。

目前屬性的優先順序如下：

*   任務屬性 `compilerExecutionStrategy` 優先於系統屬性和 Gradle 屬性 `kotlin.compiler.execution.strategy`。
*   Gradle 屬性優先於系統屬性。

有三種編譯器執行策略可以分配給這些屬性：

| 策略       | Kotlin 編譯器執行位置     | 增量編譯 | 其他特性                                                 |
|------------|-------------------------|----------|----------------------------------------------------------|
| 守護行程 (Daemon) | 在其自身的守護行程程序內部      | 是        | *預設策略*。可在不同的 Gradle 守護行程之間共享              |
| 進程內 (In process) | 在 Gradle 守護行程程序內部  | 否        | 可能與 Gradle 守護行程共享堆積記憶體                       |
| 進程外 (Out of process) | 每次呼叫都在單獨的程序中 | 否        | —                                                        |

因此，`kotlin.compiler.execution.strategy` 屬性（包括系統屬性和 Gradle 屬性）的可用值為：
1. `daemon` (預設)
2. `in-process`
3. `out-of-process`

在 `gradle.properties` 中使用 Gradle 屬性 `kotlin.compiler.execution.strategy`：

```none
# gradle.properties
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 任務屬性的可用值為：

1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (預設)
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

在 `build.gradle.kts` 建置腳本中使用 `compilerExecutionStrategy` 任務屬性：

```kotlin
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<KotlinCompile>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

請在此 [YouTrack 任務](https://youtrack.jetbrains.com/issue/KT-49299) 中留下您的意見回饋。

### 棄用 kapt 和協程的建置選項

在 Kotlin 1.6.20 中，我們更改了屬性的棄用級別：

*   我們棄用了透過 Kotlin 守護行程執行 [kapt](kapt.md) 的能力，使用 `kapt.use.worker.api` – 現在它會在 Gradle 的輸出中產生警告。
    預設情況下，自 1.3.70 版本發佈以來，[kapt 已使用 Gradle 工作程序](kapt.md#run-kapt-tasks-in-parallel)，我們建議堅持此方法。

    我們將在未來版本中移除選項 `kapt.use.worker.api`。

*   我們棄用了 `kotlin.experimental.coroutines` Gradle DSL 選項以及在 `gradle.properties` 中使用的 `kotlin.coroutines` 屬性。
    只需使用_暫停函數_或[將 `kotlinx.coroutines` 依賴項新增到您的 `build.gradle(.kts)` 檔案中](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)。
    
    在[協程指南](coroutines-guide.md)中了解有關協程的更多資訊。

### 移除 `kotlin.parallel.tasks.in.project` 建置選項

在 Kotlin 1.5.20 中，我們[宣布棄用建置選項 `kotlin.parallel.tasks.in.project`](whatsnew1520.md#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)。
此選項已在 Kotlin 1.6.20 中移除。

根據專案的不同，Kotlin 守護行程中的平行編譯可能需要更多記憶體。
為減少記憶體消耗，請[增加 Kotlin 守護行程的 JVM 堆積大小](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)。

了解有關 Kotlin Gradle 外掛程式中[目前支援的編譯器選項](gradle-compiler-options.md)的更多資訊。