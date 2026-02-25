[//]: # (title: 编译器插件)

<snippet id="compiler-plugin-description">
编译器插件挂钩到编译过程，在代码编译时对其进行分析或更改，而无需修改编译器本身。例如，它们可以注解代码或生成新代码，使其与其它框架或 API 兼容。
</snippet>

本页介绍了可用的 Kotlin 编译器插件，并说明了如果这些插件都不适合您的用例，您该如何处理。

Kotlin 团队维护以下编译器插件：

| 插件                                                                                            | 描述                                                                                                                               |
|------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| [All-open](all-open-plugin.md)                                                                 | 自动将带注解的类及其成员设为 `open`，以便框架可以在运行时对其进行扩展。                                  |
| [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)                                         | 将原子操作转换为针对特定平台的高效实现，以实现无锁并发。                                 |
| [DataFrame](https://kotlin.github.io/dataframe/compiler-plugin.html)                           | 生成类型化 API，让您能够以安全且符合 Kotlin 习惯的方式使用 [`DataFrame`](https://kotlin.github.io/dataframe/home.html)。 |
| [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)           | 生成应用二进制接口 (ABI) JAR。                                                                                        |
| [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects) | 将 Kotlin 类公开为普通 JavaScript 对象，以提高与 JS 工具和库的互操作性。                                      |
| [kapt](kapt.md)                                                                                | 在 Kotlin 代码上运行 Java 注解处理器并生成额外的源文件。                                                     |
| [Lombok](lombok.md)                                                                            | 使 Kotlin 代码能够理解并使用 Java 源码中由 Lombok 注解生成的代码。                                           |
| [`no-arg`](no-arg-plugin.md)                                                                   | 为带注解的类生成无参构造函数，以支持需要它们的框架。                                         |
| [Power-assert](power-assert.md)                                                                | 通过显示表达式各部分的详细值来增强断言失败信息。                                                    |
| [SAM with receiver](sam-with-receiver-plugin.md)                                               | 允许 SAM 接口使用带接收者的 lambda 表达式，以实现更接近 DSL 的语法。                                                           |
| [Serialization](serialization.md)                                                              | 生成无需反射即可对 Kotlin 对象进行序列化和反序列化的代码。                                         |

Google 的 Android 团队维护：

| 插件                                                                                      | 描述                                                                                                       |
|---------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| [Compose compiler Gradle plugin](https://developer.android.com/develop/ui/compose/compiler) | 将 Compose 编译器与 Gradle 集成，以启用声明式 UI 功能和 Compose 特有的优化。 |
| [Parcelize plugin](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize) | 自动生成 `Parcelable` 实现，以便您在 Android 组件之间传递 Kotlin 对象。   |

如果您需要以这些插件未涵盖的方式调整编译过程，请先检查是否可以使用
[Kotlin 符号处理 (KSP) API](https://kotlinlang.org/docs/ksp-overview.html) 或外部 Linter，例如 [Android lint](https://developer.android.com/studio/write/lint)。
您可以浏览我们的 [Kotlin Slack](https://slack-chats.kotlinlang.org/c/compiler) 或[联系我们](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并就您的用例征求建议。

如果您**仍然**找不到所需内容，可以[创建自定义编译器插件](custom-compiler-plugins.md)。请仅将此方法作为最后手段，因为 Kotlin 编译器插件 API 是**不稳定**的。如果您创建了自定义编译器插件，则需要投入大量的后续精力进行维护，因为每个新的编译器版本都会引入破坏性变更。