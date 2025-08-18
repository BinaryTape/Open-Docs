[//]: # (title: 设置环境)

在创建第一个 Kotlin Multiplatform 应用程序之前，您需要为 KMP 开发设置环境。

## 安装必要的工具

我们建议您安装最新的稳定版本，以获得更好的兼容性和性能。

<table>
   
<tr>
<td>工具</td>
      <td>备注</td>
</tr>

    
<tr>
<td><a href="https://developer.android.com/studio">Android Studio</a></td>
        <td>您将使用 Android Studio 创建多平台应用程序，并在模拟设备或硬件设备上运行它们。</td>
</tr>

    
<tr>
<td>
          <p><a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a></p>
          <p>如果您想在模拟设备或真机上运行 iOS 应用程序，则需要 Xcode。如果您使用不同的操作系统，请跳过此工具。</p>
        </td>
        <td>
          <p>在单独的窗口中启动 Xcode，以接受其许可条款并允许它执行一些必要的初始任务。</p>
          <p>大多数情况下，Xcode 会在后台运行。您将使用它为 iOS 应用程序添加 Swift 或 Objective-C 代码。</p>
            <note>
              <p>
                我们通常建议所有工具都使用最新的稳定版本。然而，Kotlin/Native 有时不会立即支持最新的 Xcode。您可以在 <a href="multiplatform-compatibility-guide.md#version-compatibility">undefined</a> 中检查支持的版本，并在必要时<a href="https://developer.apple.com/download/all/?q=Xcode">安装较早版本的 Xcode</a>。
              </p>
            </note>   
      </td>
</tr>

   
<tr>
<td><a href="https://www.oracle.com/java/technologies/javase-downloads.html">JDK</a></td>
        <td>要检测 Java 是否已安装，请在 Android Studio 终端或您的命令行中运行以下命令： <code style="block"
            lang="bash">java -version</code></td>
</tr>

   
<tr>
<td><Links href="/kmp/multiplatform-plugin-releases" summary="undefined">Kotlin Multiplatform 插件</Links></td>
        <td><p>在 Android Studio 中，打开<strong>设置</strong>（<strong>首选项</strong>），找到<strong>插件</strong>页面。在 <strong>Marketplace</strong> 选项卡中搜索 <i>Kotlin Multiplatform</i>，然后安装它。</p>
</td>
</tr>

   
<tr>
<td><a href="https://kotlinlang.org/docs/releases.html#update-to-a-new-release">Kotlin 插件</a></td>
        <td>
            <p>Kotlin 插件与每个 Android Studio 版本捆绑并自动更新。</p>
        </td>
</tr>

</table>

## 检测您的环境

为确保一切按预期工作，请安装并运行 KDoctor 工具：

> KDoctor 仅在 macOS 上运行。如果您使用不同的操作系统，请跳过此步骤。
>
{style="note"}

1. 在 Android Studio 终端或您的命令行工具中，运行以下命令以使用 Homebrew 安装该工具：

    ```bash
    brew install kdoctor
    ```

   如果您还没有 Homebrew，可以[安装它](https://brew.sh/)，或者参阅 KDoctor 的 [README](https://github.com/Kotlin/kdoctor#installation) 以了解其他安装方法。
2. 安装完成后，在控制台中调用 KDoctor： 

    ```bash
    kdoctor
    ```

3. 如果 KDoctor 在检测您的环境时诊断出任何问题，请审阅输出中的问题及可能的解决方案：

   * 修复任何失败的检测 (`[x]`)。您可以在 `*` 符号后找到问题描述和潜在解决方案。
   * 检查警告 (`[!]`) 和成功消息 (`[v]`)。它们也可能包含有用的注意事项和提示。
   
   > 您可以忽略 KDoctor 关于 CocoaPods 安装的警告。在您的第一个项目中，您将使用不同的 iOS framework 分发选项。
   >
   {style="tip"}

## 可能的问题和解决方案

<deflist collapsible="true">
   <def title="Kotlin 和 Android Studio">
      <list>
         <li>确保已安装 Android Studio。您可以从其<a href="https://developer.android.com/studio">官方网站</a>获取。</li>
         <li>您可能会遇到 <code>Kotlin not configured</code> 错误。这是 Android Studio Giraffe 2022.3 中的一个已知问题，不影响项目的构建和运行。为避免此错误，请点击<strong>忽略</strong>或升级到 Android Studio Hedgehog 2023.1。</li>
         <li>要使用最新的 Compose Multiplatform 共享 UI 代码，您的项目至少需要使用 Kotlin 2.1.0（当前版本为 %kotlinVersion%），并且也要依赖至少针对 Kotlin 2.1.0 编译的库。否则，您可能会遇到链接错误。</li>
      </list>
   </def>
   <def title="Java 和 JDK">
         <list>
           <li>确保已安装 JDK。您可以从其<a href="https://www.oracle.com/java/technologies/javase-downloads.html">官方网站</a>获取。</li>
           <li>Android Studio 使用捆绑的 JDK 执行 Gradle 任务。要在 Android Studio 中配置 Gradle JDK，请选择<strong>设置/首选项 | 构建、执行、部署 | 构建工具 | Gradle</strong>。</li>
           <li>您可能会遇到与 <code>JAVA_HOME</code> 相关的问题。此环境变量指定 Xcode 和 Gradle 所需的 Java 二进制文件的位置。如果遇到，请按照 KDoctor 的提示修复问题。</li>
         </list>
   </def>
   <def title="Xcode">
      <list>
         <li>确保已安装 Xcode。您可以从其<a href="https://developer.apple.com/xcode/">官方网站</a>获取。</li>
         <li>如果您尚未启动 Xcode，请在单独的窗口中打开它。接受许可条款并允许它执行一些必要的初始任务。</li>
         <li><p>您可能会遇到 <code>Error: can't grab Xcode schemes</code> 或其他关于命令行工具选择的问题。在这种情况下，请执行以下操作之一：</p>
             <list>
               <li><p>在终端中，运行：</p>
                   <code style="block"
                         lang="bash">sudo xcode-select --switch /Applications/Xcode.app</code>
               </li>
               <li>或者，在 Xcode 中，选择<strong>设置 | 位置</strong>。在<strong>命令行工具</strong>字段中，选择您的 Xcode 版本。
                   <img src="xcode-schemes.png" alt="Xcode schemes" width="500"/>
                   <p>确保已选择 <code>Xcode.app</code> 的路径。如果需要，请在单独的窗口中确认此操作。</p>
               </li>
             </list>
         </li>
      </list>
   </def>
   <def title="Kotlin 插件">
         <snippet>
            <p><strong>Kotlin Multiplatform 插件</strong></p>
               <list>
                  <li>确保 Kotlin Multiplatform 插件已安装并启用。在 Android Studio 欢迎界面，选择<strong>插件 | 已安装</strong>。验证是否已启用该插件。如果它不在<strong>已安装</strong>列表中，请在 <strong>Marketplace</strong> 中搜索并安装该插件。</li>
                  <li>如果插件已过时，请点击插件名称旁的<strong>更新</strong>。您也可以在<strong>设置/首选项 | 工具 | 插件</strong>部分执行相同的操作。</li>
                  <li>在 <a href="multiplatform-plugin-releases.md#release-details">undefined</a> 表中检查 Kotlin Multiplatform 插件与您的 Kotlin 版本的兼容性。</li>
               </list>
         </snippet>
         <snippet>
            <p><strong>Kotlin 插件</strong></p>
            <p>确保 Kotlin 插件已更新到最新版本。为此，在 Android Studio 欢迎界面，选择<strong>插件 | 已安装</strong>。点击 Kotlin 旁的<strong>更新</strong>。</p>
         </snippet>
   </def>
   <def title="命令行">
            <p>确保已安装所有必要的工具：</p>
            <list>
              <li><code>command not found: brew</code> – <a href="https://brew.sh/">安装 Homebrew</a>。</li>
              <li><code>command not found: java</code> – <a href="https://www.oracle.com/java/technologies/javase-downloads.html">安装 Java</a>。</li>
           </list>
    </def>
   <def title="仍然有问题？">
            <p>通过<a href="https://kotl.in/issue">创建 YouTrack 问题</a>与团队分享您的问题。</p>
   </def>
</deflist>

## 获取帮助

* **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
* **Kotlin 问题追踪器**。[报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。