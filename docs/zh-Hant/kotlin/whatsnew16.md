[//]: # (title: Kotlin 1.6.0 的新功能)

[發布日期：2021 年 11 月 16 日](releases.md#release-details)

Kotlin 1.6.0 引入了新的語言功能，對現有功能進行了優化和改進，並對 Kotlin 標準函式庫進行了許多改進。

您也可以在[發布部落格文章](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)中找到這些變更的概述。

## 語言

Kotlin 1.6.0 穩定化了先前 1.5.30 版本中引入的幾項預覽語言功能：
* [針對列舉、密封類別和布林主題的穩定詳盡 `when` 陳述式](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [作為超型別的穩定暫停函式](#stable-suspending-functions-as-supertypes)
* [穩定的暫停轉換](#stable-suspend-conversions)
* [註解類別的穩定實例化](#stable-instantiation-of-annotation-classes)

它還包括各種型別推斷改進和對類別型別參數上的註解支援：
* [遞迴泛型型別的改進型別推斷](#improved-type-inference-for-recursive-generic-types)
* [建造者推斷的變更](#changes-to-builder-inference)
* [支援類別型別參數上的註解](#support-for-annotations-on-class-type-parameters)

### 針對列舉、密封類別和布林主題的穩定詳盡 `when` 陳述式

一個**詳盡的** [`when`](control-flow.md#when-expressions-and-statements) 陳述式包含其主題所有可能型別或值的分支，或者包含某些型別加上一個 `else` 分支。它涵蓋了所有可能的情況，讓您的程式碼更安全。

我們很快將禁止非詳盡的 `when` 陳述式，以使行為與 `when` 表達式保持一致。為了確保平順遷移，Kotlin 1.6.0 會針對以列舉、密封類別或布林值為主題的非詳盡 `when` 陳述式報告警告。這些警告將在未來版本中變成錯誤。

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

請參閱 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47709) 以獲取有關此變更及其影響的更詳細解釋。

### 作為超型別的穩定暫停函式

在 Kotlin 1.6.0 中，暫停函式型別的實作已變得[穩定](components-stability.md)。[1.5.30 中提供了預覽版](whatsnew1530.md#suspending-functions-as-supertypes)。

此功能在使用 Kotlin 協程並接受暫停函式型別的 API 設計中非常有用。您現在可以透過將所需行為封裝在實作暫停函式型別的獨立類別中來簡化您的程式碼。

```kotlin
class MyClickAction : suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () -> Unit) {}
```

您可以在先前僅允許 lambda 表達式和暫停函式參考的地方使用此類別的實例：`launchOnClick(MyClickAction())`。

目前有兩個來自實作細節的限制：
* 您不能在超型別列表中混合普通函式型別和暫停型別。
* 您不能使用多個暫停函式超型別。

### 穩定的暫停轉換

Kotlin 1.6.0 引入了從普通函式型別到暫停函式型別的[穩定](components-stability.md)轉換。從 1.4.0 開始，此功能支援函式字面值和可呼叫參考。在 1.6.0 中，它適用於任何形式的表達式。作為呼叫引數，您現在可以在預期為暫停型別的地方傳遞任何合適的普通函式型別的表達式。編譯器將自動執行隱式轉換。

```kotlin
fun getSuspending(suspending: suspend () -> Unit) {}

fun suspending() {}

fun test(regular: () -> Unit) {
    getSuspending { }           // OK
    getSuspending(::suspending) // OK
    getSuspending(regular)      // OK
}
```

### 註解類別的穩定實例化

Kotlin 1.5.30 [引入了](whatsnew1530.md#instantiation-of-annotation-classes)對 JVM 平台上註解類別實例化的實驗性支援。在 1.6.0 中，此功能預設適用於 Kotlin/JVM 和 Kotlin/JS。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中了解有關註解類別實例化的更多資訊。

### 遞迴泛型型別的改進型別推斷

Kotlin 1.5.30 引入了對遞迴泛型型別的型別推斷改進，這允許僅根據對應型別參數的上界來推斷其型別引數。此改進可透過編譯器選項獲得。在 1.6.0 及更高版本中，它預設啟用。

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

### 建造者推斷的變更

建造者推斷是一種型別推斷風味，在呼叫泛型建造者函式時非常有用。它可以藉助其 lambda 引數內呼叫的型別資訊來推斷呼叫的型別引數。

我們正在進行多項變更，使我們更接近完全穩定的建造者推斷。從 1.6.0 開始：
* 您可以在建造者 lambda 內呼叫返回尚未推斷型別的實例，而無需指定 [1.5.30 中引入的](whatsnew1530.md#eliminating-builder-inference-restrictions) `-Xunrestricted-builder-inference` 編譯器選項。
* 透過 `-Xenable-builder-inference`，您可以編寫自己的建造者而無需應用 [`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) 註解。

    > 請注意，這些建造者的客戶需要指定相同的 `-Xenable-builder-inference` 編譯器選項。
    >
    {style="warning"}

* 透過 `-Xenable-builder-inference`，如果普通型別推斷無法獲取足夠的型別資訊，建造者推斷會自動啟用。

[了解如何編寫自訂泛型建造者](using-builders-with-builder-inference.md)。

### 支援類別型別參數上的註解

支援類別型別參數上的註解看起來像這樣：

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

所有型別參數上的註解都會發出到 JVM 位元組碼中，以便註解處理器能夠使用它們。

有關主要用例，請閱讀[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-43714)。

了解有關[註解](annotations.md)的更多資訊。

## 支援較長期間的舊版 API

從 Kotlin 1.6.0 開始，我們將支援三個先前 API 版本的開發，而不是兩個，以及目前的穩定版本。目前，我們支援 1.3、1.4、1.5 和 1.6 版本。

## Kotlin/JVM

對於 Kotlin/JVM，從 1.6.0 開始，編譯器可以產生對應於 JVM 17 的位元組碼版本的類別。新語言版本還包括優化委託屬性和可重複註解，這些都在我們的路線圖中：
* [針對 1.8 JVM 目標的具有執行時保留的可重複註解](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [優化在給定 KProperty 實例上呼叫 get/set 的委託屬性](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 針對 1.8 JVM 目標的具有執行時保留的可重複註解

Java 8 引入了[可重複註解](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)，它們可以多次應用於單一程式碼元素。此功能要求 Java 程式碼中存在兩個宣告：標記為 [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html) 的可重複註解本身，以及用於保存其值的包含註解。

Kotlin 也有可重複註解，但僅要求在註解宣告中存在 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 即可使其可重複。在 1.6.0 之前，此功能僅支援 `SOURCE` 保留，並且與 Java 的可重複註解不相容。Kotlin 1.6.0 移除了這些限制。`@kotlin.annotation.Repeatable` 現在接受任何保留策略，並使註解在 Kotlin 和 Java 中都可重複。Java 的可重複註解現在也從 Kotlin 側獲得支援。

雖然您可以宣告包含註解，但這並非必需。例如：
* 如果註解 `@Tag` 標記為 `@kotlin.annotation.Repeatable`，Kotlin 編譯器會自動產生一個名為 `@Tag.Container` 的包含註解類別：

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)

    // The compiler generates @Tag.Container containing annotation
    ```

* 要為包含註解設定自訂名稱，請應用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元註解，並將明確宣告的包含註解類別作為引數傳遞：

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

Kotlin 反射現在透過新函數 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 支援 Kotlin 和 Java 的可重複註解。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md) 中了解有關 Kotlin 可重複註解的更多資訊。

### 優化在給定 KProperty 實例上呼叫 get/set 的委託屬性

我們透過省略 `$delegate` 欄位並產生對所參考屬性的直接存取來優化產生的 JVM 位元組碼。

例如，在以下程式碼中：

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin 不再產生 `content$delegate` 欄位。`content` 變數的屬性存取器直接呼叫 `impl` 變數，跳過委託屬性的 `getValue`/`setValue` 運算子，從而避免了對 [`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 型別的屬性參考物件的需求。

感謝我們的 Google 同事實作此功能！

了解有關[委託屬性](delegated-properties.md)的更多資訊。

## Kotlin/Native

Kotlin/Native 正在獲得多項改進和元件更新，其中一些處於預覽狀態：
* [新記憶體管理器的預覽](#preview-of-the-new-memory-manager)
* [支援 Xcode 13](#support-for-xcode-13)
* [支援在任何主機上編譯 Windows 目標](#compilation-of-windows-targets-on-any-host)
* [LLVM 和連結器更新](#llvm-and-linker-updates)
* [性能改進](#performance-improvements)
* [與 JVM 和 JS IR 後端統一的編譯器外掛程式 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [Klib 連結失敗的詳細錯誤訊息](#detailed-error-messages-for-klib-linkage-failures)
* [重構未處理異常處理 API](#reworked-unhandled-exception-handling-api)

### 新記憶體管理器的預覽

> 新的 Kotlin/Native 記憶體管理器是[實驗性](components-stability.md)功能。它可能隨時被捨棄或更改。需要選擇啟用（參見以下詳細資訊），並且您應僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 上提供回饋。
>
{style="warning"}

透過 Kotlin 1.6.0，您可以試用新的 Kotlin/Native 記憶體管理器的開發預覽版。它使我們更接近於消除 JVM 和 Native 平台之間的差異，從而在多平台專案中提供一致的開發者體驗。

一個顯著的變更是非頂層屬性的惰性初始化，就像在 Kotlin/JVM 中一樣。當首次存取同一檔案中的頂層屬性或函數時，頂層屬性會被初始化。此模式還包括全域跨程序優化（僅適用於發布二進位檔案），它會移除冗餘初始化檢查。

我們最近發布了一篇關於[新記憶體管理器的部落格文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)。閱讀它以了解新記憶體管理器的當前狀態並找到一些示範專案，或者直接跳到[遷移說明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)親自嘗試。請檢查新的記憶體管理器在您的專案上的運作方式，並在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享回饋。

### 支援 Xcode 13

Kotlin/Native 1.6.0 支援 Xcode 13 – Xcode 的最新版本。您可以自由更新您的 Xcode 並繼續為 Apple 作業系統開發您的 Kotlin 專案。

> Xcode 13 中新增的函式庫在 Kotlin 1.6.0 中尚不可用，但我們將在即將發布的版本中增加對它們的支援。
>
{style="note"}

### 支援在任何主機上編譯 Windows 目標

從 1.6.0 開始，您無需 Windows 主機即可編譯 `mingwX64` 和 `mingwX86` Windows 目標。它們可以在任何支援 Kotlin/Native 的主機上編譯。

### LLVM 和連結器更新

我們重構了 Kotlin/Native 底層使用的 LLVM 依賴項。這帶來了各種好處，包括：
* LLVM 版本更新到 11.1.0。
* 依賴項大小減小。例如，在 macOS 上，它現在約為 300 MB，而先前版本為 1200 MB。
* [排除對 `ncurses5` 函式庫的依賴](https://youtrack.jetbrains.com/issue/KT-42693)，該函式庫在現代 Linux 發行版中不可用。

除了 LLVM 更新之外，Kotlin/Native 現在還為 MingGW 目標使用 [LLD](https://lld.llvm.org/) 連結器（一個來自 LLVM 專案的連結器）。它提供了比先前使用的 ld.bfd 連結器更多的優勢，並將允許我們提高產生二進位檔案的執行時性能，並支援 MinGW 目標的編譯器快取。請注意，LLD [需要 DLL 連結的導入函式庫](whatsnew1530.md#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)。在 [此 Stack Overflow 討論串](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527) 中了解更多資訊。

### 性能改進

Kotlin/Native 1.6.0 提供了以下性能改進：

* 編譯時間：編譯器快取預設為 `linuxX64` 和 `iosArm64` 目標啟用。這加速了偵錯模式下的大多數編譯（首次編譯除外）。測量顯示，在我們的測試專案中，速度提高了約 200%。這些目標的編譯器快取自 Kotlin 1.5.0 起就已可用，並帶有[額外的 Gradle 屬性](whatsnew15.md#performance-improvements)；您現在可以移除它們。
* 執行時：由於產生 LLVM 程式碼中的優化，使用 `for` 迴圈迭代陣列的速度現在提高了多達 12%。

### 與 JVM 和 JS IR 後端統一的編譯器外掛程式 ABI

> 在 Kotlin/Native 中使用通用 IR 編譯器外掛程式 ABI 的選項是[實驗性](components-stability.md)功能。它可能隨時被捨棄或更改。需要選擇啟用（參見以下詳細資訊），並且您應僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48595) 上提供回饋。
>
{style="warning"}

在先前版本中，由於 ABI 中的差異，編譯器外掛程式的作者必須為 Kotlin/Native 提供單獨的構件。

從 1.6.0 開始，Kotlin 多平台 Gradle 外掛程式能夠將可嵌入編譯器 JAR（用於 JVM 和 JS IR 後端）用於 Kotlin/Native。這是邁向編譯器外掛程式開發體驗統一的一步，因為您現在可以將相同的編譯器外掛程式構件用於 Native 和其他支援的平台。

這是此類支援的預覽版本，需要選擇啟用。要開始為 Kotlin/Native 使用泛型編譯器外掛程式構件，請將以下行新增到 `gradle.properties`：`kotlin.native.useEmbeddableCompilerJar=true`。

我們計劃在未來預設為 Kotlin/Native 使用可嵌入編譯器 JAR，因此對我們來說，了解預覽版對您的運作情況至關重要。

如果您是編譯器外掛程式的作者，請嘗試此模式並檢查它是否適用於您的外掛程式。請注意，根據您的外掛程式結構，可能需要遷移步驟。有關遷移說明，請參閱[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48595)，並在評論中留下您的回饋。

### Klib 連結失敗的詳細錯誤訊息

Kotlin/Native 編譯器現在會為 klib 連結錯誤提供詳細的錯誤訊息。這些訊息現在具有清晰的錯誤描述，並且還包含有關可能原因和解決方法的資訊。

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

### 重構未處理異常處理 API

我們統一了 Kotlin/Native 執行時中未處理異常的處理方式，並將預設處理作為 `processUnhandledException(throwable: Throwable)` 函數公開，供自訂執行環境（如 `kotlinx.coroutines`）使用。此處理也適用於在 `Worker.executeAfter()` 操作中逸出的異常，但僅適用於新的[記憶體管理器](#preview-of-the-new-memory-manager)。

API 改進也影響了由 `setUnhandledExceptionHook()` 設定的 Hook。先前，當 Kotlin/Native 執行時使用未處理的異常呼叫 Hook 後，此類 Hook 會被重置，並且程式將在此後立即終止。現在這些 Hook 可以多次使用，如果您希望程式在未處理異常時始終終止，要麼不設定未處理異常 Hook (`setUnhandledExceptionHook()`)，要麼確保在您的 Hook 結束時呼叫 `terminateWithUnhandledException()`。這將幫助您將異常發送到第三方崩潰報告服務（例如 Firebase Crashlytics），然後終止程式。逸出 `main()` 的異常和跨越互操作邊界的異常將始終終止程式，即使 Hook 沒有呼叫 `terminateWithUnhandledException()`。

## Kotlin/JS

我們正在繼續努力穩定 Kotlin/JS 編譯器的 IR 後端。Kotlin/JS 現在有一個[選項可以禁用 Node.js 和 Yarn 的下載](#option-to-use-pre-installed-node-js-and-yarn)。

### 選項：使用預先安裝的 Node.js 和 Yarn

您現在可以在建置 Kotlin/JS 專案時禁用 Node.js 和 Yarn 的下載，並使用主機上已安裝的實例。這對於在沒有網路連接的伺服器（例如 CI 伺服器）上建置非常有用。

要禁用下載外部元件，請將以下行新增到您的 `build.gradle(.kts)`：

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

在 Kotlin 1.6.0 中，我們將 `KotlinGradleSubplugin` 類別的棄用級別更改為 'ERROR'。此類別用於編寫編譯器外掛程式。在後續版本中，我們將移除此類別。請改用 `KotlinCompilerPluginSupportPlugin` 類別。

我們移除了 `kotlin.useFallbackCompilerSearch` 建置選項和 `noReflect` 以及 `includeRuntime` 編譯器選項。`useIR` 編譯器選項已被隱藏，並將在即將發布的版本中移除。

在 Kotlin Gradle 外掛程式中了解有關[目前支援的編譯器選項](gradle-compiler-options.md)的更多資訊。

## 標準函式庫

新的 1.6.0 版標準函式庫穩定化了實驗性功能，引入了新功能，並統一了其跨平台的行為：

* [新的 `readline` 函數](#new-readline-functions)
* [穩定的 `typeOf()`](#stable-typeof)
* [穩定的集合建造者](#stable-collection-builders)
* [穩定的 Duration API](#stable-duration-api)
* [將 Regex 分割為序列](#splitting-regex-into-a-sequence)
* [整數的位元旋轉操作](#bit-rotation-operations-on-integers)
* [JS 中 `replace()` 和 `replaceFirst()` 的變更](#changes-for-replace-and-replacefirst-in-js)
* [現有 API 的改進](#improvements-to-the-existing-api)
* [棄用](#deprecations)

### 新的 `readline` 函數

Kotlin 1.6.0 提供了處理標準輸入的新函數：[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 和 [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html)。

> 目前，新函數僅適用於 JVM 和 Native 目標平台。
>
{style="note"}

|**早期版本**|**1.6.0 替代方案**|**用法**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| 從 stdin 讀取一行並返回，如果達到 EOF 則拋出 `RuntimeException`。 |
|`readLine()`|`readlnOrNull()`| 從 stdin 讀取一行並返回，如果達到 EOF 則返回 `null`。 |

我們相信消除讀取行時使用 `!!` 的需要將改善新手的體驗並簡化 Kotlin 的教學。為了使讀取行操作名稱與其 `println()` 對應函數保持一致，我們決定將新函數的名稱縮短為「ln」。

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

現有的 `readLine()` 函數在您的 IDE 程式碼補全中將獲得比 `readln()` 和 `readlnOrNull()` 更低的優先級。IDE 檢查也將建議使用新函數而不是舊版 `readLine()`。

我們計劃在未來版本中逐步棄用 `readLine()` 函數。

### 穩定的 `typeOf()`

1.6.0 版帶來了[穩定](components-stability.md)的 [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函數，完成了[主要路線圖項目](https://youtrack.jetbrains.com/issue/KT-45396)之一。

[自 1.3.40 起](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/)，`typeOf()` 在 JVM 平台上作為實驗性 API 可用。現在您可以在任何 Kotlin 平台中使用它，並獲取編譯器可以推斷的任何 Kotlin 型別的 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 表示：

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

### 穩定的集合建造者

在 Kotlin 1.6.0 中，集合建造者函數已晉升為[穩定](components-stability.md)。由集合建造者返回的集合現在在其只讀狀態下可序列化。

您現在可以使用 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)、[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 和 [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html) 而無需選擇啟用註解：

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

### 穩定的 Duration API

用於表示不同時間單位持續時間量的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 類別已晉升為[穩定](components-stability.md)。在 1.6.0 中，Duration API 獲得了以下變更：

* 將持續時間分解為日、時、分、秒和奈秒的 [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函數的第一個組成部分現在是 `Long` 型別而不是 `Int`。
  之前，如果值不符合 `Int` 範圍，它會被強制轉換到該範圍。使用 `Long` 型別，您可以分解持續時間範圍內的任何值，而不會截斷不符合 `Int` 的值。

* `DurationUnit` 列舉現在是獨立的，而不是 JVM 上 `java.util.concurrent.TimeUnit` 的型別別名。
  我們沒有找到任何有說服力的案例說明 `typealias DurationUnit = TimeUnit` 可能有用。此外，透過型別別名暴露 `TimeUnit` API 可能會混淆 `DurationUnit` 使用者。

* 為了回應社群回饋，我們將擴展屬性（如 `Int.seconds`）帶回來。但我們希望限制其適用性，因此我們將它們放在 `Duration` 類別的伴生物件中。
  雖然 IDE 仍然可以在補全中建議擴展並自動從伴生物件中插入導入，但未來我們計劃將此行為限制在預期 `Duration` 型別的情況。

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
  
  我們建議將先前引入的伴生函數（例如 `Duration.seconds(Int)`）和已棄用的頂層擴展（例如 `Int.seconds`）替換為 `Duration.Companion` 中的新擴展。

  > 此類替換可能會導致舊頂層擴展和新伴生擴展之間的歧義。
  > 在執行自動遷移之前，請務必使用 `kotlin.time` 套件的萬用字元導入 – `import kotlin.time.*`。
  >
  {style="note"}

### 將 Regex 分割為序列

`Regex.splitToSequence(CharSequence)` 和 `CharSequence.splitToSequence(Regex)` 函數已晉升為[穩定](components-stability.md)。它們會圍繞給定正則表達式的匹配項分割字串，但將結果作為 [Sequence](sequences.md) 返回，以便對此結果的所有操作都惰性執行：

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

### JS 中 `replace()` 和 `replaceFirst()` 的變更

在 Kotlin 1.6.0 之前，當替換字串包含群組參考時，[`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 和 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) Regex 函數在 Java 和 JS 中的行為不同。為了使所有目標平台的行為保持一致，我們更改了它們在 JS 中的實作。

替換字串中 `${name}` 或 `$index` 的出現會被替換為對應於具有指定索引或名稱的捕獲群組的子序列：
* `$index` – ` ` 之後的第一個數字始終被視為群組參考的一部分。後續數字僅在它們構成有效群組參考時才併入 `index`。只有數字 `0`–`9` 被視為群組參考的潛在組件。請注意，捕獲群組的索引從 `1` 開始。索引為 `0` 的群組代表整個匹配項。
* `${name}` – `name` 可以由拉丁字母 `a`–`z`、`A`–`Z` 或數字 `0`–`9` 組成。第一個字元必須是字母。

    > 替換模式中的命名群組目前僅在 JVM 上支援。
    >
    {style="note"}

* 要將後續字元作為字面值包含在替換字串中，請使用反斜線字元 `\`：

    ```kotlin
    fun main() {
    //sampleStart
        println(Regex("(.+)").replace("Kotlin", """\$ $1""")) // $ Kotlin
        println(Regex("(.+)").replaceFirst("1.6.0", """\\ $1""")) // \ 1.6.0
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

    如果替換字串必須被視為字面字串，您可以使用 [`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html)。

### 現有 API 的改進

* 1.6.0 版為 `Comparable.compareTo()` 新增了中綴擴展函數。您現在可以使用中綴形式比較兩個物件的順序：

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS 中的 `Regex.replace()` 現在也不是內聯的，以統一其在所有平台上的實作。
* `compareTo()` 和 `equals()` 字串函數，以及 `isBlank()` CharSequence 函數現在在 JS 中的行為與在 JVM 中完全相同。先前在處理非 ASCII 字元時存在偏差。

### 棄用

在 Kotlin 1.6.0 中，我們正在開始棄用週期，並對某些僅限 JS 的標準函式庫 API 發出警告。

#### `concat()`、`match()` 和 `matches()` 字串函數

* 要將字串與給定其他物件的字串表示形式串聯，請使用 `plus()` 而不是 `concat()`。
* 要在輸入中查找正則表達式的所有出現次數，請使用 Regex 類別的 `findAll()` 而不是 `String.match(regex: String)`。
* 要檢查正則表達式是否匹配整個輸入，請使用 Regex 類別的 `matches()` 而不是 `String.matches(regex: String)`。

#### 接受比較函數的陣列 `sort()`

我們已棄用 `Array<out T>.sort()` 函數和內聯函數 `ByteArray.sort()`、`ShortArray.sort()`、`IntArray.sort()`、`LongArray.sort()`、`FloatArray.sort()`、`DoubleArray.sort()` 和 `CharArray.sort()`，它們按照比較函數傳遞的順序對陣列進行排序。請使用其他標準函式庫函數進行陣列排序。

有關參考，請參閱[集合排序](collection-ordering.md)部分。

## 工具

### Kover – 一個 Kotlin 程式碼覆蓋率工具

> Kover Gradle 外掛程式是實驗性功能。我們非常感謝您在 [GitHub](https://github.com/Kotlin/kotlinx-kover/issues) 上提供回饋。
>
{style="warning"}

透過 Kotlin 1.6.0，我們引入了 Kover – 一個適用於 [IntelliJ](https://github.com/JetBrains/intellij-coverage) 和 [JaCoCo](https://github.com/jacoco/jacoco) Kotlin 程式碼覆蓋率代理的 Gradle 外掛程式。它適用於所有語言建構，包括內聯函數。

在 Kover 的 [GitHub 儲存庫](https://github.com/Kotlin/kotlinx-kover) 或此影片中了解更多資訊：

<video src="https://www.youtube.com/v/jNu5LY9HIbw" title="Kover – The Code Coverage Plugin"/>

## Coroutines 1.6.0-RC

`kotlinx.coroutines` [1.6.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) 已發布，並帶來了多項功能和改進：

* 支援[新的 Kotlin/Native 記憶體管理器](#preview-of-the-new-memory-manager)
* 引入了調度器_視圖_ API，允許限制並行性而無需建立額外執行緒
* 從 Java 6 遷移到 Java 8 目標
* `kotlinx-coroutines-test` 具有新的重構 API 和多平台支援
* 引入了 [`CopyableThreadContextElement`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-thread-context-element/index.html)，它為協程提供了對 [`ThreadLocal`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html) 變數的執行緒安全寫入存取

在[變更日誌](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC)中了解更多資訊。

## 遷移到 Kotlin 1.6.0

IntelliJ IDEA 和 Android Studio 將在 Kotlin 外掛程式 1.6.0 可用後建議更新。

要將現有專案遷移到 Kotlin 1.6.0，請將 Kotlin 版本更改為 `1.6.0` 並重新導入您的 Gradle 或 Maven 專案。[了解如何更新到 Kotlin 1.6.0](releases.md#update-to-a-new-kotlin-version)。

要使用 Kotlin 1.6.0 啟動新專案，請更新 Kotlin 外掛程式並從 **File** | **New** | **Project** 執行專案精靈。

新的命令列編譯器可在 [GitHub 發布頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0) 下載。

Kotlin 1.6.0 是一個[功能版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能會帶來與您為早期語言版本編寫的程式碼不相容的變更。在 [Kotlin 1.6 相容性指南](compatibility-guide-16.md)中查找此類變更的詳細清單。