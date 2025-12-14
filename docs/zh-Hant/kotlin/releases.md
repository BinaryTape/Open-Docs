[//]: # (title: Kotlin 發布版本)

<tldr>
    <p>最新 Kotlin 版本：<strong>%kotlinVersion%</strong></p>
    <p>詳情請參閱<a href="%kotlinLatestWhatsnew%">Kotlin 2.2.20 新功能</a> <!--and find the bug fix details in the <a href="%kotlinLatestUrl%">changelog</a>-->。</p>
</tldr>

自 Kotlin 2.0.0 起，我們發布以下類型的版本：

*   _語言發布版本_ (2._x_._0_) 帶來語言的主要變更並包含工具更新。每 6 個月發布一次。
*   _工具發布版本_ (2._x_._20_) 在語言發布版本之間發布，包含工具更新、
    效能改進和錯誤修正。在相應的 _語言發布版本_ 後 3 個月內發布。
*   _錯誤修正發布版本_ (2._x_._yz_) 包含 _工具發布版本_ 的錯誤修正。這些發布版本沒有確切的發布排程。

<!-- TODO: uncomment with 2.1.0 release
> For example, for the feature release 1.8.0, we had only one tooling release 1.8.20,
> and several bugfix releases including 1.8.21, 1.8.22.
>
{style="tip"}
-->

對於每個語言和工具發布版本，我們還會發布數個預覽 (_EAP_) 版本，供您在新功能發布前試用。詳情請參閱 [搶先體驗預覽](eap.md)。

> 若要接收新 Kotlin 發布版本的通知，請訂閱 [Kotlin 電子報](https://lp.jetbrains.com/subscribe-to-kotlin-news/)、
> 追蹤 [Kotlin 在 X 平台](https://x.com/kotlin)，
> 或在 [Kotlin GitHub 儲存庫](https://github.com/JetBrains/kotlin) 上啟用 **Watch | Custom | Releases** 選項。
>
{style="note"}

## 即將推出的 Kotlin 發布版本

以下是即將推出的穩定版 Kotlin 發布版本的大致排程：

*   **2.3.0**：規劃於 2025 年 12 月 – 2026 年 1 月
*   **2.3.20**：規劃於 2026 年 3 月 – 4 月

## 更新至新 Kotlin 版本

若要將您的專案升級到新發布版本，請更新您建構系統中的 Kotlin 版本。

### Gradle

若要更新至 Kotlin %kotlinVersion%，請變更 `build.gradle(.kts)` 檔案中的 Kotlin Gradle 外掛程式版本：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    kotlin("<...>") version "%kotlinVersion%"
    // For example, if your target environment is JVM:
    // kotlin("jvm") version "%kotlinVersion%"
    // If your target is Kotlin Multiplatform:
    // kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
    // For example, if your target environment is JVM:
    // id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
    // If your target is Kotlin Multiplatform:
    // id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

如果您有使用較早 Kotlin 版本建立的專案，請檢查是否也需要 [更新任何 kotlinx 函式庫的版本](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)。

如果您正在移轉到新的語言發布版本，Kotlin 外掛程式的移轉工具將協助您完成此過程。

> 若要深入了解如何在專案中使用 Gradle，請參閱 [設定 Gradle 專案](gradle-configure-project.md)。
>
{style="tip"}

### Maven

若要更新至 Kotlin %kotlinVersion%，請變更 `pom.xml` 檔案中的版本：

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

或者，您可以變更 `pom.xml` 檔案中的 `kotlin-maven-plugin` 版本：

```xml
<plugins>
    <plugin>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-maven-plugin</artifactId>
        <version>%kotlinVersion%</version>
    </plugin>
</plugins>
```

如果您有使用較早 Kotlin 版本建立的專案，請檢查是否也需要 [更新任何 kotlinx 函式庫的版本](maven.md#dependency-on-a-kotlinx-library)。

> 若要深入了解如何在專案中使用 Maven，請參閱 [Maven](maven.md)。
>
{style="tip"}

## IDE 支援

Kotlin 在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/kotlin/get-started) 中擁有完整的開箱即用支援，其中包含由 JetBrains 開發的官方 Kotlin 外掛程式。

IntelliJ IDEA 和 Android Studio 中的 K2 模式使用 K2 編譯器來改進程式碼分析、程式碼補齊和語法高亮顯示。

IntelliJ IDEA 2025.3 及更高版本始終啟用 K2 模式。

在 Android Studio 中，您可以從 2024.1 開始依照以下步驟啟用 K2 模式：

1.  前往 **Settings** | **Languages & Frameworks** | **Kotlin**。
2.  選取 **Enable K2 mode** 選項。

在 [我們的部落格](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/) 中深入了解 K2 模式。

## Kotlin 發布版本相容性

深入了解 [Kotlin 發布版本類型及其相容性](kotlin-evolution-principles.md#language-and-tooling-releases)

## 發布詳情

下表列出了最新 Kotlin 發布版本的詳情：

> 您也可以嘗試 [Kotlin 的搶先體驗預覽 (EAP) 版本](eap.md#build-details)。
>
{style="tip"}

<table>
    <tr>
        <th>建置資訊</th>
        <th>建置亮點</th>
    </tr>
    <tr>
        <td><strong>2.2.21</strong>
            <p>發布日期：<strong>2025 年 10 月 23 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.21" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個工具發布版本，包含對 Xcode 26 的支援，以及其他改進和錯誤修正。</p>
            <p>詳情請參閱<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.21">變更日誌</a>。</p>
    </td>
    </tr>
    <tr>
        <td><strong>2.2.20</strong>
            <p>發布日期：<strong>2025 年 9 月 10 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.20" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 2.2.0 的工具發布版本，包含 Web 開發的重要變更及其他改進。</p>
            <p>詳情請參閱<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.20">變更日誌</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.2.10</strong>
            <p>發布日期：<strong>2025 年 8 月 14 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.10" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 2.2.0 的錯誤修正發布版本。</p>
            <p>詳情請參閱<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.10">變更日誌</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.2.0</strong>
            <p>發布日期：<strong>2025 年 6 月 23 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.0" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個語言發布版本，包含新穩定語言功能、工具更新、針對不同平台的效能改進以及重要修正。</p>
            <p>詳情請參閱<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.0">變更日誌</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.1.21</strong>
            <p>發布日期：<strong>2025 年 5 月 13 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.21" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 2.1.20 的錯誤修正發布版本。</p>
            <p>詳情請參閱<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.21">變更日誌</a>。</p>
        </td>
    </tr>
   <tr>
        <td><strong>2.1.20</strong>
            <p>發布日期：<strong>2025 年 3 月 20 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.20" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
           <p>Kotlin 2.1.0 的工具發布版本，包含新的實驗性功能、效能改進和錯誤修正。</p>
            <p>在<a href="whatsnew2120.md" target="_blank">Kotlin 2.1.20 新功能</a>中深入了解 Kotlin 2.1.20。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.1.10</strong>
            <p>發布日期：<strong>2025 年 1 月 27 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 2.1.0 的錯誤修正發布版本。</p>
            <p>詳情請參閱<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10">變更日誌</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.1.0</strong>
            <p>發布日期：<strong>2024 年 11 月 27 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.0" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個語言發布版本，引入新語言功能。</p>
            <p>在<a href="whatsnew21.md" target="_blank">Kotlin 2.1.0 新功能</a>中深入了解 Kotlin 2.1.0。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.21</strong>
            <p>發布日期：<strong>2024 年 10 月 10 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 2.0.20 的錯誤修正發布版本。</p>
            <p>詳情請參閱<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21">變更日誌</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.20</strong>
            <p>發布日期：<strong>2024 年 8 月 22 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.20" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
           <p>Kotlin 2.0.0 的工具發布版本，包含效能改進和錯誤修正。功能還包括
              Kotlin/Native 垃圾收集器中的並行標記、Kotlin 通用標準函式庫中的 UUID 支援、
              Compose 編譯器更新以及支援高達 Gradle 8.8。
            </p>
            <p>在<a href="whatsnew2020.md" target="_blank">Kotlin 2.0.20 新功能</a>中深入了解 Kotlin 2.0.20。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.10</strong>
            <p>發布日期：<strong>2024 年 8 月 6 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.10" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 2.0.0 的錯誤修正發布版本。</p>
            <p>在<a href="whatsnew20.md" target="_blank">Kotlin 2.0.0 新功能</a>中深入了解 Kotlin 2.0.0。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.0</strong>
            <p>發布日期：<strong>2024 年 5 月 21 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.0" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個語言發布版本，包含穩定版 Kotlin K2 編譯器。</p>
            <p>在<a href="whatsnew20.md" target="_blank">Kotlin 2.0.0 新功能</a>中深入了解 Kotlin 2.0.0。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.25</strong>
            <p>發布日期：<strong>2024 年 7 月 19 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.25" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20、1.9.21、1.9.22、1.9.23 和 1.9.24 的錯誤修正發布版本。</p>
            <p>在<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 新功能</a>中深入了解 Kotlin 1.9.20。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.24</strong>
            <p>發布日期：<strong>2024 年 5 月 7 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.24" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20、1.9.21、1.9.22 和 1.9.23 的錯誤修正發布版本。</p>
            <p>在<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 新功能</a>中深入了解 Kotlin 1.9.20。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.23</strong>
            <p>發布日期：<strong>2024 年 3 月 7 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.23" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20、1.9.21 和 1.9.22 的錯誤修正發布版本。</p>
            <p>在<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 新功能</a>中深入了解 Kotlin 1.9.20。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.22</strong>
            <p>發布日期：<strong>2023 年 12 月 21 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.22" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20 和 1.9.21 的錯誤修正發布版本。</p>
            <p>在<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 新功能</a>中深入了解 Kotlin 1.9.20。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.21</strong>
            <p>發布日期：<strong>2023 年 11 月 23 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.21" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20 的錯誤修正發布版本。</p>
            <p>在<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 新功能</a>中深入了解 Kotlin 1.9.20。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.20</strong>
            <p>發布日期：<strong>2023 年 11 月 1 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.20" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個功能發布版本，包含 Beta 版 Kotlin K2 編譯器和穩定版 Kotlin Multiplatform。</p>
            <p>深入了解：</p>
            <list>
                <li><a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.10</strong>
            <p>發布日期：<strong>2023 年 8 月 23 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.10" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.0 的錯誤修正發布版本。</p>
            <p>在<a href="whatsnew19.md" target="_blank">Kotlin 1.9.0 新功能</a>中深入了解 Kotlin 1.9.0。</p>
            <note>對於 Android Studio Giraffe 和 Hedgehog，Kotlin 外掛程式 1.9.10 將隨即將推出的 Android Studios 更新提供。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.0</strong>
            <p>發布日期：<strong>2023 年 7 月 6 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個功能發布版本，包含 Kotlin K2 編譯器更新、新的 enum class 值函式、
                用於開放式範圍的新運算子、Kotlin Multiplatform 中 Gradle 配置快取的預覽、
                Kotlin Multiplatform 中 Android 目標支援的變更、Kotlin/Native 中自訂記憶體分配器的預覽。
            </p>
            <p>深入了解：</p>
            <list>
                <li><a href="whatsnew19.md" target="_blank">Kotlin 1.9.0 新功能</a></li>
                <li><a href="https://www.youtube.com/embed/fvwTZc-dxsM" target="_blank">Kotlin YouTube 影片新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.22</strong>
            <p>發布日期：<strong>2023 年 6 月 8 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.22" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.20 的錯誤修正發布版本。</p>
            <p>在<a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20 新功能</a>中深入了解 Kotlin 1.8.20。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.21</strong>
            <p>發布日期：<strong>2023 年 4 月 25 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.21" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.20 的錯誤修正發布版本。</p>
            <p>在<a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20 新功能</a>中深入了解 Kotlin 1.8.20。</p>
            <note>對於 Android Studio Flamingo 和 Giraffe，Kotlin 外掛程式 1.8.21 將隨即將推出的 Android Studios 更新提供。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.20</strong>
            <p>發布日期：<strong>2023 年 4 月 3 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.20" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個功能發布版本，包含 Kotlin K2 編譯器更新、stdlib 中的 AutoCloseable 介面和 Base64 編碼、
                預設啟用新的 JVM 增量編譯、新的 Kotlin/Wasm 編譯器後端。
            </p>
            <p>深入了解：</p>
            <list>
                <li><a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20 新功能</a></li>
                <li><a href="https://youtu.be/R1JpkpPzyBU" target="_blank">Kotlin YouTube 影片新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.10</strong>
            <p>發布日期：<strong>2023 年 2 月 2 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.10" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.0 的錯誤修正發布版本。</p>
            <p>深入了解<a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">Kotlin 1.8.0</a>。</p>
            <note>對於 Android Studio Electric Eel 和 Flamingo，Kotlin 外掛程式 1.8.10 將隨即將推出的 Android Studios 更新提供。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.0</strong>
            <p>發布日期：<strong>2022 年 12 月 28 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個功能發布版本，包含改進的 kotlin-reflect 效能、用於 JVM 的新遞迴複製或刪除目錄內容實驗性函式、改進的 Objective-C/Swift 互通性。</p>
            <p>深入了解：</p>
            <list>
                <li><a href="whatsnew18.md" target="_blank">Kotlin 1.8.0 新功能</a></li>
                <li><a href="compatibility-guide-18.md" target="_blank">Kotlin 1.8.0 相容性指南</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.21</strong>
            <p>發布日期：<strong>2022 年 11 月 9 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.21" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.7.20 的錯誤修正發布版本。</p>
            <p>在<a href="whatsnew1720.md" target="_blank">Kotlin 1.7.20 新功能</a>中深入了解 Kotlin 1.7.20。</p>
            <note>對於 Android Studio Dolphin、Electric Eel 和 Flamingo，Kotlin 外掛程式 1.7.21 將隨即將推出的 Android Studios 更新提供。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.20</strong>
            <p>發布日期：<strong>2022 年 9 月 29 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個增量發布版本，包含新的語言功能、Kotlin K2 編譯器中對多個編譯器外掛程式的支援、
                預設啟用新的 Kotlin/Native 記憶體管理器，以及對 Gradle 7.1 的支援。
            </p>
            <p>深入了解：</p>
            <list>
                <li><a href="whatsnew1720.md" target="_blank">Kotlin 1.7.20 新功能</a></li>
                <li><a href="https://youtu.be/OG9npowJgE8" target="_blank">Kotlin YouTube 影片新功能</a></li>
                <li><a href="compatibility-guide-1720.md" target="_blank">Kotlin 1.7.20 相容性指南</a></li>
            </list>
            <p>深入了解<a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">Kotlin 1.7.20</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.10</strong>
            <p>發布日期：<strong>2022 年 7 月 7 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.10" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.7.0 的錯誤修正發布版本。</p>
            <p>深入了解<a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Kotlin 1.7.0</a>。</p>
            <note>對於 Android Studio Dolphin (213) 和 Android Studio Electric Eel (221)，Kotlin 外掛程式 1.7.10 將隨即將推出的 Android Studios 更新提供。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.0</strong>
            <p>發布日期：<strong>2022 年 6 月 9 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個功能發布版本，包含適用於 JVM 的 Alpha 版 Kotlin K2 編譯器、穩定化的語言功能、效能改進以及演進性變更，例如穩定化實驗性 API。</p>
            <p>深入了解：</p>
            <list>
                <li><a href="whatsnew17.md" target="_blank">Kotlin 1.7.0 新功能</a></li>
                <li><a href="https://youtu.be/54WEfLKtCGk" target="_blank">Kotlin YouTube 影片新功能</a></li>
                <li><a href="compatibility-guide-17.md" target="_blank">Kotlin 1.7.0 相容性指南</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.21</strong>
            <p>發布日期：<strong>2022 年 4 月 20 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.21" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.6.20 的錯誤修正發布版本。</p>
            <p>深入了解<a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.20</strong>
            <p>發布日期：<strong>2022 年 4 月 4 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個增量發布版本，包含各種改進，例如：</p>
            <list>
                <li>Context Receiver 原型</li>
                <li>對函式式介面建構函式的可呼叫引用</li>
                <li>Kotlin/Native：新記憶體管理器的效能改進</li>
                <li>Multiplatform：預設為階層式專案結構</li>
                <li>Kotlin/JS：IR 編譯器改進</li>
                <li>Gradle：編譯器執行策略</li>
            </list>
            <p>深入了解<a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.10</strong>
            <p>發布日期：<strong>2021 年 12 月 14 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.10" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.6.0 的錯誤修正發布版本。</p>
            <p>深入了解<a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Kotlin 1.6.0</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.0</strong>
            <p>發布日期：<strong>2021 年 11 月 16 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個功能發布版本，包含新的語言功能、效能改進以及演進性變更，例如穩定化實驗性 API。</p>
            <p>深入了解：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/" target="_blank">發布部落格文章</a></li>
                <li><a href="whatsnew16.md" target="_blank">Kotlin 1.6.0 新功能</a></li>
                <li><a href="compatibility-guide-16.md" target="_blank">相容性指南</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.32</strong>
            <p>發布日期：<strong>2021 年 11 月 29 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.32" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.31 的錯誤修正發布版本。</p>
            <p>深入了解<a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.31</strong>
            <p>發布日期：<strong>2021 年 9 月 20 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.31" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.30 的錯誤修正發布版本。</p>
            <p>深入了解<a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.30</strong>
            <p>發布日期：<strong>2021 年 8 月 23 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個增量發布版本，包含各種改進，例如：</p>
            <list>
                <li>JVM 上註解類別的實例化</li>
                <li>改進的 Opt-in 要求機制和型別推斷</li>
                <li>Beta 版 Kotlin/JS IR 後端</li>
                <li>支援 Apple Silicon 目標</li>
                <li>改進的 CocoaPods 支援</li>
                <li>Gradle：Java 工具鏈支援和改進的守護程式配置</li>
            </list>
            <p>深入了解：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">發布部落格文章</a></li>
                <li><a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30 新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.21</strong>
            <p>發布日期：<strong>2021 年 7 月 13 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.21" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.20 的錯誤修正發布版本。</p>
            <p>深入了解<a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.20</strong>
            <p>發布日期：<strong>2021 年 6 月 24 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個增量發布版本，包含各種改進，例如：</p>
            <list>
                <li>預設在 JVM 上透過 `invokedynamic` 進行字串串接</li>
                <li>改進的 Lombok 支援和 JSpecify 支援</li>
                <li>Kotlin/Native：KDoc 匯出至 Objective-C 標頭，以及同一陣列中更快的 `Array.copyInto()`</li>
                <li>Gradle：註解處理器類別載入器的快取，並支援 `--parallel` Gradle 屬性</li>
                <li>跨平台 stdlib 函式行為一致</li>
            </list>
            <p>深入了解：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/" target="_blank">發布部落格文章</a></li>
                <li><a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20 新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.10</strong>
            <p>發布日期：<strong>2021 年 5 月 24 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.10" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.0 的錯誤修正發布版本。</p>
            <p>深入了解<a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">Kotlin 1.5.0</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.0</strong>
            <p>發布日期：<strong>2021 年 5 月 5 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.0" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個功能發布版本，包含新的語言功能、效能改進以及演進性變更，例如穩定化實驗性 API。</p>
            <p>深入了解：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">發布部落格文章</a></li>
                <li><a href="whatsnew15.md" target="_blank">Kotlin 1.5.0 新功能</a></li>
                <li><a href="compatibility-guide-15.md" target="_blank">相容性指南</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.32</strong>
            <p>發布日期：<strong>2021 年 3 月 22 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.32" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.30 的錯誤修正發布版本。</p>
            <p>深入了解<a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.31</strong>
            <p>發布日期：<strong>2021 年 2 月 25 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.31" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.30 的錯誤修正發布版本。</p>
            <p>深入了解<a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.30</strong>
            <p>發布日期：<strong>2021 年 2 月 3 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.30" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個增量發布版本，包含各種改進，例如：</p>
            <list>
                <li>新的 JVM 後端，目前為 Beta 版</li>
                <li>新語言功能的預覽</li>
                <li>改進的 Kotlin/Native 效能</li>
                <li>標準函式庫 API 改進</li>
            </list>
            <p>深入了解：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/" target="_blank">發布部落格文章</a></li>
                <li><a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30 新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.21</strong>
            <p>發布日期：<strong>2020 年 12 月 7 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.21" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.20 的錯誤修正發布版本。</p>
            <p>深入了解<a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.20</strong>
            <p>發布日期：<strong>2020 年 11 月 23 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個增量發布版本，包含各種改進，例如：</p>
            <list>
                <li>支援新的 JVM 功能，例如透過 `invokedynamic` 進行字串串接</li>
                <li>改進 Kotlin Multiplatform Mobile 專案的效能和異常處理</li>
                <li>JDK Path 的擴展：`Path("dir") / "file.txt"`</li>
            </list>
            <p>深入了解：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/" target="_blank">發布部落格文章</a></li>
                <li><a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20 新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.10</strong>
            <p>發布日期：<strong>2020 年 9 月 7 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.10" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.0 的錯誤修正發布版本。</p>
            <p>深入了解<a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Kotlin 1.4.0</a>。</p>
         </td>
    </tr>
    <tr>
        <td><strong>1.4.0</strong>
            <p>發布日期：<strong>2020 年 8 月 17 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.0" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>一個功能發布版本，包含許多主要著重於品質和效能的功能和改進。</p>
            <p>深入了解：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">發布部落格文章</a></li>
                <li><a href="whatsnew14.md" target="_blank">Kotlin 1.4.0 新功能</a></li>
                <li><a href="compatibility-guide-14.md" target="_blank">相容性指南</a></li>
                <li><a href="whatsnew14.md#migrating-to-kotlin-1-4-0" target="_blank">移轉至 Kotlin 1.4.0</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.3.72</strong>
            <p>發布日期：<strong>2020 年 4 月 15 日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.3.72" target="_blank">在 GitHub 上發布</a></p>
        </td>
        <td>
            <p>Kotlin 1.3.70 的錯誤修正發布版本。</p>
            <p>深入了解<a href="https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/" target="_blank">Kotlin 1.3.70</a>。</p>
        </td>
    </tr>
</table>