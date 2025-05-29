[//]: # (title: Kotlin 1.6.0 新功能)

[發佈時間：2021 年 11 月 16 日](releases.md#release-details)

Kotlin 1.6.0 引入了新的語言功能、對現有功能的最佳化和改進，以及對 Kotlin 標準函式庫的大量改進。

您也可以在[發佈部落格文章](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)中找到這些變更的總覽。

## 語言

Kotlin 1.6.0 穩定化了先前 1.5.30 版本中引入供預覽的數個語言功能：
* [針對列舉、密封和布林主題的穩定窮盡式 `when` 陳述式](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [作為父型別的穩定懸掛函數](#stable-suspending-functions-as-supertypes)
* [穩定懸掛轉換](#stable-suspend-conversions)
* [穩定註解類別實例化](#stable-instantiation-of-annotation-classes)

它還包括各種型別推斷改進和對類別型別參數上的註解支援：
* [改進遞迴泛型型別的型別推斷](#improved-type-inference-for-recursive-generic-types)
* [建構器推斷的變更](#changes-to-builder-inference)
* [支援類別型別參數上的註解](#support-for-annotations-on-class-type-parameters)

### 針對列舉、密封、和布林主題的穩定窮盡式 `when` 陳述式

一個 _窮盡式_ (exhaustive) 的 [`when`](control-flow.md#when-expressions-and-statements) 陳述式包含其主題所有可能型別或值的分支，或者包含某些型別加上一個 `else` 分支。它涵蓋了所有可能的情況，使您的程式碼更安全。

我們很快將禁止非窮盡式 `when` 陳述式，以使行為與 `when` 運算式保持一致。為了確保順利遷移，Kotlin 1.6.0 會針對以列舉、密封類別/介面或布林值作為主題的非窮盡式 `when` 陳述式報告警告。這些警告將在未來的版本中變成錯誤。

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // Error: 'when' expression must be exhaustive
        is Contact.PhoneCall -> 42
    }

fun sendMessage(contact: Contact, message: String) {
    // Starting with 1.6.0

    // Warning: Non exhaustive 'when' statements on Boolean will be
    // prohibited in 1.7, add 'false' branch or 'else' branch instead
    when(message.isEmpty()) {
        true -> return
    }
    // Warning: Non exhaustive 'when' statements on sealed class/interface will be
    // prohibited in 1.7, add 'is TextMessage' branch or 'else' branch instead
    when(contact) {
        is Contact.PhoneCall -> TODO()
    }
}
```

請參閱[此 YouTrack 問題單](https://youtrack.jetbrains.com/issue/KT-47709)以獲取關於此變更及其影響的更詳細解釋。

### 作為父型別的穩定懸掛函數

在 Kotlin 1.6.0 中，懸掛函式型別 (suspending functional types) 的實作已成為[穩定](components-stability.md)的。在 1.5.30 [版本](whatsnew1530.md#suspending-functions-as-supertypes)中提供了預覽。

此功能在設計使用 Kotlin 協程 (coroutines) 並接受懸掛函式型別的 API 時非常有用。您現在可以將所需的行為封裝在實作懸掛函式型別的獨立類別中，從而簡化您的程式碼。

```kotlin
class MyClickAction : suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () -> Unit) {}
```

您可以在先前只允許使用 Lambda 運算式和懸掛函式引用的地方使用此類別的實例：`launchOnClick(MyClickAction())`。

目前存在兩個來自實作細節的限制：
* 您不能在父型別列表中混合一般函式型別和懸掛型別。
* 您不能使用多個懸掛函式父型別。

### 穩定懸掛轉換

Kotlin 1.6.0 引入了從常規函式型別到懸掛函式型別的[穩定](components-stability.md)轉換。從 1.4.0 開始，此功能支援函式文字 (functional literals) 和可呼叫引用 (callable references)。
在 1.6.0 中，它適用於任何形式的運算式。作為呼叫引數，您現在可以傳遞任何適合的常規函式型別運算式，而預期為懸掛型別。編譯器將自動執行隱式轉換。

```kotlin
fun getSuspending(suspending: suspend () -> Unit) {}

fun suspending() {}

fun test(regular: () -> Unit) {
    getSuspending { }           // OK
    getSuspending(::suspending) // OK
    getSuspending(regular)      // OK
}
```

### 穩定註解類別實例化

Kotlin 1.5.30 [引入了](whatsnew1530.md#instantiation-of-annotation-classes)在 JVM 平台上實例化註解類別的實驗性支援。
在 1.6.0 中，此功能在 Kotlin/JVM 和 Kotlin/JS 上都預設可用。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中了解更多關於註解類別實例化的資訊。

### 改進遞迴泛型型別的型別推斷

Kotlin 1.5.30 引入了對遞迴泛型型別 (recursive generic types) 型別推斷的改進，這允許它們的型別引數僅根據對應型別參數的上限來推斷。
此改進在編譯器選項下可用。在 1.6.0 及更高版本中，它預設啟用。

```kotlin
// Before 1.5.30
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
  withDatabaseName("db")
  withUsername("user")
  withPassword("password")
  withInitScript("sql/schema.sql")
}

// With compiler option in 1.5.30 or by default starting with 1.6.0
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
  .withDatabaseName("db")
  .withUsername("user")
  .withPassword("password")
  .withInitScript("sql/schema.sql")
```

### 建構器推斷的變更

建構器推斷 (Builder inference) 是一種型別推斷 (type inference) 風味，在呼叫泛型建構器函數 (generic builder functions) 時很有用。它可以在其 Lambda 引數內部的呼叫的型別資訊的幫助下推斷呼叫的型別引數。

我們正在進行多項變更，使我們更接近於完全穩定的建構器推斷。從 1.6.0 開始：
* 您可以在建構器 Lambda 內部進行呼叫，回傳尚未推斷的型別實例，而無需指定在 1.5.30 [引入](whatsnew1530.md#eliminating-builder-inference-restrictions)的 `-Xunrestricted-builder-inference` 編譯器選項。
* 使用 `-Xenable-builder-inference`，您可以編寫自己的建構器，而無需應用 [`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) 註解。

    > 請注意，這些建構器的客戶端將需要指定相同的 `-Xenable-builder-inference` 編譯器選項。
    >
    {style="warning"}

* 使用 `-Xenable-builder-inference`，如果常規型別推斷無法獲得足夠的型別資訊，建構器推斷會自動啟用。

[了解如何編寫自訂泛型建構器](using-builders-with-builder-inference.md)。

### 支援類別型別參數上的註解

對類別型別參數上註解的支援如下所示：

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

所有型別參數上的註解都會發佈到 JVM 位元碼 (bytecode) 中，以便註解處理器 (annotation processors) 能夠使用它們。

有關觸發此用例的原因，請閱讀[此 YouTrack 問題單](https://youtrack.com/issue/KT-43714)。

了解更多關於[註解](annotations.md)的資訊。

## 更長時間地支援舊版 API

從 Kotlin 1.6.0 開始，我們將支援三個先前 API 版本，而不是兩個，同時支援當前穩定版本。目前，我們支援版本 1.3、1.4、1.5 和 1.6。

## Kotlin/JVM

對於 Kotlin/JVM，從 1.6.0 開始，編譯器可以生成與 JVM 17 對應的位元碼版本的類別。新語言版本還包括最佳化的委託屬性 (delegated properties) 和可重複註解 (repeatable annotations)，這些都是我們藍圖中的內容：
* [適用於 1.8 JVM 目標的具有執行時保留的可重複註解](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [最佳化在給定 KProperty 實例上呼叫 `get`/`set` 的委託屬性](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 適用於 1.8 JVM 目標的具有執行時保留的可重複註解

Java 8 引入了[可重複註解](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)，它們可以多次應用於單個程式碼元素。
此功能要求 Java 程式碼中存在兩個宣告：本身標記為 [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html) 的可重複註解，以及用於保存其值的包含註解。

Kotlin 也有可重複註解，但只需要在註解宣告上存在 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 即可使其可重複。
在 1.6.0 之前，此功能僅支援 `SOURCE` 保留，並且與 Java 的可重複註解不相容。
Kotlin 1.6.0 移除了這些限制。`@kotlin.annotation.Repeatable` 現在接受任何保留，並使該註解在 Kotlin 和 Java 中都可重複。
Java 的可重複註解現在也從 Kotlin 方面得到支援。

雖然您可以宣告一個包含註解，但這並非必需。例如：
* 如果註解 `@Tag` 標記為 `@kotlin.annotation.Repeatable`，則 Kotlin 編譯器會自動生成一個名為 `@Tag.Container` 的包含註解類別：

    ```kotlin
    @Repeatable
    annotation class Tag(val name: String)

    // The compiler generates @Tag.Container containing annotation
    ```

* 要為包含註解設定自訂名稱，請應用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元註解 (meta-annotation) 並傳遞明確宣告的包含註解類別作為引數：

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)

    annotation class Tags(val value: Array<Tag>)
    ```

Kotlin 反射 (reflection) 現在透過新函數 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 支援 Kotlin 和 Java 的可重複註解。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md) 中了解更多關於 Kotlin 可重複註解的資訊。

### 最佳化在給定 KProperty 實例上呼叫 `get`/`set` 的委託屬性

我們透過省略 `$delegate` 欄位並生成對參考屬性的立即存取，最佳化了生成的 JVM 位元碼。

例如，在以下程式碼中：

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin 不再生成 `content$delegate` 欄位。
`content` 變數的屬性存取器直接呼叫 `impl` 變數，跳過委託屬性的 `getValue`/`setValue` 運算子，從而避免了對 [`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 型別的屬性參考物件的需求。

感謝我們的 Google 同事實作此功能！

了解更多關於[委託屬性](delegated-properties.md)的資訊。

## Kotlin/Native

Kotlin/Native 獲得了多項改進和元件更新，其中一些處於預覽狀態：
* [新記憶體管理器的預覽](#preview-of-the-new-memory-manager)
* [支援 Xcode 13](#support-for-xcode-13)
* [在任何主機上編譯 Windows 目標](#compilation-of-windows-targets-on-any-host)
* [LLVM 和連結器更新](#llvm-and-linker-updates)
* [效能改進](#performance-improvements)
* [與 JVM 和 JS IR 後端統一的編譯器外掛程式 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [針對 Klib 連結失敗的詳細錯誤訊息](#detailed-error-messages-for-klib-linkage-failures)
* [重新設計的未處理例外處理 API](#reworked-unhandled-exception-handling-api)

### 新記憶體管理器的預覽

> 新的 Kotlin/Native 記憶體管理器是[實驗性](components-stability.md)的。
> 它可能隨時被移除或更改。需要選擇啟用（參見下面的詳細資訊），並且您應該僅將其用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 上提供回饋。
>
{style="warning"}

在 Kotlin 1.6.0 中，您可以嘗試新的 Kotlin/Native 記憶體管理器 (memory manager) 的開發預覽版。
它使我們更接近消除 JVM 和 Native 平台之間的差異，從而在多平台專案中提供一致的開發者體驗。

一個值得注意的變化是頂層屬性 (top-level properties) 的延遲初始化 (lazy initialization)，就像在 Kotlin/JVM 中一樣。當首次存取同一檔案中的頂層屬性或函數時，頂層屬性會被初始化。
此模式還包括全域程序間最佳化 (global interprocedural optimization)（僅對發佈二進位檔啟用），它移除了冗餘的初始化檢查。

我們最近發佈了一篇關於新記憶體管理器的[部落格文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)。
閱讀它以了解新記憶體管理器的當前狀態並找到一些演示專案，或直接跳到[遷移說明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)自行嘗試。
請檢查新記憶體管理器在您的專案上的運作方式，並在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享回饋。

### 支援 Xcode 13

Kotlin/Native 1.6.0 支援 Xcode 13 — Xcode 的最新版本。您可以隨意更新 Xcode 並繼續為 Apple 作業系統開發 Kotlin 專案。

> Xcode 13 中新增的函式庫在 Kotlin 1.6.0 中尚不可用，但我們將在未來版本中添加對它們的支援。
>
{style="note"}

### 在任何主機上編譯 Windows 目標

從 1.6.0 開始，您無需 Windows 主機即可編譯 Windows 目標 `mingwX64` 和 `mingwX86`。它們可以在任何支援 Kotlin/Native 的主機上編譯。

### LLVM 和連結器更新

我們重新設計了 Kotlin/Native 底層使用的 LLVM 依賴項。這帶來了多種好處，包括：
* 將 LLVM 版本更新到 11.1.0。
* 減小了依賴項大小。例如，在 macOS 上，它現在大約是 300 MB，而舊版本中是 1200 MB。
* [排除了對 `ncurses5` 函式庫的依賴](https://youtrack.com/issue/KT-42693)，該函式庫在現代 Linux 發行版中不可用。

除了 LLVM 更新之外，Kotlin/Native 現在還為 MingGW 目標使用 [LLD](https://lld.llvm.org/) 連結器（LLVM 專案中的一個連結器）。
它提供了比先前使用的 ld.bfd 連結器更多的優勢，並將允許我們改進生成二進位檔的執行時效能，並支援 MinGW 目標的編譯器快取。
請注意，LLD [需要 DLL 連結的匯入函式庫](whatsnew1530.md#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)。
在[此 Stack Overflow 討論串](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527)中了解更多資訊。

### 效能改進

Kotlin/Native 1.6.0 提供了以下效能改進：

* 編譯時間：編譯器快取 (compiler caches) 預設為 `linuxX64` 和 `iosArm64` 目標啟用。
這加速了除第一次之外的大多數偵錯模式編譯。測量顯示我們的測試專案速度提高了約 200%。
這些目標的編譯器快取自 Kotlin 1.5.0 起就已可用，並帶有[額外的 Gradle 屬性](whatsnew15.md#performance-improvements)；您現在可以移除它們。
* 執行時：透過 `for` 迴圈迭代陣列現在快了高達 12%，這要歸功於生成 LLVM 程式碼的最佳化。

### 與 JVM 和 JS IR 後端統一的編譯器外掛程式 ABI

> 在 Kotlin/Native 中使用通用 IR 編譯器外掛程式 ABI 的選項是[實驗性](components-stability.md)的。
> 它可能隨時被移除或更改。需要選擇啟用（參見下面的詳細資訊），並且您應該僅將其用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48595) 上提供回饋。
>
{style="warning"}

在先前的版本中，編譯器外掛程式的作者由於 ABI (Application Binary Interface) 的差異，必須為 Kotlin/Native 提供單獨的構件 (artifacts)。

從 1.6.0 開始，Kotlin 多平台 Gradle 外掛程式 (Kotlin Multiplatform Gradle plugin) 能夠為 Kotlin/Native 使用可嵌入式編譯器 JAR (embeddable compiler jar) —— 即用於 JVM 和 JS IR 後端的 JAR。
這是朝向統一編譯器外掛程式開發體驗邁出的一步，因為您現在可以為 Native 和其他支援的平台使用相同的編譯器外掛程式構件。

這是此類支援的預覽版本，並且需要選擇啟用。
要開始為 Kotlin/Native 使用通用編譯器外掛程式構件，請將以下行新增到 `gradle.properties`：`kotlin.native.useEmbeddableCompilerJar=true`。

我們計劃未來預設為 Kotlin/Native 使用可嵌入式編譯器 JAR，因此您對於預覽版的運作情況提供回饋對我們至關重要。

如果您是編譯器外掛程式的作者，請嘗試此模式並檢查它是否適用於您的外掛程式。
請注意，根據您外掛程式的結構，可能需要遷移步驟。請參閱[此 YouTrack 問題單](https://youtrack.jetbrains.com/issue/KT-48595)以獲取遷移說明，並在評論中留下您的回饋。

### 針對 Klib 連結失敗的詳細錯誤訊息

Kotlin/Native 編譯器現在為 klib 連結錯誤提供詳細的錯誤訊息。
這些訊息現在具有清晰的錯誤描述，並且還包括有關可能原因和修復方法的信息。

例如：
* 1.5.30：

    ```text
    e: java.lang.IllegalStateException: IrTypeAliasSymbol expected: Unbound public symbol for public kotlinx.coroutines/CancellationException|null[0]
    <stack trace>
    ```

* 1.6.0：

    ```text
    e: The symbol of unexpected type encountered during IR deserialization: IrClassPublicSymbolImpl, kotlinx.coroutines/CancellationException|null[0].
    IrTypeAliasSymbol is expected.

    This could happen if there are two libraries, where one library was compiled against the different version of the other library than the one currently used in the project.
    Please check that the project configuration is correct and has consistent versions of dependencies.

    The list of libraries that depend on "org.jetbrains.kotlinx:kotlinx-coroutines-core (org.jetbrains.kotlinx:kotlinx-coroutines-core-macosx64)" and may lead to conflicts:
    <list of libraries and potential version mismatches>

    Project dependencies:
    <dependencies tree>
    ```

### 重新設計的未處理例外處理 API

我們統一了整個 Kotlin/Native 執行時中未處理例外 (unhandled exceptions) 的處理，並將預設處理公開為函數 `processUnhandledException(throwable: Throwable)`，供自訂執行環境（如 `kotlinx.coroutines`）使用。
此處理也適用於在 `Worker.executeAfter()` 中逃脫操作的例外，但僅適用於新的[記憶體管理器](#preview-of-the-new-memory-manager)。

API 改進也影響了透過 `setUnhandledExceptionHook()` 設定的掛鉤 (hooks)。先前，當 Kotlin/Native 執行時呼叫掛鉤並帶有未處理例外時，此類掛鉤會被重置，並且程式總是會立即終止。
現在這些掛鉤可以多次使用，如果您希望程式在未處理例外時始終終止，要麼不要設定未處理例外掛鉤 (`setUnhandledExceptionHook()`)，要麼確保在掛鉤結束時呼叫 `terminateWithUnhandledException()`。
這將幫助您將例外傳送到第三方崩潰報告服務（例如 Firebase Crashlytics），然後終止程式。
逃逸 `main()` 的例外以及跨越互通邊界 (interop boundary) 的例外將始終終止程式，即使掛鉤未呼叫 `terminateWithUnhandledException()`。

## Kotlin/JS

我們正在繼續努力穩定 Kotlin/JS 編譯器的 IR 後端。
Kotlin/JS 現在有一個[選項可以禁用 Node.js 和 Yarn 的下載](#option-to-use-pre-installed-node-js-and-yarn)。

### 選項：使用預裝的 Node.js 和 Yarn

您現在可以在建置 Kotlin/JS 專案時禁用 Node.js 和 Yarn 的下載，並使用主機上已安裝的實例。
這對於在沒有網路連接的伺服器上建置很有用，例如 CI 伺服器。

要禁用下載外部元件，請將以下行新增到您的 `build.gradle(.kts)` 中：

* Yarn：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // or true for default behavior
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
    }
    ```

    </tab>
    </tabs>

* Node.js：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // or true for default behavior
    }

    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension).download = false
    }
    ```

    </tab>
    </tabs>

## Kotlin Gradle 外掛程式

在 Kotlin 1.6.0 中，我們將 `KotlinGradleSubplugin` 類別的棄用級別更改為 'ERROR'。
此類別用於編寫編譯器外掛程式。在接下來的版本中，我們將移除此類別。請改用 `KotlinCompilerPluginSupportPlugin` 類別。

我們移除了 `kotlin.useFallbackCompilerSearch` 建置選項和 `noReflect` 以及 `includeRuntime` 編譯器選項。
`useIR` 編譯器選項已被隱藏，並將在即將發佈的版本中移除。

在 Kotlin Gradle 外掛程式中了解更多關於[目前支援的編譯器選項](gradle-compiler-options.md)的資訊。

## 標準函式庫

新的 1.6.0 版標準函式庫穩定化了實驗性功能，引入了新功能，並統一了其在各平台上的行為：

* [新 `readline` 函數](#new-readline-functions)
* [穩定 `typeOf()`](#stable-typeof)
* [穩定集合建構器](#stable-collection-builders)
* [穩定 Duration API](#stable-duration-api)
* [將 Regex 分割成序列](#splitting-regex-into-a-sequence)
* [整數上的位元旋轉操作](#bit-rotation-operations-on-integers)
* [JS 中 `replace()` 和 `replaceFirst()` 的變更](#changes-for-replace-and-replacefirst-in-js)
* [對現有 API 的改進](#improvements-to-the-existing-api)
* [棄用](#deprecations)

### 新 `readline` 函數

Kotlin 1.6.0 提供了用於處理標準輸入的新函數：[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 和 [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html)。

> 目前，新函數僅適用於 JVM 和 Native 目標平台。
>
{style="note"}

|**早期版本**|**1.6.0 替代方案**|**用法**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| 從標準輸入讀取一行並返回，如果達到 EOF 則拋出 `RuntimeException`。 |
|`readLine()`|`readlnOrNull()`| 從標準輸入讀取一行並返回，如果達到 EOF 則返回 `null`。 |

我們相信，在讀取一行時不再需要使用 `!!` 將會改善新手的體驗並簡化 Kotlin 的教學。
為了使讀取行操作的名稱與其 `println()` 對應操作保持一致，我們決定將新函數的名稱縮短為「ln」。

```kotlin
println("What is your nickname?")
val nickname = readln()
println("Hello, $nickname!")
```

```kotlin
fun main() {
//sampleStart
    var sum = 0
    while (true) {
        val nextLine = readlnOrNull().takeUnless {
            it.isNullOrEmpty()
        } ?: break
        sum += nextLine.toInt()
    }
    println(sum)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

現有的 `readLine()` 函數在您的 IDE 程式碼補全中將比 `readln()` 和 `readlnOrNull()` 具有更低的優先級。
IDE 檢查也將建議使用新函數而不是舊版 `readLine()`。

我們計劃在未來版本中逐步棄用 `readLine()` 函數。

### 穩定 `typeOf()`

版本 1.6.0 帶來了[穩定](components-stability.md)的 [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函數，完成了[主要藍圖項目](https://youtrack.jetbrains.com/issue/KT-45396)之一。

[自 1.3.40 版本起](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/)，`typeOf()` 在 JVM 平台上作為實驗性 API 提供。
現在您可以在任何 Kotlin 平台上使用它，並獲得編譯器可以推斷的任何 Kotlin 型別的 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 表示：

```kotlin
inline fun <reified T> renderType(): String {
    val type = typeOf<T>()
    return type.toString()
}

fun main() {
    val fromExplicitType = typeOf<Int>()
    val fromReifiedType = renderType<List<Int>>()
}
```

### 穩定集合建構器

在 Kotlin 1.6.0 中，集合建構器 (collection builder) 函數已提升為[穩定](components-stability.md)狀態。集合建構器返回的集合現在在其唯讀狀態下是可序列化的 (serializable)。

您現在無需選擇啟用註解即可使用 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)、
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 和 [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)：

```kotlin
fun main() {
//sampleStart
    val x = listOf('b', 'c')
    val y = buildList {
        add('a')
        addAll(x)
        add('d')
    }
    println(y)  // [a, b, c, d]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 穩定 Duration API

用於表示不同時間單位持續時間的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 類別已提升為[穩定](components-stability.md)。在 1.6.0 中，Duration API 收到以下變更：

* [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函數的第一個元件，它將持續時間分解為天、小時、分鐘、秒和奈秒，現在是 `Long` 型別而不是 `Int`。
  之前，如果值不適合 `Int` 範圍，它會被強制轉換到該範圍。使用 `Long` 型別，您可以分解持續時間範圍內的任何值，而不會截斷不適合 `Int` 的值。

* `DurationUnit` 列舉現在是獨立的，在 JVM 上不再是 `java.util.concurrent.TimeUnit` 的型別別名。
  我們沒有發現任何令人信服的案例表明 `typealias DurationUnit = TimeUnit` 可能有用。此外，透過型別別名公開 `TimeUnit` API 可能會讓 `DurationUnit` 用戶感到困惑。

* 為回應社群回饋，我們將帶回 `Int.seconds` 等擴充屬性。但我們希望限制它們的適用性，因此我們將它們放在 `Duration` 類別的伴隨物件 (companion object) 中。
  雖然 IDE 仍可以在完成時建議擴充功能並自動從伴隨物件插入匯入，但未來我們計劃將此行為限制在預期 `Duration` 型別的情況。

  ```kotlin
  import kotlin.time.Duration.Companion.seconds

  fun main() {
  //sampleStart
      val duration = 10000
      println("There are ${duration.seconds.inWholeMinutes} minutes in $duration seconds")
      // There are 166 minutes in 10000 seconds
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

  我們建議將先前引入的伴隨函數（例如 `Duration.seconds(Int)`）和已棄用的頂層擴充功能（例如 `Int.seconds`）替換為 `Duration.Companion` 中的新擴充功能。

  > 此類替換可能會導致舊的頂層擴充功能與新的伴隨擴充功能之間產生歧義。
  > 在執行自動遷移之前，請務必使用 `kotlin.time` 套件的萬用字元匯入 —— `import kotlin.time.*`。
  >
  {style="note"}

### 將 Regex 分割成序列

`Regex.splitToSequence(CharSequence)` 和 `CharSequence.splitToSequence(Regex)` 函數已提升為[穩定](components-stability.md)狀態。
它們會根據給定的正規表達式 (regex) 匹配來分割字串，但將結果作為[序列 (Sequence)](sequences.md) 返回，以便對此結果的所有操作都以惰性方式執行：

```kotlin
fun main() {
//sampleStart
    val colorsText = "green, red, brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
    // or
    // val mixedColor = colorsText.splitToSequence(regex)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 整數上的位元旋轉操作

在 Kotlin 1.6.0 中，用於位元操作的 `rotateLeft()` 和 `rotateRight()` 函數變為[穩定](components-stability.md)。
這些函數將數字的二進位表示向左或向右旋轉指定的位數：

```kotlin
fun main() {
//sampleStart
    val number: Short = 0b10001
    println(number
        .rotateRight(2)
        .toString(radix = 2)) // 100000000000100
    println(number
        .rotateLeft(2)
        .toString(radix = 2))  // 1000100
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

### JS 中 `replace()` 和 `replaceFirst()` 的變更

在 Kotlin 1.6.0 之前，當替換字串包含群組參考 (group reference) 時，[`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 和 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) Regex 函數在 Java 和 JS 中的行為有所不同。
為了使所有目標平台上的行為保持一致，我們更改了它們在 JS 中的實作。

替換字串中 `${name}` 或 `$index` 的出現會被替換為與指定索引或名稱的捕獲群組 (captured groups) 對應的子序列 (subsequences)：
* `$index` – '
    ``` 後的第一個數字始終被視為群組參考的一部分。隨後的數字只有在它們形成有效的群組參考時才被納入 `index`。只有數字 '0'–'9' 被視為群組參考的潛在組成部分。請注意，捕獲群組的索引從 '1' 開始。
  索引為 '0' 的群組代表整個匹配。
* `${name}` – `name` 可以由拉丁字母 'a'–'z'、'A'–'Z' 或數字 '0'–'9' 組成。第一個字元必須是字母。

    > 替換模式中的命名群組 (Named groups) 目前僅在 JVM 上支援。
    >
    {style="note"}

* 要將隨後的字元作為文字 (literal) 包含在替換字串中，請使用反斜線字元 `\`:

    ```kotlin
    fun main() {
    //sampleStart
        println(Regex("(.+)").replace("Kotlin", """\$ $1""")) // $ Kotlin
        println(Regex("(.+)").replaceFirst("1.6.0", """\\ $1""")) // \ 1.6.0
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

    如果替換字串必須被視為文字字串，您可以使用 [`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html)。

### 對現有 API 的改進

* 1.6.0 版為 `Comparable.compareTo()` 新增了 infix 擴充函數 (extension function)。您現在可以使用 infix 形式來比較兩個物件的順序：

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS 中的 `Regex.replace()` 現在也不再是 `inline` 的，以統一其在所有平台上的實作。
* `compareTo()` 和 `equals()` 字串函數，以及 `isBlank()` CharSequence 函數現在在 JS 中的行為與在 JVM 中的行為完全相同。
  之前在處理非 ASCII 字元時存在差異。

### 棄用

在 Kotlin 1.6.0 中，我們將以警告的方式開始棄用某些僅限 JS 的 stdlib API。

#### `concat()`、`match()` 和 `matches()` 字串函數

* 要將字串與給定其他物件的字串表示連結，請使用 `plus()` 而非 `concat()`。
* 要在輸入中尋找正規表達式 (regular expression) 的所有出現，請使用 Regex 類別的 `findAll()` 而非 `String.match(regex: String)`。
* 要檢查正規表達式是否匹配整個輸入，請使用 Regex 類別的 `matches()` 而非 `String.matches(regex: String)`。

#### 接受比較函數的陣列 `sort()` 函數

我們已棄用 `Array<out T>.sort()` 函數以及內聯函數 `ByteArray.sort()`、`ShortArray.sort()`、
`IntArray.sort()`、`LongArray.sort()`、`FloatArray.sort()`、`DoubleArray.sort()` 和 `CharArray.sort()`，它們按照比較函數傳遞的順序對陣列進行排序。
請使用其他標準函式庫函數進行陣列排序。

請參閱[集合排序](collection-ordering.md)部分以供參考。

## 工具

### Kover – 適用於 Kotlin 的程式碼覆蓋工具

> Kover Gradle 外掛程式是實驗性的。我們非常感謝您在 [GitHub](https://github.com/Kotlin/kotlinx-kover/issues) 上提供回饋。
>
{style="warning"}

在 Kotlin 1.6.0 中，我們引入了 Kover – 一個適用於 [IntelliJ](https://github.com/JetBrains/intellij-coverage) 和 [JaCoCo](https://github.com/jacoco/jacoco) Kotlin 程式碼覆蓋代理程式 (code coverage agents) 的 Gradle 外掛程式。
它適用於所有語言結構，包括內聯函數。

在 Kover 的 [GitHub 儲存庫](https://github.com/Kotlin/kotlinx-kover)或此影片中了解更多資訊：

<video src="https://www.youtube.com/v/jNu5LY9HIbw" title="Kover – The Code Coverage Plugin"/>

## 協程 1.6.0-RC

`kotlinx.coroutines` [1.6.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) 已發佈，其中包含多項功能和改進：

* 支援[新的 Kotlin/Native 記憶體管理器](#preview-of-the-new-memory-manager)
* 引入 Dispatcher _視圖_ API，允許在不創建額外執行緒的情況下限制並行性
* 從 Java 6 目標遷移到 Java 8 目標
* `kotlinx-coroutines-test` 具有新的重新設計的 API 和多平台支援
* 引入 [`CopyableThreadContextElement`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-thread-context-element/index.html)，它為協程提供了對 [`ThreadLocal`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html) 變數的執行緒安全寫入權限

在[變更日誌](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC)中了解更多資訊。

## 遷移到 Kotlin 1.6.0

IntelliJ IDEA 和 Android Studio 將在 Kotlin 外掛程式 1.6.0 可用時建議更新。

要將現有專案遷移到 Kotlin 1.6.0，請將 Kotlin 版本更改為 `1.6.0` 並重新匯入您的 Gradle 或 Maven 專案。
[了解如何更新到 Kotlin 1.6.0](releases.md#update-to-a-new-kotlin-version)。

要使用 Kotlin 1.6.0 啟動新專案，請更新 Kotlin 外掛程式並從 **File** | **New** | **Project** 執行專案精靈。

新的命令列編譯器可從 [GitHub 發佈頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0)下載。

Kotlin 1.6.0 是一個[功能發佈](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能帶來與您為早期版本語言編寫的程式碼不相容的變更。
在 [Kotlin 1.6 相容性指南](compatibility-guide-16.md)中找到此類變更的詳細列表。