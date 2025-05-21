---
title: "添加 Android 依赖项"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

将 Android 平台的特定依赖添加到 Kotlin Multiplatform 模块的工作流程，与纯 Android 项目相同：在 Gradle 文件中声明依赖，然后导入项目。之后，你就可以在 Kotlin 代码中使用该依赖。

我们建议通过将 Android 依赖添加到特定的 Android 源码集（source set）中，以此在 Kotlin Multiplatform 项目中声明它们。为此，请更新项目 `shared` 目录下的 `build.gradle(.kts)` 文件：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
sourceSets {
    androidMain.dependencies {
        implementation("com.example.android:app-magic:12.3")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
sourceSets {
    androidMain {
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</TabItem>
</Tabs>

如果顶级依赖（top-level dependency）具有非平凡的配置名称，那么将 Android 项目中的顶级依赖迁移到多平台项目中特定的源码集可能会很困难。例如，要将 `debugImplementation` 依赖从 Android 项目的顶层移走，你需要向名为 `androidDebug` 的源码集添加一个 implementation 依赖。为了尽量减少处理此类迁移问题所需的工作，你可以添加一个 `dependencies {}` 块到 `androidTarget {}` 块中：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
androidTarget {
    //...
    dependencies {
        implementation("com.example.android:app-magic:12.3")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
androidTarget {
    //...
    dependencies {
        implementation 'com.example.android:app-magic:12.3'
    }
}
```

</TabItem>
</Tabs>

在此处声明的依赖项的处理方式与顶级块中的依赖项完全相同，但是以这种方式声明它们也会在构建脚本中以可视方式分隔 Android 依赖项，并使其不易混淆。

也支持将依赖项放置在脚本末尾的独立 `dependencies {}` 块中，这种方式符合 Android 项目的习惯用法。但是，我们强烈建议**不要**这样做，因为在顶级块中使用 Android 依赖项，并在每个源码集中使用其他目标依赖项来配置构建脚本可能会引起混淆。

## 接下来做什么？

查阅有关在多平台项目中添加依赖项的其他资源，并了解更多信息：

* [在官方 Android 文档中添加依赖项](https://developer.android.com/studio/build/dependencies)
* [添加多平台库或其他多平台项目的依赖项](multiplatform-add-dependencies)
* [添加 iOS 依赖项](multiplatform-ios-dependencies)