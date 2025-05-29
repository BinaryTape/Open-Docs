[//]: # (title: 增量处理)

增量处理是一种处理技术，它尽可能地避免对源文件进行重复处理。
增量处理的主要目标是减少典型“修改-编译-测试”循环的周转时间。
有关一般信息，请参阅维基百科关于[增量计算](https://en.wikipedia.org/wiki/Incremental_computing)的文章。

为了确定哪些源文件是_脏的_（即需要重新处理的），KSP 需要处理器的帮助来识别
哪些输入源文件对应于哪些生成的输出。为了帮助处理这个通常繁琐且易错的过程，
KSP 被设计为仅要求最少量的_根源文件_，处理器将其用作遍历代码结构的起点。
换句话说，如果 `KSNode` 是从以下任何一个获取的，处理器需要将输出与相应 `KSNode` 的源文件关联起来：
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

增量处理目前默认启用。要禁用它，请设置 Gradle 属性 `ksp.incremental=false`。
要启用根据依赖项和输出来转储脏文件集的日志，请使用 `ksp.incremental.log=true`。
你可以在 `build` 输出目录中找到这些扩展名为 `.log` 的日志文件。

在 JVM 上，类路径变更以及 Kotlin 和 Java 源文件变更默认都会被跟踪。
要仅跟踪 Kotlin 和 Java 源文件变更，请通过设置 `ksp.incremental.intermodule=false` Gradle 属性来禁用类路径跟踪。

## 聚合型与隔离型

类似于 [Gradle 注解处理](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing) 中的概念，
KSP 支持_聚合型_和_隔离型_两种模式。请注意，与 Gradle 注解处理不同，KSP 将
每个输出归类为聚合型或隔离型，而不是整个处理器。

聚合型输出可能会受到任何输入变更的影响，除了移除不影响
其他文件的文件。这意味着任何输入变更都会导致所有聚合型输出的重建，
这反过来又意味着重新处理所有对应的已注册、新增和修改的源文件。

例如，收集具有特定注解的所有符号的输出被视为聚合型输出。

隔离型输出仅依赖于其指定的源文件。对其他源文件的变更不会影响隔离型输出。
请注意，与 Gradle 注解处理不同，你可以为一个给定输出定义多个源文件。

例如，专用于它所实现的一个接口的生成类被视为隔离型。

总而言之，如果一个输出可能依赖于新增或任何已变更的源文件，它就被视为聚合型。
否则，该输出是隔离型。

以下是为熟悉 Java 注解处理的读者提供的总结：
* 在隔离型 Java 注解处理器中，所有输出在 KSP 中都是隔离型。
* 在聚合型 Java 注解处理器中，某些输出在 KSP 中可以是隔离型，有些可以是聚合型。

### 实现方式

依赖关系是通过输入和输出文件的关联来计算的，而不是通过注解。
这是一种多对多关系。

由于输入-输出关联导致的脏文件传播规则是：
1. 如果输入文件被修改，它将总是被重新处理。
2. 如果输入文件被修改，并且它与一个输出关联，那么所有与
   同一输出关联的其他输入文件也将被重新处理。这是传递性的，即失效会反复发生，直到
   没有新的脏文件出现。
3. 所有与一个或多个聚合型输出关联的输入文件都将被重新处理。
   换句话说，如果一个输入文件没有与任何聚合型输出关联，它将不会被重新处理
   （除非它满足上述规则 1 或 2）。

原因如下：
1. 如果输入发生变更，可能会引入新信息，因此处理器需要再次使用该输入运行。
2. 一个输出是由一组输入生成的。处理器可能需要所有这些输入来重新生成输出。
3. `aggregating=true` 意味着一个输出可能潜在地依赖于新信息，这些信息可能来自新的
   文件，或者已变更的现有文件。
   `aggregating=false` 意味着处理器确信信息仅来自某些输入文件，而绝不来自
   其他或新文件。

## 示例 1

一个处理器在读取 `A.kt` 中的类 `A` 和 `B.kt` 中的类 `B` 后生成 `outputForA`，其中 `A` 继承自 `B`。
处理器通过 `Resolver.getSymbolsWithAnnotation` 获取 `A`，然后通过 `A` 的 `KSClassDeclaration.superTypes` 获取 `B`。
由于 `B` 的包含是由于 `A`，因此 `B.kt` 无需在 `outputForA` 的 `dependencies` 中指定。
在这种情况下，你仍然可以指定 `B.kt`，但这是不必要的。

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
        // B.kt 是非必需的，因为它可以通过 KSP 推断为依赖项
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

假设一个处理器在读取 `sourceA` 后生成 `outputA`，在读取 `sourceB` 后生成 `outputB`。

当 `sourceA` 发生变更时：
* 如果 `outputB` 是聚合型，那么 `sourceA` 和 `sourceB` 都会被重新处理。
* 如果 `outputB` 是隔离型，则只有 `sourceA` 被重新处理。

当 `sourceC` 被添加时：
* 如果 `outputB` 是聚合型，那么 `sourceC` 和 `sourceB` 都会被重新处理。
* 如果 `outputB` 是隔离型，则只有 `sourceC` 被重新处理。

当 `sourceA` 被移除时，无需重新处理任何内容。

当 `sourceB` 被移除时，无需重新处理任何内容。

## 如何确定文件脏度

脏文件要么是用户直接_修改_的，要么是间接被其他脏文件_影响_的。KSP 传播
脏度分为两个步骤：
* 通过_解析追踪_进行传播：
  解析类型引用（隐式或显式）是从一个文件导航到另一个文件的唯一方式。
  当处理器解析一个类型引用时，如果一个已修改或受影响的文件包含可能
  影响解析结果的变更，它将影响包含该引用的文件。
* 通过_输入-输出对应关系_进行传播：
  如果源文件被修改或受影响，所有与该文件具有共同输出的其他源文件都会受到影响。

请注意，这两种传播方式都是传递性的，并且第二种传播方式形成等价类。

## 报告 Bug

要报告 Bug，请设置 Gradle 属性 `ksp.incremental=true` 和 `ksp.incremental.log=true`，然后执行清理构建。
此构建会生成两个日志文件：

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

然后你可以运行后续的增量构建，这将生成两个额外的日志文件：

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

这些日志包含源文件和输出的文件名，以及构建的时间戳。