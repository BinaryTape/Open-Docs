[//]: # (title: Kotlin %kotlinEapVersion% 的新功能)

<primary-label ref="eap"/>

<web-summary>閱讀 Kotlin 早期體驗計劃 (EAP) 版本說明，並在正式發佈前試用最新的實驗性 Kotlin 功能。</web-summary>

_[發佈日期：%kotlinEapReleaseDate%](eap.md#build-details)_

> 本文件並未涵蓋早期體驗計劃 (EAP) 發佈版的所有功能，但重點介紹了一些重大改進。
>
> 請參閱 [GitHub 變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%) 中的完整變更列表。
>
{style="note"}

Kotlin %kotlinEapVersion% 版本已發佈！以下是此 EAP 版本的一些詳細資訊：

* **Kotlin 編譯器外掛程式**：[Lombok 進入 Alpha 階段](#lombok-is-now-alpha) 以及 [在 `kotlin.plugin.jpa` 外掛程式中改進的 JPA 支援](#improved-jpa-support-in-the-kotlin-plugin-jpa-plugin)
* **Kotlin/Native**：[適用於 C 和 Objective-C 程式庫的新互通性模式](#kotlin-native-new-interoperability-mode-for-c-or-objective-c-libraries)
* **Gradle**：[與 Gradle 9.3.0 的相容性](#compatibility-with-gradle-9-3-0) 以及 [Kotlin/JVM 編譯預設使用 BTA](#kotlin-jvm-compilation-uses-build-tools-api-by-default)
* **Maven**：[針對 Kotlin 專案的簡化設定](#maven-simplified-setup-for-kotlin-projects)
* **標準函式庫**：[用於建立 `Map.Entry` 不可變副本的新 API](#standard-library-new-api-for-creating-immutable-copies-of-map-entry)

> 有關 Kotlin 發佈週期的資訊，請參閱 [Kotlin 發佈程序](releases.md)。
>
{style="tip"}

## IDE 支援

支援 %kotlinEapVersion% 的 Kotlin 外掛程式已隨附在最新版本的 IntelliJ IDEA 和 Android Studio 中。
您不需要更新 IDE 中的 Kotlin 外掛程式。
您只需要在建置指令碼中[將 Kotlin 版本更改](configure-build-for-eap.md)為 %kotlinEapVersion%。

詳情請參閱[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## Kotlin 編譯器外掛程式

Kotlin %kotlinEapVersion% 為 Lombok 和 `kotlin.plugin.jpa` 編譯器外掛程式帶來了重要的更新。

### Lombok 現在進入 Alpha 階段
<primary-label ref="alpha"/>

Kotlin 1.5.20 引入了實驗性的 [Lombok 編譯器外掛程式](lombok.md)，讓您可以在混合使用 Kotlin 和 Java 程式碼的模組中產生並使用 [Java 的 Lombok 宣告](https://projectlombok.org/)。

在 %kotlinEapVersion% 中，Lombok 編譯器外掛程式晉升為 [Alpha](components-stability.md#stability-levels-explained) 階段，因為我們計劃將此功能產品化，但它目前仍在開發中。

### 改進的 JPA 支援在 `kotlin.plugin.jpa` 外掛程式中

除了現有的 [`no-arg`](no-arg-plugin.md) 支援外，`kotlin.plugin.jpa` 外掛程式現在會自動套用 [`all-open`](all-open-plugin.md) 編譯器外掛程式，並使用新增的內建 JPA 預設設定。

在此之前，使用 `kotlin("plugin.jpa")` 僅會啟用帶有 JPA 預設設定的 `no-arg` 外掛程式。而在處理 JPA 實體時，您必須明確套用並配置 `all-open` 外掛程式，才能讓 JPA 實體類別成為 `open`。

從 Kotlin %kotlinEapVersion% 開始：

* `all-open` 編譯器外掛程式提供了一個 JPA 預設設定。
* Gradle 的 `org.jetbrains.kotlin.plugin.jpa` 外掛程式會自動套用已啟用 JPA 預設設定的 `org.jetbrains.kotlin.plugin.all-open` 外掛程式。
* [Maven JPA 設定](no-arg-plugin.md#jpa-support) 預設會啟用帶有 JPA 預設設定的 `all-open`。
* Maven 相依性 `org.jetbrains.kotlin:kotlin-maven-noarg` 現在會隱含包含 `org.jetbrains.kotlin:kotlin-maven-allopen`，因此您不再需要在 `<plugin><dependencies>` 區塊中明確新增它。

因此，標註了以下註解的 JPA 實體
將自動被視為 `open`，並且無需額外配置即可獲得無引數建構函式：

* `javax.persistence.Entity`
* `javax.persistence.Embeddable`
* `javax.persistence.MappedSuperclass`
* `jakarta.persistence.Entity`
* `jakarta.persistence.Embeddable`
* `jakarta.persistence.MappedSuperclass`

這項變更簡化了組建組態，並改善了在 JPA 架構中使用 Kotlin 的開箱即用體驗。

## Kotlin/Native：適用於 C 或 Objective-C 程式庫的新互通性模式
<primary-label ref="experimental-opt-in"/>

如果您在 Kotlin Multiplatform 程式庫或應用程式中使用 C 或 Objective-C 程式庫，我們邀請您測試新的互通性模式並分享結果。

一般而言，Kotlin/Native 支援將 C 和 Objective-C 程式庫匯入 Kotlin。然而，對於 Kotlin Multiplatform 程式庫，此功能目前[受到](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) KMP 與舊版本編譯器相容性問題的影響。

換句話說，如果您發佈了一個使用某個 Kotlin 版本編譯的 Kotlin Multiplatform 程式庫，匯入 C 或 Objective-C 程式庫可能會導致該 Kotlin 程式庫無法在具有較早 Kotlin 版本的專案中使用。

為了理系此問題及其他問題，Kotlin 團隊一直在修訂底層使用的互通性機制。從 Kotlin 2.3.20-Beta1 開始，您可以透過編譯器選項試用新模式。

#### 如何試用

1. 在您的 Gradle 建置檔案中，檢查是否具有 `cinterops {}` 區塊或 `pod()` 相依性。如果存在這些內容，表示您的專案使用了 C 或 Objective-C 程式庫。
2. 確保您的專案使用 `2.3.20-Beta1` 或更高版本。
3. 在同一個建置檔案中，將 `-Xccall-mode` 編譯器選項新增至 cinterop 工具調用中：

    ```kotlin
    kotlin {
        targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
            compilations.configureEach {
                cinterops.configureEach {
                    extraOpts += listOf("-Xccall-mode", "direct")
                }
            }
        }
    }
    ```

4. 像平常一樣執行單元測試、應用程式等，來建置並測試您的專案。

    您還可以使用 `--continue` 選項，讓 Gradle 在失敗後繼續執行任務，幫助一次發現更多問題。

> 請**不要**發佈使用新互通性模式編譯的程式庫，因為它目前仍處於[實驗性](components-stability.md#stability-levels-explained)階段。
>
{style="warning"}

#### 回報您的結果

在大多數情況下，新的互通性模式應該是可以直接替換的。
我們計劃最終預設啟用它。但為了達成這個目標，我們需要確保它的運作盡可能完善，並在廣泛的專案上進行測試，因為：

* 新模式尚不支援某些 C 和 Objective-C 宣告（主要是因為它們與相容性問題發生衝突）。我們希望更深入地瞭解這在現實世界中的影響，並據此排定未來步驟的優先順序。
* 可能存在我們沒有考慮到的錯誤或情況。測試具有眾多交互特性的語言具有挑戰性，而測試語言之間（各自具有一套獨特的特性）的交互更是如此。

幫助我們檢視現實世界的專案並識別具有挑戰性的案例。
無論您是否遇到任何問題，請在[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-83218)的評論中分享您的結果。

## Gradle

Kotlin %kotlinEapVersion% 與新版本的 Gradle 相容，並且包含 Kotlin Gradle 外掛程式中 Kotlin/JVM 編譯的變更。

### 與 Gradle 9.3.0 的相容性

Kotlin %kotlinEapVersion% 與 Gradle 7.6.3 至 9.3.0 完全相容。您也可以使用最高到最新發佈版本的 Gradle 版本。但是，請注意，這樣做可能會導致棄用警告，且某些新的 Gradle 功能可能無法運作。

### Kotlin/JVM 編譯預設使用 Build tools API
<primary-label ref="experimental-general"/>

在 Kotlin %kotlinEapVersion% 中，Kotlin Gradle 外掛程式中的 Kotlin/JVM 編譯預設使用 [Build tools API](build-tools-api.md) (BTA)。內部編譯基礎結構的這項變更使得為 Kotlin 編譯器開發建置工具支援的速度更快。

如果您發現任何問題，請在我們的[問題追蹤器](https://youtrack.jetbrains.com/newIssue?project=KT&summary=Kotlin+Gradle+plugin+BTA+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+kgp-bta-migration)中分享您的回饋。

## Maven：針對 Kotlin 專案的簡化設定

Kotlin %kotlinEapVersion% 使得在 Maven 專案中設定 Kotlin 變得更加容易。現在 Kotlin 支援自動配置原始碼根目錄和 Kotlin 的標準函式庫。

有了新的配置，當您使用 Maven 建置系統建立新的 Kotlin 專案，或將 Kotlin 引入現有的 Java Maven 專案時，您不需要手動建立原始碼根目錄或在 POM 建置檔案中新增 `kotlin-stdlib` 相依性。

### 如何啟用

在您的 `pom.xml` 檔案中，將 `<extensions>true</extensions>` 新增至 Kotlin Maven 外掛程式的 `<build><plugins>` 區段：

```xml
<build>
    <plugins>
         <plugin>
             <groupId>org.jetbrains.kotlin</groupId>
             <artifactId>kotlin-maven-plugin</artifactId>
             <version>%kotlinEapVersion%</version>
             <extensions>true</extensions> <!-- 新增此擴充功能  -->
         </plugin>
    </plugins>
</build>
```

新的擴充功能會自動：

* 建立 `src/main/kotlin` 和 `src/test/kotlin` 目錄，而不更改現有的 Kotlin 或 Java 原始碼根目錄。
* 除非已經定義，否則會新增 `kotlin-stdlib` 相依性。

您也可以選擇不自動新增 Kotlin 的標準函式庫。為此，請將以下內容新增至 `<properties>` 區段：

```xml
<project>
    <properties>
        <!-- 透過屬性停用智慧預設 -->
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>
    </properties>
</project>
```

有關 Kotlin 專案中 Maven 配置的更多資訊，請參閱[配置 Maven 專案](maven-configure-project.md)。

## 標準函式庫：用於建立 `Map.Entry` 不可變副本的新 API
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% 引入了 `Map.Entry.copy()` 擴充方法，用於建立 [`Map.Entry`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/-entry/) 的不可變副本。
此方法讓您可以在修改 map 後，透過先複製從 [`Map.entries`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/entries.html) 取得的項目來重複使用它們。

`Map.Entry.copy()` 處於[實驗性](components-stability.md#stability-levels-explained)階段。若要選擇試用，請使用 `@OptIn(ExperimentalStdlibApi::class)` 註解或編譯器選項 `-opt-in=kotlin.ExperimentalStdlibApi`。

以下是使用 `Map.Entry.copy()` 從可變 map 中移除項目的範例：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val map = mutableMapOf(1 to 1, 2 to 2, 3 to 3, 4 to 4)

    val toRemove = map.entries
        .filter { it.key % 2 == 0 }
        .map { it.copy() }

    map.entries.removeAll(toRemove)

    println("map = $map")
    // map = {1=1, 3=3}
}