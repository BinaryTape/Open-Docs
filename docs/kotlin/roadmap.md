[//]: # (title: Kotlin 路线图)

<table>
    <tr>
        <td><strong>上次修改时间</strong></td>
        <td><strong>2026 年 8 月</strong></td>
    </tr>
    <tr>
        <td><strong>下次更新时间</strong></td>
        <td><strong>2027 年 2 月</strong></td>
    </tr>
</table>

欢迎阅读 Kotlin 路线图！在这里您可以预览 JetBrains 团队的工作重点。

## 关键优先级

路线图的目标是为您提供宏观视图。
以下是我们关键关注领域的列表——也是我们致力于交付的最重要的方向：

* **语言演进**：保持 Kotlin 的简洁与表现力，优先考虑人体工程学和安全性，而非繁琐语法。
* **Kotlin 多平台**：通过出色的 iOS 体验、成熟的 Web 目标和可靠的 IDE 工具，为现代跨平台应用构建基础。
* **保持平台中立**：无论开发者使用何种工具或目标，都为其提供支持。
* **第三方生态系统作者的体验**：简化 Kotlin 库、工具和框架的开发与发布流程。

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
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88663" target="_blank">将 Kotlin/Wasm 提升至稳定阶段</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88664" target="_blank">提高 KAPT 性能，使其与 Java APT 相当</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-51107" target="_blank">稳定根据 lambda 表达式返回值类型进行的重载解析</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84567" target="_blank">支持 K2 多平台公共代码的增量编译</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75463" target="_blank">新 JVM 反射：调研、原型设计与实现</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm：将库的 <code>wasm-wasi</code> 目标切换到 WASI Preview 2</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm：支持组件模型</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>多平台</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/SKIKO-982" target="_blank">通过 Skiko 中的 Graphite 改进渲染可靠性并提供面向未来的 GPU 支持</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KMT-2910" target="_blank">针对 Kotlin/Native 调试器的 Xcode 集成</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-86791" target="_blank">Swift Export：从 Alpha 迈向 Beta</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/CMP-10598" target="_blank">在 iOS 端的 Compose Multiplatform 中将原生文本输入设为默认</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-86492" target="_blank">release 模式下的 Native 编译器缓存</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">统一所有稳定 Kotlin 目标之间的内联语义</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80307" target="_blank">Kotlin/JS：改进 Kotlin/JS 的入门材料</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80308" target="_blank">Kotlin/JS：编译为现代 JavaScript</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80310" target="_blank">Kotlin/JS：扩展将 Kotlin 声明导出到 JavaScript 的可能性</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">默认启用 klib 构件的增量编译</a></li>
            </list>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>工具</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88545" target="_blank">通过统一的编译器插件包简化 Maven 上 Kotlin 的入门体验</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KMT-2910" target="_blank">针对 Kotlin/Native 调试器的 Xcode 集成</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88546" target="_blank">在不启用配置缓存的情况下实现 Native 任务并行化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTC-5718" target="_blank">Kotlin 工具链：Kotlin 的单一入口点</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84572" target="_blank">Kotlin/Native 调试器健康状况与性能改进</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-53877" target="_blank">支持在 Kotlin 中导入 Swift Package Manager 软件包</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-66897" target="_blank">使用非弃用的备选方案替换 Karma 运行程序</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">在 Gradle 项目隔离中支持 Kotlin/JS 和 Kotlin/Wasm</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">设计构建工具 API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">支持 Kotlin LSP 和 VS Code</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>生态系统</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88665" target="_blank">为 Kotlin stdlib 类型实现一等 JPA/Hibernate 支持</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84574" target="_blank">稳定实验性的 <code>kotlinx.serialization</code> API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84576" target="_blank">改进 Lombok 编译器插件在 Kotlin 服务器端的体验</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84575" target="_blank">稳定 <code>kotlinx.collections.immutable</code></a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">将 <code>kotlinx-datetime</code> 提升至 Beta 阶段</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80323" target="_blank">实现 KDoc 机器可读表示</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">标准库的新多平台 API：支持 Unicode 和代码点</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">稳定 <code>kotlinx-io</code> 库</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">为返回非 Unit 值且未使用的 Kotlin 函数引入默认警告/错误</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80327" target="_blank">发布 Kotlin 数据帧 1.0</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80328" target="_blank">发布 Kandy 0.9</a></li>
            </list>
            <p><b>Ktor：</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-9266" target="_blank">改进 Ktor 中的身份验证</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-9498" target="_blank">支持 HTTP/3</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501" target="_blank">通过生成器插件和教程为 Ktor 添加 gRPC 支持</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6622" target="_blank">改进 Ktor 管理与可观测性</a></li>
            </list>
            <p><b>Exposed：</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-819" target="_blank">发布 Exposed DAO 2.0</a></li>
            </list>
         </td>
    </tr>
</table>

> * 此路线图并非团队正在进行的所有工作的详尽列表，仅包含重大项目。
> * 我们不承诺在特定版本中交付特定的功能或修复。
> * 我们将根据实际进度调整优先级，并大约每六个月更新一次路线图。
> 
{style="note"}

## 自 2026 年 2 月以来的变化

### 已完成项

我们已**完成**上一个路线图中的以下项目：

* ✅ 编译器：[演进 Power-assert 插件](https://youtrack.jetbrains.com/issue/KT-84568)
* ✅ 编译器：[Kotlin/Wasm：支持多模块编译](https://youtrack.jetbrains.com/issue/KT-82064)
* ✅ 多平台：[Swift Export：Alpha 版本发布](https://youtrack.jetbrains.com/issue/KT-64572)
* ✅ 多平台：[在 iOS 上为 Compose Multiplatform 实现新的 `TextInputService`](https://youtrack.jetbrains.com/issue/KT-84569)
* ✅ 多平台：[支持 Swift 6.3](https://youtrack.jetbrains.com/issue/KT-84570)
* ✅ 多平台：[稳定 Compose Multiplatform 的 Navigation3](https://youtrack.jetbrains.com/issue/KT-84571)
* ✅ 工具：[针对 Maven 上 Kotlin（Java + Kotlin 混合）的智能默认配置](https://youtrack.jetbrains.com/issue/KT-84573)
* ✅ 工具：[发布支持声明式 Gradle 的 Kotlin 生态系统插件](https://youtrack.jetbrains.com/issue/KT-71292)
* ✅ 生态系统：[改进 Kotlin 分发用户体验：添加代码覆盖率和二进制兼容性验证](https://youtrack.jetbrains.com/issue/KT-71297)
* ✅ 生态系统：[为标准库的安全修复引入 18 个月的支持窗口](https://youtrack.jetbrains.com/issue/KT-83525)
* ✅ 生态系统：[为 Exposed 创建一个迁移 Gradle 插件](https://youtrack.jetbrains.com/issue/EXPOSED-755)

### 新增项

我们在路线图中**添加**了以下项目：

* 🆕 编译器：[将 Kotlin/Wasm 提升至稳定阶段](https://youtrack.jetbrains.com/issue/KT-88663)
* 🆕 编译器：[提高 KAPT 性能，使其与 Java APT 相当](https://youtrack.jetbrains.com/issue/KT-88664)
* 🆕 多平台：[通过 Skiko 中的 Graphite 改进渲染可靠性并提供面向未来的 GPU 支持](https://youtrack.jetbrains.com/issue/SKIKO-982)
* 🆕 多平台：[Swift Export：从 Alpha 迈向 Beta](https://youtrack.jetbrains.com/issue/KT-86791)
* 🆕 多平台：[在 iOS 端的 Compose Multiplatform 中将原生文本输入设为默认](https://youtrack.jetbrains.com/issue/CMP-10598)
* 🆕 多平台：[release 模式下的 Native 编译器缓存](https://youtrack.jetbrains.com/issue/KT-86492)
* 🆕 工具：[通过统一的编译器插件包简化 Maven 上 Kotlin 的入门体验](https://youtrack.jetbrains.com/issue/KT-88545)
* 🆕 工具：[针对 Kotlin/Native 调试器的 Xcode 集成](https://youtrack.jetbrains.com/issue/KMT-2910)
* 🆕 工具：[在不启用配置缓存的情况下实现 Native 任务并行化](https://youtrack.jetbrains.com/issue/KT-88546)
* 🆕 工具：[Kotlin 工具链：Kotlin 的单一入口点](https://youtrack.jetbrains.com/issue/KTC-5718)
* 🆕 生态系统：[为 Kotlin 标准库类型实现一等 JPA/Hibernate 支持](https://youtrack.jetbrains.com/issue/KT-88665)

### 移除项

我们从路线图中**移除**了以下项目：

* ❌ 多平台：[实现下一代多平台库分发格式](https://youtrack.jetbrains.com/issue/KT-68323)
* ❌ 工具：[改进 Kotlin 脚本编写及 `.gradle.kts` 的使用体验](https://youtrack.jetbrains.com/issue/KT-49511)
* ❌ 生态系统：[稳定 Kotlin Notebooks](https://youtrack.jetbrains.com/issue/KT-80324)