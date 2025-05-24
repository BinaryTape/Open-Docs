---
title: "Kotlin 发布版本"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   最新 Kotlin 版本: <strong>2.1.20</strong>
</p>
<p>
   查看 <a href="whatsnew2120">Kotlin 2.1.20 中的新特性</a> 了解详情
</p>

:::

自 Kotlin 2.0.0 起，我们发布以下类型的版本：

* _语言版本_ (2._x_._0_)，它带来了语言的重大更改，并包括工具更新。每 6 个月发布一次。
* _工具版本_ (2._x_._20_)，在语言版本之间发布，包括工具更新、性能改进和错误修复。
    在相应的 _语言版本_ 之后 3 个月发布。
* _错误修复版本_ (2._x_._yz_)，包括针对 _工具版本_ 的错误修复。 这些版本没有确切的发布时间表。

<!-- TODO: uncomment with 2.1.0 release
> For example, for the feature release 1.8.0, we had only one tooling release 1.8.20,
> and several bugfix releases including 1.8.21, 1.8.22.
>
{style="tip"}
-->

对于每个语言版本和工具版本，我们还会发布多个预览版（_EAP_），以便您在发布之前尝试新功能。 有关详细信息，请参阅 [Early Access Preview](eap)。

:::note
如果您想收到有关新 Kotlin 版本的通知，请订阅 [Kotlin newsletter](https://lp.jetbrains.com/subscribe-to-kotlin-news/)，
在 [X 上关注 Kotlin](https://x.com/kotlin)，
或者在 [Kotlin GitHub repository](https://github.com/JetBrains/kotlin) 上启用 **Watch | Custom | Releases** 选项。

:::

## 更新到新的 Kotlin 版本

要将您的项目升级到新版本，您需要更新您的构建脚本文件。
例如，要更新到 Kotlin 2.1.20，请更改 `build.gradle(.kts)` 文件中 Kotlin Gradle 插件的版本：

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

如果您有使用早期 Kotlin 版本创建的项目，请更改项目中的 Kotlin 版本，并在必要时更新 kotlinx 库。

如果您要迁移到新的语言版本，Kotlin 插件的迁移工具将帮助您进行迁移。

## IDE 支持

即使发布了 K2 编译器，IntelliJ IDEA 和 Android Studio 默认情况下仍然使用之前的编译器进行代码分析、代码补全、高亮显示和其他与 IDE 相关的功能。

从 2024.1 开始，IntelliJ IDEA 可以使用新的 K2 编译器，通过其 K2 模式来分析您的代码。
要启用它，请转到 **Settings** | **Languages & Frameworks** | **Kotlin** 并选择 **Enable K2 mode** 选项。

<img src="/img/k2-mode.png" alt="Enable K2 mode" width="200" style={{verticalAlign: 'middle'}}/>

启用 K2 模式后，由于编译器行为的更改，您可能会注意到 IDE 分析的差异。
在 [迁移指南](k2-compiler-migration-guide) 中了解新的 K2 编译器与之前的编译器的区别。

## Kotlin 版本兼容性

了解更多关于 [Kotlin 版本的类型及其兼容性](kotlin-evolution-principles#language-and-tooling-releases)

## 版本详情

下表列出了最新 Kotlin 版本的详细信息：

:::tip
您还可以尝试 [Kotlin 的 Early Access Preview (EAP) 版本](eap#build-details)。

:::
<table>
<tr>
        <th>构建信息 (Build info)</th>
        <th>构建亮点 (Build highlights)</th>
</tr>
<tr>
<td>
<strong>2.1.20</strong>
<p>
   发布日期: <strong>2025 年 3 月 20 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.20" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 2.1.0 的工具版本，包含新的实验性功能、性能改进和错误修复。
</p>
<p>
   在 <a href="whatsnew2120" target="_blank">Kotlin 2.1.20 中的新特性</a> 中了解更多关于 Kotlin 2.1.20 的信息。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.1.10</strong>
<p>
   发布日期: <strong>2025 年 1 月 27 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 2.1.0 的错误修复版本
</p>
<p>
   有关更多详细信息，请参阅 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10">changelog</a>。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.1.0</strong>
<p>
   发布日期: <strong>2024 年 11 月 27 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.0" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   引入新语言功能的语言版本。
</p>
<p>
   在 <a href="whatsnew21" target="_blank">Kotlin 2.1.0 中的新特性</a> 中了解更多关于 Kotlin 2.1.0 的信息。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.21</strong>
<p>
   发布日期: <strong>2024 年 10 月 10 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 2.0.20 的错误修复版本
</p>
<p>
   有关更多详细信息，请参阅 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21">changelog</a>。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.20</strong>
<p>
   发布日期: <strong>2024 年 8 月 22 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.20" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 2.0.0 的工具版本，包含性能改进和错误修复。 功能还包括 Kotlin/Native 垃圾回收器中的并发标记、Kotlin 通用标准库中的 UUID 支持、Compose 编译器更新以及对 Gradle 8.8 的支持。
</p>
<p>
   在 <a href="whatsnew2020" target="_blank">Kotlin 2.0.20 中的新特性</a> 中了解更多关于 Kotlin 2.0.20 的信息。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.10</strong>
<p>
   发布日期: <strong>2024 年 8 月 6 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.10" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 2.0.0 的错误修复版本。
</p>
<p>
   在 <a href="whatsnew20" target="_blank">Kotlin 2.0.0 中的新特性</a> 中了解更多关于 Kotlin 2.0.0 的信息。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.0</strong>
<p>
   发布日期: <strong>2024 年 5 月 21 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.0" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   具有稳定 Kotlin K2 编译器的语言版本。
</p>
<p>
   在 <a href="whatsnew20" target="_blank">Kotlin 2.0.0 中的新特性</a> 中了解更多关于 Kotlin 2.0.0 的信息。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.25</strong>
<p>
   发布日期: <strong>2024 年 7 月 19 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.25" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20、1.9.21、1.9.22、1.9.23 和 1.9.24 的错误修复版本。
</p>
<p>
   在 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20 中的新特性</a> 中了解更多关于 Kotlin 1.9.20 的信息。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.24</strong>
<p>
   发布日期: <strong>2024 年 5 月 7 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.24" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20、1.9.21、1.9.22 和 1.9.23 的错误修复版本。
</p>
<p>
   在 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20 中的新特性</a> 中了解更多关于 Kotlin 1.9.20 的信息。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.23</strong>
<p>
   发布日期: <strong>2024 年 3 月 7 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.23" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20、1.9.21 和 1.9.22 的错误修复版本。
</p>
<p>
   在 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20 中的新特性</a> 中了解更多关于 Kotlin 1.9.20 的信息。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.22</strong>
<p>
   发布日期: <strong>2023 年 12 月 21 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.22" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20 和 1.9.21 的错误修复版本。
</p>
<p>
   在 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20 中的新特性</a> 中了解更多关于 Kotlin 1.9.20 的信息。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.21</strong>
<p>
   发布日期: <strong>2023 年 11 月 23 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.21" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20 的错误修复版本。
</p>
<p>
   在 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20 中的新特性</a> 中了解更多关于 Kotlin 1.9.20 的信息。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.20</strong>
<p>
   发布日期: <strong>2023 年 11 月 1 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.20" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   具有 Beta 版 Kotlin K2 编译器和稳定版 Kotlin Multiplatform 的功能版本。
</p>
<p>
   了解更多：
</p>
<list>
<li><a href="whatsnew1920" target="_blank">Kotlin 1.9.20 中的新特性</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.9.10</strong>
<p>
   发布日期: <strong>2023 年 8 月 23 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.10" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.0 的错误修复版本。
</p>
<p>
   在 <a href="whatsnew19" target="_blank">Kotlin 1.9.0 中的新特性</a> 中了解更多关于 Kotlin 1.9.0 的信息。
</p>
            <note>对于 Android Studio Giraffe 和 Hedgehog，Kotlin 插件 1.9.10 将通过即将推出的 Android Studios 更新提供。</note>
</td>
</tr>
<tr>
<td>
<strong>1.9.0</strong>
<p>
   发布日期: <strong>2023 年 7 月 6 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   具有 Kotlin K2 编译器更新、新的 enum 类 values 函数的功能版本，
                用于开放范围的新运算符，Kotlin Multiplatform 中 Gradle 配置缓存的预览，
                Kotlin Multiplatform 中 Android 目标支持的更改，Kotlin/Native 中自定义内存分配器的预览。
</p>
<p>
   了解更多：
</p>
<list>
<li><a href="whatsnew19" target="_blank">Kotlin 1.9.0 中的新特性</a></li>
<li><a href="https://www.youtube.com/embed/fvwTZc-dxsM" target="_blank">Kotlin YouTube 视频中的新特性</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.8.22</strong>
<p>
   发布日期: <strong>2023 年 6 月 8 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.22" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.8.20 的错误修复版本。
</p>
<p>
   在 <a href="whatsnew1820" target="_blank">Kotlin 1.8.20 中的新特性</a> 中了解更多关于 Kotlin 1.8.20 的信息。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.8.21</strong>
<p>
   发布日期: <strong>2023 年 4 月 25 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.21" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.8.20 的错误修复版本。
</p>
<p>
   在 <a href="whatsnew1820" target="_blank">Kotlin 1.8.20 中的新特性</a> 中了解更多关于 Kotlin 1.8.20 的信息。
</p>
            <note>对于 Android Studio Flamingo 和 Giraffe，Kotlin 插件 1.8.21 将通过即将推出的 Android Studios 更新提供。</note>
</td>
</tr>
<tr>
<td>
<strong>1.8.20</strong>
<p>
   发布日期: <strong>2023 年 4 月 3 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.20" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   具有 Kotlin K2 编译器更新、stdlib 中的 AutoCloseable 接口和 Base64 编码的功能版本，
                默认启用新的 JVM 增量编译，新的 Kotlin/Wasm 编译器后端。
</p>
<p>
   了解更多：
</p>
<list>
<li><a href="whatsnew1820" target="_blank">Kotlin 1.8.20 中的新特性</a></li>
<li><a href="https://youtu.be/R1JpkpPzyBU" target="_blank">Kotlin YouTube 视频中的新特性</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.8.10</strong>
<p>
   发布日期: <strong>2023 年 2 月 2 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.10" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.8.0 的错误修复版本。
</p>
<p>
   了解更多关于 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">Kotlin 1.8.0</a>。
</p>
            <note>对于 Android Studio Electric Eel 和 Flamingo，Kotlin 插件 1.8.10 将通过即将推出的 Android Studios 更新提供。</note>
</td>
</tr>
<tr>
<td>
<strong>1.8.0</strong>
<p>
   发布日期: <strong>2022 年 12 月 28 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   具有改进的 kotlin-reflect 性能、用于 JVM 的新的递归复制或删除目录内容实验函数、改进的 Objective-C/Swift 互操作性的功能版本。
</p>
<p>
   了解更多：
</p>
<list>
<li><a href="whatsnew18" target="_blank">Kotlin 1.8.0 中的新特性</a></li>
<li><a href="compatibility-guide-18" target="_blank">Kotlin 1.8.0 兼容性指南</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.7.21</strong>
<p>
   发布日期: <strong>2022 年 11 月 9 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.21" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.7.20 的错误修复版本。
</p>
<p>
   在 <a href="whatsnew1720" target="_blank">Kotlin 1.7.20 中的新特性</a> 中了解更多关于 Kotlin 1.7.20 的信息。
</p>
            <note>对于 Android Studio Dolphin、Electric Eel 和 Flamingo，Kotlin 插件 1.7.21 将通过即将推出的 Android Studios 更新提供。</note>
</td>
</tr>
<tr>
<td>
<strong>1.7.20</strong>
<p>
   发布日期: <strong>2022 年 9 月 29 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   一个增量版本，具有新的语言功能、Kotlin K2 编译器中对多个编译器插件的支持，
                默认启用的新 Kotlin/Native 内存管理器以及对 Gradle 7.1 的支持。
</p>
<p>
   了解更多：
</p>
<list>
<li><a href="whatsnew1720" target="_blank">Kotlin 1.7.20 中的新特性</a></li>
<li><a href="https://youtu.be/OG9npowJgE8" target="_blank">Kotlin YouTube 视频中的新特性</a></li>
<li><a href="compatibility-guide-1720" target="_blank">Kotlin 1.7.20 兼容性指南</a></li>
</list>
<p>
   了解更多关于 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">Kotlin 1.7.20</a>。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.7.10</strong>
<p>
   发布日期: <strong>2022 年 7 月 7 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.10" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.7.0 的错误修复版本。
</p>
<p>
   了解更多关于 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Kotlin 1.7.0</a>。
</p>
            <note>对于 Android Studio Dolphin (213) 和 Android Studio Electric Eel (221)，Kotlin 插件 1.7.10 将通过即将推出的 Android Studios 更新提供。</note>
</td>
</tr>
<tr>
<td>
<strong>1.7.0</strong>
<p>
   发布日期: <strong>2022 年 6 月 9 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   一个功能版本，具有用于 JVM 的 Alpha 版 Kotlin K2 编译器、稳定的语言功能、性能改进和进化性更改，例如稳定实验性 API。
</p>
<p>
   了解更多：
</p>
<list>
<li><a href="whatsnew17" target="_blank">Kotlin 1.7.0 中的新特性</a></li>
<li><a href="https://youtu.be/54WEfLKtCGk" target="_blank">Kotlin YouTube 视频中的新特性</a></li>
<li><a href="compatibility-guide-17" target="_blank">Kotlin 1.7.0 兼容性指南</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.6.21</strong>
<p>
   发布日期: <strong>2022 年 4 月 20 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.21" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.6.20 的错误修复版本。
</p>
<p>
   了解更多关于 <a href="whatsnew1620" target="_blank">Kotlin 1.6.20</a>。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.6.20</strong>
<p>
   发布日期: <strong>2022 年 4 月 4 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   一个增量版本，具有各种改进，例如：
</p>
<list>
<li>上下文接收器 (Context receivers) 的原型</li>
<li>函数式接口构造函数的可调用引用</li>
<li>Kotlin/Native：新内存管理器的性能改进</li>
<li>Multiplatform：默认的分层项目结构</li>
<li>Kotlin/JS：IR 编译器改进</li>
<li>Gradle：编译器执行策略</li>
</list>
<p>
   了解更多关于 <a href="whatsnew1620" target="_blank">Kotlin 1.6.20</a>。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.6.10</strong>
<p>
   发布日期: <strong>2021 年 12 月 14 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.10" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.6.0 的错误修复版本。
</p>
<p>
   了解更多关于 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Kotlin 1.6.0</a>。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.6.0</strong>
<p>
   发布日期: <strong>2021 年 11 月 16 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   一个功能版本，具有新的语言功能、性能改进和进化性更改，例如稳定实验性 API。
</p>
<p>
   了解更多：
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/" target="_blank">发布博客文章</a></li>
<li><a href="whatsnew16" target="_blank">Kotlin 1.6.0 中的新特性</a></li>
<li><a href="compatibility-guide-16" target="_blank">兼容性指南</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.5.32</strong>
<p>
   发布日期: <strong>2021 年 11 月 29 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.32" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.31 的错误修复版本。
</p>
<p>
   了解更多关于 <a href="whatsnew1530" target="_blank">Kotlin 1.5.30</a>。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.31</strong>
<p>
   发布日期: <strong>2021 年 9 月 20 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.31" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.30 的错误修复版本。
</p>
<p>
   了解更多关于 <a href="whatsnew1530" target="_blank">Kotlin 1.5.30</a>。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.30</strong>
<p>
   发布日期: <strong>2021 年 8 月 23 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   一个增量版本，具有各种改进，例如：
</p>
<list>
<li>在 JVM 上实例化注解类</li>
<li>改进的 opt-in requirement 机制和类型推断</li>
<li>Beta 版的 Kotlin/JS IR 后端</li>
<li>支持 Apple Silicon 目标</li>
<li>改进的 CocoaPods 支持</li>
<li>Gradle：Java 工具链支持和改进的守护程序配置</li>
</list>
<p>
   了解更多：
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">发布博客文章</a></li>
<li><a href="whatsnew1530" target="_blank">Kotlin 1.5.30 中的新特性</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.5.21</strong>
<p>
   发布日期: <strong>2021 年 7 月 13 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.21" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.20 的错误修复版本。
</p>
<p>
   了解更多关于 <a href="whatsnew1520" target="_blank">Kotlin 1.5.20</a>。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.20</strong>
<p>
   发布日期: <strong>2021 年 6 月 24 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   一个增量版本，具有各种改进，例如：
</p>
<list>
<li>默认情况下，通过 JVM 上的 `invokedynamic` 进行字符串连接</li>
<li>改进了对 Lombok 的支持和对 JSpecify 的支持</li>
<li>Kotlin/Native：KDoc 导出到 Objective-C 标头，以及在一个数组中更快的 `Array.copyInto()`</li>
<li>Gradle：注解处理器类加载器的缓存和对 `--parallel` Gradle 属性的支持</li>
<li>跨平台对齐的 stdlib 函数行为</li>
</list>
<p>
   了解更多：
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/" target="_blank">发布博客文章</a></li>
<li><a href="whatsnew1520" target="_blank">Kotlin 1.5.20 中的新特性</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.5.10</strong>
<p>
   发布日期: <strong>2021 年 5 月 24 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.10" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.0 的错误修复版本。
</p>
<p>
   了解更多关于 <a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">Kotlin 1.5.0</a>。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.0</strong>
<p>
   发布日期: <strong>2021 年 5 月 5 日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.0" target="_blank">在 GitHub 上发布</a>
</p>
</td>
<td>

<p>
   一个功能版本，具有新的语言功能、性能改进和进化性更改，例如稳定实验性 API。
</p>
<p>
   了解更多：
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">发布博客文章</a></li>
<li><a href="whatsnew15" target="_blank">Kotlin 1.5.0 中的新特性</a></li>
</list>
</td>
</tr>
</table>