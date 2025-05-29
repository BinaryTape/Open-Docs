[//]: # (title: All-open 编译器插件)

Kotlin 中的类及其成员默认是 `final` 的，这使得它不便于使用像 Spring AOP 这样要求类必须是 `open` 的框架和库。`all-open` 编译器插件使 Kotlin 适应这些框架的需求，无需显式使用 `open` 关键字，就能使使用特定注解标记的类及其成员变为开放 (open) 的。

例如，当你在使用 Spring 时，你不需要所有的类都是开放的，而只需要那些使用特定注解（如 `@Configuration` 或 `@Service`）标记的类是开放的。`all-open` 插件允许你指定此类注解。

Kotlin 为 Gradle 和 Maven 提供了 `all-open` 插件支持，并具有完整的 IDE 集成。

> 对于 Spring，你可以使用 [`kotlin-spring` 编译器插件](#spring-support)。
>
{style="note"}

## Gradle

在你的 `build.gradle(.kts)` 文件中添加该插件：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.allopen") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.allopen" version "%kotlinVersion%"
}
```

</tab>
</tabs>

然后指定将使类开放的注解列表：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
allOpen {
    annotation("com.my.Annotation")
    // annotations("com.another.Annotation", "com.third.Annotation")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
allOpen {
    annotation("com.my.Annotation")
    // annotations("com.another.Annotation", "com.third.Annotation")
}
```

</tab>
</tabs>

如果类（或其任何超类）使用 `com.my.Annotation` 注解标记，则该类本身及其所有成员都将变为开放的。

它也适用于元注解：

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // will be all-open
```

`MyFrameworkAnnotation` 使用了 all-open 元注解 `com.my.Annotation` 进行注解，因此它也成为了一个 all-open 注解。

## Maven

在你的 `pom.xml` 文件中添加该插件：

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

有关 all-open 注解如何工作的详细信息，请参阅 [Gradle 章节](#gradle)。

## Spring 支持

如果你使用 Spring，你可以启用 `kotlin-spring` 编译器插件，而不是手动指定 Spring 注解。`kotlin-spring` 是 `all-open` 的封装，其行为方式完全相同。

在你的 `build.gradle(.kts)` 文件中添加 `spring` 插件：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.kotlin.plugin.spring") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.spring" version "%kotlinVersion%"
}
```

</tab>
</tabs>

在 Maven 中，`spring` 插件由 `kotlin-maven-allopen` 插件依赖项提供，因此要在你的 `pom.xml` 文件中启用它：

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

由于元注解支持，使用 [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html)、
[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html)、
[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html)、
[`@Service`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Service.html)
或 [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)
注解标记的类会自动开放，因为这些注解都使用了 [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html) 元注解标记。

当然，你可以在同一个项目中同时使用 `kotlin-allopen` 和 `kotlin-spring`。

> 如果你通过 [start.spring.io](https://start.spring.io/#!language=kotlin) 服务生成项目模板，`kotlin-spring` 插件将默认启用。
>
{style="note"}

## 命令行编译器

All-open 编译器插件的 JAR 文件可以在 Kotlin 编译器的二进制发行版中找到。你可以通过使用 `-Xplugin` kotlinc 选项提供其 JAR 文件的路径来附加该插件：

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

你可以直接指定 all-open 注解，使用 `annotation` 插件选项，或者启用 _预设_：

```bash
# 插件选项格式为："-P plugin:<plugin id>:<key>=<value>"。
# 选项可以重复。

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

`all-open` 插件可用的预设是：`spring`、`micronaut` 和 `quarkus`。