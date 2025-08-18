[//]: # (title: All-open コンパイラプラグイン)

Kotlinでは、クラスとそのメンバーはデフォルトで`final`です。このため、Spring AOPのようにクラスが`open`であることを要求するフレームワークやライブラリを使用するのが不便になります。`all-open`コンパイラプラグインは、Kotlinをこれらのフレームワークの要件に適合させ、特定のAノテーションが付与されたクラスとそのメンバーを、明示的な`open`キーワードなしで`open`にします。

例えば、Springを使用する場合、全てのクラスを`open`にする必要はなく、`@Configuration`や`@Service`のような特定のアノテーションが付与されたクラスのみで十分です。`all-open`プラグインを使用すると、そのようなアノテーションを指定できます。

Kotlinは、完全なIDE統合と共に、GradleとMavenの両方で`all-open`プラグインのサポートを提供します。

> Springの場合、[`kotlin-spring`コンパイラプラグイン](#spring-support)を使用できます。
>
{style="note"}

## Gradle

`build.gradle(.kts)`ファイルにプラグインを追加します。

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

次に、クラスを`open`にするアノテーションのリストを指定します。

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

クラス（またはそのいずれかのスーパークラス）に`com.my.Annotation`が付与されている場合、クラス自体と全てのメンバーが`open`になります。

これはメタアノテーションでも機能します。

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // will be all-open
```

`MyFrameworkAnnotation`にはall-openメタアノテーション`com.my.Annotation`が付与されており、そのためそれ自体もall-openアノテーションになります。

## Maven

`pom.xml`ファイルにプラグインを追加します。

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

all-openアノテーションがどのように機能するかについての詳細は、[Gradleセクション](#gradle)を参照してください。

## Springサポート

Springを使用している場合、Springアノテーションを手動で指定する代わりに、`kotlin-spring`コンパイラプラグインを有効にできます。`kotlin-spring`は`all-open`のラッパーであり、全く同じように動作します。

`build.gradle(.kts)`ファイルに`spring`プラグインを追加します。

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

Mavenでは、`spring`プラグインは`kotlin-maven-allopen`プラグインの依存関係によって提供されます。そのため、`pom.xml`ファイルで有効にするには、以下のように記述します。

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

このプラグインは以下のAノテーションを指定します。
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

メタアノテーションのサポートにより、[`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html)、
[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html)、
[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html)、
[`@Service`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html)、
[`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)
が付与されたクラスは、これらのアノテーションに[`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)がメタアノテーションとして付与されているため、自動的に`open`になります。

もちろん、同じプロジェクトで`kotlin-allopen`と`kotlin-spring`の両方を使用できます。

> [start.spring.io](https://start.spring.io/#!language=kotlin)サービスでプロジェクトテンプレートを生成する場合、`kotlin-spring`プラグインはデフォルトで有効になります。
>
{style="note"}

## コマンドラインコンパイラ

All-openコンパイラプラグインのJARは、Kotlinコンパイラのバイナリ配布版で利用可能です。`-Xplugin` kotlincオプションを使用してJARファイルへのパスを提供することで、プラグインをアタッチできます。

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

`annotation`プラグインオプションを使用してall-openアノテーションを直接指定するか、_プリセット_を有効にできます。

```bash
# プラグインオプションの形式は "-P plugin:<plugin id>:<key>=<value>" です。
# オプションは繰り返し指定できます。

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

`all-open`プラグインで利用可能なプリセットは、`spring`、`micronaut`、`quarkus`です。