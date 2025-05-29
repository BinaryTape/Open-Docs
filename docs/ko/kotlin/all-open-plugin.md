[//]: # (title: 모든 공개 컴파일러 플러그인)

Kotlin은 기본적으로 클래스와 멤버가 `final`이라서 클래스가 `open`이어야 하는 Spring AOP와 같은 프레임워크 및 라이브러리를 사용하는 데 불편함이 있습니다. `all-open` 컴파일러 플러그인은 Kotlin을 이러한 프레임워크의 요구 사항에 맞게 조정하여 특정 어노테이션으로 어노테이션이 지정된 클래스와 해당 멤버를 명시적인 `open` 키워드 없이 open하도록 만듭니다.

예를 들어, Spring을 사용할 때 모든 클래스가 open일 필요는 없으며, `@Configuration` 또는 `@Service`와 같은 특정 어노테이션으로 어노테이션이 지정된 클래스만 open하면 됩니다. `all-open` 플러그인을 사용하면 이러한 어노테이션을 지정할 수 있습니다.

Kotlin은 Gradle 및 Maven 모두에서 완벽한 IDE 통합을 통해 `all-open` 플러그인 지원을 제공합니다.

> Spring의 경우, [`kotlin-spring` 컴파일러 플러그인](#spring-support)을 사용할 수 있습니다.
>
{style="note"}

## Gradle

`build.gradle(.kts)` 파일에 플러그인을 추가합니다.

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

그런 다음 클래스를 open할 어노테이션 목록을 지정합니다.

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

클래스(또는 해당 슈퍼클래스 중 하나)가 `com.my.Annotation`으로 어노테이션이 지정되면 클래스 자체와 모든 멤버가 open됩니다.

메타 어노테이션도 지원됩니다.

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // will be all-open
```

`MyFrameworkAnnotation`은 all-open 메타 어노테이션인 `com.my.Annotation`으로 어노테이션이 지정되었으므로 `all-open` 어노테이션이 됩니다.

## Maven

`pom.xml` 파일에 플러그인을 추가합니다.

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

## Spring 지원

Spring을 사용하는 경우, Spring 어노테이션을 수동으로 지정하는 대신 `kotlin-spring` 컴파일러 플러그인을 활성화할 수 있습니다. `kotlin-spring`은 `all-open` 위에 래퍼로 동작하며, 정확히 동일한 방식으로 작동합니다.

`build.gradle(.kts)` 파일에 `spring` 플러그인을 추가합니다.

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

Maven에서 `spring` 플러그인은 `kotlin-maven-allopen` 플러그인 의존성을 통해 제공되므로 `pom.xml` 파일에서 활성화하려면 다음과 같습니다.

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

플러그인은 다음 어노테이션을 지정합니다.
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

메타 어노테이션 지원 덕분에 [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html),
[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html),
[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html),
[`@Service`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html)
또는 [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)로 어노테이션이 지정된 클래스는
이러한 어노테이션이 [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)로 메타 어노테이션이 지정되어 있기 때문에 자동으로 open됩니다.

물론 같은 프로젝트에서 `kotlin-allopen`과 `kotlin-spring`을 모두 사용할 수 있습니다.

> [start.spring.io](https://start.spring.io/#!language=kotlin) 서비스를 통해 프로젝트 템플릿을 생성하는 경우, `kotlin-spring` 플러그인은 기본적으로 활성화됩니다.
>
{style="note"}

## 명령줄 컴파일러

All-open 컴파일러 플러그인 JAR는 Kotlin 컴파일러의 바이너리 배포판에서 사용할 수 있습니다. `-Xplugin` kotlinc 옵션을 사용하여 JAR 파일의 경로를 제공함으로써 플러그인을 첨부할 수 있습니다.

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

`annotation` 플러그인 옵션을 사용하여 all-open 어노테이션을 직접 지정하거나 _프리셋_을 활성화할 수 있습니다.

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

`all-open` 플러그인에 사용할 수 있는 프리셋은 `spring`, `micronaut`, `quarkus`입니다.