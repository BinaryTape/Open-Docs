---
title: "All-open 編譯器外掛 (Compiler Plugin)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 預設情況下將類別及其成員設定為 `final`，這使得使用需要類別為 `open` 的框架和庫（例如 Spring AOP）不太方便。 `all-open` 編譯器外掛程式使 Kotlin 適應這些框架的需求，並使使用特定註釋 (annotation) 標註的類別及其成員成為 open，而無需顯式的 `open` 關鍵字。

例如，當您使用 Spring 時，您不需要所有類別都是 open 的，而只需要使用特定註釋（例如 `@Configuration` 或 `@Service`）標註的類別。 `all-open` 外掛程式允許您指定這些註釋。

Kotlin 為 Gradle 和 Maven 提供了 `all-open` 外掛程式支援，並具有完整的 IDE 整合。

:::note
對於 Spring，您可以使用 [`kotlin-spring` 編譯器外掛程式](#spring-support)。

:::

## Gradle

在您的 `build.gradle(.kts)` 檔案中新增此外掛程式：

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

然後指定將使類別 open 的註釋列表：

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

如果類別（或其任何超類別）使用 `com.my.Annotation` 進行了註釋，則該類別本身及其所有成員都將變為 open。

它也適用於 meta-annotations (元註釋)：

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // will be all-open
```

`MyFrameworkAnnotation` 使用 all-open meta-annotation `com.my.Annotation` 進行了註釋，因此它也成為一個 all-open 註釋。

## Maven

在您的 `pom.xml` 檔案中新增此外掛程式：

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

有關 all-open 註釋如何工作的詳細資訊，請參閱 [Gradle 部分](#gradle)。

## Spring support (Spring 支援)

如果您使用 Spring，則可以啟用 `kotlin-spring` 編譯器外掛程式，而不是手動指定 Spring 註釋。 `kotlin-spring` 是 `all-open` 之上的包裝器，並且其行為完全相同。

在您的 `build.gradle(.kts)` 檔案中新增 `spring` 外掛程式：

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

在 Maven 中，`spring` 外掛程式由 `kotlin-maven-allopen` 外掛程式相依性提供，因此要在您的 `pom.xml` 檔案中啟用它：

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

此外掛程式指定了以下註釋：
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

感謝 meta-annotations 支援，使用 [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html),
[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html),
[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html),
[`@Service`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Service.html)
或 [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)
標註的類別會自動開啟，因為這些註釋使用
[`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html) 進行了元註釋。

當然，您可以在同一個專案中使用 `kotlin-allopen` 和 `kotlin-spring`。

:::note
如果您透過 [start.spring.io](https://start.spring.io/#!language=kotlin)
服務產生專案範本，則預設情況下會啟用 `kotlin-spring` 外掛程式。

:::

## Command-line compiler (命令列編譯器)

All-open 編譯器外掛程式 JAR 在 Kotlin 編譯器的二進位發行版中可用。 您可以使用 `-Xplugin` kotlinc 選項，透過提供其 JAR 檔案的路徑來附加此外掛程式：

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

您可以使用 `annotation` 外掛程式選項直接指定 all-open 註釋，或啟用 _preset_ (預設值)：

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

可用於 `all-open` 外掛程式的預設值包括：`spring`、`micronaut` 和 `quarkus`。