[//]: # (title: All-open 컴파일러 플러그인)

Kotlin은 기본적으로 클래스와 멤버가 `final`이어서, 클래스가 `open`되어야 하는 Spring AOP와 같은 프레임워크 및 라이브러리를 사용하기 불편하게 만듭니다. `all-open` 컴파일러 플러그인은 Kotlin을 해당 프레임워크의 요구사항에 맞춰주며, 특정 어노테이션으로 어노테이션된 클래스와 그 멤버를 명시적인 `open` 키워드 없이 `open`하게 만듭니다.

예를 들어, Spring을 사용할 때 모든 클래스가 `open`될 필요는 없지만, `@Configuration` 또는 `@Service`와 같은 특정 어노테이션으로 어노테이션된 클래스만 필요합니다. `all-open` 플러그인을 사용하면 이러한 어노테이션을 지정할 수 있습니다.

Kotlin은 Gradle과 Maven 모두에 대한 `all-open` 플러그인 지원을 완벽한 IDE 통합과 함께 제공합니다.

> Spring의 경우, [`kotlin-spring` 컴파일러 플러그인](#spring-support)을 사용할 수 있습니다.
>
{style="note"}

## Gradle

`build.gradle(.kts)` 파일에 플러그인을 추가합니다:

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

그런 다음 클래스를 `open`하게 만들 어노테이션 목록을 지정합니다:

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

클래스(또는 그 슈퍼클래스 중 하나)가 `com.my.Annotation`으로 어노테이션되면, 클래스 자체와 모든 멤버가 `open`됩니다.

메타 어노테이션과도 작동합니다:

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // will be all-open
```

`MyFrameworkAnnotation`은 all-open 메타 어노테이션인 `com.my.Annotation`으로 어노테이션되어 있으므로, 이 또한 all-open 어노테이션이 됩니다.

## Maven

`pom.xml` 파일에 플러그인을 추가합니다:

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

all-open 어노테이션이 작동하는 방식에 대한 자세한 내용은 [Gradle 섹션](#gradle)을 참조하십시오.

## Spring support

Spring을 사용하는 경우, Spring 어노테이션을 수동으로 지정하는 대신 `kotlin-spring` 컴파일러 플러그인을 활성화할 수 있습니다. `kotlin-spring`은 `all-open` 위에 있는 래퍼이며, 정확히 동일하게 작동합니다.

`build.gradle(.kts)` 파일에 `spring` 플러그인을 추가합니다:

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

Maven에서는 `spring` 플러그인이 `kotlin-maven-allopen` 플러그인 의존성에 의해 제공되므로, `pom.xml` 파일에서 이를 활성화하려면:

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

이 플러그인은 다음 어노테이션을 지정합니다:
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

메타 어노테이션 지원 덕분에, [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html), [`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html), [`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html), [`@Service`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html) 또는 [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)로 어노테이션된 클래스는 이 어노테이션들이 [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)로 메타 어노테이션되어 있으므로 자동으로 `open`됩니다.

물론, 동일한 프로젝트에서 `kotlin-allopen`과 `kotlin-spring`을 모두 사용할 수 있습니다.

> [start.spring.io](https://start.spring.io/#!language=kotlin) 서비스를 통해 프로젝트 템플릿을 생성하는 경우, `kotlin-spring` 플러그인이 기본적으로 활성화됩니다.
>
{style="note"}

## Command-line compiler

All-open 컴파일러 플러그인 JAR는 Kotlin 컴파일러의 바이너리 배포판에서 사용할 수 있습니다. `kotlinc`의 `-Xplugin` 옵션을 사용하여 JAR 파일 경로를 제공함으로써 플러그인을 연결할 수 있습니다:

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

`annotation` 플러그인 옵션을 사용하여 all-open 어노테이션을 직접 지정하거나 _프리셋_을 활성화할 수 있습니다:

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

`all-open` 플러그인에서 사용 가능한 프리셋은 `spring`, `micronaut`, `quarkus`입니다.