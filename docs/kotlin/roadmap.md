[//]: # (title: Kotlin 路线图)

<table>
    <tr>
        <td><strong>上次修改时间</strong></td>
        <td><strong>2025 年 2 月</strong></td>
    </tr>
    <tr>
        <td><strong>下次更新时间</strong></td>
        <td><strong>2025 年 8 月</strong></td>
    </tr>
</table>

欢迎来到 Kotlin 路线图！在这里，您可以抢先了解 JetBrains 团队的优先事项。

## 关键优先事项

本路线图旨在为您提供宏观视角。
以下是我们的关键重点领域——我们致力于交付的最重要方向：

*   **语言演进**：更高效的数据处理、更高的抽象级别、增强的性能以及清晰的代码。
*   **Kotlin Multiplatform**：发布 Kotlin 到 Swift Export 的直接支持、简化构建设置，以及简化多平台库的创建。
*   **第三方生态系统作者的体验**：简化 Kotlin 库、工具和框架的开发和发布流程。

## 按子系统划分的 Kotlin 路线图

<!-- To view the biggest projects we're working on, see the [Roadmap details](#roadmap-details) table. -->

如果您对路线图或其中的项目有任何疑问或反馈，请随时在 [YouTrack 任务](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)中发布，或在 Kotlin Slack 的 [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) 频道中发布（[请求邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。

<!-- ### YouTrack board
Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->

<table>
    <tr>
        <th>子系统</th>
        <th>当前重点</th>
    </tr>
    <tr id="language">
        <td><strong>语言</strong></td>
        <td>
            <p><a href="kotlin-language-features-and-proposals.md">查看 Kotlin 语言特性和提案的完整列表</a>，或关注<a href="https://youtrack.jetbrains.com/issue/KT-54620">YouTrack 中即将推出的语言特性任务</a></p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>编译器</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75371">最终确定 JSpecify 支持</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75372">废弃 K1 编译器</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75370">将 Kotlin/Wasm (<code>wasm-js</code> 目标) 升级为 Beta 版</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm：将库的 <code>wasm-wasi</code> 目标切换到 WASI Preview 2</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm：支持 Component Model</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>多平台</strong></td>
        <td>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64572">Swift Export 的首次公开发布</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71278">默认启用并发标记清除 (CMS) GC</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71290">稳定化 klib 在不同平台上的交叉编译</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71281">实现下一代多平台库分发格式</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71289">支持在项目级别声明 Kotlin Multiplatform 依赖项</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">统一所有 Kotlin 目标之间的内联语义</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">默认启用 klib artifact 的增量编译</a></li>
            </list>
            <tip><p><a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-roadmap.html" target="_blank">Kotlin Multiplatform 开发路线图</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>工具</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">改进 IntelliJ IDEA 中 Kotlin/Wasm 项目的开发体验</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">提升导入性能</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75377" target="_blank">支持 XCFrameworks 中的资源</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-898" target="_blank">Kotlin Notebook：更流畅的访问和改进的体验</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 模式完整发布</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71286" target="_blank">设计构建工具 API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">支持声明式 Gradle 的 Kotlin 生态系统插件</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-54105" target="_blank">支持 Gradle 项目隔离</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64577" target="_blank">改进 Kotlin/Native 工具链与 Gradle 的集成</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60279" target="_blank">改进 Kotlin 构建报告</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-55515" target="_blank">在 Gradle DSL 中暴露稳定编译器实参</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">改进 Kotlin 脚本和 <code>.gradle.kts</code> 的使用体验</a></li>
            </list>
         </td>
    </tr>
    <tr id="library-ecosystem">
        <td><strong>库生态系统</strong></td>
        <td>
            <p><b>库生态系统路线图项：</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71295" target="_blank">优化 Dokka HTML 输出 UI</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">为返回非 Unit 且未使用的 Kotlin 函数引入默认警告/错误</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">标准库的新多平台 API：支持 Unicode 和 codepoint</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">稳定化 <code>kotlinx-io</code> 库</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">改进 Kotlin 分发 UX：添加代码覆盖率和二进制兼容性验证</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">将 <code>kotlinx-datetime</code> 升级为 Beta 版</a></li>
            </list>
            <p><b>Ktor：</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-1501">为 Ktor 添加 gRPC 支持，包括生成器插件和教程</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7158">简化后端应用程序的项目结构</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-3937">将 CLI 生成器发布到 SNAP</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6026">创建 Kubernetes 生成器插件</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6621">简化依赖注入的使用</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3 支持</a></li>
            </list>
            <p><b>Exposed：</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">发布 1.0.0 版</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">添加 R2DBC 支持</a></li>
            </list>
         </td>
    </tr>
</table>

> * 此路线图并非团队所有工作内容的详尽列表，仅包含最重要的项目。
> * 不承诺在特定版本中交付特定特性或修复。
> * 我们将根据进展调整优先级，并大约每六个月更新一次路线图。
> 
{style="note"}

## 自 2024 年 9 月以来的变化

### 已完成项

我们已**完成**前版路线图中的以下项：

*   ✅ 编译器：[支持在 Android 上调试内联函数](https://youtrack.jetbrains.com/issue/KT-60276)
*   ✅ 编译器：[提高编译器诊断的质量](https://youtrack.jetbrains.com/issue/KT-71275)
*   ✅ 多平台：[在 Kotlin 中支持 Xcode 16](https://youtrack.jetbrains.com/issue/KT-71287)
*   ✅ 多平台：[发布 Kotlin Gradle Plugin 的公共可用 API 参考](https://youtrack.jetbrains.com/issue/KT-71288)
*   ✅ 工具：[为 Kotlin/Wasm 目标提供开箱即用的调试体验](https://youtrack.jetbrains.com/issue/KT-71276)
*   ✅ 库生态系统：[实现基于 Dokkatoo 的新 Dokka Gradle 插件](https://youtrack.jetbrains.com/issue/KT-71293)
*   ✅ 库生态系统：[标准库的新多平台 API：Atomics](https://youtrack.jetbrains.com/issue/KT-62423)
*   ✅ 库生态系统：[扩展库作者指南](https://youtrack.jetbrains.com/issue/KT-71299)

### 新增项

我们已**添加**以下项到路线图中：

*   🆕 编译器：[最终确定 JSpecify 支持](https://youtrack.jetbrains.com/issue/KT-75371)
*   🆕 编译器：[废弃 K1 编译器](https://youtrack.jetbrains.com/issue/KT-75372)
*   🆕 编译器：[将 Kotlin/Wasm (`wasm-js` 目标) 升级为 Beta 版](https://youtrack.jetbrains.com/issue/KT-75370)
*   🆕 工具：[改进 IntelliJ IDEA 中 Kotlin/Wasm 项目的开发体验](https://youtrack.jetbrains.com/issue/KT-75374)
*   🆕 工具：[提升导入性能](https://youtrack.jetbrains.com/issue/KT-75376)
*   🆕 工具：[支持 XCFrameworks 中的资源](https://youtrack.jetbrains.com/issue/KT-75377)
*   🆕 工具：[提升 Kotlin Notebook 的访问和使用体验](https://youtrack.jetbrains.com/issue/KTNB-898)
*   🆕 Ktor：[为 Ktor 添加 gRPC 支持，包括生成器插件和教程](https://youtrack.jetbrains.com/issue/KTOR-1501)
*   🆕 Ktor：[简化后端应用程序的项目结构](https://youtrack.jetbrains.com/issue/KTOR-7158)
*   🆕 Ktor：[将 CLI 生成器发布到 SNAP](https://youtrack.jetbrains.com/issue/KTOR-3937)
*   🆕 Ktor：[创建 Kubernetes 生成器插件](https://youtrack.jetbrains.com/issue/KTOR-6026)
*   🆕 Ktor：[简化依赖注入的使用](https://youtrack.jetbrains.com/issue/KTOR-6621)
*   🆕 Ktor：[HTTP/3 支持](https://youtrack.jetbrains.com/issue/KTOR-7938)
*   🆕 Exposed：[发布 1.0.0 版](https://youtrack.jetbrains.com/issue/EXPOSED-444)
*   🆕 Exposed：[添加 R2DBC 支持](https://youtrack.jetbrains.com/issue/EXPOSED-74)

<!--
### Removed items

We've **removed** the following items from the roadmap:

* ❌ Compiler: [Improve the quality of compiler diagnostics](https://youtrack.jetbrains.com/issue/KT-71275)

> Some items were removed from the roadmap but not dropped completely. In some cases, we've merged previous roadmap items
> with the current ones.
>
{style="note"}
-->

### 正在进行中的项

所有其他先前确定的路线图项都在进行中。您可以查看其 [YouTrack 任务](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)以获取更新。