[//]: # (title: 建置工具 API)

<primary-label ref="experimental-general"/>

<tldr>目前，BTA 僅支援 Kotlin/JVM。</tldr>

Kotlin 2.2.0 引入了實驗性的建置工具 API (Build tools API, BTA)，簡化了建置系統與 Kotlin 編譯器整合的方式。

以前，在建置系統中加入完整的 Kotlin 支援（例如增量編譯、Kotlin 編譯器外掛、守護行程和 Kotlin 多平台）需要付出巨大的努力。BTA 旨在透過提供建置系統和 Kotlin 編譯器生態系之間的統一 API 來降低這種複雜性。

BTA 定義了一個單一進入點，建置系統可以實作。這消除了深度整合內部編譯器細節的需求。

> BTA 本身尚未公開可用，無法直接在您自己的建置工具整合中使用。
> 如果您對此提案感興趣或想分享回饋，請參閱 [KEEP](https://github.com/Kotlin/KEEP/issues/421)。
> 請在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76255) 中追蹤其實作狀態。
> 
{style="warning"}

## 與 Gradle 整合

Kotlin Gradle 外掛 (KGP) 對 BTA 具有實驗性支援，您需要選擇啟用才能使用它。

> 我們很感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56574) 中分享您使用 KGP 的體驗回饋。
> 
{style="note"}

### 如何啟用

將以下屬性加入到您的 `gradle.properties` 檔案中：

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```

### 設定不同的編譯器版本

透過 BTA，您現在可以使用與 KGP 使用的版本不同的 Kotlin 編譯器版本。這在以下情況很有用：

*   您想嘗試新的 Kotlin 功能，但尚未更新您的建置指令碼。
*   您需要最新的外掛修正，但目前想保留在舊的編譯器版本上。

以下是如何在您的 `build.gradle.kts` 檔案中設定此項的範例：

```kotlin
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class)
    compilerVersion.set("2.1.21") // <-- different version than 2.2.0
}
```

#### 相容的 Kotlin 編譯器和 KGP 版本

BTA 支援：

*   之前三個主要的 Kotlin 編譯器版本。
*   向前一個主要版本。

例如，在 KGP 2.2.0 中，支援的 Kotlin 編譯器版本為：

*   1.9.25
*   2.0.x
*   2.1.x
*   2.2.x
*   2.3.x

#### 限制

將不同的編譯器版本與編譯器外掛一起使用可能會導致 Kotlin 編譯器例外。Kotlin 團隊計畫在未來的 Kotlin 版本中解決此問題。

### 啟用「in process」策略的增量編譯

KGP 支援三種 [編譯器執行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。通常，「in-process」策略（它在 Gradle 守護行程中執行編譯器）不支援增量編譯。

透過 BTA，「in-process」策略現在支援增量編譯。若要啟用它，請將以下屬性加入到您的 `gradle.properties` 檔案中：

```kotlin
kotlin.compiler.execution.strategy=in-process
```

## 與 Maven 整合

BTA 使 [`kotlin-maven-plugin`](maven.md) 能夠支援 [Kotlin 守護行程](kotlin-daemon.md)，這是預設的 [編譯器執行策略](maven-compile-package.md#choose-execution-strategy)。`kotlin-maven-plugin` 預設使用 BTA，因此無需進行任何配置。

BTA 使得未來能夠提供更多功能，例如 [增量編譯穩定化](https://youtrack.jetbrains.com/issue/KT-77086)。