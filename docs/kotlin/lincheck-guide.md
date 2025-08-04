[//]: # (title: Lincheck 指南)

Lincheck 是一个实用且用户友好的框架，用于在 JVM 上测试并发算法。它提供了一种简单而声明式的方式来编写并发测试。

借助 Lincheck 框架，你无需描述如何执行测试，而可以指定 _要测试什么_，即通过声明所有要探查的操作以及所需的正确性属性。因此，一个典型的 Lincheck 并发测试仅包含大约 15 行代码。

当给定一个操作列表时，Lincheck 会自动：

*   生成一组随机并发场景。
*   使用压力测试或有界模型检测对其进行探查。
*   验证每次调用的结果是否满足所需的正确性属性（线性化是默认属性）。

## 将 Lincheck 添加到你的项目

要启用 Lincheck 支持，请在 Gradle 配置中包含相应的版本库和依赖项。在你的 `build.gradle(.kts)` 文件中，添加以下内容：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}
 
dependencies {
    testImplementation("org.jetbrains.lincheck:lincheck:%lincheckVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}

dependencies {
    testImplementation "org.jetbrains.lincheck:lincheck:%lincheckVersion%"
}
```

</tab>
</tabs>

## 探索 Lincheck

本指南将帮助你熟悉该框架，并尝试最实用的特性及示例。逐步学习 Lincheck 特性：

1.  [编写你的第一个 Lincheck 测试](introduction.md)
2.  [选择你的测试策略](testing-strategies.md)
3.  [配置操作实参](operation-arguments.md)
4.  [考虑常见的算法约束](constraints.md)
5.  [检测算法的无阻塞进展保证](progress-guarantees.md)
6.  [定义算法的顺序规约](sequential-specification.md)

## 更多参考资料
*   "我们如何在 Kotlin 协程中测试并发算法"，作者：Nikita Koval：[视频](https://youtu.be/jZqkWfa11Js)。KotlinConf 2023
*   "Lincheck：在 JVM 上测试并发" 工作坊，作者：Maria Sokolova：[第 1 部分](https://www.youtube.com/watch?v=YNtUK9GK4pA)，[第 2 部分](https://www.youtube.com/watch?v=EW7mkAOErWw)。Hydra 2021