[//]: # (title: Kotlin Multiplatform 專案結構基礎)

透過 Kotlin Multiplatform，您可以在不同平台之間共用程式碼。本文將解釋共用程式碼的限制、如何區分程式碼中的共用部分與平台特定部分，以及如何指定此共用程式碼適用的平台。

您還將學習 Kotlin Multiplatform 專案設定的核心概念，例如共通程式碼、目標、平台特定與中間來源集，以及測試整合。這將有助於您在未來設定您的多平台專案。

這裡提出的模型與 Kotlin 使用的模型相比是簡化的。然而，這個基本模型應該足以應付大多數情況。

## 共通程式碼

_共通程式碼_ 是在不同平台之間共用的 Kotlin 程式碼。

考慮一個簡單的「Hello, World」範例：

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

在平台之間共用的 Kotlin 程式碼通常位於 `commonMain` 目錄中。程式碼檔案的位置很重要，因為它會影響此程式碼編譯到的平台清單。

Kotlin 編譯器將原始碼作為輸入，並產生一組平台特定二進位檔案作為結果。在編譯多平台專案時，它可以從相同的程式碼產生多個二進位檔案。例如，編譯器可以從同一個 Kotlin 檔案產生 JVM `.class` 檔案和原生可執行檔：

![Common code](common-code-diagram.svg){width=700}

並非所有 Kotlin 程式碼都可以編譯到所有平台。Kotlin 編譯器會阻止您在共通程式碼中使用平台特定函式或類別，因為此程式碼無法編譯到不同的平台。

例如，您不能在共通程式碼中使用 `java.io.File` 相依性。它是 JDK 的一部分，而共通程式碼也會編譯成原生程式碼，在原生程式碼中 JDK 類別不可用：

![Unresolved Java reference](unresolved-java-reference.png){width=500}

在共通程式碼中，您可以使用 Kotlin Multiplatform 函式庫。這些函式庫提供了一個共通 API，可以在不同平台上有不同的實作。在這種情況下，平台特定 API 作為額外部分，嘗試在共通程式碼中使用此類 API 會導致錯誤。

例如，`kotlinx.coroutines` 是一個支援所有目標的 Kotlin Multiplatform 函式庫，但它也有一個平台特定部分，可將 `kotlinx.coroutines` 的並行基本型別轉換為 JDK 並行基本型別，例如 `fun CoroutinesDispatcher.asExecutor(): Executor`。此 API 的額外部分在 `commonMain` 中不可用。

## 目標

目標定義 Kotlin 將共通程式碼編譯到的平台。這些可以是例如 JVM、JS、Android、iOS 或 Linux。前面的範例將共通程式碼編譯到 JVM 和原生目標。

_Kotlin 目標_ 是一個描述編譯目標的識別符。它定義了所產生二進位檔案的格式、可用的語言結構以及允許的相依性。

> 目標也可以稱為平台。請參閱
> [支援目標的完整清單](multiplatform-dsl-reference.md#targets)。
>
> {style="note"}

您應該首先_宣告_一個目標，以指示 Kotlin 為該特定目標編譯程式碼。在 Gradle 中，您使用 `kotlin {}` 區塊內預定義的 DSL 呼叫來宣告目標：

```kotlin
kotlin {
    jvm() // 宣告一個 JVM 目標
    iosArm64() // 宣告一個對應 64 位元 iPhone 的目標
}
```

如此一來，每個多平台專案都會定義一組支援的目標。請參閱
[階層式專案結構](multiplatform-hierarchy.md) 部分，以了解如何在您的建構指令碼中宣告目標。

在宣告了 `jvm` 和 `iosArm64` 目標後，`commonMain` 中的共通程式碼將會編譯到這些目標：

![Targets](target-diagram.svg){width=700}

為了了解哪些程式碼將編譯到特定目標，您可以將目標視為附加到 Kotlin 來源檔案的標籤。Kotlin 使用這些標籤來決定如何編譯您的程式碼、產生哪些二進位檔案，以及該程式碼中允許哪些語言結構和相依性。

如果您也想將 `greeting.kt` 檔案編譯到 `.js`，您只需宣告 JS 目標。`commonMain` 中的程式碼隨後會收到一個額外的 `js` 標籤，對應於 JS 目標，它指示 Kotlin 產生 `.js` 檔案：

![Target labels](target-labels-diagram.svg){width=700}

這就是 Kotlin 編譯器如何處理編譯到所有宣告目標的共通程式碼。
請參閱[來源集](#source-sets) 以了解如何編寫平台特定程式碼。

## 來源集

_Kotlin 來源集_ 是一組來源檔案，具有自己的目標、相依性與編譯器選項。它是多平台專案中共用程式碼的主要方式。

多平台專案中的每個來源集：

*   具有在給定專案中唯一的名稱。
*   包含一組來源檔案和資源，通常儲存在與來源集名稱相同的目錄中。
*   指定一個目標集，此來源集中的程式碼將編譯到這些目標。這些目標會影響此來源集中可用的語言結構和相依性。
*   定義自己的相依性與編譯器選項。

Kotlin 提供了一系列預定義的來源集。其中之一是 `commonMain`，它存在於所有多平台專案中，並編譯到所有宣告的目標。

您在 Kotlin Multiplatform 專案中將來源集作為 `src` 內部的目錄進行互動。
例如，一個包含 `commonMain`、`iosMain` 和 `jvmMain` 來源集的專案具有以下結構：

![Shared sources](src-directory-diagram.png){width=350}

在 Gradle 指令碼中，您透過 `kotlin.sourceSets {}` 區塊內的名稱存取來源集：

```kotlin
kotlin {
    // 目標宣告：
    // …

    // 來源集宣告：
    sourceSets {
        commonMain {
            // 設定 commonMain 來源集
        }
    }
}
```

除了 `commonMain` 之外，其他來源集可以是平台特定或中間來源集。

### 平台特定來源集

雖然只擁有共通程式碼很方便，但這並非總是可行。`commonMain` 中的程式碼會編譯到所有宣告的目標，並且 Kotlin 不允許您在那裡使用任何平台特定 API。

在一個具有原生和 JS 目標的多平台專案中，`commonMain` 中的以下程式碼無法編譯：

```kotlin
// commonMain/kotlin/common.kt
// 在共通程式碼中無法編譯
fun greeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

作為解決方案，Kotlin 建立了平台特定來源集，也稱為平台來源集。每個目標都有一個對應的平台來源集，該來源集僅針對該目標進行編譯。例如，`jvm` 目標具有對應的 `jvmMain` 來源集，該來源集僅編譯到 JVM。Kotlin 允許在這些來源集中使用平台特定相依性，例如 `jvmMain` 中的 JDK：

```kotlin
// jvmMain/kotlin/jvm.kt
// 您可以在 `jvmMain` 來源集中使用 Java 相依性
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### 編譯到特定目標

編譯到特定目標需要多個來源集協同工作。當 Kotlin 將多平台專案編譯到特定目標時，它會收集所有標記有此目標的來源集，並從中產生二進位檔案。

考慮一個包含 `jvm`、`iosArm64` 和 `js` 目標的範例。Kotlin 為共通程式碼建立 `commonMain` 來源集，並為特定目標建立對應的 `jvmMain`、`iosArm64Main` 和 `jsMain` 來源集：

![Compilation to a specific target](specific-target-diagram.svg){width=700}

在編譯到 JVM 期間，Kotlin 會選取所有標記為「JVM」的來源集，即 `jvmMain` 和 `commonMain`。然後，它會將它們一起編譯成 JVM 類別檔案：

![Compilation to JVM](compilation-jvm-diagram.svg){width=700}

因為 Kotlin 將 `commonMain` 和 `jvmMain` 一起編譯，所以產生的二進位檔案包含來自 `commonMain` 和 `jvmMain` 的宣告。

使用多平台專案時，請記住：

*   如果您希望 Kotlin 將您的程式碼編譯到特定平台，請宣告一個對應的目標。
*   要選擇一個目錄或來源檔案來儲存程式碼，首先要決定您想在哪些目標之間共用程式碼：

    *   如果程式碼在所有目標之間共用，它應該在 `commonMain` 中宣告。
    *   如果程式碼僅用於一個目標，它應該在該目標的平台特定來源集中定義（例如，JVM 的 `jvmMain`）。
*   在平台特定來源集中編寫的程式碼可以存取共通來源集中的宣告。例如，`jvmMain` 中的程式碼可以使用 `commonMain` 中的程式碼。但是，反過來則不然：`commonMain` 不能使用 `jvmMain` 中的程式碼。
*   在平台特定來源集中編寫的程式碼可以使用對應的平台相依性。例如，`jvmMain` 中的程式碼可以使用僅限 Java 的函式庫，如 [Guava](https://github.com/google/guava)
    或 [Spring](https://spring.io/)。

### 中間來源集

簡單的多平台專案通常只包含共通程式碼和平台特定程式碼。
`commonMain` 來源集代表所有已宣告目標共用的共通程式碼。平台特定來源集，如 `jvmMain`，則代表僅編譯到其各自目標的平台特定程式碼。

實際上，您通常需要更細緻的程式碼共用。

考慮一個範例，您需要同時支援所有現代 Apple 裝置和 Android 裝置：

```kotlin
kotlin {
    androidTarget()
    iosArm64()   // 64 位元 iPhone 裝置
    macosArm64() // 現代 Apple 晶片 Mac
    watchosX64() // 現代 64 位元 Apple Watch 裝置
    tvosArm64()  // 現代 Apple TV 裝置  
}
```

您需要一個來源集來新增一個為所有 Apple 裝置生成 UUID 的函式：

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // 您想要存取 Apple 專屬 API
    return NSUUID().UUIDString()
}
```

您無法將此函式新增到 `commonMain`。`commonMain` 會編譯到所有宣告的目標，包括 Android，但 `platform.Foundation.NSUUID` 是 Apple 專屬 API，在 Android 上不可用。如果您嘗試在 `commonMain` 中引用 `NSUUID`，Kotlin 會顯示錯誤。

您可以將此程式碼複製貼上到每個 Apple 專屬來源集：`iosArm64Main`、`macosArm64Main`、`watchosX64Main` 和 `tvosArm64Main`。但這種方法不建議使用，因為這種程式碼重複很容易出錯。

為了解決此問題，您可以使用_中間來源集_。中間來源集是 Kotlin 來源集，它編譯到專案中的某些目標，但不是所有目標。您也可以將中間來源集稱為階層式來源集或簡稱為階層。

Kotlin 預設會建立一些中間來源集。在這個特定情況下，最終的專案結構將如下所示：

![Intermediate source sets](intermediate-source-sets-diagram.svg){width=700}

這裡，底部的多色區塊是平台特定來源集。為清晰起見，省略了目標標籤。

`appleMain` 區塊是 Kotlin 為共用編譯到 Apple 特定目標的程式碼而建立的中間來源集。`appleMain` 來源集僅編譯到 Apple 目標。因此，Kotlin 允許在 `appleMain` 中使用 Apple 特定 API，您可以在此處新增 `randomUUID()` 函式。

> 請參閱 [階層式專案結構](multiplatform-hierarchy.md) 以找到
> Kotlin 預設建立和設定的所有中間來源集，並了解如果您
> 預設沒有所需的中間來源集應該怎麼做。
>
{style="tip"}

在編譯到特定目標期間，Kotlin 會獲取所有標記有此目標的來源集，包括中間來源集。因此，在編譯到 `iosArm64` 平台目標期間，`commonMain`、`appleMain` 和 `iosArm64Main` 來源集中編寫的所有程式碼都會組合在一起：

![Native executables](multiplatform-executables-diagram.svg){width=700}

> 如果某些來源集沒有來源，這沒關係。例如，在 iOS 開發中，通常不需要提供僅針對 iOS 裝置而非 iOS 模擬器的程式碼。因此，`iosArm64Main` 很少使用。
>
{style="tip"}

#### Apple 裝置和模擬器目標 {initial-collapse-state="collapsed" collapsible="true"}

當您使用 Kotlin Multiplatform 開發 iOS 行動應用程式時，您通常會使用 `iosMain` 來源集。
儘管您可能會認為它是 `ios` 目標的平台特定來源集，但實際上並沒有單一的 `ios` 目標。大多數行動專案至少需要兩個目標：

*   **裝置目標** 用於生成可在 iOS 裝置上執行的二進位檔案。目前只有一個 iOS 裝置目標：`iosArm64`。
*   **模擬器目標** 用於生成在您的機器上啟動的 iOS 模擬器的二進位檔案。如果您有 Apple 晶片 Mac 電腦，請選擇 `iosSimulatorArm64` 作為模擬器目標。如果您有 Intel 架構 Mac 電腦，請使用 `iosX64`。

如果您只宣告 `iosArm64` 裝置目標，您將無法在您的本機上執行和偵錯應用程式和測試。

平台特定來源集（例如 `iosArm64Main`、`iosSimulatorArm64Main` 和 `iosX64Main`）通常是空的，因為 iOS 裝置和模擬器的 Kotlin 程式碼通常是相同的。您只能使用 `iosMain` 中間來源集來共用它們之間的所有程式碼。

這也適用於其他非 Mac Apple 目標。例如，如果您有 Apple TV 的 `tvosArm64` 裝置目標，以及 Apple 晶片和 Intel 架構裝置上 Apple TV 模擬器的 `tvosSimulatorArm64` 和 `tvosX64` 模擬器目標，您可以將 `tvosMain` 中間來源集用於所有這些目標。

## 測試整合

實際專案除了主要產品程式碼外，還需要測試。這就是為什麼預設建立的所有來源集都帶有 `Main` 和 `Test` 後綴的原因。`Main` 包含產品程式碼，而 `Test` 包含此程式碼的測試。它們之間的連接會自動建立，測試可以在無需額外配置的情況下使用 `Main` 程式碼提供的 API。

`Test` 對應的來源集也類似於 `Main`。例如，`commonTest` 是 `commonMain` 的對應來源集，並編譯到所有宣告的目標，允許您編寫共通測試。平台特定測試來源集，例如 `jvmTest`，用於編寫平台特定測試，例如 JVM 特定測試或需要 JVM API 的測試。

除了擁有一個來源集來編寫您的共通測試之外，您還需要一個多平台測試框架。Kotlin 提供了一個預設的 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 函式庫，它帶有 `@kotlin.Test` 註解和各種斷言方法，例如 `assertEquals` 和 `assertTrue`。

您可以像針對每個平台的常規測試一樣編寫平台特定測試，並將它們放在各自的來源集中。與主程式碼一樣，您可以為每個來源集擁有平台特定相依性，例如 JVM 的 `JUnit` 和 iOS 的 `XCTest`。要執行特定目標的測試，請使用 `<targetName>Test` 任務。

了解如何在 [測試您的多平台應用程式教學課程](multiplatform-run-tests.md) 中建立和執行多平台測試。

## 接下來？

*   [了解更多關於在 Gradle 指令碼中宣告和使用預定義來源集](multiplatform-hierarchy.md)
*   [探索多平台專案結構的進階概念](multiplatform-advanced-project-structure.md)
*   [了解更多關於目標編譯和建立自訂編譯](multiplatform-configure-compilations.md)