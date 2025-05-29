[//]: # (title: All-open 編譯器外掛)

Kotlin 的類別及其成員預設為 `final`，這使得在使用諸如 Spring AOP 等要求類別為 `open` 的框架和函式庫時不便。`all-open` 編譯器外掛使 Kotlin 適應這些框架的需求，並讓標註了特定註解的類別及其成員無需明確的 `open` 關鍵字即可變為 `open`。

舉例來說，當你使用 Spring 時，你不需要所有類別都是 `open` 的，而只需要標註特定註解（如 `@Configuration` 或 `@Service`）的類別為 `open`。`all-open` 外掛允許你指定這些註解。

Kotlin 提供了 `all-open` 外掛支援，同時適用於 Gradle 和 Maven，並提供完整的 IDE 整合。

> 對於 Spring，你可以使用 [`kotlin-spring` 編譯器外掛](#spring-support)。
>
{style="note"}

## Gradle

在你的 `build.gradle(.kts)` 檔案中加入此外掛：

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

然後指定將使類別為 `open` 的註解列表：

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

如果類別（或其任何父類別）標註了 `com.my.Annotation`，則該類別本身及其所有成員都將變為 `open`。

它也支援中繼註解：

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // will be all-open
```

`MyFrameworkAnnotation` 標註了 all-open 中繼註解 `com.my.Annotation`，因此它也成為一個 all-open 註解。

## Maven

在你的 `pom.xml` 檔案中加入此外掛：

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
            <!-- 每個註解都放在其各自的行中 -->
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

請參閱 [Gradle 章節](#gradle) 以獲取有關 all-open 註解如何運作的詳細資訊。

## Spring 支援

如果你使用 Spring，你可以啟用 `kotlin-spring` 編譯器外掛，而非手動指定 Spring 註解。`kotlin-spring` 是 `all-open` 的一個包裝器，其行為完全相同。

在你的 `build.gradle(.kts)` 檔案中加入 `spring` 外掛：

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

在 Maven 中，`spring` 外掛是由 `kotlin-maven-allopen` 外掛依賴項提供的，因此要在你的 `pom.xml` 檔案中啟用它：

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

此外掛指定了以下註解：
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

由於中繼註解的支援，標註了 [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html)、[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html)、[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html)、[`@Service`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html) 或 [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html) 的類別會自動被 `open`，因為這些註解都中繼標註了 [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)。

當然，你可以在同一個專案中同時使用 `kotlin-allopen` 和 `kotlin-spring`。

> 如果你透過 [start.spring.io](https://start.spring.io/#!language=kotlin) 服務產生專案範本，`kotlin-spring` 外掛將會預設啟用。
>
{style="note"}

## 命令列編譯器

All-open 編譯器外掛 JAR 包含在 Kotlin 編譯器的二進位發行版中。你可以透過提供其 JAR 檔案的路徑，使用 `-Xplugin` kotlinc 選項來附加此外掛：

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

你可以直接指定 all-open 註解，使用 `annotation` 外掛選項，或啟用 _預設組態_：

```bash
# 外掛選項格式為："-P plugin:<外掛 ID>:<鍵>=<值>"。
# 選項可以重複。

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

`all-open` 外掛可用的預設組態有：`spring`、`micronaut` 和 `quarkus`。