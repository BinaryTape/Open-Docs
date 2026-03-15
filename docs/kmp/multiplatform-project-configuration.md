[//]: # (title: 为您的 Kotlin Multiplatform 项目选择配置)

当您将 Kotlin Multiplatform 添加到现有项目或启动新项目时，有多种不同的方式来组织您的代码。通常，您会创建一个或多个 Kotlin Multiplatform 共享模块，并在您的 Android 和 iOS 应用中使用它们。

要为您的特定案例选择最佳方法，请考虑以下问题：

* [您如何从 iOS 应用中引用由 Kotlin Multiplatform 模块生成的 iOS 框架？](#connect-a-kotlin-multiplatform-module-to-an-ios-app)
  您是直接集成、通过 CocoaPods 集成，还是使用 Swift 软件包管理器 (SwiftPM)？
* [您是拥有一个还是多个 Kotlin Multiplatform 共享模块？](#module-configurations)
  对于多个共享模块，umbrella 模块应该是什么样的？
* [您是将所有代码存储在单仓库中，还是存储在不同的仓库中？](#repository-configurations)
* [您是将 Kotlin Multiplatform 模块框架作为本地依赖项还是远程依赖项引用？](#code-sharing-workflow)

回答这些问题将帮助您为项目选择最佳配置。

## 将 Kotlin Multiplatform 模块连接到 iOS 应用

要从 iOS 应用中使用 Kotlin Multiplatform 共享模块，您首先需要从该共享模块生成一个 [iOS 框架](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)。然后，您应该将其作为依赖项添加到 iOS 项目中。

通常有两种具有不同实现的选项：

* 本地依赖项。Kotlin 构建直接与 iOS 构建交互。
* 远程依赖项。Kotlin 构建生成一个 iOS 框架，然后您使用软件包管理器将其连接到 iOS 项目。

要查看所有可用的 iOS 集成选项，请参阅 [iOS 集成方法](multiplatform-ios-integration-overview.md)。

## 模块配置

在 Kotlin Multiplatform 项目中，您可以使用两种模块配置选项：单个模块或多个共享模块。

### 单个共享模块

最简单的模块配置在项目中仅包含一个共享的 Kotlin Multiplatform 模块：

![单个共享模块](single-shared-module.svg){width=700}

Android 应用可以像依赖常规 Kotlin 模块一样依赖 Kotlin Multiplatform 共享模块。然而，iOS 无法直接使用 Kotlin，因此 iOS 应用必须依赖由 Kotlin Multiplatform 模块生成的 iOS 框架。

<table>
  
<tr>
<th>优点</th>
     <th>缺点</th>
</tr>

  
<tr>
<td>
    <list>
       <li>仅包含单个模块的简单设计降低了认知负荷。您不需要思考将功能放在哪里，或者如何逻辑上将其拆分为多个部分。</li>
       <li>非常适合作为起点。</li>
</list>
</td>
<td>
<list>
  <li>随着共享模块的增长，编译时间会增加。</li>
  <li>这种设计不允许拥有独立的功能，或者仅依赖应用所需的功能。</li>
</list>
</td>
</tr>

</table>

### 多个共享模块

随着共享模块的增长，将其拆分为功能模块是一个好主意。这可以帮助您避免与仅拥有一个模块相关的可扩展性问题。

Android 应用可以直接依赖所有功能模块，或者根据需要仅依赖其中的一部分。

iOS 应用可以依赖由 Kotlin Multiplatform 模块生成的一个框架。当您使用多个模块时，您需要添加一个依赖于您正在使用的所有模块的额外模块，称为 _umbrella 模块_，然后您需要配置一个包含所有模块的框架，称为 _umbrella 框架_。

> Umbrella 框架包包含项目所有的共享模块，并被导入到 iOS 应用中。
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
       <li>更好的可扩展性。</li>
       </list>
</td>
<td>
<list>
  <li>设置更复杂，包括 umbrella 框架的设置。</li>
 <li>模块间的依赖管理更为复杂。</li>
</list>
</td>
</tr>

</table>

要设置 umbrella 模块，您需要添加一个独立的模块，该模块依赖于所有功能模块，并从该模块生成一个框架：

![Umbrella 框架](umbrella-framework.svg){width=700}

为了保持一致性，Android 应用既可以依赖于 umbrella 模块，也可以依赖于独立的功能模块。Umbrella 模块通常包含有用的工具函数和依赖注入设置代码。

您可以仅将部分模块导出到 umbrella 框架，通常是在构件作为远程依赖项被引用时。这样做的主要原因是通过确保排除自动生成的代码，来减小最终构件的大小。

Umbrella 框架方法的一个已知约束是 iOS 应用不能仅使用部分功能模块——它会自动引用所有模块。有关此功能的可能改进，请在 [KT-42247](https://youtrack.jetbrains.com/issue/KT-42247) 和 [KT-42250](https://youtrack.jetbrains.com/issue/KT-42250) 中描述您的案例。

> 在下面的示例中，当您看到 iOS 应用依赖于 umbrella 模块时，这意味着它也依赖于从该模块生成的 umbrella 框架。
>
{style="tip"}

#### 为什么需要 umbrella 框架？ {initial-collapse-state="collapsed" collapsible="true"}

虽然可以在 iOS 应用中包含由不同 Kotlin Multiplatform 共享模块生成的多个框架，但我们不推荐这种方法。当 Kotlin Multiplatform 模块被编译成框架时，生成的框架包含其所有的依赖项。每当两个或更多模块使用相同的依赖项，并作为独立的框架暴露给 iOS 时，Kotlin/Native 编译器就会重复这些依赖项。

这种重复会导致许多问题。首先，iOS 应用的大小会被不必要地撑大。其次，某个依赖项的代码结构与重复的依赖项的代码结构不兼容。这在尝试于 iOS 应用程序中集成具有相同依赖项的两个模块时会产生问题。例如，由不同模块通过相同依赖项传递的任何状态都不会连接在一起。这可能导致意外行为和错误。有关确切限制的更多详细信息，请参阅 [TouchLab 文档](https://touchlab.co/multiple-kotlin-frameworks-in-application/)。

Kotlin 不会生成通用的框架依赖项，因为否则会出现重复，而且您添加到应用中的任何 Kotlin 二进制文件都需要尽可能小。包含整个 Kotlin 运行时以及来自所有依赖项的所有代码是浪费的。Kotlin 编译器能够将二进制文件精确地裁剪为特定构建所需的内容。然而，它不知道其他构建可能需要什么，因此尝试共享依赖项是不可行的。我们正在探索各种方案来尽量减少此问题的影响。

此问题的解决方案是使用 umbrella 框架。它可以防止 iOS 应用因重复依赖而膨胀，有助于优化生成的构件，并消除由依赖项之间的不兼容所引起的困扰。

## 仓库配置

在新的和现有的 Kotlin Multiplatform 项目中，您可以使用多种仓库配置选项，包括使用单个仓库或多个仓库的组合。

### 单仓库：所有内容都在一个仓库中

一种常见的仓库配置称为单仓库 (monorepo) 配置。这种方法被用于 Kotlin Multiplatform 示例和教程中。在这种情况下，仓库包含 Android 和 iOS 应用，以及共享模块或多个模块（包括 umbrella 模块）：

![单仓库配置](monorepo-configuration-1.svg){width=700}

![单仓库配置](monorepo-configuration-2.svg){width=700}

通常，iOS 应用通过使用直接集成或 CocoaPods 集成，将 Kotlin Multiplatform 共享模块作为常规框架引用。请参阅[将 Kotlin Multiplatform 模块连接到 iOS 应用](#connect-a-kotlin-multiplatform-module-to-an-ios-app)了解更多详情和教程链接。

如果仓库处于版本控制下，应用和共享模块将拥有相同的版本。

<table>
  
<tr>
<th>优点</th>
     <th>缺点</th>
</tr>

  
<tr>
<td>
    <list>
       <li>借助向导易于设置。</li>
       <li>由于所有代码都位于同一个仓库中，iOS 开发者可以轻松处理 Kotlin Multiplatform 代码。</li>
</list>
</td>
<td>
<list>
  <li>iOS 开发者需要安装和配置不熟悉的工具。</li>
<li>对于已经存储在不同仓库中的现有应用，这种方法通常行不通。</li>
</list>
</td>
</tr>

</table>

当现有的 Android 和 iOS 应用已经存储在不同的仓库中时，您可以将 Kotlin Multiplatform 部分添加到 Android 仓库或单独的仓库中，而不是合并它们。

### 两个仓库：Android + 共享 | iOS

另一种项目配置是拥有两个仓库。在这种情况下，Kotlin Multiplatform 仓库包含 Android 应用和共享模块（包括 umbrella 模块），而 Xcode 项目包含 iOS 应用：

![两个仓库配置](two-repositories.svg){width=700}

Android 和 iOS 应用可以分别进行版本控制，而共享模块随 Android 应用一起进行版本控制。

### 三个仓库：Android | iOS | 共享

还有一个选项是为 Kotlin Multiplatform 模块建立一个单独的仓库。在这种情况下，Android 和 iOS 应用存储在独立的仓库中，项目的共享代码可以包含多个功能模块以及用于 iOS 的 umbrella 模块：

![三个仓库配置](three-repositories.svg){width=700}

每个项目都可以独立进行版本控制。Kotlin Multiplatform 模块也必须针对 Android 或 JVM 平台进行版本控制和发布。您可以独立发布功能模块，也可以仅发布 umbrella 模块并让 Android 应用依赖它。

与 Kotlin Multiplatform 模块作为 Android 项目一部分的情况相比，单独发布 Android 构件可能会给 Android 开发者带来额外的复杂性。

当 Android 和 iOS 团队都引用相同版本的构件时，他们在版本上保持同步。从团队的角度来看，这避免了共享的 Kotlin Multiplatform 代码由 Android 开发者“拥有”的印象。对于已经发布版本化的内部 Kotlin 和 Swift 软件包以进行功能开发的的大型项目，发布共享的 Kotlin 构件将成为现有工作流的一部分。

### 多个仓库：Android | iOS | 多个库

当功能需要在多个平台上的多个应用之间共享时，您可能更倾向于拥有多个带有 Kotlin Multiplatform 代码的仓库。例如，您可以将整个产品通用的日志库存储在具有自己版本控制的独立仓库中。

在这种情况下，您拥有多个 Kotlin Multiplatform 库仓库。如果多个 iOS 应用使用“库项目”的不同子集，每个应用都可以有一个额外的仓库，其中包含 umbrella 模块以及对库项目的必要依赖：

![多个仓库配置](many-repositories.svg){width=700}

在这里，每个库也必须针对 Android 或 JVM 平台进行版本控制和发布。应用和每个库都可以独立进行版本控制。

## 代码共享工作流

iOS 应用可以将由 Kotlin Multiplatform 共享模块生成的框架作为 _本地_ 或 _远程_ 依赖项引用。您可以通过在 iOS 构建中提供框架的本地路径来使用本地依赖项。在这种情况下，您不需要发布框架。或者，您可以将带有框架的构件发布到某处，并让 iOS 应用像引用任何其他第三方依赖项一样将其作为远程依赖项引用。

### 本地：源码分发

本地分发是指 iOS 应用引用 Kotlin Multiplatform 模块框架而无需发布。iOS 应用可以直接集成框架，也可以使用 CocoaPods 集成。

当 Android 和 iOS 团队成员都想编辑共享的 Kotlin Multiplatform 代码时，通常使用此工作流。iOS 开发者需要安装 IntelliJ IDEA 或 Android Studio，并具备 Kotlin 和 Gradle 的基础知识。

在本地分发方案中， iOS 应用构建会触发 iOS 框架的生成。这意味着 iOS 开发者可以立即观察到他们对 Kotlin Multiplatform 代码所做的更改：

![本地源码分发](local-source-distribution.svg){width=700}

这种情况通常用于两种案例。首先，它可以作为默认工作流用于单仓库项目配置，无需发布构件。其次，除了远程工作流之外，它还可以用于本地开发。请参阅[为本地开发设置本地依赖项](#setting-up-a-local-dependency-for-local-development)了解更多详情。

当所有团队成员都准备好编辑整个项目中的代码时，这种工作流最有效。它包括在对公共部分进行更改后的 Android 和 iOS 部分。理想情况下，每个团队成员都可以安装 IntelliJ IDEA/Android Studio 和 Xcode，以便在更改公共代码后打开并运行 Android 和 iOS 应用。

<table>
  
<tr>
<th>优点</th>
     <th>缺点</th>
</tr>

  
<tr>
<td>
    <list>
       <li>Android 和 iOS 团队成员都可以轻松编辑 Kotlin Multiplatform 代码，确保创建和维护共享代码是共同的责任。这有助于防止团队孤立并鼓励协作。</li>
       <li>这种方法不需要对共享代码进行单独的版本控制和发布。</li>
       <li>开发工作流更快，因为 iOS 团队成员不必等待构件创建和发布。</li>
   </list>
</td>
<td>
  <list>
    <li>团队成员需要在他们的机器上设置完整的开发环境。</li>
    <li>iOS 开发者必须学习如何使用 IntelliJ IDEA 或 Android Studio 以及 Gradle。</li>
    <li>随着共享代码的增多和团队的壮大，管理更改会变得困难。</li>
  </list>
</td>
</tr>

</table>

### 远程：构件分发

远程分发意味着框架构件使用 Swift 软件包管理器或作为 CocoaPod 发布，并由 iOS 应用引用。Android 应用可以本地或远程引用二进制依赖项。

远程分发常用于将技术逐步引入现有项目。它不会显著改变 iOS 开发者的工作流和构建过程。拥有两个或更多仓库的团队主要使用远程分发来存储项目代码。

作为开始，您可能想使用 [KMMBridge](https://touchlab.co/trykmmbridge) —— 一套极大地简化了远程分发工作流的构建工具。或者，您始终可以自行设置类似的工作流：

![远程构件分发](remote-artifact-distribution.svg){width=700}

<table>
  
<tr>
<th>优点</th>
     <th>缺点</th>
</tr>

  
<tr>
<td>不参与的 iOS 团队成员不必用 Kotlin 编写代码，也不必学习如何使用 IntelliJ IDEA/Android Studio 或 Gradle 等工具。
      这显著降低了团队的入门门槛。</td>
<td>
  <list>
    <li>对于 iOS 开发者来说，工作流较慢，因为编辑和构建共享代码的过程涉及发布和版本控制。</li>
   <li>在 iOS 上调试共享的 Kotlin 代码很困难。</li>
   <li>iOS 团队成员为共享代码做贡献的可能性显著降低。</li>
   <li>共享代码的维护完全落在参与的团队成员身上。</li>
  </list>
</td>
</tr>

</table>

#### 为本地开发设置本地依赖项

许多团队在采用 Kotlin Multiplatform 技术时选择远程分发工作流，以保持 iOS 开发者的开发过程不变。然而，在这种工作流中，他们很难更改 Kotlin Multiplatform 代码。我们建议设置一个额外的“本地开发”工作流，本地依赖于从 Kotlin Multiplatform 模块生成的框架。

当开发者添加新功能时，他们切换到将 Kotlin Multiplatform 模块作为本地依赖项引用。这允许更改通用的 Kotlin 代码，立即从 iOS 观察行为，并调试 Kotlin 代码。当功能就绪后，他们可以切换回远程依赖项并相应地发布他们的更改。首先，他们发布对共享模块的更改，然后才对应用进行更改。

对于远程分发工作流，使用 Swift 软件包管理器。对于本地分发工作流，直接集成框架。

<!-- This tutorial [TODO] describes how to switch workflows by choosing the corresponding scheme in Xcode:
[TODO screenshot] -->

如果您使用 CocoaPods，您也可以将 CocoaPods 用于本地分发工作流。您通过更改环境变量在它们之间进行切换，正如 [TouchLab 文档](https://touchlab.co/kmmbridgecocoapodslocal)中所述。