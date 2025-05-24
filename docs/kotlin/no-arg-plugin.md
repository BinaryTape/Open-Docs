---
title: 无参数编译器插件
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

*no-arg* 编译器插件为带有特定注解的类生成一个额外的零参数构造函数。

生成的构造函数是合成的，因此不能直接从 Java 或 Kotlin 调用，但可以使用反射调用。

这允许 Java 持久化 API (Java Persistence API, JPA) 实例化一个类，即使它从 Kotlin 或 Java 的角度来看没有零参数构造函数（请参阅[下面](#jpa-support)的 `kotlin-jpa` 插件的描述）。

## 在你的 Kotlin 文件中

添加新的注解来标记需要零参数构造函数的代码：

```kotlin
package com.my

annotation class Annotation
```

## Gradle

使用 Gradle 的插件 DSL 添加插件：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.noarg") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.noarg" version "2.1.20"
}
```

</TabItem>
</Tabs>

然后指定 *no-arg* 注解的列表，这些注解必须导致为注解类生成 *no-arg* 构造函数：

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

如果要插件运行来自合成构造函数的初始化逻辑，请启用 `invokeInitializers` 选项。默认情况下，它是禁用的。

```groovy
noArg {
    invokeInitializers = true
}
```

## Maven

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- Or "jpa" for JPA support -->
<plugin>no-arg</plugin>
        </compilerPlugins>
<pluginOptions>
            <option>no-arg:annotation=com.my.Annotation</option>
            <!-- Call instance initializers in the synthetic constructor -->
            <!-- <option>no-arg:invokeInitializers=true</option> -->
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-noarg</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

## JPA 支持

与 `kotlin-spring` 插件一样，`kotlin-jpa` 插件是 `no-arg` 的封装。 该插件自动指定 [`@Entity`](https://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html), [`@Embeddable`](https://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html), 和 [`@MappedSuperclass`](https://docs.oracle.com/javaee/7/api/javax/persistence/MappedSuperclass.html) *no-arg* 注解。

使用 Gradle 插件 DSL 添加插件：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.jpa") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.jpa" version "2.1.20"
}
```

</TabItem>
</Tabs>

在 Maven 中，启用 `jpa` 插件：

```xml
<compilerPlugins>
<plugin>jpa</plugin>
</compilerPlugins>
```

## 命令行编译器

将插件 JAR 文件添加到编译器插件类路径，并指定注解或预设：

```bash
-Xplugin=$KOTLIN_HOME/lib/noarg-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.noarg:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.noarg:preset=jpa
```