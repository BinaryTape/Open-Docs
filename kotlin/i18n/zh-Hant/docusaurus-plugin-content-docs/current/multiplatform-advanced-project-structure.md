---
title: 多平台專案結構的進階概念
---
本文闡述了 Kotlin Multiplatform 專案結構的高階概念，以及它們如何對應到 Gradle 的實作。如果您需要處理 Gradle 建置的底層抽象概念（配置、任務、發佈等），或是為 Kotlin Multiplatform 建置建立 Gradle 外掛程式，這些資訊會很有用。

如果您有以下需求，此頁面會很有幫助：

*   需要在 Kotlin 沒有建立原始碼集合的目標之間共享程式碼。
*   想要為 Kotlin Multiplatform 建置建立 Gradle 外掛程式，或是需要處理 Gradle 建置的底層抽象概念，例如配置（configurations）、任務（tasks）、發佈（publications）等。

要理解多平台專案中的依賴管理，一個至關重要的事項是區分 Gradle 風格的專案或函式庫依賴，以及 Kotlin 特有的原始碼集合之間的 `dependsOn` 關係：

*   `dependsOn` 是通用和平台特定原始碼集合之間的關係，它啟用了[原始碼集合層級結構](#dependson-and-source-set-hierarchies)，並在多平台專案中實現程式碼共享。對於預設的原始碼集合，層級結構是自動管理的，但在特定情況下，您可能需要修改它。
*   一般的函式庫和專案依賴的運作方式與往常一樣，但為了在多平台專案中正確管理它們，您應該理解[Gradle 依賴如何解析](#dependencies-on-other-libraries-or-projects)為用於編譯的細粒度 **原始碼集合 → 原始碼集合** 依賴。

:::note
在深入研究高階概念之前，我們建議您先了解[多平台專案結構的基礎知識](multiplatform-discover-project)。

## dependsOn 和原始碼集合層級結構

通常，您會處理 *依賴（dependencies）*，而不是 *`dependsOn`* 關係。然而，檢視 `dependsOn` 對於理解 Kotlin Multiplatform 專案在底層如何運作至關重要。

`dependsOn` 是兩個 Kotlin 原始碼集合之間 Kotlin 特有的關係。這可以是通用原始碼集合和平台特定原始碼集合之間的連接，例如，當 `jvmMain` 原始碼集合依賴於 `commonMain`，`iosArm64Main` 依賴於 `iosMain`，等等。

考慮一個 Kotlin 原始碼集合 `A` 和 `B` 的一般範例。表達式 `A.dependsOn(B)` 指示 Kotlin：

1.  `A` 觀察來自 `B` 的 API，包括內部宣告。
2.  `A` 可以為來自 `B` 的 `expected` 宣告提供 `actual` 實作。這是一個必要且充分的條件，因為當且僅當 `A.dependsOn(B)` 直接或間接成立時，`A` 才能為 `B` 提供 `actual`。
3.  `B` 應編譯到 `A` 編譯到的所有目標，以及它自己的目標。
4.  `A` 繼承 `B` 的所有常規依賴。

`dependsOn` 關係建立了一個類似樹狀結構，稱為原始碼集合層級結構。以下是一個典型的行動開發專案範例，其中包含 `androidTarget`、`iosArm64`（iPhone 裝置）和 `iosSimulatorArm64`（Apple Silicon Mac 的 iPhone 模擬器）：

<img src="/img/dependson-tree-diagram.svg" alt="DependsOn tree structure" width="700" style={{verticalAlign: 'middle'}}/>

箭頭表示 `dependsOn` 關係。
這些關係在平台二進位的編譯過程中會被保留。這就是 Kotlin 理解 `iosMain` 應該看到來自 `commonMain` 的 API，而不是來自 `iosArm64Main` 的 API 的方式：

<img src="/img/dependson-relations-diagram.svg" alt="DependsOn relations during compilation" width="700" style={{verticalAlign: 'middle'}}/>

`dependsOn` 關係是使用 `KotlinSourceSet.dependsOn(KotlinSourceSet)` 呼叫配置的，例如：

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        // Example of configuring the dependsOn relation 
        iosArm64Main.dependsOn(commonMain)
    }
}
```

*   此範例展示了如何在建置腳本中定義 `dependsOn` 關係。然而，Kotlin Gradle 外掛程式預設會建立原始碼集合並設定這些關係，因此您不需要手動執行此操作。
*   `dependsOn` 關係是在建置腳本中的 `dependencies {}` 區塊之外宣告的。
    這是因為 `dependsOn` 不是常規依賴；相反，它是 Kotlin 原始碼集合之間的一種特定關係，對於在不同目標之間共享程式碼是必要的。

您不能使用 `dependsOn` 來宣告對已發佈的函式庫或另一個 Gradle 專案的常規依賴。
例如，您不能設定 `commonMain` 依賴於 `kotlinx-coroutines-core` 函式庫的 `commonMain`，也不能呼叫 `commonTest.dependsOn(commonMain)`。

### 宣告自訂原始碼集合

在某些情況下，您可能需要在專案中擁有自訂的中間原始碼集合。
考慮一個編譯到 JVM、JS 和 Linux 的專案，並且您只想在 JVM 和 JS 之間共享某些原始碼。
在這種情況下，您應該為這對目標找到一個特定的原始碼集合，如[多平台專案結構的基礎知識](multiplatform-discover-project)中所述。

Kotlin 不會自動建立這樣的原始碼集合。這意味著您應該使用 `by creating` 構造手動建立它：

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        // Create a source set named "jvmAndJs"
        val jvmAndJsMain by creating {
            // …
        }
    }
}
```

然而，Kotlin 仍然不知道如何處理或編譯此原始碼集合。如果您繪製一個圖表，此原始碼集合將被隔離，並且沒有任何目標標籤：

<img src="/img/missing-dependson-diagram.svg" alt="Missing dependsOn relation" width="700" style={{verticalAlign: 'middle'}}/>

要解決此問題，請透過新增多個 `dependsOn` 關係將 `jvmAndJsMain` 包含在層級結構中：

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        val jvmAndJsMain by creating {
            // Don't forget to add dependsOn to commonMain
            dependsOn(commonMain.get())
        }

        jvmMain {
            dependsOn(jvmAndJsMain)
        }

        jsMain {
            dependsOn(jvmAndJsMain)
        }
    }
}
```

在這裡，`jvmMain.dependsOn(jvmAndJsMain)` 將 JVM 目標新增到 `jvmAndJsMain`，`jsMain.dependsOn(jvmAndJsMain)` 將 JS 目標新增到 `jvmAndJsMain`。

最終的專案結構將如下所示：

<img src="/img/final-structure-diagram.svg" alt="Final project structure" width="700" style={{verticalAlign: 'middle'}}/>

手動配置 `dependsOn` 關係會停用預設層級結構範本的自動應用。
請參閱[其他配置](multiplatform-hierarchy#additional-configuration)以了解有關此類情況的更多資訊以及如何處理它們。

:::

## 依賴其他函式庫或專案

在多平台專案中，您可以設定對已發佈的函式庫或另一個 Gradle 專案的常規依賴。

Kotlin Multiplatform 通常以典型的 Gradle 方式宣告依賴。與 Gradle 類似，您：

*   使用建置腳本中的 `dependencies {}` 區塊。
*   為依賴選擇適當的範圍（scope），例如 `implementation` 或 `api`。
*   透過指定其座標（如果它已發佈在儲存庫中，例如 `"com.google.guava:guava:32.1.2-jre"`），或如果它是同一建置中的 Gradle 專案，則透過其路徑（例如 `project(":utils:concurrency")`）來引用依賴。

多平台專案中的依賴配置有一些特殊功能。每個 Kotlin 原始碼集合都有自己的 `dependencies {}` 區塊。這允許您在平台特定的原始碼集合中宣告平台特定的依賴：

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        jvmMain.dependencies {
            // This is jvmMain's dependencies, so it's OK to add a JVM-specific dependency
            implementation("com.google.guava:guava:32.1.2-jre")
        }
    }
}
```

通用依賴更棘手。考慮一個多平台專案，它宣告對多平台函式庫的依賴，例如 `kotlinx.coroutines`：

```kotlin
kotlin {
    androidTarget()     // Android
    iosArm64()          // iPhone devices 
    iosSimulatorArm64() // iPhone simulator on Apple Silicon Mac

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
        }
    }
}
```

依賴解析中有三個重要的概念：

1.  多平台依賴會向下傳播到 `dependsOn` 結構中。當您將依賴新增到 `commonMain` 時，它會自動新增到所有直接或間接在 `commonMain` 中宣告 `dependsOn` 關係的原始碼集合。

    在這種情況下，依賴確實已自動新增到所有 `*Main` 原始碼集合：`iosMain`、`jvmMain`、`iosSimulatorArm64Main` 和 `iosX64Main`。所有這些原始碼集合都從 `commonMain` 原始碼集合繼承了 `kotlin-coroutines-core` 依賴，因此您不必手動將其複製並貼到所有這些集合中：

    <img src="/img/dependency-propagation-diagram.svg" alt="Propagation of multiplatform dependencies" width="700" style={{verticalAlign: 'middle'}}/>

    > 傳播機制允許您透過選擇特定的原始碼集合來選擇將接收已宣告依賴的範圍。
    > 例如，如果您想在 iOS 上使用 `kotlinx.coroutines`，但不在 Android 上使用，則可以僅將此依賴新增到 `iosMain`。

2.  _原始碼集合 → 多平台函式庫_ 依賴，例如上面的 `commonMain` 到 `org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3`，表示依賴解析的中間狀態。解析的最終狀態始終由 _原始碼集合 → 原始碼集合_ 依賴表示。

    > 最終的 _原始碼集合 → 原始碼集合_ 依賴不是 `dependsOn` 關係。

    為了推斷細粒度的 _原始碼集合 → 原始碼集合_ 依賴，Kotlin 會讀取與每個多平台函式庫一起發佈的原始碼集合結構。在此步驟之後，每個函式庫在內部將不會表示為一個整體，而是表示為其原始碼集合的集合。請參閱此 `kotlinx-coroutines-core` 的範例：

    <img src="/img/structure-serialization-diagram.svg" alt="Serialization of the source set structure" width="700" style={{verticalAlign: 'middle'}}/>

3.  Kotlin 會取得每個依賴關係，並將其解析為來自依賴的原始碼集合的集合。
    該集合中的每個依賴原始碼集合都必須具有 _相容的目標（compatible targets）_。如果依賴原始碼集合編譯到 _至少與_ 消費者原始碼集合 _相同的目標_，則它具有相容的目標。

    考慮一個範例，其中範例專案中的 `commonMain` 編譯為 `androidTarget`、`iosX64` 和 `iosSimulatorArm64`：

    *   首先，它解析了對 `kotlinx-coroutines-core.commonMain` 的依賴。發生這種情況是因為 `kotlinx-coroutines-core` 編譯為所有可能的 Kotlin 目標。因此，其 `commonMain` 編譯為所有可能的目標，包括所需的 `androidTarget`、`iosX64` 和 `iosSimulatorArm64`。
    *   其次，`commonMain` 依賴於 `kotlinx-coroutines-core.concurrentMain`。
        由於 `kotlinx-coroutines-core` 中的 `concurrentMain` 編譯為除 JS 之外的所有目標，因此它符合消費者專案的 `commonMain` 的目標。

    然而，來自協程的原始碼集合（例如 `iosX64Main`）與消費者的 `commonMain` 不相容。
    即使 `iosX64Main` 編譯為 `commonMain` 的其中一個目標，即 `iosX64`，它也不編譯為 `androidTarget` 或 `iosSimulatorArm64`。

    依賴解析的結果直接影響 `kotlinx-coroutines-core` 中哪些程式碼是可見的：

    <img src="/img/dependency-resolution-error.png" alt="Error on JVM-specific API in common code" width="700" style={{verticalAlign: 'middle'}}/>

### 對齊跨原始碼集合的通用依賴版本

在 Kotlin Multiplatform 專案中，通用原始碼集合會多次編譯以產生 klib，並作為每個已配置[編譯（compilation）](multiplatform-configure-compilations)的一部分。為了產生一致的二進位檔，通用程式碼應每次都針對相同版本的多平台依賴進行編譯。
Kotlin Gradle 外掛程式有助於對齊這些依賴，確保每個原始碼集合的有效依賴版本相同。

在上面的範例中，假設您想將 `androidx.navigation:navigation-compose:2.7.7` 依賴新增到您的 `androidMain` 原始碼集合。您的專案明確宣告了 `commonMain` 原始碼集合的 `kotlinx-coroutines-core:1.7.3` 依賴，但版本 2.7.7 的 Compose Navigation 函式庫需要 Kotlin 協程 1.8.0 或更高版本。

由於 `commonMain` 和 `androidMain` 是一起編譯的，因此 Kotlin Gradle 外掛程式會在兩個版本的協程函式庫之間進行選擇，並將 `kotlinx-coroutines-core:1.8.0` 應用於 `commonMain` 原始碼集合。但是為了使通用程式碼在所有已配置的目標上一致地編譯，iOS 原始碼集合也需要約束到相同的依賴版本。
因此，Gradle 會將 `kotlinx.coroutines-*:1.8.0` 依賴傳播到 `iosMain` 原始碼集合。

<img src="/img/multiplatform-source-set-dependency-alignment.svg" alt="Alignment of dependencies among *Main source sets" width="700" style={{verticalAlign: 'middle'}}/>

依賴關係在 `*Main` 原始碼集合和 [`*Test` 原始碼集合](multiplatform-discover-project#integration-with-tests)之間分別對齊。
`*Test` 原始碼集合的 Gradle 配置包含 `*Main` 原始碼集合的所有依賴，但反之則不然。
因此，您可以使用較新的函式庫版本測試您的專案，而不會影響您的主要程式碼。

例如，您的 `*Main` 原始碼集合中具有 Kotlin 協程 1.7.3 依賴，該依賴已傳播到專案中的每個原始碼集合。
但是，在 `iosTest` 原始碼集合中，您決定將版本升級到 1.8.0 以測試新的函式庫版本。
根據相同的演算法，此依賴將在 `*Test` 原始碼集合的樹狀結構中傳播，因此每個 `*Test` 原始碼集合都將使用 `kotlinx.coroutines-*:1.8.0` 依賴進行編譯。

<img src="/img/test-main-source-set-dependency-alignment.svg" alt="Test source sets resolving dependencies separately from the main source sets" style={{verticalAlign: 'middle'}}/>

## 編譯（Compilations）

與單平台專案相反，Kotlin Multiplatform 專案需要多次啟動編譯器才能建置所有成品。
每次啟動編譯器都是一個 *Kotlin 編譯（Kotlin compilation）*。

例如，以下是在先前提到的 Kotlin 編譯期間如何產生 iPhone 裝置的二進位檔：

<img src="/img/ios-compilation-diagram.svg" alt="Kotlin compilation for iOS" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin 編譯在目標下分組。預設情況下，Kotlin 為每個目標建立兩個編譯，一個是用於生產原始碼的 `main` 編譯，另一個是用於測試原始碼的 `test` 編譯。

編譯在建置腳本中以類似的方式存取。您首先選擇一個 Kotlin 目標，然後存取裡面的 `compilations` 容器，最後按名稱選擇必要的編譯：

```kotlin
kotlin {
    // Declare and configure the JVM target
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}
```
```