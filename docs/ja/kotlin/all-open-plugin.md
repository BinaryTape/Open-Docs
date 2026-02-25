[//]: # (title: All-openコンパイラプラグイン)

Kotlinではクラスとそのメンバはデフォルトで`final`です。そのため、クラスを`open`にする必要があるSpring AOPなどのフレームワークやライブラリを使用する際に不便です。`all-open`コンパイラプラグインは、Kotlinをこれらのフレームワークの要件に適応させ、特定のアノテーションが付与されたクラスとそのメンバを、明示的な`open`キーワードなしでオープン（open）にします。

例えば、Springを使用する場合、すべてのクラスをオープンにする必要はなく、`@Configuration`や`@Service`のような特定のアノテーションが付与されたクラスのみを対象としたい場合があります。`all-open`プラグインでは、そのようなアノテーションを指定できます。

Kotlinは、GradleとMavenの両方で、完全なIDE統合を備えた`all-open`プラグインのサポートを提供しています。

> Springの場合は、[`kotlin-spring`コンパイラプラグイン](#spring-support)を使用できます。
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

次に、クラスをオープンにするアノテーションのリストを指定します。

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

クラス（またはそのスーパークラスのいずれか）に`com.my.Annotation`が付与されている場合、そのクラス自体とすべてのメンバがオープンになります。

これはメタアノテーション（meta-annotation）でも動作します。

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // all-openになります
```

`MyFrameworkAnnotation`はall-openメタアノテーションである`com.my.Annotation`でアノテートされているため、これもall-openアノテーションになります。

## Maven

`pom.xml`ファイルにプラグインを追加します。

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- Springサポートの場合は "spring" を指定 -->
            <plugin>all-open</plugin>
        </compilerPlugins>

        <pluginOptions>
            <!-- 各アノテーションを個別の行に配置します -->
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

all-openアノテーションの仕組みに関する詳細については、[Gradleセクション](#gradle)を参照してください。

## Springサポート

Springを使用している場合は、Springのアノテーションを手動で指定する代わりに、`kotlin-spring`コンパイラプラグインを有効にできます。`kotlin-spring`は`all-open`の上に構築されたラッパー（wrapper）であり、全く同じように動作します。

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

Mavenでは、`spring`プラグインは`kotlin-maven-allopen`プラグインの依存関係によって提供されます。`pom.xml`ファイルで有効にするには以下のように記述します。

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

このプラグインは以下のアノテーションを指定します：
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

メタアノテーションのサポートにより、[`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html)、[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html)、[`@RestController`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html)、[`@Service`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Service.html)、[`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)が付与されたクラスは、これらのアノテーションが[`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)でメタアノテートされているため、自動的にオープンになります。
 
もちろん、同じプロジェクト内で`kotlin-allopen`と`kotlin-spring`の両方を使用することも可能です。

> [start.spring.io](https://start.spring.io/#!language=kotlin)サービスでプロジェクトテンプレートを生成した場合、`kotlin-spring`プラグインはデフォルトで有効になります。
>
{style="note"}

## コマンドラインコンパイラ

All-openコンパイラプラグインのJARは、Kotlinコンパイラのバイナリ配布物に含まれています。`kotlinc`の`-Xplugin`オプションを使用して、JARファイルへのパスを指定することでプラグインを適用できます。

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

`annotation`プラグインオプションを使用してall-openアノテーションを直接指定するか、*プリセット (preset)* を有効にできます。

```bash
# プラグインオプションの形式: "-P plugin:<plugin id>:<key>=<value>"
# オプションは繰り返して指定可能です。

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

`all-open`プラグインで利用可能なプリセットは、`spring`、`micronaut`、および`quarkus`です。