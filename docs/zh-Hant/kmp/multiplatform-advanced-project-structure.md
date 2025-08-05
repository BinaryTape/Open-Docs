[//]: # (title: 多平台專案結構的進階概念)

本文解釋了 Kotlin 多平台專案結構的進階概念，以及它們如何對應到 Gradle 的實現。如果您需要處理 Gradle 建置的底層抽象（例如：組態、任務、發佈等），或者正在為 Kotlin 多平台建置建立 Gradle 外掛程式，此資訊將會非常有用。

本頁面在以下情況下會很有用：

*   需要在一組 Kotlin 沒有建立原始碼集的目標之間共用程式碼。
*   想要為 Kotlin 多平台建置建立 Gradle 外掛程式，或者需要處理 Gradle 建置的底層抽象，例如：組態、任務、發佈等。

了解多平台專案中依賴項管理的一個關鍵點，在於 Gradle 風格的專案或程式庫依賴項與 Kotlin 特有的原始碼集之間 `dependsOn` 關係的區別：

*   `dependsOn` 是通用原始碼集和平台特定原始碼集之間的關係，它啟用 [原始碼集層次結構](#dependson-and-source-set-hierarchies)，並總體上實現多平台專案中的程式碼共用。對於預設原始碼集，層次結構會自動管理，但在特定情況下，您可能需要更改它。
*   一般而言，程式庫和專案依賴項的運作方式與往常相同，但在多平台專案中要正確管理它們，您應該了解 [Gradle 依賴項如何解析](#dependencies-on-other-libraries-or-projects) 為用於編譯的細粒度 **原始碼集 → 原始碼集** 依賴項。

> 在深入探討進階概念之前，建議您先了解 [多平台專案結構的基礎知識](multiplatform-discover-project.md)。
>
{style="tip"}

## dependsOn 和原始碼集層次結構

通常，您會處理 *依賴項*，而不是 *`dependsOn`* 關係。然而，檢視 `dependsOn` 對於理解 Kotlin 多平台專案的底層運作方式至關重要。

`dependsOn` 是兩個 Kotlin 原始碼集之間的一種 Kotlin 特有關係。這可能是通用原始碼集和平台特定原始碼集之間的連結，例如：當 `jvmMain` 原始碼集依賴於 `commonMain`、`iosArm64Main` 依賴於 `iosMain` 等等。

考慮一個使用 Kotlin 原始碼集 `A` 和 `B` 的一般範例。表達式 `A.dependsOn(B)` 指示 Kotlin：

1.  `A` 觀察 `B` 中的 API，包括內部宣告。
2.  `A` 可以為 `B` 中的預期宣告提供實際的實現。這是一個必要且充分的條件，因為 `A` 能夠為 `B` 提供實際實現，當且僅當 `A.dependsOn(B)` 直接或間接成立。
3.  `B` 應編譯到 `A` 編譯到的所有目標，以及其自身的目標。
4.  `A` 繼承 `B` 的所有常規依賴項。

`dependsOn` 關係建立了一種樹狀結構，稱為原始碼集層次結構。這是一個行動開發典型專案的範例，其中包含 `androidTarget`、`iosArm64`（iPhone 裝置）和 `iosSimulatorArm64`（適用於 Apple Silicon Mac 的 iPhone 模擬器）：

![DependsOn tree structure](dependson-tree-diagram.svg){width=700}

箭頭表示 `dependsOn` 關係。
這些關係在平台二進位檔的編譯過程中被保留。這就是 Kotlin 如何理解 `iosMain` 應該看到 `commonMain` 的 API，而不是 `iosArm64Main` 的 API：

![DependsOn relations during compilation](dependson-relations-diagram.svg){width=700}

`dependsOn` 關係是透過 `KotlinSourceSet.dependsOn(KotlinSourceSet)` 呼叫來配置的，例如：

```kotlin
kotlin {
    // 目標宣告
    sourceSets {
        // 配置 dependsOn 關係的範例
        iosArm64Main.dependsOn(commonMain)
    }
}
```

*   此範例展示了如何在建置腳本中定義 `dependsOn` 關係。然而，Kotlin Gradle 外掛程式預設會建立原始碼集並設定這些關係，因此您無需手動執行此操作。
*   `dependsOn` 關係是與建置腳本中的 `dependencies {}` 區塊分開宣告的。這是因為 `dependsOn` 不是常規的依賴項；相反地，它是 Kotlin 原始碼集之間的一種特定關係，對於在不同目標之間共用程式碼是必需的。

您不能使用 `dependsOn` 來宣告對已發佈程式庫或另一個 Gradle 專案的常規依賴項。例如，您不能設定 `commonMain` 依賴於 `kotlinx-coroutines-core` 程式庫的 `commonMain`，也不能呼叫 `commonTest.dependsOn(commonMain)`。

### 宣告自訂原始碼集

在某些情況下，您可能需要在專案中擁有自訂的中介原始碼集。考慮一個編譯到 JVM、JS 和 Linux 的專案，並且您希望僅在 JVM 和 JS 之間共用某些原始碼。在這種情況下，您應該為這對目標找到一個特定的原始碼集，如 [多平台專案結構的基礎知識](multiplatform-discover-project.md) 中所述。

Kotlin 不會自動建立此類原始碼集。這表示您應該使用 `by creating` 結構手動建立它：

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        // 建立一個名為 "jvmAndJs" 的原始碼集
        val jvmAndJsMain by creating {
            // …
        }
    }
}
```

然而，Kotlin 仍然不知道如何處理或編譯這個原始碼集。如果您繪製圖表，這個原始碼集將是獨立的，並且沒有任何目標標籤：

![Missing dependsOn relation](missing-dependson-diagram.svg){width=700}

為了修正這個問題，請透過添加多個 `dependsOn` 關係，將 `jvmAndJsMain` 納入層次結構中：

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        val jvmAndJsMain by creating {
            // 別忘了將 dependsOn 添加到 commonMain
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

在此，`jvmMain.dependsOn(jvmAndJsMain)` 將 JVM 目標添加到 `jvmAndJsMain`，而 `jsMain.dependsOn(jvmAndJsMain)` 將 JS 目標添加到 `jvmAndJsMain`。

最終的專案結構將如下所示：

![Final project structure](final-structure-diagram.svg){width=700}

> 手動配置 `dependsOn` 關係會禁用預設層次結構範本的自動應用。請參閱 [額外配置](multiplatform-hierarchy.md#additional-configuration) 以了解更多關於此類情況及其處理方式。
>
{style="note"}

## 對其他程式庫或專案的依賴項

在多平台專案中，您可以設定對已發佈程式庫或另一個 Gradle 專案的常規依賴項。

Kotlin Multiplatform 通常以典型的 Gradle 方式宣告依賴項。與 Gradle 類似，您可以：

*   在您的建置腳本中使用 `dependencies {}` 區塊。
*   為依賴項選擇適當的作用域，例如：`implementation` 或 `api`。
*   透過指定其座標（如果它發佈在儲存庫中，例如："com.google.guava:guava:32.1.2-jre"），或透過其路徑（如果它是同一建置中的 Gradle 專案，例如：`project(":utils:concurrency")`）來引用依賴項。

多平台專案中的依賴項配置有一些特殊功能。每個 Kotlin 原始碼集都有自己的 `dependencies {}` 區塊。這允許您在平台特定原始碼集中宣告平台特定依賴項：

```kotlin
kotlin {
    // 目標宣告
    sourceSets {
        jvmMain.dependencies {
            // 這是 jvmMain 的依賴項，因此添加 JVM 特定依賴項是沒問題的
            implementation("com.google.guava:guava:32.1.2-jre")
        }
    }
}
```

通用依賴項比較棘手。考慮一個多平台專案，它宣告了對一個多平台程式庫的依賴項，例如 `kotlinx.coroutines`：

```kotlin
kotlin {
    androidTarget()     // Android
    iosArm64()          // iPhone 裝置 
    iosSimulatorArm64() // 適用於 Apple Silicon Mac 的 iPhone 模擬器

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
        }
    }
}
```

依賴項解析中有三個重要概念：

1.  多平台依賴項會沿著 `dependsOn` 結構向下傳播。當您將依賴項添加到 `commonMain` 時，它將自動添加到所有直接或間接在 `commonMain` 中宣告 `dependsOn` 關係的原始碼集。

    在這種情況下，該依賴項確實自動添加到了所有 `*Main` 原始碼集：`iosMain`、`jvmMain`、`iosSimulatorArm64Main` 和 `iosX64Main`。所有這些原始碼集都從 `commonMain` 原始碼集繼承了 `kotlin-coroutines-core` 依賴項，因此您無需手動將其複製並貼上到所有這些原始碼集中：

    ![Propagation of multiplatform dependencies](dependency-propagation-diagram.svg){width=700}

    > 傳播機制允許您透過選擇特定的原始碼集來選擇將接收宣告依賴項的作用域。例如，如果您想在 iOS 上使用 `kotlinx.coroutines` 但不在 Android 上使用，您可以只將此依賴項添加到 `iosMain`。
    >
    {style="tip"}

2.  *原始碼集 → 多平台程式庫* 依賴項，例如上面 `commonMain` 對 `org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3` 的依賴項，代表依賴項解析的中間狀態。解析的最終狀態始終由 *原始碼集 → 原始碼集* 依賴項表示。

    > 最終的 *原始碼集 → 原始碼集* 依賴項不是 `dependsOn` 關係。
    >
    {style="note"}

    為了推斷細粒度的 *原始碼集 → 原始碼集* 依賴項，Kotlin 會讀取與每個多平台程式庫一起發佈的原始碼集結構。在此步驟之後，每個程式庫在內部將不再表示為一個整體，而是作為其原始碼集的集合。請參見 `kotlinx-coroutines-core` 的此範例：

    ![Serialization of the source set structure](structure-serialization-diagram.svg){width=700}

3.  Kotlin 獲取每個依賴關係並將其解析為依賴項中的原始碼集集合。該集合中的每個依賴項原始碼集都必須具有 *相容的目標*。如果依賴項原始碼集編譯到 *至少與消費者原始碼集相同的目標*，則它具有相容的目標。

    考慮一個範例，其中範例專案中的 `commonMain` 編譯到 `androidTarget`、`iosX64` 和 `iosSimulatorArm64`：

    *   首先，它解析了對 `kotlinx-coroutines-core.commonMain` 的依賴項。這之所以發生，是因為 `kotlinx-coroutines-core` 編譯到所有可能的 Kotlin 目標。因此，它的 `commonMain` 編譯到所有可能的目標，包括所需的 `androidTarget`、`iosX64` 和 `iosSimulatorArm64`。
    *   其次，`commonMain` 依賴於 `kotlinx-coroutines-core.concurrentMain`。由於 `kotlinx-coroutines-core` 中的 `concurrentMain` 編譯到除了 JS 之外的所有目標，它與消費專案的 `commonMain` 的目標匹配。

    然而，像來自 coroutines 的 `iosX64Main` 這樣的原始碼集與消費者的 `commonMain` 不相容。儘管 `iosX64Main` 編譯到 `commonMain` 的其中一個目標（即 `iosX64`），但它既不編譯到 `androidTarget` 也不編譯到 `iosSimulatorArm64`。

    依賴項解析的結果直接影響 `kotlinx-coroutines-core` 中哪些程式碼可見：

    ![Error on JVM-specific API in common code](dependency-resolution-error.png){width=700}

### 跨原始碼集對齊通用依賴項的版本

在 Kotlin 多平台專案中，通用原始碼集會多次編譯以產生 klib，並作為每個配置的 [編譯](multiplatform-configure-compilations.md) 的一部分。為了產生一致的二進位檔，通用程式碼每次都應該針對相同版本的多平台依賴項進行編譯。Kotlin Gradle 外掛程式有助於對齊這些依賴項，確保每個原始碼集的有效依賴項版本相同。

在上面的範例中，想像您想將 `androidx.navigation:navigation-compose:2.7.7` 依賴項添加到您的 `androidMain` 原始碼集。您的專案明確宣告了 `commonMain` 原始碼集的 `kotlinx-coroutines-core:1.7.3` 依賴項，但版本為 2.7.7 的 Compose Navigation 程式庫需要 Kotlin coroutines 1.8.0 或更新版本。

由於 `commonMain` 和 `androidMain` 是同時編譯的，Kotlin Gradle 外掛程式會在這兩個版本的 coroutines 程式庫之間進行選擇，並將 `kotlinx-coroutines-core:1.8.0` 應用於 `commonMain` 原始碼集。但為了使通用程式碼在所有配置的目標上一致編譯，iOS 原始碼集也需要被約束到相同的依賴項版本。因此，Gradle 也會將 `kotlinx.coroutines-*:1.8.0` 依賴項傳播到 `iosMain` 原始碼集。

![Alignment of dependencies among *Main source sets](multiplatform-source-set-dependency-alignment.svg){width=700}

依賴項在 `*Main` 原始碼集和 [`*Test` 原始碼集](multiplatform-discover-project.md#integration-with-tests) 之間單獨對齊。`*Test` 原始碼集的 Gradle 配置包含 `*Main` 原始碼集的所有依賴項，但反之則不然。因此，您可以使用較新的程式庫版本來測試您的專案，而不會影響您的主要程式碼。

例如，您的 `*Main` 原始碼集中有 Kotlin coroutines 1.7.3 依賴項，並傳播到專案中的每個原始碼集。然而，在 `iosTest` 原始碼集中，您決定將版本升級到 1.8.0 以測試新的程式庫發佈。根據相同的演算法，此依賴項將在 `*Test` 原始碼集的樹狀結構中傳播，因此每個 `*Test` 原始碼集都將使用 `kotlinx.coroutines-*:1.8.0` 依賴項進行編譯。

![Test source sets resolving dependencies separately from the main source sets](test-main-source-set-dependency-alignment.svg)

## 編譯

與單平台專案相反，Kotlin 多平台專案需要多次編譯器啟動才能建置所有構件。每次編譯器啟動都是一次 *Kotlin 編譯*。

例如，以下是前面提到的 Kotlin 編譯期間，iPhone 裝置的二進位檔是如何生成的：

![Kotlin compilation for iOS](ios-compilation-diagram.svg){width=700}

Kotlin 編譯被歸類在目標之下。預設情況下，Kotlin 為每個目標建立兩個編譯：用於生產原始碼的 `main` 編譯和用於測試原始碼的 `test` 編譯。

建置腳本中的編譯存取方式類似。您首先選擇一個 Kotlin 目標，然後存取內部的 `compilations` 容器，最後依其名稱選擇必要的編譯：

```kotlin
kotlin {
    // 宣告並配置 JVM 目標
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}