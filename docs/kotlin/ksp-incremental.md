[//]: # (title: 增量处理)

增量处理是一种处理技术，旨在尽可能避免重新处理源文件。
增量处理的主要目标是缩短典型的“修改-编译-测试”周期的周转时间。
有关通用信息，请参阅维基百科上关于 [增量计算 (incremental computing)](https://en.wikipedia.org/wiki/Incremental_computing) 的文章。

为了确定哪些源文件是 *dirty* 的（即需要重新处理的文件），KSP 需要处理程序的帮助来识别哪些输入源文件对应哪些生成的输出。为了协助处理这个通常繁琐且容易出错的过程，KSP 的设计要求只需提供一小组 *根源文件*，处理程序将这些文件作为导航代码结构的起点。换句话说，如果 `KSNode` 是通过以下任何方式获取的，则处理程序需要将输出与对应 `KSNode` 的源文件进行关联：
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

增量处理目前默认启用。要禁用它，请设置 Gradle 属性 `ksp.incremental=false`。
要启用根据依赖项和输出转储 dirty 集合的日志，请使用 `ksp.incremental.log=true`。
您可以在 `build` 输出目录中找到扩展名为 `.log` 的这些日志文件。

在 JVM 上，类路径更改以及 Kotlin 和 Java 源文件更改默认会被跟踪。
要仅跟踪 Kotlin 和 Java 源文件更改，请通过设置 `ksp.incremental.intermodule=false` Gradle 属性来禁用类路径跟踪。

## 聚合 (Aggregating) vs 隔离 (Isolating)

与 [Gradle 注解处理](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing) 中的概念类似，KSP 支持 *聚合* 和 *隔离* 模式。请注意，与 Gradle 注解处理不同，KSP 是将每个输出归类为聚合或隔离，而不是针对整个处理程序进行归类。

聚合输出可能会受到任何输入更改的影响，但删除不影响其他文件的文件除外。这意味着任何输入更改都会导致所有聚合输出的重新构建，这反过来意味着要重新处理所有对应的已注册、新增和已修改的源文件。

例如，收集带有特定注解的所有符号的输出被视为聚合输出。

隔离输出仅依赖于其指定的源文件。对其他源文件的更改不会影响隔离输出。请注意，与 Gradle 注解处理不同，您可以为给定输出定义多个源文件。

例如，专门为其实现的接口生成的类被视为隔离。

总之，如果一个输出可能依赖于新增或任何已更改的源文件，它就被视为聚合。否则，该输出就是隔离的。

以下是为熟悉 Java 注解处理的读者提供的总结：
* 在隔离式 Java 注解处理程序中，所有输出在 KSP 中都是隔离的。
* 在聚合式 Java 注解处理程序中，在 KSP 中某些输出可以是隔离的，而某些可以是聚合的。

### 实现原理

依赖项是通过输入和输出文件的关联来计算的，而不是通过注解。这是一种多对多关系。

由于输入-输出关联导致的脏状态传播规则如下：
1. 如果输入文件发生了更改，它将始终被重新处理。
2. 如果输入文件发生了更改，并且它与某个输出相关联，那么与该相同输出相关联的所有其他输入文件也将被重新处理。这是具有传递性的，也就是说，失效会重复发生，直到没有新的 dirty 文件为止。
3. 与一个或多个聚合输出相关联的所有输入文件都将被重新处理。换句话说，如果一个输入文件不与任何聚合输出相关联，它将不会被重新处理（除非它满足上述第 1 点或第 2 点）。

原因如下：
1. 如果输入发生了更改，可能会引入新的信息，因此处理程序需要使用该输入再次运行。
2. 一个输出是由一组输入构成的。处理程序可能需要所有输入来重新生成输出。
3. `aggregating=true` 意味着输出可能潜在地依赖于新信息，这些信息可能来自新文件，也可能来自已更改的现有文件。`aggregating=false` 意味着处理程序确定信息仅来自特定的输入文件，而绝不会来自其他文件或新文件。

## 示例 1

处理程序在读取了 `A.kt` 中的类 `A` 和 `B.kt` 中的类 `B`（其中 `A` 继承自 `B`）后生成了 `outputForA`。
处理程序通过 `Resolver.getSymbolsWithAnnotation` 获取了 `A`，然后通过 `A` 的 `KSClassDeclaration.superTypes` 获取了 `B`。
由于包含 `B` 是由于 `A` 引起的，因此不需要在 `outputForA` 的 `dependencies` 中指定 `B.kt`。在这种情况下你仍然可以指定 `B.kt`，但这不是必需的。

```kotlin
// A.kt
@Interesting
class A : B()

// B.kt
open class B

// Example1Processor.kt
class Example1Processor : SymbolProcessor {
    override fun process(resolver: Resolver) {
        val declA = resolver.getSymbolsWithAnnotation("Interesting").first() as KSClassDeclaration
        val declB = declA.superTypes.first().resolve().declaration
        // B.kt 不是必需的，因为它可以被 KSP 推断为依赖项
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA 依赖于 A.kt 和 B.kt
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB
".toByteArray())
        output.close()
    }
    // ...
}
```

## 示例 2

假设一个处理程序在读取 `sourceA` 后生成 `outputA`，在读取 `sourceB` 后生成 `outputB`。

当 `sourceA` 发生更改时：
* 如果 `outputB` 是聚合的，则 `sourceA` 和 `sourceB` 都会被重新处理。
* 如果 `outputB` 是隔离的，则只有 `sourceA` 会被重新处理。

当添加 `sourceC` 时：
* 如果 `outputB` 是聚合的，则 `sourceC` 和 `sourceB` 都会被重新处理。
* 如果 `outputB` 是隔离的，则只有 `sourceC` 会被重新处理。

当 `sourceA` 被删除时，不需要重新处理任何内容。

当 `sourceB` 被删除时，不需要重新处理任何内容。

## 如何确定文件脏状态

一个 dirty 文件要么是由用户直接 *更改* 的，要么是受其他 dirty 文件间接 *影响* 的。KSP 通过两个步骤传播脏状态：
* 通过 *解析跟踪 (resolution tracing)* 传播：
  解析类型引用（隐式或显式）是跨文件导航的唯一方式。当处理程序解析类型引用时，如果某个已更改或受影响的文件包含可能影响解析结果的更改，则该文件将影响包含该引用的文件。
* 通过 *输入-输出对应关系 (input-output correspondence)* 传播：
  如果一个源文件被更改或受影响，则与该文件具有共同输出的所有其他源文件都会受到影响。

请注意，两者都是具有传递性的，且后者构成了等价类。

## 报告错误

要报告错误，请设置 Gradle 属性 `ksp.incremental=true` 和 `ksp.incremental.log=true`，并执行清理构建。
此次构建会产生两个日志文件：

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

然后您可以运行后续的增量构建，这将生成另外两个日志文件：

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

这些日志包含源文件和输出文件的名称，以及构建的时间戳。