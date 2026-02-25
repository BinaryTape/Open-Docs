[//]: # (title: Lincheck 指南)

Lincheck 是一个实用且用户友好的框架，用于在 JVM 上测试并发算法。它提供了一种简单且声明式的方式来编写并发测试。

使用 Lincheck 框架，您无需描述如何执行测试，而是通过声明所有要检查的操作和所需的正确性属性来指定 *测试什么*。因此，一个典型的并发 Lincheck 测试只需约 15 行代码。

当给定操作列表时，Lincheck 会自动：

* 生成一组随机并发场景。
* 使用压力测试或有界模型检查来检查它们。
* 验证每次调用的结果是否满足所需的正确性属性（默认为线性一致性）。

## 将 Lincheck 添加到您的项目

要启用 Lincheck 支持，请将相应的仓库和依赖项包含到 Gradle 构建配置中。在您的 `build.gradle(.kts)` 文件中，添加以下内容：

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

本指南将帮助您接触该框架并配合示例尝试最有用的功能。逐步学习 Lincheck 功能：

1. [使用 Lincheck 编写您的第一个测试](introduction.md)
2. [选择您的测试策略](testing-strategies.md)
3. [配置操作实参](operation-arguments.md)
4. [考虑常见的算法约束](constraints.md)
5. [检查算法的非阻塞进度保证](progress-guarantees.md)
6. [定义算法的顺序规范](sequential-specification.md)

## 更多参考资料
* Nikita Koval 的 “我们如何在 Kotlin 协程中测试并发算法”：[视频](https://youtu.be/jZqkWfa11Js)。KotlinConf 2023
* Maria Sokolova 的 “Lincheck：在 JVM 上测试并发” 工作坊：[第一部分](https://www.youtube.com/watch?v=YNtUK9GK4pA)，[第二部分](https://www.youtube.com/watch?v=EW7mkAOErWw)。Hydra 2021