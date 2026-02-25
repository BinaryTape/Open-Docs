[//]: # (title: Kotlin 1.6.0 的新功能)

<web-summary>閱讀 Kotlin 1.6.0 版本說明，涵蓋新的語言特性、Kotlin Multiplatform、JVM、Native、JS 的更新，以及 Gradle 和 Maven 的建置工具支援。</web-summary>

_[發布於：2021 年 11 月 16 日](releases.md#release-history)_

Kotlin 1.6.0 引入了新的語言特性、對現有特性的最佳化與改進，以及對 Kotlin 標準函式庫的大量改進。

您也可以在 [版本部落格文章](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/) 中找到變更概覽。

> 有關 Kotlin 版本週期的資訊，請參閱 [Kotlin 發布程序](releases.md)。
>
{style="tip"}

## 語言

Kotlin 1.6.0 為之前 1.5.30 版本中引入預覽的幾項語言特性帶來了穩定化：
* [針對列舉、密封和布林主體的穩定窮舉式 when 陳述式](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [穩定的暫停函式作為超型別](#stable-suspending-functions-as-supertypes)
* [穩定的暫停轉換](#stable-suspend-conversions)
* [穩定的註解類別具現化](#stable-instantiation-of-annotation-classes)

它還包含各種型別推論的改進，以及對類別型別參數註解的支援：
* [針對遞迴泛型型別改進的型別推論](#improved-type-inference-for-recursive-generic-types)
* [構建器推論的變更](#changes-to-builder-inference)
* [支援類別型別參數上的註解](#support-for-annotations-on-class-type-parameters)

### 針對列舉、密封和布林主體的穩定窮舉式 when 陳述式

一個 _窮舉式 (exhaustive)_ [`when`](control-flow.md#when-expressions-and-statements) 陳述式包含其主體所有可能型別或值的分支，或某些型別加上一個 `else` 分支。它涵蓋了所有可能的情況，使您的程式碼更安全。

我們很快就會禁止非窮舉式的 `when` 陳述式，以使其行為與 `when` 表達式一致。為了確保平滑遷移，Kotlin 1.6.0 會針對具有列舉 (enum)、密封 (sealed) 或布林 (Boolean) 主體的非窮舉式 `when` 陳述式回報警告。這些警告將在未來的版本中變為錯誤。

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // 錯誤：'when' 表達式必須是窮舉式的
        is Contact.PhoneCall -> 42
    }

fun sendMessage(contact: Contact, message: String) {
    // 從 1.6.0 開始

    // 警告：布林值上的非窮舉式 'when' 陳述式將在 1.7 中被禁止，
    // 請改為新增 'false' 分支或 'else' 分支 
    when(message.isEmpty()) {
        true -> return
    }
    // 警告：密封類別/介面上的非窮舉式 'when' 陳述式將在 1.7 中被禁止，
    // 請改為新增 'is TextMessage' 分支或 'else' 分支
    when(contact) {
        is Contact.PhoneCall -> TODO()
    }
}
```

請參閱 [此 YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-47709) 以獲取有關此變更及其影響的詳細說明。

### 穩定的暫停函式作為超型別

暫停函式型別的實作在 Kotlin 1.6.0 中已變為 [穩定 (Stable)](components-stability.md)。預覽功能曾在 [1.5.30 中](whatsnew1530.md#suspending-functions-as-supertypes) 提供。

當設計使用 Kotlin 協同程式並接受暫停函式型別的 API 時，此特性非常有用。您現在可以透過將所需的行為封裝在實作暫停函式型別的獨立類別中，來簡化您的程式碼。

```kotlin
class MyClickAction : suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () -> Unit) {}
```

您可以在以前僅允許 Lambda 和暫停函式參考的地方使用此類別的執行個體：`launchOnClick(MyClickAction())`。

目前由於實作細節存在兩個限制：
* 您不能在超型別列表中混合普通函式型別和暫停函式型別。
* 您不能使用多個暫停函式超型別。

### 穩定的暫停轉換

Kotlin 1.6.0 引入了從一般函式型別到暫停函式型別的 [穩定 (Stable)](components-stability.md) 轉換。從 1.4.0 開始，該特性支援函式常值和可呼叫參考。在 1.6.0 中，它適用於任何形式的表達式。作為呼叫引數，您現在可以在預期暫停函式的地方傳遞任何合適的一般函式型別表達式。編譯器將自動執行隱式轉換。

```kotlin
fun getSuspending(suspending: suspend () -> Unit) {}

fun suspending() {}

fun test(regular: () -> Unit) {
    getSuspending { }           // 確定
    getSuspending(::suspending) // 確定
    getSuspending(regular)      // 確定
}
```

### 穩定的註解類別具現化

Kotlin 1.5.30 [引入了](whatsnew1530.md#instantiation-of-annotation-classes) 在 JVM 平台上具現化註解類別的實驗性支援。在 1.6.0 中，此特性在 Kotlin/JVM 和 Kotlin/JS 中均為預設可用。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中進一步了解註解類別的具現化。

### 針對遞迴泛型型別改進的型別推論

Kotlin 1.5.30 引入了針對遞迴泛型型別推論的改進，這允許僅根據相應型別參數的上界來推論其型別引數。該改進以前可透過編譯器選項使用。在 1.6.0 及更高版本中，它是預設啟用的。

```kotlin
// 1.5.30 之前
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
  withDatabaseName("db")
  withUsername("user")
  withPassword("password")
  withInitScript("sql/schema.sql")
}

// 在 1.5.30 中使用編譯器選項，或從 1.6.0 開始預設使用
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
  .withDatabaseName("db")
  .withUsername("user")
  .withPassword("password")
  .withInitScript("sql/schema.sql")
```

### 構建器推論的變更

構建器推論 (Builder inference) 是一種型別推論變體，在呼叫泛型構建器函式時非常有用。它可以藉助 Lambda 引數內部呼叫的型別資訊來推論呼叫的型別引數。

我們正在進行多項變更，使我們更接近完全穩定的構建器推論。從 1.6.0 開始：
* 您可以在構建器 Lambda 內部進行回傳尚未推論型別之執行個體的呼叫，而無需指定 [1.5.30 中引入的](whatsnew1530.md#eliminating-builder-inference-restrictions) `-Xunrestricted-builder-inference` 編譯器選項。
* 透過 `-Xenable-builder-inference`，您可以編寫自己的構建器，而無需套用 [`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) 註解。

    > 請注意，這些構建器的用戶端也需要指定相同的 `-Xenable-builder-inference` 編譯器選項。
    >
    {style="warning"}

* 透過 `-Xenable-builder-inference`，如果一般型別推論無法獲得足夠的型別資訊，構建器推論會自動啟用。

[了解如何編寫自訂泛型構建器](using-builders-with-builder-inference.md)。

### 支援類別型別參數上的註解

對類別型別參數註解的支援如下所示：

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

所有型別參數上的註解都會被發射到 JVM 位元組碼中，以便註解處理器能夠使用它們。

有關動機使用案例，請閱讀此 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-43714)。

進一步了解 [註解](annotations.md)。

## 更長時間支援先前的 API 版本

從 Kotlin 1.6.0 開始，我們將支援三個先前的 API 版本（而非兩個），以及當前的穩定版本。目前，我們支援 1.3、1.4、1.5 和 1.6 版本。

## Kotlin/JVM

對於 Kotlin/JVM，從 1.6.0 開始，編譯器可以產生對應於 JVM 17 位元組碼版本的類別。新語言版本還包含最佳化的委託屬性與可重複註解，這些都在我們的路線圖中：
* [針對 1.8 JVM 目標的執行時期保留可重複註解](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [最佳化在給定 KProperty 執行個體上呼叫 get/set 的委託屬性](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 針對 1.8 JVM 目標的執行時期保留可重複註解

Java 8 引入了 [可重複註解](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)，可以多次套用到單個程式碼封裝類型上。該特性要求 Java 程式碼中存在兩個宣告：標記有 [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html) 的可重複註解本身，以及用於保存其值的容器註解。

Kotlin 也有可重複註解，但僅要求在註解宣告上存在 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 即可使其可重複。在 1.6.0 之前，該特性僅支援 `SOURCE` 保留，並且與 Java 的可重複註解不相容。Kotlin 1.6.0 移除了這些限制。`@kotlin.annotation.Repeatable` 現在接受任何保留方式，並使該註解在 Kotlin 和 Java 中均可重複。現在 Kotlin 端也支援 Java 的可重複註解。

雖然您可以宣告一個容器註解，但並非必要。例如：
* 如果一個註解 `@Tag` 標記有 `@kotlin.annotation.Repeatable`，Kotlin 編譯器會自動產生一個名為 `@Tag.Container` 的容器註解類別：

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)

    // 編譯器產生 @Tag.Container 容器註解
    ```

* 若要為容器註解設定自訂名稱，請套用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元註解，並將明確宣告的容器註解類別作為引數傳遞：

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

Kotlin 反射現在透過新函式 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 支援 Kotlin 和 Java 的可重複註解。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md) 中進一步了解 Kotlin 可重複註解。

### 最佳化在給定 KProperty 執行個體上呼叫 get/set 的委託屬性

我們透過省略 `$delegate` 欄位並產生對所參考屬性的直接存取，最佳化了產生的 JVM 位元組碼。

例如，在以下程式碼中

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin 不再產生 `content$delegate` 欄位。`content` 變數的屬性存取子直接調用 `impl` 變數，跳過了委託屬性的 `getValue`/`setValue` 運算子，從而避免了對 [`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 型別的屬性參考物件的需求。

感謝我們 Google 同事提供的實作！

進一步了解 [委託屬性](delegated-properties.md)。

## Kotlin/Native

Kotlin/Native 正在接收多項改進和組件更新，其中一些處於預覽狀態：
* [新記憶體管理員的預覽](#preview-of-the-new-memory-manager)
* [支援 Xcode 13](#support-for-xcode-13)
* [在任何主機上編譯 Windows 目標](#compilation-of-windows-targets-on-any-host)
* [LLVM 與連結器更新](#llvm-and-linker-updates)
* [效能改進](#performance-improvements)
* [與 JVM 和 JS IR 後端統一的編譯器外掛程式 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [針對 klib 連結失敗的詳細錯誤訊息](#detailed-error-messages-for-klib-linkage-failures)
* [重新設計的未處理例外處理 API](#reworked-unhandled-exception-handling-api)

### 新記憶體管理員的預覽

> 新的 Kotlin/Native 記憶體管理員是 [實驗性的 (Experimental)](components-stability.md)。
> 它可能隨時被刪除或更改。需要選擇加入（詳見下文），且您應僅將其用於評估目的。
> 我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 提供反饋。
>
{style="warning"}

透過 Kotlin 1.6.0，您可以嘗試新 Kotlin/Native 記憶體管理員的開發預覽版。它使我們更接近消除 JVM 和 Native 平台之間的差異，從而在多平台專案中提供一致的開發人員體驗。

顯著的變化之一是頂層屬性的延遲載入，就像在 Kotlin/JVM 中一樣。當首次存取來自同一檔案的頂層屬性或函式時，頂層屬性會被初始化。此模式還包含全域程序間最佳化（僅對發布二進位檔案啟用），它會移除冗餘的初始化檢查。

我們最近發布了一篇關於新記憶體管理員的 [部落格文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)。閱讀它可以了解新記憶體管理員的現狀並找到一些示範專案，或者直接跳轉到 [遷移說明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md) 親自嘗試。請檢查新記憶體管理員在您的專案中如何運作，並在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享反饋。

### 支援 Xcode 13

Kotlin/Native 1.6.0 支援 Xcode 13 — Xcode 的最新版本。請隨時更新您的 Xcode 並繼續在 Apple 作業系統上開發 Kotlin 專案。

> Xcode 13 中新增的新程式庫在 Kotlin 1.6.0 中尚不可用，但我們計畫在即將發布的版本中增加對它們的支援。
>
{style="note"}

### 在任何主機上編譯 Windows 目標

從 1.6.0 開始，您不需要 Windows 主機即可編譯 Windows 目標 `mingwX64` 和 `mingwX86`。它們可以在任何支援 Kotlin/Native 的主機上編譯。

### LLVM 與連結器更新

我們重新設計了 Kotlin/Native 在底層使用的 LLVM 相依性。這帶來了各種好處，包括：
* 更新 LLVM 版本至 11.1.0。
* 減小相依性大小。例如，在 macOS 上，現在大約為 300 MB，而之前版本約為 1200 MB。
* [排除了對 `ncurses5` 程式庫的相依性](https://youtrack.jetbrains.com/issue/KT-42693)，該程式庫在現代 Linux 發行版中已不再提供。

除了 LLVM 更新外，Kotlin/Native 現在為 MingGW 目標使用 [LLD](https://lld.llvm.org/) 連結器（來自 LLVM 專案的連結器）。與之前使用的 ld.bfd 連結器相比，它提供了各種好處，並將允許我們提高產生的二進位檔案的執行時期效能，並支援 MinGW 目標的編譯器快取。請注意，LLD [需要 DLL 連結的匯入程式庫](whatsnew1530.md#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)。在 [此 Stack Overflow 討論串](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527) 中了解更多資訊。

### 效能改進

Kotlin/Native 1.6.0 提供了以下效能改進：

* 編譯時間：針對 `linuxX64` 和 `iosArm64` 目標預設啟用編譯器快取。這加快了偵錯模式下的大多數編譯速度（第一次除外）。測量結果顯示，在我們的測試專案中速度提高了約 200%。自 Kotlin 1.5.0 以來，編譯器快取已可透過 [額外的 Gradle 屬性](whatsnew15.md#performance-improvements) 用於這些目標；您現在可以將其移除。
* 執行時期：由於產生的 LLVM 程式碼中的最佳化，現在使用 `for` 迴圈遍歷陣列的速度提高了高達 12%。

### 與 JVM 和 JS IR 後端統一的編譯器外掛程式 ABI

> 在 Kotlin/Native 使用通用 IR 編譯器外掛程式 ABI 的選項是 [實驗性的 (Experimental)](components-stability.md)。
> 它可能隨時被刪除或更改。需要選擇加入（詳見下文），且您應僅將其用於評估目的。
> 我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48595) 提供反饋。
>
{style="warning"}

在之前的版本中，編譯器外掛程式的作者必須為 Kotlin/Native 提供單獨的構件，因為 ABI 存在差異。

從 1.6.0 開始，Kotlin Multiplatform Gradle 外掛程式能夠為 Kotlin/Native 使用可嵌入的編譯器 jar — 即用於 JVM 和 JS IR 後端的那個。這是朝向統一編譯器外掛程式開發體驗邁出的一步，因為您現在可以為 Native 和其他支援的平台使用相同的編譯器外掛程式構件。

這是此類支援的預覽版本，需要選擇加入。要開始為 Kotlin/Native 使用通用編譯器外掛程式構件，請將以下行新增到 `gradle.properties`：`kotlin.native.useEmbeddableCompilerJar=true`。

我們計畫將來預設在 Kotlin/Native 中使用可嵌入的編譯器 jar，因此聽到此預覽版對您的運作情況對我們至關重要。

如果您是編譯器外掛程式的作者，請嘗試此模式並檢查它是否適用於您的外掛程式。請注意，根據您的外掛程式結構，可能需要遷移步驟。請參閱 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48595) 以獲取遷移說明，並在評論中留下您的反饋。

### 針對 klib 連結失敗的詳細錯誤訊息

Kotlin/Native 編譯器現在針對 klib 連結錯誤提供詳細的錯誤訊息。這些訊息現在具有清晰的錯誤描述，還包含有關可能原因和修復方法的資訊。

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

我們統一了整個 Kotlin/Native 執行時期對未處理例外的處理，並將預設處理公開為函式 `processUnhandledException(throwable: Throwable)`，供自訂執行環境（如 `kotlinx.coroutines`）使用。此處理也套用於從 `Worker.executeAfter()` 操作中逸出的例外，但僅限於新的 [記憶體管理員](#preview-of-the-new-memory-manager)。

API 改進也影響了由 `setUnhandledExceptionHook()` 設定的掛鉤。以前，此類掛鉤在 Kotlin/Native 執行時期呼叫帶有未處理例外的掛鉤後會被重置，並且程式隨後總是會終止。現在這些掛鉤可以多次使用，如果您希望程式總是在發生未處理例外時終止，請麼不設定未處理例外掛鉤 (`setUnhandledExceptionHook()`)，要麼確保在掛鉤結束時呼叫 `terminateWithUnhandledException()`。這將幫助您將例外發送到第三方崩潰報告服務（如 Firebase Crashlytics），然後終止程式。從 `main()` 逸出的例外以及跨越互通邊界的例外將始終導致程式終止，即使掛鉤沒有呼叫 `terminateWithUnhandledException()`。

## Kotlin/JS

我們繼續致力於穩定 Kotlin/JS 編譯器的 IR 後端。Kotlin/JS 現在具有 [停用下載 Node.js 和 Yarn 的選項](#option-to-use-pre-installed-node-js-and-yarn)。

### 選項：使用預先安裝的 Node.js 與 Yarn

您現在可以在建置 Kotlin/JS 專案時停用下載 Node.js 和 Yarn，並使用主機上已安裝的執行個體。這對於在沒有網際網路連線的伺服器（如 CI 伺服器）上進行建置非常有用。

要停用下載外部組件，請將以下行新增到您的 `build.gradle(.kts)`：

* Yarn：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // 或 true 以使用預設行為
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
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // 或 true 以使用預設行為
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

在 Kotlin 1.6.0 中，我們將 `KotlinGradleSubplugin` 類別的棄用級別更改為 'ERROR'。該類別曾用於編寫編譯器外掛程式。在接下來的版本中，我們將移除該類別。請改用 `KotlinCompilerPluginSupportPlugin` 類別。

我們移除了 `kotlin.useFallbackCompilerSearch` 建置選項以及 `noReflect` 和 `includeRuntime` 編譯器選項。`useIR` 編譯器選項已被隱藏，並將在未來的版本中移除。

進一步了解 Kotlin Gradle 外掛程式中 [當前支援的編譯器選項](gradle-compiler-options.md)。

## 標準函式庫

1.6.0 版標準函式庫穩定了實驗性特性，引入了新特性，並統一了各平台的行為：

* [新的 readline 函式](#new-readline-functions)
* [穩定的 typeOf()](#stable-typeof)
* [穩定的集合構建器](#stable-collection-builders)
* [穩定的 Duration API](#stable-duration-api)
* [將 Regex 分割為序列](#splitting-regex-into-a-sequence)
* [整數的位元旋轉操作](#bit-rotation-operations-on-integers)
* [JS 中 replace() 和 replaceFirst() 的變更](#changes-for-replace-and-replacefirst-in-js)
* [現有 API 的改進](#improvements-to-the-existing-api)
* [棄用事項](#deprecations)

### 新的 readline 函式

Kotlin 1.6.0 提供了處理標準輸入的新函式：[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 和 [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html)。

> 目前，新函式僅適用於 JVM 和 Native 目標平台。
>
{style="note"}

|**較早版本**|**1.6.0 替代方案**|**用法**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| 從 stdin 讀取一行並回傳，如果已到達 EOF 則拋出 `RuntimeException`。 |
|`readLine()`|`readlnOrNull()`| 從 stdin 讀取一行並回傳，如果已到達 EOF 則回傳 `null`。 |

我們相信，消除讀取行時使用 `!!` 的需求將改善新手的體驗並簡化 Kotlin 教學。為了使讀取行操作的名稱與其對應的 `println()` 一致，我們決定將新函式的名稱縮短為 'ln'。

```kotlin
println("您的暱稱是什麼？")
val nickname = readln()
println("你好，$nickname！")
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

在您的 IDE 程式碼補全中，現有的 `readLine()` 函式的優先級將低於 `readln()` 和 `readlnOrNull()`。IDE 檢查也會建議使用新函式來代替舊有的 `readLine()`。

我們計畫在未來的版本中逐步棄用 `readLine()` 函式。

### 穩定的 typeOf()

1.6.0 版帶來了 [穩定 (Stable)](components-stability.md) 的 [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函式，完成了一個 [主要的路線圖項目](https://youtrack.jetbrains.com/issue/KT-45396)。

[自 1.3.40 以來](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/)，`typeOf()` 作為實驗性 API 在 JVM 平台上可用。現在您可以在任何 Kotlin 平台上使用它，並獲得編譯器可以推論出的任何 Kotlin 型別的 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 表示形式：

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

### 穩定的集合構建器

在 Kotlin 1.6.0 中，集合構建器函式已晉升為 [穩定 (Stable)](components-stability.md)。由集合構建器回傳的集合現在在其唯讀狀態下是可序列化的。

您現在可以使用 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)、[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 和 [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)，而無需選入 (opt-in) 註解：

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

用於表示不同時間單位中時間長度的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 類別已晉升為 [穩定 (Stable)](components-stability.md)。在 1.6.0 中，Duration API 獲得了以下變更：

* [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函式的第一個組件（將時間長度分解為天、小時、分鐘、秒和奈秒）現在具有 `Long` 型別而不是 `Int`。以前，如果值不符合 `Int` 範圍，它會被強制轉換為該範圍。使用 `Long` 型別，您可以分解時間長度範圍內的任何值，而不會截斷不符合 `Int` 的值。

* `DurationUnit` 列舉現在是獨立的，而不是 JVM 上 `java.util.concurrent.TimeUnit` 的型別別名。我們尚未發現任何具有 `typealias DurationUnit = TimeUnit` 會有用的令人信服的案例。此外，透過型別別名公開 `TimeUnit` API 可能會讓 `DurationUnit` 使用者感到困惑。

* 響應社群反饋，我們帶回了擴充屬性，如 `Int.seconds`。但我們想限制它們的適用性，因此我們將它們放入 `Duration` 類別的伴隨物件 (companion) 中。雖然 IDE 仍然可以在補全中建議擴充功能並自動插入來自伴隨物件的匯入，但在未來我們計畫將此行為限制在預期 `Duration` 型別的情況下。

  ```kotlin
  import kotlin.time.Duration.Companion.seconds
  
  fun main() {
  //sampleStart
      val duration = 10000
      println("在 $duration 秒中有 ${duration.seconds.inWholeMinutes} 分鐘")
      // 在 10000 秒中有 166 分鐘
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}
  
  我們建議將以前引入的伴隨函式（如 `Duration.seconds(Int)`) 以及已棄用的頂層擴充功能（如 `Int.seconds`）替換為 `Duration.Companion` 中的新擴充功能。

  > 這樣的替換可能會導致舊的頂層擴充功能與新的伴隨擴充功能之間產生歧義。在進行自動遷移之前，請務必使用 kotlin.time 套件的萬用字元匯入 — `import kotlin.time.*`。
  >
  {style="note"}

### 將 Regex 分割為序列

`Regex.splitToSequence(CharSequence)` 和 `CharSequence.splitToSequence(Regex)` 函式已晉升為 [穩定 (Stable)](components-stability.md)。它們圍繞給定正規表示式的相符項分割字串，但將結果作為一個 [序列 (Sequence)](sequences.md) 回傳，以便對該結果的所有操作都是延遲執行的：

```kotlin
fun main() {
//sampleStart
    val colorsText = "green, red, brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
    // 或
    // val mixedColor = colorsText.splitToSequence(regex)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 整數的位元旋轉操作

在 Kotlin 1.6.0 中，用於位元操作的 `rotateLeft()` 和 `rotateRight()` 函式變為 [穩定 (Stable)](components-stability.md)。這些函式將數值的二進位表示向左或向右旋轉指定的位元數：

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

### JS 中 replace() 和 replaceFirst() 的變更

在 Kotlin 1.6.0 之前，當替換字串包含群組參考時，[`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 和 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) Regex 函式在 Java 和 JS 中的行為不同。為了使所有目標平台的行為一致，我們更改了它們在 JS 中的實作。

替換字串中出現的 `${name}` 或 `$index` 會替換為對應於具有指定索引或名稱的捕獲群組的子序列：
* `$index` – '$' 之後的第一個數字始終被視為群組參考的一部分。隨後的數字只有在形成有效的群組參考時才會合併到 `index` 中。只有數字 '0'–'9' 被視為群組參考的潛在組件。請注意，捕獲群組的索引從 '1' 開始。索引為 '0' 的群組代表整個相符項。
* `${name}` – `name` 可以由拉丁字母 'a'–'z'、'A'–'Z' 或數字 '0'–'9' 組成。第一個字元必須是字母。

    > 替換模式中的命名群組目前僅在 JVM 上支援。
    >
    {style="note"}

* 若要在替換字串中包含後續字元作為常值，請使用反斜線字元 `\`：

    ```kotlin
    fun main() {
    //sampleStart
        println(Regex("(.+)").replace("Kotlin", """\$ $1""")) // $ Kotlin
        println(Regex("(.+)").replaceFirst("1.6.0", """\\ $1""")) // \ 1.6.0
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

    如果替換字串必須被視為常值字串，您可以使用 [`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html)。

### 現有 API 的改進

* 1.6.0 版為 `Comparable.compareTo()` 增加了中置 (infix) 擴充函式。您現在可以使用中置形式來比較兩個物件的順序：

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS 中的 `Regex.replace()` 現在也不是內嵌的 (inline)，以統一所有平台的實作。
* 字串的 `compareTo()` 和 `equals()` 函式，以及 CharSequence 的 `isBlank()` 函式現在在 JS 中的行為與在 JVM 上的行為完全相同。以前在涉及非 ASCII 字元時存在偏差。

### 棄用事項

在 Kotlin 1.6.0 中，我們開始對某些僅限 JS 的標準函式庫 API 進行棄用週期並發出警告。

#### concat()、match() 和 matches() 字串函式

* 要將字串與給定其他物件的字串表示形式串接，請使用 `plus()` 代替 `concat()`。
* 要尋找輸入中正規表示式的所有相符項，請使用 Regex 類別的 `findAll()` 代替 `String.match(regex: String)`。
* 要檢查正規表示式是否與整個輸入相符，請使用 Regex 類別的 `matches()` 代替 `String.matches(regex: String)`。

#### 接受比較函式的陣列 sort()

我們已棄用 `Array<out T>.sort()` 函式以及內嵌函式 `ByteArray.sort()`、`ShortArray.sort()`、`IntArray.sort()`、`LongArray.sort()`、`FloatArray.sort()`、`DoubleArray.sort()` 和 `CharArray.sort()`，這些函式按照比較函式傳遞的順序對陣列進行排序。請使用其他標準函式庫函式進行陣列排序。

參考 [集合排序](collection-ordering.md) 部分。

## 工具

### Kover – Kotlin 的程式碼涵蓋率工具

> Kover Gradle 外掛程式是實驗性的。我們歡迎您在 [GitHub](https://github.com/Kotlin/kotlinx-kover/issues) 提供反饋。
>
{style="warning"}

透過 Kotlin 1.6.0，我們引入了 Kover – 一款針對 [IntelliJ](https://github.com/JetBrains/intellij-coverage) 和 [JaCoCo](https://github.com/jacoco/jacoco) Kotlin 程式碼涵蓋率代理的 Gradle 外掛程式。它適用於所有語言結構，包括內嵌函式。

在 [GitHub 儲存庫](https://github.com/Kotlin/kotlinx-kover) 或此影片中進一步了解 Kover：

<video src="https://www.youtube.com/v/jNu5LY9HIbw" title="Kover – 程式碼涵蓋率外掛程式"/>

## Coroutines 1.6.0-RC

`kotlinx.coroutines` [1.6.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) 已經發布，具有多項特性和改進：

* 支援 [新的 Kotlin/Native 記憶體管理員](#preview-of-the-new-memory-manager)
* 引入分配器 _視圖 (views)_ API，允許在不建立額外執行緒的情況下限制並行性
* 從 Java 6 遷移到 Java 8 目標
* 具有全新重新設計的 API 和多平台支援的 `kotlinx-coroutines-test`
* 引入 [`CopyableThreadContextElement`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-thread-context-element/index.html)，它賦予協同程式對 [`ThreadLocal`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html) 變數的執行緒安全寫入權限

在 [變更日誌](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) 中進一步了解。

## 遷移至 Kotlin 1.6.0

IntelliJ IDEA 和 Android Studio 將在 Kotlin 外掛程式 1.6.0 可用時建議更新。

要將現有專案遷移到 Kotlin 1.6.0，請將 Kotlin 版本更改為 `1.6.0` 並重新匯入您的 Gradle 或 Maven 專案。[了解如何更新至 Kotlin 1.6.0](releases.md#update-to-a-new-kotlin-version)。

要使用 Kotlin 1.6.0 開始新專案，請更新 Kotlin 外掛程式並從 **File** | **New** | **Project** 執行專案精靈。

新的命令列編譯器可在 [GitHub 發布頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0) 下載。

Kotlin 1.6.0 是一個 [特性版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能會帶來與您為該語言早期版本編寫的程式碼不相容的變更。在 [Kotlin 1.6 相容性指南](compatibility-guide-16.md) 中可以找到此類變更的詳細列表。