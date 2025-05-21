---
title: "Kotlin Multiplatform 專案結構基礎"
---
透過 Kotlin Multiplatform，你可以在不同的平台之間共享程式碼。本文將解釋共享程式碼的約束、如何區分程式碼中的共享部分和平台特定部分，以及如何指定此共享程式碼運作的平台。

你還將了解 Kotlin Multiplatform 專案設定的核心概念，例如通用程式碼（common code）、目標（targets）、平台特定（platform-specific）和中間來源集（intermediate source sets）以及測試整合。這將幫助你在未來設定你的 multiplatform 專案。

與 Kotlin 使用的模型相比，這裡介紹的模型經過簡化。但是，對於大多數情況，這個基本模型應該足夠用。

## 通用程式碼（Common code）

*通用程式碼（Common code）*是在不同平台之間共享的 Kotlin 程式碼。

考慮一個簡單的「Hello, World」範例：

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

平台之間共享的 Kotlin 程式碼通常位於 `commonMain` 目錄中。程式碼檔案的位置很重要，因為它會影響編譯此程式碼的平台列表。

Kotlin 編譯器獲取原始碼作為輸入，並產生一組平台特定的二進制檔案作為結果。編譯 multiplatform 專案時，它可以從相同的程式碼產生多個二進制檔案。例如，編譯器可以從同一個 Kotlin 檔案產生 JVM `.class` 檔案和原生可執行檔案：

<img src="/img/common-code-diagram.svg" alt="Common code" width="700" style={{verticalAlign: 'middle'}}/>

並非每段 Kotlin 程式碼都可以編譯到所有平台。Kotlin 編譯器會阻止你在通用程式碼中使用平台特定的函數或類別，因為此程式碼無法編譯到不同的平台。

例如，你不能從通用程式碼中使用 `java.io.File` 依賴項。它是 JDK 的一部分，而通用程式碼也會編譯為原生程式碼，其中 JDK 類別不可用：

<img src="/img/unresolved-java-reference.png" alt="Unresolved Java reference" width="500" style={{verticalAlign: 'middle'}}/>

在通用程式碼中，你可以使用 Kotlin Multiplatform 函式庫。這些函式庫提供了一個通用的 API，可以在不同的平台上以不同的方式實現。在這種情況下，平台特定的 API 充當額外的部分，嘗試在通用程式碼中使用這樣的 API 會導致錯誤。

例如，`kotlinx.coroutines` 是一個支援所有目標的 Kotlin Multiplatform 函式庫，但它也有一個平台特定的部分，可將 `kotlinx.coroutines` 並發基本類型轉換為 JDK 並發基本類型，例如 `fun CoroutinesDispatcher.asExecutor(): Executor`。此 API 的附加部分在 `commonMain` 中不可用。

## 目標（Targets）

目標（Targets）定義了 Kotlin 編譯通用程式碼的平台。這些平台可以是 JVM、JS、Android、iOS 或 Linux。先前的範例將通用程式碼編譯為 JVM 和原生目標。

*Kotlin 目標（Kotlin target）*是一個描述編譯目標的識別符號。它定義了產生的二進制檔案的格式、可用的語言結構和允許的依賴項。

:::tip
目標（Targets）也可以稱為平台。請參閱完整的[支援目標（targets）列表](multiplatform-dsl-reference#targets)。

你應該首先*宣告*一個目標（target），以指示 Kotlin 編譯該特定目標的程式碼。在 Gradle 中，你可以使用 `kotlin {}` 區塊內預定義的 DSL 呼叫來宣告目標（targets）：

```kotlin
kotlin {
    jvm() // 宣告一個 JVM 目標
    iosArm64() // 宣告一個對應於 64 位元 iPhone 的目標
}
```

這樣，每個 multiplatform 專案都定義了一組支援的目標（targets）。請參閱[分層專案結構（Hierarchical project structure）](multiplatform-hierarchy)章節，以了解有關在組建腳本中宣告目標（targets）的更多資訊。

宣告 `jvm` 和 `iosArm64` 目標（targets）後，`commonMain` 中的通用程式碼將被編譯為這些目標：

<img src="/img/target-diagram.svg" alt="Targets" width="700" style={{verticalAlign: 'middle'}}/>

為了理解哪些程式碼將被編譯為特定目標，你可以將目標視為附加到 Kotlin 原始碼檔案的標籤。Kotlin 使用這些標籤來確定如何編譯你的程式碼、產生哪些二進制檔案，以及允許在該程式碼中使用哪些語言結構和依賴項。

如果你也想將 `greeting.kt` 檔案編譯為 `.js`，你只需要宣告 JS 目標即可。然後，`commonMain` 中的程式碼會收到一個額外的 `js` 標籤，該標籤對應於 JS 目標，指示 Kotlin 產生 `.js` 檔案：

<img src="/img/target-labels-diagram.svg" alt="Target labels" width="700" style={{verticalAlign: 'middle'}}/>

這就是 Kotlin 編譯器如何處理編譯到所有宣告目標的通用程式碼的方式。請參閱[來源集（Source sets）](#source-sets)，以了解如何編寫平台特定的程式碼。

## 來源集（Source sets）

*Kotlin 來源集（Kotlin source set）*是一組具有自己的目標（targets）、依賴項和編譯器選項的原始碼檔案。它是 multiplatform 專案中共享程式碼的主要方式。

multiplatform 專案中的每個來源集：

* 有一個對於給定專案唯一的名稱。
* 包含一組原始碼檔案和資源，通常儲存在以來源集名稱命名的目錄中。
* 指定一組將此來源集中的程式碼編譯到的目標（targets）。這些目標（targets）會影響此來源集中可用的語言結構和依賴項。
* 定義自己的依賴項和編譯器選項。

Kotlin 提供了一系列預定義的來源集（source sets）。其中之一是 `commonMain`，它存在於所有 multiplatform 專案中，並編譯為所有宣告的目標（targets）。

你在 Kotlin Multiplatform 專案中以 `src` 內的目錄的形式與來源集（source sets）互動。例如，具有 `commonMain`、`iosMain` 和 `jvmMain` 來源集（source sets）的專案具有以下結構：

<img src="/img/src-directory-diagram.png" alt="Shared sources" width="350" style={{verticalAlign: 'middle'}}/>

在 Gradle 腳本中，你可以在 `kotlin.sourceSets {}` 區塊內按名稱訪問來源集（source sets）：

```kotlin
kotlin {
    // 目標宣告：
    // …

    // 來源集宣告：
    sourceSets {
        commonMain {
            // 配置 commonMain 來源集
        }
    }
}
```

除了 `commonMain` 之外，其他來源集可以是平台特定的或中間的。

### 平台特定來源集（Platform-specific source sets）

雖然僅具有通用程式碼很方便，但並非總是可行。`commonMain` 中的程式碼會編譯為所有宣告的目標（targets），並且 Kotlin 不允許你在那裡使用任何平台特定的 API。

在具有原生和 JS 目標（targets）的 multiplatform 專案中，`commonMain` 中的以下程式碼無法編譯：

```kotlin
// commonMain/kotlin/common.kt
// 無法在通用程式碼中編譯
fun greeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

作為解決方案，Kotlin 建立了平台特定的來源集（source sets），也稱為平台來源集（platform source sets）。每個目標（target）都有一個對應的平台來源集（platform source set），該來源集僅針對該目標（target）進行編譯。例如，`jvm` 目標（target）具有對應的 `jvmMain` 來源集（source set），該來源集僅編譯為 JVM。Kotlin 允許在這些來源集（source sets）中使用平台特定的依賴項，例如 `jvmMain` 中的 JDK：

```kotlin
// jvmMain/kotlin/jvm.kt
// 你可以在 `jvmMain` 來源集中使用 Java 依賴項
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### 編譯為特定目標（Compilation to a specific target）

編譯為特定目標（target）與多個來源集（source sets）一起使用。當 Kotlin 將 multiplatform 專案編譯為特定目標（target）時，它會收集所有標記有此目標（target）的來源集（source sets），並從中產生二進制檔案。

考慮一個包含 `jvm`、`iosArm64` 和 `js` 目標（targets）的範例。Kotlin 建立 `commonMain` 來源集（source set）用於通用程式碼，並建立對應的 `jvmMain`、`iosArm64Main` 和 `jsMain` 來源集（source sets）用於特定目標（targets）：

<img src="/img/specific-target-diagram.svg" alt="Compilation to a specific target" width="700" style={{verticalAlign: 'middle'}}/>

在編譯為 JVM 期間，Kotlin 會選擇所有標記有「JVM」的來源集（source sets），即 `jvmMain` 和 `commonMain`。然後，它將它們一起編譯為 JVM 類別檔案：

<img src="/img/compilation-jvm-diagram.svg" alt="Compilation to JVM" width="700" style={{verticalAlign: 'middle'}}/>

由於 Kotlin 將 `commonMain` 和 `jvmMain` 一起編譯，因此產生的二進制檔案包含來自 `commonMain` 和 `jvmMain` 的宣告。

使用 multiplatform 專案時，請記住：

* 如果你希望 Kotlin 將你的程式碼編譯為特定平台，請宣告一個對應的目標（target）。
* 若要選擇目錄或原始碼檔案來儲存程式碼，首先要確定要在哪些目標（targets）之間共享程式碼：

    * 如果程式碼在所有目標（targets）之間共享，則應在 `commonMain` 中宣告它。
    * 如果程式碼僅用於一個目標（target），則應在該目標（target）的平台特定來源集（platform-specific source set）中定義它（例如，JVM 的 `jvmMain`）。
* 在平台特定來源集（platform-specific source sets）中編寫的程式碼可以訪問來自通用來源集（common source set）的宣告。例如，`jvmMain` 中的程式碼可以使用來自 `commonMain` 的程式碼。但是，反之則不然：`commonMain` 無法使用來自 `jvmMain` 的程式碼。
* 在平台特定來源集（platform-specific source sets）中編寫的程式碼可以使用對應的平台依賴項。例如，`jvmMain` 中的程式碼可以使用僅限 Java 的函式庫，例如 [Guava](https://github.com/google/guava) 或 [Spring](https://spring.io/)。

### 中間來源集（Intermediate source sets）

簡單的 multiplatform 專案通常只有通用程式碼和平台特定程式碼。`commonMain` 來源集（source set）表示在所有宣告的目標（targets）之間共享的通用程式碼。平台特定來源集（Platform-specific source sets），例如 `jvmMain`，表示僅編譯為各自目標（target）的平台特定程式碼。

在實務中，你通常需要更細緻的程式碼共享。

考慮一個範例，你需要定位所有現代 Apple 設備和 Android 設備：

```kotlin
kotlin {
    androidTarget()
    iosArm64()   // 64 位元 iPhone 設備
    macosArm64() // 基於 Apple Silicon 的現代 Mac
    watchosX64() // 現代 64 位元 Apple Watch 設備
    tvosArm64()  // 現代 Apple TV 設備  
}
```

你需要一個來源集（source set）來新增一個為所有 Apple 設備產生 UUID 的函數：

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // 你想訪問 Apple 特定的 API
    return NSUUID().UUIDString()
}
```

你不能將此函數新增到 `commonMain`。`commonMain` 會編譯為所有宣告的目標（targets），包括 Android，但 `platform.Foundation.NSUUID` 是一個 Apple 特定的 API，在 Android 上不可用。如果你嘗試在 `commonMain` 中引用 `NSUUID`，Kotlin 會顯示錯誤。

你可以將此程式碼複製並貼上到每個 Apple 特定的來源集（source
set）：`iosArm64Main`、`macosArm64Main`、`watchosX64Main` 和 `tvosArm64Main`。但不建議使用這種方法，因為像這樣複製程式碼很容易出錯。

為了解決這個問題，你可以使用*中間來源集（intermediate source sets）*。中間來源集（intermediate source set）是一個 Kotlin 來源集（source set），它會編譯為專案中的某些目標（targets），但不是全部。你也可以看到中間來源集（intermediate source sets）被稱為分層來源集（hierarchical source sets）或簡稱為層次結構。

Kotlin 預設會建立一些中間來源集（intermediate source sets）。在這個特定的案例中，產生的專案結構如下所示：

<img src="/img/intermediate-source-sets-diagram.svg" alt="Intermediate source sets" width="700" style={{verticalAlign: 'middle'}}/>

在這裡，底部的彩色塊是平台特定的來源集（source sets）。為了清楚起見，省略了目標（target）標籤。

`appleMain` 區塊是由 Kotlin 建立的中間來源集（intermediate source set），用於共享編譯為 Apple 特定目標（targets）的程式碼。`appleMain` 來源集（source set）僅編譯為 Apple 目標（targets）。因此，Kotlin 允許在 `appleMain` 中使用 Apple 特定的 API，你可以將 `randomUUID()` 函數新增到此處。

請參閱[分層專案結構（Hierarchical project structure）](multiplatform-hierarchy)，以查找
Kotlin 預設建立和設定的所有中間來源集（intermediate source sets），並了解如果 Kotlin 沒有提供你預設需要的中間來源集（intermediate source set），你應該怎麼做。

:::

在編譯為特定目標（target）期間，Kotlin 會獲取所有標記有此目標（target）的來源集（source sets），包括中間來源集（intermediate source sets）。因此，在編譯到 `iosArm64` 平台目標（target）期間，`commonMain`、`appleMain` 和 `iosArm64Main` 來源集（source sets）中編寫的所有程式碼都會被組合在一起：

<img src="/img/native-executables-diagram.svg" alt="Native executables" width="700" style={{verticalAlign: 'middle'}}/>
:::tip
如果某些來源集（source sets）沒有原始碼，也沒關係。例如，在 iOS 開發中，通常不需要提供特定於 iOS 設備但不特定於 iOS 模擬器的程式碼。因此，很少使用 `iosArm64Main`。

:::

#### Apple 設備和模擬器目標（targets）

當你使用 Kotlin Multiplatform 開發 iOS 行動應用程式時，你通常會使用 `iosMain` 來源集（source set）。雖然你可能認為它是 `ios` 目標（target）的平台特定來源集（platform-specific source set），但沒有單個 `ios` 目標（target）。大多數行動專案至少需要兩個目標（targets）：

* **設備目標（Device target）**用於產生可在 iOS 設備上執行的二進制檔案。目前只有一個 iOS 的設備目標（device target）：`iosArm64`。
* **模擬器目標（Simulator target）**用於為在你的機器上啟動的 iOS 模擬器產生二進制檔案。如果你有 Apple silicon Mac 電腦，請選擇 `iosSimulatorArm64` 作為模擬器目標（simulator target）。如果你有基於 Intel 的 Mac 電腦，請使用 `iosX64`。

如果你僅宣告 `iosArm64` 設備目標（device target），你將無法在你的本機上執行和偵錯你的應用程式和測試。

平台特定來源集（Platform-specific source sets），例如 `iosArm64Main`、`iosSimulatorArm64Main` 和 `iosX64Main` 通常是空的，因為 iOS 設備和模擬器的 Kotlin 程式碼通常是相同的。你只能使用 `iosMain` 中間來源集（intermediate source set）在它們之間共享程式碼。

這同樣適用於其他非 Mac Apple 目標（targets）。例如，如果你有 Apple TV 的 `tvosArm64` 設備目標（device target），以及 Apple silicon 和基於 Intel 的設備上的 Apple TV 模擬器的 `tvosSimulatorArm64` 和 `tvosX64` 模擬器目標（simulator targets），則你可以對它們全部使用 `tvosMain` 中間來源集（intermediate source set）。

## 與測試整合（Integration with tests）

實際專案還需要在主要產品程式碼旁邊進行測試。這就是為什麼預設建立的所有來源集（source sets）都具有 `Main` 和 `Test` 後綴。`Main` 包含產品程式碼，而 `Test` 包含此程式碼的測試。它們之間的連接是自動建立的，並且測試可以使用 `Main` 程式碼提供的 API，而無需額外的配置。

`Test` 對應項也是類似於 `Main` 的來源集（source sets）。例如，`commonTest` 是 `commonMain` 的對應項，並編譯為所有宣告的目標（targets），允許你編寫通用測試。平台特定測試來源集（Platform-specific test source sets），例如 `jvmTest`，用於編寫平台特定測試，例如 JVM 特定測試或需要 JVM API 的測試。

除了擁有一個編寫通用測試的來源集（source set）之外，你還需要一個 multiplatform 測試框架。Kotlin 提供了一個預設的 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 函式庫，該函式庫附帶 `@kotlin.Test` 註釋和各種斷言方法，例如 `assertEquals` 和 `assertTrue`。

你可以像編寫每個平台的常規測試一樣，在各自的來源集（source sets）中編寫平台特定測試。與主要程式碼一樣，你可以為每個來源集（source set）提供平台特定依賴項，例如 JVM 的 `JUnit` 和 iOS 的 `XCTest`。若要執行特定目標（target）的測試，請使用 `<targetName>Test` 任務。

了解如何在[測試你的 multiplatform 應用程式教學課程](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)中建立和執行 multiplatform 測試。

## 接下來是什麼？

* [了解有關在 Gradle 腳本中宣告和使用預定義來源集（source sets）的更多資訊](multiplatform-hierarchy)
* [探索 multiplatform 專案結構的進階概念](multiplatform-advanced-project-structure)
* [了解有關目標（target）編譯和建立自定義編譯的更多資訊](multiplatform-configure-compilations)