---
title: "Kotlin 1.6.0 的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[已發布：2021 年 11 月 16 日](releases#release-details)_

Kotlin 1.6.0 引入了新的語言特性、最佳化和對現有功能的改進，以及對 Kotlin 標準函式庫的大量改進。

您也可以在[發布部落格文章](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)中找到變更的概述。

## 語言 （Language）

Kotlin 1.6.0 將先前 1.5.30 版本中引入用於預覽的多項語言特性穩定化：
* [用於 enum、sealed 和 Boolean 主體的 Stable exhaustive when 語句](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [Stable suspending 函式作為父類型](#stable-suspending-functions-as-supertypes)
* [Stable suspend 轉換](#stable-suspend-conversions)
* [Stable annotation 類別的實例化](#stable-instantiation-of-annotation-classes)

它還包括各種型別推論的改進以及對類別型別參數的註解支援：
* [改進了遞迴泛型型別的型別推論](#improved-type-inference-for-recursive-generic-types)
* [Builder 推論的變更](#changes-to-builder-inference)
* [支援類別型別參數的註解](#support-for-annotations-on-class-type-parameters)

### 用於 enum、sealed 和 Boolean 主體的 Stable exhaustive when 語句

_exhaustive_ 的 [`when`](control-flow#when-expressions-and-statements) 語句包含其主體的所有可能型別或值的分支，或者包含某些型別加上 `else` 分支。它涵蓋所有可能的情況，使您的程式碼更安全。

我們很快將禁止 non-exhaustive `when` 語句，以使行為與 `when` 運算式保持一致。為了確保平穩遷移，Kotlin 1.6.0 會報告關於具有 enum、sealed 或 Boolean 主體的 non-exhaustive `when` 語句的警告。這些警告將在未來的版本中變成錯誤。

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // Error: 'when' expression must be exhaustive
        is Contact.PhoneCall `->` 42
    }

fun sendMessage(contact: Contact, message: String) {
    // Starting with 1.6.0

    // Warning: Non exhaustive 'when' statements on Boolean will be
    // prohibited in 1.7, add 'false' branch or 'else' branch instead 
    when(message.isEmpty()) {
        true `->` return
    }
    // Warning: Non exhaustive 'when' statements on sealed class/interface will be
    // prohibited in 1.7, add 'is TextMessage' branch or 'else' branch instead
    when(contact) {
        is Contact.PhoneCall `->` TODO()
    }
}
```

有關變更及其影響的更詳細說明，請參閱[此 YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-47709)。

### Stable suspending 函式作為父類型

Suspending 函式類型 （suspending functional types）的實現已在 Kotlin 1.6.0 中[Stable](components-stability)。[在 1.5.30 中](whatsnew1530#suspending-functions-as-supertypes)提供了預覽。

當設計使用 Kotlin 協程並接受 suspending 函式類型的 API 時，此功能會很有用。您現在可以透過將所需的行為封閉在實現 suspending 函式類型的單獨類別中來簡化您的程式碼。

```kotlin
class MyClickAction : suspend () `->` Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () `->` Unit) {}
```

您可以使用此類別的實例，而之前僅允許使用 Lambda 和 suspending 函式引用：`launchOnClick(MyClickAction())`。

目前有兩個來自實現細節的限制：
* 您無法在父類型列表中混合普通函式類型和 suspending 函式類型。
* 您不能使用多個 suspending 函式父類型。

### Stable suspend 轉換

Kotlin 1.6.0 引入了從常規函式類型到 suspending 函式類型的 [Stable](components-stability) 轉換。從 1.4.0 開始，此功能支援函式文字和可調用引用。使用 1.6.0，它適用於任何形式的運算式。作為呼叫引數，您現在可以傳遞任何適用常規函式類型的運算式，而預期為 suspending 類型。編譯器將自動執行隱式轉換。

```kotlin
fun getSuspending(suspending: suspend () `->` Unit) {}

fun suspending() {}

fun test(regular: () `->` Unit) {
    getSuspending { }           // OK
    getSuspending(::suspending) // OK
    getSuspending(regular)      // OK
}
```

### Stable annotation 類別的實例化

Kotlin 1.5.30 [引入](whatsnew1530#instantiation-of-annotation-classes)了在 JVM 平台上實例化 annotation 類別的實驗性支援。使用 1.6.0，預設情況下，此功能可用於 Kotlin/JVM 和 Kotlin/JS。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation)中了解有關實例化 annotation 類別的更多資訊。

### 改進了遞迴泛型型別的型別推論

Kotlin 1.5.30 引入了對遞迴泛型型別的型別推論的改進，這允許僅根據相應型別參數的上限來推斷其型別引數。此改進可透過編譯器選項獲得。在 1.6.0 及更高版本中，預設情況下會啟用它。

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

### Builder 推論的變更

Builder 推論是一種型別推論形式，在呼叫泛型 builder 函式時很有用。它可以借助於 Lambda 引數內部呼叫的型別資訊來推斷呼叫的型別引數。

我們正在進行多項變更，使我們更接近完全 Stable 的 builder 推論。從 1.6.0 開始：
* 您可以在 builder Lambda 內部進行傳回尚未推斷類型實例的呼叫，而無需指定 [在 1.5.30 中引入](whatsnew1530#eliminating-builder-inference-restrictions)的 `-Xunrestricted-builder-inference` 編譯器選項。
* 使用 `-Xenable-builder-inference`，您可以編寫自己的 builder，而無需應用 [`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) 註解。

    > 請注意，這些 builder 的客戶端需要指定相同的 `-Xenable-builder-inference` 編譯器選項。
    >
    

* 使用 `-Xenable-builder-inference`，如果常規型別推論無法獲得足夠的型別資訊，則會自動啟動 builder 推論。

[了解如何編寫自訂泛型 builder](using-builders-with-builder-inference)。

### 支援類別型別參數的註解

對類別型別參數的註解支援如下所示：

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

所有型別參數的註解都會發送到 JVM 位元組碼中，以便 annotation 處理器可以使用它們。

對於激勵用例，請閱讀[此 YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-43714)。

了解有關[註解](annotations)的更多資訊。

## 更長時間地支援先前的 API 版本

從 Kotlin 1.6.0 開始，我們將支援針對三個先前的 API 版本進行開發，而不是兩個，以及當前的 Stable 版本。目前，我們支援 1.3、1.4、1.5 和 1.6 版本。

## Kotlin/JVM

對於 Kotlin/JVM，從 1.6.0 開始，編譯器可以生成具有對應於 JVM 17 的位元組碼版本的類別。新的語言版本還包括最佳化的委託屬性和可重複註解，我們已將其納入路線圖：
* [適用於 1.8 JVM 目標的具有 Runtime 保留的可重複註解](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [最佳化在給定的 KProperty 實例上呼叫 get/set 的委託屬性](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 適用於 1.8 JVM 目標的具有 Runtime 保留的可重複註解

Java 8 引入了[可重複註解](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)，可以將其多次應用於單個程式碼元素。此功能要求 Java 程式碼中存在兩個宣告：可重複註解本身標記有 [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html) 以及包含註解以保存其值。

Kotlin 也有可重複註解，但只需要 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 出現在 annotation 宣告中，使其可重複。在 1.6.0 之前，此功能僅支援 `SOURCE` 保留，並且與 Java 的可重複註解不相容。Kotlin 1.6.0 移除了這些限制。`@kotlin.annotation.Repeatable` 現在接受任何保留，並使註解在 Kotlin 和 Java 中都可重複。Kotlin 端現在也支援 Java 的可重複註解。

雖然您可以宣告包含註解，但這不是必需的。例如：
* 如果 annotation `@Tag` 標記有 `@kotlin.annotation.Repeatable`，則 Kotlin 編譯器會自動生成一個包含 annotation 類別，其名稱為 `@Tag.Container`：

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)

    // The compiler generates @Tag.Container containing annotation
    ```

* 若要為包含 annotation 設定自訂名稱，請應用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) meta-annotation 並將顯式宣告的包含 annotation 類別作為引數傳遞：

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

Kotlin 反射現在透過新函式 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 支援 Kotlin 和 Java 的可重複註解。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations)中了解有關 Kotlin 可重複註解的更多資訊。

### 最佳化在給定的 KProperty 實例上呼叫 get/set 的委託屬性

我們透過省略 `$delegate` 欄位並生成對引用屬性的立即存取來最佳化生成的 JVM 位元組碼。

例如，在下列程式碼中

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin 不再生成欄位 `content$delegate`。`content` 變數的屬性存取子直接調用 `impl` 變數，跳過委託屬性的 `getValue`/`setValue` 運算子，從而避免需要 [`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 類型的屬性引用物件。

感謝我們的 Google 同事提供的實現！

了解有關[委託屬性](delegated-properties)的更多資訊。

## Kotlin/Native

Kotlin/Native 正在接收多項改進和元件更新，其中一些處於預覽狀態：
* [新記憶體管理器的預覽](#preview-of-the-new-memory-manager)
* [支援 Xcode 13](#support-for-xcode-13)
* [在任何主機上編譯 Windows 目標](#compilation-of-windows-targets-on-any-host)
* [LLVM 和連結器更新](#llvm-and-linker-updates)
* [效能改進](#performance-improvements)
* [與 JVM 和 JS IR 後端統一的編譯器外掛程式 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [Klib 連結失敗的詳細錯誤訊息](#detailed-error-messages-for-klib-linkage-failures)
* [重新設計的未處理異常處理 API](#reworked-unhandled-exception-handling-api)

### 新記憶體管理器的預覽

:::note
新的 Kotlin/Native 記憶體管理器是 [Experimental](components-stability)。
它可能會隨時被移除或變更。需要選擇加入（請參閱下面的詳細資訊），並且您應該僅將其用於評估目的。
我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 上提供有關它的意見反應。

使用 Kotlin 1.6.0，您可以試用新的 Kotlin/Native 記憶體管理器的開發預覽。它使我們更接近消除 JVM 和 Native 平台之間的差異，以便在多平台專案中提供一致的開發人員體驗。

其中一個值得注意的變更是最上層屬性的延遲初始化，就像在 Kotlin/JVM 中一樣。當首次存取來自相同檔案的最上層屬性或函式時，會初始化最上層屬性。此模式還包括全域跨程序最佳化（僅針對發布二進位檔案啟用），這會移除多餘的初始化檢查。

我們最近發布了一篇關於新記憶體管理器的[部落格文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)。閱讀它以了解新記憶體管理器的目前狀態並尋找一些示範專案，或者直接跳到[遷移指示](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM)以自行嘗試。請檢查新記憶體管理器在您的專案中的運作方式，並在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享意見反應。

### 支援 Xcode 13

Kotlin/Native 1.6.0 支援 Xcode 13 – 最新版本的 Xcode。您可以隨意更新您的 Xcode 並繼續處理您的適用於 Apple 作業系統的 Kotlin 專案。

Xcode 13 中新增的程式庫無法在 Kotlin 1.6.0 中使用，但我們將在即將推出的版本中新增對它們的支援。

:::

### 在任何主機上編譯 Windows 目標

從 1.6.0 開始，您不需要 Windows 主機來編譯 Windows 目標 `mingwX64` 和 `mingwX86`。它們可以在支援 Kotlin/Native 的任何主機上編譯。

### LLVM 和連結器更新

我們重新設計了 Kotlin/Native 在幕後使用的 LLVM 相依性。這帶來了各種好處，包括：
* 更新的 LLVM 版本為 11.1.0。
* 減小了相依性大小。例如，在 macOS 上，它現在約為 300 MB，而不是先前版本中的 1200 MB。
* [排除了對現代 Linux 發行版中不可用的 `ncurses5` 程式庫的相依性](https://youtrack.jetbrains.com/issue/KT-42693)。

除了 LLVM 更新之外，Kotlin/Native 現在還使用 [LLD](https://lld.llvm.org/) 連結器（來自 LLVM 專案的連結器）作為 MingGW 目標。與先前使用的 ld.bfd 連結器相比，它提供了各種好處，並且使我們能夠提高生成二進位檔案的 Runtime 效能並支援 MinGW 目標的編譯器快取。請注意，LLD [需要 DLL 連結的匯入程式庫](whatsnew1530#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)。在[此 Stack Overflow 線程](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527)中了解更多資訊。

### 效能改進

Kotlin/Native 1.6.0 提供了下列效能改進：

* 編譯時間：預設情況下，為 `linuxX64` 和 `iosArm64` 目標啟用編譯器快取。這加快了除第一個之外的大多數偵錯模式編譯。測量顯示我們的測試專案的速度提高了約 200%。自 Kotlin 1.5.0 以來，編譯器快取已可用於這些目標，並具有[其他 Gradle 屬性](whatsnew15#performance-improvements)；您現在可以移除它們。
* Runtime：由於生成的 LLVM 程式碼中的最佳化，使用 `for` 迴圈迭代陣列現在速度提高了 12%。

### 與 JVM 和 JS IR 後端統一的編譯器外掛程式 ABI

:::note
使用 Kotlin/Native 的通用 IR 編譯器外掛程式 ABI 的選項是 [Experimental](components-stability)。
它可能會隨時被移除或變更。需要選擇加入（請參閱下面的詳細資訊），並且您應該僅將其用於評估目的。
我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48595) 上提供有關它的意見反應。

在先前的版本中，由於 ABI 的差異，編譯器外掛程式的作者必須為 Kotlin/Native 提供單獨的成品。

從 1.6.0 開始，Kotlin Multiplatform Gradle 外掛程式能夠將可嵌入編譯器 jar – 用於 JVM 和 JS IR 後端的 jar – 用於 Kotlin/Native。這是邁向統一編譯器外掛程式開發體驗的一步，因為您現在可以將相同的編譯器外掛程式成品用於 Native 和其他支援的平台。

這是此類支援的預覽版本，需要選擇加入。若要開始將通用編譯器外掛程式成品用於 Kotlin/Native，請將下列行新增至 `gradle.properties`：`kotlin.native.useEmbeddableCompilerJar=true`。

我們計劃在未來預設情況下將可嵌入編譯器 jar 用於 Kotlin/Native，因此對於我們來說，了解預覽如何為您運作至關重要。

如果您是編譯器外掛程式的作者，請試用此模式並檢查它是否適用於您的外掛程式。請注意，根據您的外掛程式的結構，可能需要遷移步驟。請參閱[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48595)以獲取遷移指示，並在註解中留下您的意見反應。

### Klib 連結失敗的詳細錯誤訊息

Kotlin/Native 編譯器現在為 klib 連結錯誤提供詳細的錯誤訊息。這些訊息現在具有清晰的錯誤描述，並且還包括有關可能原因和修正方法的資訊。

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

### 重新設計的未處理異常處理 API

我們統一了整個 Kotlin/Native Runtime 中未處理異常的處理，並將預設處理公開為函式 `processUnhandledException(throwable: Throwable)`，供自訂執行環境（例如 `kotlinx.coroutines`）使用。此處理也適用於在 `Worker.executeAfter()` 中跳脫作業的異常，但僅適用於新的[記憶體管理器](#preview-of-the-new-memory-manager)。

API 改進也影響了由 `setUnhandledExceptionHook()` 設定的掛鉤。先前，在 Kotlin/Native Runtime 使用未處理異常呼叫掛鉤後，會重設此類掛鉤，並且程式會在之後立即終止。現在，這些掛鉤可以使用多次，並且如果您希望程式始終在未處理異常時終止，則不要設定未處理異常掛鉤 (`setUnhandledExceptionHook()`)，或確保在掛鉤結束時呼叫 `terminateWithUnhandledException()`。這將幫助您將異常傳送到第三方崩潰報告服務（例如 Firebase Crashlytics），然後終止程式。跳脫 `main()` 的異常和跨越互通邊界的異常將始終終止程式，即使掛鉤未呼叫 `terminateWithUnhandledException()`。

## Kotlin/JS

我們正在繼續努力穩定 Kotlin/JS 編譯器的 IR 後端。Kotlin/JS 現在有一個[選項可以停用 Node.js 和 Yarn 的下載](#option-to-use-pre-installed-node-js-and-yarn)。

### 選項可以使用預先安裝的 Node.js 和 Yarn

您現在可以在建置 Kotlin/JS 專案時停用下載 Node.js 和 Yarn，並使用已安裝在主機上的實例。這適用於在沒有網際網路連線的伺服器（例如 CI 伺服器）上建置。

若要停用下載外部元件，請將下列行新增至您的 `build.gradle(.kts)`：

* Yarn：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // or true for default behavior
    }
    ```
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
    }
    ```
    
    </TabItem>
    </Tabs>

* Node.js：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // or true for default behavior
    }
     
    ```
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension).download = false
    }
    ```
    
    </TabItem>
    </Tabs>

## Kotlin Gradle 外掛程式 （Kotlin Gradle plugin）

在 Kotlin 1.6.0 中，我們將 `KotlinGradleSubplugin` 類別的棄用等級變更為 'ERROR'。此類別用於編寫編譯器外掛程式。在後續版本中，我們將移除此類別。請改用類別 `KotlinCompilerPluginSupportPlugin`。

我們移除了 `kotlin.useFallbackCompilerSearch` 建置選項以及 `noReflect` 和 `includeRuntime` 編譯器選項。`useIR` 編譯器選項已隱藏，並將在即將推出的版本中移除。

在 Kotlin Gradle 外掛程式中了解有關[目前支援的編譯器選項](gradle-compiler-options)的更多資訊。

## 標準函式庫 （Standard library）

新的 1.6.0 版標準函式庫穩定了實驗性功能、引入了新功能，並統一了其在平台之間的行為：

* [新的 readline 函式](#new-readline-functions)
* [Stable typeOf()](#stable-typeof)
* [Stable collection builder](#stable-collection-builders)
* [Stable Duration API](#stable-duration-api)
* [將 Regex 分割為序列](#splitting-regex-into-a-sequence)
* [整數的位元旋轉運算](#bit-rotation-operations-on-integers)
* [JS 中 replace() 和 replaceFirst() 的變更](#changes-for-replace-and-replacefirst-in-js)
* [對現有 API 的改進](#improvements-to-the-existing-api)
* [棄用](#deprecations)

### 新的 readline 函式

Kotlin 1.6.0 提供了用於處理標準輸入的新函式：[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 和 [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html)。

目前，新函式僅適用於 JVM 和 Native 目標平台。

:::

|**先前版本**|**1.6.0 替代方案**|**用法**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| 從 stdin 讀取一行並傳回，如果已到達 EOF，則會擲回 `RuntimeException`。 |
|`readLine()`|`readlnOrNull()`| 從 stdin 讀取一行並傳回，如果已到達 EOF，則傳回 `null`。 |

我們認為，消除在讀取行時使用 `!!` 的需求將改善新手的體驗並簡化 Kotlin 教學。為了使 read-line 運算名稱與其 `println()` 對應項保持一致，我們已決定將新函式的名稱縮短為 'ln'。

```kotlin
println("What is your nickname?")
val nickname = readln()
println("Hello, $nickname!")
```

```kotlin
fun main() {

    var sum = 0
    while (true) {
        val nextLine = readlnOrNull().takeUnless { 
            it.isNullOrEmpty() 
        } ?: break
        sum += nextLine.toInt()
    }
    println(sum)

}
```

現有的 `readLine()` 函式在您的 IDE 程式碼完成中的優先順序將低於 `readln()` 和 `readlnOrNull()`。IDE 檢查也會建議使用新函式來取代舊版 `readLine()`。

我們計劃在未來的版本中逐漸棄用 `readLine()` 函式。

### Stable typeOf()

版本 1.6.0 帶來了 [Stable](components-stability) [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函式，從而關閉了[主要路線圖項目](https://youtrack.jetbrains.com/issue/KT-45396)之一。

[自 1.3.40 以来](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/)，`typeOf()` 在 JVM 平台上以實驗性 API 提供。現在，您可以在任何 Kotlin 平台上使用它，並取得編譯器可以推斷的任何 Kotlin 類型的 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 表示：

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

### Stable collection builder

在 Kotlin 1.6.0 中，collection builder 函式已升級為 [Stable](components-stability)。由 collection builder 傳回的集合現在在其唯讀狀態下可序列化。

您現在可以使用 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)、
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 和 [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)
而無需選擇加入註解：

```kotlin
fun main() {

    val x = listOf('b', 'c')
    val y = buildList {
        add('a')
        addAll(x)
        add('d')
    }
    println(y)  // [a, b, c, d]

}
```

### Stable Duration API

用於以不同時間單位表示持續時間的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 類別已升級為 [Stable](components-stability)。在 1.6.0 中，Duration API 已收到下列變更：

* 將持續時間分解為天、小時、分鐘、秒和奈秒的 [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函式的第一個元件現在具有 `Long` 類型，而不是 `Int`。
  之前，如果值不適合 `Int` 範圍，則會強制轉換為該範圍。使用 `Long` 類型，您可以分解持續時間範圍中的任何值，而無需截斷不適合 `Int` 的值。

* `DurationUnit` 枚舉現在是獨立的，而不是 JVM 上 `java.util.concurrent.TimeUnit` 的型別別名。
  我們尚未發現任何令人信服的案例，其中具有 `typealias DurationUnit = TimeUnit` 可能有用。此外，透過型別別名公開 `TimeUnit` API 可能會混淆 `DurationUnit` 使用者。

* 為了回應社群意見反應，我們將帶回擴充功能屬性，例如 `Int.seconds`。但我們希望限制其適用性，因此我們將它們放入 `Duration` 類別的伴生物件中。
  雖然 IDE 仍然可以在完成中提出擴充功能並自動插入從伴生物件的匯入，但在未來，我們計劃將此行為限制為預期 `Duration` 類型的情況。

  ```kotlin
  import kotlin.time.Duration.Companion.seconds
  
  fun main() {

      val duration = 10000
      println("There are ${duration.seconds.inWholeMinutes} minutes in $duration seconds")
      // There are 166 minutes in 10000 seconds

  }
  ```
  
  
  我們建議將先前引入的伴生函式（例如 `Duration.seconds(Int)`）和棄用的最上層擴充功能（例如 `Int.seconds`）取代為 `Duration.Companion` 中的新擴充功能。

  > 此類取代可能會導致舊的最上層擴充功能與新的伴生擴充功能之間出現歧義。
  > 請務必在使用自動遷移之前使用 kotlin.time 套件的萬用字元匯入 – `import kotlin.time.*`。
  >
  

### 將 Regex 分割為序列

`Regex.splitToSequence(CharSequence)` 和 `CharSequence.splitToSequence(Regex)` 函式已升級為 [Stable](components-stability)。它們在給定 Regex 的比對項周圍分割字串，但將結果傳回為 [Sequence](sequences)，以便對此結果的所有運算都會延遲執行：

```kotlin
fun main() {

    val colorsText = "green, red, brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
    // or
    // val mixedColor = colorsText.splitToSequence(regex)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"

}
```

### 整數的位元旋轉運算

在 Kotlin 1.6.0 中，用於位元操作的 `rotateLeft()` 和 `rotateRight()` 函式已變為 [Stable](components-stability)。這些函式會將數字的二進位表示向左或向右旋轉指定的位元數：

```kotlin
fun main() {

    val number: Short = 0b10001
    println(number
        .rotateRight(2)
        .toString(radix = 2)) // 100000000000100
    println(number
        .rotateLeft(2)
        .toString(radix = 2))  // 1000100

}
```

### JS 中 replace() 和 replaceFirst() 的變更

在 Kotlin 1.6.0 之前，當取代字串包含群組參考時，[`replace()`](https://kotlin