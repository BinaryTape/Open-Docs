---
title: 多平台專案結構的進階概念
---

[//]: # (title: 多平台專案結構的進階概念)

這篇文章說明了 Kotlin Multiplatform 專案結構的進階概念，以及它們如何對應到 Gradle 的實作。如果您需要處理 Gradle 組建的底層抽象（配置、任務、發佈等），或者正在為 Kotlin Multiplatform 組建建立 Gradle 外掛程式，這些資訊將會非常有用。

本頁面在以下情況對您有所幫助：

* 需要在一組 Kotlin 未自動建立原始碼集的目標之間共用程式碼。
* 想要為 Kotlin Multiplatform 組建建立 Gradle 外掛程式，或是需要處理 Gradle 組建的底層抽象，例如配置、任務、發佈等。

關於多平台專案中的相依性管理，其中一個關鍵點是了解 Gradle 風格的專案或程式庫相依性，與 Kotlin 特有的原始碼集之間 `dependsOn` 關係的區別：

* `dependsOn` 是通用原始碼集與平台特定原始碼集之間的關係，它啟用了[原始碼集階層結構](#dependson-and-source-set-hierarchies)，並讓多平台專案中的程式碼共用成為可能。對於預設原始碼集，此階層結構是自動管理的，但在特定情況下您可能需要對其進行修改。
* 程式庫和專案相依性的運作方式與往常相同，但為了在多平台專案中正確管理它們，您應該了解 [Gradle 相依性如何解析](#dependencies-on-other-libraries-or-projects)為用於編譯的細粒度 **原始碼集 → 原始碼集** 相依性。

> 在深入研究進階概念之前，我們建議先學習[多平台專案結構的基礎知識](multiplatform-discover-project.md)。
>
{style="tip"}

## dependsOn 與原始碼集階層結構

通常情況下，您會處理「相依性」（dependencies）而非「`dependsOn`」關係。然而，檢查 `dependsOn` 對於理解 Kotlin Multiplatform 專案的底層運作原理至關重要。

`dependsOn` 是兩個 Kotlin 原始碼集之間特有的 Kotlin 關係。這可以是通用原始碼集與平台特定原始碼集之間的連接，例如：當 `jvmMain` 原始碼集依賴於 `commonMain`、`iosArm64Main` 依賴於 `iosMain` 等。

以 Kotlin 原始碼集 `A` 和 `B` 為例。運算式 `A.dependsOn(B)` 告知 Kotlin：

1. `A` 可以觀察到來自 `B` 的 API，包括內部宣告。
2. `A` 可以為來自 `B` 的預期宣告提供實際實作。這是一個必要且充分條件，因為當且僅當 `A.dependsOn(B)` 直接或間接成立時，`A` 才能為 `B` 提供 `actual`。
3. 除了自己的目標外，`B` 也應編譯到 `A` 所編譯的所有目標。
4. `A` 繼承了 `B` 的所有常規相依性。

`dependsOn` 關係建立了一個稱為原始碼集階層結構的樹狀結構。以下是一個典型的行動開發專案範例，包含 `android`、`iosArm64`（iPhone 裝置）和 `iosSimulatorArm64`（Apple 晶片 Mac 上的 iPhone 模擬器）：

![DependsOn 樹狀結構](dependson-tree-diagram.svg){width=700}

箭頭表示 `dependsOn` 關係。
這些關係在編譯平台二進位檔案期間會被保留。這就是 Kotlin 如何理解 `iosMain` 應該看到來自 `commonMain` 的 API，但不應看到來自 `iosArm64Main` 的 API：

![編譯期間的 DependsOn 關係](dependson-relations-diagram.svg){width=700}

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

* 此範例顯示了如何在組建指令碼中定義 `dependsOn` 關係。然而，Kotlin Gradle 外掛程式預設會建立原始碼集並設定這些關係，因此您不需要手動執行此操作。
* 在組建指令碼中，`dependsOn` 關係是與 `dependencies {}` 區塊分開宣告的。這是因為 `dependsOn` 不是普通的相依性；相反，它是 Kotlin 原始碼集之間為了在不同目標間共用程式碼所必需的特定關係。

您不能使用 `dependsOn` 來宣告對已發佈程式庫或另一個 Gradle 專案的常規相依性。
例如，您不能將 `commonMain` 設定為依賴 `kotlinx-coroutines-core` 程式庫的 `commonMain`，也不能呼叫 `commonTest.dependsOn(commonMain)`。

### 宣告自訂原始碼集

在某些情況下，您可能需要在專案中建立自訂的中間原始碼集。
假設一個專案編譯至 JVM、JS 和 Linux，而您只想在 JVM 和 JS 之間共用某些原始碼。
在這種情況下，您應該為這對目標尋找一個特定的原始碼集，如[多平台專案結構的基礎知識](multiplatform-discover-project.md)中所述。

Kotlin 不會自動建立此類原始碼集。這意味著您應該使用 `by creating` 建構手動建立它：

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

然而，Kotlin 仍然不知道如何處理或編譯這個原始碼集。如果您畫一張圖，這個原始碼集將會是孤立的，且沒有任何目標標籤：

![缺少 dependsOn 關係](missing-dependson-diagram.svg){width=700}

若要修正此問題，請透過加入多個 `dependsOn` 關係將 `jvmAndJsMain` 納入階層結構中：

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        val jvmAndJsMain by creating {
            // 不要忘記加入對 commonMain 的 dependsOn
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

在這裡，`jvmMain.dependsOn(jvmAndJsMain)` 將 JVM 目標加入到 `jvmAndJsMain`，而 `jsMain.dependsOn(jvmAndJsMain)` 則將 JS 目標加入到 `jvmAndJsMain`。

最終的專案結構如下所示：

![最終專案結構](final-structure-diagram.svg){width=700}

> 手動配置 `dependsOn` 關係會停用預設階層結構範本的自動套用。
> 請參閱[其他配置](multiplatform-hierarchy.md#additional-configuration)以了解有關此類情況以及如何處理它們的更多資訊。
>
{style="note"}

## 對其他程式庫或專案的相依性

在多平台專案中，您可以對已發佈的程式庫或另一個 Gradle 專案設定常規相依性。

Kotlin Multiplatform 通常以典型的 Gradle 方式宣告相依性。與 Gradle 類似，您需要：

* 在組建指令碼中使用 `dependencies {}` 區塊。
* 為相依性選擇適當的範圍，例如 `implementation` 或 `api`。
* 如果相依性發佈在儲存庫中，則透過指定其座標來參照它，例如 `"com.google.guava:guava:32.1.2-jre"`；如果它是同一個組建中的 Gradle 專案，則透過指定其路徑來參照它，例如 `project(":utils:concurrency")`。

多平台專案中的相依性配置具有一些特殊功能。每個 Kotlin 原始碼集都有自己的 `dependencies {}` 區塊。這允許您在平台特定的原始碼集中宣告平台特定的相依性：

```kotlin
kotlin {
    // 目標宣告
    sourceSets {
        jvmMain.dependencies {
            // 這是 jvmMain 的相依性，因此可以加入 JVM 特定的相依性
            implementation("com.google.guava:guava:32.1.2-jre")
        }
    }
}
```

通用相依性則較為複雜。考慮一個宣告了對多平台程式庫（例如 `kotlinx.coroutines`）相依性的多平台專案：

```kotlin
kotlin {
    android()     // Android
    iosArm64()          // iPhone 裝置 
    iosSimulatorArm64() // iPhone 模擬器（Apple 晶片 Mac）

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
        }
    }
}
```

相依性解析中有三個重要概念：

1. 多平台相依性會沿著 `dependsOn` 結構向下傳播。當您在 `commonMain` 中加入相依性時，它會自動加入到所有直接或間接在 `commonMain` 中宣告 `dependsOn` 關係的原始碼集。

   在這種情況下，該相依性確實被自動加入到所有的 `*Main` 原始碼集中：`iosMain`、`jvmMain`、`iosSimulatorArm64Main` 和 `iosArm64Main`。所有這些原始碼集都從 `commonMain` 原始碼集繼承了 `kotlin-coroutines-core` 相依性，因此您不需要在所有原始碼集中手動複製並貼上它：

   ![多平台相依性的傳播](dependency-propagation-diagram.svg){width=700}

   > 傳播機制允許您透過選擇特定的原始碼集來挑選將接收宣告相依性的範圍。
   > 例如，如果您想在 iOS 上使用 `kotlinx.coroutines` 但不想在 Android 上使用，您可以僅將此相依性加入到 `iosMain` 中。
   >
   {style="tip"}

2. 「原始碼集 → 多平台程式庫」相依性（如上方的 `commonMain` 到 `org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3`）代表了相依性解析的中間狀態。解析的最終狀態始終由「原始碼集 → 原始碼集」相依性代表。

   > 最終的「原始碼集 → 原始碼集」相依性不是 `dependsOn` 關係。
   >
   {style="note"}

   為了推斷細粒度的「原始碼集 → 原始碼集」相依性，Kotlin 會讀取與每個多平台程式庫一起發佈的原始碼集結構。在此步驟之後，每個程式庫在內部將不再被視為一個整體，而是作為其原始碼集的集合。請參閱 `kotlinx-coroutines-core` 的範例：

   ![原始碼集結構序列化](structure-serialization-diagram.svg){width=700}

3. Kotlin 獲取每個相依性關係，並將其解析為來自相依性程式庫的原始碼集集合。
   該集合中的每個相依性原始碼集都必須具有 *相容目標*。如果相依性原始碼集編譯到的目標 *至少與使用端原始碼集相同*，則該相依性原始碼集具有相容目標。

   以範例專案中的 `commonMain` 為例，它編譯到 `android`、`iosArm64` 和 `iosSimulatorArm64`：

    * 首先，它解析對 `kotlinx-coroutines-core.commonMain` 的相依性。這是因為 `kotlinx-coroutines-core` 編譯到所有可能的 Kotlin 目標。因此，其 `commonMain` 編譯到所有可能的目標，包括所需的 `android`、`iosArm64` 和 `iosSimulatorArm64`。
    * 其次，`commonMain` 依賴於 `kotlinx-coroutines-core.concurrentMain`。
      由於 `kotlinx-coroutines-core` 中的 `concurrentMain` 編譯到除 JS 之外的所有目標，因此它與使用端專案的 `commonMain` 目標相匹配。

   然而，來自 coroutines 的 `iosArm64Main` 等原始碼集與使用端的 `commonMain` 不相容。
   即使 `iosArm64Main` 編譯到 `commonMain` 的目標之一（即 `iosArm64`），它也不會編譯到 `android` 或 `iosSimulatorArm64`。

   相依性解析的結果直接影響 `kotlinx-coroutines-core` 中哪些程式碼是可見的：

   ![通用程式碼中 JVM 特定 API 的錯誤](dependency-resolution-error.png){width=700}

### 跨原始碼集對齊通用相依性的版本

在 Kotlin Multiplatform 專案中，通用原始碼集會被編譯多次以產出 klib，並作為每個配置的[編譯](multiplatform-configure-compilations.md)的一部分。為了產出一致的二進位檔案，通用程式碼每次都應針對相同版本的多平台相依性進行編譯。
Kotlin Gradle 外掛程式有助於對齊這些相依性，確保每個原始碼集的有效相依性版本相同。

在上面的範例中，假設您想將 `androidx.navigation:navigation-compose:2.7.7` 相依性加入到 `androidMain` 原始碼集中。您的專案明確為 `commonMain` 原始碼集宣告了 `kotlinx-coroutines-core:1.7.3` 相依性，但版本為 2.7.7 的 Compose Navigation 程式庫需要 Kotlin coroutines 1.8.0 或更新版本。

由於 `commonMain` 和 `androidMain` 是在一起編譯的，Kotlin Gradle 外掛程式會在這兩個版本的 coroutines 程式庫之間進行選擇，並將 `kotlinx-coroutines-core:1.8.0` 套用到 `commonMain` 原始碼集。但為了使通用程式碼在所有配置的目標中編譯一致，iOS 原始碼集也需要被約束在相同的相依性版本。
因此 Gradle 也會將 `kotlinx.coroutines-*:1.8.0` 相依性傳播到 `iosMain` 原始碼集。

![*Main 原始碼集之間的相依性對齊](multiplatform-source-set-dependency-alignment.svg){width=700}

相依性會在 `*Main` 原始碼集和 [`*Test` 原始碼集](multiplatform-discover-project.md#integration-with-tests)之間分別進行對齊。
`*Test` 原始碼集的 Gradle 配置包含 `*Main` 原始碼集的所有相依性，但反之則不然。
因此，您可以使用較新版本的程式庫測試您的專案，而不會影響您的主程式碼。

例如，您的 `*Main` 原始碼集中有 Kotlin coroutines 1.7.3 相依性，並傳播到專案中的每個原始碼集。
然而，在 `iosTest` 原始碼集中，您決定將版本升級到 1.8.0 以測試新的程式庫發行版。
根據相同的演算法，此相依性將傳播到整個 `*Test` 原始碼集樹中，因此每個 `*Test` 原始碼集都將使用 `kotlinx.coroutines-*:1.8.0` 相依性進行編譯。

![測試原始碼集與主原始碼集分開解析相依性](test-main-source-set-dependency-alignment.svg)

## 編譯

與單平台專案不同，Kotlin Multiplatform 專案需要多次啟動編譯器才能建置所有產物。
每次啟動編譯器都是一次 *Kotlin 編譯*。

例如，以下是前述 Kotlin 編譯期間如何產生 iPhone 裝置二進位檔案的過程：

![iOS 的 Kotlin 編譯](ios-compilation-diagram.svg){width=700}

Kotlin 編譯按目標進行分組。預設情況下，Kotlin 為每個目標建立兩個編譯：
用於生產原始碼的 `main` 編譯，以及用於測試原始碼的 `test` 編譯。

組建指令碼中存取編譯的方式類似。您首先選擇一個 Kotlin 目標，
然後存取內部的 `compilations` 容器，最後透過名稱選擇所需的編譯：

```kotlin
kotlin {
    // 宣告並配置 JVM 目標
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}