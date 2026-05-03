[//]: # (title: 从 kapt 迁移到 KSP)
[//]: # (description: 了解如何将 Kotlin 项目中的注解处理器从 kapt 迁移到 KSP。)

在本指南中，你将学习如何将注解处理器从 [kapt](kapt.md) 迁移到 [KSP](ksp-overview.md)，以便你的项目能够充分利用 Kotlin 的功能并提高构建性能。

[kapt](kapt.md) (Kotlin Annotation Processing Tool) 是一款非常有用的工具，它允许你在 Kotlin 中使用 Java 注解处理器。它的工作原理是将 Kotlin 源代码翻译成 Java “存根” (stub)，然后在这些存根上运行注解处理器。然而，这一过程开销巨大，会显著增加构建时间，并且在翻译过程中会丢失一些 Kotlin 特有的功能。

相比之下，[KSP](ksp-overview.md) (Kotlin Symbol Processing) 是专为 Kotlin 设计的 kapt 替代方案。KSP 理解所有 Kotlin 功能并直接分析源代码，从而缩短构建时间。

在开始之前，请检查项目中的处理器是否支持 KSP。请参阅[支持的库列表](ksp-overview.md#supported-libraries)或查阅其文档。

> KSP 和 kapt 可以并行运行，因此你可以分阶段迁移项目，一次迁移一个库或模块。
> 
{style="note"}

## 将 KSP 插件添加到项目中

在项目级的 `build.gradle(.kts)` 文件的 `plugins {}` 块中添加 KSP：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspVersion%" apply false 
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'com.google.devtools.ksp' version '%kspVersion%' apply false 
}
```

</tab>
</tabs>

> 要查找 KSP 的最新版本，请查看 GitHub 的 [Releases](https://github.com/google/ksp/releases) 页面。
> 
{style="tip"}

## 更新处理器

找到使用要迁移的处理器的模块。在该模块的 `build.gradle(.kts)` 文件中：

1. 将 KSP 添加到 `plugins {}` 块：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        id("com.google.devtools.ksp")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'com.google.devtools.ksp'
    }
    ```

    </tab>
    </tabs>
   
2. 在 `dependencies {}` 块中，将 `kapt` 替换为 `ksp`：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("com.google.dagger:dagger:2.48")
        // kapt("com.google.dagger:dagger-compiler:2.48")
        
        // KSP 处理器依赖项:
        ksp("com.google.dagger:dagger-compiler:2.48") 
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy"> 

    ```groovy
    dependencies {
        implementation 'com.google.dagger:dagger:2.48'
        // kapt 'com.google.dagger:dagger-compiler:2.48'
        
        // KSP 处理器依赖项:
        ksp 'com.google.dagger:dagger-compiler:2.48'
    }
    ```

    </tab>
    </tabs>
    

> 对于大多数库，这种替换就足够了。请查看每个库的文档，了解是否需要进行任何额外更改。
> 
{style="note"}

## 移除 kapt 插件

在将所有处理器迁移到 KSP 后，你可以安全地从所有构建文件中移除 kapt 插件：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
   // 删除此行：
    id("org.jetbrains.kotlin.kapt")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // 删除此行：
    id 'org.jetbrains.kotlin.kapt'
}
```

</tab>
</tabs>

删除所有遗留的 kapt 配置（如果有的话）。

## 后续步骤

* 在[快速入门 KSP](ksp-quickstart.md#create-your-own-processor)中了解如何制作自己的基于 KSP 的注解处理器。
* 在 [KSP 仓库](https://github.com/google/ksp/tree/main/examples)中探索使用 KSP 的示例项目。
* 在[概览](ksp-overview.md)中阅读更多关于 KSP 的信息。