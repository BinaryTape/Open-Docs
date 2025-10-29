[//]: # (title: Kotlin 版本)

<tldr>
    <p>最新 Kotlin 版本：<strong>%kotlinVersion%</strong></p>
    <p>关于详情，请参见<a href="%kotlinLatestWhatsnew%">Kotlin 2.2.20 新特性</a> <!--and find the bug fix details in the <a href="%kotlinLatestUrl%">changelog</a>-->。</p>
</tldr>

自 Kotlin 2.0.0 起，我们发布以下类型的版本：

*   _语言版本_ (2._x_._0_)：带来语言的重大变更，并包含工具更新。每 6 个月发布一次。
*   _工具版本_ (2._x_._20_)：在语言版本之间发布，包含工具更新、性能改进和错误修复。在相应的_语言版本_发布后 3 个月发布。
*   _错误修复版本_ (2._x_._yz_)：包含针对_工具版本_的错误修复。这些版本没有确切的发布时间表。

<!-- TODO: uncomment with 2.1.0 release
> For example, for the feature release 1.8.0, we had only one tooling release 1.8.20,
> and several bugfix releases including 1.8.21, 1.8.22.
>
{style="tip"}
-->

对于每个语言版本和工具版本，我们还会发布多个抢先体验预览 (_EAP_) 版本，供你在新特性发布前进行尝试。关于详情，请参见[抢先体验预览](eap.md)。

> 如果你想收到新 Kotlin 版本的通知，请订阅 [Kotlin 新闻通讯](https://lp.jetbrains.com/subscribe-to-kotlin-news/)，
> 关注 [X 上的 Kotlin](https://x.com/kotlin)，
> 或者在 [Kotlin GitHub 版本库](https://github.com/JetBrains/kotlin) 上启用 **Watch | Custom | Releases** 选项。
> 
{style="note"}

## 更新到新 Kotlin 版本

要将项目升级到新版本，请在构建系统中更新 Kotlin 版本。

### Gradle

要更新到 Kotlin %kotlinVersion%，请更改 `build.gradle(.kts)` 文件中 Kotlin Gradle 插件的版本：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // 将 `<...>` 替换为适用于你的目标环境的插件名称
    kotlin("<...>") version "%kotlinVersion%"
    // 例如，如果你的目标环境是 JVM：
    // kotlin("jvm") version "%kotlinVersion%"
    // 如果你的目标是 Kotlin Multiplatform：
    // kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // 将 `<...>` 替换为适用于你的目标环境的插件名称
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
    // 例如，如果你的目标环境是 JVM： 
    // id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
    // 如果你的目标是 Kotlin Multiplatform：
    // id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

如果你的项目是用更早的 Kotlin 版本创建的，请检测你是否还需要[更新任何 kotlinx 库的版本](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)。

如果你正在迁移到新的语言版本，Kotlin 插件的迁移工具将帮助你完成此过程。

> 关于如何在项目中使用 Gradle 的更多信息，请参见[配置 Gradle 项目](gradle-configure-project.md)。
> 
{style="tip"}

### Maven

要更新到 Kotlin %kotlinVersion%，请更改 `pom.xml` 文件中的版本：

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

此外，你也可以更改 `pom.xml` 文件中 `kotlin-maven-plugin` 的版本：

```xml
<plugins>
    <plugin>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-maven-plugin</artifactId>
        <version>%kotlinVersion%</version>
    </plugin>
</plugins>
```

如果你的项目是用更早的 Kotlin 版本创建的，请检测你是否还需要[更新任何 kotlinx 库的版本](maven.md#set-dependencies)。

> 关于如何在项目中使用 Maven 的更多信息，请参见 [Maven](maven.md)。
>
{style="tip"}

## IDE 支持

Kotlin 在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/kotlin/get-started) 中提供了开箱即用的完全支持，并附带 JetBrains 开发的官方 Kotlin 插件。

IntelliJ IDEA 和 Android Studio 中的 K2 模式使用 K2 编译器来改进代码分析、代码补全和高亮显示。

从 IntelliJ IDEA 2025.1 开始，K2 模式[默认启用](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/)。

在 Android Studio 中，你可以从 2024.1 版本开始通过以下步骤启用 K2 模式：

1.  转到 **Settings** | **Languages & Frameworks** | **Kotlin**。
2.  选择 **Enable K2 mode** 选项。

关于 K2 模式的更多信息，请参见[我们的博客](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/)。

## Kotlin 版本兼容性

关于[Kotlin 版本的类型及其兼容性](kotlin-evolution-principles.md#language-and-tooling-releases)的更多信息。

## 发布详情

下表列出了最新 Kotlin 版本的详细信息：

> 你也可以尝试 [Kotlin 的抢先体验预览 (EAP) 版本](eap.md#build-details)。
> 
{style="tip"}

<table>
    <tr>
        <th>构建信息</th>
        <th>构建亮点</th>
    </tr>
    <tr>
        <td><strong>2.2.21</strong>
            <p>发布时间：<strong>October 23, 2025</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.21" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个工具版本，包含对 Xcode 26 的支持，以及其他改进和错误修复。</p>
            <p>关于更多详情，请参见<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.21">更新日志</a>。</p>
    </td>
    </tr>
    <tr>
        <td><strong>2.2.20</strong>
            <p>发布时间：<strong>September 10, 2025</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.20" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 2.2.0 的工具版本，包含 Web 开发的重要变更及其他改进。</p>
            <p>关于更多详情，请参见<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.20">更新日志</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.2.10</strong>
            <p>发布时间：<strong>August 14, 2025</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.10" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 2.2.0 的错误修复版本。</p>
            <p>关于更多详情，请参见<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.10">更新日志</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.2.0</strong>
            <p>发布时间：<strong>June 23, 2025</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.0" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个语言版本，包含新的和稳定的语言特性、工具更新、针对不同平台的性能改进以及重要的修复。</p>
            <p>关于更多详情，请参见<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.0">更新日志</a>。</p>
        </td>
    </tr> 
    <tr>
        <td><strong>2.1.21</strong>
            <p>发布时间：<strong>May 13, 2025</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.21" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 2.1.20 的错误修复版本。</p>
            <p>关于更多详情，请参见<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.21">更新日志</a>。</p>
        </td>
    </tr> 
   <tr>
        <td><strong>2.1.20</strong>
            <p>发布时间：<strong>March 20, 2025</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.20" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
           <p>Kotlin 2.1.0 的工具版本，包含新的实验性特性、性能改进和错误修复。</p>
            <p>关于 Kotlin 2.1.20 的更多信息，请参见<a href="whatsnew2120.md" target="_blank">Kotlin 2.1.20 新特性</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.1.10</strong>
            <p>发布时间：<strong>January 27, 2025</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 2.1.0 的错误修复版本。</p>
            <p>关于更多详情，请参见<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10">更新日志</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.1.0</strong>
            <p>发布时间：<strong>November 27, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.0" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个引入新语言特性的语言版本。</p>
            <p>关于 Kotlin 2.1.0 的更多信息，请参见<a href="whatsnew21.md" target="_blank">Kotlin 2.1.0 新特性</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.21</strong>
            <p>发布时间：<strong>October 10, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 2.0.20 的错误修复版本。</p>
            <p>关于更多详情，请参见<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21">更新日志</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.20</strong>
            <p>发布时间：<strong>August 22, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.20" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
           <p>Kotlin 2.0.0 的工具版本，包含性能改进和错误修复。特性还包括 Kotlin/Native 垃圾回收器中的并发标记、Kotlin 公共标准库中的 UUID 支持、Compose 编译器更新以及对 Gradle 8.8 的支持。</p>
            <p>关于 Kotlin 2.0.20 的更多信息，请参见<a href="whatsnew2020.md" target="_blank">Kotlin 2.0.20 新特性</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.10</strong>
            <p>发布时间：<strong>August 6, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.10" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 2.0.0 的错误修复版本。</p>
            <p>关于 Kotlin 2.0.0 的更多信息，请参见<a href="whatsnew20.md" target="_blank">Kotlin 2.0.0 新特性</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.0</strong>
            <p>发布时间：<strong>May 21, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.0" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个带有稳定 Kotlin K2 编译器的语言版本。</p>
            <p>关于 Kotlin 2.0.0 的更多信息，请参见<a href="whatsnew20.md" target="_blank">Kotlin 2.0.0 新特性</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.25</strong>
            <p>发布时间：<strong>July 19, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.25" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20、1.9.21、1.9.22、1.9.23 和 1.9.24 的错误修复版本。</p>
            <p>关于 Kotlin 1.9.20 的更多信息，请参见<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 新特性</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.24</strong>
            <p>发布时间：<strong>May 7, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.24" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20、1.9.21、1.9.22 和 1.9.23 的错误修复版本。</p>
            <p>关于 Kotlin 1.9.20 的更多信息，请参见<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 新特性</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.23</strong>
            <p>发布时间：<strong>March 7, 2024</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.23" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20、1.9.21 和 1.9.22 的错误修复版本。</p>
            <p>关于 Kotlin 1.9.20 的更多信息，请参见<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 新特性</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.22</strong>
            <p>发布时间：<strong>December 21, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.22" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20 和 1.9.21 的错误修复版本。</p>
            <p>关于 Kotlin 1.9.20 的更多信息，请参见<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 新特性</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.21</strong>
            <p>发布时间：<strong>November 23, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.21" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20 的错误修复版本。</p>
            <p>关于 Kotlin 1.9.20 的更多信息，请参见<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 新特性</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.20</strong>
            <p>发布时间：<strong>November 1, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.20" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个特性发布版本，其中 Kotlin K2 编译器处于 Beta 版，以及稳定的 Kotlin 多平台。</p>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 新特性</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.10</strong>
            <p>发布时间：<strong>August 23, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.10" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.0 的错误修复版本。</p>
            <p>关于 Kotlin 1.9.0 的更多信息，请参见<a href="whatsnew19.md" target="_blank">Kotlin 1.9.0 新特性</a>。</p>
            <note>对于 Android Studio Giraffe 和 Hedgehog，Kotlin 插件 1.9.10 将随即将发布的 Android Studio 更新一起提供。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.0</strong>
            <p>发布时间：<strong>July 6, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个特性发布版本，带有 Kotlin K2 编译器更新、新的枚举类 values 函数、用于开区间的新的操作符、Kotlin 多平台中 Gradle 配置缓存的预览、Kotlin 多平台中 Android 目标支持的变更，以及 Kotlin/Native 中自定义内存分配器的预览。</p>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="whatsnew19.md" target="_blank">Kotlin 1.9.0 新特性</a></li>
                <li><a href="https://www.youtube.com/embed/fvwTZc-dxsM" target="_blank">Kotlin 新特性 YouTube 视频</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.22</strong>
            <p>发布时间：<strong>June 8, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.22" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.20 的错误修复版本。</p>
            <p>关于 Kotlin 1.8.20 的更多信息，请参见<a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20 新特性</a>。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.21</strong>
            <p>发布时间：<strong>April 25, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.21" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.20 的错误修复版本。</p>
            <p>关于 Kotlin 1.8.20 的更多信息，请参见<a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20 新特性</a>。</p>
            <note>对于 Android Studio Flamingo 和 Giraffe，Kotlin 插件 1.8.21 将随即将发布的 Android Studio 更新一起提供。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.20</strong>
            <p>发布时间：<strong>April 3, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.20" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个特性发布版本，带有 Kotlin K2 编译器更新、stdlib 中的 AutoCloseable 接口和 Base64 编码、默认启用的新 JVM 增量编译，以及新的 Kotlin/Wasm 编译器后端。</p>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20 新特性</a></li>
                <li><a href="https://youtu.be/R1JpkpPzyBU" target="_blank">Kotlin 新特性 YouTube 视频</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.10</strong>
            <p>发布时间：<strong>February 2, 2023</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.10" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.0 的错误修复版本。</p>
            <p>关于<a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">Kotlin 1.8.0</a> 的更多信息。</p>
            <note>对于 Android Studio Electric Eel 和 Flamingo，Kotlin 插件 1.8.10 将随即将发布的 Android Studio 更新一起提供。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.0</strong>
            <p>发布时间：<strong>December 28, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个特性发布版本，带有改进的 kotlin-reflect 性能、新的 JVM 递归复制或删除目录内容实验性函数、改进的 Objective-C/Swift 互操作性。</p>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="whatsnew18.md" target="_blank">Kotlin 1.8.0 新特性</a></li>
                <li><a href="compatibility-guide-18.md" target="_blank">Kotlin 1.8.0 兼容性指南</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.21</strong>
            <p>发布时间：<strong>November 9, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.21" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.7.20 的错误修复版本。</p>
            <p>关于 Kotlin 1.7.20 的更多信息，请参见<a href="whatsnew1720.md" target="_blank">Kotlin 1.7.20 新特性</a>。</p>
            <note>对于 Android Studio Dolphin、Electric Eel 和 Flamingo，Kotlin 插件 1.7.21 将随即将发布的 Android Studio 更新一起提供。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.20</strong>
            <p>发布时间：<strong>September 29, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个增量发布版本，带有新的语言特性、Kotlin K2 编译器对多个编译器插件的支持、默认启用的新 Kotlin/Native 内存管理器以及对 Gradle 7.1 的支持。</p>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="whatsnew1720.md" target="_blank">Kotlin 1.7.20 新特性</a></li>
                <li><a href="https://youtu.be/OG9npowJgE8" target="_blank">Kotlin 新特性 YouTube 视频</a></li>
                <li><a href="compatibility-guide-1720.md" target="_blank">Kotlin 1.7.20 兼容性指南</a></li>
            </list>
            <p>关于<a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">Kotlin 1.7.20</a> 的更多信息。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.10</strong>
            <p>发布时间：<strong>July 7, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.10" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.7.0 的错误修复版本。</p>
            <p>关于<a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Kotlin 1.7.0</a> 的更多信息。</p>
            <note>对于 Android Studio Dolphin (213) 和 Android Studio Electric Eel (221)，Kotlin 插件 1.7.10 将随即将发布的 Android Studio 更新一起提供。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.0</strong>
            <p>发布时间：<strong>June 9, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个特性发布版本，其中 Kotlin K2 编译器处于 JVM 的 Alpha 版，并包含稳定的语言特性、性能改进和演进性变更（例如稳定实验性 API）。</p>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="whatsnew17.md" target="_blank">Kotlin 1.7.0 新特性</a></li>
                <li><a href="https://youtu.be/54WEfLKtCGk" target="_blank">Kotlin 新特性 YouTube 视频</a></li>
                <li><a href="compatibility-guide-17.md" target="_blank">Kotlin 1.7.0 兼容性指南</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.21</strong>
            <p>发布时间：<strong>April 20, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.21" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.6.20 的错误修复版本。</p>
            <p>关于<a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a> 的更多信息。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.20</strong>
            <p>发布时间：<strong>April 4, 2022</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个增量发布版本，包含各种改进，例如：</p>
            <list>
                <li>上下文接收者的原型</li>
                <li>函数式接口构造函数的引用</li>
                <li>Kotlin/Native：新内存管理器的性能改进</li>
                <li>多平台：默认的分层项目结构</li>
                <li>Kotlin/JS：IR 编译器改进</li>
                <li>Gradle：编译器执行策略</li>
            </list>
            <p>关于<a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a> 的更多信息。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.10</strong>
            <p>发布时间：<strong>December 14, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.10" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.6.0 的错误修复版本。</p>
            <p>关于<a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Kotlin 1.6.0</a> 的更多信息。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.0</strong>
            <p>发布时间：<strong>November 16, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个特性发布版本，包含新的语言特性、性能改进和演进性变更（例如稳定实验性 API）。</p>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/" target="_blank">发布博客文章</a></li>
                <li><a href="whatsnew16.md" target="_blank">Kotlin 1.6.0 新特性</a></li>
                <li><a href="compatibility-guide-16.md" target="_blank">兼容性指南</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.32</strong>
            <p>发布时间：<strong>November 29, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.32" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.31 的错误修复版本。</p>
            <p>关于<a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a> 的更多信息。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.31</strong>
            <p>发布时间：<strong>September 20, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.31" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.30 的错误修复版本。</p>
            <p>关于<a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a> 的更多信息。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.30</strong>
            <p>发布时间：<strong>August 23, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个增量发布版本，包含各种改进，例如：</p>
            <list>
                <li>JVM 上注解类的实例化</li>
                <li>改进的 opt-in 要求机制和类型推断</li>
                <li>Kotlin/JS IR 后端处于 Beta 版</li>
                <li>支持 Apple Silicon 目标</li>
                <li>改进的 CocoaPods 支持</li>
                <li>Gradle：Java 工具链支持和改进的守护进程配置</li>
            </list>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">发布博客文章</a></li>
                <li><a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30 新特性</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.21</strong>
            <p>发布时间：<strong>July 13, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.21" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.20 的错误修复版本。</p>
            <p>关于<a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20</a> 的更多信息。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.20</strong>
            <p>发布时间：<strong>June 24, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个增量发布版本，包含各种改进，例如：</p>
            <list>
                <li>默认通过 <code>invokedynamic</code> 进行 JVM 上的字符串连接</li>
                <li>改进的 Lombok 支持和 JSpecify 支持</li>
                <li>Kotlin/Native：KDoc 导出到 Objective-C 头文件，以及在单个数组内更快地执行 <code>Array.copyInto()</code></li>
                <li>Gradle：注解处理器类加载器缓存和支持 <code>--parallel</code> Gradle 属性</li>
                <li>跨平台 stdlib 函数行为统一</li>
            </list>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/" target="_blank">发布博客文章</a></li>
                <li><a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20 新特性</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.10</strong>
            <p>发布时间：<strong>May 24, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.10" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.0 的错误修复版本。</p>
            <p>关于<a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">Kotlin 1.5.0</a> 的更多信息。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.0</strong>
            <p>发布时间：<strong>May 5, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.0" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个特性发布版本，包含新的语言特性、性能改进和演进性变更（例如稳定实验性 API）。</p>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">发布博客文章</a></li>
                <li><a href="whatsnew15.md" target="_blank">Kotlin 1.5.0 新特性</a></li>
                <li><a href="compatibility-guide-15.md" target="_blank">兼容性指南</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.32</strong>
            <p>发布时间：<strong>March 22, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.32" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.30 的错误修复版本。</p>
            <p>关于<a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a> 的更多信息。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.31</strong>
            <p>发布时间：<strong>February 25, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.31" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.30 的错误修复版本。</p>
            <p>关于<a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a> 的更多信息。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.30</strong>
            <p>发布时间：<strong>February 3, 2021</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.30" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个增量发布版本，包含各种改进，例如：</p>
            <list>
                <li>新的 JVM 后端，现已进入 Beta 版</li>
                <li>新语言特性的预览</li>
                <li>改进的 Kotlin/Native 性能</li>
                <li>标准库 API 改进</li>
            </list>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/" target="_blank">发布博客文章</a></li>
                <li><a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30 新特性</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.21</strong>
            <p>发布时间：<strong>December 7, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.21" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.20 的错误修复版本。</p>
            <p>关于<a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20</a> 的更多信息。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.20</strong>
            <p>发布时间：<strong>November 23, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个增量发布版本，包含各种改进，例如：</p>
            <list>
                <li>支持新的 JVM 特性，例如通过 <code>invokedynamic</code> 进行字符串连接</li>
                <li>改进的 Kotlin 多平台移动项目性能和异常处理</li>
                <li>JDK Path 的扩展：<code>Path("dir") / "file.txt"</code></li>
            </list>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/" target="_blank">发布博客文章</a></li>
                <li><a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20 新特性</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.10</strong>
            <p>发布时间：<strong>September 7, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.10" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.0 的错误修复版本。</p>
            <p>关于<a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Kotlin 1.4.0</a> 的更多信息。</p>
         </td>
    </tr>
    <tr>
        <td><strong>1.4.0</strong>
            <p> 发布时间：<strong>August 17, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.0" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>一个特性发布版本，包含许多主要关注质量和性能的特性和改进。</p>
            <p>关于更多信息，请参见：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">发布博客文章</a></li>
                <li><a href="whatsnew14.md" target="_blank">Kotlin 1.4.0 新特性</a></li>
                <li><a href="compatibility-guide-14.md" target="_blank">兼容性指南</a></li>
                <li><a href="whatsnew14.md#migrating-to-kotlin-1-4-0" target="_blank">迁移到 Kotlin 1.4.0</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.3.72</strong>
            <p> 发布时间：<strong>April 15, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.3.72" target="_blank">GitHub 发布页</a></p>
        </td>
        <td>
            <p>Kotlin 1.3.70 的错误修复版本。</p>
            <p>关于<a href="https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/" target="_blank">Kotlin 1.3.70</a> 的更多信息。</p>
        </td>
    </tr>
</table>