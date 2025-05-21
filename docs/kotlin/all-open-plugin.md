---
title: 全开放编译器插件
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 的类及其成员默认是 `final` 的，这使得使用需要类为 `open` 的框架和库（如 Spring AOP）变得不方便。`all-open` 编译器插件使 Kotlin 适应这些框架的需求，并使使用特定注解标注的类及其成员变为 open，而无需显式的 `open` 关键字。

例如，当您使用 Spring 时，您不需要所有类都是 open 的，而只需要使用特定注解（如 `@Configuration` 或 `@Service`）标注的类。 `all-open` 插件允许您指定这些注解。

Kotlin 为 Gradle 和 Maven 提供了 `all-open` 插件支持，并具有完整的 IDE 集成。

:::note
对于 Spring，您可以使用 [`kotlin-spring` 编译器插件](#spring-support)。

:::

## Gradle

在您的 `build.gradle(.kts)` 文件中添加插件：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.allopen") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.allopen" version "2.1.20"
}
```

</TabItem>
</Tabs>

然后指定将使类变为 open 的注解列表：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
allOpen {
    annotation("com.my.Annotation")
    // annotations("com.another.Annotation", "com.third.Annotation")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
allOpen {
    annotation("com.my.Annotation")
    // annotations("com.another.Annotation", "com.third.Annotation")
}
```

</TabItem>
</Tabs>

如果类（或其任何超类）使用 `com.my.Annotation` 进行注解，则该类本身及其所有成员将变为 open。

它也适用于元注解（meta-annotations）：

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // will be all-open
```

`MyFrameworkAnnotation` 使用 all-open 元注解 `com.my.Annotation` 进行注解，因此它也成为一个 all-open 注解。

## Maven

在您的 `pom.xml` 文件中添加插件：

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- Or "spring" for the Spring support -->
<plugin>all-open</plugin>
        </compilerPlugins>
<pluginOptions>
            <!-- Each annotation is placed on its own line -->
            <option>all-open:annotation=com.my.Annotation</option>
            <option>all-open:annotation=com.their.AnotherAnnotation</option>
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-allopen</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

请参阅 [Gradle 部分](#gradle) 了解有关 all-open 注解如何工作的详细信息。

## Spring 支持

如果您使用 Spring，则可以启用 `kotlin-spring` 编译器插件，而不是手动指定 Spring 注解。 `kotlin-spring` 是 `all-open` 之上的一个包装器，它的行为完全相同。

在您的 `build.gradle(.kts)` 文件中添加 `spring` 插件：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("org.jetbrains.kotlin.plugin.spring") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.spring" version "2.1.20"
}
```

</TabItem>
</Tabs>

在 Maven 中，`spring` 插件由 `kotlin-maven-allopen` 插件依赖项提供，因此要在您的 `pom.xml` 文件中启用它：

```xml
<compilerPlugins>
<plugin>spring</plugin>
</compilerPlugins>

<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-maven-allopen</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

该插件指定了以下注解：
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

由于元注解支持，使用 [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html),
[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html),
[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html),
[`@Service`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Service.html)
或 [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)
注解的类会自动打开，因为这些注解使用 [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html) 进行元注解。

当然，您可以在同一个项目中使用 `kotlin-allopen` 和 `kotlin-spring` 。

:::note
如果您通过 [start.spring.io](https://start.spring.io/#!language=kotlin)
服务生成项目模板，则默认情况下将启用 `kotlin-spring` 插件。

:::

## 命令行编译器

All-open 编译器插件 JAR 在 Kotlin 编译器的二进制发行版中可用。 您可以通过使用 `-Xplugin` kotlinc 选项提供其 JAR 文件的路径来附加该插件：

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

您可以使用 `annotation` 插件选项直接指定 all-open 注解，或启用 _预设（preset）_：

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

`all-open` 插件可用的预设包括：`spring`、`micronaut` 和 `quarkus`。