---
title: "Kotlin 版本發佈"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   最新的 Kotlin 版本：<strong>2.1.20</strong>
</p>
<p>
   詳情請參閱 <a href="whatsnew2120.md">Kotlin 2.1.20 的新功能</a>
</p>

:::

自 Kotlin 2.0.0 起，我們發布以下類型的版本：

*   _語言版本_ (2._x_._0_)，為語言帶來重大變更，並包含工具更新。每 6 個月發布一次。
*   _工具版本_ (2._x_._20_)，在語言版本之間發布，包含工具更新、效能改進和錯誤修正。在相應的 _語言版本_ 發布後 3 個月發布。
*   _錯誤修正版本_ (2._x_._yz_)，包含 _工具版本_ 的錯誤修正。這些版本沒有確切的發布時間表。

<!-- TODO: uncomment with 2.1.0 release
> For example, for the feature release 1.8.0, we had only one tooling release 1.8.20,
> and several bugfix releases including 1.8.21, 1.8.22.
>
{style="tip"}
-->

對於每個語言和工具版本，我們也會發布多個預覽 (_EAP_) 版本，讓您在發布之前試用新功能。詳情請參閱 [Early Access Preview](eap)。

:::note
如果您想收到關於新 Kotlin 版本的通知，請訂閱 [Kotlin 電子報](https://lp.jetbrains.com/subscribe-to-kotlin-news/)、在 X 上追蹤 [Kotlin](https://x.com/kotlin)，或在 [Kotlin GitHub 儲存庫](https://github.com/JetBrains/kotlin) 上啟用 **Watch | Custom | Releases** 選項。

:::

## 更新到新的 Kotlin 版本

若要將您的專案升級到新版本，您需要更新您的建置腳本檔案（build script file）。例如，要更新到 Kotlin 2.1.20，請變更 `build.gradle(.kts)` 檔案中 Kotlin Gradle 插件的版本：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    kotlin("<...>") version "2.1.20"
    // For example, if your target environment is JVM:
    // kotlin("jvm") version "2.1.20"
    // If your target is Kotlin Multiplatform:
    // kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    id 'org.jetbrains.kotlin.<...>' version '2.1.20'
    // For example, if your target environment is JVM: 
    // id 'org.jetbrains.kotlin.jvm' version '2.1.20'
    // If your target is Kotlin Multiplatform:
    // id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

如果您有使用較早 Kotlin 版本建立的專案，請變更專案中的 Kotlin 版本，並在必要時更新 kotlinx 函式庫。

如果您要遷移到新的語言版本，Kotlin 插件的遷移工具將協助您完成遷移。

## IDE 支援

即使發布了 K2 編譯器，IntelliJ IDEA 和 Android Studio 預設仍然使用先前的編譯器進行程式碼分析、程式碼完成、醒目提示和其他與 IDE 相關的功能。

從 2024.1 開始，IntelliJ IDEA 可以使用新的 K2 編譯器，透過其 K2 模式來分析您的程式碼。要啟用它，請前往 **Settings** | **Languages & Frameworks** | **Kotlin** 並選擇 **Enable K2 mode** 選項。

<img src="/img/k2-mode.png" alt="Enable K2 mode" width="200" style={{verticalAlign: 'middle'}}/>

啟用 K2 模式後，由於編譯器行為的變更，您可能會注意到 IDE 分析方面的差異。在 [遷移指南](k2-compiler-migration-guide) 中了解新的 K2 編譯器與先前編譯器的不同之處。

## Kotlin 版本相容性

了解更多關於 [Kotlin 版本的類型及其相容性](kotlin-evolution-principles#language-and-tooling-releases)。

## 版本詳細資訊

下表列出了最新 Kotlin 版本的詳細資訊：

:::tip
您也可以嘗試 [Kotlin 的 Early Access Preview (EAP) 版本](eap#build-details)。

:::
<table>
<tr>
        <th>建置資訊（Build info）</th>
        <th>建置重點（Build highlights）</th>
</tr>
<tr>
<td>
<strong>2.1.20</strong>
<p>
   發布日期：<strong>2025 年 3 月 20 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.20" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 2.1.0 的工具版本，包含新的實驗性功能、效能改進和錯誤修正。
</p>
<p>
   在 <a href="whatsnew2120" target="_blank">Kotlin 2.1.20 的新功能</a> 中了解更多關於 Kotlin 2.1.20 的資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.1.10</strong>
<p>
   發布日期：<strong>2025 年 1 月 27 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 2.1.0 的錯誤修正版本
</p>
<p>
   更多詳細資訊，請參閱 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10">變更日誌（changelog）</a>。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.1.0</strong>
<p>
   發布日期：<strong>2024 年 11 月 27 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.0" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   引入新語言功能的語言版本。
</p>
<p>
   在 <a href="whatsnew21" target="_blank">Kotlin 2.1.0 的新功能</a> 中了解更多關於 Kotlin 2.1.0 的資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.21</strong>
<p>
   發布日期：<strong>2024 年 10 月 10 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 2.0.20 的錯誤修正版本
</p>
<p>
   更多詳細資訊，請參閱 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21">變更日誌（changelog）</a>。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.20</strong>
<p>
   發布日期：<strong>2024 年 8 月 22 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.20" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 2.0.0 的工具版本，包含效能改進和錯誤修正。功能還包括 Kotlin/Native 垃圾回收器中的並行標記、Kotlin 通用標準函式庫中的 UUID 支援、Compose 編譯器更新，以及對 Gradle 8.8 的支援。
</p>
<p>
   在 <a href="whatsnew2020" target="_blank">Kotlin 2.0.20 的新功能</a> 中了解更多關於 Kotlin 2.0.20 的資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.10</strong>
<p>
   發布日期：<strong>2024 年 8 月 6 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.10" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 2.0.0 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew20" target="_blank">Kotlin 2.0.0 的新功能</a> 中了解更多關於 Kotlin 2.0.0 的資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.0</strong>
<p>
   發布日期：<strong>2024 年 5 月 21 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.0" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   具有穩定 Kotlin K2 編譯器的語言版本。
</p>
<p>
   在 <a href="whatsnew20" target="_blank">Kotlin 2.0.0 的新功能</a> 中了解更多關於 Kotlin 2.0.0 的資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.25</strong>
<p>
   發布日期：<strong>2024 年 7 月 19 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.25" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20、1.9.21、1.9.22、1.9.23 和 1.9.24 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20 的新功能</a> 中了解更多關於 Kotlin 1.9.20 的資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.24</strong>
<p>
   發布日期：<strong>2024 年 5 月 7 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.24" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20、1.9.21、1.9.22 和 1.9.23 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20 的新功能</a> 中了解更多關於 Kotlin 1.9.20 的資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.23</strong>
<p>
   發布日期：<strong>2024 年 3 月 7 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.23" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20、1.9.21 和 1.9.22 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20 的新功能</a> 中了解更多關於 Kotlin 1.9.20 的資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.22</strong>
<p>
   發布日期：<strong>2023 年 12 月 21 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.22" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20 和 1.9.21 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20 的新功能</a> 中了解更多關於 Kotlin 1.9.20 的資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.21</strong>
<p>
   發布日期：<strong>2023 年 11 月 23 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.21" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20 的新功能</a> 中了解更多關於 Kotlin 1.9.20 的資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.20</strong>
<p>
   發布日期：<strong>2023 年 11 月 1 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.20" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   具有 Beta 版 Kotlin K2 編譯器和穩定 Kotlin Multiplatform 的功能版本。
</p>
<p>
   在以下連結了解更多資訊：
</p>
<list>
<li><a href="whatsnew1920" target="_blank">Kotlin 1.9.20 的新功能</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.9.10</strong>
<p>
   發布日期：<strong>2023 年 8 月 23 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.10" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.0 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew19" target="_blank">Kotlin 1.9.0 的新功能</a> 中了解更多關於 Kotlin 1.9.0 的資訊。
</p>
            <note>對於 Android Studio Giraffe 和 Hedgehog，Kotlin 插件 1.9.10 將透過即將推出的 Android Studios 更新提供。</note>
</td>
</tr>
<tr>
<td>
<strong>1.9.0</strong>
<p>
   發布日期：<strong>2023 年 7 月 6 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   一個功能版本，包含 Kotlin K2 編譯器更新、新的 enum 類別 values 函數、開放範圍的新運算符、Kotlin Multiplatform 中 Gradle 組態快取的預覽版、Kotlin Multiplatform 中對 Android 目標支援的變更、Kotlin/Native 中自訂記憶體分配器的預覽版。
</p>
<p>
   在以下連結了解更多資訊：
</p>
<list>
<li><a href="whatsnew19" target="_blank">Kotlin 1.9.0 的新功能</a></li>
<li><a href="https://www.youtube.com/embed/fvwTZc-dxsM" target="_blank">Kotlin YouTube 影片的新功能</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.8.22</strong>
<p>
   發布日期：<strong>2023 年 6 月 8 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.22" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.8.20 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew1820" target="_blank">Kotlin 1.8.20 的新功能</a> 中了解更多關於 Kotlin 1.8.20 的資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.8.21</strong>
<p>
   發布日期：<strong>2023 年 4 月 25 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.21" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.8.20 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew1820" target="_blank">Kotlin 1.8.20 的新功能</a> 中了解更多關於 Kotlin 1.8.20 的資訊。
</p>
            <note>對於 Android Studio Flamingo 和 Giraffe，Kotlin 插件 1.8.21 將透過即將推出的 Android Studios 更新提供。</note>
</td>
</tr>
<tr>
<td>
<strong>1.8.20</strong>
<p>
   發布日期：<strong>2023 年 4 月 3 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.20" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   一個功能版本，包含 Kotlin K2 編譯器更新、stdlib 中的 AutoCloseable 介面和 Base64 編碼、預設啟用新的 JVM 增量編譯、新的 Kotlin/Wasm 編譯器後端。
</p>
<p>
   在以下連結了解更多資訊：
</p>
<list>
<li><a href="whatsnew1820" target="_blank">Kotlin 1.8.20 的新功能</a></li>
<li><a href="https://youtu.be/R1JpkpPzyBU" target="_blank">Kotlin YouTube 影片的新功能</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.8.10</strong>
<p>
   發布日期：<strong>2023 年 2 月 2 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.10" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.8.0 的錯誤修正版本。
</p>
<p>
   在 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">Kotlin 1.8.0</a> 中了解更多資訊。
</p>
            <note>對於 Android Studio Electric Eel 和 Flamingo，Kotlin 插件 1.8.10 將透過即將推出的 Android Studios 更新提供。</note>
</td>
</tr>
<tr>
<td>
<strong>1.8.0</strong>
<p>
   發布日期：<strong>2022 年 12 月 28 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   一個功能版本，具有改進的 kotlin-reflect 效能、用於 JVM 的新的遞迴複製或刪除目錄內容實驗性函數、改進的 Objective-C/Swift 互操作性。
</p>
<p>
   在以下連結了解更多資訊：
</p>
<list>
<li><a href="whatsnew18" target="_blank">Kotlin 1.8.0 的新功能</a></li>
<li><a href="compatibility-guide-18" target="_blank">Kotlin 1.8.0 的相容性指南</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.7.21</strong>
<p>
   發布日期：<strong>2022 年 11 月 9 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.21" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.7.20 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew1720" target="_blank">Kotlin 1.7.20 的新功能</a> 中了解更多關於 Kotlin 1.7.20 的資訊。
</p>
            <note>對於 Android Studio Dolphin、Electric Eel 和 Flamingo，Kotlin 插件 1.7.21 將透過即將推出的 Android Studios 更新提供。</note>
</td>
</tr>
<tr>
<td>
<strong>1.7.20</strong>
<p>
   發布日期：<strong>2022 年 9 月 29 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   一個增量版本，具有新的語言功能、Kotlin K2 編譯器中對多個編譯器插件的支援、預設啟用新的 Kotlin/Native 記憶體管理器，以及對 Gradle 7.1 的支援。
</p>
<p>
   在以下連結了解更多資訊：
</p>
<list>
<li><a href="whatsnew1720" target="_blank">Kotlin 1.7.20 的新功能</a></li>
<li><a href="https://youtu.be/OG9npowJgE8" target="_blank">Kotlin YouTube 影片的新功能</a></li>
<li><a href="compatibility-guide-1720" target="_blank">Kotlin 1.7.20 的相容性指南</a></li>
</list>
<p>
   在 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">Kotlin 1.7.20</a> 中了解更多資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.7.10</strong>
<p>
   發布日期：<strong>2022 年 7 月 7 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.10" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.7.0 的錯誤修正版本。
</p>
<p>
   在 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Kotlin 1.7.0</a> 中了解更多資訊。
</p>
            <note>對於 Android Studio Dolphin (213) 和 Android Studio Electric Eel (221)，Kotlin 插件 1.7.10 將透過即將推出的 Android Studios 更新提供。</note>
</td>
</tr>
<tr>
<td>
<strong>1.7.0</strong>
<p>
   發布日期：<strong>2022 年 6 月 9 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   一個功能版本，具有用於 JVM 的 Alpha 版 Kotlin K2 編譯器、穩定的語言功能、效能改進，以及諸如穩定實驗性 API 之類的演進變更。
</p>
<p>
   在以下連結了解更多資訊：
</p>
<list>
<li><a href="whatsnew17" target="_blank">Kotlin 1.7.0 的新功能</a></li>
<li><a href="https://youtu.be/54WEfLKtCGk" target="_blank">Kotlin YouTube 影片的新功能</a></li>
<li><a href="compatibility-guide-17" target="_blank">Kotlin 1.7.0 的相容性指南</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.6.21</strong>
<p>
   發布日期：<strong>2022 年 4 月 20 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.21" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.6.20 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew1620" target="_blank">Kotlin 1.6.20</a> 中了解更多資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.6.20</strong>
<p>
   發布日期：<strong>2022 年 4 月 4 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   一個增量版本，具有各種改進，例如：
</p>
<list>
<li>context receivers 的原型</li>
<li>對函數介面建構器的可調用參考</li>
<li>Kotlin/Native：新記憶體管理器的效能改進</li>
<li>Multiplatform：預設的階層式專案結構</li>
<li>Kotlin/JS：IR 編譯器改進</li>
<li>Gradle：編譯器執行策略</li>
</list>
<p>
   在 <a href="whatsnew1620" target="_blank">Kotlin 1.6.20</a> 中了解更多資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.6.10</strong>
<p>
   發布日期：<strong>2021 年 12 月 14 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.10" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.6.0 的錯誤修正版本。
</p>
<p>
   在 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Kotlin 1.6.0</a> 中了解更多資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.6.0</strong>
<p>
   發布日期：<strong>2021 年 11 月 16 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   一個功能版本，具有新的語言功能、效能改進，以及諸如穩定實驗性 API 之類的演進變更。
</p>
<p>
   在以下連結了解更多資訊：
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/" target="_blank">版本部落格文章</a></li>
<li><a href="whatsnew16" target="_blank">Kotlin 1.6.0 的新功能</a></li>
<li><a href="compatibility-guide-16" target="_blank">相容性指南</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.5.32</strong>
<p>
   發布日期：<strong>2021 年 11 月 29 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.32" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.31 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew1530" target="_blank">Kotlin 1.5.30</a> 中了解更多資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.31</strong>
<p>
   發布日期：<strong>2021 年 9 月 20 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.31" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.30 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew1530" target="_blank">Kotlin 1.5.30</a> 中了解更多資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.30</strong>
<p>
   發布日期：<strong>2021 年 8 月 23 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   一個增量版本，具有各種改進，例如：
</p>
<list>
<li>JVM 上的註解類別的實例化</li>
<li>改進的選擇加入需求機制和類型推斷</li>
<li>Beta 版的 Kotlin/JS IR 後端</li>
<li>對 Apple Silicon 目標的支援</li>
<li>改進的 CocoaPods 支援</li>
<li>Gradle：Java 工具鏈支援和改進的守護程式組態</li>
</list>
<p>
   在以下連結了解更多資訊：
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">版本部落格文章</a></li>
<li><a href="whatsnew1530" target="_blank">Kotlin 1.5.30 的新功能</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.5.21</strong>
<p>
   發布日期：<strong>2021 年 7 月 13 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.21" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.20 的錯誤修正版本。
</p>
<p>
   在 <a href="whatsnew1520" target="_blank">Kotlin 1.5.20</a> 中了解更多資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.20</strong>
<p>
   發布日期：<strong>2021 年 6 月 24 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   一個增量版本，具有各種改進，例如：
</p>
<list>
<li>預設情況下，透過 JVM 上的 `invokedynamic` 進行字串串連</li>
<li>改進了對 Lombok 的支援和對 JSpecify 的支援</li>
<li>Kotlin/Native：將 KDoc 匯出到 Objective-C 標頭，並在一個陣列中更快地 `Array.copyInto()`</li>
<li>Gradle：註解處理器的類別載入器的快取和對 `--parallel` Gradle 屬性的支援</li>
<li>跨平台對齊 stdlib 函數的行為</li>
</list>
<p>
   在以下連結了解更多資訊：
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/" target="_blank">版本部落格文章</a></li>
<li><a href="whatsnew1520" target="_blank">Kotlin 1.5.20 的新功能</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.5.10</strong>
<p>
   發布日期：<strong>2021 年 5 月 24 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.10" target="_blank">GitHub 上的版本</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.0 的錯誤修正版本。
</p>
<p>
   在 <a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">Kotlin 1.5.0</a> 中了解更多資訊。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.0</strong>
<p>
   發布日期：<strong>2021 年 5 月 5 日</strong>
</p>
</td>
</tr>
</table>