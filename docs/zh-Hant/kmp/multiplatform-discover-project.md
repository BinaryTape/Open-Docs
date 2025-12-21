[//]: # (title: Kotlin Multiplatform 專案結構的基礎知識)

使用 Kotlin Multiplatform，您可以在不同平台之間共用程式碼。本文將解釋共用程式碼的限制、如何區分程式碼中共同與平台專屬的部分，以及如何指定此共用程式碼可運行的平台。

您還將學習 Kotlin Multiplatform 專案設定的核心概念，例如共同程式碼、目標、平台專屬與中間原始碼集，以及測試整合。這將有助於您未來設定多平台專案。

這裡介紹的模型相較於 Kotlin 使用的模型有所簡化。然而，這個基本模型對於大多數情況而言應該足夠。

## 共同程式碼

_共同程式碼_ 是在不同平台之間共用的 Kotlin 程式碼。

考慮這個簡單的「Hello, World」範例：

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

在平台之間共用的 Kotlin 程式碼通常位於 `commonMain` 目錄中。程式碼檔案的位置很重要，因為它會影響此程式碼編譯至的平台清單。

Kotlin 編譯器將原始碼作為輸入，並產生一組平台專屬的二進位檔作為結果。在編譯多平台專案時，它可以從相同的程式碼產生多個二進位檔。例如，編譯器可以從相同的 Kotlin 檔案產生 JVM `.class` 檔案和原生可執行檔：

![Common code](common-code-diagram.svg){width=700}

並非每段 Kotlin 程式碼都能編譯到所有平台。Kotlin 編譯器會阻止您在共同程式碼中使用平台專屬的函式或類別，因為此程式碼無法編譯到不同的平台。

舉例來說，您不能從共同程式碼中使用 `java.io.File` 依賴項。它是 JDK 的一部分，而共同程式碼也會編譯成原生程式碼，在原生程式碼中，JDK 類別不可用：

![Unresolved Java reference](unresolved-java-reference.png){width=500}

在共同程式碼中，您可以使用 Kotlin Multiplatform 函式庫。這些函式庫提供了可以在不同平台上以不同方式實作的共同 API。在這種情況下，平台專屬的 API 作為額外部分，嘗試在共同程式碼中使用此類 API 會導致錯誤。

例如，`kotlinx.coroutines` 是一個支援所有目標的 Kotlin Multiplatform 函式庫，但它也有一個平台專屬的部分，可將 `kotlinx.coroutines` 的並行原語轉換為 JDK 的並行原語，例如 `fun CoroutinesDispatcher.asExecutor(): Executor`。API 的這個額外部分在 `commonMain` 中不可用。

## 目標

目標定義了 Kotlin 編譯共同程式碼的平台。例如，這些可以是 JVM、JS、Android、iOS 或 Linux。前面的範例將共同程式碼編譯到 JVM 和原生目標。

一個 _Kotlin 目標_ 是一個描述編譯目標的識別碼。它定義了所產生二進位檔的格式、可用的語言結構以及允許的依賴項。

> 目標也可以稱為平台。請參閱支援的目標的完整[清單](multiplatform-dsl-reference.md#targets)。
>
> {style="note"}

您應該首先_宣告_一個目標，以指示 Kotlin 為該特定目標編譯程式碼。在 Gradle 中，您可以在 `kotlin {}` 區塊內使用預定義的 DSL 呼叫來宣告目標：

```kotlin
kotlin {
    jvm() // 宣告一個 JVM 目標
    iosArm64() // 宣告一個對應於 64 位元 iPhone 的目標
}
```

這樣，每個多平台專案都定義了一組支援的目標。請參閱[階層式專案結構](multiplatform-hierarchy.md)部分，以了解更多關於在您的建構腳本中宣告目標的資訊。

宣告 `jvm` 和 `iosArm64` 目標後，`commonMain` 中的共同程式碼將會編譯到這些目標：

![Targets](target-diagram.svg){width=700}

要了解哪些程式碼將編譯到特定目標，您可以將目標視為附加到 Kotlin 原始碼檔案的標籤。Kotlin 使用這些標籤來決定如何編譯您的程式碼、產生哪些二進位檔，以及該程式碼中允許哪些語言結構和依賴項。

如果您也想將 `greeting.kt` 檔案編譯到 `.js`，您只需要宣告 JS 目標。然後，`commonMain` 中的程式碼會收到一個額外的 `js` 標籤，對應於 JS 目標，它會指示 Kotlin 產生 `.js` 檔案：

![Target labels](target-labels-diagram.svg){width=700}

這就是 Kotlin 編譯器如何處理編譯到所有已宣告目標的共同程式碼。請參閱[原始碼集](#source-sets)以了解如何編寫平台專屬程式碼。

## 原始碼集

一個 _Kotlin 原始碼集_ 是一組原始碼檔案，擁有自己的目標、依賴項和編譯器選項。它是多平台專案中共用程式碼的主要方式。

每個多平台專案中的原始碼集：

*   具有在給定專案中唯一的名稱。
*   包含一組原始碼檔案和資源，通常儲存在與原始碼集同名的目錄中。
*   指定此原始碼集中的程式碼編譯至的一組目標。這些目標會影響此原始碼集中可用的語言結構和依賴項。
*   定義其自身的依賴項和編譯器選項。

Kotlin 提供了一系列預定義的原始碼集。其中之一是 `commonMain`，它存在於所有多平台專案中，並編譯到所有已宣告的目標。

在 Kotlin Multiplatform 專案中，您將原始碼集作為 `src` 內的目錄進行互動。例如，一個包含 `commonMain`、`iosMain` 和 `jvmMain` 原始碼集的專案具有以下結構：

![Shared sources](src-directory-diagram.png){width=350}

在 Gradle 腳本中，您可以在 `kotlin.sourceSets {}` 區塊內按名稱存取原始碼集：

```kotlin
kotlin {
    // 目標宣告：
    // …

    // 原始碼集宣告：
    sourceSets {
        commonMain {
            // 配置 commonMain 原始碼集
        }
    }
}
```

除了 `commonMain` 之外，其他原始碼集可以是平台專屬的或中間的。

### 平台專屬原始碼集

雖然只擁有共同程式碼很方便，但這並非總是可行。`commonMain` 中的程式碼會編譯到所有已宣告的目標，而 Kotlin 不允許您在那裡使用任何平台專屬的 API。

在一個包含原生和 JS 目標的多平台專案中，`commonMain` 中的以下程式碼無法編譯：

```kotlin
// commonMain/kotlin/common.kt
// 無法在共同程式碼中編譯
fun greeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

作為解決方案，Kotlin 創建了平台專屬原始碼集，也稱為平台原始碼集。每個目標都有一個對應的平台原始碼集，該原始碼集僅為該目標進行編譯。例如，一個 `jvm` 目標有一個對應的 `jvmMain` 原始碼集，該原始碼集僅編譯到 JVM。Kotlin 允許在這些原始碼集中使用平台專屬的依賴項，例如在 `jvmMain` 中使用 JDK：

```kotlin
// jvmMain/kotlin/jvm.kt
// 您可以在 `jvmMain` 原始碼集中使用 Java 依賴項
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### 編譯至特定目標

編譯至特定目標是透過多個原始碼集完成的。當 Kotlin 將多平台專案編譯至特定目標時，它會收集所有標記有該目標的原始碼集，並從中產生二進位檔。

考慮一個包含 `jvm`、`iosArm64` 和 `js` 目標的範例。Kotlin 為共同程式碼創建 `commonMain` 原始碼集，並為特定目標創建相應的 `jvmMain`、`iosArm64Main` 和 `jsMain` 原始碼集：

![Compilation to a specific target](specific-target-diagram.svg){width=700}

在編譯到 JVM 期間，Kotlin 會選擇所有標記為「JVM」的原始碼集，即 `jvmMain` 和 `commonMain`。然後，它會將它們一起編譯為 JVM 類別檔案：

![Compilation to JVM](compilation-jvm-diagram.svg){width=700}

由於 Kotlin 會將 `commonMain` 和 `jvmMain` 一起編譯，因此產生的二進位檔會包含來自 `commonMain` 和 `jvmMain` 的宣告。

在使用多平台專案時，請記住：

*   如果您希望 Kotlin 將您的程式碼編譯到特定平台，請宣告一個相應的目標。
*   要選擇儲存程式碼的目錄或原始碼檔案，首先決定您希望在哪些目標之間共用程式碼：
    *   如果程式碼在所有目標之間共用，則應在 `commonMain` 中宣告。
    *   如果程式碼僅用於一個目標，則應在該目標的平台專屬原始碼集（例如，JVM 的 `jvmMain`）中定義。
*   在平台專屬原始碼集中編寫的程式碼可以存取共同原始碼集中的宣告。例如，`jvmMain` 中的程式碼可以使用 `commonMain` 中的程式碼。然而，反之則不然：`commonMain` 無法使用 `jvmMain` 中的程式碼。
*   在平台專屬原始碼集中編寫的程式碼可以使用相應的平台依賴項。例如，`jvmMain` 中的程式碼可以使用僅限 Java 的函式庫，例如 [Guava](https://github.com/google/guava) 或 [Spring](https://spring.io/)。

### 中間原始碼集

簡單的多平台專案通常只包含共同程式碼和平台專屬程式碼。`commonMain` 原始碼集代表在所有已宣告目標之間共用的共同程式碼。平台專屬原始碼集，例如 `jvmMain`，代表僅編譯到相應目標的平台專屬程式碼。

實際上，您通常需要更細粒度的程式碼共用。

考慮一個您需要針對所有現代 Apple 裝置和 Android 裝置的範例：

```kotlin
kotlin {
    android()
    iosArm64()   // 64 位元 iPhone 裝置
    macosArm64() // 現代 Apple Silicon 架構的 Mac
    watchosX64() // 現代 64 位元 Apple Watch 裝置
    tvosArm64()  // 現代 Apple TV 裝置  
}
```

而且您需要一個原始碼集來新增一個為所有 Apple 裝置生成 UUID 的函式：

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // 您想要存取 Apple 專屬的 API
    return NSUUID().UUIDString()
}
```

您不能將此函式新增到 `commonMain` 中。`commonMain` 會編譯到所有已宣告的目標，包括 Android，但 `platform.Foundation.NSUUID` 是 Apple 專屬的 API，在 Android 上不可用。如果您嘗試在 `commonMain` 中引用 `NSUUID`，Kotlin 會顯示錯誤。

您可以將這段程式碼複製並貼上到每個 Apple 專屬的原始碼集：`iosArm64Main`、`macosArm64Main`、`watchosX64Main` 和 `tvosArm64Main`。但這種方法不推薦，因為像這樣重複程式碼容易出錯。

為了解決這個問題，您可以使用 _中間原始碼集_。中間原始碼集是一個 Kotlin 原始碼集，它會編譯到專案中的部分目標，但不是所有目標。您也可以看到中間原始碼集被稱為階層式原始碼集或簡稱為階層。

Kotlin 預設會建立一些中間原始碼集。在這個特定案例中，產生的專案結構將會是這樣：

![Intermediate source sets](intermediate-source-sets-diagram.svg){width=700}

在這裡，底部色彩繽紛的區塊是平台專屬原始碼集。為了清晰起見，目標標籤已省略。

`appleMain` 區塊是 Kotlin 為共用編譯到 Apple 專屬目標的程式碼而建立的中間原始碼集。`appleMain` 原始碼集只編譯到 Apple 目標。因此，Kotlin 允許在 `appleMain` 中使用 Apple 專屬的 API，您可以在此處新增 `randomUUID()` 函式。

> 請參閱[階層式專案結構](multiplatform-hierarchy.md)，以了解 Kotlin 預設建立和設定的所有中間原始碼集，並了解如果 Kotlin 預設沒有提供您需要的中間原始碼集時該怎麼辦。
>
{style="tip"}

在編譯到特定目標期間，Kotlin 會取得所有標記有該目標的原始碼集，包括中間原始碼集。因此，在編譯到 `iosArm64` 平台目標時，寫在 `commonMain`、`appleMain` 和 `iosArm64Main` 原始碼集中的所有程式碼都會被合併：

![Native executables](multiplatform-executables-diagram.svg){width=700}

> 即使某些原始碼集沒有原始碼也沒關係。例如，在 iOS 開發中，通常不需要提供專用於 iOS 裝置但非 iOS 模擬器的程式碼。因此，`iosArm64Main` 很少被使用。
>
{style="tip"}

#### Apple 裝置與模擬器目標 {initial-collapse-state="collapsed" collapsible="true"}

當您使用 Kotlin Multiplatform 開發 iOS 行動應用程式時，您通常會使用 `iosMain` 原始碼集。雖然您可能會認為它是 `ios` 目標的平台專屬原始碼集，但並沒有單一的 `ios` 目標。大多數行動專案至少需要兩個目標：

*   **裝置目標** 用於產生可在 iOS 裝置上執行的二進位檔。目前 iOS 只有一個裝置目標：`iosArm64`。
*   **模擬器目標** 用於為在您的機器上啟動的 iOS 模擬器產生二進位檔。如果您有 Apple Silicon Mac 電腦，請選擇 `iosSimulatorArm64` 作為模擬器目標。如果您有 Intel 架構的 Mac 電腦，請使用 `iosX64`。

如果您只宣告 `iosArm64` 裝置目標，您將無法在本地機器上執行和偵錯您的應用程式和測試。

平台專屬原始碼集，例如 `iosArm64Main`、`iosSimulatorArm64Main` 和 `iosX64Main` 通常是空的，因為 iOS 裝置和模擬器的 Kotlin 程式碼通常是相同的。您可以使用唯一的 `iosMain` 中間原始碼集來在所有這些平台之間共用程式碼。

這同樣適用於其他非 Mac 的 Apple 目標。例如，如果您有適用於 Apple TV 的 `tvosArm64` 裝置目標，以及分別適用於 Apple Silicon 和 Intel 架構裝置上 Apple TV 模擬器的 `tvosSimulatorArm64` 和 `tvosX64` 模擬器目標，您可以使用 `tvosMain` 中間原始碼集來涵蓋所有這些目標。

## 與測試的整合

實際專案除了主要的產品程式碼外，也需要測試。這就是為什麼所有預設建立的原始碼集都帶有 `Main` 和 `Test` 後綴。`Main` 包含產品程式碼，而 `Test` 則包含此程式碼的測試。它們之間的連接會自動建立，測試可以無需額外配置即可使用 `Main` 程式碼提供的 API。

`Test` 對應項也是類似 `Main` 的原始碼集。例如，`commonTest` 是 `commonMain` 的對應項，並編譯到所有已宣告的目標，讓您可以編寫共同測試。平台專屬的測試原始碼集，例如 `jvmTest`，用於編寫平台專屬測試，例如 JVM 專屬測試或需要 JVM API 的測試。

除了擁有一個原始碼集來編寫您的共同測試外，您還需要一個多平台測試框架。Kotlin 提供了一個預設的 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 函式庫，它帶有 `@kotlin.Test` 註解以及各種斷言方法，例如 `assertEquals` 和 `assertTrue`。

您可以像為每個平台編寫常規測試一樣，在各自的原始碼集中編寫平台專屬測試。與主要程式碼一樣，您可以為每個原始碼集設定平台專屬的依賴項，例如 JVM 的 `JUnit` 和 iOS 的 `XCTest`。要為特定目標運行測試，請使用 `<targetName>Test` 任務。

在[測試您的多平台應用程式教程](multiplatform-run-tests.md)中了解如何建立和運行多平台測試。

## 接下來是什麼？

*   [了解更多關於在 Gradle 腳本中宣告和使用預定義原始碼集](multiplatform-hierarchy.md)
*   [探索多平台專案結構的進階概念](multiplatform-advanced-project-structure.md)
*   [了解更多關於目標編譯和建立自訂編譯的資訊](multiplatform-configure-compilations.md)