---
title: "All-open compiler plugin"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin ではクラスとそのメンバーはデフォルトで `final` になっています。そのため、クラスが `open` であることを要求する Spring AOP などのフレームワークやライブラリを使用する際に不便です。`all-open` コンパイラープラグインは、Kotlin をこれらのフレームワークの要件に適合させ、特定のアノテーションが付いたクラスとそのメンバーを、明示的な `open` キーワードなしで open にします。

たとえば、Spring を使用する場合、すべてのクラスを open にする必要はなく、`@Configuration` や `@Service` などの特定のアノテーションが付いたクラスのみを open にする必要があります。`all-open` プラグインを使用すると、このようなアノテーションを指定できます。

Kotlin は、完全な IDE 統合により、Gradle と Maven の両方で `all-open` プラグインのサポートを提供します。

:::note
Spring の場合、[`kotlin-spring` コンパイラープラグイン](#spring-support)を使用できます。

:::

## Gradle

`build.gradle(.kts)` ファイルにプラグインを追加します。

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

次に、クラスを open にするアノテーションのリストを指定します。

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

クラス (またはそのスーパークラスのいずれか) に `com.my.Annotation` が付いている場合、クラス自体とそのすべてのメンバーが open になります。

メタアノテーションでも同様に動作します。

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // will be all-open
```

`MyFrameworkAnnotation` は all-open メタアノテーション `com.my.Annotation` でアノテーションされているため、all-open アノテーションにもなります。

## Maven

`pom.xml` ファイルにプラグインを追加します。

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

all-open アノテーションの仕組みの詳細については、[Gradle セクション](#gradle)を参照してください。

## Spring support

Spring を使用している場合、Spring アノテーションを手動で指定する代わりに、`kotlin-spring` コンパイラープラグインを有効にできます。`kotlin-spring` は `all-open` の上に構築されたラッパーであり、まったく同じように動作します。

`build.gradle(.kts)` ファイルに `spring` プラグインを追加します。

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

Maven では、`spring` プラグインは `kotlin-maven-allopen` プラグインの依存関係によって提供されるため、`pom.xml` ファイルで有効にするには次の手順を実行します。

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

このプラグインは、次のアノテーションを指定します。
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

メタアノテーションのサポートのおかげで、[`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html)、
[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html)、
[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html)、
[`@Service`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Service.html)
または [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)
でアノテーションされたクラスは、これらのアノテーションが
[`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html) でメタアノテーションされているため、自動的に open になります。

もちろん、同じプロジェクトで `kotlin-allopen` と `kotlin-spring` の両方を使用できます。

:::note
[start.spring.io](https://start.spring.io/#!language=kotlin)
サービスでプロジェクトテンプレートを生成する場合、`kotlin-spring` プラグインはデフォルトで有効になります。

:::

## Command-line compiler

All-open コンパイラープラグイン JAR は、Kotlin コンパイラーのバイナリ配布に含まれています。`-Xplugin` kotlinc オプションを使用して、その JAR ファイルへのパスを指定することにより、プラグインをアタッチできます。

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

`annotation` プラグインオプションを使用して all-open アノテーションを直接指定するか、_preset_ を有効にすることができます。

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

`all-open` プラグインで使用可能なプリセットは、`spring`、`micronaut`、および `quarkus` です。