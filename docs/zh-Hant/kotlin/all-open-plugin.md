[//]: # (title: All-open 編譯器插件)

Kotlin 中的類別及其成員預設為 `final`，這使得在使用諸如 Spring AOP 這類要求類別為 `open` 的框架與函式庫時很不方便。`all-open` 編譯器插件讓 Kotlin 適應這些框架的需求，使經由特定註解標註的類別及其成員無需明確的 `open` 關鍵字即可變得 `open`。

例如，當您使用 Spring 時，並非所有類別都需要 `open`，而只需要那些經由特定註解（如 `@Configuration` 或 `@Service`）標註的類別。`all-open` 插件允許您指定這類註解。

Kotlin 為 Gradle 和 Maven 都提供了 `all-open` 插件支援，並具備完整的 IDE 整合。

> 對於 Spring，您可以使用 [kotlin-spring 編譯器插件](#spring-support)。
>
{style="note"}

## Gradle

在您的 `build.gradle(.kts)` 檔案中新增此插件：

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

然後指定將使類別 `open` 的註解列表：

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

如果類別（或其任何父類別）經由 `com.my.Annotation` 標註，則該類別本身及其所有成員都將變為 `open`。

它也支援元註解：

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // will be all-open
```

`MyFrameworkAnnotation` 經由 `all-open` 元註解 `com.my.Annotation` 標註，因此它也成為一個 `all-open` 註解。

## Maven

在您的 `pom.xml` 檔案中新增此插件：

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- 或者為 Spring 支援使用 "spring" -->
            <plugin>all-open</plugin>
        </compilerPlugins>

        <pluginOptions>
            <!-- 每個註解都應獨立佔一行 -->
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

有關 `all-open` 註解如何運作的詳細資訊，請參閱 [Gradle 章節](#gradle)。

## Spring 支援

如果您使用 Spring，您可以啟用 `kotlin-spring` 編譯器插件，而無需手動指定 Spring 註解。`kotlin-spring` 是 `all-open` 之上的包裝器，其行為方式與 `all-open` 完全相同。

在您的 `build.gradle(.kts)` 檔案中新增 `spring` 插件：

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

在 Maven 中，`spring` 插件由 `kotlin-maven-allopen` 插件依賴提供，因此若要在您的 `pom.xml` 檔案中啟用它：

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

此插件指定了以下註解：
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

由於支援元註解，經由 [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html)、[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html)、[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html)、[`@Service`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html) 或 [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html) 標註的類別會自動 `open`，因為這些註解都經由 [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html) 元註解標註。
 
當然，您可以在同一個專案中同時使用 `kotlin-allopen` 和 `kotlin-spring`。

> 如果您透過 [start.spring.io](https://start.spring.io/#!language=kotlin) 服務生成專案範本，`kotlin-spring` 插件將預設啟用。
>
{style="note"}

## 命令列編譯器

`all-open` 編譯器插件 JAR 檔位於 Kotlin 編譯器的二進位發行版中。您可以透過使用 `-Xplugin` kotlinc 選項提供其 JAR 檔案的路徑來附加此插件：

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

您可以直接使用 `annotation` 插件選項指定 `all-open` 註解，或啟用預設組：

```bash
# 插件選項的格式為："-P plugin:<插件 ID>:<鍵>=<值>"。 
# 選項可以重複。

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

適用於 `all-open` 插件的預設組有：`spring`、`micronaut` 和 `quarkus`。