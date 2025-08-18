[//]: # (title: 多平台專案結構的進階概念)

本文解釋了 Kotlin Multiplatform 專案結構的進階概念，以及它們如何對應到 Gradle 的實作。此資訊對於需要處理 Gradle 建置的低階抽象 (例如 configurations, tasks, publications 等)，或正在為 Kotlin Multiplatform 建置建立 Gradle 外掛程式的情況會很有用。

本頁面在以下情況會很有用：

* 需要在一組 Kotlin 未為其建立 source set 的目標之間共享程式碼。
* 想要為 Kotlin Multiplatform 建置建立 Gradle 外掛程式，或需要處理 Gradle 建置的低階抽象，例如 configurations, tasks, publications 等。

了解多平台專案中依賴管理的一個關鍵點，是 Gradle 風格的專案或程式庫依賴與 Kotlin 特有的 source set 之間的 `dependsOn` 關係之間的差異：

* `dependsOn` 是 common 和平台特定 source set 之間的一種關係，它啟用了 [source set 階層](#dependson-and-source-set-hierarchies) 並普遍實現了多平台專案中的程式碼共享。對於預設的 source set，階層是自動管理的，但在特定情況下，您可能需要修改它。
* 程式庫和專案依賴通常像往常一樣運作，但要在多平台專案中正確管理它們，您應該了解 [Gradle 依賴如何解析](#dependencies-on-other-libraries-or-projects) 為用於編譯的粒度化 **source set → source set** 依賴。

> 在深入研究進階概念之前，我們建議學習 [多平台專案結構的基礎知識](multiplatform-discover-project.md)。
>
{style="tip"}

## dependsOn 與 source set 階層

通常，您會處理 _依賴_ 而非 _`dependsOn`_ 關係。然而，檢查 `dependsOn` 對於理解 Kotlin Multiplatform 專案的內部運作方式至關重要。

`dependsOn` 是兩個 Kotlin source set 之間的一種 Kotlin 特有關係。這可能是 common 和平台特定 source set 之間的一種連接，例如，當 `jvmMain` source set 依賴於 `commonMain`，`iosArm64Main` 依賴於 `iosMain` 等等。

考慮一個使用 Kotlin source set `A` 和 `B` 的通用範例。運算式 `A.dependsOn(B)` 指示 Kotlin：

1. `A` 觀察來自 `B` 的 API，包括內部宣告。
2. `A` 可以為來自 `B` 的 expected 宣告提供 actual 實作。這是一個必要且充分的條件，因為 `A` 只有在 `A.dependsOn(B)` 直接或間接存在時才能為 `B` 提供 `actuals`。
3. `B` 除了其自身的目標之外，還應該編譯到 `A` 編譯到的所有目標。
4. `A` 繼承 `B` 的所有常規依賴。

`dependsOn` 關係建立了一個稱為 source set 階層的樹狀結構。這是一個用於行動裝置開發的典型專案範例，包含 `androidTarget`、`iosArm64` (iPhone 裝置) 和 `iosSimulatorArm64` (適用於 Apple Silicon Mac 的 iPhone 模擬器)：

![DependsOn 樹狀結構](dependson-tree-diagram.svg){width=700}

箭頭代表 `dependsOn` 關係。
這些關係在平台二進位檔編譯期間會被保留。這就是 Kotlin 如何理解 `iosMain` 應該能看到來自 `commonMain` 的 API，但不能看到來自 `iosArm64Main` 的 API：

![編譯期間的 DependsOn 關係](dependson-relations-diagram.svg){width=700}

`dependsOn` 關係是透過呼叫 `KotlinSourceSet.dependsOn(KotlinSourceSet)` 進行設定的，例如：

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        // Example of configuring the dependsOn relation 
        iosArm64Main.dependsOn(commonMain)
    }
}
```

* 此範例展示了如何在建置指令碼中定義 `dependsOn` 關係。然而，Kotlin Gradle 外掛程式預設會建立 source set 並設定這些關係，因此您無需手動執行此操作。
* `dependsOn` 關係在建置指令碼中與 `dependencies {}` 區塊分開宣告。這是因為 `dependsOn` 不是常規依賴；相反，它是 Kotlin source set 之間的一種特定關係，對於跨不同目標共享程式碼是必需的。

您不能使用 `dependsOn` 來宣告對已發布程式庫或另一個 Gradle 專案的常規依賴。例如，您不能設定 `commonMain` 依賴於 `kotlinx-coroutines-core` 程式庫的 `commonMain`，也不能呼叫 `commonTest.dependsOn(commonMain)`。

### 宣告自訂 source set

在某些情況下，您可能需要在專案中擁有一個自訂的中間 source set。考慮一個編譯到 JVM、JS 和 Linux 的專案，並且您只想在 JVM 和 JS 之間共享一些原始碼。在這種情況下，您應該為這對目標找到一個特定的 source set，如 [多平台專案結構的基礎知識](multiplatform-discover-project.md) 中所述。

Kotlin 不會自動建立此類型的 source set。這表示您應該使用 `by creating` 建構手動建立它：

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

然而，Kotlin 仍然不知道如何處理或編譯此 source set。如果您繪製一個圖表，這個 source set 將是孤立的，並且不會有任何目標標籤：

![缺少 dependsOn 關係](missing-dependson-diagram.svg){width=700}

為了解決這個問題，透過新增幾個 `dependsOn` 關係將 `jvmAndJsMain` 包含在階層中：

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

在這裡，`jvmMain.dependsOn(jvmAndJsMain)` 將 JVM 目標新增到 `jvmAndJsMain`，而 `jsMain.dependsOn(jvmAndJsMain)` 將 JS 目標新增到 `jvmAndJsMain`。

最終的專案結構將如下所示：

![最終專案結構](final-structure-diagram.svg){width=700}

> 手動設定 `dependsOn` 關係會停用預設階層範本的自動應用。請參閱 [額外設定](multiplatform-hierarchy.md#additional-configuration) 以了解有關這些情況以及如何處理它們的更多資訊。
>
{style="note"}

## 對其他程式庫或專案的依賴

在多平台專案中，您可以設定對已發布程式庫或另一個 Gradle 專案的常規依賴。

Kotlin Multiplatform 通常以典型的 Gradle 方式宣告依賴。與 Gradle 類似，您：

* 在您的建置指令碼中使用 `dependencies {}` 區塊。
* 為依賴選擇適當的範圍，例如 `implementation` 或 `api`。
* 透過指定其座標來引用依賴，如果它已發布在 repo 中，例如 `"com.google.guava:guava:32.1.2-jre"`，或者如果它是在同一建置中的 Gradle 專案，則透過其路徑引用，例如 `project(":utils:concurrency")`。

多平台專案中的依賴設定有一些特殊功能。每個 Kotlin source set 都有自己的 `dependencies {}` 區塊。這允許您在平台特定 source set 中宣告平台特定依賴：

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

Common 依賴更為複雜。考慮一個多平台專案，它宣告對多平台程式庫的依賴，例如 `kotlinx.coroutines`：

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

依賴解析中有三個重要概念：

1. 多平台依賴會沿著 `dependsOn` 結構向下傳播。當您將依賴新增到 `commonMain` 時，它將自動新增到所有直接或間接在 `commonMain` 中宣告 `dependsOn` 關係的 source set。

   在這種情況下，依賴確實自動新增到所有 `*Main` source set：`iosMain`、`jvmMain`、`iosSimulatorArm64Main` 和 `iosX64Main`。所有這些 source set 都從 `commonMain` source set 繼承 `kotlin-coroutines-core` 依賴，因此您無需手動將其複製貼上到所有這些 source set 中：

   ![多平台依賴的傳播](dependency-propagation-diagram.svg){width=700}

   > 傳播機制允許您透過選擇特定的 source set 來選擇將接收宣告依賴的範圍。例如，如果您想在 iOS 上使用 `kotlinx.coroutines` 而不在 Android 上使用，則可以僅將此依賴新增到 `iosMain`。
   >
   {style="tip"}

2. _source set → 多平台程式庫_ 依賴，例如上面 `commonMain` 對 `org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3` 的依賴，代表了依賴解析的中間狀態。解析的最終狀態始終由 _source set → source set_ 依賴來表示。

   > 最終的 _source set → source set_ 依賴不是 `dependsOn` 關係。
   >
   {style="note"}

   為了推斷粒度化的 _source set → source set_ 依賴，Kotlin 會讀取與每個多平台程式庫一起發布的 source set 結構。在此步驟之後，每個程式庫在內部將不再是整體，而是其 source set 的集合。請參閱 `kotlinx-coroutines-core` 的此範例：

   ![Source set 結構的序列化](structure-serialization-diagram.svg){width=700}

3. Kotlin 處理每個依賴關係，並將其解析為來自依賴的一組 source set。該集合中的每個依賴 source set 都必須具有 _相容的目標_。如果依賴 source set 編譯到的目標 _至少與消費端 source set 相同_，則它具有相容的目標。

   考慮一個範例，其中範例專案中的 `commonMain` 編譯到 `androidTarget`、`iosX64` 和 `iosSimulatorArm64`：

    * 首先，它解析對 `kotlinx-coroutines-core.commonMain` 的依賴。發生這種情況是因為 `kotlinx-coroutines-core` 編譯到所有可能的 Kotlin 目標。因此，它的 `commonMain` 編譯到所有可能的目標，包括所需的 `androidTarget`、`iosX64` 和 `iosSimulatorArm64`。
    * 其次，`commonMain` 依賴於 `kotlinx-coroutines-core.concurrentMain`。由於 `kotlinx-coroutines-core` 中的 `concurrentMain` 編譯到除 JS 之外的所有目標，因此它與消費專案的 `commonMain` 的目標匹配。

   然而，來自 coroutines 的 `iosX64Main` 等 source set 與消費者的 `commonMain` 不相容。儘管 `iosX64Main` 編譯到 `commonMain` 的其中一個目標，即 `iosX64`，但它不編譯到 `androidTarget` 或 `iosSimulatorArm64`。

   依賴解析的結果直接影響 `kotlinx-coroutines-core` 中哪些程式碼可見：

   ![Common 程式碼中 JVM 特定 API 的錯誤](dependency-resolution-error.png){width=700}

### 跨 source set 對齊 common 依賴的版本

在 Kotlin Multiplatform 專案中，common source set 會被編譯多次，以產生 klib 並作為每個已設定的 [編譯](multiplatform-configure-compilations.md) 的一部分。為了產生一致的二進位檔，common 程式碼每次都應該針對相同版本的多平台依賴進行編譯。Kotlin Gradle 外掛程式有助於對齊這些依賴，確保每個 source set 的有效依賴版本相同。

在上面的範例中，假設您想將 `androidx.navigation:navigation-compose:2.7.7` 依賴新增到您的 `androidMain` source set。您的專案明確宣告 `commonMain` source set 的 `kotlinx-coroutines-core:1.7.3` 依賴，但版本 2.7.7 的 Compose Navigation 程式庫需要 Kotlin coroutines 1.8.0 或更新版本。

由於 `commonMain` 和 `androidMain` 會一起編譯，Kotlin Gradle 外掛程式會選擇兩個 coroutines 程式庫版本中的一個，並將 `kotlinx-coroutines-core:1.8.0` 應用於 `commonMain` source set。但為了讓 common 程式碼在所有已設定的目標上保持一致地編譯，iOS source set 也需要被限制為相同的依賴版本。
因此，Gradle 也將 `kotlinx.coroutines-*:1.8.0` 依賴傳播到 `iosMain` source set。

![*Main source set 之間的依賴對齊](multiplatform-source-set-dependency-alignment.svg){width=700}

依賴在 `*Main` source set 和 [`*Test` source set](multiplatform-discover-project.md#integration-with-tests) 之間分開對齊。`*Test` source set 的 Gradle 設定包含 `*Main` source set 的所有依賴，但反之不然。因此，您可以使用較新的程式庫版本測試您的專案，而不會影響您的主要程式碼。

例如，您的 `*Main` source set 中有 Kotlin coroutines 1.7.3 依賴，並傳播到專案中的每個 source set。然而，在 `iosTest` source set 中，您決定將版本升級到 1.8.0 以測試新的程式庫發布。根據相同的演算法，此依賴將在 `*Test` source set 的整個樹狀結構中傳播，因此每個 `*Test` source set 都將使用 `kotlinx.coroutines-*:1.8.0` 依賴進行編譯。

![測試 source set 獨立於主要 source set 解析依賴](test-main-source-set-dependency-alignment.svg)

## 編譯

與單平台專案相反，Kotlin Multiplatform 專案需要多次編譯器啟動才能建置所有構件。每次編譯器啟動都是一次 _Kotlin 編譯_。

例如，以下是在前面提到的此 Kotlin 編譯期間為 iPhone 裝置生成二進位檔的方式：

![iOS 的 Kotlin 編譯](ios-compilation-diagram.svg){width=700}

Kotlin 編譯按目標分組。預設情況下，Kotlin 為每個目標建立兩個編譯：用於生產原始碼的 `main` 編譯和用於測試原始碼的 `test` 編譯。

建置指令碼中的編譯以類似方式存取。您首先選擇一個 Kotlin 目標，然後存取其內部的 `compilations` 容器，最後按其名稱選擇必要的編譯：

```kotlin
kotlin {
    // Declare and configure the JVM target
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}
```