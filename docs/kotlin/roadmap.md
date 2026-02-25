[//]: # (title: Kotlin 路线图)

<table>
    <tr>
        <td><strong>上次修改时间</strong></td>
        <td><strong>2025 年 8 月</strong></td>
    </tr>
    <tr>
        <td><strong>下次更新时间</strong></td>
        <td><strong>2026 年 2 月</strong></td>
    </tr>
</table>

欢迎阅读 Kotlin 路线图！在这里您可以预览 JetBrains 团队的工作重点。

## 关键优先级

路线图的目标是为您提供宏观视图。
以下是我们关键关注领域的列表——也是我们致力于交付的最重要的方向：

* **语言演进**：通过强调语义而非语法更改的实质性语言改进，保持 Kotlin 的实用性与表现力。
* **多平台**：通过强大的 iOS 支持、成熟的 Web 目标和可靠的 IDE 工具，为现代多平台应用构建基础。
* **保持平台中立**：无论开发者使用何种工具或目标，都为其提供支持。
* **生态系统支持**：简化 Kotlin 库、工具和框架的开发与发布流程。

## Kotlin 分子系统路线图

<!-- To view the biggest projects we're working on, see the [Roadmap details](#roadmap-details) table. -->

如果您对路线图或其中的项有任何疑问或反馈，欢迎发布到 [YouTrack 问题单](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) 或 Kotlin Slack 的 [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) 频道（[申请邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。

<!-- ### YouTrack board
Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->

<table>
    <tr>
        <th>子系统</th>
        <th>当前关注重点</th>
    </tr>
    <tr id="language">
        <td><strong>语言</strong></td>
        <td>
            <p><a href="kotlin-language-features-and-proposals.md">查看完整列表</a>以了解 Kotlin 语言功能和提案，或关注 <a href="https://youtrack.jetbrains.com/issue/KT-54620">即将推出的语言功能的 YouTrack 问题单</a></p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>编译器</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80304">Kotlin/Wasm：使用新的线程提案原型化多线程支持</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75371">完成 JSpecify 支持</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75372">弃用 K1 编译器</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75370">将 Kotlin/Wasm (<code>wasm-js</code> 目标) 提升至 Beta 阶段</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>多平台</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80305">在 Swift Export 中支持协程</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80308">Kotlin/JS：编译为现代 JavaScript</a></li> 
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80310">Kotlin/JS：扩展将 Kotlin 声明导出到 JavaScript 的可能性</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80307">Kotlin/JS：改进 Kotlin/JS 的入门材料</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71278">默认启用并发标记清除 (CMS) GC</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-68323">实现下一代多平台库分发格式</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">统一所有 Kotlin 目标之间的内联语义</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">默认启用 klib 构件的增量编译</a></li>
            </list>
            <tip><p><a href="https://jb.gg/kmp-roadmap-2025" target="_blank">Kotlin 多平台开发路线图</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>工具</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">支持 Kotlin LSP 和 VS Code</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTIJ-35208" target="_blank">改进 Kotlin + JPA 体验</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">在 Gradle 项目隔离中支持 Kotlin JS\WASM</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-1133" target="_blank">Kotlin Notebooks：支持新用例</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">改进 IntelliJ IDEA 中 Kotlin/Wasm 项目的开发体验</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">改进导入性能</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 模式完全发布</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">设计构建工具 API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">发布支持声明式 Gradle 的 Kotlin 生态系统插件</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">改进 Kotlin 脚本编写及 <code>.gradle.kts</code> 的使用体验</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>生态系统</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80323">实现 KDoc 机器可读表示</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80324">稳定 Kotlin Notebooks</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80327">发布 Kotlin 数据帧 1.0</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80328">发布 Kandy 0.9</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">为返回非 Unit 值且未使用的 Kotlin 函数引入默认警告/错误</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">标准库的新多平台 API：支持 Unicode 和代码点</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">稳定 <code>kotlinx-io</code> 库</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">改进 Kotlin 分发用户体验：添加代码覆盖率和二进制兼容性验证</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">将 <code>kotlinx-datetime</code> 提升至 Beta 阶段</a></li>
            </list>
            <p><b>Ktor：</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-8316">为 Ktor 客户端和服务器应用程序支持 OpenAPI 规范</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6622">改进 Ktor 管理与可观测性</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7958">WebRTC 客户端</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501">通过生成器插件和教程为 Ktor 添加 gRPC 支持</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6026">创建 Kubernetes 生成器插件</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6621">简化依赖注入的使用</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3 支持</a></li>
            </list>
            <p><b>Exposed：</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">发布 1.0.0 版本</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">添加 R2DBC 支持</a></li>
            </list>
         </td>
    </tr>
</table>

> * 此路线图并非团队正在进行的所有工作的详尽列表，仅包含重大项目。
> * 我们不承诺在特定版本中交付特定的功能或修复。
> * 我们将根据实际进度调整优先级，并大约每六个月更新一次路线图。
> 
{style="note"}

## 自 2025 年 2 月以来的变化

### 已完成项

我们已**完成**上一个路线图中的以下项目：

* ✅ 多平台：[Swift Export 的首次公开发布](https://youtrack.jetbrains.com/issue/KT-64572)
* ✅ 多平台：[支持在项目级声明 Kotlin 多平台依赖项](https://youtrack.jetbrains.com/issue/KT-71289)
* ✅ 多平台：[稳定不同平台上的 klib 交叉编译](https://youtrack.jetbrains.com/issue/KT-71290)
* ✅ 多平台：[Kotlin/JS：在 Compose 回退模式下支持 WasmJS 和 JS 之间的公共源](https://youtrack.jetbrains.com/issue/KT-79394)
* ✅ 工具：[改进 Kotlin 构建报告](https://youtrack.jetbrains.com/issue/KT-60279)
* ✅ 工具：[在 Gradle DSL 中公开稳定的编译器参数](https://youtrack.jetbrains.com/issue/KT-55515)
* ✅ 工具：[支持 Gradle 项目隔离](https://youtrack.jetbrains.com/issue/KT-54105)
* ✅ 工具：[改进 Kotlin/Native 工具链到 Gradle 的集成](https://youtrack.jetbrains.com/issue/KT-64577)
* ✅ 工具：[Kotlin Notebook：更流畅的访问和改进的体验](https://youtrack.jetbrains.com/issue/KTNB-898)
* ✅ 工具：[支持 XCFrameworks 中的资源](https://youtrack.jetbrains.com/issue/KT-75377)
* ✅ 生态系统：[优化 Dokka HTML 输出 UI](https://youtrack.jetbrains.com/issue/KT-71295)
* ✅ 生态系统：[简化后端应用程序的项目结构化](https://youtrack.jetbrains.com/issue/KTOR-7158)
* ✅ 生态系统：[将 CLI 生成器发布到 SNAP](https://youtrack.jetbrains.com/issue/KTOR-3937)
* ✅ 生态系统：[简化依赖注入的使用](https://youtrack.jetbrains.com/issue/KTOR-6621)

### 新增项

我们在路线图中**添加**了以下项目：

* 🆕 编译器：[Kotlin/Wasm：使用新的线程提案原型化多线程支持](https://youtrack.jetbrains.com/issue/KT-80304)
* 🆕 多平台：[在 Swift Export 中支持协程](https://youtrack.jetbrains.com/issue/KT-80305)
* 🆕 多平台：[Kotlin/JS：编译为现代 JavaScript](https://youtrack.jetbrains.com/issue/KT-80308)
* 🆕 多平台：[Kotlin/JS：扩展将 Kotlin 声明导出到 JavaScript 的可能性](https://youtrack.jetbrains.com/issue/KT-80310)
* 🆕 多平台：[Kotlin/JS：改进 Kotlin/JS 的入门材料](https://youtrack.jetbrains.com/issue/KT-80307)
* 🆕 工具：[支持 Kotlin LSP 和 VS Code](https://youtrack.jetbrains.com/issue/KT-80322)
* 🆕 工具：[改进 Kotlin + JPA 体验](https://youtrack.jetbrains.com/issue/KTIJ-35208)
* 🆕 工具：[在 Gradle 项目隔离中支持 Kotlin JS\WASM](https://youtrack.jetbrains.com/issue/KT-80311)
* 🆕 工具：[Kotlin Notebooks：支持新用例](https://youtrack.jetbrains.com/issue/KTNB-1133)
* 🆕 生态系统：[实现 KDoc 机器可读表示](https://youtrack.jetbrains.com/issue/KT-80323)
* 🆕 生态系统：[稳定 Kotlin Notebooks](https://youtrack.jetbrains.com/issue/KT-80324)
* 🆕 生态系统：[发布 Kotlin 数据帧 1.0](https://youtrack.jetbrains.com/issue/KT-80327)
* 🆕 生态系统：[发布 Kandy 0.9](https://youtrack.jetbrains.com/issue/KT-80328)
* 🆕 生态系统：[为 Ktor 客户端和服务器应用程序支持 OpenAPI 规范](https://youtrack.jetbrains.com/issue/KTOR-8316)
* 🆕 生态系统：[改进 Ktor 管理与可观测性](https://youtrack.jetbrains.com/issue/KTOR-6622)
* 🆕 生态系统：[WebRTC 客户端](https://youtrack.jetbrains.com/issue/KTOR-7958)

### 移除项

我们从路线图中**移除**了以下项目：

* ❌ 编译器：[Kotlin/Wasm：将库的 wasm-wasi 目标切换到 WASI Preview 2](https://youtrack.jetbrains.com/issue/KT-64568)
* ❌ 编译器：[Kotlin/Wasm：支持组件模型](https://youtrack.jetbrains.com/issue/KT-64569)
* ❌ 生态系统：[发布到 Snap](https://youtrack.jetbrains.com/issue/KTOR-3937)

> 部分项目已从路线图中移除，但并未完全放弃。在某些情况下，我们将之前的路线图项目与当前项目进行了合并。
>
{style="note"}