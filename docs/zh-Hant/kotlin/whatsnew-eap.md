[//]: # (title: Kotlin %kotlinEapVersion% 的新功能)

<primary-label ref="eap"/>

<show-structure depth="1"/>

<web-summary>閱讀 Kotlin 早期體驗預覽 (EAP) 版本說明，並在正式發佈前試用最新的實驗性 Kotlin 功能。</web-summary>

_[發佈日期：%kotlinEapReleaseDate%](eap.md#build-details)_

> 本文件並未涵蓋早期體驗預覽 (EAP) 發佈版的所有功能，但重點介紹了一些重大改進。
>
> 請參閱 [GitHub 變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%) 中的完整變更列表。
>
{style="note"}

Kotlin %kotlinEapVersion% 版本已發佈！以下是此 EAP 版本的一些詳細資訊：

* **語言**：[穩定版的上下文參數以及註解使用處目標的多項功能](#stable-features-context-parameters-and-features-for-annotation-use-site-targets)
* **標準函式庫**：[用於將無符號整數轉換為 `BigInteger` 的新 API](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm) 以及 [支援檢查排序順序](#support-for-checking-sorted-order)
* **Kotlin/JVM**：[支援 Java 26](#support-for-java-26) 以及 [預設啟用元資料中的註解](#annotations-in-metadata-enabled-by-default)
* **Kotlin/Native**：[支援將 Swift 套件作為相依性](#swift-package-import)
* **Kotlin 編譯器**：[在 `.klib` 編譯期間更一致的內嵌函式行為](#consistent-intra-module-function-inlining-during-klib-compilation)

> 有關 Kotlin 發佈週期的資訊，請參閱 [Kotlin 發佈程序](releases.md)。
>
{style="tip"}

## 更新到 Kotlin %kotlinEapVersion%

最新版本的 Kotlin 已包含在最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 中。

若要更新到新的 Kotlin 版本，請確保您的 IDE 已更新至最新版本，並在建置指令碼中[將 Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version)為 %kotlinEapVersion%。

## 新功能 {id=new-stable-features}
<primary-label ref="stable"/>

在先前的 Kotlin 版本中，有幾項新功能是以實驗性身份引入的。以下功能現已在 Kotlin %kotlinEapVersion% 中晉升為[穩定](components-stability.md#stability-levels-explained)階段，因此您不再需要選擇加入即可使用它們：

* [上下文參數](whatsnew22.md#preview-of-context-parameters)，除了[顯式上下文引數](#explicit-context-arguments-for-context-parameters)和[可呼叫參照](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references)之外
* [註解使用處目標的功能](whatsnew22.md#preview-of-features-for-annotation-use-site-targets)
* [在 JVM 上將無符號整數轉換為 `BigInteger` 的新 API](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm)
* [支援檢查排序順序](#support-for-checking-sorted-order)

## 新功能 {id=new-experimental-features}
<primary-label ref="experimental-exp"/>

* [內容參數的顯式上下文引數](#explicit-context-arguments-for-context-parameters)
* [Swift 套件匯入](#swift-package-import)

## 語言

Kotlin %kotlinEapVersion% 將上下文參數和註解使用處目標功能晉升為[穩定](components-stability.md#stability-levels-explained)階段。此版本還引入了[內容參數的顯式上下文引數](#explicit-context-arguments-for-context-parameters)。

### 穩定功能：上下文參數與註解使用處目標的功能
<secondary-label ref="language"/>

Kotlin 2.2.0 以[實驗性](components-stability.md#stability-levels-explained)身份引入了一些語言特性。我們很高興地宣佈，以下語言特性在此版本中已達到[穩定](components-stability.md#stability-levels-explained)階段：

* [上下文參數](whatsnew22.md#preview-of-context-parameters)，除了[顯式上下文引數](#explicit-context-arguments-for-context-parameters)和[可呼叫參照](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references)之外
* [註解使用處目標的功能](whatsnew22.md#preview-of-features-for-annotation-use-site-targets)

[參見 Kotlin 語言設計功能與提案的完整列表](kotlin-language-features-and-proposals.md)。

### 內容參數的顯式上下文引數
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% 為[上下文參數](context-parameters.md)引入了顯式上下文引數。

Kotlin 2.3.20 [更改了內容參數的多載解析](whatsnew2320.md#changes-to-overload-resolution-for-context-parameters)。因此，僅在內容參數上有所不同的多載呼叫可能會變得具有歧義。

現在，您可以透過在呼叫點傳遞顯式上下文引數來解決此歧義。

範例如下：

```kotlin
class EmailSender
class SmsSender

context(emailSender: EmailSender)
fun sendNotification() {
    println("Sent email notification")
}

context(smsSender: SmsSender)
fun sendNotification() {
    println("Sent SMS notification")
}

context(defaultEmailSender: EmailSender, defaultSmsSender: SmsSender)
fun notifyUser() {
    
    // 選擇具有 EmailSender 內容參數的多載
    sendNotification(emailSender = defaultEmailSender)

    // 選擇具有 SmsSender 內容參數的多載
    sendNotification(smsSender = defaultSmsSender)
}
```

您還可以使用顯式上下文引數來代替 `context()` 函式，以減少嵌套並使某些呼叫更易於閱讀。如果您需要在多個呼叫中使用相同的上下文引數，請改用 `context()` 函式。

此功能目前處於[實驗性](components-stability.md#stability-levels-explained)階段。若要選擇啟用，請在您的建置檔案中新增以下編譯器選項：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-context-arguments")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xexplicit-context-arguments</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

如需更多資訊，請參閱該功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0448-explicit-context-arguments.md)。

## 標準函式庫

Kotlin %kotlinEapVersion% 新增了用於在 JVM 上將無符號整數轉換為 `BigInteger` 的新擴充函式。它還新增了對可迭代對象、陣列和序列檢查排序順序的支援。

### 在 JVM 上將無符號整數轉換為 `BigInteger` 的新 API
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% 在 JVM 上引入了 `UInt.toBigInteger()` 和 `ULong.toBigInteger()` 擴充函式。

在此之前，將 `UInt` 和 `ULong` 值轉換為 `BigInteger` 需要基於字串的權宜之計或自訂轉換邏輯。從 Kotlin %kotlinEapVersion% 開始，您現在可以使用 `.toBigInteger()` 直接將無符號整數值轉換為 `BigInteger`。

範例如下：

```kotlin
fun main() {
    val unsignedLong = Long.MAX_VALUE.toULong() + 1uL
    val unsignedInt = UInt.MAX_VALUE

    println(unsignedLong.toBigInteger())
    // 9223372036854775808

    println(unsignedInt.toBigInteger())
    // 4294967295
}
```

歡迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-73111) 中向我們提供您的回饋。

### 支援檢查排序順序
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% 新增了新的擴充函式，用於檢查可迭代對象、陣列和序列中的排序順序。

這包括以下擴充函式：

* `.isSorted()`
* `.isSortedDescending()`
* `.isSortedWith(comparator)`
* `.isSortedBy(selector)`
* `.isSortedByDescending(selector)`

您可以使用這些擴充函式來檢查元素是否已經排序，而無需再次進行排序或建立自己的輔助函式。如果元素按指定順序排列，或者元素少於兩個，則它們會回傳 `true`，否則回傳 `false`。這些函式在遇到無序配對時會立即停止，這使得它們處理大型輸入時非常高效。

以下是使用 `.isSorted()` 和 `.isSortedBy()` 函式檢查排序順序的範例：

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.isSorted())
    // true

    val users = listOf(
        User("Alice", 24),
        User("Bob", 31),
        User("Charlie", 29),
    )
    println(users.isSortedBy(User::age))
    // false
}
```

歡迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-78499) 中向我們提供您的回饋。

## Kotlin/JVM

Kotlin %kotlinEapVersion% 支援新的 Java 版本，並預設啟用元資料中的註解。

### 支援 Java 26
<secondary-label ref="jvm"/>

從 Kotlin %kotlinEapVersion% 開始，編譯器可以產生包含 Java 26 位元組碼的類別。

### 預設啟用元資料中的註解
<secondary-label ref="jvm"/>

Kotlin 2.2.0 中的 Kotlin Metadata JVM 程式庫[引入了對讀取存儲在 Kotlin 元資料中註解的支援](whatsnew22.md#support-for-reading-and-writing-annotations-in-kotlin-metadata)。有了這項支援，Kotlin 編譯器會將註解與 JVM 位元組碼一起寫入元資料中，使 Kotlin Metadata JVM 程式庫可以存取它們。因此，註解處理器和其他工具可以在元資料層級理解和操作這些註解，而無需使用反射或修改原始碼。

在 Kotlin %kotlinEapVersion% 中，此支援已預設啟用。

## Kotlin/Native

Kotlin %kotlinEapVersion% 帶來了對 Swift 套件匯入的支援。

### Swift 套件匯入
<secondary-label ref="native"/>

<primary-label ref="experimental-general"/>

Kotlin Multiplatform 專案現在可以在其 Gradle 配置中，將 [Swift 套件](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/) 宣告為 iOS 應用程式的相依性：

```kotlin
// build.gradle.kts
kotlin {

    swiftPMDependencies {
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.11.0"),
            products = listOf(
                product("FirebaseAI"),
                product("FirebaseAnalytics"),
                ...
}
```
{validate="false"}

有關操作範例和更詳細的資訊，請參閱 [SwiftPM 匯入](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-import.html)。

如果您的專案依賴 CocoaPods 相依性，您可以將目前的設定遷移為使用 Swift 套件。KMP 工具考慮到了這種使用案例，並能協助您自動重新設定專案。詳情請參閱我們的 [CocoaPods 遷移指南](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration.html)。

## Kotlin 編譯器

Kotlin %kotlinEapVersion% 在 `.klib` 編譯期間，對宣告在同一模組中的內嵌函式提供了更一致的行為。

### 在 klib 編譯期間一致的模組內函式內嵌
<secondary-label ref="compiler"/>

先前，[函式內嵌](inline-functions.md)在不同的 Kotlin 平台上的行為並不一致。JetBrains 小組正致力於在所有支援的平台上統一此行為，以確保相同的相容性保證。

在 Kotlin/JVM 上，函式內嵌發生在編譯時期。因此，當使用 Kotlin/JVM 編譯器編譯 Kotlin 原始碼時，產生的類別檔案在位元組碼中沒有內嵌函式呼叫，因為內嵌函式的內容已內嵌到其呼叫點中，所以它們的行為在編譯期間就已固定。

相反地，在 Kotlin/Native、Kotlin/JS 和 Kotlin/Wasm 上，函式內嵌並未發生在從原始碼到 klib 的編譯期間，而僅發生在二進制檔案產生期間。因此，內嵌函式的行為在 `.klib` 編譯期間並未固定，且 `.klib` 程式庫無法像 Kotlin/JVM 那樣為內嵌函式提供相同的相容性保證。

Kotlin %kotlinEapVersion% 在產生 `.klib` 建置產物時啟用了模組內內嵌，邁出了統一內嵌函式行為的第一步：

```kotlin
// 現有的 logging.klib 程式庫
inline fun logDebug(message: String) {
    println("[DEBUG] $message")
}
```

```kotlin
// 目前編譯的 App 模組
inline fun greetUser(name: String) {
    println("Hello, $name!")
}

fun main() {
    logDebug("App started") // 未內嵌：宣告在另一個模組中
    greetUser("Alice")      // 已內嵌：宣告在同一個模組中
}
```

編譯為 `.klib` 時，程式碼看起來如下所示：

```kotlin
// 虛擬程式碼
fun main() {
    logDebug("App started")  // 未內嵌，宣告在另一個模組中
    val tmp0 = "Alice"
    println("Hello, $tmp0!") // 從 greetUser() 內嵌
}
```

這意味著只有在同一模組中宣告的內嵌函式會在 `.klib` 編譯期間被內嵌。在此情況下，其他函式則會在產生平台特定二進制檔案的過程中被內嵌。

#### 如何啟用

從 %kotlinEapVersion% 開始，Kotlin/Native、Kotlin/JS 和 Kotlin/Wasm 預設啟用模組內內嵌。

如果您遇到此功能的意外問題，可以使用命令列中的以下編譯器選項將其停用：

```bash
-Xklib-ir-inliner=disabled
```

下一步是啟用跨模組內嵌，以確保專案中的所有內嵌函式都能一致地被內嵌。這項變更計劃在未來的 Kotlin 版本中推出，但您現在已經可以透過在命令列中使用以下編譯器選項來嘗試：

```bash
-Xklib-ir-inliner=full
```

請在 [YouTrack](https://kotl.in/issue) 中分享您的回饋並回報任何問題。