[//]: # (title: Kotlin 路线图)

<table>
    <tr>
        <td><strong>上次修改时间</strong></td>
        <td><strong>2026 年 2 月</strong></td>
    </tr>
    <tr>
        <td><strong>下次更新时间</strong></td>
        <td><strong>2026 年 8 月</strong></td>
    </tr>
</table>

欢迎阅读 Kotlin 路线图！在这里您可以预览 JetBrains 团队的工作重点。

## 关键优先级

路线图的目标是为您提供宏观视图。
以下是我们关键关注领域的列表——也是我们致力于交付的最重要的方向：

* **语言演进**：保持 Kotlin 的简洁与表现力，优先考虑有意义的语义而非繁琐语法。
* **多平台**：通过出色的 iOS 体验、成熟的 Web 目标和可靠的 IDE 工具，为现代跨平台应用构建基础。
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
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-51107" target="_blank">稳定根据 lambda 表达式返回值类型进行的重载解析</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84567" target="_blank">支持 K2 多平台公共代码的增量编译</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75463" target="_blank">新 JVM 反射：调研、原型设计与实现</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84568" target="_blank">演进 Power-assert 插件</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm：将库的 <code>wasm-wasi</code> 目标切换到 WASI Preview 2</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm：支持组件模型</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-82064" target="_blank">Kotlin/Wasm：支持多模块编译</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>多平台</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80305" target="_blank">Swift Export：Alpha 版本发布</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84569" target="_blank">在 iOS 上为 Compose Multiplatform 实现新的 <code>TextInputService</code></a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84570" target="_blank">支持 Swift 6.3</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84571" target="_blank">稳定 Compose Multiplatform 的 Navigation3</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-68323" target="_blank">实现下一代多平台库分发格式</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">统一所有稳定 Kotlin 目标之间的内联语义</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80307" target="_blank">Kotlin/JS：改进 Kotlin/JS 的入门材料</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80308" target="_blank">Kotlin/JS：编译为现代 JavaScript</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80310" target="_blank">Kotlin/JS：扩展将 Kotlin 声明导出到 JavaScript 的可能性</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">默认启用 klib 构件的增量编译</a></li>
            </list>
            <tip><p><a href="https://jb.gg/kmp-roadmap-2025" target="_blank">Kotlin 多平台开发路线图</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>工具</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84572" target="_blank">Kotlin/Native 调试器健康状况与性能改进</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84573" target="_blank">针对 Maven 上 Kotlin（Java + Kotlin 混合）的智能默认配置</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-53877" target="_blank">支持在 Kotlin 中导入 Swift Package Manager 软件包</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-66897" target="_blank">使用非弃用的备选方案替换 Karma 运行程序</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">改进 Kotlin 脚本编写及 <code>.gradle.kts</code> 的使用体验</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">在 Gradle 项目隔离中支持 Kotlin/JS 和 Kotlin/Wasm</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">设计构建工具 API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">发布支持声明式 Gradle 的 Kotlin 生态系统插件</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">支持 Kotlin LSP 和 VS Code</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>生态系统</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-83525" target="_blank">为标准库的安全修复引入 18 个月的支持窗口</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84574" target="_blank">稳定实验性的 <code>kotlinx.serialization</code> API</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84575" target="_blank">稳定 <code>kotlinx.collections.immutable</code></a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84576" target="_blank">改进 Lombok 编译器插件在 Kotlin 服务器端的体验</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">将 <code>kotlinx-datetime</code> 提升至 Beta 阶段</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80323" target="_blank">实现 KDoc 机器可读表示</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">改进 Kotlin 分发用户体验：添加代码覆盖率和二进制兼容性验证</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">标准库的新多平台 API：支持 Unicode 和代码点</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">稳定 <code>kotlinx-io</code> 库</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">为返回非 Unit 值且未使用的 Kotlin 函数引入默认警告/错误</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80324" target="_blank">稳定 Kotlin Notebooks</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80327" target="_blank">发布 Kotlin 数据帧 1.0</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80328" target="_blank">发布 Kandy 0.9</a></li>
            </list>
            <p><b>Ktor：</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-9266" target="_blank">改进 Ktor 中的身份验证</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-7938" target="_blank">支持 HTTP/3</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6026" target="_blank">创建 Kubernetes 生成器插件</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501" target="_blank">通过生成器插件和教程为 Ktor 添加 gRPC 支持</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6622" target="_blank">改进 Ktor 管理与可观测性</a></li>
            </list>
            <p><b>Exposed：</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-778" target="_blank">发布 Exposed DAO 2.0</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-755" target="_blank">创建一个迁移 Gradle 插件</a></li>
            </list>
         </td>
    </tr>
</table>

> * 此路线图并非团队正在进行的所有工作的详尽列表，仅包含重大项目。
> * 我们不承诺在特定版本中交付特定的功能或修复。
> * 我们将根据实际进度调整优先级，并大约每六个月更新一次路线图。
> 
{style="note"}

## 自 2025 年 8 月以来的变化

### 已完成项

我们已**完成**上一个路线图中的以下项目：

* ✅ 编译器：[完成 JSpecify 支持](https://youtrack.jetbrains.com/issue/KT-75371)
* ✅ 编译器：[弃用 K1 编译器](https://youtrack.jetbrains.com/issue/KT-75372)
* ✅ 编译器：[将 Kotlin/Wasm (`wasm-js` 目标) 提升至 Beta 阶段](https://youtrack.jetbrains.com/issue/KT-75370)
* ✅ 多平台：[默认启用并发标记清除 (CMS) GC](https://youtrack.jetbrains.com/issue/KT-71278)
* ✅ 多平台：[Kotlin 多平台 IDE 插件支持 Windows 和 Linux](https://youtrack.jetbrains.com/issue/KMT-789)
* ✅ 多平台：[发布 Compose Multiplatform for Web 的 Beta 版本](https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/)
* ✅ 多平台：[发布 Compose 实时编辑的稳定版本](https://blog.jetbrains.com/kotlin/2026/01/compose-multiplatform-1-10-0/)
* ✅ 工具：[改进 Kotlin + JPA 体验](https://youtrack.jetbrains.com/issue/KTIJ-35208)
* ✅ 工具：[Kotlin Notebooks：支持新用例](https://youtrack.jetbrains.com/issue/KTNB-1133)
* ✅ 工具：[改进 IntelliJ IDEA 中 Kotlin/Wasm 项目的开发体验](https://youtrack.jetbrains.com/issue/KT-75374)
* ✅ 工具：[为 JS/Wasm 构件添加 NPM 发布功能](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.npm-publish)
* ✅ 工具：[IntelliJ IDEA K2 模式完全发布](https://youtrack.jetbrains.com/issue/KTIJ-31316)
* ✅ 工具：[改进导入性能](https://youtrack.jetbrains.com/issue/KT-75376)
* ✅ 生态系统：[为 Ktor 客户端和服务器应用程序支持 OpenAPI 规范](https://youtrack.jetbrains.com/issue/KTOR-8316)
* ✅ 生态系统：[Ktor WebRTC 客户端](https://youtrack.jetbrains.com/issue/KTOR-7958)
* ✅ 生态系统：[简化 Ktor 中依赖注入的使用](https://youtrack.jetbrains.com/issue/KTOR-6621)
* ✅ 生态系统：[发布 Exposed 1.0.0](https://youtrack.jetbrains.com/issue/EXPOSED-444)
* ✅ 生态系统：[为 Exposed 添加 R2DBC 支持](https://youtrack.jetbrains.com/issue/EXPOSED-74)

### 新增项

我们在路线图中**添加**了以下项目：

* 🆕 编译器：[Kotlin/Wasm：支持多模块编译](https://youtrack.jetbrains.com/issue/KT-82064)
* 🆕 编译器：[Kotlin/Wasm：将库的 `wasm-wasi` 目标切换到 WASI Preview 2](https://youtrack.jetbrains.com/issue/KT-64568)
* 🆕 编译器：[Kotlin/Wasm：支持组件模型](https://youtrack.jetbrains.com/issue/KT-64569)
* 🆕 编译器：[稳定根据 lambda 表达式返回值类型进行的重载解析](https://youtrack.jetbrains.com/issue/KT-51107)
* 🆕 编译器：[支持 K2 多平台公共代码的增量编译](https://youtrack.jetbrains.com/issue/KT-84567)
* 🆕 编译器：[新 JVM 反射：调研、原型设计与实现](https://youtrack.jetbrains.com/issue/KT-75463)
* 🆕 编译器：[演进 Power-assert 插件](https://youtrack.jetbrains.com/issue/KT-84568)
* 🆕 多平台：[Swift Export：Alpha 版本发布](https://youtrack.jetbrains.com/issue/KT-80305)
* 🆕 多平台：[在 iOS 上为 Compose Multiplatform 实现新的 `TextInputService`](https://youtrack.jetbrains.com/issue/KT-84569)
* 🆕 多平台：[支持 Swift 6.3](https://youtrack.jetbrains.com/issue/KT-84570)
* 🆕 多平台：[稳定 Compose Multiplatform 的 Navigation3](https://youtrack.jetbrains.com/issue/KT-84571)
* 🆕 工具：[Kotlin/Native 调试器健康状况与性能改进](https://youtrack.jetbrains.com/issue/KT-84572)
* 🆕 工具：[针对 Maven 上 Kotlin（Java + Kotlin 混合）的智能默认配置](https://youtrack.jetbrains.com/issue/KT-84573)
* 🆕 工具：[支持在 Kotlin 中导入 Swift Package Manager 软件包](https://youtrack.jetbrains.com/issue/KT-53877)
* 🆕 工具：[使用非弃用的备选方案替换 Karma 运行程序](https://youtrack.jetbrains.com/issue/KT-66897)
* 🆕 生态系统：[为标准库的安全修复引入 18 个月的支持窗口](https://youtrack.jetbrains.com/issue/KT-83525)
* 🆕 生态系统：[稳定实验性的 `kotlinx.serialization` API](https://youtrack.jetbrains.com/issue/KT-84574)
* 🆕 生态系统：[稳定 `kotlinx.collections.immutable`](https://youtrack.jetbrains.com/issue/KT-84575)
* 🆕 生态系统：[改进 Lombok 编译器插件在 Kotlin 服务器端的体验](https://youtrack.jetbrains.com/issue/KT-84576)
* 🆕 生态系统：[改进 Ktor 中的身份验证](https://youtrack.jetbrains.com/issue/KTOR-9266)
* 🆕 生态系统：[发布 Exposed DAO 2.0](https://youtrack.jetbrains.com/issue/EXPOSED-778)
* 🆕 生态系统：[为 Exposed 创建一个迁移 Gradle 插件](https://youtrack.jetbrains.com/issue/EXPOSED-755)

### 移除项

我们从路线图中**移除**了以下项目：

* ❌ 编译器：[Kotlin/Wasm：使用新的线程提案原型化多线程支持](https://youtrack.jetbrains.com/issue/KT-80304)

> 部分项目已从路线图中移除，但并未完全放弃。在某些情况下，我们将之前的路线图项目与当前项目进行了合并。
>
{style="note"}