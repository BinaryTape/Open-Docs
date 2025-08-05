[//]: # (title: 为 Kotlin 多平台项目选择配置)

将 Kotlin Multiplatform 添加到现有项目或启动新项目时，有多种方式来构建你的代码。通常，你会创建一个或多个 Kotlin Multiplatform 共享模块，并在 Android 和 iOS 应用中使用它们。

要为你的特定情况选择最佳方法，请考虑以下问题：

* [如何从 iOS 应用使用由 Kotlin Multiplatform 模块生成的 iOS framework？](#connect-a-kotlin-multiplatform-module-to-an-ios-app)
  你是直接集成、通过 CocoaPods 还是通过 Swift 包管理器 (SPM) 集成它？
* [你有一个还是多个 Kotlin Multiplatform 共享模块？](#module-configurations)
  多个共享模块的伞形模块应该是什么？
* [你是将所有代码存储在单一版本库 (monorepo) 中还是存储在不同的版本库中？](#repository-configurations)
* [你是将 Kotlin Multiplatform 模块 framework 作为本地依赖项还是远程依赖项使用？](#code-sharing-workflow)

回答这些问题将帮助你为项目选择最佳配置。

## 将 Kotlin Multiplatform 模块连接到 iOS 应用

要从 iOS 应用使用 Kotlin Multiplatform 共享模块，首先需要从该共享模块生成一个 [iOS framework](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)。然后，你应该将其作为依赖项添加到 iOS 项目中：

![Kotlin Multiplatform shared module](kmp-shared-module.svg){width=700}

可以将此 framework 作为本地或远程依赖项使用。

你可以通过以下方式之一将 Kotlin Multiplatform 模块 framework 的依赖项添加到 iOS 项目中：

* **直接集成**。通过向 iOS 应用的构建中添加新的运行脚本阶段来直接连接 framework。关于如何使用 Xcode 执行此操作，请参见[将 framework 连接到你的 iOS 项目](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework)。

  当使用 Android Studio 向导创建项目时，选择 **Regular framework** 选项以自动生成此设置。

* **CocoaPods 集成**。通过 [CocoaPods](https://cocoapods.org/) 连接 framework，CocoaPods 是一个流行的 Swift 和 Objective-C 项目依赖项管理器。它既可以是本地依赖项，也可以是远程依赖项。关于更多信息，请参见[将 Kotlin Gradle 项目用作 CocoaPods 依赖项](multiplatform-cocoapods-xcode.md)。

  要设置使用本地 CocoaPods 依赖项的工作流，你可以使用向导生成项目，或手动编辑脚本。

* **使用 SPM**。使用 Swift 包管理器 (SPM) 连接 framework，SPM 是一个用于管理 Swift 代码分发的 Apple 工具。我们[正在开发 SPM 的官方支持](https://youtrack.jetbrains.com/issue/KT-53877)。目前，你可以使用 XCFrameworks 设置对 Swift 包的依赖项。关于更多信息，请参见[Swift 包导出设置](multiplatform-spm-export.md)。

## 模块配置

在 Kotlin Multiplatform 项目中可以使用两种模块配置选项：单一模块或多个共享模块。

### 单一共享模块

最简单的模块配置只包含项目中的一个单一共享 Kotlin Multiplatform 模块：

![Single shared module](single-shared-module.svg){width=700}

Android 应用可以将 Kotlin Multiplatform 共享模块作为常规 Kotlin 模块依赖。然而，iOS 不能直接使用 Kotlin，因此 iOS 应用必须依赖由 Kotlin Multiplatform 模块生成的 iOS framework。

<table>
  <tr>
     <th>优点</th>
     <th>缺点</th>
  </tr>
  <tr>
  <td>
    <list>
       <li>单一模块的简单设计降低了认知负担。你无需考虑功能性放在何处，也无需考虑如何将其逻辑上拆分为多个部分。</li>
       <li>作为起始点非常棒。</li>
</list>
</td>
<td>
<list>
  <li>随着共享模块的增长，编译时间会增加。</li>
  <li>此设计不允许拥有独立的特性，也不允许仅依赖应用所需的特性。</li>
</list>
</td>
</tr>
</table>

### 多个共享模块

随着共享模块的增长，将其拆分为特性模块是个好主意。这有助于你避免仅有一个模块相关的可伸缩性问题。

Android 应用可以直接依赖所有特性模块，如果需要也可以只依赖其中一部分。

iOS 应用可以依赖由 Kotlin Multiplatform 模块生成的单个 framework。当你使用多个模块时，需要添加一个额外的模块，该模块依赖于你正在使用的所有模块，称之为*伞形模块*，然后你需要配置一个包含所有模块的 framework，称之为*伞形 framework*。

> 伞形 framework 捆绑包包含项目的所有共享模块，并被导入到 iOS 应用中。
>
{style="tip"}

<table>
  <tr>
     <th>优点</th>
     <th>缺点</th>
  </tr>
  <tr>
  <td>
    <list>
       <li>共享代码的关注点分离。</li>
       <li>更好的可伸缩性。</li>
       </list>
</td>
<td>
<list>
  <li>更复杂的设置，包括伞形 framework 的设置。</li>
 <li>模块间依赖项管理更复杂。</li>
</list>
</td>
</tr>
</table>

要设置伞形模块，你添加一个单独的模块，该模块依赖于所有特性模块，并从该模块生成一个 framework：

![Umbrella framework](umbrella-framework.svg){width=700}

Android 应用可以为了保持一致性而依赖伞形模块，也可以依赖单独的特性模块。伞形模块通常包含有用的实用函数和依赖注入设置代码。

你可以只将部分模块导出到伞形 framework 中，这通常在 framework 构件作为远程依赖项使用时发生。主要原因是确保排除自动生成代码，从而减小最终构件的大小。

伞形 framework 方法的一个已知限制是 iOS 应用不能只使用部分特性模块——它会自动消费所有模块。关于此功能的可能改进，请在 [KT-42247](https://youtrack.jetbrains.com/issue/KT-42247) 和 [KT-42250](https://youtrack.jetbrains.com/issue/KT-42250) 中描述你的情况。

> 当你在下面的示例中看到 iOS 应用依赖于伞形模块时，这意味着它也依赖于从该模块生成的伞形 framework。
>
{style="tip"}

#### 为什么你需要一个伞形 framework？ {initial-collapse-state="collapsed" collapsible="true"}

虽然可以将从不同 Kotlin Multiplatform 共享模块生成的多个 framework 包含在 iOS 应用中，但我们不推荐这种方法。当 Kotlin Multiplatform 模块被编译成 framework 时，生成的 framework 包含其所有依赖项。每当两个或更多模块使用相同的依赖项并作为单独的 framework 暴露给 iOS 时，Kotlin/Native 编译器会复制这些依赖项。

这种复制会导致一些问题。首先，iOS 应用的大小会不必要地膨胀。其次，依赖项的代码结构与重复依赖项的代码结构不兼容。这在尝试将两个具有相同依赖项的模块集成到 iOS 应用程序中时会产生问题。例如，不同模块通过同一依赖项传递的任何状态将不会连接。这可能导致意外行为和 bug。关于确切的限制，请参见 [TouchLab 文档](https://touchlab.co/multiple-kotlin-frameworks-in-application/)。

Kotlin 不会生成公共 framework 依赖项，否则会存在重复，而且你添加到应用中的任何 Kotlin 二进制文件都需要尽可能小。包含整个 Kotlin 运行时和所有依赖项的所有代码都是浪费的。Kotlin 编译器能够将二进制文件裁剪到特定构建所需的精确内容。然而，它不知道其他构建可能需要什么，因此尝试共享依赖项是不可行的。我们正在探索各种选项以最大限度地减少此问题的影响。

此问题的解决方案是使用伞形 framework。它阻止了 iOS 应用因重复依赖项而膨胀，有助于优化生成的构件，并消除了因依赖项之间不兼容而引起的困扰。

## 版本库配置

在新的和现有 Kotlin Multiplatform 项目中，你可以使用多种版本库配置选项，包括使用一个版本库或多个版本库的组合。

### 单一版本库 (Monorepo)：所有内容在一个版本库中

一种常见的版本库配置称为单一版本库配置。Kotlin Multiplatform 示例和教程中使用了这种方法。在这种情况下，版本库包含 Android 和 iOS 应用，以及共享模块或多个模块（包括伞形模块）：

![Monorepo configuration](monorepo-configuration-1.svg){width=700}

![Monorepo configuration](monorepo-configuration-2.svg){width=700}

通常，iOS 应用通过直接集成或 CocoaPods 集成，将 Kotlin Multiplatform 共享模块作为常规 framework 使用。关于更多详细信息和教程链接，请参见[将 Kotlin Multiplatform 模块连接到 iOS 应用](#connect-a-kotlin-multiplatform-module-to-an-ios-app)。

如果版本库处于版本控制下，则应用和共享模块具有相同的版本。

<table>
  <tr>
     <th>优点</th>
     <th>缺点</th>
  </tr>
  <tr>
  <td>
    <list>
       <li>借助向导易于设置。</li>
       <li>iOS 开发者可以轻松地使用 Kotlin Multiplatform 代码，因为所有代码都位于同一个版本库中。</li>
</list>
</td>
<td>
<list>
  <li>iOS 开发者需要设置和配置不熟悉的工具。</li>
<li>此方法通常不适用于已存储在不同版本库中的现有应用。</li>
</list>
</td>
</tr>
</table>

当现有的 Android 和 iOS 应用已存储在不同的版本库中时，你可以将 Kotlin Multiplatform 部分添加到 Android 版本库或单独的版本库中，而不是合并它们。

### 两个版本库：Android + 共享 | iOS

另一种项目配置是拥有两个版本库。在这种情况下，Kotlin Multiplatform 版本库包含 Android 应用和共享模块（包括伞形模块），而 Xcode 项目包含 iOS 应用：

![Two repository configuration](two-repositories.svg){width=700}

Android 和 iOS 应用可以单独进行版本控制，共享模块与 Android 应用一起进行版本控制。

### 三个版本库：Android | iOS | 共享

还有一种选项是为 Kotlin Multiplatform 模块拥有一个单独的版本库。在这种情况下，Android 和 iOS 应用存储在单独的版本库中，项目的共享代码可以包含多个特性模块和用于 iOS 的伞形模块：

![Three repository configuration](three-repositories.svg){width=700}

每个项目都可以单独进行版本控制。Kotlin Multiplatform 模块也必须进行版本控制并发布到 Android 或 JVM 平台。你可以独立发布特性模块，或只发布伞形模块并使 Android 应用依赖它。

与 Kotlin Multiplatform 模块是 Android 项目一部分的项目场景相比，单独发布 Android 构件可能会为 Android 开发者带来额外的复杂性。

当 Android 和 iOS 团队都使用相同的版本化构件时，它们在版本一致性下运行。从团队角度来看，这避免了共享的 Kotlin Multiplatform 代码“归”Android 开发者“所有”的印象。对于已经发布版本化内部 Kotlin 和 Swift 包以进行特性开发的大型项目，发布共享的 Kotlin 构件成为现有工作流的一部分。

### 多个版本库：Android | iOS | 多个库

当功能性需要在多个平台上的多个应用之间共享时，你可能更喜欢拥有多个包含 Kotlin Multiplatform 代码的版本库。例如，你可以将一个对整个产品通用的日志库存储在一个拥有自己版本控制的单独版本库中。

在这种情况下，你拥有多个 Kotlin Multiplatform 库版本库。如果几个 iOS 应用使用“库项目”的不同子集，每个应用可以有一个额外的版本库，其中包含伞形模块以及对库项目的必要依赖项：

![Many repository configuration](many-700](many-repositories.svg){width=700}

此处，每个库都必须进行版本控制并发布到 Android 或 JVM 平台。应用和每个库都可以单独进行版本控制。

## 代码共享工作流

iOS 应用可以将由 Kotlin Multiplatform 共享模块生成的 framework 作为*本地*或*远程*依赖项使用。你可以通过在 iOS 构建中提供 framework 的本地路径来使用本地依赖项。在这种情况下，你不需要发布 framework。另外，你可以将 framework 构件发布到某个地方，并使 iOS 应用将其作为远程依赖项（就像任何其他第三方依赖项一样）使用。

### 本地：源分发

本地分发是指 iOS 应用使用 Kotlin Multiplatform 模块 framework 而无需发布。iOS 应用可以直​​接集成 framework 或通过 CocoaPods 集成。

当 Android 和 iOS 团队成员都想编辑共享的 Kotlin Multiplatform 代码时，通常会使用此工作流。iOS 开发者需要安装 Android Studio 并具备 Kotlin 和 Gradle 的基础知识。

在本地分发方案中，iOS 应用构建会触发 iOS framework 的生成。这意味着 iOS 开发者可以立即观察他们对 Kotlin Multiplatform 代码的更改：

![Local source distribution](local-source-distribution.svg){width=700}

此场景通常用于两种情况。首先，它可以作为单一版本库项目配置中的默认工作流使用，无需发布构件。其次，它可以与远程工作流一起用于本地开发。关于更多详细信息，请参见[为本地开发设置本地依赖项](#setting-up-a-local-dependency-for-local-development)。

当所有团队成员都准备好编辑整个项目中的代码时，此工作流最有效。它包括在更改公共部分后，同时编辑 Android 和 iOS 部分。理想情况下，每个团队成员都可以安装 Android Studio 和 Xcode，以便在更改公共代码后打开并运行两个应用。

<table>
  <tr>
     <th>优点</th>
     <th>缺点</th>
  </tr>
  <tr>
  <td>
    <list>
       <li>Android 和 iOS 团队成员可以轻松编辑 Kotlin Multiplatform 代码，确保创建和维护共享代码是共同的责任。这有助于防止团队孤立并鼓励协作。</li>
       <li>此方法不需要单独对共享代码进行版本控制和发布。</li>
       <li>开发工作流更快，因为 iOS 团队成员无需等待构件被创建和发布。</li>
   </list>
</td>
<td>
  <list>
    <li>团队成员需要在他们的机器上设置完整的开发环境。</li>
    <li>iOS 开发者必须学习如何使用 Android Studio 和 Gradle。</li>
    <li>随着共享代码的增多和团队的壮大，管理更改变得困难。</li>
  </list>
</td>
</tr>
</table>

### 远程：构件分发

远程分发意味着 framework 构件作为 CocoaPod 或使用 SPM 的 Swift 包发布，并由 iOS 应用使用。Android 应用可以本地或远程使用二进制依赖项。

远程分发通常用于将技术逐步引入现有项目。它不会显著改变 iOS 开发者​​的工作流和构建过程。拥有两个或更多版本库的团队主要使用远程分发来存储项目代码。

作为开始，你可能想使用 [KMMBridge](https://touchlab.co/trykmmbridge)——这是一套极大地简化远程分发工作流的构建工具。另外，你也可以自己设置类似的工作流：

![Remote artifact distribution](remote-artifact-distribution.svg){width=700}

<table>
  <tr>
     <th>优点</th>
     <th>缺点</th>
  </tr>
  <tr>
  <td>不参与的 iOS 团队成员不必用 Kotlin 编码或学习如何使用 Android Studio 和 Gradle 等工具。这显著降低了团队的入门门槛。</td>
<td>
  <list>
    <li>iOS 开发者工作流较慢，因为编辑和构建共享代码的过程涉及发布和版本控制。</li>
   <li>在 iOS 上调试共享 Kotlin 代码很困难。</li>
   <li>iOS 团队成员为共享代码做出贡献的可能性显著降低。</li>
   <li>共享代码的维护完全由参与的团队成员负责。</li>
  </list>
</td>
</tr>
</table>

#### 为本地开发设置本地依赖项

许多团队在采用 Kotlin Multiplatform 技术时选择远程分发工作流，以保持 iOS 开发者​​的开发过程不变。然而，在此工作流中，他们很难更改 Kotlin Multiplatform 代码。我们建议设置一个额外的“本地开发”工作流，其中包含对由 Kotlin Multiplatform 模块生成的 framework 的本地依赖项。

当开发者添加新功能时，他们会切换为将 Kotlin Multiplatform 模块作为本地依赖项使用。这允许对公共 Kotlin 代码进行更改，立即从 iOS 观察行为，并调试 Kotlin 代码。当功能性准备就绪时，他们可以切换回远程依赖项并相应地发布他们的更改。首先，他们发布对共享模块的更改，然后才更改应用。

对于远程分发工作流，请使用 CocoaPods 集成或 SPM。对于本地分发工作流，请直接集成 framework。

<!-- This tutorial [TODO] describes how to switch workflows by choosing the corresponding scheme in Xcode:
[TODO screenshot] -->

如果你使用 CocoaPods，你也可以选择使用 CocoaPods 进行本地分发工作流。你可以通过更改环境变量在它们之间切换，如 [TouchLab 文档](https://touchlab.co/kmmbridgecocoapodslocal)所述。