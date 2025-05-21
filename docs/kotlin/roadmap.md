---
title: "Kotlin 路线图"
---
<table>
<tr>
<td>
<strong>上次修改时间</strong>
</td>
<td>
<strong>2025年2月</strong>
</td>
</tr>
<tr>
<td>
<strong>下次更新</strong>
</td>
<td>
<strong>2025年8月</strong>
</td>
</tr>
</table>

欢迎来到 Kotlin 路线图！先睹为快，了解 JetBrains 团队的优先事项。

## 主要优先事项

此路线图的目标是让您了解全局。
以下是我们主要关注领域的列表 - 我们致力于交付的最重要的方向：

* **语言演进（Language evolution）**：更高效的数据处理、更高的抽象级别、通过清晰的代码增强性能。
* **Kotlin Multiplatform**：发布直接的 Kotlin 到 Swift 导出（Kotlin to Swift Export）、简化的构建设置和简化的多平台库创建。
* **第三方生态系统作者的体验（Experience of third-party ecosystem authors）**：简化 Kotlin 库、工具和框架的开发和发布流程。

## 按子系统划分的 Kotlin 路线图

<!-- 要查看我们正在进行的最大项目，请参阅 [路线图详细信息](#roadmap-details) 表。 -->

如果您对路线图或其中的项目有任何疑问或反馈，请随时将其发布到 [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) 或 Kotlin Slack 的 [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) 频道（[申请邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。

<!-- ### YouTrack board
访问我们的问题跟踪器 YouTrack 中的 [路线图看板](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->
<table>
<tr>
        <th>子系统（Subsystem）</th>
        <th>当前关注</th>
</tr>
<tr id="language">
<td>
<strong>语言（Language）</strong>
</td>
<td>

<p>
   <a href="kotlin-language-features-and-proposals">查看 Kotlin 语言特性和提案的完整列表</a> 或关注 <a href="https://youtrack.jetbrains.com/issue/KT-54620">YouTrack issue 以获取即将推出的语言特性</a>
</p>
</td>
</tr>
<tr id="compiler">
<td>
<strong>编译器（Compiler）</strong>
</td>
<td>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75371">完成 JSpecify 支持</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75372">弃用 K1 编译器</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75370">将 Kotlin/Wasm (`wasm-js` target) 提升到 Beta</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: 将库的 `wasm-wasi` 目标切换到 WASI Preview 2</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: 支持组件模型（Component Model）</a></li>
</list>
</td>
</tr>
<tr id="multiplatform">
<td>
<strong>Multiplatform</strong>
</td>
<td>
<list>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64572">Swift 导出的第一个公开版本</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71278">默认启用并发标记清除（Concurrent Mark and Sweep (CMS) GC）</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71290">稳定不同平台上的 klib 交叉编译</a></li> 
<li><a href="https://youtrack.jetbrains.com/issue/KT-71281">实现多平台库的下一代分发格式</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71289">支持在项目级别声明 Kotlin Multiplatform 依赖项</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">统一所有 Kotlin 目标之间的内联语义</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">默认启用 klib 制品（artifact）的增量编译</a></li>
</list>
            <tip><p>
   <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-roadmap.html" target="_blank">Kotlin Multiplatform 开发路线图</a>
</p></tip>
</td>
</tr>
<tr id="tooling">
<td>
<strong>工具（Tooling）</strong>
</td>
<td>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">改善 IntelliJ IDEA 中 Kotlin/Wasm 项目的开发体验</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">提高导入性能</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75377" target="_blank">在 XCFrameworks 中支持资源</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-898" target="_blank">Kotlin Notebook：更流畅的访问和改进的体验</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 模式完整发布</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71286" target="_blank">设计构建工具 API（Build Tools API）</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">支持声明式 Gradle 的 Kotlin 生态系统插件</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-54105" target="_blank">支持 Gradle 项目隔离</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64577" target="_blank">改进 Kotlin/Native 工具链与 Gradle 的集成</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-60279" target="_blank">改进 Kotlin 构建报告</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-55515" target="_blank">在 Gradle DSL 中公开稳定的编译器参数</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">改进 Kotlin 脚本和 `.gradle.kts` 的体验</a></li>
</list>
</td>
</tr>
<tr id="library-ecosystem">
<td>
<strong>库生态系统（Library ecosystem）</strong>
</td>
<td>

<p>
   <b>库生态系统路线图项目：</b>
</p>
<list>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71295" target="_blank">改进 Dokka HTML 输出 UI</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">为返回未使用非 unit 值的 Kotlin 函数引入默认警告/错误</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">标准库的新多平台 API：支持 Unicode 和码位</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">稳定 `kotlinx-io` 库</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">改进 Kotlin 分发 UX：添加代码覆盖率和二进制兼容性验证</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">将 `kotlinx-datetime` 提升到 Beta</a></li>
</list>
<p>
   <b>Ktor:</b>
</p>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-1501">使用生成器插件和教程向 Ktor 添加 gRPC 支持</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7158">简化后端应用程序的项目结构</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-3937">将 CLI 生成器发布到 SNAP</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6026">创建 Kubernetes 生成器插件</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6621">简化依赖注入的使用</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3 支持</a></li>
</list>
<p>
   <b>Exposed:</b>
</p>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">发布 1.0.0</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">添加 R2DBC 支持</a></li>
</list>
</td>
</tr>
</table>
:::note
* 此路线图并非团队正在进行的所有工作的详尽列表，仅包含最大的项目。
* 不承诺在特定版本中交付特定功能或修复。
* 我们将根据进展调整优先级，并大约每六个月更新一次路线图。

:::

## 自 2024 年 9 月以来的变化

### 已完成的项目

我们**已完成**先前路线图中的以下项目：

* ✅ 编译器（Compiler）：[支持在 Android 上调试内联函数](https://youtrack.jetbrains.com/issue/KT-60276)
* ✅ 编译器（Compiler）：[提高编译器诊断的质量](https://youtrack.jetbrains.com/issue/KT-71275)
* ✅ Multiplatform: [在 Kotlin 中支持 Xcode 16](https://youtrack.jetbrains.com/issue/KT-71287)
* ✅ Multiplatform: [发布 Kotlin Gradle 插件的公开 API 参考](https://youtrack.jetbrains.com/issue/KT-71288)
* ✅ 工具（Tooling）：[为 Kotlin/Wasm 目标提供开箱即用的调试体验](https://youtrack.jetbrains.com/issue/KT-71276)
* ✅ 库生态系统（Library ecosystem）：[实施基于 Dokkatoo 的新 Dokka Gradle 插件](https://youtrack.jetbrains.com/issue/KT-71293)
* ✅ 库生态系统（Library ecosystem）：[标准库的新多平台 API：Atomics](https://youtrack.jetbrains.com/issue/KT-62423)
* ✅ 库生态系统（Library ecosystem）：[扩展库作者指南](https://youtrack.jetbrains.com/issue/KT-71299)

### 新项目

我们已将以下项目**添加**到路线图：

* 🆕 编译器（Compiler）：[完成 JSpecify 支持](https://youtrack.jetbrains.com/issue/KT-75371)
* 🆕 编译器（Compiler）：[弃用 K1 编译器](https://youtrack.jetbrains.com/issue/KT-75372)
* 🆕 编译器（Compiler）：[将 Kotlin/Wasm (`wasm-js` target) 提升到 Beta](https://youtrack.jetbrains.com/issue/KT-75370)
* 🆕 工具（Tooling）：[改善 IntelliJ IDEA 中 Kotlin/Wasm 项目的开发体验](https://youtrack.jetbrains.com/issue/KT-75374)
* 🆕 工具（Tooling）：[提高导入性能](https://youtrack.jetbrains.com/issue/KT-75376)
* 🆕 工具（Tooling）：[在 XCFrameworks 中支持资源](https://youtrack.jetbrains.com/issue/KT-75377)
* 🆕 工具（Tooling）：[Kotlin Notebook 中更流畅的访问和改进的体验](https://youtrack.jetbrains.com/issue/KTNB-898)
* 🆕 Ktor: [使用生成器插件和教程向 Ktor 添加 gRPC 支持](https://youtrack.jetbrains.com/issue/KTOR-1501)
* 🆕 Ktor: [简化后端应用程序的项目结构](https://youtrack.jetbrains.com/issue/KTOR-7158)
* 🆕 Ktor: [将 CLI 生成器发布到 SNAP](https://youtrack.jetbrains.com/issue/KTOR-3937)
* 🆕 Ktor: [创建 Kubernetes 生成器插件](https://youtrack.jetbrains.com/issue/KTOR-6026)
* 🆕 Ktor: [简化依赖注入的使用](https://youtrack.jetbrains.com/issue/KTOR-6621)
* 🆕 Ktor: [HTTP/3 支持](https://youtrack.jetbrains.com/issue/KTOR-7938)
* 🆕 Exposed: [发布 1.0.0](https://youtrack.jetbrains.com/issue/EXPOSED-444)
* 🆕 Exposed: [添加 R2DBC 支持](https://youtrack.jetbrains.com/issue/EXPOSED-74)

<!--
### Removed items

We've **removed** the following items from the roadmap:

* ❌ Compiler: [Improve the quality of compiler diagnostics](https://youtrack.jetbrains.com/issue/KT-71275)

> Some items were removed from the roadmap but not dropped completely. In some cases, we've merged previous roadmap items
> with the current ones.
>
{style="note"}
-->

### 进行中的项目

所有其他先前确定的路线图项目都在进行中。您可以查看他们的 [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)
获取更新。