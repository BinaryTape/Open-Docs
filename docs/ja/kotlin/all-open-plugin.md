[//]: # (title: All-openコンパイラプラグイン)

Kotlin のクラスとそのメンバーはデフォルトで`final`であり、クラスが`open`である必要がある Spring AOP のようなフレームワークやライブラリを使用する上で不便です。`all-open`コンパイラプラグインは、そのようなフレームワークの要件に Kotlin を適合させ、特定の アノテーション が付与されたクラスとそのメンバーを、明示的な`open`キーワードなしで`open`にします。

例えば、Spring を使用する場合、すべてのクラスを`open`にする必要はなく、`@Configuration`や`@Service`のような特定の アノテーション が付与されたクラスのみでよいです。`all-open`プラグインを使用すると、そのような アノテーション を指定できます。

Kotlin は、Gradle と Maven の両方で`all-open`プラグインのサポートを、完全なIDE統合とともに提供しています。

> Spring の場合、[`kotlin-spring`コンパイラプラグイン](#spring-support)を使用できます。
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

次に、クラスを`open`にする アノテーション のリストを指定します。

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

クラス (またはそのスーパークラスのいずれか) に`com.my.Annotation`が付けられている場合、クラス自体とそのすべてのメンバーが`open`になります。

これはメタアノテーション (meta-annotations) でも機能します。

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // all-open になります
```

`MyFrameworkAnnotation`には`all-open`メタアノテーションである`com.my.Annotation`が付与されているため、それ自体も`all-open`アノテーションになります。

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

`all-open`アノテーションの動作に関する詳細については、[Gradle セクション](#gradle)を参照してください。

## Spring サポート

Spring を使用している場合、Spring アノテーションを手動で指定する代わりに、`kotlin-spring`コンパイラプラグインを有効にできます。`kotlin-spring`は`all-open`のラッパーであり、まったく同じように動作します。

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

Maven では、`spring`プラグインは`kotlin-maven-allopen`プラグインの依存関係によって提供されます。そのため、`pom.xml`ファイルで有効にするには、以下のように記述します。

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

このプラグインは次の アノテーション を指定します。
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

メタアノテーション (meta-annotations) のサポートにより、[`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)がメタアノテーションとして付与されているため、[`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html)、[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html)、[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html)、[`@Service`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html)、または [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)が付与されたクラスは自動的に`open`になります。

もちろん、同じプロジェクトで`kotlin-allopen`と`kotlin-spring`の両方を使用できます。

> [start.spring.io](https://start.spring.io/#!language=kotlin)サービスでプロジェクトテンプレートを生成する場合、`kotlin-spring`プラグインはデフォルトで有効になります。
>
{style="note"}

## コマンドラインコンパイラ

All-open コンパイラプラグインのJARは、Kotlin コンパイラのバイナリディストリビューションで利用できます。プラグインをアタッチするには、`kotlinc`の`-Xplugin`オプションを使用して、そのJARファイルへのパスを渡します。

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

`annotation`プラグインオプションを使用して`all-open`アノテーションを直接指定することも、_プリセット_を有効にすることもできます。

```bash
# プラグインオプションの形式は "-P plugin:<plugin id>:<key>=<value>" です。
# オプションは繰り返すことができます。

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

`all-open`プラグインで利用可能なプリセットは、`spring`、`micronaut`、`quarkus`です。