[//]: # (title: All-open 編譯器外掛程式)

Kotlin 預設類別及其成員均為 `final`，這使得在使用如 Spring AOP 等需要類別為 `open` 的架構時變得不便。`all-open` 編譯器外掛程式根據這些架構的需求調整了 Kotlin，讓標註了特定註解的類別及其成員變為 open，而不需要明確使用 `open` 關鍵字。

例如，當你使用 Spring 時，不需要所有的類別都為 open，只需要標註了特定註解（如 `@Configuration` 或 `@Service`）的類別。`all-open` 外掛程式允許你指定這些註解。

Kotlin 為 Gradle 和 Maven 提供了 `all-open` 外掛程式支援，並具備完整的 IDE 整合。

> 對於 Spring，你可以使用 [`kotlin-spring` 編譯器外掛程式](#spring-support)。
>
{style="note"}

## Gradle

在你的 `build.gradle(.kts)` 檔案中新增該外掛程式：

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

接著指定會使類別變為 open 的註解列表：

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

如果類別（或其任何基底類別）標註了 `com.my.Annotation`，則該類別本身及其所有成員都將變為 open。

它也適用於元註解（meta-annotations）：

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // 將會是 all-open
```

`MyFrameworkAnnotation` 標註了 all-open 元註解 `com.my.Annotation`，因此它也成為了一個 all-open 註解。

## Maven

在你的 `pom.xml` 檔案中新增該外掛程式：

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- 或使用 "spring" 以取得 Spring 支援 -->
            <plugin>all-open</plugin>
        </compilerPlugins>

        <pluginOptions>
            <!-- 每個註解各佔一行 -->
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

關於 all-open 註解如何運作的詳細資訊，請參閱 [Gradle 章節](#gradle)。

## Spring 支援

如果你使用 Spring，可以啟用 `kotlin-spring` 編譯器外掛程式，而不需要手動指定 Spring 註解。`kotlin-spring` 是基於 `all-open` 的包裝函式，其行為完全相同。

在你的 `build.gradle(.kts)` 檔案中新增 `spring` 外掛程式：

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

在 Maven 中，`spring` 外掛程式由 `kotlin-maven-allopen` 外掛程式相依性提供，若要在 `pom.xml` 檔案中啟用它：

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

該外掛程式指定了以下註解： 
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

得益於元註解支援，標註了 [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html)、
[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html)、
[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html)、
[`@Service`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Service.html)
或 [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)
的類別會自動被開啟（opened），因為這些註解都標註了元註解
[`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)。
 
當然，你可以在同一個專案中同時使用 `kotlin-allopen` 和 `kotlin-spring`。

> 如果你使用 [start.spring.io](https://start.spring.io/#!language=kotlin) 服務產生專案樣板，`kotlin-spring` 外掛程式將預設啟用。
>
{style="note"}

## 命令列編譯器

All-open 編譯器外掛程式 JAR 檔案包含在 Kotlin 編譯器的二進制發行版中。你可以透過 `kotlinc` 的 `-Xplugin` 選項提供其 JAR 檔案路徑來掛載該外掛程式：

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

你可以使用 `annotation` 外掛程式選項直接指定 all-open 註解，或是啟用 _預設_（preset）：

```bash
# 外掛程式選項格式為："-P plugin:<plugin id>:<key>=<value>"。
# 選項可以重複。

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

`all-open` 外掛程式可用的預設有：`spring`、`micronaut` 和 `quarkus`。