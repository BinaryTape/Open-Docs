[//]: # (title: 设置环境)

在创建你的第一个 Kotlin Multiplatform 应用程序之前，你需要为 KMP 开发设置环境。

## 安装必要的工具

我们建议你安装最新的稳定版本，以获得更好的兼容性和性能。

<table>
   <tr>
      <td>工具</td>
      <td>备注</td>
   </tr>
    <tr>
        <td><a href="https://developer.android.com/studio">Android Studio</a></td>
        <td>你将使用 Android Studio 创建你的多平台应用程序，并在模拟设备或硬件设备上运行它们。</td>
    </tr>
    <tr>
        <td>
          <p><a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a></p>
          <p>如果你想在模拟设备或真实设备上运行 iOS 应用程序，则需要 Xcode。如果你使用不同的操作系统，请跳过此工具。</p>
        </td>
        <td>
          <p>在单独的窗口中启动 Xcode，以接受其许可条款并允许其执行一些必要的初始任务。</p>
          <p>大多数情况下，Xcode 将在后台运行。你将使用它向你的 iOS 应用程序添加 Swift 或 Objective-C 代码。</p>
            <note>
              <p>
                我们通常建议所有工具都使用最新的稳定版本。然而，Kotlin/Native 有时不能立即支持最新的 Xcode。你可以在<a href="multiplatform-compatibility-guide.md#version-compatibility">兼容性指南</a>中查看支持的版本，并在必要时<a href="https://developer.apple.com/download/all/?q=Xcode">安装更早版本的 Xcode</a>。
              </p>
            </note>   
      </td>
   </tr>
   <tr>
        <td><a href="https://www.oracle.com/java/technologies/javase-downloads.html">JDK</a></td>
        <td>要检测 Java 是否已安装，请在 Android Studio 终端或你的命令行中运行以下命令：<code style="block"
            lang="bash">java -version</code></td>
   </tr>
   <tr>
        <td><a href="multiplatform-plugin-releases.md">Kotlin Multiplatform plugin</a></td>
        <td><p>在 Android Studio 中，打开 <strong>Settings</strong>（<strong>Preferences</strong>），然后找到 <strong>Plugins</strong> 页面。在 <strong>Marketplace</strong> 选项卡中搜索 <i>Kotlin Multiplatform</i>，然后安装它。</p>
</td>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/docs/releases.html#update-to-a-new-release">Kotlin plugin</a></td>
        <td>
            <p>Kotlin 插件与每个 Android Studio 版本捆绑在一起并自动更新。</p>
        </td>
   </tr>
</table>

## 检查你的环境

为确保一切按预期工作，请安装并运行 KDoctor 工具：

> KDoctor 仅在 macOS 上运行。如果你使用不同的操作系统，请跳过此步骤。
>
{style="note"}

1.  在 Android Studio 终端或你的命令行工具中，运行以下命令使用 Homebrew 安装该工具：

    ```bash
    brew install kdoctor
    ```

    如果你还没有 Homebrew，请[安装它](https://brew.sh/)，或查看 KDoctor 的 [README](https://github.com/Kotlin/kdoctor#installation) 以了解其他安装方式。
2.  安装完成后，在控制台中调用 KDoctor：

    ```bash
    kdoctor
    ```

3.  如果 KDoctor 在检查你的环境时诊断出任何问题，请查看输出以获取问题和可能的解决方案：

    *   修复任何失败的检测 (`[x]`)。你可以在 `*` 符号后找到问题描述和潜在解决方案。
    *   检查警告 (`[!]`) 和成功消息 (`[v]`)。它们也可能包含有用的说明和提示。

    > 你可以忽略 KDoctor 关于 CocoaPods 安装的警告。在你的第一个项目中，你将使用不同的 iOS 框架分发选项。
    >
    {style="tip"}

## 可能的问题与解决方案

<deflist collapsible="true">
   <def title="Kotlin 与 Android Studio">
      <list>
         <li>确保你已安装 Android Studio。你可以从其<a href="https://developer.android.com/studio">官方网站</a>获取。</li>
         <li>你可能会遇到 <code>Kotlin not configured</code> 错误。这是 Android Studio Giraffe 2022.3 中的一个已知 issue，它不影响项目构建和运行。为避免此错误，请点击 <strong>Ignore</strong> 或升级到 Android Studio Hedgehog 2023.1。</li>
         <li>要使用最新的 Compose Multiplatform 共享 UI 代码，你的项目至少应使用 Kotlin 2.1.0（当前版本为 %kotlinVersion%），并且依赖于至少使用 Kotlin 2.1.0 编译的库。否则，你可能会遇到链接错误。</li>
      </list>
   </def>
   <def title="Java 与 JDK">
         <list>
           <li>确保你已安装 JDK。你可以从其<a href="https://www.oracle.com/java/technologies/javase-downloads.html">官方网站</a>获取。</li>
           <li>Android Studio 使用捆绑的 JDK 执行 Gradle 任务。要在 Android Studio 中配置 Gradle JDK，请选择 <strong>Settings/Preferences | Build, Execution, Deployment | Build Tools | Gradle</strong>。</li>
           <li>你可能会遇到与 <code>JAVA_HOME</code> 相关的问题。此环境变量指定了 Xcode 和 Gradle 所需的 Java 二进制文件位置。如果是这样，请按照 KDoctor 的提示解决这些问题。</li>
         </list>
   </def>
   <def title="Xcode">
      <list>
         <li>确保你已安装 Xcode。你可以从其<a href="https://developer.apple.com/xcode/">官方网站</a>获取。</li>
         <li>如果你尚未启动 Xcode，请在单独的窗口中打开它。接受许可条款并允许它执行一些必要的初始任务。</li>
         <li><p>你可能会遇到 <code>Error: can't grab Xcode schemes</code> 或其他关于命令行工具选择的问题。在这种情况下，请执行以下操作之一：</p>
             <list>
               <li><p>在 Terminal 中运行：</p>
                   <code style="block"
                         lang="bash">sudo xcode-select --switch /Applications/Xcode.app</code>
               </li>
               <li>或者，在 Xcode 中，选择 <strong>Settings | Locations</strong>。在 <strong>Command Line Tools</strong> 字段中，选择你的 Xcode 版本。
                   <img src="xcode-schemes.png" alt="Xcode schemes" width="500"/>
                   <p>确保已选择 <code>Xcode.app</code> 的路径。如果需要，请在单独的窗口中确认此操作。</p>
               </li>
             </list>
         </li>
      </list>
   </def>
   <def title="Kotlin 插件">
         <snippet>
            <p><strong>Kotlin Multiplatform plugin</strong></p>
               <list>
                  <li>确保 Kotlin Multiplatform 插件已安装并启用。在 Android Studio 欢迎界面，选择 <strong>Plugins | Installed</strong>。验证你已启用该插件。如果它不在 <strong>Installed</strong> 列表中，请在 <strong>Marketplace</strong> 中搜索并安装该插件。</li>
                  <li>如果插件已过时，请点击插件名称旁边的 <strong>Update</strong>。你也可以在 <strong>Settings/Preferences | Tools | Plugins</strong> 部分执行相同的操作。</li>
                  <li>在<a href="multiplatform-plugin-releases.md#release-details">发布详情表</a>中检查 Kotlin Multiplatform 插件与你的 Kotlin 版本的兼容性。</li>
               </list>
         </snippet>
         <snippet>
            <p><strong>Kotlin plugin</strong></p>
            <p>确保 Kotlin 插件已更新到最新版本。为此，在 Android Studio 欢迎界面，选择 <strong>Plugins | Installed</strong>。点击 Kotlin 旁边的 <strong>Update</strong>。</p>
         </snippet>
   </def>
   <def title="命令行">
            <p>确保你已安装所有必要的工具：</p>
            <list>
              <li><code>command not found: brew</code> – <a href="https://brew.sh/">安装 Homebrew</a>。</li>
              <li><code>command not found: java</code> – <a href="https://www.oracle.com/java/technologies/javase-downloads.html">安装 Java</a>。</li>
           </list>
    </def>
   <def title="仍然遇到问题？">
            <p>通过<a href="https://kotl.in/issue">创建 YouTrack issue</a> 与团队分享你的问题。</p>
   </def>
</deflist>

## 获取帮助

*   **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
*   **Kotlin issue tracker**。 [报告新的 issue](https://youtrack.jetbrains.com/newIssue?project=KT)。